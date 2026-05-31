import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  Home, BookOpen, CheckSquare, MessageSquare, Award,
  LogOut, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const { logout } = useAuthStore();
  const location = useLocation();

  const mainMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'Mata Kuliah', path: '/matakuliah' },
    { icon: CheckSquare, label: 'Tugas & Kuis', path: '/tugas' },
    { icon: MessageSquare, label: 'Forum', path: '/forum' },
    { icon: Award, label: 'Nilai', path: '/nilai' },
  ];

  // Cari index menu aktif untuk animasi pill. Jika tidak ada yang cocok, sembunyikan pill (-1)
  const activeIndex = mainMenuItems.findIndex(item => location.pathname.startsWith(item.path));

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-40 bg-[#F8F9FA] border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out ${
        isExpanded 
          ? 'w-64 translate-x-0' 
          : 'w-20 -translate-x-full md:translate-x-0'
      }`}
    >
      {/* Toggle Button (Floating on the border) */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-200 rounded-full hidden md:flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-50 shadow-sm transition-all z-40 cursor-pointer hover:scale-105"
        title={isExpanded ? 'Tutup Sidebar' : 'Buka Sidebar'}
      >
        {isExpanded ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
      </button>

      {/* Sidebar Header */}
      <div className="h-20 flex items-center border-b border-slate-200/50 overflow-hidden shrink-0">
        <div className="w-20 flex items-center justify-center shrink-0">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white font-medium text-lg shadow-sm">
            d;
          </div>
        </div>
        <span className={`font-medium text-slate-800 text-lg tracking-tight transition-all duration-300 ease-in-out whitespace-nowrap ${isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'}`}>
          Dial Ajar
        </span>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-6 px-3 relative flex flex-col overflow-hidden">
        
        {/* Animated Background Pill */}
        {activeIndex !== -1 && (
          <div 
            className="absolute left-3 right-3 h-[50px] bg-primary rounded-[14px] shadow-md transition-all duration-300 ease-in-out z-0"
            style={{ transform: `translateY(${activeIndex * 58}px)` }} // 50px height + 8px margin bottom
          />
        )}

        {mainMenuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) => `
              relative z-10 h-[50px] mb-2 flex items-center rounded-[14px] transition-colors duration-300 group overflow-hidden
              ${isActive ? 'text-white' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800'}
            `}
            title={!isExpanded ? item.label : ''}
          >
            <div className="w-[56px] h-full flex items-center justify-center shrink-0">
              <item.icon size={22} className="transition-colors duration-300" />
            </div>
            <span className={`font-semibold text-[15px] whitespace-nowrap transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'}`}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-200/50 flex flex-col overflow-hidden shrink-0">
        {/* Logout */}
        <button 
          onClick={logout} 
          className="flex items-center text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors font-semibold text-[15px] h-[50px] rounded-[14px] w-full overflow-hidden"
          title={!isExpanded ? "Keluar" : ""}
        >
          <div className="w-[56px] h-full flex items-center justify-center shrink-0">
            <LogOut size={22} />
          </div>
          <span className={`whitespace-nowrap transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'}`}>
            Keluar
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
