import { productFor, productRequest, resolveSession, restoreProduct } from '../v3/api';
import {guidedInfo} from '../v3/guided-training';
import { canTrain,isProSkill } from '../v3/model';
import { SEED_SESSIONS, SEED_SKILLS } from '../v3/catalog';
import { getLocalDateString } from '../src/utils/storage';
const nativeFetch=window.fetch.bind(window);export const KEY='streakin_training_v2';
type Profile={id:string;nama:string;email:string;salt:string;verifier:string;library:any;skills:any[];logs:any[];demoSeedVersion?:number};
type DB={version:2;active:string|null;profiles:Profile[]};
function read():DB{
 const raw=localStorage.getItem(KEY);if(!raw)return {version:2,active:null,profiles:[]};
 const d=JSON.parse(raw);if(d.version!==2||!Array.isArray(d.profiles))throw Error('Data lokal tidak valid. Pulihkan dari cadangan.');
 const profiles=d.profiles.filter((p:any)=>p&&typeof p.id==='string').map((p:any)=>{
  const library=p.library&&typeof p.library==='object'?{...p.library,durasi:Array.isArray(p.library.durasi)?p.library.durasi.map(Number).filter(Number.isFinite):[],fokus:Array.isArray(p.library.fokus)?p.library.fokus.filter((x:any)=>typeof x==='string'):[],sessionIds:Array.isArray(p.library.sessionIds)?p.library.sessionIds.filter((id:any)=>typeof id==='string'&&SEED_SESSIONS.some(s=>s.id===id)):[]}:null;
  const skills=(Array.isArray(p.skills)?p.skills:[]).filter((x:any)=>x&&typeof x.skillId==='string'&&SEED_SKILLS.some(s=>s.id===x.skillId)).map((x:any)=>({...x,currentStage:Math.max(1,Math.min(5,Math.floor(Number(x.currentStage)||1))),bestHoldSec:Math.max(0,Number(x.bestHoldSec)||0),completedAt:x.currentStage===5&&typeof x.completedAt==='string'&&Number.isFinite(Date.parse(x.completedAt))?x.completedAt:undefined}));
  const logs=(Array.isArray(p.logs)?p.logs:[]).filter((x:any)=>x&&typeof x.id==='string').map((x:any)=>({...x,sets:(Array.isArray(x.sets)?x.sets:Array.isArray(x.setsCompleted)?x.setsCompleted:[]).filter((set:any)=>set&&typeof set.exerciseId==='string').map((set:any)=>({...set,valueLogged:Number(set.valueLogged??set.nilai)||0}))}));
  return {...p,nama:typeof p.nama==='string'?p.nama:'Kawan',email:typeof p.email==='string'?p.email:'',library,skills,logs};
 });
 const cleaned={version:2 as const,active:typeof d.active==='string'?d.active:null,profiles};
 if(JSON.stringify(cleaned)!==raw){try{if(!localStorage.getItem(KEY+'_recovery_snapshot'))localStorage.setItem(KEY+'_recovery_snapshot',raw)}catch{}}
 return cleaned;
}
function save(d:DB){localStorage.setItem(KEY,JSON.stringify(d))}
function reply(data:any,status=200){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}})}
const pub=(p:Profile)=>({id:p.id,nama:p.nama,email:p.email});
const hex=(b:ArrayBuffer)=>Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join('');
async function password(value:string,salt:string){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(value),'PBKDF2',false,['deriveBits']);return hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:210000,hash:'SHA-256'},key,256))}
function ensure(v:any,msg:string){if(!v)throw Error(msg)}
window.fetch=(async(input:RequestInfo|URL,options?:RequestInit)=>{const url=typeof input==='string'?input:input instanceof URL?input.pathname:input.url;if(!url.startsWith('/api/'))return nativeFetch(input,options);try{const db=read();const b=JSON.parse(String(options?.body||'{}'));const post=options?.method==='POST';let user=db.profiles.find(p=>p.id===db.active);
if(url==='/api/auth/me')return user?reply({success:true,user:pub(user)}):reply({success:false},401);
if(url==='/api/auth/logout'){db.active=null;save(db);return reply({success:true})}
if(url==='/api/auth/register'||url==='/api/auth/login'){
 const email=String(b.email||'').trim().toLowerCase(),pass=String(b.kataSandi||'');ensure(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),'Format email tidak valid.');
 let p=db.profiles.find(x=>x.email===email);
 if(url.endsWith('register')){ensure(String(b.nama||'').trim().length>0,'Nama wajib diisi.');ensure(pass.length>=8,'Kata sandi minimal 8 karakter.');ensure(!p,'Email sudah terdaftar di perangkat ini.');const salt=crypto.randomUUID();p={id:crypto.randomUUID(),nama:String(b.nama).trim().slice(0,80),email,salt,verifier:await password(pass,salt),library:null,skills:[],logs:[]};db.profiles.push(p)}else{
 if(!p&&email==='rizky@sma11.sch.id'&&pass==='rahasia123'){const salt=crypto.randomUUID();p={id:'usr_demo_1',nama:'Rizky',email,salt,verifier:await password(pass,salt),library:null,skills:[],logs:[]};db.profiles.push(p)}
 ensure(p&&await password(pass,p.salt)===p.verifier,'Email atau kata sandi salah. Akun perangkat lain memerlukan pemulihan cadangan.');}
 const legacy=localStorage.getItem('streakin_friend_prototype_data_v1');if(legacy&&!p!.logs.length&&!p!.library){try{const old=JSON.parse(legacy);if(old.user?.email===email){p!.logs=old.logs||[];p!.skills=old.skills||[];p!.library=old.library||null}}catch{}}db.active=p!.id;save(db);return reply({success:true,user:pub(p!)})}
if(!user)return reply({success:false,error:'Masuk terlebih dahulu.'},401);
if(url.startsWith('/api/v3/')){const data=productRequest(user,url,b,post);if(post)save(db);return reply({success:!data.unavailable,...data},data.unavailable?503:200)}
if(url==='/api/backup'){
 if(post){ensure(['streakin-backup-v1','streakin-backup-v2'].includes(b.format)&&Array.isArray(b.logs)&&Array.isArray(b.skills),'Format cadangan tidak valid.');ensure(b.logs.length<=10000,'Cadangan terlalu besar.');ensure(b.logs.every((l:any)=>l.id&&l.sessionId&&Array.isArray(l.sets)&&l.sets.every((s:any)=>Number.isFinite(s.valueLogged)&&s.valueLogged>0)),'Riwayat cadangan tidak valid.');ensure(b.skills.every((s:any)=>SEED_SKILLS.some(k=>k.id===s.skillId)&&Number.isInteger(s.currentStage)&&s.currentStage>=1&&s.currentStage<=5),'Progres cadangan tidak valid.');ensure(!b.library||(Array.isArray(b.library.sessionIds)&&b.library.sessionIds.every((id:string)=>SEED_SESSIONS.some(s=>s.id===id))),'Library cadangan tidak valid.');user.logs=b.logs.map((l:any)=>({...l,userId:user!.id}));user.skills=b.skills.map((s:any)=>({...s,userId:user!.id}));user.library=b.library?{...b.library,userId:user.id}:null;if(b.product)(user as any).product=restoreProduct(user,b.product);save(db);return reply({success:true})}
 return reply({success:true,data:{format:'streakin-backup-v2',exportedAt:new Date().toISOString(),library:user.library,skills:user.skills,logs:user.logs,product:{preferences:productFor(user).preferences,routines:productFor(user).routines,schedule:productFor(user).schedule}}})}
if(url==='/api/library'){if(post){ensure(Array.isArray(b.sessionIds)&&b.sessionIds.length>0,'Pilih minimal satu sesi.');ensure(b.sessionIds.every((id:string)=>SEED_SESSIONS.some(s=>s.id===id)),'Sesi tidak dikenal.');user.library={userId:user.id,durasi:b.durasi||[],fokus:b.fokus||[],sessionIds:[...new Set(b.sessionIds)]};save(db)}return reply({success:true,data:user.library})}
if(url==='/api/skills/progress'){
 if(post){
  ensure(!isProSkill(b.skillId)||productFor(user).testTier==='pro','Roadmap spesialis memerlukan Pro.');ensure(SEED_SKILLS.some(s=>s.id===b.skillId),'Skill tidak dikenal.');
  const old=user.skills.find(x=>x.skillId===b.skillId);const n=b.currentStage??old?.currentStage??1;
  ensure(Number.isInteger(n)&&n>=1&&n<=5&&n<=(old?.currentStage??1)+1,'Naik satu tahap setelah memenuhi kriteria.');
  let completedAt=old?.completedAt;
  if(b.action==='complete'){
   ensure(old?.currentStage===5&&n===5&&b.confirmed===true,'Tuntaskan tahap terakhir dan konfirmasi kontrol teknik.');
   const final=SEED_SESSIONS.find(s=>s.skillId===b.skillId&&s.stageNumber===5);const target=final?.exercises[0];
   ensure(final&&target&&user.logs.some(l=>!String(l.id).startsWith('demo-session-')&&(l.sessionId===final.id||guidedInfo(l.sessionId)?.skillId===final.skillId&&guidedInfo(l.sessionId)?.stage===5)&&l.sets.filter((x:any)=>x.exerciseId===target.exerciseId&&x.valueLogged>=target.target).length>=target.sets),'Catat satu sesi tahap terakhir yang mencapai target utama sebelum menyelesaikan jalur.');
   completedAt=completedAt||new Date().toISOString();
  }else if(b.action==='reopen'||n<5)completedAt=undefined;
  else ensure(!b.action,'Aksi progres tidak dikenal.');
  const next={userId:user.id,skillId:b.skillId,currentStage:n,bestHoldSec:old?.bestHoldSec||0,completedAt};if(old)Object.assign(old,next);else user.skills.push(next);save(db);
 }
 return reply({success:true,data:user.skills});
}
if(url==='/api/workout-logs'){if(post){const prior=user.logs.find(l=>typeof b.completionKey==='string'&&l.completionKey===b.completionKey);if(prior)return reply({success:true,data:prior});const session=resolveSession(user,b.sessionId);ensure(session,'Sesi tidak dikenal.');ensure(canTrain(session!,productFor(user).testTier)||!!productFor(user).leases[session!.id],'Sesi spesialis memerlukan Pro sebelum latihan dimulai.');ensure(Array.isArray(b.sets)&&b.sets.length>0,'Catat minimal satu set.');ensure(Number.isFinite(b.durasiDetik)&&b.durasiDetik>0,'Durasi tidak valid.');for(const set of b.sets){const target=session!.exercises.find(e=>e.exerciseId===set.exerciseId);ensure(target&&Number.isInteger(set.noSet)&&set.noSet>=1&&set.noSet<=target.sets,'Set tidak valid.');ensure(Number.isFinite(set.valueLogged)&&set.valueLogged>0&&set.valueLogged<=3600&&(target!.unit==='detik'||Number.isInteger(set.valueLogged)),'Nilai set harus 1–3600; repetisi harus bilangan bulat.');set.isIsometric=target!.unit==='detik';}
 ensure(!session!.stageNumber || session!.stageNumber<=(user.skills.find(s=>s.skillId===session!.skillId)?.currentStage||1),'Tahap belum terbuka.');ensure(b.sets.length===session!.exercises.reduce((n,e)=>n+e.sets,0),'Selesaikan semua set sesi ini.');ensure(typeof b.completionKey==='string'&&b.completionKey.length>0,'Identitas penyelesaian wajib.');const unique=new Set(b.sets.map((s:any)=>s.exerciseId+':'+s.noSet));ensure(unique.size===b.sets.length,'Set duplikat.');const existing=user.logs.find(l=>b.completionKey&&l.completionKey===b.completionKey);if(existing)return reply({success:true,data:existing});
 const log={...b,skillFocus:session!.skillId||null,id:crypto.randomUUID(),userId:user.id,localDate:getLocalDateString(),completedAt:new Date().toISOString(),streakCount:0};user.logs.unshift(log);delete productFor(user).leases[session!.id];
 const skillExercises:Record<string,string[]>={'l-sit':['ex1','ex2','ex11','ex12','ex13'],'handstand':['ex3','ex4','ex14','ex15','ex16'],'elbow-lever':['ex17','ex18','ex19','ex20','ex21'],'front-lever':['fl_1','fl_2','fl_3','fl_4','fl_5'],planche:['pl_1','pl_2','pl_3','pl_4','pl_5'],'muscle-up':['mu_1','mu_2','mu_3','mu_4','mu_5']};const primary=session!.exercises.find(e=>skillExercises[session!.skillId||'']?.includes(e.exerciseId));if(session!.skillId&&primary?.unit==='detik'){const best=Math.max(0,...b.sets.filter((s:any)=>s.exerciseId===primary.exerciseId).map((s:any)=>s.valueLogged));let progress=user.skills.find(s=>s.skillId===session!.skillId);if(!progress){progress={userId:user.id,skillId:session!.skillId,currentStage:1,bestHoldSec:0};user.skills.push(progress)}progress.bestHoldSec=Math.max(progress.bestHoldSec,best)}save(db);return reply({success:true,data:log})}return reply({success:true,data:user.logs})}
return reply({success:false,error:'Endpoint tidak tersedia.'},404)
}catch(e){return reply({success:false,error:e instanceof Error?e.message:'Penyimpanan gagal.'},400)}}) as typeof fetch;
