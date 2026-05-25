# Panduan Testing Postman (Role-Based & DFD Aligned)

Panduan ini berisi cara melakukan _testing_ seluruh 97 endpoint API pada sistem LeMaS menggunakan Postman. Pengelompokan sudah disesuaikan persis dengan Traceability Matrix DFD Level 1, dan dipisahkan berdasarkan Role (Dosen/Mahasiswa) sesuai dengan kebutuhan akses sistem.

> **PENTING: Aturan Token**
> Hampir semua endpoint membutuhkan otorisasi. Anda **WAJIB** melakukan Login pada bagian **S9 - Login & Auth** (pilih `Login Mahasiswa` atau `Login Dosen`) terlebih dahulu. Sistem secara otomatis akan menyimpan token dan menyiapkannya di tab **Authorization -> Type: Bearer Token** untuk request selanjutnya.

---

## S9 - Login & Auth

### 1. Login Mahasiswa
- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/login`
- **Body (`raw JSON`):**
  ```json
  {
    "nomorInduk": "U001",
    "password": "password123"
  }
  ```

### 2. Login Dosen
- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/login`
- **Body (`raw JSON`):**
  ```json
  {
    "nomorInduk": "D001",
    "password": "password123"
  }
  ```

### 3. Health Check
- **Method:** `GET`
- **URL:** `{{base_url}}/ping`

---

## S2 - Kelola Anggota (Kelompok)

### 1. Get Semua Kelompok
- **Method:** `GET`
- **URL:** `{{base_url}}/api/kelompok`

### 2. Get Semua Mahasiswa
- **Method:** `GET`
- **URL:** `{{base_url}}/api/kelompok/mahasiswa/all`

### 3. Get Kelompok per Mata Kuliah
- **Method:** `GET`
- **URL:** `{{base_url}}/api/kelompok/13`

### 4. Buat Kelompok Baru
- **Method:** `POST`
- **URL:** `{{base_url}}/api/kelompok`
- **Body (`raw JSON`):**
  ```json
  {
    "name": "Kelompok A",
    "idMataKuliah": 13,
    "task": "Proyek Akhir Web"
  }
  ```

### 5. Tambah Anggota Kelompok
- **Method:** `POST`
- **URL:** `{{base_url}}/api/kelompok/1/members`
- **Body (`raw JSON`):**
  ```json
  {
    "nim": "2026001"
  }
  ```

### 6. Hapus Anggota Kelompok
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/kelompok/1/members/2026001`

### 7. Simpan Nilai Kelompok
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/kelompok/1/grades`
- **Body (`raw JSON`):**
  ```json
  {
    "grades": {
      "2026001": "85",
      "2026002": "90"
    }
  }
  ```

### 8. Get Kelompok per Mata Kuliah (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/kelompok/1`

### 9. Hapus Anggota Kelompok (Dosen)
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/kelompok/1/members/1`

### 10. [DELETE] /api/kelompok/:idKelompok (Dosen)
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/kelompok/1`

### 11. Buat User (Dosen)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/users/users`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 12. Get Semua Users (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/users/users`

### 13. Update User (Dosen)
- **Method:** `PATCH`
- **URL:** `{{base_url}}/api/users/users/1`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 14. Hapus User (Dosen)
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/users/users/1`

---

## S1 - Kelola Tugas

### 1. Get Semua Tugas (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/dosen/tugas`

### 2. Get Tugas per Mata Kuliah (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/dosen/tugas/mata-kuliah/13`

### 3. Buat Tugas Baru (Dosen)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/dosen/tugas`
- **Body (`form-data`):**
  - `judul`: Website Portfolio dengan HTML & CSS
  - `detailTugas`: Buat website portfolio pribadi menggunakan HTML5 dan CSS3.
  - `deadlineTugas`: 2026-06-01T23:59:00.000Z
  - `tipeTugas`: Individu
  - `idMataKuliah`: 13
  - `fileTugas`: *(File Upload)*

### 4. Hapus Tugas (Dosen)
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/dosen/tugas/1`

### 5. Get Daftar Tugas (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/tugas`

### 6. Get Detail Tugas (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/tugas/1`

### 7. Get Semua Kuis (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/kuis`

