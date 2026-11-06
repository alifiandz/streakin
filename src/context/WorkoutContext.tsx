import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserLibrary, WorkoutLog, ActiveWorkout, WorkoutSession, ReminderSetting } from '../types';
import { SEED_SESSIONS } from '../data/seedSessions';
import { useAuth } from './AuthContext';
import { safeLocalStorage, STORAGE_KEYS, calculateStreak, getLocalDateString } from '../utils/storage';

interface WorkoutContextType {
  library: UserLibrary | null;
  activeWorkout: ActiveWorkout | null;
  logs: WorkoutLog[];
  streak: number;
  reminder: ReminderSetting;
  todaySession: WorkoutSession;
  saveLibrary: (durasi: number[], fokus: string[], sessionIds: string[]) => void;
  saveActiveWorkout: (active: ActiveWorkout | null) => void;
  clearActiveWorkout: () => void;
  addWorkoutLog: (log: Omit<WorkoutLog, 'id' | 'userId'>) => string;
  updateReminder: (aktif: boolean, jam: string) => void;
  getSessionById: (id: string) => WorkoutSession | undefined;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [library, setLibrary] = useState<UserLibrary | null>(null);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);
  const [reminder, setReminder] = useState<ReminderSetting>({
    userId: currentUser?.id || '',
    aktif: false,
    jam: '16:00',
  });

  // Load user data whenever currentUser changes
  useEffect(() => {
    if (!currentUser) {
      setLibrary(null);
      setLogs([]);
      setActiveWorkout(null);
      return;
    }

    // 1. Load Libraries
    const rawLibs = safeLocalStorage.getItem(STORAGE_KEYS.LIBRARIES);
    const libMap: Record<string, UserLibrary> = rawLibs ? JSON.parse(rawLibs) : {};
    if (libMap[currentUser.id]) {
      setLibrary(libMap[currentUser.id]);
    } else {
      // Create initial default library for new user
      const defaultLib: UserLibrary = {
        userId: currentUser.id,
        durasi: [10, 15],
        fokus: ['Push', 'Legs'],
        sessionIds: ['s4', 's1', 's2', 's5'],
      };
      libMap[currentUser.id] = defaultLib;
      safeLocalStorage.setItem(STORAGE_KEYS.LIBRARIES, JSON.stringify(libMap));
      setLibrary(defaultLib);
    }

    // 2. Load Logs
    const rawLogs = safeLocalStorage.getItem(STORAGE_KEYS.LOGS);
    if (rawLogs) {
      const allLogs: WorkoutLog[] = JSON.parse(rawLogs);
      setLogs(allLogs.filter(l => l.userId === currentUser.id));
    } else {
      setLogs([]);
    }

    // 3. Load Active Workout
    const rawActive = safeLocalStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    if (rawActive) {
      const active: ActiveWorkout = JSON.parse(rawActive);
      if (active.userId === currentUser.id) {
        setActiveWorkout(active);
      } else {
        setActiveWorkout(null);
      }
    } else {
      setActiveWorkout(null);
    }

    // 4. Load Reminder
    const rawReminder = safeLocalStorage.getItem(`${STORAGE_KEYS.REMINDER}_${currentUser.id}`);
    if (rawReminder) {
      setReminder(JSON.parse(rawReminder));
    } else {
      setReminder({ userId: currentUser.id, aktif: false, jam: '16:00' });
    }
  }, [currentUser]);

  const streak = calculateStreak(logs);

  // Auto-rotating session calculation (Section 8.2)
  const getTodaySession = (): WorkoutSession => {
    const userSessionIds = library?.sessionIds && library.sessionIds.length > 0 
      ? library.sessionIds 
      : ['s4', 's1', 's2', 's5'];

    if (logs.length === 0) {
      const first = SEED_SESSIONS.find(s => s.id === userSessionIds[0]);
      return first || SEED_SESSIONS[0];
    }

    // Last completed log
    const sortedLogs = [...logs].sort((a, b) => (b.tanggal > a.tanggal ? 1 : -1));
    const lastSessionId = sortedLogs[0].sessionId;
    const currentIndex = userSessionIds.indexOf(lastSessionId);

    let nextIndex = 0;
    if (currentIndex !== -1) {
      nextIndex = (currentIndex + 1) % userSessionIds.length;
    }

    const nextSessionId = userSessionIds[nextIndex];
    return SEED_SESSIONS.find(s => s.id === nextSessionId) || SEED_SESSIONS[0];
  };

  const todaySession = getTodaySession();

  const getSessionById = (id: string): WorkoutSession | undefined => {
    return SEED_SESSIONS.find(s => s.id === id);
  };

  const saveLibrary = (durasi: number[], fokus: string[], sessionIds: string[]) => {
    if (!currentUser) return;
    const newLib: UserLibrary = {
      userId: currentUser.id,
      durasi,
      fokus,
      sessionIds,
    };
    setLibrary(newLib);

    const rawLibs = safeLocalStorage.getItem(STORAGE_KEYS.LIBRARIES);
    const libMap: Record<string, UserLibrary> = rawLibs ? JSON.parse(rawLibs) : {};
    libMap[currentUser.id] = newLib;
    safeLocalStorage.setItem(STORAGE_KEYS.LIBRARIES, JSON.stringify(libMap));
  };

  const saveActiveWorkout = (active: ActiveWorkout | null) => {
    setActiveWorkout(active);
    if (active) {
      safeLocalStorage.setItem(STORAGE_KEYS.ACTIVE_WORKOUT, JSON.stringify(active));
    } else {
      safeLocalStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    }
  };

  const clearActiveWorkout = () => {
    setActiveWorkout(null);
    safeLocalStorage.removeItem(STORAGE_KEYS.ACTIVE_WORKOUT);
  };

  const addWorkoutLog = (logData: Omit<WorkoutLog, 'id' | 'userId'>): string => {
    if (!currentUser) return '';
    const newLogId = `log_${Date.now()}`;
    const newLog: WorkoutLog = {
      ...logData,
      id: newLogId,
      userId: currentUser.id,
      tanggal: logData.tanggal || getLocalDateString(),
    };

    const rawLogs = safeLocalStorage.getItem(STORAGE_KEYS.LOGS);
    const allLogs: WorkoutLog[] = rawLogs ? JSON.parse(rawLogs) : [];
    const updatedLogs = [newLog, ...allLogs];
    safeLocalStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updatedLogs));

    setLogs(prev => [newLog, ...prev]);
    clearActiveWorkout();
    return newLogId;
  };

  const updateReminder = (aktif: boolean, jam: string) => {
    if (!currentUser) return;
    const newReminder: ReminderSetting = {
      userId: currentUser.id,
      aktif,
      jam,
    };
    setReminder(newReminder);
    safeLocalStorage.setItem(`${STORAGE_KEYS.REMINDER}_${currentUser.id}`, JSON.stringify(newReminder));
  };

  return (
    <WorkoutContext.Provider
      value={{
        library,
        activeWorkout,
        logs,
        streak,
        reminder,
        todaySession,
        saveLibrary,
        saveActiveWorkout,
        clearActiveWorkout,
        addWorkoutLog,
        updateReminder,
        getSessionById,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
