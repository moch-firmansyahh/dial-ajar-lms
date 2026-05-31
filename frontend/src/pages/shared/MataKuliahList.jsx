import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMataKuliah } from '../../api/matakuliah.api';
import { useAuthStore } from '../../store/authStore';
import Skeleton from '../../components/ui/Skeleton';
import Card from '../../components/ui/Card';
import CourseCard from '../../components/ui/CourseCard';
import Button from '../../components/ui/Button';
import { Plus, Search, LayoutGrid, List } from 'lucide-react';

const MataKuliahList = ({ selectMode = false, title = "Mata Kuliah", subtitle = "Daftar mata kuliah yang tersedia", onSelect }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isDosen = user?.role === 'DOSEN';
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const { data: matkulData } = useQuery({
    queryKey: ['matakuliah'],
    queryFn: async () => {
      const res = await getMataKuliah();
      return res.data;
    }
  });

  // Dummy mapping to match screenshot card data needs (deterministic to avoid render errors)
  const courses = (matkulData || []).map(mk => ({
    id: mk.id,
    nama: mk.nama,
    kode: mk.kode,
    enrolled: ((mk.id * 17) % 30) + 10,
    accuracy: ((mk.id * 23) % 80) + 20,
    completion: ((mk.id * 31) % 60) + 40,
    tags: [],
    questions: ((mk.id * 7) % 20) + 5,
    edited: `Dosen: ${mk.dosen}`
  }));

  const filtered = courses.filter(c => c.nama.toLowerCase().includes(searchQuery.toLowerCase()) || c.kode.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleCardClick = (courseId) => {
    if (selectMode && onSelect) {
      onSelect(courseId);
    } else {
      navigate(`/matakuliah/${courseId}`);
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-10">
      
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          {/* Grid / List Toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm shrink-0">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-slate-100 text-primary' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid size={16} /></button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-slate-100 text-primary' : 'text-slate-400 hover:text-slate-600'}`}><List size={16} /></button>
          </div>
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari mata kuliah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* Buat Mata Kuliah */}
        {!selectMode && isDosen && (
          <div className="shrink-0 w-full sm:w-auto">
            <Button onClick={() => navigate('/matakuliah/buat')} className="w-full sm:w-auto flex items-center justify-center gap-2">
              <Plus size={16} /> Buat Mata Kuliah
            </Button>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={`skel-course-${i}`} className={`p-0 overflow-hidden flex ${viewMode === 'grid' ? 'flex-col h-[280px]' : 'flex-row h-[120px]'}`}>
              <Skeleton className={`${viewMode === 'grid' ? 'h-32 w-full' : 'w-40 h-full'} rounded-none`} />
              <div className="p-5 flex flex-col gap-3 flex-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="mt-auto flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </Card>
          ))
        ) : (
          filtered.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onClick={() => handleCardClick(course.id)} 
            />
          ))
        )}
      </div>

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">Tidak ada mata kuliah yang ditemukan.</p>
        </div>
      )}
    </div>
  );
};

export default MataKuliahList;
