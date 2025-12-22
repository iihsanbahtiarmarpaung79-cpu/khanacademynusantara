
// File ini sekarang berfungsi sebagai penyedia data statis (Bank Materi & Kuis)
// Menggantikan fungsi AI sebelumnya untuk stabilitas dan kecepatan akses.

export const getAITutoring = async (topic: string, subject: string, level: string) => {
  return `Penjelasan mendalam tentang ${topic} (${subject}) sedang dalam proses penyusunan oleh tim kurikulum pusat.`;
};

export const getAIDiscussionInsight = async (topic: string, content: string) => {
  return "Terima kasih atas diskusinya! Fokus pada poin utama kurikulum merdeka adalah pemahaman konsep secara mandiri dan kolaboratif.";
};

// Bank Data Bacaan Statis
const READING_BANK: Record<string, string> = {
  "Matematika": `## Pendahuluan
Matematika bukan sekadar angka, melainkan bahasa logika untuk memahami alam semesta. Di Kurikulum Merdeka, kita fokus pada pemecahan masalah nyata.

## Konsep Utama
1. **Logika Numerasi**: Kemampuan mengolah data untuk pengambilan keputusan.
2. **Aljabar**: Memahami pola dan hubungan antar variabel.
3. **Geometri**: Penguasaan ruang dan bentuk dalam arsitektur.

## Contoh Kasus di Indonesia
Perhitungan pembagian waris atau zakat menggunakan prinsip matematika, serta desain motif batik yang menggunakan pola fraktal geometri.

## Kesimpulan
Menguasai matematika berarti menguasai cara berpikir sistematis yang sangat dibutuhkan di era digital.`,

  "Fisika": `## Pendahuluan
Fisika mempelajari materi dan energinya melalui ruang dan waktu. Kita belajar bagaimana alam semesta berperilaku.

## Konsep Utama
1. **Mekanika**: Hukum gerak Newton yang mendasari transportasi.
2. **Termodinamika**: Perpindahan panas dan energi.
3. **Listrik & Magnet**: Dasar dari teknologi elektronik modern.

## Contoh Kasus di Indonesia
Pemanfaatan panel surya di daerah pesisir Indonesia dan prinsip aerodinamika pada pembuatan pesawat N-250 karya BJ Habibie.

## Kesimpulan
Fisika memberikan jawaban atas fenomena alam di sekitar kita melalui eksperimen dan pembuktian matematis.`,

  "Biologi": `## Pendahuluan
Biologi adalah ilmu tentang kehidupan. Indonesia sebagai negara megabiodiversitas adalah laboratorium biologi terbesar di dunia.

## Konsep Utama
1. **Sel**: Unit terkecil penyusun makhluk hidup.
2. **Genetika**: Pewarisan sifat dan evolusi.
3. **Ekosistem**: Hubungan timbal balik antara makhluk hidup dan lingkungan.

## Contoh Kasus di Indonesia
Konservasi badak bercula satu di Ujung Kulon dan pemanfaatan tanaman herbal tradisional (Jamu) sebagai obat alami.

## Kesimpulan
Memahami biologi membantu kita menjaga kelestarian alam Nusantara demi masa depan generasi mendatang.`,

  "Default": `Materi bacaan untuk mata pelajaran ini sedang dalam tahap digitalisasi. Silakan cek kembali dalam waktu dekat untuk konten lengkap sesuai Kurikulum Merdeka.`
};

export const generateReadingMaterial = async (topic: string, subject: string, level: string) => {
  // Mencari materi berdasarkan subject atau fallback ke default
  const subjectKey = Object.keys(READING_BANK).find(k => subject.includes(k)) || "Default";
  return READING_BANK[subjectKey];
};

export const generateConceptDeepDive = async (topic: string, subject: string, level: string) => {
  return `### Mengapa ${topic} itu Penting?
Memahami konsep ini adalah pondasi untuk bab-bab selanjutnya. Dalam dunia nyata, ini digunakan oleh para profesional untuk menyelesaikan masalah kompleks secara efisien.

### Analogi Sederhana
Bayangkan konsep ini seperti membangun sebuah pondasi rumah; jika pondasinya kuat, maka seluruh bangunan di atasnya akan kokoh menghadapi badai ujian.

### Kesalahan Umum Siswa
Siswa seringkali hanya menghafal rumus tanpa mengerti kenapa rumus itu ada. Pastikan kamu memahami logika di baliknya!`;
};

// Bank Data Kuis Statis
const QUIZ_BANK: Record<string, any[]> = {
  "Matematika": [
    {
      id: "q1",
      text: "Manakah yang merupakan hasil dari perkalian 12 x 12?",
      options: ["124", "144", "164", "184"],
      correctAnswer: 1
    },
    {
      id: "q2",
      text: "Berapakah nilai x jika 2x + 5 = 15?",
      options: ["5", "10", "15", "20"],
      correctAnswer: 0
    },
    {
      id: "q3",
      text: "Pola bilangan 2, 4, 8, 16... selanjutnya adalah?",
      options: ["24", "30", "32", "36"],
      correctAnswer: 2
    }
  ],
  "Fisika": [
    {
      id: "f1",
      text: "Satuan internasional untuk massa adalah?",
      options: ["Gram", "Kilogram", "Newton", "Pascal"],
      correctAnswer: 1
    },
    {
      id: "f2",
      text: "Siapakah ilmuwan yang menemukan hukum gravitasi?",
      options: ["Albert Einstein", "Nicola Tesla", "Isaac Newton", "Marie Curie"],
      correctAnswer: 2
    }
  ],
  "Default": [
    {
      id: "d1",
      text: "Siapakah Bapak Proklamator Indonesia?",
      options: ["Soeharto", "Soekarno", "BJ Habibie", "Abdurrahman Wahid"],
      correctAnswer: 1
    },
    {
      id: "d2",
      text: "Apa lambang negara Indonesia?",
      options: ["Padi dan Kapas", "Bintang", "Garuda Pancasila", "Rantai"],
      correctAnswer: 2
    }
  ]
};

export const generateQuizQuestions = async (topic: string, subject: string) => {
  const subjectKey = Object.keys(QUIZ_BANK).find(k => subject.includes(k)) || "Default";
  return QUIZ_BANK[subjectKey];
};
