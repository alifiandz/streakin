import {SEED_EXERCISES,SEED_SESSIONS} from './catalog';
import {assertRoutineLimit,canTrain,emptyProduct,quota,isProExercise,type ProductState,type Routine} from './model';
const requireValue=(ok:unknown,message:string)=>{if(!ok)throw Error(message);};
export function productFor(profile:any):ProductState{
 const base=emptyProduct(),saved=profile.product||{};
 profile.product={...base,...saved,testTier:saved.testTier==='pro'?'pro':'free',preferences:{...base.preferences,...saved.preferences,assessment:{...base.preferences.assessment,...saved.preferences?.assessment}},routines:Array.isArray(saved.routines)?saved.routines:[],schedule:{...base.schedule,...saved.schedule},usage:saved.usage&&typeof saved.usage==='object'?saved.usage:{},leases:saved.leases&&typeof saved.leases==='object'?saved.leases:{}};
 return profile.product;
}
export function resolveSession(profile:any,id:string){return SEED_SESSIONS.find(s=>s.id===id)||productFor(profile).routines.find(s=>s.id===id);}
export function productRequest(profile:any,path:string,body:any,post:boolean){
 const state=productFor(profile);
 if(path==='/api/v3/state')return {state,quota:quota(state),mode:'local-prototype',billingConfigured:false,aiOperational:false};
 requireValue(post,'Metode tidak didukung.');
 if(path==='/api/v3/test-tier'){
  requireValue(body.tier==='free'||body.tier==='pro','Paket uji tidak valid.');state.testTier=body.tier;return {state,quota:quota(state),mode:'local-prototype'};
 }
 if(path==='/api/v3/preferences'){
  const p=body.preferences;requireValue(p&&['new','some','experienced'].includes(p.experience)&&['consistency','strength','skills'].includes(p.goal),'Preferensi tidak valid.');
  requireValue(Number.isInteger(p.frequency)&&p.frequency>=1&&p.frequency<=7,'Frekuensi harus 1–7 hari.');
  requireValue(Array.isArray(p.skills)&&p.skills.length<=4&&p.skills.every((id:string)=>['l-sit','handstand','elbow-lever','front-lever'].includes(id)),'Pilihan skill tidak valid.');
  requireValue(Array.isArray(p.equipment)&&p.equipment.every((id:string)=>['floor','wall','bar','parallettes','support'].includes(id)),'Pilihan alat tidak valid.');
  new Intl.DateTimeFormat('en-US',{timeZone:p.timeZone||'Asia/Jakarta'}).format();
  const timeMinutes=p.timeMinutes??15;requireValue([10,15,20,30,45,60].includes(timeMinutes),'Waktu sesi tidak valid.');
  const assessment=p.assessment??{plank:'unknown',pushups:'unknown'};requireValue(assessment&&['unknown','under15','15to30','over30'].includes(assessment.plank)&&['unknown','0to4','5to10','over10'].includes(assessment.pushups),'Asesmen tidak valid.');
  state.preferences={timeMinutes,assessment:{plank:assessment.plank,pushups:assessment.pushups},experience:p.experience,goal:p.goal,skills:[...new Set(p.skills)] as string[],equipment:[...new Set(['floor',...p.equipment])] as string[],frequency:p.frequency,onboarded:true,timeZone:p.timeZone||'Asia/Jakarta'};return {state};
 }
 if(path==='/api/v3/schedule'){
  requireValue(Array.isArray(body.days)&&body.days.every((d:number)=>Number.isInteger(d)&&d>=0&&d<=6),'Hari jadwal tidak valid.');requireValue(/^([01]\d|2[0-3]):[0-5]\d$/.test(body.time),'Jam tidak valid.');state.schedule={days:[...new Set(body.days)] as number[],time:body.time};return {state};
 }
 if(path==='/api/v3/routines'){
  const existing=body.id?state.routines.find(r=>r.id===body.id):undefined;
  if(body.id)requireValue(existing,'Rutinitas tidak ditemukan pada akun ini.');
  if(body.action==='delete'){requireValue(existing,'Rutinitas tidak ditemukan.');requireValue(!state.leases[existing!.id],'Sesi masih aktif. Selesaikan atau batalkan draft sebelum menghapus.');state.routines=state.routines.filter(r=>r.id!==existing!.id);return {state};}
  assertRoutineLimit(state.testTier,state.routines.length,!!existing);
  requireValue(typeof body.nama==='string'&&body.nama.trim().length>=2&&body.nama.length<=80,'Nama rutinitas harus 2–80 karakter.');
  requireValue(Array.isArray(body.exercises)&&body.exercises.length>=1&&body.exercises.length<=15,'Pilih 1–15 gerakan.');
  const exercises=body.exercises.map((item:any)=>{
   const exercise=SEED_EXERCISES.find(e=>e.id===item.exerciseId);requireValue(exercise,'Gerakan tidak dikenal.');
   requireValue(!isProExercise(item.exerciseId)||state.testTier==='pro','Gerakan Front Lever memerlukan Pro.');
   const unit=exercise!.isTimeBased?'detik':'reps';
   requireValue(item.unit===unit,'Satuan gerakan tidak sesuai.');
   requireValue(Number.isInteger(item.sets)&&item.sets>=1&&item.sets<=10,'Set harus 1–10.');
   requireValue(Number.isInteger(item.target)&&item.target>=1&&item.target<=(unit==='detik'?600:100),'Target di luar rentang.');
   requireValue(Number.isInteger(item.istirahatDetik)&&item.istirahatDetik>=0&&item.istirahatDetik<=600,'Istirahat harus 0–600 detik.');
   return {exerciseId:exercise!.id,exerciseName:exercise!.nama,sets:item.sets,target:item.target,unit,isIsometric:unit==='detik',istirahatDetik:item.istirahatDetik};
  });
  requireValue(new Set(exercises.map((e:any)=>e.exerciseId)).size===exercises.length,'Gunakan satu entri per gerakan; atur jumlah setnya.');
  const now=new Date().toISOString();const routine:Routine={id:existing?.id||`custom_${crypto.randomUUID()}`,custom:true,nama:body.nama.trim(),fokus:'Kustom',durasiMenit:Math.max(1,Math.round(exercises.reduce((n:number,e:any)=>n+e.sets*((e.unit==='detik'?e.target:e.target*3)+e.istirahatDetik),0)/60)),exercises,createdAt:existing?.createdAt||now,updatedAt:now};
  if(existing)state.routines=state.routines.map(r=>r.id===routine.id?routine:r);else state.routines.push(routine);
  return {state,routine};
 }
 if(path==='/api/v3/start'){
  const session=resolveSession(profile,body.sessionId);requireValue(session,'Sesi tidak ditemukan.');
  requireValue(canTrain(session!,state.testTier),'Sesi spesialis memerlukan Pro.');
  if(session!.skillId&&session!.stageNumber)requireValue(session!.stageNumber<=(profile.skills.find((s:any)=>s.skillId===session!.skillId)?.currentStage||1),'Tahap belum terbuka.');
  state.leases[session!.id]=new Date(Date.now()+24*60*60*1000).toISOString();return {session};
 }
 if(path==='/api/v3/cancel'){delete state.leases[body.sessionId];return {state};}
 if(path==='/api/v3/form-check'){
  requireValue(Number.isFinite(body.duration)&&body.duration>0&&body.duration<=30,'Video maksimal 30 detik.');
  requireValue(SEED_EXERCISES.some(e=>e.id===body.exerciseId),'Pilih gerakan yang terdaftar.');
  requireValue(quota(state).remaining>0,'Kuota bulan ini habis.');
  return {unavailable:true,error:'AI Form Check belum terhubung ke layanan analisis tervalidasi. Video tidak diunggah dan kuota tidak dipakai.'};
 }
 throw Error('Endpoint tidak ditemukan.');
}

