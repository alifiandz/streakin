'use client';
import React,{useState} from 'react';
import Link from 'next/link';
import {ArrowRight,ChevronDown,Clock,Layers} from 'lucide-react';
import {useWorkout} from '@/context/WorkoutContext';
import {SEED_EXERCISES,SEED_SESSIONS} from '@/lib/seedData';
import {MobileContainer} from '@/components/layout/MobileContainer';
import {ActivityCalendar,ActivityChart,DemoNotice,TrainingStats} from '@/prototype/components/TrainingInsights';
import {getLocalDateString} from '@/src/utils/storage';
import type {WorkoutLog} from '@/src/types';

function LogDetails({log}:{log:WorkoutLog}){
 const grouped=new Map<string,typeof log.setsCompleted>();
 for(const set of log.setsCompleted)grouped.set(set.exerciseId,[...(grouped.get(set.exerciseId)||[]),set]);
 return <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">{[...grouped].map(([id,sets])=>{
  const exercise=SEED_EXERCISES.find(e=>e.id===id);
  const timed=sets[0].isIsometric||exercise?.isTimeBased;
  return <div key={id} className="p-3 rounded-xl bg-[#15171A] border border-[#2E3238] flex items-center gap-3">{exercise?.imageUrl&&<img src={exercise.imageUrl} alt={exercise.nama} className="w-12 h-12 object-contain" loading="lazy"/>}<div className="min-w-0"><h4 className="font-bold text-xs">{sets[0].exerciseName||exercise?.nama||id}</h4><p className="text-[10px] text-[#8A929C] mt-1">{timed?'Tahanan statis':'Repetisi'} · {sets.length} set</p><p className="text-xs font-bold text-[#FF7A03] mt-1">{[...sets].sort((a,b)=>a.noSet-b.noSet).map(set=>`${set.nilai} ${timed?'dtk':'reps'}`).join(' · ')}</p></div></div>;
 })}</div>;
}

