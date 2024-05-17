/**
 * This module exposes Electron APIs to the renderer process using contextBridge.
 * @module preload
 */

const { contextBridge, ipcRenderer, shell } = require('electron');

const listeners = new Map();

/**
 * Exposes Electron APIs to the renderer process using contextBridge.
 * @namespace electron
 */
contextBridge.exposeInMainWorld(
  'electron',
  {

    /**
     * Opens the specified path in the default file manager.
     * @param {string} path - The path to open.
     */
    openPath: (path) => {
      return ipcRenderer.send('open-path', path);
    },

    /**
     * Sends a message to the main process to save settings.
     * @param {object} settings - The settings to be saved.
     */
    saveSettings: (settings) => {
      ipcRenderer.send('save-settings', settings);
    },

    /**
     * Sends a message to the main process to get settings.
     * @returns {Promise<object>} A promise that resolves to an object containing the current settings.
     */
    getSettings: async () => {
      return ipcRenderer.invoke('get-settings');
    },

    /**
     * Sends a message to the main process to get history.
     * @returns {Promise<Array>} A promise that resolves to an array of download history.
     */
    getHistory: async () => {
      return ipcRenderer.invoke('get-history');
    },

    /**
     * Sends a message to the main process to clear the history file.
     */
    clearHistory: async () => {
      return ipcRenderer.invoke('clear-history');
    },

    /**
     * Sends a message to the main process to get paused downloads.
     * @returns {Promise<Array>} A promise that resolves to an array of paused downloads.
     */
    getPausedDownloads: async () => {
      return ipcRenderer.invoke('get-paused-downloads');
    },

    /**
     * Sends a message to the main process to start a download.
     * @param {string} url - The URL of the file to download.
     * @param {number} id - The unique identifier for the download.
     */
    startDownload: (url, id) => {
      console.log(`startDownload called with id: ${id}`);
      ipcRenderer.send('start-download', url, id);
    },

    /**
     * Sends a message to the main process to pause a download.
     * @param {number} id - The unique identifier for the download.
     */
    pauseDownload: (id) => {
      console.log(`pauseDownload called with id: ${id}`);
      ipcRenderer.send('pause-download', id);
    },

    /**
     * Sends a message to the main process to resume a download.
     * @param {number} id - The unique identifier for the download.
     */
    resumeDownload: (id) => {
      console.log(`resumeDownload called with id: ${id}`);
      ipcRenderer.send('resume-download', id);
    },

    /**
     * Sends a message to the main process to cancel a download.
     * @param {number} id - The unique identifier for the download.
     */
    cancelDownload: (id) => {
      console.log(`cancelDownload called with id: ${id}`);
      ipcRenderer.send('cancel-download', id);
    },

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