CREATE DATABASE IF NOT EXISTS lms_pbo;
USE lms_pbo;

-- ─── USERS (base dari abstract class User) ───────────────────────────────
CREATE TABLE users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    nomor_induk VARCHAR(20)  NOT NULL UNIQUE,  -- NIM atau NIP
    nama        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,          -- disimpan dalam bentuk BCrypt hash
    role        ENUM('MAHASISWA', 'DOSEN') NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── MAHASISWA (extends User) ────────────────────────────────────────────
CREATE TABLE mahasiswa (
    id       BIGINT PRIMARY KEY,
    nim      VARCHAR(20) NOT NULL UNIQUE,
    semester INT NOT NULL DEFAULT 1,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── DOSEN (extends User) ─────────────────────────────────────────────────
CREATE TABLE dosen (
    id  BIGINT PRIMARY KEY,
    nip VARCHAR(20) NOT NULL UNIQUE,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── MATA KULIAH ──────────────────────────────────────────────────────────
CREATE TABLE mata_kuliah (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    nama       VARCHAR(100) NOT NULL,
    kode_kelas VARCHAR(20)  NOT NULL UNIQUE,  -- generate otomatis saat dibuat
    dosen_id   BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dosen_id) REFERENCES users(id)
);

-- ─── MATA KULIAH MAHASISWA (relasi gabung kelas) ──────────────────────────
CREATE TABLE mata_kuliah_mahasiswa (
    mata_kuliah_id BIGINT NOT NULL,
    mahasiswa_id   BIGINT NOT NULL,
    joined_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (mata_kuliah_id, mahasiswa_id),
    FOREIGN KEY (mata_kuliah_id) REFERENCES mata_kuliah(id) ON DELETE CASCADE,
    FOREIGN KEY (mahasiswa_id)   REFERENCES users(id) ON DELETE CASCADE
);

-- ─── MODUL AJAR (implements Downloadable) ────────────────────────────────
CREATE TABLE modul_ajar (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    judul          VARCHAR(200) NOT NULL,
    tipe           VARCHAR(20)  NOT NULL,   -- PDF, DOCX, dll.
    file_path      VARCHAR(500),
    mata_kuliah_id BIGINT NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mata_kuliah_id) REFERENCES mata_kuliah(id) ON DELETE CASCADE
);

-- ─── VIDEO AJAR (implements Downloadable) ────────────────────────────────
CREATE TABLE video_ajar (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    judul          VARCHAR(200) NOT NULL,
    link_video     VARCHAR(500) NOT NULL,
    mata_kuliah_id BIGINT NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mata_kuliah_id) REFERENCES mata_kuliah(id) ON DELETE CASCADE
);

-- ─── TUGAS (implements Downloadable) ─────────────────────────────────────
CREATE TABLE tugas (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    judul          VARCHAR(200) NOT NULL,
    detail_tugas   TEXT,
    deadline       DATETIME NOT NULL,
    file_soal      VARCHAR(500),
    mata_kuliah_id BIGINT NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mata_kuliah_id) REFERENCES mata_kuliah(id) ON DELETE CASCADE
);

-- ─── PENGUMPULAN TUGAS ────────────────────────────────────────────────────
CREATE TABLE pengumpulan_tugas (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    tugas_id     BIGINT,
    kuis_id      BIGINT,
    mahasiswa_id BIGINT NOT NULL,
    file_jawaban VARCHAR(500),
    nilai        DOUBLE,
    status       ENUM('BELUM_KUMPUL', 'SUDAH_KUMPUL', 'SUDAH_DINILAI') DEFAULT 'BELUM_KUMPUL',
    dikumpulkan  TIMESTAMP,
    FOREIGN KEY (tugas_id)     REFERENCES tugas(id) ON DELETE CASCADE,
    FOREIGN KEY (kuis_id)      REFERENCES kuis(id) ON DELETE CASCADE,
    FOREIGN KEY (mahasiswa_id) REFERENCES users(id)
);

