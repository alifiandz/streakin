import type {WorkoutSession} from '../src/types';
export const trainingTimeOptions=[5,10,15,20,30,45,60] as const;
export const quickSessionIds=['s_quick_core_5'];
export type Tier='free'|'pro';
export interface Assessment {plank:'unknown'|'under15'|'15to30'|'over30';pushups:'unknown'|'0to4'|'5to10'|'over10';}
export interface Preferences {timeMinutes:number;assessment:Assessment;experience:'new'|'some'|'experienced';goal:'consistency'|'strength'|'skills';skills:string[];equipment:string[];frequency:number;onboarded:boolean;timeZone:string;}
export interface Routine extends WorkoutSession {custom:true;createdAt:string;updatedAt:string;}
export interface ProductState {testTier:Tier;preferences:Preferences;routines:Routine[];schedule:{days:number[];time:string};usage:Record<string,number>;leases:Record<string,string>;}
export const defaultPreferences:Preferences={timeMinutes:15,assessment:{plank:'unknown',pushups:'unknown'},experience:'new',goal:'consistency',skills:['l-sit'],equipment:['floor'],frequency:3,onboarded:false,timeZone:'Asia/Jakarta'};
export function emptyProduct():ProductState{return {testTier:'free',preferences:{...defaultPreferences,skills:[...defaultPreferences.skills],equipment:['floor']},routines:[],schedule:{days:[],time:'16:00'},usage:{},leases:{}};}
export const isProExercise=(id:string)=>['fl_','pl_','mu_'].some(prefix=>id.startsWith(prefix))||id==='ex6';
export const isProSkill=(id?:string)=>['front-lever','planche','muscle-up'].includes(id||'');
export const presetIds=['s1','s2','s_legs_10','s4','s5','s_quick_core_5','s_core_15','s_legs_20','s_mobility_10'];
export function policy(tier:Tier){return {tier,customRoutineLimit:tier==='pro'?null:1,aiMonthlyLimit:tier==='pro'?5:1,advancedAnalytics:tier==='pro',specializedSkills:tier==='pro'};}
export function monthKey(date=new Date(),timeZone='Asia/Jakarta'){const parts=new Intl.DateTimeFormat('en-US',{timeZone,year:'numeric',month:'2-digit'}).formatToParts(date);return `${parts.find(p=>p.type==='year')!.value}-${parts.find(p=>p.type==='month')!.value}`;}
export function quota(state:ProductState,date=new Date()){const period=monthKey(date,'Asia/Jakarta');const limit=policy(state.testTier).aiMonthlyLimit;const used=state.usage[period]||0;return {period,limit,used,remaining:Math.max(0,limit-used),operational:false};}
export function assertRoutineLimit(tier:Tier,count:number,editing:boolean){if(!editing&&tier==='free'&&count>=1)throw Error('Free menyimpan 1 rutinitas kustom. Edit rutinitas yang ada atau lihat Pro.');}
export function canTrain(session:WorkoutSession,tier:Tier){return tier==='pro'||(!isProSkill(session.skillId)&&!session.exercises.some(e=>isProExercise(e.exerciseId)));}
