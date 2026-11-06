import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  title: 'StreakIn - Kalistenik Pelajar Mandiri & Terstruktur',
  description: 'Aplikasi latihan kalistenik kawan pelajar SMA/SMK dengan sesi 10-30 menit, isometric hold, dan rest timer presisi.',
  applicationName: 'StreakIn',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'StreakIn',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#15171A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body
        className="bg-[#15171A] text-[#EEF1F4] min-h-[100dvh] flex flex-col selection:bg-[#FF7A03] selection:text-[#15171A] overflow-x-hidden"
        suppressHydrationWarning
      >
        <Providers>
          <div className="flex flex-col min-h-[100dvh] w-full max-w-full overflow-x-hidden">
            <Header />
            <div className="flex-1 w-full max-w-full overflow-x-hidden">{children}</div>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
