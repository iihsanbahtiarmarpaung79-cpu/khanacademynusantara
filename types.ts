
export type Role = 'Siswa' | 'Guru' | 'Admin';
export type Jenjang = 'SD' | 'SMP' | 'SMA' | 'MAN';

export interface User {
  id: string;
  fullName: string;
  schoolName: string;
  birthDate: string;
  jenjang: Jenjang;
  kelas: string;
  jurusan?: 'IPA' | 'IPS';
  religion: string;
  email: string;
  hobbies: string;
  photoUrl: string;
  role: Role;
  isOnline: boolean;
}

export interface Subject {
  name: string;
  category: string;
  icon?: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}
