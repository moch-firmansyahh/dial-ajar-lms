import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { getCourseContent } from '../../api/matakuliah.api';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/shared/EmptyState';
import { Plus, FileText, ArrowDownToLine, Presentation, File, BookOpen, LayoutGrid, List as ListIcon, Play, Video as VideoIcon, MonitorPlay, Clock, Calendar, CheckCircle } from 'lucide-react';

const MateriList = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isDosen = user?.role === 'DOSEN';
  
  // State for view mode: 'list' or 'grid' with LocalStorage persistence
  const [viewMode, setViewModeState] = useState(() => {
    return localStorage.getItem('materiViewMode') || 'list';
  });

  // State for filter
  const [filterType, setFilterType] = useState('all'); // 'all', 'modul', 'video'

  const { data: contentData, isLoading: queryLoading } = useQuery({
    queryKey: ['courseContent', id],
    queryFn: async () => {
      const res = await getCourseContent(id);
      return res;
    }
  });

  const isLoading = queryLoading;

  const combinedMateri = [];
  if (contentData) {
    if (contentData.modules) {
      contentData.modules.forEach(m => {
        combinedMateri.push({
          id: `modul-${m.id}`,
          title: m.judul,
          size: 'Unknown', // Can be enhanced later
          date: new Date(m.createdAt).toLocaleDateString('id-ID'),
          type: 'pdf',
          category: 'modul',
          url: m.fileUrl
        });
      });
    }
    if (contentData.videos) {
      contentData.videos.forEach(v => {
        combinedMateri.push({
          id: `video-${v.id}`,
          title: v.judul,
          duration: 'Unknown',
          date: new Date(v.createdAt).toLocaleDateString('id-ID'),
          type: 'youtube',
          category: 'video',
          url: v.linkVideo,
          isCompleted: false
        });
      });
    }
  }

  const getFileStyle = (type, category) => {
    if (category === 'video') {
      return {
        icon: Play,
        color: 'text-violet-500',
        hoverColor: 'group-hover:text-violet-600',
        bg: 'bg-violet-50',
        border: 'border-violet-100/60',
        gradient: 'from-violet-50 to-fuchsia-50',
        badge: 'bg-violet-100/80 text-violet-600 border-violet-200/60',
        watermarkColor: 'text-violet-500'
      };
    }

    switch (type.toLowerCase()) {
      case 'pdf':
        return {
          icon: FileText,
          color: 'text-rose-500',
          hoverColor: 'group-hover:text-rose-600',
          bg: 'bg-rose-50',
          border: 'border-rose-100/60',
          gradient: 'from-rose-50 to-red-50',
          badge: 'bg-rose-100/80 text-rose-600 border-rose-200/60',
          watermarkColor: 'text-rose-500'
        };
      case 'ppt':
      case 'pptx':
        return {
          icon: Presentation,
          color: 'text-amber-500',
          hoverColor: 'group-hover:text-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-100/60',
          gradient: 'from-amber-50 to-orange-50',
          badge: 'bg-amber-100/80 text-amber-600 border-amber-200/60',
          watermarkColor: 'text-amber-500'
        };
      case 'doc':
      case 'docx':
        return {
          icon: File,
          color: 'text-blue-500',
          hoverColor: 'group-hover:text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-100/60',
          gradient: 'from-blue-50 to-indigo-50',
          badge: 'bg-blue-100/80 text-blue-600 border-blue-200/60',
          watermarkColor: 'text-blue-500'
        };
      default:
        return {
          icon: FileText,
          color: 'text-slate-500',
          hoverColor: 'group-hover:text-slate-600',
          bg: 'bg-slate-50',
          border: 'border-slate-100/60',
          gradient: 'from-slate-50 to-gray-50',
          badge: 'bg-slate-100/80 text-slate-600 border-slate-200/60',
          watermarkColor: 'text-slate-500'
        };
    }
  };

  const filteredMateri = combinedMateri.filter(m => {
    if (filterType === 'all') return true;
    return m.category === filterType;
  });

  const handleDownload = (url) => {
    window.open(url, '_blank');
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
      `}</style>

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Filter Buttons */}
          <div className="flex items-center bg-white border border-slate-200/80 rounded-xl p-1 shadow-sm h-10 w-full sm:w-auto">
            <button 
              onClick={() => setFilterType('all')} 
              className={`px-3.5 h-full rounded-[8px] text-[12px] font-medium transition-all duration-300 flex items-center gap-1.5 ${filterType === 'all' ? 'bg-primary/10 text-primary shadow-sm' : 'text-slate-400 hover:text-primary hover:bg-primary/5'}`}
            >
              Semua
            </button>
            <button 
              onClick={() => setFilterType('modul')} 
              className={`px-3.5 h-full rounded-[8px] text-[12px] font-medium transition-all duration-300 flex items-center gap-1.5 ${filterType === 'modul' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50/50'}`}
            >
              <BookOpen size={14} /> Dokumen
            </button>
            <button 
              onClick={() => setFilterType('video')} 
              className={`px-3.5 h-full rounded-[8px] text-[12px] font-medium transition-all duration-300 flex items-center gap-1.5 ${filterType === 'video' ? 'bg-violet-50 text-violet-600 shadow-sm' : 'text-slate-400 hover:text-violet-500 hover:bg-violet-50/50'}`}
            >
              <VideoIcon size={14} /> Video
            </button>
          </div>

          {/* Toggle View Buttons */}
          <div className="flex items-center bg-white border border-slate-200/80 rounded-xl p-1 shadow-sm h-10">
            <div className="relative flex w-full">
              {/* Sliding background indicator for toggle */}
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
        </div>

        {isDosen && (
          <Button 
            onClick={() => navigate(`/matakuliah/${id}/materi/upload`)}
            className="shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all w-full sm:w-auto px-5"
          >
            <Plus size={18} /> Tambah Materi
          </Button>
        )}
      </div>

      {/* List Area */}
      {isLoading ? (
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'flex flex-col space-y-4'}`}>
          {Array(4).fill(0).map((_, i) => (
            <Card key={`skel-materi-${i}`} className={`p-5 flex ${viewMode === 'grid' ? 'flex-col gap-5 h-[200px]' : 'flex-row items-center gap-4'}`}>
              <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-3 w-full">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              {viewMode === 'grid' ? (
                <Skeleton className="h-10 w-full rounded-xl mt-auto" />
              ) : (
                <Skeleton className="w-11 h-11 rounded-full shrink-0" />
              )}
            </Card>
          ))}
        </div>
      ) : filteredMateri.length > 0 ? (
        <div key={`${viewMode}-${filterType}`} className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'flex flex-col space-y-4'}`}>
          {filteredMateri.map((materi, idx) => {
            const style = getFileStyle(materi.type, materi.category);
            const Icon = style.icon;
            const isGrid = viewMode === 'grid';
            const isVideo = materi.category === 'video';

            return (
              <Card 
                key={materi.id} 
                className={`relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-slate-200/60 p-5 animate-slide-up-fade
                  flex ${isGrid ? 'flex-col gap-5 items-start' : 'flex-col sm:flex-row justify-between items-start sm:items-center gap-4'}
                `}
                style={{ animationDelay: `${idx * 70}ms` }}
              >
                {/* Subtle hover background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {/* Giant Watermark Icon */}
                <div className={`absolute ${isGrid ? '-right-4 -bottom-6' : '-right-6 -bottom-10'} ${style.watermarkColor} opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none`}>
                  {isVideo ? <MonitorPlay size={isGrid ? 120 : 150} /> : <BookOpen size={isGrid ? 120 : 150} />}
                </div>
                
                <div className={`flex gap-4 relative z-10 w-full ${isGrid ? 'flex-col items-start' : 'items-start sm:items-center sm:w-auto'}`}>
                  {/* Icon Container with bouncy hover */}
                  <div className={`bg-gradient-to-br ${style.gradient} p-3.5 rounded-2xl ${style.color} group-hover:scale-110 group-hover:shadow-sm group-hover:-rotate-3 transition-all duration-300 shrink-0 border ${style.border}`}>
                    <Icon size={24} className={`${style.hoverColor} transition-colors`} />
                  </div>
                  
                  <div className="flex-1 w-full pr-2">
                    <h3 className="font-semibold text-[16px] text-slate-800 group-hover:text-primary transition-colors tracking-tight mb-2">
                      {materi.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-[12px] font-medium text-slate-500">
                      <span className={`${style.badge} border px-2 py-0.5 rounded-md font-medium uppercase text-[10px] tracking-wider`}>
                        {isVideo ? 'Video' : materi.type}
                      </span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span>{isVideo ? <span className="flex items-center gap-1"><Clock size={12}/> {materi.duration}</span> : materi.size}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span>{materi.date}</span>
                    </div>
                  </div>
                </div>

                {/* Premium Button */}
                <button 
                  onClick={() => handleDownload(materi.url)}
                  className={`relative z-10 flex items-center justify-center gap-2 transition-all duration-300 shadow-sm shrink-0 hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]
                    ${isGrid ? 'w-full py-2.5 rounded-xl font-medium mt-auto text-[13px]' : 'w-11 h-11 rounded-full'}
                    ${isVideo 
                      ? 'bg-violet-50 hover:bg-violet-600 text-violet-600 hover:text-white border border-violet-200 hover:border-violet-600' 
                      : 'bg-slate-50 hover:bg-primary text-slate-500 hover:text-white border border-slate-200 hover:border-primary'}
                  `}
                  title={isVideo ? "Tonton Video" : "Unduh Modul"}
                >
                  {isVideo ? <Play size={18} className={!isGrid ? 'ml-1' : ''} /> : <ArrowDownToLine size={18} />}
                  {isGrid && <span>{isVideo ? "Tonton Video" : "Unduh File"}</span>}
                </button>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState title="Belum ada materi" description="Materi pembelajaran belum ditambahkan untuk mata kuliah ini." />
      )}
    </div>
  );
};

export default MateriList;
