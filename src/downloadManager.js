const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

/**
 * Downloads a file from the specified URL and saves it to the local disk.
 * 
 * @param {string} url - The URL of the file to download.
 * @param {Function} onProgress - A callback function to track the download progress.
 * @param {string} id - The ID of the download.
 * @param {number} [numShards=4] - The number of shards to split the file into for parallel downloading.
 * @returns {Promise<void>} - A promise that resolves when the file download is complete.
 * @throws {Error} - If the file download fails.
 */

class ProgressStream extends stream.Transform {
  constructor(onProgress, partSize) {
    super();
    this.onProgress = onProgress;
    this.partSize = partSize;
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

async function downloadFile(url, onProgress, id, numShards = 4) {
  try {
    const response = await axios.head(url);
    const fileSize = parseInt(response.headers['content-length']);
    const partSize = Math.floor(fileSize / numShards);
    const lastPartSize = fileSize - partSize * (numShards - 1);
    const fileName = path.basename(url);

    let totalDownloadedBytes = Array(numShards).fill(0);
    let totalSpeeds = Array(numShards).fill(0);

    const promises = Array.from({ length: numShards }, async (_, i) => {
      const start = i * partSize;
      const end = i === numShards - 1 ? fileSize : start + partSize - 1;
      const currentPartSize = i === numShards - 1 ? lastPartSize : partSize;
      const tempFilePath = path.join(__dirname, 'temp', `shard-${i}`);

      await new Promise(resolve => setTimeout(resolve, i * 10));

      const response = await axios.get(url, {
        headers: { range: `bytes=${start}-${end}` },
        responseType: 'stream',
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
      }, currentPartSize);

      await pipeline(response.data.pipe(progressStream), fs.createWriteStream(tempFilePath));

      return tempFilePath;
    });
    const tempFilePaths = await Promise.all(promises);

    // const downloadFilePath = path.join(__dirname, 'downloads', fileName);
    // const downloadFileStream = fs.createWriteStream(downloadFilePath);
    const downloadFolderPath = path.join(os.homedir(), 'Downloads');
    const downloadFilePath = path.join(downloadFolderPath, fileName);
    const downloadFileStream = fs.createWriteStream(downloadFilePath);


    for (const [i, tempFilePath] of tempFilePaths.entries()) {
      const tempFileStream = fs.createReadStream(tempFilePath);

      await new Promise((resolve, reject) => {
        pipeline(tempFileStream, downloadFileStream, { end: false })
          .then(() => {
            console.log(`Shard ${i} written to final file`);
            resolve();
          })
          .catch((error) => reject(error));
        downloadFileStream.on('finish', resolve);
      });
    }

    downloadFileStream.end();


    await new Promise((resolve) => downloadFileStream.on('finish', () => {
      console.log('Final file written');
      resolve();
    }));

    for (const tempFilePath of tempFilePaths) {
      await fs.promises.unlink(tempFilePath);
    }
  } catch (error) {
    console.error('Failed to download file:', error);
  }
}

module.exports = { downloadFile };