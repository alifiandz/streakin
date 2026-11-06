import React from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';

// Imagery is restricted to the user's Orange Guy library. A presentation
// mascot is labelled as such; never substitute another exercise for a pose.
export function SkillCover({id,name}:{id:string;name:string}) {
 const src = id==='l-sit' ? '/images/skills/lsit-skill-full-hold.png'
  : id==='handstand' ? '/images/skills/hs-skill-kick-up-reps.png'
  : '/images/mascot/ppt-explain.png';
 const alt = id==='elbow-lever' ? 'Orange Guy mengenalkan panduan Elbow Lever' : `${name} — posisi penuh`;
 return <div className="mb-3">
  <Link href={`/skills/${id}`} aria-label={`Buka tahapan ${name}`} className="block hover:opacity-90 transition-opacity">
   <SafeImage src={src} alt={alt} className="w-full h-full object-contain" aspectRatioClass="aspect-[4/3]"/>
  </Link>
  {id==='elbow-lever'&&<p className="text-[10px] text-[#8A929C] mt-1">Orange Guy · panduan keseimbangan</p>}
 </div>;
}
