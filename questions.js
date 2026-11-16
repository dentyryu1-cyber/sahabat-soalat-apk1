// questions.js — JSON Bank Soal 13 Rukun Salat (Mazhab Syafi'i) & Pemetaan Kotak Papan

export const RUKUN_SALAT_LIST = [
  {
    num: 1,
    name: 'Niat',
    category: 'Rukun Qalbi (Hati)',
    desc: 'Menyengaja mengerjakan salat di dalam hati bersamaan dengan mengucap Takbiratul Ihram.'
  },
  {
    num: 2,
    name: 'Berdiri bagi yang Mampu',
    category: "Rukun Fi'li (Gerakan)",
    desc: 'Wajib berdiri tegak pada salat fardu bagi yang mampu. Jika tidak mampu, boleh duduk atau berbaring.'
  },
  {
    num: 3,
    name: 'Takbiratul Ihram',
    category: 'Rukun Qauli (Ucapan)',
    desc: 'Mengucapkan lafaz "Allahu Akbar" sebagai pembuka salat yang mengharamkan hal-hal di luar salat.'
  },
  {
    num: 4,
    name: 'Membaca Surah Al-Fatihah',
    category: 'Rukun Qauli (Ucapan)',
    desc: 'Membaca Surah Al-Fatihah beserta Basmalah secara lengkap pada setiap rakaat salat.'
  },
  {
    num: 5,
    name: "Rukuk serta Tuma'ninah",
    category: "Rukun Fi'li (Gerakan)",
    desc: 'Membungkukkan badan sehingga kedua telapak tangan dapat mencapai lutut, disertai diam sejenak (tuma\'ninah).'
  },
  {
    num: 6,
    name: "I'tidal serta Tuma'ninah",
    category: "Rukun Fi'li (Gerakan)",
    desc: 'Bangun dari rukuk hingga kembali berdiri tegak dengan tenang sejenak sebelum turun sujud.'
  },
  {
    num: 7,
    name: "Sujud Dua Kali serta Tuma'ninah",
    category: "Rukun Fi'li (Gerakan)",
    desc: 'Meletakkan tujuh anggota sujud (dahi, 2 telapak tangan, 2 lutut, ujung 2 kaki) ke lantai sebanyak dua kali tiap rakaat.'
  },
  {
    num: 8,
    name: "Duduk di Antara Dua Sujud serta Tuma'ninah",
    category: "Rukun Fi'li (Gerakan)",
    desc: 'Bangun dari sujud pertama untuk duduk sejenak dengan tenang sebelum melakukan sujud kedua.'
  },
  {
    num: 9,
    name: 'Duduk Tasyahud Akhir',
    category: "Rukun Fi'li (Gerakan)",
    desc: 'Duduk pada rakaat terakhir salat (disunnahkan duduk tawarruk) untuk membaca tasyahud akhir dan salawat.'
  },
  {
    num: 10,
    name: 'Membaca Tasyahud Akhir',
    category: 'Rukun Qauli (Ucapan)',
    desc: 'Membaca bacaan tahiyat/tasyahud akhir pada posisi duduk terakhir sebelum salam.'
  },
  {
    num: 11,
    name: 'Membaca Salawat kepada Nabi Muhammad SAW',
    category: 'Rukun Qauli (Ucapan)',
    desc: 'Membaca salawat kepada Nabi Muhammad SAW setelah bacaan tasyahud akhir (minimal: Allahumma shalli \'ala Muhammad).'
  },
  {
    num: 12,
    name: 'Mengucapkan Salam yang Pertama',
    category: 'Rukun Qauli (Ucapan)',
    desc: 'Mengucapkan "Assalamu\'alaikum" yang pertama sambil menoleh ke kanan sebagai penutup salat.'
  },
  {
    num: 13,
    name: 'Tertib',
    category: "Rukun Ma'nawi",
    desc: 'Melaksanakan seluruh rukun salat secara berurutan dari niat hingga salam tanpa membolak-balik urutannya.'
  }
];

