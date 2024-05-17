const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);
const { Notification, app } = require('electron');

let config;
let downloads = {};

const defaultPath = path.join(os.homedir(), 'Downloads');
const settingsPath = path.join(app.getPath('userData'), 'settings.json');
const historyPath = path.join(app.getPath('userData'), 'history.json');

try {
  config = require(settingsPath);
} catch (error) {
  console.error('Could not load config file, defaulting to Downloads folder', error);
  config = { directoryPath: defaultPath };
}

try {
  fs.watch(settingsPath, (eventType, filename) => {
    if (eventType === 'change') {
      setTimeout(() => {
        try {
          delete require.cache[require.resolve(settingsPath)];
          config = require(settingsPath);
        } catch (error) {
          console.error('Could not load updated config file', error);
          config = { directoryPath: defaultPath };
        }
      }, 1000);
    }
  });
} catch (error) {
  console.error(`File doesnt exist: ${settingsPath}`, error);
}

app.on('ready', () => app.setAppUserModelId(app.name));

showNotification = ($title, $body) => {
  new Notification({
    title: $title,
    body: $body
  }).show()
}


/**
 * A custom Transform stream that tracks the progress of an asynchronous download.
 *
 * @class ProgressStream
 * @extends stream.Transform
 * @param {Function} onProgress - The callback function to be called when progress is updated.
 * @param {number} partSize - The size of each part of the download.
 * @param {string} id - The identifier for the download.
 */
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
    this.speedLimitKb = parseInt(config.speedLimit, 10);
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
// For Ethan's reference, here is the modified ProgressStream class with the speed limit functionality:
//   _transform(chunk, encoding, callback) {
//     this.totalBytes += chunk.length;

//     const elapsedSeconds = Math.max((Date.now() - this.startTime) / 1000, 0.001);
//     const downloadSpeed = this.totalBytes / elapsedSeconds;
//     this.speeds.push(downloadSpeed);
//     if (this.speeds.length > 1000) this.speeds.shift();
//     const n = this.speeds.length;
//     if (n === 1) {
//       this.avgSpeed = downloadSpeed;
//     } else {
//       this.avgSpeed = downloadSpeed / (n - 1) + this.avgSpeed * (1 - 1 / (n - 1));
//     }
//     const remainingBytes = this.partSize - this.totalBytes;
//     const eta = remainingBytes / (this.avgSpeed || 1);
//     this.onProgress(this.totalBytes, this.avgSpeed, elapsedSeconds, eta, this.id);
//     this.push(chunk);

//     // Calculate the delay based on the speed limit and the size of the chunk
//     let delay = 0;
//     if (this.speedLimitKb > 0) {
//       delay = (chunk.length / (this.speedLimitKb * 1024)) * 1000;
//     }

//     // Call the callback function after the delay
//     setTimeout(callback, delay);
//   }
// }


/**
 * Downloads a file from the specified URL.
 *
 * @param {string} url - The URL of the file to download.
 * @param {Function} onProgress - A callback function to track the download progress.
 * @param {string} id - The ID of the download.
 * @param {number} [numShards=4] - The number of file shards to download in parallel.
 * @returns {Promise<void>} - A promise that resolves when the download is complete or rejects on error.
 */
