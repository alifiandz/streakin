import React from 'react';
// This guard is scoped to route content. It never replaces the app shell/navigation.
export class ErrorBoundary extends React.Component<{children:React.ReactNode},{error:Error|null}>{
 state:{error:Error|null}={error:null};
 static getDerivedStateFromError(error:Error){return {error}}
 componentDidCatch(error:Error){console.error('StreakIn route error',error);try{sessionStorage.setItem('streakin_last_error',JSON.stringify({message:error.message,stack:error.stack,path:location.hash,time:new Date().toISOString()}))}catch{}}
 render(){if(!this.state.error)return this.props.children;return <div role="alert" className="max-w-xl mx-auto p-4 my-4 border border-[#FF7A03]/40 rounded-xl bg-[#23272D] text-[#EEF1F4]"><p className="text-sm">Layar ini belum berhasil dimuat. Data yang tersimpan tetap aman.</p><button className="btn-brand px-4 py-2 mt-3 text-xs" onClick={()=>this.setState({error:null})}>Coba lagi</button><a className="ml-4 text-xs text-[#FF7A03]" href="#/home">Ke beranda</a></div>}
}
