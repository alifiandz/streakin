import React,{useEffect} from 'react';
import {Routes,Route,useLocation,Navigate} from 'react-router-dom';
import {ErrorBoundary} from './ErrorBoundary';
import {ReminderBanner} from './ReminderBanner';
import {Header} from '../components/layout/Header';
import {BottomNav} from '../components/layout/BottomNav';
import {useAuth} from '../context/AuthContext';
import {useProduct} from '../v3/ProductContext';
import Landing from '../v3/pages/Landing';
import Auth from '../app/(auth)/akun/page';
import Home from '../v3/pages/Home';
import Skills from '../v3/pages/Skills';
import Skill from '../v3/pages/Skill';
import Workouts from '../v3/pages/Workouts';
import Builder from '../v3/pages/Builder';
import WorkoutReview from '../v3/pages/WorkoutReview';
import Progress from '../v3/pages/Progress';
import Profile from '../v3/pages/Profile';
import Membership from '../v3/pages/Membership';
import Onboarding from '../v3/pages/Onboarding';
import FormCheck from '../v3/pages/FormCheck';
import History from '../app/riwayat/page';
import Reminder from '../app/notifikasi/page';
import Done from '../app/selesai/[logId]/page';
import {PlayerAccess} from '../v3/components/PlayerAccess';
function Protected({children}:any){const currentLocation=useLocation();const {currentUser,loading}=useAuth();const product=useProduct();if(loading||product.loading)return <div role="status" className="v3-page">Menyiapkan ruang latihan…</div>;if(!currentUser)return <Navigate to={'/akun?tab=login&next='+encodeURIComponent(currentLocation.pathname+currentLocation.search)} replace/>;if(product.error)return <div role="alert" className="v3-page">{product.error}<button className="v3-button secondary ml-4" onClick={product.reload}>Coba lagi</button></div>;return children;}
export function Pages(){const location=useLocation();useEffect(()=>{try{window.scrollTo(0,0);}catch{}},[location.pathname]);return <div className="v3-app flex flex-col min-h-[100dvh]"><Header/>{!location.pathname.startsWith('/latihan/')&&<ReminderBanner/>}<div className="flex-1 min-w-0"><ErrorBoundary key={location.pathname}><Routes>
 <Route path="/" element={<Landing/>}/><Route path="/akun" element={<Auth/>}/><Route path="/skills" element={<Skills/>}/><Route path="/skills/:skillId" element={<Skill/>}/><Route path="/membership" element={<Membership/>}/><Route path="/library" element={<Navigate to="/workouts" replace/>}/>
 {([['/home',Home],['/workouts',Workouts],['/workouts/:sessionId',WorkoutReview],['/builder',Builder],['/builder/:routineId',Builder],['/progress',Progress],['/profile',Profile],['/onboarding',Onboarding],['/form-check',FormCheck],['/latihan/:sessionId',PlayerAccess],['/selesai/:logId',Done],['/riwayat',History],['/notifikasi',Reminder]] as const).map(([path,Component])=><Route key={path} path={path} element={<Protected><Component key={location.pathname}/></Protected>}/>)}
 <Route path="*" element={<Navigate to="/" replace/>}/></Routes></ErrorBoundary></div><BottomNav/></div>;}
