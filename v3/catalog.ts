import {workoutEquipment} from './training-meta';
import {SEED_SKILLS,SEED_EXERCISES,SEED_SESSIONS} from '../lib/seedData';
// Exact Orange Guy poses only. A missing straddle view remains a source link.
const stages=[
 ['Tuck Front Lever','Lutut ditarik mendekati dada, lengan lurus, bahu aktif.','/images/skills/fl-skill-tuck-hold.png',15],
 ['Advanced Tuck Front Lever','Buka sudut pinggul secara bertahap sambil mempertahankan punggung mendekati horizontal.','/images/skills/fl-skill-adv-tuck-hold.png',12],
 ['Single-Leg Front Lever','Luruskan satu kaki, kaki lain tetap ditekuk. Latih kedua sisi secara seimbang.','/images/skills/fl-skill-straddle-single-leg.png',10],
 ['Straddle Front Lever','Luruskan kedua kaki dengan posisi terbuka, hanya dalam rentang yang bisa dikontrol.',undefined,8],
 ['Full Front Lever','Kedua kaki rapat dan lurus, tubuh horizontal, bahu aktif dan lengan tetap lurus.','/images/skills/fl-skill-full-lever-hold.png',8],
] as const;
if(!SEED_SKILLS.some(s=>s.id==='front-lever')){
 SEED_SKILLS.push({id:'front-lever',nama:'Front Lever',kategori:'Pull & core',level:'Lanjutan',badgeColor:'#FF7A03',deskripsi:'Spesialisasi kekuatan tarik dengan posisi tubuh horizontal di bawah palang. Membutuhkan palang kokoh dan fondasi tarikan yang terkontrol.',manfaatSiswa:'Bangun kontrol bahu dan tubuh secara bertahap.',durasiMingguEstimasi:'Sesuai kemampuan',catatanAman:'Gunakan palang yang terpasang aman. Kuasai active hang dan tarikan dasar lebih dulu. Hindari gerakan jika bahu atau siku nyeri.',stages:stages.map(([nama,deskripsi,imageUrl,target],i)=>({stageNumber:i+1,nama,deskripsi,imageUrl,targetHoldSec:target,targetSets:3,syaratLulus:`3 set × ${target} detik dengan kontrol bahu, lengan lurus dan tanpa rasa nyeri. Untuk variasi satu kaki, penuhi target pada kedua sisi.`,langkah:['Periksa kestabilan palang dan lakukan pemanasan bahu.','Mulai dari active hang, aktifkan bahu dan kencangkan perut.',deskripsi,'Turunkan tubuh perlahan. Hentikan sebelum teknik tidak terkontrol.'],kesalahanUmum:['Menyentak tubuh ke posisi target.','Melanjutkan saat bahu atau siku terasa nyeri.'],tipsAman:'Turunkan tingkat kesulitan jika bentuk tidak terkontrol. Mintalah pendampingan pelatih bila belum memahami tekniknya.',lebihMudah:i===0?'Active hang dan latihan hollow di lantai.':stages[i-1][0],lebihSulit:i===4?'Tambah waktu secara bertahap setelah teknik stabil.':stages[i+1][0]}))});
 stages.forEach(([nama,description,imageUrl,target],i)=>{
  const id=`fl_${i+1}`;
  SEED_EXERCISES.push({id,nama,area:'Punggung & core',targetDefault:`3 × ${target} dtk`,imageUrl,isTimeBased:true,langkah:['Gunakan palang kokoh dan aktifkan bahu.',description,'Tahan dalam rentang terkontrol, lalu turun perlahan.'],kesalahanUmum:['Menyentak atau menahan napas.'],lebihMudah:i===0?'Active hang':stages[i-1][0],lebihSulit:i===4?'Tambah waktu secara bertahap':stages[i+1][0]});
  SEED_SESSIONS.push({id:`s_frontlever_${i+1}`,nama:`Front Lever · ${nama}`,durasiMenit:18,fokus:'Skill Mastery',skillId:'front-lever',stageNumber:i+1,exercises:[{exerciseId:id,sets:3,target,unit:'detik',isIsometric:true,istirahatDetik:90},{exerciseId:'ex23',sets:3,target:20,unit:'detik',isIsometric:true,istirahatDetik:60}]});
 });
}
export {SEED_SKILLS,SEED_EXERCISES,SEED_SESSIONS};
export const requirements:Record<string,{equipment:string[];prerequisite:string}>={
 'l-sit':{equipment:['floor','parallettes'],prerequisite:'Tumpuan tangan stabil dan pergelangan nyaman menerima beban.'},
 handstand:{equipment:['floor','wall'],prerequisite:'Plank terkontrol dan bahu nyaman bergerak di atas kepala.'},
 'elbow-lever':{equipment:['floor'],prerequisite:'Plank terkontrol dan pergelangan nyaman dalam posisi tumpuan.'},
 planche:{equipment:['floor'],prerequisite:'Tumpuan lengan lurus, bahu aktif dan pergelangan nyaman menerima beban.'},
 'muscle-up':{equipment:['bar','low-bar'],prerequisite:'Active hang, strict pull-up terkontrol, dan transisi di palang rendah.'},
 'front-lever':{equipment:['bar'],prerequisite:'Active hang dan tarikan dasar yang terkontrol pada palang kokoh.'},
};
export function sessionEquipment(id:string){const session=SEED_SESSIONS.find(s=>s.id===id);return session?workoutEquipment(session):['floor'];}

