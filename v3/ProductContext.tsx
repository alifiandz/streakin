import React,{createContext,useContext,useEffect,useState,useRef,useCallback} from 'react';
import {useAuth} from '../context/AuthContext';
import {emptyProduct,quota,type ProductState} from './model';
type ProductValue={state:ProductState;loading:boolean;error:string;request:(path:string,body:any)=>Promise<any>;reload:()=>Promise<void>};
const Context=createContext<ProductValue|null>(null);
export function ProductProvider({children}:{children:React.ReactNode}){
 const {currentUser}=useAuth();const userRef=useRef(currentUser?.id);userRef.current=currentUser?.id;const [state,setState]=useState(emptyProduct);const [loading,setLoading]=useState(true);const [error,setError]=useState('');
 async function reload(){if(!currentUser){setState(emptyProduct());setLoading(false);return;}setLoading(true);try{const res=await fetch('/api/v3/state');const data=await res.json();if(!res.ok)throw Error(data.error||'Data produk belum dimuat.');setState(data.state);setError('');}catch(e){setError(e instanceof Error?e.message:'Data belum dimuat.');}finally{setLoading(false);}}
 useEffect(()=>{let cancelled=false;setState(emptyProduct());setLoading(true);setError('');if(!currentUser){setLoading(false);return;}fetch('/api/v3/state').then(async res=>{const data=await res.json();if(!res.ok)throw Error(data.error||'Data belum dimuat');if(!cancelled)setState(data.state);}).catch(e=>{if(!cancelled)setError(e.message);}).finally(()=>{if(!cancelled)setLoading(false);});return()=>{cancelled=true};},[currentUser?.id]);
 const request=useCallback(async(path:string,body:any)=>{const actor=userRef.current;if(!actor)throw Error('Masuk terlebih dahulu.');const res=await fetch('/api/v3/'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await res.json();if(userRef.current!==actor)throw Error('Sesi akun berubah. Muat ulang halaman.');if(!res.ok||data.success===false)throw Error(data.error||'Perubahan belum tersimpan.');if(data.state)setState(data.state);return data;},[]);

 return <Context.Provider value={{state,loading,error,request,reload}}>{children}</Context.Provider>;
}
export function useProduct(){const context=useContext(Context);if(!context)throw Error('ProductProvider missing');return context;}
