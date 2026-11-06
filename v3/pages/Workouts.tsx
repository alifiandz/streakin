import React,{useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {TrainingPlan} from '../components/TrainingPlan';
import Link from 'next/link';
import {Plus} from 'lucide-react';
import {SEED_SESSIONS} from '../catalog';
import {presetIds} from '../model';
import {useProduct} from '../ProductContext';
import {useWorkout} from '@/context/WorkoutContext';
import {Page,SectionTitle,Message} from '../components/UI';
import {WorkoutCard} from '../components/WorkoutCard';
import {missingEquipment,workoutMeta} from '../training-meta';
export default function Workouts(){
 const {state,request}=useProduct();const {activeWorkout,clearActiveWorkout}=useWorkout();const params=useSearchParams();
 const [error,setError]=useState('');const [compatible,setCompatible]=useState(false);const [goal,setGoal]=useState(['push','core','legs'].includes(params.get('goal')||'')?params.get('goal')!:'all');
 const presets=SEED_SESSIONS.filter(s=>presetIds.includes(s.id)&&(goal==='all'||workoutMeta(s).category===goal)&&(!compatible||missingEquipment(s,state.preferences.equipment).length===0));
 return <Page title="Pilih sesi, bukan sekadar durasi." eyebrow="Pilihan latihan" description="Kenali tujuan, kebutuhan alat, dan susunan gerakannya sebelum mulai. Durasi adalah perkiraan, termasuk jeda." action={<Link href="/builder" className="v3-button"><Plus className="w-4 h-4"/>Buat rutinitas</Link>}>
  {activeWorkout&&<Message>Ada sesi belum selesai. <Link href={`/latihan/${activeWorkout.sessionId}`} className="v3-text-link">Lanjutkan sesi →</Link><button className="v3-text-link ml-4" onClick={async()=>{if(!window.confirm('Hapus draft sesi yang belum selesai? Riwayat sesi selesai tidak berubah.'))return;try{await request('cancel',{sessionId:activeWorkout.sessionId});localStorage.removeItem(`streakin_player_checkpoint_v3_${activeWorkout.userId}_${activeWorkout.sessionId}`);clearActiveWorkout();}catch(e){setError((e as Error).message);}}}>Hapus draft</button></Message>}
  <div className="workouts-toolbar"><div className="v3-choice" aria-label="Tujuan latihan">{[['all','Semua tujuan'],['push','Dorong'],['core','Inti tubuh'],['legs','Kaki']].map(([id,label])=><button key={id} aria-pressed={goal===id} onClick={()=>setGoal(id)}>{label}</button>)}</div><label><input type="checkbox" checked={compatible} onChange={e=>setCompatible(e.target.checked)}/>Sesuai alatku</label></div>
  <div className="flex justify-between items-center gap-4 mb-4"><h2 className="font-bold text-base">Program dasar · Free</h2><span className="text-[11px] text-[#8A929C]" role="status">{presets.length} dari 3 program</span></div>
  <div className="workout-session-grid">{presets.map(s=><WorkoutCard key={s.id} session={s} availableEquipment={state.preferences.equipment}/>)}</div>
  {!presets.length&&<div className="workouts-empty"><h3>Tidak ada sesi yang cocok dengan pilihan ini.</h3><p>Ubah tujuan atau peralatan di Profil. Preferensi tidak menghapus program yang tersedia.</p><button className="v3-button secondary" onClick={()=>{setGoal('all');setCompatible(false);}}>Reset pilihan</button><Link href="/profile" className="v3-text-link ml-4">Ubah peralatan →</Link></div>}
  <div className="workouts-skill-bridge"><div><p className="v3-eyebrow">Mau melatih gerakan tertentu?</p><h2>Sesi skill mengikuti tahapmu.</h2><p>Tahap L-Sit, Handstand, dan Elbow Lever ada di jalur progresi, bukan bercampur dengan program dasar.</p></div><Link href="/skills" className="v3-text-link">Buka perjalanan skill →</Link></div>
  <SectionTitle title="Rutinitas kustom"><span className="text-xs text-[#8A929C]">{state.routines.length} tersimpan · {state.testTier==='free'?'Free: 1 rutinitas':'Pro uji: tanpa batas jumlah'}</span></SectionTitle>
  {error&&<Message error>{error}</Message>}
  {state.routines.length?<div className="workout-session-grid">{state.routines.map(r=><WorkoutCard key={r.id} session={r} availableEquipment={state.preferences.equipment}><Link href={`/builder/${r.id}`} className="v3-text-link">Edit</Link><button className="v3-text-link !text-[#969ea8]" onClick={async()=>{if(!window.confirm('Hapus rutinitas ini? Riwayat latihan tetap tersimpan.'))return;try{await request('routines',{id:r.id,action:'delete'});}catch(e){setError(e instanceof Error?e.message:'Belum terhapus.');}}}>Hapus</button></WorkoutCard>)}</div>:<div className="custom-routine-start"><div><h3>Sudah punya susunan latihan sendiri?</h3><p>Pilih gerakan, urutan, target dan jeda. Free menyimpan satu rutinitas dengan sesi tanpa batas.</p></div><Link href="/builder" className="v3-text-link">Susun rutinitas pertama →</Link></div>}
  <TrainingPlan/>
 </Page>;
}
