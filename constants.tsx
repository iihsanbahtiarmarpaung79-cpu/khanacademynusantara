
import { Jenjang } from './types';

export const RELIGIONS = [
  "Pendidikan Agama Islam",
  "Pendidikan Agama Kristen",
  "Pendidikan Agama Katolik",
  "Pendidikan Agama Hindu",
  "Pendidikan Agama Buddha",
  "Pendidikan Agama Konghucu"
];

export const CURRICULUM: Record<Jenjang, any> = {
  SD: {
    "Kelas 1": ["Matematika", "Bahasa Indonesia", "Pendidikan Pancasila", "Pendidikan Agama", "Bahasa Daerah", "Literasi Membaca", "Numerasi Dasar", "PJOK", "Seni Budaya"],
    "Kelas 2": ["Matematika", "Bahasa Indonesia", "Pendidikan Pancasila", "Pendidikan Agama", "Bahasa Daerah", "Literasi Digital", "Numerasi", "PJOK", "Seni Budaya"],
    "Kelas 3": ["Matematika", "Bahasa Indonesia", "IPAS", "Pendidikan Pancasila", "Pendidikan Agama", "Bahasa Inggris Dasar", "Informatika Dasar", "PJOK", "Seni Budaya"],
    "Kelas 4": ["Matematika", "Bahasa Indonesia", "IPAS", "Bahasa Inggris", "Informatika", "Pendidikan Pancasila", "Pendidikan Agama", "PJOK", "Seni Budaya"],
    "Kelas 5": ["Matematika", "Bahasa Indonesia", "IPAS", "Bahasa Inggris", "Informatika", "Pendidikan Pancasila", "Pendidikan Agama", "Kewirausahaan Dasar", "PJOK", "Seni Budaya"],
    "Kelas 6": ["Matematika", "Bahasa Indonesia", "IPAS", "Bahasa Inggris", "Informatika", "Pendidikan Pancasila", "Pendidikan Agama", "Persiapan SMP", "PJOK", "Seni Budaya"],
  },
  SMP: {
    "Kelas 7": ["Matematika", "Bahasa Indonesia", "Bahasa Inggris", "IPA", "IPS", "Informatika", "Pendidikan Pancasila", "Pendidikan Agama", "PJOK", "Seni Budaya", "Literasi Digital"],
    "Kelas 8": ["Matematika", "Bahasa Indonesia", "Bahasa Inggris", "IPA", "IPS", "Informatika", "Prakarya", "Pendidikan Pancasila", "Pendidikan Agama", "PJOK", "Seni Budaya", "Kewirausahaan"],
    "Kelas 9": ["Matematika", "Bahasa Indonesia", "Bahasa Inggris", "IPA", "IPS", "Informatika", "Prakarya", "Pendidikan Pancasila", "Pendidikan Agama", "PJOK", "Seni Budaya", "Persiapan SMA/SMK"],
  },
  SMA: {
    "Kelas 10": ["Matematika Wajib", "Bahasa Indonesia", "Bahasa Inggris", "Sejarah", "Fisika Dasar", "Kimia Dasar", "Biologi Dasar", "Geografi", "Ekonomi", "Sosiologi", "Informatika", "Pendidikan Pancasila", "Pendidikan Agama", "PJOK", "Seni Budaya"],
    "Kelas 11": {
      "IPA": ["Matematika", "Fisika", "Kimia", "Biologi", "Informatika Lanjut", "Statistika", "Bahasa Indonesia", "Bahasa Inggris", "Pendidikan Agama"],
      "IPS": ["Matematika", "Ekonomi", "Geografi", "Sosiologi", "Sejarah", "Akuntansi", "Bahasa Indonesia", "Bahasa Inggris", "Pendidikan Agama"]
    },
    "Kelas 12": {
      "IPA": ["Matematika", "Fisika", "Kimia", "Biologi", "Pemrograman", "Statistika", "Bahasa Indonesia", "Bahasa Inggris", "Pendidikan Agama", "Persiapan UTBK"],
      "IPS": ["Matematika", "Ekonomi", "Geografi", "Sosiologi", "Sejarah", "Akuntansi", "Bahasa Indonesia", "Bahasa Inggris", "Pendidikan Agama", "Persiapan UTBK"]
    }
  },
  MAN: {
    "Kelas 10": ["Matematika", "Bahasa Indonesia", "Bahasa Inggris", "Informatika", "Sejarah", "Pendidikan Pancasila", "Pendidikan Agama", "Logika", "PJOK", "Seni Budaya"],
    "Kelas 11": {
      "IPA": ["Matematika", "Fisika", "Kimia", "Biologi", "Statistika", "Informatika", "Bahasa Indonesia", "Bahasa Inggris", "Pendidikan Agama", "Metodologi Ilmiah"],
      "IPS": ["Matematika", "Ekonomi", "Geografi", "Sosiologi", "Sejarah", "Akuntansi", "Informatika", "Bahasa Indonesia", "Bahasa Inggris", "Pendidikan Agama"]
    },
    "Kelas 12": {
      "IPA": ["Matematika", "Fisika", "Kimia", "Biologi", "Bioteknologi", "Statistika", "Pemrograman", "Bahasa Indonesia", "Bahasa Inggris", "Pendidikan Agama", "Persiapan PTN"],
      "IPS": ["Matematika", "Ekonomi", "Geografi", "Sosiologi", "Sejarah", "Akuntansi", "Manajemen", "Bahasa Indonesia", "Bahasa Inggris", "Pendidikan Agama", "Persiapan PTN"]
    }
  }
};

export const ADMIN_INFO = {
  name: "Fadel Aqram Marpaung",
  role: "Founder & Super Admin",
  whatsapp: "0882277930100"
};
