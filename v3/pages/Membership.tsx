import React from 'react';
import Link from 'next/link';
import {useProduct} from '../ProductContext';
import {Page,Message} from '../components/UI';
const rows=[
 ['Jalur fondasi L-Sit & Handstand','Semua tahap','Semua tahap'],
 ['Tutorial dasar, sesi, timer & log','Tanpa batas','Tanpa batas'],
 ['Program latihan dasar','3 program','3 program + personalisasi'],
 ['Rutinitas kustom tersimpan','1','Tanpa batas jumlah'],
 ['Streak, pencapaian & progres manual','Termasuk','Termasuk'],
 ['Jadwal latihan','Manual','Manual + saran personal'],
 ['Front Lever','Pratinjau','Jalur progresi + sesi spesialis'],
 ['Analitik, tren & laporan mingguan','Ringkasan dasar','Rincian lanjutan'],
 ['AI Form Check · belum operasional','1 / bulan saat aktif','5 total / bulan saat aktif'],
 ['Sinkronisasi antarperangkat','Belum terhubung','Belum terhubung'],
 ['Planche, Muscle-Up, Advanced Handstand','Belum tersedia','Rencana masa depan, belum tersedia'],
 ['Tantangan lanjutan','Tidak termasuk','Belum tersedia'],
];
export default function Membership(){const {state}=useProduct();return <Page title="Fondasi gratis. Spesialisasi saat siap." eyebrow="Free & Pro" description="Latihan dasar tetap lengkap. Pro ditujukan untuk spesialisasi dan pemahaman progres yang lebih dalam.">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7"><section className="v3-panel"><p className="v3-eyebrow">Streakin Free</p><h2 className="text-2xl font-bold mb-3">Belajar, latihan,<br/>jaga konsistensi.</h2><p className="text-xs text-[#8A929C]">Semua tahap fondasi, tiga program dasar, satu rutinitas kustom, dan sesi tanpa batas.</p><Link href="/workouts" className="v3-text-link mt-3">Lanjutkan latihan gratis →</Link></section><section className="v3-panel !border-[#FF7A03]/40"><p className="v3-eyebrow">Streakin Pro</p><h2 className="text-2xl font-bold mb-3">Kuasai skill lanjutan.<br/>Latih lebih terarah.</h2><p className="text-xs text-[#8A929C]">Front Lever, rutinitas lebih banyak, saran latihan berbasis preferensi, dan analitik lanjutan.</p><p className="text-xs text-[#FF7A03] font-bold mt-5"><span className="pro-price">Rp49.000</span><span className="pro-price-note">Harga Pro · pembayaran belum tersedia</span></p></section></div>
 <div className="overflow-x-auto"><table className="v3-feature-table"><caption className="sr-only">Perbandingan fitur Free dan Pro termasuk status integrasi</caption><thead><tr><th>Fitur</th><th>Free</th><th>Pro</th></tr></thead><tbody>{rows.map(([feature,free,pro])=><tr key={feature}><td>{feature}</td><td>{free}</td><td>{pro}</td></tr>)}</tbody></table></div>
 <Message>Ini adalah prototipe lokal. Paket uji saat ini: {state.testTier==='pro'?'Pro':'Free'}. Tidak ada langganan aktif, pembayaran, atau tagihan yang dibuat. Batas lokal dapat diubah melalui perangkat; penegakan produksi memerlukan backend terautentikasi.</Message><Link href="/profile" className="v3-text-link">Pengujian akses paket ada di Profil →</Link>
 <p className="text-xs text-[#8A929C] mt-4">Kuota AI tidak bergulir ke bulan berikutnya. Pro mendapat 5 total analisis, bukan tambahan 5. Video maksimal 30 detik; layanan analisis belum terhubung.</p>
 </Page>;}
