import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Flame,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkout } from '../context/WorkoutContext';
import { SEED_EXERCISES } from '../data/seedExercises';
import { getStreak7Days } from '../utils/storage';
import { MobileContainer } from '../components/layout/MobileContainer';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { library, activeWorkout, todaySession, streak, logs, getSessionById } = useWorkout();

  const streakDays = getStreak7Days(logs);

  // Active workout session name if any
  const activeSession = activeWorkout ? getSessionById(activeWorkout.sessionId) : null;

  // Resolve exercise names for today's session
  const todayExerciseItems = todaySession.exercises.map(se => {
    const ex = SEED_EXERCISES.find(e => e.id === se.exerciseId);
    return {
      nama: ex?.nama || 'Gerakan',
      target: `${se.sets} × ${se.target} ${se.unit}`,
    };
  });

  return (
    <div className="min-h-screen bg-[#15171A] text-[#EEF1F4]">
      <MobileContainer maxWidth="4xl">
        {/* User Greeting Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#EEF1F4]">
              Halo, {currentUser?.nama || 'Siswa'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#8A929C] mt-0.5">
              Siap produktif & bugar di sela jadwal sekolah hari ini.
            </p>
          </div>
        </div>

        {/* Conditional Interrupted Workout Recovery Banner */}
        {activeWorkout && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-[#FF7A3D]/10 border border-[#FF7A3D]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF7A3D]/20 border border-[#FF7A3D]/30 text-[#FF7A3D] flex items-center justify-center flex-shrink-0 mt-0.5">
                <RotateCcw className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF7A3D] animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF7A3D]">
                    Latihan Belum Selesai
                  </span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[#EEF1F4] mt-0.5">
                  Sesi: {activeSession?.nama || 'Sesi Latihan'}
                </h3>
                <p className="text-xs text-[#8A929C]">
                  Progresmu tersimpan aman. Lanjutkan set latihan sekarang!
                </p>
              </div>
            </div>

            <Link
              to={`/latihan/${activeWorkout.sessionId}`}
              className="px-5 py-3 rounded-xl bg-[#FF7A3D] hover:bg-[#f06b2e] text-[#15171A] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all flex-shrink-0"
            >
              <span>Lanjutkan Latihan</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Hero Card: Sesi Hari Ini (2 Columns on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-surface p-5 sm:p-7 border-[#2E3238] relative overflow-hidden shadow-xl">
              {/* Soft glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#C8F135]/5 rounded-full blur-3xl pointer-events-none" />

              {/* Status Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C8F135]/15 text-[#C8F135] border border-[#C8F135]/30">
                  <span className="w-2 h-2 rounded-full bg-[#C8F135]" />
                  Sesi Hari Ini • {todaySession.durasiMenit} Menit • {todaySession.fokus}
                </span>
                <Link
                  to="/library"
                  className="text-xs text-[#8A929C] hover:text-[#C8F135] transition-colors"
                >
                  Ganti Sesi →
                </Link>
              </div>

              {/* Title & Desc */}
              <div className="mb-5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#EEF1F4] mb-1.5">
                  {todaySession.nama}
                </h2>
                <p className="text-xs sm:text-sm text-[#8A929C] leading-relaxed">
                  Rangkaian gerakan cepat ramah kamar kos untuk memperkuat postur tubuh tegak setelah seharian belajar di meja sekolah.
                </p>
              </div>

              {/* Exercise List Preview */}
              <div className="mb-6">
                <div className="text-[11px] font-bold text-[#8A929C] uppercase tracking-wider mb-2.5">
                  Daftar Gerakan Target:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {todayExerciseItems.map((ex, idx) => (
                    <div
                      key={idx}
                      className="bg-[#15171A] border border-[#2E3238] px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-[#EEF1F4]">{ex.nama}</span>
                      <span className="text-[#8A929C] text-[11px]">{ex.target}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Big Single-Click CTA */}
              <button
                type="button"
                onClick={() => navigate(`/latihan/${todaySession.id}`)}
                className="w-full btn-brand py-4 text-base font-bold shadow-lg shadow-[#C8F135]/20 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
                <span>Mulai Latihan</span>
              </button>
            </div>

            {/* Library Saya Section */}
            <div className="card-surface p-5 border-[#2E3238]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base text-[#EEF1F4]">Library Saya</h3>
                  <p className="text-xs text-[#8A929C]">Program tersimpan dalam rotasi harianmu</p>
                </div>
                <Link
                  to="/library"
                  className="text-xs font-bold text-[#C8F135] hover:underline flex items-center gap-1"
                >
                  <span>Ubah Library</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(library?.sessionIds || ['s1', 's2']).slice(0, 4).map(sId => {
                  const s = getSessionById(sId);
                  if (!s) return null;
                  return (
                    <div
                      key={s.id}
                      className="p-3.5 rounded-xl bg-[#15171A] border border-[#2E3238] flex items-center justify-between gap-3 hover:border-[#8A929C] transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#23272D] text-[#C8F135]">
                            {s.durasiMenit}m
                          </span>
                          <h4 className="font-bold text-xs sm:text-sm text-[#EEF1F4]">{s.nama}</h4>
                        </div>
                        <p className="text-[11px] text-[#8A929C]">{s.fokus} • {s.exercises.length} Gerakan</p>
                      </div>
                      <Link
                        to={`/latihan/${s.id}`}
                        className="px-3 py-1.5 rounded-lg bg-[#23272D] hover:bg-[#C8F135] hover:text-[#15171A] text-xs font-bold text-[#EEF1F4] border border-[#2E3238] transition-colors"
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
          <div className="space-y-6">
            {/* Streak Tracker Card */}
            <div className="card-surface p-5 sm:p-6 border-[#2E3238]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#C8F135]/15 border border-[#C8F135]/30 text-[#C8F135] flex items-center justify-center">
                    <Flame className="w-5 h-5 fill-[#C8F135]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#EEF1F4]">
                      Streak {streak} Hari 🔥
                    </h3>
                    <p className="text-[11px] text-[#8A929C]">
                      {streak > 0 ? 'Konsistensi luar biasa, pertahankan!' : 'Latihan hari ini untuk mulai streak!'}
                    </p>
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${streak > 0 ? 'bg-[#C8F135]/15 text-[#C8F135] border border-[#C8F135]/30' : 'bg-[#2E3238] text-[#8A929C]'}`}>
                  {streak > 0 ? 'Aktif' : 'Mulai'}
                </span>
              </div>

              {/* 7-Day Visual Tracker */}
              <div className="p-3.5 rounded-xl bg-[#15171A] border border-[#2E3238] mb-4">
                <div className="text-[11px] font-semibold text-[#8A929C] mb-3 text-center">
                  Aktivitas 7 Hari Terakhir
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {streakDays.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5">
                      <span className={`text-[10px] ${day.isToday ? 'font-bold text-[#C8F135]' : 'text-[#8A929C]'}`}>
                        {day.label}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                          day.completed
                            ? 'bg-[#C8F135] text-[#15171A] font-bold shadow-sm shadow-[#C8F135]/30'
                            : day.isToday
                            ? 'border-2 border-dashed border-[#C8F135]/60 text-[#8A929C]'
                            : 'bg-[#23272D] text-[#8A929C]'
                        }`}
                      >
                        {day.completed ? <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> : '•'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-[#8A929C] flex items-center justify-between">
                <span>Total Sesi Terselesaikan:</span>
                <span className="font-bold text-[#EEF1F4]">{logs.length} Sesi</span>
              </div>
            </div>

            {/* Quick Student Tip Card */}
            <div className="card-surface p-5 border-[#2E3238]">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#C8F135]">
                <Sparkles className="w-4 h-4" />
                <span>Tips Pelajar Bugar</span>
              </div>
              <p className="text-xs text-[#8A929C] leading-relaxed">
                "Konsistensi 15 menit setiap hari jauh lebih efektif untuk fokus belajar daripada latihan 2 jam sekali seminggu."
              </p>
            </div>
          </div>
        </div>
      </MobileContainer>
    </div>
  );
};
