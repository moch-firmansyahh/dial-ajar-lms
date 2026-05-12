import { prisma } from '../../../lib/prisma.ts';

export class PrismaPresensiRepository {
  
  /**
   * Mengambil daftar hadir mahasiswa untuk ditampilkan di Dashboard Dosen (presensi.jsx)
   * @param {number} idMataKuliah 
   */
  async getDaftarHadirMahasiswa(idMataKuliah) {
    // 1. Ambil data presensi dari database, gabungkan (include) data mahasiswa dan user
    const presensiList = await prisma.presensi.findMany({
      where: {
        idMataKuliah: idMataKuliah,
        // (Opsional) Tambahkan filter tanggal jika ingin spesifik mengambil sesi hari ini:
        // tanggalPertemuan: { gte: new Date(new Date().setHours(0,0,0,0)) } 
      },
      include: {
        mahasiswa: {
          include: {
            user: {
              select: { nama: true } // Hanya ambil nama untuk efisiensi
            }
          }
        }
      },
      orderBy: {
        mahasiswa: { nim: 'asc' } // Urutkan berdasarkan NIM
      }
    });

    // 2. Mapping data mentah database menjadi format yang siap dikonsumsi oleh INITIAL_STUDENTS di React
    return presensiList.map((p, index) => {
      // Membuat inisial nama (Misal: "Budi Santoso" -> "BU")
      const initials = p.mahasiswa.user.nama.substring(0, 2).toUpperCase();
      
      // Warna acak (Mockup) untuk avatar frontend seperti pada kode Anda
      const colors = ["#8991fe", "#f59e0b", "#10b981", "#ec4899", "#6366f1"];
      const randomColor = colors[index % colors.length];

      return {
        id: p.idPresensi,
        nim: p.nim,
        name: p.mahasiswa.user.nama,
        initials: initials,
        color: randomColor,
        status: p.statusKehadiran, // Berupa Enum: 'Hadir', 'Izin', 'Sakit', 'Alpha'
        tanggalPertemuan: p.tanggalPertemuan,
        waktuPresensi: p.waktuPresensi
      };
    });
  }

  /**
   * Mengubah status absensi mahasiswa secara manual (Dosen mengubah lewat UI)
   * @param {number} idPresensi 
   * @param {string} statusKehadiran ('Hadir', 'Izin', 'Sakit', 'Alpha')
   */
  async updateStatus(idPresensi, statusKehadiran) {
    return await prisma.presensi.update({
      where: { idPresensi: idPresensi },
      data: { statusKehadiran: statusKehadiran }
    });
  }

  /**
   * Menandai status kehadiran menjadi "Hadir" saat Mahasiswa melakukan Scan QR Code
   * @param {string} nim 
   * @param {number} idMataKuliah 
   */
  async markAsHadir(nim, idMataKuliah) {
    // Validasi nim ada di tabel mahasiswa
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { nim: nim }
    });

    if (!mahasiswa) {
      throw new Error('Data mahasiswa tidak ditemukan. Silakan login ulang.');
    }

    // Cari record presensi terbaru untuk mahasiswa ini di mata kuliah ini (maksimal besok untuk handle timezone)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    let presensiSesiIni = await prisma.presensi.findFirst({
      where: {
        nim: nim,
        idMataKuliah: idMataKuliah,
        tanggalPertemuan: {
          lte: tomorrow
        }
      },
      orderBy: {
        tanggalPertemuan: 'desc'
      }
    });

    // Jika belum ada record sama sekali, buat baru
    if (!presensiSesiIni) {
      presensiSesiIni = await prisma.presensi.create({
        data: {
          nim: nim,
          idMataKuliah: idMataKuliah,
          tanggalPertemuan: new Date(),
          waktuPresensi: new Date(),
          statusKehadiran: 'Hadir'
        }
      });
      return { message: 'Absen berhasil!', presensi: presensiSesiIni };
    }

    // Jika sudah hadir, kembalikan success tanpa error
    if (presensiSesiIni.statusKehadiran === 'Hadir') {
      return { action: 'already_hadir', message: 'Anda sudah tercatat Hadir pada sesi ini.' };
    }

    // Update status menjadi Hadir dengan waktu saat ini
    return await prisma.presensi.update({
      where: { idPresensi: presensiSesiIni.idPresensi },
      data: { 
        statusKehadiran: 'Hadir',
        waktuPresensi: new Date()
      }
    });
  }

  async getRiwayatKehadiran(nim, idMataKuliah) {
    return await prisma.presensi.findMany({
      where: { nim, idMataKuliah },
      orderBy: { tanggalPertemuan: 'desc' }
    });
  }

  async buatSesiPresensi(idMataKuliah) {
    const semuaMahasiswa = await prisma.mahasiswa.findMany();
    
    if (semuaMahasiswa.length === 0) {
      throw new Error('Tidak ada mahasiswa yang terdaftar');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingSession = await prisma.presensi.findFirst({
      where: {
        idMataKuliah: idMataKuliah,
        tanggalPertemuan: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    if (existingSession) {
      return { message: 'Sesi sudah ada untuk hari ini' };
    }

    const createMany = semuaMahasiswa.map(m => ({
      nim: m.nim,
      idMataKuliah: idMataKuliah,
      tanggalPertemuan: new Date(),
      statusKehadiran: 'Alpha'
    }));

    await prisma.presensi.createMany({
      data: createMany
    });

    return { message: 'Sesi presensi berhasil dibuat', count: semuaMahasiswa.length };
  }
}