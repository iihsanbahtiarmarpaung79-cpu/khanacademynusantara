
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { CURRICULUM } from '../constants';
import { generateQuizQuestions } from '../services/geminiService';

interface DashboardSiswaProps {
  user: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface ForumPost {
  id: number;
  user: string;
  topic: string;
  replies: number;
  time: string;
  content: string;
}

const DashboardSiswa: React.FC<DashboardSiswaProps> = ({ user, activeTab, onTabChange }) => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [labMode, setLabMode] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  
  const [carRotation, setCarRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const lastX = useRef<number>(0);

  const [forumPosts, setForumPosts] = useState<ForumPost[]>([
    { id: 1, user: 'Budi Santoso', topic: 'Cara cepat menghitung logaritma?', replies: 12, time: '2 jam lalu', content: 'Apakah ada rumus praktis untuk logaritma basis 10?' },
    { id: 2, user: 'Siti Aminah', topic: 'Persiapan UTBK untuk anak IPA, apa saja ya?', replies: 45, time: '5 jam lalu', content: 'Mau tanya referensi buku latihan soal fisika yang bagus.' },
    { id: 3, user: 'Andi Wijaya', topic: 'Ada yang punya rangkuman Sejarah Indonesia kelas 10?', replies: 8, time: 'Kemarin', content: 'Lagi butuh materi tentang Kerajaan Majapahit nih.' },
  ]);
  const [newPostTopic, setNewPostTopic] = useState('');
  const [showForumModal, setShowForumModal] = useState(false);

  const subjects = CURRICULUM[user.jenjang]?.[user.kelas] || [];
  const displaySubjects = Array.isArray(subjects) ? subjects : (subjects[user.jurusan || 'IPA'] || []);

  const handleLearn = (subject: string) => {
    setSelectedSubject(subject);
    setQuizMode(false);
    setLabMode(false);
    setQuizFinished(false);
    // AI tutoring dihapus sesuai permintaan
  };

  const handleQuiz = async (subject: string) => {
    setSelectedSubject(subject);
    setQuizMode(true);
    setLabMode(false);
    setQuizFinished(false);
    setLoading(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    const questions = await generateQuizQuestions("Materi Kurikulum Merdeka Terupdate", subject);
    setQuizQuestions(questions);
    setLoading(false);
  };

  const handleOpenLab = (subject: string) => {
    setSelectedSubject(subject);
    setLabMode(true);
    setQuizMode(false);
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (q.correctAnswer === userAnswers[idx]) score++;
    });
    return Math.round((score / quizQuestions.length) * 100);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTopic.trim()) return;
    const newPost: ForumPost = {
      id: Date.now(),
      user: user.fullName,
      topic: newPostTopic,
      replies: 0,
      time: 'Baru saja',
      content: 'Diskusi dimulai oleh ' + user.fullName
    };
    setForumPosts([newPost, ...forumPosts]);
    setNewPostTopic('');
    setShowForumModal(false);
  };

  const startRotation = (x: number) => {
    setIsRotating(true);
    lastX.current = x;
  };
  const updateRotation = (x: number) => {
    if (!isRotating) return;
    const delta = x - lastX.current;
    setCarRotation(prev => prev + delta);
    lastX.current = x;
  };
  const stopRotation = () => setIsRotating(false);

  if (activeTab === 'Dashboard' || activeTab === 'Materi' || activeTab === 'Kuis') {
    return (
      <div className="space-y-8 animate-fadeIn pb-12">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Selamat Belajar, {user.fullName}! 🚀</h2>
            <p className="text-indigo-100 text-lg opacity-90">Jenjang: {user.jenjang} - {user.kelas}. Fokus dan raih prestasi!</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displaySubjects.map((s: string) => (
            <div key={s} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group border-b-4 border-b-indigo-500 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-all duration-300">
                  <span className="text-2xl group-hover:scale-110 transition-transform">📖</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{s}</h3>
                <p className="text-sm text-slate-500 mb-6 line-clamp-2">Eksplorasi materi {s} yang disesuaikan dengan kurikulum Merdeka.</p>
              </div>
              
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <button onClick={() => handleLearn(s)} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md">Buka Materi</button>
                  <button onClick={() => handleQuiz(s)} className="flex-1 bg-slate-50 text-slate-600 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">Kuis</button>
                </div>
                {(s.toLowerCase().includes('fisika') || s.toLowerCase().includes('ipa') || s.toLowerCase().includes('informatika')) && (
                  <button onClick={() => handleOpenLab(s)} className="w-full bg-emerald-50 text-emerald-600 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">
                    🔬 Laboratorium Interaktif
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedSubject && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl mt-12 animate-slideUp overflow-hidden">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <h3 className="text-xl md:text-2xl font-black text-slate-800 flex items-center">
                <span className="mr-3">{quizMode ? '📝' : labMode ? '🔬' : '✨'}</span> 
                {quizMode ? `Kuis: ${selectedSubject}` : labMode ? `Lab: Rotasi Mobil` : `Modul: ${selectedSubject}`}
              </h3>
              <button onClick={() => { setSelectedSubject(null); setLabMode(false); }} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold animate-pulse text-lg text-center">Menyiapkan Materi...</p>
              </div>
            ) : labMode ? (
              <div className="max-w-4xl mx-auto space-y-8">
                <div 
                  className="bg-slate-900 rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px] md:min-h-[400px] select-none touch-none"
                  onMouseDown={(e) => startRotation(e.clientX)}
                  onMouseMove={(e) => updateRotation(e.clientX)}
                  onMouseUp={stopRotation}
                  onMouseLeave={stopRotation}
                  onTouchStart={(e) => startRotation(e.touches[0].clientX)}
                  onTouchMove={(e) => updateRotation(e.touches[0].clientX)}
                  onTouchEnd={stopRotation}
                >
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #4f46e5 0%, transparent 70%)' }}></div>
                  
                  <div 
                    className="relative w-48 md:w-64 h-32 md:h-40 transition-transform duration-100 ease-out"
                    style={{ transform: `rotateY(${carRotation}deg)` }}
                  >
                    <div className="absolute inset-0 bg-indigo-500 rounded-xl shadow-2xl border-4 border-white/20">
                      <div className="absolute top-0 left-0 w-full h-1/2 bg-indigo-300 rounded-t-xl"></div>
                      <div className="absolute bottom-4 left-4 w-8 h-8 bg-slate-800 rounded-full"></div>
                      <div className="absolute bottom-4 right-4 w-8 h-8 bg-slate-800 rounded-full"></div>
                      <div className="absolute top-2 right-4 w-4 h-4 bg-yellow-400 rounded-full blur-[2px]"></div>
                    </div>
                  </div>

                  <div className="mt-8 md:mt-12 text-center text-white relative z-10 pointer-events-none">
                    <p className="text-lg font-bold mb-2">Simulasi Rotasi Mobil 3D</p>
                    <p className="text-xs md:text-sm text-slate-400 max-w-sm">Geser/Sentuh untuk memutar objek.</p>
                  </div>
                </div>
              </div>
            ) : quizMode ? (
              <div className="max-w-3xl mx-auto">
                {!quizFinished ? (
                  <div className="space-y-8">
                    <div className="flex justify-between items-center text-sm font-bold text-slate-400 uppercase tracking-widest">
                      <span>Pertanyaan {currentQuestionIndex + 1} / {quizQuestions.length}</span>
                      <div className="h-2 w-24 md:w-32 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 transition-all" style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="p-6 md:p-8 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-lg md:text-xl font-bold text-slate-800 mb-8">{quizQuestions[currentQuestionIndex]?.text}</p>
                      <div className="grid grid-cols-1 gap-4">
                        {quizQuestions[currentQuestionIndex]?.options.map((opt: string, i: number) => (
                          <button 
                            key={i} 
                            onClick={() => handleAnswer(i)}
                            className="group flex items-center p-4 md:p-5 bg-white border-2 border-slate-100 rounded-2xl text-left hover:border-indigo-500 hover:bg-indigo-50 transition-all shadow-sm"
                          >
                            <span className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center font-bold mr-4 transition-colors">
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className="font-medium text-slate-700 text-sm md:text-base">{opt}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-6">
                    <div className="text-7xl mb-6">🏆</div>
                    <h4 className="text-3xl font-black text-slate-800">Selesai!</h4>
                    <div className="inline-block px-12 py-6 bg-indigo-600 text-white rounded-3xl shadow-2xl">
                      <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Skor Akhir</p>
                      <p className="text-6xl font-black">{calculateScore()}</p>
                    </div>
                    <div className="flex justify-center space-x-3">
                      <button onClick={() => handleQuiz(selectedSubject)} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all">Ulangi</button>
                      <button onClick={() => setSelectedSubject(null)} className="bg-slate-100 text-slate-700 px-8 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all">Tutup</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="aspect-video w-full bg-slate-900 rounded-3xl flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="relative z-10 text-center">
                    <button className="w-16 h-16 md:w-20 md:h-20 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center transition-all group-hover:scale-110">
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-white fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </button>
                    <p className="text-white mt-4 font-bold text-sm md:text-lg">Video Materi: {selectedSubject}</p>
                  </div>
                  <img src={`https://picsum.photos/seed/${selectedSubject}/1280/720`} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Thumbnail" />
                </div>
                <div className="bg-indigo-50/50 p-6 md:p-8 rounded-3xl border border-indigo-100 text-slate-700 leading-relaxed space-y-4">
                  <h4 className="text-xl font-bold text-indigo-800">Ringkasan Materi {selectedSubject}</h4>
                  <p>Materi ini telah dikurasi sesuai standar Kurikulum Merdeka. Silakan pelajari video di atas dan lanjutkan ke sesi kuis untuk menguji pemahaman Anda.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'Forum') {
    return (
      <div className="space-y-6 animate-fadeIn pb-12">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800">Forum Nusantara</h2>
            <p className="text-slate-500 text-sm md:text-base">Diskusi bersama teman Nusantara.</p>
          </div>
          <button onClick={() => setShowForumModal(true)} className="bg-indigo-600 text-white px-4 md:px-8 py-2 md:py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 text-sm md:text-base">+ Baru</button>
        </div>

        <div className="space-y-4">
          {forumPosts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">{post.user.charAt(0)}</div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{post.user}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{post.time}</p>
                </div>
              </div>
              <h4 className="text-lg md:text-xl font-bold text-slate-800 mb-3">{post.topic}</h4>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">{post.content}</p>
              <button className="text-indigo-600 font-bold text-sm hover:underline">Baca & Balas →</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'Pengaturan') {
    return <DesktopSettings user={user} onBack={() => onTabChange('Dashboard')} />;
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-6">
        <div className="text-6xl md:text-8xl animate-bounce">🛠️</div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-800">Halaman {activeTab}</h2>
        <p className="text-slate-500 text-sm md:text-base">Sedang dalam proses pengembangan.</p>
      </div>
    </div>
  );
};

// Internal Component for Unified Settings Experience
const DesktopSettings: React.FC<{ user: User; onBack: () => void }> = ({ user, onBack }) => {
  const [activeCategory, setActiveCategory] = useState('Akun');
  const categories = ['Akun', 'Tampilan', 'Keamanan', 'Notifikasi', 'Privasi'];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fadeIn min-h-[500px] md:h-[650px] mb-20">
      {/* Settings Sidebar / Top Nav */}
      <div className="w-full md:w-72 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-4 md:p-8 flex flex-col">
        <div className="flex items-center justify-between md:flex-col md:items-start mb-6 md:mb-12">
          <h3 className="text-xl md:text-2xl font-black text-slate-800">Pengaturan</h3>
          <button 
            onClick={onBack}
            className="md:mt-4 flex items-center space-x-2 text-indigo-600 font-bold text-sm hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span>Kembali</span>
          </button>
        </div>
        
        <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-3 rounded-2xl font-bold text-xs md:text-sm transition-all flex items-center justify-between group ${
                activeCategory === cat ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              <span>{cat}</span>
              <span className={`hidden md:block w-1.5 h-1.5 rounded-full bg-white transition-transform ${activeCategory === cat ? 'scale-100' : 'scale-0'}`}></span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-2xl">
          <h4 className="text-2xl md:text-3xl font-black text-slate-800 mb-8">{activeCategory}</h4>
          
          {activeCategory === 'Akun' && (
            <div className="space-y-8 animate-slideUp">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <div className="relative">
                  <img src={user.photoUrl} className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-white shadow-2xl object-cover" alt="Profile" />
                </div>
                <div className="text-center sm:text-left">
                  <h5 className="font-bold text-slate-800 text-lg mb-1">{user.fullName}</h5>
                  <p className="text-slate-500 text-xs mb-4">{user.role} • {user.schoolName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Lengkap</label>
                  <input type="text" defaultValue={user.fullName} className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-slate-100 outline-none focus:border-indigo-500 transition-all font-bold text-slate-700 shadow-sm" />
                </div>
              </div>
            </div>
          )}

          {activeCategory === 'Tampilan' && (
            <div className="space-y-10 animate-slideUp">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mode Tampilan</label>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex flex-col items-center p-6 bg-white border-4 border-indigo-600 rounded-3xl shadow-xl transition-all">
                    <span className="font-bold text-slate-800">Terang (Aktif)</span>
                  </button>
                  <button className="flex flex-col items-center p-6 bg-slate-800 border-4 border-transparent rounded-3xl opacity-60 hover:opacity-100 transition-all">
                    <span className="font-bold text-white">Gelap</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Status: Konfigurasi Cloud</p>
            <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black shadow-2xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all">Simpan Konfigurasi</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSiswa;
