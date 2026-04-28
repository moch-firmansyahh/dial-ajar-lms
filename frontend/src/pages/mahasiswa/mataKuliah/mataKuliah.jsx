import React, { useState } from "react";
import "../../../shared.css";
import "./mataKuliah.css";import "./videoMataKuliah.css";
import "./videoMataKuliah.css";
import Sidebar from "../../../Sidebar";
import { useSidebar } from "../../../useSidebar";
import Navbar from "../../../Navbar";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBLlRblArhYvkrSWfEx3UWaIaP5bdg8OpReWzF-sc4sB_2K3sC4IYv7Q4-lWy6VUtGhc5esYpVi12_HYjLZdjx6ILoT60xad1GfsEtHStVQIigk44gnAXnpEAjWrPWVYNa_AKdaDPqXQwdlJDbcccdQ96CZrZ6btx50rBBy3LvfY-eINJ1MtiJWLJpWBAo2nnbaNr3i-_Yn3B_BsVkOxpG3hVSKt38J2-NxnAah9LFYcNLvZARv4lzr86P24cdV4haCMW80Nudw5Lku";

const modules = [
  { id: 1, title: "Modul 1: Pengenal...", meta: "1.2 MB • Diperbarui 2 hari lalu", type: "pdf",   action: "download", status: "done" },
  { id: 2, title: "Modul 2: Konsep ...",  meta: "Sedang diputar...",               type: "video", action: "play",     status: "active" },
  { id: 3, title: "Modul 3: Normalis...", meta: "2.4 MB • PDF",                    type: "pdf",   action: "download", status: "" },
  { id: 4, title: "Modul 4: Dasar SQ...", meta: "1.8 MB • PDF",                   type: "pdf",   action: "download", status: "" },
];

