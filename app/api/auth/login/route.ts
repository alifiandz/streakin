import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SESSION_COOKIE_NAME, createSessionToken } from '@/lib/session';
import { verifyPassword, hashPassword } from '@/lib/password';

export async function POST(req: NextRequest) {
  try {
    const { email, kataSandi } = await req.json();

    if (!email || !kataSandi) {
      return NextResponse.json(
        { error: 'Email dan kata sandi wajib diisi' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (!user || !verifyPassword(kataSandi, user.kataSandi)) {
      return NextResponse.json(
        { error: 'Email atau kata sandi salah' },
        { status: 401 }
      );
    }

    // Auto-upgrade password lama ke format hash jika sebelumnya plain text
    if (user.kataSandi && !user.kataSandi.includes(':')) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { kataSandi: hashPassword(kataSandi) },
        });
      } catch (upgradeErr) {
        console.warn('Gagal upgrade password lama ke hash:', upgradeErr);
      }
    }

    const payload = {
      userId: user.id,
      email: user.email,
      nama: user.nama,
    };

    const token = createSessionToken(payload);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nama: user.nama,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 hari
    });

    return response;
  } catch (error) {
    console.error('Error login:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}
