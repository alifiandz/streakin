import React,{useState} from 'react';
import {TrainingPlan} from '../components/TrainingPlan';
import Link from 'next/link';
import {ArrowRight,Plus} from 'lucide-react';
import {SEED_SESSIONS,SEED_EXERCISES,sessionEquipment} from '../catalog';
import {presetIds} from '../model';
import {useProduct} from '../ProductContext';
import {useWorkout} from '@/context/WorkoutContext';
import {Page,SectionTitle,Message} from '../components/UI';
export default function Workouts(){
 const {state,request}=useProduct();const {activeWorkout,clearActiveWorkout}=useWorkout();const [error,setError]=useState('');const [compatible,setCompatible]=useState(false);
 const presets=SEED_SESSIONS.filter(s=>presetIds.includes(s.id)&&(!compatible||sessionEquipment(s.id).every(e=>state.preferences.equipment.includes(e))));
 return <Page title="Sesi singkat. Latihan terarah." eyebrow="Workouts" description="Tiga program dasar gratis, sesi skill dari roadmap, dan rutinitas kustommu sendiri." action={<Link href="/builder" className="v3-button"><Plus className="w-4 h-4"/>Buat rutinitas</Link>}>
  {activeWorkout&&<Message>Ada sesi belum selesai. <Link href={`/latihan/${activeWorkout.sessionId}`} className="v3-text-link">Lanjutkan sesi →</Link><button className="v3-text-link ml-4" onClick={async()=>{if(!window.confirm('Hapus draft sesi yang belum selesai? Riwayat sesi selesai tidak berubah.'))return;try{await request('cancel',{sessionId:activeWorkout.sessionId});localStorage.removeItem(`streakin_player_checkpoint_v3_${activeWorkout.userId}_${activeWorkout.sessionId}`);clearActiveWorkout();}catch(e){setError((e as Error).message);}}}>Hapus draft</button></Message>}
  <div className="flex justify-between items-center gap-4 mb-6"><h2 className="font-bold text-base">Program dasar · Free</h2><label className="text-xs text-[#8A929C] flex gap-2 items-center"><input type="checkbox" checked={compatible} onChange={e=>setCompatible(e.target.checked)}/>Sesuai alatku</label></div>
  <div className="v3-grid">{presets.map(s=>{const ex=SEED_EXERCISES.find(e=>e.id===s.exercises[0].exerciseId);return <article key={s.id} className="v3-skill-card"><div className="v3-skill-image"><img src={ex?.imageUrl} alt={ex?.nama} loading="lazy"/></div><div className="v3-skill-body"><span className="v3-pill">{s.durasiMenit} MENIT · {s.fokus}</span><h2 className="mt-3">{s.nama}</h2><p>{s.exercises.length} gerakan · timer dan pencatatan set tanpa batas</p><Link href={`/workouts/${s.id}`} className="v3-button secondary w-full">Tinjau sesi<ArrowRight className="w-4 h-4"/></Link></div></article>;})}</div>
  {!presets.length&&<Message>Belum ada program yang cocok dengan alat pilihanmu. Ubah filter atau preferensi peralatan di Profil.</Message>}
  <SectionTitle title="Rutinitas kustom"><span className="text-xs text-[#8A929C]">{state.routines.length} tersimpan · {state.testTier==='free'?'Free: 1 rutinitas':'Pro uji: tanpa batas jumlah'}</span></SectionTitle>
  {error&&<Message error>{error}</Message>}
  {state.routines.length?state.routines.map(r=><article className="v3-row" key={r.id}><div><h3>{r.nama}</h3><p>{r.exercises.length} gerakan · sekitar {r.durasiMenit} menit</p></div><div className="flex gap-2 flex-wrap justify-end"><Link href={`/workouts/${r.id}`} className="v3-button secondary">Tinjau</Link><Link href={`/builder/${r.id}`} className="v3-text-link">Edit</Link><button className="v3-text-link !text-[#969ea8]" onClick={async()=>{if(!window.confirm('Hapus rutinitas ini? Riwayat latihan tetap tersimpan.'))return;try{await request('routines',{id:r.id,action:'delete'});}catch(e){setError(e instanceof Error?e.message:'Belum terhapus.');}}}>Hapus</button></div></article>):<div className="v3-empty"><h2>Latihanmu, susunanmu.</h2><p>Gabungkan gerakan dan atur target sesuai kebutuhan.</p><Link href="/builder" className="v3-button secondary">Buat rutinitas pertama</Link></div>}
  <div className="v3-divider flex flex-wrap justify-between items-center gap-4"><div><h2 className="font-bold text-base">Ingin fokus pada skill?</h2><p className="text-xs text-[#8A929C] mt-1">Sesi setiap tahap ada di dalam roadmap.</p></div><Link href="/skills" className="v3-text-link">Pilih skill <ArrowRight className="w-4 h-4"/></Link></div>
  <TrainingPlan/>
 </Page>;
}
