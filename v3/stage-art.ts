import type {Skill,Exercise} from '../lib/seedData';
export function applyStageArt(skills:Skill[],exercises:Exercise[]){
 const entries:[string,number,string,string][]=[
  ['l-sit',3,'ex11','lsit-single-fixed'],['l-sit',4,'ex12','lsit-straddle'],
  ['handstand',1,'ex3','hs-wallwalk'],['handstand',4,'ex15','hs-kickup'],
  ['elbow-lever',1,'ex17','elbow-lean-fixed'],['elbow-lever',2,'ex18','elbow-knee-fixed'],['elbow-lever',3,'ex19','elbow-tuck'],['elbow-lever',4,'ex20','elbow-straddle'],['elbow-lever',5,'ex21','elbow-lever-full-generated'],
  ['front-lever',4,'fl_4','fl-straddle'],
 ];
 for(const [skillId,n,exerciseId,file] of entries){const imageUrl=`/images/skills/${file}.png`;const stage=skills.find(s=>s.id===skillId)?.stages[n-1];if(stage)stage.imageUrl=imageUrl;const ex=exercises.find(e=>e.id===exerciseId);if(ex)ex.imageUrl=imageUrl;}
}
