
// Bank Data Materi & Kuis Statis Nusantara (Kurikulum Merdeka)
// Berisi materi yang telah diverifikasi secara pedagogis.

export const getTutoringGuidance = async (topic: string, subject: string) => {
  return `Panduan belajar untuk topik ${topic} pada mata pelajaran ${subject} telah disesuaikan dengan Capaian Pembelajaran (CP) Fase F. Fokus pada pemahaman bermakna.`;
};

const READING_BANK: Record<string, string> = {
  "Matematika": `## Logika dan Numerasi (Fase F)
Matematika di era modern adalah tentang analisis data dan pemecahan masalah kompleks.

### 1. Eksponen dan Logaritma
Memahami pertumbuhan eksponensial dalam konteks investasi atau biologi.

### 2. Statistika Inferensial
Bagaimana mengambil kesimpulan dari sekumpulan data acak dengan margin of error yang tepat.

### Penerapan di Indonesia
Pemanfaatan model matematika untuk mitigasi bencana banjir di kota-kota besar Indonesia menggunakan sensor debit air.`,

  "Fisika": `## Mekanika dan Termodinamika Nusantara
Hukum fisika menjelaskan keajaiban teknologi leluhur dan masa depan.

### 1. Mekanika Fluida
Prinsip Archimedes yang digunakan pada desain kapal Phinisi agar mampu membelah samudra dengan efisien.

### 2. Gelombang Elektromagnetik
Dasar dari teknologi komunikasi seluler yang menghubungkan pulau-pulau di Indonesia.`,

  "Informatika": `## Berpikir Komputasional & AI
Menjadi kreator solusi digital untuk Indonesia Emas 2045.

### 1. Algoritma Pencarian
Bagaimana Google atau Gojek menemukan rute tercepat di kemacetan Jakarta.

### 2. Keamanan Data (Cybersecurity)
Pentingnya enkripsi untuk melindungi data pribadi dari serangan phising.`,

  "Fiqih": `## Fiqih: Tata Aturan Kehidupan Islami
Ilmu Fiqih membimbing umat dalam menjalankan ibadah dan interaksi sosial sesuai syariat.

### 1. Fiqih Ibadah
- **Sholat**: Tata cara sholat fardhu dan sunnah.
- **Zakat**: Pengertian dan perhitungan zakat Mal & Fitrah.
- **Puasa**: Syarat sah dan rukun puasa.

### 2. Fiqih Muamalah
- **Transaksi**: Hukum jual beli dan larangan riba.
- **Warisan**: Dasar pembagian harta Faroidh.`,

  "Default": `## Modul Belajar Nusantara
Materi ini sedang diperbarui oleh Tim Ahli untuk memastikan kesesuaian dengan Standar Nasional Pendidikan terbaru.`
};

export const getReadingMaterial = async (topic: string, subject: string) => {
  const subjectKey = Object.keys(READING_BANK).find(k => subject.includes(k)) || "Default";
  return READING_BANK[subjectKey];
};

export const getConceptDeepDive = async (topic: string, subject: string) => {
  return `### Bedah Konsep Mendalam: ${topic}

1. **Kenapa Materi Ini Sulit?** Biasanya karena siswa langsung ke rumus tanpa memahami fenomena di baliknya.
2. **Koneksi Antar Bab**: Konsep ini adalah turunan dari materi di kelas sebelumnya.
3. **Penerapan Karir**: Ahli Data, Insinyur, dan Arsitek menggunakan prinsip ini setiap hari.

*Tips: Visualisasikan masalah dalam bentuk gambar sebelum mulai menghitung.*`;
};

