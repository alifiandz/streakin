'use client';
import React from 'react';
import Link from 'next/link';
import {ArrowRight,Play,RotateCcw,Bell,Flame} from 'lucide-react';
import {useAuth} from '@/context/AuthContext';
import {useWorkout} from '@/context/WorkoutContext';
import {SEED_SKILLS,SEED_EXERCISES} from '@/lib/seedData';
import {MobileContainer} from '@/components/layout/MobileContainer';
import {ActivityChart,DemoNotice,TrainingStats} from '@/prototype/components/TrainingInsights';
import {SkillLibrary} from '@/prototype/components/SkillLibrary';

export default function HomePage(){
 const {currentUser}=useAuth();
 const {library,activeWorkout,todaySession,streak,logs,reminder,getSessionById,getSkillProgress}=useWorkout();
 const hasLibrary=!!library?.sessionIds.length;
 const activeSession=activeWorkout?getSessionById(activeWorkout.sessionId):null;
 const recent=[...logs].sort((a,b)=>b.tanggal.localeCompare(a.tanggal)).slice(0,3);
 const session=activeSession||todaySession;
 return <div className="min-h-[100dvh] bg-[#15171A] text-[#EEF1F4] overflow-x-hidden"><MobileContainer maxWidth="6xl">
  <div className="flex items-center justify-between gap-3 mb-4"><div><p className="text-[11px] font-bold text-[#FF7A03] uppercase tracking-wider mb-1">Ruang latihanmu</p><h1 className="text-2xl sm:text-3xl font-extrabold">Halo, {currentUser?.nama||'Kawan'}.</h1><p className="text-xs sm:text-sm text-[#8A929C] mt-1">Satu sesi yang terarah. Satu langkah lebih dekat.</p></div><Link href="/notifikasi" className="btn-outline w-11 h-11 flex items-center justify-center" aria-label="Atur pengingat latihan"><Bell className="w-4 h-4 text-[#FF7A03]"/></Link></div>
  <DemoNotice/>
  <section className="training-hero" aria-labelledby="next-session-title">
   <div><p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#FF7A03] mb-2">{activeSession?'Latihanmu belum selesai':hasLibrary?'Langkah berikutnya':'Mulai perjalananmu'}</p><h2 id="next-session-title" className="text-xl sm:text-3xl font-extrabold mb-2">{activeSession?'Lanjutkan yang sudah dimulai.':hasLibrary?'Siap untuk satu sesi lagi?':'Pilih skill pertamamu.'}</h2><p className="text-xs sm:text-sm text-[#8A929C] leading-relaxed mb-5 max-w-lg">{hasLibrary||activeSession?`${session.nama} · ${session.durasiMenit} menit · ${session.exercises.length} gerakan. Ikuti target sesuai kemampuanmu.`:'L-Sit, Handstand, atau Elbow Lever. Temukan tahapan dan tekniknya di Library.'}</p><Link href={hasLibrary||activeSession?`/latihan/${session.id}`:'/library'} className="btn-brand min-h-[48px] px-5 inline-flex items-center gap-2 text-xs sm:text-sm font-bold">{activeSession?<RotateCcw className="w-4 h-4"/>:<Play className="w-4 h-4"/>}{activeSession?'Lanjutkan Latihan':hasLibrary?'Mulai Sesi Hari Ini':'Buka Library Skill'}<ArrowRight className="w-4 h-4"/></Link></div>
   <img src="/images/mascot/ppt-welcome.png" alt="Orange Guy menyemangati latihanmu"/>
  </section>
  <TrainingStats logs={logs} streak={streak}/>
  <div className="training-columns">
   <div className="space-y-4">
    <section className="card-surface p-4 sm:p-5 border-[#2E3238]"><ActivityChart logs={logs}/></section>
    <section><div className="training-section-heading !mt-2"><h2>Perjalanan skillmu</h2><Link href="/skills" className="training-link">Semua skill <ArrowRight className="w-3.5 h-3.5"/></Link></div><div className="space-y-2">{SEED_SKILLS.map(skill=>{const p=getSkillProgress(skill.id);const stage=skill.stages[p.currentStage-1];return <Link key={skill.id} href={`/skills/${skill.id}`} className="card-surface p-3 sm:p-4 border-[#2E3238] flex gap-3 items-center hover:border-[#FF7A03]/40 transition-colors"><img src={stage.imageUrl||'/images/mascot/ppt-explain.png'} alt={stage.imageUrl?stage.nama:'Orange Guy mengenalkan panduan skill'} className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl bg-[#15171A]" loading="lazy"/><div className="flex-1 min-w-0"><div className="flex justify-between gap-2 items-center mb-1"><h3 className="font-bold text-sm">{skill.nama}</h3><span className="text-[10px] font-bold text-[#FF7A03]">Tahap {p.currentStage}/5</span></div><p className="text-[11px] text-[#8A929C] truncate mb-2">{stage.nama}</p><div className="flex gap-1" aria-label={`${p.currentStage-1} tahap sebelumnya sudah dilewati`}>{skill.stages.map(s=><span key={s.stageNumber} className={`h-1.5 flex-1 rounded-full ${s.stageNumber<p.currentStage?'bg-[#FF7A03]':s.stageNumber===p.currentStage?'bg-[#FF7A03]/35':'bg-[#2E3238]'}`}/>)}</div></div><ArrowRight className="w-4 h-4 text-[#8A929C]"/></Link>;})}</div></section>
   </div>
   <aside className="space-y-4">
    <section className="card-surface p-4 sm:p-5 border-[#2E3238]"><div className="flex justify-between items-center mb-3"><h2 className="font-bold text-sm">Catatan terakhir</h2><Link href="/riwayat" className="training-link">Lihat semua →</Link></div>{recent.length?recent.map(log=><Link key={log.id} href="/riwayat" className="block py-3 border-t border-[#2E3238]"><span className="text-[10px] text-[#8A929C]">{log.tanggal}</span><h3 className="font-bold text-xs mt-1">{log.sessionNama}</h3><p className="text-[11px] text-[#8A929C] mt-1">{Math.round(log.durasiDetik/60)} menit · {log.setsCompleted.length} set selesai</p></Link>):<p className="text-xs text-[#8A929C] leading-relaxed">Sesi pertamamu akan tampil di sini setelah selesai.</p>}</section>
    <Link href="/notifikasi" className="card-surface p-4 sm:p-5 border-[#2E3238] block"><Bell className="w-5 h-5 text-[#FF7A03] mb-3"/><h2 className="font-bold text-sm mb-1">Waktu untuk dirimu</h2><p className="text-xs text-[#8A929C] leading-relaxed">{reminder.aktif?`Pengingat aktif pukul ${reminder.jam} saat aplikasi terbuka.`:'Tentukan waktu latihan supaya lebih mudah jadi kebiasaan.'}</p><span className="training-link mt-2">Atur pengingat →</span></Link>
    <section className="card-surface p-4 border-[#2E3238]"><div className="flex gap-3 items-center"><img src="/images/mascot/ppt-celebrate.png" alt="Orange Guy merayakan kemajuan" className="w-16 h-20 object-contain" loading="lazy"/><div><h2 className="text-xs font-bold text-[#FF7A03] flex gap-1 items-center"><Flame className="w-3.5 h-3.5"/>Jaga ritmemu</h2><p className="text-[11px] text-[#8A929C] leading-relaxed mt-1">Teknik terkontrol dan waktu pulih sama pentingnya dengan menyelesaikan sesi.</p></div></div></section>
   </aside>
  </div>
  <div className="training-section-heading"><h2>{hasLibrary?'Dari Library kamu':'Jelajahi skill'}</h2><Link href="/library" className="training-link">Buka Library →</Link></div>
  {hasLibrary?<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">{library!.sessionIds.map(id=>getSessionById(id)).filter(Boolean).slice(0,6).map(s=>{const first=SEED_EXERCISES.find(e=>e.id===s!.exercises[0].exerciseId);return <article key={s!.id} className="card-surface p-4 border-[#2E3238]"><div className="flex items-center gap-3 mb-3"><img src={first?.imageUrl||'/images/mascot/ppt-explain.png'} alt={first?.imageUrl?first.nama:'Orange Guy mengenalkan sesi latihan'} className="w-16 h-16 object-contain rounded-xl bg-[#15171A]" loading="lazy"/><div><p className="text-[10px] text-[#FF7A03] font-bold">{s!.durasiMenit} menit · {s!.fokus}</p><h3 className="text-xs font-bold mt-1">{s!.nama}</h3></div></div><Link href={`/latihan/${s!.id}`} className="btn-outline min-h-[44px] flex items-center justify-center text-xs font-bold">Mulai Sesi <ArrowRight className="w-3.5 h-3.5 ml-2"/></Link></article>;})}</div>:<SkillLibrary/>}
 </MobileContainer></div>;
}
