
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { CURRICULUM, SUBJECT_META } from '../constants';
import { generateQuizQuestions, generateReadingMaterial, generateConceptDeepDive, getAIDiscussionInsight } from '../services/geminiService';

interface DashboardSiswaProps {
  user: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface Reply {
  id: number;
  user: string;
  text: string;
  time: string;
  isAI?: boolean;
}

interface ForumPost {
  id: number;
  user: string;
  topic: string;
  content: string;
  time: string;
  replies: Reply[];
}

const initialForumPosts: ForumPost[] = [
  {
    id: 1,
    user: "Fadel Aqram",
    topic: "Tips Belajar Kurikulum Merdeka",
    time: "2 jam yang lalu",
    content: "Halo teman-teman! Bagaimana cara kalian membagi waktu belajar di sekolah dan di rumah dengan sistem Kurikulum Merdeka ini?",
    replies: [
      { id: 101, user: "Siti Nur", text: "Aku fokus pada proyek di sekolah, lalu mengulang materi inti di KA Nusantara.", time: "1 jam yang lalu" }
    ]
  },
  {
    id: 2,
    user: "Siti Nurhaliza",
    topic: "Diskusi Soal Matematika",
    time: "4 jam yang lalu",
    content: "Ada yang bisa bantu menjelaskan langkah-langkah penyelesaian soal limit trigonometri yang di share di kuis tadi?",
    replies: []
  }
];

const DashboardSiswa: React.FC<DashboardSiswaProps> = ({ user, activeTab, onTabChange }) => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [contentTab, setContentTab] = useState<'Video' | 'Bacaan' | 'Bedah' | 'Kuis'>('Video');
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [readingContent, setReadingContent] = useState<string>("");
  const [deepDiveContent, setDeepDiveContent] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  
  // Forum States
  const [posts, setPosts] = useState<ForumPost[]>(initialForumPosts);
  const [activePost, setActivePost] = useState<ForumPost | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: '', content: '' });
  const [replyText, setReplyText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const subjectsData = CURRICULUM[user.jenjang]?.[user.kelas] || [];
  const displaySubjects = Array.isArray(subjectsData) ? subjectsData : (subjectsData[user.jurusan || 'IPA'] || []);

  const getSubjectMeta = (name: string) => {
    const key = Object.keys(SUBJECT_META).find(k => name.includes(k));
    return SUBJECT_META[key || 'Default'];
  };

  const handleOpenSubject = (subject: string) => {
    setSelectedSubject(subject);
    setContentTab('Video');
    setQuizFinished(false);
  };

  const loadContent = async (tab: typeof contentTab) => {
    if (!selectedSubject) return;
    setContentTab(tab);
    setLoading(true);

    // Simulasi loading sebentar agar transisi tetap halus
    setTimeout(async () => {
      try {
        if (tab === 'Kuis') {
          const questions = await generateQuizQuestions(`Topik Utama ${selectedSubject}`, selectedSubject);
          setQuizQuestions(questions || []);
          setCurrentQuestionIndex(0);
          setUserAnswers([]);
          setQuizFinished(false);
        } else if (tab === 'Bacaan') {
          const content = await generateReadingMaterial(selectedSubject, selectedSubject, user.jenjang);
          setReadingContent(content || "Materi bacaan tidak tersedia.");
        } else if (tab === 'Bedah') {
          const content = await generateConceptDeepDive(selectedSubject, selectedSubject, user.jenjang);
          setDeepDiveContent(content || "Gagal membedah materi.");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setQuizFinished(true);
      }
    }, 300);
  };

  const calculateScore = () => {
    if (!quizQuestions || quizQuestions.length === 0) return 0;
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (q.correctAnswer === userAnswers[idx]) score++;
    });
    return Math.round((score / quizQuestions.length) * 100);
  };

  // Forum Handlers
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.title || !newTopic.content) return;
    
    const newPost: ForumPost = {
      id: Date.now(),
      user: user.fullName,
      topic: newTopic.title,
      content: newTopic.content,
      time: "Baru saja",
      replies: []
    };
    
    setPosts([newPost, ...posts]);
    setNewTopic({ title: '', content: '' });
    setShowCreateModal(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !activePost) return;

    const newReply: Reply = {
      id: Date.now(),
      user: user.fullName,
      text: replyText,
      time: "Baru saja"
    };

    const updatedPosts = posts.map(p => {
      if (p.id === activePost.id) {
        const updated = { ...p, replies: [...p.replies, newReply] };
        setActivePost(updated);
        return updated;
      }
      return p;
    });
    setPosts(updatedPosts);
    setReplyText('');
  };

  const handleAskAI = async () => {
    if (!activePost) return;
    setAiLoading(true);
    // Masih menggunakan fungsi insight namun sekarang statis
    const insight = await getAIDiscussionInsight(activePost.topic, activePost.content);
    
    const aiReply: Reply = {
      id: Date.now(),
      user: "Moderator Nusantara",
      text: insight || "Maaf, sedang terjadi gangguan sistem.",
      time: "Baru saja",
      isAI: true
    };

    const updatedPosts = posts.map(p => {
      if (p.id === activePost.id) {
        const updated = { ...p, replies: [...p.replies, aiReply] };
        setActivePost(updated);
        return updated;
      }
      return p;
    });
    setPosts(updatedPosts);
    setAiLoading(false);
  };

  if (activeTab === 'Dashboard' || activeTab === 'Materi' || activeTab === 'Kuis') {
    return (
      <div className="space-y-10 animate-fadeIn pb-16">
        {/* Welcome Section */}
        {!selectedSubject && (
          <>
            <div className="bg-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-sm border border-slate-100 group animate-scaleIn">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-cyan-500/5 opacity-100 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-800 mb-2 leading-tight">Halo, {user.fullName}! 👋</h2>
                  <p className="text-slate-500 font-medium">Selamat datang di akun utama Anda. Hari ini kita belajar apa?</p>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-200 -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                    <span className="text-4xl text-white">🎓</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {displaySubjects.map((s: string, index: number) => {
                const meta = getSubjectMeta(s);
                const staggerClass = index < 6 ? `stagger-${index + 1}` : '';
                return (
                  <div key={s} className={`bg-white p-7 rounded-[2rem] border border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group flex flex-col justify-between overflow-hidden relative opacity-0 animate-slideUp ${staggerClass}`}>
                    <div className={`absolute top-0 right-0 w-24 h-24 ${meta.color} opacity-[0.03] rounded-bl-full group-hover:scale-150 transition-transform duration-500`}></div>
                    <div>
                      <div className={`w-14 h-14 ${meta.color} bg-opacity-10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-3xl">{meta.icon}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">{s}</h3>
                      <p className="text-sm text-slate-500 mb-8 line-clamp-2">Kurikulum Merdeka • Pelajari konsep-konsep kunci {s}.</p>
                    </div>
                    <button 
                      onClick={() => handleOpenSubject(s)} 
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl text-sm font-bold hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                    >
                      Buka Materi & Kuis
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Detailed Viewer (Subject Navigation) */}
        {selectedSubject && (
          <div className="bg-white rounded-[3rem] p-6 md:p-10 border border-slate-100 shadow-2xl animate-scaleIn relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedSubject(null)} className="p-3 hover:bg-slate-100 rounded-full transition-all text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{selectedSubject}</h3>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{user.jenjang} • {user.kelas}</p>
                </div>
              </div>

              {/* Material Sub-Tabs */}
              <div className="flex p-1.5 bg-slate-100 rounded-2xl overflow-x-auto no-scrollbar">
                {(['Video', 'Bacaan', 'Bedah', 'Kuis'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => loadContent(tab)}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                      contentTab === tab 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab === 'Bedah' ? 'Bedah Materi' : tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-[400px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-6">
                  <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-500 font-bold animate-pulse">Menyiapkan konten Nusantara...</p>
                </div>
              ) : contentTab === 'Video' ? (
                <div className="space-y-8 animate-fadeIn">
                  <div className="aspect-video w-full bg-[#0F172A] rounded-[2.5rem] flex items-center justify-center relative overflow-hidden group shadow-2xl">
                    <button className="w-20 h-20 bg-white/10 hover:bg-white text-white hover:text-indigo-600 backdrop-blur-xl rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-2xl z-10">
                      <svg className="w-10 h-10 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </button>
                    <img src={`https://picsum.photos/seed/${selectedSubject}-video/1280/720`} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" alt="Video Placeholder" />
                  </div>
                  <div className="p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100">
                    <h4 className="text-xl font-bold text-indigo-900 mb-2">Tentang Materi Ini</h4>
                    <p className="text-indigo-700 leading-relaxed">Video ini membahas dasar-dasar {selectedSubject} sesuai standar Kurikulum Merdeka. Tonton sampai selesai sebelum melanjutkan ke materi bacaan atau kuis.</p>
                  </div>
                </div>
              ) : contentTab === 'Bacaan' ? (
                <div className="max-w-4xl mx-auto animate-fadeIn prose prose-slate max-w-none">
                  <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-sm leading-relaxed whitespace-pre-wrap text-slate-700 text-lg">
                    {readingContent || "Pilih tab lain untuk memuat konten."}
                  </div>
                </div>
              ) : contentTab === 'Bedah' ? (
                <div className="max-w-4xl mx-auto animate-fadeIn">
                  <div className="bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <span className="text-8xl text-white">🔬</span>
                    </div>
                    <div className="relative z-10 text-white prose prose-invert max-w-none leading-loose whitespace-pre-wrap font-medium">
                      <h4 className="text-indigo-400 font-black uppercase tracking-widest text-xs mb-6">Analisis Konsep Nusantara</h4>
                      {deepDiveContent || "Sedang membedah konsep..."}
                    </div>
                  </div>
                </div>
              ) : contentTab === 'Kuis' ? (
                <div className="max-w-3xl mx-auto">
                  {quizQuestions && quizQuestions.length > 0 && !quizFinished ? (
                    <div className="space-y-10 animate-slideInRight">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Kemajuan Kuis</p>
                          <p className="text-3xl font-black text-slate-800">{currentQuestionIndex + 1} <span className="text-slate-300 font-medium">/ {quizQuestions.length}</span></p>
                        </div>
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                          <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}></div>
                        </div>
                      </div>
                      <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                        <p className="text-xl md:text-2xl font-bold text-slate-800 mb-10 leading-snug">{quizQuestions[currentQuestionIndex]?.text}</p>
                        <div className="grid grid-cols-1 gap-4">
                          {quizQuestions[currentQuestionIndex]?.options.map((opt: string, i: number) => (
                            <button 
                              key={i} 
                              onClick={() => handleAnswer(i)}
                              className="group flex items-center p-6 bg-white border-2 border-slate-100 rounded-[1.5rem] text-left transition-all duration-200 hover:border-indigo-300 hover:shadow-md active:scale-95"
                            >
                              <span className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center font-black mr-5 transition-all">
                                {String.fromCharCode(65 + i)}
                              </span>
                              <span className="font-bold text-slate-600">{opt}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : quizFinished ? (
                    <div className="text-center py-16 space-y-8 animate-fadeIn">
                      <div className="text-8xl mb-4 animate-bounce">🎊</div>
                      <h4 className="text-4xl font-black text-slate-800 mb-2">Kuis Selesai!</h4>
                      <div className="inline-block px-14 py-8 bg-indigo-600 text-white rounded-[2.5rem] shadow-2xl shadow-indigo-200">
                        <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-2">Nilai Anda</p>
                        <p className="text-7xl font-black">{calculateScore()}</p>
                      </div>
                      <div className="flex justify-center gap-4 pt-6">
                        <button onClick={() => loadContent('Kuis')} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">Ulangi Kuis</button>
                        <button onClick={() => setSelectedSubject(null)} className="px-10 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Selesai</button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <p className="text-slate-400 font-bold italic">Gagal memuat kuis. Silakan coba lagi nanti.</p>
                      <button onClick={() => loadContent('Kuis')} className="mt-4 text-indigo-600 font-bold hover:underline">Muat Ulang</button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Progres Tab - Tetap sama namun dengan data statis
  if (activeTab === 'Progres') {
    return (
      <div className="space-y-10 animate-fadeIn pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Progres Belajar Nusantara 📈</h2>
            <p className="text-slate-500 font-medium">Pantau kemajuan akademik dan raih prestasi maksimal.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Rata-rata Kuis', val: '88', icon: '🎯', color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Materi Selesai', val: '12/45', icon: '📖', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Jam Belajar', val: '14.5', icon: '⏱️', color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Lencana', val: '5', icon: '🏆', color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm animate-slideUp" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-2xl mb-4`}>
                {stat.icon}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.val}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detailed Subject Progress */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-800 mb-8">Kemajuan Mata Pelajaran</h3>
              <div className="space-y-8">
                {displaySubjects.slice(0, 5).map((subject: string, idx: number) => {
                  const meta = getSubjectMeta(subject);
                  const randomProgress = [75, 40, 90, 20, 55][idx];
                  return (
                    <div key={subject} className="group">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{meta.icon}</span>
                          <span className="font-bold text-slate-700">{subject}</span>
                        </div>
                        <span className="text-xs font-black text-slate-400">{randomProgress}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${meta.color} transition-all duration-1000 ease-out`} 
                          style={{ width: `${randomProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="w-full mt-10 py-4 text-sm font-bold text-indigo-600 border-2 border-indigo-50 rounded-2xl hover:bg-indigo-50 transition-all">
                Lihat Semua Mata Pelajaran
              </button>
            </div>
          </div>

          {/* Badges Section */}
          <div className="space-y-8">
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-20 transform rotate-12">
                <span className="text-8xl">🥇</span>
              </div>
              <h3 className="text-xl font-black mb-8 relative z-10">Lencana Anda</h3>
              <div className="grid grid-cols-2 gap-4 relative z-10">
                {[
                  { icon: '🔥', label: '7 Hari Beruntun' },
                  { icon: '🧠', label: 'Master Logika' },
                  { icon: '🛡️', label: 'Penjelajah MAN' },
                  { icon: '⭐', label: 'Top Skorer' },
                ].map((badge, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col items-center text-center">
                    <span className="text-3xl mb-2">{badge.icon}</span>
                    <span className="text-[10px] font-bold opacity-70">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Forum Tab
  if (activeTab === 'Forum') {
    return (
      <div className="space-y-8 animate-fadeIn pb-16">
        {!activePost ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-800">Forum Nusantara 💬</h2>
                <p className="text-slate-500 font-medium">Diskusikan materi pelajaran dengan rekan se-Nusantara.</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                Buat Topik Baru
              </button>
            </div>
            
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white p-7 rounded-[2rem] border border-slate-100 hover:border-indigo-200 transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 group animate-slideUp">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg">{post.user.charAt(0)}</div>
                      <div>
                        <p className="font-black text-slate-800">{post.user}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{post.time}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold text-slate-500">{post.replies.length} Balasan</div>
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">{post.topic}</h4>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">{post.content}</p>
                  <button 
                    onClick={() => setActivePost(post)}
                    className="text-indigo-600 font-bold text-sm flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-wider"
                  >
                    Lanjutkan Diskusi <span>→</span>
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-4xl mx-auto animate-scaleIn">
            <button 
              onClick={() => setActivePost(null)}
              className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-8 hover:text-indigo-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              Kembali ke Forum
            </button>
            
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden mb-8">
              <div className="p-10 md:p-14">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100">{activePost.user.charAt(0)}</div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800">{activePost.topic}</h3>
                    <p className="text-sm text-slate-400 font-bold">{activePost.user} • {activePost.time}</p>
                  </div>
                </div>
                <div className="text-slate-600 leading-loose text-lg whitespace-pre-wrap border-l-4 border-indigo-100 pl-8 mb-10">
                  {activePost.content}
                </div>
                
                <button 
                  onClick={handleAskAI}
                  disabled={aiLoading}
                  className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-600 transition-all disabled:opacity-50"
                >
                  {aiLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>✨</span>
                  )}
                  Tanya Moderator
                </button>
              </div>

              {/* Replies Section */}
              <div className="bg-slate-50/50 p-10 md:p-14 space-y-6 border-t border-slate-100">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Balasan ({activePost.replies.length})</h4>
                {activePost.replies.map((reply) => (
                  <div key={reply.id} className={`p-6 rounded-[2rem] shadow-sm max-w-[85%] ${reply.isAI ? 'bg-indigo-600 text-white ml-auto border-none' : 'bg-white border border-slate-100'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className={`font-black text-xs uppercase tracking-wider ${reply.isAI ? 'text-indigo-200' : 'text-indigo-600'}`}>{reply.user}</p>
                      <p className={`text-[10px] font-bold ${reply.isAI ? 'text-indigo-300' : 'text-slate-300'}`}>{reply.time}</p>
                    </div>
                    <p className={`text-sm leading-relaxed ${reply.isAI ? 'font-medium' : 'text-slate-600'}`}>{reply.text}</p>
                  </div>
                ))}

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="mt-12 flex gap-4">
                  <input 
                    type="text" 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Tulis balasan Anda..." 
                    className="flex-1 bg-white px-6 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
                  />
                  <button type="submit" className="bg-indigo-600 text-white p-4 rounded-2xl shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all">
                    <svg className="w-6 h-6 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Settings tab
  if (activeTab === 'Pengaturan') {
    return (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden animate-scaleIn min-h-[600px] flex flex-col md:flex-row">
            <div className="w-full md:w-80 bg-slate-50/50 border-r border-slate-100 p-10">
                <h3 className="text-2xl font-black text-slate-800 mb-10">Pengaturan</h3>
                <nav className="space-y-3">
                    {['Akun', 'Tampilan', 'Notifikasi', 'Privasi'].map(cat => (
                        <button key={cat} className={`w-full text-left px-6 py-4 rounded-2xl font-bold text-sm transition-all ${cat === 'Akun' ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-500/5 border border-indigo-100' : 'text-slate-500 hover:bg-slate-100'}`}>
                            {cat}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="flex-1 p-10 md:p-16">
                <div className="max-w-xl">
                    <h4 className="text-2xl font-black text-slate-800 mb-10">Informasi Akun</h4>
                    <div className="space-y-8">
                        <div className="flex flex-col sm:flex-row items-center gap-8 p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                             <img src={user.photoUrl} className="w-28 h-28 rounded-[2rem] border-4 border-white shadow-xl object-cover" alt="Profile" />
                             <div className="text-center sm:text-left">
                                <p className="text-xl font-black text-slate-800">{user.fullName}</p>
                                <p className="text-sm text-slate-500 font-medium mb-4">{user.schoolName}</p>
                                <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl text-xs font-bold border border-indigo-100 shadow-sm hover:bg-indigo-600 hover:text-white transition-all">Ubah Foto</button>
                             </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Tampilan</label>
                                <input type="text" defaultValue={user.fullName} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-bold text-slate-700" />
                            </div>
                        </div>
                        <button className="w-full md:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all">Simpan Perubahan</button>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-[60vh] animate-fadeIn">
      <div className="text-center space-y-6">
        <div className="text-8xl animate-bounce">🚧</div>
        <h2 className="text-3xl font-black text-slate-800">Modul {activeTab}</h2>
        <p className="text-slate-500 font-medium max-w-xs mx-auto">Halaman ini sedang dalam proses integrasi data Nusantara.</p>
        <button onClick={() => onTabChange('Dashboard')} className="text-indigo-600 font-bold hover:underline">Kembali ke Dashboard</button>
      </div>
    </div>
  );
};

export default DashboardSiswa;
