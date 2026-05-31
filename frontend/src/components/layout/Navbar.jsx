import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10">
      {/* Search Bar */}
      <div className="relative w-80">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Cari mata kuliah, tugas, kuis..."
          className="w-full pl-10 pr-4 py-2 bg-slate-100/80 border border-transparent rounded-xl text-sm placeholder:text-slate-400 hover:bg-slate-100 focus:bg-white focus:border-slate-300 transition-all"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <button 
          onClick={() => navigate('/notifikasi')}
          className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl relative transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>
        
        {/* User avatar */}
        <div className="flex items-center gap-3 ml-2 pl-3 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">{user?.nama || 'User'}</p>
            <p className="text-[11px] text-slate-400">{user?.role === 'DOSEN' ? 'Dosen' : 'Mahasiswa'}</p>
          </div>
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center text-white text-xs font-medium shadow-sm">
            {user?.nama?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
