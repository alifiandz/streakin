import React,{useState} from 'react';
import Link from 'next/link';
import {ArrowRight,Check,Plus} from 'lucide-react';
import {SEED_SKILLS,SEED_SESSIONS} from '@/lib/seedData';
import {useWorkout} from '@/context/WorkoutContext';
import {useAuth} from '@/context/AuthContext';
import {SkillCover} from './SkillCover';

export function SkillLibrary({actions=true}:{actions?:boolean}) {
 const {getSkillProgress,library,saveLibrary}=useWorkout();
 const {currentUser}=useAuth();
 const [saving,setSaving]=useState(false);
 const [message,setMessage]=useState('');
 async function add(skillId:string) {
  const stage=getSkillProgress(skillId).currentStage;
  const session=SEED_SESSIONS.find(s=>s.skillId===skillId&&s.stageNumber===stage);
  if(!session)return;
  setSaving(true);setMessage('');
  try {await saveLibrary(library?.durasi||[],library?.fokus||[],Array.from(new Set([...(library?.sessionIds||[]),session.id])));setMessage('Tahap aktif ditambahkan ke Library kamu.');}
  catch(e){setMessage(e instanceof Error?e.message:'Library belum tersimpan. Coba lagi.');}
  finally {setSaving(false);}
 }
 return <>
  {message&&<p role="status" className="p-3 mb-3 rounded-xl border border-[#FF7A03]/30 text-sm text-[#FF7A03]">{message}</p>}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
   {SEED_SKILLS.map(skill=>{
    const stage=getSkillProgress(skill.id).currentStage;
    const session=SEED_SESSIONS.find(s=>s.skillId===skill.id&&s.stageNumber===stage);
    const saved=!!session&&!!library?.sessionIds.includes(session.id);
    return <article key={skill.id} className="card-surface p-4 sm:p-5 border-[#2E3238] flex flex-col">
     <SkillCover id={skill.id} name={skill.nama}/>
     <Link href={`/skills/${skill.id}`} aria-label={`Buka skill ${skill.nama}`} className="block hover:opacity-90 transition-opacity">
      <div className="flex justify-between items-center gap-2 mb-2"><h2 className="text-xl font-extrabold">{skill.nama}</h2><span className="text-[11px] text-[#FF7A03] bg-[#FF7A03]/10 rounded-full px-2 py-1">5 tahap</span></div>
     </Link>
     <p className="text-xs text-[#8A929C] leading-relaxed mb-3 flex-1">{skill.deskripsi}</p>
     {currentUser&&<p className="text-xs text-[#8A929C] mb-3">Tahap aktif <strong className="text-[#FF7A03]">{stage}/5</strong> · {skill.stages[stage-1].nama}</p>}
     <Link href={`/skills/${skill.id}`} className="btn-brand min-h-[44px] flex justify-center items-center gap-2 text-xs font-bold">Lihat Tahapan <ArrowRight className="w-4 h-4"/></Link>
     {actions&&(currentUser?<button type="button" disabled={saving||saved} onClick={()=>add(skill.id)} className="btn-outline mt-2 min-h-[44px] flex items-center justify-center gap-2 text-xs font-bold disabled:opacity-60">{saved?<Check className="w-4 h-4"/>:<Plus className="w-4 h-4"/>}{saved?'Tersimpan di Library':saving?'Menyimpan…':'Simpan Tahap Aktif'}</button>:<Link href="/akun?tab=register" className="btn-outline mt-2 min-h-[44px] flex items-center justify-center text-xs font-bold">Masuk untuk Menyimpan</Link>)}
    </article>;
   })}
  </div>
 </>;
}