const scapular=SEED_EXERCISES.find(e=>e.id==='ex24');if(scapular)scapular.nama='Scapular Push-up';

// A real short session for the dashboard's five-minute choice; original presets remain intact.
if(!SEED_SESSIONS.some(s=>s.id==='s_quick_core_5'))SEED_SESSIONS.push({id:'s_quick_core_5',nama:'Core Singkat 5',durasiMenit:5,fokus:'Pull dan core',exercises:[{exerciseId:'ex9',sets:2,target:4,unit:'reps',istirahatDetik:20},{exerciseId:'ex10',sets:2,target:10,unit:'detik',isIsometric:true,istirahatDetik:20}]});

// Deterministic, stage-bound guided variants; no custom-routine slot is consumed.
import {addAdvancedTracks} from './advanced-tracks';
addAdvancedTracks(SEED_SKILLS,SEED_EXERCISES,SEED_SESSIONS);
import {createGuidedSessions} from './guided-training';
SEED_SESSIONS.push(...createGuidedSessions(SEED_SESSIONS).filter(s=>!SEED_SESSIONS.some(old=>old.id===s.id)));

// User-requested Full Elbow Lever asset; never reuse it for earlier progressions.
const elbow=SEED_SKILLS.find(s=>s.id==='elbow-lever');if(elbow)elbow.stages[4].imageUrl='/images/skills/elbow-lever-full-generated.png';
const elbowEx=SEED_EXERCISES.find(e=>e.id==='ex21');if(elbowEx)elbowEx.imageUrl='/images/skills/elbow-lever-full-generated.png';
const addedPrograms=[
 {id:'s_core_15',nama:'Core Control 15',durasiMenit:15,fokus:'Pull dan core' as const,exercises:[{exerciseId:'ex9',sets:3,target:10,unit:'reps' as const,istirahatDetik:45},{exerciseId:'ex23',sets:3,target:20,unit:'detik' as const,istirahatDetik:60,isIsometric:true},{exerciseId:'ex10',sets:3,target:25,unit:'detik' as const,istirahatDetik:45,isIsometric:true}]},
 {id:'s_legs_20',nama:'Legs & Core 20',durasiMenit:20,fokus:'Legs' as const,exercises:[{exerciseId:'ex26',sets:4,target:12,unit:'reps' as const,istirahatDetik:60},{exerciseId:'ex9',sets:3,target:10,unit:'reps' as const,istirahatDetik:45},{exerciseId:'ex10',sets:3,target:30,unit:'detik' as const,istirahatDetik:60,isIsometric:true}]},
 {id:'s_mobility_10',nama:'Bahu & Mobilitas 10',durasiMenit:10,fokus:'Full body' as const,exercises:[{exerciseId:'ex22',sets:2,target:30,unit:'detik' as const,istirahatDetik:20,isIsometric:true},{exerciseId:'ex24',sets:3,target:8,unit:'reps' as const,istirahatDetik:45},{exerciseId:'ex25',sets:2,target:25,unit:'detik' as const,istirahatDetik:30,isIsometric:true}]},
];
for(const program of addedPrograms)if(!SEED_SESSIONS.some(s=>s.id===program.id))SEED_SESSIONS.push(program);

const deadBug=SEED_EXERCISES.find(e=>e.id==='ex9');if(deadBug){deadBug.imageUrl='/images/exercises/dead-bug-extension-generated.png';deadBug.langkah=['Telentang. Angkat tangan; tekuk pinggul dan lutut 90°.','Jaga punggung bawah stabil. Luruskan satu lengan dan kaki yang berlawanan.','Kembali perlahan, lalu ganti sisi. Satu sisi = satu repetisi.','Buang napas saat meluruskan. Pendekkan jangkauan bila punggung melengkung.'];deadBug.kesalahanUmum=['Mengangkat kepala atau melakukan sit-up.','Meluruskan lengan dan kaki pada sisi yang sama.','Memaksakan jangkauan hingga punggung bawah melengkung.'];deadBug.lebihMudah='Gerakkan satu kaki; tangan tetap di atas dada';deadBug.lebihSulit='Perlambat gerakan tanpa mengubah posisi punggung';}

import {applyStageArt} from './stage-art';
applyStageArt(SEED_SKILLS,SEED_EXERCISES);
