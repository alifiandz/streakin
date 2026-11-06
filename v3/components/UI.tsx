import React from 'react';
import Link from 'next/link';
import {Lock,ArrowRight} from 'lucide-react';
export function Page({children,title,eyebrow,description,action}:{children:React.ReactNode;title:string;eyebrow?:string;description?:string;action?:React.ReactNode}){return <main className="v3-page"><header className="v3-page-heading"><div>{eyebrow&&<p className="v3-eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description&&<p className="v3-lead">{description}</p>}</div>{action}</header>{children}</main>;}
export function Message({children,error=false}:{children:React.ReactNode;error?:boolean}){return <p role={error?'alert':'status'} className={`v3-message ${error?'error':''}`}>{children}</p>;}
export function ProPrompt({title,description}:{title:string;description:string}){return <div className="v3-pro-prompt"><Lock className="w-5 h-5 text-[#FF7A03]"/><div><p className="v3-eyebrow">Spesialisasi Pro</p><h2>{title}</h2><p>{description}</p><Link href="/membership" className="v3-text-link">Bandingkan Free & Pro <ArrowRight className="w-4 h-4"/></Link></div></div>;}
export function SectionTitle({title,children}:{title:string;children?:React.ReactNode}){return <div className="v3-section-title"><h2>{title}</h2>{children}</div>;}
