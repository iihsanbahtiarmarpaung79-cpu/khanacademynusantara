
import React, { useState } from 'react';
import { User } from '../types';
import { ADMIN_INFO } from '../constants';

interface DashboardAdminProps {
  user: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardAdmin: React.FC<DashboardAdminProps> = ({ user, activeTab, onTabChange }) => {
  if (activeTab === 'Dashboard' || activeTab === 'Kelola User') {
    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="bg-slate-900 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-2 tracking-tight">Pusat Kendali Founder</h2>
            <p className="text-slate-400 font-medium">Akses Penuh: <span className="text-indigo-400 font-bold">{ADMIN_INFO.name}</span></p>
            <div className="flex flex-wrap gap-2 mt-6">
              <button onClick={() => onTabChange('Materi')} className="bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 border border-indigo-600/30 px-4 py-2 rounded-xl text-xs font-bold transition-all">Lihat Sisi Siswa</button>
              <button onClick={() => onTabChange('Kelola Materi')} className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-600/30 px-4 py-2 rounded-xl text-xs font-bold transition-all">Lihat Sisi Guru</button>
            </div>
          </div>
          <div className="mt-8 md:mt-0 relative z-10 text-right">
             <div className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">Sistem Online</div>
             <img src={user.photoUrl} className="w-20 h-20 rounded-3xl border-4 border-slate-800 shadow-2xl object-cover ml-auto" alt="Admin" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Pengguna</p>
            <p className="text-4xl font-black text-slate-800">2,415</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Server Status</p>
            <p className="text-4xl font-black text-emerald-500">STABIL</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Keamanan</p>
            <p className="text-4xl font-black text-indigo-600">AKTIF</p>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h3 className="text-xl font-black text-slate-800">Manajemen Pengguna Global</h3>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                 <tr>
                    <th className="px-8 py-5">Identitas</th>
                    <th className="px-8 py-5">Role</th>
                    <th className="px-8 py-5">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  <tr className="hover:bg-slate-50 transition-all">
                    <td className="px-8 py-6">
                       <p className="font-bold text-slate-800">Budi Santoso</p>
                       <p className="text-xs text-slate-400">budi@sekolah.id</p>
                    </td>
                    <td className="px-8 py-6"><span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">SISWA</span></td>
                    <td className="px-8 py-6"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div></td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-all">
                    <td className="px-8 py-6">
                       <p className="font-bold text-slate-800">Siti Rahma</p>
                       <p className="text-xs text-slate-400">siti.guru@sekolah.id</p>
                    </td>
                    <td className="px-8 py-6"><span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">GURU</span></td>
                    <td className="px-8 py-6"><div className="w-2.5 h-2.5 bg-slate-300 rounded-full"></div></td>
                  </tr>
               </tbody>
             </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-20 space-y-6">
      <div className="text-8xl">⚙️</div>
      <h2 className="text-3xl font-black text-slate-800">Modul {activeTab}</h2>
      <p className="text-slate-500">Sedang disinkronisasi.</p>
    </div>
  );
};

export default DashboardAdmin;
