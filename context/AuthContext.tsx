'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/src/types';
import { safeLocalStorage, STORAGE_KEYS, initStorageData } from '@/src/utils/storage';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  login: (email: string, kataSandi: string) => Promise<{ success: boolean; error?: string }>;
  register: (nama: string, email: string, kataSandi: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load theme and stored user on mount (client-only to prevent hydration mismatch)
  useEffect(() => {
    initStorageData();
    const stored = safeLocalStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          setCurrentUser(parsed);
        }
      } catch {}
    }

    /*
     * [MODE TERANG DINONAKTIFKAN SEMENTARA - SEGERA HADIR]
     * Simpan kode asli untuk re-aktivasi nanti:
     * const saved = safeLocalStorage.getItem(STORAGE_KEYS.THEME);
     * const initialTheme = saved === 'light' || saved === 'dark' ? saved : 'dark';
     * setTheme(initialTheme);
     */
    setTheme('dark');
  }, []);

  // Sync theme with HTML root - selalu kunci ke 'dark'
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
    safeLocalStorage.setItem(STORAGE_KEYS.THEME, 'dark');
  }, [theme]);

  // Check active session from API /api/auth/me on mount
  useEffect(() => {
    async function checkMe() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            const userObj: User = {
              id: data.user.id,
              nama: data.user.nama,
              email: data.user.email,
              kataSandi: '',
            };
            setCurrentUser(userObj);
            safeLocalStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userObj));
          }
        }
      } catch (err) {
        console.error('Gagal mengecek sesi login ke MySQL:', err);
      } finally {
        setLoading(false);
      }
    }
    checkMe();
  }, []);

  // [MODE TERANG DINONAKTIFKAN SEMENTARA - SEGERA HADIR]
  // Kode asli: setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const toggleTheme = () => {
    // No-op sementara mode terang dinonaktifkan
    setTheme('dark');
  };

  const login = async (email: string, kataSandi: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, kataSandi }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Email atau kata sandi salah' };
      }

      const user: User = {
        id: data.user.id,
        nama: data.user.nama,
        email: data.user.email,
        kataSandi: '',
      };

      setCurrentUser(user);
      safeLocalStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return { success: true };
    } catch (error) {
      console.error('Error saat login:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Koneksi ke server gagal',
      };
    }
  };

  const register = async (nama: string, email: string, kataSandi: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, kataSandi }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Pendaftaran gagal' };
      }

      const user: User = {
        id: data.user.id,
        nama: data.user.nama,
        email: data.user.email,
        kataSandi: '',
      };

      setCurrentUser(user);
      safeLocalStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return { success: true };
    } catch (error) {
      console.error('Error saat register:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Koneksi ke server gagal',
      };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCurrentUser(null);
      safeLocalStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, loading, theme, toggleTheme, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