// JSON Array Bank Soal mencakup ke-13 Rukun Salat dengan kategori: Pilihan Ganda, Benar/Salah, Urutan, & Tebak Gerakan
export const RUKUN_SALAT_QUESTIONS_JSON = `[
  {
    "id": "rk-01",
    "rukunNumber": 1,
    "category": "Pilihan Ganda",
    "type": "multiple_choice",
    "tiles": [2, 11],
    "points": 25,
    "question": "Rukun ke-1 adalah Niat. Di dalam hati, kapankah waktu yang tepat menghadirkan niat salat?",
    "options": [
      "Setelah selesai membaca Al-Fatihah",
      "Saat sedang duduk tasyahud",
      "Bersamaan dengan ucapan Takbiratul Ihram",
      "Sebelum mengambil air wudu"
    ],
    "answer": 2,
    "explanation": "Niat merupakan rukun qalbi yang dihadirkan di dalam hati bersamaan dengan ucapan Takbiratul Ihram (Allahu Akbar)."
  },
  {
    "id": "rk-02",
    "rukunNumber": 2,
    "category": "Pilihan Ganda",
    "type": "multiple_choice",
    "tiles": [7],
    "points": 25,
    "question": "Rukun ke-2 adalah Berdiri bagi yang mampu. Jika seseorang sakit dan tidak kuat berdiri saat salat fardu, maka ia boleh salat dengan cara...",
    "options": [
      "Meninggalkan salat hingga sembuh",
      "Duduk atau berbaring sesuai kemampuannya",
      "Cukup membayangkan gerakan saja",
      "Menggantinya dengan puasa"
    ],
    "answer": 1,
    "explanation": "Berdiri adalah rukun salat fardu bagi yang mampu. Bila tidak mampu, syariat memberi keringanan untuk duduk atau berbaring."
  },
  {
    "id": "rk-03",
    "rukunNumber": 3,
    "category": "Pilihan Ganda",
    "type": "multiple_choice",
    "tiles": [15],
    "points": 25,
    "question": "Rukun ke-3 adalah Takbiratul Ihram. Lafaz wajib yang diucapkan untuk membuka salat adalah...",
    "options": [
      "Subhanallah",
      "Alhamdulillah",
      "Allahu Akbar",
      "Astaghfirullah"
    ],
    "answer": 2,
    "explanation": "Takbiratul Ihram wajib mengucapkan lafaz Allahu Akbar sebagai pembuka salat yang mengharamkan aktivitas di luar salat."
  },
  {
    "id": "rk-04",
    "rukunNumber": 4,
    "category": "Pilihan Ganda",
    "type": "multiple_choice",
    "tiles": [19, 23],
    "points": 25,
    "question": "Rukun ke-4 adalah membaca Surah Al-Fatihah. Dalam Mazhab Syafi'i, ayat pertama Surah Al-Fatihah yang wajib dibaca adalah...",
    "options": [
      "Alhamdulillahi rabbil 'alamin",
      "Bismillahirrahmanirrahim",
      "Maliki yaumiddin",
      "Iyyaka na'budu wa iyyaka nasta'in"
    ],
    "answer": 1,
    "explanation": "Mazhab Syafi'i menetapkan Basmalah (Bismillahirrahmanirrahim) sebagai ayat pertama Surah Al-Fatihah yang wajib dibaca di setiap rakaat."
  },
  {
    "id": "rk-05",
    "rukunNumber": 5,
    "category": "Pilihan Ganda",
    "type": "multiple_choice",
    "tiles": [29],
    "points": 25,
    "question": "Rukun ke-5 adalah Rukuk serta tuma'ninah. Bagaimanakah syarat posisi rukuk yang sempurna?",
    "options": [
      "Membungkuk hingga kedua telapak tangan mencapai lutut dengan tenang sejenak",
      "Menundukkan kepala sedikit saja tanpa membungkuk",
      "Langsung turun ke lantai tanpa berhenti",
      "Mengangkat kedua tangan ke atas kepala"
    ],
    "answer": 0,
    "explanation": "Rukuk dilakukan dengan membungkukkan badan hingga kedua telapak tangan dapat mencapai lutut, disertai tuma'ninah (diam sejenak)."
  },
  {
    "id": "rk-06",
    "rukunNumber": 6,
    "category": "Benar/Salah",
    "type": "true_false",
    "tiles": [36],
    "points": 20,
    "question": "Rukun ke-6 (I'tidal) berarti bangkit dari rukuk hingga berdiri tegak kembali disertai tuma'ninah sebelum turun sujud.",
    "answer": true,
    "explanation": "Benar! I'tidal mewajibkan badan kembali tegak seperti sebelum rukuk dan diam tenang sejenak (tuma'ninah)."
  },
  {
    "id": "rk-07",
    "rukunNumber": 7,
    "category": "Benar/Salah",
    "type": "true_false",
    "tiles": [38, 47],
    "points": 20,
    "question": "Pada Rukun ke-7, sujud dalam setiap satu rakaat salat cukup dikerjakan satu kali saja.",
    "answer": false,
    "explanation": "Salah! Rukun ke-7 mewajibkan sujud dua kali pada setiap rakaat dengan meletakkan tujuh anggota sujud dan tuma'ninah."
  },
  {
    "id": "rk-08",
    "rukunNumber": 8,
    "category": "Benar/Salah",
    "type": "true_false",
    "tiles": [52],
    "points": 20,
    "question": "Duduk di antara dua sujud serta tuma'ninah termasuk salah satu dari 13 Rukun Salat (Rukun ke-8).",
    "answer": true,
    "explanation": "Benar! Duduk di antara sujud pertama dan sujud kedua disertai tuma'ninah adalah rukun salat ke-8."
  },
  {
    "id": "rk-09",
    "rukunNumber": 9,
    "category": "Benar/Salah",
    "type": "true_false",
    "tiles": [58],
    "points": 20,
    "question": "Duduk Tasyahud Awal termasuk dalam 13 Rukun Salat wajib dalam Mazhab Syafi'i.",
    "answer": false,
    "explanation": "Salah! Duduk Tasyahud Awal hukumnya sunnah ab'adh, sedangkan yang menjadi Rukun ke-9 adalah Duduk Tasyahud Akhir."
  },
  {
    "id": "rk-10",
    "rukunNumber": 10,
    "category": "Pilihan Ganda",
    "type": "multiple_choice",
    "tiles": [61, 67],
    "points": 25,
    "question": "Rukun ke-10 adalah Membaca Tasyahud Akhir. Kapan bacaan tasyahud akhir wajib dibaca?",
    "options": [
      "Pada duduk di antara dua sujud",
      "Pada rakaat terakhir sebelum salawat dan salam",
      "Setiap kali selesai rukuk",
      "Setelah mengucapkan salam pertama"
    ],
    "answer": 1,
    "explanation": "Bacaan Tasyahud Akhir wajib dibaca saat duduk tasyahud akhir pada rakaat terakhir salat sebelum membaca salawat Nabi."
  },
  {
    "id": "rk-11",
    "rukunNumber": 11,
    "category": "Pilihan Ganda",
    "type": "multiple_choice",
    "tiles": [72, 76],
    "points": 25,
    "question": "Rukun ke-11 adalah membaca Salawat kepada Nabi Muhammad SAW, yang wajib dibaca pada saat...",
    "options": [
      "Setelah membaca Surah Al-Fatihah",
      "Ketika duduk di antara dua sujud",
      "Duduk Tasyahud Akhir setelah bacaan tahiyat akhir",
      "Saat berdiri i'tidal"
    ],
    "answer": 2,
    "explanation": "Membaca salawat kepada Nabi Muhammad SAW adalah rukun ke-11 yang dibaca saat duduk tasyahud akhir sebelum salam."
  },
  {
    "id": "rk-12",
    "rukunNumber": 12,
    "category": "Benar/Salah",
    "type": "true_false",
    "tiles": [81, 85],
    "points": 20,
    "question": "Pada Rukun ke-12, baik salam pertama (kanan) maupun salam kedua (kiri) keduanya wajib hukumnya sebagai rukun salat.",
    "answer": false,
    "explanation": "Salah! Yang termasuk Rukun ke-12 hanyalah mengucapkan Salam yang pertama ke kanan. Salam kedua hukumnya sunnah."
  },
  {
    "id": "rk-13",
    "rukunNumber": 13,
    "category": "Benar/Salah",
    "type": "true_false",
    "tiles": [90, 99],
    "points": 20,
    "question": "Rukun ke-13 adalah Tertib, yaitu melaksanakan seluruh rukun salat secara berurutan dari niat hingga salam.",
    "answer": true,
    "explanation": "Benar! Tertib adalah rukun ke-13. Jika urutan rukun dibolak-balik dengan sengaja, maka salat menjadi tidak sah."
  },
  {
    "id": "ord-01",
    "rukunNumber": 1,
    "category": "Urutan",
    "type": "ordering",
    "tiles": [11, 19],
    "points": 35,
    "question": "Susunlah 4 Rukun Salat pertama secara berurutan dari awal!",
    "items": ["Niat", "Berdiri bagi yang Mampu", "Takbiratul Ihram", "Membaca Al-Fatihah"],
    "explanation": "Urutan 4 rukun pertama adalah: 1. Niat, 2. Berdiri bagi yang mampu, 3. Takbiratul Ihram, 4. Membaca Al-Fatihah."
  },
  {
    "id": "ord-02",
    "rukunNumber": 5,
    "category": "Urutan",
    "type": "ordering",
    "tiles": [36, 52],
    "points": 35,
    "question": "Susunlah urutan gerakan Rukun Salat setelah membaca Surah Al-Fatihah!",
    "items": ["Rukuk", "I'tidal", "Sujud Pertama", "Duduk Antara Dua Sujud"],
    "explanation": "Setelah membaca Al-Fatihah: Rukuk (5) -> I'tidal (6) -> Sujud Pertama (7) -> Duduk di Antara Dua Sujud (8)."
  },
  {
    "id": "ord-03",
    "rukunNumber": 9,
    "category": "Urutan",
    "type": "ordering",
    "tiles": [76, 94],
    "points": 35,
    "question": "Susunlah urutan 4 Rukun Salat terakhir menjelang penutup salat!",
    "items": ["Duduk Tasyahud Akhir", "Membaca Tasyahud Akhir", "Salawat Nabi", "Salam Pertama"],
    "explanation": "Menjelang akhir salat: Duduk Tasyahud Akhir (9) -> Membaca Tasyahud Akhir (10) -> Salawat Nabi SAW (11) -> Salam Pertama (12)."
  },
  {
    "id": "pose-01",
    "rukunNumber": 3,
    "category": "Tebak Gerakan",
    "type": "guess_pose",
    "tiles": [15, 23],
    "points": 30,
    "poseKey": "takbir",
    "question": "Perhatikan ilustrasi gerakan salat di bawah ini! Rukun apakah yang sedang dilakukan?",
    "options": ["Takbiratul Ihram", "Rukuk", "Duduk Tasyahud", "Sujud"],
    "answer": 0,
    "explanation": "Mengangkat kedua telapak tangan sejajar telinga/bahu sambil mengucap Allahu Akbar adalah Takbiratul Ihram (Rukun ke-3)."
  },
  {
    "id": "pose-02",
    "rukunNumber": 5,
    "category": "Tebak Gerakan",
    "type": "guess_pose",
    "tiles": [29, 47],
    "points": 30,
    "poseKey": "rukuk",
    "question": "Tebak gerakan rukun salat pada gambar! Punggung lurus rata dan tangan memegang lutut.",
    "options": ["I'tidal", "Rukuk", "Sujud", "Duduk Antara Dua Sujud"],
    "answer": 1,
    "explanation": "Membungkukkan badan dengan punggung rata dan telapak tangan memegang lutut adalah Rukuk (Rukun ke-5)."
  },
  {
    "id": "pose-03",
    "rukunNumber": 6,
    "category": "Tebak Gerakan",
    "type": "guess_pose",
    "tiles": [38, 67],
    "points": 30,
    "poseKey": "itidal",
    "question": "Gerakan bangkit dari rukuk hingga berdiri tegak kembali dengan tenang disebut...",
    "options": ["Takbiratul Ihram", "Tasyahud Akhir", "I'tidal", "Salam"],
    "answer": 2,
    "explanation": "Bangun dari rukuk dan kembali berdiri tegak dengan tuma'ninah disebut I'tidal (Rukun ke-6)."
  },
  {
    "id": "pose-04",
    "rukunNumber": 7,
    "category": "Tebak Gerakan",
    "type": "guess_pose",
    "tiles": [58, 72],
    "points": 30,
    "poseKey": "sujud",
    "question": "Tebak gerakan rukun salat ini! Dahi, hidung, telapak tangan, lutut, dan ujung kaki menyentuh lantai.",
    "options": ["Rukuk", "Sujud", "Duduk Iftirasy", "Berdiri Tegak"],
    "answer": 1,
    "explanation": "Meletakkan tujuh anggota sujud ke lantai dengan tuma'ninah adalah Sujud (Rukun ke-7)."
  },
  {
    "id": "pose-05",
    "rukunNumber": 8,
    "category": "Tebak Gerakan",
    "type": "guess_pose",
    "tiles": [61, 85, 90],
    "points": 30,
    "poseKey": "duduk",
    "question": "Gerakan duduk tenang setelah sujud pertama sebelum sujud kedua atau saat tahiyat disebut...",
    "options": ["Berdiri Tegak", "Duduk dalam Salat", "Rukuk", "I'tidal"],
    "answer": 1,
    "explanation": "Duduk dalam salat menjadi rukun pada Duduk di Antara Dua Sujud (Rukun ke-8) dan Duduk Tasyahud Akhir (Rukun ke-9)."
  }
]`;

