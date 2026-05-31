import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/ui/Card';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import { Save, FileUp, CheckCircle } from 'lucide-react';
import KuisBuilder from '../../components/shared/KuisBuilder';

const TugasForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tipeTugas, setTipeTugas] = useState('tugas');
  const [quizData, setQuizData] = useState({
    pilihan_ganda: [],
    essay: []
  });

  // Notification State
  const [notification, setNotification] = useState({ show: false, message: '' });

  const handleSimpanTugas = () => {
    setNotification({ show: true, message: 'Tugas berhasil disimpan!' });
    setTimeout(() => {
      navigate(`/matakuliah/${id}/tugas`);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto pb-10 -mt-2 relative">
      
      {/* Toast Notification */}
      {notification.show && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-slide-up-fade bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-bold">
          <CheckCircle size={18} />
          {notification.message}
        </div>
      )}

      <PageHeader title="Buat Tugas Baru" />
      <Card className="space-y-5">
        <InputField label="Judul Tugas" placeholder="Contoh: Tugas 1 - Instalasi React" required />
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Tipe Tugas</label>
          <select 
            value={tipeTugas}
            onChange={(e) => setTipeTugas(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium text-slate-700"
          >
            <option value="tugas">Tugas Biasa</option>
            <option value="kuis">Kuis (Quiz)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Deskripsi Tugas</label>
          <textarea className="w-full border-2 border-slate-200 rounded-xl p-4 focus:border-primary outline-none transition-colors min-h-[120px] resize-none" placeholder="Instruksi dan persyaratan tugas..." />
        </div>
        <InputField type="datetime-local" label="Deadline" required />
        
        {tipeTugas === 'tugas' ? (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Lampiran (Opsional)</label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-primary/50 hover:bg-primary/[0.02] transition-colors cursor-pointer">
              <FileUp size={28} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-600 font-medium">Klik untuk mengunggah file</p>
              <p className="text-xs text-slate-400 mt-1">PDF, DOC, ZIP (maks. 25MB)</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Rancang Kuis</label>
            <KuisBuilder quizData={quizData} setQuizData={setQuizData} />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={() => navigate(`/matakuliah/${id}/tugas`)}>
            Batal
          </Button>
          <Button onClick={handleSimpanTugas}>
            <Save size={16} /> Simpan Tugas
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TugasForm;
