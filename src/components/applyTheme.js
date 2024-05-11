const { app, ipcMain } = require('electron');

const fs = require('fs');
const path = require('path');



function applyTheme() {
  const filePath = path.join(app.getPath('userData'), 'settings.json');

  if (!fs.existsSync(filePath)) {
    return;
  }

  const data = fs.readFileSync(filePath, 'utf8');
  const settings = JSON.parse(data);

  ipcMain.on('renderer-ready', (event) => {
    event.sender.send('apply-theme', settings.theme);
  });
}

module.exports = applyTheme;