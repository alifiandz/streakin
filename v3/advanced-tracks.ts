import type {Skill,Exercise,WorkoutSession} from '../lib/seedData';
export function addAdvancedTracks(skills:Skill[],exercises:Exercise[],sessions:WorkoutSession[]){
 const tracks=[
  {id:'planche',name:'Planche',prefix:'pl',equipment:'Lantai stabil',prereq:'Tumpuan lengan lurus, protraction bahu, dan pergelangan nyaman menerima beban.',safety:'Pemanasan pergelangan dan bahu. Jangan memaksa kemiringan atau melanjutkan saat siku/pergelangan nyeri.',steps:[
   ['Planche Lean',20,'detik','Dari high plank, dorong punggung atas dan condongkan bahu sedikit melewati pergelangan. Jari kaki tetap menapak.'],
   ['Tuck Planche',10,'detik','Dengan lengan lurus dan bahu terdorong, tarik kedua lutut ke dada sampai kedua kaki melayang.'],
   ['Advanced Tuck Planche',8,'detik','Dari tuck, buka sudut pinggul perlahan. Pertahankan punggung mendekati horizontal dan kedua kaki terangkat.'],
   ['Straddle Planche',6,'detik','Luruskan kedua kaki dalam posisi terbuka. Jaga pinggul setinggi bahu dan siku tetap lurus.'],
   ['Full Planche',5,'detik','Rapatkan kedua kaki lurus. Tahan tubuh horizontal dengan lengan lurus dan bahu aktif.'],
  ]},
  {id:'muscle-up',name:'Muscle-Up',prefix:'mu',equipment:'Palang kokoh; palang rendah untuk transisi',prereq:'Active hang nyaman, strict pull-up terkontrol, dan dukungan di atas palang. Gunakan palang rendah untuk mempelajari transisi.',safety:'Periksa palang dan ruang di atasnya. Latih transisi di palang rendah dengan bantuan kaki. Hindari ayunan paksa dan satu siku naik lebih dulu.',steps:[
   ['Active Hang',30,'detik','Gantung dengan pegangan pronasi. Lengan lurus, bahu aktif menjauh dari telinga, dan tubuh tenang.'],
   ['Strict Pull-Up',6,'reps','Dari active hang, tarik dagu melewati palang tanpa ayunan. Turun perlahan sampai lengan panjang.'],
   ['High Pull-Up',3,'reps','Tarik palang ke arah dada bawah dalam rentang terkontrol. Pertahankan kedua siku bergerak serempak.'],
   ['Low-Bar Transition',5,'reps','Pada palang rendah, kaki menapak dan membantu beban. Bawa dada melewati palang, putar kedua pergelangan bersama, lalu berakhir di posisi dukungan.'],
   ['Bar Muscle-Up',3,'reps','Tarik tubuh tinggi, bawa dada melewati palang dengan kedua siku serempak, lalu dorong sampai dukungan lengan lurus. Turun dengan kontrol.'],
  ]},
 ] as const;
 for(const track of tracks){if(skills.some(s=>s.id===track.id))continue;
  const stageList=track.steps.map(([name,target,unit,cue],i)=>({stageNumber:i+1,nama:name,unit,deskripsi:cue,imageUrl:track.id==='muscle-up'&&i===1?'/images/exercises/pull-up-top.png':`/images/skills/${track.prefix}-${i+1}.png`,targetHoldSec:target,targetSets:3,syaratLulus:`3 set × ${target} ${unit==='detik'?'detik':'repetisi'} dengan teknik terkontrol dan tanpa nyeri.`,langkah:[track.id==='planche'?'Siapkan lantai stabil. Panaskan pergelangan dan bahu.':'Periksa palang dan area turun. Panaskan bahu dan pergelangan.',cue,'Bernapas teratur. Hentikan sebelum kontrol gerak hilang.'],kesalahanUmum:track.id==='planche'?['Siku menekuk atau punggung atas ambruk.','Memaksa tuas meskipun pergelangan nyeri.']:['Mengayun keras atau naik dengan satu siku lebih dulu.','Turun tanpa kontrol.'],tipsAman:track.safety,lebihMudah:i?track.steps[i-1][0]:track.id==='planche'?'Kurangi kemiringan; kedua kaki tetap menapak.':'Gantung dengan sebagian berat dibantu kaki.',lebihSulit:i<4?track.steps[i+1][0]:'Pertahankan kualitas sebelum menambah volume.'}));
  skills.push({id:track.id,nama:track.name,kategori:track.id==='planche'?'Dorong lengan lurus':'Tarikan & transisi',level:'Lanjutan',badgeColor:'#FF7A03',deskripsi:track.prereq,manfaatSiswa:'Bangun kekuatan dan kontrol secara bertahap.',durasiMingguEstimasi:'Sesuai kemampuan',catatanAman:track.safety,stages:stageList});
  stageList.forEach((stage,i)=>{const id=`${track.prefix}_${i+1}`,unit=stage.unit;exercises.push({id,nama:stage.nama,area:track.id==='planche'?'Bahu & inti':'Punggung & bahu',targetDefault:`3 × ${stage.targetHoldSec} ${unit==='detik'?'dtk':'reps'}`,isTimeBased:unit==='detik',imageUrl:stage.imageUrl,langkah:stage.langkah,kesalahanUmum:stage.kesalahanUmum,lebihMudah:stage.lebihMudah,lebihSulit:stage.lebihSulit});sessions.push({id:`s_${track.id}_${i+1}`,nama:`${track.name} · ${stage.nama}`,skillId:track.id,stageNumber:i+1,fokus:'Skill Mastery',durasiMenit:18,exercises:[{exerciseId:id,sets:3,target:stage.targetHoldSec,unit,istirahatDetik:90,isIsometric:unit==='detik'},{exerciseId:'ex23',sets:3,target:20,unit:'detik',istirahatDetik:60,isIsometric:true}]});});
 }
}
