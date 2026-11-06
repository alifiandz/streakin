'use client';

import React from 'react';
import Link from 'next/link';
import {
  Award,
  ArrowRight,
  Flame,
  Clock,
  Sparkles,
  ShieldCheck,
  Play,
} from 'lucide-react';
import { useWorkout } from '@/context/WorkoutContext';
import { SEED_SKILLS } from '@/lib/seedData';
import { MobileContainer } from '@/components/layout/MobileContainer';

export default function SkillsCatalogPage() {
  const { getSkillProgress } = useWorkout();

  return (
    <div className="min-h-[100dvh] bg-[#15171A] text-[#EEF1F4] overflow-x-hidden">
      <MobileContainer maxWidth="6xl">
        {/* Header Hero */}
        <div className="mb-3 sm:mb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#FF7A03]/15 border border-[#FF7A03]/30 text-xs font-bold text-[#FF7A03] mb-1.5 sm:mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Peta Jalan Skill 5 Stage</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-[#EEF1F4] tracking-tight">
            Katalog Skill Kalistenik
          </h1>
          <p className="text-xs sm:text-sm text-[#8A929C] mt-1 max-w-xl">
            Kuasai 3 gerakan ikonik kalistenik melalui 5 tahapan progresi sistematis. Dirancang fleksibel agar pas di sela jadwal belajar & tugas sekolah.
          </p>
        </div>

        {/* 3 Skill Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-4 mb-4 sm:mb-8">
          {SEED_SKILLS.map((skill) => {
            const userProg = getSkillProgress(skill.id);
            const currentStageNum = userProg.currentStage || 1;
            const currentStageData = skill.stages.find((s) => s.stageNumber === currentStageNum) || skill.stages[0];
            const progressPercent = Math.round((currentStageNum / skill.stages.length) * 100);

            return (
              <div
                key={skill.id}
                className="card-surface p-3 sm:p-5 border-[#2E3238] flex flex-col justify-between hover:border-[#8A929C] transition-all relative overflow-hidden group"
              >
                {/* Background Accent Glow */}
                <div
                  className="absolute -top-10 -right-10 w-24 h-24 sm:w-32 sm:h-32 rounded-full blur-3xl pointer-events-none opacity-20"
                  style={{ backgroundColor: skill.badgeColor }}
                />

                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full border"
                      style={{
                        backgroundColor: `${skill.badgeColor}15`,
                        color: skill.badgeColor,
                        borderColor: `${skill.badgeColor}40`,
                      }}
                    >
                      Level: {skill.level}
                    </span>
                    <span className="text-[11px] text-[#8A929C] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {skill.durasiMingguEstimasi}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <h2 className="text-base sm:text-xl font-extrabold text-[#EEF1F4] mb-0.5 group-hover:text-[#FF7A03] transition-colors">
                    {skill.nama}
                  </h2>
                  <p className="text-[11px] font-semibold text-[#8A929C] mb-2 sm:mb-2.5">
                    Fokus: {skill.kategori}
                  </p>

                  <p className="text-xs text-[#8A929C] leading-relaxed mb-2.5 sm:mb-3.5 line-clamp-2">
                    {skill.deskripsi}
                  </p>

                  {/* Current Stage Indicator Box */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-[#15171A] border border-[#2E3238] mb-2.5 sm:mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#8A929C] font-medium">Stage Aktif:</span>
                      <span className="font-extrabold text-[#FF7A03]">
                        Stage {currentStageNum} dari {skill.stages.length}
                      </span>
                    </div>

                    <div className="font-bold text-xs sm:text-sm text-[#EEF1F4] mb-1.5 sm:mb-2 truncate">
                      {currentStageData.nama}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-[#23272D] rounded-full overflow-hidden mb-1.5 sm:mb-2">
                      <div
                        className="h-full bg-[#FF7A03] transition-all duration-500 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#8A929C]">
                      <span>Target: {currentStageData.targetHoldSec} dtk</span>
                      <span className="flex items-center gap-1 text-[#FF7A03] font-bold">
                        <Flame className="w-3 h-3 fill-[#FF7A03]" />
                        PB: {userProg.bestHoldSec || 0} dtk
                      </span>
                    </div>
                  </div>

                  {/* Student Relevance Note */}
                  <div className="p-2 sm:p-2.5 rounded-xl bg-[#23272D]/60 border border-[#2E3238] text-[11px] text-[#8A929C] mb-3 sm:mb-4 flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#FF7A03] flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{skill.manfaatSiswa}</span>
                  </div>
                </div>

                {/* Card Action Buttons - area sentuh min 44px */}
                <div className="space-y-2 pt-2 border-t border-[#2E3238]">
                  <Link
                    href={`/skills/${skill.id}`}
                    className="w-full btn-brand min-h-[44px] py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
                  >
                    <span>Buka Roadmap 5 Stage</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </Link>

                  <Link
                    href={`/latihan/s_${skill.id.replace('-', '')}_${currentStageNum}`}
                    className="w-full btn-outline min-h-[44px] py-2 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-98 transition-all"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Latihan Stage {currentStageNum}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Philosophy Note Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#23272D] border border-[#2E3238] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF7A03]/15 text-[#FF7A03] flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#EEF1F4]">
                Prinsip Skill Evolution: Kualitas &gt; Kuantitas
              </h3>
              <p className="text-xs text-[#8A929C]">
                Jangan buru-buru naik stage sebelum menuntaskan syarat lulus dengan postur tubuh yang kokoh dan tanpa rasa nyeri sendi.
              </p>
            </div>
          </div>
          <Link
            href="/home"
            className="btn-outline min-h-[44px] px-4 py-2 text-xs font-bold whitespace-nowrap flex items-center justify-center"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </MobileContainer>
    </div>
  );
}
