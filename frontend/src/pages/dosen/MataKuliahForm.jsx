import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { createMataKuliah } from '../../api/matakuliah.api';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Save, CheckCircle } from 'lucide-react';

const MataKuliahForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [form, setForm] = useState({ nama: '', sks: '3', deskripsi: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Custom Success Modal State
  const [successModal, setSuccessModal] = useState({ isOpen: false, kodeKelas: '' });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = async () => {
    if (!form.nama) {
      alert("Nama Mata Kuliah wajib diisi!");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await createMataKuliah({
        nama: form.nama,
        dosenId: user.id
      });
      // Show custom success modal with the generated code
      setSuccessModal({ isOpen: true, kodeKelas: res.kodeKelas });
    } catch (err) {
      alert(err.response?.data || "Gagal membuat mata kuliah");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccessModal({ isOpen: false, kodeKelas: '' });
    navigate(-1);
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      {isLoading ? (
        <div className="animate-slide-up-fade">
          <div className="mb-6 flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Card className="space-y-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </Card>
        </div>
      ) : (
      <div className="animate-slide-up-fade">
        <PageHeader title="Buat Mata Kuliah Baru" showBack={true} backTo={-1} />
        <Card className="space-y-5">
        <InputField label="Nama Mata Kuliah" placeholder="Contoh: Pemrograman Web" value={form.nama} onChange={(e) => setForm({...form, nama: e.target.value})} required />

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Deskripsi Singkat</label>
          <textarea className="w-full border-2 border-slate-200 rounded-xl p-4 focus:border-primary outline-none transition-colors min-h-[120px] resize-none" placeholder="Deskripsi mata kuliah..." value={form.deskripsi} onChange={(e) => setForm({...form, deskripsi: e.target.value})} />
        </div>
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button onClick={handleSave} disabled={isSubmitting}>
            <Save size={16} /> {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </Card>
      </div>
      )}

      {/* Success Modal */}
      <Modal isOpen={successModal.isOpen} onClose={handleCloseSuccess} size="sm">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Kelas Berhasil Dibuat!</h2>
          <p className="text-slate-500 mb-6">Silakan bagikan Kode Kelas berikut kepada mahasiswa Anda agar mereka bisa bergabung.</p>
          
          <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 mb-6">
            <p className="text-sm font-medium text-slate-500 mb-1">Kode Kelas</p>
            <p className="text-3xl font-bold tracking-widest text-primary">{successModal.kodeKelas}</p>
          </div>

          <Button onClick={handleCloseSuccess} className="w-full justify-center">
            Mengerti & Kembali
          </Button>
        </div>
      </Modal>

    </div>
  );
};

export default MataKuliahForm;
