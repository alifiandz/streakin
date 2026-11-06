'use client';
import React from 'react';
import Link from 'next/link';
import {navSection} from '@/v3/navigation';
import {usePathname} from 'next/navigation';
import {Home,Flag,Dumbbell,BarChart3,UserRound} from 'lucide-react';
import {useAuth} from '@/context/AuthContext';
export function BottomNav(){
 const {currentUser}=useAuth();const path=usePathname();if(!currentUser||path.startsWith('/latihan/')||path==='/akun'||path==='/onboarding')return null;
 return <nav className="v3-bottom-nav" aria-label="Navigasi utama mobile">{[['/home','Beranda',Home],['/skills','Skill',Flag],['/workouts','Latihan',Dumbbell],['/progress','Progres',BarChart3],['/profile','Profil',UserRound]].map(([href,label,Icon]:any)=><Link key={href} href={href} aria-current={navSection(path)===href?'page':undefined} className={navSection(path)===href?'active':''}><Icon className="w-5 h-5"/><span>{label}</span></Link>)}</nav>;
}
