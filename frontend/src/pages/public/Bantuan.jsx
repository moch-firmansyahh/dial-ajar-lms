import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const mahasiswaSteps = [
  { id: 1, title: 'Langkah 1: Login', content: [
    'Pada halaman utama, pilih tab Mahasiswa.',
    'Masukkan Nomor Induk Mahasiswa (NIM) dan kata sandi Anda.',
    'Anda dapat mencentang "Tetap login di perangkat ini" jika Anda memakai perangkat pribadi agar sesi tidak cepat berakhir.'
  ] },
  { id: 2, title: 'Langkah 2: Enrollment MK', content: [
    'Setelah masuk ke Dashboard, Anda harus bergabung ke dalam kelas terlebih dahulu.',
    'Masuk ke menu Mata Kuliah di bilah navigasi kiri.',
    'Pilih mata kuliah yang belum Anda ikuti dan klik tombol "Enroll / Gabung Kelas".'
  ] },
  { id: 3, title: 'Langkah 3: Akses Materi', content: [
    'Setelah berhasil bergabung, klik mata kuliah tersebut.',
    'Anda akan melihat daftar modul atau materi yang telah dibagikan oleh Dosen.',
    'Anda bisa mengunduhnya secara langsung dalam bentuk PDF, Presentasi, atau dokumen lainnya.'
  ] },
  { id: 4, title: 'Langkah 4: Forum Diskusi', content: [
    'Masuk ke menu Forum Diskusi, lalu pilih mata kuliah terkait.',
    'Di sana Anda dapat membaca pengumuman dari dosen.',
    'Anda juga dapat membalas diskusi yang ada, atau membuat topik pertanyaan baru untuk dibahas bersama teman sekelas.'
  ] },
  { id: 5, title: 'Langkah 5: Kerjakan Tugas/Kuis', content: [
    'Pilih menu Tugas lalu pilih mata kuliah yang diinginkan.',
    'Anda akan melihat daftar tugas atau kuis yang harus diselesaikan beserta tenggat waktunya (deadline).',
    'Jika berupa Tugas Biasa, Anda harus mengunggah file jawaban (misal PDF/Word).',
    'Jika berupa Kuis Interaktif, Anda bisa mengerjakan soal (Pilihan Ganda dan Esai) secara langsung di dalam aplikasi sebelum waktunya habis.'
  ] },
  { id: 6, title: 'Langkah 6: Cek Penilaian', content: [
    'Setelah tugas atau kuis dinilai oleh dosen, statusnya akan berubah menjadi "Dinilai".',
    'Klik tombol aksi di sebelah kanan untuk melihat detail nilai akhir Anda.',
    'Anda juga dapat melihat rincian nilai per nomor soal yang diberikan oleh dosen secara transparan.'
  ] }
];

const dosenSteps = [
  { id: 1, title: 'Langkah 1: Login', content: [
    'Pilih tab Dosen pada halaman utama login.',
    'Masukkan NIP Anda beserta kata sandinya.'
  ] },
  { id: 2, title: 'Langkah 2: Buat Kelas', content: [
    'Masuk ke menu Mata Kuliah lalu klik tombol "Buat Mata Kuliah".',
    'Masukkan Nama dan Kode mata kuliah dengan benar.',
    'Mahasiswa nantinya akan menggunakan kelas ini untuk mendaftar (enrollment).'
  ] },
  { id: 3, title: 'Langkah 3: Unggah Materi', content: [
    'Setelah mata kuliah terbuat, klik pada mata kuliah tersebut.',
    'Pilih opsi untuk mengunggah materi baru.',
    'Anda dapat mengunggah file presentasi, modul, maupun dokumen perkuliahan lainnya untuk diakses oleh mahasiswa.'
  ] },
  { id: 4, title: 'Langkah 4: Buka Diskusi', content: [
    'Buka menu Forum Diskusi untuk memantik sesi tanya jawab yang interaktif.',
    'Anda dapat membuat topik diskusi baru (misalnya "Tanya Jawab Bab 1").',
    'Biarkan mahasiswa saling melempar argumen atau menanyakan kesulitan belajar pada topik tersebut.'
  ] },
  { id: 5, title: 'Langkah 5: Buat Tugas/Kuis AI', content: [
    'Pada menu Tugas, Anda dapat membuat Tugas File Biasa, atau membuat Kuis Interaktif.',
    'Untuk Kuis Interaktif, Anda dapat mengetik soal pilihan ganda dan esai secara manual.',
    'ATAU, Anda bisa menempelkan (paste) teks bahan ajar dan membiarkan AI otomatis membuatkan belasan soal lengkap beserta kuncinya dalam hitungan detik!'
  ] },
  { id: 6, title: 'Langkah 6: Beri Nilai', content: [
    'Pilih tugas/kuis yang sudah berlalu tenggat waktunya.',
    'Di daftar pengumpulan, klik tombol "Aksi".',
    'Untuk tugas file biasa, masukkan nilainya secara langsung.',
    'Untuk kuis, buka jendela "Cek Jawaban", lalu berikan nilai berskala 100 untuk tiap nomor esai. Sistem akan otomatis menggabungkannya dengan nilai Pilihan Ganda secara akurat.'
  ] }
];