export default function MataKuliah({ onNavigate, onLogout }) {
  const { sidebarOpen, openSidebar, closeSidebar } = useSidebar();
  const [activeModule, setActiveModule] = useState(2);
  const [toast, setToast] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  return (
    <div className="page-shell">
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: "5rem", right: "1.5rem", zIndex: 999,
          background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0",
          padding: "0.75rem 1.25rem", borderRadius: "0.75rem", fontWeight: 600,
          fontSize: "0.875rem", boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          display: "flex", alignItems: "center", gap: "0.5rem"
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: "1.1rem" }}>check_circle</span>
          {toast}
        </div>
      )}

      {/* Video Modal */}
      {videoOpen && (
        <div className="mk-video-modal" onClick={() => setVideoOpen(false)}>
          <div className="mk-video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="mk-video-modal-close" onClick={() => setVideoOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="mk-video-modal-header">
              <h3>Video Ajar: Konsep ERD</h3>
              <p>Durasi: 24 Menit • Modul 2</p>
            </div>
            <div className="mk-video-player-wrapper">
              <video
                className="mk-video-player"
                controls
                autoPlay
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                poster="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop"
              >
                Browser Anda tidak mendukung tag video.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* ─── Sidebar ─── */}
      <Sidebar onNavigate={onNavigate} onLogout={onLogout} activePage="mataKuliah" mobileOpen={sidebarOpen} onClose={closeSidebar} />

      {/* ─── Main ─── */}
      <main className="page-main">
        {/* Navbar */}
        <Navbar role="Mahasiswa" onOpenSidebar={openSidebar} onNavigate={typeof nav !== "undefined" ? nav : (typeof onNavigate !== "undefined" ? onNavigate : undefined)} />

        {/* Content */}
        <div className="page-content">
          {/* Course header */}
          <div className="mk-course-header">
            <span className="mk-faculty-badge">
              <span className="material-symbols-outlined">school</span>
              FAKULTAS INFORMATIKA
            </span>
            <h2 className="mk-course-title">Mata Kuliah: Sistem Basis Data</h2>
            <p className="mk-course-desc">
              Pelajari dasar-dasar perancangan data, normalisasi, dan manajemen sistem basis data relasional untuk membangun fondasi sistem informasi yang handal.
            </p>
          </div>

          {/* Body grid */}
          <div className="mk-body-grid">
            {/* Left */}
            <div className="mk-left-col">
              {/* Video Player */}
              <div className="mk-video-card">
                <div className="mk-video-thumb">
                  <img
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop"
                    alt="Video Ajar"
                  />
                  <div className="mk-video-overlay" onClick={() => setVideoOpen(true)} style={{ cursor: "pointer" }}>
                    <button className="mk-play-btn">
                      <span className="material-symbols-outlined">play_arrow</span>
                    </button>
                    <span className="mk-video-lbl">Putar Video</span>
                  </div>
                  <div className="mk-video-info">
                    <p className="mk-video-title">Video Ajar: Konsep ERD</p>
                    <p className="mk-video-meta">Durasi: 24 Menit • Modul 2</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mk-desc-card">
                <h3 className="mk-desc-heading">
                  <span className="material-symbols-outlined">info</span>
                  Deskripsi Materi
                </h3>
                <p className="mk-desc-body">
                  Sesi ini membahas transisi dari kebutuhan bisnis ke skema database teknis melalui teknik permodelan ERD (Entity-Relationship Diagram). Anda akan mempelajari bagaimana entitas, atribut, dan relasi saling berinteraksi.
                </p>
                <div className="mk-stats-row">
                  {[["12","Modul PDF","mataKuliah"],["05","Video Ajar","mataKuliah"],["03","Tugas","daftarTugas"],["01","Kuis","kuis"]].map(([n,l,page]) => (
                    <div key={l} className="mk-stat-chip" style={{ cursor: "pointer" }} onClick={() => onNavigate && onNavigate(page)}>
                      <p className="mk-stat-num">{n}</p>
                      <p className="mk-stat-lbl">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="mk-right-col">
              {/* Module List */}
              <div className="mk-module-card">
                <div className="mk-module-header">
                  <h3>Daftar Materi</h3>
                  <span className="mk-prog-badge">SELESAI 4/12</span>
                </div>
                <div className="mk-module-list">
                  {modules.map((m) => {
                    const isActive = m.id === activeModule;
                    return (
                      <div
                        key={m.id}
                        className={`mk-mod-item ${isActive ? "mk-mod-active" : ""}`}
                        onClick={() => {
                          setActiveModule(m.id);
                          if (m.type === "video") {
                            setVideoOpen(true);
                          }
                        }}
                      >
                        <div className={`mk-mod-icon ${m.type === "video" ? "mk-icon-video" : "mk-icon-pdf"} ${isActive ? "mk-icon-on" : ""}`}>
                          <span className="material-symbols-outlined">
                            {m.type === "video" ? "play_circle" : "picture_as_pdf"}
                          </span>
                        </div>
                        <div className="mk-mod-info">
                          <p className={`mk-mod-title ${isActive ? "mk-mod-title--active" : ""}`}>{m.title}</p>
                          <p className={`mk-mod-meta  ${isActive ? "mk-mod-meta--active"  : ""}`}>{m.meta}</p>
                          {isActive && <div className="mk-bar-track"><div className="mk-bar-fill"></div></div>}
                          {m.action === "download" && (
                            <button className="mk-dl-btn" onClick={() => showToast(`Mengunduh: ${m.title}`)}>
                              <span className="material-symbols-outlined">download</span>
                              Unduh Modul
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instructor */}
              <div className="mk-instructor-card">
                <p className="mk-inst-label">PENGAJAR</p>
                <div className="mk-inst-row">
                  <img className="mk-inst-avatar" src="https://i.pravatar.cc/80?img=47" alt="Dr. Sarah Wijaya" />
                  <div className="mk-inst-info">
                    <p className="mk-inst-name">Dr. Sarah Wijaya</p>
                    <p className="mk-inst-role">Dosen Basis Data</p>
                  </div>
                  <button className="mk-contact-btn" onClick={() => showToast("Email ke: drsarahwijaya@univ.ac.id")} title="Hubungi Dosen">
                    <span className="material-symbols-outlined">mail</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



