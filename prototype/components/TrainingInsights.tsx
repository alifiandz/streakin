import React from 'react';
import {Flame,Timer,CheckCircle2,Layers} from 'lucide-react';
import {useAuth} from '@/context/AuthContext';
import {getLocalDateString} from '@/src/utils/storage';
import type {WorkoutLog} from '@/src/types';

export function DemoNotice(){
 const {currentUser}=useAuth();
 return currentUser?.id==='usr_demo_1'?<p className="demo-notice"><span>DEMO</span>Data contoh untuk menjelajahi StreakIn. Aktivitas di akun ini adalah simulasi.</p>:null;
}
export function TrainingStats({logs,streak}:{logs:WorkoutLog[];streak:number}){
 const minutes=Math.round(logs.reduce((n,l)=>n+l.durasiDetik,0)/60);
 const sets=logs.reduce((n,l)=>n+l.setsCompleted.length,0);
 const values=[[Flame,`${streak}`,'Hari streak'],[CheckCircle2,`${logs.length}`,'Sesi selesai'],[Timer,`${minutes}`,'Menit latihan'],[Layers,`${sets}`,'Set tercatat']] as const;
 return <div className="training-stats" aria-label="Ringkasan latihan">{values.map(([Icon,value,label])=><div key={label} className="card-surface p-3 sm:p-4 border-[#2E3238]"><Icon className="w-4 h-4 text-[#FF7A03] mb-3"/><p className="font-extrabold text-2xl sm:text-3xl">{value}</p><p className="text-[11px] text-[#8A929C] mt-1">{label}</p></div>)}</div>;
}
export function ActivityChart({logs}:{logs:WorkoutLog[]}){
 const days=Array.from({length:7},(_,i)=>{const date=new Date();date.setDate(date.getDate()-6+i);const key=getLocalDateString(date);return {key,label:date.toLocaleDateString('id-ID',{weekday:'short'}),minutes:Math.round(logs.filter(l=>l.tanggal===key).reduce((n,l)=>n+l.durasiDetik,0)/60)};});
 const max=Math.max(30,...days.map(d=>d.minutes));
 const total=days.reduce((n,d)=>n+d.minutes,0);
 return <figure aria-label="Durasi latihan tujuh hari terakhir">
  <div className="flex justify-between items-start gap-3 mb-4"><figcaption><h2 className="font-bold text-sm sm:text-base">Ritme minggu ini</h2><p className="text-xs text-[#8A929C] mt-1">7 hari terakhir · menit per hari</p></figcaption><strong className="text-xl text-[#FF7A03]">{total}<span className="text-[10px] font-normal text-[#8A929C] block text-right">menit</span></strong></div>
  <ol className="activity-chart">{days.map(d=><li key={d.key} title={`${d.key}: ${d.minutes} menit`}><span className="activity-value">{d.minutes||'–'}</span><div className="activity-track"><span style={{height:`${d.minutes?Math.max(6,d.minutes/max*100):3}%`}} className={d.minutes?'activity-bar active':'activity-bar'}/></div><span className="text-[10px] text-[#8A929C] mt-2">{d.label}</span></li>)}</ol>
 </figure>;
}
export function ActivityCalendar({logs}:{logs:WorkoutLog[]}){
 const days=Array.from({length:28},(_,i)=>{const date=new Date();date.setDate(date.getDate()-27+i);const key=getLocalDateString(date);return {key,count:logs.filter(l=>l.tanggal===key).length};});
 const active=days.filter(d=>d.count>0).length;
 return <div><div className="flex items-center justify-between mb-4"><h2 className="font-bold text-sm sm:text-base">28 hari terakhir</h2><span className="text-xs text-[#FF7A03] font-bold">{active} hari aktif</span></div><div className="activity-calendar" aria-label="Kalender aktivitas 28 hari terakhir">{days.map(d=><span key={d.key} title={`${d.key}: ${d.count} sesi`} aria-label={`${d.key}: ${d.count} sesi`} className={d.count?'calendar-day done':'calendar-day'}>{Number(d.key.slice(-2))}</span>)}</div><p className="text-[10px] text-[#8A929C] mt-3">Oranye = hari dengan sesi selesai. Hari kosong dapat menjadi waktu istirahat.</p></div>;
}