export const QUESTION_BANK = JSON.parse(RUKUN_SALAT_QUESTIONS_JSON);

export function getPoseSVG(poseKey) {
  const skin = '#f5cba7';
  const robe = '#047857';
  const robeDark = '#064e3b';
  const cap = '#fef3c7';
  const mat = '#d97706';

  switch (poseKey) {
    case 'takbir':
      return `
        <svg viewBox="0 0 160 130" aria-label="Ilustrasi Takbiratul Ihram">
          <rect x="25" y="114" width="110" height="8" rx="4" fill="${mat}" />
          <rect x="66" y="78" width="11" height="36" rx="5" fill="${robeDark}" />
          <rect x="83" y="78" width="11" height="36" rx="5" fill="${robeDark}" />
          <rect x="62" y="42" width="36" height="42" rx="12" fill="${robe}" />
          <path d="M62 48 L44 36 L44 22" stroke="${robe}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <path d="M98 48 L116 36 L116 22" stroke="${robe}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <circle cx="44" cy="19" r="6" fill="${skin}" />
          <circle cx="116" cy="19" r="6" fill="${skin}" />
          <circle cx="80" cy="26" r="14" fill="${skin}" />
          <path d="M67 21 Q80 10 93 21 Z" fill="${cap}" stroke="#d97706" stroke-width="1.5" />
          <circle cx="75" cy="26" r="1.8" fill="#1f2937" />
          <circle cx="85" cy="26" r="1.8" fill="#1f2937" />
        </svg>`;
    case 'rukuk':
      return `
        <svg viewBox="0 0 160 130" aria-label="Ilustrasi Rukuk">
          <rect x="20" y="114" width="120" height="8" rx="4" fill="${mat}" />
          <rect x="92" y="64" width="13" height="50" rx="6" fill="${robeDark}" />
          <rect x="46" y="52" width="56" height="22" rx="11" fill="${robe}" />
          <path d="M58 66 L76 86 L94 84" stroke="${robe}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <circle cx="95" cy="84" r="6" fill="${skin}" />
          <circle cx="38" cy="63" r="13" fill="${skin}" />
          <path d="M27 56 Q38 46 49 56 Z" fill="${cap}" stroke="#d97706" stroke-width="1.5" />
          <circle cx="34" cy="65" r="1.8" fill="#1f2937" />
        </svg>`;
    case 'itidal':
      return `
        <svg viewBox="0 0 160 130" aria-label="Ilustrasi I'tidal">
          <rect x="25" y="114" width="110" height="8" rx="4" fill="${mat}" />
          <rect x="67" y="78" width="11" height="36" rx="5" fill="${robeDark}" />
          <rect x="82" y="78" width="11" height="36" rx="5" fill="${robeDark}" />
          <rect x="63" y="42" width="34" height="42" rx="12" fill="${robe}" />
          <path d="M62 47 L53 76" stroke="${robe}" stroke-width="9" stroke-linecap="round" fill="none" />
          <path d="M98 47 L107 76" stroke="${robe}" stroke-width="9" stroke-linecap="round" fill="none" />
          <circle cx="52" cy="79" r="5" fill="${skin}" />
          <circle cx="108" cy="79" r="5" fill="${skin}" />
          <path d="M132 70 L132 35 M124 44 L132 34 L140 44" stroke="#059669" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <circle cx="80" cy="26" r="14" fill="${skin}" />
          <path d="M67 21 Q80 10 93 21 Z" fill="${cap}" stroke="#d97706" stroke-width="1.5" />
          <circle cx="75" cy="26" r="1.8" fill="#1f2937" />
          <circle cx="85" cy="26" r="1.8" fill="#1f2937" />
        </svg>`;
    case 'sujud':
      return `
        <svg viewBox="0 0 160 130" aria-label="Ilustrasi Sujud">
          <rect x="18" y="112" width="124" height="8" rx="4" fill="${mat}" />
          <path d="M126 108 L108 108 L102 88" stroke="${robeDark}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <path d="M104 82 Q82 60 56 88" stroke="${robe}" stroke-width="22" stroke-linecap="round" fill="none" />
          <path d="M72 86 L48 106 L34 106" stroke="${robe}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <circle cx="33" cy="106" r="5" fill="${skin}" />
          <circle cx="48" cy="99" r="12" fill="${skin}" />
          <path d="M40 90 Q52 84 58 95 Z" fill="${cap}" stroke="#d97706" stroke-width="1.5" />
        </svg>`;
    case 'duduk':
    default:
      return `
        <svg viewBox="0 0 160 130" aria-label="Ilustrasi Duduk dalam Salat">
          <rect x="22" y="112" width="116" height="8" rx="4" fill="${mat}" />
          <path d="M62 106 L104 106 L96 92 L72 92" stroke="${robeDark}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <rect x="65" y="54" width="32" height="40" rx="11" fill="${robe}" />
          <path d="M66 64 L54 88 L72 92" stroke="${robe}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <circle cx="74" cy="92" r="5" fill="${skin}" />
          <circle cx="80" cy="36" r="14" fill="${skin}" />
          <path d="M67 31 Q80 20 93 31 Z" fill="${cap}" stroke="#d97706" stroke-width="1.5" />
          <circle cx="75" cy="36" r="1.8" fill="#1f2937" />
          <circle cx="85" cy="36" r="1.8" fill="#1f2937" />
        </svg>`;
  }
}

