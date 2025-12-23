
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { ADMIN_INFO } from '../constants';
import DashboardSiswa from './DashboardSiswa';

const DashboardAdmin: React.FC<{ user: User; activeTab: string; onTabChange: (tab: string) => void; onUpdateUser?: (u: User) => void }> = ({ user, activeTab, onTabChange, onUpdateUser }) => {
  const [mockUsers, setMockUsers] = useState<any[]>([
    { name: 'Andi Pratama', role: 'SISWA', id: 'NS-8921', mail: 'andi@gmail.com', status: 'Online' },
    { name: 'Siti Rahma', role: 'GURU', id: 'NS-G001', mail: 'siti@guru.id', status: 'Online' },
    { name: 'Budi Santoso', role: 'SISWA', id: 'NS-1234', mail: 'budi@gmail.com', status: 'Online' }
  ]);

  if (['Profil', 'Pengaturan', 'Hubungi Admin', 'Tentang Kami'].includes(activeTab)) {
    return <DashboardSiswa user={user} activeTab={activeTab} onTabChange={onTabChange} onUpdateUser={onUpdateUser} />;
  }

  const renderKelolaUser = () => (
    <div className="max-w-6xl mx-auto animate-fadeIn py-6 px-4 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-800">Manajemen Pengguna Nusantara</h2>
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg">Tambah User</button>
      </div>
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-6 overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
              <tr><th className="px-6 py-4">User & ID</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Aksi</th></tr>
            </thead>
            <tbody className="divide-y">
              {mockUsers.map((u, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600">{u.name[0]}</div>
                    <div><p className="font-bold text-slate-800 text-sm">{u.name}</p><p className="text-[9px] text-indigo-500 font-black uppercase">{u.id}</p></div>
                  </td>
                  <td className="px-6 py-5"><span className={`px-4 py-1.5 rounded-xl text-[9px] font-black ${u.role === 'GURU' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>{u.role}</span></td>
                  <td className="px-6 py-5"><div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${u.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span><span className="text-[10px] font-black text-slate-500">{u.status}</span></div></td>
                  <td className="px-6 py-5"><button className="text-xs font-black text-indigo-600 hover:underline">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMonitoring = () => (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn py-6 px-4">
      <h2 className="text-3xl font-black text-slate-800">Status Node Server Nusantara</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {['API Gateway (Surabaya)', 'AI Engine (Jakarta)', 'Database (Global)', 'Storage (Medan)'].map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center"><h3 className="font-black text-slate-800">{s}</h3><span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">AKTIF</span></div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-600" style={{ width: `${30 + i * 15}%` }}></div></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Beban Sistem: {30 + i * 15}%</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (activeTab === 'Kelola User') return renderKelolaUser();
  if (activeTab === 'Monitoring') return renderMonitoring();

  return (
    <div className="space-y-10 animate-fadeIn pb-24 px-4">
      <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600 rounded-full blur-[150px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10 text-center md:text-left">
          <div className="space-y-6">
             <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <div className="inline-block px-5 py-2 bg-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">Founder Control Center</div>
                <div className="inline-block px-5 py-2 bg-white/10 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-400">NS-FOUNDER</div>
             </div>
             <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">{ADMIN_INFO.name}</h2>
             <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl">Mengawasi ekosistem pendidikan cerdas Nusantara. Integrasi Gemini AI Pro aktif.</p>
          </div>
          <img src={user.photoUrl} className="w-48 h-48 md:w-64 md:h-64 rounded-[4rem] border-[12px] border-white/5 shadow-2xl object-cover" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Pengguna', val: '12.451', icon: '👥', color: 'text-indigo-600' },
          { label: 'Sesi Hari Ini', val: '1.240', icon: '⚡', color: 'text-emerald-500' },
          { label: 'Kuis AI Terbit', val: '8.125', icon: '📋', color: 'text-orange-500' },
          { label: 'Laporan Bug', val: '0', icon: '🚩', color: 'text-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all">
            <div className="flex justify-between items-start mb-6"><span className="text-4xl">{stat.icon}</span><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span></div>
            <p className={`text-4xl font-black ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardAdmin;
