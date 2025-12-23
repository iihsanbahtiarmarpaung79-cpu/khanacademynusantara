
import { Jenjang } from './types';

export const RELIGIONS = [
  "Pendidikan Agama Islam",
  "Pendidikan Agama Kristen",
  "Pendidikan Agama Katolik",
  "Pendidikan Agama Hindu",
  "Pendidikan Agama Buddha",
  "Pendidikan Agama Konghucu"
];

// Mapping ikon dan warna untuk kategori pelajaran
export const SUBJECT_META: Record<string, { icon: string, color: string }> = {
  "Matematika": { icon: "🔢", color: "bg-orange-500" },
  "Bahasa Indonesia": { icon: "🇮🇩", color: "bg-red-500" },
  "IPA": { icon: "🧪", color: "bg-emerald-500" },
  "IPS": { icon: "🌍", color: "bg-blue-500" },
  "Fisika": { icon: "⚡", color: "bg-indigo-500" },
  "Kimia": { icon: "🧪", color: "bg-pink-500" },
  "Biologi": { icon: "🌿", color: "bg-green-500" },
  "Informatika": { icon: "💻", color: "bg-slate-700" },
  "Ekonomi": { icon: "📈", color: "bg-amber-600" },
  "Sejarah": { icon: "🏛️", color: "bg-stone-600" },
  "Pendidikan Agama": { icon: "🕌", color: "bg-teal-600" },
  "Fiqih": { icon: "🕋", color: "bg-emerald-700" },
  "Bahasa Inggris": { icon: "🇬🇧", color: "bg-indigo-400" },
  "Default": { icon: "📚", color: "bg-indigo-600" }
};

export const CURRICULUM: Record<Jenjang, any> = {
  SD: {
    "Kelas 1": ["Matematika", "Bahasa Indonesia", "Budaya Nusantara", "Pendidikan Pancasila", "Pendidikan Agama", "Bahasa Daerah", "Literasi Membaca", "Numerasi Dasar", "PJOK", "Seni Budaya"],
    "Kelas 2": ["Matematika", "Bahasa Indonesia", "Keterampilan Dasar", "Pendidikan Pancasila", "Pendidikan Agama", "Bahasa Daerah", "Literasi Digital", "Numerasi", "PJOK", "Seni Budaya"],
    "Kelas 3": ["Matematika", "Bahasa Indonesia", "IPAS", "Prakarya Dasar", "Pendidikan Pancasila", "Pendidikan Agama", "Bahasa Inggris Dasar", "Informatika Dasar", "PJOK", "Seni Budaya"],
    "Kelas 4": ["Matematika", "Bahasa Indonesia", "IPAS", "Eksplorasi Alam", "Bahasa Inggris", "Informatika", "Pendidikan Pancasila", "Pendidikan Agama", "PJOK", "Seni Budaya"],
    "Kelas 5": ["Matematika", "Bahasa Indonesia", "IPAS", "Ilmu Kewarganegaraan", "Bahasa Inggris", "Informatika", "Pendidikan Pancasila", "Pendidikan Agama", "Kewirausahaan Dasar", "PJOK", "Seni Budaya"],
    "Kelas 6": ["Matematika", "Bahasa Indonesia", "IPAS", "Proyek Akhir Sekolah", "Bahasa Inggris", "Informatika", "Pendidikan Pancasila", "Pendidikan Agama", "Persiapan SMP", "PJOK", "Seni Budaya"],
  },
  SMP: {
    "Kelas 7": ["Matematika", "Bahasa Indonesia", "Bahasa Inggris", "Teknologi Informasi", "IPA", "IPS", "Informatika", "Pendidikan Pancasila", "Pendidikan Agama", "PJOK", "Seni Budaya", "Literasi Digital"],
    "Kelas 8": ["Matematika", "Bahasa Indonesia", "Bahasa Inggris", "Karya Ilmiah Remaja", "IPA", "IPS", "Informatika", "Prakarya", "Pendidikan Pancasila", "Pendidikan Agama", "PJOK", "Seni Budaya", "Kewirausahaan"],
    "Kelas 9": ["Matematika", "Bahasa Indonesia", "Bahasa Inggris", "Pemrograman Dasar", "IPA", "IPS", "Informatika", "Prakarya", "Pendidikan Pancasila", "Pendidikan Agama", "PJOK", "Seni Budaya", "Persiapan SMA/SMK"],
  },
  SMA: {
    "Kelas 10": ["Matematika Wajib", "Bahasa Indonesia", "Bahasa Inggris", "Teknologi Terapan", "Sejarah", "Fisika Dasar", "Kimia Dasar", "Biologi Dasar", "Geografi", "Ekonomi", "Sosiologi", "Informatika", "Pendidikan Pancasila", "Pendidikan Agama", "PJOK", "Seni Budaya"],
    "Kelas 11": {
      "IPA": ["Matematika", "Fisika Lanjut", "Kimia Lanjut", "Biologi Lanjut", "Informatika Lanjut", "Statistika", "Bahasa Indonesia", "Bahasa Inggris", "Pendidikan Agama", "Karya Ilmiah"],
      "IPS": ["Matematika", "Ekonomi Lanjut", "Geografi Lanjut", "Sosiologi Lanjut", "Sejarah Dunia", "Akuntansi Dasar", "Bahasa Indonesia", "Bahasa Inggris", "Pendidikan Agama", "Antropologi"]
    },
    "Kelas 12": {
      "IPA": ["Matematika", "Persiapan Olimpiade Sains", "Fisika", "Kimia", "Biologi", "Pemrograman", "Statistika", "Bahasa Indonesia", "Bahasa Inggris", "Pendidikan Agama", "Persiapan UTBK"],
      "IPS": ["Matematika", "Manajemen Bisnis", "Ekonomi", "Geografi", "Sosiologi", "Sejarah", "Akuntansi", "Bahasa Indonesia", "Bahasa Inggris", "Pendidikan Agama", "Persiapan UTBK"]
    }
  },
  MAN: {
    "Kelas 10": ["Matematika", "Bahasa Indonesia", "Bahasa Inggris", "Fiqih", "Informatika", "Sejarah Islam", "Pendidikan Pancasila", "Pendidikan Agama", "Logika", "PJOK", "Seni Budaya"],
    "Kelas 11": {
      "IPA": ["Matematika", "Fisika", "Kimia", "Biologi", "Fiqih", "Sains Terapan", "Statistika", "Informatika", "Bahasa Indonesia", "Bahasa Inggris", "Pendidikan Agama", "Metodologi Ilmiah"],
      "IPS": ["Matematika", "Ekonomi", "Geografi", "Sosiologi", "Sejarah", "Akuntansi", "Fiqih", "Analisis Sosial", "Informatika", "Bahasa Indonesia", "Bahasa Inggris", "Pendidikan Agama"]
    },
    "Kelas 12": {
      "IPA": ["Matematika", "Fisika", "Kimia", "Biologi", "Fiqih", "Informatika Lanjut", "Statistika", "Pemrograman", "Bahasa Indonesia", "Bahasa Inggris", "Pendidikan Agama", "Persiapan PTN"],
      "IPS": ["Matematika", "Ekonomi", "Geografi", "Sosiologi", "Sejarah", "Akuntansi", "Fiqih", "Etika Sosial", "Bahasa Indonesia", "Bahasa Inggris", "Pendidikan Agama", "Persiapan PTN"]
    }
  }
};

export const ADMIN_INFO = {
  name: "Fadel Aqram Marpaung",
  role: "Founder & Super Admin",
  whatsapp: "088227790100"
};
