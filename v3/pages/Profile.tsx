import React,{useState} from 'react';
import Link from 'next/link';
import {useAuth} from '@/context/AuthContext';
import {useWorkout} from '@/context/WorkoutContext';
import {useProduct} from '../ProductContext';
import {PreferencesForm} from '../components/PreferencesForm';
import {TrainingTools} from '@/prototype/TrainingTools';
import {Page,Message,SectionTitle} from '../components/UI';
export default function Profile(){
 const {currentUser}=useAuth();const {activeWorkout}=useWorkout();const {state,request}=useProduct();const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);
 const labels=['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
 return <Page title="Profil & preferensi" eyebrow={currentUser?.nama} description="Sesuaikan latihan, kelola jadwal, dan simpan cadangan datamu.">
 <div className="v3-split"><div><div className="v3-panel mb-6"><p className="v3-eyebrow">{currentUser?.authProvider==='google'?'Akun Google':'Akun perangkat'}</p><h2 className="text-xl font-bold">{currentUser?.nama}</h2><p className="text-xs text-[#8A929C] mt-2">{currentUser?.email}</p><p className="text-xs text-[#8A929C] mt-4">{currentUser?.authProvider==='google'?'Login terverifikasi Google. Catatan latihan masih disimpan di browser ini; gunakan cadangan untuk memindahkannya.':'Data disimpan di browser ini. Akun Google dapat digunakan setelah aktivasi layanan login.'}</p><Link href="/membership" className="v3-text-link mt-2">Free & Pro →</Link></div><SectionTitle title="Preferensi latihan"/><PreferencesForm/></div>
 <aside><SectionTitle title="Jadwal manual"/><p className="text-xs text-[#8A929C] mb-4">Tersimpan di aplikasi; bukan notifikasi latar belakang.</p><div className="v3-choice mb-4">{labels.map((label,i)=><button key={label} aria-pressed={state.schedule.days.includes(i)} onClick={async()=>{try{await request('schedule',{...state.schedule,days:state.schedule.days.includes(i)?state.schedule.days.filter(d=>d!==i):[...state.schedule.days,i]});setMessage('Jadwal tersimpan.');}catch(e){setMessage((e as Error).message);}}}>{label}</button>)}</div><label className="v3-field"><span>Jam latihan · {state.preferences.timeZone}</span><input type="time" value={state.schedule.time} onChange={async e=>{if(!e.target.value)return;try{await request('schedule',{...state.schedule,time:e.target.value});setMessage('Jam tersimpan.');}catch(e){setMessage((e as Error).message);}}}/></label>
 {state.testTier==='pro'&&<button className="v3-button secondary mb-4" onClick={async()=>{const sequence=[1,3,5,0,2,4,6].slice(0,state.preferences.frequency);try{await request('schedule',{days:sequence,time:state.schedule.time});setMessage('Saran jadwal diterapkan berdasarkan frekuensi pilihanmu. Sesuaikan hari istirahat sesuai kebutuhan.');}catch(e){setMessage((e as Error).message);}}}>Terapkan saran jadwal Pro</button>}
 <Link href="/notifikasi" className="v3-text-link block">Pengingat & ekspor kalender →</Link>
 <SectionTitle title="Cadangan data"/><TrainingTools/>
 <details id="testing" className="v3-divider"><summary className="min-h-[44px] text-xs font-bold cursor-pointer">Pengujian akses paket · bukan langganan</summary><p className="text-xs text-[#8A929C] my-4">Mode lokal untuk menguji Free/Pro. Tidak memproses pembayaran atau memberi akses produksi. Mengubah paket tidak menghapus rutinitas yang sudah ada. Sesi aktif tidak diganggu.</p><div className="v3-choice">{(['free','pro'] as const).map(tier=><button disabled={busy} aria-pressed={state.testTier===tier} key={tier} onClick={async()=>{setBusy(true);try{await request('test-tier',{tier});setMessage(`Paket uji ${tier.toUpperCase()} diterapkan. Tidak ada pembayaran.`);}catch(e){setMessage((e as Error).message);}finally{setBusy(false);}}}>Uji {tier.toUpperCase()}</button>)}</div></details>
 {message&&<Message>{message}</Message>}
 </aside></div>
 </Page>;
}
