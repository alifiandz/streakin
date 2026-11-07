import type {SupabaseClient, User as SupabaseUser} from '@supabase/supabase-js';
import deployedPublicConfig from '../../public/auth-config.json';
import {safeReturnTo} from '../navigation';

export type GoogleConfig = {supabaseUrl:string;publishableKey:string;googleEnabled:boolean};
export type GoogleIdentity = {id:string;email:string;nama:string};
const RETURN_KEY='streakin_google_return_v1';
const unavailable:GoogleConfig={supabaseUrl:'',publishableKey:'',googleEnabled:false};

// This public file contains only a project URL and publishable key, never an OAuth secret.
export function validateGoogleConfig(value:unknown):GoogleConfig {
 const c=value as Partial<GoogleConfig>|null;
 if(!c?.googleEnabled)return unavailable;
 try {
  const url=new URL(c.supabaseUrl||'');
  if(url.protocol!=='https:'||!url.hostname.endsWith('.supabase.co')||url.pathname!=='/'||url.search||url.hash||url.username||url.password||!/^sb_publishable_[A-Za-z0-9_-]+$/.test(c.publishableKey||''))return unavailable;
  return {supabaseUrl:url.origin,publishableKey:c.publishableKey!,googleEnabled:true};
 }catch{return unavailable;}
}
export function googleIdentity(user:SupabaseUser):GoogleIdentity {
 if(!user.id||!user.email||!user.email_confirmed_at)throw Error('Email akun belum terverifikasi.');
 return {id:`supabase_${user.id}`,email:user.email,nama:String(user.user_metadata?.full_name||user.user_metadata?.name||user.email.split('@')[0]).slice(0,80)};
}

export class GoogleAccounts {
 private configuration?:Promise<GoogleConfig>;
 private client?:Promise<SupabaseClient|null>;
 private startup?:Promise<void>;
 private callbackFailed=false;
 constructor(private request:typeof fetch,private browser:Window,private factory?: (url:string,key:string)=>Promise<SupabaseClient>){}
 config(){return this.configuration??=(async()=>{
  // Production's public project/key are bundled, so a blocked or stale config request
  // cannot silently hide Google on a friend's first visit. Supabase verifies sign-in.
  const origin=new URL(this.browser.location?.href||'https://streakin.invalid/').origin;
  if(origin==='https://streakin.my.id')return validateGoogleConfig({...deployedPublicConfig,googleEnabled:true});
  return this.request('/auth-config.json',{cache:'no-store'}).then(async r=>r.ok?validateGoogleConfig(await r.json()):unavailable).catch(()=>unavailable);
 })();}
 private getClient(){return this.client??=(async()=>{
  const config=await this.config();if(!config.googleEnabled)return null;
  const client=this.factory?await this.factory(config.supabaseUrl,config.publishableKey):(await import('@supabase/supabase-js')).createClient(config.supabaseUrl,config.publishableKey,{auth:{flowType:'pkce',detectSessionInUrl:false,persistSession:true,autoRefreshToken:true,storageKey:'streakin_google_session_v1'}});
  client.auth.onAuthStateChange((event)=>{
   if(event==='SIGNED_OUT'){queueMicrotask(()=>this.browser.dispatchEvent(new Event('streakin-auth-changed')));}
  });
  return client;
 })();}
 async initialize(){return this.startup??=(async()=>{
  if(!(await this.config()).googleEnabled)return;
  const url=new URL(this.browser.location.href);
  if(url.searchParams.get('auth_callback')!=='1')return;
  const next=safeReturnTo(this.browser.sessionStorage.getItem(RETURN_KEY));
  this.browser.sessionStorage.removeItem(RETURN_KEY);
  let error='';
  try{
   const client=await this.getClient();if(!client)throw Error('Google login belum diaktifkan.');
   const callbackHash=new URLSearchParams(url.hash.slice(1));
   if(url.searchParams.has('error')||callbackHash.has('error'))throw Error('Login Google dibatalkan atau tidak diizinkan. Coba lagi.');
   const code=url.searchParams.get('code');if(!code)throw Error('Tautan login tidak lengkap. Mulai lagi dari tombol Google.');
   const exchanged=await client.auth.exchangeCodeForSession(code);if(exchanged.error)throw Error('Tautan login kedaluwarsa atau sudah digunakan. Coba lagi.');
   const verified=await client.auth.getUser();if(verified.error||!verified.data.user)throw Error('Akun Google belum dapat diverifikasi. Coba lagi.');
   googleIdentity(verified.data.user);
  }catch(e){this.callbackFailed=true;error=e instanceof Error?e.message:'Google login gagal. Coba lagi.';}
  // Remove the single-use authorization code and provider error from the address bar.
  this.browser.history.replaceState(null,'',url.pathname+'#/akun?tab=login&next='+encodeURIComponent(next)+(error?'&google_error='+encodeURIComponent(error):'&google_return=1'));
  this.browser.dispatchEvent(new PopStateEvent('popstate'));
 })();}
 async current(){
  await this.initialize();if(this.callbackFailed)return null;const client=await this.getClient();if(!client)return null;
  const session=await client.auth.getSession();if(session.error||!session.data.session){return null;}
  // A persisted browser session is not proof of identity: validate it with Auth.
  const result=await client.auth.getUser();if(result.error||!result.data.user){return null;}
  return googleIdentity(result.data.user);
 }
 async start(next:unknown){
  const client=await this.getClient();if(!client)throw Error('Google login sedang disiapkan. Gunakan akun perangkat sementara.');
  this.browser.sessionStorage.setItem(RETURN_KEY,safeReturnTo(typeof next==='string'?next:null));
  const redirectTo=this.browser.location.origin+this.browser.location.pathname+'?auth_callback=1';
  const {data,error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo,skipBrowserRedirect:true,scopes:'openid email profile',queryParams:{prompt:'select_account'}}});
  if(error||!data.url){this.browser.sessionStorage.removeItem(RETURN_KEY);throw Error('Google login belum dapat dimulai. Coba lagi nanti.');}
  const target=new URL(data.url),config=await this.config();
  if(target.origin!==config.supabaseUrl||target.pathname!=='/auth/v1/authorize')throw Error('Alamat login tidak valid.');
  this.browser.location.assign(target.href);
 }
 async signOut(){const client=await this.getClient();if(client){const {error}=await client.auth.signOut({scope:'local'});if(error)throw Error('Belum berhasil keluar dari akun Google. Coba lagi.');}}
}
let accounts:GoogleAccounts|undefined;
export function googleAccounts(request:typeof fetch){return accounts??=new GoogleAccounts(request,window);}
