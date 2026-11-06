'use server';

import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/session';

export interface SetLogItemInput {
  exerciseId: string;
  exerciseName?: string;
  noSet: number;
  valueLogged: number;
  isIsometric?: boolean;
}

export interface CreateWorkoutLogInput {
  sessionId: string;
  sessionName: string;
  skillFocus?: string;
  durasiDetik: number;
  streakCount?: number;
  sets: SetLogItemInput[];
}

// 1. getSkillProgressList: Ambil daftar progres skill untuk user yang aktif
export async function getSkillProgressList() {
  try {
    const user = await getSessionUser();
    if (!user) return { success: false, error: 'Belum terautentikasi' };

    const progress = await prisma.userSkillProgress.findMany({
      where: { userId: user.id },
    });

    return { success: true, data: progress };
  } catch (error) {
    console.error('Error getSkillProgressList:', error);
    return { success: false, error: 'Gagal memuat progres skill' };
  }
}

// 2. updateSkillStageAndHold: Perbarui stage dan rekor hold detik
export async function updateSkillStageAndHold(skillId: string, stage: number, holdSec?: number) {
  try {
    const user = await getSessionUser();
    if (!user) return { success: false, error: 'Belum terautentikasi' };

    const existing = await prisma.userSkillProgress.findUnique({
      where: {
        userId_skillId: {
          userId: user.id,
          skillId,
        },
      },
    });

    const newBest = typeof holdSec === 'number'
      ? Math.max(holdSec, existing?.bestHoldSec ?? 0)
      : existing?.bestHoldSec ?? 0;

    const updated = await prisma.userSkillProgress.upsert({
      where: {
        userId_skillId: {
          userId: user.id,
          skillId,
        },
      },
      update: {
        currentStage: stage,
        bestHoldSec: newBest,
      },
      create: {
        userId: user.id,
        skillId,
        currentStage: stage,
        bestHoldSec: newBest,
      },
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error('Error updateSkillStageAndHold:', error);
    return { success: false, error: 'Gagal memperbarui stage skill' };
  }
}

// 3. createWorkoutLog: Simpan sesi latihan selesai dan detail set
export async function createWorkoutLog(input: CreateWorkoutLogInput) {
  try {
    const user = await getSessionUser();
    if (!user) return { success: false, error: 'Belum terautentikasi' };

    const workoutLog = await prisma.workoutLog.create({
      data: {
        userId: user.id,
        sessionId: input.sessionId,
        sessionName: input.sessionName,
        skillFocus: input.skillFocus || null,
        durasiDetik: input.durasiDetik,
        streakCount: input.streakCount ?? 1,
        sets: {
          create: input.sets.map((set) => ({
            exerciseId: set.exerciseId,
            exerciseName: set.exerciseName || 'Gerakan',
            noSet: set.noSet,
            valueLogged: set.valueLogged,
            isIsometric: Boolean(set.isIsometric),
          })),
        },
      },
      include: {
        sets: {
          orderBy: {
            noSet: 'asc',
          },
        },
      },
    });

    // Update best hold jika ada latihan isometrik skill
    if (input.skillFocus) {
      const maxHold = Math.max(...input.sets.filter((s) => s.isIsometric).map((s) => s.valueLogged), 0);
      if (maxHold > 0) {
        await updateSkillStageAndHold(input.skillFocus, 1, maxHold);
      }
    }

    return { success: true, data: workoutLog };
  } catch (error) {
    console.error('Error createWorkoutLog:', error);
    return { success: false, error: 'Gagal mencatat latihan' };
  }
}

// 4. getWorkoutHistory: Ambil riwayat latihan terurut terbaru
export async function getWorkoutHistory() {
  try {
    const user = await getSessionUser();
    if (!user) return { success: false, error: 'Belum terautentikasi' };

    const history = await prisma.workoutLog.findMany({
      where: { userId: user.id },
      include: {
        sets: {
          orderBy: {
            noSet: 'asc',
          },
        },
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    return { success: true, data: history };
  } catch (error) {
    console.error('Error getWorkoutHistory:', error);
    return { success: false, error: 'Gagal memuat riwayat latihan' };
  }
}
