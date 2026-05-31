import React, { useState, useRef } from 'react';
import { Brain, Plus, Trash2, Wand2, Loader2, GripVertical, CheckCircle2, FileUp, FileText } from 'lucide-react';
import * as mammoth from 'mammoth';
import Button from '../../components/ui/Button';
import InputField from '../../components/ui/InputField';
import { generateQuizWithAI } from '../../utils/aiGenerator';

const KuisBuilder = ({ quizData, setQuizData }) => {
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'ai'
  
  // State for AI Generator
  const [materiText, setMateriText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef(null);
  
  // Custom Notification State
  const [notification, setNotification] = React.useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const addPg = () => {
    setQuizData({
      ...quizData,
      pilihan_ganda: [...quizData.pilihan_ganda, { pertanyaan: '', opsi: ['', '', '', ''], jawaban_benar: 0 }]
    });
  };

  const addEssay = () => {
    setQuizData({
      ...quizData,
      essay: [...quizData.essay, { pertanyaan: '' }]
    });
  };

  const updatePg = (index, field, value, opsiIndex = null) => {
    const newPg = [...quizData.pilihan_ganda];
    if (opsiIndex !== null) {
      newPg[index].opsi[opsiIndex] = value;
    } else {
      newPg[index][field] = value;
    }
    setQuizData({ ...quizData, pilihan_ganda: newPg });
  };

  const updateEssay = (index, value) => {
    const newEssay = [...quizData.essay];
    newEssay[index].pertanyaan = value;
    setQuizData({ ...quizData, essay: newEssay });
  };

  const removePg = (index) => {
    const newPg = quizData.pilihan_ganda.filter((_, i) => i !== index);
    setQuizData({ ...quizData, pilihan_ganda: newPg });
  };

  const removeEssay = (index) => {
    const newEssay = quizData.essay.filter((_, i) => i !== index);
    setQuizData({ ...quizData, essay: newEssay });
  };

  const handleGenerateAI = async () => {
    if (!materiText.trim()) {
      showToast("Mohon masukkan bahan materi atau upload dokumen terlebih dahulu!", "error");
      return;
    }
    
    setIsGenerating(true);
    try {
      const generatedQuiz = await generateQuizWithAI(materiText);
      
      // Merge with existing or replace
      setQuizData({
        pilihan_ganda: generatedQuiz.pilihan_ganda,
        essay: generatedQuiz.essay
      });
      
      setActiveTab('manual'); // Pindah ke tab manual untuk melihat hasil
      showToast("Kuis berhasil di-generate menggunakan AI!");
    } catch (error) {
      showToast("Gagal menggenerate kuis: " + error.message, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.docx')) {
      showToast('Saat ini hanya mendukung file ekstensi .docx untuk ekstraksi otomatis', 'error');
      return;
    }

    setIsExtracting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        try {
          const result = await mammoth.extractRawText({ arrayBuffer });
          setMateriText(result.value);
          showToast(`Teks berhasil diekstrak dari dokumen ${file.name}. Silakan tinjau dan klik Generate.`);
        } catch (err) {
          showToast('Gagal membaca isi dokumen', 'error');
        } finally {
          setIsExtracting(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      setIsExtracting(false);
      showToast('Terjadi kesalahan saat upload dokumen', 'error');
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm mt-4 relative">
      
      {/* Toast Notification */}
      {notification.show && (
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up-fade px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium text-white ${notification.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          <CheckCircle2 size={16} />
          {notification.message}
        </div>
      )}

      {/* Header Tabs */}
      <div className="flex bg-slate-50 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('manual')}
          className={`flex-1 py-3 font-semibold text-sm flex justify-center items-center gap-2 transition-colors ${activeTab === 'manual' ? 'text-primary bg-white border-b-2 border-primary' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          <GripVertical size={16} /> Buat Manual
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-3 font-semibold text-sm flex justify-center items-center gap-2 transition-colors ${activeTab === 'ai' ? 'text-sky-500 bg-white border-b-2 border-sky-500' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          <Brain size={16} /> Generate dengan AI
        </button>
      </div>

      <div className="p-5">
        {activeTab === 'ai' && (
          <div className="space-y-4 animate-fadeIn">
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Upload Dokumen Soal (Word)</label>
              <div 
                onClick={() => fileInputRef.current.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isExtracting ? 'border-sky-300 bg-sky-50/50' : materiText ? 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100/50' : 'border-slate-200 hover:border-sky-300 hover:bg-sky-50/30'}`}
              >
                <input type="file" ref={fileInputRef} className="hidden" accept=".docx" onChange={handleFileUpload} />
                {isExtracting ? (
                  <div className="flex flex-col items-center justify-center text-sky-500 h-full">
                    <Loader2 size={36} className="animate-spin mb-3" />
                    <p className="font-medium">Membaca dokumen...</p>
                  </div>
                ) : materiText ? (
                  <div className="flex flex-col items-center justify-center text-emerald-600 h-full">
                    <CheckCircle2 size={36} className="text-emerald-500 mb-3" />
                    <p className="font-medium text-lg">Dokumen Siap Diekstrak</p>
                    <p className="text-sm text-emerald-600/80 mt-1">Klik "Generate Kuis Sekarang" di bawah</p>
                    <Button size="sm" variant="ghost" className="mt-4 text-xs bg-white/50" onClick={(e) => { e.stopPropagation(); setMateriText(''); }}>Ganti File</Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 h-full">
                    <FileUp size={36} className="text-slate-400 mb-3" />
                    <p className="font-medium text-lg">Klik untuk upload dokumen</p>
                    <p className="text-sm text-slate-400 mt-1">Hanya mendukung format .docx</p>
                  </div>
                )}
              </div>
            </div>

            <Button 
              className="w-full !bg-sky-500 hover:!bg-sky-600 !text-white shadow-md shadow-sky-300/20 py-3"
              onClick={handleGenerateAI}
              disabled={isGenerating}
            >
              {isGenerating ? <><Loader2 size={18} className="animate-spin" /> Menganalisis & Membuat Soal...</> : <><Brain size={18} /> Generate Kuis Sekarang</>}
            </Button>
          </div>
        )}

        {activeTab === 'manual' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Bagian Pilihan Ganda */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-800 text-lg">Soal Pilihan Ganda</h3>
                <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">{quizData.pilihan_ganda.length} Soal</span>
              </div>
              
              {quizData.pilihan_ganda.length === 0 && <p className="text-slate-400 text-sm italic">Belum ada soal pilihan ganda.</p>}

              {quizData.pilihan_ganda.map((pg, index) => (
                <div key={`pg-${index}`} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 relative group">
                  <button onClick={() => removePg(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Pertanyaan {index + 1}</label>
                      <input 
                        type="text" 
                        value={pg.pertanyaan} 
                        onChange={(e) => updatePg(index, 'pertanyaan', e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none bg-white" 
                        placeholder="Masukkan pertanyaan..." 
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {pg.opsi.map((ops, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <button 
                            onClick={() => updatePg(index, 'jawaban_benar', oIdx)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 transition-colors ${pg.jawaban_benar === oIdx ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300 hover:border-emerald-400 text-transparent'}`}
                          >
                            <CheckCircle2 size={14} />
                          </button>
                          <input 
                            type="text" 
                            value={ops} 
                            onChange={(e) => updatePg(index, 'opsi', e.target.value, oIdx)}
                            className={`flex-1 border rounded-lg px-3 py-1.5 text-sm focus:border-primary outline-none bg-white transition-colors ${pg.jawaban_benar === oIdx ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200'}`} 
                            placeholder={`Opsi ${String.fromCharCode(65 + oIdx)}`} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" size="sm" onClick={addPg} className="w-full border-dashed border-2 hover:bg-slate-50 text-slate-600">
                <Plus size={16} /> Tambah Soal Pilihan Ganda
              </Button>
            </div>

            {/* Bagian Essay */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-800 text-lg">Soal Essay</h3>
                <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">{quizData.essay.length} Soal</span>
              </div>
              
              {quizData.essay.length === 0 && <p className="text-slate-400 text-sm italic">Belum ada soal essay.</p>}

              {quizData.essay.map((ess, index) => (
                <div key={`ess-${index}`} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 relative group flex gap-3 items-start">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Pertanyaan {index + 1}</label>
                    <textarea 
                      value={ess.pertanyaan} 
                      onChange={(e) => updateEssay(index, e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none bg-white min-h-[80px] resize-y" 
                      placeholder="Masukkan instruksi atau pertanyaan essay..." 
                    />
                  </div>
                  <button onClick={() => removeEssay(index)} className="mt-6 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              
              <Button variant="outline" size="sm" onClick={addEssay} className="w-full border-dashed border-2 hover:bg-slate-50 text-slate-600">
                <Plus size={16} /> Tambah Soal Essay
              </Button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default KuisBuilder;
