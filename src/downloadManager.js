const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);
const { Notification, app } = require('electron');


app.on('ready', () => app.setAppUserModelId(app.name));

class ProgressStream extends stream.Transform {
  constructor(onProgress, partSize, id) {
    super();
    this.onProgress = onProgress;
    this.partSize = partSize;
    this.id = id;
    this.totalBytes = 0;
    this.startTime = Date.now();
    this.speeds = [];
    this.avgSpeed = 0;
  }

  _transform(chunk, encoding, callback) {

    this.totalBytes += chunk.length;

    const elapsedSeconds = Math.max((Date.now() - this.startTime) / 1000, 0.001);
    const downloadSpeed = this.totalBytes / elapsedSeconds;
    this.speeds.push(downloadSpeed);
    if (this.speeds.length > 1000) this.speeds.shift();
    const n = this.speeds.length;
    if (n === 1) {
      this.avgSpeed = downloadSpeed;
    } else {
      this.avgSpeed = downloadSpeed / (n - 1) + this.avgSpeed * (1 - 1 / (n - 1));
    }
    const remainingBytes = this.partSize - this.totalBytes;
    const eta = remainingBytes / (this.avgSpeed || 1);
    this.onProgress(this.totalBytes, this.avgSpeed, elapsedSeconds, eta, this.id);
    this.push(chunk);
    callback();
  }
}

let downloads = {};

/**
 * Downloads a file from the specified URL.
 *
 * @param {string} url - The URL of the file to download.
 * @param {Function} onProgress - A callback function to track the download progress.
 * @param {string} id - The ID of the download.
 * @param {number} [numShards=4] - The number of file shards to download in parallel.
 * @returns {Promise<void>} - A promise that resolves when the download is complete or rejects on error.
 */
async function downloadFile(url, onProgress, id, numShards = 4, resume = false) {
  console.log(`downloadFile called with id: ${id}`);
  try {
    console.log(`Starting download ${id}`);
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    let fileSize, partSize, lastPartSize, fileName, totalDownloadedBytes, totalSpeeds;
    const stateFilePath = path.join(__dirname, 'temp', `${id}-state.json`);
    if (fs.existsSync(stateFilePath)) {
      console.log(`Resuming download ${id}`);
      const downloadState = JSON.parse(await fs.promises.readFile(stateFilePath));
      fileSize = downloadState.fileSize;
      partSize = Math.floor(fileSize / numShards);
      lastPartSize = fileSize - partSize * (numShards - 1);
      fileName = path.basename(downloadState.url);
      totalDownloadedBytes = Array(numShards).fill(downloadState.totalBytes);
      totalSpeeds = Array(numShards).fill(0);
    } else {
      console.log(`Starting new download ${id}`);
      const response = await axios.head(url);
      fileSize = parseInt(response.headers['content-length']);
      partSize = Math.floor(fileSize / numShards);
      lastPartSize = fileSize - partSize * (numShards - 1);
      fileName = path.basename(url);
      totalDownloadedBytes = Array(numShards).fill(0);
      totalSpeeds = Array(numShards).fill(0);
    }

    downloads[id] = { 
      streams: [], 
      tempFilePaths: [], 
      numShards: numShards,
      url: url,
      cancelSource: source, 
      isCancelled: false, 
      totalDownloadedBytes: totalDownloadedBytes 
    };

    const promises = Array.from({ length: numShards }, async (_, i) => {
      const start = i * partSize;
      const end = i === numShards - 1 ? fileSize : start + partSize - 1;
      const currentPartSize = i === numShards - 1 ? lastPartSize : partSize;
      const tempFilePath = path.join(__dirname, 'temp', id.toString(), `shard-${i}`);
      fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });

      await new Promise(resolve => setTimeout(resolve, i * 10));

      const response = await axios.get(url, {
        headers: { range: `bytes=${start}-${end}` },
        responseType: 'stream',
        cancelToken: source.token,
      });

      const progressStream = new ProgressStream((downloadedBytes, shardDownloadSpeed, elapsedSeconds, shardEta) => {
        const percentCompleted = Math.round((downloadedBytes * 100) / currentPartSize);
        const downloadSpeedMBps = Math.round((shardDownloadSpeed / (1024 * 1024)) * 10) / 10;
        totalDownloadedBytes[i] = downloadedBytes;
        totalSpeeds[i] = downloadSpeedMBps;
        const totalDownloaded = totalDownloadedBytes.reduce((a, b) => a + b, 0);
        const totalSpeed = totalSpeeds.reduce((a, b) => a + b, 0);
        const remainingBytes = fileSize - totalDownloaded;
        const eta = remainingBytes / ((totalSpeed * 1024 * 1024) || 1);
        onProgress({
          id,
          shardIndex: i,
          progress: percentCompleted,
          fileName,
          fileSize,
          speed: Math.round(totalSpeed * 10) / 10,
          eta: Math.round(eta),
        });
      }, currentPartSize, id);

      const writeStream = fs.createWriteStream(tempFilePath);
      downloads[id].streams.push(writeStream);
      downloads[id].tempFilePaths.push(tempFilePath);

      await pipeline(response.data.pipe(progressStream), writeStream).catch((error) => {
        if (downloads[id].isCancelled) {
          console.log(`Download ${id} cancelled during shard ${i} download`);
          throw new Error('Download cancelled');
        } else {
          throw error;
        }
      });

      return tempFilePath;
    });
    const tempFilePaths = await Promise.all(promises);

    const downloadFolderPath = path.join(os.homedir(), 'Downloads');
    const downloadFilePath = path.join(downloadFolderPath, fileName);
    const downloadFileStream = fs.createWriteStream(downloadFilePath);
    downloads[id].streams.push(downloadFileStream);

    for (const [i, tempFilePath] of tempFilePaths.entries()) {
      console.log(`Processing shard ${i} for download ${id}`);
      const tempFileStream = fs.createReadStream(tempFilePath);
      downloads[id].streams.push(tempFileStream);

      await new Promise((resolve, reject) => {
        pipeline(tempFileStream, downloadFileStream, { end: false })
          .then(() => {
            if (!downloads[id].isCancelled) {
              console.log(`Shard ${i} written to final file for download ${id}`);
              resolve();
            } else {
              console.log(`Download ${id} cancelled before writing shard ${i} to final file`);
              reject(new Error('Download cancelled'));
            }
          })
          .catch((error) => {
            if (downloads[id].isCancelled) {
              console.log(`Download ${id} cancelled while writing shard ${i} to final file`);
              reject(new Error('Download cancelled'));
            } else {
              reject(error);
            }
          });
        downloadFileStream.on('finish', resolve);
      });
    }

    if (!downloads[id].isCancelled) {
      console.log(`Writing final file for download ${id}`);
      downloadFileStream.end();

      await new Promise((resolve) => downloadFileStream.on('finish', () => {
        console.log('Final file written');
        showNotification('Donwload Complete', fileName + ' has been downloaded.');
        resolve();
      }));

      for (const tempFilePath of tempFilePaths) {
        console.log(`Deleting temporary file ${tempFilePath} for download ${id}`);
        try {
          await fs.promises.unlink(tempFilePath);
        } catch (err) {
          console.error(`Failed to delete file ${tempFilePath}: ${err}`);
        }
      }

      console.log(`Deleting download ${id} from downloads object`);
      delete downloads[id];
    } else {
      console.log(`Download ${id} cancelled before writing final file`);
    }

    await new Promise((resolve) => downloadFileStream.on('finish', () => {
      console.log('Final file written');
      showNotification('Donwload Complete', fileName + ' has been downloaded.');
      resolve();
    }));

  } catch (error) {
    console.error('Failed to download file:', error);
  }
}

