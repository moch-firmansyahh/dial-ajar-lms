import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircleQuestion, ChevronDown } from 'lucide-react';

const faqs = [
  { q: "Bagaimana jika saya lupa kata sandi?", a: "Silakan hubungi administrator IT kampus atau bagian akademik untuk melakukan reset kata sandi, karena sistem saat ini tidak melayani reset mandiri demi keamanan." },
  { q: "Mengapa nilai kuis saya belum keluar?", a: "Untuk kuis yang mengandung soal essay, nilai akhir baru akan muncul setelah Dosen secara manual memeriksa dan memberikan nilai pada jawaban essay Anda." },
  { q: "Apakah saya bisa mengubah jawaban kuis?", a: "Jawaban kuis hanya dapat diubah selama Anda belum menekan tombol 'Selesai' dan batas waktu pengerjaan belum habis." }
];

const FAQ = () => {
  const [open, setOpen] = useState(null);

  return (
    <div className="min-h-screen bg-[#F0F8FF] p-6 sm:p-10 text-slate-800 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-medium">
          <ArrowLeft size={18} /> Kembali ke Halaman Login
        </Link>
        <div className="bg-white rounded-[28px] shadow-sm border border-slate-100 p-8 sm:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
              <MessageCircleQuestion size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">FAQ</h1>
              <p className="text-slate-500 mt-1">Pertanyaan yang sering diajukan (Frequently Asked Questions).</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <span className="font-semibold text-slate-800">{faq.q}</span>
                  <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`} />
                </button>
                {open === i && (
                  <div className="p-4 bg-white text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
