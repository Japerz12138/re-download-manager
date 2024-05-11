const { app, BrowserWindow, ipcMain } = require('electron');
const { downloadFile, setDownloadPath, cancelDownload, pauseDownload, resumeDownload } = require('./downloadManager');
const path = require('path');
const fs = require('fs');
const os = require('os');
const url = require('url');

const filePath = path.join(app.getPath('userData'), 'settings.json');
const tempPath = './src/temp';

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
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err || data.length === 0) {
      ipcMain.emit('save-settings', null, { directoryPath: path.join(os.homedir(), 'Downloads') });
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
  downloadFile(url, (downloadInfo) => {
    event.sender.send('download-progress', { ...downloadInfo, id });
  }, id, resume);
});

ipcMain.on('cancel-download', (event, id) => {
  cancelDownload(id);
});

ipcMain.on('pause-download', (event, id) => {
  pauseDownload(id);
});

ipcMain.on('resume-download', (event, id) => {
  resumeDownload(id);
});


ipcMain.on('save-settings', (event, newSettings) => {
  const filePath = path.join(app.getPath('userData'), 'settings.json');

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(newSettings, null, 2), 'utf8');
    console.log('Settings file created successfully');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Error reading settings file', err);
      return;
    }

    const existingSettings = JSON.parse(data);
    const settings = { ...existingSettings, ...newSettings };

    fs.writeFile(filePath, JSON.stringify(settings, null, 2), (err) => {
      if (err) {
        console.error('Error writing settings file', err);
      } else {
        console.log('Settings saved successfully');
      }
    });
  });
});

ipcMain.handle('get-settings', async () => {
  const filePath = path.join(app.getPath('userData'), 'settings.json');

  if (!fs.existsSync(filePath)) {
    return { directoryPath: path.join(os.homedir(), 'Downloads') };
  }

  const data = fs.readFileSync(filePath, 'utf8');
  const settings = JSON.parse(data);

  return settings;
});