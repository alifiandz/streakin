import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Trophy,
  Flame,
  Clock,
  CheckCircle2,
  Bell,
  ArrowRight,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkout } from '../context/WorkoutContext';
import { MobileContainer } from '../components/layout/MobileContainer';

export const WorkoutDone: React.FC = () => {
  const { logId } = useParams<{ logId: string }>();
  const { currentUser } = useAuth();
  const { logs, streak, reminder } = useWorkout();

  const [dismissReminderOffer, setDismissReminderOffer] = useState(false);

  // Find the log
  const currentLog = logs.find(l => l.id === logId) || logs[0];

  const totalSets = currentLog ? currentLog.setsCompleted.length : 0;
  const totalReps = currentLog
    ? currentLog.setsCompleted.reduce((sum, s) => sum + (s.nilai || 0), 0)
    : 0;
  const durationMinutes = currentLog
    ? Math.max(1, Math.round(currentLog.durasiDetik / 60))
    : 15;

  // Show reminder offer only if user hasn't set reminder yet and log is among first
  const showReminderPrompt = !reminder.aktif && !dismissReminderOffer;

  return (
    <div className="min-h-screen bg-[#15171A] text-[#EEF1F4] py-6 sm:py-10">
      <MobileContainer maxWidth="xl" withBottomNav={false}>
        {/* Celebration Header */}
        <div className="text-center mb-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 rounded-3xl bg-[#C8F135]/20 border-2 border-[#C8F135]/40 flex items-center justify-center text-[#C8F135] mx-auto shadow-2xl shadow-[#C8F135]/30">
              <Trophy className="w-10 h-10 stroke-[2.5]" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#C8F135] text-[#15171A] flex items-center justify-center font-bold text-xs">
              ✓
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#EEF1F4]">
            Latihan Selesai! 🎉
          </h1>
          <p className="text-sm text-[#8A929C] mt-1.5">
            Kerja bagus, {currentUser?.nama || 'Siswa'}! Satu sesi lebih dekat menuju tubuh bugar & fokus.
          </p>
        </div>

        {/* 2x2 Performance Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="card-surface p-4 border-[#2E3238]">
            <div className="flex items-center gap-1.5 text-xs text-[#8A929C] mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Total Waktu</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#EEF1F4]">
              {durationMinutes} Menit
            </div>
            <span className="text-[11px] text-[#8A929C]">Durasi Selesai</span>
          </div>

          <div className="card-surface p-4 border-[#2E3238]">
            <div className="flex items-center gap-1.5 text-xs text-[#8A929C] mb-1">
              <Zap className="w-3.5 h-3.5 text-[#C8F135]" />
              <span>Program</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#EEF1F4] truncate">
              {currentLog?.sessionNama || 'Calisthenics'}
            </div>
            <span className="text-[11px] text-[#8A929C]">Target Sesi</span>
          </div>

          <div className="card-surface p-4 border-[#2E3238]">
            <div className="flex items-center gap-1.5 text-xs text-[#8A929C] mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C8F135]" />
              <span>Set Tuntas</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#EEF1F4]">
              {totalSets} Set
            </div>
            <span className="text-[11px] text-[#8A929C]">100% Tercapai</span>
          </div>

          <div className="card-surface p-4 border-[#2E3238]">
            <div className="flex items-center gap-1.5 text-xs text-[#8A929C] mb-1">
              <Flame className="w-3.5 h-3.5 text-[#FF7A3D]" />
              <span>Total Repetisi</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#EEF1F4]">
              {totalReps} Reps
            </div>
            <span className="text-[11px] text-[#C8F135] font-semibold">Akurasi Form Baik</span>
          </div>
        </div>

        {/* Streak Booster Card */}
        <div className="card-surface p-5 mb-5 border-[#2E3238] bg-gradient-to-br from-[#23272D] to-[#15171A]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#C8F135]/20 text-[#C8F135] flex items-center justify-center">
                <Flame className="w-6 h-6 fill-[#C8F135]" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-[#EEF1F4]">
                  Streak {streak} Hari 🔥
                </h3>
                <p className="text-xs text-[#8A929C]">
                  Disiplin berturut-turut di sela jam sekolah!
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#C8F135] text-[#15171A]">
              Tercatat!
            </span>
          </div>
        </div>

        {/* First Time Reminder Offer */}
        {showReminderPrompt && (
          <div className="card-surface p-4 sm:p-5 mb-6 border-[#2E3238] bg-[#23272D]/80">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF7A3D]/20 text-[#FF7A3D] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#EEF1F4]">
                  Mau diingatkan latihan harian di jam istirahat sekolah?
                </h4>
                <p className="text-xs text-[#8A929C] mt-0.5">
                  Bantu kamu tetap konsisten dan tidak lupa saat tugas menumpuk.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Link
                to="/notifikasi"
                className="btn-brand px-4 py-2 text-xs font-bold flex-1 text-center"
              >
                Atur Pengingat
              </Link>
              <button
                type="button"
                onClick={() => setDismissReminderOffer(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8A929C] hover:text-[#EEF1F4] transition-colors"
              >
                Nanti Saja
              </button>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="space-y-2.5">
          <Link
            to="/riwayat"
            className="w-full btn-brand py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#C8F135]/20"
          >
            <span>Lihat Riwayat Latihan</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
          <Link
            to="/home"
            className="w-full btn-outline py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </MobileContainer>
    </div>
  );
};
