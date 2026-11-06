import {JSDOM,VirtualConsole} from 'jsdom';import fs from 'node:fs';import {webcrypto} from 'node:crypto';import assert from 'node:assert/strict';
const html=fs.readFileSync('dist/index.html','utf8');const script=html.match(/src="([^"]+\.js)"/)[1];const errors=[];const vc=new VirtualConsole();vc.on('error',(...e)=>{errors.push(e);console.error('CONSOLE',...e)});vc.on('jsdomError',e=>{errors.push(e);console.error('DOM ERROR',e)});
const dom=new JSDOM(html,{url:'https://streakin.test/#/library',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});const w=dom.window;w.fetch=fetch;w.Response=Response;w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;w.scrollTo=()=>{if(process.argv.includes('blocked-scroll'))throw Error('Scroll unavailable')};w.confirm=()=>true;w.alert=console.log;Object.defineProperty(w,'crypto',{value:webcrypto});
w.localStorage.setItem('streakin_training_v2',JSON.stringify({version:2,active:'a',profiles:[{id:'a',nama:'Athlete',email:'a@example.com',salt:'x',verifier:'x',library:null,skills:process.argv.includes('corrupt')?[null,'bad',{skillId:'l-sit',currentStage:'1',bestHoldSec:null}]:[],logs:[]}]}));w.eval(fs.readFileSync('dist'+script,'utf8'));const pause=()=>new Promise(r=>setTimeout(r,100));await pause();
async function go(hash){const a=[...w.document.querySelectorAll('a')].find(a=>a.getAttribute('href')===hash);assert.ok(a,'Link exists '+hash);a.click();await pause();assert.ok(!w.document.body.textContent.includes('Ada masalah saat membuka layar')&&!w.document.body.textContent.includes('Layar ini belum berhasil dimuat'),'No route crash');console.log('PASS DOM navigation',hash)}
console.log('INITIAL',w.document.body.textContent.slice(0,250));for(const h of ['#/skills','#/skills/l-sit','#/skills','#/skills/handstand','#/skills','#/skills/elbow-lever','#/library','#/home','#/library'])await go(h);const button=(label)=>[...w.document.querySelectorAll('button')].find(b=>b.textContent.includes(label));
assert.equal(w.document.querySelectorAll('main article').length,3,'Library starts with three skill boxes');
assert.ok(!w.document.body.textContent.includes('Program Sesi Tersedia'),'Stage/session checklist hidden on first screen');
button('Simpan Tahap Aktif').click();await pause();
assert.ok(w.document.body.textContent.includes('Tahap aktif ditambahkan'),'Skill library saves successfully');
await go('#/home');assert.ok(w.document.body.textContent.includes('Ringkasan')||w.document.querySelector('[aria-label="Ringkasan latihan"]'),'Dashboard overview exists');
await go('#/library');button('Gerakan').click();await pause();
assert.ok(w.document.querySelector('input[type="search"]'),'Exercise library search exists');
assert.ok(w.document.querySelectorAll('details').length>10,'Exercise technique details available');
const search=w.document.querySelector('input[type="search"]');const inputSetter=Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype,'value').set;
inputSetter.call(search,'definitely-no-exercise');search.dispatchEvent(new w.Event('input',{bubbles:true}));await pause();
assert.ok(w.document.body.textContent.includes('Gerakan tidak ditemukan'),'Search empty state');
button('Sesi Pendukung').click();await pause();
assert.ok(!w.document.body.textContent.includes('Mastery: Stage'),'Stage sessions stay inside skill details');
for(const skillId of ['l-sit','handstand','elbow-lever']) {
 await go('#/skills');await go('#/skills/'+skillId);
 const titles=new Set();
 for(let stage=1;stage<=5;stage++) {
  const stageButton=[...w.document.querySelectorAll('button')].find(b=>[...b.querySelectorAll('span')].some(span=>span.textContent.trim()==='Stage '+stage));
  assert.ok(stageButton,'Stage tab exists '+skillId+' '+stage);stageButton.click();await pause();
  assert.ok(w.document.body.textContent.includes('Stage '+stage+' dari 5'),'Selected stage changes');
  titles.add(w.document.querySelector('h3').textContent.trim());
 }
 assert.equal(titles.size,5,'Five distinct stage panels for '+skillId);
 const db=JSON.parse(w.localStorage.getItem('streakin_training_v2'));assert.ok(!db.profiles[0].skills.some(p=>p.currentStage>1),'Preview does not unlock stages');
}
await go('#/library');button('Sesi Pendukung').click();await pause();
const card=w.document.querySelector('div.card-surface.cursor-pointer');assert.ok(card,'Selectable session exists');card.click();await pause();assert.ok(!button('Simpan Library').disabled);button('Simpan Library').click();await pause();assert.equal(w.location.hash,'#/home');await go('#/skills');await go('#/skills/l-sit');await go('#/latihan/s_lsit_1');
for(let exercise=0;exercise<3;exercise++){for(let set=0;set<3;set++){const b=[...w.document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Selesai Set');assert.ok(b,'Set completion control exists');b.click();await pause()}button(exercise<2?'Gerakan Berikutnya':'Selesai Latihan & Simpan Progres').click();await pause()}
assert.ok(w.document.body.textContent.includes('Latihan Selesai!'),'Summary rendered');await go('#/riwayat');assert.ok(w.document.body.textContent.includes('Support Hold'),'Saved workout visible');await go('#/library');assert.ok(!w.document.body.textContent.includes('Layar ini belum berhasil dimuat'));assert.equal(errors.length,0,'No production DOM errors');console.log('PASS production DOM: skill-first library, save skill focus, dashboard, movement search/details, supporting sessions, log 9 sets, history');
// Public landing and its real navigation use the same compiled bundle.
const savedDb=JSON.parse(w.localStorage.getItem('streakin_training_v2'));savedDb.active=null;w.localStorage.setItem('streakin_training_v2',JSON.stringify(savedDb));dom.window.close();
const publicDom=new JSDOM(html,{url:'https://streakin.test/#/',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});const pw=publicDom.window;pw.fetch=fetch;pw.Response=Response;pw.TextEncoder=TextEncoder;pw.TextDecoder=TextDecoder;pw.scrollTo=()=>{};pw.localStorage.setItem('streakin_training_v2',JSON.stringify(savedDb));Object.defineProperty(pw,'crypto',{value:webcrypto});pw.eval(fs.readFileSync('dist'+script,'utf8'));await pause();
assert.ok(pw.document.querySelector('h1').textContent.includes('Skill pertamamu'),'Public landing hero');assert.equal(pw.document.querySelectorAll('#landing-skills article').length,3,'Landing skill previews');
let scrolled=false;pw.document.getElementById('landing-skills').scrollIntoView=()=>{scrolled=true};[...pw.document.querySelectorAll('button')].find(b=>b.textContent.includes('Jelajahi Skill')).click();assert.ok(scrolled,'Hero browse action scrolls to skills');
assert.equal(pw.document.querySelectorAll('a a').length,0,'No nested links');assert.equal(errors.length,0,'No production errors including public landing');publicDom.window.close();console.log('PASS public hero, scroll action, skill previews, valid links');
