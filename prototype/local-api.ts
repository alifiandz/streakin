// Prototype adapter only. No credentials or requests are sent to the original app.
const nativeFetch=window.fetch.bind(window);const KEY='streakin_friend_prototype_data_v1';
type DB={user:any;library:any;skills:any[];logs:any[]};
function read():DB{try{return JSON.parse(localStorage.getItem(KEY)||'null')||{user:null,library:null,skills:[],logs:[]}}catch{return {user:null,library:null,skills:[],logs:[]}}}
function save(d:DB){localStorage.setItem(KEY,JSON.stringify(d))}
function reply(data:any,status=200){return Promise.resolve(new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}}))}
window.fetch=((input:RequestInfo|URL,options?:RequestInit)=>{let url=typeof input==='string'?input:input instanceof URL?input.pathname:input.url;if(!url.startsWith('/api/'))return nativeFetch(input,options);const db=read();let b:any={};try{b=JSON.parse(String(options?.body||'{}'))}catch{}const post=options?.method==='POST';
if(url==='/api/auth/me')return db.user?reply({success:true,user:db.user}):reply({success:false},401);
if(url==='/api/auth/logout'){db.user=null;save(db);return reply({success:true})}
if(url==='/api/auth/login'||url==='/api/auth/register'){
 if(url.endsWith('login')&&(b.email!=='rizky@sma11.sch.id'||b.kataSandi!=='rahasia123'))return reply({success:false,error:'Gunakan akun demo: rizky@sma11.sch.id / rahasia123. Pendaftaran pada prototipe hanya membuat profil lokal.'},401);
 db.user={id:'usr_demo_1',nama:url.endsWith('register')?(b.nama||'Rizky'):'Rizky',email:b.email||'rizky@sma11.sch.id'};save(db);return reply({success:true,user:db.user})}
if(!db.user)return reply({success:false,error:'Belum terautentikasi'},401);
if(url==='/api/library'){if(post){db.library={userId:db.user.id,durasi:b.durasi||[10,15],fokus:b.fokus||[],sessionIds:b.sessionIds||[],skills:b.skills||[]};save(db)}return reply({success:true,data:db.library})}
if(url==='/api/skills/progress'){if(post){const old=db.skills.find(x=>x.skillId===b.skillId);if(old){old.currentStage=b.currentStage??old.currentStage;old.bestHoldSec=Math.max(old.bestHoldSec||0,b.bestHoldSec||0)}else db.skills.push({userId:db.user.id,skillId:b.skillId,currentStage:b.currentStage||1,bestHoldSec:b.bestHoldSec||0});save(db)}return reply({success:true,data:db.skills})}
if(url==='/api/workout-logs'){if(post){const log={...b,id:crypto.randomUUID(),userId:db.user.id,completedAt:new Date().toISOString()};db.logs.unshift(log);save(db);return reply({success:true,data:log})}return reply({success:true,data:db.logs})}
return reply({success:false,error:'Endpoint tidak tersedia pada prototipe'},404);
}) as typeof fetch;
