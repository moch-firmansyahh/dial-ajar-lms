import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/ui/Card';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import { Send } from 'lucide-react';

const ForumForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto pb-10 -mt-2">
      <PageHeader title="Buat Diskusi Baru" showBack={true} backTo={`/matakuliah/${id}/forum`} />
      <Card className="space-y-5">
        <InputField label="Judul Diskusi" placeholder="Contoh: Pertanyaan tentang React Hooks" required />
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Isi Diskusi</label>
          <textarea className="w-full border-2 border-slate-200 rounded-xl p-4 focus:border-primary outline-none transition-colors min-h-[160px] resize-none" placeholder="Tuliskan topik diskusi Anda di sini..." />
        </div>
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button onClick={() => { alert('Diskusi berhasil dibuat!'); navigate(`/matakuliah/${id}/forum`); }}>
            <Send size={16} /> Posting Diskusi
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ForumForm;
