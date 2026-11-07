import type {WorkoutSession} from '../src/types';
export const equipmentLabels:Record<string,string>={floor:'Lantai',wall:'Dinding',bar:'Palang kokoh',parallettes:'Parallettes / tumpuan sejajar',support:'Tumpuan tinggi stabil','low-bar':'Palang rendah','dip-bars':'Dip bars',rings:'Gymnastic rings',bands:'Resistance band',mat:'Matras',bench:'Bangku stabil',box:'Box latihan',vest:'Weighted vest',dumbbells:'Dumbbell'};
export function exerciseEquipment(id:string):string[]{
 if(id.startsWith('pl_'))return ['floor'];
 if(id==='mu_4')return ['floor','low-bar'];
 if(id.startsWith('mu_'))return ['floor','bar'];
 if(id.startsWith('fl_')||['ex5','ex6'].includes(id))return ['floor','bar'];
 if(['ex1','ex2','ex11','ex12','ex13'].includes(id))return ['floor','parallettes'];
 if(['ex3','ex4','ex14','ex15'].includes(id))return ['floor','wall'];
 if(['ex8','ex25'].includes(id))return ['floor','support'];
 return ['floor'];
}
export function workoutEquipment(session:WorkoutSession){return [...new Set(session.exercises.flatMap(e=>exerciseEquipment(e.exerciseId)))];}
export function missingEquipment(session:WorkoutSession,available:string[]){return workoutEquipment(session).filter(id=>!available.includes(id)&&!(id==='support'&&available.some(e=>['bench','box'].includes(e)))&&!(id==='parallettes'&&available.includes('dip-bars')));}
const presets:Record<string,{goal:string;category:string;difficulty:string;short:string}>={
 s_quick_core_5:{goal:'Aktivasi inti tubuh dalam sesi singkat',category:'core',difficulty:'Pemula',short:'Inti tubuh'},
 s4:{goal:'Dorong dan stabilkan tubuh',category:'full',difficulty:'Dasar',short:'Seluruh tubuh'},
 s5:{goal:'Kekuatan tubuh bagian atas',category:'push',difficulty:'Menengah',short:'Dorong'},
 s_core_15:{goal:'Kontrol perut dan pinggul',category:'core',difficulty:'Dasar',short:'Inti tubuh'},
 s_legs_20:{goal:'Kekuatan kaki dan inti',category:'legs',difficulty:'Menengah',short:'Kaki'},
 s_mobility_10:{goal:'Gerak bahu dan pergelangan',category:'mobility',difficulty:'Pemula',short:'Mobilitas'},
 s1:{goal:'Kekuatan dada, bahu, dan trisep',category:'push',difficulty:'Dasar',short:'Dorong'},
 s2:{goal:'Kontrol inti tubuh dan tumpuan bahu',category:'core',difficulty:'Dasar',short:'Inti tubuh'},
 s_legs_10:{goal:'Fondasi kaki dan kestabilan tubuh',category:'legs',difficulty:'Pemula',short:'Kaki'},
};
export function workoutMeta(session:WorkoutSession){
 const base=presets[session.id]||{goal:session.skillId?`Latihan tahap ${session.stageNumber} untuk ${session.skillId==='l-sit'?'L-Sit':session.skillId==='handstand'?'Handstand':session.skillId==='front-lever'?'Front Lever':'Elbow Lever'}`:'Target mengikuti susunan gerakanmu',category:session.skillId?'skill':'custom',difficulty:session.skillId==='front-lever'?'Lanjutan':session.stageNumber?session.stageNumber<=1?'Fondasi':session.stageNumber<=3?'Menengah':'Lanjutan':'Sesuai susunan',short:session.skillId?'Latihan skill':'Kustom'};
 return {...base,equipment:workoutEquipment(session),sets:session.exercises.reduce((n,e)=>n+e.sets,0),moves:session.exercises.length};
}
export function shortDuration(seconds:number){if(seconds<60)return `${Math.max(0,Math.round(seconds))} dtk`;return `${Math.round(seconds/60)} menit`;}
export const milestoneLabels:Record<string,string[]>={
 planche:['Lean','Tuck','Advanced tuck','Straddle','Penuh'],
 'muscle-up':['Gantung aktif','Tarikan','Tarikan tinggi','Transisi','Muscle-Up'],
 'l-sit':['Tumpuan','Tuck','Satu kaki','Straddle','L-Sit penuh'],
 handstand:['Adaptasi','Dinding','Keseimbangan','Kick-up','Mandiri'],
 'elbow-lever':['Tumpuan siku','Lutut dibantu','Tuck','Straddle','Tubuh lurus'],
 'front-lever':['Tuck','Advanced tuck','Satu kaki','Straddle','Penuh'],
};
export const skillThemes:Record<string,{focus:string;hook:string}>={
 planche:{focus:'Dorong lengan lurus',hook:'Dari lean bertumpu kaki ke tubuh horizontal.'},
 'muscle-up':{focus:'Tarikan & transisi',hook:'Dari gantung aktif ke dukungan di atas palang.'},
 'l-sit':{focus:'Kontrol inti & tumpuan',hook:'Dari tumpuan bahu menuju kedua kaki lurus.'},
 handstand:{focus:'Bahu & keseimbangan',hook:'Bangun rasa nyaman terbalik sebelum berdiri mandiri.'},
 'elbow-lever':{focus:'Tumpuan siku & keseimbangan',hook:'Kurangi bantuan kaki sampai tubuh bisa melayang.'},
 'front-lever':{focus:'Tarikan lengan lurus',hook:'Dari tuck hingga tubuh horizontal di bawah palang.'},
};
