
const electron = require('electron');
const {app, BrowserWindow, ipcMain, shell, Menu} = electron;
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

    const template = [{
        label: "Application",
        submenu: [
            { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]}, {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]}
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));

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

