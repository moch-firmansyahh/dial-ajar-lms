import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { getDashboardMahasiswa } from '../../api/dashboard.api';
import Skeleton from '../../components/ui/Skeleton';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { BookOpen, Clock, FileText, Trophy, ArrowRight, ArrowUpDown } from 'lucide-react';

const DashboardMahasiswa = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [filterType, setFilterType] = useState('semua'); // 'semua', 'tugas', 'kuis'
  const [sortBy, setSortBy] = useState('terdekat'); // 'terdekat', 'terlama'

  const { data: dashboardData, isLoading: queryLoading } = useQuery({
    queryKey: ['dashboard', user?.id],
    queryFn: async () => {
      return await getDashboardMahasiswa(user.id);
    },
    enabled: !!user?.id
  });

  const isLoading = queryLoading;

  const dashboardStats = dashboardData || {
    mataKuliah: 0,
    tugasMendatang: 0,
    kuisMendatang: 0,
    deadlines: []
  };

  const stats = [
    { label: 'Mata Kuliah', value: dashboardStats.mataKuliah, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Tugas Mendatang', value: dashboardStats.tugasMendatang, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Kuis Mendatang', value: dashboardStats.kuisMendatang, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const deadlines = dashboardStats.deadlines || [];

  // Logic Filter & Sort
  const filteredDeadlines = deadlines
    .filter(item => filterType === 'semua' || item.type.toLowerCase() === filterType)
    .sort((a, b) => {
      // Sort by date (time field has the ISO string from backend)
      const dateA = new Date(a.time).getTime();
      const dateB = new Date(b.time).getTime();
      if (sortBy === 'terdekat') return dateA - dateB;
      return dateB - dateA;
    });

  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {isLoading 
          ? Array(3).fill(0).map((_, idx) => (
              <Card key={`skel-stat-${idx}`} className="flex items-center gap-4 h-[104px]">
                <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </Card>
            ))
          : stats.map((stat, idx) => (
          <Card key={idx} className="relative overflow-hidden flex items-center gap-4 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 border border-slate-100 group">
            {/* Decorative Background Watermark */}
            <div className={`absolute -right-6 -bottom-6 opacity-[0.03] group-hover:scale-110 group-hover:-rotate-12 group-hover:opacity-[0.05] transition-all duration-500 text-slate-900 pointer-events-none`}>
              <stat.icon size={120} />
            </div>

            <div className={`relative z-10 w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner ring-4 ring-white`}>
              <stat.icon size={26} />
            </div>
            <div className="relative z-10">
              <p className="text-slate-500 text-sm font-medium mb-0.5">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                {stat.value}
              </h3>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Area - Full width */}
      <div>
        {/* Header Seksi Tenggat dengan Filter Bar yang Elegan */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-medium text-slate-800 tracking-tight">Tenggat Mendatang</h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Filter Pills with Gliding Animation */}
            <div className="relative flex p-1 bg-slate-100 rounded-xl border border-slate-200/60 w-full sm:w-auto min-w-[240px]">
              {/* Gliding Background Pill */}
              <div 
                className="absolute top-1 bottom-1 w-[calc(33.333%-2.66px)] bg-white rounded-lg shadow-sm border border-slate-200/50 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{ 
                  transform: `translateX(${['semua', 'tugas', 'kuis'].indexOf(filterType) * 100}%)` 
                }}
              />
              
              {['semua', 'tugas', 'kuis'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`relative z-10 flex-1 px-4 py-2 text-[13px] font-medium rounded-lg transition-colors duration-300 capitalize ${
                    filterType === type 
                      ? 'text-primary' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortBy(sortBy === 'terdekat' ? 'terlama' : 'terdekat')}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors shadow-sm w-full sm:w-auto"
            >
              <ArrowUpDown size={16} />
              {sortBy === 'terdekat' ? 'Terdekat' : 'Terlama'}
            </button>
          </div>
        </div>

        {/* List Tenggat with Animation */}
        <style>{`
          @keyframes slideUpFade {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-up-fade {
            animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>

        <div key={filterType + sortBy} className="space-y-4 animate-slide-up-fade">
          {isLoading ? (
            Array(3).fill(0).map((_, idx) => (
              <Card key={`skel-task-${idx}`} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex flex-col sm:items-end gap-2 shrink-0 w-full sm:w-32">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>
              </Card>
            ))
          ) : filteredDeadlines.length > 0 ? (
            filteredDeadlines.map((item) => (
              <Card key={item.id} className="relative overflow-hidden group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300 border border-slate-100">
                
                {/* Colored left accent line based on urgency */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 ${
                  item.urgency === 'bahaya' ? 'bg-red-500 group-hover:bg-red-600' : 
                  item.urgency === 'peringatan' ? 'bg-amber-400 group-hover:bg-amber-500' : 
                  'bg-emerald-400 group-hover:bg-emerald-500'
                }`} />

                <div className="flex items-start gap-4 pl-3">
                  <div className={`mt-1 p-3 rounded-2xl shadow-sm border-2 border-white flex items-center justify-center ${
                    item.type === 'tugas' ? 'bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600' : 'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600'
                  }`}>
                    {item.type === 'tugas' ? <FileText size={22} /> : <Clock size={22} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge type={item.urgency} label={new Date(item.time).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })} />
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full">
                        {item.type}
                      </span>
                    </div>
                    <h3 className="font-medium text-slate-800 text-[16px] group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-[13px] font-medium text-slate-500 mt-1">{item.matkul}</p>
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate(`/tugas/${item.courseId}/${item.id}`)} 
                  className="w-full sm:w-auto shrink-0 font-medium hover:!bg-primary hover:!text-white hover:!border-primary shadow-sm transition-all"
                >
                  Kerjakan <ArrowRight size={16} />
                </Button>
              </Card>
            ))
          ) : (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-100 border-dashed">
              <p className="text-slate-500 font-medium">Tidak ada tenggat yang sesuai dengan filter Anda.</p>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default DashboardMahasiswa;
