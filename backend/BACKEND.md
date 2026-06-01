# Backend — Dial Ajar LMS

Dokumentasi backend aplikasi **Dial Ajar LMS** menggunakan **Java + MySQL**, dibangun di atas kode OOP yang sudah ada dari teman kelompok, dikembangkan menjadi backend REST API menggunakan **Spring Boot**.

---

## Daftar Isi

- [Tech Stack Backend](#tech-stack-backend)
- [Prasyarat & Instalasi](#prasyarat--instalasi)
- [Struktur Folder Backend](#struktur-folder-backend)
- [Database — MySQL](#database--mysql)
- [Kode Java yang Sudah Ada](#kode-java-yang-sudah-ada)
- [Mapping Kode Lama ke Spring Boot](#mapping-kode-lama-ke-spring-boot)
- [Endpoint API](#endpoint-api)
- [Konfigurasi Project](#konfigurasi-project)
- [Cara Menjalankan](#cara-menjalankan)

---

## Tech Stack Backend

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Java | 21 (LTS) | Bahasa utama backend |
| Spring Boot | 3.x | Framework REST API |
| Spring Web | - | Controller & REST endpoint |
| Spring Data JPA | - | ORM — mapping class Java ke tabel MySQL |
| Spring Security | - | Autentikasi & otorisasi |
| JWT (jjwt) | 0.12.x | Token-based authentication |
| MySQL | 8.x | Database relasional |
| Hibernate | - | ORM engine (otomatis via JPA) |
| Maven | 3.8+ | Build tool & dependency management |
| BCrypt | - | Hashing password |

> ⚠️ Project lama teman kamu menggunakan **Java 25** (`maven.compiler.release=25`).
> Untuk kompatibilitas maksimal gunakan **Java 21 (LTS)** — lebih stabil dan banyak dukungan library.

---

## Prasyarat & Instalasi

### 1. Install Java 21

Download dari: https://adoptium.net (pilih **Temurin 21 LTS**)

Verifikasi setelah install:
```bash
java -version
# output: openjdk version "21.x.x"
```

---

### 2. Install Maven

Download dari: https://maven.apache.org/download.cgi

Atau pakai **SDKMAN** (lebih mudah, khusus Mac/Linux):
```bash
sdk install maven
```

Verifikasi:
```bash
mvn -version
# output: Apache Maven 3.x.x
```

> **Windows**: Tambahkan Maven ke PATH di Environment Variables.
> Tutorial: https://phoenixnap.com/kb/install-maven-windows

---

### 3. Install MySQL

**Rekomendasi: pakai XAMPP** — paling mudah untuk development lokal.

Download dari: https://www.apachefriends.org

Setelah install:
1. Buka **XAMPP Control Panel**
2. Klik **Start** di baris **MySQL**
3. MySQL berjalan di `localhost:3306`
4. Username default: `root`, Password default: *(kosong)*

Verifikasi via terminal:
```bash
mysql -u root -p
# tekan Enter saat diminta password (kosong)
```

---

### 4. Install IDE — IntelliJ IDEA (Recommended)

Download dari: https://www.jetbrains.com/idea/download
Pilih versi **Community (gratis)**.

> Alternatif: **VS Code** dengan extension **Extension Pack for Java**

---

### 5. Setup Project Spring Boot Baru

Buka: https://start.spring.io dan konfigurasi seperti ini:

| Field | Value |
|-------|-------|
| Project | Maven |
| Language | Java |
| Spring Boot | 3.x.x |
| Group | com.dialajar |
| Artifact | lms-backend |
| Packaging | Jar |
| Java | 21 |

**Dependencies yang dipilih:**
- Spring Web
- Spring Data JPA
- Spring Security
- MySQL Driver

Klik **Generate** → extract zip → buka di IntelliJ.

---

## Struktur Folder Backend

```
lms-backend/
├── src/
│   └── main/
│       ├── java/com/dialajar/lms/
│       │   │
│       │   ├── LmsApplication.java              # entry point Spring Boot
│       │   │
│       │   ├── model/                           # entitas OOP (dari kode teman)
│       │   │   ├── User.java                    # abstract class — base semua user
│       │   │   ├── Dosen.java                   # extends User
│       │   │   ├── Mahasiswa.java               # extends User
│       │   │   ├── MataKuliah.java              # kelas sentral
│       │   │   ├── ModulAjar.java               # implements Downloadable
│       │   │   ├── VidioAjar.java               # implements Downloadable
│       │   │   ├── Tugas.java                   # implements Downloadable
│       │   │   ├── Kuis.java
│       │   │   ├── Soal.java
│       │   │   ├── ForumDiskusi.java
│       │   │   ├── KomentarForumDiskusi.java
│       │   │   ├── Notifikasi.java              # fitur tambahan
│       │   │   └── KalenderKampus.java          # fitur tambahan
│       │   │
│       │   ├── interfaces/
│       │   │   └── Downloadable.java            # interface dari kode teman
│       │   │
│       │   ├── repository/                      # query ke database via JPA
│       │   │   ├── UserRepository.java
│       │   │   ├── MataKuliahRepository.java
│       │   │   ├── ModulAjarRepository.java
│       │   │   ├── VidioAjarRepository.java
│       │   │   ├── TugasRepository.java
│       │   │   ├── KuisRepository.java
│       │   │   ├── SoalRepository.java
│       │   │   ├── ForumDiskusiRepository.java
│       │   │   ├── KomentarRepository.java
│       │   │   ├── NotifikasiRepository.java
│       │   │   └── KalenderRepository.java
│       │   │
│       │   ├── service/                         # logika bisnis
│       │   │   ├── AuthService.java             # login, generate JWT (refactor dari kode teman)
│       │   │   ├── MataKuliahService.java
│       │   │   ├── ModulAjarService.java
│       │   │   ├── VidioAjarService.java
│       │   │   ├── TugasService.java
│       │   │   ├── KuisService.java
│       │   │   ├── NilaiService.java
│       │   │   ├── ForumDiskusiService.java
│       │   │   ├── NotifikasiService.java
│       │   │   └── KalenderService.java
│       │   │
│       │   ├── controller/                      # REST endpoint (menerima request dari React)
│       │   │   ├── AuthController.java
│       │   │   ├── MataKuliahController.java
│       │   │   ├── ModulAjarController.java
│       │   │   ├── VidioAjarController.java
│       │   │   ├── TugasController.java
│       │   │   ├── KuisController.java
│       │   │   ├── NilaiController.java
│       │   │   ├── ForumDiskusiController.java
│       │   │   ├── NotifikasiController.java
│       │   │   └── KalenderController.java
│       │   │
│       │   ├── dto/                             # request & response body (JSON)
│       │   │   ├── request/
│       │   │   │   ├── LoginRequest.java
│       │   │   │   ├── TugasRequest.java
│       │   │   │   ├── KuisRequest.java
│       │   │   │   ├── SoalRequest.java
│       │   │   │   ├── ForumRequest.java
│       │   │   │   └── KomentarRequest.java
│       │   │   └── response/
│       │   │       ├── LoginResponse.java       # token + role + nama
│       │   │       ├── TugasResponse.java
│       │   │       ├── KuisResponse.java
│       │   │       ├── KuisHasilResponse.java   # hasil kuis: nilai + review jawaban
│       │   │       └── NilaiResponse.java
│       │   │
│       │   └── security/                        # JWT & Spring Security config
│       │       ├── JwtUtil.java                 # generate & validasi token
│       │       ├── JwtFilter.java               # filter setiap request
│       │       └── SecurityConfig.java          # whitelist route public
│       │
│       └── resources/
│           └── application.properties           # konfigurasi database & server
│
├── pom.xml                                      # dependencies Maven
└── README.md
```

---

## Database — MySQL

### Setup Database

Buka **phpMyAdmin** (http://localhost/phpmyadmin) atau MySQL terminal:

```sql
CREATE DATABASE lms_pbo;
USE lms_pbo;
```

---

### Skema Tabel

> Tabel dirancang berdasarkan class diagram proposal + kode Java yang sudah ada.

```sql
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
    tugas_id     BIGINT NOT NULL,
    mahasiswa_id BIGINT NOT NULL,
    file_jawaban VARCHAR(500),
    nilai        DOUBLE,
    status       ENUM('BELUM_KUMPUL', 'SUDAH_KUMPUL', 'SUDAH_DINILAI') DEFAULT 'BELUM_KUMPUL',
    dikumpulkan  TIMESTAMP,
    FOREIGN KEY (tugas_id)     REFERENCES tugas(id) ON DELETE CASCADE,
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
```

---

## Kode Java yang Sudah Ada

Dari zip teman kamu, ini class-class yang sudah ada dan siap dipakai:

### `User.java` — Abstract Class
```java
// Sudah ada: nomorInduk, nama, email, password
// Sudah ada: login(), logout(), tampilkanDashboard() abstract
// Yang perlu ditambah: anotasi @Entity, @Inheritance untuk JPA
```

### `Dosen.java` — extends User
```java
// Sudah ada: nip, membuatMataKuliah(), menambahModulAjar()
//            menambahTugas(), memberNilai(), tampilkanDashboard()
// Yang perlu ditambah: anotasi @Entity, @DiscriminatorValue("DOSEN")
```

### `Mahasiswa.java` — extends User
```java
// Sudah ada: nim, semester, daftarMataKuliah
//            gabungKelas(), bacaModul(), kerjakanTugas()
//            kumpulkanTugas(), tontonVidio(), kerjakanKuis(), melihatNilai()
// Yang perlu ditambah: anotasi @Entity, @DiscriminatorValue("MAHASISWA")
```

### `MataKuliah.java`
```java
// Sudah ada: namaMatKul, daftarTugas[], daftarModul[], daftarVidio[]
//            daftarKuis[], daftarForumDiskusi[]
//            menyimpanTugas(), menyimpanModul(), menyimpanVidio()
//            menyimpanKuis(), menyimpanForumDiskusi()
// Yang perlu ditambah: kodeKelas (generate otomatis), dosenId, @Entity
```

### `Tugas.java` — implements Downloadable
```java
// Sudah ada: judul, detailTugas, deadlineTugas, fileJawaban
//            simpanJawaban(), cekDeadline(), unduhFile()
// Yang perlu ditambah: @Entity, matkulId
```

### `Kuis.java`
```java
// Sudah ada: judul, deadlineKuis, soal[], skor
//            mengerjakanKuis(), melihatNilai(), tambahSoal()
// Yang perlu ditambah: @Entity, matkulId
```

### `Soal.java`
```java
// Sudah ada: idSoal, pertanyaan, pilihanJawaban[], kunciJawaban, skor
//            cekJawaban(), menampilkanSoal(), bobotSoal()
// Yang perlu ditambah: @Entity, kuisId
```

### `ForumDiskusi.java`
```java
// Sudah ada: judul, isiForum, daftarKomentar[]
//            kirimPesan(), tambahKomentar()
// Yang perlu ditambah: @Entity, pembuatId, matkulId
```

### `KomentarForumDiskusi.java`
```java
// Sudah ada: idKomentar, isiKomentar, penulis: User
//            editKomentar(), hapusKomentar(), getDetailKomentar()
// Yang perlu ditambah: @Entity, forumId
```

### `ModulAjar.java` — implements Downloadable
```java
// Sudah ada: judul, tipe, unduhFile()
// Yang perlu ditambah: @Entity, filePath, matkulId
```

### `VidioAjar.java` — implements Downloadable
```java
// Sudah ada: judul, linkVidio, putarVidio(), unduhFile()
// Yang perlu ditambah: @Entity, matkulId
```

### `AuthService.java`
```java
// Sudah ada: login() — query ke DB, return User (Mahasiswa/Dosen)
// Yang perlu ditambah: generate JWT token, BCrypt password check
```

### `DatabaseConnection.java`
```java
// Sudah ada: getConnection() — connect ke MySQL lms_pbo via JDBC
// Catatan: di Spring Boot ini digantikan oleh application.properties
//          tidak perlu dipakai lagi, tapi bisa dijadikan referensi
```

---

## Mapping Kode Lama ke Spring Boot

Ini cara menyesuaikan kode yang sudah ada agar bisa jalan di Spring Boot:

### Sebelum (kode teman — standalone Java):
```java
// DatabaseConnection.java — manual JDBC
Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users...");
```

### Sesudah (Spring Boot — otomatis via JPA):
```java
// User.java — tambah anotasi JPA
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nomor_induk", unique = true)
    private String nomorInduk;
    // ... atribut lain tetap sama
}
```

```java
// UserRepository.java — Spring Data JPA, tidak perlu tulis SQL manual
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByNomorInduk(String nomorInduk);
    Optional<User> findByEmail(String email);
}
```

```java
// AuthService.java — refactor dari kode teman
@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    public LoginResponse login(String identifier, String password, String role) {
        User user = userRepository.findByNomorInduk(identifier)
            .orElseThrow(() -> new RuntimeException("Akun tidak ditemukan"));

        // BCrypt check (menggantikan plain text check di kode lama)
        if (!BCrypt.checkpw(password, user.getPassword())) {
            throw new RuntimeException("Password salah");
        }

        // Validasi role sesuai yang dipilih di frontend
        if (!user.getRole().equalsIgnoreCase(role)) {
            throw new RuntimeException("Role tidak sesuai");
        }

        String token = jwtUtil.generateToken(user);
        return new LoginResponse(token, user.getRole(), user.getNama());
    }
}
```

---

## Endpoint API

### Autentikasi
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `POST` | `/api/auth/login` | Public | Login Dosen / Mahasiswa |
| `POST` | `/api/auth/logout` | Auth | Logout |

### Mata Kuliah
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `GET` | `/api/matakuliah` | Auth | Daftar mata kuliah milik user |
| `POST` | `/api/matakuliah` | Dosen | Buat mata kuliah baru |
| `GET` | `/api/matakuliah/{id}` | Auth | Detail mata kuliah |
| `POST` | `/api/matakuliah/gabung` | Mahasiswa | Gabung kelas via kode |

### Modul & Video
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `GET` | `/api/matakuliah/{id}/modul` | Auth | Daftar modul |
| `POST` | `/api/matakuliah/{id}/modul` | Dosen | Upload modul |
| `GET` | `/api/modul/{id}/download` | Auth | Download modul |
| `GET` | `/api/matakuliah/{id}/video` | Auth | Daftar video |
| `POST` | `/api/matakuliah/{id}/video` | Dosen | Tambah video |

### Tugas
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `GET` | `/api/matakuliah/{id}/tugas` | Auth | Daftar tugas |
| `POST` | `/api/matakuliah/{id}/tugas` | Dosen | Buat tugas baru |
| `GET` | `/api/tugas/{id}` | Auth | Detail tugas |
| `POST` | `/api/tugas/{id}/submit` | Mahasiswa | Kumpulkan jawaban |
| `POST` | `/api/tugas/{id}/nilai` | Dosen | Beri nilai jawaban |

### Kuis
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `GET` | `/api/matakuliah/{id}/kuis` | Auth | Daftar kuis |
| `POST` | `/api/matakuliah/{id}/kuis` | Dosen | Buat kuis + soal |
| `GET` | `/api/kuis/{id}` | Auth | Detail kuis + soal |
| `POST` | `/api/kuis/{id}/submit` | Mahasiswa | Submit jawaban kuis |
| `GET` | `/api/kuis/{id}/hasil` | Mahasiswa | Hasil kuis: nilai + review jawaban |

### Nilai
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `GET` | `/api/matakuliah/{id}/nilai` | Dosen | Rekap nilai semua mahasiswa |
| `GET` | `/api/nilai/saya` | Mahasiswa | Nilai sendiri per mata kuliah |

### Forum Diskusi
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `GET` | `/api/matakuliah/{id}/forum` | Auth | Daftar thread forum |
| `POST` | `/api/matakuliah/{id}/forum` | Auth | Buat thread baru |
| `GET` | `/api/forum/{id}` | Auth | Detail thread + komentar |
| `POST` | `/api/forum/{id}/komentar` | Auth | Tambah komentar |
| `PUT` | `/api/komentar/{id}` | Auth | Edit komentar sendiri |
| `DELETE` | `/api/komentar/{id}` | Auth | Hapus komentar sendiri |

### Notifikasi
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `GET` | `/api/notifikasi` | Mahasiswa | Daftar notifikasi |
| `PUT` | `/api/notifikasi/{id}/baca` | Mahasiswa | Tandai sudah dibaca |
| `PUT` | `/api/notifikasi/baca-semua` | Mahasiswa | Tandai semua sudah dibaca |

### Kalender
| Method | Endpoint | Akses | Deskripsi |
|--------|----------|-------|-----------|
| `GET` | `/api/kalender` | Auth | Daftar acara & tanggal merah |
| `GET` | `/api/kalender?bulan=6&tahun=2026` | Auth | Filter per bulan |

---

## Konfigurasi Project

### `application.properties`

```properties
# ─── Server ───────────────────────────────────────────────────────────────
server.port=8080

# ─── Database MySQL ───────────────────────────────────────────────────────
spring.datasource.url=jdbc:mysql://localhost:3306/lms_pbo
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# ─── JPA / Hibernate ──────────────────────────────────────────────────────
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# ─── JWT ──────────────────────────────────────────────────────────────────
jwt.secret=dialajar-lms-secret-key-telkom-2026
jwt.expiration=86400000

# ─── File Upload ──────────────────────────────────────────────────────────
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### `pom.xml` — Dependencies yang ditambahkan

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- MySQL Driver (sama seperti kode teman, versi update) -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <version>8.3.0</version>
    </dependency>

    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.3</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.3</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.3</version>
    </dependency>
</dependencies>
```

---

## Cara Menjalankan

### 1. Pastikan MySQL sudah berjalan (XAMPP → Start MySQL)

### 2. Buat database
```sql
CREATE DATABASE lms_pbo;
```

### 3. Jalankan backend
```bash
cd lms-backend
mvn spring-boot:run
```

Backend berjalan di: `http://localhost:8080`

### 4. Test endpoint
```bash
# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nomorInduk":"103012400137","password":"password123","role":"MAHASISWA"}'
```

---

## Struktur Folder Keseluruhan Project

```
Learning_Management_System/
├── frontend/                  # React + Vite
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── dosen/
│   │   │   ├── mahasiswa/
│   │   │   └── shared/
│   │   ├── store/
│   │   ├── utils/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.js
│
├── lms-backend/               # Java Spring Boot
│   ├── src/main/java/com/dialajar/lms/
│   │   ├── model/
│   │   ├── interfaces/
│   │   ├── repository/
│   │   ├── service/
│   │   ├── controller/
│   │   ├── dto/
│   │   └── security/
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── FRONTEND.md
├── BACKEND.md
└── DIAL_AJAR_LMS.md
```

---

*Telkom University — Fakultas Informatika — Program Studi Informatika — 2026*
