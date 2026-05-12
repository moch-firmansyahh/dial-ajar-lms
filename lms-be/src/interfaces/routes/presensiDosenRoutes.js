import express from 'express';
import { PrismaPresensiDosenRepository } from '../../infrastucture/repositories/PrismaPresensiDosenRepository.js';
import { PresensiDosenUseCase } from '../../usecases/PresensiDosenUseCase.js';
import { PresensiDosenController } from '../controllers/PresensiDosenController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { prisma } from '../../../lib/prisma.ts';

const router = express.Router();

// Dependency Injection
const repository = new PrismaPresensiDosenRepository();
const usecase = new PresensiDosenUseCase(repository);
const controller = new PresensiDosenController(usecase);

// Semua rute presensi dilindungi middleware
router.use(authMiddleware);

router.get('/matkul/:idMataKuliah/daftar-hadir', (req, res) => controller.getDaftarHadir(req, res));
router.put('/:idPresensi/status', (req, res) => controller.updateStatus(req, res));

/**
 * POST /api/dosen/presensi/matkul/:idMataKuliah/generate
 * Dosen membuat sesi presensi baru untuk tanggal tertentu
 */
router.post('/matkul/:idMataKuliah/generate', async (req, res) => {
  try {
    const { idMataKuliah } = req.params;
    const { tanggal } = req.body;
    
    // Use provided date or current timestamp
    let targetDate = new Date();
    if (tanggal) {
      // Create date and set to noon UTC to prevent timezone shifts when saving
      targetDate = new Date(`${tanggal}T12:00:00.000Z`);
    } else {
      targetDate.setUTCHours(12, 0, 0, 0);
    }
    
    // Ambil SEMUA mahasiswa yang ada di sistem
    const mahasiswaList = await prisma.mahasiswa.findMany();

    if (mahasiswaList.length === 0) {
      return res.status(400).json({ error: 'Tidak ada mahasiswa terdaftar' });
    }

    // Generate token QR unik
    const token = `LeMaS-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Cek apakah sudah ada sesi untuk tanggal yang sama (tanpa jam)
    const targetDateString = targetDate.toISOString().split('T')[0];
    const startOfDay = new Date(`${targetDateString}T00:00:00.000Z`);
    const endOfDay = new Date(`${targetDateString}T23:59:59.999Z`);

    const existingSession = await prisma.presensi.findFirst({
      where: {
        idMataKuliah: parseInt(idMataKuliah),
        tanggalPertemuan: {
          gte: startOfDay,
          lt: endOfDay
        }
      }
    });

    if (existingSession) {
      return res.status(400).json({
        error: `Sesi presensi untuk tanggal ${targetDateString} sudah ada`
      });
    }

    // Buat sesi presensi untuk setiap mahasiswa pada tanggal tersebut
    const sessionTime = new Date(targetDate);
    
    const createdRecords = await Promise.allSettled(
      mahasiswaList.map(m =>
        prisma.presensi.create({
          data: {
            nim: m.nim,
            idMataKuliah: parseInt(idMataKuliah),
            statusKehadiran: 'Alpha',
            tanggalPertemuan: sessionTime
          }
        })
      )
    );

    const successCount = createdRecords.filter(r => r.status === 'fulfilled').length;

    res.status(201).json({
      message: `Sesi presensi berhasil dibuat untuk ${successCount} mahasiswa`,
      token,
      tanggal: sessionTime.toISOString()
    });
  } catch (error) {
    console.error('Generate presensi error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;