showNotification = ($title, $body) => {
  new Notification({
    title: $title,
    body: $body
  }).show()
}

async function pauseDownload(id) {
  if (downloads[id]) {
    console.log(`Pausing download ${id}`);
    downloads[id].isPaused = true;
    for (const stream of downloads[id].streams) {
      if (stream.writable && !stream.writableEnded) {
        console.log(`Ending stream for download ${id}`);
        stream.end();
      }
    }
    const downloadState = {
      url: downloads[id].url,
      totalBytes: downloads[id].totalDownloadedBytes.reduce((a, b) => a + b, 0),
      fileSize: downloads[id].fileSize,
      numShards: downloads[id].numShards,
      tempFilePaths: downloads[id].tempFilePaths,
      isCancelled: downloads[id].isCancelled,
    };
    const stateFilePath = path.join(__dirname, 'temp', `${id}-state.json`);
    await fs.promises.writeFile(stateFilePath, JSON.stringify(downloadState));
    console.log(`Download ${id} paused`);
    downloads[id].cancelSource.cancel(); 
  }
}

async function cancelDownload(id) {
  if (downloads[id]) {
    console.log(`Cancelling download ${id}`);
    downloads[id].isCancelled = true;
    for (const stream of downloads[id].streams) {
      if (stream.writableEnded === false) {
        console.log(`Ending stream for download ${id}`);
        stream.end();
      }
    }
    for (const tempFilePath of downloads[id].tempFilePaths) {
      console.log(`Deleting temporary file ${tempFilePath} for download ${id}`);
      if (tempFilePath.includes(id)) {
        await fs.promises.unlink(tempFilePath).catch(() => { });
      }
    }
    const stateFilePath = path.join(__dirname, 'temp', `${id}-state.json`);
    if (fs.existsSync(stateFilePath)) {
      await fs.promises.unlink(stateFilePath).catch(() => { });
    }
    console.log(`Cancelling axios request for download ${id}`);
    downloads[id].cancelSource.cancel();
    console.log(`Deleting download ${id} from downloads object`);
    delete downloads[id];
  }
}

module.exports = { downloadFile, cancelDownload, pauseDownload };