'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Play,
  Flame,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Award,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWorkout } from '@/context/WorkoutContext';
import { SEED_EXERCISES } from '@/src/data/seedExercises';
import { SEED_SKILLS } from '@/lib/seedData';
import { getStreak7Days } from '@/src/utils/storage';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { SafeImage } from '@/components/ui/SafeImage';

export default function HomePage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const {
    library,
    activeWorkout,
    todaySession,
    streak,
    logs,
    getSessionById,
    getSkillProgress,
  } = useWorkout();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const streakDays = getStreak7Days(logs);

  // Periksa apakah user sudah menyusun library latihannya
  const hasCustomizedLibrary = Boolean(library && library.sessionIds && library.sessionIds.length > 0);

  // Active workout session name if any
  const activeSession = activeWorkout ? getSessionById(activeWorkout.sessionId) : null;

  // Resolve exercise names for today's session (hanya jika ada sesi hari ini)
  const todayExerciseItems = todaySession?.exercises
    ? todaySession.exercises.map((se) => {
        const ex = SEED_EXERCISES.find((e) => e.id === se.exerciseId);
        return {
          nama: ex?.nama || 'Gerakan',
          target: `${se.sets} × ${se.target} ${se.unit}`,
        };
      })
    : [];

  return (
    <div className="min-h-[100dvh] bg-[#15171A] text-[#EEF1F4] overflow-x-hidden">
      <MobileContainer maxWidth="6xl">
        {/* User Greeting Header - padat & personal */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#EEF1F4]">
              Halo, {mounted && currentUser?.nama ? currentUser.nama : 'Kawan'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#8A929C] mt-0.5">
              Siap produktif & bugar di sela jadwal sekolah hari ini.
            </p>
          </div>
        </div>

        {/* Kondisi Jika User Baru Belum Memiliki Library / Belum Customize */}
        {!hasCustomizedLibrary ? (
          <div className="py-6 sm:py-10 max-w-xl mx-auto">
            <div className="card-surface p-6 sm:p-8 border-[#2E3238] rounded-2xl relative overflow-hidden shadow-2xl text-center">
              {/* Soft glow background */}
              <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-48 bg-[#FF7A03]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 p-1 rounded-2xl bg-[#FF7A03]/10 border border-[#FF7A03]/30 flex items-center justify-center">
                <SafeImage
                  src="/images/mascot/ppt-welcome.png"
                  alt="Selamat Datang di StreakIn"
                  aspectRatioClass="w-14 h-14 sm:w-16 sm:h-16"
                  className="w-full h-full object-contain"
                  fallbackType="mascot"
                />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FF7A03]/15 text-[#FF7A03] border border-[#FF7A03]/30 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Selamat Datang di StreakIn!</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[#EEF1F4] mb-2">
                Program Latihan Belum Disusun
              </h2>

              <p className="text-xs sm:text-sm text-[#8A929C] leading-relaxed mb-6 max-w-md mx-auto">
                Yuk atur durasi latihan (10, 15, atau 30 menit) dan fokus gerakan yang paling pas dengan jadwal sekolah dan istirahatmu.
              </p>

              {/* Tombol Utama Kustomisasi Latihan */}
              <Link
                href="/library"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl btn-brand text-sm sm:text-base font-bold shadow-lg shadow-[#FF7A03]/25 active:scale-98 transition-all min-h-[50px]"
              >
                <Sparkles className="w-5 h-5 fill-current" />
                <span>Mulai Kustomisasi Latihan</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Conditional Interrupted Workout Recovery Banner */}
            {mounted && activeWorkout && (
              <div className="mb-4 sm:mb-5 p-3.5 sm:p-4 rounded-2xl bg-[#FF7A03]/10 border border-[#FF7A03]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF7A03]/20 border border-[#FF7A03]/30 text-[#FF7A03] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <RotateCcw className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FF7A03] animate-ping" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF7A03]">
                        Latihan Belum Selesai
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-[#EEF1F4] mt-0.5">
                      Sesi: {activeSession?.nama || 'Sesi Latihan'}
                    </h3>
                    <p className="text-xs text-[#8A929C]">
                      Progres tersimpan rapi. Yuk lanjutkan set latihanmu!
                    </p>
                  </div>
                </div>

                <Link
                  href={`/latihan/${activeWorkout.sessionId}`}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FF7A03] hover:bg-[#E66E00] text-[#15171A] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all flex-shrink-0 select-none"
                >
                  <span>Lanjutkan Latihan</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
              {/* Main Hero Card: Sesi Hari Ini */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-5">
                <div className="card-surface p-4 sm:p-6 border-[#2E3238] relative overflow-hidden shadow-xl">
                  {/* Soft glow */}
                  <div className="absolute top-0 right-0 w-44 h-44 bg-[#FF7A03]/5 rounded-full blur-3xl pointer-events-none" />

                  {/* Status Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FF7A03]/15 text-[#FF7A03] border border-[#FF7A03]/30">
                      <span className="w-2 h-2 rounded-full bg-[#FF7A03]" />
                      Sesi Hari Ini • {todaySession?.durasiMenit || 15} Menit • {todaySession?.fokus || 'Full Body'}
                    </span>
                    <Link
                      href="/library"
                      className="min-h-[44px] px-2 flex items-center text-xs text-[#8A929C] hover:text-[#FF7A03] transition-colors"
                    >
                      Ganti Sesi →
                    </Link>
                  </div>

                  {/* Title & Desc */}
                  <div className="mb-4">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#EEF1F4] mb-1">
                      {todaySession?.nama || 'Sesi Latihan'}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#8A929C] leading-relaxed">
                      Rangkaian gerakan cepat ramah kamar kos untuk memperkuat postur tubuh tegak setelah seharian belajar di meja sekolah.
                    </p>
                  </div>

                  {/* Exercise List Preview */}
                  <div className="mb-5">
                    <div className="text-[11px] font-bold text-[#8A929C] uppercase tracking-wider mb-2">
                      Daftar Gerakan Target:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {todayExerciseItems.map((ex, idx) => (
                        <div
                          key={idx}
                          className="bg-[#15171A] border border-[#2E3238] px-3 py-2 rounded-xl flex items-center justify-between text-xs"
                        >
                          <span className="font-semibold text-[#EEF1F4]">{ex.nama}</span>
                          <span className="text-[#8A929C] text-[11px]">{ex.target}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Big Single-Click CTA - Area sentuh prima min 50px */}
                  {todaySession && (
                    <button
                      type="button"
                      onClick={() => router.push(`/latihan/${todaySession.id}`)}
                      className="w-full btn-brand min-h-[50px] py-3.5 text-sm sm:text-base font-bold shadow-lg shadow-[#FF7A03]/20 flex items-center justify-center gap-2 group cursor-pointer active:scale-98 transition-all"
                    >
                      <Play className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
                      <span>Mulai Latihan Sekarang</span>
                    </button>
                  )}
                </div>

                {/* Skill Evolution Engine Section */}
                <div className="card-surface p-4 sm:p-5 border-[#2E3238]">
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#FF7A03]/15 border border-[#FF7A03]/30 text-[#FF7A03] flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm sm:text-base text-[#EEF1F4] flex items-center gap-1.5">
                          <span>Peta Jalan 5 Stage</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FF7A03]/15 text-[#FF7A03] border border-[#FF7A03]/30 hidden sm:inline-block">
                            3 Skill
                          </span>
                        </h3>
                        <p className="text-[11px] text-[#8A929C]">Progresi bertahap dari nol sampai mahir</p>
                      </div>
                    </div>
                    <Link
                      href="/skills"
                      className="min-h-[44px] px-2 flex items-center gap-1 text-xs font-bold text-[#FF7A03] hover:underline flex-shrink-0"
                    >
                      <span>Lihat Semua</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {SEED_SKILLS.map((skill) => {
                      const userProg = getSkillProgress(skill.id);
                      const stageNum = userProg.currentStage || 1;
                      const stageData =
                        skill.stages.find((s) => s.stageNumber === stageNum) || skill.stages[0];
                      const percent = Math.round((stageNum / skill.stages.length) * 100);

                      return (
                        <div
                          key={skill.id}
                          className="p-3 rounded-xl bg-[#15171A] border border-[#2E3238] flex flex-col justify-between hover:border-[#8A929C] transition-all"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#23272D] text-[#FF7A03]">
                                Stage {stageNum}/5
                              </span>
                              <span className="text-[10px] font-bold text-[#FF7A03] flex items-center gap-0.5">
                                <Flame className="w-3 h-3 fill-[#FF7A03]" />
                                PB: {userProg.bestHoldSec || 0}s
                              </span>
                            </div>

                            <h4 className="font-bold text-xs sm:text-sm text-[#EEF1F4] mb-0.5 truncate">
                              {skill.nama}
                            </h4>
                            <p className="text-[11px] text-[#8A929C] truncate mb-2">
                              {stageData.nama}
                            </p>

                            {/* Progress Bar */}
                            <div className="w-full h-1.5 bg-[#23272D] rounded-full overflow-hidden mb-2.5">
                              <div
                                className="h-full bg-[#FF7A03] rounded-full transition-all duration-300"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>

                          {/* Touch target min 44px */}
                          <Link
                            href={`/skills/${skill.id}`}
                            className="w-full min-h-[44px] py-2 rounded-lg bg-[#23272D] hover:bg-[#FF7A03] hover:text-[#15171A] text-xs font-bold text-[#EEF1F4] border border-[#2E3238] transition-colors flex items-center justify-center select-none active:scale-95"
                          >
                            Buka Roadmap
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Library Saya Section */}
                <div className="card-surface p-4 sm:p-5 border-[#2E3238]">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-[#EEF1F4]">Library Saya</h3>
                      <p className="text-[11px] text-[#8A929C]">Program tersimpan dalam rotasi harianmu</p>
                    </div>
                    <Link
                      href="/library"
                      className="min-h-[44px] px-2 flex items-center gap-1 text-xs font-bold text-[#FF7A03] hover:underline"
                    >
                      <span>Atur Library</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(library?.sessionIds || []).slice(0, 4).map((sId) => {
                      const s = getSessionById(sId);
                      if (!s) return null;
                      return (
                        <div
                          key={s.id}
                          className="p-3 rounded-xl bg-[#15171A] border border-[#2E3238] flex items-center justify-between gap-3 hover:border-[#8A929C] transition-all"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#23272D] text-[#FF7A03] flex-shrink-0">
                                {s.durasiMenit}m
                              </span>
                              <h4 className="font-bold text-xs sm:text-sm text-[#EEF1F4] truncate">{s.nama}</h4>
                            </div>
                            <p className="text-[11px] text-[#8A929C] truncate">{s.fokus} • {s.exercises.length} Gerakan</p>
                          </div>
                          <Link
                            href={`/latihan/${s.id}`}
                            className="min-h-[44px] px-3.5 py-2 rounded-lg bg-[#23272D] hover:bg-[#FF7A03] hover:text-[#15171A] text-xs font-bold text-[#EEF1F4] border border-[#2E3238] transition-colors flex items-center justify-center flex-shrink-0 active:scale-95"
                          >
                            Mulai
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Streak & Motivation Tracker */}
              <div className="space-y-4 sm:space-y-5">
                {/* Streak Tracker Card */}
                <div className="card-surface p-4 sm:p-5 border-[#2E3238]">
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#FF7A03]/15 border border-[#FF7A03]/30 text-[#FF7A03] flex items-center justify-center flex-shrink-0">
                        <Flame className="w-5 h-5 fill-[#FF7A03]" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base sm:text-lg text-[#EEF1F4]">
                          Streak {streak} Hari 🔥
                        </h3>
                        <p className="text-[11px] text-[#8A929C]">
                          {streak > 0 ? 'Konsistensi mantap, terus jaga!' : 'Latihan hari ini buat mulai streak!'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${streak > 0 ? 'bg-[#FF7A03]/15 text-[#FF7A03] border border-[#FF7A03]/30' : 'bg-[#2E3238] text-[#8A929C]'}`}>
                      {streak > 0 ? 'Aktif' : 'Mulai'}
                    </span>
                  </div>

                  {/* 7-Day Visual Tracker */}
                  <div className="p-3 rounded-xl bg-[#15171A] border border-[#2E3238] mb-3.5">
                    <div className="text-[11px] font-semibold text-[#8A929C] mb-2 text-center">
                      Aktivitas 7 Hari Terakhir
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center min-h-[50px]">
                      {mounted ? (
                        streakDays.map((day, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-1">
                            <span
                              className={`text-[10px] ${
                                day.isToday ? 'font-bold text-[#FF7A03]' : 'text-[#8A929C]'
                              }`}
                            >
                              {day.label}
                            </span>
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                                day.completed
                                  ? 'bg-[#FF7A03] text-[#15171A] font-bold shadow-sm shadow-[#FF7A03]/30'
                                  : day.isToday
                                  ? 'border-2 border-dashed border-[#FF7A03]/60 text-[#8A929C]'
                                  : 'bg-[#23272D] text-[#8A929C]'
                              }`}
                            >
                              {day.completed ? <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> : '•'}
                            </div>
                          </div>
                        ))
                      ) : (
                        Array.from({ length: 7 }).map((_, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-1">
                            <span className="text-[10px] text-[#8A929C]">•</span>
                            <div className="w-7 h-7 rounded-full bg-[#23272D] text-[#8A929C] flex items-center justify-center text-xs">
                              •
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-[#8A929C] flex items-center justify-between">
                    <span>Total Sesi Selesai:</span>
                    <span className="font-bold text-[#EEF1F4]">{logs.length} Sesi</span>
                  </div>
                </div>

                {/* Quick Student Tip Card with Mascot */}
                <div className="card-surface p-3.5 sm:p-4 border-[#2E3238] flex items-center gap-3.5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                    <SafeImage
                      src="/images/mascot/ppt-welcome.png"
                      alt="Maskot StreakIn - Pelajar Kalistenik"
                      aspectRatioClass="w-12 h-12 sm:w-14 sm:h-14"
                      className="w-full h-full object-contain p-0.5"
                      fallbackType="mascot"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5 text-xs font-bold text-[#FF7A03]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tips Kawan Bugar</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#8A929C] leading-relaxed">
                      "Latihan 15 menit konsisten tiap hari jauh lebih nendang dibanding 2 jam sekali seminggu tapi bikin pegal berhari-hari."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </MobileContainer>
    </div>
  );
}
