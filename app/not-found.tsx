import React from 'react';
import Link from 'next/link';
import { Compass, Home, Award } from 'lucide-react';
import { MobileContainer } from '@/components/layout/MobileContainer';

export default function NotFoundPage() {
  return (
    <div className="min-h-[100dvh] bg-[#15171A] text-[#EEF1F4] flex flex-col justify-center py-12">
      <MobileContainer maxWidth="xl" withBottomNav={false}>
        <div className="card-surface p-6 sm:p-8 max-w-md mx-auto text-center border-[#2E3238] shadow-2xl">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#FF7A03]/10 border border-[#FF7A03]/30 flex items-center justify-center text-[#FF7A03] mx-auto mb-4 shadow-lg shadow-[#FF7A03]/10">
            <Compass className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.2] animate-spin-slow" />
          </div>

          <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF7A03] block mb-1">
            404 • Halaman Tersesat
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#EEF1F4] mb-2">
            Rute Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-[#8A929C] mb-6 leading-relaxed">
            Sepertinya kamu keluar dari jalur latihan nih, kawan. Halaman yang kamu tuju belum ada atau sudah dipindahkan.
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <Link
              href="/home"
              className="flex-1 btn-brand min-h-[48px] py-3 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#FF7A03]/20 active:scale-95 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Ke Beranda</span>
            </Link>
            <Link
              href="/skills"
              className="flex-1 btn-outline min-h-[48px] py-3 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Award className="w-4 h-4 text-[#FF7A03]" />
              <span>Roadmap Skill</span>
            </Link>
          </div>
        </div>
      </MobileContainer>
    </div>
  );
}

