
import React, { useState, useEffect } from 'react';
import { User, Jenjang } from '../types';
import { generateEducationContent, GeneratedContent, saveContentToLibrary } from '../services/geminiService';
import { SUBJECT_META } from '../constants';
import DashboardSiswa from './DashboardSiswa';

interface ClassData {
  id: string;
  name: string;
  level: string;
  students: { id: string, name: string, isOnline: boolean }[];
}

const DashboardGuru: React.FC<{ user: User; activeTab: string; onTabChange: (tab: string) => void; onUpdateUser?: (u: User) => void }> = ({ user, activeTab, onTabChange, onUpdateUser }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [inviteID, setInviteID] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [genTopic, setGenTopic] = useState('');
  const [genSubject, setGenSubject] = useState('Matematika');
  const [generatedResult, setGeneratedResult] = useState<GeneratedContent | null>(null);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'success'>('idle');

  const [newClassName, setNewClassName] = useState('');
  const [newClassLevel, setNewClassLevel] = useState<Jenjang>('SMA');

  const [classes, setClasses] = useState<ClassData[]>(() => {
    const saved = localStorage.getItem(`ka_classes_${user.id}`);
    return saved ? JSON.parse(saved) : [
      { id: 'C1', name: 'Kelas Contoh X-A', level: 'SMA Kelas 10', students: [] }
    ];
  });

  useEffect(() => { 
    localStorage.setItem(`ka_classes_${user.id}`, JSON.stringify(classes)); 
  }, [classes, user.id]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genTopic) return;
    setIsGenerating(true);
    setGeneratedResult(null);
    try {
      const result = await generateEducationContent(genTopic, genSubject, user.jenjang, user.kelas);
      setGeneratedResult(result);
    } catch (err: any) { 
      alert(err.message || "AI sedang sibuk. Coba lagi dalam 30 detik."); 
    }
    finally { setIsGenerating(false); }
  };

  const handlePublish = () => {
    if (generatedResult) {
      saveContentToLibrary(generatedResult);
      setPublishStatus('success');
      if ((window as any).confetti) {
        (window as any).confetti({ 
          particleCount: 150, 
          spread: 80,
          origin: { y: 0.6 }
        });
      }
      setTimeout(() => { 
        setShowGenerator(false); 
        setGeneratedResult(null); 
        setPublishStatus('idle'); 
      }, 2500);
    }
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError('');
    const allUsers = JSON.parse(localStorage.getItem('ka_all_users') || '[]');
    const target = allUsers.find((u: any) => u.id === inviteID.toUpperCase());
    if (!target) { setInviteError('ID Siswa tidak ditemukan.'); return; }
    if (target.role !== 'Siswa') { setInviteError('ID ini bukan milik akun Siswa.'); return; }

    const currentClass = classes.find(c => c.id === selectedClass);
    if (currentClass?.students.find(s => s.id === target.id)) {
        setInviteError('Siswa sudah terdaftar di kelas ini.');
        return;
    }

    setClasses(classes.map(c => c.id === selectedClass ? { ...c, students: [...c.students, { id: target.id, name: target.fullName, isOnline: target.isOnline }] } : c));
    setShowInviteModal(false);
    setInviteID('');
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName) return;

    const newClass: ClassData = {
      id: `C-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      name: newClassName,
      level: `${newClassLevel} Kelas ${newClassLevel === 'SD' ? '1' : newClassLevel === 'SMP' ? '7' : '10'}`,
      students: []
    };

    setClasses([...classes, newClass]);
    setNewClassName('');
    setShowAddClassModal(false);
    if ((window as any).confetti) (window as any).confetti({ particleCount: 100, spread: 70 });
  };

  const handleDeleteClass = (id: string) => {
    if (window.confirm('Hapus kelas ini?')) {
        setClasses(classes.filter(c => c.id !== id));
    }
  };

  const renderAddClassModal = () => (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 md:p-10 space-y-6 overflow-y-auto max-h-[90vh] no-scrollbar animate-scaleIn">
        <div className="text-center space-y-1">
            <h3 className="text-2xl font-black text-slate-800">Tambah Rombel</h3>
            <p className="text-slate-500 text-sm font-medium">Buat kelompok belajar baru Anda.</p>
        </div>
        <form onSubmit={handleAddClass} className="space-y-5">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Rombel</label>
                <input required type="text" placeholder="Contoh: XII IPA 1" value={newClassName} onChange={(e) => setNewClassName(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-700 shadow-sm"/>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jenjang</label>
                <select value={newClassLevel} onChange={(e) => setNewClassLevel(e.target.value as Jenjang)}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-600 outline-none font-bold text-slate-700 shadow-sm appearance-none">
                    {['SD', 'SMP', 'SMA', 'MAN'].map(j => <option key={j} value={j}>{j}</option>)}
                </select>
            </div>
            <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setShowAddClassModal(false)} className="flex-1 py-4 rounded-2xl bg-slate-100 font-black text-slate-500">Batal</button>
                <button type="submit" className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-black shadow-lg">Buat</button>
            </div>
        </form>
      </div>
    </div>
  );

  const renderGeneratorModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-fadeIn">
      <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scaleIn">
        <div className="p-6 md:p-8 bg-indigo-600 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">✨</div>
             <h3 className="text-xl md:text-2xl font-black tracking-tight">AI Generator Nusantara</h3>
          </div>
          <button onClick={() => setShowGenerator(false)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-xl transition-all">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar text-slate-800 bg-slate-50/50">
           {publishStatus === 'success' ? (
             <div className="text-center py-16 animate-scaleIn">
                <div className="text-7xl mb-6">✅</div>
                <h2 className="text-3xl font-black text-slate-800 mb-2">Modul Diterbitkan!</h2>
                <p className="text-slate-500 font-medium">Materi dan 30 soal HOTS kini tersedia di dashboard siswa.</p>
             </div>
           ) : !generatedResult ? (
             <form onSubmit={handleGenerate} className="max-w-2xl mx-auto space-y-8 py-4">
                <div className="text-center space-y-1 mb-6">
                   <h4 className="text-xl font-black text-slate-800">Rancang Materi Pintar</h4>
                   <p className="text-slate-500 text-sm font-medium">AI akan menyusun 1000+ kata materi & 30 soal kuis.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pelajaran</label>
                        <select value={genSubject} onChange={(e) => setGenSubject(e.target.value)} 
                            className="w-full p-4 bg-white rounded-2xl border border-slate-200 outline-none font-bold shadow-sm focus:ring-2 focus:ring-indigo-500">
                            {Object.keys(SUBJECT_META).filter(k => k !== 'Default').map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target</label>
                        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 font-black text-indigo-600 text-center text-sm">
                            {user.jenjang} - {user.kelas}
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Topik Pembahasan</label>
                  <input required type="text" value={genTopic} onChange={(e) => setGenTopic(e.target.value)} 
                    className="w-full p-5 bg-white rounded-2xl border border-slate-200 outline-none font-bold shadow-sm focus:ring-2 focus:ring-indigo-500 text-lg" 
                    placeholder="Misal: Termodinamika" />
                </div>
                <button disabled={isGenerating} className="w-full bg-indigo-600 text-white p-6 rounded-[1.5rem] font-black shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-50">
                  {isGenerating ? "Gemini 3 Pro sedang bekerja..." : "✨ Generate Modul AI"}
                </button>
             </form>
           ) : (
             <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-6">
                <div className="flex flex-col md:flex-row justify-between items-center bg-indigo-600 p-8 rounded-[2rem] shadow-xl text-white gap-4 sticky top-0 z-10">
                  <div className="text-center md:text-left">
                      <h4 className="font-black text-xl">Modul Siap Terbit!</h4>
                      <p className="opacity-80 text-xs font-medium">30 Soal kuis HOTS & Materi 1000+ kata berhasil dibuat.</p>
                  </div>
                  <button onClick={handlePublish} className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-black shadow-lg hover:scale-105 transition-all">Terbitkan</button>
                </div>
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl prose prose-indigo max-w-none prose-sm sm:prose-base">
                    <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed text-base">{generatedResult.material}</pre>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );

  if (['Profil', 'Pengaturan', 'Hubungi Admin', 'Tentang Kami'].includes(activeTab)) {
    return <DashboardSiswa user={user} activeTab={activeTab} onTabChange={onTabChange} onUpdateUser={onUpdateUser} />;
  }

  return (
    <div className="space-y-8 md:space-y-12 animate-fadeIn pb-24 px-4 max-w-7xl mx-auto overflow-x-hidden">
      {showGenerator && renderGeneratorModal()}
      {showInviteModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-scaleIn">
             <div className="text-center mb-6"><h3 className="text-2xl font-black">Undang Siswa</h3><p className="text-slate-500 text-sm">Masukkan ID Nusantara</p></div>
             <form onSubmit={handleInvite} className="space-y-6">
               <input required type="text" placeholder="NS-XXXX" value={inviteID} onChange={(e) => setInviteID(e.target.value.toUpperCase())} className="w-full p-5 rounded-2xl bg-slate-50 border outline-none font-black text-2xl tracking-widest text-center text-indigo-600 focus:ring-2 focus:ring-indigo-500 shadow-sm" />
               {inviteError && <p className="text-red-500 text-xs font-bold text-center animate-shake">{inviteError}</p>}
               <div className="flex gap-4"><button type="button" onClick={() => setShowInviteModal(false)} className="flex-1 p-4 rounded-xl bg-slate-100 font-black text-slate-500">Batal</button><button type="submit" className="flex-1 p-4 rounded-xl bg-indigo-600 text-white font-black shadow-lg">Undang</button></div>
             </form>
          </div>
        </div>
      )}
      {showAddClassModal && renderAddClassModal()}

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter mb-1">Ruang Pengajar</h2>
            <p className="text-slate-500 font-medium text-sm md:text-base">Kelola rombel dan modul cerdas secara instan.</p>
        </div>
        <button onClick={() => setShowGenerator(true)} className="w-full md:w-auto bg-indigo-600 text-white px-8 py-5 rounded-[1.5rem] font-black shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3">
            <span className="text-xl">✨</span>
            <span>Buat Modul 30 Soal AI</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {classes.map(cls => (
          <div key={cls.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-lg overflow-hidden flex flex-col min-h-[350px]">
             <div className="p-6 md:p-8 border-b flex justify-between items-center bg-indigo-50/20">
                <div className="space-y-1">
                    <h3 className="text-xl md:text-2xl font-black text-slate-800">{cls.name}</h3>
                    <div className="inline-block px-2 py-0.5 bg-indigo-100 rounded-lg text-[8px] font-black text-indigo-600 uppercase tracking-widest">{cls.level}</div>
                </div>
                <button onClick={() => { setSelectedClass(cls.id); setShowInviteModal(true); }} className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black shadow-lg hover:scale-110 transition-all">+</button>
             </div>
             <div className="p-6 md:p-8 space-y-4 flex-1 overflow-y-auto no-scrollbar">
                {cls.students.length > 0 ? cls.students.map(s => (
                   <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-white transition-all border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-sm text-sm">{s.name[0]}</div>
                        <div><p className="font-black text-slate-800 text-sm">{s.name}</p><p className="text-[9px] text-slate-400 font-black uppercase">{s.id}</p></div>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${s.isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse' : 'bg-slate-300'}`}></span>
                   </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center py-10 opacity-30 gap-2">
                    <span className="text-5xl">👥</span>
                    <p className="text-[10px] font-black uppercase">Kosong</p>
                  </div>
                )}
             </div>
             <button onClick={() => handleDeleteClass(cls.id)} className="p-4 text-[10px] font-black text-red-400 uppercase tracking-widest hover:bg-red-50 transition-colors border-t border-slate-50">Hapus Rombel</button>
          </div>
        ))}
        
        <button onClick={() => setShowAddClassModal(true)}
            className="border-4 border-dashed border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-4 hover:border-indigo-400 hover:bg-indigo-50/20 transition-all group min-h-[350px]">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:bg-indigo-600 transition-all">
                <span className="text-3xl text-slate-300 group-hover:text-white font-light">＋</span>
            </div>
            <span className="font-black text-slate-400 group-hover:text-indigo-600 uppercase tracking-widest text-xs">Tambah Rombel</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardGuru;
