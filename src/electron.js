const { app, BrowserWindow, ipcMain } = require('electron');
const { downloadFile, cancelDownload } = require('./downloadManager');
const path = require('path');
const url = require('url');

/**
 * Creates the main window for the Electron application.
 */
function createWindow() {
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true,
  });

  const win = new BrowserWindow({
    width: 800,
    height: 500,
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

/**
 * Listens for the 'start-download' event and initiates the file download.
 * @param {object} event - The event object.
 * @param {string} url - The URL of the file to be downloaded.
 * @param {string} id - The ID of the download.
 */
ipcMain.on('start-download', (event, url, id) => {
  downloadFile(url, (downloadInfo) => {
    event.sender.send('download-progress', { ...downloadInfo, id });
  }, id);
});

ipcMain.on('cancel-download', (event, id) => {
  cancelDownload(id);
});