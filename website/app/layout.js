import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MyDesk - Free Remote Desktop Sharing',
  description: 'Share your screen and control remote computers with ease. Free, secure, and open source remote desktop application.',
  keywords: 'remote desktop, screen sharing, remote control, AnyDesk alternative, free remote desktop',
  authors: [{ name: 'MyDesk Team' }],
  openGraph: {
    title: 'MyDesk - Free Remote Desktop Sharing',
    description: 'Share your screen and control remote computers with ease.',
    url: 'https://mydesk.run-time.in',
    siteName: 'MyDesk',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
