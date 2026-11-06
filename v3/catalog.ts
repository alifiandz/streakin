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
 'front-lever':{equipment:['bar'],prerequisite:'Active hang dan tarikan dasar yang terkontrol pada palang kokoh.'},
};
export function sessionEquipment(id:string){const s=SEED_SESSIONS.find(s=>s.id===id);if(s?.skillId)return requirements[s.skillId]?.equipment||['floor'];return s?.exercises.some(e=>['ex1','ex2'].includes(e.exerciseId))?['floor','parallettes']:s?.exercises.some(e=>e.exerciseId==='ex8')?['floor','support']:['floor'];}

const scapular=SEED_EXERCISES.find(e=>e.id==='ex24');if(scapular)scapular.nama='Scapular Push-up';
