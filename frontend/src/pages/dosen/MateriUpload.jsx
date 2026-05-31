import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/ui/Card';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import { Upload, FileUp, Link as LinkIcon, FileVideo, BookOpen, Video as VideoIcon } from 'lucide-react';

const MateriUpload = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [tipeMateri, setTipeMateri] = useState('pdf'); // pdf, word, video
  const [tipeVideo, setTipeVideo] = useState('link'); // link, upload

  return (
    <div className="max-w-2xl mx-auto pb-10 -mt-2">
      <PageHeader title="Upload Materi Baru" />
      <Card className="space-y-5">
        <InputField label="Judul Materi" placeholder="Contoh: Pertemuan 1 - Intro React" />
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Tipe Materi</label>
          <div className="grid grid-cols-3 gap-3">
            <div 
              onClick={() => setTipeMateri('pdf')}
              className={`border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${tipeMateri === 'pdf' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              <BookOpen size={20} />
              <span className="font-semibold text-[13px]">PDF</span>
            </div>
            <div 
              onClick={() => setTipeMateri('word')}
              className={`border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${tipeMateri === 'word' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              <BookOpen size={20} />
              <span className="font-semibold text-[13px]">Word</span>
            </div>
            <div 
              onClick={() => setTipeMateri('video')}
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
              <InputField label="URL Video (YouTube/Drive)" placeholder="https://youtube.com/..." />
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
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/[0.02] transition-colors cursor-pointer">
              <FileUp size={32} className="mx-auto text-slate-400 mb-3" />
              <p className="text-sm text-slate-600 font-medium">Klik atau seret file ke sini</p>
              <p className="text-xs text-slate-400 mt-1">
                {tipeMateri === 'pdf' ? 'Hanya file PDF (maks. 25MB)' : 'Hanya file DOC, DOCX (maks. 25MB)'}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Deskripsi (Opsional)</label>
          <textarea className="w-full border-2 border-slate-200 rounded-xl p-4 focus:border-primary outline-none transition-colors min-h-[100px] resize-none" placeholder="Ringkasan atau catatan materi..." />
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={() => navigate(`/matakuliah/${id}/materi`)}>
            Batal
          </Button>
          <Button onClick={() => { alert('Materi berhasil diunggah!'); navigate(`/matakuliah/${id}/materi`); }}>
            <Upload size={16} /> Upload
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MateriUpload;