async function downloadFile(url, onProgress, id, resume = false) {
  const numShards = config.threadNumber || 4;
  console.log(`downloadFile called with id: ${id}`);
  try {
    console.log(`Starting download ${id}`);
    console.log(`Speed Limit:  ${config.speedLimit}`);
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
      writeStream.setMaxListeners(64);
      writeStream.on('error', (error) => {
        console.error(`Failed to write to ${tempFilePath}: ${error}`);
      });
      downloads[id].streams.push(writeStream);
      downloads[id].tempFilePaths.push(tempFilePath);

      await pipeline(response.data.pipe(progressStream), writeStream).catch((error) => {
        if (downloads[id] && downloads[id].isCancelled) {
          console.log(`Download ${id} cancelled during shard ${i} download`);
          throw new Error('Download cancelled');
        } else {
          throw error;
        }
      });

      return tempFilePath;
    });
    const tempFilePaths = await Promise.all(promises);

    const downloadFolderPath = config?.directoryPath || path.join(os.homedir(), 'Downloads'); // Use the directory from the config file, or default to the Downloads folder
    const downloadFilePath = path.join(downloadFolderPath, fileName);
    const downloadFileStream = fs.createWriteStream(downloadFilePath);
    downloadFileStream.setMaxListeners(64);
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

      await logDownload(id, url, fileSize, numShards, downloadFilePath, fileName);

      const tempDirectoryPath = path.join(__dirname, 'temp', id.toString());
      try {
        await fs.promises.rm(tempDirectoryPath, { recursive: true });
      } catch (err) {
        console.error(`Failed to delete directory ${tempDirectoryPath}: ${err}`);
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

/**
 * Pauses a download by cancelling ongoing streams, saving the download state, and marking it as paused.
 * @param {number} id - The ID of the download to pause.
 * @returns {Promise<void>} - A promise that resolves once the download is paused.
 */
async function pauseDownload(id) {
  if (downloads[id]) {
    console.log(`Pausing download ${id}`);
    downloads[id].isPaused = true;
    for (const stream of downloads[id].streams) {
      if (stream.writable && !stream.writableEnded) {
        try {
          console.log(`Ending stream for download ${id}`);
          stream.end();
        } catch (error) {

        }
      }
    }
    const response = await axios.head(downloads[id].url);
    const fileSize = parseInt(response.headers['content-length'], 10);
    const fileName = path.basename(downloads[id].url); // derive fileName from url
    const downloadState = {
      id: id,
      fileName: fileName,
      downloadFolderPath: config?.directoryPath || path.join(os.homedir(), 'Downloads'),
      url: downloads[id].url,
      totalBytes: downloads[id].totalDownloadedBytes.reduce((a, b) => a + b, 0),
      fileSize: fileSize,
      numShards: downloads[id].numShards,
      tempFilePaths: downloads[id].tempFilePaths,
      isCancelled: downloads[id].isCancelled,
      totalBytesDownloaded: downloads[id].totalDownloadedBytes,
    };
    const stateFilePath = path.join(__dirname, 'temp', id.toString(), `${id}-state.json`);
    await fs.promises.writeFile(stateFilePath, JSON.stringify(downloadState));
    downloads[id].cancelSource.cancel();
  }
}


/**
 * Resumes a download based on the provided ID.
 *
 * @param {string} id - The ID of the download.
 * @param {Function} onProgress - The callback function to track the progress of the download.
 * @returns {Promise<void>} - A promise that resolves when the download is complete.
 * @throws {Error} - If no saved state file is found for the download.
 */
async function resumeDownload(id, onProgress) {
  id = id.toString();
  const stateFilePath = path.join(__dirname, 'temp', id, `${id}-state.json`);
  if (!fs.existsSync(stateFilePath)) {
    throw new Error(`No saved state file found for download ${id}`);
  }

  const downloadState = JSON.parse(await fs.promises.readFile(stateFilePath, 'utf-8'));

  const { url, fileSize, numShards, totalBytesDownloaded } = downloadState;
  const partSize = Math.floor(fileSize / numShards);
  const lastPartSize = fileSize - partSize * (numShards - 1);
  const fileName = path.basename(url);
  const totalDownloadedBytes = [...totalBytesDownloaded];
  const totalSpeeds = Array(numShards).fill(0);

  const promises = Array.from({ length: numShards }, async (_, i) => {
    const start = i * partSize + (totalDownloadedBytes[i] || 0);
    const end = i === numShards - 1 ? fileSize - 1 : (i + 1) * partSize - 1;
    console.log(`Shard ${i}: start = ${start}, end = ${end}`);

    if (start >= end) {
      console.error(`Invalid byte range: start (${start}) is greater than or equal to end (${end})`);
      return;
    }

    if (end >= fileSize) {
      console.error(`Invalid byte range: end (${end}) is greater than or equal to fileSize (${fileSize})`);
      end = fileSize - 1;
    }

    const response = await axios.get(url, {
      headers: { range: `bytes=${start}-${end}` },
      responseType: 'stream',
    });

    const currentPartSize = i === numShards - 1 ? lastPartSize : partSize;
    let previousDownloadedBytes = 0;
    
    const progressStream = new ProgressStream((downloadedBytes, shardDownloadSpeed, elapsedSeconds, shardEta) => {
      const deltaDownloadedBytes = downloadedBytes - previousDownloadedBytes;
      totalDownloadedBytes[i] += deltaDownloadedBytes;
      previousDownloadedBytes = downloadedBytes;
    
      const downloadSpeedMBps = Math.round((shardDownloadSpeed / (1024 * 1024)) * 10) / 10;
      totalSpeeds[i] = downloadSpeedMBps;
      const totalDownloaded = totalDownloadedBytes.reduce((a, b) => a + b, 0);
      const percentCompleted = Math.round((totalDownloaded * 100) / fileSize);
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
    
    progressStream.on('end', () => {
      onProgress({
        id,
        shardIndex: i,
        progress: 100,
        fileName,
        fileSize,
        speed: 0,
        eta: 0,
      });
    });

    const writer = fs.createWriteStream(path.join(__dirname, 'temp', id, `shard-${i}`), { flags: 'a' });
    writer.setMaxListeners(64);

    response.data.pipe(progressStream).pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  });

  await Promise.all(promises);

  const downloadFolderPath = config?.directoryPath || path.join(os.homedir(), 'Downloads');
  const downloadFilePath = path.join(downloadFolderPath, path.basename(url));
  const downloadFileStream = fs.createWriteStream(downloadFilePath);
  downloadFileStream.setMaxListeners(64);

  for (let i = 0; i < numShards; i++) {
    const tempFilePath = path.join(__dirname, 'temp', id, `shard-${i}`);
    const tempFileStream = fs.createReadStream(tempFilePath);

    await new Promise((resolve, reject) => {
      pipeline(tempFileStream, downloadFileStream, { end: false })
        .then(() => {
          console.log(`Shard ${i} written to final file for download ${id}`);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
      downloadFileStream.on('finish', resolve);
    });
  }

  downloadFileStream.end();

  await new Promise((resolve) => downloadFileStream.on('finish', () => {
    console.log('Final file written');
    showNotification('Download Complete', path.basename(url) + ' has been downloaded.');
    resolve();
  }));

  await logDownload(id, url, fileSize, numShards, downloadFilePath, fileName);

  const tempDirectoryPath = path.join(__dirname, 'temp', id.toString());
  try {
    await fs.promises.rm(tempDirectoryPath, { recursive: true });
  } catch (err) {
    console.error(`Failed to delete directory ${tempDirectoryPath}: ${err}`);
  }
}

/**
 * Cancels a download by the given ID.
 * @param {string} id - The ID of the download to cancel.
 * @returns {Promise<void>} - A promise that resolves once the download is cancelled.
 */
async function cancelDownload(id) {
  if (downloads[id]) {
    downloads[id].isCancelled = true;
    console.log(`Cancelling download ${id}`);
    for (const stream of downloads[id].streams) {
      if (stream.writableEnded === false) {
        stream.end();
      }
    }
    try {
      downloads[id].cancelSource.cancel();
    } catch (err) {

    }
    delete downloads[id];

    const tempDirectoryPath = path.join(__dirname, 'temp', id.toString());
    try {
      await fs.promises.rm(tempDirectoryPath, { recursive: true });
    } catch (err) {

    }
  }
}

/**
 * Logs a download to the history file.
 *
 * @param {string} id - The ID of the download.
 * @param {string} url - The URL of the downloaded file.
 * @param {number} fileSize - The size of the downloaded file in bytes.
 * @param {number} numShards - The number of shards used for the download.
 * @param {string} finalFilePath - The final file path of the downloaded file.
 * @param {string} fileName - The name of the downloaded file.
 * @returns {Promise<void>} - A promise that resolves when the download is logged.
 */
async function logDownload(id, url, fileSize, numShards, finalFilePath, fileName) {
  let history;

  try {
    history = require(historyPath);
  } catch (error) {
    console.error('Could not load history file', error);
    history = [];
  }

  const downloadLog = {
    id,
    url,
    fileName,
    fileSize,
    dateTime: new Date().toISOString(),
    numShards,
    finalFilePath
  };

  history.push(downloadLog);

  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2), 'utf8');
}

module.exports = { downloadFile, cancelDownload, pauseDownload, resumeDownload };