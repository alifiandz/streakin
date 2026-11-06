import React from 'react';
import Link from 'next/link';
import {useProduct} from '../ProductContext';
import {useWorkout} from '@/context/WorkoutContext';
import {SEED_SESSIONS} from '../catalog';
import {recommendWorkouts} from '../recommendations';
import {ProPrompt,SectionTitle} from './UI';
export function TrainingPlan(){
 const {state}=useProduct();const {logs,getSkillProgress,library}=useWorkout();
 if(state.testTier!=='pro')return <><SectionTitle title="Rencana latihan"/><ProPrompt title="Susun minggu yang lebih terarah" description="Saran Pro memilih sesi dari tujuan, alat, tahap aktif dan aktivitas terakhirmu. Jadwal manual dan sesi tanpa batas tetap tersedia gratis."/></>;
 const ranked=recommendWorkouts({sessions:[...SEED_SESSIONS,...state.routines],state,logs,stageFor:id=>getSkillProgress(id).currentStage,savedIds:library?.sessionIds});
 const choices=ranked.map(r=>r.session);
 if(!choices.length)return <section><SectionTitle title="Saran minggu latihan · Pro"/><p className="text-xs text-[#8A929C]">Belum ada sesi yang sesuai waktu, alat, dan laporan kemampuanmu. Ubah preferensi atau pelajari variasi di pustaka gerakan.</p><Link href="/profile" className="v3-text-link">Tinjau preferensi →</Link></section>;
 const days=state.schedule.days.length?[...state.schedule.days].sort((a,b)=>a-b):[1,3,5,0,2,4,6].slice(0,state.preferences.frequency).sort((a,b)=>a-b);
 return <section><SectionTitle title="Saran minggu latihan · Pro"/><p className="text-xs text-[#8A929C] mb-3">Pilihan berdasarkan pengalaman, alat, tujuan, tahap aktif dan sesi terakhir. Waktu sesi dan laporan kemampuan ikut disaring. Jika target sesi terakhir belum tercapai, saran mengutamakan pengulangan. Ini berbasis aturan, bukan asesmen pelatih. Sesuaikan hari pulih.</p>{days.map((day,i)=>{const s=choices[i%choices.length];return <div key={day} className="v3-row"><div><p className="v3-eyebrow">{['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][day]} · {state.schedule.time}</p><h3>{s.nama}</h3><p>{s.durasiMenit} menit perkiraan</p></div><Link href={`/workouts/${s.id}`} className="v3-text-link">Tinjau →</Link></div>;})}</section>;
}
