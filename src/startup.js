const fs = require('fs').promises;
const path = require('path');

/**
 * Loads the paused downloads from the temporary directory.
 * @returns {Promise<Array<Object>>} An array of download states.
 */
async function loadPausedDownloads() {
  const tempDir = path.join(__dirname, 'temp');
  const subdirs = await fs.readdir(tempDir);
  const downloadStates = [];
  for (const subdir of subdirs) {
    const subdirPath = path.join(tempDir, subdir);
    const files = await fs.readdir(subdirPath);
    for (const file of files) {
      if (path.extname(file) === '.json') {
        const filePath = path.join(subdirPath, file);
        const json = await fs.readFile(filePath, 'utf-8');
        const downloadState = JSON.parse(json);
        downloadStates.push(downloadState);
      }
    }
  }
  return downloadStates;
}

module.exports = loadPausedDownloads;