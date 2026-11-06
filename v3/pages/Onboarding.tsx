import React from 'react';
import {useRouter,useSearchParams} from 'next/navigation';
import {safeReturnTo} from '../navigation';
import {PreferencesForm} from '../components/PreferencesForm';
import {Page} from '../components/UI';
export default function Onboarding(){const router=useRouter();const params=useSearchParams();return <Page title="Mulai dari dirimu." eyebrow="Selamat datang di Streakin" description="Tiga langkah singkat agar pilihan latihan lebih relevan. Semuanya bisa diubah di Profil."><div className="v3-split"><div className="v3-panel"><PreferencesForm stepped onDone={()=>router.push(safeReturnTo(params.get('next')))}/></div><img src="/images/mascot/ppt-welcome.png" alt="Orange Dude menyambut latihan pertamamu" className="w-full h-64 object-contain"/></div></Page>;}
