
const electron = require('electron');
const {app, BrowserWindow, ipcMain, shell } = electron;
const isDev = require('electron-is-dev');

if (isDev) { require('electron-reload')(__dirname) }

let mainWindow;

app.on('ready', () => {

    mainWindow = new BrowserWindow({width: 800, height: 600});

    mainWindow.loadURL(`file://${__dirname}/src/index.html`);

    if (isDev) { mainWindow.webContents.openDevTools(); }


});

ipcMain.on('open', (ev, url) => {
    console.log("main url : " + url);
    shell.openExternal(url);
});
