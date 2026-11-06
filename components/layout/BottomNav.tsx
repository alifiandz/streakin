'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Award, Bookmark, History } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const BottomNav: React.FC = () => {
  const { currentUser } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !currentUser) return null;

  // Sembunyikan bottom nav di sesi latihan aktif & halaman auth agar layar penuh fokus
  if (pathname?.startsWith('/latihan/') || pathname === '/akun') return null;

  const tabs = [
    { label: 'Beranda', path: '/home', icon: Home },
    { label: 'Skill', path: '/skills', icon: Award },
    { label: 'Library', path: '/library', icon: Bookmark },
    { label: 'Riwayat', path: '/riwayat', icon: History },
  ];

  return (
    <nav
      aria-label="Navigasi Utama Mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#15171A]/95 dark:bg-[#15171A]/95 backdrop-blur border-t border-[#2E3238] pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
    >
      <div className="grid grid-cols-4 max-w-md mx-auto h-14">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.path ||
            (tab.path === '/skills' && pathname?.startsWith('/skills')) ||
            (tab.path === '/library' && pathname?.startsWith('/library'));
          const Icon = tab.icon;
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 gap-1 select-none active:scale-95 transition-all ${
                isActive ? 'text-[#FF7A03]' : 'text-[#8A929C] hover:text-[#EEF1F4]'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-[#FF7A03]/20 shadow-sm shadow-[#FF7A03]/10' : ''
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'stroke-[#FF7A03] stroke-[2.5] scale-105' : 'stroke-current'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] leading-tight ${
                  isActive ? 'font-bold text-[#FF7A03]' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
