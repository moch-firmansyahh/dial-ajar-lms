import { useState } from "react";
import Login from "./pages/auth/login/login";
import Dashboard from "./pages/mahasiswa/dashboard/dashboard";
import DashboardDosen from "./pages/dosen/dashboardDosen/dashboardDosen";
import DaftarMataKuliah from "./pages/mahasiswa/daftarMataKuliah/daftarMataKuliah";
import MataKuliah from "./pages/mahasiswa/mataKuliah/mataKuliah";
import DaftarTugas from "./pages/mahasiswa/daftarTugas/daftarTugas";
import Kuis from "./pages/mahasiswa/kuis/kuis";
import Presensi from "./pages/mahasiswa/presensi/presensi";
import PresensiMahasiswa from "./pages/mahasiswa/presensiMahasiswa/presensiMahasiswa";
import ForumDiskusi from "./pages/mahasiswa/forumDiskusi/forumDiskusi";
import Profile from "./pages/mahasiswa/profile/profile";
import Nilai from "./pages/mahasiswa/nilai/nilai";

// Dosen-specific pages
import DosenPresensi from "./pages/dosen/dosenPresensi/dosenPresensi";
import DosenTugas from "./pages/dosen/dosenTugas/dosenTugas";
import DosenKelompok from "./pages/dosen/dosenKelompok/dosenKelompok";
import DosenForum from "./pages/dosen/dosenForum/dosenForum";
import DosenProfile from "./pages/dosen/dosenProfile/dosenProfile";
import DosenMateri from "./pages/dosen/dosenMateri/dosenMateri";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setCurrentPage(role === "Dosen" ? "dosenDashboard" : "dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole("");
    setCurrentPage("dashboard");
  };

  const navigateTo = (page) => setCurrentPage(page);

  if (isLoggedIn) {
    const sharedProps = { onNavigate: navigateTo, onLogout: handleLogout };

    // ── MAHASISWA pages ──
    if (currentPage === "daftarMataKuliah")
      return <DaftarMataKuliah {...sharedProps} />;
    if (currentPage === "mataKuliah") return <MataKuliah {...sharedProps} />;
    if (currentPage === "daftarTugas") return <DaftarTugas {...sharedProps} />;
    if (currentPage === "kuis") return <Kuis {...sharedProps} />;
    if (currentPage === "presensi") return <Presensi {...sharedProps} />;
    if (currentPage === "presensiMahasiswa")
      return <PresensiMahasiswa {...sharedProps} />;
    if (currentPage === "forumDiskusi")
      return <ForumDiskusi {...sharedProps} />;
    if (currentPage === "profile") return <Profile {...sharedProps} />;
    if (currentPage === "nilai") return <Nilai {...sharedProps} />;

    // ── DOSEN-specific pages ──
    if (currentPage === "dosenPresensi")
      return <DosenPresensi {...sharedProps} />;
    if (currentPage === "dosenTugas") return <DosenTugas {...sharedProps} />;
    if (currentPage === "dosenKelompok")
      return <DosenKelompok {...sharedProps} />;
    if (currentPage === "dosenForum") return <DosenForum {...sharedProps} />;
    if (currentPage === "dosenProfile")
      return <DosenProfile {...sharedProps} />;
    if (currentPage === "dosenMateri") return <DosenMateri {...sharedProps} />;

    // Default dashboard per role
    if (userRole === "Mahasiswa") {
      return <Dashboard {...sharedProps} />;
    } else if (userRole === "Dosen") {
      return <DashboardDosen {...sharedProps} />;
    } else {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <h2>Akses role tidak ditemukan.</h2>
          <button
            onClick={handleLogout}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#4b53bc",
              color: "white",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Kembali ke Login
          </button>
        </div>
      );
    }
  }

  return (
    <div>
      <Login onLogin={handleLogin} />
    </div>
  );
}

export default App;
