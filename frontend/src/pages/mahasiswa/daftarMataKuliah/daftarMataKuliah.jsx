import React, { useState } from "react";
import "../../../shared.css";
import "./daftarMataKuliah.css";
import Sidebar from "../../../Sidebar";
import { useSidebar } from "../../../useSidebar";
import Navbar from "../../../Navbar";

const courses = [
  { id: "algoritma", name: "Algoritma Pemrograman",    category: "INFORMATIKA",      icon: "code",       desc: "Pelajari dasar-dasar logika pemrograman, struktur kendali, dan implementasi efisien menggunakan bahasa C++.",                                                               progress: 75 },
  { id: "basisData", name: "Sistem Basis Data",        category: "BASIS DATA",        icon: "table_rows", desc: "Pemahaman mendalam tentang relasi data, normalisasi, SQL tingkat lanjut, dan manajemen database enterprise.",                                                              progress: 40 },
  { id: "agama",     name: "Agama",                    category: "HUMANIORA",         icon: "menu_book",  desc: "Eksplorasi nilai-nilai moral, spiritualitas, dan peran agama dalam membangun karakter profesional yang beretika.",                                                          progress: 90 },
  { id: "pancasila", name: "Pancasila",                category: "KEWARGANEGARAAN",   icon: "balance",    desc: "Studi mendalam filsafat negara, sejarah perjuangan bangsa, dan implementasi nilai Pancasila dalam kehidupan bernegara.",                                                  progress: 60 },
  { id: "pbo",       name: "Pemrograman Berorientasi Objek", category: "INFORMATIKA", icon: "code_blocks",desc: "Konsep OOP: class, object, inheritance, polymorphism, dan encapsulation menggunakan Java dan Python.",                                                                    progress: 50 },
  { id: "desain",    name: "Analisis Desain Interaksi",category: "INFORMATIKA",        icon: "design_services", desc: "Human-Computer Interaction, Fitts' Law, prinsip Gestalt, dan prototyping antarmuka yang intuitif.",                                                                progress: 30 },
];

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBLlRblArhYvkrSWfEx3UWaIaP5bdg8OpReWzF-sc4sB_2K3sC4IYv7Q4-lWy6VUtGhc5esYpVi12_HYjLZdjx6ILoT60xad1GfsEtHStVQIigk44gnAXnpEAjWrPWVYNa_AKdaDPqXQwdlJDbcccdQ96CZrZ6btx50rBBy3LvfY-eINJ1MtiJWLJpWBAo2nnbaNr3i-_Yn3B_BsVkOxpG3hVSKt38J2-NxnAah9LFYcNLvZARv4lzr86P24cdV4haCMW80Nudw5Lku";

export default function DaftarMataKuliah({ onNavigate, onLogout }) {
  const { sidebarOpen, openSidebar, closeSidebar } = useSidebar();

  return (
    <div className="page-shell" style={{ backgroundColor: "var(--color-background)" }}>
      {/* ─── Sidebar ─── */}
      <Sidebar
        onNavigate={onNavigate}
        onLogout={onLogout}
        activePage="daftarMataKuliah"
        mobileOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* ─── Main ─── */}
      <main className="page-main" style={{ backgroundColor: "var(--color-background)" }}>
        {/* Navbar */}
        <Navbar role="Mahasiswa" onOpenSidebar={openSidebar} onNavigate={typeof nav !== "undefined" ? nav : (typeof onNavigate !== "undefined" ? onNavigate : undefined)} />

        {/* Hero Banner */}
        <div className="dm-hero">
          <img
            className="dm-hero-bg"
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop"
            alt="Hero"
          />
          <div className="dm-hero-overlay"></div>
          <div className="dm-hero-content">
            <h2 className="dm-hero-title">Daftar Mata Kuliah Saya</h2>
            <p className="dm-hero-subtitle">Selamat Belajar – Tetap Semangat!</p>
          </div>
        </div>

        {/* Course Grid */}
        <div className="dm-grid-wrap">
          <div className="dm-course-grid">
            {courses.map((c) => (
              <div key={c.id} className="dm-course-card">
                <div className="dm-card-top">
                  <div className="dm-course-icon">
                    <span className="material-symbols-outlined">{c.icon}</span>
                  </div>
                  <span className="dm-cat-badge">{c.category}</span>
                </div>
                <h3 className="dm-course-name">{c.name}</h3>
                <p className="dm-course-desc">{c.desc}</p>
                <div className="dm-progress-row">
                  <p className="dm-prog-label">Progress Belajar</p>
                  <p className="dm-prog-pct">{c.progress}% Selesai</p>
                </div>
                <div className="dm-prog-track">
                  <div className="dm-prog-fill" style={{ width: `${c.progress}%` }}></div>
                </div>
                <button
                  className="dm-lihat-btn"
                  onClick={() => onNavigate && onNavigate("mataKuliah")}
                >
                  Lihat Materi →
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
