import {SEED_SESSIONS,SEED_EXERCISES} from '../v3/catalog';
import {emptyProduct} from '../v3/model';
import {getLocalDateString} from '../src/utils/storage';

export const DEMO_USER_ID='usr_demo_1';
export const DEMO_SEED_VERSION=2;
export function isDemoProfile(profile:{id:string;email:string;authProvider?:string}){
 return profile.id===DEMO_USER_ID&&profile.email==='rizky@sma11.sch.id'&&!profile.authProvider;
}

// Explicit sample records for the designated demo account only, never real accounts.
export function createDemoTraining(userId:string,now=new Date()) {
 const ids=['s_lsit_3','s1','s_handstand_2','s2','s_elbowlever_2','s_legs_10','s4','s_core_15','s5','s_legs_20','s_mobility_10','s_quick_core_5'];
 const offsets=[0,1,2,3,5,7,8,10,11,13,14,16,17,19,20,22,23,25,26,28,29,31,32,34,35,37,38,40];
 const logs=offsets.map((offset,index)=>{
  const session=SEED_SESSIONS.find(s=>s.id===ids[index%ids.length])||SEED_SESSIONS.find(s=>s.id==='s1')!;
  const date=new Date(now);date.setHours(16,0,0,0);date.setDate(date.getDate()-offset);
  if(date>now)date.setTime(now.getTime());
  const factor=1-Math.min(.28,offset*.006);
  return {id:`demo-session-v2-${index}`,sample:true,userId,sessionId:session.id,sessionName:session.nama,skillFocus:session.skillId||null,localDate:getLocalDateString(date),completedAt:date.toISOString(),durasiDetik:Math.round(session.durasiMenit*60*(.9+(index%3)*.05)),completionKey:`demo-seed-v2-${index}`,sets:session.exercises.flatMap(ex=>Array.from({length:ex.sets},(_,i)=>({exerciseId:ex.exerciseId,exerciseName:ex.exerciseName||SEED_EXERCISES.find(e=>e.id===ex.exerciseId)?.nama||ex.exerciseId,noSet:i+1,valueLogged:Math.max(1,Math.round(ex.target*factor)-(i===ex.sets-1&&index%4===0?1:0)),isIsometric:ex.unit==='detik'})))};
 });
 const product=emptyProduct();
 product.preferences={...product.preferences,experience:'some',goal:'skills',skills:['l-sit','handstand','elbow-lever'],equipment:['floor','wall','support','parallettes','bar','mat'],frequency:4,timeMinutes:15,onboarded:true,assessment:{plank:'over30',pushups:'5to10'}};
 product.schedule={days:[1,2,4,6],time:'16:30'};
 const core=SEED_SESSIONS.find(s=>s.id==='s2')!;
 product.routines=[{...core,id:'custom_demo-core',nama:'Core sepulang sekolah · contoh',custom:true,createdAt:now.toISOString(),updatedAt:now.toISOString(),exercises:core.exercises.map(e=>({...e}))}];
 return {demoSeedVersion:DEMO_SEED_VERSION,library:{userId,durasi:[5,10,15,20],fokus:['Push','Legs','Skill Mastery'],sessionIds:['s1','s_lsit_3','s_handstand_2','s2','s_legs_10','s4','s_core_15','s_mobility_10','s_quick_core_5']},skills:[{userId,skillId:'l-sit',currentStage:3,bestHoldSec:25},{userId,skillId:'handstand',currentStage:2,bestHoldSec:35},{userId,skillId:'elbow-lever',currentStage:2,bestHoldSec:20}],logs,product};
}
export function seedDemoProfile(profile:any,now=new Date()){
 if(!isDemoProfile(profile)||(profile.demoSeedVersion>=DEMO_SEED_VERSION&&profile.demoSeedDate===getLocalDateString(now)))return false;
 const samples=createDemoTraining(profile.id,now);
 profile.logs=[...(profile.logs||[]).filter((l:any)=>!String(l.id).startsWith('demo-session-')),...samples.logs].sort((a,b)=>String(b.completedAt||'').localeCompare(String(a.completedAt||'')));
 // Seed defaults without replacing any choices, custom routines or milestones already saved.
 if(!profile.library)profile.library=samples.library;
 const skills=profile.skills||(profile.skills=[]);for(const skill of samples.skills)if(!skills.some((s:any)=>s.skillId===skill.skillId))skills.push(skill);
 if(!profile.product)profile.product=samples.product;
 else {
  if(!profile.product.preferences?.onboarded)profile.product.preferences=samples.product.preferences;
  if(!profile.product.routines?.length)profile.product.routines=samples.product.routines;
  if(!profile.product.schedule?.days?.length)profile.product.schedule=samples.product.schedule;
 }
 profile.demoSeedVersion=DEMO_SEED_VERSION;
 profile.demoSeedDate=getLocalDateString(now);
 return true;
}
