import { User, UserLibrary, WorkoutLog } from '../types';

// In-memory fallback if localStorage fails or is disabled
const memoryStore: Record<string, string> = {};

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Fallback
    }
    return memoryStore[key] || null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Fallback
    }
    memoryStore[key] = value;
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Fallback
    }
    delete memoryStore[key];
  },
};

// Initial demo user (tanpa menyimpan kata sandi di local storage)
export const DEFAULT_DEMO_USER: User = {
  id: 'usr_demo_1',
  nama: 'Rizky',
  email: 'rizky@sma11.sch.id',
  kataSandi: '',
};

// Keys
export const STORAGE_KEYS = {
  USERS: 'calisthenic_users',
  CURRENT_USER: 'calisthenic_current_user',
  LIBRARIES: 'calisthenic_libraries',
  LOGS: 'calisthenic_logs',
  ACTIVE_WORKOUT: 'calisthenic_active_workout',
  REMINDER: 'calisthenic_reminder',
  THEME: 'calisthenic_theme',
  SOUND_ENABLED: 'calisthenic_sound_enabled',
};

// Date helper in YYYY-MM-DD local format
export function getLocalDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Calculate streak based on Section 8.1
export function calculateStreak(logs: WorkoutLog[]): number {
  if (!logs || logs.length === 0) return 0;

  const loggedDates = new Set(logs.map(log => log.tanggal));
  const todayStr = getLocalDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  let currentStreak = 0;
  const checkDate = new Date();

  // If today has a workout, count backward from today
  if (loggedDates.has(todayStr)) {
    while (true) {
      const dateStr = getLocalDateString(checkDate);
      if (loggedDates.has(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return currentStreak;
  }

  // If today doesn't have a workout yet, check if yesterday was completed
  if (loggedDates.has(yesterdayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
    while (true) {
      const dateStr = getLocalDateString(checkDate);
      if (loggedDates.has(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return currentStreak;
  }

  // Otherwise streak is 0
  return 0;
}

// Check last 7 days status for the streak bar (Senin - Minggu or last 7 calendar days)
export function getStreak7Days(logs: WorkoutLog[]) {
  const loggedDates = new Set(logs.map(log => log.tanggal));
  const days: { label: string; dateStr: string; completed: boolean; isToday: boolean }[] = [];
  const dayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const today = new Date();
  const todayStr = getLocalDateString(today);

  // Get past 7 days ending with today
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = getLocalDateString(d);
    days.push({
      label: dayLabels[d.getDay()],
      dateStr,
      completed: loggedDates.has(dateStr),
      isToday: dateStr === todayStr,
    });
  }

  return days;
}

// Initializer to ensure default demo user and initial library exist
export function initStorageData(): void {
  const usersJson = safeLocalStorage.getItem(STORAGE_KEYS.USERS);
  if (!usersJson) {
    safeLocalStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([DEFAULT_DEMO_USER]));
  }

  // Default library for demo user
  const libJson = safeLocalStorage.getItem(STORAGE_KEYS.LIBRARIES);
  if (!libJson) {
    const defaultLibraries: Record<string, UserLibrary> = {
      [DEFAULT_DEMO_USER.id]: {
        userId: DEFAULT_DEMO_USER.id,
        durasi: [10, 15],
        fokus: ['Push', 'Legs'],
        sessionIds: ['s4', 's1', 's5', 's2'],
      },
    };
    safeLocalStorage.setItem(STORAGE_KEYS.LIBRARIES, JSON.stringify(defaultLibraries));
  }
}
