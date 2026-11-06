import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Zap,
  Clock,
  ShieldCheck,
  Flame,
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MobileContainer } from '../components/layout/MobileContainer';

export const Index: React.FC = () => {
  const { currentUser } = useAuth();

  // If already logged in, redirect straight to /home
  if (currentUser) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen bg-[#15171A] text-[#EEF1F4]">
      <MobileContainer maxWidth="4xl" withBottomNav={false}>
        {/* Hero Section */}
        <div className="pt-6 sm:pt-12 pb-10 text-center max-w-2xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#23272D] border border-[#2E3238] text-xs font-semibold text-[#C8F135] mb-6 shadow-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dibuat Khusus Siswa SMA / SMK</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.15] text-[#EEF1F4] mb-4">
            Latihan calisthenic,{' '}
            <span className="text-[#C8F135] underline decoration-[#C8F135]/40 decoration-wavy underline-offset-4">
              pas di sela jadwal sibukmu
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#8A929C] leading-relaxed mb-8 max-w-xl mx-auto">
            Sesi 10–30 menit tanpa alat. Mulai dengan sekali klik tanpa alur rumit setelah lelah belajar seharian.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto">
            <Link
              to="/akun?tab=register"
              className="w-full sm:w-auto flex-1 btn-brand px-6 py-3.5 text-base font-bold shadow-lg shadow-[#C8F135]/15 flex items-center justify-center gap-2"
            >
              <span>Buat Akun Gratis</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
            <Link
              to="/akun?tab=login"
              className="w-full sm:w-auto flex-1 btn-outline px-6 py-3.5 text-base font-semibold flex items-center justify-center gap-2"
            >
              <span>Masuk Akun</span>
            </Link>
          </div>

          {/* Quick Demo Hint */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#8A929C]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C8F135]" />
            <span>Tersedia akun demo cepat & tanpa kartu kredit</span>
          </div>
        </div>

        {/* Live Session Card Preview (Section 5.1) */}
        <div className="my-8">
          <div className="text-center mb-4">
            <span className="text-xs uppercase tracking-wider font-bold text-[#8A929C]">
              Pratinjau Sesi Hari Ini
            </span>
          </div>

          <div className="card-surface p-5 sm:p-7 relative overflow-hidden max-w-xl mx-auto border-[#2E3238] shadow-2xl">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#C8F135]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C8F135]/15 text-[#C8F135] border border-[#C8F135]/30">
                <span className="w-2 h-2 rounded-full bg-[#C8F135] animate-ping" />
                Sesi Rekomendasi Hari Ini
              </span>
              <span className="text-xs font-semibold text-[#8A929C] bg-[#15171A] px-2.5 py-1 rounded-lg border border-[#2E3238]">
                15 Menit • Push
              </span>
            </div>

            <div className="mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#EEF1F4] mb-1">
                Push 15 (Fokus Dada & Trisep)
              </h2>
              <p className="text-xs sm:text-sm text-[#8A929C]">
                Membangun postur bahu tegap setelah seharian duduk di meja sekolah. Ramah kamar kos tanpa suara hentakan.
              </p>
            </div>

            {/* Target Exercises Tags */}
            <div className="mb-6">
              <div className="text-[11px] font-semibold text-[#8A929C] uppercase tracking-wider mb-2">
                Daftar Gerakan Target (4 Gerakan):
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#15171A] border border-[#2E3238] p-2.5 rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-[#EEF1F4]">Push-up</span>
                  <span className="text-[11px] text-[#8A929C]">3 × 8 reps</span>
                </div>
                <div className="bg-[#15171A] border border-[#2E3238] p-2.5 rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-[#EEF1F4]">Incline Push-up</span>
                  <span className="text-[11px] text-[#8A929C]">3 × 10 reps</span>
                </div>
                <div className="bg-[#15171A] border border-[#2E3238] p-2.5 rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-[#EEF1F4]">Dead Bug</span>
                  <span className="text-[11px] text-[#8A929C]">3 × 8 reps</span>
                </div>
                <div className="bg-[#15171A] border border-[#2E3238] p-2.5 rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-[#EEF1F4]">Plank</span>
                  <span className="text-[11px] text-[#8A929C]">3 × 30 dtk</span>
                </div>
              </div>
            </div>

            {/* Start Button Simulation */}
            <Link
              to="/akun?tab=register"
              className="w-full btn-brand py-3.5 text-sm font-bold flex items-center justify-center gap-2 group"
            >
              <Play className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
              <span>Mulai Sesi Ini Sekarang</span>
            </Link>
          </div>
        </div>

        {/* 3 Benefit Pillars (Section 5.1 & Section 1) */}
        <div className="mt-12 sm:mt-16">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#EEF1F4]">
              Mengapa Siswa Memilih Calisthenic Siswa?
            </h2>
            <p className="text-xs sm:text-sm text-[#8A929C] mt-1">
              Didesain khusus mengatasi kendala waktu dan kelelahan mental pelajar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pillar 1 */}
            <div className="card-surface p-5 flex flex-col justify-between border-[#2E3238] hover:border-[#8A929C] transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#C8F135]/15 border border-[#C8F135]/30 text-[#C8F135] flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#EEF1F4] mb-2">
                  Sesi Singkat 10–30 Menit
                </h3>
                <p className="text-xs sm:text-sm text-[#8A929C] leading-relaxed">
                  Pas di sela istirahat belajar atau sebelum mandi sore. Tidak butuh alat gym maupun waktu perjalanan.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#2E3238] text-[11px] text-[#C8F135] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Langsung mulai dengan 1 klik</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="card-surface p-5 flex flex-col justify-between border-[#2E3238] hover:border-[#8A929C] transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#FF7A3D]/15 border border-[#FF7A3D]/30 text-[#FF7A3D] flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#EEF1F4] mb-2">
                  Panduan Gerakan Aman
                </h3>
                <p className="text-xs sm:text-sm text-[#8A929C] leading-relaxed">
                  Poin teknik ringkas, peringatan kesalahan umum berisiko cedera, serta opsi penyesuaian level lebih mudah dan lebih sulit.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#2E3238] text-[11px] text-[#FF7A3D] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Pilihan regresi & progresi</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="card-surface p-5 flex flex-col justify-between border-[#2E3238] hover:border-[#8A929C] transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#C8F135]/15 border border-[#C8F135]/30 text-[#C8F135] flex items-center justify-center mb-4">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-[#EEF1F4] mb-2">
                  Catat Otomatis & Jaga Streak
                </h3>
                <p className="text-xs sm:text-sm text-[#8A929C] leading-relaxed">
                  Timer istirahat 45 detik otomatis, pencatat set yang mudah diisi, dan tracker streak 7 hari untuk memicu konsistensi.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#2E3238] text-[11px] text-[#C8F135] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Simpan latihan terputus</span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="mt-12 p-4 rounded-xl bg-[#23272D]/60 border border-[#2E3238] text-center max-w-xl mx-auto">
          <p className="text-xs text-[#8A929C]">
            ⚠️ <span className="font-semibold text-[#EEF1F4]">Catatan Keselamatan:</span> Hentikan latihan jika terasa nyeri berlebihan. Aplikasi ini ditujukan untuk kebugaran mandiri dan bukan pengganti anjuran tenaga medis.
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-14 pt-6 border-t border-[#2E3238] text-center text-xs text-[#8A929C]">
          <p className="flex items-center justify-center gap-1.5 mb-1">
            <Zap className="w-3.5 h-3.5 text-[#C8F135]" />
            <span className="font-semibold text-[#EEF1F4]">Calisthenic Siswa Sibuk</span> — Dibangun untuk pelajar produktif.
          </p>
          <p>© 2026 Calisthenic Siswa. Semua hak dilindungi.</p>
        </footer>
      </MobileContainer>
    </div>
  );
};
