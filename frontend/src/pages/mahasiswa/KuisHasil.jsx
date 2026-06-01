import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const dummyQuestionsBase = [
  { id: 1, text: 'Apa fungsi dari React Router?', type: 'pg', correct: 'B', explanation: 'React Router digunakan untuk navigasi antar halaman dalam SPA.' },
  { id: 2, text: 'Zustand digunakan untuk...', type: 'pg', correct: 'A', explanation: 'Zustand adalah library state management yang ringan dan cepat.' },
  { id: 3, text: 'Jelaskan konsep Virtual DOM pada React!', type: 'essay' },
  { id: 4, text: 'Tailwind adalah framework CSS berbasis...', type: 'pg', correct: 'B', explanation: 'Tailwind menggunakan pendekatan utility-first.' },
  { id: 5, text: 'Sebutkan 3 hooks dasar di React.', type: 'essay' },
];

const KuisHasil = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const submittedAnswers = location.state?.submittedAnswers || {};

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const evaluatedQuestions = dummyQuestionsBase.map(q => {
    const ans = submittedAnswers[q.id];
    let isCorrect = null;
    if (q.type === 'pg') {
      isCorrect = ans === q.correct;
    }
    return { ...q, answer: ans, isCorrect };
  });

  const totalPG = evaluatedQuestions.filter(q => q.type === 'pg').length;
  const correctPG = evaluatedQuestions.filter(q => q.type === 'pg' && q.isCorrect).length;
  const score = totalPG > 0 ? Math.round((correctPG / totalPG) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <Button variant="ghost" className="mb-4 pl-0 text-slate-500 hover:text-slate-800" onClick={() => navigate(`/tugas/${id}`)}>
        <ArrowLeft size={18} className="mr-2" /> Kembali ke Daftar Tugas
      </Button>

      {isLoading ? (
        <div className="animate-slide-up-fade">
          <Card className="p-8 mb-8 text-center bg-gradient-to-br from-white to-blue-50/30 border-blue-100 shadow-sm flex flex-col items-center">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-48 mb-8" />
            <Skeleton className="w-40 h-40 rounded-full mb-6" />
            <div className="grid grid-cols-3 gap-4 w-full max-w-md mx-auto mt-4">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </Card>
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <Card key={`skel-hasil-${i}`} className="p-5 border-slate-200/80 shadow-sm">
                <div className="flex justify-between items-start mb-3 gap-4">
                  <div className="flex gap-3 w-full">
                    <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                    <Skeleton className="h-5 w-3/4 mt-1" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="ml-11">
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-slide-up-fade">
          <Card className="p-8 mb-8 text-center bg-gradient-to-br from-white to-blue-50/30 border-blue-100 shadow-sm">
            <h1 className="text-3xl font-semibold text-slate-800 mb-2">Kuis 1: Pengenalan React</h1>
            <p className="text-slate-500 mb-8">Pengerjaan Selesai pada {new Date().toLocaleDateString('id-ID')}</p>

            <div className="inline-flex flex-col items-center justify-center bg-white border-4 border-blue-100 shadow-lg rounded-full w-40 h-40 mb-6 relative">
              <span className="text-5xl font-semibold text-blue-600 tracking-tight">{score}</span>
              <span className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-widest">Skor P.G.</span>
              
              <div className="absolute -right-2 -top-2 bg-emerald-500 text-white rounded-full p-2 border-4 border-white shadow-sm">
                <CheckCircle size={24} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-4">
              <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                <div className="text-2xl font-medium text-emerald-500">{correctPG}</div>
                <div className="text-[11px] font-medium text-slate-400 uppercase">Benar</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                <div className="text-2xl font-medium text-red-500">{totalPG - correctPG}</div>
                <div className="text-[11px] font-medium text-slate-400 uppercase">Salah</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                <div className="text-2xl font-medium text-blue-500">2</div>
                <div className="text-[11px] font-medium text-slate-400 uppercase">Esai Menunggu</div>
              </div>
            </div>
          </Card>

          <h2 className="text-xl font-medium text-slate-800 mb-4 px-1">Review Jawaban</h2>
          <div className="space-y-4">
            {evaluatedQuestions.map((q, idx) => (
              <Card key={q.id} className="p-5 border-slate-200/80 shadow-sm">
                <div className="flex justify-between items-start mb-3 gap-4">
                  <div className="flex gap-3 items-start">
                    <span className="bg-slate-100 text-slate-600 font-medium w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="font-semibold text-slate-800 mt-1 leading-snug">{q.text}</p>
                  </div>
                  <Badge 
                    type={q.type === 'pg' ? (q.isCorrect ? 'sukses' : 'bahaya') : 'info'} 
                    label={q.type === 'pg' ? (q.isCorrect ? 'Benar' : 'Salah') : 'Menunggu Nilai'}
                  />
                </div>
                
                <div className="ml-11">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-700">
                    <span className="text-slate-400 block mb-1 text-[12px] uppercase">Jawaban Anda:</span>
                    {q.answer || <span className="italic text-slate-400">Tidak dijawab</span>}
                  </div>
                  
                  {q.type === 'pg' && !q.isCorrect && (
                    <div className="mt-3 flex items-start gap-2 text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                      <CheckCircle size={16} className="shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium block mb-0.5">Kunci Jawaban: {q.correct}</span>
                        <span className="opacity-90">{q.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center pb-10">
            <Button onClick={() => navigate(`/tugas/${id}`)}>
              <RefreshCw size={18} className="mr-2" /> Kembali ke Halaman Tugas
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KuisHasil;
