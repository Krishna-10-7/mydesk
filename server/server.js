/* ========================================
   MyDesk - Signaling Server
   WebSocket server for WebRTC signaling
   ======================================== */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for Electron app
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

// Store active rooms
const rooms = new Map();

// ========================================
// HTTP Routes
// ========================================

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'MyDesk Signaling Server',
        status: 'running',
        activeRooms: rooms.size,
        timestamp: new Date().toISOString()
    });
});

// Get room info
app.get('/room/:roomId', (req, res) => {
    const room = rooms.get(req.params.roomId);
    if (room) {
        res.json({
            roomId: req.params.roomId,
            hostConnected: !!room.host,
            viewerCount: room.viewers.size
        });
    } else {
        res.status(404).json({ error: 'Room not found' });
    }
});

// ========================================
// Socket.IO Events
// ========================================

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    let currentRoom = null;
    let isHost = false;

    // Create a new room (host)
    socket.on('create-room', ({ roomId }) => {
        console.log(`Creating room: ${roomId} by ${socket.id}`);

        // Leave any existing room
        if (currentRoom) {
            leaveRoom(socket, currentRoom, isHost);
        }

        // Create room if it doesn't exist
        if (!rooms.has(roomId)) {
            rooms.set(roomId, {
                host: null,
                viewers: new Set(),
                createdAt: new Date()
            });
        }

        const room = rooms.get(roomId);
        room.host = socket.id;
        currentRoom = roomId;
        isHost = true;

        socket.join(roomId);
        socket.emit('room-created', { roomId, success: true });

        console.log(`Room ${roomId} created. Active rooms: ${rooms.size}`);
    });

    // Join an existing room (viewer)
    socket.on('join-room', ({ roomId }) => {
        console.log(`Joining room: ${roomId} by ${socket.id}`);

        const room = rooms.get(roomId);

        if (!room) {
            socket.emit('room-error', { error: 'Room not found', roomId });
            return;
        }

        if (!room.host) {
            socket.emit('room-error', { error: 'Host not connected', roomId });
            return;
        }

        // Leave any existing room
        if (currentRoom) {
            leaveRoom(socket, currentRoom, isHost);
        }

        room.viewers.add(socket.id);
        currentRoom = roomId;
        isHost = false;

        socket.join(roomId);
        socket.emit('room-joined', { roomId, success: true });

        // Notify host of new viewer
        io.to(room.host).emit('viewer-joined', {
            viewerId: socket.id,
            viewerCount: room.viewers.size
        });

        // Trigger WebRTC negotiation - host should create offer
        io.to(room.host).emit('start-call', { viewerId: socket.id });

        console.log(`Viewer ${socket.id} joined room ${roomId}. Viewers: ${room.viewers.size}`);
    });

    // WebRTC signaling
    socket.on('signal', ({ roomId, signal, targetId }) => {
        const room = rooms.get(roomId);
        if (!room) return;

        if (targetId) {
            // Send to specific peer
            io.to(targetId).emit('signal', { signal, senderId: socket.id });
        } else {
            // Broadcast to room (excluding sender)
            socket.to(roomId).emit('signal', { signal, senderId: socket.id });
        }
    });

    // ICE candidate exchange
    socket.on('ice-candidate', ({ roomId, candidate, targetId }) => {
        const room = rooms.get(roomId);
        if (!room) return;

        if (targetId) {
            io.to(targetId).emit('ice-candidate', { candidate, senderId: socket.id });
        } else {
            socket.to(roomId).emit('ice-candidate', { candidate, senderId: socket.id });
        }
    });

    // Leave room
    socket.on('leave-room', ({ roomId }) => {
        leaveRoom(socket, roomId, isHost);
        currentRoom = null;
        isHost = false;
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);

        if (currentRoom) {
            leaveRoom(socket, currentRoom, isHost);
        }
    });
});

// ========================================
// Helper Functions
// ========================================

function leaveRoom(socket, roomId, wasHost) {
    const room = rooms.get(roomId);
    if (!room) return;

    socket.leave(roomId);

    if (wasHost) {
        // Host left - notify all viewers and close room
        io.to(roomId).emit('host-disconnected', { roomId });

        // Remove all viewers from room
        room.viewers.forEach(viewerId => {
            const viewerSocket = io.sockets.sockets.get(viewerId);
            if (viewerSocket) {
                viewerSocket.leave(roomId);
            }
        });

        rooms.delete(roomId);
        console.log(`Room ${roomId} closed (host left). Active rooms: ${rooms.size}`);
    } else {
        // Viewer left
        room.viewers.delete(socket.id);

        // Notify host
        if (room.host) {
            io.to(room.host).emit('viewer-left', {
                viewerId: socket.id,
                viewerCount: room.viewers.size
            });
        }

        console.log(`Viewer ${socket.id} left room ${roomId}. Viewers: ${room.viewers.size}`);
    }
}

// Cleanup old rooms periodically (every 10 minutes)
setInterval(() => {
    const now = new Date();
    const maxAge = 60 * 60 * 1000; // 1 hour

    rooms.forEach((room, roomId) => {
        if (now - room.createdAt > maxAge && room.viewers.size === 0) {
            rooms.delete(roomId);
            console.log(`Cleaned up inactive room: ${roomId}`);
        }
    });
}, 10 * 60 * 1000);

// ========================================
// Start Server
// ========================================

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║     MyDesk Signaling Server Started        ║
╠════════════════════════════════════════════╣
║  Port: ${PORT.toString().padEnd(35)}║
║  Status: Ready                             ║
╚════════════════════════════════════════════╝
  `);
});
