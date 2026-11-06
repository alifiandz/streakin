import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { safeLocalStorage, STORAGE_KEYS, DEFAULT_DEMO_USER, initStorageData } from '../utils/storage';

interface AuthContextType {
  currentUser: User | null;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  login: (email: string, kataSandi: string) => { success: boolean; error?: string };
  register: (nama: string, email: string, kataSandi: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    initStorageData();
    const stored = safeLocalStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = safeLocalStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // Dark mode default according to specs
  });

  useEffect(() => {
    // Apply theme class to document root
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    safeLocalStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const login = (email: string, kataSandi: string) => {
    const rawUsers = safeLocalStorage.getItem(STORAGE_KEYS.USERS);
    const users: User[] = rawUsers ? JSON.parse(rawUsers) : [DEFAULT_DEMO_USER];

    const trimmedEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === trimmedEmail && u.kataSandi === kataSandi);

    if (found) {
      setCurrentUser(found);
      safeLocalStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(found));
      return { success: true };
    }

    return { success: false, error: 'Email atau kata sandi salah' };
  };

  const register = (nama: string, email: string, kataSandi: string) => {
    const trimmedNama = nama.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedNama) {
      return { success: false, error: 'Nama panggilan wajib diisi' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return { success: false, error: 'Email tidak valid' };
    }

    if (kataSandi.length < 8) {
      return { success: false, error: 'Kata sandi minimal 8 karakter' };
    }

    const rawUsers = safeLocalStorage.getItem(STORAGE_KEYS.USERS);
    const users: User[] = rawUsers ? JSON.parse(rawUsers) : [DEFAULT_DEMO_USER];

    if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'Email sudah terdaftar' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      nama: trimmedNama,
      email: trimmedEmail,
      kataSandi,
    };

    const updatedUsers = [...users, newUser];
    safeLocalStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
    safeLocalStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    setCurrentUser(newUser);

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    safeLocalStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  return (
    <AuthContext.Provider value={{ currentUser, theme, toggleTheme, login, register, logout }}>
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
