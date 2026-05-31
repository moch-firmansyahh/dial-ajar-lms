import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Award, LayoutGrid, List, Search, BookOpen } from 'lucide-react';

const NilaiSaya = () => {
  const { user } = useAuthStore();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Persist view mode
  useEffect(() => {
    const saved = localStorage.getItem('nilaiViewMode');
    if (saved) setViewMode(saved);
  }, []);

  const handleViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem('nilaiViewMode', mode);
  };

  const dummyNilai = [
    { matkul: 'Pengembangan Aplikasi Berbasis Web', tugas: 85, kuis: 90, akhir: 87.5 },
    { matkul: 'Pemrograman Berorientasi Objek', tugas: 80, kuis: 85, akhir: 82.5 },
    { matkul: 'Basis Data', tugas: 78, kuis: 82, akhir: 80.0 },
    { matkul: 'Struktur Data', tugas: 65, kuis: 70, akhir: 67.5 },
  ];

  // Filter & Search logic
  const filteredNilai = dummyNilai.filter(item => 
    item.matkul.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getScoreBarColor = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const isGrid = viewMode === 'grid';

  return (
    <div className="animate-slideUpFade">
      {/* Action Header */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-4 mb-6">
        
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Toggle View Mode */}
          <div className="flex items-center bg-white border border-slate-200/80 rounded-xl p-1 shadow-sm shrink-0">
            <button
              onClick={() => handleViewMode('grid')}
              className={`flex-1 sm:flex-none flex items-center justify-center px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                isGrid ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => handleViewMode('list')}
              className={`flex-1 sm:flex-none flex items-center justify-center px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                !isGrid ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="relative w-full xl:w-72 shrink-0">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari mata kuliah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Content */}
      <div 
        key={viewMode}
        className={
          isGrid 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-slideUpFade" 
            : "flex flex-col gap-4 animate-slideUpFade"
        }
      >
        {filteredNilai.map((item, idx) => (
          <div 
            key={idx}
            className={`group relative bg-white border border-slate-200/60 rounded-[24px] overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 flex ${isGrid ? 'flex-col' : 'flex-col sm:flex-row items-center p-2'}`}
          >
            {/* Watermark Icon */}
            <div className="absolute -right-8 -bottom-8 text-slate-50 opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rotate-12 group-hover:rotate-0">
              <Award size={180} />
            </div>

            {/* Header Area */}
            <div className={`p-6 relative z-10 flex-1 ${isGrid ? 'border-b border-slate-100/80' : 'w-full sm:w-[40%] border-b sm:border-b-0 sm:border-r border-slate-100/80'}`}>
              <div className="flex items-start gap-4">
                <div className="bg-primary/5 p-3 rounded-2xl text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm border border-primary/10">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-[16px] text-slate-800 leading-tight group-hover:text-primary transition-colors line-clamp-2 mt-1">
                    {item.matkul}
                  </h3>
                </div>
              </div>
            </div>

            {/* Details Area */}
            <div className={`p-6 relative z-10 flex-1 flex flex-col justify-center w-full`}>
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="text-center bg-slate-50/80 px-4 py-2.5 rounded-xl border border-slate-100 flex-1">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-0.5">Tugas</p>
                  <p className="text-[15px] font-semibold text-slate-700">{item.tugas}</p>
                </div>
                <div className="text-center bg-slate-50/80 px-4 py-2.5 rounded-xl border border-slate-100 flex-1">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-0.5">Kuis</p>
                  <p className="text-[15px] font-semibold text-slate-700">{item.kuis}</p>
                </div>
              </div>

              {/* Progress Bar for Final Score */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Nilai Akhir</span>
                  <span className="text-xl font-bold text-slate-800">{item.akhir}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${getScoreBarColor(item.akhir)}`}
                    style={{ width: `${item.akhir}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredNilai.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-200/60 border-dashed">
            <Award size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-medium text-slate-700 mb-1">Tidak ada data nilai</h3>
            <p className="text-slate-500 text-[14px]">Mata kuliah yang Anda cari tidak ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NilaiSaya;
