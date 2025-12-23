
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
  const [activeTab, setActiveTab] = useState('Tentang Kami');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('ka_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    // Simulasi inisialisasi modul sistem
    const timer = setTimeout(() => setIsInitializing(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('ka_user', JSON.stringify(user));
    setActiveTab('Tentang Kami');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ka_user');
    setActiveTab('Tentang Kami');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('ka_user', JSON.stringify(updatedUser));
    const allUsers = JSON.parse(localStorage.getItem('ka_all_users') || '[]');
    const updatedAllUsers = allUsers.map((u: User) => u.id === updatedUser.id ? updatedUser : u);
    localStorage.setItem('ka_all_users', JSON.stringify(updatedAllUsers));
  };

  if (isInitializing) {
    return null; // Biarkan Splash Screen di index.html yang bekerja
  }

  if (!currentUser) {
    if (isRegistering) {
      return <Register onRegister={handleLogin} onSwitchToLogin={() => setIsRegistering(false)} />;
    }
    return <Login onLogin={handleLogin} onSwitchToRegister={() => setIsRegistering(true)} />;
  }

  const renderContent = () => {
    const commonProps = {
      user: currentUser,
      activeTab: activeTab,
      onTabChange: setActiveTab,
      onUpdateUser: handleUpdateUser
    };

    if (currentUser.role === 'Admin') {
      const adminTabs = ['Kelola User', 'Monitoring', 'Dashboard', 'Tentang Kami', 'Profil', 'Pengaturan'];
      if (adminTabs.includes(activeTab)) return <DashboardAdmin {...commonProps} />;
      if (['Materi', 'Kuis', 'Progres', 'Forum'].includes(activeTab)) return <DashboardSiswa {...commonProps} />;
      if (['Kelola Materi', 'Kelola Kuis', 'Siswa Online'].includes(activeTab)) return <DashboardGuru {...commonProps} />;
      return <DashboardAdmin {...commonProps} />;
    }

    if (currentUser.role === 'Guru') {
      return <DashboardGuru {...commonProps} />;
    }

    return <DashboardSiswa {...commonProps} />;
  };

  const mobileNavItems = currentUser.role === 'Siswa' ? [
    { name: 'Tentang Kami', icon: '🏠' },
    { name: 'Materi', icon: '📚' },
    { name: 'Kuis', icon: '📝' },
    { name: 'Progres', icon: '📈' },
    { name: 'Hubungi Admin', icon: '📱' }
  ] : currentUser.role === 'Guru' ? [
    { name: 'Tentang Kami', icon: '🏠' },
    { name: 'Kelola Materi', icon: '🛠️' },
    { name: 'Siswa Online', icon: '👥' },
    { name: 'Profil', icon: '👤' },
    { name: 'Hubungi Admin', icon: '📱' }
  ] : [
    { name: 'Tentang Kami', icon: '🏠' },
    { name: 'Kelola User', icon: '👥' },
    { name: 'Monitoring', icon: '🖥️' },
    { name: 'Profil', icon: '👤' },
    { name: 'Hubungi Admin', icon: '📱' }
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans animate-fadeIn">
      <Sidebar 
        role={currentUser.role} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        <Header user={currentUser} onTabChange={setActiveTab} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 no-scrollbar scroll-smooth">
          <div className="animate-scaleIn">
            {renderContent()}
          </div>
        </main>

        <div className="md:hidden fixed bottom-0 left-0 right-0 glass-effect border-t border-slate-200/50 flex justify-around items-center h-16 px-2 z-50 mobile-nav-hide-landscape shadow-2xl">
          {mobileNavItems.map(item => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all group ${
                activeTab === item.name ? 'text-indigo-600 scale-105' : 'text-slate-400'
              }`}
            >
              <span className={`text-xl mb-0.5 transition-transform group-active:scale-125 ${activeTab === item.name ? 'scale-110' : ''}`}>{item.icon}</span>
              <span className={`text-[8px] font-black uppercase tracking-tight transition-all truncate max-w-full ${
                activeTab === item.name ? 'opacity-100' : 'opacity-60'
              }`}>{item.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
