export interface SkillStage {
  stageNumber: number; // 1 to 5
  nama: string;
  deskripsi: string;
  targetHoldSec: number;
  targetSets: number;
  syaratLulus: string;
  langkah: string[];
  kesalahanUmum: string[];
  tipsAman: string;
  lebihMudah: string;
  lebihSulit: string;
  imageUrl?: string;
}

export interface Skill {
  id: string; // 'l-sit', 'handstand', 'front-lever'
  nama: string;
  kategori: string;
  level: 'Pemula' | 'Menengah' | 'Lanjutan';
  badgeColor: string;
  deskripsi: string;
  manfaatSiswa: string;
  durasiMingguEstimasi: string;
  catatanAman?: string;
  stages: SkillStage[];
}

export interface Exercise {
  id: string;
  nama: string;
  area: string;
  targetDefault: string;
  langkah: string[];
  kesalahanUmum: string[];
  lebihMudah: string;
  lebihSulit: string;
  isTimeBased?: boolean;
  imageUrl?: string;
}

export interface SessionExercise {
  exerciseId: string;
  exerciseName?: string;
  sets: number;
  target: number; // reps or seconds
  unit: 'reps' | 'detik';
  istirahatDetik: number;
  isIsometric?: boolean;
}

export interface WorkoutSession {
  id: string;
  nama: string;
  durasiMenit: number;
  fokus: 'Push' | 'Legs' | 'Pull dan core' | 'Full body' | 'Skill Mastery';
  skillId?: string;
  stageNumber?: number;
  exercises: SessionExercise[];
}

