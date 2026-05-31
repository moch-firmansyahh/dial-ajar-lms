import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/shared/ProtectedRoute';

const Login = lazy(() => import('./pages/Login'));

// Dosen
const DashboardDosen = lazy(() => import('./pages/dosen/Dashboard'));
const MataKuliahForm = lazy(() => import('./pages/dosen/MataKuliahForm'));
const MateriUpload = lazy(() => import('./pages/dosen/MateriUpload'));
const TugasForm = lazy(() => import('./pages/dosen/TugasForm'));
const TugasNilai = lazy(() => import('./pages/dosen/TugasNilai'));
const NilaiRekap = lazy(() => import('./pages/dosen/NilaiRekap'));

// Mahasiswa
const DashboardMahasiswa = lazy(() => import('./pages/mahasiswa/Dashboard'));
const TugasSubmit = lazy(() => import('./pages/mahasiswa/TugasSubmit'));
const KuisKerjakan = lazy(() => import('./pages/mahasiswa/KuisKerjakan'));
const KuisHasil = lazy(() => import('./pages/mahasiswa/KuisHasil'));
const NilaiSaya = lazy(() => import('./pages/mahasiswa/NilaiSaya'));

// Shared
const Kalender = lazy(() => import('./pages/shared/Kalender'));
const Profile = lazy(() => import('./pages/shared/Profile'));
const MataKuliahList = lazy(() => import('./pages/shared/MataKuliahList'));
const MataKuliahDetail = lazy(() => import('./pages/shared/MataKuliahDetail'));
const CourseSelector = lazy(() => import('./pages/shared/CourseSelector'));
const MateriList = lazy(() => import('./pages/shared/MateriList'));
const TugasList = lazy(() => import('./pages/shared/TugasList'));
const TugasDetail = lazy(() => import('./pages/shared/TugasDetail'));
const ForumList = lazy(() => import('./pages/shared/ForumList'));
const ForumDetail = lazy(() => import('./pages/shared/ForumDetail'));
const ForumForm = lazy(() => import('./pages/shared/ForumForm'));

// UI Components
import PageLoader from './components/ui/PageLoader';

function App() {
  const { initAuth, isLoggedIn, user } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <>
      <PageLoader />
      <Suspense fallback={null}>
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

            <Route path="/materi/upload-selector" element={<ProtectedRoute role="DOSEN"><CourseSelector targetFeature="matakuliah" targetPath="/materi/upload" title="Upload Modul" subtitle="Pilih mata kuliah untuk mengupload modul baru" /></ProtectedRoute>} />

            {/* Global Features Route (Select Course First) */}
            
            {/* Tugas */}
            <Route path="/tugas" element={<CourseSelector targetFeature="tugas" title="Tugas" subtitle="Pilih mata kuliah untuk melihat tugas" />} />
            <Route path="/tugas/buat-selector" element={<ProtectedRoute role="DOSEN"><CourseSelector targetFeature="tugas" targetPath="/buat" title="Buat Tugas" subtitle="Pilih mata kuliah untuk membuat tugas baru" /></ProtectedRoute>} />
            <Route path="/kuis/buat-selector" element={<ProtectedRoute role="DOSEN"><CourseSelector targetFeature="tugas" targetPath="/buat" title="Buat Kuis" subtitle="Pilih mata kuliah untuk membuat kuis baru" /></ProtectedRoute>} />
            
            <Route path="/tugas/:id" element={<TugasList />} />
            <Route path="/tugas/:id/:tugasId" element={<TugasDetail />} />
            <Route path="/tugas/:id/buat" element={<ProtectedRoute role="DOSEN"><TugasForm /></ProtectedRoute>} />
            <Route path="/tugas/:id/:tugasId/submit" element={<ProtectedRoute role="MAHASISWA"><TugasSubmit /></ProtectedRoute>} />
            <Route path="/tugas/:id/:tugasId/kerjakan" element={<ProtectedRoute role="MAHASISWA"><KuisKerjakan /></ProtectedRoute>} />
            <Route path="/tugas/:id/:tugasId/hasil" element={<ProtectedRoute role="MAHASISWA"><KuisHasil /></ProtectedRoute>} />


            {/* Forum */}
            <Route path="/forum" element={<CourseSelector targetFeature="forum" title="Forum Diskusi" subtitle="Pilih mata kuliah untuk bergabung dalam diskusi" />} />
            <Route path="/forum/buat-selector" element={<CourseSelector targetFeature="forum" targetPath="/buat" title="Buat Forum" subtitle="Pilih mata kuliah untuk membuat diskusi baru" />} />
            
            <Route path="/forum/:id" element={<ForumList />} />
            <Route path="/forum/:id/buat" element={<ForumForm />} />
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
      </Suspense>
    </>
  );
}

export default App;
