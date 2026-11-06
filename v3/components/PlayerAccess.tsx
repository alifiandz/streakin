import React,{useEffect,useState} from 'react';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {useWorkout} from '@/context/WorkoutContext';
import {useProduct} from '../ProductContext';
import {canTrain} from '../model';
import {Page,Message,ProPrompt} from './UI';
import Player from '@/app/latihan/[sessionId]/page';
export function PlayerAccess(){
 const {sessionId}=useParams();const {getSessionById,activeWorkout}=useWorkout();const {state,request}=useProduct();const session=getSessionById(sessionId||'');const [ready,setReady]=useState(false);const [error,setError]=useState('');
 const resumed=activeWorkout?.sessionId===sessionId;const allowed=!!session&&canTrain(session,state.testTier);
 useEffect(()=>{let cancelled=false;if(resumed){setReady(true);return;}if(!allowed||!session)return;request('start',{sessionId:session.id}).then(()=>{if(!cancelled)setReady(true);}).catch(e=>{if(!cancelled)setError(e.message);});return()=>{cancelled=true};},[sessionId,resumed,allowed]);
 if(activeWorkout&&!resumed)return <Page title="Selesaikan atau lanjutkan sesi aktif"><Link href={`/latihan/${activeWorkout.sessionId}`} className="v3-button">Lanjutkan sesi tersimpan</Link><Link href="/workouts" className="v3-text-link ml-4">Kelola draft →</Link></Page>;
 if(!session)return <Page title="Sesi belum tersedia"><Link href="/skills" className="v3-text-link">Kembali ke jalur progresi</Link></Page>;
 if(!resumed&&!allowed)return <Page title="Sesi spesialis"><ProPrompt title="Latihan ini termasuk Pro" description="Lihat perbandingan paket untuk akses spesialis. Timer dan sesi dasar tetap gratis."/></Page>;
 if(error)return <Page title="Sesi belum dimulai"><Message error>{error}</Message><Link href={`/workouts/${sessionId}`} className="v3-text-link">Kembali ke tinjauan</Link></Page>;
 return ready?<Player/>:<Page title="Menyiapkan sesi…"><p role="status">Memeriksa tahap dan akses latihan.</p></Page>;
}
