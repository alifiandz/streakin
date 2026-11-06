import React,{useState} from 'react';
import Link from 'next/link';
import {ArrowRight,Lock,Flag} from 'lucide-react';
import {SEED_SKILLS,SEED_SESSIONS,requirements} from '../catalog';
import {guidedInfo} from '../guided-training';
import {isProSkill} from '../model';
import {useProduct} from '../ProductContext';
import {useWorkout} from '@/context/WorkoutContext';
import {useAuth} from '@/context/AuthContext';
import {Page,SectionTitle} from '../components/UI';
import {SkillMilestones} from '../components/SkillMilestones';
import {skillThemes,equipmentLabels} from '../training-meta';
export default function Skills(){
 const {state}=useProduct();const {currentUser}=useAuth();const {getSkillProgress,logs}=useWorkout();const [filter,setFilter]=useState('all');
 const skills=SEED_SKILLS.filter(s=>filter==='all'||(filter==='free'?!isProSkill(s.id):isProSkill(s.id)));
 return <Page title="Bukan sekadar gerakan. Sebuah perjalanan." eyebrow="Perjalanan skill" description="Lihat posisi awalmu, target tahap ini, dan tonggak berikutnya. Semua tahapan fondasi tetap gratis.">
  <div className="skills-toolbar"><div className="v3-choice" aria-label="Filter skill">{[['all','Semua skill'],['free','Fondasi · Free'],['pro','Spesialisasi · Pro']].map(([id,label])=><button key={id} aria-pressed={filter===id} onClick={()=>setFilter(id)}>{label}</button>)}</div><p>{currentUser?'Progres mengikuti tahap yang kamu konfirmasi.':'Buka setiap tahap untuk mengenali jalurnya.'}</p></div>
  <div className="skill-journey-grid">{skills.map(skill=>{
   const progress=getSkillProgress(skill.id);const stage=skill.stages[progress.currentStage-1];const premium=isProSkill(skill.id);const locked=premium&&state.testTier!=='pro';
   const currentSession=SEED_SESSIONS.find(s=>s.skillId===skill.id&&s.stageNumber===progress.currentStage);
   const attempts=logs.filter(log=>log.sessionId===currentSession?.id||guidedInfo(log.sessionId)?.skillId===skill.id&&guidedInfo(log.sessionId)?.stage===progress.currentStage).length;
   const illustration=skill.stages[4].imageUrl;
   return <article className={`skill-journey ${locked?'is-premium':''}`} key={skill.id}>
    <div className="skill-journey-header"><div><div className="flex items-center gap-2 mb-2"><span className={`v3-pill ${premium?'pro':''}`}>{premium?'PRO':'FREE'}</span><span className="text-[10px] text-[#8A929C]">{skillThemes[skill.id].focus}</span></div><Link href={`/skills/${skill.id}`}><h2>{skill.nama}</h2></Link><p>{skillThemes[skill.id].hook}</p></div>{illustration?<Link href={`/skills/${skill.id}`} className="skill-goal-art"><img src={illustration} alt={`Tujuan akhir ${skill.nama}, bukan ilustrasi tahap aktif`} loading="lazy"/><span>Posisi tujuan</span></Link>:<div className="skill-art-note"><Flag className="w-5 h-5 text-[#FF7A03]"/><span>Ilustrasi Elbow Lever<br/>belum tersedia</span></div>}</div>
    <SkillMilestones skillId={skill.id} current={progress.currentStage} completed={!!progress.completedAt} locked={locked}/>
    <div className="skill-current-milestone"><div><p className="v3-eyebrow">{locked?'Kenali fondasi spesialisasi':currentUser?progress.completedAt?'Jalur selesai · konfirmasi diri':`Tahap aktif ${progress.currentStage} dari 5`:'Mulai dari tahap pertama'}</p><h3>{locked?skill.stages[0].nama:stage.nama}</h3><p>{locked?requirements[skill.id].prerequisite:`${stage.targetSets} set × ${stage.targetHoldSec} dtk · ${attempts?`${attempts} sesi tahap ini tercatat`:'belum ada sesi tahap ini'}`}</p></div><Link href={`/skills/${skill.id}`} className="v3-button secondary">{locked?<Lock className="w-3.5 h-3.5"/>:<ArrowRight className="w-3.5 h-3.5"/>}{locked?'Lihat pratinjau':progress.completedAt?'Ulangi latihan':'Buka tahap aktif'}</Link></div>
    <div className="skill-next-note">{locked?<><span>Spesialisasi Pro · </span><Link href="/membership">Apa yang terbuka di Pro? →</Link></>:<><span>{progress.currentStage<5?'Tonggak berikutnya':'Fokus berikutnya'}</span><strong>{progress.currentStage<5?skill.stages[progress.currentStage].nama.split(' (')[0]:'Pertahankan teknik dan ulangi dengan kontrol.'}</strong></>}</div>
   </article>;
  })}</div>
  <SectionTitle title="Spesialisasi berikutnya"/><p className="text-xs text-[#8A929C] mb-4">Masih dalam pengembangan. Bukan fitur Pro yang sudah tersedia.</p><div className="v3-choice">{['Planche','Muscle-Up','Handstand Lanjutan'].map(name=><span key={name} className="v3-pill">{name} · segera hadir</span>)}</div>
 </Page>;
}
