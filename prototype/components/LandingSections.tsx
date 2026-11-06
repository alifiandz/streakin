import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, Flame, Timer } from 'lucide-react';
import { SkillLibrary } from './SkillLibrary';
import { SEED_EXERCISES, SEED_SESSIONS } from '@/lib/seedData';

const examples = [
  { minutes: 10, sessionId: 's4', note: 'Ada jeda sebentar? Mulai dari sesi full body yang singkat.' },
  { minutes: 15, sessionId: 's1', note: 'Satu sesi push untuk mengisi jeda sepulang sekolah.' },
  { minutes: 20, sessionId: 's5', note: 'Waktu lebih longgar untuk latihan tubuh bagian atas.' },
];
const faqs = [
  ['Belum pernah kalistenik. Bisa mulai?', 'Bisa. Baca panduan tahap pertama, mulai dari variasi yang lebih mudah, dan sesuaikan target dengan kemampuanmu. Jangan memaksakan gerakan yang belum terkontrol.'],
  ['Harus punya alat?', 'Kebutuhannya tergantung gerakan. Ada latihan lantai, latihan dengan dinding, dan latihan yang memerlukan tumpuan seperti parallettes. Siapkan area dan alat yang stabil sesuai petunjuk gerakan.'],
  ['Bagaimana cara naik tahap?', 'Setiap skill punya lima tahap dengan target dan kriteria tersendiri. Setelah memenuhi kriteria dengan teknik yang terkontrol, kamu dapat mengonfirmasi untuk naik ke tahap berikutnya.'],
  ['Apa yang disimpan dari latihanku?', 'Hasil set, riwayat sesi, Library, dan progres skill disimpan di perangkat/browser yang kamu pakai. Gunakan ekspor cadangan di pengaturan pengingat sebelum pindah perangkat atau menghapus data browser.'],
];

