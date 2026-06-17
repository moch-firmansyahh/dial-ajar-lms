import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Headset, Mail, Phone } from 'lucide-react';

const Service = () => {
  return (
    <div className="min-h-screen bg-[#F0F8FF] p-6 sm:p-10 text-slate-800 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-medium">
          <ArrowLeft size={18} /> Kembali ke Halaman Login
        </Link>
        <div className="bg-white rounded-[28px] shadow-sm border border-slate-100 p-8 sm:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
              <Headset size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Layanan & Dukungan</h1>
              <p className="text-slate-500 mt-1">Hubungi kami jika mengalami kendala teknis.</p>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:border-emerald-200 transition-colors">
              <Mail className="text-emerald-500 mb-4" size={24} />
              <h3 className="font-bold text-slate-800 text-lg mb-2">Email Support</h3>
              <p className="text-slate-600 mb-4 text-sm">Kirimkan detail kendala atau screenshot error ke email layanan kami.</p>
              <a href="mailto:support@dialajar.edu" className="text-emerald-600 font-semibold hover:underline">support@dialajar.edu</a>
            </div>
            
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:border-emerald-200 transition-colors">
              <Phone className="text-emerald-500 mb-4" size={24} />
              <h3 className="font-bold text-slate-800 text-lg mb-2">Hotline IT</h3>
              <p className="text-slate-600 mb-4 text-sm">Layanan cepat untuk perbaikan akun atau sistem saat jam kerja operasional.</p>
              <a href="tel:+6281234567890" className="text-emerald-600 font-semibold hover:underline">0812-3456-7890</a>
            </div>
          </div>
          
          <div className="mt-8 p-5 bg-blue-50 rounded-xl text-sm text-blue-800 border border-blue-100">
            <strong>Jam Operasional:</strong> Senin - Jumat (08.00 - 16.00 WIB)
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;
