export interface User {
  id: string;
  nama: string;
  email: string;
  kataSandi?: string;
}

export interface SkillStage {
  stageNumber: number; // 1 to 5
  nama: string;
  deskripsi: string;
  targetHoldSec: number;
  targetSets: number;
  syaratLulus: string;
  langkah: string[];
  kesalahanUmum: string[];
  tipsAman: string;
  lebihMudah: string;
  lebihSulit: string;
  imageUrl?: string;
}

export interface Skill {
  id: string; // 'l-sit', 'handstand', 'front-lever'
  nama: string;
  kategori: string;
  level: 'Pemula' | 'Menengah' | 'Lanjutan';
  badgeColor: string;
  deskripsi: string;
  manfaatSiswa: string;
  durasiMingguEstimasi: string;
  stages: SkillStage[];
}

export interface UserSkillProgress {
  id?: string;
  userId: string;
  skillId: string;
  currentStage: number; // 1 to 5
  bestHoldSec: number; // detik
  updatedAt?: string;
}

export interface Exercise {
  id: string;
  nama: string;
  area: string;
  targetDefault: string; // e.g. "3 x 8" or "3 x 20 dtk"
  langkah: string[];
  kesalahanUmum: string[];
  lebihMudah: string;
  lebihSulit: string;
  mediaPlaceholder?: string;
  imageUrl?: string;
  isTimeBased?: boolean;
}

export interface SessionExercise {
  exerciseId: string;
  exerciseName?: string;
  sets: number;
  target: number; // reps count or seconds
  unit: 'reps' | 'detik';
  istirahatDetik: number;
  isIsometric?: boolean;
}

export interface WorkoutSession {
  id: string;
  nama: string;
  durasiMenit: number;
  fokus: 'Push' | 'Legs' | 'Pull dan core' | 'Full body' | 'Skill Mastery' | string;
  skillId?: string;
  stageNumber?: number;
  exercises: SessionExercise[];
}

export interface UserLibrary {
  userId: string;
  durasi: number[]; // e.g. [10, 15]
  fokus: string[];  // e.g. ["Push", "Full body"]
  sessionIds: string[];
  skills?: string[];
}

export interface CompletedSet {
  exerciseId: string;
  exerciseName?: string;
  noSet: number;
  nilai: number; // reps or seconds
  selesai: boolean;
  isIsometric?: boolean;
}

export interface ActiveWorkout {
  userId: string;
  sessionId: string;
  mulai: string; // ISO string
  exerciseIndex: number;
  completedSets: CompletedSet[];
}

export interface WorkoutLog {
  id: string;
  userId: string;
  sessionId: string;
  sessionNama: string;
  skillFocus?: string | null;
  tanggal: string; // YYYY-MM-DD
  durasiDetik: number;
  streakCount?: number;
  setsCompleted: CompletedSet[];
}

export interface ReminderSetting {
  userId: string;
  aktif: boolean;
  jam: string; // "16:00"
}
