import React, { useState } from 'react';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { MobileContainer } from '../components/layout/MobileContainer';

export const Notification: React.FC = () => {
  const { reminder, updateReminder } = useWorkout();

  const [aktif, setAktif] = useState(reminder.aktif);
  const [jam, setJam] = useState(reminder.jam || '16:00');
  const [savedBanner, setSavedBanner] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateReminder(aktif, jam);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#15171A] text-[#EEF1F4]">
      <MobileContainer maxWidth="xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/home"
            className="inline-flex items-center gap-1.5 text-xs text-[#8A929C] hover:text-[#EEF1F4] mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#EEF1F4]">
            Pengaturan Pengingat
          </h1>
          <p className="text-xs sm:text-sm text-[#8A929C] mt-0.5">
            Atur jam pengingat latihan harian agar tidak terlewat di sela aktivitas sekolah.
          </p>
        </div>

        {/* Feedback Banner */}
        {savedBanner && (
          <div className="p-4 rounded-xl bg-[#C8F135]/15 border border-[#C8F135]/40 text-[#C8F135] text-xs font-semibold flex items-center gap-2 mb-5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Pengingat berhasil disimpan untuk pukul {jam} WIB.</span>
          </div>
        )}

        {/* Settings Card */}
        <div className="card-surface p-5 sm:p-7 border-[#2E3238]">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Toggle Switch */}
            <div className="flex items-center justify-between pb-5 border-b border-[#2E3238]">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#EEF1F4]">
                  Pengingat Latihan Harian
                </h3>
                <p className="text-xs text-[#8A929C] mt-0.5">
                  Kirim alarm pengingat setiap hari di jam belajar/istirahat.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={aktif}
                onClick={() => setAktif(!aktif)}
                className={`w-14 h-8 rounded-full transition-colors relative p-1 flex-shrink-0 ${
                  aktif ? 'bg-[#C8F135]' : 'bg-[#15171A] border border-[#2E3238]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full transition-transform ${
                    aktif
                      ? 'translate-x-6 bg-[#15171A]'
                      : 'translate-x-0 bg-[#8A929C]'
                  }`}
                />
              </button>
            </div>

            {/* Time Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8A929C] mb-2">
                Pilih Jam Pengingat (WIB):
              </label>
              <div className="relative max-w-xs">
                <input
                  type="time"
                  disabled={!aktif}
                  value={jam}
                  onChange={(e) => setJam(e.target.value)}
                  className={`w-full bg-[#15171A] border rounded-xl px-4 py-3 text-base font-semibold focus:outline-none transition-colors ${
                    aktif
                      ? 'border-[#2E3238] focus:border-[#C8F135] text-[#EEF1F4]'
                      : 'border-[#2E3238] text-[#8A929C] opacity-50 cursor-not-allowed'
                  }`}
                />
              </div>
              <p className="text-[11px] text-[#8A929C] mt-2">
                *Waktu rekomendasi: 16:00 (sepulang sekolah) atau 20:30 (sebelum tidur).
              </p>
            </div>

            <button
              type="submit"
              className="w-full btn-brand py-3.5 text-sm font-bold shadow-lg shadow-[#C8F135]/20 flex items-center justify-center gap-2"
            >
              <span>Simpan Pengaturan</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        </div>
      </MobileContainer>
    </div>
  );
};
