import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Bell, Calendar, Menu, CheckCircle } from 'lucide-react';

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Tugas "PBO Java" ditambahkan', time: '5 mnt lalu', unread: true },
    { id: 2, text: 'Nilai Kuis 1 sudah keluar', time: '1 jam lalu', unread: true },
    { id: 3, text: 'Dosen membalas diskusi Anda', time: '3 jam lalu', unread: false },
  ]);
  
  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, unread: false } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, unread: false })));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tentukan judul halaman secara dinamis berdasarkan path
  const getPageTitle = () => {
    const path = location.pathname.toLowerCase();
    
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/matakuliah')) return 'Mata Kuliah';
    if (path.startsWith('/tugas')) return 'Tugas';
    if (path.startsWith('/forum')) return 'Forum Diskusi';
    if (path.startsWith('/nilai')) return 'Nilai Akademik';
    if (path.startsWith('/kalender')) return 'Kalender';
    if (path.startsWith('/profile')) return 'Profil Saya';
    
    // Default fallback
    return 'Dial Ajar';
  };

  const title = getPageTitle();

  return (
    <div className="sticky top-0 z-40 h-16 md:h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between px-3 md:px-8 shrink-0">
      
      {/* Kiri: Mobile Menu Button & Page Title */}
      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-1.5 text-slate-500 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
        >
          <Menu size={22} />
        </button>
        
        {/* Page Title */}
        {title && (
          <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight line-clamp-1 ml-1 md:ml-0">
            {title}
          </h1>
        )}
      </div>

      {/* Kanan: Actions & Profile */}
      <div className="flex items-center gap-3 md:gap-6 ml-2 shrink-0">
        
        {/* Quick Actions */}
        <div className="flex items-center gap-1 md:gap-4 border-r border-slate-200 pr-3 md:pr-6">
          <button 
            onClick={() => navigate('/kalender')}
            className="p-1.5 md:p-2 text-slate-500 hover:text-primary hover:bg-primary/5 rounded-full transition-colors relative"
            title="Kalender"
          >
            <Calendar size={20} className="md:w-[22px] md:h-[22px]" />
          </button>
          
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-1.5 md:p-2 rounded-full transition-colors relative ${showNotifications ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-primary hover:bg-primary/5'}`}
              title="Notifikasi"
            >
              <Bell size={20} className="md:w-[22px] md:h-[22px]" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1.5 md:top-1.5 md:right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-semibold text-slate-800">Notifikasi</h3>
                  <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-[11px] font-medium text-slate-500 hover:text-primary transition-colors">
                        Tandai semua dibaca
                      </button>
                    )}
                    <button onClick={() => setShowNotifications(false)} className="text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors">Tutup</button>
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map(notif => (
                    <div key={notif.id} className={`px-4 py-3 border-b border-slate-50 transition-colors flex items-start gap-3 ${notif.unread ? 'bg-blue-50/30' : 'hover:bg-slate-50'}`}>
                      <div className="mt-1">
                        <CheckCircle size={16} className={notif.unread ? 'text-primary' : 'text-slate-300'} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${notif.unread ? 'font-medium text-slate-800' : 'text-slate-600'}`}>{notif.text}</p>
                        <p className="text-[11px] text-slate-400 mt-1">{notif.time}</p>
                      </div>
                      {notif.unread && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notif.id);
                          }}
                          className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-400 hover:text-emerald-500 hover:border-emerald-200 hover:bg-emerald-50 transition-all shadow-sm shrink-0"
                          title="Tandai sudah dibaca"
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile */}
        <div onClick={() => { navigate('/profile'); if(window.innerWidth < 768 && onMenuClick) onMenuClick(); }} className="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="hidden md:block text-right">
            <p className="font-medium text-[15px] text-slate-800 leading-tight">{user?.nama || 'User'}</p>
            <p className="text-[13px] text-slate-500 capitalize leading-tight">{user?.role?.toLowerCase() || 'Role'}</p>
          </div>
          <div className="w-9 h-9 md:w-11 md:h-11 bg-[#FCE588] text-slate-800 rounded-xl flex items-center justify-center font-medium text-[13px] md:text-sm shrink-0 shadow-sm border border-amber-200/50">
            {user?.nama?.substring(0, 2).toUpperCase() || 'RF'}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Topbar;