### 8. Get Detail Kuis (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/kuis/1/detail`

### 9. Get Soal Kuis (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/kuis/1/soal`

### 10. Buat Kuis Baru (Dosen)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/kuis`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 11. Hapus Kuis (Dosen)
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/kuis/1`

---

## S3 - Kelola Deadline

### 1. Update Tugas + Deadline (Dosen)
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/dosen/tugas/1`
- **Body (`form-data`):**
  - `judul`: Website Portfolio (Update)
  - `deadlineTugas`: 2026-06-10T23:59:00.000Z

### 2. Cek Deadline Tugas (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/tugas/1`

### 3. Get Daftar Kuis per Matkul (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/kuis/mata-kuliah/1`

### 4. Update Kuis + Deadline (Dosen)
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/kuis/1`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

---

## S5 - Upload Tugas

### 1. Submit / Upload Jawaban Tugas
- **Method:** `POST`
- **URL:** `{{base_url}}/api/tugas/1/submit`
- **Body (`form-data`):**
  - `file`: *(File Upload)*
  - `catatan`: Berikut terlampir jawaban tugas saya.

### 2. Cek Status Pengumpulan
- **Method:** `GET`
- **URL:** `{{base_url}}/api/tugas/1/submission`

### 3. Hapus Pengumpulan
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/tugas/submission/1`

### 4. Submit / Upload Jawaban Tugas (Mahasiswa)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/kuis/1/submit`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 5. Cek Status Pengerjaan Kuis (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/kuis/1/status`

---

## S4 - Monitoring Progress

### 1. Get Materi + Status Progress
- **Method:** `GET`
- **URL:** `{{base_url}}/api/materi/mata-kuliah/13`

### 2. Tandai Materi Sudah Diakses
- **Method:** `POST`
- **URL:** `{{base_url}}/api/materi/1/access`
- **Body:** *(Kosong atau isi form-data/JSON sesuai kebutuhan)*

### 3. Get Progress Summary Materi
- **Method:** `GET`
- **URL:** `{{base_url}}/api/materi/mata-kuliah/13/progress`

### 4. Dashboard Mahasiswa
- **Method:** `GET`
- **URL:** `{{base_url}}/api/dashboard`

### 5. Dashboard Dosen
- **Method:** `GET`
- **URL:** `{{base_url}}/api/dosen/dashboard`

### 6. Get Materi per Matkul (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/materi/mata-kuliah/1`

### 7. Get Materi per Matkul (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/materi/mata-kuliah/1`

### 8. Get Progress Summary Materi (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/materi/mata-kuliah/1/progress`

### 9. Get Progress Summary Materi (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/materi/mata-kuliah/1/progress`

### 10. Get Modul Ajar (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/modul-ajar`

### 11. Get Modul Ajar (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/modul-ajar`

### 12. Buat Modul Ajar (Dosen)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/modul-ajar`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 13. Update Modul Ajar (Dosen)
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/modul-ajar/1`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 14. Hapus Modul Ajar (Dosen)
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/modul-ajar/1`

---

## S6 - Presensi

### 1. Generate Sesi Presensi + Token QR (Dosen)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/dosen/presensi/matkul/13/generate`
- **Body (`raw JSON`):**
  ```json
  {
    "tanggal": "2026-05-15"
  }
  ```

### 2. Get Daftar Hadir Terbaru (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/dosen/presensi/matkul/13/daftar-hadir`

### 3. Get Daftar Hadir per Tanggal (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/dosen/presensi/daftar-hadir/13/2026-05-15`

### 4. Get Semua Tanggal Presensi (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/dosen/presensi/dates/13`

### 5. Update Status Kehadiran by NIM (Dosen)
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/dosen/presensi/nim/2026001/matkul/13/status`
- **Body (`raw JSON`):**
  ```json
  {
    "statusKehadiran": "Hadir"
  }
  ```

### 6. Scan QR Code (Mahasiswa)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/presensi/scan`
- **Body (`raw JSON`):**
  ```json
  {
    "token": "LeMaS-1234567890-abc123",
    "idMataKuliah": 13
  }
  ```

### 7. Get Rekap Presensi Mahasiswa
- **Method:** `GET`
- **URL:** `{{base_url}}/api/presensi/mahasiswa/13`

