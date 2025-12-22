
import React, { useState } from 'react';
import { User } from '../types';

interface DashboardGuruProps {
  user: User;
  activeTab: string;
}

interface ClassData {
  id: string;
  name: string;
  level: string;
  students: { id: string, name: string, isOnline: boolean }[];
}

const DashboardGuru: React.FC<DashboardGuruProps> = ({ user, activeTab }) => {
  const [classes, setClasses] = useState<ClassData[]>([
    { 
      id: 'CLASS-001', 
      name: 'X-MIPA 1', 
      level: 'SMA', 
      students: [
        { id: 'SISWA-001', name: 'Andi Pratama', isOnline: true },
        { id: 'SISWA-002', name: 'Siti Rahma', isOnline: false }
      ] 
    },
  ]);

  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [studentIdInput, setStudentIdInput] = useState('');
  const [searchError, setSearchError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassLevel, setNewClassLevel] = useState('SMA');

  const globalStudentBank = [
    { id: 'SISWA-101', name: 'Fadel Aqram', level: 'SMA' },
    { id: 'SISWA-102', name: 'Rina Wijaya', level: 'SMA' },
    { id: 'SISWA-103', name: 'Gani Maulana', level: 'SMA' },
    { id: 'SISWA-104', name: 'Lia Ananda', level: 'SMA' },
  ];

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    const newClass: ClassData = {
      id: `CLASS-${Math.floor(Math.random() * 1000)}`,
      name: newClassName,
      level: newClassLevel,
      students: []
    };
    setClasses([...classes, newClass]);
    setNewClassName('');
    setShowCreateModal(false);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    if (!selectedClass) return;
    if (selectedClass.students.some(s => s.id === studentIdInput)) {
      setSearchError('Siswa sudah terdaftar di kelas ini.');
      return;
    }
    const foundStudent = globalStudentBank.find(s => s.id === studentIdInput);
    if (foundStudent) {
      const updatedClasses = classes.map(cls => {
        if (cls.id === selectedClass.id) {
          const newStudent = { id: foundStudent.id, name: foundStudent.name, isOnline: false };
          const updatedCls = { ...cls, students: [...cls.students, newStudent] };
          setSelectedClass(updatedCls);
          return updatedCls;
        }
        return cls;
      });
      setClasses(updatedClasses);
      setStudentIdInput('');
    } else {
      setSearchError('ID Siswa tidak ditemukan.');
    }
  };

  const handleRemoveStudent = (studentId: string) => {
    if (!selectedClass) return;
    const updatedClasses = classes.map(cls => {
      if (cls.id === selectedClass.id) {
        const updatedCls = { ...cls, students: cls.students.filter(s => s.id !== studentId) };
        setSelectedClass(updatedCls);
        return updatedCls;
      }
      return cls;
    });
    setClasses(updatedClasses);
  };

  if (activeTab === 'Dashboard' || activeTab === 'Kelola Materi' || activeTab === 'Kelola Kuis') {
    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800">Manajemen Pengajaran</h2>
            <p className="text-slate-500 font-medium">Kelola rombongan belajar Anda.</p>
          </div>
          <div className="flex space-x-3">
             <button onClick={() => setShowCreateModal(true)} className="bg-white text-indigo-600 border-2 border-indigo-100 px-6 py-3 rounded-2xl font-bold hover:bg-indigo-50 transition-all">
              + Buat Kelas Baru
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all relative group">
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-slate-800">{cls.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{cls.level}</p>
                <div className="flex items-center justify-between mt-8">
                  <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold">{cls.students.length} Siswa</span>
                  <button onClick={() => setSelectedClass(cls)} className="text-indigo-600 font-bold text-xs hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all border border-indigo-100">
                    Kelola Siswa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Create Class */}
        {showCreateModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white rounded-[40px] p-8 max-w-md w-full shadow-2xl animate-slideUp">
              <h3 className="text-2xl font-black text-slate-800 mb-6">Buat Kelas Baru</h3>
              <form onSubmit={handleCreateClass} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nama Kelas</label>
                  <input required type="text" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} placeholder="Contoh: XII IPA 3" className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Jenjang</label>
                  <select value={newClassLevel} onChange={(e) => setNewClassLevel(e.target.value)} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all font-bold">
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
                    <option value="MAN">MAN</option>
                  </select>
                </div>
                <div className="flex space-x-3 mt-8">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-3 rounded-2xl font-bold text-slate-400">Batal</button>
                  <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-2xl font-bold">Buat Kelas</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Manage Students */}
        {selectedClass && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white rounded-[40px] p-8 md:p-12 max-w-2xl w-full shadow-2xl animate-slideUp max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-3xl font-black text-slate-800">{selectedClass.name}</h3>
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Daftar Siswa Aktif</p>
                </div>
                <button onClick={() => setSelectedClass(null)} className="p-3 hover:bg-slate-100 rounded-full transition-all">
                   <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleAddStudent} className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex gap-3">
                <input required type="text" value={studentIdInput} onChange={(e) => setStudentIdInput(e.target.value.toUpperCase())} placeholder="ID Siswa (SISWA-101)" className="flex-1 px-5 py-3 rounded-2xl bg-white border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all font-bold" />
                <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold">Tambah</button>
              </form>
              {searchError && <p className="text-red-500 text-xs font-bold mb-4">{searchError}</p>}

              <div className="flex-1 overflow-y-auto space-y-3">
                {selectedClass.students.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center font-bold text-indigo-600">{s.name.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-slate-800">{s.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{s.id}</p>
                      </div>
                    </div>
                    <button onClick={() => handleRemoveStudent(s.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-center py-20 space-y-6">
      <div className="text-8xl">📊</div>
      <h2 className="text-3xl font-black text-slate-800">Halaman {activeTab}</h2>
      <p className="text-slate-500 text-lg">Modul dalam proses sinkronisasi.</p>
    </div>
  );
};

export default DashboardGuru;
