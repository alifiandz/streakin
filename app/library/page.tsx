'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, CheckCircle2 } from 'lucide-react';
import { useWorkout } from '@/context/WorkoutContext';
import { SEED_SESSIONS } from '@/src/data/seedSessions';
import { SEED_EXERCISES } from '@/src/data/seedExercises';
import { MobileContainer } from '@/components/layout/MobileContainer';

export default function LibraryPage() {
  const router = useRouter();
  const { library, saveLibrary } = useWorkout();

  // Durasi options (default kosong untuk user baru sebelum memilih)
  const [selectedDurations, setSelectedDurations] = useState<number[]>(
    library?.durasi && library.durasi.length > 0 ? library.durasi : []
  );

  // Fokus options (default kosong untuk user baru sebelum memilih)
  const [selectedFocuses, setSelectedFocuses] = useState<string[]>(
    library?.fokus && library.fokus.length > 0 ? library.fokus : []
  );

  // Selected session IDs (default kosong untuk user baru sebelum memilih)
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>(
    library?.sessionIds && library.sessionIds.length > 0 ? library.sessionIds : []
  );

  useEffect(() => {
    if (library) {
      if (library.durasi?.length) setSelectedDurations(library.durasi);
      if (library.fokus?.length) setSelectedFocuses(library.fokus);
      if (library.sessionIds?.length) setSelectedSessionIds(library.sessionIds);
    }
  }, [library]);

  const toggleDuration = (dur: number) => {
    setSelectedDurations((prev) =>
      prev.includes(dur) ? prev.filter((d) => d !== dur) : [...prev, dur]
    );
  };

  const toggleFocus = (fok: string) => {
    setSelectedFocuses((prev) =>
      prev.includes(fok) ? prev.filter((f) => f !== fok) : [...prev, fok]
    );
  };

  const toggleSession = (id: string) => {
    setSelectedSessionIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  // Filter sessions: jika salah satu filter aktif, cocokkan dengan filter yang dipilih
  const filteredSessions = SEED_SESSIONS.filter((session) => {
    // Jika tidak ada durasi yang dipilih, abaikan filter durasi (lolos)
    const matchDur =
      selectedDurations.length === 0 ||
      selectedDurations.some((dur) => Math.abs(session.durasiMenit - dur) <= 3);

    // Jika tidak ada fokus yang dipilih, abaikan filter fokus (lolos)
    const matchFok =
      selectedFocuses.length === 0 ||
      selectedFocuses.some((f) => session.fokus.toLowerCase().includes(f.toLowerCase()));

    // Jika kedua filter aktif, ambil sesi yang memenuhi fokus ATAU durasi agar program variatif
    if (selectedDurations.length > 0 && selectedFocuses.length > 0) {
      return matchDur && matchFok;
    }

    return matchDur && matchFok;
  });

  const handleSave = async () => {
    if (selectedSessionIds.length === 0) return;
    await saveLibrary(selectedDurations, selectedFocuses, selectedSessionIds);
    router.push('/home');
  };

  return (
    <div className="min-h-[100dvh] bg-[#15171A] text-[#EEF1F4] overflow-x-hidden">
      <MobileContainer maxWidth="6xl">
        {/* Header */}
        <div className="mb-3 sm:mb-6">
          <h1 className="text-xl sm:text-3xl font-extrabold text-[#EEF1F4] flex items-center gap-2">
            <span>Susun Library Latihan</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8A929C] mt-0.5">
            Personalisasi program kalistenik ringkas sesuai jadwal belajar & waktu luangmu.
          </p>
        </div>

        {/* Filters: 2-kolom di Laptop (lg), tumpuk di HP */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-4 mb-3.5 sm:mb-6">
          {/* Filter Step 1: Durasi */}
          <div className="card-surface p-3 sm:p-5 border-[#2E3238]">
            <div className="flex items-center justify-between mb-2 sm:mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#EEF1F4]">
                Langkah 1: Durasi Sesi
              </label>
              <span className="text-[11px] text-[#8A929C]">Multi-pilih</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[10, 15, 30].map((dur) => {
                const active = selectedDurations.includes(dur);
                return (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => toggleDuration(dur)}
                    className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all min-h-[44px] active:scale-95 ${
                      active
                        ? 'bg-[#FF7A03] text-[#15171A] shadow-md shadow-[#FF7A03]/15'
                        : 'bg-[#15171A] text-[#8A929C] border border-[#2E3238] hover:text-[#EEF1F4]'
                    }`}
                  >
                    {dur} Menit
                    {active && <Check className="w-4 h-4 stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Step 2: Fokus */}
          <div className="card-surface p-3 sm:p-5 border-[#2E3238]">
            <div className="flex items-center justify-between mb-2 sm:mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#EEF1F4]">
                Langkah 2: Fokus Latihan
              </label>
              <span className="text-[11px] text-[#8A929C]">
                {selectedFocuses.length} Terpilih
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Push', 'Legs', 'Pull dan core', 'Full body', 'Skill Mastery'].map((fok) => {
                const active = selectedFocuses.includes(fok);
                const label =
                  fok === 'Pull dan core'
                    ? 'Pull & Core'
                    : fok === 'Full body'
                    ? 'Full Body'
                    : fok === 'Skill Mastery'
                    ? 'Skill Kalistenik'
                    : fok;
                return (
                  <button
                    key={fok}
                    type="button"
                    onClick={() => toggleFocus(fok)}
                    className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all min-h-[44px] active:scale-95 ${
                      active
                        ? 'bg-[#FF7A03] text-[#15171A] shadow-md shadow-[#FF7A03]/15'
                        : 'bg-[#15171A] text-[#8A929C] border border-[#2E3238] hover:text-[#EEF1F4]'
                    }`}
                  >
                    {label}
                    {active && <Check className="w-4 h-4 stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Matching Sessions List */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center justify-between mb-2 sm:mb-2.5">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#8A929C]">
              Program Sesi Tersedia ({filteredSessions.length})
            </h2>
            <span className="text-xs text-[#FF7A03] font-semibold">
              {selectedSessionIds.length} Sesi Tercentang
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {filteredSessions.map((session) => {
              const isChecked = selectedSessionIds.includes(session.id);
              const exNames = session.exercises
                .map((se) => SEED_EXERCISES.find((e) => e.id === se.exerciseId)?.nama)
                .filter(Boolean)
                .join(', ');

              return (
                <div
                  key={session.id}
                  onClick={() => toggleSession(session.id)}
                  className={`card-surface p-3 sm:p-4 cursor-pointer transition-all border min-h-[52px] select-none ${
                    isChecked
                      ? 'border-[#FF7A03]/60 bg-[#23272D]'
                      : 'border-[#2E3238] opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    {/* Custom Checkbox - area sentuh nyaman */}
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        isChecked
                          ? 'bg-[#FF7A03] text-[#15171A]'
                          : 'bg-[#15171A] border border-[#2E3238] text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-bold text-sm sm:text-base text-[#EEF1F4] truncate">
                          {session.nama}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#15171A] border border-[#2E3238] text-[#FF7A03] flex-shrink-0">
                          {session.durasiMenit} Mnt • {session.fokus}
                        </span>
                      </div>

                      <p className="text-xs text-[#8A929C] line-clamp-2 mb-2">
                        Gerakan: {exNames}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-[#8A929C]">
                        <span className="bg-[#15171A] px-2 py-0.5 rounded border border-[#2E3238]">
                          {session.exercises.length} Gerakan
                        </span>
                        <span className="bg-[#15171A] px-2 py-0.5 rounded border border-[#2E3238]">
                          Ramah kamar kos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky Bottom Save Bar - posisikan aman di atas BottomNav */}
        <div className="sticky bottom-20 md:bottom-6 card-surface p-3.5 sm:p-4 border-[#2E3238] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#23272D]/95 backdrop-blur z-30">
          <div className="text-xs text-[#8A929C] text-center sm:text-left">
            <span className="font-bold text-[#EEF1F4]">
              {selectedSessionIds.length} Sesi Terpilih
            </span>
            <p>Pilih minimal 1 sesi untuk mengaktifkan library.</p>
          </div>
          <button
            type="button"
            disabled={selectedSessionIds.length === 0}
            onClick={handleSave}
            className={`w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 ${
              selectedSessionIds.length > 0
                ? 'btn-brand shadow-lg shadow-[#FF7A03]/20'
                : 'bg-[#2E3238] text-[#8A929C] cursor-not-allowed'
            }`}
          >
            <span>Simpan Library & Terapkan</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </MobileContainer>
    </div>
  );
}
