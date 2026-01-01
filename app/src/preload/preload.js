const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // Window controls
    minimizeWindow: () => ipcRenderer.send('window-minimize'),
    maximizeWindow: () => ipcRenderer.send('window-maximize'),
    closeWindow: () => ipcRenderer.send('window-close'),

    // Screen capture
    getSources: () => ipcRenderer.invoke('get-sources'),
    getScreenId: (sourceId) => ipcRenderer.invoke('get-screen-id', sourceId),

    // Remote control
    setControlEnabled: (enabled) => ipcRenderer.send('set-control-enabled', enabled),
    getControlStatus: () => ipcRenderer.invoke('get-control-status'),
    executeMouse: (action) => ipcRenderer.send('execute-mouse', action),
    executeKeyboard: (action) => ipcRenderer.send('execute-keyboard', action),

    // Screen info
    getScreenSize: () => ipcRenderer.invoke('get-screen-size'),
});

// Expose platform info
contextBridge.exposeInMainWorld('platform', {
    isWindows: process.platform === 'win32',
    isMac: process.platform === 'darwin',
    isLinux: process.platform === 'linux'
});
