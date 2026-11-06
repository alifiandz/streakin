'use client';
import React,{useState} from 'react';
import {MobileContainer} from '@/components/layout/MobileContainer';
import {SkillLibrary} from '@/prototype/components/SkillLibrary';
import SessionPicker from '@/prototype/components/SessionPicker';
import {SafeImage} from '@/components/ui/SafeImage';
import {SEED_EXERCISES,SEED_SESSIONS} from '@/lib/seedData';
import {movementReferences} from '@/prototype/movement-references';

export default function LibraryPage(){
 const [tab,setTab]=useState('skills');
 const [query,setQuery]=useState('');
 const used=new Set(SEED_SESSIONS.flatMap(s=>s.exercises.map(e=>e.exerciseId)));
 const exercises=SEED_EXERCISES.filter(e=>used.has(e.id)&&`${e.nama} ${e.area}`.toLowerCase().includes(query.toLowerCase()));
 return <div className="min-h-[100dvh] bg-[#15171A] text-[#EEF1F4] overflow-x-hidden">
  <MobileContainer maxWidth="6xl">
   <header className="mb-5"><h1 className="text-xl sm:text-3xl font-extrabold">Library Latihan</h1><p className="text-xs sm:text-sm text-[#8A929C] mt-1">Pilih skill yang ingin kamu kuasai. Buka kotaknya untuk melihat tahapan, teknik, dan sesi latihan.</p></header>
   <div role="tablist" aria-label="Isi Library" className="flex gap-2 mb-5 overflow-x-auto">
    {[['skills','Skill'],['exercises','Gerakan'],['sessions','Sesi Pendukung']].map(([id,label])=><button key={id} id={`tab-${id}`} aria-controls={`panel-${id}`} role="tab" aria-selected={tab===id} onClick={()=>setTab(id)} className={`min-h-[44px] rounded-xl px-4 text-xs sm:text-sm font-bold whitespace-nowrap ${tab===id?'bg-[#FF7A03] text-[#15171A]':'bg-[#23272D] border border-[#2E3238] text-[#8A929C]'}`}>{label}</button>)}
   </div>
   <section role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
    {tab==='skills'&&<SkillLibrary/>}
    {tab==='exercises'&&<>
     <label className="block text-xs text-[#8A929C] mb-2" htmlFor="exercise-search">Cari nama gerakan atau area otot</label><input id="exercise-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Contoh: push-up, bahu, plank" className="w-full min-h-[44px] rounded-xl bg-[#23272D] border border-[#2E3238] px-4 text-sm mb-5"/>
     <p role="status" className="text-xs text-[#8A929C] mb-3">{exercises.length} gerakan</p>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{exercises.map(ex=>{
      const skill=SEED_SESSIONS.find(s=>s.skillId&&s.exercises[0]?.exerciseId===ex.id)?.skillId;
      return <article key={ex.id} className="card-surface p-3 border-[#2E3238]">
       <SafeImage src={ex.imageUrl} alt={ex.nama} fallbackTitle={ex.nama} fallbackSubtitle="Buka sumber demonstrasi untuk melihat gerakannya" reference={skill?movementReferences[skill]:undefined}/>
       {ex.imageUrl?.startsWith('https:')&&<a href={movementReferences['elbow-lever'].url} target="_blank" rel="noreferrer" className="text-[10px] text-[#8A929C]">Foto: Hybrid Calisthenics ↗</a>}
       <h2 className="font-bold text-sm mt-3">{ex.nama}</h2><p className="text-xs text-[#8A929C] mt-1 mb-2">{ex.area} · {ex.targetDefault}</p>
       <details className="border-t border-[#2E3238] pt-2 text-xs"><summary className="min-h-[44px] cursor-pointer text-[#FF7A03] font-bold flex items-center">Lihat teknik & kesalahan umum</summary><ol className="list-decimal pl-5 space-y-2 text-[#EEF1F4] mb-3">{ex.langkah.map((step,i)=><li key={i}>{step}</li>)}</ol><p className="font-bold mb-1">Hindari:</p><ul className="list-disc pl-5 space-y-1 text-[#8A929C]">{ex.kesalahanUmum.map((step,i)=><li key={i}>{step}</li>)}</ul></details>
      </article>;
     })}</div>
     {!exercises.length&&<p className="card-surface p-5 text-sm text-[#8A929C]">Gerakan tidak ditemukan. Coba nama lain.</p>}
    </>}
    {tab==='sessions'&&<SessionPicker/>}
   </section>
  </MobileContainer>
 </div>;
}
