'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Clock,
  Flame,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWorkout } from '@/context/WorkoutContext';
import { SEED_EXERCISES } from '@/src/data/seedExercises';
import { CompletedSet, ActiveWorkout } from '@/src/types';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { SafeImage } from '@/components/ui/SafeImage';
import { StageImage } from '@/components/ui/StageImage';
import { SEED_SKILLS } from '@/lib/seedData';
import { safeLocalStorage, STORAGE_KEYS } from '@/src/utils/storage';

export default function WorkoutPlayerPage() {
  const params = useParams();
  const sessionId = (params?.sessionId as string) || '';
  const router = useRouter();
  const { currentUser } = useAuth();
  const { getSessionById, activeWorkout, saveActiveWorkout, addWorkoutLog } = useWorkout();

  const session = getSessionById(sessionId || '');

  // Current exercise index
  const [exerciseIndex, setExerciseIndex] = useState<number>(0);

  // Track completed sets for entire session
  const [completedSets, setCompletedSets] = useState<CompletedSet[]>([]);

  // Session start time
  const [startTime, setStartTime] = useState<string>('');

  useEffect(() => {
    if (activeWorkout && activeWorkout.sessionId === sessionId) {
      setExerciseIndex(activeWorkout.exerciseIndex || 0);
      setCompletedSets(activeWorkout.completedSets || []);
      setStartTime(activeWorkout.mulai);
    } else {
      setStartTime(new Date().toISOString());
    }
  }, [activeWorkout, sessionId]);

  // Modal states
  const [showExitModal, setShowExitModal] = useState(false);
  const [tipModal, setTipModal] = useState<{ title: string; content: string } | null>(null);

  // Sound preference state (default true, persisted in localStorage)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Load sound preference on mount
  useEffect(() => {
    try {
      const saved = safeLocalStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
      if (saved !== null) {
        setSoundEnabled(saved === 'true');
      }
    } catch {
      // safe fallback
    }
  }, []);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        safeLocalStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(next));
      } catch { }
      return next;
    });
  };

  // Safe Web Audio API initialization (user gesture resume)
  const initOrResumeAudio = useCallback(() => {
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtxClass();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => { });
      }
    } catch {
      // AudioContext unavailable / blocked
    }
  }, []);

  // Web Audio Tone Synthesizer
  const playBeep = useCallback((freq = 880, durationMs = 120, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    try {
      initOrResumeAudio();
      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state !== 'running') return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Smooth attack & decay envelope
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (durationMs / 1000));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + (durationMs / 1000) + 0.05);
    } catch {
      // Web Audio playback failed silently
    }
  }, [soundEnabled, initOrResumeAudio]);

  // Safe vibration trigger (check 'vibrate' in navigator, ignore iOS Safari without error)
  const triggerHaptic = useCallback((pattern: number | number[]) => {
    try {
      if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Vibration not supported / blocked
    }
  }, []);

  // Feedback on countdown ticks
  const playCountdownFeedback = useCallback((secondsLeft: number) => {
    if (secondsLeft === 3 || secondsLeft === 2 || secondsLeft === 1) {
      playBeep(800, 100, 'sine');
      triggerHaptic(40);
    } else if (secondsLeft === 0) {
      playBeep(1200, 350, 'triangle');
      triggerHaptic([100, 60, 150]);
    }
  }, [playBeep, triggerHaptic]);

  // Cleanup Web AudioContext on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close().catch(() => { });
        } catch { }
        audioCtxRef.current = null;
      }
    };
  }, []);

  // Rest Timer State
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(45);
  const restTimerEndMsRef = useRef<number | null>(null);

  // Isometric Hold Timer State
  const [holdTimerRunning, setHoldTimerRunning] = useState(false);
  const [holdTimerElapsed, setHoldTimerElapsed] = useState(0);
  const holdTimerStartMsRef = useRef<number | null>(null);
  const holdTimerBaseSecRef = useRef<number>(0);

  // Saving state to prevent double submission
  const [isFinishing, setIsFinishing] = useState(false);

  // Session not found handled gracefully with UI fallback below

  // Rest countdown interval (wall-clock timestamp driven to avoid background timer drift)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerRunning) {
      if (!restTimerEndMsRef.current) {
        restTimerEndMsRef.current = Date.now() + timerSeconds * 1000;
      }

      interval = setInterval(() => {
        if (!restTimerEndMsRef.current) return;
        const remainingMs = restTimerEndMsRef.current - Date.now();
        const nextSec = Math.max(0, Math.ceil(remainingMs / 1000));

        setTimerSeconds(nextSec);

        if (nextSec <= 0) {
          setTimerRunning(false);
          restTimerEndMsRef.current = null;
          playCountdownFeedback(0);
        } else if (nextSec === 3 || nextSec === 2 || nextSec === 1) {
          playCountdownFeedback(nextSec);
        }
      }, 500);
    } else {
      restTimerEndMsRef.current = null;
    }
    return () => clearInterval(interval);
  }, [timerRunning, playCountdownFeedback]);

  // Isometric Hold stopwatch interval (wall-clock timestamp driven to avoid background timer drift)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (holdTimerRunning) {
      if (!holdTimerStartMsRef.current) {
        holdTimerStartMsRef.current = Date.now();
      }

      interval = setInterval(() => {
        if (!holdTimerStartMsRef.current) return;
        const elapsedSinceResume = Math.floor((Date.now() - holdTimerStartMsRef.current) / 1000);
        const totalElapsed = holdTimerBaseSecRef.current + elapsedSinceResume;
        setHoldTimerElapsed(totalElapsed);

        const targetHold = session?.exercises?.[exerciseIndex]?.target || 0;
        if (targetHold > 0) {
          const remaining = targetHold - totalElapsed;
          if (remaining === 3 || remaining === 2 || remaining === 1) {
            playCountdownFeedback(remaining);
          } else if (remaining === 0) {
            playCountdownFeedback(0);
          }
        }
      }, 500);
    } else {
      if (holdTimerStartMsRef.current) {
        const elapsedSinceResume = Math.floor((Date.now() - holdTimerStartMsRef.current) / 1000);
        holdTimerBaseSecRef.current += elapsedSinceResume;
        holdTimerStartMsRef.current = null;
      }
    }
    return () => clearInterval(interval);
  }, [holdTimerRunning, session, exerciseIndex, playCountdownFeedback]);

  if (!session) {
    return (
      <div className="min-h-[100dvh] bg-[#15171A] text-[#EEF1F4] flex flex-col items-center justify-center p-4 text-center select-none">
        <div className="w-16 h-16 rounded-2xl bg-[#FF7A03]/15 border border-[#FF7A03]/30 flex items-center justify-center text-[#FF7A03] mb-4 shadow-lg">
          <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-[#EEF1F4] mb-2">
          Sesi ini belum tersedia
        </h1>
        <p className="text-xs sm:text-sm text-[#8A929C] max-w-sm mb-6 leading-relaxed">
          Tenang kawan, balik ke roadmap skill dulu yuk buat pilih sesi stage yang sudah siap kamu taklukkan!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <button
            onClick={() => router.push('/skills')}
            className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-[#FF7A03] hover:bg-[#E66E00] text-[#15171A] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#FF7A03]/20 active:scale-95 transition-all"
          >
            <span>Balik ke Roadmap Skill</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push('/home')}
            className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-[#23272D] border border-[#2E3238] text-[#8A929C] hover:text-[#EEF1F4] text-xs font-semibold flex items-center justify-center active:scale-95 transition-all"
          >
            <span>Ke Beranda</span>
          </button>
        </div>
      </div>
    );
  }

  const currentSessionExercise = session.exercises[exerciseIndex];
  const currentExerciseData = SEED_EXERCISES.find(
    (e) => e.id === currentSessionExercise?.exerciseId
  );

  if (!currentSessionExercise || !currentExerciseData) return null;

  const matchedStageImage = SEED_SKILLS.flatMap((skill) =>
    skill.stages.map((stage) => ({ skill, stage }))
  ).find((item) => item.stage.imageUrl && item.stage.imageUrl === currentExerciseData.imageUrl);
  const isStageImage = Boolean(currentExerciseData.imageUrl?.startsWith('/images/skills/'));

  const totalExercises = session.exercises.length;
  const isIsometricHold = Boolean(
    currentSessionExercise.isIsometric ||
    currentSessionExercise.unit === 'detik' ||
    currentExerciseData.isTimeBased
  );
  const targetDefaultVal = currentSessionExercise.target;

  // Handle set completion
  const handleCompleteSet = (setNumber: number, value: number) => {
    const holdRecorded = holdTimerElapsed > 0 ? holdTimerElapsed : (value || targetDefaultVal);

    const newCompleted: CompletedSet = {
      exerciseId: currentExerciseData.id,
      exerciseName: currentExerciseData.nama,
      noSet: setNumber,
      nilai: holdRecorded,
      selesai: true,
      isIsometric: isIsometricHold,
    };

    const updatedSets = [
      ...completedSets.filter(
        (cs) => !(cs.exerciseId === currentExerciseData.id && cs.noSet === setNumber)
      ),
      newCompleted,
    ];

    setCompletedSets(updatedSets);

    // Reset hold timer
    setHoldTimerRunning(false);
    setHoldTimerElapsed(0);
    holdTimerStartMsRef.current = null;
    holdTimerBaseSecRef.current = 0;

    // Save active workout state
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

    // Auto-start rest timer (45 seconds)
    const restDuration = currentSessionExercise.istirahatDetik || 45;
    setTimerSeconds(restDuration);
    restTimerEndMsRef.current = Date.now() + restDuration * 1000;
    setTimerRunning(true);
  };

  const handleAdjustTimer = (delta: number) => {
    setTimerSeconds((prev) => {
      const next = Math.min(300, Math.max(0, prev + delta));
      restTimerEndMsRef.current = Date.now() + next * 1000;
      return next;
    });
  };

  const handleSkipTimer = () => {
    setTimerRunning(false);
    restTimerEndMsRef.current = null;
    setTimerSeconds(0);
  };

  // Check how many sets completed for current exercise
  const setsDoneForThisExercise = completedSets.filter(
    (cs) => cs.exerciseId === currentExerciseData.id
  ).length;

  // Navigate to next exercise or finish session
  const handleNextOrFinish = async () => {
    if (isFinishing) return;
    setTimerRunning(false);
    restTimerEndMsRef.current = null;
    setHoldTimerRunning(false);
    holdTimerStartMsRef.current = null;

    if (exerciseIndex < totalExercises - 1) {
      const nextIdx = exerciseIndex + 1;
      setExerciseIndex(nextIdx);
      setHoldTimerElapsed(0);
      holdTimerBaseSecRef.current = 0;
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
      setIsFinishing(true);
      try {
        const startMs = startTime ? new Date(startTime).getTime() : Date.now() - 60000;
        const endMs = Date.now();
        const durationSeconds = Math.max(60, Math.round((endMs - startMs) / 1000));

        const logId = await addWorkoutLog({
          sessionId: session.id,
          sessionNama: session.nama,
          skillFocus: session.skillId || null,
          tanggal: new Date().toISOString().split('T')[0],
          durasiDetik: durationSeconds,
          setsCompleted: completedSets,
        });

        router.push(`/selesai/${logId}`);
      } catch (err) {
        console.error('Failed to save workout log', err);
        setIsFinishing(false);
      }
    }
  };

  const handleExitWorkout = () => {
    setShowExitModal(false);
    router.push('/home');
  };

  return (
    <div className="min-h-[100dvh] bg-[#15171A] text-[#EEF1F4] flex flex-col justify-between overflow-x-hidden">
      {/* Top Header Bar with Safe Area Top */}
      <div className="sticky top-0 z-30 bg-[#15171A]/95 backdrop-blur border-b border-[#2E3238] px-3.5 sm:px-4 py-2 sm:py-2.5 pt-[env(safe-area-inset-top,0.5rem)]">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF7A03]">
                Gerakan {exerciseIndex + 1} / {totalExercises}
              </span>
              {session.skillId && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#FF7A03]/20 text-[#FF7A03] border border-[#FF7A03]/30 truncate max-w-[150px]">
                  {session.skillId.toUpperCase()}
                </span>
              )}
            </div>
            <h1 className="font-extrabold text-sm sm:text-base text-[#EEF1F4] truncate">
              {session.nama}
            </h1>
          </div>

          {/* Top Right Controls: Suara & Akhiri Latihan */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Toggle Suara & Getaran - min 44x44px */}
            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Matikan suara dan getaran' : 'Nyalakan suara dan getaran'}
              title={soundEnabled ? 'Suara & getaran: Aktif' : 'Suara & getaran: Mati'}
              className={`min-h-[44px] min-w-[44px] px-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold active:scale-95 transition-all ${soundEnabled
                  ? 'bg-[#FF7A03]/15 border-[#FF7A03]/40 text-[#FF7A03]'
                  : 'bg-[#23272D] border-[#2E3238] text-[#8A929C] hover:text-[#EEF1F4]'
                }`}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 stroke-[2.2]" />
                  <span className="hidden xs:inline text-[11px]">Suara ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 stroke-[2.2]" />
                  <span className="hidden xs:inline text-[11px]">Bisu</span>
                </>
              )}
            </button>

            {/* Area sentuh minimal 44px */}
            <button
              type="button"
              onClick={() => setShowExitModal(true)}
              className="min-h-[44px] px-3 rounded-xl bg-[#23272D] border border-[#2E3238] text-xs font-semibold text-red-400 hover:bg-red-500/10 active:scale-95 transition-all flex items-center justify-center flex-shrink-0"
            >
              Akhiri
            </button>
          </div>
        </div>

        {/* Top Progress Bar */}
        <div className="max-w-2xl mx-auto w-full bg-[#23272D] h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-[#FF7A03] h-full transition-all duration-300"
            style={{ width: `${Math.max(5, ((exerciseIndex + 1) / totalExercises) * 100)}%` }}
          />
        </div>
      </div>

      {/* Main Content Area - padded to ensure zero collision with bottom sticky bar */}
      <MobileContainer
        maxWidth="xl"
        withBottomNav={false}
        className="pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))]"
      >
        {/* Media Container (16:9 Illustration / Image dengan Safe Fallback & Uncropped View) */}
        <div className="relative mb-3 sm:mb-4">
          {isStageImage ? (
            <StageImage
              src={currentExerciseData.imageUrl}
              stageName={matchedStageImage?.stage.nama || currentExerciseData.nama}
              skillName={matchedStageImage?.skill.nama}
              stageNumber={matchedStageImage?.stage.stageNumber}
              alt={`Ilustrasi form ${matchedStageImage?.stage.nama || currentExerciseData.nama}`}
              aspectRatioClass="aspect-video max-h-[200px] sm:max-h-[340px]"
              className="w-full h-full object-contain p-2 sm:p-4 drop-shadow-md"
              sizes="(max-width: 390px) calc(100vw - 28px), (max-width: 768px) calc(100vw - 32px), 576px"
            />
          ) : (
            <SafeImage
              src={currentExerciseData.imageUrl}
              alt={`Panduan gerakan ${currentExerciseData.nama} - Ramah kamar kos`}
              aspectRatioClass="aspect-video max-h-[200px] sm:max-h-[340px]"
              className="w-full h-full object-contain p-2 sm:p-4 filter drop-shadow-md"
              fallbackTitle={currentExerciseData.nama}
              fallbackSubtitle="Panduan Form Ideal • Ramah Kamar Kos"
              fallbackType="exercise"
            />
          )}

          {/* Badge Tempo / Mode */}
          <div className="absolute bottom-2.5 left-2.5 bg-[#15171A]/90 backdrop-blur px-2.5 py-1 rounded-lg border border-[#2E3238] text-[10px] sm:text-[11px] font-semibold text-[#FF7A03] shadow-md z-10">
            {isIsometricHold ? 'Mode: Isometric Static Hold' : 'Tempo: 2-1-2 Repetisi'}
          </div>
        </div>

        {/* Exercise Info & Target Badge */}
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h2 className="text-lg sm:text-2xl font-extrabold text-[#EEF1F4] leading-tight">
              {currentExerciseData.nama}
            </h2>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-[#FF7A03]/15 text-[#FF7A03] border-[#FF7A03]/30 flex-shrink-0">
              {currentSessionExercise.sets} Set × {currentSessionExercise.target} {currentSessionExercise.unit}
            </span>
          </div>
          <p className="text-xs text-[#8A929C]">Area Otot: {currentExerciseData.area}</p>
        </div>

        {/* ISOMETRIC HOLD COUNTDOWN / STOPWATCH TIMER COMPONENT (Satu Tangan Ergonomis) */}
        {isIsometricHold && (
          <div className="card-surface p-3 sm:p-5 mb-3 sm:mb-4 border-[#FF7A03]/50 bg-gradient-to-br from-[#23272D] to-[#1C1F24] shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF7A03]">
                <Flame className="w-4 h-4 fill-[#FF7A03]" />
                <span>Isometric Hold Timer</span>
              </div>
              <span className="text-[11px] text-[#8A929C]">
                Target: {currentSessionExercise.target} dtk
              </span>
            </div>

            {/* Hold Counter Display */}
            <div className="text-center py-1.5 sm:py-3 relative">
              <div
                className={`text-4xl sm:text-6xl font-mono font-extrabold tracking-wider transition-colors ${holdTimerElapsed >= currentSessionExercise.target
                    ? 'text-[#FF7A03] animate-pulse'
                    : 'text-[#EEF1F4]'
                  }`}
              >
                {String(Math.floor(holdTimerElapsed / 60)).padStart(2, '0')}:
                {String(holdTimerElapsed % 60).padStart(2, '0')}
              </div>

              <p className="text-xs text-[#8A929C] mt-1 sm:mt-1.5">
                {holdTimerRunning
                  ? 'Pertahankan kontraksi otot, kunci siku & postur!'
                  : holdTimerElapsed > 0
                    ? `Hold tercapai: ${holdTimerElapsed} detik`
                    : 'Ketuk tombol di bawah untuk mulai menahan posisi'}
              </p>
            </div>

            {/* Hold Controls - Ergonomis satu jempol (min 48px) */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              {!holdTimerRunning ? (
                <button
                  type="button"
                  onClick={() => {
                    initOrResumeAudio();
                    setHoldTimerRunning(true);
                  }}
                  className="min-h-[48px] py-3 px-4 rounded-xl bg-[#FF7A03] hover:bg-[#E66E00] text-[#15171A] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all select-none"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{holdTimerElapsed === 0 ? 'Mulai Tahan (Hold)' : 'Lanjutkan Hold'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setHoldTimerRunning(false)}
                  className="min-h-[48px] py-3 px-4 rounded-xl bg-[#23272D] border border-[#FF7A03]/60 text-[#FF7A03] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all select-none"
                >
                  <Pause className="w-4 h-4" />
                  <span>Jeda Sementara</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setHoldTimerRunning(false);
                  setHoldTimerElapsed(0);
                }}
                className="min-h-[48px] py-3 px-4 rounded-xl bg-[#15171A] border border-[#2E3238] text-[#8A929C] hover:text-[#EEF1F4] text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-colors select-none"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Detik</span>
              </button>
            </div>
          </div>
        )}

        {/* Set Logger Section */}
        <div className="card-surface p-3 sm:p-4 mb-3 sm:mb-4 border-[#2E3238]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#EEF1F4]">
              Pencatat Set ({setsDoneForThisExercise} / {currentSessionExercise.sets} Selesai)
            </h3>
            <span className="text-[11px] text-[#8A929C]">
              Satuan: {currentSessionExercise.unit}
            </span>
          </div>

          <div className="space-y-2">
            {Array.from({ length: currentSessionExercise.sets }).map((_, idx) => {
              const setNo = idx + 1;
              const completedItem = completedSets.find(
                (cs) => cs.exerciseId === currentExerciseData.id && cs.noSet === setNo
              );
              const isSetDone = Boolean(completedItem?.selesai);

              return (
                <div
                  key={setNo}
                  className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between gap-3 transition-all min-h-[56px] ${isSetDone
                      ? 'bg-[#15171A] border-[#FF7A03]/40 text-[#EEF1F4]'
                      : 'bg-[#15171A] border-[#2E3238]'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-[#23272D] border border-[#2E3238] text-xs font-bold flex items-center justify-center text-[#EEF1F4] flex-shrink-0">
                      S{setNo}
                    </span>
                    <div>
                      <span className="text-xs font-semibold text-[#EEF1F4] block">
                        Target: {currentSessionExercise.target} {currentSessionExercise.unit}
                      </span>
                      {completedItem && (
                        <p className="text-[11px] text-[#FF7A03]">
                          Tercatat: {completedItem.nilai} {currentSessionExercise.unit}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tombol penyelesaian set - min-h 44px */}
                  <button
                    type="button"
                    onClick={() =>
                      handleCompleteSet(
                        setNo,
                        holdTimerElapsed > 0 ? holdTimerElapsed : currentSessionExercise.target
                      )
                    }
                    className={`min-h-[44px] min-w-[100px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all select-none active:scale-95 ${isSetDone
                        ? 'bg-[#FF7A03]/20 text-[#FF7A03] border border-[#FF7A03]/40'
                        : 'bg-[#FF7A03] text-[#15171A] hover:bg-[#E66E00] shadow-sm'
                      }`}
                  >
                    {isSetDone ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Selesai ✓</span>
                      </>
                    ) : (
                      <span>
                        {holdTimerElapsed > 0
                          ? `Catat ${holdTimerElapsed}s`
                          : 'Selesai Set'}
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* REST TIMER 45 DETIK CARD (Nyaman dipakai satu tangan) */}
        {timerRunning && (
          <div className="card-surface p-4 sm:p-5 mb-4 border-[#FF7A03]/50 bg-[#23272D] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#FF7A03]">
                <Clock className="w-4 h-4 animate-spin-slow" />
                <span>Rest Timer (Istirahat Antar Set)</span>
              </div>
              <span className="text-[11px] text-[#8A929C]">Tarik napas teratur</span>
            </div>

            <div className="text-center py-2 sm:py-3">
              <div className="text-5xl sm:text-6xl font-mono font-black text-[#FF7A03] tracking-wider">
                {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:
                {String(timerSeconds % 60).padStart(2, '0')}
              </div>
              <p className="text-xs text-[#8A929C] mt-1">
                {timerSeconds === 0 ? 'Waktu istirahat habis! Siap gas set berikutnya.' : 'Ototmu lagi mengisi ulang tenaga.'}
              </p>
            </div>

            {/* Quick Adjust Buttons - min 48px touch */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleAdjustTimer(-15)}
                className="min-h-[48px] py-3 rounded-xl bg-[#15171A] border border-[#2E3238] text-xs sm:text-sm font-bold text-[#EEF1F4] hover:border-[#8A929C] active:scale-95 transition-all"
              >
                -15 dtk
              </button>
              <button
                type="button"
                onClick={() => handleAdjustTimer(15)}
                className="min-h-[48px] py-3 rounded-xl bg-[#15171A] border border-[#2E3238] text-xs sm:text-sm font-bold text-[#EEF1F4] hover:border-[#8A929C] active:scale-95 transition-all"
              >
                +15 dtk
              </button>
              <button
                type="button"
                onClick={handleSkipTimer}
                className="min-h-[48px] py-3 rounded-xl bg-[#FF7A03]/20 text-[#FF7A03] border border-[#FF7A03]/40 text-xs sm:text-sm font-bold hover:bg-[#FF7A03]/30 active:scale-95 transition-all"
              >
                Lewati
              </button>
            </div>
          </div>
        )}

        {/* Technique Points Checklist */}
        <div className="card-surface p-3 sm:p-4 mb-3 sm:mb-3.5 border-[#2E3238]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A929C] mb-1.5 sm:mb-2">
            Poin Teknik Utama:
          </h3>
          <ul className="space-y-1 sm:space-y-1.5">
            {currentExerciseData.langkah.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-[#EEF1F4] leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-[#FF7A03] flex-shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Common Mistakes Warning Box */}
        <div className="p-3 sm:p-4 rounded-xl bg-[#FF7A03]/10 border border-[#FF7A03]/30 mb-3 sm:mb-3.5">
          <div className="flex items-center gap-1.5 text-[#FF7A03] text-xs font-bold mb-1 sm:mb-1.5">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Peringatan Kesalahan Umum:</span>
          </div>
          <ul className="space-y-1 text-xs text-[#EEF1F4]/90 pl-5 list-disc">
            {currentExerciseData.kesalahanUmum.map((mistake, idx) => (
              <li key={idx}>{mistake}</li>
            ))}
          </ul>
        </div>

        {/* Modification Chips: Lebih Mudah / Lebih Sulit - min touch 44px */}
        <div className="card-surface p-2.5 sm:p-3.5 mb-3 sm:mb-4 border-[#2E3238]">
          <div className="text-[11px] font-bold text-[#8A929C] uppercase tracking-wider mb-1.5 sm:mb-2">
            Variasi Gerakan (Pilihan Penyesuaian Level):
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
              className="min-h-[44px] px-3 py-2 rounded-xl bg-[#15171A] border border-[#2E3238] hover:border-[#8A929C] text-left text-xs transition-colors active:scale-98"
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
              className="min-h-[44px] px-3 py-2 rounded-xl bg-[#15171A] border border-[#2E3238] hover:border-[#8A929C] text-left text-xs transition-colors active:scale-98"
            >
              <span className="text-[#8A929C] block text-[10px]">Lebih sulit:</span>
              <span className="font-semibold text-[#EEF1F4]">{currentExerciseData.lebihSulit}</span>
            </button>
          </div>
        </div>
      </MobileContainer>

      {/* Sticky Bottom Action - Ergonomis satu jempol, safe-area bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] bg-[#15171A]/95 backdrop-blur border-t border-[#2E3238] z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-xl mx-auto">
          <button
            type="button"
            disabled={isFinishing}
            onClick={handleNextOrFinish}
            className="w-full btn-brand min-h-[50px] py-3.5 text-sm sm:text-base font-bold shadow-xl shadow-[#FF7A03]/20 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {exerciseIndex < totalExercises - 1 ? (
              <>
                <span>Gerakan Berikutnya</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            ) : isFinishing ? (
              <>
                <span>Menyimpan Progres...</span>
              </>
            ) : (
              <>
                <span>Selesai Latihan & Simpan Progres 🎉</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="card-surface p-5 sm:p-6 max-w-sm w-full border-[#2E3238] shadow-2xl">
            <h3 className="text-base sm:text-lg font-bold text-[#EEF1F4] mb-1.5">Akhiri Latihan?</h3>
            <p className="text-xs text-[#8A929C] mb-4 leading-relaxed">
              Progresmu sejauh ini tetap tersimpan aman di aplikasi. Kamu bisa melanjutkannya kapan saja dari beranda.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="flex-1 btn-outline min-h-[44px] py-2.5 text-xs font-semibold"
              >
                Lanjut Latihan
              </button>
              <button
                type="button"
                onClick={handleExitWorkout}
                className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold hover:bg-red-500/30 flex items-center justify-center"
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
          <div className="card-surface p-5 sm:p-6 max-w-sm w-full border-[#2E3238] shadow-2xl">
            <div className="flex items-center gap-2 text-[#FF7A03] mb-2 font-bold text-sm">
              <Info className="w-4 h-4" />
              <span>{tipModal.title}</span>
            </div>
            <p className="text-xs text-[#EEF1F4] mb-4 leading-relaxed">
              {tipModal.content}
            </p>
            <button
              type="button"
              onClick={() => setTipModal(null)}
              className="w-full btn-brand min-h-[44px] py-2.5 text-xs font-bold"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
