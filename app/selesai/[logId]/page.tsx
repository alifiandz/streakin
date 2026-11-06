'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Trophy,
  Flame,
  Clock,
  CheckCircle2,
  Bell,
  ArrowRight,
  Zap,
  Award,
  Sparkles,
  AlertCircle,
  Home,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWorkout } from '@/context/WorkoutContext';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { SafeImage } from '@/components/ui/SafeImage';

export default function WorkoutDonePage() {
  const params = useParams();
  const logId = (params?.logId as string) || '';
  const { currentUser } = useAuth();
  const { logs, streak, reminder } = useWorkout();

  const [dismissReminderOffer, setDismissReminderOffer] = useState(false);

  // Find the log
  const currentLog = logs.find((l) => l.id === logId);

  // Jika log spesifik tidak ditemukan di riwayat
  if (!currentLog) {
    return (
      <div className="min-h-[100dvh] bg-[#15171A] text-[#EEF1F4] flex flex-col items-center justify-center p-4 text-center select-none">
        <div className="w-16 h-16 rounded-2xl bg-[#FF7A03]/15 border border-[#FF7A03]/30 flex items-center justify-center text-[#FF7A03] mb-4 shadow-lg">
          <AlertCircle className="w-8 h-8 stroke-[2.2]" />
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-[#EEF1F4] mb-2">
          Data Sesi Tidak Ditemukan
        </h1>
        <p className="text-xs sm:text-sm text-[#8A929C] max-w-sm mb-6 leading-relaxed">
          Log latihan dengan ID ini belum tercatat atau sudah dibersihkan. Yuk kembali ke beranda atau lihat rekap riwayatmu.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <Link
            href="/home"
            className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-[#FF7A03] hover:bg-[#E66E00] text-[#15171A] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#FF7A03]/20 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <Link
            href="/riwayat"
            className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-[#23272D] border border-[#2E3238] text-[#8A929C] hover:text-[#EEF1F4] text-xs font-semibold flex items-center justify-center active:scale-95 transition-all"
          >
            <span>Lihat Riwayat Latihan</span>
          </Link>
        </div>
      </div>
    );
  }

  const totalSets = currentLog ? currentLog.setsCompleted.length : 0;
  const totalReps = currentLog
    ? currentLog.setsCompleted.reduce((sum, s) => sum + (s.nilai || 0), 0)
    : 0;
  const durationMinutes = currentLog
    ? Math.max(1, Math.round(currentLog.durasiDetik / 60))
    : 15;

  // Cek hold detik terbaik di log ini
  const maxHoldInLog = currentLog
    ? Math.max(
        ...currentLog.setsCompleted
          .filter((s) => s.isIsometric)
          .map((s) => s.nilai),
        0
      )
    : 0;

  // Show reminder offer only if user hasn't set reminder yet
  const showReminderPrompt = !reminder.aktif && !dismissReminderOffer;

  return (
    <div className="min-h-[100dvh] bg-[#15171A] text-[#EEF1F4] py-4 sm:py-8 overflow-x-hidden">
      <MobileContainer maxWidth="xl" withBottomNav={false}>
        {/* Celebration Header */}
        <div className="text-center mb-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="relative inline-block mb-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#FF7A03]/10 border-2 border-[#FF7A03]/30 flex items-center justify-center p-2 mx-auto shadow-2xl shadow-[#FF7A03]/30 overflow-hidden">
              <SafeImage
                src="/images/mascot/ppt-celebrate.png"
                alt="Maskot Selebrasi Latihan StreakIn"
                aspectRatioClass="w-full h-full"
                className="w-full h-full object-contain"
                fallbackType="mascot"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FF7A03] text-[#15171A] flex items-center justify-center font-bold text-xs shadow-md">
              ✓
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#EEF1F4]">
            Latihan Selesai! 🎉
          </h1>
          <p className="text-xs sm:text-sm text-[#8A929C] mt-1">
            Kerja bagus, {currentUser?.nama || 'Kawan'}! Satu sesi lebih dekat menuju postur kokoh & skill kalistenik impian.
          </p>
        </div>

        {/* 2x2 Performance Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-3.5">
          <div className="card-surface p-3.5 sm:p-4 border-[#2E3238]">
            <div className="flex items-center gap-1.5 text-xs text-[#8A929C] mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Total Waktu</span>
            </div>
            <div className="text-lg sm:text-2xl font-extrabold text-[#EEF1F4]">
              {durationMinutes} Menit
            </div>
            <span className="text-[10px] text-[#8A929C]">Durasi Selesai</span>
          </div>

          <div className="card-surface p-3.5 sm:p-4 border-[#2E3238]">
            <div className="flex items-center gap-1.5 text-xs text-[#8A929C] mb-1">
              <Zap className="w-3.5 h-3.5 text-[#FF7A03]" />
              <span>Program</span>
            </div>
            <div className="text-lg sm:text-2xl font-extrabold text-[#EEF1F4] truncate">
              {currentLog?.sessionNama || 'Kalistenik'}
            </div>
            <span className="text-[10px] text-[#8A929C] truncate block">
              {currentLog?.skillFocus ? `Skill: ${currentLog.skillFocus.toUpperCase()}` : 'Target Sesi'}
            </span>
          </div>

          <div className="card-surface p-3.5 sm:p-4 border-[#2E3238]">
            <div className="flex items-center gap-1.5 text-xs text-[#8A929C] mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FF7A03]" />
              <span>Set Tuntas</span>
            </div>
            <div className="text-lg sm:text-2xl font-extrabold text-[#EEF1F4]">
              {totalSets} Set
            </div>
            <span className="text-[10px] text-[#8A929C]">100% Tercapai</span>
          </div>

          <div className="card-surface p-3.5 sm:p-4 border-[#2E3238]">
            <div className="flex items-center gap-1.5 text-xs text-[#8A929C] mb-1">
              <Flame className="w-3.5 h-3.5 text-[#FF7A03]" />
              <span>Total Reps / Detik</span>
            </div>
            <div className="text-lg sm:text-2xl font-extrabold text-[#EEF1F4]">
              {totalReps}
            </div>
            <span className="text-[10px] text-[#FF7A03] font-semibold">Kontraksi Efektif</span>
          </div>
        </div>

        {/* Isometric Personal Best Highlight (If applicable) */}
        {maxHoldInLog > 0 && (
          <div className="card-surface p-3.5 sm:p-4 mb-3.5 border-[#FF7A03]/40 bg-gradient-to-r from-[#23272D] to-[#1E2227] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FF7A03]/20 text-[#FF7A03] flex items-center justify-center font-bold">
                🔥
              </div>
              <div>
                <span className="text-xs font-bold text-[#FF7A03] uppercase tracking-wider block">
                  Rekor Tahanan (Isometric Hold)
                </span>
                <p className="text-[11px] text-[#8A929C]">Hold terlama pada sesi latihan ini</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-extrabold text-[#FF7A03] font-mono">
                {maxHoldInLog}s
              </span>
              <span className="text-[10px] text-[#FF7A03] block font-semibold">Tersimpan!</span>
            </div>
          </div>
        )}

        {/* Streak Booster Card */}
        <div className="card-surface p-4 sm:p-5 mb-4 border-[#2E3238] bg-gradient-to-br from-[#23272D] to-[#15171A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#FF7A03]/20 text-[#FF7A03] flex items-center justify-center">
                <Flame className="w-5 h-5 fill-[#FF7A03]" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-[#EEF1F4]">
                  Streak {streak} Hari 🔥
                </h3>
                <p className="text-xs text-[#8A929C]">
                  Disiplin konsisten di sela tugas sekolah!
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FF7A03] text-[#15171A]">
              +1 Hari
            </span>
          </div>
        </div>

        {/* First Time Reminder Offer */}
        {showReminderPrompt && (
          <div className="card-surface p-3.5 sm:p-4 mb-5 border-[#2E3238] bg-[#23272D]/80">
            <div className="flex items-start gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FF7A03]/20 text-[#FF7A03] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[#EEF1F4]">
                  Mau diingatkan latihan harian di jam santai sekolah?
                </h4>
                <p className="text-xs text-[#8A929C] mt-0.5">
                  Biar kamu tetap konsisten dan nggak kelewat saat tugas menumpuk.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/notifikasi"
                className="btn-brand min-h-[44px] px-4 py-2 text-xs font-bold flex-1 flex items-center justify-center active:scale-95 transition-all"
              >
                Atur Pengingat
              </Link>
              <button
                type="button"
                onClick={() => setDismissReminderOffer(true)}
                className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold text-[#8A929C] hover:text-[#EEF1F4] flex items-center justify-center transition-colors"
              >
                Nanti Saja
              </button>
            </div>
          </div>
        )}

        {/* Action CTAs - Area sentuh min 48px */}
        <div className="space-y-2">
          <Link
            href="/skills"
            className="w-full btn-brand min-h-[48px] py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#FF7A03]/20 active:scale-98 transition-all"
          >
            <Award className="w-4 h-4" />
            <span>Lihat Progres di Katalog Skill</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
          <Link
            href="/riwayat"
            className="w-full btn-outline min-h-[48px] py-3 text-sm font-semibold flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <span>Lihat Riwayat Latihan</span>
          </Link>
          <Link
            href="/home"
            className="w-full min-h-[44px] flex items-center justify-center text-xs text-[#8A929C] hover:text-[#EEF1F4] transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </MobileContainer>
    </div>
  );
}
