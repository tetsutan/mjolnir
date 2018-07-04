
const electron = require('electron');
const {app, BrowserWindow, ipcMain, shell } = electron;
const isDev = require('electron-is-dev');

if (isDev) { require('electron-reload')(__dirname) }

let mainWindow;

app.on('ready', () => {

    mainWindow = new BrowserWindow({width: 800, height: 600});

    mainWindow.loadURL(`file://${__dirname}/src/index.html`);

    if (isDev) { mainWindow.webContents.openDevTools(); }

    mainWindow.on('close', (e) => {
        if (mainWindow) {
            e.preventDefault();
            mainWindow.webContents.send('app-close');
        }
    });

});


ipcMain.on('open', (ev, url) => {
    shell.openExternal(url);
});

ipcMain.on('closed', e => {

    if(mainWindow) {
        let w = mainWindow;
        mainWindow = null;
        w.close();
    }

    // if (process.platform !== 'darwin') {
        app.quit();
    // }
});

ipcMain.on('openBackground', (ev, url) => {
    shell.openExternal(url, {activate: false});
});

