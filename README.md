# MyDesk - Free Remote Desktop Sharing

A cross-platform remote desktop sharing application with full screen sharing and remote control capabilities.

![MyDesk](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)

## Features

- 🖥️ **Screen Sharing** - Share your entire screen or specific windows
- 🎮 **Remote Control** - Control mouse and keyboard on the remote machine
- 🔒 **Secure** - Peer-to-peer WebRTC connections with no data on servers
- ⚡ **Low Latency** - Direct connections for minimal delay
- 🌍 **Cross-Platform** - Works on Windows, macOS, and Linux
- 🆓 **Free & Open Source** - No accounts, no subscriptions

## Project Structure

```
mydesk/
├── app/                    # Electron desktop application
│   ├── src/
│   │   ├── main/           # Electron main process
│   │   ├── preload/        # IPC bridge
│   │   └── renderer/       # React UI
│   └── package.json
├── server/                 # Signaling server (Node.js + Socket.io)
│   ├── server.js
│   └── package.json
└── website/                # Landing page (Next.js)
    └── app/
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Running the Electron App

```bash
cd app
npm install
npm run dev
```

### Running the Signaling Server

```bash
cd server
npm install
npm start
```

### Running the Website

```bash
cd website
npm install
npm run dev
```

## Building for Production

### Build Electron App

```bash
cd app
npm run build           # All platforms
npm run build:win       # Windows only
npm run build:mac       # macOS only
npm run build:linux     # Linux only
```

### Deploy Signaling Server to Glitch

1. Create a new project on [Glitch](https://glitch.com)
2. Import from GitHub or upload the `server/` folder
3. Copy the project URL (e.g., `https://mydesk-server.glitch.me`)
4. Update `SIGNALING_SERVER` in `app/src/renderer/app.js`

### Deploy Website to Vercel

```bash
cd website
npx vercel
```

Then configure your custom domain `mydesk.run-time.in` in Vercel settings.

## How It Works

1. **Host** shares their screen and gets a unique Connection ID
2. **Viewer** enters the Connection ID to connect
3. WebRTC establishes a direct peer-to-peer connection
4. Video streams from Host to Viewer
5. Control commands (mouse/keyboard) stream from Viewer to Host

## Security

- All video/audio streams are peer-to-peer (never through the server)
- The signaling server only handles initial connection setup
- Remote control requires explicit permission from the host
- No data is stored on any server

## License

MIT License - feel free to use, modify, and distribute.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
