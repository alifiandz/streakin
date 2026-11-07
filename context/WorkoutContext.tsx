'use client';

import React, { createContext, useContext, useState, useEffect, useCallback,useRef } from 'react';
import {
  UserLibrary,
  WorkoutLog,
  ActiveWorkout,
  WorkoutSession,
  ReminderSetting,
  UserSkillProgress,
} from '@/src/types';
import { SEED_SESSIONS } from '@/v3/catalog';
import { useProduct } from '@/v3/ProductContext';
import {recommendWorkouts} from '@/v3/recommendations';
import { useAuth } from './AuthContext';
import { safeLocalStorage, STORAGE_KEYS, calculateStreak, getLocalDateString } from '@/src/utils/storage';

interface WorkoutContextType {
  library: UserLibrary | null;
  activeWorkout: ActiveWorkout | null;
  logs: WorkoutLog[];
  streak: number;
  reminder: ReminderSetting;
  todaySession: WorkoutSession;
  recommendation: ReturnType<typeof recommendWorkouts>[number] | null;
  skillProgressList: UserSkillProgress[];
  getSkillProgress: (skillId: string) => UserSkillProgress;
  completeSkill: (skillId:string,reopen?:boolean) => Promise<void>;
  updateSkillStage: (skillId: string, stage: number) => Promise<void>;
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
  const actorRef=useRef(currentUser?.id);actorRef.current=currentUser?.id;
  const {state:product}=useProduct();
  const sessions=[...SEED_SESSIONS,...product.routines];

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
        const libData = await libRes.json();if(actorRef.current!==userId)return;
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
        const skillData = await skillRes.json();if(actorRef.current!==userId)return;
        if (skillData.success && Array.isArray(skillData.data) && skillData.data.length >= 0) {
          setSkillProgressList(skillData.data.filter((p: any) => p && typeof p.skillId === 'string'));
        }
      }

      // 3. Fetch Workout Logs
      const logsRes = await fetch('/api/workout-logs');
      if (logsRes.ok) {
        const logsData = await logsRes.json();if(actorRef.current!==userId)return;
        if (logsData.success && Array.isArray(logsData.data)) {
          const mappedLogs: WorkoutLog[] = logsData.data.filter((item:any)=>userId==='usr_demo_1'||!String(item.id).startsWith('demo-session-')).map((item: any) => ({
            id: item.id,
            userId: item.userId,
            sessionId: item.sessionId,
            sessionNama: item.sessionName || item.sessionNama || 'Sesi Latihan',
            skillFocus: item.skillFocus || null,
            tanggal: item.localDate || (item.completedAt ? getLocalDateString(new Date(item.completedAt)) : getLocalDateString()),
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
      setSkillProgressList([]);
      return;
    }

    loadUserData(currentUser.id);

    // Active Workout from localStorage
    const rawActive = safeLocalStorage.getItem(STORAGE_KEYS.ACTIVE_WORKOUT);
    if (rawActive) {
      try {
        const active: ActiveWorkout = JSON.parse(rawActive);
        if (active.userId === currentUser.id) {
          setActiveWorkout({...active,completedSets:Array.isArray(active.completedSets)?active.completedSets.filter(s=>s&&typeof s.exerciseId==='string'&&Number.isFinite(s.nilai)&&Number.isInteger(s.noSet)):[],exerciseIndex:Number.isInteger(active.exerciseIndex)?Math.max(0,active.exerciseIndex):0});
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
    const found = skillProgressList.find((p) => p && p.skillId === skillId);
    if (found) return found;
    return {
      userId: currentUser?.id || '',
      skillId,
      currentStage: 1,
      bestHoldSec: 0,
    };
  };

  const completeSkill = async (skillId:string,reopen=false) => {
    const actor=currentUser?.id;if(!actor)throw Error('Masuk terlebih dahulu.');
    const res=await fetch('/api/skills/progress',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({skillId,action:reopen?'reopen':'complete',confirmed:!reopen})});
    const result=await res.json();if(!res.ok)throw Error(result.error||'Status skill belum tersimpan.');await loadUserData(actor);
  };

  const updateSkillStage = async (skillId: string, stage: number) => {
    const res = await fetch('/api/skills/progress', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({skillId,currentStage:stage})});
    const result=await res.json();if(!res.ok)throw new Error(result.error || 'Progres gagal disimpan');
    await loadUserData(currentUser!.id);
  };

  const recommendation = recommendWorkouts({sessions,state:product,logs,stageFor:id=>getSkillProgress(id).currentStage,savedIds:library?.sessionIds})[0] || null;
  // Legacy consumers still receive a session; Home exposes no-match explicitly instead of claiming a match.
  const todaySession = recommendation?.session || sessions.find(s=>s.id==='s_legs_10') || sessions[0];

  const getSessionById = (id: string): WorkoutSession | undefined => {
    const session=sessions.find((s) => s.id === id);
    if(session?.skillId && session.stageNumber && session.stageNumber > getSkillProgress(session.skillId).currentStage) return undefined;
    return session;
  };

  const saveLibrary = async (durasi: number[], fokus: string[], sessionIds: string[]) => {
    if (!currentUser) return;
    const newLib: UserLibrary = {
      userId: currentUser.id,
      durasi,
      fokus,
      sessionIds,
    };
    const res = await fetch('/api/library', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({durasi,fokus,sessionIds})});
    const result=await res.json();if(!res.ok)throw new Error(result.error || 'Library gagal disimpan');
    setLibrary(newLib);
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
    if (!currentUser) throw new Error('Masuk terlebih dahulu.');
    const completionKey=activeWorkout?.mulai || logData.sessionId+':'+logData.tanggal;
    const res=await fetch('/api/workout-logs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:logData.sessionId,sessionName:logData.sessionNama,skillFocus:logData.skillFocus,durasiDetik:logData.durasiDetik,completionKey,sets:logData.setsCompleted.map(s=>({exerciseId:s.exerciseId,exerciseName:s.exerciseName,noSet:s.noSet,valueLogged:s.nilai,isIsometric:Boolean(s.isIsometric)}))})});
    const result=await res.json();if(!res.ok||!result.data?.id)throw new Error(result.error||'Latihan belum tersimpan. Coba lagi.');
    await loadUserData(currentUser.id);clearActiveWorkout();return result.data.id;
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
        recommendation,
        skillProgressList,
        getSkillProgress,
        updateSkillStage,
        completeSkill,
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
