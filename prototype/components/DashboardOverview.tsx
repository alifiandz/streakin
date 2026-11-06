import React from 'react';
import Link from 'next/link';
import {useWorkout} from '@/context/WorkoutContext';
import {getStreak7Days} from '@/src/utils/storage';

export function DashboardOverview(){
 const {logs,streak,library,reminder}=useWorkout();
 const days=getStreak7Days(logs);
 const recent=[...logs].sort((a,b)=>b.tanggal.localeCompare(a.tanggal)).slice(0,3);
 return <section aria-label="Ringkasan latihan" className="mb-5 space-y-3">
  <div className="grid grid-cols-3 gap-2 sm:gap-3">{[[`${streak} hari`,'Streak saat ini'],[`${logs.length} sesi`,'Latihan selesai'],[`${library?.sessionIds.length||0} sesi`,'Tersimpan di Library']].map(([value,label])=><div key={label} className="card-surface p-3 sm:p-4 border-[#2E3238]"><p className="text-lg sm:text-2xl text-[#FF7A03] font-extrabold">{value}</p><p className="text-[10px] sm:text-xs text-[#8A929C] mt-1">{label}</p></div>)}</div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
   <div className="card-surface p-4 border-[#2E3238]"><h2 className="text-sm font-bold mb-3">Aktivitas 7 Hari Terakhir</h2><div className="grid grid-cols-7 gap-2">{days.map((day,i)=><div key={i} className="text-center"><p className="text-[10px] text-[#8A929C] mb-2">{day.label}</p><span aria-label={`${day.label}: ${day.completed?'latihan selesai':'belum ada latihan'}`} className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm ${day.completed?'bg-[#FF7A03] text-[#15171A]':day.isToday?'border border-[#FF7A03] text-[#FF7A03]':'bg-[#15171A] text-[#8A929C]'}`}>{day.completed?'✓':'·'}</span></div>)}</div></div>
   <div className="card-surface p-4 border-[#2E3238]"><div className="flex items-center justify-between gap-2 mb-2"><h2 className="text-sm font-bold">Latihan Terakhir</h2><Link href="/riwayat" className="text-xs text-[#FF7A03] min-h-[44px] flex items-center">Lihat riwayat →</Link></div>{recent.length?recent.map(log=><p key={log.id} className="text-xs py-1 text-[#8A929C]"><span className="text-[#EEF1F4] font-semibold">{log.sessionNama}</span> · {log.tanggal}</p>):<p className="text-xs text-[#8A929C]">Belum ada sesi selesai. Pilih skill lalu mulai dari tahap aktifmu.</p>}</div>
  </div>
  <Link href="/notifikasi" className="card-surface px-4 py-3 flex justify-between gap-3 items-center border-[#2E3238] text-xs"><span><strong>Pengingat latihan</strong><span className="block text-[#8A929C] mt-1">{reminder.aktif?`Aktif pukul ${reminder.jam} saat aplikasi terbuka`:'Belum aktif · pilih waktu latihanmu'}</span></span><span className="text-[#FF7A03] font-bold">Atur →</span></Link>
 </section>;
}
