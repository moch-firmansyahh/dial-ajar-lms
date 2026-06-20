-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 20, 2026 at 02:53 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lms_pbo`
--

-- --------------------------------------------------------

--
-- Table structure for table `dosen`
--

CREATE TABLE `dosen` (
  `nip` varchar(20) NOT NULL,
  `id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dosen`
--

INSERT INTO `dosen` (`nip`, `id`) VALUES
('101', 1),
('102', 2),
('103', 3),
('104', 4),
('105', 5);

-- --------------------------------------------------------

--
-- Table structure for table `forum_diskusi`
--

CREATE TABLE `forum_diskusi` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `isi_forum` text NOT NULL,
  `judul` varchar(200) NOT NULL,
  `mata_kuliah_id` bigint(20) NOT NULL,
  `pembuat_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `forum_diskusi`
--

INSERT INTO `forum_diskusi` (`id`, `created_at`, `isi_forum`, `judul`, `mata_kuliah_id`, `pembuat_id`) VALUES
(1, '2026-06-17 17:35:50.000000', 'Pahami ini yaa coba pahami', 'Coba Forum Diskusi', 1, 1),
(3, '2026-06-18 15:45:07.000000', 'DISKUSI APA AJA', 'Pertanyaan PBO DEH', 1, 1),
(4, '2026-06-19 22:05:56.000000', 'Ayo kita ke cafe dosen kita ngobrol bagaimana tubes dikerjakan', 'Pertemuan 1 - Ngobrol bareng sama dosen terus ngopi', 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `komentar_forum`
--

CREATE TABLE `komentar_forum` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `isi` text NOT NULL,
  `forum_id` bigint(20) NOT NULL,
  `penulis_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `komentar_forum`
--

INSERT INTO `komentar_forum` (`id`, `created_at`, `isi`, `forum_id`, `penulis_id`) VALUES
(1, '2026-06-17 17:39:41.000000', 'hemm', 1, 6),
(2, '2026-06-17 17:39:45.000000', 'gimana kids', 1, 6),
(3, '2026-06-18 15:50:19.000000', 'APA ITU PBO', 3, 6),
(4, '2026-06-19 22:10:23.000000', 'Ayo nanti aku bawa file tugas besar aku yaaa, jangan lupa siapkan kopinya', 4, 6),
(5, '2026-06-19 22:10:40.000000', '@Mahasiswa Demo 1 oke nanti aku siapkan kopi robusta yang enak buat kita ngobrol bareng', 4, 6);

-- --------------------------------------------------------

--
-- Table structure for table `kuis`
--

CREATE TABLE `kuis` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deadline` datetime(6) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `durasi_menit` int(11) NOT NULL,
  `judul` varchar(200) NOT NULL,
  `mata_kuliah_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kuis`
--

INSERT INTO `kuis` (`id`, `created_at`, `deadline`, `deskripsi`, `durasi_menit`, `judul`, `mata_kuliah_id`) VALUES
(1, '2026-06-17 17:33:23.000000', '2026-06-17 18:00:00.000000', 'Kerjakan', 20, 'Coba Quiz', 1),
(2, '2026-06-17 17:35:31.000000', '2026-06-17 18:00:00.000000', '', 5, 'Coba quizz', 1),
(3, '2026-06-17 17:49:58.000000', '2026-06-17 23:59:00.000000', '', 5, 'Coba quiz AI', 1),
(4, '2026-06-18 15:44:00.000000', '2026-06-18 23:59:00.000000', '', 60, 'Tugas Quiz', 1),
(5, '2026-06-19 22:04:37.000000', '2026-06-19 23:59:00.000000', '', 28, 'Tugas 1 - Quiz', 3),
(6, '2026-06-20 18:39:48.000000', '2026-06-20 23:59:00.000000', 'Kerjakan Quiz dengan benar perhatikan kata katanya siapa tau ada yang menjebak', 18, 'Tugas 1 - Quiz Harian DKA', 3);

-- --------------------------------------------------------

--
-- Table structure for table `mahasiswa`
--

CREATE TABLE `mahasiswa` (
  `nim` varchar(20) NOT NULL,
  `semester` int(11) NOT NULL,
  `id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mahasiswa`
--

INSERT INTO `mahasiswa` (`nim`, `semester`, `id`) VALUES
('201', 4, 6),
('202', 4, 7),
('203', 4, 8),
('204', 4, 9),
('205', 4, 10),
('206', 4, 11),
('207', 4, 12),
('208', 4, 13),
('209', 4, 14),
('210', 4, 15);

-- --------------------------------------------------------

--
-- Table structure for table `mata_kuliah`
--

CREATE TABLE `mata_kuliah` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `kode_kelas` varchar(20) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `dosen_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mata_kuliah`
--

INSERT INTO `mata_kuliah` (`id`, `created_at`, `kode_kelas`, `nama`, `dosen_id`) VALUES
(1, '2026-06-17 17:29:11.000000', 'PBO-900', 'Pemrograman Berorientasi Objek', 1),
(2, '2026-06-18 15:53:17.000000', 'PBK-782', 'Struktur Data', 1),
(3, '2026-06-19 22:00:50.000000', 'DKA-676', 'Dasar Kecerdasan Artificial', 1),
(4, '2026-06-20 18:41:32.000000', 'DPB-901', 'Dasar Pemrograman Berorientasi Objek', 1);

-- --------------------------------------------------------

--
-- Table structure for table `mata_kuliah_mahasiswa`
--

CREATE TABLE `mata_kuliah_mahasiswa` (
  `mata_kuliah_id` bigint(20) NOT NULL,
  `mahasiswa_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mata_kuliah_mahasiswa`
--

INSERT INTO `mata_kuliah_mahasiswa` (`mata_kuliah_id`, `mahasiswa_id`) VALUES
(1, 6),
(2, 6),
(3, 6);

-- --------------------------------------------------------

--
-- Table structure for table `modul_ajar`
--

CREATE TABLE `modul_ajar` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `judul` varchar(200) NOT NULL,
  `tipe` varchar(20) NOT NULL,
  `mata_kuliah_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `modul_ajar`
--

INSERT INTO `modul_ajar` (`id`, `created_at`, `file_path`, `judul`, `tipe`, `mata_kuliah_id`) VALUES
(1, '2026-06-17 17:29:30.000000', '/api/modules/files/b66111bb-741d-4b2c-929f-c2f0b25c96ca.pdf', 'PBO_LAGI', 'PDF', 1),
(2, '2026-06-17 17:29:46.000000', '/api/modules/files/d195624c-649a-4200-bb03-0fef74ef06ce.docx', 'COBAA WORD', 'DOCX', 1),
(3, '2026-06-18 15:36:05.000000', '/api/modules/files/5f89fa96-3335-4998-a498-d5d3482b079c.pdf', 'Pertemuan 1 - PBO', 'PDF', 1),
(4, '2026-06-19 22:01:29.000000', '/api/modules/files/b6ef9696-2946-4a2e-83c9-5f71d6d226c0.pdf', 'Pertemuan 1 -PDF', 'PDF', 3),
(5, '2026-06-19 22:01:41.000000', '/api/modules/files/976bfade-bb72-4694-bd10-3a169f1b7825.docx', 'PERTEMUAN 2 - WORD', 'DOCX', 3);

-- --------------------------------------------------------

--
-- Table structure for table `notifikasi`
--

CREATE TABLE `notifikasi` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `message` varchar(255) NOT NULL,
  `read_status` bit(1) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifikasi`
--

INSERT INTO `notifikasi` (`id`, `created_at`, `message`, `read_status`, `type`, `user_id`) VALUES
(1, '2026-06-17 17:49:58.000000', 'Kuis baru: Coba quiz AI telah ditambahkan di mata kuliah Pemrograman Berorientasi Objek lagi', b'1', 'KUIS_BARU', 6),
(2, '2026-06-18 10:34:59.000000', 'Tugas Baru: Tugas-2_Coba-Tugas-PBO - Pemrograman Berorientasi Objek lagi', b'1', 'TUGAS_BARU', 6),
(3, '2026-06-18 15:38:29.000000', 'Tugas Baru: Tugas 1 -  - Pemrograman Berorientasi Objek lagi', b'1', 'TUGAS_BARU', 6),
(4, '2026-06-18 15:44:00.000000', 'Kuis Baru: Tugas Quiz - Pemrograman Berorientasi Objek lagi', b'1', 'KUIS_BARU', 6),
(5, '2026-06-18 15:44:42.000000', 'Tugas Baru: Tugas Biasa - Pemrograman Berorientasi Objek lagi', b'1', 'TUGAS_BARU', 6),
(6, '2026-06-19 22:15:44.000000', 'Tugas Baru: Tugas 2 - jadi - Dasar Kecerdasan Artificial', b'0', 'TUGAS_BARU', 6),
(7, '2026-06-20 18:39:48.000000', 'Kuis Baru: Tugas 1 - Quiz Harian DKA - Dasar Kecerdasan Artificial', b'0', 'KUIS_BARU', 6),
(8, '2026-06-20 18:40:43.000000', 'Tugas Baru: Tugas 1 - Merangkaum dari PDF - Dasar Kecerdasan Artificial', b'0', 'TUGAS_BARU', 6);

-- --------------------------------------------------------

--
-- Table structure for table `pengumpulan_tugas`
--

CREATE TABLE `pengumpulan_tugas` (
  `id` bigint(20) NOT NULL,
  `dikumpulkan` datetime(6) DEFAULT NULL,
  `file_jawaban` varchar(500) DEFAULT NULL,
  `nilai` double DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `kuis_id` bigint(20) DEFAULT NULL,
  `mahasiswa_id` bigint(20) NOT NULL,
  `tugas_id` bigint(20) DEFAULT NULL,
  `detail_nilai` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengumpulan_tugas`
--

INSERT INTO `pengumpulan_tugas` (`id`, `dikumpulkan`, `file_jawaban`, `nilai`, `status`, `kuis_id`, `mahasiswa_id`, `tugas_id`, `detail_nilai`) VALUES
(1, '2026-06-17 17:38:57.000000', '/api/tugas/files/jawaban/8f459a8c-b7ac-4f52-a4e2-47d8d84e611b.pdf', 80, 'SUDAH_DINILAI', NULL, 6, 1, NULL),
(2, '2026-06-17 17:39:16.000000', '/api/tugas/files/jawaban/5467606a-599c-45a4-a96e-9cc817e18d19.json', 20, 'SUDAH_DINILAI', 1, 6, NULL, NULL),
(3, '2026-06-17 17:39:27.000000', '/api/tugas/files/jawaban/204f65eb-f726-4d65-808f-1771e87d47b7.json', 90, 'SUDAH_DINILAI', 2, 6, NULL, NULL),
(4, '2026-06-17 18:06:11.000000', '/api/tugas/files/jawaban/d309e173-e5a0-4caa-b1bb-b5e8a47581d9.json', 74.5, 'SUDAH_DINILAI', 3, 6, NULL, '{\"11\":\"100\",\"12\":\"98\"}'),
(5, '2026-06-18 10:37:56.000000', '/api/tugas/files/jawaban/b50c06cd-bc63-4256-89f6-fe985665f6ba.pdf', 100, 'SUDAH_DINILAI', NULL, 6, 2, NULL),
(6, '2026-06-18 15:48:49.000000', '/api/tugas/files/jawaban/784f2f59-37e4-4236-baa2-ecc440625ad7.docx', 80, 'SUDAH_DINILAI', NULL, 6, 3, NULL),
(7, '2026-06-18 15:49:36.000000', '/api/tugas/files/jawaban/0c772164-cde0-45e6-b032-071ad8d9c460.json', 40, 'SUDAH_DINILAI', 4, 6, NULL, '{\"15\":\"30\"}'),
(8, '2026-06-19 22:09:41.000000', '/api/tugas/files/jawaban/4c2f3610-af61-46ee-9f07-17352b2beef7.json', 45, 'SUDAH_DINILAI', 5, 6, NULL, '{\"18\":\"40\"}'),
(9, '2026-06-19 22:16:19.000000', '/api/tugas/files/jawaban/0b553d8d-412f-46b1-b109-211f8bdbab9c.pdf', 80, 'SUDAH_DINILAI', NULL, 6, 6, NULL),
(10, '2026-06-20 18:54:07.000000', '/api/tugas/files/jawaban/e57fba9c-13bc-4c3d-908b-f669309744ac.json', 50, 'SUDAH_DINILAI', 6, 6, NULL, '{\"21\":\"50\",\"22\":\"50\"}'),
(11, '2026-06-20 18:55:38.000000', '/api/tugas/files/jawaban/bb8582d2-2744-47e9-bfee-ffefa10b82c8.pdf', 90, 'SUDAH_DINILAI', NULL, 6, 7, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `soal`
--

CREATE TABLE `soal` (
  `id` bigint(20) NOT NULL,
  `kunci_jawaban` varchar(5) NOT NULL,
  `pertanyaan` text NOT NULL,
  `pilihan_a` varchar(500) DEFAULT NULL,
  `pilihan_b` varchar(500) DEFAULT NULL,
  `pilihan_c` varchar(500) DEFAULT NULL,
  `pilihan_d` varchar(500) DEFAULT NULL,
  `skor` double NOT NULL,
  `tipe` varchar(20) DEFAULT NULL,
  `kuis_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `soal`
--

INSERT INTO `soal` (`id`, `kunci_jawaban`, `pertanyaan`, `pilihan_a`, `pilihan_b`, `pilihan_c`, `pilihan_d`, `skor`, `tipe`, `kuis_id`) VALUES
(1, 'A', 'daw', 'sa', 'defe', 'da', 'deaf', 10, 'PILIHAN_GANDA', 1),
(2, '-', 'adwas', NULL, NULL, NULL, NULL, 10, 'ESSAY', 1),
(3, '-', 'sdawadsd', NULL, NULL, NULL, NULL, 10, 'ESSAY', 1),
(4, '-', 'adwasdawada', NULL, NULL, NULL, NULL, 10, 'ESSAY', 1),
(5, 'A', 'apa nama ayam', 'A. Ayam', 'B. buyam', 'C. cayam', 'D. dayam', 10, 'PILIHAN_GANDA', 2),
(6, 'A', 'Apa nama saya', '1. firman', '2. firmansyah', '3, firmanajah', '4. Moch firmanysah', 10, 'PILIHAN_GANDA', 2),
(7, '-', 'dawda', NULL, NULL, NULL, NULL, 10, 'ESSAY', 2),
(8, '-', 'daws', NULL, NULL, NULL, NULL, 10, 'ESSAY', 2),
(9, 'A', 'apa nama ayam', 'A. Ayam', 'B. buyam', 'C. cayam', 'D. dayam', 10, 'PILIHAN_GANDA', 3),
(10, 'A', 'Apa nama saya', '1. firman', '2. firmansyah', '3, firmanajah', '4. Moch firmanysah', 10, 'PILIHAN_GANDA', 3),
(11, '-', 'adasd', NULL, NULL, NULL, NULL, 10, 'ESSAY', 3),
(12, '-', 'ini quiz AI', NULL, NULL, NULL, NULL, 10, 'ESSAY', 3),
(13, 'D', 'apa nama ayam', 'A. Ayam', 'B. buyam', 'C. cayam', 'D. dayam', 10, 'PILIHAN_GANDA', 4),
(14, 'B', 'Apa nama saya', '1. firman', '2. firmansyah', '3, firmanajah', '4. Moch firmanysah', 10, 'PILIHAN_GANDA', 4),
(15, '-', 'Masukan Pertanyaan', NULL, NULL, NULL, NULL, 10, 'ESSAY', 4),
(16, 'B', 'apa nama ayam', 'A. Ayam', 'B. buyam', 'C. cayam', 'D. dayam', 10, 'PILIHAN_GANDA', 5),
(17, 'B', 'Apa nama saya', '1. firman', '2. firmansyah', '3, firmanajah', '4. Moch firmanysah', 10, 'PILIHAN_GANDA', 5),
(18, '-', 'Nama aku siapa ayah', NULL, NULL, NULL, NULL, 10, 'ESSAY', 5),
(19, 'A', 'DKA Kepanjangannya apa', 'Dasar Kecerdasan Artificial', 'Dasar kekuatan AI', 'Dasar kekuasaan AI', 'Dasar kebiasaan AI', 10, 'PILIHAN_GANDA', 6),
(20, 'A', 'AI Itu apa', 'Artificial Intellegence', 'Artificial Informatika', 'Asiapp', 'Informatika Artificial', 10, 'PILIHAN_GANDA', 6),
(21, '-', 'Ada berapa jenis AI ', NULL, NULL, NULL, NULL, 10, 'ESSAY', 6),
(22, '-', 'AI itu beragam apakah kamu setuju dengan AI, sebutkan pendapat kamu', NULL, NULL, NULL, NULL, 10, 'ESSAY', 6);

-- --------------------------------------------------------

--
-- Table structure for table `tugas`
--

CREATE TABLE `tugas` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deadline` datetime(6) NOT NULL,
  `detail_tugas` text DEFAULT NULL,
  `file_soal` varchar(500) DEFAULT NULL,
  `judul` varchar(200) NOT NULL,
  `mata_kuliah_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tugas`
--

INSERT INTO `tugas` (`id`, `created_at`, `deadline`, `detail_tugas`, `file_soal`, `judul`, `mata_kuliah_id`) VALUES
(1, '2026-06-17 17:32:15.000000', '2026-06-17 18:00:00.000000', 'kerjakan ganteng', '/api/tugas/files/7574ec26-4089-4bd8-8100-555f72b1f645.pdf', 'Tugas Ah cobaa', 1),
(2, '2026-06-18 10:34:59.000000', '2026-06-18 23:59:00.000000', 'Pahami dan Kerjakan tugasnya dengan benar', '/api/tugas/files/3f5a0f7c-4f0b-446f-aa88-927c3d4beb63.pdf', 'Tugas-2_Coba-Tugas-PBO', 1),
(3, '2026-06-18 15:38:29.000000', '2026-06-18 19:20:00.000000', '', '/api/tugas/files/364f3f77-5eea-498d-85c0-d94a6d6f0392.pdf', 'Tugas 1 - ', 1),
(4, '2026-06-18 15:44:42.000000', '2026-06-18 16:00:00.000000', '', '/api/tugas/files/af959cc2-73b0-44de-afb3-21e379032264.pdf', 'Tugas Biasa', 1),
(5, '2026-06-19 22:03:20.000000', '2026-06-19 22:08:00.000000', '', '/api/tugas/files/c3741992-e192-4ec1-ad80-78cd5fa80ef4.pdf', 'Tugas - 1', 3),
(6, '2026-06-19 22:15:44.000000', '2026-06-19 23:59:00.000000', '', '/api/tugas/files/266b5b2a-56f5-43d0-a947-06ba2b9cda38.pdf', 'Tugas 2 - jadi', 3),
(7, '2026-06-20 18:40:43.000000', '2026-06-20 23:59:00.000000', 'Kerjakan dengan benar, nanti jawaban ditulis tangan dikumpulkan ', '/api/tugas/files/fa67a588-1db8-47e4-9e72-85e57b8fb32c.pdf', 'Tugas 1 - Merangkaum dari PDF', 3),
(8, '2026-06-20 18:48:12.000000', '2026-06-20 23:59:00.000000', '', '/api/tugas/files/f323d605-3a86-4363-9344-6a606c15607f.pdf', 'Tugas 1 - Coba', 4);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `dtype` varchar(31) NOT NULL,
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `nomor_induk` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_picture` varchar(500) DEFAULT NULL,
  `role` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`dtype`, `id`, `created_at`, `email`, `nama`, `nomor_induk`, `password`, `profile_picture`, `role`) VALUES
('DOSEN', 1, '2026-06-17 17:27:54.000000', 'dosen1@dialajar.com', 'Dosen Demo 1', '101', '$2a$10$hCLW982D8Ri4Kx0WLIKQDOHVb42PbWAPv6MQS5OV8FuEz7ikW.sbm', '/api/profile/files/e16b2384-a362-46d9-b0ff-46dbba2407fb.jpg', 'DOSEN'),
('DOSEN', 2, '2026-06-17 17:27:54.000000', 'dosen2@dialajar.com', 'Dosen Demo 2', '102', '$2a$10$8pDyTTGjwXtR7mI..IAhoOw9x8OoKwbK9/v8JmEWdhodINItPV1nm', NULL, 'DOSEN'),
('DOSEN', 3, '2026-06-17 17:27:54.000000', 'dosen3@dialajar.com', 'Dosen Demo 3', '103', '$2a$10$8pDyTTGjwXtR7mI..IAhoOw9x8OoKwbK9/v8JmEWdhodINItPV1nm', NULL, 'DOSEN'),
('DOSEN', 4, '2026-06-17 17:27:54.000000', 'dosen4@dialajar.com', 'Dosen Demo 4', '104', '$2a$10$8pDyTTGjwXtR7mI..IAhoOw9x8OoKwbK9/v8JmEWdhodINItPV1nm', NULL, 'DOSEN'),
('DOSEN', 5, '2026-06-17 17:27:54.000000', 'dosen5@dialajar.com', 'Dosen Demo 5', '105', '$2a$10$8pDyTTGjwXtR7mI..IAhoOw9x8OoKwbK9/v8JmEWdhodINItPV1nm', NULL, 'DOSEN'),
('MAHASISWA', 6, '2026-06-17 17:27:54.000000', 'mhs1@student.dialajar.com', 'Mahasiswa Demo 1', '201', '$2a$10$6UNiXAzglRj/XM/HzTTV7.ejougZJXJd9vHrzIyFYvrjs/59j2JX2', '/api/profile/files/d1e5acd2-8fb3-420b-9461-2c9223a3573c.jpg', 'MAHASISWA'),
('MAHASISWA', 7, '2026-06-17 17:27:54.000000', 'mhs2@student.dialajar.com', 'Mahasiswa Demo 2', '202', '$2a$10$znZjqeid3u9JO.01eRfnqebIRYh4XZMT67/pqCBoJqe2xdJ7s1O9q', NULL, 'MAHASISWA'),
('MAHASISWA', 8, '2026-06-17 17:27:54.000000', 'mhs3@student.dialajar.com', 'Mahasiswa Demo 3', '203', '$2a$10$znZjqeid3u9JO.01eRfnqebIRYh4XZMT67/pqCBoJqe2xdJ7s1O9q', NULL, 'MAHASISWA'),
('MAHASISWA', 9, '2026-06-17 17:27:54.000000', 'mhs4@student.dialajar.com', 'Mahasiswa Demo 4', '204', '$2a$10$znZjqeid3u9JO.01eRfnqebIRYh4XZMT67/pqCBoJqe2xdJ7s1O9q', NULL, 'MAHASISWA'),
('MAHASISWA', 10, '2026-06-17 17:27:54.000000', 'mhs5@student.dialajar.com', 'Mahasiswa Demo 5', '205', '$2a$10$znZjqeid3u9JO.01eRfnqebIRYh4XZMT67/pqCBoJqe2xdJ7s1O9q', NULL, 'MAHASISWA'),
('MAHASISWA', 11, '2026-06-17 17:27:54.000000', 'mhs6@student.dialajar.com', 'Mahasiswa Demo 6', '206', '$2a$10$znZjqeid3u9JO.01eRfnqebIRYh4XZMT67/pqCBoJqe2xdJ7s1O9q', NULL, 'MAHASISWA'),
('MAHASISWA', 12, '2026-06-17 17:27:54.000000', 'mhs7@student.dialajar.com', 'Mahasiswa Demo 7', '207', '$2a$10$znZjqeid3u9JO.01eRfnqebIRYh4XZMT67/pqCBoJqe2xdJ7s1O9q', NULL, 'MAHASISWA'),
('MAHASISWA', 13, '2026-06-17 17:27:54.000000', 'mhs8@student.dialajar.com', 'Mahasiswa Demo 8', '208', '$2a$10$znZjqeid3u9JO.01eRfnqebIRYh4XZMT67/pqCBoJqe2xdJ7s1O9q', NULL, 'MAHASISWA'),
('MAHASISWA', 14, '2026-06-17 17:27:54.000000', 'mhs9@student.dialajar.com', 'Mahasiswa Demo 9', '209', '$2a$10$znZjqeid3u9JO.01eRfnqebIRYh4XZMT67/pqCBoJqe2xdJ7s1O9q', NULL, 'MAHASISWA'),
('MAHASISWA', 15, '2026-06-17 17:27:54.000000', 'mhs10@student.dialajar.com', 'Mahasiswa Demo 10', '210', '$2a$10$znZjqeid3u9JO.01eRfnqebIRYh4XZMT67/pqCBoJqe2xdJ7s1O9q', NULL, 'MAHASISWA');

-- --------------------------------------------------------

--
-- Table structure for table `video_ajar`
--

CREATE TABLE `video_ajar` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `judul` varchar(200) NOT NULL,
  `link_video` varchar(500) NOT NULL,
  `mata_kuliah_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `video_ajar`
--

INSERT INTO `video_ajar` (`id`, `created_at`, `judul`, `link_video`, `mata_kuliah_id`) VALUES
(1, '2026-06-17 17:30:48.000000', 'Materi PBO Video Link', 'https://youtu.be/u0DtCRjJu1A?si=K2NmJuMxZHYLWSjS', 1),
(2, '2026-06-17 17:31:15.000000', 'Video Youtube MP4', '/api/modules/video/files/d89da635-52df-458f-8306-c27911c1e20e.mp4', 1),
(3, '2026-06-18 15:37:31.000000', 'Pertemuan 2 - Belajar Bersama Windah', 'https://youtu.be/FXDzAlJOImc?si=S52Mvrk4mJtWjfZe', 1),
(4, '2026-06-19 22:02:00.000000', 'Pertemuan 1 - youtube', 'https://youtu.be/WYSLIMQnuR0?si=5NMwHLM-7eIY-oTk', 3),
(5, '2026-06-19 22:02:25.000000', 'Pertemuan 1 - video mp4', '/api/modules/video/files/6f7f082a-3d9a-4ae1-abf2-e4b2ecb7bdfb.mp4', 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dosen`
--
ALTER TABLE `dosen`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_ph80s81wxxgarlwo8jwhpaggv` (`nip`);

--
-- Indexes for table `forum_diskusi`
--
ALTER TABLE `forum_diskusi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK95hul230gajwd0yqirjiiif2i` (`mata_kuliah_id`),
  ADD KEY `FKax9sf8pvtkc768k7dm650nwkh` (`pembuat_id`);

--
-- Indexes for table `komentar_forum`
--
ALTER TABLE `komentar_forum`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK7s17bw0bwmcd3unbr9ewinojt` (`forum_id`),
  ADD KEY `FK7semc0ec8ywr5sdssswv15ha9` (`penulis_id`);

--
-- Indexes for table `kuis`
--
ALTER TABLE `kuis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK62b3501ny3hn0r66tib8ysi1x` (`mata_kuliah_id`);

--
-- Indexes for table `mahasiswa`
--
ALTER TABLE `mahasiswa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_kvm6yjgxjs9vo3qhqsjog1a1p` (`nim`);

--
-- Indexes for table `mata_kuliah`
--
ALTER TABLE `mata_kuliah`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_lkjr3fkuhevdl0urami05hsdd` (`kode_kelas`),
  ADD KEY `FKa56tfl77fs5iasubrog242u4c` (`dosen_id`);

--
-- Indexes for table `mata_kuliah_mahasiswa`
--
ALTER TABLE `mata_kuliah_mahasiswa`
  ADD PRIMARY KEY (`mata_kuliah_id`,`mahasiswa_id`),
  ADD KEY `FKca6tejs1dr89k3oc9tsym7g52` (`mahasiswa_id`);

--
-- Indexes for table `modul_ajar`
--
ALTER TABLE `modul_ajar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKa7w9o1mko23h1vcy4gossmn53` (`mata_kuliah_id`);

--
-- Indexes for table `notifikasi`
--
ALTER TABLE `notifikasi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pengumpulan_tugas`
--
ALTER TABLE `pengumpulan_tugas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKhhpmvwpnmh17cg4dngnmbt6si` (`kuis_id`),
  ADD KEY `FK72l6ack3ex0hfrqrlssrnryrm` (`mahasiswa_id`),
  ADD KEY `FKp1naw1vc5b97p54pgn10gvg9b` (`tugas_id`);

--
-- Indexes for table `soal`
--
ALTER TABLE `soal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKd846mukcad1388c1sa97glgjo` (`kuis_id`);

--
-- Indexes for table `tugas`
--
ALTER TABLE `tugas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK8b9d0mhaqo5x1ie5j2p34i47f` (`mata_kuliah_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`),
  ADD UNIQUE KEY `UK_aqlyo6md40d9dcg8e4dd4t60g` (`nomor_induk`);

--
-- Indexes for table `video_ajar`
--
ALTER TABLE `video_ajar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKm27n34leixt14t94oo4guffp3` (`mata_kuliah_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `forum_diskusi`
--
ALTER TABLE `forum_diskusi`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `komentar_forum`
--
ALTER TABLE `komentar_forum`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `kuis`
--
ALTER TABLE `kuis`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `mata_kuliah`
--
ALTER TABLE `mata_kuliah`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `modul_ajar`
--
ALTER TABLE `modul_ajar`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifikasi`
--
ALTER TABLE `notifikasi`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `pengumpulan_tugas`
--
ALTER TABLE `pengumpulan_tugas`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `soal`
--
ALTER TABLE `soal`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `tugas`
--
ALTER TABLE `tugas`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `video_ajar`
--
ALTER TABLE `video_ajar`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dosen`
--
ALTER TABLE `dosen`
  ADD CONSTRAINT `FKe0y35skpanhydjt2uh5n36n2x` FOREIGN KEY (`id`) REFERENCES `users` (`id`);

--
-- Constraints for table `forum_diskusi`
--
ALTER TABLE `forum_diskusi`
  ADD CONSTRAINT `FK95hul230gajwd0yqirjiiif2i` FOREIGN KEY (`mata_kuliah_id`) REFERENCES `mata_kuliah` (`id`),
  ADD CONSTRAINT `FKax9sf8pvtkc768k7dm650nwkh` FOREIGN KEY (`pembuat_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `komentar_forum`
--
ALTER TABLE `komentar_forum`
  ADD CONSTRAINT `FK7s17bw0bwmcd3unbr9ewinojt` FOREIGN KEY (`forum_id`) REFERENCES `forum_diskusi` (`id`),
  ADD CONSTRAINT `FK7semc0ec8ywr5sdssswv15ha9` FOREIGN KEY (`penulis_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `kuis`
--
ALTER TABLE `kuis`
  ADD CONSTRAINT `FK62b3501ny3hn0r66tib8ysi1x` FOREIGN KEY (`mata_kuliah_id`) REFERENCES `mata_kuliah` (`id`);

--
-- Constraints for table `mahasiswa`
--
ALTER TABLE `mahasiswa`
  ADD CONSTRAINT `FKrhp8pqsnd14pws4quc8w4mowr` FOREIGN KEY (`id`) REFERENCES `users` (`id`);

--
-- Constraints for table `mata_kuliah`
--
ALTER TABLE `mata_kuliah`
  ADD CONSTRAINT `FKa56tfl77fs5iasubrog242u4c` FOREIGN KEY (`dosen_id`) REFERENCES `dosen` (`id`);

--
-- Constraints for table `mata_kuliah_mahasiswa`
--
ALTER TABLE `mata_kuliah_mahasiswa`
  ADD CONSTRAINT `FKb4xjvnt0yd6ilt7sswke2gkl4` FOREIGN KEY (`mata_kuliah_id`) REFERENCES `mata_kuliah` (`id`),
  ADD CONSTRAINT `FKca6tejs1dr89k3oc9tsym7g52` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswa` (`id`);

--
-- Constraints for table `modul_ajar`
--
ALTER TABLE `modul_ajar`
  ADD CONSTRAINT `FKa7w9o1mko23h1vcy4gossmn53` FOREIGN KEY (`mata_kuliah_id`) REFERENCES `mata_kuliah` (`id`);

--
-- Constraints for table `pengumpulan_tugas`
--
ALTER TABLE `pengumpulan_tugas`
  ADD CONSTRAINT `FK72l6ack3ex0hfrqrlssrnryrm` FOREIGN KEY (`mahasiswa_id`) REFERENCES `mahasiswa` (`id`),
  ADD CONSTRAINT `FKhhpmvwpnmh17cg4dngnmbt6si` FOREIGN KEY (`kuis_id`) REFERENCES `kuis` (`id`),
  ADD CONSTRAINT `FKp1naw1vc5b97p54pgn10gvg9b` FOREIGN KEY (`tugas_id`) REFERENCES `tugas` (`id`);

--
-- Constraints for table `soal`
--
ALTER TABLE `soal`
  ADD CONSTRAINT `FKd846mukcad1388c1sa97glgjo` FOREIGN KEY (`kuis_id`) REFERENCES `kuis` (`id`);

--
-- Constraints for table `tugas`
--
ALTER TABLE `tugas`
  ADD CONSTRAINT `FK8b9d0mhaqo5x1ie5j2p34i47f` FOREIGN KEY (`mata_kuliah_id`) REFERENCES `mata_kuliah` (`id`);

--
-- Constraints for table `video_ajar`
--
ALTER TABLE `video_ajar`
  ADD CONSTRAINT `FKm27n34leixt14t94oo4guffp3` FOREIGN KEY (`mata_kuliah_id`) REFERENCES `mata_kuliah` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
