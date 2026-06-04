import React from 'react';
import { BookOpen, MoreVertical } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course, onClick }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  // Extracting data or using defaults
  const title = course.nama || course.title || "Mata Kuliah";
  const completion = course.completion || Math.floor(Math.random() * 40) + 40; // Default random 40-80 if not provided
  const tags = course.tags || [course.kode || 'IF3110', '3 SKS'];
  const questions = course.questions || 12;
  const dosen = course.dosen || 'Budi Dosen, M.Kom';
  
  // Randomize illustration color schemes
  const colorSchemes = [
    { bg: 'bg-indigo-50', text: 'text-indigo-600', iconBg: 'bg-indigo-100', progress: 'bg-indigo-500' },
    { bg: 'bg-emerald-50', text: 'text-emerald-600', iconBg: 'bg-emerald-100', progress: 'bg-emerald-500' },
    { bg: 'bg-amber-50', text: 'text-amber-600', iconBg: 'bg-amber-100', progress: 'bg-amber-500' },
    { bg: 'bg-purple-50', text: 'text-purple-600', iconBg: 'bg-purple-100', progress: 'bg-purple-500' },
  ];
  const scheme = colorSchemes[(title.length) % colorSchemes.length];

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-[24px] border border-slate-200/60 p-4 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer group flex flex-col h-full relative"
    >
      {/* Header Image Area with Smooth Animations */}
      <div className={`w-full h-40 ${scheme.bg} rounded-[16px] relative overflow-hidden mb-5 flex items-center justify-center transition-colors duration-300`}>
        
        {user?.role === 'DOSEN' && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/matakuliah/${course.id}/info`);
            }}
            className="absolute top-3 right-3 z-20 p-2 bg-white/70 hover:bg-white backdrop-blur-sm rounded-full shadow-sm text-slate-600 transition-all duration-200"
          >
            <MoreVertical size={18} />
          </button>
        )}
        
        {/* Abstract Illustration Container */}
        <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
          {/* Decorative Circle */}
          <div className={`absolute -bottom-10 -left-6 w-32 h-32 ${scheme.iconBg} rounded-full opacity-60 group-hover:scale-110 transition-transform duration-700`}></div>
          
          {/* Floating Elements with layered hover effects */}
          <div className={`absolute top-6 right-12 w-16 h-12 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 transform rotate-12 flex items-center justify-center group-hover:rotate-6 group-hover:-translate-y-2 transition-all duration-500 ease-out`}>
            <span className={`font-medium text-lg ${scheme.text}`}>Aa</span>
          </div>
          
          <div className={`absolute bottom-6 right-8 w-14 h-14 ${scheme.iconBg} rounded-xl shadow-sm flex items-center justify-center -rotate-6 group-hover:-rotate-12 group-hover:-translate-y-1 transition-all duration-500 ease-out`}>
            <div className="w-6 h-6 border-2 border-white/80 rounded-md"></div>
          </div>
          
          {/* Subtle Background Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 pointer-events-none">
            <BookOpen size={80} className={scheme.text} />
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-medium text-[17px] leading-snug text-slate-800 mb-4 line-clamp-2 min-h-[48px] group-hover:text-primary transition-colors">
        {title}
      </h3>

      {/* Tags */}
      <div className="flex gap-2 mb-5">
        {tags.map((tag, i) => (
          <span key={i} className="bg-slate-100/80 border border-slate-200/60 text-slate-600 text-[11px] font-medium px-2.5 py-1 rounded-lg">
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-4 mt-auto border-t border-slate-100">
        <p className="text-[12px] font-medium text-slate-700">
          {dosen}
        </p>
      </div>
    </div>
  );
};

// Helper for tiny icon
const MessageSquareIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

export default CourseCard;
