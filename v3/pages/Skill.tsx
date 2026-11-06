import React,{useEffect,useState} from 'react';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {ArrowLeft,ArrowRight} from 'lucide-react';
import {SEED_SKILLS,SEED_SESSIONS,requirements} from '../catalog';
import {isProSkill} from '../model';
import {useProduct} from '../ProductContext';
import {useAuth} from '@/context/AuthContext';
import {useWorkout} from '@/context/WorkoutContext';
import {StageImage} from '@/components/ui/StageImage';
import {movementReferences} from '@/prototype/movement-references';
import {Page,Message,ProPrompt} from '../components/UI';
export default function Skill(){
 const {currentUser}=useAuth();const {skillId}=useParams();const skill=SEED_SKILLS.find(s=>s.id===skillId);const {state}=useProduct();const {getSkillProgress,updateSkillStage,logs}=useWorkout();
 const current=skill?getSkillProgress(skill.id).currentStage:1;const [selected,setSelected]=useState(current);const [confirmed,setConfirmed]=useState(false);const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');
 useEffect(()=>{setSelected(current);setConfirmed(false);setMessage('');},[skillId,current]);
 if(!skill)return <Page title="Skill tidak ditemukan"><Link href="/skills" className="v3-text-link">Kembali ke skill</Link></Page>;
 const pro=isProSkill(skill.id)&&state.testTier!=='pro';const stage=skill.stages[selected-1];const session=SEED_SESSIONS.find(s=>s.skillId===skill.id&&s.stageNumber===selected);const future=selected>current;
 return <Page title={skill.nama} eyebrow={`${isProSkill(skill.id)?'Pro specialization':'Free foundation'} · ${skill.level}`} description={skill.deskripsi} action={<Link href="/skills" className="v3-text-link"><ArrowLeft className="w-4 h-4"/>Semua skill</Link>}>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-6 mb-6 border-b border-[#2E3238]"><div><p className="v3-eyebrow">Sebelum mulai</p><p className="text-xs text-[#8A929C]">{requirements[skill.id]?.prerequisite}</p></div><div><p className="v3-eyebrow">Peralatan</p><p className="text-xs text-[#8A929C]">{requirements[skill.id]?.equipment.map(id=>(({floor:'Area lantai',wall:'Dinding',bar:'Palang kokoh',parallettes:'Parallettes / tumpuan stabil'} as Record<string,string>)[id]||id)).join(' · ')}</p></div></div>
  <div className="v3-stage-list" aria-label="Tahap progresi">{skill.stages.map(s=><button key={s.stageNumber} onClick={()=>{setSelected(s.stageNumber);setConfirmed(false);}} aria-pressed={selected===s.stageNumber}><strong>TAHAP {s.stageNumber}{s.stageNumber===current?' · AKTIF':s.stageNumber<current?' · DILEWATI':''}</strong>{s.nama.split(' (')[0]}</button>)}</div>
  {pro&&<ProPrompt title="Preview Front Lever" description="Baca tahapan dan persyaratannya. Sesi spesialis, progres Front Lever, dan teknik lengkap tersedia dalam Pro. Fondasi L-Sit dan Handstand tetap gratis di semua tahap."/>}
  <div className="v3-split">
   <div><StageImage src={stage.imageUrl} stageName={stage.nama} skillName={skill.nama} stageNumber={selected} reference={movementReferences[skill.id]}/><p className="text-xs text-[#8A929C] mt-4 leading-relaxed">{skill.catatanAman}</p></div>
   <section><p className="v3-eyebrow">Tahap {selected} dari 5</p><h2 className="text-2xl font-bold tracking-tight mb-3">{stage.nama}</h2><p className="text-sm text-[#8A929C] leading-relaxed">{stage.deskripsi}</p><div className="v3-metric-strip"><div><strong>{stage.targetHoldSec}<small className="text-xs text-[#8A929C] ml-1">dtk</small></strong><span>Target tahanan</span></div><div><strong>{stage.targetSets}</strong><span>Set latihan</span></div></div>
    {!pro&&<><ol className="v3-instructions">{stage.langkah.map((step,i)=><li key={i}>{step}</li>)}</ol><p className="text-xs text-[#8A929C] mb-4"><strong className="text-[#EEF1F4]">Kriteria:</strong> {stage.syaratLulus}</p>{future?<div><Message>Tahap ini bisa dipelajari. Latih tahap aktif dan penuhi kriterianya sebelum melanjutkan.</Message><button className="v3-button secondary" onClick={()=>setSelected(current)}>Kembali ke tahap aktif</button></div>:session&&<Link href={`/workouts/${session.id}`} className="v3-button w-full">Tinjau latihan tahap {selected}<ArrowRight className="w-4 h-4"/></Link>}
     {currentUser&&selected===current&&current<5&&<div className="v3-divider"><label className="text-xs flex gap-3 items-start"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)} className="mt-1"/>Saya memenuhi kriteria dengan teknik terkontrol dan tanpa nyeri.</label><button disabled={!confirmed||busy} className="v3-button secondary mt-4" onClick={async()=>{setBusy(true);try{await updateSkillStage(skill.id,current+1);setMessage('Tahap berikutnya terbuka.');}catch(e){setMessage(e instanceof Error?e.message:'Progres belum tersimpan.');}finally{setBusy(false);}}}>{busy?'Menyimpan…':'Konfirmasi naik tahap'}</button></div>}
     {state.testTier==='pro'&&selected===current&&<Message>{logs.some(log=>log.sessionId===session?.id&&log.setsCompleted.filter(set=>set.exerciseId===session?.exercises[0]?.exerciseId&&set.nilai>=stage.targetHoldSec).length>=stage.targetSets)?'Catatanmu memuat satu sesi yang mencapai target kuantitatif tahap ini. Tinjau kontrol teknik sebelum mengonfirmasi progres.':'Saran progres: kumpulkan catatan lengkap untuk tahap aktif. Target angka saja tidak memastikan teknik sudah benar.'}</Message>}
     {!currentUser&&<Link href="/akun?tab=register" className="v3-text-link">Simpan progres dengan akun gratis →</Link>}
     <details className="v3-divider"><summary className="cursor-pointer text-xs font-bold min-h-[44px]">Kesalahan umum & variasi</summary><ul className="list-disc pl-4 text-xs text-[#8A929C] space-y-2">{stage.kesalahanUmum.map(s=><li key={s}>{s}</li>)}</ul><p className="text-xs mt-4">Lebih mudah: {stage.lebihMudah}</p><p className="text-xs mt-2">Lebih sulit: {stage.lebihSulit}</p></details>
    </>}
    {message&&<Message>{message}</Message>}
   </section>
  </div>
 </Page>;
}
