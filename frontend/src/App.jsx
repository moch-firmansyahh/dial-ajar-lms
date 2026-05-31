import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/shared/ProtectedRoute';

import Login from './pages/Login';

// Dosen
import DashboardDosen from './pages/dosen/Dashboard';
import MataKuliahForm from './pages/dosen/MataKuliahForm';
import MateriUpload from './pages/dosen/MateriUpload';
import TugasForm from './pages/dosen/TugasForm';
import TugasNilai from './pages/dosen/TugasNilai';
import NilaiRekap from './pages/dosen/NilaiRekap';

// Mahasiswa
import DashboardMahasiswa from './pages/mahasiswa/Dashboard';
import TugasSubmit from './pages/mahasiswa/TugasSubmit';
import KuisKerjakan from './pages/mahasiswa/KuisKerjakan';
import KuisHasil from './pages/mahasiswa/KuisHasil';
import NilaiSaya from './pages/mahasiswa/NilaiSaya';

// Shared
import Kalender from './pages/shared/Kalender';
import Profile from './pages/shared/Profile';
import MataKuliahList from './pages/shared/MataKuliahList';
import MataKuliahDetail from './pages/shared/MataKuliahDetail';
import CourseSelector from './pages/shared/CourseSelector';
import MateriList from './pages/shared/MateriList';
import TugasList from './pages/shared/TugasList';
import TugasDetail from './pages/shared/TugasDetail';
import ForumList from './pages/shared/ForumList';
import ForumDetail from './pages/shared/ForumDetail';
import ForumForm from './pages/shared/ForumForm';

function App() {
  const { initAuth, isLoggedIn, user } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Fallback route */}
      <Route path="/" element={
        isLoggedIn 
          ? <Navigate to="/dashboard" replace /> 
          : <Navigate to="/login" replace />
      } />

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        {/* Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            user?.role === 'DOSEN' ? <DashboardDosen /> : <DashboardMahasiswa />
          } 
        />
        
        {/* Mata Kuliah */}
        <Route path="/matakuliah" element={<MataKuliahList />} />
        <Route path="/matakuliah/buat" element={<ProtectedRoute role="DOSEN"><MataKuliahForm /></ProtectedRoute>} />
        
        <Route path="/matakuliah/:id" element={<MataKuliahDetail />}>
          <Route index element={<Navigate to="materi" replace />} />
          <Route path="materi" element={<MateriList />} />
          <Route path="materi/upload" element={<ProtectedRoute role="DOSEN"><MateriUpload /></ProtectedRoute>} />
        </Route>

        {/* Global Features Route (Select Course First) */}
        
        {/* Tugas */}
        <Route path="/tugas" element={<CourseSelector targetFeature="tugas" title="Tugas" subtitle="Pilih mata kuliah untuk melihat tugas" />} />
        <Route path="/tugas/:id" element={<TugasList />} />
        <Route path="/tugas/:id/:tugasId" element={<TugasDetail />} />
        <Route path="/tugas/:id/buat" element={<ProtectedRoute role="DOSEN"><TugasForm /></ProtectedRoute>} />
        <Route path="/tugas/:id/:tugasId/submit" element={<ProtectedRoute role="MAHASISWA"><TugasSubmit /></ProtectedRoute>} />
        <Route path="/tugas/:id/:tugasId/kerjakan" element={<ProtectedRoute role="MAHASISWA"><KuisKerjakan /></ProtectedRoute>} />
        <Route path="/tugas/:id/:tugasId/hasil" element={<ProtectedRoute role="MAHASISWA"><KuisHasil /></ProtectedRoute>} />


        {/* Forum */}
        <Route path="/forum" element={<CourseSelector targetFeature="forum" title="Forum Diskusi" subtitle="Pilih mata kuliah untuk bergabung dalam diskusi" />} />
        <Route path="/forum/:id" element={<ForumList />} />
        <Route path="/forum/:id/:forumId" element={<ForumDetail />} />

        {/* Nilai (Global) */}
        <Route path="/nilai" element={
          user?.role === 'DOSEN' ? <NilaiRekap /> : <NilaiSaya />
        } />

        {/* Kalender & Profil */}
        <Route path="/kalender" element={<Kalender />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
