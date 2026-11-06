import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

// GET /api/library - Ambil preferensi library user yang sedang login
export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Sesi tidak ditemukan' },
        { status: 401 }
      );
    }

    let library = await prisma.userLibrary.findUnique({
      where: { userId: user.id },
    });

    // Jika user belum menyusun library, jangan auto-create default dummy
    if (!library) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    const durasiArray = Array.isArray(library.durasi)
      ? (library.durasi as string[]).map(Number)
      : [10, 15];

    return NextResponse.json({
      success: true,
      data: {
        ...library,
        durasi: durasiArray,
        fokus: ['Push', 'Legs', 'Skill Mastery'],
        sessionIds: ['s_lsit_1', 's1', 's_handstand_1', 's2'],
      },
    });
  } catch (error) {
    console.error('API GET /api/library error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/library - Simpan/Update preferensi library user
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
    const { durasi, skills } = body;

    const durasiStrings = Array.isArray(durasi) ? durasi.map(String) : ['10', '15'];
    const skillsList = Array.isArray(skills) ? skills : ['l-sit', 'handstand', 'elbow-lever'];

    const saved = await prisma.userLibrary.upsert({
      where: { userId: user.id },
      update: {
        durasi: durasiStrings,
        skills: skillsList,
      },
      create: {
        userId: user.id,
        durasi: durasiStrings,
        skills: skillsList,
      },
    });

    const savedDurasi = Array.isArray(saved.durasi)
      ? (saved.durasi as string[]).map(Number)
      : [10, 15];

    return NextResponse.json({
      success: true,
      data: {
        ...saved,
        durasi: savedDurasi,
        fokus: ['Push', 'Legs', 'Skill Mastery'],
        sessionIds: ['s_lsit_1', 's1', 's_handstand_1', 's2'],
      },
    });
  } catch (error) {
    console.error('API POST /api/library error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
