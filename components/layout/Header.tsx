'use client';
import React,{useState,useEffect} from 'react';
import Link from 'next/link';
import {navSection} from '@/v3/navigation';
import {usePathname,useRouter} from 'next/navigation';
import {LogOut,ArrowRight} from 'lucide-react';
import {useAuth} from '@/context/AuthContext';
import {useProduct} from '@/v3/ProductContext';
const links=[['/home','Beranda'],['/skills','Skill'],['/workouts','Latihan'],['/progress','Progres'],['/profile','Profil']];
export function Header(){
 const {currentUser,logout}=useAuth();const {state}=useProduct();const path=usePathname();const router=useRouter();const [open,setOpen]=useState(false);const [logoutError,setLogoutError]=useState('');
 useEffect(()=>setOpen(false),[path]);
 useEffect(()=>{if(!open)return;const close=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false);};document.addEventListener?.('keydown',close);return()=>document.removeEventListener?.('keydown',close);},[open]);
 if(path.startsWith('/latihan/'))return null;
 return <header className="v3-header"><div className="v3-header-inner">
  <Link href={currentUser?'/home':'/'} className="v3-brand"><img src="/images/brand/streakin-si.png" alt="" width="40" height="40" className="v3-brand-mark"/><span>Streak<span className="text-[#FF7A03]">in</span></span></Link>
  {currentUser&&<nav aria-label="Navigasi utama desktop" className="v3-desktop-nav">{links.map(([href,label])=><Link key={href} href={href} aria-current={navSection(path)===href?'page':undefined} className={navSection(path)===href?'active':''}>{label}</Link>)}</nav>}
  {currentUser?<div className="flex items-center gap-3"><Link href="/membership" className="v3-tier">{state.testTier==='pro'?'PRO · UJI':'FREE'}</Link><div className="relative"><button type="button" aria-label="Menu akun pengguna" aria-expanded={open} onClick={()=>setOpen(!open)} className="v3-avatar">{currentUser.nama.slice(0,1).toUpperCase()}</button>{open&&<div className="v3-account-menu"><p className="text-xs text-[#8A929C] mb-2">{currentUser.nama}</p><Link onClick={()=>setOpen(false)} href="/profile">Profil & preferensi</Link><Link onClick={()=>setOpen(false)} href="/notifikasi">Atur Pengingat</Link><button onClick={async()=>{try{await logout();setOpen(false);router.push('/');}catch(e){setLogoutError((e as Error).message);}}}><LogOut className="w-4 h-4"/>Keluar</button>{logoutError&&<p role="alert">{logoutError}</p>}</div>}</div></div>:<div className="flex items-center gap-3"><Link href="/akun?tab=login" className="v3-text-link">Masuk</Link><Link href="/akun?tab=register" className="v3-button">Mulai gratis <ArrowRight className="w-4 h-4"/></Link></div>}
 </div></header>;
}
