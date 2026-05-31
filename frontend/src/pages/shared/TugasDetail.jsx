import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useTugasStore } from '../../store/tugasStore';
import { FileText, ArrowRight, ArrowLeft, Calendar, Download, FileUp, Send, CheckCircle, X, Info, Trophy } from 'lucide-react';
import TugasNilai from '../dosen/TugasNilai';

const TugasDetail = () => {
  const { id, tugasId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isDosen = user?.role === 'DOSEN';
  const { getSubmission, cancelSubmit } = useTugasStore();

  // Ambil data submission mahasiswa (asumsi NIM untuk simulasi adalah 13521001 atau user.id)
  const userNIM = user?.nim || '13521001';
  const submission = getSubmission(userNIM, tugasId || '1');
  const isSubmitted = !!submission;

  // State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const tugas = tugasId === '2' ? {
    judul: 'Kuis 1: Pemahaman JSX Dasar',
    deskripsi: 'Kuis ini berisi pilihan ganda dan essay mengenai dasar-dasar JSX pada React. Anda memiliki waktu 45 menit untuk mengerjakannya.',
    deadline: '18 Juni 2026, 23:59',
    type: 'kuis'
  } : {
    judul: 'Tugas 1: Instalasi React',
    deskripsi: 'Buatlah sebuah project React baru menggunakan Vite. Kemudian buat halaman sederhana yang menampilkan biodata Anda (Nama, NIM, Jurusan). Pastikan menggunakan minimal 3 komponen terpisah.\n\nPersyaratan:\n• Gunakan Vite sebagai build tool\n• Minimal 3 komponen React\n• Styling bebas (CSS/Tailwind)\n• Screenshot hasil dan kode sumber',
    deadline: '15 Juni 2026, 23:59',
    type: 'tugas'
  };

  const handleFinalSubmit = () => {
    setShowConfirmModal(false);
    setShowSubmitModal(false);
    useTugasStore.getState().submitTugas(userNIM, user?.nama || 'Budi Mahasiswa', 'jawaban_saya.pdf', tugasId || '1');
  };

  const handleCancelSubmit = () => {
    cancelSubmit(userNIM, tugasId || '1');
  };

  return (
    <div className="max-w-3xl mx-auto pb-10 -mt-2">
      <Button variant="ghost" className="mb-4 pl-0 text-slate-500 hover:text-slate-800" onClick={() => navigate(`/tugas/${id}`)}>
        <ArrowLeft size={18} className="mr-2" /> Batal / Kembali
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-medium text-slate-900 mb-2">{tugas.judul}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge type="peringatan" label={`Deadline: ${tugas.deadline}`} />
          {!isDosen && (
            isSubmitted ? (
              <Badge type="sukses" label="Selesai (Sudah Dikumpulkan)" />
            ) : (
              <Badge type="bahaya" label="Belum Dikumpulkan" />
            )
          )}
          {!isDosen && submission?.nilai && (
            <Badge type="info" label={`Nilai: ${submission.nilai}`} />
          )}
        </div>
      </div>

      <Card className="mb-5">
        <h3 className="font-medium text-slate-800 mb-3">Deskripsi Tugas</h3>
        <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{tugas.deskripsi}</div>
      </Card>

      {tugas.type === 'tugas' && (
        <Card className="mb-5">
          <h3 className="font-medium text-slate-800 mb-3">Lampiran</h3>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <FileText size={20} className="text-primary" />
            <span className="text-sm text-slate-700 font-medium flex-1">template_tugas.pdf</span>
            <Button variant="ghost" size="sm" className="bg-white"><Download size={14} className="mr-1" /> Unduh</Button>
          </div>
        </Card>
      )}

      {!isDosen && (
        <div className="flex flex-col mt-8">
          {submission?.nilai && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-5 flex items-center justify-between">
              <div>
                <h4 className="text-emerald-800 font-semibold flex items-center gap-2"><Trophy size={18}/> Tugas Telah Dinilai</h4>
                <p className="text-sm text-emerald-600 mt-1">Bagus sekali! Dosen telah memeriksa tugas Anda.</p>
              </div>
              <div className="text-3xl font-bold text-emerald-600">
                {submission.nilai}
                <span className="text-base font-medium text-emerald-500">/100</span>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            {!isSubmitted ? (
              <Button size="lg" className="px-8 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform" 
                onClick={() => {
                  if (tugas.type === 'kuis') {
                    navigate(`/tugas/${id}/${tugasId}/kerjakan`);
                  } else {
                    setShowSubmitModal(true);
                  }
                }}
              >
                {tugas.type === 'kuis' ? 'Mulai Kerjakan Kuis' : 'Kumpulkan Jawaban'} <ArrowRight size={18} className="ml-2" />
              </Button>
            ) : (
              !submission?.nilai && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium transition-colors" 
                  onClick={handleCancelSubmit}
                >
                  <X size={18} className="mr-2" /> Batalkan Pengumpulan
                </Button>
              )
            )}
          </div>
        </div>
      )}

      {isDosen && (
        <div className="mt-8">
          <TugasNilai />
        </div>
      )}

      {/* MODAL PENGUMPULAN TUGAS */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowSubmitModal(false)} />
          
          <div className="bg-white rounded-2xl w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            {/* Header Modal */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-semibold text-slate-800">Form Pengumpulan Tugas</h2>
              <button onClick={() => setShowSubmitModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Catatan Tambahan (Opsional)</label>
                  <textarea 
                    className="w-full border-2 border-slate-200 rounded-xl p-4 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all min-h-[100px] resize-none text-slate-700 font-medium text-sm" 
                    placeholder="Tuliskan catatan, pesan untuk dosen, atau jawaban singkat Anda di sini..." 
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">File Lampiran Tugas</label>
                  <div className="border-2 border-dashed border-primary/30 bg-primary/[0.02] rounded-2xl p-8 text-center hover:border-primary hover:bg-primary/[0.04] transition-all cursor-pointer group">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                      <FileUp size={24} className="text-primary" />
                    </div>
                    <h4 className="text-[14px] font-medium text-slate-700 mb-1">Klik atau seret file ke area ini</h4>
                    <p className="text-xs text-slate-500 mb-4">Format yang didukung: PDF, DOC, ZIP (maks. 25MB)</p>
                    <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[12px] font-medium">Pilih File</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowSubmitModal(false)}>Batal</Button>
              <Button onClick={() => setShowConfirmModal(true)} className="px-6 shadow-md shadow-primary/20">
                Kumpulkan <Send size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Yakin Kumpulkan */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)} />
          
          <div className="bg-white rounded-2xl w-full max-w-sm relative z-10 overflow-hidden shadow-2xl p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-100">
              <CheckCircle size={32} />
            </div>
            
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Yakin Kumpulkan?</h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Pastikan jawaban atau file Anda sudah benar. Tugas yang dikumpulkan tidak bisa dibatalkan.
            </p>
            
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 font-medium" onClick={() => setShowConfirmModal(false)}>Batal</Button>
              <Button className="flex-1 font-medium bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleFinalSubmit}>
                Yakin, Kirim
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TugasDetail;
