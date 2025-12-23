
import React, { useState } from 'react';
import { User, Jenjang } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Siswa' | 'Guru' | 'Admin'>('Siswa');
  const [schoolName, setSchoolName] = useState('');
  const [jenjang, setJenjang] = useState<Jenjang>('SMA');
  const [kelas, setKelas] = useState('Kelas 10');
  const [error, setError] = useState('');

  const generateNusantaraID = () => {
    return `NS-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const isAdminAccount = email === 'idirtanjung6@gmail.com' && password === 'fadel.com';

    if (role === 'Admin') {
      if (!isAdminAccount) {
        setError('Kredensial Admin tidak valid.');
        return;
      }
    }

    const mockUser: User = {
      id: isAdminAccount ? 'NS-FOUNDER' : generateNusantaraID(),
      fullName: isAdminAccount ? 'Fadel Aqram Marpaung' : email.split('@')[0],
      email,
      role,
      jenjang: role === 'Siswa' ? jenjang : 'SMA',
      kelas: role === 'Siswa' ? kelas : 'Umum',
      schoolName: isAdminAccount ? 'Pusat Kendali Nusantara' : (schoolName || 'SMA Negeri 1 Jakarta'),
      birthDate: '2000-01-01',
      religion: 'Pendidikan Agama Islam',
      hobbies: 'Membangun Masa Depan Pendidikan',
      photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      isOnline: true,
      jurusan: (jenjang === 'SMA' || jenjang === 'MAN') ? 'IPA' : undefined
    };
    
    const allUsers = JSON.parse(localStorage.getItem('ka_all_users') || '[]');
    if (!allUsers.find((u: any) => u.email === mockUser.email)) {
      allUsers.push(mockUser);
      localStorage.setItem('ka_all_users', JSON.stringify(allUsers));
    }

    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="md:w-1/2 bg-indigo-600 p-12 flex flex-col justify-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
            <span className="text-indigo-600 font-black text-3xl">KA</span>
          </div>
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Khan Academy Nusantara</h1>
          <p className="text-indigo-100 text-xl max-w-md leading-relaxed opacity-90">
            Akses materi terverifikasi dan kuis 30 soal AI dalam satu platform pintar.
          </p>
        </div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full opacity-50 blur-3xl"></div>
      </div>

      <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-slate-50 md:bg-white overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Selamat Datang</h2>
          <p className="text-slate-500 mb-8">Silakan masuk untuk melanjutkan belajar.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              {['Siswa', 'Guru', 'Admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setRole(r as any); setError(''); }}
                  className={`py-2.5 text-xs font-black rounded-xl border transition-all uppercase tracking-wider ${role === r ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'}`}
                >
                  {r}
                </button>
              ))}
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-xl">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Email / Username</label>
                <input
                  required
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                  placeholder="nama@sekolah.id"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Password</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>

              {role === 'Siswa' && (
                <div className="space-y-4 pt-2 animate-fadeIn">
                  <div className="h-px bg-slate-100 w-full my-4"></div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">🏠 Nama Sekolah</label>
                    <input
                      required
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full px-5 py-3 rounded-xl bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-700"
                      placeholder="Masukkan Sekolah Anda"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">🎓 Jenjang</label>
                      <select 
                        value={jenjang}
                        onChange={(e) => setJenjang(e.target.value as Jenjang)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-100 border-transparent outline-none font-bold text-sm"
                      >
                        {['SD', 'SMP', 'SMA', 'MAN'].map(j => <option key={j} value={j}>{j}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">🏫 Kelas</label>
                      <select 
                        value={kelas}
                        onChange={(e) => setKelas(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-100 border-transparent outline-none font-bold text-sm"
                      >
                        {jenjang === 'SD' ? ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'].map(k => <option key={k} value={k}>{k}</option>) :
                         jenjang === 'SMP' ? ['Kelas 7', 'Kelas 8', 'Kelas 9'].map(k => <option key={k} value={k}>{k}</option>) :
                         ['Kelas 10', 'Kelas 11', 'Kelas 12'].map(k => <option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl mt-4"
            >
              Masuk Sekarang
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Belum punya akun?{' '}
              <button onClick={onSwitchToRegister} className="text-indigo-600 font-bold hover:underline">
                Daftar Gratis
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
