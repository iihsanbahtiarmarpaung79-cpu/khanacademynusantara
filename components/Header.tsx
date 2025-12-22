
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
      <div className="relative w-96 hidden lg:block">
        <input 
          type="text" 
          placeholder="Cari materi atau kuis..." 
          className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm"
        />
        <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
          <p className="text-xs text-slate-500 uppercase tracking-wider">{user.role} • {user.jenjang} {user.kelas}</p>
        </div>
        
        <div className="relative">
          <img 
            src={user.photoUrl || `https://picsum.photos/seed/${user.id}/100`} 
            alt="Profile" 
            className="w-11 h-11 rounded-full border-2 border-indigo-100 object-cover"
          />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