// ==========================================
// 1. DATA 3 SKILL UTAMA & 5 STAGE PROGRESI
// ==========================================
export const SEED_SKILLS: Skill[] = [
  // 1. L-SIT PROGRESSION
  {
    id: 'l-sit',
    nama: 'L-Sit',
    kategori: 'Perut & Bahu Kokoh',
    level: 'Pemula',
    badgeColor: '#FF7A03',
    deskripsi: 'Fondasi kekuatan inti statis dan bahu untuk menopang seluruh badan melayang membentuk huruf L sempurna tanpa alat gym.',
    manfaatSiswa: 'Bikin postur duduk seharian di kelas jadi tegap dan kuatkan otot perut bawah tanpa perlu alat gym mahal.',
    durasiMingguEstimasi: '4–8 Minggu',
    catatanAman: 'Wajib senam pergelangan tangan (putar pergelangan & lemaskan jari) 1–2 menit sebelum mulai. Jaga siku tetap lurus kokoh tanpa menguncinya berlebihan sampai ngilu.',
    stages: [
      {
        stageNumber: 1,
        nama: 'Support Hold (Tumpuan Bahu Kokoh)',
        imageUrl: '/images/skills/lsit-skill-support-hold.png',
        deskripsi: 'Menopang badan di atas dua kursi kokoh atau parallette dengan lengan lurus dan bahu ditekan kuat ke bawah menjauhi telinga.',
        targetHoldSec: 30,
        targetSets: 3,
        syaratLulus: 'Tahan 30 detik × 3 set dengan bahu kokoh stabil (dada terbuka, leher tidak tenggelam di antara bahu).',
        langkah: [
          'Letakkan telapak tangan pada dua kursi stabil atau parallettes setinggi pinggang.',
          'Kunci siku lurus, dorong bahu kuat ke bawah menjauh dari telinga.',
          'Kencangkan perut dan tahan tubuh melayang dengan kaki ditekuk atau rileks.',
          'Bernapas teratur dan santai, jangan menahan napas.'
        ],
        kesalahanUmum: [
          'Bahu membungkuk naik mendekati telinga (leher tenggelam).',
          'Siku menekuk karena tangan lelah.'
        ],
        tipsAman: 'Pastikan dua kursi tumpuan kokoh dan tidak licin di lantai.',
        lebihMudah: 'Ujung jari kaki menapak ringan di lantai (Foot-assisted).',
        lebihSulit: 'Support Hold sambil mengangkat satu lutut bergantian.'
      },
      {
        stageNumber: 2,
        nama: 'Tuck L-Sit (Lutut Rapat ke Dada)',
        imageUrl: '/images/skills/lsit-skill-tuck-hold.png',
        deskripsi: 'Menopang tubuh melayang dengan kedua lutut ditarik rapat ke dada tanpa menyentuh lantai.',
        targetHoldSec: 20,
        targetSets: 3,
        syaratLulus: 'Tahan 20 detik × 3 set tanpa kaki menyentuh lantai dan posisi lutut tetap tinggi di dada.',
        langkah: [
          'Dari posisi support hold, dorong telapak tangan kuat ke bawah.',
          'Tarik kedua lutut ke arah dada setinggi mungkin.',
          'Pertahankan pinggul sejajar atau sedikit di depan garis tangan.',
          'Kencangkan perut bawah dan paha depan selama target detik.'
        ],
        kesalahanUmum: [
          'Punggung atas terlalu bungkuk hingga dada tertekan.',
          'Lutut perlahan melorot turun mendekati lantai.'
        ],
        tipsAman: 'Kencangkan otot perut bawah seperti saat menahan batuk.',
        lebihMudah: 'Satu lutut di dada, satu kaki menjulur ke bawah menyentuh lantai.',
        lebihSulit: 'Buka sudut paha sedikit lebih jauh dari dada (Advanced Tuck).'
      },
      {
        stageNumber: 3,
        nama: 'One-Leg L-Sit (Satu Kaki Lurus)',
        imageUrl: '/images/skills/lsit-skill-single-leg-hold.png',
        deskripsi: 'Satu kaki dijulurkan lurus ke depan sejajar lantai, sementara satu kaki tetap ditarik rapat di dada. Dilatih bergantian.',
        targetHoldSec: 15,
        targetSets: 3,
        syaratLulus: 'Tahan 15 detik per kaki × 3 set dengan kaki lurus tidak melorot di bawah garis pinggang.',
        langkah: [
          'Mulai dari posisi Tuck L-Sit di atas tumpuan.',
          'Julurkan satu kaki lurus ke depan sejajar lantai dengan ujung jari runcing.',
          'Kencangkan otot paha depan kaki yang lurus agar lutut tidak menekuk.',
          'Ganti kaki yang dijulurkan pada set berikutnya.'
        ],
        kesalahanUmum: [
          'Kaki yang lurus turun di bawah ketinggian panggul.',
          'Badan rebah ke belakang untuk mengimbangi beban.'
        ],
        tipsAman: 'Lakukan peregangan paha belakang sebelum latihan biar paha depan tidak kram.',
        lebihMudah: 'Julurkan kaki sedikit lebih rendah (sudut 45 derajat).',
        lebihSulit: 'Ganti kaki lurus bergantian di udara secara perlahan.'
      },
      {
        stageNumber: 4,
        nama: 'Straddle L-Sit (Kaki Dibuka Lebar)',
        imageUrl: '/images/skills/lsit-skill-adv-tuck.png',
        deskripsi: 'Kedua kaki lurus dan dibuka melebar ke samping kiri-kanan untuk meringankan beban tuas sebelum merapatkan kaki.',
        targetHoldSec: 15,
        targetSets: 3,
        syaratLulus: 'Tahan 15 detik × 3 set dengan kedua lutut lurus terkunci dan pantat melayang bersih.',
        langkah: [
          'Tekan tangan kuat ke bawah pada tumpuan atau lantai.',
          'Buka kedua kaki lurus melebar ke samping kiri dan kanan.',
          'Angkat kedua kaki melayang sejajar lantai dengan mengencangkan perut dan paha.',
          'Kunci siku dan dorong bahu aktif ke bawah.'
        ],
        kesalahanUmum: [
          'Lutut menekuk karena paha belakang kaku.',
          'Pinggul menyentuh lantai atau tumpuan.'
        ],
        tipsAman: 'Buka kaki selebar yang nyaman untukmu, jangan paksakan rentang pinggul.',
        lebihMudah: 'Buka kaki lebih lebar agar beban tuas terasa lebih ringan.',
        lebihSulit: 'Rapatkan kaki perlahan mendekati posisi L-sit lurus.'
      },
      {
        stageNumber: 5,
        nama: 'Full L-Sit (Bentuk L Sempurna)',
        imageUrl: '/images/skills/lsit-skill-full-hold.png',
        deskripsi: 'Bentuk huruf L sempurna: kedua kaki rapat lurus ke depan sejajar lantai membentuk sudut 90 derajat terhadap tubuh.',
        targetHoldSec: 10,
        targetSets: 3,
        syaratLulus: 'Tahan 10 detik penuh × 3 set dengan kedua kaki lurus rapat setinggi panggul tanpa menyentuh lantai.',
        langkah: [
          'Tekan kedua telapak tangan ke tumpuan atau lantai.',
          'Kunci siku lurus, tekan bahu kuat ke bawah menjauhi telinga.',
          'Rapatkan kedua kaki dan angkat lurus ke depan setinggi panggul.',
          'Bernapas terkontrol dan kunci seluruh tubuh layaknya papan.'
        ],
        kesalahanUmum: [
          'Pinggul bergeser mundur ke belakang garis tangan.',
          'Lutut menekuk di detik-detik akhir.'
        ],
        tipsAman: 'Gunakan parallettes atau tumpuan jika pergelangan tangan mulai terasa lelah di lantai datar.',
        lebihMudah: 'Tahan 5 detik dengan form sempurna.',
        lebihSulit: 'Angkat kaki sedikit lebih tinggi menuju bentuk V-Sit.'
      }
    ]
  },

  // 2. HANDSTAND PROGRESSION
  {
    id: 'handstand',
    nama: 'Handstand',
    kategori: 'Bahu & Keseimbangan',
    level: 'Menengah',
    badgeColor: '#FF7A03',
    deskripsi: 'Berdiri dengan kedua tangan melawan gravitasi, melatih kestabilan bahu, kekuatan inti tubuh, dan fokus mental.',
    manfaatSiswa: 'Memicu fokus belajar dan melatih rasa percaya diri mengatasi rasa takut jatuh.',
    durasiMingguEstimasi: '6–12 Minggu',
    catatanAman: 'Wajib senam pergelangan tangan (wrist circles & palm pulses) 2 menit sebelum mulai. Pastikan area sekitar dinding bersih dari barang tajam atau ujung meja kamar kos.',
    stages: [
      {
        stageNumber: 1,
        nama: 'Wall Walk Hold (Merayap di Dinding)',
        imageUrl: '/images/skills/hs-skill-chest-to-wall.png',
        deskripsi: 'Merangkak mundur dengan kaki naik ke dinding bertahap untuk membangun kekuatan dorong bahu dan adaptasi posisi tubuh terbalik.',
        targetHoldSec: 30,
        targetSets: 3,
        syaratLulus: 'Tahan 30 detik × 3 set dengan siku terkunci lurus dan napas tetap teratur santai.',
        langkah: [
          'Mulai dari posisi push-up dengan kaki menyentuh dinding kamar.',
          'Langkahkan satu per satu kaki naik ke dinding sambil tangan mundur mendekat.',
          'Kunci siku lurus dan dorong lantai sekuat tenaga ke arah bawah.',
          'Tahan posisi selama target detik lalu turun perlahan melangkah maju.'
        ],
        kesalahanUmum: [
          'Punggung melengkung berlebihan menyerupai pisang.',
          'Siku menekuk karena kaget menahan beban tubuh.'
        ],
        tipsAman: 'Pastikan dinding bersih dan pakai kaos kaki agar kaki tidak selip di tembok.',
        lebihMudah: 'Berhenti di sudut 45 derajat (tangan berjarak 1 meter dari dinding).',
        lebihSulit: 'Mundur hingga tangan berjarak 20 cm dari dinding.'
      },
      {
        stageNumber: 2,
        nama: 'Chest-to-Wall Handstand (Dada Menghadap Dinding)',
        imageUrl: '/images/skills/hs-support-scapular-handstand-shrugs.png',
        deskripsi: 'Merapat ke dinding hingga dada dan ujung jari kaki hampir menempel. Ini posisi paling ideal untuk melatih garis tubuh tegak lurus.',
        targetHoldSec: 40,
        targetSets: 3,
        syaratLulus: 'Tahan 40 detik × 3 set dengan garis tubuh lurus (perut dan bokong dikencangkan, bukan pinggang melengkung).',
        langkah: [
          'Lakukan wall walk hingga dada berjarak 10–20 cm dari dinding.',
          'Arahkan pandangan santai ke antara kedua ibu jari tangan.',
          'Kencangkan perut dan bokong, rapatkan kedua kaki, jari kaki menunjuk ke atas.',
          'Dorong lantai aktif ke bawah seolah ingin mendorong lantai menjauh.'
        ],
        kesalahanUmum: [
          'Kepala menengadah terlalu jauh ke depan sehingga leher tegang.',
          'Menahan napas sampai pusing.'
        ],
        tipsAman: 'Sisakan tenaga 5 detik sebelum capek total agar bisa melangkah turun ke depan dengan aman.',
        lebihMudah: 'Beri jarak tangan 30–40 cm dari dinding.',
        lebihSulit: 'Lepaskan satu kaki melayang perlahan di udara.'
      },
      {
        stageNumber: 3,
        nama: 'Toe Taps Keseimbangan (Sentuhan Ringan Dinding)',
        imageUrl: '/images/skills/hs-skill-heel-pulls.png',
        deskripsi: 'Menghadap luar dengan punggung dekat dinding, lepas ujung kaki bergantian untuk melatih cengkeraman jari tangan sebagai rem keseimbangan.',
        targetHoldSec: 30,
        targetSets: 3,
        syaratLulus: 'Tahan 30 detik (10 sentuhan ringan bergantian) × 3 set dengan jari tangan aktif mencengkeram lantai.',
        langkah: [
          'Tendang kaki ke dinding dengan punggung menghadap dinding.',
          'Cengkeram lantai dengan ujung jari-jari tangan seperti mencakar karpet.',
          'Tarik satu tumit menjauhi dinding secara halus sampai menemukan titik seimbang.',
          'Sentuh dinding kembali perlahan dan gantikan dengan kaki satunya.'
        ],
        kesalahanUmum: [
          'Menendang terlalu keras sampai dinding terbanting.',
          'Telapak tangan rata tanpa mencengkeram lantai dengan jari.'
        ],
        tipsAman: 'Gunakan bantalan jari tangan sebagai rem utama saat tubuh condong ke depan.',
        lebihMudah: 'Lepas tumit hanya 2–3 cm dari dinding selama 2 detik.',
        lebihSulit: 'Lepas kedua tumit bersamaan melayang bebas selama 3–5 detik.'
      },
      {
        stageNumber: 4,
        nama: 'Kick-Up Terkontrol (Ayunan Lembut ke Dinding)',
        imageUrl: '/images/skills/hs-support-pike-pushups.png',
        deskripsi: 'Melatih ayunan satu kaki naik dari lantai ke dinding secara lembut tanpa membentur tembok kamar kos dengan suara keras.',
        targetHoldSec: 20,
        targetSets: 3,
        syaratLulus: '5 kali tendangan bersih berturut-turut yang mendarat halus di dinding dengan tahan mandiri minimal 3 detik.',
        langkah: [
          'Satu kaki di depan, posisikan bahu tepat di atas telapak tangan.',
          'Ayunkan kaki belakang ke atas secara terukur sementara kaki depan mendorong ringan.',
          'Rapatkan kedua kaki di titik puncak sebelum menyentuh dinding.',
          'Tahan seimbang selama mungkin sebelum tumit menyentuh dinding kamar.'
        ],
        kesalahanUmum: [
          'Tendangan terlalu keras sehingga membentur dinding dengan berisik.',
          'Siku menekuk saat kaki mengayun naik.'
        ],
        tipsAman: 'Kunci siku lurus kokoh sebelum kaki meninggalkan lantai.',
        lebihMudah: 'Latihan di depan kasur atau matras busa.',
        lebihSulit: 'Kick-up di ruang terbuka dengan bersiap teknik putar pinggul (bail).'
      },
      {
        stageNumber: 5,
        nama: 'Freestanding Handstand (Berdiri Tangan Mandiri)',
        imageUrl: '/images/skills/hs-skill-kick-up-reps.png',
        deskripsi: 'Berdiri dengan kedua tangan di lantai terbuka tanpa dinding penopang, menyeimbangkan tubuh murni lewat kekuatan bahu dan cengkeraman jari.',
        targetHoldSec: 10,
        targetSets: 3,
        syaratLulus: 'Tahan 10 detik mandiri di ruang terbuka × 3 set dengan posisi tubuh tegak seimbang.',
        langkah: [
          'Lakukan ayunan naik terkontrol di area lantai yang lapang.',
          'Gunakan cengkeraman jari tangan untuk mengoreksi keseimbangan secara halus.',
          'Kencangkan perut, rapatkan paha, dan dorong bahu aktif ke atas.',
          'Tahan garis lurus stabil dari pergelangan tangan sampai ujung kaki.'
        ],
        kesalahanUmum: [
          'Kaki membuka dan goyang tidak terkendali.',
          'Lupa bernapas saat menahan posisi.'
        ],
        tipsAman: 'Kuasai teknik putar pinggul ke samping untuk mendarat aman jika badan condong kelewat jauh.',
        lebihMudah: 'Target 5 detik hold mandiri terlebih dahulu.',
        lebihSulit: 'Lakukan Handstand Shoulder Taps atau Handstand Push-up.'
      }
    ]
  },

  // 3. ELBOW LEVER PROGRESSION
  {
    id: 'elbow-lever',
    nama: 'Elbow Lever',
    kategori: 'Keseimbangan & Pergelangan',
    level: 'Pemula',
    badgeColor: '#FF7A03',
    deskripsi: 'Menopang seluruh tubuh horizontal lurus di atas dua tumpuan siku tangan. Sangat estetik, ramah kamar kos, dan melatih keseimbangan dasar tubuh.',
    manfaatSiswa: 'Melatih koordinasi otot seluruh badan dari tangan sampai kaki, serta seru dicoba di kamar kos tanpa alat apa pun.',
    durasiMingguEstimasi: '4–8 Minggu',
    catatanAman: 'Gunakan bantal empuk di lantai depan muka saat baru belajar agar tidak takut terbentur. Lemaskan pergelangan tangan secara bertahap karena telapak tangan memutar ke arah samping/belakang.',
    stages: [
      {
        stageNumber: 1,
        nama: 'Plank Tumpuan Siku Masuk (Plank Lean)',
        imageUrl: '/images/skills/fl-support-straight-arm-pulldowns.png',
        deskripsi: 'Membiasakan telapak tangan diputar mengarah ke samping/belakang dan siku ditekuk menempel dekat pinggul sambil menahan posisi plank.',
        targetHoldSec: 30,
        targetSets: 3,
        syaratLulus: 'Tahan 30 detik × 3 set dengan telapak tangan memutar nyaman tanpa ngilu di pergelangan.',
        langkah: [
          'Mulai dari posisi push-up dengan telapak tangan diputar menghadap ke samping atau belakang.',
          'Tekuk siku sedikit dan tempelkan ke area pinggul samping.',
          'Condongkan tubuh sedikit ke depan sambil menahan berat badan di telapak tangan.',
          'Tahan selama target detik sambil mengatur napas santai.'
        ],
        kesalahanUmum: [
          'Langsung memutar tangan 180 derajat ke belakang secara paksa.',
          'Pinggul melorot ke lantai.'
        ],
        tipsAman: 'Mulai dengan sudut miring 45 derajat dulu jika pergelangan tangan masih kaku.',
        lebihMudah: 'Lakukan dengan lutut menempel di lantai.',
        lebihSulit: 'Condongkan badan lebih maju ke depan.'
      },
      {
        stageNumber: 2,
        nama: 'Knee Elbow Lever (Tumpuan Lutut di Lantai)',
        imageUrl: '/images/skills/fl-skill-tuck-hold.png',
        deskripsi: 'Tancapkan kedua siku pas di samping pusar atau tulang pinggul depan, lalu condongkan dada ke depan sementara lutut tetap di lantai.',
        targetHoldSec: 20,
        targetSets: 3,
        syaratLulus: 'Tahan 20 detik × 3 set dengan badan seimbang stabil di atas tumpuan siku.',
        langkah: [
          'Berlutut di lantai dengan kedua siku ditekuk dan diselipkan di bawah pinggul/perut samping.',
          'Condongkan dada dan kepala ke depan ke arah bantal penahan.',
          'Rilekskan kaki di lantai sementara siku menahan sebagian besar berat badanmu.',
          'Tahan posisi seimbang stabil selama target detik.'
        ],
        kesalahanUmum: [
          'Posisi siku meleset melebar ke samping luar tubuh.',
          'Kepala terlalu menunduk ke lantai.'
        ],
        tipsAman: 'Tancapkan siku rapat ke titik tengah tubuh agar tidak goyah.',
        lebihMudah: 'Letakkan kepala bersandar ringan di atas bantal empuk.',
        lebihSulit: 'Angkat satu lutut melayang beberapa centimeter dari lantai.'
      },
      {
        stageNumber: 3,
        nama: 'Tuck Elbow Lever (Kedua Lutut Melayang)',
        imageUrl: '/images/skills/fl-skill-adv-tuck-hold.png',
        deskripsi: 'Dari tumpuan siku di pinggul, condongkan dada sedikit lebih maju dan angkat kedua lutut melayang sepenuhnya dari lantai.',
        targetHoldSec: 15,
        targetSets: 3,
        syaratLulus: 'Tahan 15 detik × 3 set dengan seluruh kaki melayang bebas tanpa menyentuh lantai.',
        langkah: [
          'Kunci siku di bawah pinggul dan condongkan dada ke depan.',
          'Tarik kedua lutut ditekuk mendekati perut dan angkat kedua kaki dari lantai.',
          'Temukan titik jungkat-jungkit seimbang antara kepala di depan dan lutut di belakang.',
          'Tahan kontraksi perut dan jangan menahan napas.'
        ],
        kesalahanUmum: [
          'Takut condong ke depan sehingga kaki tidak bisa terangkat.',
          'Siku bergeser lepas dari pinggul.'
        ],
        tipsAman: 'Kuncinya ada pada kecondongan kepala ke depan sebagai penyeimbang berat kaki.',
        lebihMudah: 'Angkat satu kaki bergantian.',
        lebihSulit: 'Buka lutut sedikit lebih mundur dari dada.'
      },
      {
        stageNumber: 4,
        nama: 'Straddle Elbow Lever (Kaki Dibuka Lebar)',
        imageUrl: '/images/skills/fl-skill-straddle-single-leg.png',
        deskripsi: 'Luruskan kedua kaki melebar ke samping kiri-kanan di udara. Membuka kaki membuat titik berat lebih pendek dan jauh lebih stabil.',
        targetHoldSec: 15,
        targetSets: 3,
        syaratLulus: 'Tahan 15 detik × 3 set dengan tubuh horizontal dan kedua kaki lurus melebar di udara.',
        langkah: [
          'Dari posisi tuck, luruskan kedua kaki terbuka lebar ke samping kiri dan kanan.',
          'Kencangkan otot pantat dan punggung bawah untuk menahan kaki tetap horizontal.',
          'Jaga dada tetap terangkat dan pandangan sedikit ke depan lantai.',
          'Tahan posisi seimbang stabil selama target detik.'
        ],
        kesalahanUmum: [
          'Kaki terkulai turun di bawah garis horizontal pinggul.',
          'Lutut menekuk lemas.'
        ],
        tipsAman: 'Buka kaki selebar mungkin agar beban tubuh terasa lebih ringan diseimbangkan.',
        lebihMudah: 'Buka kaki sangat lebar dan tahan 8–10 detik.',
        lebihSulit: 'Rapatkan kaki sedikit demi sedikit menuju posisi lurus rapat.'
      },
      {
        stageNumber: 5,
        nama: 'Full Elbow Lever (Tubuh Lurus Horizontal)',
        imageUrl: '/images/skills/fl-skill-full-lever-hold.png',
        deskripsi: 'Skill puncak Elbow Lever: kedua kaki rapat lurus horizontal sejajar lantai layaknya papan melayang di atas tumpuan siku tanganmu.',
        targetHoldSec: 10,
        targetSets: 3,
        syaratLulus: 'Tahan 10 detik penuh × 3 set dengan tubuh lurus rata sejajar lantai dari kepala sampai jari kaki.',
        langkah: [
          'Tancapkan kedua siku rapat di bawah pinggul depan.',
          'Condongkan dada ke depan sambil meluruskan kedua kaki rapat sempurna ke belakang.',
          'Kunci seluruh otot tubuh: perut, pantat, dan paha dalam satu garis lurus horizontal.',
          'Tahan keseimbangan penuh selama 10 detik dengan napas terkontrol.'
        ],
        kesalahanUmum: [
          'Kaki melorot ke bawah garis pinggang.',
          'Badan miring ke satu sisi.'
        ],
        tipsAman: 'Jangan menahan napas terlalu kencang; bernapaslah pendek dan teratur.',
        lebihMudah: 'Tahan 5 detik bersih dengan tubuh lurus rata.',
        lebihSulit: 'Coba lakukan variasi satu tangan (One-Arm Elbow Lever) di kemudian hari.'
      }
    ]
  }
];// ==========================================
// 2. DATA GERAKAN WORKOUT (EXERCISES)
// ==========================================
export const SEED_EXERCISES: Exercise[] = [
  {
    id: 'ex1',
    nama: 'Support Hold',
    area: 'Bahu, triceps & core',
    imageUrl: '/images/skills/lsit-skill-support-hold.png',
    targetDefault: '3 x 30 dtk',
    langkah: [
      'Tangan di atas dua kursi kokoh atau parallettes setinggi pinggul.',
      'Kunci siku lurus 100%, tekan bahu aktif menjauh dari telinga.',
      'Angkat tubuh melayang dengan kaki ditekuk atau rileks.',
      'Tahan selama target detik sambil bernapas stabil.'
    ],
    kesalahanUmum: [
      'Bahu membungkuk ke atas mendekati telinga.',
      'Siku ditekuk.'
    ],
    lebihMudah: 'Foot-assisted Support Hold',
    lebihSulit: 'Tuck L-Sit',
    isTimeBased: true,
  },
  {
    id: 'ex2',
    nama: 'Tuck L-Sit',
    area: 'Perut bawah & hip flexors',
    imageUrl: '/images/skills/lsit-skill-tuck-hold.png',
    targetDefault: '3 x 20 dtk',
    langkah: [
      'Dari support hold, dorong tangan kuat ke bawah.',
      'Tarik kedua lutut rapat mendekati dada setinggi mungkin.',
      'Pertahankan panggul sejajar garis tangan.',
      'Tahan kontraksi perut dan paha depan.'
    ],
    kesalahanUmum: [
      'Lutut melorot turun ke bawah.',
      'Punggung atas terlalu bungkuk.'
    ],
    lebihMudah: 'One-Leg Tuck L-Sit',
    lebihSulit: 'Full L-Sit',
    isTimeBased: true,
  },
  {
    id: 'ex3',
    nama: 'Wall Walk Hold',
    area: 'Bahu & scapula',
    imageUrl: '/images/skills/hs-skill-chest-to-wall.png',
    targetDefault: '3 x 30 dtk',
    langkah: [
      'Posisi push-up membelakangi dinding kamar.',
      'Langkahkan kaki naik ke dinding bertahap sambil tangan mundur mendekat.',
      'Kunci siku lurus dan dorong lantai sekuat mungkin.',
      'Tahan posisi lurus lalu turun melangkah maju.'
    ],
    kesalahanUmum: [
      'Punggung melengkung berlebihan (banana back).',
      'Siku ditekuk.'
    ],
    lebihMudah: 'Diagonal Wall Walk (sudut 45 derajat)',
    lebihSulit: 'Chest-to-Wall Handstand Hold',
    isTimeBased: true,
  },
  {
    id: 'ex4',
    nama: 'Chest-to-Wall Handstand',
    area: 'Bahu, wrist & core',
    imageUrl: '/images/skills/hs-support-scapular-handstand-shrugs.png',
    targetDefault: '3 x 45 dtk',
    langkah: [
      'Lakukan wall walk hingga dada berada 15-20 cm dari dinding.',
      'Pandangan ke antara kedua jempol tangan.',
      'Kencangkan perut dan pantat, dorong lantai aktif.',
      'Tahan selama target detik lalu turun terkontrol.'
    ],
    kesalahanUmum: [
      'Kepala menengadah terlalu jauh.',
      'Menahan napas.'
    ],
    lebihMudah: 'Wall Walk Hold',
    lebihSulit: 'Back-to-Wall Toe Taps',
    isTimeBased: true,
  },
  {
    id: 'ex5',
    nama: 'Inverted Hang',
    area: 'Lats & posterior chain',
    imageUrl: '/images/skills/fl-support-straight-arm-pulldowns.png',
    targetDefault: '3 x 30 dtk',
    langkah: [
      'Gantung pada palang dengan tangan selebar bahu.',
      'Tarik lutut dan putar pinggul ke atas hingga tubuh terbalik tegak.',
      'Kunci siku lurus dan bahu aktif.',
      'Tahan tubuh stabil tanpa mengayun.'
    ],
    kesalahanUmum: [
      'Bahu pasif lemas.',
      'Mengayun tidak stabil.'
    ],
    lebihMudah: 'Low bar Inverted Hang',
    lebihSulit: 'Tuck Front Lever',
    isTimeBased: true,
  },
  {
    id: 'ex6',
    nama: 'Tuck Front Lever',
    area: 'Punggung atas & lats',
    imageUrl: '/images/skills/fl-skill-tuck-hold.png',
    targetDefault: '3 x 20 dtk',
    langkah: [
      'Dorong palang ke arah paha dengan lengan lurus terkunci.',
      'Tarik lutut rapat ke dada dan luruskan punggung sejajar lantai.',
      'Retraksi tulang belikat ke belakang dan bawah.',
      'Tahan posisi horizontal selama target detik.'
    ],
    kesalahanUmum: [
      'Pinggul melorot ke bawah garis horizontal.',
      'Siku ditekuk.'
    ],
    lebihMudah: 'Inverted Hang',
    lebihSulit: 'Advanced Tuck Front Lever',
    isTimeBased: true,
  },
  {
    id: 'ex7',
    nama: 'Push-up',
    area: 'Dada, bahu & triceps',
    imageUrl: '/images/exercises/push-up-low.png',
    targetDefault: '3 x 8 reps',
    langkah: [
      'Tangan sedikit lebih lebar dari bahu, telapak rata di lantai.',
      'Badan lurus sempurna dari kepala hingga tumit.',
      'Turunkan dada mendekati lantai, posisi siku 45 derajat.',
      'Dorong kembali ke atas sambil menghembuskan napas.'
    ],
    kesalahanUmum: [
      'Pinggul turun atau terlalu naik.',
      'Siku melebar 90 derajat.'
    ],
    lebihMudah: 'Incline push-up',
    lebihSulit: 'Diamond push-up',
    isTimeBased: false,
  },
  {
    id: 'ex8',
    nama: 'Incline push-up',
    area: 'Dada, bahu & triceps',
    imageUrl: '/images/exercises/incline-push-up-low.png',
    targetDefault: '3 x 10 reps',
    langkah: [
      'Telapak tangan pada permukaan meja/kursi stabil.',
      'Tubuh membentuk garis lurus diagonal.',
      'Turunkan dada perlahan menuju tepi tumpuan.',
      'Dorong tubuh kembali ke atas dengan kontrol penuh.'
    ],
    kesalahanUmum: [
      'Pinggul kendor ke bawah.',
      'Gerakan terlalu terburu-buru.'
    ],
    lebihMudah: 'Wall push-up',
    lebihSulit: 'Regular Push-up',
    isTimeBased: false,
  },
  {
    id: 'ex9',
    nama: 'Dead Bug',
    area: 'Core & hip flexors',
    imageUrl: '/images/exercises/dead-bug-start.png',
    targetDefault: '3 x 8 reps',
    langkah: [
      'Berbaring telentang, punggung bawah menempel rata di lantai.',
      'Rentangkan tangan lurus ke atas dan lutut ditekuk 90 derajat.',
      'Turunkan tangan kanan dan kaki kiri bersamaan mendekati lantai.',
      'Kembali ke posisi awal dan ganti sisi sebaliknya.'
    ],
    kesalahanUmum: [
      'Punggung bawah melengkung terangkat dari lantai.',
      'Leher tegang ke depan.'
    ],
    lebihMudah: 'Bent-knee tap (kaki ditekuk turun)',
    lebihSulit: 'Hollow Body Hold',
    isTimeBased: false,
  },
  {
    id: 'ex10',
    nama: 'Plank',
    area: 'Core & abs',
    imageUrl: '/images/exercises/forearm-plank.png',
    targetDefault: '3 x 30 dtk',
    langkah: [
      'Tumpuan pada siku dan lengan bawah, siku tepat di bawah bahu.',
      'Tubuh lurus sempurna dari kepala hingga tumit.',
      'Kencangkan perut dan bokong secara konstan.',
      'Bernapas teratur tanpa menahan napas.'
    ],
    kesalahanUmum: [
      'Pinggul melorot ke bawah.',
      'Kepala menunduk ke lantai.'
    ],
    lebihMudah: 'Knee plank',
    lebihSulit: 'Plank shoulder taps',
    isTimeBased: true,
  },
  {
    id: 'ex11',
    nama: 'One-Leg L-Sit',
    area: 'Perut bawah & paha depan',
    imageUrl: '/images/skills/lsit-skill-single-leg-hold.png',
    targetDefault: '3 x 15 dtk',
    langkah: [
      'Mulai dari posisi Tuck L-Sit di atas tumpuan.',
      'Julurkan satu kaki lurus ke depan sejajar lantai dengan ujung jari runcing.',
      'Kencangkan otot paha depan kaki yang lurus agar lutut tidak menekuk.',
      'Ganti kaki yang dijulurkan pada set berikutnya.'
    ],
    kesalahanUmum: [
      'Kaki yang lurus turun di bawah ketinggian panggul.',
      'Badan rebah ke belakang untuk mengimbangi beban.'
    ],
    lebihMudah: 'Julurkan kaki sedikit lebih rendah (sudut 45 derajat)',
    lebihSulit: 'Ganti kaki lurus bergantian di udara secara perlahan',
    isTimeBased: true,
  },
  {
    id: 'ex12',
    nama: 'Straddle L-Sit',
    area: 'Core, paha & fleksibilitas panggul',
    imageUrl: '/images/skills/lsit-skill-adv-tuck.png',
    targetDefault: '3 x 15 dtk',
    langkah: [
      'Tekan tangan kuat ke bawah pada tumpuan atau lantai.',
      'Buka kedua kaki lurus melebar ke samping kiri dan kanan.',
      'Angkat kedua kaki melayang sejajar lantai dengan mengencangkan perut dan paha.',
      'Kunci siku dan dorong bahu aktif ke bawah.'
    ],
    kesalahanUmum: [
      'Lutut menekuk karena paha belakang kaku.',
      'Pinggul menyentuh lantai atau tumpuan.'
    ],
    lebihMudah: 'Buka kaki lebih lebar agar beban tuas terasa lebih ringan',
    lebihSulit: 'Rapatkan kaki perlahan mendekati posisi L-sit lurus',
    isTimeBased: true,
  },
  {
    id: 'ex13',
    nama: 'Full L-Sit',
    area: 'Core total, hip flexors & bahu',
    imageUrl: '/images/skills/lsit-skill-full-hold.png',
    targetDefault: '3 x 10 dtk',
    langkah: [
      'Tekan kedua telapak tangan ke tumpuan atau parallettes.',
      'Kunci siku lurus, tekan bahu kuat ke bawah menjauhi telinga.',
      'Rapatkan kedua kaki dan angkat lurus ke depan setinggi panggul.',
      'Bernapas terkontrol dan kunci seluruh tubuh layaknya papan.'
    ],
    kesalahanUmum: [
      'Kaki turun di bawah ketinggian pinggul.',
      'Bahu membungkuk menutupi leher.'
    ],
    lebihMudah: 'Straddle L-Sit',
    lebihSulit: 'V-Sit (kaki terangkat lebih tinggi dari panggul)',
    isTimeBased: true,
  },
  {
    id: 'ex14',
    nama: 'Toe Taps Handstand',
    area: 'Bahu, jari tangan & keseimbangan',
    imageUrl: '/images/skills/hs-skill-heel-pulls.png',
    targetDefault: '3 x 30 dtk',
    langkah: [
      'Tendang kaki ke dinding dengan punggung menghadap dinding.',
      'Cengkeram lantai dengan ujung jari-jari tangan seperti mencakar karpet.',
      'Tarik satu tumit menjauhi dinding secara halus sampai menemukan titik seimbang.',
      'Sentuh dinding kembali perlahan dan gantikan dengan kaki satunya.'
    ],
    kesalahanUmum: [
      'Menendang terlalu keras sampai dinding terbanting.',
      'Telapak tangan rata tanpa mencengkeram lantai dengan jari.'
    ],
    lebihMudah: 'Lepas tumit hanya 2–3 cm dari dinding selama 2 detik',
    lebihSulit: 'Lepas kedua tumit bersamaan melayang bebas selama 3–5 detik',
    isTimeBased: true,
  },
  {
    id: 'ex15',
    nama: 'Kick-Up Handstand',
    area: 'Bahu, kontrol ayunan & kestabilan',
    imageUrl: '/images/skills/hs-support-pike-pushups.png',
    targetDefault: '3 x 20 dtk',
    langkah: [
      'Satu kaki di depan, posisikan bahu tepat di atas telapak tangan.',
      'Ayunkan kaki belakang ke atas secara terukur sementara kaki depan mendorong ringan.',
      'Rapatkan kedua kaki di titik puncak sebelum menyentuh dinding.',
      'Tahan seimbang selama mungkin sebelum tumit menyentuh dinding kamar.'
    ],
    kesalahanUmum: [
      'Tendangan terlalu keras sehingga membentur dinding dengan berisik.',
      'Siku menekuk saat kaki mengayun naik.'
    ],
    lebihMudah: 'Latihan di depan kasur atau matras busa',
    lebihSulit: 'Kick-up di ruang terbuka dengan bersiap teknik putar pinggul (bail)',
    isTimeBased: true,
  },
  {
    id: 'ex16',
    nama: 'Freestanding Handstand',
    area: 'Bahu, wrist rem & tubuh lurus terbalik',
    imageUrl: '/images/skills/hs-skill-kick-up-reps.png',
    targetDefault: '3 x 10 dtk',
    langkah: [
      'Lakukan ayunan naik terkontrol di area lantai yang lapang.',
      'Gunakan cengkeram jari tangan untuk mengoreksi keseimbangan secara halus.',
      'Kencangkan perut, rapatkan paha, dan dorong bahu aktif ke atas.',
      'Tahan garis lurus stabil dari pergelangan tangan sampai ujung kaki.'
    ],
    kesalahanUmum: [
      'Kaki membuka dan goyang tidak terkendali.',
      'Lupa bernapas saat menahan posisi.'
    ],
    lebihMudah: 'Target 5 detik hold mandiri terlebih dahulu',
    lebihSulit: 'Handstand shoulder taps di ruang terbuka',
    isTimeBased: true,
  },
  {
    id: 'ex17',
    nama: 'Plank Lean Siku Masuk',
    area: 'Pergelangan tangan, siku & core',
    imageUrl: '/images/skills/fl-support-straight-arm-pulldowns.png',
    targetDefault: '3 x 30 dtk',
    langkah: [
      'Mulai dari posisi push-up dengan telapak tangan diputar menghadap ke samping atau belakang.',
      'Tekuk siku sedikit dan tempelkan ke area pinggul samping.',
      'Condongkan tubuh sedikit ke depan sambil menahan berat badan di telapak tangan.',
      'Tahan selama target detik sambil mengatur napas santai.'
    ],
    kesalahanUmum: [
      'Langsung memutar tangan 180 derajat ke belakang secara paksa.',
      'Pinggul melorot ke lantai.'
    ],
    lebihMudah: 'Lakukan dengan lutut menempel di lantai',
    lebihSulit: 'Condongkan badan lebih maju ke depan',
    isTimeBased: true,
  },
  {
    id: 'ex18',
    nama: 'Knee Elbow Lever',
    area: 'Pinggul, siku & keseimbangan lantai',
    imageUrl: '/images/skills/fl-skill-tuck-hold.png',
    targetDefault: '3 x 20 dtk',
    langkah: [
      'Berlutut di lantai dengan kedua siku ditekuk dan diselipkan di bawah pinggul/perut samping.',
      'Condongkan dada dan kepala ke depan ke arah bantal penahan.',
      'Rilekskan kaki di lantai sementara siku menahan sebagian besar berat badanmu.',
      'Tahan posisi seimbang stabil selama target detik.'
    ],
    kesalahanUmum: [
      'Posisi siku meleset melebar ke samping luar tubuh.',
      'Kepala terlalu menunduk ke lantai.'
    ],
    lebihMudah: 'Letakkan kepala bersandar ringan di atas bantal empuk',
    lebihSulit: 'Angkat satu lutut melayang beberapa centimeter dari lantai',
    isTimeBased: true,
  },
  {
    id: 'ex19',
    nama: 'Tuck Elbow Lever',
    area: 'Core, pergelangan tangan & keseimbangan penuh',
    imageUrl: '/images/skills/fl-skill-adv-tuck-hold.png',
    targetDefault: '3 x 15 dtk',
    langkah: [
      'Kunci siku di bawah pinggul dan condongkan dada ke depan.',
      'Tarik kedua lutut ditekuk mendekati perut dan angkat kedua kaki dari lantai.',
      'Temukan titik jungkat-jungkit seimbang antara kepala di depan dan lutut di belakang.',
      'Tahan kontraksi perut dan jangan menahan napas.'
    ],
    kesalahanUmum: [
      'Takut condong ke depan sehingga kaki tidak bisa terangkat.',
      'Siku bergeser lepas dari pinggul.'
    ],
    lebihMudah: 'Angkat satu kaki bergantian',
    lebihSulit: 'Buka lutut sedikit lebih mundur dari dada',
    isTimeBased: true,
  },
  {
    id: 'ex20',
    nama: 'Straddle Elbow Lever',
    area: 'Bahu, punggung bawah, glutes & keseimbangan tuas',
    imageUrl: '/images/skills/fl-skill-straddle-single-leg.png',
    targetDefault: '3 x 15 dtk',
    langkah: [
      'Dari posisi tuck, luruskan kedua kaki terbuka lebar ke samping kiri dan kanan.',
      'Kencangkan otot pantat dan punggung bawah untuk menahan kaki tetap horizontal.',
      'Jaga dada tetap terangkat dan pandangan sedikit ke depan lantai.',
      'Tahan posisi seimbang stabil selama target detik.'
    ],
    kesalahanUmum: [
      'Kaki terkulai turun di bawah garis horizontal pinggul.',
      'Lutut menekuk lemas.'
    ],
    lebihMudah: 'Buka kaki sangat lebar dan tahan 8–10 detik',
    lebihSulit: 'Rapatkan kaki sedikit demi sedikit menuju posisi lurus rapat',
    isTimeBased: true,
  },
  {
    id: 'ex21',
    nama: 'Full Elbow Lever',
    area: 'Seluruh tubuh, glutes, punggung & pergelangan tangan',
    imageUrl: '/images/skills/fl-skill-full-lever-hold.png',
    targetDefault: '3 x 10 dtk',
    langkah: [
      'Tancapkan kedua siku rapat di bawah pinggul depan.',
      'Condongkan dada ke depan sambil meluruskan kedua kaki rapat sempurna ke belakang.',
      'Kunci seluruh otot tubuh: perut, pantat, dan paha dalam satu garis lurus horizontal.',
      'Tahan keseimbangan penuh selama 10 detik dengan napas terkontrol.'
    ],
    kesalahanUmum: [
      'Kaki melorot ke bawah garis pinggang.',
      'Badan miring ke satu sisi.'
    ],
    lebihMudah: 'Tahan 5 detik bersih dengan tubuh lurus rata',
    lebihSulit: 'One-Arm Elbow Lever di masa depan',
    isTimeBased: true,
  },
  {
    id: 'ex22',
    nama: 'Wrist Warm-up & Circles',
    area: 'Pergelangan tangan & fleksor lengan bawah',
    imageUrl: '/images/exercises/forearm-plank.png',
    targetDefault: '2 x 30 dtk',
    langkah: [
      'Posisikan lutut dan telapak tangan di lantai dengan jari menghadap ke berbagai arah.',
      'Putar pergelangan tangan searah dan berlawanan arah jarum jam secara lembut.',
      'Condongkan beban tubuh secara bertahap untuk meregangkan tendon lengan bawah.',
      'Jaga napas tetap santai dan jangan paksakan jika ada nyeri tajam.'
    ],
    kesalahanUmum: [
      'Memutar pergelangan terlalu cepat dan menyentak.',
      'Menumpu beban berlebihan saat sendi belum panas.'
    ],
    lebihMudah: 'Lakukan tanpa menumpu berat badan di lantai (posisi duduk/berdiri)',
    lebihSulit: 'Condongkan bahu lebih jauh melampaui garis jari tangan',
    isTimeBased: true,
  },
  {
    id: 'ex23',
    nama: 'Hollow Tuck Hold',
    area: 'Perut bawah, anterior core & kompresi',
    imageUrl: '/images/exercises/hollow-tuck-hold.png',
    targetDefault: '3 x 30 dtk',
    langkah: [
      'Berbaring telentang, tekan punggung bawah menempel rapat ke lantai tanpa celah.',
      'Angkat bahu dan kepala sedikit dari lantai dengan tangan lurus di samping paha.',
      'Tarik kedua lutut ditekuk membentuk sudut 90 derajat atau mendekati dada.',
      'Kunci kontraksi perut penuh dan bernapas pendek teratur.'
    ],
    kesalahanUmum: [
      'Punggung bawah melengkung terangkat dari lantai.',
      'Leher ditarik paksa ke depan hingga tegang.'
    ],
    lebihMudah: 'Lutut ditarik lebih rapat ke dada',
    lebihSulit: 'Luruskan satu kaki atau kedua kaki ke depan (Full Hollow Body)',
    isTimeBased: true,
  },
  {
    id: 'ex24',
    nama: 'Scapular Shoulder Shrugs',
    area: 'Bahu, trapezius & stabilisator skapula',
    imageUrl: '/images/skills/hs-support-scapular-handstand-shrugs.png',
    targetDefault: '3 x 10 reps',
    langkah: [
      'Posisikan tubuh dalam posisi plank tinggi atau push-up dengan siku terkunci lurus.',
      'Tanpa menekuk siku, dorong lantai ke bawah hingga punggung atas membulat (protraction).',
      'Turunkan dada perlahan membiarkan tulang belikat merapat ke tengah (retraction).',
      'Fokus murni pada pergerakan tulang belikat bahu.'
    ],
    kesalahanUmum: [
      'Menekuk siku saat bergerak.',
      'Pinggul melorot naik-turun alih-alih bahu yang bekerja.'
    ],
    lebihMudah: 'Lakukan dengan lutut menempel di lantai',
    lebihSulit: 'Lakukan di posisi pike push-up atau chest-to-wall',
    isTimeBased: false,
  },
  {
    id: 'ex25',
    nama: 'Pike Shoulder Stretch',
    area: 'Pundak, dada atas, hamstring & fleksibilitas pendinginan',
    imageUrl: '/images/exercises/push-up-high.png',
    targetDefault: '2 x 35 dtk',
    langkah: [
      'Dari posisi merangkak, dorong pinggul tinggi ke atas membentuk huruf V terbalik (posisi downward dog / pike).',
      'Tekan dada dan kepala rileks mengarah ke bawah di antara kedua lengan.',
      'Rasakan regangan lembut pada bahu, dada, dan paha belakang.',
      'Tarik napas dalam perlahan untuk menurunkan detak jantung.'
    ],
    kesalahanUmum: [
      'Menahan napas saat meregang.',
      'Memaksakan tumit menempel lantai jika hamstring masih kaku.'
    ],
    lebihMudah: 'Tekuk sedikit kedua lutut',
    lebihSulit: 'Dorong dada lebih dalam mendekati paha',
    isTimeBased: true,
  }
];

