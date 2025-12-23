
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { CURRICULUM, SUBJECT_META, ADMIN_INFO } from '../constants';
import { getContentForStudent, generateEducationContent } from '../services/geminiService';

interface DashboardSiswaProps {
  user: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onUpdateUser?: (user: User) => void;
}

const DashboardSiswa: React.FC<DashboardSiswaProps> = ({ user, activeTab, onTabChange, onUpdateUser }) => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [contentTab, setContentTab] = useState<'Materi' | 'Bedah' | 'Kuis'>('Materi');
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [readingContent, setReadingContent] = useState<string>("");
  const [deepDiveContent, setDeepDiveContent] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  
  const [editProfile, setEditProfile] = useState({
    fullName: user.fullName,
    schoolName: user.schoolName
  });

  const getDisplaySubjects = () => {
    const jenjang = user.jenjang || 'SMA';
    const kelas = user.kelas || 'Kelas 10';
    const jenjangData = CURRICULUM[jenjang as keyof typeof CURRICULUM];
    if (!jenjangData) return [];
    const kelasKey = Object.keys(jenjangData).find(k => k.toLowerCase() === kelas.toLowerCase());
    const subjects = kelasKey ? jenjangData[kelasKey] : null;
    if (!subjects) return [];
    return Array.isArray(subjects) ? subjects : (subjects[user.jurusan || 'IPA'] || []);
  };

  const displaySubjects = getDisplaySubjects();

  const handleSaveProfile = () => {
    if (onUpdateUser) {
      onUpdateUser({ ...user, fullName: editProfile.fullName, schoolName: editProfile.schoolName });
      if ((window as any).confetti) (window as any).confetti({ particleCount: 100, spread: 70 });
      alert("Profil diperbarui!");
    }
  };

  const loadContent = async (tab: typeof contentTab) => {
    if (!selectedSubject) return;
    setContentTab(tab);
    setLoading(true);
    try {
      let content = getContentForStudent(selectedSubject, user.jenjang, user.kelas);
      if (!content) {
        content = await generateEducationContent(`Eksplorasi mendalam ${selectedSubject}`, selectedSubject, user.jenjang, user.kelas);
      }
      if (content) {
        setQuizQuestions(content.quiz);
        setReadingContent(content.material);
        setDeepDiveContent(`## Bedah Konsep: ${selectedSubject}\nAnalisis mendalam untuk meningkatkan literasi dan nalar kritis siswa.`);
      }
      if (tab === 'Kuis') {
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setQuizFinished(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
      if ((window as any).confetti) (window as any).confetti({ particleCount: 150, spread: 70 });
    }
  };

  if (activeTab === 'Tentang Kami') return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fadeIn py-10 px-4 pb-20 overflow-x-hidden">
      <div className="text-center space-y-4">
        <div className="inline-block p-4 bg-indigo-600 rounded-3xl shadow-2xl rotate-3 mb-2">
          <span className="text-white font-black text-4xl">KA</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-slate-800 tracking-tighter leading-tight">Khan Academy <br/><span className="text-indigo-600">Nusantara</span></h1>
        <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto font-medium">Platform pintar masa depan Indonesia.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 border border-slate-100 shadow-2xl flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=idirtanjung6@gmail.com`} className="w-40 h-40 md:w-64 md:h-64 rounded-[2.5rem] md:rounded-[3.5rem] object-cover border-4 md:border-8 border-slate-50 shadow-xl relative z-10" alt="Founder" />
        <div className="space-y-4 md:space-y-6 flex-1 relative z-10 text-center md:text-left">
           <div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Founder & CEO</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">{ADMIN_INFO.name}</h2>
           </div>
           <p className="text-slate-500 text-sm md:text-lg leading-relaxed font-medium">"Wujudkan akses pendidikan kelas dunia bagi setiap anak Indonesia."</p>
           <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <a href={`https://wa.me/${ADMIN_INFO.whatsapp}`} target="_blank" className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-all text-sm">📱 WhatsApp Admin</a>
              <div className="bg-indigo-50 px-4 py-3 rounded-2xl flex flex-col text-center">
                 <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Founder ID</span>
                 <span className="text-sm md:text-base font-black text-indigo-600 tracking-widest">NS-FOUNDER</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  if (activeTab === 'Hubungi Admin') return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 animate-fadeIn pb-24">
      <div className="bg-slate-900 text-white p-10 md:p-16 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <span className="bg-indigo-600 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">Kontak Resmi</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Hubungi <br/> {ADMIN_INFO.name}</h2>
          <p className="text-slate-400 text-sm md:text-lg leading-relaxed max-w-md">Laporan bug, saran kurikulum, atau kerja sama? Hubungi saya langsung.</p>
          <a href={`https://wa.me/${ADMIN_INFO.whatsapp}`} target="_blank" className="bg-emerald-500 text-white px-8 py-5 rounded-2xl font-black shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 w-fit">
            <span>📱</span> WA: {ADMIN_INFO.whatsapp}
          </a>
        </div>
      </div>
    </div>
  );

  if (activeTab === 'Profil') return (
    <div className="max-w-4xl mx-auto py-6 md:py-10 px-4 space-y-8 animate-fadeIn pb-24">
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
        <img src={user.photoUrl} className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover border-4 border-indigo-50 shadow-md" />
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight">{user.fullName}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase">{user.role}</span>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{user.jenjang} • {user.kelas}</span>
          </div>
          <div className="bg-slate-50 px-4 py-2 rounded-xl inline-block border border-slate-100">
             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">ID Nusantara</p>
             <p className="text-lg font-black text-indigo-600 tracking-widest">{user.id}</p>
          </div>
          <p className="text-slate-500 font-bold text-sm">{user.schoolName}</p>
        </div>
      </div>
    </div>
  );

  if (activeTab === 'Materi' || activeTab === 'Kuis' || activeTab === 'Progres') {
    if (activeTab === 'Progres') {
       return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn py-6 px-4 pb-24">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Progres Belajar</h2>
          <div className="grid gap-4">
            {displaySubjects.map((s: string, idx: number) => {
              const meta = SUBJECT_META[s] || SUBJECT_META.Default;
              const randProgress = 35 + (idx * 17) % 60;
              return (
                <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className={`w-12 h-12 ${meta.color} bg-opacity-10 rounded-xl flex items-center justify-center text-xl`}>{meta.icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1.5"><span className="font-black text-slate-800 text-sm">{s}</span><span className="text-[10px] font-black text-indigo-600">{randProgress}%</span></div>
                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden"><div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${randProgress}%` }}></div></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
       );
    }

    const progressPercent = quizQuestions.length > 0 ? ((currentQuestionIndex + 1) / quizQuestions.length) * 100 : 0;
    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-24 px-4 animate-fadeIn overflow-x-hidden">
        {!selectedSubject ? (
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-6 tracking-tight">Eksplorasi Kurikulum</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
              {displaySubjects.map((s: string, idx: number) => {
                const meta = SUBJECT_META[s] || SUBJECT_META.Default;
                return (
                  <button key={idx} onClick={() => { setSelectedSubject(s); loadContent(activeTab === 'Kuis' ? 'Kuis' : 'Materi'); }} 
                    className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 hover:border-indigo-400 shadow-sm hover:shadow-xl transition-all text-left group">
                    <div className={`w-14 h-14 ${meta.color} bg-opacity-10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}><span className="text-3xl">{meta.icon}</span></div>
                    <h3 className="text-xl font-black text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{s}</h3>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">30 Soal HOTS AI • Literasi Dasar</p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            <button onClick={() => setSelectedSubject(null)} className="bg-white px-5 py-2 rounded-xl font-black text-indigo-600 shadow-sm border border-slate-100 text-sm">← Kembali</button>
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 border border-slate-100 shadow-2xl min-h-[50vh] flex flex-col relative">
              <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
                {(['Materi', 'Bedah', 'Kuis'] as const).map(tab => (
                  <button key={tab} onClick={() => loadContent(tab)} 
                    className={`px-6 py-2.5 rounded-xl font-black transition-all text-sm shrink-0 ${contentTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                    {tab}
                  </button>
                ))}
              </div>
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-20">
                    <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="font-black text-indigo-600 text-sm tracking-widest animate-pulse">MENYUSUN MODUL PINTAR...</p>
                </div>
              ) : (
                <div className="flex-1">
                  {(contentTab === 'Materi' || contentTab === 'Bedah') && (
                    <div className="animate-fadeIn max-w-none prose prose-indigo prose-sm sm:prose-base md:prose-lg text-slate-700 leading-relaxed font-medium">
                        <pre className="whitespace-pre-wrap font-sans bg-transparent p-0 m-0 border-none shadow-none text-slate-700 leading-loose">
                            {contentTab === 'Materi' ? readingContent : deepDiveContent}
                        </pre>
                    </div>
                  )}
                  {contentTab === 'Kuis' && (
                    <div className="max-w-4xl mx-auto py-4">
                      {!quizFinished && quizQuestions.length > 0 ? (
                        <div className="space-y-8">
                          <div className="space-y-2">
                             <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest"><span>SOAL {currentQuestionIndex + 1} / {quizQuestions.length}</span><span>{Math.round(progressPercent)}%</span></div>
                             <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div></div>
                          </div>
                          <h3 className="text-xl md:text-3xl font-black text-slate-800 leading-tight md:leading-snug">{quizQuestions[currentQuestionIndex]?.text}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            {quizQuestions[currentQuestionIndex]?.options.map((opt: string, idx: number) => (
                              <button key={idx} onClick={() => handleAnswer(idx)} 
                                className="group w-full text-left p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-400 hover:bg-white hover:shadow-lg transition-all flex items-center gap-4">
                                <span className="w-9 h-9 shrink-0 rounded-lg bg-white border border-slate-100 flex items-center justify-center font-black text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all text-sm">{String.fromCharCode(65+idx)}</span>
                                <span className="font-bold text-slate-700 text-sm md:text-base">{opt}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : quizFinished ? (
                        <div className="text-center space-y-6 py-10 animate-scaleIn">
                          <div className="text-7xl">🏆</div>
                          <h3 className="text-3xl font-black text-slate-800">Selesai!</h3>
                          <div className="bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100 inline-block shadow-inner">
                             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Skor Akhir</p>
                             <p className="text-6xl font-black text-indigo-600">{Math.round((userAnswers.filter((ans, idx) => ans === quizQuestions[idx]?.correctAnswer).length / quizQuestions.length) * 100)}</p>
                          </div>
                          <div className="pt-4"><button onClick={() => { setQuizFinished(false); setCurrentQuestionIndex(0); setUserAnswers([]); }} className="text-indigo-600 font-black text-sm uppercase tracking-widest hover:underline">Ulangi Kuis</button></div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default DashboardSiswa;
