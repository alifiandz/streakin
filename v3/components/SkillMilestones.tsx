import React from 'react';
import Link from 'next/link';
import {Check} from 'lucide-react';
import {milestoneLabels} from '../training-meta';
export function SkillMilestones({skillId,current,locked=false}:{skillId:string;current:number;locked?:boolean}){
 const labels=milestoneLabels[skillId]||[];const skillName=({'l-sit':'L-Sit',handstand:'Handstand','elbow-lever':'Elbow Lever','front-lever':'Front Lever'} as Record<string,string>)[skillId]||skillId;
 return <ol className="skill-milestones" aria-label={`Tahapan ${skillName}`}>
  {labels.map((label,i)=><li key={label} className={!locked&&i+1<current?'passed':!locked&&i+1===current?'current':''}><Link href={`/skills/${skillId}?stage=${i+1}`} aria-label={`Pratinjau ${skillName} tahap ${i+1}: ${label}`} aria-current={!locked&&i+1===current?'step':undefined}><span className="milestone-node">{!locked&&i+1<current?<Check className="w-3 h-3"/>:String(i+1).padStart(2,'0')}</span><span className="milestone-label">{label}</span></Link></li>)}
 </ol>;
}
