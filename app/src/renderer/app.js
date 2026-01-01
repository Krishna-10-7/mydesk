/* ========================================
   MyDesk - Main Application Logic
   ======================================== */

// Configuration
const SIGNALING_SERVER = 'https://mydesk-server.glitch.me'; // Update after deploying

// State
let currentScreen = 'home';
let socket = null;
let localStream = null;
let peerConnection = null;
let roomId = null;
let isHost = false;
let dataChannel = null;
let screenSize = { width: 1920, height: 1080 };

// ICE Servers for WebRTC
const iceServers = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
    ]
};

// ========================================
// Initialization
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initWindowControls();
    initNavigation();
    initHostScreen();
    initConnectScreen();
    initViewerScreen();
    loadScreenSize();

    // Connect to signaling server
    connectToSignalingServer();
});

async function loadScreenSize() {
    if (window.electronAPI?.getScreenSize) {
        screenSize = await window.electronAPI.getScreenSize();
    }
}

// ========================================
// Window Controls
// ========================================
function initWindowControls() {
    const minimizeBtn = document.getElementById('minimizeBtn');
    const maximizeBtn = document.getElementById('maximizeBtn');
    const closeBtn = document.getElementById('closeBtn');

    minimizeBtn?.addEventListener('click', () => window.electronAPI?.minimizeWindow());
    maximizeBtn?.addEventListener('click', () => window.electronAPI?.maximizeWindow());
    closeBtn?.addEventListener('click', () => window.electronAPI?.closeWindow());
}

// ========================================
// Navigation
// ========================================
function initNavigation() {
    const hostBtn = document.getElementById('hostBtn');
    const connectBtn = document.getElementById('connectBtn');
    const hostBackBtn = document.getElementById('hostBackBtn');
    const connectBackBtn = document.getElementById('connectBackBtn');

    hostBtn?.addEventListener('click', () => showScreen('host'));
    connectBtn?.addEventListener('click', () => showScreen('connect'));
    hostBackBtn?.addEventListener('click', () => {
        stopSharing();
        showScreen('home');
    });
    connectBackBtn?.addEventListener('click', () => showScreen('home'));
}

function showScreen(screenName) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(`${screenName}Screen`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenName;

        // Load sources if showing host screen
        if (screenName === 'host') {
            loadSources();
        }
    }
}

// ========================================
// Signaling Server Connection
// ========================================
function connectToSignalingServer() {
    // For now, we'll use a simplified approach that works without socket.io loaded
    // The actual socket.io connection will be established when the server is deployed
    console.log('Signaling server connection will be established once deployed');

    // Create mock socket for development
    socket = createMockSocket();
}

function createMockSocket() {
    // Mock socket for local testing
    return {
        connected: false,
        emit: (event, data) => {
            console.log('Socket emit:', event, data);

            // Simulate responses for testing
            if (event === 'create-room') {
                setTimeout(() => {
                    roomId = generateRoomId();
                    document.getElementById('roomIdDisplay').textContent = roomId;
                    console.log('Room created:', roomId);
                }, 100);
            }
        },
        on: (event, callback) => {
            console.log('Socket listener added:', event);
        },
        disconnect: () => {
            console.log('Socket disconnected');
        }
    };
}

