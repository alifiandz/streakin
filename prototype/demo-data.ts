import {SEED_SESSIONS} from '../lib/seedData';
import {getLocalDateString} from '../src/utils/storage';

// Illustrative history belongs only to the explicit Rizky demo account.
export function createDemoTraining(userId:string) {
 const sessions=['s1','s_lsit_2','s_handstand_1','s2','s_legs_10','s_lsit_1'];
 const offsets=[0,1,2,4,6,8,10,12,14,17,20,24];
 const logs=offsets.map((offset,index)=>{
  const session=SEED_SESSIONS.find(s=>s.id===sessions[index%sessions.length])!;
  const date=new Date();date.setHours(16,0,0,0);date.setDate(date.getDate()-offset);
  return {id:`demo-session-${index}`,userId,sessionId:session.id,sessionName:session.nama,skillFocus:session.skillId||null,localDate:getLocalDateString(date),completedAt:date.toISOString(),durasiDetik:session.durasiMenit*60,completionKey:`demo-seed-${index}`,sets:session.exercises.flatMap(ex=>Array.from({length:ex.sets},(_,i)=>({exerciseId:ex.exerciseId,exerciseName:ex.exerciseName,noSet:i+1,valueLogged:ex.target,isIsometric:ex.unit==='detik'})))};
 });
 return {demoSeedVersion:1,library:{userId,durasi:[10,15,20],fokus:['Push','Skill Mastery'],sessionIds:['s1','s_lsit_2','s_handstand_1','s2','s_legs_10']},skills:[{userId,skillId:'l-sit',currentStage:2,bestHoldSec:30},{userId,skillId:'handstand',currentStage:1,bestHoldSec:30},{userId,skillId:'elbow-lever',currentStage:1,bestHoldSec:0}],logs};
}
