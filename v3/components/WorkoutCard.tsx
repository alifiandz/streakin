import React from 'react';
import Link from 'next/link';
import {ArrowRight,Clock,Layers} from 'lucide-react';
import type {WorkoutSession} from '@/src/types';
import {SEED_EXERCISES} from '../catalog';
import {workoutMeta,equipmentLabels,missingEquipment} from '../training-meta';
export function WorkoutCard({session,availableEquipment,children}:{session:WorkoutSession;availableEquipment:string[];children?:React.ReactNode}){
 const meta=workoutMeta(session);const missing=missingEquipment(session,availableEquipment);
 return <article className="workout-session-card" data-workout-id={session.id}>
  <div className="session-card-heading"><span className="session-category">{meta.short}</span><span className="session-difficulty">{meta.difficulty}</span></div>
  <h2>{session.nama}</h2><p className="session-goal">{meta.goal}</p>
  <div className="workout-facts"><span><Clock className="w-3.5 h-3.5"/>{session.durasiMenit} menit</span><span><Layers className="w-3.5 h-3.5"/>{meta.sets} set</span><span>{meta.moves} gerakan</span></div>
  <ol className="session-exercise-preview">{session.exercises.slice(0,3).map((se,i)=>{const ex=SEED_EXERCISES.find(e=>e.id===se.exerciseId);return <li key={se.exerciseId}>{ex?.imageUrl?<img src={ex.imageUrl} alt={ex.nama} loading="lazy"/>:<span className="move-number">{i+1}</span>}<div><strong>{ex?.nama||se.exerciseName}</strong><span>{se.sets} × {se.target} {se.unit==='detik'?'dtk':'reps'}</span></div></li>;})}{session.exercises.length>3&&<li className="session-more-moves">+{session.exercises.length-3} gerakan di tinjauan sesi</li>}</ol>
  <div className="session-gear"><span>Peralatan</span><p>{meta.equipment.map(id=>equipmentLabels[id]).join(' · ')}</p>{missing.length>0&&<small>Belum dipilih di profil: {missing.map(id=>equipmentLabels[id]).join(', ')}</small>}</div>
  <div className="session-card-actions"><Link href={`/workouts/${session.id}`} className="v3-button secondary">Tinjau sesi <ArrowRight className="w-4 h-4"/></Link>{children}</div>
 </article>;
}
