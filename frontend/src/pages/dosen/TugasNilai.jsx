import React from 'react';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Download, Users, CheckCircle, Clock, Save, FileBox, Edit3, X, Eye } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSubmissionsByTugas, getSubmissionsByKuis, gradeTugas, getSoalKuis, getTugasDetail } from '../../api/tugas.api';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const TugasNilai = () => {
  const { id, tugasId } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  const { data: tugasDetailRes } = useQuery({
    queryKey: ['tugasDetail', tugasId],
    queryFn: () => getTugasDetail(id, tugasId, user?.id),
    enabled: !!tugasId
  });
  const tugasDetail = tugasDetailRes?.data || null;

  const { data: submissionsRes, isLoading, refetch } = useQuery({
    queryKey: ['submissions', tugasId, tugasDetail?.tipe],
    queryFn: () => {
      if (tugasDetail?.type === 'kuis') {
        return getSubmissionsByKuis(tugasId);
      }
      return getSubmissionsByTugas(tugasId);
    },
    enabled: !!tugasId && !!tugasDetail
  });

  const { data: soalRes } = useQuery({
    queryKey: ['soalKuis', tugasId],
    queryFn: () => getSoalKuis(tugasId),
    enabled: !!tugasId
  });
  
  const soalList = soalRes?.data || [];
  const isKuis = tugasDetail?.type === 'kuis';
  const pgSoalList = soalList.filter(s => s.tipe === 'PILIHAN_GANDA');
  const essaySoalList = soalList.filter(s => s.tipe !== 'PILIHAN_GANDA');

  const taskSubmissions = submissionsRes?.data || [];
  const [grades, setGrades] = React.useState({});
  const [editingGrade, setEditingGrade] = React.useState({});
  
  // State for Kuis Answer Modal
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [studentAnswers, setStudentAnswers] = React.useState({});
  const [essayScore, setEssayScore] = React.useState('');
  const [pgScore, setPgScore] = React.useState(0);
  
  // Custom Notification State
  const [notification, setNotification] = React.useState({ show: false, message: '' });



  const showToast = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  const handleGradeChange = (nim, value) => {
    if (value === '') {
      setGrades(prev => ({ ...prev, [nim]: '' }));
      return;
    }
    let numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;
    if (numValue < 0) numValue = 0;
    if (numValue > 100) numValue = 100;
    
    setGrades(prev => ({ ...prev, [nim]: numValue.toString() }));
  };

  const handleSaveGrade = async (nim, subId) => {
    if (grades[nim]) {
      try {
        await gradeTugas(subId, grades[nim]);
        setEditingGrade(prev => ({ ...prev, [nim]: false }));
        showToast('Nilai berhasil disimpan!');
        refetch();
      } catch (err) {
        showToast('Gagal menyimpan nilai');
      }
    }
  };

  const handleEditGrade = (nim, currentGrade) => {
    setGrades(prev => ({ ...prev, [nim]: currentGrade }));
    setEditingGrade(prev => ({ ...prev, [nim]: true }));
  };

  const handleDownload = (fileUrl) => {
    if (fileUrl) {
       window.open(`http://localhost:8080${fileUrl}`, '_blank');
    }
  };

  const openAnswerModal = async (student) => {
    setSelectedStudent(student);
    try {
      if (student.file) {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8080${student.file}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudentAnswers(res.data);
      }
    } catch (e) {
      console.error("Failed to load answers", e);
    }
    const currentTotal = student.nilai || 0;
    // Assuming PG score is the current total if essay is not graded.
    // Or we can just use the submission nilai as PG if it's auto-graded.
    setPgScore(currentTotal);
    // Since we don't have separate DB field for essay, let's just make it simple: 
    // Dosen inputs the new total or adds to PG.
    setEssayScore(0);
  };

  const saveFromModal = async () => {
    const essay = parseInt(essayScore) || 0;
    const finalEssay = essay < 0 ? 0 : essay; // max check can be added
    const total = pgScore + finalEssay;
    const finalTotal = total > 100 ? 100 : total;
    try {
      await gradeTugas(selectedStudent.id, finalTotal);
      setEditingGrade(prev => ({ ...prev, [selectedStudent.nim]: false }));
      setSelectedStudent(null);
      showToast('Nilai akhir kuis berhasil disimpan!');
      refetch();
    } catch (err) {
       showToast('Gagal menyimpan nilai');
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="animate-slide-up-fade">
          <div className="flex justify-between items-center mb-5">
            <div>
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-8 w-32 rounded-xl" />
          </div>
          <Card noPadding>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-5 py-3.5"><Skeleton className="h-4 w-12" /></th>
                    <th className="text-left px-5 py-3.5"><Skeleton className="h-4 w-20" /></th>
                    <th className="text-left px-5 py-3.5"><Skeleton className="h-4 w-24" /></th>
                    <th className="text-left px-5 py-3.5"><Skeleton className="h-4 w-16" /></th>
                    <th className="text-center px-5 py-3.5"><Skeleton className="h-4 w-20 mx-auto" /></th>
                    <th className="text-center px-5 py-3.5"><Skeleton className="h-4 w-16 mx-auto" /></th>
                  </tr>
                </thead>
                <tbody>
                  {Array(4).fill(0).map((_, i) => (
                    <tr key={`skel-nilai-${i}`} className="border-b border-slate-50">
                      <td className="px-5 py-3.5"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-5 py-3.5"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-5 py-3.5"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-5 py-3.5"><Skeleton className="h-8 w-24 rounded-lg" /></td>
                      <td className="px-5 py-3.5"><Skeleton className="h-8 w-16 rounded-lg mx-auto" /></td>
                      <td className="px-5 py-3.5"><Skeleton className="h-8 w-16 rounded-lg mx-auto" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
      <div className="animate-slide-up-fade">
        <div className="flex justify-between items-center mb-5 relative">
          <div>
            <h2 className="text-lg font-medium text-slate-800">Penilaian {isKuis ? 'Kuis' : 'Tugas'}</h2>
            <p className="text-sm text-slate-500">{tugasDetail ? tugasDetail.judul : (isKuis ? 'Kuis' : 'Tugas')}</p>
          </div>
          
          {/* Custom Toast Notification */}
          {notification.show && (
            <div className="absolute top-0 right-[200px] animate-fadeIn bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium">
              <CheckCircle size={16} />
              {notification.message}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
            <Users size={16} />
            <span>{taskSubmissions.length} pengumpulan</span>
          </div>
        </div>

        <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider">NIM</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider">Nama</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider">Waktu</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider">{isKuis ? 'Jawaban' : 'File'}</th>
                <th className="text-center px-5 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider">Nilai Akhir</th>
                <th className="text-center px-5 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {taskSubmissions.map((sub) => (
                <tr key={sub.nim} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-mono text-slate-500">{sub.nim}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-800">{sub.nama}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{sub.waktu}</td>
                  <td className="px-5 py-3.5">
                    {isKuis ? (
                      <button 
                        onClick={() => openAnswerModal(sub)}
                        className="flex items-center gap-2 text-[13px] font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Eye size={14} /> Lihat Jawaban
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleDownload(sub.file)}
                        className="flex items-center gap-2 text-[13px] font-medium text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                        title={sub.file}
                      >
                        <Download size={14} /> Unduh
                      </button>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {sub.status === 'dinilai' && !editingGrade[sub.nim] ? (
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-bold text-emerald-600 text-[15px]">{sub.nilai}</span>
                        <Badge type="sukses" label="Dinilai" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        {isKuis && <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full mb-1">Cek Jawaban</span>}
                        <input 
                          type="number" 
                          min="0" max="100"
                          value={grades[sub.nim] || ''}
                          onChange={(e) => handleGradeChange(sub.nim, e.target.value)}
                          className="w-20 border-2 border-slate-200 rounded-lg px-2 py-1.5 text-center text-sm focus:border-primary outline-none transition-colors" 
                          placeholder="0-100" 
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {sub.status === 'dinilai' && !editingGrade[sub.nim] ? (
                      <button 
                        onClick={() => handleEditGrade(sub.nim, sub.nilai)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors inline-flex"
                        title="Edit Nilai"
                      >
                        <Edit3 size={16} />
                      </button>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => handleSaveGrade(sub.nim, sub.id)}
                        disabled={!grades[sub.nim]}
                        className="shadow-sm"
                      >
                        Simpan
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {taskSubmissions.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-slate-500">
                    <FileBox size={40} className="mx-auto text-slate-300 mb-2" />
                    <p>Belum ada mahasiswa yang mengumpulkan tugas ini.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      </div>
      )}

      {/* Modal Kuis Answer (Khusus untuk tipe kuis) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setSelectedStudent(null)} />
          <div className="bg-white rounded-2xl w-full max-w-3xl relative z-10 flex flex-col max-h-[90vh] shadow-2xl animate-fadeIn">
            
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Jawaban Kuis: {selectedStudent.nama}</h2>
                <p className="text-sm text-slate-500 font-mono mt-0.5">{selectedStudent.nim}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-full shadow-sm hover:shadow transition-all">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Hasil PG */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-700">Nilai Pilihan Ganda (Otomatis)</h3>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">{pgScore} Poin</span>
                </div>
                <div className="p-4 text-sm text-slate-600">
                  <p>Siswa telah menjawab soal Pilihan Ganda dengan nilai terhitung otomatis sebesar {pgScore} oleh sistem.</p>
                </div>
              </div>

              {/* Hasil Essay */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-700">Jawaban Essay</h3>
                </div>
                <div className="p-4 space-y-5">
                  {essaySoalList.map((soal, idx) => (
                    <div key={soal.id} className="space-y-2">
                      <p className="text-sm font-medium text-slate-800">{idx + 1}. {soal.pertanyaan}</p>
                      <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-lg text-sm text-slate-700">
                        "{studentAnswers[soal.id] || '-'}"
                      </div>
                    </div>
                  ))}
                  {essaySoalList.length === 0 && (
                    <p className="text-sm text-slate-500 italic">Tidak ada soal essay pada kuis ini.</p>
                  )}
                </div>
              </div>

              {/* Input Nilai Akhir */}
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-blue-900">Berikan Penilaian Essay</h4>
                  <p className="text-sm text-blue-700 mt-1">Nilai PG ({pgScore}) akan otomatis dijumlahkan dengan nilai Essay ini.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-slate-400">{pgScore} +</span>
                  <input 
                    type="number"
                    min="0" max="100"
                    placeholder="Maks 100"
                    value={essayScore}
                    onChange={(e) => setEssayScore(e.target.value)}
                    className="w-24 text-center text-lg font-bold p-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 outline-none text-blue-700 bg-white"
                  />
                  <span className="text-xl font-bold text-slate-400">=</span>
                  <span className="text-2xl font-bold text-blue-700 w-12 text-center">
                    {pgScore + (parseInt(essayScore) || 0)}
                  </span>
                </div>
              </div>

            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-2xl">
              <Button variant="outline" onClick={() => setSelectedStudent(null)}>Batal</Button>
              <Button onClick={saveFromModal} className="shadow-md hover:-translate-y-0.5 transition-transform">
                Simpan Nilai Akhir
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default TugasNilai;
