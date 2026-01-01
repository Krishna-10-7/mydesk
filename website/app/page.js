'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

// Icons as components
const MonitorIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="14" rx="2" stroke="url(#iconGrad)" strokeWidth="1.5" />
    <path d="M8 22h8M12 18v4" stroke="url(#iconGrad)" strokeWidth="1.5" strokeLinecap="round" />
    <defs>
      <linearGradient id="iconGrad" x1="2" y1="4" x2="22" y2="22">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#a855f7" />
      </linearGradient>
    </defs>
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function Home() {
  const [os, setOS] = useState('Windows');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const ua = navigator.userAgent;
    if (ua.includes('Win')) setOS('Windows');
    else if (ua.includes('Mac')) setOS('macOS');
    else if (ua.includes('Linux')) setOS('Linux');
  }, []);

  const downloadLinks = {
    Windows: 'https://github.com/Krishna-10-7/mydesk/releases/latest/download/MyDesk.Setup.1.0.4.exe',
    macOS: 'https://github.com/Krishna-10-7/mydesk/releases/latest/download/MyDesk-1.0.4-arm64.dmg',
    Linux: 'https://github.com/Krishna-10-7/mydesk/releases/latest/download/MyDesk-1.0.4.AppImage',
  };

  return (
    <>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <a href="/" className="nav-brand">
            <MonitorIcon />
            <span>MyDesk</span>
          </a>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#download">Download</a>
            <a href="https://github.com/Krishna-10-7/mydesk" target="_blank" rel="noopener">GitHub</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="grid-pattern"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="badge">
              <span className="pulse"></span>
              <span>Free & Open Source</span>
            </div>
            <h1>
              Remote Desktop<br />
              <span className="gradient-text">Made Simple</span>
            </h1>
            <p className="hero-subtitle">
              Share your screen, control remote computers, and collaborate seamlessly.
              No accounts, no subscriptions — just connect.
            </p>
            <div className="hero-actions">
              <a href={downloadLinks[os]} className="btn btn-primary btn-lg">
                <DownloadIcon />
                <span>Download for {mounted ? os : 'Windows'}</span>
              </a>
              <a href="#features" className="btn btn-secondary btn-lg">
                Learn More
              </a>
            </div>
            <div className="platform-badges">
              <span className="platform-badge">
                <WindowsIcon /> Windows
              </span>
              <span className="platform-badge">
                <AppleIcon /> macOS
              </span>
              <span className="platform-badge">
                <LinuxIcon /> Linux
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="app-preview">
              <div className="preview-header">
                <div className="window-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="preview-title">MyDesk</span>
              </div>
              <div className="preview-content">
                <div className="preview-card">
                  <div className="preview-icon host">
                    <ScreenShareIcon />
                  </div>
                  <span>Share My Screen</span>
                </div>
                <div className="preview-card active">
                  <div className="preview-icon connect">
                    <ConnectIcon />
                  </div>
                  <span>Connect to Remote</span>
                </div>
                <div className="preview-room">
                  <span className="room-label">Connection ID</span>
                  <span className="room-id">MDK-X7B-Q9F</span>
                </div>
              </div>
            </div>
            <div className="floating-elements">
              <div className="float-badge badge-secure">
                <ShieldIcon /> End-to-End Encrypted
              </div>
              <div className="float-badge badge-fast">
                <BoltIcon /> Low Latency
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose <span className="gradient-text">MyDesk</span>?</h2>
            <p>Everything you need for seamless remote access</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon" style={{ background: `${feature.color}15`, color: feature.color }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="download" id="download">
        <div className="container">
          <div className="section-header">
            <h2>Get <span className="gradient-text">MyDesk</span> Now</h2>
            <p>Free forever. No strings attached.</p>
          </div>
          <div className="download-cards">
            <DownloadCard
              platform="Windows"
              icon={<WindowsIcon size={40} />}
              version="1.0.4"
              requirements="Windows 10 or later"
              downloadUrl="https://github.com/Krishna-10-7/mydesk/releases/latest/download/MyDesk.Setup.1.0.4.exe"
              extension=".exe"
              highlighted={os === 'Windows'}
            />
            <DownloadCard
              platform="macOS"
              icon={<AppleIcon size={40} />}
              version="1.0.4"
              requirements="macOS 10.15 or later"
              downloadUrl="https://github.com/Krishna-10-7/mydesk/releases/latest/download/MyDesk-1.0.4-arm64.dmg"
              extension=".dmg"
              highlighted={os === 'macOS'}
            />
            <DownloadCard
              platform="Linux"
              icon={<LinuxIcon size={40} />}
              version="1.0.4"
              requirements="Ubuntu 18.04+, Fedora 32+"
              downloadUrl="https://github.com/Krishna-10-7/mydesk/releases/latest/download/MyDesk-1.0.4.AppImage"
              extension=".AppImage"
              altUrl="https://github.com/Krishna-10-7/mydesk/releases/latest/download/mydesk_1.0.4_amd64.deb"
              altExtension=".deb"
              highlighted={os === 'Linux'}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It <span className="gradient-text">Works</span></h2>
            <p>Connect in three simple steps</p>
          </div>
          <div className="steps">
            <Step number="1" title="Download & Install" description="Get MyDesk for your operating system. No signup required." />
            <StepArrow />
            <Step number="2" title="Share or Connect" description="Share your screen to get a code, or enter a code to connect." />
            <StepArrow />
            <Step number="3" title="Collaborate" description="View the remote screen and optionally take control with permission." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <a href="/" className="nav-brand">
                <MonitorIcon />
                <span>MyDesk</span>
              </a>
              <p>Free, open-source remote desktop built for everyone.</p>
            </div>
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#download">Download</a>
              <a href="#">Documentation</a>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <a href="https://github.com/Krishna-10-7/mydesk" target="_blank" rel="noopener">GitHub</a>
              <a href="#">Report Issue</a>
              <a href="#">Changelog</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 MyDesk. Open source under MIT License.</p>
            <p>Made with ❤️ for the community</p>
          </div>
        </div>
      </footer>
    </>
  );
}

