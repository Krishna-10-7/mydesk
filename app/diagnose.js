const io = require('socket.io-client');

const SERVER_URL = 'https://mydesk-jpmy.onrender.com';

console.log('Testing connection to:', SERVER_URL);
console.log('Client version:', require('socket.io-client/package.json').version);

const socket = io(SERVER_URL, {
    transports: ['websocket', 'polling'],
    reconnection: false, // Don't keep trying, fail fast for test
    timeout: 5000
});

socket.on('connect', () => {
    console.log('✅ SUCCESS: Connected to server!');
    console.log('Socket ID:', socket.id);
    socket.emit('test-ping', { time: Date.now() });

    // Clean exit
    setTimeout(() => {
        socket.disconnect();
        process.exit(0);
    }, 1000);
});

socket.on('connect_error', (err) => {
    console.error('❌ ERROR: Connection failed');
    console.error('Message:', err.message);
    console.error('Details:', err);
    // process.exit(1); 
    // Don't exit immediately, let it try polling if it was websocket that failed
});

socket.on('disconnect', (reason) => {
    console.log('Disconnected:', reason);
});

// Force timeout
setTimeout(() => {
    console.log('⚠️ TIMEOUT: Could not connect within 10 seconds');
    process.exit(1);
}, 10000);
