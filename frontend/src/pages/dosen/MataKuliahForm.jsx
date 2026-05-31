import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import { Save } from 'lucide-react';

const MataKuliahForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nama: '', kode: '', sks: '3', deskripsi: '' });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    alert('Mata kuliah berhasil disimpan!');
    navigate('/matakuliah');
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
        <PageHeader title="Buat Mata Kuliah Baru" showBack={true} backTo="/matakuliah" />
        <Card className="space-y-5">
        <InputField label="Nama Mata Kuliah" placeholder="Contoh: Pemrograman Web" value={form.nama} onChange={(e) => setForm({...form, nama: e.target.value})} required />

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Deskripsi</label>
          <textarea className="w-full border-2 border-slate-200 rounded-xl p-4 focus:border-primary outline-none transition-colors min-h-[120px] resize-none" placeholder="Deskripsi mata kuliah..." value={form.deskripsi} onChange={(e) => setForm({...form, deskripsi: e.target.value})} />
        </div>
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button onClick={handleSave}><Save size={16} /> Simpan</Button>
        </div>
      </Card>
      </div>
      )}
    </div>
  );
};

export default MataKuliahForm;
