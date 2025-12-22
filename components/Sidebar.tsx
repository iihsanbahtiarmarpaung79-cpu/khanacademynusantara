
import React from 'react';
import { Role } from '../types';

interface SidebarProps {
  role: Role;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, onTabChange, onLogout }) => {
  const sections = [
    {
      title: 'Utama',
      items: ['Dashboard', 'Profil', 'Forum'],
      roles: ['Siswa', 'Guru', 'Admin']
    },
    {
      title: 'Fitur Siswa',
      items: ['Materi', 'Kuis', 'Progres'],
      roles: ['Siswa', 'Admin']
    },
    {
      title: 'Fitur Guru',
      items: ['Kelola Materi', 'Kelola Kuis', 'Siswa Online', 'Laporan'],
      roles: ['Guru', 'Admin']
    },
    {
      title: 'Fitur Admin',
      items: ['Kelola User', 'Kelola Pelajaran', 'Monitoring', 'Sistem'],
      roles: ['Admin']
    }
  ];

  // Jika role adalah Admin, tampilkan semua section
  const filteredSections = sections.filter(section => 
    role === 'Admin' || section.roles.includes(role)
  );

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 overflow-y-auto h-full">
      <div className="p-6 flex items-center space-x-3 sticky top-0 bg-white z-10 border-b border-slate-50">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <span className="text-white font-black text-xl">KA</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-slate-800 leading-none">Nusantara</span>
          <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-1">Khan Academy</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 mt-6">
        {filteredSections.map((section) => (
          <div key={section.title} className="mb-8">
            <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              {section.title}
            </h3>
            {section.items.map((item) => (
              <button
                key={item}
                onClick={() => onTabChange(item)}
                className={`w-full text-left px-4 py-2.5 rounded-xl mb-1 transition-all duration-200 flex items-center space-x-3 group ${
                  activeTab === item 
                    ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full transition-all ${activeTab === item ? 'bg-white scale-150' : 'bg-slate-300 group-hover:bg-indigo-400'}`} />
                <span className="text-sm">{item}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 sticky bottom-0 bg-white space-y-2">
        <button
          onClick={() => onTabChange('Pengaturan')}
          className={`w-full px-4 py-3 text-left rounded-xl transition-colors flex items-center space-x-3 group ${
            activeTab === 'Pengaturan' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">Pengaturan</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full px-4 py-3 text-left text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center space-x-3 group"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 group-hover:scale-150 transition-transform" />
          <span className="font-bold text-sm">Keluar Aplikasi</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
