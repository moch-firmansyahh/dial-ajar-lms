# Dial Ajar - Learning Management System

## Dosen Pengampu

Ibu Putri Nurika Adila, S.Kom., M.Kom

## Anggota Kelompok

1. Moch Firmansyah - 103012400137
2. Listianto Hilmi Fauzaan - 103012400094
3. Muhammad Daffa - 103012400110
4. Muhammad Lutfi Fitriansyah - 103012400237
5. Junior Mourits Hotty - 1030124174

## Deskripsi Aplikasi

**Dial Ajar** adalah sebuah platform _Learning Management System (LMS)_ modern yang memfasilitasi interaksi belajar mengajar antara Dosen dan Mahasiswa. Aplikasi ini menyediakan sistem manajemen mata kuliah, distribusi materi ajar (dokumen PDF/Word & Video), sistem evaluasi (tugas & kuis otomatis), hingga forum diskusi interaktif secara _real-time_. Antarmuka dirancang dengan responsivitas tinggi (_Mobile-Friendly_) dan dipadukan dengan animasi modern yang halus untuk pengalaman pengguna terbaik.

## Framework & Teknologi Utama

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Java Spring Boot (Web, Data JPA, Security)
- **Database**: MySQL

## Library & Dependensi

### Frontend

- **Zustand** (Manajemen State)
- **@tanstack/react-query** (Pengambilan Data & Caching)
- **Axios** (Klien HTTP)
- **GSAP** (Animasi UI/UX Modern)
- **react-router-dom** (Navigasi / Routing antar halaman)
- **lucide-react** (Kumpulan Ikon SVG ringan)
- **react-datepicker** & **date-holidays** (Komponen Kalender dan pencarian hari libur Indonesia)
- **mammoth** (Pratinjau ekstraksi dokumen)

### Backend

- **io.jsonwebtoken (JWT)** (Autentikasi & Otorisasi Token)
- **Spring Security** (Keamanan akses API)
- **Spring Data JPA** (Pemetaan Objek Database / ORM)
- **MySQL Connector J** (Driver penyambung ke MySQL)

## Fitur-Fitur Tersedia

1. **Sistem Autentikasi & Hak Akses Berjenjang**
   - Registrasi & Login menggunakan JWT.
   - Akses Dosen & Mahasiswa yang terpisah (Role-Based Access Control).
2. **Manajemen Kelas / Mata Kuliah**
   - Dosen dapat membuat kelas baru.
   - Mahasiswa dapat bergabung ke kelas menggunakan _Kode Kelas_.
3. **Materi Pembelajaran & Modul**
   - Mengunggah & mengunduh berkas (PDF / Word).
   - Menautkan Video Ajar (URL atau Unggah langsung).
4. **Sistem Evaluasi (Tugas & Kuis)**
   - Dosen dapat memberikan tugas (esai / unggah file).
   - Dosen dapat membuat kuis yang dilengkapi soal pilihan ganda maupun esai.
   - Kuis Pilihan Ganda memiliki **penilaian otomatis (Auto-Grading)**.
   - Tabel Penilaian (_Gradebook_) khusus untuk dosen menilai pekerjaan.
5. **Forum Diskusi**
   - Pembuatan utas (_thread_) baru per mata kuliah.
   - Sistem komentar dan balasan diskusi terpadu antar pengguna.
6. **Kalender Akademik Pintar**
   - Secara dinamis menarik semua data Tenggat Waktu (_Deadline_) Tugas & Kuis dari _database_.
   - Terintegrasi secara otomatis dengan **Hari Libur Nasional Indonesia** (Tanggal Merah).

## Class Diagram

![Class Diagram](assets/Class-Diagram/class-diagram.png)

## Cara Instalasi & Penggunaan

### Persyaratan Sistem Utama

- **Java 21** atau versi terbaru.
- **Maven** (Bawaan wrapper tersedia).
- **Node.js** (Minimal v18 ke atas).
- **MySQL Server** aktif dan berjalan.

### 1. Menyiapkan Database (MySQL)

1. Buka DBMS MySQL (contoh: via XAMPP, MySQL Workbench, atau terminal).
2. Buat satu database baru untuk aplikasi ini dengan perintah:
   ```sql
   CREATE DATABASE lms_db;
   ```

### 2. Konfigurasi & Menjalankan Backend (Spring Boot)

1. Buka jendela terminal (Command Prompt/PowerShell) lalu arahkan ke _folder_ `backend`:
   ```bash
   cd backend
   ```
2. Pastikan file konfigurasi yang terletak di `src/main/resources/application.properties` sudah memiliki akses database yang sesuai.
   _(Catatan: Konfigurasi default menggunakan user `root` tanpa password di port `3306`.)_
3. Jalankan aplikasi menggunakan Maven Wrapper:
   - Untuk pengguna **Windows**:
     ```cmd
     mvnw.cmd spring-boot:run
     ```
   - Untuk pengguna **Mac/Linux**:
     ```bash
     ./mvnw spring-boot:run
     ```
4. Tunggu beberapa saat. Backend API siap melayani dan berjalan di alamat port `http://localhost:8080`.

### 3. Menjalankan Frontend (React Vite)

1. Buka jendela terminal yang baru (jangan tutup terminal backend sebelumnya) lalu arahkan ke _folder_ `frontend`:
   ```bash
   cd frontend
   ```
2. Install seluruh dependensi paket Node dengan perintah:
   ```bash
   npm install
   ```
3. Mulai server pengembangan (_development server_):
   ```bash
   npm run dev
   ```
4. Terminal akan memberikan alamat lokal (biasanya `http://localhost:5173`). Buka _link_ tersebut di browser Anda (Google Chrome/Edge/Firefox).

### Akun Testing (Demo)
Aplikasi ini sudah menyediakan data uji coba (seeder) yang bisa Anda gunakan langsung untuk login:

**Akun Dosen:**
- **NIP:** `101`, `102`, `103`, `104`, atau `105`
- **Password:** `dosen123`

**Akun Mahasiswa:**
- **NIM:** `201`, `202`, `203`, ... sampai `2010`
- **Password:** `mhs123`

---

**Selesai! ✨**  
Aplikasi LMS siap digunakan. Anda dapat menggunakan akun *testing* di atas untuk mengeksplorasi seluruh fitur yang ada!