### 8. Get Summary Presensi
- **Method:** `GET`
- **URL:** `{{base_url}}/api/presensi/summary/13`

### 9. Get Presensi by Matkul (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/presensi/mata-kuliah/1`

### 10. Get Rekap Presensi Mahasiswa (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/presensi/mahasiswa/1`

### 11. Get Summary Presensi (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/presensi/summary/1`

---

## S7 - Penilaian

### 1. Get Daftar Tugas Unik per Matkul (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/nilai/tugas-list/13`

### 2. Get List Mahasiswa + Status Kumpul per Tugas
- **Method:** `GET`
- **URL:** `{{base_url}}/api/nilai/submissions/tugas/1`

### 3. Simpan Nilai Tugas Individu
- **Method:** `POST`
- **URL:** `{{base_url}}/api/nilai/submissions/nilai`
- **Body (`raw JSON`):**
  ```json
  {
    "nim": "2026001",
    "idMataKuliah": 13,
    "nilaiTugas": 88
  }
  ```

### 4. Get Nilai per Mata Kuliah
- **Method:** `GET`
- **URL:** `{{base_url}}/api/nilai/mata-kuliah/13`

### 5. Get Transkrip Nilai Mahasiswa
- **Method:** `GET`
- **URL:** `{{base_url}}/api/nilai/transkrip/mahasiswa`

### 6. Update Nilai (UTS/UAS/Akhir)
- **Method:** `PATCH`
- **URL:** `{{base_url}}/api/nilai/1`
- **Body (`raw JSON`):**
  ```json
  {
    "nilaiUTS": 80,
    "nilaiUAS": 85,
    "nilaiAkhir": 83
  }
  ```

### 7. Get Hasil Kuis (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/kuis/1/hasil`

### 8. [POST] /api/nilai (Dosen)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/nilai`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 9. [GET] /api/nilai (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/nilai`

### 10. Get Nilai per Mata Kuliah (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/nilai/mata-kuliah/1`

### 11. [GET] /api/nilai/mahasiswa/:idMataKuliah (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/nilai/mahasiswa/1`

### 12. [GET] /api/nilai/submissions/individu/:idMataKuliah (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/nilai/submissions/individu/1`

---

## S8 - Diskusi (Forum)

### 1. Get Thread Forum per Matkul
- **Method:** `GET`
- **URL:** `{{base_url}}/api/forum/mata-kuliah/13`

### 2. Buat Thread Forum Baru
- **Method:** `POST`
- **URL:** `{{base_url}}/api/forum/thread`
- **Body (`raw JSON`):**
  ```json
  {
    "idMataKuliah": 13,
    "judul": "Diskusi Pertemuan 1",
    "isiForum": "Silakan bertanya mengenai materi HTML & CSS..."
  }
  ```

### 3. Edit Thread Forum
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/forum/thread/1`
- **Body (`raw JSON`):**
  ```json
  {
    "judul": "Diskusi Pertemuan 1 (Update)",
    "isiForum": "Isi diskusi diperbarui..."
  }
  ```

### 4. Hapus Thread Forum
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/forum/thread/1`

### 5. Tambah Komentar
- **Method:** `POST`
- **URL:** `{{base_url}}/api/forum/comment`
- **Body (`raw JSON`):**
  ```json
  {
    "idForum": 1,
    "isiKomentar": "Terima kasih materinya sangat membantu!"
  }
  ```

### 6. Edit Komentar
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/forum/comment/1`
- **Body (`raw JSON`):**
  ```json
  {
    "isiKomentar": "Komentar diperbarui..."
  }
  ```

### 7. Hapus Komentar
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/forum/comment/1`

### 8. Toggle Like Forum
- **Method:** `POST`
- **URL:** `{{base_url}}/api/forum/like`
- **Body (`raw JSON`):**
  ```json
  {
    "idForum": 1
  }
  ```

### 9. Get Thread Forum per Matkul (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/forum/mata-kuliah/1`

### 10. Get Thread Forum per Matkul (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/forum/mata-kuliah/1`

### 11. Upload Gambar Forum (Dosen)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/forum/upload-image`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 12. Upload Gambar Forum (Mahasiswa)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/forum/upload-image`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

