# LMS Backend - API Documentation

## Overview

Learning Management System (LMS) backend built with Node.js, Express, PostgreSQL, and Prisma ORM.

- **Base URL:** `http://localhost:3000`
- **Authentication:** JWT Bearer Token (24-hour expiry)

---

## Fitur & Endpoint (Berdasarkan Spesifikasi S1 - S9)

### S1. Kelola Tugas (Dosen)
Endpoint untuk membuat, mengubah, dan menghapus tugas.
- **GET** `/api/tugas/mata-kuliah/:idMataKuliah` - Mengambil daftar tugas berdasarkan mata kuliah.
- **POST** `/api/tugas` - Membuat tugas baru.
- **PATCH** `/api/tugas/:idTugas` - Mengubah data tugas yang sudah ada.
- **DELETE** `/api/tugas/:idTugas` - Menghapus tugas.

### S2. Kelola Anggota
Endpoint untuk mengelola partisipan dan mata kuliah.
- **GET** `/api/users` - Mengambil daftar seluruh pengguna (Status: 200 OK).
- **GET** `/api/mata-kuliah` - Mengambil daftar mata kuliah (Status: 200 OK).
- **GET** `/api/mata-kuliah/:idMataKuliah` - Mengambil detail mata kuliah (Status: 200 OK).
- **POST** `/api/mata-kuliah` - Membuat kelas / mata kuliah baru (Status: 201 Created).
- **PATCH** `/api/mata-kuliah/:id` - Memperbarui data mata kuliah (Status: 200 OK).

### S3. Kelola Deadline
- **DELETE** `/api/mata-kuliah/:id` - Menghapus enrollment / kelas (Status: 200 OK).

### S4. Monitoring Progress
- **GET** `/api/dashboard/mahasiswa` - Mengambil status dan progress belajar mahasiswa (Status: 200 OK).

### S5. Upload Tugas (Mahasiswa)
Endpoint untuk submission tugas oleh mahasiswa.
- **POST** `/api/tugas/:idTugas/submit` - Mengunggah jawaban tugas.
- **GET** `/api/tugas/:idTugas/submission` - Mengambil data pengumpulan / jawaban tugas mahasiswa.
- **DELETE** `/api/tugas/submission/:idPengumpulan` - Membatalkan / menghapus file tugas yang dikumpulkan.

### S6. Presensi
- **GET** `/api/presensi/mata-kuliah/:idMataKuliah` - Mengambil daftar kehadiran mata kuliah (Status: 200 OK).
- **POST** `/api/presensi` - Mencatat kehadiran baru (Status: 201 Created).
- **PATCH** `/api/presensi/:id` - Memperbarui status kehadiran manual (Status: 200 OK).

### S7. Penilaian
- **GET** `/api/nilai/:nomorInduk` - Mengambil daftar nilai mahasiswa (Status: 200 OK).
- **POST** `/api/nilai` - Memasukkan / menyimpan data nilai tugas (Status: 201 Created).
- **PATCH** `/api/nilai/:id` - Mengubah data nilai (Status: 200 OK).
- **GET** `/api/nilai/transkrip/mahasiswa` - Menampilkan rekapan transkrip akhir (Status: 200 OK).

### S8. Diskusi (Forum)
- **GET** `/api/forum/mata-kuliah/:idMataKuliah` - Mengambil daftar topik diskusi kelas (Status: 200 OK).
- **POST** `/api/forum/create` - Membuat topik diskusi baru (Status: 201 Created).

### S9. Autentikasi
- **POST** `/api/auth/login` - Melakukan validasi kredensial dan mendapatkan session token (Status: 200 OK).

---

## Test Credentials

### Mahasiswa (Student)
```
Name: Budi Santoso
Email: budi.santoso@kampus.ac.id
NIM: 2021002
Password: password123
Role: MAHASISWA
```

### Dosen (Lecturer)
```
Name: Dr. Lestari, M.Pd
Email: lestari@kampus.ac.id
NIP: 197803252005012002
Password: password123
Role: DOSEN
```

---

## HTTP Status Codes

| Code | Meaning                                 |
| ---- | --------------------------------------- |
| 200  | OK - Request succeeded                  |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid input             |
| 401  | Unauthorized - Invalid/missing token    |
| 403  | Forbidden - No permission               |
| 404  | Not Found - Resource doesn't exist      |
| 500  | Internal Server Error                   |
