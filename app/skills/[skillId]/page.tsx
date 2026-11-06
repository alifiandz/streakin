'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  Flame,
  AlertTriangle,
  Play,
  ShieldCheck,
  ChevronRight,
  Info,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useWorkout } from '@/context/WorkoutContext';
import { SEED_SKILLS } from '@/lib/seedData';
import { MobileContainer } from '@/components/layout/MobileContainer';
import { StageImage } from '@/components/ui/StageImage';

export default function SkillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const skillId = (params?.skillId as string) || '';
  const { getSkillProgress, updateSkillStage } = useWorkout();

  const normalizedSkillId = skillId === 'front-lever' ? 'elbow-lever' : skillId;
  const skill = SEED_SKILLS.find((s) => s.id === normalizedSkillId) || SEED_SKILLS.find((s) => s.id === skillId);

  // Jika ID skill tidak dikenali, tampilkan pesan ramah (BUG-05)
  if (!skill) {
    return (
      <div className="min-h-[100dvh] bg-[#15171A] text-[#EEF1F4] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FF7A03]/15 border border-[#FF7A03]/30 flex items-center justify-center text-[#FF7A03] mb-4">
          <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
        </div>
        <h1 className="text-lg sm:text-xl font-bold mb-2">Skill Tidak Ditemukan</h1>
        <p className="text-xs sm:text-sm text-[#8A929C] max-w-sm mb-6">
          Skill kalistenik yang kamu cari tidak terdaftar dalam roadmap 5 stage StreakIn.
        </p>
        <Link href="/skills" className="btn-brand min-h-[44px] py-2.5 px-6 text-xs font-bold rounded-xl inline-flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Skill</span>
        </Link>
      </div>
    );
  }

  const userProg = getSkillProgress(skill.id);
  const currentStageNum = userProg.currentStage || 1;

  // Selected stage tab in timeline
  const [selectedStageTab, setSelectedStageTab] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    setSelectedStageTab(currentStageNum);
  }, [currentStageNum]);

  const selectedStageData =
    skill.stages.find((s) => s.stageNumber === selectedStageTab) || skill.stages[0];

  const handleAdvanceStage = async (newStage: number) => {
    await updateSkillStage(skill.id, newStage);
    setSelectedStageTab(newStage);
    setToastMessage(`Selamat! Stage aktifmu kini naik ke Stage ${newStage}: ${skill.stages[newStage - 1]?.nama || ''}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="min-h-[100dvh] bg-[#15171A] text-[#EEF1F4] overflow-x-hidden">
      <MobileContainer maxWidth="6xl">
        {/* Back Link - area sentuh min 44px */}
        <div className="mb-1.5 sm:mb-2">
          <Link
            href="/skills"
            className="min-h-[44px] inline-flex items-center gap-1.5 text-xs text-[#8A929C] hover:text-[#EEF1F4] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Skill</span>
          </Link>
        </div>

        {/* Success Toast Banner */}
        {toastMessage && (
          <div className="p-2.5 sm:p-3.5 rounded-xl bg-[#FF7A03]/15 border border-[#FF7A03]/40 text-[#FF7A03] text-xs font-semibold flex items-center gap-2 mb-3 sm:mb-4 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Skill Hero Header */}
        <div className="card-surface p-3 sm:p-6 border-[#2E3238] mb-3 sm:mb-6 relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: skill.badgeColor }}
          />

          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-2.5">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border"
                style={{
                  backgroundColor: `${skill.badgeColor}15`,
                  color: skill.badgeColor,
                  borderColor: `${skill.badgeColor}40`,
                }}
              >
                Level: {skill.level}
              </span>
              <span className="text-xs text-[#8A929C] bg-[#15171A] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border border-[#2E3238]">
                {skill.kategori}
              </span>
            </div>

            <span className="text-xs text-[#8A929C] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Estimasi: {skill.durasiMingguEstimasi}
            </span>
          </div>

          <h1 className="text-lg sm:text-3xl font-extrabold text-[#EEF1F4] mb-1">
            {skill.nama}
          </h1>
          <p className="text-xs sm:text-sm text-[#8A929C] leading-relaxed max-w-2xl mb-2.5 sm:mb-3.5">
            {skill.deskripsi}
          </p>

          {/* User Progress Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-xl bg-[#15171A] border border-[#2E3238]">
            <div>
              <span className="text-[10px] text-[#8A929C] block">Stage Aktifmu</span>
              <span className="text-xs sm:text-sm font-extrabold text-[#FF7A03]">
                Stage {currentStageNum} / {skill.stages.length}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-[#8A929C] block">Rekor Hold Terbaik (PB)</span>
              <span className="text-xs sm:text-sm font-extrabold text-[#FF7A03] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-[#FF7A03]" />
                {userProg.bestHoldSec || 0} Detik
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center justify-start sm:justify-end">
              <span className="text-[11px] text-[#8A929C]">
                Target: {skill.stages[skill.stages.length - 1]?.targetHoldSec} dtk Full Hold
              </span>
            </div>
          </div>
        </div>

        {/* Catatan Keamanan Per Skill */}
        {skill.catatanAman && (
          <div className="p-2.5 sm:p-4 rounded-2xl bg-[#FF7A03]/10 border border-[#FF7A03]/30 mb-3 sm:mb-6 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#FF7A03] flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-[#FF7A03] block mb-0.5">
                Catatan Keamanan & Pemanasan ({skill.nama})
              </span>
              <p className="text-xs text-[#EEF1F4] leading-relaxed">
                {skill.catatanAman}
              </p>
            </div>
          </div>
        )}

        {/* 5-Stage Interactive Progression Timeline */}
        <div className="mb-3 sm:mb-6">
          <div className="flex items-center justify-between mb-2 sm:mb-2.5">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#8A929C]">
              Jalur Progresi 5 Stage
            </h2>
            <span className="text-[11px] text-[#FF7A03] font-semibold">
              Stage {selectedStageTab} Terpilih
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {skill.stages.map((st) => {
              const isSelected = selectedStageTab === st.stageNumber;
              const isCurrent = currentStageNum === st.stageNumber;
              const isPassed = currentStageNum > st.stageNumber;
              const isNext = st.stageNumber === currentStageNum + 1;

              return (
                <button
                  key={st.stageNumber}
                  type="button"
                  onClick={() => setSelectedStageTab(st.stageNumber)}
                  className={`p-1 sm:p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-h-[50px] sm:min-h-[68px] min-w-[44px] active:scale-95 ${
                    isSelected
                      ? 'bg-[#23272D] border-[#FF7A03] ring-1 ring-[#FF7A03] shadow-md shadow-[#FF7A03]/15'
                      : isPassed
                      ? 'bg-[#15171A] border-emerald-500/40 text-emerald-400'
                      : isCurrent
                      ? 'bg-[#FF7A03]/15 border-[#FF7A03] text-[#FF7A03]'
                      : isNext
                      ? 'bg-[#15171A] border-[#FF7A03]/30 text-[#8A929C] border-dashed'
                      : 'bg-[#15171A] border-[#2E3238] opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    {isPassed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isCurrent ? (
                      <Flame className="w-3.5 h-3.5 text-[#FF7A03] animate-pulse" />
                    ) : isNext ? (
                      <ChevronRight className="w-3.5 h-3.5 text-[#FF7A03]" />
                    ) : (
                      <Lock className="w-3 h-3 text-[#8A929C]" />
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold truncate max-w-full text-[#EEF1F4]">
                    Stage {st.stageNumber}
                  </span>
                  <span
                    className={`text-[9px] font-semibold tracking-tight ${
                      isPassed
                        ? 'text-emerald-400'
                        : isCurrent
                        ? 'text-[#FF7A03]'
                        : isNext
                        ? 'text-[#8A929C]'
                        : 'text-[#5C636B]'
                    }`}
                  >
                    {isPassed
                      ? 'Lulus'
                      : isCurrent
                      ? 'Aktif'
                      : isNext
                      ? 'Berikutnya'
                      : 'Terkunci'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Stage Detail Card */}
        <div className="card-surface p-3 sm:p-6 border-[#2E3238] mb-4 sm:mb-8 space-y-3 sm:space-y-5">
          {/* Status Jalur Progres Stage yang Dipilih */}
          {selectedStageTab === currentStageNum && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-[#FF7A03]/15 border border-[#FF7A03]/30 flex items-center gap-2 text-xs text-[#FF7A03] font-semibold">
              <Flame className="w-4 h-4 flex-shrink-0 animate-pulse" />
              <span>Stage Latihanmu Saat Ini: Capai syarat lulus untuk membuka Stage {currentStageNum + 1}!</span>
            </div>
          )}
          {selectedStageTab === currentStageNum + 1 && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-[#23272D] border border-[#FF7A03]/30 flex items-center gap-2 text-xs text-[#EEF1F4]">
              <ChevronRight className="w-4 h-4 text-[#FF7A03] flex-shrink-0" />
              <span>Target Berikutnya: Stage ini akan aktif setelah kamu lulus dari Stage {currentStageNum}.</span>
            </div>
          )}
          {selectedStageTab > currentStageNum + 1 && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-[#15171A] border border-[#2E3238] flex items-center gap-2 text-xs text-[#8A929C]">
              <Lock className="w-4 h-4 text-[#8A929C] flex-shrink-0" />
              <span>Stage Terkunci: Selesaikan Stage {selectedStageTab - 1} terlebih dahulu untuk membuka panduan ini.</span>
            </div>
          )}
          {selectedStageTab < currentStageNum && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Stage Lulus: Kamu telah menguasai stage ini. Bisa tetap dilatih untuk pemanasan atau mengasah form!</span>
            </div>
          )}

          {/* Top row on Laptop: 2 columns (Illustration on Left, Key Info on Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 items-start">
            <div className="lg:col-span-5">
              <StageImage
                src={selectedStageData.imageUrl}
                stageName={selectedStageData.nama}
                skillName={skill.nama}
                stageNumber={selectedStageData.stageNumber}
                alt={`Ilustrasi form ${selectedStageData.nama} untuk skill ${skill.nama}, stage ${selectedStageData.stageNumber}`}
                aspectRatioClass="aspect-video max-h-[220px] sm:max-h-[300px]"
                className="w-full h-full object-contain p-2 sm:p-4 drop-shadow-md"
              />
            </div>

            <div className="lg:col-span-7 space-y-3">
              {/* Stage Title & Target Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 sm:pb-3.5 border-b border-[#2E3238]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#FF7A03] uppercase tracking-wider">
                      Stage {selectedStageData.stageNumber} dari 5
                    </span>
                    {currentStageNum === selectedStageData.stageNumber && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF7A03] text-[#15171A]">
                        Stage Aktifmu
                      </span>
                    )}
                    {currentStageNum > selectedStageData.stageNumber && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                        Lulus ✓
                      </span>
                    )}
                    {selectedStageData.stageNumber === currentStageNum + 1 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#23272D] text-[#FF7A03] border border-[#FF7A03]/30">
                        Berikutnya
                      </span>
                    )}
                    {selectedStageData.stageNumber > currentStageNum + 1 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#15171A] text-[#8A929C] border border-[#2E3238]">
                        Terkunci 🔒
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-2xl font-extrabold text-[#EEF1F4]">
                    {selectedStageData.nama}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8A929C] mt-0.5">
                    {selectedStageData.deskripsi}
                  </p>
                </div>

                <div className="p-2 sm:p-3 rounded-xl bg-[#15171A] border border-[#2E3238] flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#FF7A03]/20 text-[#FF7A03] flex items-center justify-center font-bold text-sm">
                    ⏱️
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8A929C] block">Target Latihan</span>
                    <span className="font-extrabold text-xs sm:text-sm text-[#EEF1F4]">
                      {selectedStageData.targetHoldSec} Detik × {selectedStageData.targetSets} Set
                    </span>
                  </div>
                </div>
              </div>

              {/* Syarat Lulus Box */}
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-[#FF7A03]/10 border border-[#FF7A03]/30 flex items-start gap-2 sm:gap-2.5">
                <Sparkles className="w-4 h-4 text-[#FF7A03] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-[#FF7A03] block">Kriteria Naik Tahap (Syarat Lulus):</span>
                  <p className="text-xs text-[#EEF1F4] mt-0.5 font-medium leading-relaxed">{selectedStageData.syaratLulus}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Poin Teknik Utama */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A929C] mb-2">
              Langkah Teknik Utama:
            </h4>
            <div className="space-y-1.5 sm:space-y-2">
              {selectedStageData.langkah.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#EEF1F4] leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-[#23272D] border border-[#2E3238] text-[10px] font-bold text-[#FF7A03] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Peringatan Keselamatan & Kesalahan Umum */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div className="p-2.5 sm:p-3.5 rounded-xl bg-[#FF7A03]/10 border border-[#FF7A03]/30 text-xs">
              <div className="flex items-center gap-1.5 text-[#FF7A03] font-bold mb-1 sm:mb-1.5">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Kesalahan Umum yang Dihindari:</span>
              </div>
              <ul className="space-y-1 text-[#EEF1F4]/90 pl-5 list-disc">
                {selectedStageData.kesalahanUmum.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 sm:p-3.5 rounded-xl bg-[#23272D] border border-[#2E3238] text-xs">
              <div className="flex items-center gap-1.5 text-[#FF7A03] font-bold mb-1 sm:mb-1.5">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>Tips Aman Siswa:</span>
              </div>
              <p className="text-[#8A929C] leading-relaxed">{selectedStageData.tipsAman}</p>
            </div>
          </div>

          {/* Opsi Regresi & Progresi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 pt-1">
            <div className="p-2.5 sm:p-3 rounded-xl bg-[#15171A] border border-[#2E3238] text-xs">
              <span className="text-[10px] text-[#8A929C] block font-semibold mb-0.5">Opsi Lebih Mudah (Regresi):</span>
              <p className="font-semibold text-[#EEF1F4]">{selectedStageData.lebihMudah}</p>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-[#15171A] border border-[#2E3238] text-xs">
              <span className="text-[10px] text-[#8A929C] block font-semibold mb-0.5">Opsi Lebih Sulit (Progresi):</span>
              <p className="font-semibold text-[#EEF1F4]">{selectedStageData.lebihSulit}</p>
            </div>
          </div>

          {/* Bottom Actions - Area sentuh min 48px */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-3 sm:pt-3.5 border-t border-[#2E3238]">
            <Link
              href={`/latihan/s_${skill.id.replace('-', '')}_${selectedStageData.stageNumber}`}
              className="w-full sm:flex-1 btn-brand min-h-[48px] py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#FF7A03]/20 active:scale-98 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Mulai Latihan Stage {selectedStageData.stageNumber} Sekarang</span>
            </Link>

            {currentStageNum === selectedStageData.stageNumber && selectedStageData.stageNumber < skill.stages.length && (
              <button
                type="button"
                onClick={() => handleAdvanceStage(selectedStageData.stageNumber + 1)}
                className="w-full sm:w-auto btn-outline min-h-[48px] px-5 py-3 text-xs font-bold flex items-center justify-center gap-1.5 text-[#FF7A03] border-[#FF7A03]/40 hover:bg-[#FF7A03]/10 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Naik ke Stage {selectedStageData.stageNumber + 1}</span>
              </button>
            )}

            {/* Jika stage ini adalah stage yang sudah lewat, perbolehkan kembali menjadikannya stage aktif */}
            {selectedStageData.stageNumber < currentStageNum && (
              <button
                type="button"
                onClick={() => handleAdvanceStage(selectedStageData.stageNumber)}
                className="w-full sm:w-auto btn-outline min-h-[48px] px-5 py-3 text-xs font-bold text-[#8A929C] hover:text-[#EEF1F4] active:scale-95 transition-all"
              >
                Ulangi / Jadikan Stage Aktif
              </button>
            )}

            {/* Jika stage ini terkunci (belum tercapai), tampilkan status terkunci dan larang aktivasi loncat */}
            {selectedStageData.stageNumber > currentStageNum && (
              <button
                type="button"
                disabled
                className="w-full sm:w-auto min-h-[48px] px-5 py-3 text-xs font-semibold text-[#8A929C]/60 bg-[#1B1E22] border border-[#2E3238] rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed opacity-75"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Selesaikan Stage {selectedStageData.stageNumber - 1} Dulu</span>
              </button>
            )}
          </div>
        </div>
      </MobileContainer>
    </div>
  );
}
