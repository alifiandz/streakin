import React,{useState} from 'react';
import Link from 'next/link';
import {ArrowRight,Lock} from 'lucide-react';
import {SEED_SKILLS} from '../catalog';
import {isProSkill} from '../model';
import {useProduct} from '../ProductContext';
import {useWorkout} from '@/context/WorkoutContext';
import {Page,SectionTitle} from '../components/UI';
export default function Skills(){
 const {state}=useProduct();const {getSkillProgress}=useWorkout();const [filter,setFilter]=useState('all');
 const skills=SEED_SKILLS.filter(s=>filter==='all'||(filter==='free'?!isProSkill(s.id):isProSkill(s.id)));
 return <Page title="Bangun satu skill. Tahap demi tahap." eyebrow="Skill roadmaps" description="Fondasi yang jelas, persyaratan yang terukur, dan sesi yang mengikuti tahapmu.">
  <div className="v3-choice mb-6" aria-label="Filter skill">{[['all','Semua skill'],['free','Fondasi · Free'],['pro','Spesialisasi · Pro']].map(([id,label])=><button key={id} aria-pressed={filter===id} onClick={()=>setFilter(id)}>{label}</button>)}</div>
  <div className="v3-grid">{skills.map(skill=>{const progress=getSkillProgress(skill.id);const premium=isProSkill(skill.id);const locked=premium&&state.testTier!=='pro';const src=skill.id==='elbow-lever'?'/images/mascot/ppt-explain.png':skill.stages[4].imageUrl;return <article className="v3-skill-card" key={skill.id}>
   <Link href={`/skills/${skill.id}`} className="v3-skill-image block"><img src={src} alt={skill.id==='elbow-lever'?'Orange Guy mengenalkan panduan keseimbangan':`${skill.nama} posisi penuh`} loading="lazy"/></Link>
   <div className="v3-skill-body"><div className="flex justify-between gap-2 mb-3"><span className={`v3-pill ${premium?'pro':''}`}>{premium?'PRO':'FREE'}</span><span className="v3-pill">{skill.level}</span></div><h2>{skill.nama}</h2><p>{skill.deskripsi}</p><p className="!text-[11px]">5 tahap {locked?'· Pratinjau terbuka':`· Tahap aktif ${progress.currentStage}`}</p><Link href={`/skills/${skill.id}`} className="v3-button secondary w-full">{locked?<Lock className="w-3.5 h-3.5"/>:null}{locked?'Lihat pratinjau':'Buka roadmap'}<ArrowRight className="w-3.5 h-3.5"/></Link></div>
  </article>;})}</div>
  <SectionTitle title="Spesialisasi berikutnya"/><p className="text-xs text-[#8A929C] mb-4">Belum tersedia. Konten ini bukan bagian dari akses Pro yang bisa diuji saat ini.</p><div className="v3-choice">{['Planche','Muscle-Up','Advanced Handstand'].map(name=><span key={name} className="v3-pill">{name} · segera hadir</span>)}</div>
 </Page>;
}
