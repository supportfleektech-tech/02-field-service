import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = { title: 'Field Service OS', description: 'Kenya-first field service & job management' };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0b0f14' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="top">
          <strong>🔧 Field Service OS</strong>
          <nav>
            <a href="/">Dashboard</a>
            <a href="/work-orders">Work Orders</a>
            <a href="/technicians">Technicians</a>
            <a href="/parts">Parts</a>
            <a href="/service-reports">Reports</a>
          </nav>
        </header>
        <main className="wrap">{children}</main>
        <footer className="foot">KENYA254 · Field Service OS · dev</footer>
      </body>
    </html>
  );
}
