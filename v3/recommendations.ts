import type {WorkoutSession,WorkoutLog} from '../src/types';
import type {ProductState} from './model';
import {canTrain,presetIds,quickSessionIds} from './model';
import {missingEquipment} from './training-meta';
export interface Recommendation {session:WorkoutSession;reason:string;score:number;repeat:boolean;}
// One deterministic policy for Home and the weekly plan; never changes targets or unlocks stages.
export function recommendWorkouts({sessions,state,logs,stageFor,savedIds=[]}:{sessions:WorkoutSession[];state:ProductState;logs:WorkoutLog[];stageFor:(id:string)=>number;savedIds?:string[]}):Recommendation[]{
 const p=state.preferences;const minutes=p.timeMinutes||15;const ordered=[...logs].sort((a,b)=>b.tanggal.localeCompare(a.tanggal));const latest=ordered[0];
 const ranked=sessions.filter(s=>canTrain(s,state.testTier)&&missingEquipment(s,p.equipment).length===0&&s.durasiMenit<=minutes&&(!s.skillId||s.stageNumber===stageFor(s.skillId))&&(presetIds.includes(s.id)||(minutes===5&&quickSessionIds.includes(s.id))||savedIds.includes(s.id)||(s.skillId&&p.skills.includes(s.skillId)))&&!(s.skillId==='front-lever'&&p.experience==='new')&&!(s.skillId&&p.assessment?.plank==='under15')&&!(s.exercises.some(e=>e.exerciseId==='ex7')&&p.assessment?.pushups==='0to4')).map(session=>{
  const record=ordered.find(l=>l.sessionId===session.id);const meetsTargets=!!record&&session.exercises.every(e=>record.setsCompleted.filter(s=>s.exerciseId===e.exerciseId&&s.nilai>=e.target).length>=e.sets);
  const repeat=state.testTier==='pro'&&!!record&&!meetsTargets&&record===latest;
  const score=(savedIds.includes(session.id)?12:0)+(session.skillId&&p.skills.includes(session.skillId)?p.goal==='skills'?30:8:0)+(p.goal==='consistency'?20-session.durasiMenit:0)+(repeat?35:0)-(latest?.sessionId===session.id&&!repeat?10:0);
  const reason=[session.skillId?'Mengikuti tahap aktif skill pilihanmu.':'Fondasi yang sesuai pilihan alatmu.',`Sekitar ${session.durasiMenit} menit, dalam waktu ${minutes} menit yang kamu pilih.`,p.assessment?.plank==='under15'||p.assessment?.pushups==='0to4'?'Pilihan lebih konservatif berdasarkan laporan kemampuanmu.':'Tahap tidak dinaikkan otomatis.',repeat?'Hasil sesi terakhir belum mencapai semua target. Ulangi dengan kontrol sebelum menambah kesulitan.':latest?.sessionId!==session.id&&logs.length?'Variasi dari sesi terakhir yang tercatat.':'Mulai dari variasi yang bisa kamu kontrol.'].join(' ');
  return {session,score,reason,repeat};
 });
 return ranked.sort((a,b)=>b.score-a.score||a.session.durasiMenit-b.session.durasiMenit||a.session.id.localeCompare(b.session.id));
}
