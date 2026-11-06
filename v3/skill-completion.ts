import type {WorkoutSession,WorkoutLog} from '../src/types';
// Numerical evidence only: technique is always explicitly confirmed by the user.
export function hasStageEvidence(session:WorkoutSession|undefined,logs:WorkoutLog[]){
 if(!session)return false;
 const primary=session.exercises[0];
 return logs.some(l=>l.sessionId===session.id&&l.setsCompleted.filter(s=>s.exerciseId===primary.exerciseId&&s.selesai&&s.nilai>=primary.target).length>=primary.sets);
}
