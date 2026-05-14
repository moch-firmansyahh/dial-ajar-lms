import React, { useState, useEffect } from "react";
import "../../../shared.css";
import "./mataKuliah.css";
import "./videoMataKuliah.css";
import Sidebar from "../../../Sidebar";
import { useSidebar } from "../../../useSidebar";
import Navbar from "../../../Navbar";
import { apiClient } from "../../../utils/apiClient";

export default function MataKuliah({ onNavigate, onLogout, idMataKuliah = 1 }) {
  const { sidebarOpen, openSidebar, closeSidebar } = useSidebar();
  const [activeModule, setActiveModule] = useState(null);
  const [toast, setToast] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pdf: 0, video: 0, tugas: 0, kuis: 0 });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const nim = user.nomorInduk || "";

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Fetch course detail
        const courseRes = await apiClient.get(`/api/mata-kuliah/${idMataKuliah}`);
        const courseData = courseRes.data || courseRes;
        setCourse(courseData);

        // Fetch materi dengan progress dari API baru
        const materiRes = await apiClient.get(`/api/materi/mata-kuliah/${idMataKuliah}?nim=${nim}`);
        const materiData = Array.isArray(materiRes) ? materiRes : (materiRes.data || []);
        
        const formattedModules = materiData.map((m, index) => ({
          id: m.id || index + 1,
          title: m.judul || "Materi Tanpa Judul",
          meta: m.tipe === "Video" ? "Video Pembelajaran" : "Dokumen PDF",
          type: m.tipe?.toLowerCase() === "video" ? "video" : "pdf",
          action: m.tipe?.toLowerCase() === "video" ? "play" : "download",
          status: "active",
          url: m.url || m.fileUrl || "",
          deskripsi: m.deskripsi || "Tidak ada deskripsi untuk modul ini.",
          sudahAkses: m.sudahAkses || false
        }));

        setModules(formattedModules.length > 0 ? formattedModules : [
          { id: 1, title: "Belum ada materi", meta: "-", type: "pdf", action: "none", status: "", deskripsi: "Dosen belum mengunggah materi.", sudahAkses: false }
        ]);
        if (formattedModules.length > 0) setActiveModule(formattedModules[0].id);

        // Hitung stats PDF dan Video
        const pdfCount = formattedModules.filter(m => m.type === "pdf").length;
        const videoCount = formattedModules.filter(m => m.type === "video").length;

        // Fetch tugas count
        let tugasCount = 0;
        try {
          const tugasRes = await apiClient.get(`/api/tugas?idMataKuliah=${idMataKuliah}`);
          const tugasData = Array.isArray(tugasRes) ? tugasRes : (tugasRes.data || []);
          tugasCount = tugasData.length;
        } catch(e) { /* ignore */ }

        // Fetch kuis count
        let kuisCount = 0;
        try {
          const kuisRes = await apiClient.get(`/api/kuis/mata-kuliah/${idMataKuliah}`);
          const kuisData = Array.isArray(kuisRes) ? kuisRes : (kuisRes.data || []);
          kuisCount = kuisData.length;
        } catch(e) { /* ignore */ }

        setStats({ pdf: pdfCount, video: videoCount, tugas: tugasCount, kuis: kuisCount });

      } catch (error) {
        console.error("Gagal memuat mata kuliah", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [idMataKuliah, nim]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  if (loading) {
    return <div className="page-shell"><main className="page-main"><div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>Memuat materi...</div></main></div>;
  }



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
              <h3>{modules.find(m => m.id === activeModule)?.title || "Video Pembelajaran"}</h3>
              <p>{modules.find(m => m.id === activeModule)?.meta || "Materi Video"}</p>
            </div>
            <div className="mk-video-player-wrapper">
              <video
                className="mk-video-player"
                controls
                autoPlay
                src={modules.find(m => m.id === activeModule)?.url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
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
            <h2 className="mk-course-title">Mata Kuliah: {course?.namaMataKuliah || course?.nama || "Mata Kuliah"}</h2>
            <p className="mk-course-desc">
              Silakan pelajari materi dan kerjakan tugas yang tersedia.
            </p>
          </div>

          {/* Body grid */}
          <div className="mk-body-grid">
            {/* Left */}
            <div className="mk-left-col">
              {/* Video Player or Thumbnail */}
              {(() => {
                const activeData = modules.find(m => m.id === activeModule) || modules[0];
                return (
                  <>
                    <div className="mk-video-card">
                      <div className="mk-video-thumb">
                        <img
                          src={activeData?.type === "video" ? "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop" : "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&auto=format&fit=crop"}
                          alt={activeData?.title}
                        />
                        <div className="mk-video-overlay" onClick={async () => {
                          if (activeData?.action === "play") {
                            // Mark video as accessed
                            try {
                              await apiClient.post(`/api/materi/${activeData.id}/access`, { nim });
                              // Update local state
                              setModules(prev => prev.map(mod => 
                                mod.id === activeData.id ? { ...mod, sudahAkses: true } : mod
                              ));
                            } catch (err) {
                              console.error("Failed to mark video access:", err);
                            }
                            setVideoOpen(true);
                          }
                          else if (activeData?.action === "download") window.open(`http://localhost:3000${activeData.url}`, '_blank');
                        }} style={{ cursor: "pointer" }}>
                          <button className="mk-play-btn">
                            <span className="material-symbols-outlined">{activeData?.action === "play" ? "play_arrow" : "download"}</span>
                          </button>
                          <span className="mk-video-lbl">{activeData?.action === "play" ? "Putar Video" : "Unduh Materi"}</span>
                        </div>
                        <div className="mk-video-info">
                          <p className="mk-video-title">{activeData?.title}</p>
                          <p className="mk-video-meta">{activeData?.meta}</p>
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
                        {activeData?.deskripsi}
                      </p>
                      <div className="mk-stats-row">
                        {[[String(stats.pdf).padStart(2,'0'),"Modul PDF","mataKuliah"],[String(stats.video).padStart(2,'0'),"Video Ajar","mataKuliah"],[String(stats.tugas).padStart(2,'0'),"Tugas","daftarTugas"],[String(stats.kuis).padStart(2,'0'),"Kuis","kuis"]].map(([n,l,page]) => (
                          <div key={l} className="mk-stat-chip" style={{ cursor: "pointer" }} onClick={() => onNavigate && onNavigate(page)}>
                            <p className="mk-stat-num">{n}</p>
                            <p className="mk-stat-lbl">{l}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Right */}
            <div className="mk-right-col">
              {/* Module List */}
              <div className="mk-module-card">
                <div className="mk-module-header">
                  <h3>Daftar Materi</h3>
                  <span className="mk-prog-badge">{modules.length} MODUL</span>
                </div>
                <div className="mk-module-list">
                  {modules.map((m) => {
                    const isActive = m.id === activeModule;
                    return (
                      <div
                        key={m.id}
                        className={`mk-mod-item ${isActive ? "mk-mod-active" : ""}`}
                        onClick={async () => {
                          setActiveModule(m.id);
                          if (m.type === "video") {
                            // Mark video as accessed
                            try {
                              await apiClient.post(`/api/materi/${m.id}/access`, { nim });
                              // Update local state
                              setModules(prev => prev.map(mod => 
                                mod.id === m.id ? { ...mod, sudahAkses: true } : mod
                              ));
                            } catch (err) {
                              console.error("Failed to mark video access:", err);
                            }
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
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <p className={`mk-mod-title ${isActive ? "mk-mod-title--active" : ""}`}>{m.title}</p>
                            {/* Green checkmark for accessed materials */}
                            {m.sudahAkses && (
                              <span 
                                className="material-symbols-outlined" 
                                style={{ 
                                  color: "#059669", 
                                  fontSize: "1.1rem",
                                  background: "#ecfdf5",
                                  borderRadius: "50%",
                                  padding: "2px"
                                }}
                              >
                                check_circle
                              </span>
                            )}
                          </div>
                          <p className={`mk-mod-meta  ${isActive ? "mk-mod-meta--active"  : ""}`}>{m.meta}</p>
                          {m.action === "download" && (
                            <button 
                              className="mk-dl-btn" 
                              onClick={async (e) => {
                                e.stopPropagation();
                                // Mark as accessed
                                try {
                                  await apiClient.post(`/api/materi/${m.id}/access`, { nim });
                                  // Update local state
                                  setModules(prev => prev.map(mod => 
                                    mod.id === m.id ? { ...mod, sudahAkses: true } : mod
                                  ));
                                } catch (err) {
                                  console.error("Failed to mark access:", err);
                                }
                                showToast(`Mengunduh: ${m.title}`);
                                // Use absolute URL if provided, otherwise prepend base URL
                                const fileUrl = m.url?.startsWith('http') ? m.url : `http://localhost:3000${m.url}`;
                                window.open(fileUrl, '_blank');
                              }}
                            >
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
                  <div className="mk-inst-avatar" style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #2f9696, #4b53bc)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>
                    {(course?.dosen?.user?.nama || course?.dosenNama || "??").split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div className="mk-inst-info">
                    <p className="mk-inst-name">{course?.dosen?.user?.nama || course?.dosenNama || "Dosen"}</p>
                    <p className="mk-inst-role">Dosen {course?.namaMataKuliah || course?.nama || ""}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



