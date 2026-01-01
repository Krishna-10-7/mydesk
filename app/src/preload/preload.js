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

// Try to expose socket.io for signaling (graceful fallback if not available)
try {
    const { io } = require('socket.io-client');
    contextBridge.exposeInMainWorld('socketIO', {
        connect: (url, options) => {
            const socket = io(url, options);
            return {
                on: (event, callback) => {
                    socket.on(event, (...args) => {
                        // Sanitize args to ensure they are cloneable across context bridge
                        const sanitizedArgs = args.map(arg => {
                            if (arg instanceof Error) {
                                return { message: arg.message, name: arg.name };
                            }
                            // Deep clone or return as is if primitive
                            try {
                                return JSON.parse(JSON.stringify(arg));
                            } catch (e) {
                                return String(arg);
                            }
                        });
                        callback(...sanitizedArgs);
                    });
                },
                once: (event, callback) => {
                    socket.once(event, (...args) => {
                        const sanitizedArgs = args.map(arg => {
                            if (arg instanceof Error) {
                                return { message: arg.message, name: arg.name };
                            }
                            try {
                                return JSON.parse(JSON.stringify(arg));
                            } catch (e) {
                                return String(arg);
                            }
                        });
                        callback(...sanitizedArgs);
                    });
                },
                off: (event) => socket.off(event),
                emit: (event, data) => socket.emit(event, data),
                disconnect: () => socket.disconnect(),
                get connected() { return socket.connected; },
                get id() { return socket.id; }
            };
        }
    });
    console.log('Socket.io loaded successfully in preload');
} catch (error) {
    console.warn('Socket.io not available in preload, will use CDN fallback:', error.message);
    // Expose a null socketIO so renderer knows to use CDN fallback
    contextBridge.exposeInMainWorld('socketIO', null);
}

// Expose platform info
contextBridge.exposeInMainWorld('platform', {
    isWindows: process.platform === 'win32',
    isMac: process.platform === 'darwin',
    isLinux: process.platform === 'linux'
});