const Bantuan = () => {
  const [activeTab, setActiveTab] = useState('mahasiswa');
  const [activeMStep, setActiveMStep] = useState(1);
  const [activeDStep, setActiveDStep] = useState(1);

  return (
    <div className="min-h-screen bg-[#F0F8FF] p-6 sm:p-10 text-slate-800 font-sans pb-20">
      <div className="max-w-4xl mx-auto">
        <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-medium">
          <ArrowLeft size={18} /> Kembali ke Halaman Login
        </Link>
        
        <div className="bg-white rounded-[28px] shadow-sm border border-slate-100 p-8 sm:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Pusat Bantuan</h1>
            <p className="text-slate-500 mt-2">Buku Panduan Penggunaan Aplikasi Dial Ajar LMS.</p>
          </div>

          {/* Top Tabs (Roles) */}
          <div className="relative flex p-1.5 bg-slate-50 rounded-xl mb-8 border border-slate-100">
            <div
              className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-white rounded-lg shadow-sm border border-slate-200/60 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                activeTab === "mahasiswa" ? "translate-x-0" : "translate-x-full"
              }`}
            />
            <button
              onClick={() => setActiveTab('mahasiswa')}
              className={`relative flex-1 py-3 text-[14px] font-semibold z-10 transition-colors duration-300 ${
                activeTab === 'mahasiswa' 
                  ? 'text-slate-900' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Panduan Mahasiswa
            </button>
            <button
              onClick={() => setActiveTab('dosen')}
              className={`relative flex-1 py-3 text-[14px] font-semibold z-10 transition-colors duration-300 ${
                activeTab === 'dosen' 
                  ? 'text-slate-900' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Panduan Dosen
            </button>
          </div>
          
          <div className="min-h-[350px]">
            {/* Mahasiswa Content */}
            {activeTab === 'mahasiswa' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left Sidebar Steps */}
                  <div className="w-full md:w-1/3 space-y-2">
                    {mahasiswaSteps.map(step => (
                      <button 
                        key={step.id}
                        onClick={() => setActiveMStep(step.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all font-semibold text-sm ${activeMStep === step.id ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      >
                        {step.title}
                      </button>
                    ))}
                  </div>
                  {/* Right Content Panel */}
                  <div className="w-full md:w-2/3 bg-slate-50 border border-slate-100 p-6 md:p-8 rounded-2xl flex flex-col justify-center min-h-[250px]">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">{mahasiswaSteps.find(s => s.id === activeMStep)?.title}</h2>
                    <ul className="text-slate-600 leading-relaxed list-decimal list-outside ml-4 space-y-2">
                      {mahasiswaSteps.find(s => s.id === activeMStep)?.content.map((item, idx) => (
                        <li key={idx} className="pl-1">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Dosen Content */}
            {activeTab === 'dosen' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left Sidebar Steps */}
                  <div className="w-full md:w-1/3 space-y-2">
                    {dosenSteps.map(step => (
                      <button 
                        key={step.id}
                        onClick={() => setActiveDStep(step.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all font-semibold text-sm ${activeDStep === step.id ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      >
                        {step.title}
                      </button>
                    ))}
                  </div>
                  {/* Right Content Panel */}
                  <div className="w-full md:w-2/3 bg-slate-50 border border-slate-100 p-6 md:p-8 rounded-2xl flex flex-col justify-center min-h-[250px]">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">{dosenSteps.find(s => s.id === activeDStep)?.title}</h2>
                    <ul className="text-slate-600 leading-relaxed list-decimal list-outside ml-4 space-y-2">
                      {dosenSteps.find(s => s.id === activeDStep)?.content.map((item, idx) => (
                        <li key={idx} className="pl-1">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Bantuan;
