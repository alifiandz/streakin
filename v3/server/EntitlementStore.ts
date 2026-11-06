/** Server-side enforcement for the future authenticated API.
 * Never import into the browser. A host adapter must derive userId from its
 * verified session, and probe video metadata on the server before admission.
 */
import {DatabaseSync} from 'node:sqlite';
import {randomUUID,timingSafeEqual} from 'node:crypto';
import {productRequest} from '../api';
import {SEED_SESSIONS,SEED_EXERCISES} from '../catalog';
import {canTrain,emptyProduct,monthKey,policy,type Tier} from '../model';
import type {WorkoutSession} from '../../src/types';
const ensure=(value:unknown,message:string)=>{if(!value)throw Error(message);};
export class EntitlementStore {
 db:DatabaseSync;
 constructor(path:string,private adminKey:string,private aiOperational=false){
  ensure(adminKey.length>=24,'Server admin key too short');this.db=new DatabaseSync(path);this.db.exec(`PRAGMA foreign_keys=ON;PRAGMA journal_mode=WAL;
   CREATE TABLE IF NOT EXISTS memberships(user_id TEXT PRIMARY KEY,tier TEXT NOT NULL CHECK(tier IN ('free','pro')));
   CREATE TABLE IF NOT EXISTS routines(user_id TEXT NOT NULL,id TEXT NOT NULL,payload TEXT NOT NULL,PRIMARY KEY(user_id,id));
   CREATE TABLE IF NOT EXISTS skill_progress(user_id TEXT NOT NULL,skill_id TEXT NOT NULL,stage INTEGER NOT NULL,PRIMARY KEY(user_id,skill_id));
   CREATE TABLE IF NOT EXISTS workout_grants(token TEXT PRIMARY KEY,user_id TEXT NOT NULL,payload TEXT NOT NULL);
   CREATE TABLE IF NOT EXISTS workout_logs(id TEXT PRIMARY KEY,user_id TEXT NOT NULL,grant_token TEXT UNIQUE NOT NULL,payload TEXT NOT NULL);
   CREATE TABLE IF NOT EXISTS ai_jobs(id TEXT PRIMARY KEY,user_id TEXT NOT NULL,period TEXT NOT NULL,status TEXT NOT NULL CHECK(status IN ('pending','complete','failed')),request_key TEXT NOT NULL,UNIQUE(user_id,request_key));
   CREATE INDEX IF NOT EXISTS ai_quota_lookup ON ai_jobs(user_id,period,status);
   CREATE INDEX IF NOT EXISTS workout_owner_lookup ON workout_logs(user_id);
  `);
 }
 private user(id:string){ensure(typeof id==='string'&&id.length>0&&id.length<=200,'Authenticated user required');return id;}
 private admin(key:string){const a=Buffer.from(key),b=Buffer.from(this.adminKey);ensure(a.length===b.length&&timingSafeEqual(a,b),'Server authorization required');}
 private transaction<T>(callback:()=>T):T{this.db.exec('BEGIN IMMEDIATE');try{const result=callback();this.db.exec('COMMIT');return result;}catch(error){this.db.exec('ROLLBACK');throw error;}}
 tier(userId:string):Tier{this.user(userId);const row=this.db.prepare('SELECT tier FROM memberships WHERE user_id=?').get(userId) as any;return row?.tier==='pro'?'pro':'free';}
 setMembership(userId:string,tier:Tier,serverKey:string){this.admin(serverKey);this.user(userId);ensure(tier==='free'||tier==='pro','Invalid tier');this.db.prepare('INSERT INTO memberships VALUES (?,?) ON CONFLICT(user_id) DO UPDATE SET tier=excluded.tier').run(userId,tier);}
 routines(userId:string){this.user(userId);return this.db.prepare('SELECT payload FROM routines WHERE user_id=?').all(userId).map((row:any)=>JSON.parse(row.payload));}
 saveRoutine(userId:string,input:any){this.user(userId);return this.transaction(()=>{
  const state={...emptyProduct(),testTier:this.tier(userId),routines:this.routines(userId)};
  // Client tier, userId, usage and limits are never read from input.
  const profile={product:state,skills:[]};const result=productRequest(profile,'/api/v3/routines',input,true);
  if(input.action==='delete'){this.db.prepare('DELETE FROM routines WHERE user_id=? AND id=?').run(userId,input.id);return null;}
  const routine=result.routine!;this.db.prepare('INSERT INTO routines VALUES (?,?,?) ON CONFLICT(user_id,id) DO UPDATE SET payload=excluded.payload').run(userId,routine.id,JSON.stringify(routine));return routine;
 });}
 stage(userId:string,skillId:string){this.user(userId);return Number((this.db.prepare('SELECT stage FROM skill_progress WHERE user_id=? AND skill_id=?').get(userId,skillId) as any)?.stage||1);}
 advanceStage(userId:string,skillId:string,next:number){return this.transaction(()=>{this.user(userId);ensure(skillId!=='front-lever'||this.tier(userId)==='pro','Pro required');ensure(SEED_SESSIONS.some(s=>s.skillId===skillId),'Unknown skill');const old=this.stage(userId,skillId);ensure(Number.isInteger(next)&&next>=1&&next<=5&&next<=old+1,'One stage at a time');this.db.prepare('INSERT INTO skill_progress VALUES (?,?,?) ON CONFLICT(user_id,skill_id) DO UPDATE SET stage=excluded.stage').run(userId,skillId,next);});}
 startWorkout(userId:string,sessionId:string){this.user(userId);const session:WorkoutSession|undefined=SEED_SESSIONS.find(s=>s.id===sessionId)||this.routines(userId).find(r=>r.id===sessionId);ensure(session,'Workout not found');ensure(canTrain(session!,this.tier(userId)),'Pro required');ensure(!session!.skillId||!session!.stageNumber||session!.stageNumber<=this.stage(userId,session!.skillId),'Stage not unlocked');const token=randomUUID();this.db.prepare('INSERT INTO workout_grants VALUES (?,?,?)').run(token,userId,JSON.stringify(session));return {token,session};}
 finishWorkout(userId:string,token:string,input:any){return this.transaction(()=>{
  this.user(userId);const grant=this.db.prepare('SELECT payload FROM workout_grants WHERE token=? AND user_id=?').get(token,userId) as any;ensure(grant,'Workout authorization missing');
  const existing=this.db.prepare('SELECT payload FROM workout_logs WHERE grant_token=? AND user_id=?').get(token,userId) as any;if(existing)return JSON.parse(existing.payload);
  const session=JSON.parse(grant.payload) as WorkoutSession;
  // An admitted workout can finish even after a plan change. Its snapshot is
  // authoritative, so editing/deleting a routine cannot change the active sets.
  ensure(Number.isFinite(input.durasiDetik)&&input.durasiDetik>0,'Invalid duration');
  ensure(Array.isArray(input.sets)&&input.sets.length===session.exercises.reduce((n,e)=>n+e.sets,0),'Complete every set');
  const unique=new Set();const sets=input.sets.map((set:any)=>{const target=session.exercises.find(e=>e.exerciseId===set.exerciseId);ensure(target&&Number.isInteger(set.noSet)&&set.noSet>=1&&set.noSet<=target.sets,'Invalid set');ensure(Number.isFinite(set.valueLogged)&&set.valueLogged>0&&set.valueLogged<=3600&&(target!.unit==='detik'||Number.isInteger(set.valueLogged)),'Invalid result');const key=set.exerciseId+':'+set.noSet;ensure(!unique.has(key),'Duplicate set');unique.add(key);return {exerciseId:set.exerciseId,exerciseName:SEED_EXERCISES.find(e=>e.id===set.exerciseId)?.nama||set.exerciseId,noSet:set.noSet,valueLogged:set.valueLogged,isIsometric:target!.unit==='detik'};});
  const log={id:randomUUID(),userId,sessionId:session.id,sessionName:session.nama,durasiDetik:input.durasiDetik,completedAt:new Date().toISOString(),sets};this.db.prepare('INSERT INTO workout_logs VALUES (?,?,?,?)').run(log.id,userId,token,JSON.stringify(log));return log;
 });}
 logs(userId:string){this.user(userId);return this.db.prepare('SELECT payload FROM workout_logs WHERE user_id=?').all(userId).map((row:any)=>JSON.parse(row.payload));}
 quota(userId:string,date=new Date()){this.user(userId);const period=monthKey(date,'Asia/Jakarta');const limit=policy(this.tier(userId)).aiMonthlyLimit;const used=Number((this.db.prepare("SELECT COUNT(*) AS n FROM ai_jobs WHERE user_id=? AND period=? AND status IN ('pending','complete')").get(userId,period) as any).n);return {period,limit,used,remaining:Math.max(0,limit-used)};}
 reserveAnalysis(userId:string,video:{verifiedDuration:number;verifiedMime:string},requestKey:string,date=new Date()){
  this.user(userId);ensure(this.aiOperational,'AI service not operational');ensure(Number.isFinite(video.verifiedDuration)&&video.verifiedDuration>0&&video.verifiedDuration<=30,'Video max 30 seconds');ensure(['video/mp4','video/webm','video/quicktime'].includes(video.verifiedMime),'Unsupported video');ensure(typeof requestKey==='string'&&requestKey.length>0&&requestKey.length<=128,'Idempotency key required');
  return this.transaction(()=>{const existing=this.db.prepare('SELECT id,status,period FROM ai_jobs WHERE user_id=? AND request_key=?').get(userId,requestKey);if(existing)return existing;const q=this.quota(userId,date);ensure(q.remaining>0,'Monthly allowance exhausted');const id=randomUUID();this.db.prepare("INSERT INTO ai_jobs VALUES (?,?,?,'pending',?)").run(id,userId,q.period,requestKey);return {id,status:'pending',period:q.period};});
 }
 settleAnalysis(id:string,status:'complete'|'failed',serverKey:string){this.admin(serverKey);ensure(status==='complete'||status==='failed','Invalid status');this.db.prepare("UPDATE ai_jobs SET status=? WHERE id=? AND status='pending'").run(status,id);}
 close(){this.db.close();}
}