const QUIZ_BANK: Record<string, any[]> = {
  "Matematika": [
    { id: "m1", text: "Jika log 2 = 0,301, berapakah nilai dari log 20?", options: ["1,301", "2,301", "0,602", "1,602"], correctAnswer: 0 },
    { id: "m2", text: "Berapakah nilai rata-rata dari data: 4, 6, 8, 10, 12?", options: ["8", "9", "10", "7"], correctAnswer: 0 },
    { id: "m3", text: "Himpunan penyelesaian dari x² - 5x + 6 = 0 adalah?", options: ["{2, 3}", "{-2, -3}", "{1, 6}", "{-1, -6}"], correctAnswer: 0 },
    { id: "m4", text: "Nilai dari sin 30° adalah?", options: ["0", "1/2", "1/2√2", "1"], correctAnswer: 1 },
    { id: "m5", text: "Berapa banyak rusuk pada bangun ruang kubus?", options: ["8", "10", "12", "6"], correctAnswer: 2 },
    { id: "m6", text: "Turunan pertama dari f(x) = 3x² + 5x - 7 adalah?", options: ["6x + 5", "3x + 5", "6x - 7", "6x² + 5"], correctAnswer: 0 },
    { id: "m7", text: "Sebuah segitiga siku-siku memiliki alas 6cm dan tinggi 8cm. Panjang sisi miringnya?", options: ["10cm", "14cm", "12cm", "9cm"], correctAnswer: 0 },
    { id: "m8", text: "Berapakah hasil dari 2³ + 3²?", options: ["17", "15", "13", "14"], correctAnswer: 0 },
    { id: "m9", text: "Median dari data 3, 5, 7, 9, 11 adalah?", options: ["7", "5", "9", "6"], correctAnswer: 0 },
    { id: "m10", text: "Volume bola dengan jari-jari 7cm adalah (π=22/7)?", options: ["1437.33 cm³", "1347.33 cm³", "1540.33 cm³", "1400 cm³"], correctAnswer: 0 }
  ],
  "Bahasa Indonesia": [
    { id: "bi1", text: "Manakah penulisan kata depan yang benar sesuai PUEBI?", options: ["di rumah", "dirumah", "keatas", "di jual"], correctAnswer: 0 },
    { id: "bi2", text: "Majas yang membandingkan benda mati seolah-olah hidup disebut?", options: ["Hiperbola", "Metafora", "Personifikasi", "Aliterasi"], correctAnswer: 2 },
    { id: "bi3", text: "Kalimat yang subjeknya melakukan pekerjaan disebut kalimat...", options: ["Aktif", "Pasif", "Tanya", "Perintah"], correctAnswer: 0 },
    { id: "bi4", text: "Ide pokok dalam sebuah paragraf biasanya terdapat pada...", options: ["Kalimat Utama", "Kalimat Penjelas", "Judul", "Kata Kunci"], correctAnswer: 0 },
    { id: "bi5", text: "Antonim dari kata 'Prolog' adalah...", options: ["Dialog", "Monolog", "Epilog", "Katalog"], correctAnswer: 2 },
    { id: "bi6", text: "Manakah yang merupakan kalimat efektif?", options: ["Bagi para siswa-siswa diharapkan tenang.", "Para siswa diharapkan tenang.", "Semua siswa-siswa harus hadir.", "Kepada Bapak Kepala Sekolah waktu dan tempat kami persilakan."], correctAnswer: 1 }
  ],
  "Fisika": [
    { id: "f1", text: "Sebuah benda bermassa 2kg ditarik dengan gaya 10N. Percepatannya adalah?", options: ["5 m/s²", "20 m/s²", "0.2 m/s²", "8 m/s²"], correctAnswer: 0 },
    { id: "f2", text: "Cepat rambat cahaya di ruang hampa adalah?", options: ["3 x 10⁸ m/s", "3 x 10⁵ m/s", "300 m/s", "3 x 10⁶ m/s"], correctAnswer: 0 },
    { id: "f3", text: "Satuan Internasional (SI) untuk suhu adalah?", options: ["Celcius", "Reamur", "Kelvin", "Fahrenheit"], correctAnswer: 2 },
    { id: "f4", text: "Hukum Newton II berbunyi...", options: ["F = m.a", "v = s/t", "E = mc²", "P = F/A"], correctAnswer: 0 },
    { id: "f5", text: "Energi yang dimiliki benda karena kedudukannya disebut energi...", options: ["Kinetik", "Potensial", "Mekanik", "Kalor"], correctAnswer: 1 }
  ],
  "Default": [
    { id: "d1", text: "Dasar negara Indonesia adalah?", options: ["Pancasila", "UUD 1945", "Proklamasi", "Bhinneka Tunggal Ika"], correctAnswer: 0 },
    { id: "d2", text: "Kapan Indonesia merdeka?", options: ["17 Agustus 1945", "20 Mei 1908", "28 Oktober 1928", "1 Juni 1945"], correctAnswer: 0 },
    { id: "d3", text: "Lagu kebangsaan Indonesia adalah...", options: ["Indonesia Raya", "Padamu Negeri", "Garuda Pancasila", "Halo-Halo Bandung"], correctAnswer: 0 }
  ]
};

export const getQuizQuestions = async (topic: string, subject: string) => {
  const subjectKey = Object.keys(QUIZ_BANK).find(k => subject.includes(k)) || "Default";
  return QUIZ_BANK[subjectKey];
};
