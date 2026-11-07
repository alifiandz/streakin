import type {WorkoutSession} from '../lib/seedData';
export const guidedTimes=[5,10,15,20,30,45,60];
export function guidedInfo(id:string){
 const m=/^guided_(l-sit|handstand|elbow-lever|front-lever|planche|muscle-up|foundation)_([1-5])_(5|10|15|20|30|45|60)$/.exec(id);if(!m)return null;
 return {skillId:m[1],stage:Number(m[2]),minutes:Number(m[3]),warmupSec:['handstand','front-lever','planche','muscle-up'].includes(m[1])?120:60,cooldownSec:30};
}
export function guidedId(skillId:string,stage:number,minutes:number){return `guided_${skillId}_${stage}_${minutes}`;}
export function createGuidedSessions(sessions:WorkoutSession[]):WorkoutSession[]{
 const sources=sessions.filter(s=>s.skillId&&s.stageNumber&&!s.id.startsWith('guided_'));const foundation=sessions.find(s=>s.id==='s_quick_core_5');if(foundation)sources.push(foundation);
 return sources.flatMap(source=>guidedTimes.flatMap(minutes=>{
  const skillId=source.skillId||'foundation',stage=source.stageNumber||1,id=guidedId(skillId,stage,minutes);const info=guidedInfo(id)!;
  let remaining=minutes*60-info.warmupSec-info.cooldownSec;
  const exercises:WorkoutSession['exercises']=[];
  // Retain the original targets/rest and stage; fit complete sets into the chosen time budget.
  for(const item of source.exercises){const seconds=(item.unit==='detik'?item.target:item.target*3)+item.istirahatDetik+15;const sets=Math.min(item.sets,Math.floor(remaining/seconds));if(!sets)continue;exercises.push({...item,sets});remaining-=sets*seconds;}
  if(!exercises.length||exercises[0].exerciseId!==source.exercises[0].exerciseId)return [];
  return [{...source,id,nama:`${source.skillId?source.nama.split(':')[0]:'Fondasi inti'} · panduan ${minutes} menit`,durasiMenit:minutes,exercises}];
 }));
}
