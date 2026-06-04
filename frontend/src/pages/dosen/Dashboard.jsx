import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMataKuliah } from "../../api/matakuliah.api";
import { useAuthStore } from "../../store/authStore";
import Card from "../../components/ui/Card";
import Skeleton from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";
import CourseCard from "../../components/ui/CourseCard";
import {
  BookOpen,
  Users,
  CheckSquare,
  Clock,
  ArrowRight,
  PlusCircle,
  UploadCloud,
  FilePlus,
  HelpCircle,
  Award,
  MessageSquare,
} from "lucide-react";

const DashboardDosen = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Nanti nilai ini akan diganti dengan state/data hasil fetch API backend (misal via useQuery)
  const dashboardStats = {
    kelasAktif: 3,
    totalMahasiswa: 120,
    tugasPerluDinilai: 45,
    kuisAktif: 2,
  };

  const stats = [
    {
      label: "Kelas Aktif",
      value: dashboardStats.kelasAktif,
      icon: BookOpen,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Total Mahasiswa",
      value: dashboardStats.totalMahasiswa,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Tugas Perlu Dinilai",
      value: dashboardStats.tugasPerluDinilai,
      icon: CheckSquare,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Kuis Aktif",
      value: dashboardStats.kuisAktif,
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const quickActions = [
    {
      label: "Buat Mata Kuliah",
      icon: PlusCircle,
      path: "/matakuliah/buat",
      color: "text-indigo-600",
      bg: "bg-indigo-50 border-indigo-100 hover:border-indigo-300",
    },
    {
      label: "Upload Modul",
      icon: UploadCloud,
      path: "/materi/upload-selector",
      color: "text-sky-600",
      bg: "bg-sky-50 border-sky-100 hover:border-sky-300",
    },
    {
      label: "Buat Tugas Baru",
      icon: FilePlus,
      path: "/tugas/buat-selector",
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-100 hover:border-amber-300",
    },
    {
      label: "Buat Kuis Baru",
      icon: HelpCircle,
      path: "/kuis/buat-selector",
      color: "text-purple-600",
      bg: "bg-purple-50 border-purple-100 hover:border-purple-300",
    },

    {
      label: "Buka Forum",
      icon: MessageSquare,
      path: "/forum/buat-selector",
      color: "text-pink-600",
      bg: "bg-pink-50 border-pink-100 hover:border-pink-300",
    },
    {
      label: "Mata Kuliah Saya",
      icon: BookOpen,
      path: "/matakuliah",
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-100 hover:border-blue-300",
    },
    {
      label: "Tugas Belum Dinilai",
      icon: CheckSquare,
      path: "/tugas",
      color: "text-orange-600",
      bg: "bg-orange-50 border-orange-100 hover:border-orange-300",
    },
  ];

  const { data: matkulData } = useQuery({
    queryKey: ["matakuliah"],
    queryFn: async () => {
      const res = await getMataKuliah(user.id, user.role);
      return res.data;
    },
  });

  const myCourses = (matkulData || []).slice(0, 3).map((mk) => ({
    id: mk.id,
    nama: mk.nama,
    kode: mk.kode,
    enrolled: ((mk.id * 17) % 30) + 10,
    accuracy: ((mk.id * 23) % 80) + 20,
    completion: ((mk.id * 31) % 60) + 40,
    tags: [],
    questions: ((mk.id * 7) % 20) + 5,
    edited: `Dosen: ${mk.dosen}`,
  }));

  // Efek klik yang super smooth (Ripple / Scale)
  const handleActionClick = (path) => {
    setTimeout(() => {
      navigate(path);
    }, 150);
  };

  const handleCourseClick = (id) => {
    navigate(`/matakuliah/${id}`);
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-10 animate-slideUpFade">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-medium text-slate-900 flex items-center gap-3 tracking-tight">
          Halo, {user?.nama || "Dosen"} 👋
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Ringkasan aktivitas mengajar Anda hari ini
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {isLoading
          ? Array(4)
              .fill(0)
              .map((_, idx) => (
                <Card
                  key={`skel-stat-${idx}`}
                  className="flex items-center gap-4 h-[104px]"
                >
                  <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
                  <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                </Card>
              ))
          : stats.map((stat, idx) => (
              <Card
                key={idx}
                className="relative overflow-hidden flex items-center gap-4 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 border border-slate-100 group"
              >
                {/* Decorative Background Watermark */}
                <div
                  className={`absolute -right-6 -bottom-6 opacity-[0.03] group-hover:scale-110 group-hover:-rotate-12 group-hover:opacity-[0.05] transition-all duration-500 text-slate-900 pointer-events-none`}
                >
                  <stat.icon size={120} />
                </div>

                <div
                  className={`relative z-10 w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-sm border border-white shrink-0`}
                >
                  <stat.icon size={26} />
                </div>
                <div className="relative z-10">
                  <p className="text-[12px] font-medium text-slate-400 uppercase tracking-widest mb-0.5">
                    {stat.label}
                  </p>
                  <h3 className="text-3xl font-medium text-slate-800 tracking-tight leading-none">
                    {stat.value}
                  </h3>
                </div>
              </Card>
            ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="mb-8">
        <h2 className="text-[17px] font-medium text-slate-800 mb-4 tracking-tight flex items-center gap-2">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleActionClick(action.path)}
              className={`group flex flex-col items-center justify-center p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 active:scale-95 active:shadow-sm ${action.bg}`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 ${action.color}`}
              >
                <action.icon size={24} />
              </div>
              <p className="text-[13px] font-medium text-slate-700 text-center leading-tight">
                {action.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* My Courses Area */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-medium text-slate-800 tracking-tight">
            Mata Kuliah Saya
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/matakuliah")}
            className="font-medium text-primary"
          >
            Lihat Semua <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={() => handleCourseClick(course.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardDosen;
