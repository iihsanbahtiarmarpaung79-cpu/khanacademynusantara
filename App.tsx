
import React, { useState, useEffect } from 'react';
import { User, Role } from './types';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardSiswa from './pages/DashboardSiswa';
import DashboardGuru from './pages/DashboardGuru';
import DashboardAdmin from './pages/DashboardAdmin';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  useEffect(() => {
    const savedUser = localStorage.getItem('ka_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('ka_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ka_user');
    setActiveTab('Dashboard');
  };

  if (!currentUser) {
    if (isRegistering) {
      return <Register onRegister={handleLogin} onSwitchToLogin={() => setIsRegistering(false)} />;
    }
    return <Login onLogin={handleLogin} onSwitchToRegister={() => setIsRegistering(true)} />;
  }

  const renderContent = () => {
    // Definisi grup tab
    const studentFeatures = ['Materi', 'Kuis', 'Progres', 'Profil', 'Forum', 'Pengaturan'];
    const teacherFeatures = ['Kelola Materi', 'Kelola Kuis', 'Siswa Online', 'Laporan'];
    const adminFeatures = ['Kelola User', 'Kelola Pelajaran', 'Monitoring', 'Sistem'];

    const commonProps = {
      user: currentUser,
      activeTab: activeTab,
      onTabChange: setActiveTab
    };

    // Dashboard utama tetap spesifik per role
    if (activeTab === 'Dashboard') {
      if (currentUser.role === 'Admin') return <DashboardAdmin {...commonProps} />;
      if (currentUser.role === 'Guru') return <DashboardGuru {...commonProps} />;
      return <DashboardSiswa {...commonProps} />;
    }

    // Jika Admin, dia bisa akses semua grup fitur
    if (currentUser.role === 'Admin') {
      if (studentFeatures.includes(activeTab)) return <DashboardSiswa {...commonProps} />;
      if (teacherFeatures.includes(activeTab)) return <DashboardGuru {...commonProps} />;
      if (adminFeatures.includes(activeTab)) return <DashboardAdmin {...commonProps} />;
    }

    // Perutean normal untuk Guru & Siswa
    if (studentFeatures.includes(activeTab)) {
      return <DashboardSiswa {...commonProps} />;
    }
    
    if (teacherFeatures.includes(activeTab)) {
      return <DashboardGuru {...commonProps} />;
    }

    if (adminFeatures.includes(activeTab)) {
      return <DashboardAdmin {...commonProps} />;
    }

    return <DashboardSiswa {...commonProps} />;
  };

  const mobileNavItems = [
    { name: 'Dashboard', icon: '🏠' },
    { name: 'Materi', icon: '📚' },
    { name: 'Kuis', icon: '📝' },
    { name: 'Forum', icon: '💬' },
    { name: 'Pengaturan', icon: '⚙️' }
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        role={currentUser.role} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        <Header user={currentUser} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderContent()}
        </main>

        {/* Bottom Navigation for Mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 px-2 z-50">
          {mobileNavItems.map(item => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                activeTab === item.name ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              <span className="text-xl mb-0.5">{item.icon}</span>
              <span className={`text-[10px] font-bold uppercase tracking-tight ${
                activeTab === item.name ? 'opacity-100' : 'opacity-60'
              }`}>{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
