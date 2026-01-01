const { app, BrowserWindow, ipcMain, desktopCapturer, screen, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const { setupRemoteControl, executeMouseAction, executeKeyboardAction } = require('./remote-control');
const { getSources, getScreenStream } = require('./screen-capture');

let mainWindow;
let tray;
let isControlEnabled = false;

// Enable remote control features
setupRemoteControl();

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        minWidth: 800,
        minHeight: 600,
        frame: false,
        transparent: false,
        backgroundColor: '#0a0a0f',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, '../preload/preload.js')
        },
        icon: path.join(__dirname, '../../assets/icon.png')
    });

    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

    // Open DevTools in development
    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createTray() {
    const icon = nativeImage.createFromPath(path.join(__dirname, '../../assets/icon.png'));
    tray = new Tray(icon.resize({ width: 16, height: 16 }));

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Open MyDesk', click: () => mainWindow?.show() },
        { type: 'separator' },
        { label: 'Quit', click: () => app.quit() }
    ]);

    tray.setToolTip('MyDesk - Remote Desktop');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        mainWindow?.show();
    });
}

// App lifecycle
app.whenReady().then(() => {
    createWindow();
    createTray();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC Handlers

// Window controls
ipcMain.on('window-minimize', () => mainWindow?.minimize());
ipcMain.on('window-maximize', () => {
    if (mainWindow?.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow?.maximize();
    }
});
ipcMain.on('window-close', () => mainWindow?.hide());

// Screen capture
ipcMain.handle('get-sources', async () => {
    return await getSources();
});

ipcMain.handle('get-screen-id', async (event, sourceId) => {
    return sourceId;
});

// Remote control
ipcMain.on('set-control-enabled', (event, enabled) => {
    isControlEnabled = enabled;
    console.log('Remote control:', enabled ? 'ENABLED' : 'DISABLED');
});

ipcMain.handle('get-control-status', () => isControlEnabled);

ipcMain.on('execute-mouse', async (event, action) => {
    if (isControlEnabled) {
        await executeMouseAction(action);
    }
});

ipcMain.on('execute-keyboard', async (event, action) => {
    if (isControlEnabled) {
        await executeKeyboardAction(action);
    }
});

// Screen info
ipcMain.handle('get-screen-size', () => {
    const primaryDisplay = screen.getPrimaryDisplay();
    return primaryDisplay.size;
});
