import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { getForumByMatkul, createForum } from '../../api/forum.api';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/shared/EmptyState';
import { MessageSquare, Plus, ArrowRight, LayoutGrid, List as ListIcon, HelpCircle, Megaphone, Share2, X, Send } from 'lucide-react';

const ForumList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isDosen = user?.role === 'DOSEN';

  // State for view mode
  const [viewMode, setViewModeState] = useState(() => {
    return localStorage.getItem('forumViewMode') || 'list';
  });

  const setViewMode = (mode) => {
    setViewModeState(mode);
    localStorage.setItem('forumViewMode', mode);
  };

  // State for create modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const { data: forumsData, isLoading: queryLoading, refetch } = useQuery({
    queryKey: ['forumByMatkul', id],
    queryFn: async () => {
      const res = await getForumByMatkul(id);
      return res.data;
    }
  });

  const forums = forumsData || [];
  const isLoading = queryLoading;

  const handleCreateForum = async () => {
    if (!newTitle.trim()) return;
    try {
      await createForum(id, user.id, { judul: newTitle, content: newContent });
      setShowCreateModal(false);
      setNewTitle('');
      setNewContent('');
      refetch(); // Reload data
    } catch (e) {
      console.error(e);
      alert('Gagal membuat diskusi');
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
      `}</style>

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        {/* Toggle View Buttons */}
        <div className="flex items-center bg-white border border-slate-200/80 rounded-xl p-1 shadow-sm w-full sm:w-auto">
          <div className="relative flex w-full">
            <div 
              className={`absolute top-0 bottom-0 w-1/2 bg-slate-100 rounded-lg transition-transform duration-300 ease-in-out ${viewMode === 'grid' ? 'translate-x-0' : 'translate-x-full'}`}
            />
            <button 
              onClick={() => setViewMode('grid')} 
              className={`relative z-10 flex-1 flex justify-center p-1.5 rounded-lg transition-colors duration-300 ${viewMode === 'grid' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
              title="Tampilan Kotak (Grid)"
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')} 
              className={`relative z-10 flex-1 flex justify-center p-1.5 rounded-lg transition-colors duration-300 ${viewMode === 'list' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
              title="Tampilan Memanjang (List)"
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>

        <Button onClick={() => setShowCreateModal(true)} className="shadow-md hover:scale-105 transition-transform w-full sm:w-auto font-semibold px-6 py-2.5 text-[14px]">
          <Plus size={18} className="mr-2" /> Buat Diskusi Baru
        </Button>
      </div>

      {/* List Area */}
      {isLoading ? (
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'flex flex-col space-y-4'}`}>
          {Array(4).fill(0).map((_, i) => (
            <Card key={`skel-forum-${i}`} className={`p-5 flex ${viewMode === 'grid' ? 'flex-col gap-5 h-[200px]' : 'flex-row items-center gap-4'}`}>
              <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-3 w-full">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              {viewMode === 'grid' ? (
                <Skeleton className="h-10 w-full rounded-xl mt-auto" />
              ) : (
                <Skeleton className="w-24 h-11 rounded-full shrink-0" />
              )}
            </Card>
          ))}
        </div>
      ) : forums.length > 0 ? (
        <div key={viewMode} className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'flex flex-col space-y-4'}`}>
          {forums.map((forum, idx) => {
            const isGrid = viewMode === 'grid';

            return (
              <Card 
                key={forum.id} 
                onClick={() => navigate(`/forum/${id}/${forum.id}`)}
                className={`relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-slate-200/60 p-5 animate-slide-up-fade cursor-pointer
                  flex ${isGrid ? 'flex-col gap-5 items-start' : 'flex-col sm:flex-row justify-between items-start sm:items-center gap-4'}
                `}
                style={{ animationDelay: `${idx * 70}ms` }}
              >
                {/* Subtle hover background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {/* Giant Watermark Icon */}
                <div className={`absolute ${isGrid ? '-right-4 -bottom-6' : '-right-6 -bottom-10'} text-primary opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none`}>
                  <MessageSquare size={isGrid ? 120 : 150} />
                </div>
                
                <div className={`flex gap-4 relative z-10 w-full ${isGrid ? 'flex-col items-start' : 'items-start sm:items-center sm:w-auto'}`}>
                  {/* Icon Container with bouncy hover */}
                  <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 p-3.5 rounded-2xl text-primary group-hover:scale-110 group-hover:shadow-sm group-hover:-rotate-3 transition-all duration-300 shrink-0 border border-blue-100/60`}>
                    <MessageSquare size={24} className="transition-colors" />
                  </div>
                  
                  <div className="flex-1 w-full pr-2">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-[16px] text-slate-800 group-hover:text-primary transition-colors tracking-tight line-clamp-2">
                        {forum.title}
                      </h3>
                      {forum.isNew && (
                        <span className="shrink-0 flex items-center justify-center bg-blue-100 text-blue-600 text-[9px] font-medium uppercase px-1.5 py-0.5 rounded-md animate-pulse">
                          Baru
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[12px] font-medium text-slate-500">
                        {forum.author}
                      </span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className="text-[11px] font-medium text-slate-400">
                        {forum.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info & Arrow Button for Entry */}
                <div 
                  className={`relative z-10 flex items-center justify-center gap-3 bg-slate-50 group-hover:bg-primary text-slate-500 group-hover:text-white border border-slate-200 group-hover:border-primary transition-all duration-300 shadow-sm shrink-0 group-hover:shadow-primary/20
                    ${isGrid ? 'w-full py-2.5 rounded-xl font-medium mt-auto text-[13px]' : 'px-4 py-2 h-11 rounded-full'}
                  `}
                >
                  <div className="flex items-center gap-1.5 font-medium">
                    <MessageSquare size={16} />
                    <span>{forum.replies}</span>
                  </div>
                  <div className="w-[1px] h-4 bg-slate-300 group-hover:bg-white/30" />
                  <ArrowRight size={18} />
                  {isGrid && <span>Buka Diskusi</span>}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState title="Belum ada diskusi" description="Belum ada topik diskusi di forum ini." icon={MessageSquare} />
      )}

      {/* Modal Buat Diskusi Baru */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowCreateModal(false)} />
          
          <div className="bg-white rounded-2xl w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare size={20} className="text-primary" />
                Buat Diskusi Baru
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Judul Diskusi</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl p-3.5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-slate-700" 
                    placeholder="Contoh: Pertanyaan seputar instalasi Vite..." 
                  />
                </div>



                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Isi Diskusi</label>
                  <textarea 
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl p-4 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all min-h-[120px] resize-none text-slate-700 font-medium text-[14px]" 
                    placeholder="Jelaskan topik diskusi Anda secara detail..." 
                  />
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>Batal</Button>
              <Button onClick={handleCreateForum} className="px-6 shadow-md shadow-primary/20" disabled={!newTitle.trim()}>
                Kirim Topik <Send size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ForumList;
