import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

// GET /api/skills/progress - Ambil seluruh progres skill pengguna
export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Sesi tidak ditemukan' },
        { status: 401 }
      );
    }

    const progressList = await prisma.userSkillProgress.findMany({
      where: { userId: user.id },
      orderBy: { skillId: 'asc' },
    });

    return NextResponse.json({ success: true, data: progressList });
  } catch (error) {
    console.error('API GET /api/skills/progress error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/skills/progress - Update currentStage atau bestHoldSec
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
    const { skillId, currentStage, bestHoldSec } = body;

    if (!skillId) {
      return NextResponse.json(
        { error: 'skillId wajib disertakan' },
        { status: 400 }
      );
    }

    // Ambil data lama jika ada
    const existing = await prisma.userSkillProgress.findUnique({
      where: {
        userId_skillId: {
          userId: user.id,
          skillId,
        },
      },
    });

    const newStage = typeof currentStage === 'number' ? currentStage : existing?.currentStage ?? 1;
    const newBestHold = typeof bestHoldSec === 'number' 
      ? Math.max(bestHoldSec, existing?.bestHoldSec ?? 0)
      : existing?.bestHoldSec ?? 0;

    const updated = await prisma.userSkillProgress.upsert({
      where: {
        userId_skillId: {
          userId: user.id,
          skillId,
        },
      },
      update: {
        currentStage: newStage,
        bestHoldSec: newBestHold,
      },
      create: {
        userId: user.id,
        skillId,
        currentStage: newStage,
        bestHoldSec: newBestHold,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('API POST /api/skills/progress error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

