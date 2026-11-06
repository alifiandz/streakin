import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, Moon, Sun, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { currentUser, theme, toggleTheme, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#15171A]/95 dark:bg-[#15171A]/95 backdrop-blur border-b border-[#2E3238]">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={currentUser ? '/home' : '/'} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#FF7A03] flex items-center justify-center text-[#15171A] shadow-sm transition-transform group-hover:scale-105">
            <Zap className="w-5 h-5 fill-current stroke-[#15171A]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base leading-tight tracking-tight text-[#EEF1F4] dark:text-[#EEF1F4]">
              Calisthenic <span className="text-[#FF7A03]">Siswa</span>
            </span>
            <span className="text-[11px] text-[#8A929C] hidden sm:inline leading-none">
              Kebugaran Singkat Siswa Sibuk
            </span>
          </div>
        </Link>

        {/* Desktop Nav for Logged In User */}
        {currentUser && (
          <nav className="hidden md:flex items-center gap-1 bg-[#23272D] p-1 rounded-xl border border-[#2E3238]">
            <Link
              to="/home"
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                isActive('/home')
                  ? 'bg-[#FF7A03] text-[#15171A]'
                  : 'text-[#8A929C] hover:text-[#EEF1F4]'
              }`}
            >
              Beranda
            </Link>
            <Link
              to="/library"
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                isActive('/library')
                  ? 'bg-[#FF7A03] text-[#15171A]'
                  : 'text-[#8A929C] hover:text-[#EEF1F4]'
              }`}
            >
              Library
            </Link>
            <Link
              to="/riwayat"
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                isActive('/riwayat')
                  ? 'bg-[#FF7A03] text-[#15171A]'
                  : 'text-[#8A929C] hover:text-[#EEF1F4]'
              }`}
            >
              Riwayat
            </Link>
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Ganti mode gelap atau terang"
            className="w-10 h-10 rounded-xl bg-[#23272D] border border-[#2E3238] flex items-center justify-center text-[#8A929C] hover:text-[#EEF1F4] transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {currentUser ? (
            /* User Avatar & Menu */
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl bg-[#23272D] border border-[#2E3238] hover:border-[#8A929C] transition-all"
              >
                <span className="text-xs font-semibold text-[#EEF1F4] hidden sm:inline max-w-[100px] truncate">
                  {currentUser.nama}
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#FF7A03] text-[#15171A] font-bold text-xs flex items-center justify-center">
                  {currentUser.nama.slice(0, 2).toUpperCase()}
                </div>
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-[#23272D] border border-[#2E3238] rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-[#2E3238]">
                    <p className="text-xs font-semibold text-[#EEF1F4] truncate">{currentUser.nama}</p>
                    <p className="text-[11px] text-[#8A929C] truncate">{currentUser.email}</p>
                  </div>
                  <Link
                    to="/notifikasi"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#EEF1F4] hover:bg-[#2E3238] transition-colors"
                  >
                    <Bell className="w-4 h-4 text-[#8A929C]" />
                    Atur Pengingat
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-[#2E3238] transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar Akun
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Guest Actions */
            <div className="flex items-center gap-2">
              <Link
                to="/akun?tab=login"
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#EEF1F4] hover:text-[#FF7A03] transition-colors"
              >
                Masuk
              </Link>
              <Link
                to="/akun?tab=register"
                className="px-3.5 py-2 bg-[#FF7A03] hover:bg-[#E66E00] text-[#15171A] text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm"
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
