'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Zap, Moon, Sun, LogOut, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Header: React.FC = () => {
  const { currentUser, theme, toggleTheme, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = mounted ? currentUser : null;

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#15171A]/95 dark:bg-[#15171A]/95 backdrop-blur border-b border-[#2E3238] pt-[env(safe-area-inset-top,0px)] transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href={currentUser ? '/home' : '/'}
          className="flex items-center gap-2 group min-h-[44px] py-1 select-none"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FF7A03] flex items-center justify-center text-[#15171A] shadow-sm transition-transform group-hover:scale-105 flex-shrink-0">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current stroke-[#15171A]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base leading-tight tracking-tight text-[#EEF1F4]">
              Streak<span className="text-[#FF7A03]">In</span>
            </span>
            <span className="text-[10px] text-[#8A929C] hidden sm:inline leading-none font-medium">
              Kawan Latihan Kalistenik
            </span>
          </div>
        </Link>

        {/* Desktop Nav for Logged In User */}
        {user && (
          <nav className="hidden md:flex items-center gap-1 bg-[#23272D] p-1 rounded-xl border border-[#2E3238]">
            <Link
              href="/home"
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all min-h-[44px] flex items-center justify-center ${
                isActive('/home')
                  ? 'bg-[#FF7A03] text-[#15171A] font-bold'
                  : 'text-[#8A929C] hover:text-[#EEF1F4]'
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/skills"
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all min-h-[44px] flex items-center justify-center ${
                isActive('/skills')
                  ? 'bg-[#FF7A03] text-[#15171A] font-bold'
                  : 'text-[#8A929C] hover:text-[#EEF1F4]'
              }`}
            >
              Skill
            </Link>
            <Link
              href="/library"
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all min-h-[44px] flex items-center justify-center ${
                isActive('/library')
                  ? 'bg-[#FF7A03] text-[#15171A] font-bold'
                  : 'text-[#8A929C] hover:text-[#EEF1F4]'
              }`}
            >
              Library
            </Link>
            <Link
              href="/riwayat"
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all min-h-[44px] flex items-center justify-center ${
                isActive('/riwayat')
                  ? 'bg-[#FF7A03] text-[#15171A] font-bold'
                  : 'text-[#8A929C] hover:text-[#EEF1F4]'
              }`}
            >
              Riwayat
            </Link>
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button - Mode Terang Segera Hadir */}
          <div className="relative group">
            <button
              onClick={toggleTheme}
              disabled
              aria-label="Mode tema: Gelap (Mode terang segera hadir)"
              type="button"
              className="h-11 min-h-[44px] px-2.5 rounded-xl bg-[#23272D]/70 border border-[#2E3238] flex items-center justify-center gap-1.5 text-[#8A929C] cursor-not-allowed opacity-80"
              title="Mode terang segera hadir"
            >
              <Moon className="w-4 h-4 text-[#FF7A03]" />
              <span className="text-[11px] font-medium text-[#8A929C] hidden xs:inline">Segera hadir</span>
            </button>
          </div>

          {user ? (
            /* User Avatar & Menu - touch min 44px */
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="min-h-[44px] flex items-center gap-2 pl-2.5 pr-1.5 py-1 rounded-xl bg-[#23272D] border border-[#2E3238] hover:border-[#8A929C] active:scale-95 transition-all"
                aria-label="Menu akun pengguna"
              >
                <span className="text-xs font-semibold text-[#EEF1F4] hidden sm:inline max-w-[100px] truncate">
                  {user.nama}
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#FF7A03] text-[#15171A] font-bold text-xs flex items-center justify-center shadow-sm">
                  {(user.nama || 'U').slice(0, 2).toUpperCase()}
                </div>
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-[#23272D] border border-[#2E3238] rounded-xl shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="px-3.5 py-2.5 border-b border-[#2E3238]">
                    <p className="text-xs font-bold text-[#EEF1F4] truncate">{user.nama}</p>
                    <p className="text-[11px] text-[#8A929C] truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/notifikasi"
                    className="flex items-center gap-2.5 px-3.5 min-h-[44px] text-xs text-[#EEF1F4] hover:bg-[#2E3238] transition-colors"
                  >
                    <Bell className="w-4 h-4 text-[#FF7A03]" />
                    <span>Atur Pengingat</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3.5 min-h-[44px] text-xs text-red-400 hover:bg-[#2E3238] transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar Akun</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Guest Actions - touch min 44px */
            <div className="flex items-center gap-1.5">
              <Link
                href="/akun?tab=login"
                className="min-h-[44px] px-3 flex items-center justify-center text-xs sm:text-sm font-semibold text-[#EEF1F4] hover:text-[#FF7A03] transition-colors active:scale-95"
              >
                Masuk
              </Link>
              <Link
                href="/akun?tab=register"
                className="min-h-[44px] px-3.5 bg-[#FF7A03] hover:bg-[#E66E00] text-[#15171A] text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-95"
              >
                Buat Akun
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