export default function HistoryPage(){
 const {logs,streak,getSessionById}=useWorkout();
 const [range,setRange]=useState('all');
 const [query,setQuery]=useState('');
 const cutoff=new Date();cutoff.setDate(cutoff.getDate()-(range==='7'?6:27));
 const ranged=logs.filter(l=>range==='all'||l.tanggal>=getLocalDateString(cutoff));
 const filtered=[...ranged].filter(l=>`${l.sessionNama} ${l.skillFocus||''}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>b.tanggal.localeCompare(a.tanggal));
 const focus=ranged.reduce<Record<string,number>>((counts,log)=>{const label=SEED_SESSIONS.find(s=>s.id===log.sessionId)?.fokus||'Lainnya';counts[label]=(counts[label]||0)+1;return counts;},{});
 const topFocus=Object.entries(focus).sort((a,b)=>b[1]-a[1]);
 return <div className="min-h-[100dvh] bg-[#15171A] text-[#EEF1F4] overflow-x-hidden"><MobileContainer maxWidth="6xl">
  <div className="flex justify-between gap-3 items-center mb-4"><div><p className="text-[11px] font-bold text-[#FF7A03] uppercase tracking-wider mb-1">Setiap sesi punya cerita</p><h1 className="text-2xl sm:text-3xl font-extrabold">Riwayat & Log Latihan</h1><p className="text-xs sm:text-sm text-[#8A929C] mt-1">Lihat ritmemu, kenali fokusmu, dan buka kembali hasil setiap set.</p></div><img src="/images/mascot/ppt-celebrate.png" alt="Orange Guy merayakan catatan latihan" className="w-16 h-20 sm:w-24 sm:h-24 object-contain"/></div>
  <DemoNotice/>
  <TrainingStats logs={ranged} streak={streak}/>
  <p className="text-[10px] text-[#8A929C] -mt-2 mb-4">Total mengikuti periode pilihan. Streak menunjukkan kondisi saat ini.</p>
  <div className="training-columns">
   <section className="card-surface p-4 sm:p-5 border-[#2E3238]"><ActivityChart logs={logs}/></section>
   <section className="card-surface p-4 sm:p-5 border-[#2E3238]"><ActivityCalendar logs={logs}/></section>
  </div>
  <div className="training-columns mt-5">
   <section aria-labelledby="log-list-title">
    <div className="training-section-heading !mt-0"><h2 id="log-list-title">Jejak latihanmu</h2><span className="text-xs text-[#8A929C]" role="status">{filtered.length} sesi</span></div>
    <div className="history-controls"><label className="sr-only" htmlFor="log-search">Cari riwayat latihan</label><input id="log-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari sesi atau skill…"/><label className="sr-only" htmlFor="log-range">Periode riwayat</label><select id="log-range" value={range} onChange={e=>setRange(e.target.value)}><option value="all">Semua waktu</option><option value="7">7 hari terakhir</option><option value="28">28 hari terakhir</option></select></div>
    {filtered.map((log,index)=>{
     const session=getSessionById(log.sessionId);
     const first=SEED_EXERCISES.find(e=>e.id===log.setsCompleted[0]?.exerciseId);
     const previous=filtered[index-1];
     return <React.Fragment key={log.id}>
      {previous?.tanggal!==log.tanggal&&<h3 className="text-xs text-[#8A929C] font-bold my-3">{new Date(log.tanggal+'T12:00:00').toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</h3>}
      <details className="training-log">
       <summary><div className="flex items-center gap-3 min-w-0"><img src={first?.imageUrl||'/images/mascot/ppt-explain.png'} alt={first?.imageUrl?first.nama:'Orange Guy mengenalkan catatan latihan'} className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-xl bg-[#15171A]" loading="lazy"/><div className="min-w-0"><p className="text-[10px] text-[#FF7A03] font-bold mb-1">SESI SELESAI</p><h4 className="text-xs sm:text-sm font-bold">{log.sessionNama}</h4><div className="flex gap-3 text-[10px] text-[#8A929C] mt-2"><span className="flex gap-1 items-center"><Clock className="w-3 h-3"/>{Math.max(1,Math.round(log.durasiDetik/60))} menit</span><span className="flex gap-1 items-center"><Layers className="w-3 h-3"/>{log.setsCompleted.length} set</span></div></div></div><ChevronDown className="log-chevron w-4 h-4 flex-shrink-0 text-[#FF7A03]"/></summary>
       <LogDetails log={log}/>
       {session&&<div className="px-4 pb-3"><Link href={`/latihan/${session.id}`} className="training-link">Latih sesi ini lagi <ArrowRight className="w-3.5 h-3.5"/></Link></div>}
      </details>
     </React.Fragment>;
    })}
    {!filtered.length&&<div className="card-surface p-6 text-center border-[#2E3238]"><img src="/images/mascot/ppt-explain.png" alt="Orange Guy siap menemani latihan" className="w-28 h-28 object-contain mx-auto mb-3"/><h3 className="font-bold text-base mb-2">{logs.length?'Tidak ada sesi yang cocok':'Cerita pertamamu dimulai di sini.'}</h3><p className="text-xs text-[#8A929C] leading-relaxed mb-4">{logs.length?'Coba kata pencarian lain atau perluas periode.':'Selesaikan sesi latihan untuk melihat hasil setiap set, aktivitas mingguan, dan progresmu.'}</p>{logs.length?<button onClick={()=>{setQuery('');setRange('all');}} className="btn-outline min-h-[44px] px-5 text-xs font-bold">Reset Filter</button>:<Link href="/library" className="btn-brand min-h-[44px] px-5 inline-flex items-center text-xs font-bold">Pilih Sesi Pertamamu →</Link>}</div>}
   </section>
   <aside className="space-y-4">
    <section className="card-surface p-4 sm:p-5 border-[#2E3238]"><h2 className="font-bold text-sm mb-1">Fokus latihan</h2><p className="text-[11px] text-[#8A929C] mb-4">Distribusi sesi pada periode pilihan</p>{topFocus.length?topFocus.map(([name,count])=><div key={name} className="mb-4"><div className="flex justify-between text-xs mb-2"><span>{name}</span><span className="text-[#FF7A03] font-bold">{count} sesi</span></div><div className="h-2 bg-[#15171A] rounded-full overflow-hidden"><div className="h-full bg-[#FF7A03] rounded-full" style={{width:`${count/ranged.length*100}%`}}/></div></div>):<p className="text-xs text-[#8A929C]">Distribusi akan muncul setelah latihan pertamamu.</p>}</section>
    <section className="card-surface p-4 border-[#2E3238]"><h2 className="font-bold text-sm mb-2">Catatanmu, bukan perlombaan.</h2><p className="text-xs text-[#8A929C] leading-relaxed">Bandingkan hasil pada gerakan yang sama. Detik tahanan dan jumlah repetisi mengukur hal berbeda. Hari istirahat juga bagian dari latihan.</p></section>
    <Link href="/home" className="btn-outline min-h-[44px] flex items-center justify-center text-xs font-bold">Kembali ke Beranda →</Link>
   </aside>
  </div>
 </MobileContainer></div>;
}
