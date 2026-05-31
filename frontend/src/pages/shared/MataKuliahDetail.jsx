import React from 'react';
import { useParams, NavLink, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMataKuliahById } from '../../api/matakuliah.api';
import PageHeader from '../../components/shared/PageHeader';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';
import { BookOpen, Video } from 'lucide-react';

const MataKuliahDetail = () => {
  const { id } = useParams();

  const { data: matkul, isLoading, isError } = useQuery({
    queryKey: ['matakuliah', id],
    queryFn: async () => {
      const res = await getMataKuliahById(id);
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto pb-10">
        <div className="mb-6 flex flex-col gap-2">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="flex gap-6 border-b border-slate-200 mb-6 px-1">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-6 w-24 mb-2" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }
  if (isError || !matkul) return <div className="text-red-500 p-4">Gagal memuat mata kuliah.</div>;

  // Hanya menampilkan Materi sesuai permintaan terbaru
  const tabs = [
    { id: 'materi', label: 'Materi Pembelajaran', icon: BookOpen },
  ];

  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      <PageHeader title={matkul.nama} />
      
      {/* Tab Navigation */}
      <div className="flex gap-6 border-b border-slate-200 mb-6 px-1">
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.id}
            className={({ isActive }) => `
              flex items-center gap-2 pb-3 text-[14px] font-medium transition-all relative group
              ${isActive ? 'text-primary' : 'text-slate-500 hover:text-primary'}
            `}
          >
            {({ isActive }) => (
              <>
                <tab.icon size={18} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                {tab.label}
                
                {/* Smooth Animated Underline */}
                <div 
                  className={`absolute -bottom-[1px] left-0 w-full h-0.5 bg-primary rounded-t-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] origin-left
                    ${isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
                  `}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
      
      {/* Content Area */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MataKuliahDetail;
