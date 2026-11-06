import React from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';
import { movementReferences } from '@/prototype/movement-references';

export const elbowFullPhoto = 'https://images.squarespace-cdn.com/content/v1/61bd05f1f151e77577ab467c/9c674d15-e905-4733-8bcf-5223364f592b/Full%2BElbow%2BLever.JPG';
export const elbowStraddlePhoto = 'https://images.squarespace-cdn.com/content/v1/61bd05f1f151e77577ab467c/d0daeaa9-a364-446e-9f3a-8e76baf82957/Straddle%2B3.JPG';
export function SkillCover({id,name}:{id:string;name:string}) {
 const src = id==='l-sit' ? '/images/skills/lsit-skill-full-hold.png' : id==='handstand' ? '/images/skills/hs-skill-kick-up-reps.png' : elbowFullPhoto;
 return <div className="mb-3">
  <Link href={`/skills/${id}`} aria-label={`Buka tahapan ${name}`} className="block hover:opacity-90 transition-opacity"><SafeImage src={src} alt={`${name} — posisi penuh`} className="w-full h-full object-contain" aspectRatioClass="aspect-[4/3]"/></Link>
  {id==='elbow-lever' && <a href={movementReferences[id].url} target="_blank" rel="noreferrer" className="block text-[10px] text-[#8A929C] mt-1 hover:text-[#FF7A03]">Foto demonstrasi: Hybrid Calisthenics ↗</a>}
 </div>;
}
