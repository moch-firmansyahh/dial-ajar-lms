import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import { FileUp, PlayCircle, Send, CheckCircle, X, Link as LinkIcon, Info } from 'lucide-react';

const TugasSubmit = () => {
  const { id, tugasId } = useParams();
  const navigate = useNavigate();
  
  const [submitType, setSubmitType] = useState('upload'); // 'upload' | 'youtube'
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  
  const handleConfirmSubmit = () => {
    // Simulasi pengumpulan
    setShowConfirmModal(false);
    navigate(`/tugas/${id}`);
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      {isLoading ? (
        <div className="animate-slide-up-fade">
          <div className="mb-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Card className="p-6 md:p-8 border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 mb-6 gap-4">
              <Skeleton className="h-6 w-40" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24 rounded-lg" />
                <Skeleton className="h-10 w-24 rounded-lg" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-48 w-full rounded-xl border-dashed" />
              </div>
              <Skeleton className="h-12 w-full rounded-xl mt-4" />
            </div>
          </Card>
        </div>
      ) : (
      <div className="animate-slide-up-fade">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 tracking-tight">Kumpulkan Tugas</h1>
          <p className="text-slate-500 font-medium mt-1">Tugas 1: Instalasi & Setup React • Deadline: Besok, 23:59</p>
        </div>
        
        <Card className="p-6 md:p-8 border-slate-200/80 shadow-sm relative overflow-hidden">
          {/* Header section with tabs on the right */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 mb-6 gap-4">
            <h3 className="text-lg font-medium text-slate-800">Form Pengumpulan</h3>
            
            {/* Filter/Tabs: Upload dan YouTube (paling kanan atas) */}
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1 shrink-0">
              <button
                onClick={() => setSubmitType('upload')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all font-medium ${
                  submitType === 'upload' 
                    ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                <FileUp size={16} /> Upload
              </button>
              <button
                onClick={() => setSubmitType('youtube')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all font-medium ${
                  submitType === 'youtube' 
                    ? 'bg-red-500 text-white shadow-sm shadow-red-500/20 ring-1 ring-red-600/50' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                <PlayCircle size={16} /> YouTube
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Catatan / Teks */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Catatan Tambahan (Opsional)</label>
              <textarea 
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none min-h-[100px]"
                placeholder="Tuliskan pesan atau catatan tambahan untuk dosen..."
              ></textarea>
            </div>

            {/* Area File/Link */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                {submitType === 'upload' ? 'File Tugas' : 'Link Video Presentasi'}
              </label>
              
              {submitType === 'upload' ? (
                <div className="w-full aspect-[3/1] max-h-48 border-2 border-dashed border-slate-200 hover:border-primary bg-slate-50 hover:bg-primary/[0.02] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group p-4 text-center">
                  <div className="p-3 bg-white shadow-sm ring-1 ring-slate-200/50 rounded-xl text-primary mb-3 group-hover:scale-110 group-hover:shadow-md transition-all">
                    <FileUp size={24} />
                  </div>
                  <p className="font-medium text-slate-700 text-sm mb-1 group-hover:text-primary transition-colors">
                    Klik atau seret file ke area ini
                  </p>
                  <p className="text-xs text-slate-500">
                    Maksimal 10MB (PDF, DOCX, ZIP)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <LinkIcon size={18} className="text-slate-400" />
                    </div>
                    <input 
                      type="url" 
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full bg-slate-50 border border-slate-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none transition-all"
                    />
                  </div>
                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                    <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700 font-medium leading-relaxed">
                      Pastikan video YouTube Anda disetel ke <b>Publik</b> atau <b>Tidak Publik (Unlisted)</b> agar dosen dapat mengakses dan memberikan nilai.
                    </p>
                  </div>
                </div>
              )}
          </div>
          
          {/* Submit Action */}
          <div className="flex justify-end pt-6 border-t border-slate-100 mt-8">
            <Button onClick={() => setShowConfirmModal(true)} size="lg" className="px-8 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform">
              Kumpulkan Tugas <Send size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Modal Konfirmasi */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)} />
          
          <div className="bg-white rounded-2xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl p-6 text-center animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-100">
              <CheckCircle size={32} />
            </div>
            
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Yakin Kumpulkan?</h2>
            
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Tugas yang sudah dikumpulkan tidak dapat dibatalkan atau diedit kembali. Pastikan file atau tautan yang Anda berikan sudah benar.
            </p>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 font-medium"
                onClick={() => setShowConfirmModal(false)}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 shadow-md shadow-primary/20 font-medium bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={handleConfirmSubmit}
              >
                Yakin, Kirim
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
      )}
    </div>
  );
};

export default TugasSubmit;