// Restore data without importing a test tier or resetting service usage.
export function restoreProduct(profile:any,snapshot:any){
 const previous=productFor(profile);
 const staged={skills:profile.skills,product:{...emptyProduct(),testTier:'pro' as const}};
 if(!snapshot||typeof snapshot!=='object')return previous;
 if(previous.testTier==='free'&&Array.isArray(snapshot.routines)&&snapshot.routines.length>1){requireValue(snapshot.routines.length<=previous.routines.length&&snapshot.routines.every((r:any)=>previous.routines.some(old=>old.id===r.id)),'Free tidak dapat mengimpor lebih dari 1 rutinitas baru.');}
 if(snapshot.preferences)productRequest(staged,'/api/v3/preferences',{preferences:snapshot.preferences},true);
 if(snapshot.schedule)productRequest(staged,'/api/v3/schedule',snapshot.schedule,true);
 requireValue(Array.isArray(snapshot.routines)&&snapshot.routines.length<=1000,'Rutinitas cadangan tidak valid.');
 const seen=new Set();
 for(const item of snapshot.routines){requireValue(typeof item.id==='string'&&/^custom_[a-z0-9-]+$/i.test(item.id)&&!seen.has(item.id),'ID rutinitas cadangan tidak valid.');seen.add(item.id);const result=productRequest(staged,'/api/v3/routines',{nama:item.nama,exercises:item.exercises},true);result.routine!.id=item.id;}
 return {...staged.product,testTier:previous.testTier,usage:previous.usage,leases:previous.leases};
}
