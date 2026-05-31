import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import { Save, FileUp, CheckCircle, Calendar, Clock, FileText, HelpCircle, ChevronDown } from 'lucide-react';
import KuisBuilder from '../../components/shared/KuisBuilder';

const TugasForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tipeTugas, setTipeTugas] = useState('tugas');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
  const [notification, setNotification] = useState({ show: false, message: '' });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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
        <InputField label="Judul Tugas" placeholder="Contoh: Tugas 1 - Instalasi React" required />
        
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

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Deskripsi Tugas</label>
          <textarea className="w-full border-2 border-slate-200 rounded-xl p-4 focus:border-primary outline-none transition-colors min-h-[120px] resize-none" placeholder="Instruksi dan persyaratan tugas..." />
        </div>
        
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
      )}
    </div>
  );
};

export default TugasForm;
