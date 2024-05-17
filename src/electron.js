const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { downloadFile, setDownloadPath, cancelDownload, pauseDownload, resumeDownload } = require('./downloadManager');
const loadPausedDownloads = require('./startup');
const path = require('path');
const fs = require('fs');
const os = require('os');
const url = require('url');

const settingsPath = path.join(app.getPath('userData'), 'settings.json');
const historyPath = path.join(app.getPath('userData'), 'history.json');
const tempPath = './src/temp';

//Disable hardware acceleration to prevent rendering issues
app.disableHardwareAcceleration();

function createWindow() {
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true,
  });

  const win = new BrowserWindow({
    width: 800,
    height: 500,
    icon: path.join(__dirname, '../public/favicon.ico'),
    resizable: false,
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  win.loadURL(startUrl);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath);
    console.log(`Folder ${tempPath} created successfully.`);
  } else {
    console.log(`Folder ${tempPath} already exists. Skipping.`);
  }

}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


app.on('ready', () => {
  ipcMain.emit('create-history');
  fs.readFile(settingsPath, 'utf8', (err, data) => {
    if (err || data.length === 0) {
      ipcMain.emit('save-settings', null, {
        directoryPath: path.join(os.homedir(), 'Downloads'),
        theme: 'Follow System',
        threadNumber: '4',
        color: "#0D6EFD",
        speedLimit: "0"
      });
    }
  });
});

/**
 * Listens for the 'start-download' event and initiates the file download.
 * @param {object} event - The event object.
 * @param {string} url - The URL of the file to be downloaded.
 * @param {string} id - The ID of the download.
 */
ipcMain.on('start-download', (event, url, id, resume) => {
  fs.readFile(settingsPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading settings file', err);
      return;
    }
    const settings = JSON.parse(data);
    const speedLimitKb = settings.speedLimit;

    if (resume) {
      resumeDownload(id, (downloadInfo) => {
        event.sender.send('download-progress', { ...downloadInfo, id });
      }, speedLimitKb);
    } else {
      downloadFile(url, (downloadInfo) => {
        event.sender.send('download-progress', { ...downloadInfo, id });
      }, id, speedLimitKb);
    }
  });
});

/**
 * Listens for the 'cancel-download' event and cancels the file download.
 * @param {object} event - The event object.
 * @param {string} id - The ID of the download to be cancelled.
 */
ipcMain.on('cancel-download', (event, id) => {
  cancelDownload(id);
});

/**
 * Listens for the 'pause-download' event and pauses the file download.
 * @param {object} event - The event object.
 * @param {string} id - The ID of the download to be paused.
 */
ipcMain.on('pause-download', (event, id) => {
  pauseDownload(id);
});

/**
 * Listens for the 'resume-download' event and resumes the paused file download.
 * @param {object} event - The event object.
 * @param {string} id - The ID of the download to be resumed.
 */
ipcMain.on('resume-download', (event, id) => {
  resumeDownload(id, (downloadInfo) => {
    event.sender.send('download-progress', { ...downloadInfo, id });
  });
});

/**
 * Listens for the 'open-path' event and opens the directory in the file system.
 * @param {object} event - The event object.
 * @param {string} path - The path to the directory.
 */
ipcMain.on('open-path', (event, path) => {
  shell.openPath(path);
});

/**
 * Listens for the 'save-settings' event and saves the new settings.
 * @param {object} event - The event object.
 * @param {object} newSettings - The new settings to be saved.

 * Default settings for the download manager.
 * @typedef {Object} DefaultSettings
 * @property {string} directoryPath - The default directory path for downloads.
 * @property {string} theme - The default theme for the download manager.
 * @property {string} threadNumber - The default number of threads for downloading.
 */

ipcMain.on('save-settings', (event, newSettings) => {
  const defaultSettings = {
    directoryPath: path.join(os.homedir(), 'Downloads'),
    theme: 'Follow System',
    threadNumber: '4',
  };

  if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify({ ...defaultSettings, ...newSettings }, null, 2), 'utf8');
    console.log('Settings file created successfully');
    return;
  }

  fs.readFile(settingsPath, (err, data) => {
    if (err) {
      console.error('Error reading settings file', err);
      return;
    }

    const existingSettings = JSON.parse(data);
    const settings = { ...existingSettings, ...newSettings };

    fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), (err) => {
      if (err) {
        console.error('Error writing settings file', err);
      } else {
        console.log('Settings saved successfully');
      }
    });
  });
});

/**
 * Handles the 'get-paused-downloads' event and returns the paused downloads.
 * @returns {Promise<Array>} A promise that resolves to an array of paused downloads.
 */
ipcMain.handle('get-paused-downloads', async () => {
  return loadPausedDownloads();
});

/**
 * Handles the 'get-settings' event and returns the current settings.
 * @returns {Promise<object>} A promise that resolves to an object containing the current settings.
 */
ipcMain.handle('get-settings', async () => {
  if (!fs.existsSync(settingsPath)) {
    return {
      directoryPath: path.join(os.homedir(), 'Downloads'),
      theme: 'Follow System',
      threadNumber: '4',
    };
  }

  const data = fs.readFileSync(settingsPath, 'utf8');
  const settings = JSON.parse(data);

  return settings;
});

/**
 * Listens for the 'create-history' event and generates a new history file if one doesnt exist.
 * @param {object} event - The event object.
 */
ipcMain.handle('clear-history', (event) => {
  if (fs.existsSync(historyPath)) {
    fs.writeFileSync(historyPath, JSON.stringify([], null, 2), 'utf8');
    console.log('History file cleared successfully');
  } else {
    console.log('History file does not exist');
  }
});

/**
 * Listens for the 'clear-history' event and clears the existing history file if one exists.
 * @param {object} event - The event object.
 */
ipcMain.on('clear-history', (event) => {
  fs.writeFileSync(historyPath, JSON.stringify([], null, 2), 'utf8');
  console.log('History file cleared successfully');
});

/**
 * Handles the 'get-history' event and returns the current history.
 * @returns {Promise<object>} A promise that resolves to an object containing the current history.
 */
ipcMain.handle('get-history', async () => {
  if (!fs.existsSync(historyPath)) {
    return [];
  }

  const data = fs.readFileSync(historyPath, 'utf8');
  const history = JSON.parse(data);

  return history;
});

//Don't delete this yet, we will use it later on Follow System theme
ipcMain.on('apply-theme', (event, theme) => {
  switch (theme) {
    case 'Follow System':
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('bootstrap-dark');
        document.body.classList.remove('bootstrap');
      } else {
        document.body.classList.add('bootstrap');
        document.body.classList.remove('bootstrap-dark');
      }
      break;
    case 'Light':
      document.body.classList.add('bootstrap');
      document.body.classList.remove('bootstrap-dark');
      break;
    case 'Dark':
      document.body.classList.add('bootstrap-dark');
      document.body.classList.remove('bootstrap');
      break;
  }
});