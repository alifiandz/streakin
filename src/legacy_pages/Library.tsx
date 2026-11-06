import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CheckCircle2 } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { SEED_SESSIONS } from '../data/seedSessions';
import { SEED_EXERCISES } from '../data/seedExercises';
import { MobileContainer } from '../components/layout/MobileContainer';

export const Library: React.FC = () => {
  const navigate = useNavigate();
  const { library, saveLibrary } = useWorkout();

  // Durasi options
  const [selectedDurations, setSelectedDurations] = useState<number[]>(
    library?.durasi && library.durasi.length > 0 ? library.durasi : [10, 15]
  );

  // Fokus options
  const [selectedFocuses, setSelectedFocuses] = useState<string[]>(
    library?.fokus && library.fokus.length > 0 ? library.fokus : ['Push', 'Legs']
  );

  // Selected session IDs
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>(
    library?.sessionIds && library.sessionIds.length > 0 ? library.sessionIds : ['s1', 's2', 's4', 's5']
  );

  useEffect(() => {
    if (library) {
      if (library.durasi?.length) setSelectedDurations(library.durasi);
      if (library.fokus?.length) setSelectedFocuses(library.fokus);
      if (library.sessionIds?.length) setSelectedSessionIds(library.sessionIds);
    }
  }, [library]);

  const toggleDuration = (dur: number) => {
    setSelectedDurations(prev =>
      prev.includes(dur) ? prev.filter(d => d !== dur) : [...prev, dur]
    );
  };

  const toggleFocus = (fok: string) => {
    setSelectedFocuses(prev =>
      prev.includes(fok) ? prev.filter(f => f !== fok) : [...prev, fok]
    );
  };

  const toggleSession = (id: string) => {
    setSelectedSessionIds(prev =>
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  // Filter sessions matching selected duration OR focus (or all matching)
  const filteredSessions = SEED_SESSIONS.filter(session => {
    const matchDur = selectedDurations.length === 0 || selectedDurations.includes(session.durasiMenit);
    const matchFok = selectedFocuses.length === 0 || selectedFocuses.some(f => session.fokus.toLowerCase().includes(f.toLowerCase()));
    return matchDur && matchFok;
  });

  const handleSave = () => {
    if (selectedSessionIds.length === 0) return;
    saveLibrary(selectedDurations, selectedFocuses, selectedSessionIds);
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#15171A] text-[#EEF1F4]">
      <MobileContainer maxWidth="4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#EEF1F4] flex items-center gap-2">
            <span>Susun Library Latihan</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8A929C] mt-1">
            Personalisasi program calisthenics ringkas sesuai jadwal belajar & waktu luangmu.
          </p>
        </div>

        {/* Filter Step 1: Durasi */}
        <div className="card-surface p-4 sm:p-5 mb-4 border-[#2E3238]">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#EEF1F4]">
              Langkah 1: Durasi Sesi
            </label>
            <span className="text-[11px] text-[#8A929C]">Multi-pilih</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {[10, 15, 30].map(dur => {
              const active = selectedDurations.includes(dur);
              return (
                <button
                  key={dur}
                  type="button"
                  onClick={() => toggleDuration(dur)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all min-h-[44px] ${
                    active
                      ? 'bg-[#C8F135] text-[#15171A] shadow-md shadow-[#C8F135]/15'
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
        <div className="card-surface p-4 sm:p-5 mb-6 border-[#2E3238]">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#EEF1F4]">
              Langkah 2: Fokus Latihan
            </label>
            <span className="text-[11px] text-[#8A929C]">
              {selectedFocuses.length} Terpilih
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {['Push', 'Legs', 'Pull dan core', 'Full body'].map(fok => {
              const active = selectedFocuses.includes(fok);
              const label = fok === 'Pull dan core' ? 'Pull & Core' : fok === 'Full body' ? 'Full Body' : fok;
              return (
                <button
                  key={fok}
                  type="button"
                  onClick={() => toggleFocus(fok)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all min-h-[44px] ${
                    active
                      ? 'bg-[#C8F135] text-[#15171A] shadow-md shadow-[#C8F135]/15'
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

        {/* Matching Sessions List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#8A929C]">
              Program Sesi Tersedia ({filteredSessions.length})
            </h2>
            <span className="text-xs text-[#C8F135] font-semibold">
              {selectedSessionIds.length} Sesi Tercentang
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredSessions.map(session => {
              const isChecked = selectedSessionIds.includes(session.id);
              // Get exercise names
              const exNames = session.exercises
                .map(se => SEED_EXERCISES.find(e => e.id === se.exerciseId)?.nama)
                .filter(Boolean)
                .join(', ');

              return (
                <div
                  key={session.id}
                  onClick={() => toggleSession(session.id)}
                  className={`card-surface p-4 cursor-pointer transition-all border ${
                    isChecked
                      ? 'border-[#C8F135]/60 bg-[#23272D]'
                      : 'border-[#2E3238] opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Custom Checkbox */}
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        isChecked
                          ? 'bg-[#C8F135] text-[#15171A]'
                          : 'bg-[#15171A] border border-[#2E3238] text-transparent'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-bold text-sm sm:text-base text-[#EEF1F4] truncate">
                          {session.nama}
                        </h3>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#15171A] border border-[#2E3238] text-[#C8F135] flex-shrink-0">
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
                          Kos-friendly
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky Bottom Save Bar */}
        <div className="sticky bottom-20 md:bottom-6 card-surface p-4 border-[#2E3238] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#23272D]/95 backdrop-blur">
          <div className="text-xs text-[#8A929C] text-center sm:text-left">
            <span className="font-bold text-[#EEF1F4]">{selectedSessionIds.length} Sesi Terpilih</span>
            <p>Pilih minimal 1 sesi untuk mengaktifkan library.</p>
          </div>
          <button
            type="button"
            disabled={selectedSessionIds.length === 0}
            onClick={handleSave}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              selectedSessionIds.length > 0
                ? 'btn-brand shadow-lg shadow-[#C8F135]/20'
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
};