// ==========================================
// 3. DAFTAR SESI LATIHAN (SESSIONS)
// ==========================================
export const SEED_SESSIONS: WorkoutSession[] = [
  // Sesi Skill Progression: L-Sit (Stage 1 - 5)
  {
    id: 's_lsit_1',
    nama: 'L-Sit Mastery: Stage 1 Support',
    durasiMenit: 12,
    fokus: 'Skill Mastery',
    skillId: 'l-sit',
    stageNumber: 1,
    exercises: [
      { exerciseId: 'ex1', exerciseName: 'Support Hold', sets: 3, target: 30, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex9', exerciseName: 'Dead Bug', sets: 3, target: 8, unit: 'reps', istirahatDetik: 45, isIsometric: false },
      { exerciseId: 'ex10', exerciseName: 'Plank', sets: 3, target: 30, unit: 'detik', istirahatDetik: 45, isIsometric: true },
    ]
  },
  {
    id: 's_lsit_2',
    nama: 'L-Sit Mastery: Stage 2 Tuck',
    durasiMenit: 15,
    fokus: 'Skill Mastery',
    skillId: 'l-sit',
    stageNumber: 2,
    exercises: [
      { exerciseId: 'ex2', exerciseName: 'Tuck L-Sit', sets: 3, target: 20, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex1', exerciseName: 'Support Hold', sets: 3, target: 20, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex9', exerciseName: 'Dead Bug', sets: 3, target: 10, unit: 'reps', istirahatDetik: 45, isIsometric: false },
    ]
  },
  {
    id: 's_lsit_3',
    nama: 'L-Sit Mastery: Stage 3 One-Leg',
    durasiMenit: 15,
    fokus: 'Skill Mastery',
    skillId: 'l-sit',
    stageNumber: 3,
    exercises: [
      { exerciseId: 'ex11', exerciseName: 'One-Leg L-Sit', sets: 3, target: 15, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex2', exerciseName: 'Tuck L-Sit', sets: 3, target: 15, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex10', exerciseName: 'Plank', sets: 3, target: 35, unit: 'detik', istirahatDetik: 45, isIsometric: true },
    ]
  },
  {
    id: 's_lsit_4',
    nama: 'L-Sit Mastery: Stage 4 Straddle',
    durasiMenit: 18,
    fokus: 'Skill Mastery',
    skillId: 'l-sit',
    stageNumber: 4,
    exercises: [
      { exerciseId: 'ex12', exerciseName: 'Straddle L-Sit', sets: 3, target: 15, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex11', exerciseName: 'One-Leg L-Sit', sets: 3, target: 12, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex1', exerciseName: 'Support Hold', sets: 3, target: 25, unit: 'detik', istirahatDetik: 45, isIsometric: true },
    ]
  },
  {
    id: 's_lsit_5',
    nama: 'L-Sit Mastery: Stage 5 Full L-Sit',
    durasiMenit: 18,
    fokus: 'Skill Mastery',
    skillId: 'l-sit',
    stageNumber: 5,
    exercises: [
      { exerciseId: 'ex13', exerciseName: 'Full L-Sit', sets: 3, target: 10, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex12', exerciseName: 'Straddle L-Sit', sets: 3, target: 12, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex10', exerciseName: 'Plank', sets: 3, target: 45, unit: 'detik', istirahatDetik: 45, isIsometric: true },
    ]
  },

  // Sesi Skill Progression: Handstand (Stage 1 - 5)
  {
    id: 's_handstand_1',
    nama: 'Handstand Mastery: Stage 1 Wall Walk',
    durasiMenit: 15,
    fokus: 'Skill Mastery',
    skillId: 'handstand',
    stageNumber: 1,
    exercises: [
      { exerciseId: 'ex3', exerciseName: 'Wall Walk Hold', sets: 3, target: 30, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex7', exerciseName: 'Push-up', sets: 3, target: 8, unit: 'reps', istirahatDetik: 45, isIsometric: false },
      { exerciseId: 'ex10', exerciseName: 'Plank', sets: 3, target: 30, unit: 'detik', istirahatDetik: 45, isIsometric: true },
    ]
  },
  {
    id: 's_handstand_2',
    nama: 'Handstand Mastery: Stage 2 Chest-to-Wall',
    durasiMenit: 18,
    fokus: 'Skill Mastery',
    skillId: 'handstand',
    stageNumber: 2,
    exercises: [
      { exerciseId: 'ex4', exerciseName: 'Chest-to-Wall Handstand', sets: 3, target: 40, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex3', exerciseName: 'Wall Walk Hold', sets: 3, target: 20, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex7', exerciseName: 'Push-up', sets: 3, target: 10, unit: 'reps', istirahatDetik: 45, isIsometric: false },
    ]
  },
  {
    id: 's_handstand_3',
    nama: 'Handstand Mastery: Stage 3 Toe Taps',
    durasiMenit: 18,
    fokus: 'Skill Mastery',
    skillId: 'handstand',
    stageNumber: 3,
    exercises: [
      { exerciseId: 'ex14', exerciseName: 'Toe Taps Handstand', sets: 3, target: 30, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex4', exerciseName: 'Chest-to-Wall Handstand', sets: 3, target: 25, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex10', exerciseName: 'Plank', sets: 3, target: 35, unit: 'detik', istirahatDetik: 45, isIsometric: true },
    ]
  },
  {
    id: 's_handstand_4',
    nama: 'Handstand Mastery: Stage 4 Kick-Up',
    durasiMenit: 20,
    fokus: 'Skill Mastery',
    skillId: 'handstand',
    stageNumber: 4,
    exercises: [
      { exerciseId: 'ex15', exerciseName: 'Kick-Up Handstand', sets: 3, target: 20, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex14', exerciseName: 'Toe Taps Handstand', sets: 3, target: 20, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex7', exerciseName: 'Push-up', sets: 3, target: 10, unit: 'reps', istirahatDetik: 45, isIsometric: false },
    ]
  },
  {
    id: 's_handstand_5',
    nama: 'Handstand Mastery: Stage 5 Freestanding',
    durasiMenit: 20,
    fokus: 'Skill Mastery',
    skillId: 'handstand',
    stageNumber: 5,
    exercises: [
      { exerciseId: 'ex16', exerciseName: 'Freestanding Handstand', sets: 3, target: 10, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex15', exerciseName: 'Kick-Up Handstand', sets: 3, target: 15, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex4', exerciseName: 'Chest-to-Wall Handstand', sets: 3, target: 30, unit: 'detik', istirahatDetik: 45, isIsometric: true },
    ]
  },

  // Sesi Skill Progression: Elbow Lever (Stage 1 - 5)
  {
    id: 's_elbowlever_1',
    nama: 'Elbow Lever Mastery: Stage 1 Plank Lean',
    durasiMenit: 12,
    fokus: 'Skill Mastery',
    skillId: 'elbow-lever',
    stageNumber: 1,
    exercises: [
      { exerciseId: 'ex17', exerciseName: 'Plank Lean Siku Masuk', sets: 3, target: 30, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex7', exerciseName: 'Push-up', sets: 3, target: 8, unit: 'reps', istirahatDetik: 45, isIsometric: false },
      { exerciseId: 'ex10', exerciseName: 'Plank', sets: 3, target: 30, unit: 'detik', istirahatDetik: 45, isIsometric: true },
    ]
  },
  {
    id: 's_elbowlever_2',
    nama: 'Elbow Lever Mastery: Stage 2 Knee Lever',
    durasiMenit: 15,
    fokus: 'Skill Mastery',
    skillId: 'elbow-lever',
    stageNumber: 2,
    exercises: [
      { exerciseId: 'ex18', exerciseName: 'Knee Elbow Lever', sets: 3, target: 20, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex17', exerciseName: 'Plank Lean Siku Masuk', sets: 3, target: 20, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex9', exerciseName: 'Dead Bug', sets: 3, target: 10, unit: 'reps', istirahatDetik: 45, isIsometric: false },
    ]
  },
  {
    id: 's_elbowlever_3',
    nama: 'Elbow Lever Mastery: Stage 3 Tuck Lever',
    durasiMenit: 15,
    fokus: 'Skill Mastery',
    skillId: 'elbow-lever',
    stageNumber: 3,
    exercises: [
      { exerciseId: 'ex19', exerciseName: 'Tuck Elbow Lever', sets: 3, target: 15, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex18', exerciseName: 'Knee Elbow Lever', sets: 3, target: 15, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex10', exerciseName: 'Plank', sets: 3, target: 35, unit: 'detik', istirahatDetik: 45, isIsometric: true },
    ]
  },
  {
    id: 's_elbowlever_4',
    nama: 'Elbow Lever Mastery: Stage 4 Straddle',
    durasiMenit: 18,
    fokus: 'Skill Mastery',
    skillId: 'elbow-lever',
    stageNumber: 4,
    exercises: [
      { exerciseId: 'ex20', exerciseName: 'Straddle Elbow Lever', sets: 3, target: 15, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex19', exerciseName: 'Tuck Elbow Lever', sets: 3, target: 12, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex7', exerciseName: 'Push-up', sets: 3, target: 10, unit: 'reps', istirahatDetik: 45, isIsometric: false },
    ]
  },
  {
    id: 's_elbowlever_5',
    nama: 'Elbow Lever Mastery: Stage 5 Full Lever',
    durasiMenit: 18,
    fokus: 'Skill Mastery',
    skillId: 'elbow-lever',
    stageNumber: 5,
    exercises: [
      { exerciseId: 'ex21', exerciseName: 'Full Elbow Lever', sets: 3, target: 10, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex20', exerciseName: 'Straddle Elbow Lever', sets: 3, target: 12, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex10', exerciseName: 'Plank', sets: 3, target: 45, unit: 'detik', istirahatDetik: 45, isIsometric: true },
    ]
  },

  // Sesi 30 Menit (Full Routine: Warm-up + Main Skill Progression + Finisher + Cool-down)
  {
    id: 's_lsit_30',
    nama: 'L-Sit Complete Routine 30',
    durasiMenit: 30,
    fokus: 'Skill Mastery',
    skillId: 'l-sit',
    exercises: [
      { exerciseId: 'ex22', exerciseName: 'Wrist Warm-up & Circles', sets: 2, target: 45, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex23', exerciseName: 'Hollow Tuck Hold', sets: 3, target: 30, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex1', exerciseName: 'Support Hold', sets: 3, target: 30, unit: 'detik', istirahatDetik: 60, isIsometric: true },
      { exerciseId: 'ex2', exerciseName: 'Tuck L-Sit', sets: 3, target: 25, unit: 'detik', istirahatDetik: 60, isIsometric: true },
      { exerciseId: 'ex9', exerciseName: 'Dead Bug', sets: 3, target: 12, unit: 'reps', istirahatDetik: 45, isIsometric: false },
      { exerciseId: 'ex10', exerciseName: 'Plank', sets: 3, target: 45, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex25', exerciseName: 'Pike Shoulder Stretch', sets: 3, target: 40, unit: 'detik', istirahatDetik: 45, isIsometric: true },
    ]
  },
  {
    id: 's_handstand_30',
    nama: 'Handstand Complete Routine 30',
    durasiMenit: 30,
    fokus: 'Skill Mastery',
    skillId: 'handstand',
    exercises: [
      { exerciseId: 'ex22', exerciseName: 'Wrist Warm-up & Circles', sets: 2, target: 45, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex24', exerciseName: 'Scapular Shoulder Shrugs', sets: 3, target: 12, unit: 'reps', istirahatDetik: 45, isIsometric: false },
      { exerciseId: 'ex3', exerciseName: 'Wall Walk Hold', sets: 3, target: 35, unit: 'detik', istirahatDetik: 60, isIsometric: true },
      { exerciseId: 'ex4', exerciseName: 'Chest-to-Wall Handstand', sets: 3, target: 40, unit: 'detik', istirahatDetik: 60, isIsometric: true },
      { exerciseId: 'ex7', exerciseName: 'Push-up', sets: 3, target: 12, unit: 'reps', istirahatDetik: 45, isIsometric: false },
      { exerciseId: 'ex10', exerciseName: 'Plank', sets: 3, target: 45, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex25', exerciseName: 'Pike Shoulder Stretch', sets: 3, target: 40, unit: 'detik', istirahatDetik: 45, isIsometric: true },
    ]
  },
  {
    id: 's_elbowlever_30',
    nama: 'Elbow Lever Complete Routine 30',
    durasiMenit: 30,
    fokus: 'Skill Mastery',
    skillId: 'elbow-lever',
    exercises: [
      { exerciseId: 'ex22', exerciseName: 'Wrist Warm-up & Circles', sets: 2, target: 45, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex17', exerciseName: 'Plank Lean Siku Masuk', sets: 3, target: 30, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex18', exerciseName: 'Knee Elbow Lever', sets: 3, target: 25, unit: 'detik', istirahatDetik: 60, isIsometric: true },
      { exerciseId: 'ex19', exerciseName: 'Tuck Elbow Lever', sets: 3, target: 20, unit: 'detik', istirahatDetik: 60, isIsometric: true },
      { exerciseId: 'ex8', exerciseName: 'Incline push-up', sets: 3, target: 12, unit: 'reps', istirahatDetik: 45, isIsometric: false },
      { exerciseId: 'ex10', exerciseName: 'Plank', sets: 3, target: 45, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex25', exerciseName: 'Pike Shoulder Stretch', sets: 3, target: 40, unit: 'detik', istirahatDetik: 45, isIsometric: true },
    ]
  },

  // Sesi Rutinitas Harian
  {
    id: 's1',
    nama: 'Push 15 (Dada & Trisep)',
    durasiMenit: 15,
    fokus: 'Push',
    exercises: [
      { exerciseId: 'ex7', exerciseName: 'Push-up', sets: 3, target: 8, unit: 'reps', istirahatDetik: 45 },
      { exerciseId: 'ex8', exerciseName: 'Incline push-up', sets: 3, target: 10, unit: 'reps', istirahatDetik: 45 },
      { exerciseId: 'ex9', exerciseName: 'Dead Bug', sets: 3, target: 8, unit: 'reps', istirahatDetik: 45 },
      { exerciseId: 'ex10', exerciseName: 'Plank', sets: 3, target: 30, unit: 'detik', istirahatDetik: 45, isIsometric: true },
    ]
  },
  {
    id: 's2',
    nama: 'Core & Stabilizer 10',
    durasiMenit: 10,
    fokus: 'Pull dan core',
    exercises: [
      { exerciseId: 'ex1', exerciseName: 'Support Hold', sets: 3, target: 20, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex9', exerciseName: 'Dead Bug', sets: 3, target: 10, unit: 'reps', istirahatDetik: 45 },
      { exerciseId: 'ex10', exerciseName: 'Plank', sets: 3, target: 45, unit: 'detik', istirahatDetik: 45, isIsometric: true },
    ]
  },
  {
    id: 's4',
    nama: 'Quick Fit 10 (Full Body)',
    durasiMenit: 10,
    fokus: 'Full body',
    exercises: [
      { exerciseId: 'ex8', exerciseName: 'Incline push-up', sets: 3, target: 10, unit: 'reps', istirahatDetik: 45 },
      { exerciseId: 'ex9', exerciseName: 'Dead Bug', sets: 3, target: 8, unit: 'reps', istirahatDetik: 45 },
      { exerciseId: 'ex10', exerciseName: 'Plank', sets: 3, target: 30, unit: 'detik', istirahatDetik: 45, isIsometric: true },
    ]
  },
  {
    id: 's5',
    nama: 'Upper Body Blast 20',
    durasiMenit: 20,
    fokus: 'Push',
    exercises: [
      { exerciseId: 'ex7', exerciseName: 'Push-up', sets: 4, target: 10, unit: 'reps', istirahatDetik: 45 },
      { exerciseId: 'ex8', exerciseName: 'Incline push-up', sets: 3, target: 12, unit: 'reps', istirahatDetik: 45 },
      { exerciseId: 'ex1', exerciseName: 'Support Hold', sets: 3, target: 25, unit: 'detik', istirahatDetik: 45, isIsometric: true },
      { exerciseId: 'ex10', exerciseName: 'Plank', sets: 3, target: 40, unit: 'detik', istirahatDetik: 45, isIsometric: true },
    ]
  }
];
