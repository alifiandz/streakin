'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Zap,
  Clock,
  Award,
  Timer,
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { MobileContainer } from '@/components/layout/MobileContainer';

export default function LandingPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  // If already logged in, redirect immediately to dashboard (/home)
  useEffect(() => {
    if (!loading && currentUser) {
      router.replace('/home');
    }
  }, [currentUser, loading, router]);

  // Prevent flash of landing page while checking auth state or if user is logged in
  if (loading || currentUser) {
    return (
      <div className="min-h-[100dvh] bg-[var(--bg)] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-[#FF7A03] flex items-center justify-center text-[#15171A] shadow-lg shadow-[#FF7A03]/20 animate-pulse mb-3">
          <Zap className="w-6 h-6 fill-current stroke-[#15171A]" />
        </div>
        <p className="text-sm font-medium text-[var(--text-sub)] animate-pulse">
          Menyiapkan dashboard StreakIn kamu...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[var(--bg)] text-[var(--text)] transition-colors overflow-x-hidden">
      <MobileContainer maxWidth="4xl" withBottomNav={false}>
        {/* Hero Section */}
        <div className="pt-4 sm:pt-10 pb-8 text-center max-w-2xl mx-auto px-1">
          {/* Sapaan Pelajar SMA/SMK */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--card)] border border-[var(--line)] text-xs font-semibold text-[#FF7A03] mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Kawan latihan kalistenik buat anak SMA / SMK</span>
          </div>

          {/* Headline Utama */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.2] text-[var(--text)] mb-3 sm:mb-4">
            Latihan kalistenik,{' '}
            <span className="text-[#FF7A03]">pas di sela jadwal padatmu</span>
          </h1>

          {/* Subheadline Kasual & Suportif */}
          <p className="text-xs sm:text-base text-[var(--text-sub)] leading-relaxed mb-6 max-w-xl mx-auto">
            Tanpa alat gym, tanpa alur ribet. Cukup 10–30 menit sepulang sekolah atau di sela tugas, bangun postur tegap dan jaga konsistensi streak bareng kawan latihanmu.
          </p>

          {/* Satu Ajakan Utama (Primary CTA) */}
          <div className="flex flex-col items-center justify-center gap-2.5 w-full max-w-md mx-auto">
            <Link
              href="/akun?tab=register"
              className="w-full btn-brand min-h-[50px] py-3.5 px-6 text-sm sm:text-base font-bold shadow-lg shadow-[#FF7A03]/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <span>Mulai Latihan Sekarang</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </Link>

            {/* Micro-trust & Opsi Masuk - Touch target min 44px */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-[var(--text-sub)] mt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF7A03]" />
                Gratis • Tanpa alat • Ada akun demo
              </span>
              <span className="hidden sm:inline text-[var(--line)]">•</span>
              <Link
                href="/akun?tab=login"
                className="min-h-[44px] px-2 flex items-center text-[#FF7A03] hover:underline font-semibold"
              >
                Sudah punya akun? Masuk
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Fitur Utama StreakIn */}
        <div className="my-4 sm:my-8">
          <div className="text-center mb-5">
            <h2 className="text-lg sm:text-2xl font-bold text-[var(--text)]">
              Kenapa Latihan Bareng StreakIn?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-sub)] mt-0.5">
              Didesain khusus buat mengatasi mager dan padatnya jam sekolah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
            {/* Fitur 1: Peta Jalan 5 Stage */}
            <div className="card-surface p-4 sm:p-5 flex flex-col justify-between border-[var(--line)] hover:border-[#FF7A03]/50 transition-all">
              <div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FF7A03]/15 text-[#FF7A03] flex items-center justify-center mb-3">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[var(--text)] mb-1.5">
                  Peta Jalan Skill 5 Stage
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-sub)] leading-relaxed">
                  Bukan asal coba. Progres terstruktur 5 stage dari nol sampai kuasai skill impianmu: L-Sit, Handstand, dan Front Lever secara aman tanpa takut cedera.
                </p>
              </div>
              <div className="mt-3.5 pt-2.5 border-t border-[var(--line)] flex items-center gap-1.5 text-[11px] font-semibold text-[#FF7A03]">
                <span>5 tahap bertahap</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span>Tanpa loncat level</span>
              </div>
            </div>

            {/* Fitur 2: Fleksibel 10/15/30 Menit */}
            <div className="card-surface p-4 sm:p-5 flex flex-col justify-between border-[var(--line)] hover:border-[#FF7A03]/50 transition-all">
              <div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FF7A03]/15 text-[#FF7A03] flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[var(--text)] mb-1.5">
                  Waktu Fleksibel (10, 15, 30m)
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-sub)] leading-relaxed">
                  Lagi padat ujian atau tugas kelompok? Pilih sesi 10 menit. Lagi luang? Ambil 30 menit. Berapa pun durasimu, tetap terhitung streak konsistensi!
                </p>
              </div>
              <div className="mt-3.5 pt-2.5 border-t border-[var(--line)] flex items-center gap-1.5 text-[11px] font-semibold text-[#FF7A03]">
                <Flame className="w-3.5 h-3.5" />
                <span>Streak terjaga tiap hari</span>
              </div>
            </div>

            {/* Fitur 3: Smart Timer Kalistenik */}
            <div className="card-surface p-4 sm:p-5 flex flex-col justify-between border-[var(--line)] hover:border-[#FF7A03]/50 transition-all">
              <div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FF7A03]/15 text-[#FF7A03] flex items-center justify-center mb-3">
                  <Timer className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[var(--text)] mb-1.5">
                  Isometric & Rest Timer
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-sub)] leading-relaxed">
                  Isometric Hold Timer otomatis mencatat rekor tahanan detikmu. Begitu set tuntas, Rest Timer 45 detik langsung jalan biar nggak kebablasan scroll medsos.
                </p>
              </div>
              <div className="mt-3.5 pt-2.5 border-t border-[var(--line)] flex items-center gap-1.5 text-[11px] font-semibold text-[#FF7A03]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Istirahat 45s presisi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pratinjau Sesi Hari Ini (Teaser Sederhana) */}
        <div className="my-6 sm:my-8">
          <div className="card-surface p-4 sm:p-6 relative overflow-hidden max-w-xl mx-auto border-[var(--line)] shadow-xl">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FF7A03]/15 text-[#FF7A03] border border-[#FF7A03]/30">
                <span className="w-2 h-2 rounded-full bg-[#FF7A03] animate-ping" />
                Contoh Sesi Hari Ini
              </span>
              <span className="text-[11px] font-semibold text-[var(--text-sub)] bg-[var(--bg)] px-2.5 py-1 rounded-lg border border-[var(--line)]">
                15 Menit • Push
              </span>
            </div>

            <div className="mb-3.5">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--text)] mb-1">
                Push 15 (Dada & Trisep)
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-sub)]">
                Bantu memperbaiki postur bungkuk sehabis duduk seharian di kelas. Aman di kamar tanpa suara hentakan.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div className="bg-[var(--bg)] border border-[var(--line)] p-2.5 rounded-xl flex items-center justify-between">
                <span className="font-semibold text-[var(--text)]">Push-up</span>
                <span className="text-[11px] text-[var(--text-sub)]">3 × 8 reps</span>
              </div>
              <div className="bg-[var(--bg)] border border-[var(--line)] p-2.5 rounded-xl flex items-center justify-between">
                <span className="font-semibold text-[var(--text)]">Incline Push-up</span>
                <span className="text-[11px] text-[var(--text-sub)]">3 × 10 reps</span>
              </div>
              <div className="bg-[var(--bg)] border border-[var(--line)] p-2.5 rounded-xl flex items-center justify-between">
                <span className="font-semibold text-[var(--text)]">Dead Bug</span>
                <span className="text-[11px] text-[var(--text-sub)]">3 × 8 reps</span>
              </div>
              <div className="bg-[var(--bg)] border border-[var(--line)] p-2.5 rounded-xl flex items-center justify-between">
                <span className="font-semibold text-[var(--text)]">Plank</span>
                <span className="text-[11px] text-[var(--text-sub)]">3 × 30 dtk</span>
              </div>
            </div>

            <Link
              href="/akun?tab=register"
              className="w-full btn-brand min-h-[48px] py-3 text-sm font-bold flex items-center justify-center gap-2 group active:scale-98 transition-all"
            >
              <Play className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
              <span>Coba Sesi Ini Gratis</span>
            </Link>
          </div>
        </div>

        {/* Catatan Keselamatan */}
        <div className="mt-8 p-3.5 sm:p-4 rounded-xl bg-[var(--card)]/60 border border-[var(--line)] text-center max-w-xl mx-auto">
          <p className="text-xs text-[var(--text-sub)] leading-relaxed">
            ⚠️ <span className="font-semibold text-[var(--text)]">Catatan Kawan:</span> Dengarkan kondisi tubuhmu ya. Kalau sendi terasa nyeri berlebihan, istirahat dulu. StreakIn ditujukan untuk kebugaran mandiri pelajar, bukan pengganti anjuran medis.
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-10 pt-5 pb-6 border-t border-[var(--line)] text-center text-xs text-[var(--text-sub)]">
          <p className="flex items-center justify-center gap-1.5 mb-1">
            <Zap className="w-3.5 h-3.5 text-[#FF7A03]" />
            <span className="font-semibold text-[var(--text)]">StreakIn</span> — Kawan kalistenik pelajar produktif.
          </p>
          <p>© 2026 StreakIn. Semua hak dilindungi.</p>
        </footer>
      </MobileContainer>
    </div>
  );
}
