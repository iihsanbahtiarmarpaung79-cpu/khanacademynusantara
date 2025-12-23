
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
    role: 'Siswa' as 'Siswa' | 'Guru' | 'Admin',
    jurusan: 'IPA' as 'IPA' | 'IPS'
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const generateNusantaraID = () => {
    return `NS-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    
    if ((window as any).confetti) {
        (window as any).confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#4f46e5', '#06b6d4', '#10b981']
        });
    }

    const newUser: User = {
      ...formData,
      id: generateNusantaraID(),
      photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
      isOnline: true,
    };

    // Simpan ke daftar user global untuk simulasi invite
    const allUsers = JSON.parse(localStorage.getItem('ka_all_users') || '[]');
    allUsers.push(newUser);
    localStorage.setItem('ka_all_users', JSON.stringify(allUsers));

    setTimeout(() => {
        onRegister(newUser);
    }, 2500);
  };

  const getKelasOptions = () => {
    switch (formData.jenjang) {
      case 'SD': return ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'];
      case 'SMP': return ['Kelas 7', 'Kelas 8', 'Kelas 9'];
      default: return ['Kelas 10', 'Kelas 11', 'Kelas 12'];
    }
  };

  if (isSuccess) {
    return (
        <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center p-8 text-white overflow-hidden">
            <div className="text-center space-y-8 animate-scaleIn">
                <div className="text-[120px] animate-bounce-slow">🚀</div>
                <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter">
                    Selamat Datang <br/> di Nusantara!
                </h2>
                <div className="space-y-2">
                    <p className="text-indigo-100 text-xl opacity-80 font-medium">Mempersiapkan akun utama Anda...</p>
                    <div className="w-64 h-2 bg-indigo-500/30 rounded-full mx-auto overflow-hidden">
                        <div className="h-full bg-white w-full animate-[progress_2s_ease-in-out_infinite]"></div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 overflow-y-auto animate-fadeIn">
      <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-indigo-600 p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-6 leading-tight">Mari Bergabung bersama Kami! 🚀</h2>
            <p className="text-indigo-100 mb-10 opacity-80 leading-relaxed">
              Daftarkan diri Anda untuk mengakses platform pendidikan digital Nusantara.
            </p>
            <div className="space-y-6">
              {[
                { n: 1, t: "Identitas Diri", d: "Nama, email, dan tanggal lahir." },
                { n: 2, t: "Nusantara ID", d: "Dapatkan ID unik untuk diundang ke kelas." },
                { n: 3, t: "Mulai Belajar", d: "Akses pustaka materi kurikulum gratis!" }
              ].map(step => (
                <div key={step.n} className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black shrink-0 border border-white/30">
                    {step.n}
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-none mb-1">{step.t}</p>
                    <p className="text-xs text-indigo-200">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:w-2/3 p-10 md:p-16">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="col-span-full mb-4">
              <h3 className="text-2xl font-black text-slate-800">Formulir Pendaftaran</h3>
            </div>

            <div className="col-span-full">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
              <input
                  required
                  type="text"
                  placeholder="Contoh: Fadel Aqram Marpaung"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-bold text-slate-700"
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>

            <div className="col-span-full">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">🏠 Nama Sekolah</label>
              <input
                required
                type="text"
                placeholder="Masukkan Nama Lengkap Sekolah"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-bold text-slate-700 shadow-sm"
                onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">📧 Email</label>
              <input
                required
                type="email"
                placeholder="nama@email.com"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-bold text-slate-700"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">🔑 Password</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-bold text-slate-700"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">🎓 Jenjang</label>
              <select
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-700"
                onChange={(e) => setFormData({...formData, jenjang: e.target.value as Jenjang})}
              >
                {['SD', 'SMP', 'SMA', 'MAN'].map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">🏫 Kelas</label>
              <select
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-700"
                onChange={(e) => setFormData({...formData, kelas: e.target.value})}
              >
                {getKelasOptions().map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            <div className="col-span-full mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <button type="button" onClick={onSwitchToLogin} className="text-slate-400 font-bold hover:text-indigo-600 transition-colors order-2 sm:order-1">
                Sudah punya akun? Masuk
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-indigo-600 text-white px-14 py-5 rounded-[1.5rem] font-black text-lg shadow-2xl hover:bg-indigo-700 transition-all order-1 sm:order-2"
              >
                Daftar & Masuk
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
