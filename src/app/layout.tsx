import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'AR-VOCATIONAL | AR-Based Safety Training Simulator — SIH 2026',
  description: 'AR-powered vocational training platform for industrial workers in mining, steel, and mica. Practice safety procedures through immersive 3D simulations. SIH 2026 Problem Statement 26041.',
  keywords: 'AR training, vocational training, mining safety, fire extinguisher, industrial safety, SIH 2026',
  openGraph: {
    title: 'AR-VOCATIONAL — Train Safely. Practice Real Skills.',
    description: 'Immersive AR-based vocational training for industrial workers.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <div className="noise-overlay" />
          <Navbar />
          <main style={{ paddingTop: 64, minHeight: '100vh' }}>
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
