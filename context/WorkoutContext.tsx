'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserLibrary,
  WorkoutLog,
  ActiveWorkout,
  WorkoutSession,
  ReminderSetting,
  UserSkillProgress,
} from '@/src/types';
import { SEED_SESSIONS } from '@/lib/seedData';
import { useAuth } from './AuthContext';
import { safeLocalStorage, STORAGE_KEYS, calculateStreak, getLocalDateString } from '@/src/utils/storage';

interface WorkoutContextType {
  library: UserLibrary | null;
  activeWorkout: ActiveWorkout | null;
  logs: WorkoutLog[];
  streak: number;
  reminder: ReminderSetting;
  todaySession: WorkoutSession;
  skillProgressList: UserSkillProgress[];
  getSkillProgress: (skillId: string) => UserSkillProgress;
  updateSkillStage: (skillId: string, stage: number) => Promise<void>;
  updateBestHold: (skillId: string, holdSec: number) => Promise<void>;
  saveLibrary: (durasi: number[], fokus: string[], sessionIds: string[]) => Promise<void>;
  saveActiveWorkout: (active: ActiveWorkout | null) => void;
  clearActiveWorkout: () => void;
  addWorkoutLog: (log: Omit<WorkoutLog, 'id' | 'userId'>) => Promise<string>;
  updateReminder: (aktif: boolean, jam: string) => void;
  getSessionById: (id: string) => WorkoutSession | undefined;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [library, setLibrary] = useState<UserLibrary | null>(null);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [skillProgressList, setSkillProgressList] = useState<UserSkillProgress[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);
  const [reminder, setReminder] = useState<ReminderSetting>({
    userId: currentUser?.id || '',
    aktif: false,
    jam: '16:00',
  });

  // Fetch Library, Workout Logs, & Skill Progress from API whenever currentUser changes
  const loadUserData = useCallback(async (userId: string) => {
    try {
      // 1. Fetch Library
      const libRes = await fetch('/api/library');
      if (libRes.ok) {
        const libData = await libRes.json();
        if (libData.success && libData.data) {
          const l = libData.data;
          const parsedLib: UserLibrary = {
            userId: l.userId,
            durasi: Array.isArray(l.durasi) ? l.durasi.map(Number) : [10, 15],
            fokus: Array.isArray(l.fokus) ? l.fokus : ['Push', 'Legs'],
            sessionIds: Array.isArray(l.sessionIds) ? l.sessionIds : ['s1', 's2', 's_lsit_1'],
          };
          setLibrary(parsedLib);
        }
      }

      // 2. Fetch Skill Progress
      const skillRes = await fetch('/api/skills/progress');
      if (skillRes.ok) {
        const skillData = await skillRes.json();
        if (skillData.success && Array.isArray(skillData.data) && skillData.data.length > 0) {
          setSkillProgressList(skillData.data);
        }
      }

      // 3. Fetch Workout Logs
      const logsRes = await fetch('/api/workout-logs');
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        if (logsData.success && Array.isArray(logsData.data)) {
          const mappedLogs: WorkoutLog[] = logsData.data.map((item: any) => ({
            id: item.id,
            userId: item.userId,
            sessionId: item.sessionId,
            sessionNama: item.sessionName || item.sessionNama || 'Sesi Latihan',
            skillFocus: item.skillFocus || null,
            tanggal: item.completedAt ? item.completedAt.slice(0, 10) : getLocalDateString(),
            durasiDetik: item.durasiDetik || 0,
            streakCount: item.streakCount ?? 1,
            setsCompleted: (item.sets || []).map((s: any) => ({
              exerciseId: s.exerciseId,
              exerciseName: s.exerciseName || 'Gerakan',
              noSet: s.noSet,
              nilai: s.valueLogged ?? s.nilai ?? 0,
              selesai: true,
              isIsometric: Boolean(s.isIsometric),
            })),
          }));
          setLogs(mappedLogs);
        }
      }
    } catch (err) {
      console.warn('Fallback ke local storage:', err);
      const rawLogs = safeLocalStorage.getItem(STORAGE_KEYS.LOGS);
      if (rawLogs) {
        try {
          const allLogs: WorkoutLog[] = JSON.parse(rawLogs);
          setLogs(allLogs.filter((l) => l.userId === userId));
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setLibrary(null);
      setLogs([]);
      setActiveWorkout(null);
      return;
    }

    loadUserData(currentUser.id);

    // Active Workout from localStorage
    const rawActive = safeLocalStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    if (rawActive) {
      try {
        const active: ActiveWorkout = JSON.parse(rawActive);
        if (active.userId === currentUser.id) {
          setActiveWorkout(active);
        } else {
          setActiveWorkout(null);
        }
      } catch {
        setActiveWorkout(null);
      }
    } else {
      setActiveWorkout(null);
    }

    // Reminder from localStorage
    const rawReminder = safeLocalStorage.getItem(`${STORAGE_KEYS.REMINDER}_${currentUser.id}`);
    if (rawReminder) {
      try {
        setReminder(JSON.parse(rawReminder));
      } catch {
        setReminder({ userId: currentUser.id, aktif: false, jam: '16:00' });
      }
    } else {
      setReminder({ userId: currentUser.id, aktif: false, jam: '16:00' });
    }
  }, [currentUser, loadUserData]);

  const streak = calculateStreak(logs);

  const getSkillProgress = (skillId: string): UserSkillProgress => {
    const found = skillProgressList.find((p) => p.skillId === skillId);
    if (found) return found;
    return {
      userId: currentUser?.id || '',
      skillId,
      currentStage: 1,
      bestHoldSec: 0,
    };
  };

  const updateSkillStage = async (skillId: string, stage: number) => {
    setSkillProgressList((prev) => {
      const exists = prev.some((p) => p.skillId === skillId);
      if (exists) {
        return prev.map((p) => (p.skillId === skillId ? { ...p, currentStage: stage } : p));
      }
      return [
        ...prev,
        { userId: currentUser?.id || '', skillId, currentStage: stage, bestHoldSec: 0 },
      ];
    });

    try {
      await fetch('/api/skills/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId, currentStage: stage }),
      });
    } catch (err) {
      console.error('Gagal memperbarui skill stage:', err);
    }
  };

