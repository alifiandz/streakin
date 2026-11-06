import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkout } from '../context/WorkoutContext';
import { SEED_EXERCISES } from '../data/seedExercises';
import { CompletedSet, ActiveWorkout } from '../types';
import { MobileContainer } from '../components/layout/MobileContainer';

export const WorkoutPlayer: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getSessionById, activeWorkout, saveActiveWorkout, addWorkoutLog } = useWorkout();

  const session = getSessionById(sessionId || '');

  // Current exercise index
  const [exerciseIndex, setExerciseIndex] = useState<number>(() => {
    if (activeWorkout && activeWorkout.sessionId === sessionId) {
      return activeWorkout.exerciseIndex || 0;
    }
    return 0;
  });

  // Track completed sets for entire session
  const [completedSets, setCompletedSets] = useState<CompletedSet[]>(() => {
    if (activeWorkout && activeWorkout.sessionId === sessionId) {
      return activeWorkout.completedSets || [];
    }
    return [];
  });

  // Session start time
  const [startTime] = useState<string>(() => {
    if (activeWorkout && activeWorkout.sessionId === sessionId) {
      return activeWorkout.mulai;
    }
    return new Date().toISOString();
  });

  // Modal states
  const [showExitModal, setShowExitModal] = useState(false);
  const [tipModal, setTipModal] = useState<{ title: string; content: string } | null>(null);

  // Rest Timer State
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(45);

  // If session not found, redirect to home
  useEffect(() => {
    if (!session) {
      navigate('/home', { replace: true });
    }
  }, [session, navigate]);

  // Rest countdown interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  if (!session) return null;

  const currentSessionExercise = session.exercises[exerciseIndex];
  const currentExerciseData = SEED_EXERCISES.find(e => e.id === currentSessionExercise?.exerciseId);

  if (!currentSessionExercise || !currentExerciseData) return null;

  const totalExercises = session.exercises.length;
  const targetDefaultVal = currentSessionExercise.target;

  // Handle set completion
  const handleCompleteSet = (setNumber: number, value: number) => {
    const newCompleted: CompletedSet = {
      exerciseId: currentExerciseData.id,
      noSet: setNumber,
      nilai: value || targetDefaultVal,
      selesai: true,
    };

    const updatedSets = [
      ...completedSets.filter(cs => !(cs.exerciseId === currentExerciseData.id && cs.noSet === setNumber)),
      newCompleted,
    ];

    setCompletedSets(updatedSets);

    // Save active workout state to localStorage
    if (currentUser) {
      const activeState: ActiveWorkout = {
        userId: currentUser.id,
        sessionId: session.id,
        mulai: startTime,
        exerciseIndex,
        completedSets: updatedSets,
      };
      saveActiveWorkout(activeState);
    }

    // Auto-start rest timer (45 seconds or exercise custom rest)
    setTimerSeconds(currentSessionExercise.istirahatDetik || 45);
    setTimerRunning(true);
  };

  const handleAdjustTimer = (delta: number) => {
    setTimerSeconds(prev => Math.max(0, prev + delta));
  };

  const handleSkipTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(0);
  };

  // Check how many sets completed for current exercise
  const setsDoneForThisExercise = completedSets.filter(cs => cs.exerciseId === currentExerciseData.id).length;

  // Navigate to next exercise or finish session
  const handleNextOrFinish = () => {
    setTimerRunning(false);
    if (exerciseIndex < totalExercises - 1) {
      const nextIdx = exerciseIndex + 1;
      setExerciseIndex(nextIdx);
      if (currentUser) {
        saveActiveWorkout({
          userId: currentUser.id,
          sessionId: session.id,
          mulai: startTime,
          exerciseIndex: nextIdx,
          completedSets,
        });
      }
    } else {
      // Finish Workout!
      const startMs = new Date(startTime).getTime();
      const endMs = Date.now();
      const durationSeconds = Math.max(60, Math.round((endMs - startMs) / 1000));

      const logId = addWorkoutLog({
        sessionId: session.id,
        sessionNama: session.nama,
        tanggal: new Date().toISOString().split('T')[0],
        durasiDetik: durationSeconds,
        setsCompleted: completedSets,
      });

      navigate(`/selesai/${logId}`);
    }
  };

  const handleExitWorkout = () => {
    setShowExitModal(false);
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#15171A] text-[#EEF1F4] pb-24">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 bg-[#15171A]/95 backdrop-blur border-b border-[#2E3238] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C8F135]">
                Gerakan {exerciseIndex + 1} dari {totalExercises}
              </span>
            </div>
            <h1 className="font-extrabold text-base sm:text-lg text-[#EEF1F4]">
              {session.nama}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowExitModal(true)}
            className="px-3 py-1.5 rounded-xl bg-[#23272D] border border-[#2E3238] text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            Akhiri Latihan
          </button>
        </div>

        {/* Top Progress Bar */}
        <div className="max-w-2xl mx-auto w-full bg-[#23272D] h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-[#C8F135] h-full transition-all duration-300"
            style={{ width: `${Math.max(5, ((exerciseIndex + 1) / totalExercises) * 100)}%` }}
          />
        </div>
      </div>

      <MobileContainer maxWidth="xl" withBottomNav={false}>
        {/* Media Container (16:9 Illustration) */}
        <div className="card-surface p-0 overflow-hidden mb-5 border-[#2E3238] relative aspect-video bg-[#23272D] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#15171A] border border-[#2E3238] flex items-center justify-center text-[#C8F135] mb-2 shadow-inner">
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>
          <span className="text-xs font-bold text-[#EEF1F4]">{currentExerciseData.nama}</span>
          <span className="text-[11px] text-[#8A929C]">Panduan Form Ideal • Ramah Kos</span>

          {/* Badge Tempo */}
          <div className="absolute bottom-3 left-3 bg-[#15171A]/80 backdrop-blur px-2.5 py-1 rounded-lg border border-[#2E3238] text-[11px] font-semibold text-[#C8F135]">
            Tempo: 2-1-2
          </div>
        </div>

        {/* Exercise Info & Target Badge */}
        <div className="mb-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-2xl font-extrabold text-[#EEF1F4]">
              {currentExerciseData.nama}
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C8F135]/15 text-[#C8F135] border border-[#C8F135]/30">
              {currentSessionExercise.sets} Set × {currentSessionExercise.target} {currentSessionExercise.unit}
            </span>
          </div>
          <p className="text-xs text-[#8A929C]">Area Otot: {currentExerciseData.area}</p>
        </div>

        {/* Technique Points Checklist */}
        <div className="card-surface p-4 mb-4 border-[#2E3238]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A929C] mb-2.5">
            Poin Teknik Utama:
          </h3>
          <ul className="space-y-2">
            {currentExerciseData.langkah.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-[#EEF1F4] leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-[#C8F135] flex-shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Common Mistakes Warning Box (in Orange) */}
        <div className="p-4 rounded-xl bg-[#FF7A3D]/10 border border-[#FF7A3D]/30 mb-4">
          <div className="flex items-center gap-2 text-[#FF7A3D] text-xs font-bold mb-1.5">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Peringatan Kesalahan Umum:</span>
          </div>
          <ul className="space-y-1 text-xs text-[#EEF1F4]/90 pl-6 list-disc">
            {currentExerciseData.kesalahanUmum.map((mistake, idx) => (
              <li key={idx}>{mistake}</li>
            ))}
          </ul>
        </div>

        {/* Safety Warning for Inverted Row */}
        {currentExerciseData.id === 'ex9' && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 mb-4 text-xs text-red-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">PENTING - Keselamatan Meja:</span> Pastikan meja atau tiang benar-benar kokoh dan mampu menahan bobot tubuh penuhmu sebelum menggantungkan diri.
            </div>
          </div>
        )}

        {/* Modification Chips: Lebih Mudah / Lebih Sulit */}
        <div className="card-surface p-3.5 mb-5 border-[#2E3238]">
          <div className="text-[11px] font-bold text-[#8A929C] uppercase tracking-wider mb-2">
            Variasi Gerakan (Pilihan Level):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                setTipModal({
                  title: 'Variasi Lebih Mudah',
                  content: `Jika terasa terlalu berat, kamu bisa melakukan: "${currentExerciseData.lebihMudah}". Fokuskan dulu pada teknik dan postur yang benar.`,
                })
              }
              className="px-3 py-2 rounded-xl bg-[#15171A] border border-[#2E3238] hover:border-[#8A929C] text-left text-xs transition-colors"
            >
              <span className="text-[#8A929C] block text-[10px]">Lebih mudah:</span>
              <span className="font-semibold text-[#EEF1F4]">{currentExerciseData.lebihMudah}</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setTipModal({
                  title: 'Variasi Lebih Sulit',
                  content: `Jika sudah terlalu ringan, tantang dirimu dengan: "${currentExerciseData.lebihSulit}". Kontraksikan otot lebih lama.`,
                })
              }
              className="px-3 py-2 rounded-xl bg-[#15171A] border border-[#2E3238] hover:border-[#8A929C] text-left text-xs transition-colors"
            >
              <span className="text-[#8A929C] block text-[10px]">Lebih sulit:</span>
              <span className="font-semibold text-[#EEF1F4]">{currentExerciseData.lebihSulit}</span>
            </button>
          </div>
        </div>

        {/* Set Logger Section */}
        <div className="card-surface p-4 sm:p-5 mb-5 border-[#2E3238]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#EEF1F4]">
              Pencatat Set ({setsDoneForThisExercise} / {currentSessionExercise.sets} Selesai)
            </h3>
            <span className="text-[11px] text-[#8A929C]">
              Satuan: {currentSessionExercise.unit}
            </span>
          </div>

          <div className="space-y-2.5">
            {Array.from({ length: currentSessionExercise.sets }).map((_, idx) => {
              const setNo = idx + 1;
              const completedItem = completedSets.find(
                cs => cs.exerciseId === currentExerciseData.id && cs.noSet === setNo
              );
              const isSetDone = Boolean(completedItem?.selesai);

              return (
                <div
                  key={setNo}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    isSetDone
                      ? 'bg-[#15171A] border-[#C8F135]/40 text-[#EEF1F4]'
                      : 'bg-[#15171A] border-[#2E3238]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#23272D] border border-[#2E3238] text-xs font-bold flex items-center justify-center text-[#EEF1F4]">
                      S{setNo}
                    </span>
                    <div>
                      <span className="text-xs font-semibold text-[#EEF1F4]">
                        Target: {currentSessionExercise.target} {currentSessionExercise.unit}
                      </span>
                      {completedItem && (
                        <p className="text-[11px] text-[#C8F135]">
                          Tercatat: {completedItem.nilai} {currentSessionExercise.unit}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCompleteSet(setNo, currentSessionExercise.target)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all min-h-[40px] ${
                      isSetDone
                        ? 'bg-[#C8F135]/20 text-[#C8F135] border border-[#C8F135]/40'
                        : 'bg-[#C8F135] text-[#15171A] hover:bg-[#b8e026]'
                    }`}
                  >
                    {isSetDone ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Selesai ✓</span>
                      </>
                    ) : (
                      <span>Selesai Set</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rest Timer Card Overlay / Component */}
        {timerRunning && (
          <div className="card-surface p-5 mb-5 border-[#FF7A3D]/40 bg-[#23272D] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#FF7A3D]">
                <Clock className="w-4 h-4 animate-spin-slow" />
                <span>Timer Istirahat Otomatis</span>
              </div>
              <span className="text-[11px] text-[#8A929C]">Tarik napas teratur</span>
            </div>

            <div className="text-center py-3">
              <div className="text-4xl sm:text-5xl font-mono font-extrabold text-[#C8F135] tracking-wider">
                {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:
                {String(timerSeconds % 60).padStart(2, '0')}
              </div>
              <p className="text-xs text-[#8A929C] mt-1">
                {timerSeconds === 0 ? 'Waktu habis! Siap set berikutnya.' : 'Istirahat antar set'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleAdjustTimer(-15)}
                className="py-2.5 rounded-xl bg-[#15171A] border border-[#2E3238] text-xs font-bold text-[#EEF1F4] hover:border-[#8A929C]"
              >
                -15 dtk
              </button>
              <button
                type="button"
                onClick={() => handleAdjustTimer(15)}
                className="py-2.5 rounded-xl bg-[#15171A] border border-[#2E3238] text-xs font-bold text-[#EEF1F4] hover:border-[#8A929C]"
              >
                +15 dtk
              </button>
              <button
                type="button"
                onClick={handleSkipTimer}
                className="py-2.5 rounded-xl bg-[#FF7A3D]/20 text-[#FF7A3D] border border-[#FF7A3D]/30 text-xs font-bold hover:bg-[#FF7A3D]/30"
              >
                Lewati
              </button>
            </div>
          </div>
        )}

        {/* Sticky Bottom Action */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#15171A]/95 backdrop-blur border-t border-[#2E3238] z-30">
          <div className="max-w-xl mx-auto">
            <button
              type="button"
              onClick={handleNextOrFinish}
              className="w-full btn-brand py-4 text-sm font-bold shadow-xl shadow-[#C8F135]/20 flex items-center justify-center gap-2"
            >
              {exerciseIndex < totalExercises - 1 ? (
                <>
                  <span>Gerakan Berikutnya</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              ) : (
                <>
                  <span>Selesai Latihan 🎉</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Exit Confirmation Modal */}
        {showExitModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="card-surface p-6 max-w-sm w-full border-[#2E3238] shadow-2xl">
              <h3 className="text-lg font-bold text-[#EEF1F4] mb-2">Akhiri Latihan?</h3>
              <p className="text-xs text-[#8A929C] mb-5 leading-relaxed">
                Progresmu sejauh ini tetap tersimpan aman di aplikasi. Kamu bisa melanjutkannya kapan saja dari beranda.
              </p>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowExitModal(false)}
                  className="flex-1 btn-outline py-2.5 text-xs font-semibold"
                >
                  Lanjut Latihan
                </button>
                <button
                  type="button"
                  onClick={handleExitWorkout}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold hover:bg-red-500/30"
                >
                  Ya, Keluar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tip Explanatory Modal */}
        {tipModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="card-surface p-6 max-w-sm w-full border-[#2E3238] shadow-2xl">
              <div className="flex items-center gap-2 text-[#C8F135] mb-2 font-bold text-sm">
                <Info className="w-4 h-4" />
                <span>{tipModal.title}</span>
              </div>
              <p className="text-xs text-[#EEF1F4] mb-5 leading-relaxed">
                {tipModal.content}
              </p>
              <button
                type="button"
                onClick={() => setTipModal(null)}
                className="w-full btn-brand py-2.5 text-xs font-bold"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </MobileContainer>
    </div>
  );
};
