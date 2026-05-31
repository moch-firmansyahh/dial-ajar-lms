import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const MainLayout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const location = useLocation();

  // Auto-collapse pada layar mobile & tutup otomatis saat pindah rute di mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarExpanded(false);
      } else {
        setIsSidebarExpanded(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Inisialisasi
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarExpanded(false);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans flex text-slate-800">
      
      {/* Mobile Backdrop */}
      {isSidebarExpanded && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarExpanded(false)}
        />
      )}

      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
      
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? 'md:ml-64 ml-0' : 'md:ml-20 ml-0'
        }`}
      >
        <Topbar onMenuClick={() => setIsSidebarExpanded(true)} />
        
        {/* Konten Utama */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