-- ─── KUIS ─────────────────────────────────────────────────────────────────
CREATE TABLE kuis (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    judul          VARCHAR(200) NOT NULL,
    deadline       DATETIME NOT NULL,
    mata_kuliah_id BIGINT NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mata_kuliah_id) REFERENCES mata_kuliah(id) ON DELETE CASCADE
);

-- ─── SOAL ─────────────────────────────────────────────────────────────────
CREATE TABLE soal (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    kuis_id         BIGINT NOT NULL,
    pertanyaan      TEXT NOT NULL,
    pilihan_a       VARCHAR(500),
    pilihan_b       VARCHAR(500),
    pilihan_c       VARCHAR(500),
    pilihan_d       VARCHAR(500),
    kunci_jawaban   VARCHAR(5) NOT NULL,
    skor            DOUBLE NOT NULL DEFAULT 10,
    tipe            ENUM('PILIHAN_GANDA', 'ESSAY') DEFAULT 'PILIHAN_GANDA',
    FOREIGN KEY (kuis_id) REFERENCES kuis(id) ON DELETE CASCADE
);

-- ─── JAWABAN KUIS ─────────────────────────────────────────────────────────
CREATE TABLE jawaban_kuis (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    kuis_id      BIGINT NOT NULL,
    mahasiswa_id BIGINT NOT NULL,
    soal_id      BIGINT NOT NULL,
    jawaban_user VARCHAR(500),
    is_benar     BOOLEAN,
    dikerjakan   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kuis_id)      REFERENCES kuis(id) ON DELETE CASCADE,
    FOREIGN KEY (mahasiswa_id) REFERENCES users(id),
    FOREIGN KEY (soal_id)      REFERENCES soal(id)
);

-- ─── NILAI ────────────────────────────────────────────────────────────────
CREATE TABLE nilai (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    mahasiswa_id   BIGINT NOT NULL,
    mata_kuliah_id BIGINT NOT NULL,
    nilai_tugas    DOUBLE DEFAULT 0,
    nilai_kuis     DOUBLE DEFAULT 0,
    nilai_akhir    DOUBLE DEFAULT 0,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mahasiswa_id)   REFERENCES users(id),
    FOREIGN KEY (mata_kuliah_id) REFERENCES mata_kuliah(id) ON DELETE CASCADE
);

-- ─── FORUM DISKUSI ────────────────────────────────────────────────────────
CREATE TABLE forum_diskusi (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    judul          VARCHAR(200) NOT NULL,
    isi_forum      TEXT NOT NULL,
    pembuat_id     BIGINT NOT NULL,
    mata_kuliah_id BIGINT NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pembuat_id)     REFERENCES users(id),
    FOREIGN KEY (mata_kuliah_id) REFERENCES mata_kuliah(id) ON DELETE CASCADE
);

-- ─── KOMENTAR FORUM ───────────────────────────────────────────────────────
CREATE TABLE komentar_forum (
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    forum_id  BIGINT NOT NULL,
    penulis_id BIGINT NOT NULL,
    isi       TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (forum_id)   REFERENCES forum_diskusi(id) ON DELETE CASCADE,
    FOREIGN KEY (penulis_id) REFERENCES users(id)
);

-- ─── NOTIFIKASI (fitur tambahan) ──────────────────────────────────────────
CREATE TABLE notifikasi (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT NOT NULL,       -- mahasiswa penerima
    judul        VARCHAR(200) NOT NULL,
    pesan        TEXT NOT NULL,
    tipe         ENUM('TUGAS_BARU', 'MODUL_BARU', 'DEADLINE_H3', 'DEADLINE_H1') NOT NULL,
    is_dibaca    BOOLEAN DEFAULT FALSE,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── KALENDER KAMPUS (fitur tambahan, diisi developer) ───────────────────
CREATE TABLE kalender_kampus (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    tanggal     DATE NOT NULL,
    judul       VARCHAR(200) NOT NULL,
    deskripsi   TEXT,
    tipe        ENUM('LIBUR', 'ACARA') NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
