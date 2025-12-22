
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="h-24 glass-effect border-b border-slate-200/50 px-8 md:px-12 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-12 flex-1">
        <div className="relative w-full max-w-md hidden lg:block group">
          <input 
            type="text" 
            placeholder="Cari materi, kuis, atau teman..." 
            className="w-full pl-12 pr-6 py-3.5 bg-slate-100/50 border border-transparent rounded-[1.25rem] focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all outline-none text-sm font-medium"
          />
          <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Global Progress - Just for decoration/visual enhancement */}
        <div className="hidden xl:flex items-center gap-4 border-l border-slate-200 pl-12">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Target Harian</p>
              <p className="text-sm font-black text-slate-800">85% Selesai</p>
           </div>
           <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[85%]"></div>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-black text-slate-900 tracking-tight">{user.fullName}</p>
          <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-0.5">{user.role} • {user.jenjang}</p>
        </div>
        
        <div className="relative group cursor-pointer">
          <div className="w-14 h-14 rounded-2xl border-2 border-indigo-100 p-1 group-hover:border-indigo-600 transition-all duration-300">
            <img 
              src={user.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
              alt="Profile" 
              className="w-full h-full rounded-xl object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full shadow-sm"></div>
          
          {/* Profile Dropdown Hover Effect (Visual Only) */}
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
             <button className="w-full text-left px-4 py-2 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600">Lihat Profil</button>
             <button className="w-full text-left px-4 py-2 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600">Notifikasi</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
