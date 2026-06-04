import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMataKuliahById, getCourseStudents } from '../../api/matakuliah.api';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import { Users, KeyRound, UserCircle } from 'lucide-react';

const CourseInfo = () => {
  const { id } = useParams();

  const { data: course, isLoading: loadingCourse } = useQuery({
    queryKey: ['matakuliah', id],
    queryFn: async () => {
      const res = await getMataKuliahById(id);
      return res.data;
    }
  });

  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ['course-students', id],
    queryFn: async () => {
      return await getCourseStudents(id);
    }
  });

  const isLoading = loadingCourse || loadingStudents;

  return (
    <div className="max-w-[1000px] mx-auto pb-10">
      {isLoading ? (
        <div className="animate-slide-up-fade">
          <div className="mb-6 flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-40 w-full rounded-2xl mb-6" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="animate-slide-up-fade">
          <PageHeader title="Informasi Kelas" showBack={true} backTo="/dashboard" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Class Info Card */}
            <Card className="md:col-span-2 flex flex-col justify-center p-6 bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">{course?.nama}</h2>
              <p className="text-slate-500 font-medium flex items-center gap-2">
                <UserCircle size={18} /> Dosen: {course?.dosen}
              </p>
            </Card>

            {/* Class Code Card */}
            <Card className="flex flex-col items-center justify-center p-6 text-center border-emerald-100 bg-emerald-50/30">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                <KeyRound size={24} />
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Kode Gabung Kelas</p>
              <h3 className="text-3xl font-bold tracking-widest text-emerald-600">{course?.kodeKelas || "---"}</h3>
            </Card>
          </div>

          {/* Students List */}
          <Card className="p-0 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Users size={18} className="text-primary" /> Daftar Mahasiswa
              </h3>
              <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-md">
                {students?.length || 0} Orang
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="p-4 w-16 text-center">No</th>
                    <th className="p-4">Nomor Induk</th>
                    <th className="p-4">Nama Mahasiswa</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {students && students.length > 0 ? (
                    students.map((student, idx) => (
                      <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                        <td className="p-4 font-medium text-slate-700">{student.nomorInduk}</td>
                        <td className="p-4 text-slate-700">{student.nama}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-8 text-center text-slate-500 font-medium bg-slate-50/30">
                        Belum ada mahasiswa yang bergabung di kelas ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CourseInfo;
