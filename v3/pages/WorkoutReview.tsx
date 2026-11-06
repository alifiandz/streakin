import React,{useState} from 'react';
import Link from 'next/link';
import {useParams,useRouter} from 'next/navigation';
import {ArrowRight,Play} from 'lucide-react';
import {useWorkout} from '@/context/WorkoutContext';
import {useProduct} from '../ProductContext';
import {canTrain} from '../model';
import {SEED_EXERCISES,requirements} from '../catalog';
import {Page,Message,ProPrompt} from '../components/UI';
export default function WorkoutReview(){
 const {sessionId}=useParams();const {getSessionById,activeWorkout}=useWorkout();const {state,request}=useProduct();const router=useRouter();const [busy,setBusy]=useState(false);const [error,setError]=useState('');const session=getSessionById(sessionId||'');
 if(!session)return <Page title="Sesi belum tersedia" description="Periksa tahap aktifmu atau pilih sesi lain."><Link href="/skills" className="v3-text-link">Buka roadmap →</Link><Link href="/workouts" className="v3-text-link ml-5">Semua latihan →</Link></Page>;
 const resumable=activeWorkout?.sessionId===session.id;const allowed=resumable||canTrain(session,state.testTier);
 return <Page title={session.nama} eyebrow={`${session.fokus} · sekitar ${session.durasiMenit} menit`} description="Kenali susunannya sebelum mulai. Target bisa disesuaikan dengan kemampuan saat mencatat hasil set." action={<Link href="/workouts" className="v3-text-link">Semua latihan</Link>}>
  {!allowed&&<ProPrompt title="Sesi spesialis Pro" description="Lihat Free & Pro untuk mengakses sesi ini. Semua timer, sesi fondasi dan pencatatan dasar tetap gratis."/>}
  <div className="v3-split"><section>{session.exercises.map((se,index)=>{const ex=SEED_EXERCISES.find(e=>e.id===se.exerciseId)!;return <article key={se.exerciseId} className="v3-row !items-start"><div className="flex gap-4">{ex?.imageUrl?<img src={ex.imageUrl} alt={ex.nama} className="w-20 h-20 object-contain bg-[#1b1e22] rounded-xl"/>:<span className="v3-pill h-fit">{index+1}</span>}<div><h2 className="font-bold text-sm">{ex?.nama||se.exerciseName}</h2><p className="text-xs text-[#8A929C] mt-2">{se.sets} set × {se.target} {se.unit} · jeda {se.istirahatDetik} dtk</p>{allowed&&<details><summary className="v3-text-link cursor-pointer">Teknik gerakan</summary><ol className="text-xs text-[#8A929C] list-decimal pl-4 space-y-2">{ex.langkah.map((step,i)=><li key={i}>{step}</li>)}</ol></details>}</div></div></article>;})}</section><aside className="v3-panel"><h2 className="font-bold text-base mb-3">Siapkan sesi</h2><p className="text-xs text-[#8A929C] mb-4">{session.skillId?requirements[session.skillId]?.prerequisite:'Lakukan pemanasan ringan, siapkan area yang nyaman, dan periksa kestabilan tumpuan jika diperlukan.'}</p><p className="text-xs text-[#8A929C] mb-5">Timer dapat dijeda. Set yang selesai tersimpan sebagai draft hingga sesi dituntaskan.</p>{activeWorkout&&!resumable&&<Message>Ada sesi lain belum selesai. Lanjutkan sesi tersebut sebelum memulai yang baru. <Link href={`/latihan/${activeWorkout.sessionId}`} className="v3-text-link">Lanjutkan →</Link></Message>}{error&&<Message error>{error}</Message>}{allowed&&<button disabled={busy||!!activeWorkout&&!resumable} className="v3-button w-full" onClick={async()=>{setBusy(true);try{if(!resumable)await request('start',{sessionId:session.id});router.push(`/latihan/${session.id}`);}catch(e){setError(e instanceof Error?e.message:'Sesi belum dimulai.');}finally{setBusy(false);}}}><Play className="w-4 h-4"/>{busy?'Menyiapkan…':resumable?'Lanjutkan latihan':'Mulai sesi'}<ArrowRight className="w-4 h-4"/></button>}</aside></div>
 </Page>;
}
