import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Modal from '../ui/Modal';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import { joinMataKuliah } from '../../api/matakuliah.api';
import { useAuthStore } from '../../store/authStore';

const GabungKelasModal = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [kodeKelas, setKodeKelas] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);

  const handleJoinClass = async () => {
    if (!kodeKelas) return;
    setIsJoining(true);
    try {
      await joinMataKuliah({
        kodeKelas,
        mahasiswaId: user.id
      });
      setJoinSuccess(true);
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['matakuliah'] });
        onClose();
        setJoinSuccess(false);
        setKodeKelas('');
      }, 1500);
    } catch (err) {
      alert(err.response?.data || 'Gagal bergabung ke kelas');
    } finally {
      setIsJoining(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setKodeKelas('');
      setJoinSuccess(false);
      setIsJoining(false);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gabung Kelas">
      {joinSuccess ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Berhasil Bergabung!</h2>
          <p className="text-slate-500 mb-6">Mata kuliah akan segera muncul di dashboard Anda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-slate-500 mb-4">
            Mintalah kode kelas kepada Dosen Anda dan masukkan kode tersebut di sini untuk bergabung.
          </p>
          <InputField 
            label="Kode Kelas" 
            placeholder="Contoh: PBO-123" 
            value={kodeKelas} 
            onChange={(e) => setKodeKelas(e.target.value)} 
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClose}>Batal</Button>
            <Button onClick={handleJoinClass} disabled={isJoining || !kodeKelas}>
              {isJoining ? 'Bergabung...' : 'Gabung'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default GabungKelasModal;
