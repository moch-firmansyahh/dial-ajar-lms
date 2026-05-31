import React, { useState, useEffect } from 'react';
import { Award, Users, Search, FileSpreadsheet, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import MataKuliahList from '../shared/MataKuliahList';

const NilaiRekap = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatkul, setSelectedMatkul] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedMatkul) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [selectedMatkul]);

  const dummyMahasiswa = [
    { nim: '13521001', nama: 'Andi Mahasiswa', tugas: 85, kuis: 90, akhir: 87.5, grade: 'A' },
    { nim: '13521002', nama: 'Budi Pratama', tugas: 78, kuis: 82, akhir: 80.0, grade: 'A-' },
    { nim: '13521003', nama: 'Cici Lestari', tugas: 92, kuis: 88, akhir: 90.0, grade: 'A' },
    { nim: '13521004', nama: 'Dani Saputra', tugas: 65, kuis: 70, akhir: 67.5, grade: 'B+' },
    { nim: '13521005', nama: 'Eka Fitriani', tugas: 55, kuis: 60, akhir: 57.5, grade: 'C+' },
  ];

  const filteredMhs = dummyMahasiswa.filter(m => 
    m.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.nim.includes(searchQuery)
  );

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'bg-emerald-100/80 text-emerald-600 border-emerald-200/60';
    if (grade.startsWith('B')) return 'bg-blue-100/80 text-blue-600 border-blue-200/60';
    if (grade.startsWith('C')) return 'bg-amber-100/80 text-amber-600 border-amber-200/60';
    return 'bg-rose-100/80 text-rose-600 border-rose-200/60';
  };

  if (!selectedMatkul) {
    return (
      <div className="animate-slideUpFade">
        <MataKuliahList 
          selectMode={true} 
          title="Pilih Mata Kuliah" 
          subtitle="Pilih mata kuliah terlebih dahulu untuk melihat dan mengelola rekap nilai mahasiswa"
          onSelect={(id) => setSelectedMatkul(id)} 
        />
      </div>
    );
  }

  return (
    <div className="animate-slideUpFade">
      {/* Header with Back Button and Export */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <button 
          onClick={() => setSelectedMatkul(null)}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors group"
        >
          <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
            <ArrowLeft size={16} />
          </div>
          Kembali pilih mata kuliah
        </button>

        <div className="flex items-center gap-4">
          <Button className="!bg-emerald-500 hover:!bg-emerald-600 !text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <FileSpreadsheet size={18} /> Export Excel
          </Button>
        </div>
      </div>

      {/* Action Bar */}
      {isLoading ? (
        <div className="animate-slide-up-fade">
          <div className="bg-white p-4 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Skeleton className="h-10 w-48 rounded-xl" />
            <Skeleton className="h-10 w-full sm:w-80 rounded-xl" />
          </div>
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative">
            <div className="overflow-x-auto relative z-10">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="text-left px-6 py-4"><Skeleton className="h-4 w-24" /></th>
                    <th className="text-center px-6 py-4"><Skeleton className="h-4 w-16 mx-auto" /></th>
                    <th className="text-center px-6 py-4"><Skeleton className="h-4 w-16 mx-auto" /></th>
                    <th className="text-center px-6 py-4"><Skeleton className="h-4 w-20 mx-auto" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Array(5).fill(0).map((_, i) => (
                    <tr key={`skel-rekap-${i}`} className="hover:bg-slate-50/80">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                          <div>
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center"><Skeleton className="h-6 w-12 mx-auto rounded-lg" /></td>
                      <td className="px-6 py-4 text-center"><Skeleton className="h-6 w-12 mx-auto rounded-lg" /></td>
                      <td className="px-6 py-4 text-center"><Skeleton className="h-6 w-16 mx-auto rounded-lg" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
      <>
      <div className="bg-white p-4 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center justify-center gap-3 text-sm font-medium text-slate-600 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/60 w-full sm:w-auto">
          <Users size={18} className="text-primary shrink-0" />
          <span>Total {dummyMahasiswa.length} Mahasiswa</span>
        </div>
        
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari NIM atau Nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative">
        <div className="absolute right-0 bottom-0 text-slate-50 opacity-50 pointer-events-none">
          <Award size={250} className="translate-x-1/4 translate-y-1/4 rotate-[-10deg]" />
        </div>
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="text-left px-6 py-4 text-[11px] font-medium text-slate-400 uppercase tracking-wider">Mahasiswa</th>
                <th className="text-center px-6 py-4 text-[11px] font-medium text-slate-400 uppercase tracking-wider">Tugas</th>
                <th className="text-center px-6 py-4 text-[11px] font-medium text-slate-400 uppercase tracking-wider">Kuis</th>
                <th className="text-center px-6 py-4 text-[11px] font-medium text-slate-400 uppercase tracking-wider">Nilai Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMhs.map((mhs) => (
                <tr key={mhs.nim} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-50 flex items-center justify-center font-medium text-blue-600 border border-blue-200/50 shadow-sm shrink-0">
                        {mhs.nama.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[14px] text-slate-800 group-hover:text-primary transition-colors">{mhs.nama}</p>
                        <p className="text-[12px] font-medium text-slate-500 font-mono mt-0.5">{mhs.nim}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block bg-white border border-slate-200/80 px-3 py-1 rounded-lg text-[13px] font-medium text-slate-700 shadow-sm">
                      {mhs.tugas}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block bg-white border border-slate-200/80 px-3 py-1 rounded-lg text-[13px] font-medium text-slate-700 shadow-sm">
                      {mhs.kuis}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <span className="text-[16px] font-medium text-slate-800">{mhs.akhir}</span>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredMhs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Users size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-[15px] font-medium text-slate-600 mb-1">Tidak ada mahasiswa ditemukan</p>
                    <p className="text-[13px] text-slate-500">Coba ubah kata kunci pencarian Anda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default NilaiRekap;
