
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Siswa' | 'Guru' | 'Admin'>('Siswa');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validasi Khusus Admin
    if (role === 'Admin') {
      if (email !== 'idirtanjung6@gmail.com' || password !== 'fadel.com') {
        setError('Kredensial Admin tidak valid. Hanya Founder yang dapat masuk sebagai Admin.');
        return;
      }
    }

    // Mock login logic
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: email === 'idirtanjung6@gmail.com' ? 'Fadel Aqram Marpaung' : email.split('@')[0],
      email,
      role,
      jenjang: 'SMA',
      kelas: 'Kelas 10',
      schoolName: role === 'Admin' ? 'Pusat Kendali Nusantara' : 'SMA Negeri 1 Jakarta',
      birthDate: '2000-01-01',
      religion: 'Pendidikan Agama Islam',
      hobbies: 'Membangun Masa Depan Pendidikan',
      photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      isOnline: true,
    };
    
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
            Platform pendidikan terpadu untuk Indonesia. Akses semua fitur pembelajaran, pengajaran, dan administrasi dalam satu genggaman.
          </p>
        </div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400 rounded-full opacity-30 blur-2xl"></div>
      </div>

      <div className="md:w-1/2 p-8 md:p-24 flex flex-col justify-center bg-slate-50 md:bg-white">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Selamat Datang</h2>
          <p className="text-slate-500 mb-8">Pilih peran dan masuk ke akun Anda.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {['Siswa', 'Guru', 'Admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r as any);
                    setError('');
                  }}
                  className={`py-2.5 text-sm font-bold rounded-xl border transition-all ${
                    role === r 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                  }`}
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

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email / Username</label>
              <input
                required
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder={role === 'Admin' ? 'admin@gmail.com' : 'nama@sekolah.id'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-[0.98]"
            >
              Masuk Sekarang
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500">
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
