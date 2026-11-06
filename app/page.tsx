'use client';

import React, { useEffect } from 'react';
import {LandingSections} from '@/prototype/components/LandingSections';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
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
      <MobileContainer maxWidth="6xl" withBottomNav={false}>
        {/* Hero Section */}
        <section id="landing-hero" aria-labelledby="landing-title" className="min-h-[calc(100svh-4rem)] flex flex-col justify-center pt-10 pb-12 sm:pt-14 sm:pb-16 text-center max-w-2xl mx-auto px-1">
          {/* Sapaan Pelajar SMA/SMK */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--card)] border border-[var(--line)] text-xs font-semibold text-[#FF7A03] mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Kawan latihan kalistenik buat anak SMA / SMK</span>
          </div>

          {/* Headline Utama */}
          <h1 id="landing-title" className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.2] text-[var(--text)] mb-3 sm:mb-4">
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
        </section>

        <LandingSections/>
      </MobileContainer>
    </div>
  );
}