export function LandingSections() {
  const [selected, setSelected] = useState(1);
  const example = examples[selected];
  const session = SEED_SESSIONS.find(item => item.id === example.sessionId)!;

  function browse() {
    document.getElementById('landing-skills')?.scrollIntoView({
      behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  return <div className="landing-story">
    <div className="landing-bridge">
      <span>Kenali skillnya. Temukan ritmemu.</span>
      <button onClick={browse} type="button" className="inline-flex items-center gap-2 min-h-[44px] text-[#FF7A03] font-bold">Jelajahi Skill <ChevronDown className="w-4 h-4"/></button>
    </div>

    <section id="landing-skills" aria-labelledby="skills-heading" className="landing-section scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div><p className="landing-eyebrow">Pilih tantangan pertamamu</p><h2 id="skills-heading" className="landing-heading">Mau bisa yang mana?</h2></div>
        <p className="text-sm text-[#8A929C] max-w-sm leading-relaxed">Pilih satu skill. Di dalamnya ada lima tahapan, target latihan, dan panduan teknik yang bisa kamu ikuti.</p>
      </div>
      <SkillLibrary actions={false}/>
    </section>

    <section aria-labelledby="path-heading" className="landing-section landing-path">
      <div className="landing-path-art">
        <span className="landing-sticker">Satu tahap dulu.</span>
        <img src="/images/mascot/ppt-explain.png" alt="Orange Guy menjelaskan langkah latihan" className="w-full h-full object-contain" loading="lazy"/>
      </div>
      <div className="py-3 sm:py-6">
        <p className="landing-eyebrow">Dari penasaran ke mulai latihan</p>
        <h2 id="path-heading" className="landing-heading mb-6">Nggak perlu nebak<br/>langkah berikutnya.</h2>
        <ol className="landing-steps">
          {[
            ['01', 'Pilih skill & pahami tahapnya', 'Baca teknik, target, dan variasi yang lebih mudah sebelum mulai.'],
            ['02', 'Latihan, lalu catat setiap set', 'Gunakan timer tahanan dan jeda istirahat. Masukkan hasil yang benar-benar kamu capai.'],
            ['03', 'Lihat hasilnya. Lanjut saat siap.', 'Tinjau riwayat dan progres. Naik tahap setelah teknik dan kriteria sudah terpenuhi.'],
          ].map(([number, title, copy]) => <li key={number}>
            <span className="landing-step-number">{number}</span><div><h3 className="text-sm sm:text-base font-bold mb-1">{title}</h3><p className="text-xs sm:text-sm text-[#8A929C] leading-relaxed">{copy}</p></div>
          </li>)}
        </ol>
      </div>
    </section>

    <section aria-labelledby="time-heading" className="landing-section landing-session-grid">
      <div className="flex flex-col justify-center">
        <p className="landing-eyebrow">Ada waktu berapa menit?</p>
        <h2 id="time-heading" className="landing-heading mb-4">Latihan yang muat<br/>di sela harimu.</h2>
        <p className="text-sm text-[#8A929C] leading-relaxed max-w-sm mb-5">Nggak selalu punya waktu panjang? Lihat contoh sesi pendukung, pilih durasinya, dan kenali gerakannya dulu.</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Durasi contoh sesi">
          {examples.map((item, index) => <button key={item.minutes} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} className={`min-h-[48px] px-5 rounded-xl text-sm font-bold transition-colors ${selected === index ? 'bg-[#FF7A03] text-[#15171A]' : 'bg-[#23272D] border border-[#2E3238] text-[#8A929C] hover:text-[#EEF1F4]'}`}>{item.minutes} menit</button>)}
        </div>
        <p className="text-xs text-[#8A929C] mt-4">Durasi adalah perkiraan. Ambil jeda sesuai kebutuhanmu.</p>
      </div>
      <article className="landing-session-card" aria-live="polite" aria-atomic="true">
        <div className="flex items-center justify-between gap-3 mb-4"><span className="landing-eyebrow !mb-0">Contoh sesi · {session.fokus}</span><span className="landing-session-duration"><Timer className="w-4 h-4"/>{example.minutes}m</span></div>
        <h3 className="font-extrabold text-xl sm:text-2xl mb-2">{session.nama}</h3>
        <p className="text-xs text-[#8A929C] mb-4">{example.note}</p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {session.exercises.map(item => {
            const exercise = SEED_EXERCISES.find(ex => ex.id === item.exerciseId)!;
            return <div key={item.exerciseId} className="landing-exercise">
              <img src={exercise.imageUrl} alt={exercise.nama} className="w-full h-20 sm:h-24 object-contain mb-2" loading="lazy"/>
              <p className="text-xs font-bold">{exercise.nama}</p><p className="text-[11px] text-[#8A929C] mt-1">{item.sets} × {item.target} {item.unit === 'detik' ? 'dtk' : 'reps'}</p>
            </div>;
          })}
        </div>
        <Link href="/akun?tab=register" className="btn-brand min-h-[48px] flex items-center justify-center gap-2 text-sm font-bold">Mulai Latihan Sekarang <ArrowRight className="w-4 h-4"/></Link>
      </article>
    </section>

    <section aria-labelledby="habit-heading" className="landing-section landing-habit">
      <div>
        <p className="landing-eyebrow">Bikin progresmu kelihatan</p>
        <h2 id="habit-heading" className="landing-heading mb-4">Set kecil hari ini.<br/>Cerita panjang nanti.</h2>
        <p className="text-sm text-[#8A929C] leading-relaxed max-w-md mb-6">Catatan set, riwayat sesi, dan streak membantumu melihat kebiasaan yang sedang kamu bangun. Tetap beri tubuh waktu pulih.</p>
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-xs font-semibold">{['Catatan setiap set', 'Riwayat latihan', 'Pengingat pilihanmu'].map(text => <span key={text} className="flex items-center gap-2"><Check className="w-4 h-4 text-[#FF7A03]"/>{text}</span>)}</div>
        <div className="landing-week" aria-label="Contoh tampilan aktivitas mingguan, bukan data pengguna">
          <div className="flex justify-between items-center text-xs mb-4"><span className="font-bold flex items-center gap-2"><Flame className="w-4 h-4 text-[#FF7A03]"/>Ritme latihanmu</span><span className="text-[#8A929C]">Contoh tampilan</span></div>
          <div className="grid grid-cols-7 gap-2">{['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map((day,i)=><div key={day} className="text-center"><span className="text-[10px] text-[#8A929C] block mb-2">{day}</span><span className={`landing-day ${[0,2,4].includes(i)?'landing-day-done':''}`}>{[0,2,4].includes(i)?<Check className="w-4 h-4"/>:'·'}</span></div>)}</div>
        </div>
      </div>
      <div className="landing-habit-art"><span className="landing-sticker">Pelan-pelan. Tetap jalan.</span><img src="/images/mascot/ppt-celebrate.png" alt="Orange Guy merayakan progres latihan" className="w-full h-full object-contain" loading="lazy"/></div>
    </section>

    <section aria-labelledby="faq-heading" className="landing-section grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-6 sm:gap-12">
      <div><p className="landing-eyebrow">Sebelum mulai</p><h2 id="faq-heading" className="landing-heading">Masih penasaran?</h2><p className="text-sm text-[#8A929C] mt-4 leading-relaxed">Beberapa hal yang mungkin ingin kamu tahu sebelum latihan pertama.</p></div>
      <div>{faqs.map(([question,answer])=><details key={question} className="landing-faq"><summary>{question}<ChevronDown className="w-4 h-4 flex-shrink-0 text-[#FF7A03]"/></summary><p className="text-sm text-[#8A929C] leading-relaxed pb-5 pr-5">{answer}</p></details>)}</div>
    </section>

    <section className="landing-final" aria-labelledby="final-heading">
      <div><p className="landing-eyebrow">Orange Guy sudah siap.</p><h2 id="final-heading" className="landing-heading mb-3">Sekarang giliranmu.</h2><p className="text-sm text-[#8A929C] mb-6">Satu skill, satu sesi, satu langkah pertama.</p><Link href="/akun?tab=register" className="btn-brand min-h-[50px] px-7 inline-flex items-center justify-center gap-2 text-sm font-bold">Buat Akun Gratis <ArrowRight className="w-4 h-4"/></Link></div>
      <img src="/images/mascot/ppt-welcome.png" alt="Orange Guy menyambut teman latihan baru" className="w-40 h-40 sm:w-56 sm:h-56 object-contain" loading="lazy"/>
    </section>

    <footer className="landing-footer">
      <div><p className="font-bold text-sm text-[#EEF1F4] mb-1">Streak<span className="text-[#FF7A03]">In</span></p><p>Kawan kalistenik pelajar produktif.</p></div>
      <nav aria-label="Tautan footer" className="flex gap-5"><Link href="/library" className="min-h-[44px] flex items-center hover:text-[#FF7A03]">Library</Link><Link href="/akun?tab=login" className="min-h-[44px] flex items-center hover:text-[#FF7A03]">Masuk</Link></nav>
      <p className="basis-full text-[11px] leading-relaxed text-[#8A929C]">Mulai sesuai kemampuan. Hentikan gerakan jika terasa nyeri dan siapkan tumpuan yang stabil. StreakIn bukan pengganti pendampingan tenaga kesehatan.</p>
      <p className="text-[11px] text-[#8A929C]">© 2026 StreakIn</p>
    </footer>
  </div>;
}
