import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Clock, CheckCircle, ChevronLeft, ChevronRight, AlertTriangle, X } from 'lucide-react';

import { getKuisDetail, getSoalKuis, submitKuis } from '../../api/tugas.api';
import { useAuthStore } from '../../store/authStore';

const KuisKerjakan = () => {
  const { id, tugasId } = useParams();
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  
  // State for modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuthStore();
  const [kuisDetail, setKuisDetail] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (tugasId === "undefined") {
      alert("Terjadi kesalahan pada link kuis. Silakan kembali ke halaman sebelumnya dan ulangi.");
      navigate(`/tugas/${id}`);
      return;
    }

    const fetchData = async () => {
      try {
        const [tugasRes, soalRes] = await Promise.all([
          getKuisDetail(tugasId),
          getSoalKuis(tugasId)
        ]);
        
        if (tugasRes.data) {
          setKuisDetail(tugasRes.data);
          // Set timer
          const durasiMenit = tugasRes.data.durasiMenit || 60;
          setTimeLeft(durasiMenit * 60);
        }
        
        if (soalRes.data && soalRes.data.length > 0) {
          // Format soal dari backend ke frontend
          const formatted = soalRes.data.map((s, index) => {
            const isPg = s.tipe === 'PILIHAN_GANDA';
            return {
              id: s.id,
              text: s.pertanyaan,
              type: isPg ? 'pg' : 'essay',
              options: isPg ? [
                `A. ${s.pilihanA}`,
                `B. ${s.pilihanB}`,
                `C. ${s.pilihanC}`,
                `D. ${s.pilihanD}`
              ] : null,
              kunciJawaban: s.kunciJawaban,
              skor: s.skor || 10
            };
          });
          setQuestions(formatted);
        }
      } catch (err) {
        console.error("Gagal memuat kuis", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, tugasId, user]);

  // Timer effect
  useEffect(() => {
    if (isLoading) return;
    
    if (timeLeft <= 0) {
      handleConfirmSubmit();
      return;
    }
    const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, isLoading]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const question = questions.length > 0 ? questions[currentIdx] : null;
  const handleAnswer = (val) => setAnswers(prev => ({ ...prev, [question.id]: val }));
  const isAnswered = (qId) => answers[qId] !== undefined && answers[qId] !== '';

  const handleConfirmSubmit = async () => {
    if (!user?.id) {
      alert("Sesi Anda kedaluwarsa atau tidak lengkap. Silakan logout dan login kembali untuk mengumpulkan kuis.");
      return;
    }
    
    setIsLoading(true);
    try {
      // Calculate PG score automatically
      let totalPgScore = 0;
      let totalMaxScore = 0;
      
      questions.forEach(q => {
        totalMaxScore += (q.skor || 10);
        if (q.type === 'pg' && answers[q.id] === q.kunciJawaban) {
          totalPgScore += (q.skor || 10);
        }
      });
      
      // Nilai proporsional berdasarkan seluruh soal (PG + Esai)
      // Jika hanya PG, maka akan jadi 100. Jika ada Esai, PG hanya sebagian dari 100.
      const finalPgScore = totalMaxScore > 0 ? Math.round((totalPgScore / totalMaxScore) * 100) : 0;
      
      await submitKuis(tugasId, user.id, answers, finalPgScore);
      navigate(`/tugas/${id}/${tugasId}/hasil`, { state: { submittedAnswers: answers, score: finalPgScore } });
    } catch (err) {
      console.error("Gagal mengumpulkan kuis", err);
      alert("Gagal mengumpulkan kuis");
      setIsLoading(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="max-w-5xl mx-auto pb-10 -mt-2 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-medium text-slate-900">{kuisDetail?.judul || 'Memuat Kuis...'}</h1>
          <p className="text-sm text-slate-500 mt-0.5">Tenggat Waktu: {kuisDetail?.deadline ? new Date(kuisDetail.deadline).toLocaleDateString() : '-'} • {questions.length} Soal</p>
        </div>
        <div className={`border px-4 py-2.5 rounded-xl flex items-center gap-2 font-mono text-lg font-medium shadow-sm transition-colors ${timeLeft < 300 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-white border-slate-200 text-slate-700'}`}>
          <Clock size={20} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col lg:flex-row gap-6 animate-slide-up-fade">
          <div className="flex-1 space-y-5">
            <Card className="min-h-[320px] flex flex-col p-6 shadow-sm border-slate-200/80">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="h-6 w-3/4 mb-6" />
              <div className="mt-auto space-y-3">
                {Array(4).fill(0).map((_, i) => (
                  <Skeleton key={`skel-opt-${i}`} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            </Card>
            <div className="flex justify-between items-center mt-6">
              <Skeleton className="h-10 w-32 rounded-lg" />
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </div>
          <div className="w-full lg:w-72 shrink-0">
            <Card className="sticky top-24 p-5 shadow-sm border-slate-200/80">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="grid grid-cols-5 gap-2.5">
                {Array(10).fill(0).map((_, i) => (
                  <Skeleton key={`skel-nav-${i}`} className="h-11 w-full rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-10 w-full mt-6 rounded-lg" />
            </Card>
          </div>
        </div>
      ) : (
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main: Question */}
        <div className="flex-1 space-y-5">
          <Card className="min-h-[320px] flex flex-col p-6 shadow-sm border-slate-200/80">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
              <span className="font-medium text-slate-700">Soal {currentIdx + 1} <span className="font-normal text-slate-400">dari {questions.length}</span></span>
              <Badge type={question?.type === 'pg' ? 'info' : 'kuis'} label={question?.type === 'pg' ? 'Pilihan Ganda' : 'Esai'} />
            </div>
            
            <p className="text-lg text-slate-800 font-medium mb-6 leading-relaxed">{question?.text}</p>
            
            <div className="mt-auto space-y-3">
              {question?.type === 'pg' ? (
                question.options.map((opt, idx) => {
                  const letter = opt.charAt(0);
                  const isSelected = answers[question.id] === letter;
                  return (
                    <label 
                      key={idx} 
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/5 shadow-sm' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium shrink-0 ${
                        isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {letter}
                      </div>
                      <span className={`font-medium ${isSelected ? 'text-primary' : 'text-slate-700'}`}>{opt.slice(3)}</span>
                      <input type="radio" name={`q-${question.id}`} value={letter} checked={isSelected} onChange={() => handleAnswer(letter)} className="hidden" />
                    </label>
                  );
                })
              ) : (
                <textarea 
                  className="w-full border-2 border-slate-200 rounded-xl p-4 h-40 focus:border-primary focus:ring-0 outline-none transition-colors resize-none"
                  placeholder="Ketik jawaban esai Anda di sini..."
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                />
              )}
            </div>
          </Card>

          {/* Nav Controls */}
          <div className="flex justify-between items-center mt-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
            >
              <ChevronLeft size={16} /> Sebelumnya
            </Button>
            
            {currentIdx < questions.length - 1 ? (
              <Button onClick={() => setCurrentIdx(prev => prev + 1)}>
                Selanjutnya <ChevronRight size={16} />
              </Button>
            ) : (
              <Button onClick={() => setShowConfirmModal(true)}>
                Kumpulkan <CheckCircle size={16} className="ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar: Number Nav */}
        <div className="w-full lg:w-72 shrink-0">
          <Card className="sticky top-24 p-5 shadow-sm border-slate-200/80">
            <h3 className="font-medium text-slate-800 mb-4 pb-3 border-b border-slate-100">Navigasi Soal</h3>
            <div className="grid grid-cols-5 gap-2.5">
              {questions.map((q, idx) => {
                const answered = isAnswered(q.id);
                const active = currentIdx === idx;
                
                return (
                  <button 
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-11 w-full rounded-xl flex items-center justify-center font-medium text-sm border-2 transition-all ${
                      answered 
                        ? (active ? 'border-emerald-500 bg-emerald-100 text-emerald-800 shadow-sm' : 'border-emerald-400 bg-emerald-50 text-emerald-700') 
                        : (active ? 'border-slate-400 bg-slate-100 text-slate-700 shadow-sm' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50')
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-2.5 text-[13px] font-medium text-slate-600">
                <div className="w-4 h-4 rounded-md bg-emerald-50 border border-emerald-400" />
                <span>Sudah Dijawab ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2.5 text-[13px] font-medium text-slate-600">
                <div className="w-4 h-4 rounded-md bg-white border border-slate-200" />
                <span>Belum Dijawab ({unansweredCount})</span>
              </div>
            </div>

            <Button onClick={() => setShowConfirmModal(true)} className="w-full mt-8">
              Kumpulkan Kuis
            </Button>
          </Card>
        </div>
      </div>
      )}

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
            
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-5 border border-blue-100">
              <CheckCircle size={32} />
            </div>
            
            <h2 className="text-xl font-medium text-slate-800 mb-2">Kumpulkan Kuis?</h2>
            
            <p className="text-slate-500 text-sm mb-6">
              Anda yakin ingin mengakhiri dan mengumpulkan kuis ini sekarang? Jawaban tidak dapat diubah setelah dikumpulkan.
            </p>
            
            {unansweredCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded-lg text-sm font-medium mb-6 flex items-center gap-2 justify-center">
                <AlertTriangle size={18} />
                Terdapat {unansweredCount} soal yang belum dijawab!
              </div>
            )}
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowConfirmModal(false)}
              >
                Batal
              </Button>
              <Button 
                className="flex-1 shadow-md shadow-primary/20"
                onClick={handleConfirmSubmit}
              >
                Yakin, Kumpulkan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KuisKerjakan;
