import React from 'react';
import { MoreHorizontal, BookOpen } from 'lucide-react';

const LinearProgress = ({ percentage, colorClass }) => (
  <div className="w-full">
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-[12px] font-medium text-slate-700">Progres Belajar</span>
      <span className="text-[12px] font-medium text-slate-500">{percentage}%</span>
    </div>
    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
      <div 
        className={`h-2 rounded-full transition-all duration-1000 ease-out ${colorClass}`} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

const CourseCard = ({ course, onClick }) => {
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
      className="bg-white rounded-[24px] border border-slate-200/60 p-4 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer group flex flex-col h-full"
    >
      {/* Header Image Area with Smooth Animations */}
      <div className={`w-full h-40 ${scheme.bg} rounded-[16px] relative overflow-hidden mb-5 flex items-center justify-center transition-colors duration-300`}>
        
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

      {/* Progress Bar */}
      <div className="mb-5 mt-auto">
        <LinearProgress percentage={completion} colorClass={scheme.progress} />
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[12px] font-medium text-slate-700">
            {dosen}
          </p>
          <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
            <MessageSquareIcon size={12} /> {questions} Diskusi
          </p>
        </div>
        
        <button className="w-8 h-8 rounded-full border border-slate-200/80 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
          <MoreHorizontal size={16} />
        </button>
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
