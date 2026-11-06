import React from 'react';
import Link from 'next/link';
import {useProduct} from '../ProductContext';
import {useWorkout} from '@/context/WorkoutContext';
import {SEED_SESSIONS,sessionEquipment} from '../catalog';
import {canTrain,presetIds} from '../model';
import {ProPrompt,SectionTitle} from './UI';
export function TrainingPlan(){
 const {state}=useProduct();const {logs,getSkillProgress}=useWorkout();
 if(state.testTier!=='pro')return <><SectionTitle title="Rencana latihan"/><ProPrompt title="Susun minggu yang lebih terarah" description="Saran Pro memilih sesi dari tujuan, alat, tahap aktif dan aktivitas terakhirmu. Jadwal manual dan sesi tanpa batas tetap tersedia gratis."/></>;
 const pool=SEED_SESSIONS.filter(s=>canTrain(s,state.testTier)&&(state.preferences.experience!=='new'||s.skillId!=='front-lever')&&(presetIds.includes(s.id)||(s.skillId&&state.preferences.skills.includes(s.skillId)&&s.stageNumber===getSkillProgress(s.skillId).currentStage))&&sessionEquipment(s.id).every(e=>state.preferences.equipment.includes(e)));
 pool.sort((a,b)=>state.preferences.goal==='skills'?Number(!!b.skillId)-Number(!!a.skillId):state.preferences.goal==='consistency'?a.durasiMenit-b.durasiMenit:Number(!!a.skillId)-Number(!!b.skillId));
 const choices=pool.length?pool:[SEED_SESSIONS.find(s=>s.id==='s_legs_10')!];
 const last=[...logs].sort((a,b)=>b.tanggal.localeCompare(a.tanggal))[0];const next=(choices.findIndex(s=>s.id===last?.sessionId)+1)%choices.length;
 const days=state.schedule.days.length?[...state.schedule.days].sort((a,b)=>a-b):[1,3,5,0,2,4,6].slice(0,state.preferences.frequency).sort((a,b)=>a-b);
 return <section><SectionTitle title="Saran minggu latihan · Pro"/><p className="text-xs text-[#8A929C] mb-3">Pilihan berdasarkan pengalaman, alat, tujuan, tahap aktif dan sesi terakhir. Rekomendasi berbasis aturan, bukan asesmen pelatih. Sesuaikan hari pulih.</p>{days.map((day,i)=>{const s=choices[(next+i)%choices.length];return <div key={day} className="v3-row"><div><p className="v3-eyebrow">{['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][day]} · {state.schedule.time}</p><h3>{s.nama}</h3><p>{s.durasiMenit} menit perkiraan</p></div><Link href={`/workouts/${s.id}`} className="v3-text-link">Tinjau →</Link></div>;})}</section>;
}
