import React, { useState, useRef } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { Camera, Mail, User, Shield, Info, UploadCloud, Eye, EyeOff, Lock, CheckCircle2, AlertCircle, X } from 'lucide-react';

const Profile = () => {
  const { user } = useAuthStore();
  const [profilePic, setProfilePic] = useState(null);
  const fileInputRef = useRef(null);

  // Password States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePic(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (!currentPassword) {
      setPwdError('Password saat ini harus diisi.');
      return;
    }

    if (newPassword.length < 6) {
      setPwdError('Password baru minimal 6 karakter.');
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setPwdError('Password baru harus mengandung minimal 1 huruf kapital.');
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setPwdError('Password baru harus mengandung minimal 1 huruf kecil.');
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setPwdError('Password baru harus mengandung minimal 1 simbol khusus.');
      return;
    }

    // Simulasi sukses
    setPwdSuccess('Password berhasil diubah!');
    setCurrentPassword('');
    setNewPassword('');
    
    // Tutup modal otomatis setelah beberapa saat
    setTimeout(() => {
      setShowPasswordModal(false);
      setPwdSuccess('');
    }, 1500);
  };

  const closeModal = () => {
    setShowPasswordModal(false);
    setPwdError('');
    setPwdSuccess('');
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="pb-12 max-w-5xl mx-auto">
      <PageHeader title="Profil" subtitle="Kelola informasi identitas akun Anda" />
      
      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        
        {/* Kolom Kiri: Foto Profil & Aksi */}
        <div className="w-full lg:w-1/3 space-y-6">
          {/* Kartu Profil Utama */}
          <Card className="p-6 md:p-8 flex flex-col items-center text-center">
            <div className="relative group mb-6">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-4xl shadow-sm border border-slate-200 overflow-hidden">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.nama?.substring(0, 2).toUpperCase() || 'RF'
                )}
              </div>
              
              {/* Hover Overlay */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-slate-900/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity backdrop-blur-sm"
              >
                <UploadCloud size={28} className="text-white" />
              </div>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-1">{user?.nama || 'Pengguna'}</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 bg-slate-100 px-3 py-1 rounded-full">{user?.role === 'DOSEN' ? 'Dosen Pengampu' : 'Mahasiswa'}</p>

            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300">
              <Camera size={16} /> Ganti Foto Profil
            </Button>
            
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Format yang didukung: JPG, PNG, atau GIF. Ukuran maksimal file 2MB.
            </p>
          </Card>

          {/* Kartu Keamanan / Ubah Password */}
          <Card className="p-6 border border-slate-200">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <Lock size={20} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-800">Keamanan Akun</h3>
                <p className="text-xs text-slate-500 mt-0.5">Perbarui kata sandi Anda</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowPasswordModal(true)} 
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white shadow-sm"
            >
              Ubah Password
            </Button>
          </Card>
        </div>

        {/* Kolom Kanan: Data Diri */}
        <div className="w-full lg:w-2/3">
          <Card className="p-0 overflow-hidden h-full">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 text-lg">Informasi Pribadi</h3>
              <p className="text-sm text-slate-500 mt-1">Detail identitas Anda yang terdaftar pada sistem akademik.</p>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              
              {/* Alert Info */}
              <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex gap-3 text-sm text-amber-800">
                <Info size={18} className="shrink-0 mt-0.5 text-amber-500" />
                <p>
                  <span className="font-semibold">Akun Terhubung:</span> Data di bawah ini tidak dapat diubah secara mandiri karena tersinkronisasi dengan pusat. Jika terdapat kesalahan, mohon hubungi pihak akademik.
                </p>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <User size={15} className="text-slate-400" /> Nama Lengkap
                  </label>
                  <input 
                    type="text" 
                    value={user?.nama || 'Pengguna'} 
                    disabled 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-600 font-medium cursor-not-allowed shadow-sm" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Shield size={15} className="text-slate-400" /> NIM / NIDN
                  </label>
                  <input 
                    type="text" 
                    value={user?.role === 'DOSEN' ? '0011223344' : '1122334455'} 
                    disabled 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-600 font-medium cursor-not-allowed shadow-sm" 
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Mail size={15} className="text-slate-400" /> Email Institusi
                  </label>
                  <input 
                    type="email" 
                    value={`${(user?.nama || 'user').toLowerCase().replace(' ', '.')}@kampus.ac.id`} 
                    disabled 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-600 font-medium cursor-not-allowed shadow-sm" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Program Studi</label>
                  <input 
                    type="text" 
                    value="Teknik Informatika" 
                    disabled 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-600 font-medium cursor-not-allowed shadow-sm" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Fakultas</label>
                  <input 
                    type="text" 
                    value="Fakultas Ilmu Komputer" 
                    disabled 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-600 font-medium cursor-not-allowed shadow-sm" 
                  />
                </div>
              </div>

            </div>
          </Card>
        </div>

      </div>

      {/* Modal Pop Up Ubah Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Lock size={18} />
                </div>
                <h3 className="font-semibold text-slate-800 text-lg">Ubah Password</h3>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handlePasswordChange} className="p-6 space-y-5">
              
              {pwdError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-start gap-3">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p>{pwdError}</p>
                </div>
              )}

              {pwdSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl flex items-start gap-3">
                  <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                  <p>{pwdSuccess}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password Saat Ini</label>
                <div className="relative">
                  <input 
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan password saat ini"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-4 pr-11 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password Baru</label>
                <div className="relative">
                  <input 
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan password baru"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-4 pr-11 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Minimal 6 karakter, mengandung huruf kapital, huruf kecil, dan 1 simbol khusus.
                </p>
              </div>

              <div className="pt-4 flex gap-3 justify-end border-t border-slate-100 mt-6">
                <Button type="button" variant="outline" onClick={closeModal}>Batal</Button>
                <Button type="submit">Simpan Password</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
