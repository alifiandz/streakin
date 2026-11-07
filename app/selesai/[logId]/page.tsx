'use client';
import React,{useState} from 'react';
import {useParams} from 'next/navigation';
import Link from 'next/link';
import {CheckCircle2,Clock,Layers,Flame,Trophy,ArrowRight} from 'lucide-react';
import {useAuth} from '@/context/AuthContext';
import {useWorkout} from '@/context/WorkoutContext';
import {shortDuration} from '@/v3/training-meta';
export default function WorkoutDonePage(){
 const {logId}=useParams();const {currentUser}=useAuth();const {logs,streak,reminder}=useWorkout();const log=logs.find(l=>l.id===logId);const [celebration,setCelebration]=useState(0);const [dismissReminder,setDismissReminder]=useState(false);
 if(!log)return <main className="v3-page"><h1>Data sesi belum ditemukan.</h1><Link href="/riwayat" className="v3-button mt-5">Buka riwayat</Link></main>;
 const reps=log.setsCompleted.filter(s=>!s.isIsometric).reduce((n,s)=>n+s.nilai,0);const bestHold=Math.max(0,...log.setsCompleted.filter(s=>s.isIsometric).map(s=>s.nilai));
 const previous=logs.filter(l=>l.id!==log.id);const improvements=log.setsCompleted.filter(s=>previous.some(l=>l.setsCompleted.some(old=>old.exerciseId===s.exerciseId))&&s.nilai>Math.max(0,...previous.flatMap(l=>l.setsCompleted.filter(old=>old.exerciseId===s.exerciseId).map(old=>old.nilai))));const newRecords=new Set(improvements.map(s=>s.exerciseId)).size;
 return <main className="completion-page"><header className="completion-hero"><div key={celebration} className="completion-confetti" aria-hidden="true">{Array.from({length:16},(_,i)=><i key={i} style={{left:`${i*6+2}%`,animationDelay:`${i%5*.12}s`,background:i%3?'#ff7a03':'#748db8'}}/>)}</div><div className="completion-seal"><img src="/images/mascot/ppt-celebrate.png" alt="Orange Dude merayakan hasil latihanmu"/><span><CheckCircle2/></span></div><p className="v3-eyebrow">Usaha hari ini, tersimpan.</p><h1>Latihan Selesai!</h1><p>Kamu datang. Kamu bergerak.<br/><strong>{currentUser?.nama||'Kawan'}, bangga sama langkahmu hari ini.</strong></p><span className="completion-badge"><Trophy/>{logs.length===1?'Sesi pertama tercatat':newRecords?`${newRecords} rekor gerakan baru`:`${log.setsCompleted.length} set kamu tuntaskan`}</span></header>
 <section className="completion-summary"><h2>{log.sessionNama}</h2><div className="completion-facts">{[[Clock,shortDuration(log.durasiDetik),'Waktu aktual'],[Layers,log.setsCompleted.length,'Set selesai'],[Flame,streak,'Hari streak']].map(([Icon,value,label]:any)=><div key={label}><Icon/><strong>{value}</strong><span>{label}</span></div>)}</div><div className="completion-results">{reps>0&&<p><strong>{reps}</strong> repetisi tercatat</p>}{bestHold>0&&<p><strong>{bestHold} dtk</strong> tahanan terbaik sesi ini</p>}</div><p className="completion-save-status"><CheckCircle2/>Hasil tersimpan di riwayat dan progres.</p></section>
 <section className="completion-pride"><h2>Satu langkah yang layak dirayakan.</h2><p>Tak perlu membandingkan. Hari ini kamu kembali memilih bergerak.</p><button className="v3-button secondary" onClick={()=>setCelebration(n=>n+1)}>Rayakan sesiku ✦</button>{celebration>0&&<p role="status">Kerja bagus! Beri tubuhmu waktu untuk pulih.</p>}</section>
 <div className="completion-actions"><Link href={log.skillFocus?`/skills/${log.skillFocus}`:'/progress'} className="v3-button">Tinjau progres & langkah berikutnya <ArrowRight/></Link><Link href="/riwayat" className="v3-button secondary">Lihat Riwayat Latihan</Link><Link href="/home" className="v3-text-link">Kembali ke Beranda →</Link></div>
 {!reminder.aktif&&!dismissReminder&&<aside className="completion-reminder"><h3>Siapkan waktu untuk kembali.</h3><Link href="/notifikasi" className="v3-text-link">Atur pengingat →</Link><button className="v3-text-link" onClick={()=>setDismissReminder(true)}>Nanti saja</button></aside>}
 </main>;
}