// Icon Components
function WindowsIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
    </svg>
  );
}

function AppleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function LinuxIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587.26 1.252.392 1.966.392 1.54 0 2.93-.548 3.877-1.443.087.09.186.167.292.23.354.212.758.335 1.133.443.392.108.76.228.964.452.088.09.13.185.155.285.027.102.047.25.047.355 0 .208-.016.337-.047.488-.015.072-.035.135-.06.2-.03.072-.048.15-.08.22-.156.267-.362.5-.642.657-.354.191-.8.302-1.337.302-.53 0-1.056-.089-1.507-.21-.487-.12-.892-.328-1.198-.628-.138-.135-.266-.288-.388-.438l-.033.03c-.372.322-.79.568-1.28.797-.95.42-2.08.67-3.41.67-1.203 0-2.315-.213-3.22-.598-.89-.383-1.6-.93-2.01-1.64-.39-.68-.53-1.52-.39-2.43.13-.81.46-1.6.92-2.38.335-.555.73-1.093 1.18-1.62l-.059-.058c-.362-.36-.61-.82-.8-1.37-.2-.57-.31-1.22-.31-1.9 0-1.48.49-2.86 1.3-3.94.07-.1.16-.19.24-.28.05-.06.1-.12.16-.18-.03-.14-.06-.29-.09-.44-.15-.78-.21-1.66-.09-2.57.14-.96.47-1.95 1.04-2.83.55-.87 1.35-1.62 2.45-2.1.8-.35 1.77-.54 2.93-.54.07 0 .15 0 .22.01z" />
    </svg>
  );
}

function ScreenShareIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 20h10M12 16v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ConnectIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

// Features Data
const features = [
  {
    icon: <ScreenShareIcon />,
    title: 'Screen Sharing',
    description: 'Share your entire screen or specific windows with crystal-clear quality up to 4K resolution.',
    color: '#6366f1',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" /><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>,
    title: 'Low Latency',
    description: 'WebRTC peer-to-peer connections ensure minimal delay for smooth remote control experience.',
    color: '#a855f7',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 9l7-7 7 7M5 15l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    title: 'Full Control',
    description: 'Control mouse and keyboard on the remote machine. Permission-based for maximum security.',
    color: '#10b981',
  },
  {
    icon: <ShieldIcon />,
    title: 'Secure',
    description: 'Direct peer-to-peer connections mean your data never touches our servers after initial handshake.',
    color: '#f59e0b',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" strokeWidth="1.5" /></svg>,
    title: 'Cross-Platform',
    description: 'Works on Windows, macOS, and Linux. Connect from any platform to any platform.',
    color: '#06b6d4',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" /></svg>,
    title: 'No Account Needed',
    description: 'Just download and connect. No registration, no login, no personal data collection.',
    color: '#ef4444',
  },
];

// Download Card Component
function DownloadCard({ platform, icon, version, requirements, downloadUrl, extension, altUrl, altExtension, highlighted }) {
  const iconClass = platform.toLowerCase().replace('os', '');

  return (
    <div className={`download-card ${highlighted ? 'highlighted' : ''}`}>
      <div className={`download-icon ${iconClass}`}>
        {icon}
      </div>
      <h3>{platform}</h3>
      <p className="version">Version {version}</p>
      <p className="requirements">{requirements}</p>
      {altUrl ? (
        <div className="linux-options">
          <a href={downloadUrl} className="btn-download">
            {extension}
          </a>
          <a href={altUrl} className="btn-download">
            {altExtension}
          </a>
        </div>
      ) : (
        <a href={downloadUrl} className="btn-download">
          <DownloadIcon /> Download {extension}
        </a>
      )}
    </div>
  );
}

// Step Component
function Step({ number, title, description }) {
  return (
    <div className="step">
      <div className="step-number">{number}</div>
      <div className="step-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function StepArrow() {
  return (
    <div className="step-arrow">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
