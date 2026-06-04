import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import { Save, FileUp, CheckCircle, Calendar, Clock, FileText, HelpCircle, ChevronDown, Loader2 } from 'lucide-react';
import KuisBuilder from '../../components/shared/KuisBuilder';
import { addTugas, addKuis } from '../../api/tugas.api';

const TugasForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tipeTugas, setTipeTugas] = useState('tugas');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [file, setFile] = useState(null);
  const [durasiMenit, setDurasiMenit] = useState('60');
  const fileInputRef2 = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [quizData, setQuizData] = useState({
    pilihan_ganda: [],
    essay: []
  });
  
  // State for Deadline Date
  const [deadlineDate, setDeadlineDate] = useState(new Date());
  
  // Custom Time State (Default 23:59)
  const [timeHour, setTimeHour] = useState('23');
  const [timeMinute, setTimeMinute] = useState('59');

  // Notification State
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const formatDeadline = () => {
    if (!deadlineDate) return new Date().toISOString().slice(0, 19);
    const d = new Date(deadlineDate);
    d.setHours(parseInt(timeHour || '0'));
    d.setMinutes(parseInt(timeMinute || '0'));
    d.setSeconds(0);
    
    // Format to YYYY-MM-DDTHH:mm:ss for Java LocalDateTime
    const pad = (num) => num.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  };

  const handleSimpanTugas = async () => {
    if (!judul) {
       setNotification({ show: true, message: 'Judul wajib diisi!', type: 'error' });
       setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
       return;
    }

    if (tipeTugas === 'kuis') {
        const totalSoal = quizData.pilihan_ganda.length + quizData.essay.length;
        if (totalSoal === 0) {
            setNotification({ show: true, message: 'Tambahkan minimal 1 soal!', type: 'error' });
            setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
            return;
        }
        const pgInvalid = quizData.pilihan_ganda.some(pg =>
            !pg.pertanyaan || pg.opsi.some(o => !o) || pg.jawaban_benar === undefined
        );
        if (pgInvalid) {
            setNotification({ show: true, message: 'Lengkapi semua soal PG!', type: 'error' });
            setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
            return;
        }
    }

    setIsSubmitting(true);
    try {
      const deadlineISO = formatDeadline();
      if (tipeTugas === 'tugas') {
        await addTugas(id, {
          judul,
          deskripsi,
          deadline: deadlineISO,
          file: file
        });
      } else {
        // Map quizData to soalList
        const soalList = [];
        quizData.pilihan_ganda.forEach(pg => {
          soalList.push({
            pertanyaan: pg.pertanyaan,
            pilihanA: pg.opsi[0],
            pilihanB: pg.opsi[1],
            pilihanC: pg.opsi[2],
            pilihanD: pg.opsi[3],
            kunciJawaban: String.fromCharCode(65 + (pg.jawaban_benar || 0)),
            tipe: "PILIHAN_GANDA"
          });
        });
        
        quizData.essay.forEach(es => {
          soalList.push({
            pertanyaan: es.pertanyaan,
            kunciJawaban: "-",
            tipe: "ESSAY"
          });
        });

        await addKuis(id, {
          judul,
          deskripsi,
          deadline: deadlineISO,
          durasiMenit: parseInt(durasiMenit || '60'),
          soalList
        });
      }
      
      setNotification({ show: true, message: 'Berhasil disimpan!', type: 'success' });
      navigate(-1);
    } catch (error) {
      setNotification({ show: true, message: 'Gagal menyimpan data', type: 'error' });
      setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-10 -mt-2 relative">
      
      {/* Toast Notification */}
      {notification.show && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-slide-up-fade text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-bold ${notification.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          <CheckCircle size={18} />
          {notification.message}
        </div>
      )}

      {isLoading ? (
        <div className="animate-slide-up-fade">
          <Skeleton className="h-8 w-48 mb-6" />
          <Card className="space-y-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-full sm:max-w-md rounded-xl" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-[46px] w-full rounded-xl" />
                <Skeleton className="h-[46px] w-full rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-100">
              <Skeleton className="h-12 w-24 rounded-lg" />
              <Skeleton className="h-12 w-36 rounded-lg" />
            </div>
          </Card>
        </div>
      ) : (
      <div className="animate-slide-up-fade">
        <PageHeader title="Buat Tugas Baru" />
        <Card className="space-y-5">
        <InputField label="Judul Tugas" placeholder="Contoh: Tugas 1 - Instalasi React" value={judul} onChange={(e) => setJudul(e.target.value)} required />
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Tipe Tugas</label>
          <div className="relative w-full sm:max-w-md" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-primary/50 hover:bg-slate-50/80 rounded-xl text-[14px] font-medium text-slate-700 transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10"
            >
              <div className="flex items-center gap-2.5">
                {tipeTugas === 'tugas' ? <FileText size={18} className="text-primary" /> : <HelpCircle size={18} className="text-purple-600" />}
                <span>{tipeTugas === 'tugas' ? 'Tugas Biasa' : 'Kuis (Quiz)'}</span>
              </div>
              <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <div 
              className={`absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden transition-all duration-200 origin-top z-50 ${isDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
            >
              <div className="p-1.5 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => { setTipeTugas('tugas'); setIsDropdownOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${tipeTugas === 'tugas' ? 'bg-primary/5 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <div className={`p-1.5 rounded-md ${tipeTugas === 'tugas' ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                    <FileText size={16} className={tipeTugas === 'tugas' ? 'text-primary' : 'text-slate-500'} />
                  </div>
                  Tugas Biasa
                </button>
                
                <button
                  type="button"
                  onClick={() => { setTipeTugas('kuis'); setIsDropdownOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${tipeTugas === 'kuis' ? 'bg-purple-50 text-purple-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <div className={`p-1.5 rounded-md ${tipeTugas === 'kuis' ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                    <HelpCircle size={16} className={tipeTugas === 'kuis' ? 'text-purple-600' : 'text-slate-500'} />
                  </div>
                  Kuis (Quiz)
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700">Tenggat Waktu (Deadline)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Tanggal */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors z-10">
                <Calendar size={18} />
              </div>
              <DatePicker 
                selected={deadlineDate}
                onChange={(date) => setDeadlineDate(date)}
                dateFormat="dd MMMM yyyy"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all hover:bg-slate-100 focus:bg-white"
                required
                placeholderText="Pilih Tanggal"
              />
            </div>
            
            {/* Input Waktu Custom */}
            <div className="relative group flex items-center bg-slate-50 border border-slate-200 rounded-xl focus-within:border-amber-500/50 focus-within:ring-4 focus-within:ring-amber-500/10 transition-all hover:bg-slate-100 focus-within:bg-white h-[46px]">
              <div className="pl-3.5 pr-2 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-500 transition-colors z-10">
                <Clock size={18} />
              </div>
              <div className="flex items-center gap-0.5">
                <input 
                  type="text" 
                  maxLength={2}
                  value={timeHour}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 23)) setTimeHour(val);
                  }}
                  onBlur={() => setTimeHour(prev => prev.length === 1 ? '0' + prev : prev || '00')}
                  className="w-8 text-center text-[15px] font-normal text-slate-700 bg-transparent outline-none focus:bg-amber-50 rounded-md py-1 transition-colors selection:bg-amber-200"
                  placeholder="00"
                />
                <span className="text-[15px] font-normal text-slate-400 animate-pulse pb-0.5">:</span>
                <input 
                  type="text" 
                  maxLength={2}
                  value={timeMinute}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 59)) setTimeMinute(val);
                  }}
                  onBlur={() => setTimeMinute(prev => prev.length === 1 ? '0' + prev : prev || '00')}
                  className="w-8 text-center text-[15px] font-normal text-slate-700 bg-transparent outline-none focus:bg-amber-50 rounded-md py-1 transition-colors selection:bg-amber-200"
                  placeholder="00"
                />
              </div>
            </div>
          </div>
        </div>

        {tipeTugas === 'kuis' && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Durasi Pengerjaan (Menit)</label>
            <div className="relative group flex items-center bg-white border border-slate-200 rounded-xl focus-within:border-primary transition-all">
               <input type="number" value={durasiMenit} onChange={(e) => setDurasiMenit(e.target.value)} className="w-full bg-transparent px-4 py-3 outline-none transition-colors" placeholder="60" />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Deskripsi Tugas (Opsional)</label>
          <textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl p-4 focus:border-primary outline-none transition-colors min-h-[120px] resize-none" placeholder="Instruksi dan persyaratan tugas..." />
        </div>
        
        {tipeTugas === 'tugas' ? (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Lampiran (Opsional)</label>
            <div onClick={() => fileInputRef2.current.click()} className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-primary/50 hover:bg-primary/[0.02] transition-colors cursor-pointer">
              <input type="file" className="hidden" ref={fileInputRef2} onChange={(e) => setFile(e.target.files[0])} />
              <FileUp size={28} className={`mx-auto mb-2 ${file ? 'text-emerald-500' : 'text-slate-400'}`} />
              <p className="text-sm text-slate-600 font-medium">{file ? file.name : 'Klik untuk mengunggah file'}</p>
              {!file && <p className="text-xs text-slate-400 mt-1">PDF, DOC, ZIP (maks. 25MB)</p>}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Rancang Kuis</label>
            <KuisBuilder quizData={quizData} setQuizData={setQuizData} />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
            Batal
          </Button>
          <Button onClick={handleSimpanTugas} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </Card>
    </div>
      )}
    </div>
  );
};

export default TugasForm;
