
import React, { useState } from 'react';
import { User, Jenjang } from '../types';
import { RELIGIONS } from '../constants';

interface RegisterProps {
  onRegister: (user: User) => void;
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    schoolName: '',
    birthDate: '',
    jenjang: 'SD' as Jenjang,
    kelas: 'Kelas 1',
    religion: RELIGIONS[0],
    email: '',
    password: '',
    hobbies: '',
    role: 'Siswa' as 'Siswa' | 'Guru' | 'Admin'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      photoUrl: `https://picsum.photos/seed/${formData.email}/100`,
      isOnline: true,
      role: formData.role
    };
    onRegister(newUser);
  };

  const getKelasOptions = () => {
    switch (formData.jenjang) {
      case 'SD': return ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'];
      case 'SMP': return ['Kelas 7', 'Kelas 8', 'Kelas 9'];
      default: return ['Kelas 10', 'Kelas 11', 'Kelas 12'];
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-indigo-600 p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Ayo Bergabung!</h2>
          <p className="text-indigo-100 mb-8 opacity-80">
            Lengkapi data diri Anda untuk memulai perjalanan belajar yang seru di Khan Academy Nusantara.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">1</div>
              <span>Data Identitas</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">2</div>
              <span>Pilihan Sekolah</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">3</div>
              <span>Keamanan Akun</span>
            </div>
          </div>
        </div>

        <div className="md:w-2/3 p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full mb-2">
              <h3 className="text-xl font-bold text-slate-800">Formulir Pendaftaran</h3>
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email / Username</label>
              <input
                required
                type="email"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                required
                type="password"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sekolah</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
              <input
                required
                type="date"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jenjang</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                onChange={(e) => setFormData({...formData, jenjang: e.target.value as Jenjang})}
              >
                {['SD', 'SMP', 'SMA', 'MAN'].map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kelas</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                onChange={(e) => setFormData({...formData, kelas: e.target.value})}
              >
                {getKelasOptions().map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Agama</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                onChange={(e) => setFormData({...formData, religion: e.target.value})}
              >
                {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Daftar Sebagai</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                onChange={(e) => setFormData({...formData, role: e.target.value as any})}
              >
                <option value="Siswa">Siswa</option>
                <option value="Guru">Guru</option>
              </select>
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium text-slate-700 mb-1">Hobi</label>
              <textarea
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                rows={2}
                onChange={(e) => setFormData({...formData, hobbies: e.target.value})}
              />
            </div>

            <div className="col-span-full mt-4 flex items-center justify-between">
              <button type="button" onClick={onSwitchToLogin} className="text-slate-500 font-semibold">Kembali Masuk</button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                Daftar Sekarang
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