function generateRoomId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = 'MDK-';
    for (let i = 0; i < 3; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    id += '-';
    for (let i = 0; i < 3; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

// ========================================
// Host Screen
// ========================================
async function loadSources() {
    const sourcesGrid = document.getElementById('sourcesGrid');
    if (!sourcesGrid) return;

    sourcesGrid.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">Loading sources...</p>';

    try {
        const sources = await window.electronAPI?.getSources();

        if (!sources || sources.length === 0) {
            sourcesGrid.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">No sources available</p>';
            return;
        }

        sourcesGrid.innerHTML = '';

        sources.forEach(source => {
            const div = document.createElement('div');
            div.className = 'source-item';
            div.innerHTML = `
        <img class="source-thumbnail" src="${source.thumbnail}" alt="${source.name}">
        <div class="source-name">
          ${source.isScreen ? '<span class="source-badge">Screen</span>' : ''}
          ${source.name}
        </div>
      `;
            div.addEventListener('click', () => selectSource(source));
            sourcesGrid.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading sources:', error);
        sourcesGrid.innerHTML = '<p style="color: var(--text-danger);">Error loading sources</p>';
    }
}

async function selectSource(source) {
    // Highlight selected source
    document.querySelectorAll('.source-item').forEach(item => {
        item.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');

    try {
        // Get the stream
        const constraints = {
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                    maxWidth: screenSize.width,
                    maxHeight: screenSize.height,
                    maxFrameRate: 30
                }
            }
        };

        localStream = await navigator.mediaDevices.getUserMedia(constraints);

        // Show preview
        const previewVideo = document.getElementById('previewVideo');
        if (previewVideo) {
            previewVideo.srcObject = localStream;
        }

        // Switch to sharing view
        document.getElementById('sourceSelection')?.classList.add('hidden');
        document.getElementById('sharingActive')?.classList.remove('hidden');

        // Generate room ID
        roomId = generateRoomId();
        document.getElementById('roomIdDisplay').textContent = roomId;

        // Set as host
        isHost = true;

        // Create room on server
        socket?.emit('create-room', { roomId });

        console.log('Sharing started:', source.name);
    } catch (error) {
        console.error('Error selecting source:', error);
        alert('Failed to capture screen. Please try again.');
    }
}

function initHostScreen() {
    // Copy room ID button
    const copyBtn = document.getElementById('copyRoomId');
    copyBtn?.addEventListener('click', async () => {
        const roomIdText = document.getElementById('roomIdDisplay')?.textContent;
        if (roomIdText) {
            await navigator.clipboard.writeText(roomIdText);
            copyBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
            setTimeout(() => {
                copyBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        `;
            }, 2000);
        }
    });

    // Allow control toggle
    const controlToggle = document.getElementById('allowControlToggle');
    controlToggle?.addEventListener('change', (e) => {
        window.electronAPI?.setControlEnabled(e.target.checked);
    });

    // Stop sharing button
    const stopBtn = document.getElementById('stopSharingBtn');
    stopBtn?.addEventListener('click', () => {
        stopSharing();
        showScreen('home');
    });
}

function stopSharing() {
    // Stop local stream
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }

    // Close peer connection
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }

    // Reset UI
    document.getElementById('sourceSelection')?.classList.remove('hidden');
    document.getElementById('sharingActive')?.classList.add('hidden');
    document.getElementById('previewVideo').srcObject = null;
    document.getElementById('allowControlToggle').checked = false;
    window.electronAPI?.setControlEnabled(false);

    // Leave room
    if (roomId) {
        socket?.emit('leave-room', { roomId });
        roomId = null;
    }

    isHost = false;
}

// ========================================
// Connect Screen
// ========================================
function initConnectScreen() {
    const roomIdInput = document.getElementById('roomIdInput');
    const connectSubmitBtn = document.getElementById('connectSubmitBtn');

    // Format room ID as user types
    roomIdInput?.addEventListener('input', (e) => {
        let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');

        // Add dashes at correct positions
        if (value.length > 3) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        }
        if (value.length > 7) {
            value = value.slice(0, 7) + '-' + value.slice(7, 10);
        }

        // Limit length
        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        e.target.value = value;
    });

    // Connect button
    connectSubmitBtn?.addEventListener('click', () => {
        const inputRoomId = roomIdInput?.value.trim();
        if (inputRoomId && inputRoomId.length === 11) {
            connectToRoom(inputRoomId);
        } else {
            alert('Please enter a valid Connection ID (e.g., MDK-ABC-123)');
        }
    });

    // Enter key to connect
    roomIdInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            connectSubmitBtn?.click();
        }
    });
}

function connectToRoom(targetRoomId) {
    const connectionStatus = document.getElementById('connectionStatus');
    connectionStatus?.classList.remove('hidden');

    roomId = targetRoomId;
    isHost = false;

    // Join room on server
    socket?.emit('join-room', { roomId });

    // For development, simulate connection and switch to viewer
    setTimeout(() => {
        connectionStatus?.classList.add('hidden');
        document.getElementById('viewerRoomId').textContent = roomId;
        showScreen('viewer');
        console.log('Connected to room:', roomId);
    }, 1500);
}

// ========================================
// Viewer Screen
// ========================================
function initViewerScreen() {
    const disconnectBtn = document.getElementById('viewerDisconnectBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const reconnectBtn = document.getElementById('reconnectBtn');
    const remoteVideo = document.getElementById('remoteVideo');

    disconnectBtn?.addEventListener('click', () => {
        disconnectFromRoom();
        showScreen('home');
    });

    fullscreenBtn?.addEventListener('click', () => {
        const container = document.querySelector('.remote-view-container');
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            container?.requestFullscreen();
        }
    });

    reconnectBtn?.addEventListener('click', () => {
        document.getElementById('connectionLost')?.classList.add('hidden');
        if (roomId) {
            connectToRoom(roomId);
        }
    });

    // Capture mouse events for remote control
    remoteVideo?.addEventListener('mousemove', handleRemoteMouse);
    remoteVideo?.addEventListener('mousedown', handleRemoteMouse);
    remoteVideo?.addEventListener('mouseup', handleRemoteMouse);
    remoteVideo?.addEventListener('click', handleRemoteMouse);
    remoteVideo?.addEventListener('dblclick', handleRemoteMouse);
    remoteVideo?.addEventListener('wheel', handleRemoteScroll);
    remoteVideo?.addEventListener('contextmenu', (e) => e.preventDefault());

    // Capture keyboard events
    document.addEventListener('keydown', handleRemoteKeyboard);
    document.addEventListener('keyup', handleRemoteKeyboard);
}

function handleRemoteMouse(e) {
    if (currentScreen !== 'viewer' || !dataChannel || dataChannel.readyState !== 'open') {
        return;
    }

    const video = e.target;
    const rect = video.getBoundingClientRect();

    // Calculate relative position
    const scaleX = screenSize.width / rect.width;
    const scaleY = screenSize.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const action = {
        type: e.type,
        x,
        y,
        button: e.button
    };

    dataChannel.send(JSON.stringify({ type: 'mouse', action }));
}

function handleRemoteScroll(e) {
    if (currentScreen !== 'viewer' || !dataChannel || dataChannel.readyState !== 'open') {
        return;
    }

    e.preventDefault();

    const action = {
        type: 'scroll',
        delta: e.deltaY > 0 ? 3 : -3
    };

    dataChannel.send(JSON.stringify({ type: 'mouse', action }));
}

function handleRemoteKeyboard(e) {
    if (currentScreen !== 'viewer' || !dataChannel || dataChannel.readyState !== 'open') {
        return;
    }

    // Don't capture if typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }

    e.preventDefault();

    const action = {
        type: e.type,
        key: e.key,
        code: e.code
    };

    dataChannel.send(JSON.stringify({ type: 'keyboard', action }));
}

function disconnectFromRoom() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }

    if (dataChannel) {
        dataChannel.close();
        dataChannel = null;
    }

    if (roomId) {
        socket?.emit('leave-room', { roomId });
        roomId = null;
    }

    document.getElementById('remoteVideo').srcObject = null;
}

// ========================================
// WebRTC Handling
// ========================================
function createPeerConnection() {
    peerConnection = new RTCPeerConnection(iceServers);

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket?.emit('ice-candidate', {
                roomId,
                candidate: event.candidate
            });
        }
    };

    peerConnection.ontrack = (event) => {
        const remoteVideo = document.getElementById('remoteVideo');
        if (remoteVideo) {
            remoteVideo.srcObject = event.streams[0];
        }
    };

    peerConnection.ondatachannel = (event) => {
        dataChannel = event.channel;
        setupDataChannel();
    };

    if (isHost && localStream) {
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        // Create data channel for remote control
        dataChannel = peerConnection.createDataChannel('control');
        setupDataChannel();
    }

    return peerConnection;
}

function setupDataChannel() {
    if (!dataChannel) return;

    dataChannel.onopen = () => {
        console.log('Data channel opened');
    };

    dataChannel.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (isHost) {
            // Execute remote control commands
            if (message.type === 'mouse') {
                window.electronAPI?.executeMouse(message.action);
            } else if (message.type === 'keyboard') {
                window.electronAPI?.executeKeyboard(message.action);
            }
        }
    };

    dataChannel.onclose = () => {
        console.log('Data channel closed');
    };
}

async function createOffer() {
    if (!peerConnection) return;

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket?.emit('signal', {
        roomId,
        signal: peerConnection.localDescription
    });
}

async function handleSignal(signal) {
    if (!peerConnection) {
        createPeerConnection();
    }

    if (signal.type === 'offer') {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(signal));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socket?.emit('signal', {
            roomId,
            signal: peerConnection.localDescription
        });
    } else if (signal.type === 'answer') {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(signal));
    }
}

async function handleIceCandidate(candidate) {
    if (peerConnection) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
}
