
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
      items: [
        { name: 'Dashboard', icon: '🏠' },
        { name: 'Profil', icon: '👤' },
        { name: 'Forum', icon: '💬' }
      ],
      roles: ['Siswa', 'Guru', 'Admin']
    },
    {
      title: 'Belajar',
      items: [
        { name: 'Materi', icon: '📚' },
        { name: 'Kuis', icon: '📝' },
        { name: 'Progres', icon: '📈' }
      ],
      roles: ['Siswa', 'Admin']
    },
    {
      title: 'Pengajaran',
      items: [
        { name: 'Kelola Materi', icon: '🛠️' },
        { name: 'Kelola Kuis', icon: '📋' },
        { name: 'Siswa Online', icon: '👥' }
      ],
      roles: ['Guru', 'Admin']
    }
  ];

  const filteredSections = sections.filter(section => 
    role === 'Admin' || section.roles.includes(role)
  );

  return (
    <div className="hidden md:flex flex-col w-72 glass-effect border-r border-slate-200/50 h-screen sticky top-0 z-40">
      <div className="p-8 flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-indigo-200 rotate-3">
          <span className="text-white font-black text-2xl tracking-tighter">KA</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-slate-800 leading-none tracking-tight">Nusantara</span>
          <span className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em] mt-1.5">Platform Pintar</span>
        </div>
      </div>
      
      <nav className="flex-1 px-6 overflow-y-auto no-scrollbar space-y-8 py-4">
        {filteredSections.map((section) => (
          <div key={section.title}>
            <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
              {section.title}
            </h3>
            <div className="space-y-1.5">
              {section.items.map((item) => (
                <button
                  key={item.name}
                  onClick={() => onTabChange(item.name)}
                  className={`w-full text-left px-5 py-3.5 rounded-2xl transition-all duration-300 flex items-center gap-4 group ${
                    activeTab === item.name 
                      ? 'bg-indigo-600 text-white font-bold shadow-2xl shadow-indigo-500/20' 
                      : 'text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm'
                  }`}
                >
                  <span className={`text-xl transition-transform group-hover:scale-125 duration-300 ${activeTab === item.name ? 'scale-110' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm tracking-wide">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-slate-100 bg-white/30 backdrop-blur-md space-y-2">
        <button
          onClick={() => onTabChange('Pengaturan')}
          className={`w-full px-5 py-4 text-left rounded-2xl transition-all flex items-center gap-4 group ${
            activeTab === 'Pengaturan' ? 'bg-slate-900 text-white font-bold shadow-xl' : 'text-slate-600 hover:bg-white hover:text-indigo-600'
          }`}
        >
          <span className="text-xl">⚙️</span>
          <span className="text-sm font-bold">Pengaturan</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full px-5 py-4 text-left text-red-500 hover:bg-red-50 rounded-2xl transition-all flex items-center gap-4 group"
        >
          <span className="text-xl group-hover:rotate-12 transition-transform">🚪</span>
          <span className="font-bold text-sm">Keluar Aplikasi</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
