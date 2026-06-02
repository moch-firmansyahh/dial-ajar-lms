import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import { uploadModul, addVideo } from '../../api/modul.api';
import { Upload, FileUp, Link as LinkIcon, FileVideo, BookOpen, Video as VideoIcon, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const MateriUpload = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  
  const [tipeMateri, setTipeMateri] = useState('pdf'); // pdf, word, video
  const [tipeVideo, setTipeVideo] = useState('link'); // link, upload
  const [judul, setJudul] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [deskripsi, setDeskripsi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = tipeMateri === 'pdf' 
      ? ['application/pdf']
      : ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      showToast(`File harus berformat ${tipeMateri === 'pdf' ? 'PDF' : 'DOC/DOCX'}`, 'error');
      return;
    }

    // Validate file size (25MB)
    if (file.size > 25 * 1024 * 1024) {
      showToast('Ukuran file maksimal 25MB', 'error');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      // Simulate file input change
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
      }
      handleFileSelect({ target: { files: [file] } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = async () => {
    // Validation
    if (!judul.trim()) {
      showToast('Judul materi harus diisi', 'error');
      return;
    }

    if (tipeMateri === 'video') {
      if (tipeVideo === 'link') {
        if (!videoUrl.trim()) {
          showToast('URL video harus diisi', 'error');
          return;
        }
      } else {
        showToast('Upload video MP4 belum didukung, gunakan tautan YouTube/Drive', 'error');
        return;
      }
    } else {
      if (!selectedFile) {
        showToast('File dokumen harus dipilih', 'error');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (tipeMateri === 'video') {
        await addVideo(id, judul, videoUrl);
        showToast('Video berhasil ditambahkan!');
      } else {
        await uploadModul(id, judul, selectedFile);
        showToast('Dokumen berhasil diupload!');
      }

      // Invalidate course content cache so MateriList refreshes
      queryClient.invalidateQueries({ queryKey: ['courseContent', id] });

      // Navigate back after short delay so user sees the toast
      setTimeout(() => {
        navigate(`/matakuliah/${id}/materi`);
      }, 1200);

    } catch (err) {
      console.error('Upload error:', err);
      const errorMsg = err.response?.data?.error || 'Gagal mengupload materi. Coba lagi.';
      showToast(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-10 -mt-2">
      <PageHeader title="Upload Materi Baru" />

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border transition-all duration-300 animate-slide-up-fade
          ${toast.type === 'error' 
            ? 'bg-red-50 border-red-200 text-red-700' 
            : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}
        >
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
            <X size={14} />
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up-fade {
          animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}</style>

      {isLoading ? (
        <div className="animate-slide-up-fade">
          <Card className="space-y-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <div className="grid grid-cols-3 gap-3">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Skeleton className="h-10 w-24 rounded-lg" />
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </Card>
        </div>
      ) : (
      <div className="animate-slide-up-fade">
      <Card className="space-y-5">
        <InputField 
          label="Judul Materi" 
          placeholder="Contoh: Pertemuan 1 - Intro React" 
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          required
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Tipe Materi</label>
          <div className="grid grid-cols-3 gap-3">
            <div 
              onClick={() => { setTipeMateri('pdf'); setSelectedFile(null); }}
              className={`border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${tipeMateri === 'pdf' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              <BookOpen size={20} />
              <span className="font-semibold text-[13px]">PDF</span>
            </div>
            <div 
              onClick={() => { setTipeMateri('word'); setSelectedFile(null); }}
              className={`border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${tipeMateri === 'word' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              <BookOpen size={20} />
              <span className="font-semibold text-[13px]">Word</span>
            </div>
            <div 
              onClick={() => { setTipeMateri('video'); setSelectedFile(null); }}
              className={`border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${tipeMateri === 'video' ? 'border-violet-500 bg-violet-50 text-violet-600' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              <VideoIcon size={20} />
              <span className="font-semibold text-[13px]">Video</span>
            </div>
          </div>
        </div>

        {/* Dynamic Input based on Tipe Materi */}
        {tipeMateri === 'video' ? (
          <div className="space-y-4 animate-fadeIn border border-violet-100 bg-violet-50/30 p-4 rounded-xl">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Sumber Video</label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => setTipeVideo('link')}
                  className={`border-2 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all ${tipeVideo === 'link' ? 'border-violet-500 bg-violet-50 text-violet-600' : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'}`}
                >
                  <LinkIcon size={16} />
                  <span className="font-semibold text-sm">Tautan (URL)</span>
                </div>
                <div 
                  onClick={() => setTipeVideo('upload')}
                  className={`border-2 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all ${tipeVideo === 'upload' ? 'border-violet-500 bg-violet-50 text-violet-600' : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'}`}
                >
                  <Upload size={16} />
                  <span className="font-semibold text-sm">Upload MP4</span>
                </div>
              </div>
            </div>

            {tipeVideo === 'link' ? (
              <InputField 
                label="URL Video (YouTube/Drive)" 
                placeholder="https://youtube.com/..." 
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            ) : (
              <div className="space-y-2 animate-fadeIn">
                <label className="block text-sm font-semibold text-slate-700">File Video</label>
                <div className="border-2 border-dashed border-slate-300 bg-white rounded-xl p-8 text-center hover:border-violet-500/50 hover:bg-violet-50/50 transition-colors cursor-pointer">
                  <FileVideo size={32} className="mx-auto text-slate-400 mb-3" />
                  <p className="text-sm text-slate-600 font-medium">Klik atau seret file MP4 ke sini</p>
                  <p className="text-xs text-slate-400 mt-1">Maks. ukuran file 100MB</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2 animate-fadeIn">
            <label className="block text-sm font-semibold text-slate-700">File Dokumen</label>
            
            {/* Hidden file input */}
            <input 
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept={tipeMateri === 'pdf' ? '.pdf' : '.doc,.docx'}
              onChange={handleFileSelect}
            />

            {selectedFile ? (
              /* Selected file preview */
              <div className="border-2 border-primary/30 bg-primary/[0.03] rounded-xl p-5 flex items-center gap-4 transition-all">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <FileUp size={24} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{formatFileSize(selectedFile.size)}</p>
                </div>
                <button 
                  onClick={removeFile}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  title="Hapus file"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              /* Drop zone */
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/[0.02] transition-colors cursor-pointer"
              >
                <FileUp size={32} className="mx-auto text-slate-400 mb-3" />
                <p className="text-sm text-slate-600 font-medium">Klik atau seret file ke sini</p>
                <p className="text-xs text-slate-400 mt-1">
                  {tipeMateri === 'pdf' ? 'Hanya file PDF (maks. 25MB)' : 'Hanya file DOC, DOCX (maks. 25MB)'}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Deskripsi (Opsional)</label>
          <textarea 
            className="w-full border-2 border-slate-200 rounded-xl p-4 focus:border-primary outline-none transition-colors min-h-[100px] resize-none" 
            placeholder="Ringkasan atau catatan materi..." 
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={() => navigate(`/matakuliah/${id}/materi`)} disabled={isSubmitting}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Mengupload...
              </>
            ) : (
              <>
                <Upload size={16} /> Upload
              </>
            )}
          </Button>
        </div>
      </Card>
      </div>
      )}
    </div>
  );
};

export default MateriUpload;
