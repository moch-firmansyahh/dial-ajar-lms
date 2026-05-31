import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/shared/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { Plus, LayoutGrid, List as ListIcon, Lock, CheckCircle2, Clock, ArrowRight, ArrowLeft, ArrowUpDown, FileText, HelpCircle, Brain, X } from 'lucide-react';

const TugasList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isDosen = user?.role === 'DOSEN';

  // State for view mode: 'list' or 'grid' with LocalStorage persistence
  const [viewMode, setViewModeState] = useState(() => {
    return localStorage.getItem('tugasViewMode') || 'list';
  });

  const setViewMode = (mode) => {
    setViewModeState(mode);
    localStorage.setItem('tugasViewMode', mode);
  };

  // State for sorting: 'asc' (terdekat) or 'desc' (terlama)
  const [sortOrder, setSortOrder] = useState('asc');

  // State for filtering
  const [filterType, setFilterType] = useState('all');

  // State for Quiz Modal
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  
  // State for Error Notification
  const [errorNotification, setErrorNotification] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Dummy Data with types
  const dummyTugas = [
    { 
      id: '1', 
      judul: 'Tugas 1: Instalasi React & Vite', 
      dueDate: new Date(Date.now() - 86400000 * 2), // 2 days ago
      status: 'dikumpulkan', 
      nilai: 95,
      type: 'tugas'
    },
    { 
      id: '2', 
      judul: 'Kuis 1: Pemahaman JSX Dasar', 
      dueDate: new Date(Date.now() - 86400000 * 5), // 5 days ago
      status: 'terkunci', 
      nilai: null,
      type: 'kuis'
    },
    { 
      id: '3', 
      judul: 'Tugas 3: State Management dengan Zustand', 
      dueDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
      status: 'belum', 
      nilai: null,
      type: 'tugas'
    },
    { 
      id: '4', 
      judul: 'Kuis 2: Hooks & Context API', 
      dueDate: new Date(Date.now() + 86400000 * 7), // 7 days from now
      status: 'belum', 
      nilai: null,
      type: 'kuis'
    },
  ];

  const filteredAndSortedTugas = useMemo(() => {
    let filtered = dummyTugas;
    if (filterType !== 'all') {
      filtered = dummyTugas.filter(t => t.type === filterType);
    }

    return filtered.sort((a, b) => {
      if (sortOrder === 'asc') return a.dueDate - b.dueDate;
      return b.dueDate - a.dueDate;
    });
  }, [dummyTugas, sortOrder, filterType]);

  const toggleSort = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', { 
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    }).format(date);
  };

  // Helper to determine style based on status
  const getStatusStyle = (status) => {
    switch(status) {
      case 'dikumpulkan':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-500',
          bg: 'bg-emerald-50',
          border: 'border-emerald-100/60',
          gradient: 'from-emerald-50 to-teal-50',
          watermark: 'text-emerald-500',
          badgeText: 'Selesai',
          badgeType: 'sukses'
        };
      case 'terkunci':
        return {
          icon: Lock,
          color: 'text-slate-500',
          bg: 'bg-slate-50',
          border: 'border-slate-200/60',
          gradient: 'from-slate-50 to-gray-100',
          watermark: 'text-slate-500',
          badgeText: 'Terkunci (Terlewat)',
          badgeType: 'default'
        };
      case 'belum':
      default:
        return {
          icon: FileText, // Will be overridden for Kuis
          color: 'text-blue-500',
          bg: 'bg-blue-50',
          border: 'border-blue-100/60',
          gradient: 'from-blue-50 to-indigo-50',
          watermark: 'text-blue-500',
          badgeText: 'Belum Dikerjakan',
          badgeType: 'peringatan'
        };
    }
  };

  return (
    <div>
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up-fade {
          animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Toast Notification */}
      {errorNotification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-slide-up-fade">
          <div className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg shadow-red-500/20 font-medium flex items-center gap-2">
            <Lock size={18} /> {errorNotification}
          </div>
        </div>
      )}

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Segmented Filter Control */}
          <div className="flex items-center bg-white border border-slate-200/80 rounded-xl p-1 shadow-sm h-10 w-full sm:w-auto">
            <button 
              onClick={() => setFilterType('all')} 
              className={`flex-1 sm:flex-none px-3.5 h-full rounded-[8px] text-[12px] font-medium transition-all duration-300 flex items-center justify-center ${filterType === 'all' ? 'bg-slate-100 text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              Semua
            </button>
            <button 
              onClick={() => setFilterType('tugas')} 
              className={`flex-1 sm:flex-none px-3.5 h-full rounded-[8px] text-[12px] font-medium transition-all duration-300 flex items-center justify-center gap-1.5 ${filterType === 'tugas' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50/50'}`}
            >
              <FileText size={14} /> Tugas
            </button>
            <button 
              onClick={() => setFilterType('kuis')} 
              className={`flex-1 sm:flex-none px-3.5 h-full rounded-[8px] text-[12px] font-medium transition-all duration-300 flex items-center justify-center gap-1.5 ${filterType === 'kuis' ? 'bg-purple-50 text-purple-600 shadow-sm' : 'text-slate-400 hover:text-purple-500 hover:bg-purple-50/50'}`}
            >
              <HelpCircle size={14} /> Kuis
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Toggle View Buttons */}
            <div className="flex items-center bg-white border border-slate-200/80 rounded-xl p-1 shadow-sm h-10">
              <div className="relative flex w-full">
                <div 
                  className={`absolute top-0 bottom-0 w-1/2 bg-slate-100 rounded-[8px] transition-transform duration-300 ease-in-out ${viewMode === 'grid' ? 'translate-x-0' : 'translate-x-full'}`}
                />
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={`relative z-10 flex-1 flex justify-center items-center px-2.5 rounded-[8px] transition-colors duration-300 ${viewMode === 'grid' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Tampilan Kotak (Grid)"
                >
                  <LayoutGrid size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`relative z-10 flex-1 flex justify-center items-center px-2.5 rounded-[8px] transition-colors duration-300 ${viewMode === 'list' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Tampilan Memanjang (List)"
                >
                  <ListIcon size={16} />
                </button>
              </div>
            </div>

            {/* Sort Button */}
            <button 
              onClick={toggleSort}
              className="flex items-center justify-center gap-2 px-3 h-10 bg-white border border-slate-200/80 rounded-xl shadow-sm text-[12px] font-medium text-slate-600 hover:text-primary hover:border-primary transition-all w-full sm:w-auto group"
              title="Urutkan Deadline"
            >
              <ArrowUpDown size={14} className="text-slate-400 group-hover:text-primary transition-colors" />
              {sortOrder === 'asc' ? 'Terdekat' : 'Terlama'}
            </button>
          </div>
        </div>

        {isDosen && (
          <Button 
            onClick={() => navigate(`/tugas/${id}/buat`)} 
            className="shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all w-full sm:w-auto px-5"
          >
            <Plus size={18} /> Buat Tugas / Kuis
          </Button>
        )}
      </div>

      {/* List Area - with key binding to re-trigger animations on layout/sort change */}
      {isLoading ? (
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'flex flex-col space-y-4'}`}>
          {Array(4).fill(0).map((_, i) => (
            <Card key={`skel-tugas-${i}`} className={`p-5 ${viewMode === 'grid' ? 'h-[240px]' : 'h-[100px] flex items-center gap-4'}`}>
              <div className={`flex ${viewMode === 'grid' ? 'flex-col gap-4 h-full' : 'w-full gap-4 items-center'}`}>
                <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                <div className={`flex-1 ${viewMode === 'grid' ? 'space-y-3' : 'space-y-2'}`}>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                {viewMode === 'grid' && <div className="mt-auto"><Skeleton className="h-8 w-full rounded-lg" /></div>}
              </div>
            </Card>
          ))}
        </div>
      ) : filteredAndSortedTugas.length > 0 ? (
        <div key={viewMode + sortOrder + filterType} className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'flex flex-col space-y-4'}`}>
          {filteredAndSortedTugas.map((tugas, idx) => {
            const style = getStatusStyle(tugas.status);
            
            // Override icon for kuis
            let StatusIcon = style.icon;
            if (tugas.status === 'belum' && tugas.type === 'kuis') {
              StatusIcon = Brain;
              style.color = 'text-purple-500';
              style.bg = 'bg-purple-50';
              style.border = 'border-purple-100/60';
              style.gradient = 'from-purple-50 to-fuchsia-50';
              style.watermark = 'text-purple-500';
            }

            const isGrid = viewMode === 'grid';
            const isLocked = tugas.status === 'terkunci';

            const handleCardClick = () => {
              if (isDosen) {
                navigate(`/tugas/${id}/${tugas.id}`);
              } else if (isLocked) {
                setErrorNotification('Tugas atau kuis ini sudah melewati batas waktu pengerjaan.');
                setTimeout(() => setErrorNotification(''), 3000);
              } else if (tugas.type === 'kuis') {
                if (tugas.status === 'dikumpulkan') {
                  setErrorNotification('Kamu sudah mengerjakan kuis ini.');
                  setTimeout(() => setErrorNotification(''), 3000);
                  return;
                }
                setSelectedQuiz(tugas);
                setShowQuizModal(true);
              } else {
                navigate(`/tugas/${id}/${tugas.id}`);
              }
            };

            return (
              <Card 
                key={tugas.id} 
                onClick={handleCardClick}
                className={`relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-slate-200/60 p-5 animate-slide-up-fade cursor-pointer
                  flex ${isGrid ? 'flex-col gap-5 items-start' : 'flex-col sm:flex-row justify-between items-start sm:items-center gap-4'}
                  ${isLocked ? 'opacity-85 grayscale-[15%]' : ''}
                `}
                style={{ animationDelay: `${idx * 70}ms` }}
              >
                {/* Subtle hover background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {/* Giant Watermark Icon */}
                <div className={`absolute ${isGrid ? '-right-4 -bottom-6' : '-right-6 -bottom-10'} ${style.watermark} opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none`}>
                  <StatusIcon size={isGrid ? 120 : 150} />
                </div>
                
                <div className={`flex gap-4 relative z-10 w-full ${isGrid ? 'flex-col items-start' : 'items-start sm:items-center sm:w-auto'}`}>
                  {/* Icon Container with bouncy hover */}
                  <div className={`bg-gradient-to-br ${style.gradient} p-3.5 rounded-2xl ${style.color} group-hover:scale-110 group-hover:shadow-sm group-hover:-rotate-3 transition-all duration-300 shrink-0 border ${style.border}`}>
                    <StatusIcon size={24} className="transition-colors" />
                  </div>
                  
                  <div className="flex-1 w-full pr-2">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded border ${tugas.type === 'kuis' ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                        {tugas.type === 'kuis' ? 'Kuis Evaluasi' : 'Tugas Biasa'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-[16px] text-slate-800 group-hover:text-primary transition-colors tracking-tight mb-2">
                      {tugas.judul}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge type={style.badgeType} label={style.badgeText} />
                      <span className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block" />
                      <span className={`text-[11.5px] font-medium flex items-center gap-1.5 ${isLocked ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Clock size={12} /> {formatDate(tugas.dueDate)}
                      </span>
                      {tugas.nilai !== null && (
                        <>
                          <span className="w-1 h-1 bg-slate-300 rounded-full" />
                          <Badge type="sukses" label={`Nilai: ${tugas.nilai}/100`} />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Arrow Button for Entry */}
                <div 
                  className={`relative z-10 flex items-center justify-center gap-2 bg-slate-50 group-hover:bg-primary text-slate-400 group-hover:text-white border border-slate-200 group-hover:border-primary transition-all duration-300 shadow-sm shrink-0 group-hover:shadow-primary/20
                    ${isGrid ? 'w-full py-2.5 rounded-xl font-medium mt-auto text-[13px]' : 'w-11 h-11 rounded-full'}
                  `}
                >
                  <ArrowRight size={18} className={`${isGrid && 'hidden'}`} />
                  {isGrid && <span>Buka {tugas.type === 'kuis' ? 'Kuis' : 'Tugas'}</span>}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState 
          icon={filterType === 'kuis' ? HelpCircle : FileText}
          title={filterType === 'all' ? 'Belum Ada Tugas' : `Belum Ada ${filterType === 'kuis' ? 'Kuis' : 'Tugas'}`}
          description={`Saat ini belum ada ${filterType === 'all' ? 'tugas atau kuis' : filterType} yang ditugaskan pada kelas ini.`}
        />
      )}

      {/* Quiz Verification Modal */}
      {showQuizModal && selectedQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowQuizModal(false)} />
          
          <div className="bg-white rounded-2xl w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl animate-scale-in flex flex-col">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            
            {/* Close button */}
            <button 
              onClick={() => setShowQuizModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-20"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-10 text-center relative z-10">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
                <Clock size={40} />
              </div>
              
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 tracking-tight mb-2">
                {selectedQuiz.judul}
              </h1>
              <p className="text-slate-500 font-medium mb-8">Mata Kuliah Web Programming</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 text-left">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-[12px] font-medium text-slate-400 uppercase tracking-wider block mb-1">Durasi Kuis</span>
                  <span className="font-medium text-slate-700 text-lg flex items-center gap-2">
                    <Clock size={18} className="text-primary" /> 45 Menit
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-[12px] font-medium text-slate-400 uppercase tracking-wider block mb-1">Total Soal</span>
                  <span className="font-medium text-slate-700 text-lg flex items-center gap-2">
                    <LayoutGrid size={18} className="text-primary" /> 5 Soal
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 col-span-2 md:col-span-1">
                  <span className="text-[12px] font-medium text-slate-400 uppercase tracking-wider block mb-1">Jenis Soal</span>
                  <span className="font-medium text-slate-700 text-lg flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-primary" /> Pilihan Ganda
                  </span>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-left mb-8 flex gap-3 items-start">
                <div className="bg-red-100 p-1.5 rounded-md text-red-600 shrink-0 mt-0.5">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Peringatan Penting</h4>
                  <p className="text-sm leading-relaxed text-red-600/90">
                    Timer akan terus berjalan jika Anda keluar atau me-refresh halaman pengerjaan. Pastikan koneksi internet Anda stabil sebelum menekan tombol mulai. Kuis akan otomatis dikumpulkan saat waktu habis.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="w-full sm:w-auto h-12 px-8" onClick={() => setShowQuizModal(false)}>
                  Batal
                </Button>
                <Button 
                  className="w-full sm:w-auto h-12 px-10 shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all" 
                  onClick={() => navigate(`/tugas/${id}/${selectedQuiz.id}/kerjakan`)}
                >
                  Kerjakan Kuis Sekarang <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TugasList;