---

## Endpoint Pendukung (Lainnya)

### 1. [GET] /api (Dosen) (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api`

### 2. [GET] /api (Mahasiswa) (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api`

### 3. [GET] /api/mahasiswa (Dosen) (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/mahasiswa`

### 4. [GET] /api/mahasiswa (Mahasiswa) (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/mahasiswa`

### 5. Get Mata Kuliah by ID (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/mata-kuliah/1`

### 6. Get Mata Kuliah by ID (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/mata-kuliah/1`

### 7. [POST] /api (Dosen) (Dosen)
- **Method:** `POST`
- **URL:** `{{base_url}}/api`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 8. [POST] /api (Mahasiswa) (Mahasiswa)
- **Method:** `POST`
- **URL:** `{{base_url}}/api`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 9. [POST] /api/:idForum/reply (Dosen) (Dosen)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/1/reply`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 10. [POST] /api/:idForum/reply (Mahasiswa) (Mahasiswa)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/1/reply`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 11. [POST] /api/:idForum/like (Dosen) (Dosen)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/1/like`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 12. [POST] /api/:idForum/like (Mahasiswa) (Mahasiswa)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/1/like`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 13. Ubah Password (Dosen)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/profile/change-password`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 14. Ubah Password (Mahasiswa)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/profile/change-password`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 15. Hitung Notifikasi Belum Dibaca (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/notifikasi/unread-count`

### 16. Hitung Notifikasi Belum Dibaca (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/notifikasi/unread-count`

### 17. [GET] /api/matkul/:idMataKuliah/daftar-hadir (Dosen) (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/matkul/1/daftar-hadir`

### 18. [GET] /api/matkul/:idMataKuliah/daftar-hadir (Mahasiswa) (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/matkul/1/daftar-hadir`

### 19. [PUT] /api/:idPresensi/status (Dosen) (Dosen)
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/1/status`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 20. [PUT] /api/:idPresensi/status (Mahasiswa) (Mahasiswa)
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/1/status`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 21. [PUT] /api/nim/:nim/matkul/:idMataKuliah/status (Dosen) (Dosen)
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/nim/1/matkul/1/status`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 22. [PUT] /api/nim/:nim/matkul/:idMataKuliah/status (Mahasiswa) (Mahasiswa)
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/nim/1/matkul/1/status`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 23. [POST] /api/matkul/:idMataKuliah/generate (Dosen) (Dosen)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/matkul/1/generate`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 24. [POST] /api/matkul/:idMataKuliah/generate (Mahasiswa) (Mahasiswa)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/matkul/1/generate`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 25. [GET] /api/daftar-hadir/:idMataKuliah/:tanggal (Dosen) (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/daftar-hadir/1/1`

### 26. [GET] /api/daftar-hadir/:idMataKuliah/:tanggal (Mahasiswa) (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/daftar-hadir/1/1`

### 27. [GET] /api/dates/:idMataKuliah (Dosen) (Dosen)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/dates/1`

### 28. [GET] /api/dates/:idMataKuliah (Mahasiswa) (Mahasiswa)
- **Method:** `GET`
- **URL:** `{{base_url}}/api/dates/1`

### 29. [PUT] /api/:id (Dosen) (Dosen)
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/1`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 30. [PUT] /api/:id (Mahasiswa) (Mahasiswa)
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/1`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 31. [PATCH] /api/:id (Dosen) (Dosen)
- **Method:** `PATCH`
- **URL:** `{{base_url}}/api/1`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 32. [PATCH] /api/:id (Mahasiswa) (Mahasiswa)
- **Method:** `PATCH`
- **URL:** `{{base_url}}/api/1`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 33. [DELETE] /api/:id (Dosen) (Dosen)
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/1`

### 34. [DELETE] /api/:id (Mahasiswa) (Mahasiswa)
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/1`

### 35. [POST] /api/grades (Dosen) (Dosen)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/grades`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

### 36. [POST] /api/grades (Mahasiswa) (Mahasiswa)
- **Method:** `POST`
- **URL:** `{{base_url}}/api/grades`
- **Body (`raw JSON`):**
  ```json
  {
    
  }
  ```

---