export class QuestionManager {
  constructor() {
    this.usedIds = new Set();
  }

  resetSession() {
    this.usedIds.clear();
  }

  getQuestionForTile(tileNum) {
    // 1. Prioritize unused questions explicitly mapped to this board tile
    const tileMatches = QUESTION_BANK.filter(
      (q) => Array.isArray(q.tiles) && q.tiles.includes(tileNum) && !this.usedIds.has(q.id)
    );

    if (tileMatches.length > 0) {
      const pick = tileMatches[Math.floor(Math.random() * tileMatches.length)];
      this.usedIds.add(pick.id);
      return pick;
    }

    // 2. Otherwise map tile progression (1..100) to Rukun Salat (1..13) for thematic alignment
    const targetRukun = Math.min(13, Math.max(1, Math.ceil((tileNum / 100) * 13)));
    const rukunMatches = QUESTION_BANK.filter(
      (q) => !this.usedIds.has(q.id) && Math.abs(q.rukunNumber - targetRukun) <= 1
    );
    if (rukunMatches.length > 0) {
      const pick = rukunMatches[Math.floor(Math.random() * rukunMatches.length)];
      this.usedIds.add(pick.id);
      return pick;
    }

    // 3. Draw any remaining unused question, or reset pool if all answered
    let remaining = QUESTION_BANK.filter((q) => !this.usedIds.has(q.id));
    if (remaining.length === 0) {
      this.usedIds.clear();
      const fallbackByTile = QUESTION_BANK.filter(
        (q) => Array.isArray(q.tiles) && q.tiles.includes(tileNum)
      );
      remaining = fallbackByTile.length > 0 ? fallbackByTile : QUESTION_BANK;
    }

    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.usedIds.add(pick.id);
    return pick;
  }

  drawQuestion(tileNum = null) {
    if (typeof tileNum === 'number') {
      return this.getQuestionForTile(tileNum);
    }
    return this.getQuestionForTile(Math.floor(Math.random() * 100) + 1);
  }
}
