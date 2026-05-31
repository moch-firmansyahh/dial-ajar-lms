# Frontend — Dial Ajar LMS

Dokumentasi perancangan frontend aplikasi **Dial Ajar LMS** menggunakan **React 19 + Vite + Tailwind CSS**.

---

## Daftar Isi

- [Tech Stack Frontend](#tech-stack-frontend)
- [Struktur Folder](#struktur-folder)
- [Color Palette & Design Tokens](#color-palette--design-tokens)
- [Tipografi](#tipografi)
- [Halaman & Routing](#halaman--routing)
- [Komponen Global](#komponen-global)
- [Perancangan Per Halaman](#perancangan-per-halaman)
- [State Management](#state-management)
- [Komunikasi ke Backend](#komunikasi-ke-backend)
- [Setup Awal](#setup-awal)

---

## Tech Stack Frontend

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| React | 19 | Library utama UI |
| Vite | 8 | Build tool & dev server |
| Tailwind CSS | 4 | Utility-first styling |
| React Router DOM | 7 | Navigasi antar halaman |
| Axios | latest | HTTP client ke backend |
| Zustand | 5 | Global state (auth, user session) |
| TanStack React Query | 5 | Server state, caching, loading/error |
| Lucide React | latest | Ikon UI |

---

## Struktur Folder

```
src/
├── api/                        # semua fungsi axios, dikelompokkan per fitur
│   ├── auth.api.js             # login, logout
│   ├── matakuliah.api.js       # CRUD mata kuliah
│   ├── tugas.api.js            # buat tugas, submit, ambil daftar
│   ├── kuis.api.js             # buat kuis, submit jawaban, hasil kuis
│   ├── nilai.api.js            # input nilai, lihat nilai
│   ├── modul.api.js            # upload & download modul
│   ├── video.api.js            # tambah & tonton video
│   ├── forum.api.js            # forum diskusi & komentar
│   ├── notifikasi.api.js       # ambil & tandai baca notifikasi (mahasiswa)
│   └── kalender.api.js         # ambil data acara & tanggal merah kampus
│
├── components/                 # komponen reusable
│   ├── layout/
│   │   ├── Sidebar.jsx         # navigasi sidebar kiri
│   │   ├── Navbar.jsx          # header atas
│   │   └── MainLayout.jsx      # wrapper layout utama
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx              # status badge (sukses, peringatan, bahaya)
│   │   ├── Modal.jsx              # base modal wrapper reusable
│   │   ├── InputField.jsx
│   │   └── LoadingSpinner.jsx
│   └── shared/
│       ├── PageHeader.jsx         # judul halaman + breadcrumb
│       ├── EmptyState.jsx         # tampilan saat data kosong
│       ├── ProtectedRoute.jsx     # guard route berdasarkan role
│       └── GabungKelasModal.jsx   # modal input kode kelas (mahasiswa only)
│
├── hooks/                      # custom hooks
│   ├── useAuth.js              # cek status login & role
│   └── useDebounce.js          # delay input pencarian
│
├── pages/
│   ├── Login.jsx                        # public, tidak perlu role
│   │
│   ├── dosen/                           # halaman eksklusif dosen
│   │   ├── Dashboard.jsx                # ringkasan kelas & tugas belum dinilai
│   │   ├── MataKuliahForm.jsx           # buat / edit mata kuliah
│   │   ├── ModulUpload.jsx              # upload modul ajar
│   │   ├── VideoUpload.jsx              # tambah video pembelajaran
│   │   ├── TugasForm.jsx                # buat / edit tugas
│   │   ├── TugasNilai.jsx               # beri nilai jawaban mahasiswa
│   │   ├── KuisForm.jsx                 # buat kuis + soal
│   │   └── NilaiRekap.jsx               # rekap nilai seluruh mahasiswa
│   │
│   ├── mahasiswa/                       # halaman eksklusif mahasiswa
│   │   ├── Dashboard.jsx                # ringkasan kelas & tugas aktif
│   │   ├── TugasSubmit.jsx              # kumpulkan jawaban tugas
│   │   ├── KuisKerjakan.jsx             # kerjakan soal kuis
│   │   ├── KuisHasil.jsx                # hasil kuis: nilai + review jawaban benar/salah
│   │   ├── NilaiSaya.jsx                # lihat nilai tugas & kuis per matkul
│   │   └── Notifikasi.jsx               # list semua notifikasi
│   │
│   └── shared/                          # halaman yang bisa diakses kedua role
│       ├── Kalender.jsx                 # kalender kampus (read only)
│       ├── MataKuliahList.jsx           # daftar mata kuliah
│       ├── MataKuliahDetail.jsx         # detail + tab navigasi per matkul
│       ├── ModulList.jsx                # daftar modul ajar
│       ├── VideoList.jsx                # daftar video pembelajaran
│       ├── TugasList.jsx                # daftar tugas per matkul
│       ├── TugasDetail.jsx              # detail tugas (beda tampilan per role)
│       ├── KuisList.jsx                 # daftar kuis per matkul
│       ├── ForumList.jsx                # daftar thread forum diskusi
│       ├── ForumDetail.jsx              # isi thread + komentar
│       └── ForumForm.jsx                # buat thread baru (dosen & mahasiswa)
│
├── store/                      # zustand store
│   └── authStore.js            # simpan token, data user, role
│
├── utils/                      # helper functions
│   ├── formatDate.js           # format tanggal deadline
│   ├── formatNilai.js          # konversi angka ke indeks (A/B/C)
│   └── axiosInstance.js        # axios dengan base URL & token header
│
├── styles/
│   └── index.css               # CSS variables & Tailwind import
│
├── App.jsx                     # definisi semua routes
└── main.jsx                    # entry point
```

---

## Color Palette & Design Tokens

Semua token warna didefinisikan sebagai CSS variables di `src/styles/index.css`.

```css
@import "tailwindcss";

:root {
  /* ─── Brand Colors ─── */
  --color-primary:        #1374B8;   /* Biru Royal — tombol utama, nav aktif */
  --color-secondary:      #74B8E1;   /* Biru Muda — aksen, hover */
  --color-secondary-dim:  rgba(116, 184, 225, 0.25); /* hover transparan */
  --color-amber:          #FFD000;   /* Emas — badge kuis, pencapaian */
  --color-amber-dark:     #d6b000;   /* Emas Gelap — teks di atas latar terang */
  --color-teal:           #1C8A43;   /* Hijau Madrasah — elemen akademis */

  /* ─── Surface / Background ─── */
  --color-surface:        #ffffff;   /* kartu, modal, area konten */
  --color-background:     #f7f9fb;   /* latar belakang halaman */
  --color-surface-low:    #f2f4f6;   /* pemisah kecil dalam kartu */
  --color-surface-mid:    #eceef0;   /* wrapper kode, input non-aktif */
  --color-surface-high:   #e6e8ea;   /* pemisah struktural halaman */

  /* ─── Slate Scale (Tipografi & Border) ─── */
  --slate-50:   #f8fafc;   /* latar sidebar */
  --slate-100:  #f1f5f9;   /* tombol sekunder, header tabel */
  --slate-200:  #e2e8f0;   /* border default */
  --slate-300:  #cbd5e1;   /* border input field */
  --slate-400:  #94a3b8;   /* ikon non-aktif, placeholder */
  --slate-500:  #64748b;   /* teks muted (tanggal, nama guru) */
  --slate-600:  #475569;   /* teks deskripsi utama */
  --slate-700:  #334155;   /* teks menu sidebar non-aktif */
  --slate-800:  #1e293b;   /* sub-heading (h3, h4) */
  --slate-900:  #0f172a;   /* judul utama (h1, h2) */
  --color-muted: var(--slate-500);
  --color-on-surface: var(--slate-900);

  /* ─── Semantic / Status Colors ─── */
  --emerald-50:  #ecfdf5;
  --emerald-600: #059669;  /* Sukses — sudah dikumpulkan, nilai tuntas */

  --orange-50:   #fff7ed;
  --orange-600:  #ea580c;  /* Peringatan — belum dinilai, mendekati deadline */

  --red-50:      #fff1f2;
  --red-500:     #ef4444;  /* Bahaya — error, terlambat, tombol hapus */

  --teal-50:     #f0fdfa;
  --teal-600:    #0d9488;  /* Info — modul baru, forum, pengumuman */
  --teal-700:    #0f766e;

  /* ─── Border Radius ─── */
  --radius-sm:  4px;
  --radius-md:  8px;
  --radius-lg:  12px;
  --radius-xl:  16px;

  /* ─── Typography ─── */
  --font-heading: 'Plus Jakarta Sans', sans-serif;
  --font-body:    'DM Sans', sans-serif;
}
```

### Panduan Penggunaan Warna per Konteks

| Konteks | Warna yang Dipakai |
|---------|-------------------|
| Tombol primer (Login, Simpan) | `--color-primary` (#1374B8) |
| Tombol sekunder (Batal, Kembali) | `--slate-100` + `--slate-700` |
| Tombol hapus | `--red-500` |
| Badge "Sudah Dikumpulkan" | `--emerald-600` bg `--emerald-50` |
| Badge "Belum Dinilai" | `--orange-600` bg `--orange-50` |
| Badge "Terlambat" | `--red-500` bg `--red-50` |
| Badge "Kuis" | `--color-amber-dark` bg `#fffbe6` |
| Latar halaman | `--color-background` |
| Kartu / Modal | `--color-surface` |
| Teks judul | `--slate-900` |
| Teks deskripsi | `--slate-600` |
| Teks placeholder / muted | `--slate-400` |
| Sidebar background | `--slate-50` |
| Border default | `--slate-200` |

---

## Tipografi

Install font via Google Fonts di `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link
  href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

| Peran | Font | Weight | Dipakai Untuk |
|-------|------|--------|---------------|
| Heading | Plus Jakarta Sans | 700–800 | Judul halaman, nama mata kuliah |
| Body | DM Sans | 400–500 | Paragraf, label, deskripsi |

---

## Halaman & Routing

Semua route didefinisikan di `src/App.jsx`:

```jsx
// Struktur routing App.jsx
/                        → redirect ke /login
/login                   → Login.jsx (public)

/dashboard               → DashboardDosen.jsx atau DashboardMahasiswa.jsx
                           (otomatis berdasarkan role)

/matakuliah              → MataKuliahList.jsx
/matakuliah/:id          → MataKuliahDetail.jsx
/matakuliah/buat         → MataKuliahForm.jsx        [DOSEN only]

/matakuliah/:id/modul            → ModulList.jsx
/matakuliah/:id/modul/upload     → ModulUpload.jsx   [DOSEN only]

/matakuliah/:id/video            → VideoList.jsx
/matakuliah/:id/video/tambah     → VideoUpload.jsx   [DOSEN only]

/matakuliah/:id/tugas            → TugasList.jsx
/matakuliah/:id/tugas/:tugasId   → TugasDetail.jsx
/matakuliah/:id/tugas/buat       → TugasForm.jsx     [DOSEN only]
/matakuliah/:id/tugas/:tugasId/submit → TugasSubmit.jsx [MAHASISWA only]

/matakuliah/:id/kuis             → KuisList.jsx
/matakuliah/:id/kuis/:kuisId     → KuisKerjakan.jsx  [MAHASISWA only]
/matakuliah/:id/kuis/buat        → KuisForm.jsx      [DOSEN only]

/matakuliah/:id/nilai            → NilaiRekap.jsx    [DOSEN only]
/nilai                           → NilaiMahasiswa.jsx [MAHASISWA only]

/matakuliah/:id/forum            → ForumList.jsx
/matakuliah/:id/forum/:forumId   → ForumDetail.jsx

/notifikasi                      → Notifikasi.jsx   [MAHASISWA only]
/kalender                        → Kalender.jsx      [DOSEN & MAHASISWA]
```

### Proteksi Route Berdasarkan Role

```jsx
// Contoh penggunaan ProtectedRoute
<Route
  path="/matakuliah/buat"
  element={
    <ProtectedRoute role="DOSEN">
      <MataKuliahForm />
    </ProtectedRoute>
  }
/>
```

---

## Komponen Global

### Sidebar
Navigasi utama kiri. Isi menu berbeda berdasarkan role:

**Menu Dosen:**
- Dashboard
- Mata Kuliah Saya
- Kalender Kampus
- Forum Diskusi

**Menu Mahasiswa:**
- Dashboard
- Mata Kuliah Saya
- Nilai Saya
- Notifikasi
- Kalender Kampus
- Forum Diskusi

### Badge Status
Komponen reusable untuk menampilkan status tugas/nilai:

```jsx
// Penggunaan
<Badge type="sukses" label="Sudah Dikumpulkan" />
<Badge type="peringatan" label="Belum Dinilai" />
<Badge type="bahaya" label="Terlambat" />
<Badge type="info" label="Modul Baru" />
<Badge type="kuis" label="Kuis" />
```

| `type` | Warna Teks | Warna BG |
|--------|-----------|----------|
| `sukses` | `--emerald-600` | `--emerald-50` |
| `peringatan` | `--orange-600` | `--orange-50` |
| `bahaya` | `--red-500` | `--red-50` |
| `info` | `--teal-600` | `--teal-50` |
| `kuis` | `--color-amber-dark` | `#fffbe6` |

---

## Perancangan Per Halaman

### 1. Login

**Tampilan:**
```
┌─────────────────────────────┐
│        Dial Ajar LMS        │
│                             │
│   Login sebagai:            │
│   [ Mahasiswa ] [  Dosen  ] │  ← toggle role
│                             │
│   NIM  (berubah jadi NIP    │
│         kalau pilih Dosen)  │
│   [_______________________] │
│                             │
│   Password                  │
│   [_______________________] │
│                             │
│   [       Masuk       ]     │
└─────────────────────────────┘
```

**Alur:**
1. User pilih role → **Mahasiswa** atau **Dosen** (toggle/tab)
2. Label input berubah otomatis:
   - Pilih Mahasiswa → label `NIM`
   - Pilih Dosen → label `NIP`
3. Input nomor induk + password → klik **Masuk**
4. Frontend kirim ke backend: `{ nomorInduk, password, role }`
5. Backend validasi — role dari frontend hanya petunjuk, **backend tetap verifikasi ulang** dari tabel yang sesuai
6. Response: JWT token + role resmi dari backend
7. Token disimpan di Zustand
8. Redirect otomatis:
   - `DOSEN` → `pages/dosen/Dashboard.jsx`
   - `MAHASISWA` → `pages/mahasiswa/Dashboard.jsx`

> ⚠️ Role yang dikirim frontend **hanya untuk UX** (ganti label input). Role sesungguhnya **selalu dari backend** — tidak bisa dimanipulasi dari sisi frontend.

**Styling:**
- Background: `--color-background`
- Card login: `--color-surface`, shadow halus
- Toggle aktif: `--color-primary` (biru)
- Toggle non-aktif: `--slate-100`
- Tombol Masuk: `--color-primary`

---

### 2. Dashboard

**Dosen** menampilkan:
- Total mata kuliah yang dikelola
- Daftar tugas yang belum dinilai (badge `peringatan`)
- Shortcut ke: Buat Mata Kuliah, Input Nilai, Forum Diskusi

**Mahasiswa** menampilkan:
- Total mata kuliah yang diikuti
- Tugas aktif beserta deadline (badge `bahaya` jika < 1 hari)
- Ringkasan nilai terkini per mata kuliah

---

### 3. Mata Kuliah

**MataKuliahList** — grid kartu mata kuliah:
- Nama mata kuliah, kode, nama dosen
- Hover efek: border `--color-primary`, shadow naik
- Tombol "Masuk Kelas"

**MataKuliahDetail** — tab navigation:
- Setiap tab menampilkan konten yang relevan
- Tab **Nilai** untuk dosen → NilaiRekap (tabel semua mahasiswa)
- Tab **Nilai** untuk mahasiswa → NilaiSaya (nilai sendiri di matkul ini)

---

### 4. Modul Ajar
- List kartu modul dengan ikon file sesuai tipe (PDF, DOCX, dll.)
- Tombol "Unduh" menggunakan warna `--color-primary`
- Dosen: tombol "Upload Modul" di pojok kanan atas
- Implementasi interface `Downloadable` → endpoint `/api/modul/:id/download`

---

### 5. Video Ajar
- List kartu video dengan thumbnail placeholder
- Tombol "Tonton" → buka link video atau embed player
- Dosen: form tambah video (judul + link)

---

### 6. Tugas

**TugasList:**
- Kartu tugas dengan judul, deadline, dan badge status
- Deadline < 1 hari → badge `bahaya`
- Deadline > 1 hari → badge `peringatan`
- Sudah dikumpulkan → badge `sukses`

**TugasDetail:**
- Deskripsi tugas lengkap
- File soal (tombol unduh)
- Mahasiswa: tombol "Kumpulkan Jawaban" + file upload
- Dosen: daftar pengumpulan mahasiswa + tombol beri nilai

**TugasForm (Dosen):**
- Input: Judul, Deskripsi, Deadline (date picker), Upload File Soal

---

### 7. Kuis

**KuisList:**
- Badge `--color-amber` untuk semua item kuis
- Status: Belum Dikerjakan / Sudah Dikerjakan / Nilai: xx

**Alur Mahasiswa mengerjakan kuis:**
```
Klik kuis di KuisList
        ↓
Pop Up Konfirmasi #1 — "Siap Mengerjakan?"
┌────────────────────────────────┐
│  Kuis: Pemrograman OOP         │
│  Jumlah Soal: 10               │
│  Batas Waktu: 60 menit         │
│                                │
│  [  Batal  ]  [ Mulai Kerjakan ]│
└────────────────────────────────┘
        ↓ klik "Mulai Kerjakan"
Halaman KuisKerjakan
- Soal tampil satu per satu
- Pilihan ganda → radio button
- Essay → textarea
- Timer countdown berjalan
- Tombol "Submit Jawaban"
        ↓ klik "Submit Jawaban"
Pop Up Konfirmasi #2 — "Yakin Kumpulkan?"
┌────────────────────────────────┐
│  Kamu sudah menjawab 9/10 soal │
│  Yakin ingin mengumpulkan?     │
│                                │
│  [ Kembali ]  [ Ya, Kumpulkan ]│
└────────────────────────────────┘
        ↓ klik "Ya, Kumpulkan"
Halaman Hasil Kuis (KuisHasil)
┌────────────────────────────────┐
│  Nilai Kamu: 80                │
│  ─────────────────────────     │
│  No 1: ✅ Benar                │
│  No 2: ❌ Salah                │
│         Jawaban kamu: A        │
│         Jawaban benar: C       │
│  No 3: ✅ Benar                │
│  ...                           │
└────────────────────────────────┘
```

**KuisKerjakan (Mahasiswa):**
- Soal tampil satu per satu dengan navigasi prev/next
- Pilihan ganda → radio button
- Essay → textarea
- Timer countdown dari `deadlineKuis` — otomatis submit jika waktu habis
- Indikator soal sudah dijawab / belum di bagian bawah

**KuisHasil (Mahasiswa) — halaman baru setelah submit:**
- Nilai akhir ditampilkan besar di atas
- List semua soal beserta:
  - ✅ Benar → highlight `--emerald-50`
  - ❌ Salah → highlight `--red-50` + tampilkan jawaban benar
- Tombol "Kembali ke Daftar Kuis"

**KuisForm (Dosen):**
- Input judul kuis + deadline
- Form tambah soal dinamis (bisa tambah/hapus soal)
- Pilih tipe soal: Pilihan Ganda / Essay
- Input kunci jawaban + bobot nilai per soal

---

### 8. Nilai

**NilaiRekap (Dosen):**
- Tabel: Nama Mahasiswa | Nilai Tugas | Nilai Kuis | Nilai Akhir
- Nilai akhir dihitung otomatis dari `akumulasiAkhir()` di backend
- Filter per mata kuliah

**NilaiSaya (Mahasiswa):**
- Kartu per mata kuliah
- Breakdown: Nilai Tugas | Nilai Kuis | Nilai Akhir
- Nilai akhir dihitung otomatis backend dari bobot tugas + kuis

> ℹ️ Sesuai class diagram — entitas `Nilai` tidak memiliki atribut indeks,
> sehingga indeks huruf tidak ditampilkan di sisi mahasiswa.

---

### 9. Notifikasi *(fitur tambahan — Mahasiswa only)*

**Trigger notifikasi:**

| Trigger | Deskripsi |
|---------|-----------|
| Dosen upload modul baru | Notif ke semua mahasiswa di kelas: *"Modul baru tersedia: [judul modul]"* |
| Dosen buat tugas baru | Notif ke semua mahasiswa di kelas: *"Tugas baru: [judul tugas] — Deadline: [tanggal]"* |
| Deadline tugas H-3 | Notif pengingat awal: *"3 hari lagi deadline tugas [judul]"* |
| Deadline tugas H-1 | Notif mendesak: *"Besok deadline! Segera kumpulkan tugas [judul]"* — badge `bahaya` |

**Tampilan:**
- Ikon lonceng 🔔 di Navbar kanan atas
- Badge merah jumlah notif belum dibaca
- Klik ikon → dropdown list notifikasi terbaru
- Klik notifikasi → redirect ke halaman yang relevan (tugas/modul)
- Halaman `/notifikasi` → list semua notifikasi lengkap dengan status dibaca/belum

**Alur:**
```
Dosen upload tugas/modul
        ↓
Backend otomatis buat entitas Notifikasi
untuk setiap mahasiswa di kelas tersebut
        ↓
Mahasiswa buka app → notif muncul di lonceng
        ↓
Klik notif → redirect ke halaman tugas/modul
        ↓
Status notif berubah jadi "sudah dibaca"
```

---

### 10. Kalender Kampus *(fitur tambahan — semua role)*

**Konten kalender:**
- 📅 **Tanggal merah** → hari libur nasional / libur kampus (highlight merah)
- 🎓 **Acara kampus** → ujian, seminar, wisuda, dll. (highlight biru `--color-primary`)
- Data dikelola oleh **developer** langsung di database — bukan oleh dosen/mahasiswa

**Tampilan:**
- Halaman `/kalender` → kalender bulanan interaktif
- Klik tanggal → muncul detail acara di hari tersebut
- Tanggal merah → highlight `--red-50` border `--red-500`
- Acara kampus → highlight `--color-secondary-dim` border `--color-primary`
- Navigation prev/next bulan

**Akses:**
- Dosen & Mahasiswa sama-sama bisa lihat
- Tidak ada yang bisa edit — read only untuk semua user

---

### 11. Forum Diskusi

**ForumList:**
- List thread diskusi per mata kuliah
- Info: judul, nama pembuat, jumlah komentar, waktu dibuat
- Badge `info` untuk thread baru

**ForumDetail:**
- Isi thread di atas
- List komentar berjenjang di bawah
- Setiap komentar: avatar inisial, nama, waktu, isi
- Input komentar baru di bagian bawah
- Dosen & Mahasiswa bisa komentar
- Edit/hapus komentar milik sendiri

---

## State Management

### authStore.js (Zustand)

```js
// src/store/authStore.js
const useAuthStore = create((set) => ({
  token: null,
  user: null,       // { nama, nomorInduk, role: 'DOSEN' | 'MAHASISWA' }
  isLoggedIn: false,

  login: (token, user) => set({ token, user, isLoggedIn: true }),
  logout: () => set({ token: null, user: null, isLoggedIn: false }),
}))
```

### axiosInstance.js

```js
// src/utils/axiosInstance.js
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // http://localhost:8080/api
})

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosInstance
```

---

## Komunikasi ke Backend

Setiap file di `src/api/` berisi fungsi yang memanggil endpoint Spring Boot.

```js
// Contoh: src/api/tugas.api.js
import axiosInstance from '../utils/axiosInstance'

export const getTugasByMatkul = (matkulId) =>
  axiosInstance.get(`/matakuliah/${matkulId}/tugas`)

export const submitTugas = (tugasId, formData) =>
  axiosInstance.post(`/tugas/${tugasId}/submit`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const nilaiTugas = (tugasId, mahasiswaId, nilai) =>
  axiosInstance.post(`/tugas/${tugasId}/nilai`, { mahasiswaId, nilai })
```

```jsx
// Contoh penggunaan di komponen dengan React Query
import { useQuery } from '@tanstack/react-query'
import { getTugasByMatkul } from '../../api/tugas.api'

const TugasList = ({ matkulId }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tugas', matkulId],
    queryFn: () => getTugasByMatkul(matkulId).then(res => res.data),
  })

  if (isLoading) return <LoadingSpinner />
  if (isError) return <p>Gagal memuat data tugas.</p>

  return (
    <div>
      {data.map(tugas => (
        <TugasCard key={tugas.id} data={tugas} />
      ))}
    </div>
  )
}
```

---

## Setup Awal

### 1. File `.env`
Buat file `.env` di root folder frontend:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### 2. Konfigurasi `vite.config.js`
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### 3. `src/styles/index.css`
```css
@import "tailwindcss";

:root {
  /* paste semua CSS variables dari Color Palette di atas */
}
```

### 4. Jalankan project
```bash
npm run dev
# Frontend berjalan di http://localhost:5173
```

---

*Telkom University — Fakultas Informatika — Program Studi Informatika — 2026*
