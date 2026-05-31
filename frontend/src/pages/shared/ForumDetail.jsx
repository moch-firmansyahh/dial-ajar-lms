import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import { useAuthStore } from '../../store/authStore';
import { MessageSquare, ArrowLeft, Send, CornerDownRight, Heart, MoreHorizontal, Clock, Megaphone } from 'lucide-react';

const ForumDetail = () => {
  const { id, forumId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const thread = {
    title: 'Diskusi Pertemuan 1: Pengenalan Dasar React',
    author: 'Budi Dosen, M.Kom',
    role: 'DOSEN',
    date: '10 Jun 2026, 08:30',
    date: '10 Jun 2026, 08:30',
    content: 'Selamat pagi semuanya! Silakan diskusikan materi yang sudah kita bahas pada pertemuan pertama mengenai pengenalan ekosistem React. \n\nApa yang paling menarik dari React menurut kalian? Dan apa tantangan terbesar yang kalian rasakan saat pertama kali mencoba menggunakan JSX?',
  };

  const dummyReplies = [
    { 
      id: 1, 
      author: 'Andi Mahasiswa', 
      role: 'MAHASISWA',
      date: '10 Jun 2026, 15:30', 
      content: 'Menurut saya React sangat menarik karena konsep component-based nya Pak. Kita bisa bikin UI seperti lego. Tantangannya mungkin memahami JSX di awal karena agak aneh melihat HTML di dalam Javascript.',
      likes: 12,
      isLiked: true,
      replies: [
        {
          id: 101,
          author: 'Budi Dosen, M.Kom',
          role: 'DOSEN',
          date: '10 Jun 2026, 16:15',
          content: 'Tepat sekali Andi! Konsep lego itu analogi yang sangat pas. Untuk JSX, nanti lama-lama akan terbiasa karena sebenarnya sangat membantu proses development.',
          likes: 5,
          isLiked: false
        }
      ]
    },
    { 
      id: 2, 
      author: 'Cici Liana', 
      role: 'MAHASISWA',
      date: '11 Jun 2026, 09:00', 
      content: 'Saya paling suka React Hooks Pak, terutama useState dan useEffect. Awalnya cukup membingungkan untuk mengatur life-cycle, tapi setelah dicoba ternyata sangat powerful!',
      likes: 8,
      isLiked: false,
      replies: []
    },
  ];

  const [replies, setReplies] = useState(dummyReplies);
  const [activeReply, setActiveReply] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [subReplyText, setSubReplyText] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const getAvatarColor = (name) => {
    const colors = ['from-blue-400 to-indigo-500', 'from-emerald-400 to-teal-500', 'from-rose-400 to-red-500', 'from-amber-400 to-orange-500', 'from-violet-400 to-purple-500'];
    const index = name.length % colors.length;
    return colors[index];
  };

  const handleMainReply = () => {
    if (!commentText.trim()) return;
    const newReply = {
      id: Date.now(),
      author: user?.nama || 'Pengguna',
      role: user?.role || 'MAHASISWA',
      date: new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) + ', ' + new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}),
      content: commentText,
      replies: []
    };
    setReplies([...replies, newReply]);
    setCommentText('');
  };

  const handleSubReply = (parentId) => {
    if (!subReplyText.trim()) return;
    const newSub = {
      id: Date.now(),
      author: user?.nama || 'Pengguna',
      role: user?.role || 'MAHASISWA',
      date: new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) + ', ' + new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}),
      content: subReplyText,
    };
    setReplies(replies.map(r => r.id === parentId ? {...r, replies: [...(r.replies||[]), newSub]} : r));
    setSubReplyText('');
    setActiveReply(null);
  };

  const renderComment = (reply, isSubReply = false, parentId = null) => (
    <div key={reply.id} className={`flex gap-3 sm:gap-4 ${isSubReply ? 'mt-4' : 'mb-6'}`}>
      {/* Avatar */}
      <div className={`shrink-0 flex items-center justify-center font-medium text-white shadow-sm rounded-full bg-gradient-to-br ${getAvatarColor(reply.author)}
        ${isSubReply ? 'w-8 h-8 text-[11px]' : 'w-10 h-10 text-[13px]'}
      `}>
        {reply.author.split(' ').map(n => n[0]).join('').substring(0, 2)}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <div className={`bg-white border border-slate-200/80 rounded-2xl rounded-tl-sm p-4 sm:p-5 shadow-sm transition-all hover:shadow-md hover:border-slate-300 ${reply.role === 'DOSEN' ? 'bg-blue-50/30 border-blue-100/80' : ''}`}>
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[14px] text-slate-800">{reply.author}</span>
              {reply.role === 'DOSEN' && (
                <span className="bg-blue-100 text-blue-600 text-[9px] font-medium uppercase px-1.5 py-0.5 rounded-md">Dosen</span>
              )}
              <span className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block" />
              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                <Clock size={12} /> {reply.date}
              </span>
            </div>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>

          {/* Body */}
          <p className="text-[14px] text-slate-600 leading-relaxed mb-4">
            {reply.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {!isSubReply && (
              <button 
                onClick={() => {
                  setActiveReply(activeReply === reply.id ? null : reply.id);
                  setSubReplyText('');
                }}
                className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 hover:text-primary transition-colors"
              >
                <CornerDownRight size={14} />
                <span>Balas Komentar</span>
              </button>
            )}
          </div>
        </div>

        {/* Inline Reply Input */}
        {activeReply === reply.id && !isSubReply && (
          <div className="mt-3 flex gap-3 animate-slide-up-fade">
            <div className="w-8 shrink-0" />
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={subReplyText}
                onChange={(e) => setSubReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubReply(reply.id)}
                placeholder={`Balas ${reply.author}...`}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                autoFocus
              />
              <button onClick={() => handleSubReply(reply.id)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors shadow-sm">
                <Send size={14} className="ml-0.5" />
              </button>
            </div>
          </div>
        )}

        {/* Render Sub-replies */}
        {reply.replies && reply.replies.length > 0 && !isSubReply && (
          <div className="mt-2 pl-4 sm:pl-6 border-l-2 border-slate-100">
            {reply.replies.map(sub => renderComment(sub, true, reply.id))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-[900px] mx-auto pb-24">
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up-fade {
          animation: slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Back Button */}
      <button onClick={() => navigate(`/forum/${id}`)} className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-primary mb-6 transition-colors group">
        <div className="p-1.5 bg-white border border-slate-200 rounded-lg group-hover:border-primary group-hover:bg-primary/5 transition-all">
          <ArrowLeft size={16} />
        </div>
        Kembali ke Daftar Diskusi
      </button>

      {isLoading ? (
        <div className="animate-slide-up-fade">
          <Skeleton className="h-48 w-full rounded-2xl mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        </div>
      ) : (
        <div className="animate-slide-up-fade">
          <Card className="mb-8 relative overflow-hidden border-slate-200/80 shadow-sm p-6 sm:p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl transform translate-x-20 -translate-y-20 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[12px] font-medium text-slate-500 flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                  <Clock size={14} /> {thread.date}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-6 leading-tight">
                {thread.title}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${getAvatarColor(thread.author)} flex items-center justify-center text-white font-medium text-[15px] shadow-sm`}>
                  {thread.author.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-[15px] text-slate-800 leading-none mb-1.5">{thread.author}</p>
                  <p className="text-[12px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md inline-block">
                    {thread.role === 'DOSEN' ? 'Dosen Pengampu' : 'Mahasiswa'}
                  </p>
                </div>
              </div>

              <div className="prose prose-slate max-w-none mb-6">
                <p className="text-[15px] sm:text-[16px] text-slate-700 leading-relaxed whitespace-pre-line">
                  {thread.content}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-5 mt-2 flex items-center">
                <button 
                  onClick={() => setActiveReply(activeReply === 'main' ? null : 'main')}
                  className="flex items-center gap-2 text-[13px] font-semibold text-primary hover:text-primary-hover bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-xl transition-all"
                >
                  <CornerDownRight size={16} />
                  {activeReply === 'main' ? 'Batal Membalas' : 'Balas Topik Ini'}
                </button>
              </div>

              {activeReply === 'main' && (
                <div className="mt-5 flex gap-3 items-center animate-slide-up-fade">
                  <input 
                    type="text"
                    autoFocus
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleMainReply();
                        setActiveReply(null);
                      }
                    }}
                    placeholder="Tulis balasan Anda untuk topik ini..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <button onClick={() => { handleMainReply(); setActiveReply(null); }} className="p-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors shadow-sm">
                    <Send size={18} className="ml-0.5" />
                  </button>
                </div>
              )}
            </div>
          </Card>

          <div className="mb-6 flex items-center gap-2">
            <h2 className="text-[18px] font-semibold text-slate-800">Balasan Diskusi</h2>
            <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-[13px] font-medium">{replies.length + replies.reduce((acc, curr) => acc + (curr.replies?.length || 0), 0)}</span>
          </div>

          <div className="space-y-4">
            {replies.map(reply => renderComment(reply))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumDetail;
