/**
 * This module exposes Electron APIs to the renderer process using contextBridge.
 * @module preload
 */

const { contextBridge, ipcRenderer } = require('electron');

const listeners = new Map();

contextBridge.exposeInMainWorld(
  'electron',
  {
    /**
     * Sends a message to the main process to start a download.
     * @param {string} url - The URL of the file to download.
     * @param {number} id - The unique identifier for the download.
     */
    startDownload: (url, id) => ipcRenderer.send('start-download', url, id),

    /**
     * Registers a callback function to be called when download progress is received for a specific download.
     * @param {number} id - The unique identifier for the download.
     * @param {function} callback - The callback function to be called when download progress is received.
     */
    onDownloadProgress: (id, callback) => {
      const listener = (event, downloadInfo) => {
        if (downloadInfo.id === id) {
          callback(downloadInfo);
        }
      };
      listeners.set(id, listener);
      ipcRenderer.on('download-progress', listener);
    },

    /**
     * Unregisters the download progress listener for a specific download.
     * @param {number} id - The unique identifier for the download.
     */
    offDownloadProgress: (id) => {
      const listener = listeners.get(id);
      if (listener) {
        ipcRenderer.removeListener('download-progress', listener);
        listeners.delete(id);
      }
    }
  }
);