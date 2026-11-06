import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

// GET /api/workout-logs - Ambil riwayat log latihan user
export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Sesi tidak ditemukan' },
        { status: 401 }
      );
    }

    const logs = await prisma.workoutLog.findMany({
      where: { userId: user.id },
      include: {
        sets: {
          orderBy: { noSet: 'asc' },
        },
      },
      orderBy: { completedAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error('API GET /api/workout-logs error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/workout-logs - Simpan workout log baru beserta detail sets secara nested & perbarui skill progress
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Sesi tidak ditemukan' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { sessionId, sessionName, skillFocus, durasiDetik, streakCount, sets } = body;

    if (!sessionId || !sessionName || typeof durasiDetik !== 'number' || !Array.isArray(sets)) {
      return NextResponse.json(
        { error: 'Data tidak lengkap atau format tidak sesuai' },
        { status: 400 }
      );
    }

    // 1. Simpan Workout Log & Sets
    const newLog = await prisma.workoutLog.create({
      data: {
        userId: user.id,
        sessionId,
        sessionName,
        skillFocus: skillFocus || null,
        durasiDetik,
        streakCount: typeof streakCount === 'number' ? streakCount : 1,
        sets: {
          create: sets.map((s: {
            exerciseId: string;
            exerciseName?: string;
            noSet: number;
            nilai?: number;
            valueLogged?: number;
            isIsometric?: boolean;
          }) => ({
            exerciseId: s.exerciseId,
            exerciseName: s.exerciseName || 'Gerakan',
            noSet: s.noSet,
            valueLogged: s.valueLogged ?? s.nilai ?? 0,
            isIsometric: Boolean(s.isIsometric),
          })),
        },
      },
      include: {
        sets: {
          orderBy: { noSet: 'asc' },
        },
      },
    });

    // 2. Jika latihan fokus pada skill tertentu, perbarui rekor hold detik terbaik
    if (skillFocus) {
      // Cari hold detik maksimal dari sets yang isIsometric
      let maxHoldSec = 0;
      sets.forEach((s: any) => {
        if (s.isIsometric && (s.valueLogged || s.nilai)) {
          const val = Number(s.valueLogged || s.nilai || 0);
          if (val > maxHoldSec) maxHoldSec = val;
        }
      });

      if (maxHoldSec > 0) {
        const existingProgress = await prisma.userSkillProgress.findUnique({
          where: {
            userId_skillId: {
              userId: user.id,
              skillId: skillFocus,
            },
          },
        });

        if (existingProgress) {
          if (maxHoldSec > existingProgress.bestHoldSec) {
            await prisma.userSkillProgress.update({
              where: { id: existingProgress.id },
              data: { bestHoldSec: maxHoldSec },
            });
          }
        } else {
          await prisma.userSkillProgress.create({
            data: {
              userId: user.id,
              skillId: skillFocus,
              currentStage: 1,
              bestHoldSec: maxHoldSec,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, data: newLog }, { status: 201 });
  } catch (error) {
    console.error('API POST /api/workout-logs error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
