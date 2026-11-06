import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  History as HistoryIcon,
  Flame,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Play,
  Calendar
} from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { SEED_EXERCISES } from '../data/seedExercises';
import { MobileContainer } from '../components/layout/MobileContainer';

export const History: React.FC = () => {
  const { logs, streak, todaySession } = useWorkout();
  const [expandedLogId, setExpandedLogId] = useState<string | null>(logs[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedLogId(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#15171A] text-[#EEF1F4]">
      <MobileContainer maxWidth="4xl">
        {/* Header Title */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#EEF1F4]">
            Riwayat & Log Latihan
          </h1>
          <p className="text-xs sm:text-sm text-[#8A929C] mt-0.5">
            Pantau konsistensi dan perkembangan repetisi calisthenics harianmu.
          </p>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card-surface p-4 sm:p-5 border-[#2E3238]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#8A929C] font-semibold">Total Sesi Selesai</span>
              <CheckCircle2 className="w-4 h-4 text-[#C8F135]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#EEF1F4]">
              {logs.length} <span className="text-sm font-normal text-[#8A929C]">Sesi</span>
            </div>
            <span className="text-[11px] text-[#C8F135]">Disiplin tercatat</span>
          </div>

          <div className="card-surface p-4 sm:p-5 border-[#2E3238]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#8A929C] font-semibold">Streak Saat Ini</span>
              <Flame className="w-4 h-4 text-[#FF7A3D]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#EEF1F4]">
              {streak} <span className="text-sm font-normal text-[#8A929C]">Hari 🔥</span>
            </div>
            <span className="text-[11px] text-[#8A929C]">Konsisten setiap hari</span>
          </div>
        </div>

        {/* Workout Logs List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#8A929C]">
              Daftar Log Latihan ({logs.length})
            </h2>
          </div>

          {logs.length === 0 ? (
            /* Empty State */
            <div className="card-surface p-8 sm:p-12 text-center border-[#2E3238]">
              <div className="w-16 h-16 rounded-2xl bg-[#23272D] border border-[#2E3238] flex items-center justify-center text-[#8A929C] mx-auto mb-4">
                <HistoryIcon className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base sm:text-lg text-[#EEF1F4] mb-1">
                Belum ada riwayat latihan
              </h3>
              <p className="text-xs sm:text-sm text-[#8A929C] max-w-sm mx-auto mb-6">
                Mulai sesi pertamamu hari ini. Hanya 10–15 menit untuk membentuk kebiasaan bugar.
              </p>
              <Link
                to={`/latihan/${todaySession.id}`}
                className="btn-brand px-6 py-3.5 text-sm font-bold inline-flex items-center gap-2 shadow-lg shadow-[#C8F135]/20"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Mulai Sesi Pertamamu</span>
              </Link>
            </div>
          ) : (
            /* Historical Logs with Accordion */
            <div className="space-y-3">
              {logs.map(log => {
                const isExpanded = expandedLogId === log.id;
                const durMin = Math.max(1, Math.round(log.durasiDetik / 60));
                const totalReps = log.setsCompleted.reduce((sum, s) => sum + (s.nilai || 0), 0);

                // Group sets by exercise
                const setsByExercise: Record<string, number[]> = {};
                log.setsCompleted.forEach(s => {
                  if (!setsByExercise[s.exerciseId]) {
                    setsByExercise[s.exerciseId] = [];
                  }
                  setsByExercise[s.exerciseId].push(s.nilai);
                });

                return (
                  <div
                    key={log.id}
                    className="card-surface border-[#2E3238] overflow-hidden transition-all"
                  >
                    {/* Log Card Header */}
                    <div
                      onClick={() => toggleExpand(log.id)}
                      className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-[#2A2F37] transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#C8F135] mt-1.5 flex-shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm sm:text-base text-[#EEF1F4]">
                              {log.sessionNama}
                            </h3>
                            <span className="text-[11px] font-semibold text-[#C8F135] bg-[#C8F135]/10 px-2 py-0.5 rounded">
                              Tuntas
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-[#8A929C] mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {log.tanggal}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {durMin} Menit
                            </span>
                            <span>{log.setsCompleted.length} Set</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#EEF1F4] hidden sm:inline">
                          {totalReps} Reps
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-[#15171A] border border-[#2E3238] flex items-center justify-center text-[#8A929C]">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Accordion Expanded Details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 border-t border-[#2E3238] bg-[#1E2227]/50">
                        <div className="text-[11px] font-bold text-[#8A929C] uppercase tracking-wider mb-2.5">
                          Rincian Gerakan & Repetisi per Set:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {Object.entries(setsByExercise).map(([exId, repsList]) => {
                            const ex = SEED_EXERCISES.find(e => e.id === exId);
                            return (
                              <div
                                key={exId}
                                className="p-3 rounded-xl bg-[#15171A] border border-[#2E3238] flex items-center justify-between text-xs"
                              >
                                <span className="font-semibold text-[#EEF1F4]">
                                  {ex?.nama || exId}
                                </span>
                                <span className="font-mono text-[#C8F135]">
                                  {repsList.length}x ({repsList.join(', ')})
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </MobileContainer>
    </div>
  );
};