  const updateBestHold = async (skillId: string, holdSec: number) => {
    setSkillProgressList((prev) => {
      const exists = prev.some((p) => p.skillId === skillId);
      if (exists) {
        return prev.map((p) =>
          p.skillId === skillId
            ? { ...p, bestHoldSec: Math.max(holdSec, p.bestHoldSec) }
            : p
        );
      }
      return [
        ...prev,
        { userId: currentUser?.id || '', skillId, currentStage: 1, bestHoldSec: holdSec },
      ];
    });

    try {
      await fetch('/api/skills/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId, bestHoldSec: holdSec }),
      });
    } catch (err) {
      console.error('Gagal memperbarui best hold:', err);
    }
  };

  // Auto-rotating session calculation
  const getTodaySession = (): WorkoutSession => {
    const userSessionIds =
      library?.sessionIds && library.sessionIds.length > 0
        ? library.sessionIds
        : ['s_lsit_1', 's1', 's_handstand_1', 's2'];

    if (logs.length === 0) {
      const first = SEED_SESSIONS.find((s) => s.id === userSessionIds[0]);
      return first || SEED_SESSIONS[0];
    }

    const sortedLogs = [...logs].sort((a, b) => (b.tanggal > a.tanggal ? 1 : -1));
    const lastSessionId = sortedLogs[0].sessionId;
    const currentIndex = userSessionIds.indexOf(lastSessionId);

    let nextIndex = 0;
    if (currentIndex !== -1) {
      nextIndex = (currentIndex + 1) % userSessionIds.length;
    }

    const nextSessionId = userSessionIds[nextIndex];
    return SEED_SESSIONS.find((s) => s.id === nextSessionId) || SEED_SESSIONS[0];
  };

  const todaySession = getTodaySession();

  const getSessionById = (id: string): WorkoutSession | undefined => {
    return SEED_SESSIONS.find((s) => s.id === id);
  };

  const saveLibrary = async (durasi: number[], fokus: string[], sessionIds: string[]) => {
    if (!currentUser) return;
    const newLib: UserLibrary = {
      userId: currentUser.id,
      durasi,
      fokus,
      sessionIds,
    };
    setLibrary(newLib);

    try {
      await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ durasi, fokus, sessionIds }),
      });
    } catch (err) {
      console.error('Gagal menyimpan library:', err);
    }
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

  const addWorkoutLog = async (logData: Omit<WorkoutLog, 'id' | 'userId'>): Promise<string> => {
    if (!currentUser) return '';
    const tempId = `log_${Date.now()}`;
    const newStreak = streak + 1;

    const newLog: WorkoutLog = {
      ...logData,
      id: tempId,
      userId: currentUser.id,
      streakCount: newStreak,
      tanggal: logData.tanggal || getLocalDateString(),
    };

    setLogs((prev) => [newLog, ...prev]);
    clearActiveWorkout();

    // Cek hold detik maksimal dari sets yang isIsometric
    let maxIsometricHold = 0;
    logData.setsCompleted.forEach((s) => {
      if (s.isIsometric && s.nilai > maxIsometricHold) {
        maxIsometricHold = s.nilai;
      }
    });

    if (logData.skillFocus && maxIsometricHold > 0) {
      updateBestHold(logData.skillFocus, maxIsometricHold);
    }

    try {
      const res = await fetch('/api/workout-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: logData.sessionId,
          sessionName: logData.sessionNama,
          skillFocus: logData.skillFocus || null,
          durasiDetik: logData.durasiDetik,
          streakCount: newStreak,
          sets: logData.setsCompleted.map((s) => ({
            exerciseId: s.exerciseId,
            exerciseName: s.exerciseName || 'Gerakan',
            noSet: s.noSet,
            valueLogged: s.nilai,
            isIsometric: Boolean(s.isIsometric),
          })),
        }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data?.id) {
          setLogs((prev) => prev.map((item) => item.id === tempId ? { ...item, id: result.data.id } : item));
          return result.data.id;
        }
      }
    } catch (err) {
      console.error('Gagal mencatat log ke Supabase:', err);
    }

    return tempId;
  };

  const updateReminder = (aktif: boolean, jam: string) => {
    if (!currentUser) return;
    const newReminder: ReminderSetting = {
      userId: currentUser.id,
      aktif,
      jam,
    };
    setReminder(newReminder);
    safeLocalStorage.setItem(
      `${STORAGE_KEYS.REMINDER}_${currentUser.id}`,
      JSON.stringify(newReminder)
    );
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
        skillProgressList,
        getSkillProgress,
        updateSkillStage,
        updateBestHold,
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
