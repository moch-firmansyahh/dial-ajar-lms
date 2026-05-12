import { prisma } from "../lib/prisma.ts";  
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Memulai proses seeding data...');
  console.log('🗑️  Menghapus data lama...');

  // Hapus semua data lama secara berurutan (child -> parent)
  await prisma.likeForum.deleteMany();
  await prisma.komentarForum.deleteMany();
  await prisma.forumDiskusi.deleteMany();
  await prisma.pilihanJawaban.deleteMany();
  await prisma.soal.deleteMany();
  await prisma.kuis.deleteMany();
  await prisma.pengumpulanTugas.deleteMany();
  await prisma.progressTugas.deleteMany();
  await prisma.anggotaKelompok.deleteMany();
  await prisma.kelompok.deleteMany();
  await prisma.presensi.deleteMany();
  await prisma.tugas.deleteMany();
  await prisma.nilai.deleteMany();
  await prisma.modulAjar.deleteMany();
  await prisma.mataKuliah.deleteMany();
  await prisma.mahasiswa.deleteMany();
  await prisma.dosen.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log('✅ Data lama berhasil dihapus.');

  // ══════════════════════════════════════════════
  // 1. ROLES
  // ══════════════════════════════════════════════
  const roles = [
    { id: 1, nama: 'ADMIN' },
    { id: 2, nama: 'MAHASISWA' },
    { id: 3, nama: 'DOSEN' },
  ];
  for (const role of roles) {
    await prisma.role.create({ data: role });
  }
  console.log('✅ 3 Role berhasil dibuat.');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // ══════════════════════════════════════════════
  // 2. DOSEN (5 Dosen)
  // ══════════════════════════════════════════════
  const dosenList = [
    { ni: 'D001', nama: 'Dr. Budi Santoso, M.Kom',       email: 'budi.santoso@kampus.ac.id',    nip: '198001012010011001', nidn: '0401018001', bidang: 'Rekayasa Perangkat Lunak', ruangKantor: 'Gedung A Lt.3 R.301' },
    { ni: 'D002', nama: 'Prof. Siti Rahayu, Ph.D',        email: 'siti.rahayu@kampus.ac.id',     nip: '197505152005012001', nidn: '0515057501', bidang: 'Kecerdasan Buatan',        ruangKantor: 'Gedung A Lt.3 R.302' },
    { ni: 'D003', nama: 'Dr. Ahmad Fauzi, M.T',           email: 'ahmad.fauzi@kampus.ac.id',     nip: '198203102010011002', nidn: '1003028201', bidang: 'Jaringan Komputer',         ruangKantor: 'Gedung B Lt.2 R.205' },
    { ni: 'D004', nama: 'Dr. Dewi Lestari, M.Sc',         email: 'dewi.lestari@kampus.ac.id',    nip: '198506202012012001', nidn: '2006058501', bidang: 'Basis Data',                ruangKantor: 'Gedung A Lt.4 R.401' },
    { ni: 'D005', nama: 'Dr. Rudi Hermawan, S.Kom, M.Cs', email: 'rudi.hermawan@kampus.ac.id',   nip: '197912252008011001', nidn: '2512127901', bidang: 'Sistem Informasi',           ruangKantor: 'Gedung B Lt.3 R.310' },
  ];

  for (const d of dosenList) {
    await prisma.user.create({
      data: {
        nomorInduk: d.ni,
        nama: d.nama,
        email: d.email,
        password: hashedPassword,
        telepon: `0812${d.ni.slice(-3)}00001`,
        roleId: 3,
        dosen: {
          create: {
            nip: d.nip,
            nidn: d.nidn,
            bidang: d.bidang,
            ruangKantor: d.ruangKantor
          }
        }
      }
    });
  }
  console.log('✅ 5 Dosen berhasil dibuat.');

  // ══════════════════════════════════════════════
  // 3. MAHASISWA (10 Mahasiswa)
  // ══════════════════════════════════════════════
  const mahasiswaList = [
    { ni: 'U001', nim: '2026001', nama: 'Andi Pratama',       email: 'andi.pratama@kampus.ac.id' },
    { ni: 'U002', nim: '2026002', nama: 'Bella Safitri',      email: 'bella.safitri@kampus.ac.id' },
    { ni: 'U003', nim: '2026003', nama: 'Cahya Nugraha',      email: 'cahya.nugraha@kampus.ac.id' },
    { ni: 'U004', nim: '2026004', nama: 'Dina Maharani',      email: 'dina.maharani@kampus.ac.id' },
    { ni: 'U005', nim: '2026005', nama: 'Eko Saputra',        email: 'eko.saputra@kampus.ac.id' },
    { ni: 'U006', nim: '2026006', nama: 'Fitri Handayani',    email: 'fitri.handayani@kampus.ac.id' },
    { ni: 'U007', nim: '2026007', nama: 'Galih Wicaksono',    email: 'galih.wicaksono@kampus.ac.id' },
    { ni: 'U008', nim: '2026008', nama: 'Hana Permata',       email: 'hana.permata@kampus.ac.id' },
    { ni: 'U009', nim: '2026009', nama: 'Irfan Maulana',      email: 'irfan.maulana@kampus.ac.id' },
    { ni: 'U010', nim: '2026010', nama: 'Jasmine Putri',      email: 'jasmine.putri@kampus.ac.id' },
  ];

  for (let i = 0; i < mahasiswaList.length; i++) {
    const m = mahasiswaList[i];
    await prisma.user.create({
      data: {
        nomorInduk: m.ni,
        nama: m.nama,
        email: m.email,
        password: hashedPassword,
        telepon: `08123${m.nim}`,
        roleId: 2,
        mahasiswa: { create: { nim: m.nim } }
      }
    });
  }
  console.log('✅ 10 Mahasiswa berhasil dibuat.');

  // ══════════════════════════════════════════════
  // 4. MATA KULIAH (5 Mata Kuliah, masing-masing diampu 1 Dosen)
  // ══════════════════════════════════════════════
  const matkulList = [
    { nama: 'Pemrograman Web',              nipDosen: dosenList[0].nip, jadwal: 'Senin,Rabu' },
    { nama: 'Kecerdasan Buatan',            nipDosen: dosenList[1].nip, jadwal: 'Selasa,Kamis' },
    { nama: 'Jaringan Komputer',            nipDosen: dosenList[2].nip, jadwal: 'Rabu,Jumat' },
    { nama: 'Basis Data',                   nipDosen: dosenList[3].nip, jadwal: 'Senin,Kamis' },
    { nama: 'Rekayasa Perangkat Lunak',     nipDosen: dosenList[4].nip, jadwal: 'Selasa,Jumat' },
  ];

  const createdMatkul = [];
  for (const mk of matkulList) {
    const created = await prisma.mataKuliah.create({
      data: {
        namaMataKuliah: mk.nama,
        nipDosen: mk.nipDosen,
        jadwal: mk.jadwal,
      }
    });
    createdMatkul.push(created);
  }
  console.log('✅ 5 Mata Kuliah berhasil dibuat.');

  // ══════════════════════════════════════════════
  // 5. PRESENSI — Semua mahasiswa terdaftar di SEMUA mata kuliah
  //    (Ini yang menghubungkan mahasiswa ke mata kuliah dosen)
  //    Dibuat 2 pertemuan per matkul (minggu lalu & minggu ini)
  // ══════════════════════════════════════════════
  const today = new Date();
  today.setUTCHours(12, 0, 0, 0);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const statusOptions = ['Hadir', 'Hadir', 'Hadir', 'Hadir', 'Hadir', 'Hadir', 'Hadir', 'Sakit', 'Izin', 'Alpha'];

  const presensiData = [];
  for (const mk of createdMatkul) {
    for (let i = 0; i < mahasiswaList.length; i++) {
      const m = mahasiswaList[i];
      // Pertemuan minggu lalu
      presensiData.push({
        nim: m.nim,
        idMataKuliah: mk.idMataKuliah,
        tanggalPertemuan: lastWeek,
        waktuPresensi: new Date(lastWeek.getTime() + (8 + Math.floor(i / 3)) * 3600000 + i * 60000),
        statusKehadiran: statusOptions[i % statusOptions.length],
      });
      // Pertemuan hari ini (belum presensi, status Alpha)
      presensiData.push({
        nim: m.nim,
        idMataKuliah: mk.idMataKuliah,
        tanggalPertemuan: today,
        statusKehadiran: 'Alpha',
      });
    }
  }
  await prisma.presensi.createMany({ data: presensiData });
  console.log(`✅ ${presensiData.length} data Presensi berhasil dibuat (10 mahasiswa × 5 matkul × 2 pertemuan).`);

  // ══════════════════════════════════════════════
  // 6. NILAI — Setiap mahasiswa punya nilai di setiap matkul
  // ══════════════════════════════════════════════
  const nilaiData = [];
  for (const mk of createdMatkul) {
    for (const m of mahasiswaList) {
      const base = 70 + Math.floor(Math.random() * 25);
      nilaiData.push({
        nomorInduk: m.ni,
        idMataKuliah: mk.idMataKuliah,
        nilaiTugas: base + 5,
        nilaiKuis: base + 2,
        nilaiAkhir: base + 3,
        semester: 4,
      });
    }
  }
  await prisma.nilai.createMany({ data: nilaiData });
  console.log(`✅ ${nilaiData.length} data Nilai berhasil dibuat.`);

  // ══════════════════════════════════════════════
  // 7. MODUL AJAR — 2 modul per matkul
  // ══════════════════════════════════════════════
  const tipeModul = ['PDF', 'Video', 'Presentasi', 'Dokumen'];
  const modulData = [];
  for (let i = 0; i < createdMatkul.length; i++) {
    const mk = createdMatkul[i];
    modulData.push({
      idMataKuliah: mk.idMataKuliah,
      judul: `Pengantar ${matkulList[i].nama}`,
      tipe_modul: 'PDF',
      deskripsi: `Materi pengantar dan silabus untuk mata kuliah ${matkulList[i].nama}.`,
      fileUrl: `/uploads/modul_pengantar_${mk.idMataKuliah}.pdf`,
      ukuran: '2.5 MB',
      canDownload: true,
    });
    modulData.push({
      idMataKuliah: mk.idMataKuliah,
      judul: `Praktikum ${matkulList[i].nama}`,
      tipe_modul: 'Video',
      deskripsi: `Video tutorial praktikum untuk ${matkulList[i].nama}.`,
      url: 'https://www.youtube.com/watch?v=example',
      ukuran: '150 MB',
      canDownload: false,
    });
  }
  await prisma.modulAjar.createMany({ data: modulData });
  console.log(`✅ ${modulData.length} Modul Ajar berhasil dibuat.`);

  // ══════════════════════════════════════════════
  // 8. TUGAS — 2 tugas per matkul, setiap mahasiswa punya record
  // ══════════════════════════════════════════════
  const tugasTemplates = [
    // Pemrograman Web (index 0)
    [
      { judul: 'Membuat Website Portfolio dengan HTML & CSS', detail: 'Buat website portfolio pribadi menggunakan HTML5 dan CSS3. Harus responsif dan memiliki minimal 3 halaman.', deadlineDays: 7 },
      { judul: 'Implementasi CRUD dengan JavaScript', detail: 'Buat aplikasi CRUD sederhana menggunakan JavaScript vanilla. Data disimpan di localStorage.', deadlineDays: 21 },
    ],
    // Kecerdasan Buatan (index 1)
    [
      { judul: 'Laporan Analisis Algoritma A*', detail: 'Analisis dan implementasikan algoritma A* untuk pencarian jalur terpendek. Sertakan visualisasi hasil.', deadlineDays: 5 },
      { judul: 'Implementasi Decision Tree', detail: 'Implementasikan algoritma Decision Tree dari scratch menggunakan Python. Uji dengan dataset Iris.', deadlineDays: 18 },
    ],
    // Jaringan Komputer (index 2)
    [
      { judul: 'Konfigurasi Jaringan LAN dengan Cisco Packet Tracer', detail: 'Rancang topologi jaringan LAN untuk sebuah kantor kecil. Gunakan VLAN dan routing static.', deadlineDays: 3 },
      { judul: 'Analisis Protokol TCP/IP dengan Wireshark', detail: 'Capture dan analisis paket TCP/IP pada jaringan lokal. Buat laporan analisis minimal 5 halaman.', deadlineDays: 14 },
    ],
    // Basis Data (index 3)
    [
      { judul: 'Perancangan ERD Sistem Informasi Perpustakaan', detail: 'Rancang Entity Relationship Diagram (ERD) lengkap untuk sistem perpustakaan digital. Minimal 8 entitas.', deadlineDays: 10 },
      { judul: 'Query SQL Lanjutan dan Optimasi', detail: 'Kerjakan 15 soal query SQL lanjutan meliputi JOIN, subquery, stored procedure, dan indexing.', deadlineDays: 24 },
    ],
    // Rekayasa Perangkat Lunak (index 4)
    [
      { judul: 'Dokumen SRS (Software Requirements Specification)', detail: 'Buat dokumen SRS lengkap untuk proyek kelompok akhir semester sesuai template IEEE 830.', deadlineDays: 12 },
      { judul: 'Desain UI/UX dengan Figma', detail: 'Buat mockup UI/UX untuk aplikasi mobile menggunakan Figma. Minimal 8 screen dengan prototype interaktif.', deadlineDays: 28 },
    ],
  ];

  const tugasData = [];
  for (let i = 0; i < createdMatkul.length; i++) {
    const mk = createdMatkul[i];
    const templates = tugasTemplates[i] || tugasTemplates[0];
    for (const tmpl of templates) {
      for (const m of mahasiswaList) {
        const deadlineDate = new Date(today.getTime() + tmpl.deadlineDays * 24 * 3600000);
        tugasData.push({
          idMataKuliah: mk.idMataKuliah,
          nim: m.nim,
          judul: tmpl.judul,
          detailTugas: tmpl.detail,
          deadlineTugas: deadlineDate,
        });
      }
    }
  }
  await prisma.tugas.createMany({ data: tugasData });
  console.log(`✅ ${tugasData.length} Tugas berhasil dibuat (2 tugas × 5 matkul × 10 mahasiswa).`);

  // ══════════════════════════════════════════════
  // 9. KUIS — 1 kuis per matkul
  // ══════════════════════════════════════════════
  const kuisData = [];
  for (let i = 0; i < createdMatkul.length; i++) {
    kuisData.push({
      idMataKuliah: createdMatkul[i].idMataKuliah,
      judul: `Kuis Mingguan - ${matkulList[i].nama}`,
      deadlineKuis: new Date(today.getTime() + 7 * 24 * 3600000),
      skor: 100,
    });
  }
  const createdKuis = [];
  for (const k of kuisData) {
    const created = await prisma.kuis.create({ data: k });
    createdKuis.push(created);
  }
  console.log(`✅ ${createdKuis.length} Kuis berhasil dibuat.`);

  // ══════════════════════════════════════════════
  // 10. SOAL & PILIHAN JAWABAN — 2 soal per kuis
  // ══════════════════════════════════════════════
  for (const kuis of createdKuis) {
    for (let q = 1; q <= 2; q++) {
      const soal = await prisma.soal.create({
        data: {
          idKuis: kuis.idKuis,
          pertanyaan: `Pertanyaan ${q}: Jelaskan konsep dasar terkait materi kuis ini.`,
          kunciJawaban: 'A',
          skor: 50,
        }
      });
      // 4 pilihan jawaban per soal
      await prisma.pilihanJawaban.createMany({
        data: [
          { idSoal: soal.idSoal, teksJawaban: 'Jawaban A (Benar)' },
          { idSoal: soal.idSoal, teksJawaban: 'Jawaban B' },
          { idSoal: soal.idSoal, teksJawaban: 'Jawaban C' },
          { idSoal: soal.idSoal, teksJawaban: 'Jawaban D' },
        ]
      });
    }
  }
  console.log('✅ Soal & Pilihan Jawaban berhasil dibuat (2 soal × 4 pilihan per kuis).');

  // ══════════════════════════════════════════════
  // 11. FORUM DISKUSI — 1 forum per matkul (dibuat dosen)
  // ══════════════════════════════════════════════
  const forumCreated = [];
  for (let i = 0; i < createdMatkul.length; i++) {
    const mk = createdMatkul[i];
    const forum = await prisma.forumDiskusi.create({
      data: {
        idMataKuliah: mk.idMataKuliah,
        judul: `Diskusi: ${matkulList[i].nama} - Pertemuan 1`,
        isiForum: `Selamat datang di forum diskusi ${matkulList[i].nama}. Silakan bertanya atau berdiskusi mengenai materi pertemuan pertama.`,
        nomorInduk: dosenList[i].ni,
      }
    });
    forumCreated.push(forum);
  }
  console.log(`✅ ${forumCreated.length} Forum Diskusi berhasil dibuat.`);

  // ══════════════════════════════════════════════
  // 12. KOMENTAR FORUM — 2 komentar per forum dari mahasiswa
  // ══════════════════════════════════════════════
  const komentarData = [];
  for (let i = 0; i < forumCreated.length; i++) {
    komentarData.push({
      nomorInduk: mahasiswaList[i * 2 % 10].ni,
      idForum: forumCreated[i].idForumDiskusi,
      isiKomentar: 'Terima kasih Pak/Bu, materinya sangat bermanfaat. Apakah ada referensi tambahan?',
    });
    komentarData.push({
      nomorInduk: mahasiswaList[(i * 2 + 1) % 10].ni,
      idForum: forumCreated[i].idForumDiskusi,
      isiKomentar: 'Saya ingin bertanya mengenai topik yang dibahas di slide ke-3.',
    });
  }
  await prisma.komentarForum.createMany({ data: komentarData });
  console.log(`✅ ${komentarData.length} Komentar Forum berhasil dibuat.`);

  // ══════════════════════════════════════════════
  // 13. LIKE FORUM — beberapa like
  // ══════════════════════════════════════════════
  const likeData = [];
  for (let i = 0; i < forumCreated.length; i++) {
    // 3 mahasiswa like setiap forum
    for (let j = 0; j < 3; j++) {
      likeData.push({
        nomorInduk: mahasiswaList[(i + j) % 10].ni,
        idForum: forumCreated[i].idForumDiskusi,
      });
    }
  }
  await prisma.likeForum.createMany({ data: likeData, skipDuplicates: true });
  console.log(`✅ ${likeData.length} Like Forum berhasil dibuat.`);

  // ══════════════════════════════════════════════
  // 14. KELOMPOK — 2 kelompok per matkul
  // ══════════════════════════════════════════════
  const kelompokCreated = [];
  const warna = ['#4b53bc', '#2f9696', '#c47f17', '#dc2626', '#059669'];
  for (let i = 0; i < createdMatkul.length; i++) {
    const mk = createdMatkul[i];
    const k1 = await prisma.kelompok.create({
      data: {
        idMataKuliah: mk.idMataKuliah,
        namaKelompok: `Kelompok 1 - ${matkulList[i].nama}`,
        warna: warna[i % warna.length],
        tugasName: `Proyek Akhir ${matkulList[i].nama}`,
        progress: 60,
        status: 'In Progress',
        submitted: false,
      }
    });
    const k2 = await prisma.kelompok.create({
      data: {
        idMataKuliah: mk.idMataKuliah,
        namaKelompok: `Kelompok 2 - ${matkulList[i].nama}`,
        warna: warna[(i + 1) % warna.length],
        tugasName: `Proyek Akhir ${matkulList[i].nama}`,
        progress: 35,
        status: 'In Progress',
        submitted: false,
      }
    });
    kelompokCreated.push(k1, k2);
  }
  console.log(`✅ ${kelompokCreated.length} Kelompok berhasil dibuat.`);

  // ══════════════════════════════════════════════
  // 15. ANGGOTA KELOMPOK — 5 mahasiswa per kelompok
  // ══════════════════════════════════════════════
  const anggotaData = [];
  for (let ki = 0; ki < kelompokCreated.length; ki++) {
    const k = kelompokCreated[ki];
    // Kelompok ganjil: mahasiswa 0-4, kelompok genap: mahasiswa 5-9
    const startIdx = (ki % 2 === 0) ? 0 : 5;
    for (let j = 0; j < 5; j++) {
      anggotaData.push({
        idKelompok: k.idKelompok,
        nim: mahasiswaList[startIdx + j].nim,
        nilaiTugas: 75 + Math.floor(Math.random() * 20),
      });
    }
  }
  await prisma.anggotaKelompok.createMany({ data: anggotaData, skipDuplicates: true });
  console.log(`✅ ${anggotaData.length} Anggota Kelompok berhasil dibuat.`);

  // ══════════════════════════════════════════════
  // 16. PROGRESS TUGAS — beberapa mahasiswa sudah mulai
  // ══════════════════════════════════════════════
  const progressData = [];
  for (let i = 0; i < createdMatkul.length; i++) {
    const mk = createdMatkul[i];
    // 5 mahasiswa pertama sudah mulai mengerjakan
    for (let j = 0; j < 5; j++) {
      progressData.push({
        idMataKuliah: mk.idMataKuliah,
        nim: mahasiswaList[j].nim,
        judul: `Progress Tugas 1 - ${matkulList[i].nama}`,
        detailTugas: 'Sudah mengerjakan 50% bagian teori dan praktikum.',
        deadlineTugas: new Date(today.getTime() + 14 * 24 * 3600000),
      });
    }
  }
  await prisma.progressTugas.createMany({ data: progressData });
  console.log(`✅ ${progressData.length} Progress Tugas berhasil dibuat.`);

  // ══════════════════════════════════════════════
  // 17. PENGUMPULAN TUGAS — beberapa mahasiswa sudah mengumpulkan
  // ══════════════════════════════════════════════
  const tugasFromDB = await prisma.tugas.findMany();
  const pengumpulanData = [];
  // 3 mahasiswa pertama sudah mengumpulkan tugas di setiap matkul
  for (let i = 0; i < createdMatkul.length; i++) {
    const mkTugas = tugasFromDB.filter(t => t.idMataKuliah === createdMatkul[i].idMataKuliah);
    for (let j = 0; j < 3 && j < mkTugas.length; j++) {
      const t = mkTugas[j];
      pengumpulanData.push({
        idKelompok: kelompokCreated[i * 2].idKelompok,
        idTugas: t.idTugas,
        nim: t.nim,
        judul: `Submission: ${t.judul}`,
        detailTugas: 'Berikut terlampir file jawaban tugas.',
        fileJawaban: `/uploads/jawaban_${t.nim}_mk${t.idMataKuliah}.pdf`,
      });
    }
  }
  await prisma.pengumpulanTugas.createMany({ data: pengumpulanData });
  console.log(`✅ ${pengumpulanData.length} Pengumpulan Tugas berhasil dibuat.`);

  // ══════════════════════════════════════════════
  // SELESAI
  // ══════════════════════════════════════════════
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('  ✅ SEEDING SELESAI!');
  console.log('═══════════════════════════════════════════');
  console.log('');
  console.log('📋 Ringkasan Data:');
  console.log('  • 3 Role (Admin, Mahasiswa, Dosen)');
  console.log('  • 5 Dosen');
  console.log('  • 10 Mahasiswa');
  console.log('  • 5 Mata Kuliah (masing-masing diampu 1 Dosen)');
  console.log('  • Semua mahasiswa terdaftar di semua mata kuliah');
  console.log('  • Presensi, Nilai, Tugas, Kelompok, Forum, Kuis, dll.');
  console.log('');
  console.log('🔑 Akun Login:');
  console.log('  Dosen    → D001 / password123');
  console.log('  Mahasiswa → U001 / password123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seeding gagal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });