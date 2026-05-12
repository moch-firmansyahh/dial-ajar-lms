import { prisma } from '../../../lib/prisma.ts';

export class PrismaNilaiRepository {

  async create(data) {
    return await prisma.nilai.create({ 
      data,
      include: { user: true, mataKuliah: true }
    });
  }

  async findAll() {
    return await prisma.nilai.findMany({
      include: { user: { select: { nama: true } }, mataKuliah: true }
    });
  }

  async findByMahasiswa(nomorInduk) {
    return await prisma.nilai.findMany({
      where: { nomorInduk },
      include: { mataKuliah: true }
    });
  }

  async findByMahasiswaAndMataKuliah(nomorInduk, idMataKuliah) {
    return await prisma.nilai.findFirst({
      where: { nomorInduk, idMataKuliah },
      include: { mataKuliah: true }
    });
  }

  async findById(id) {
    return await prisma.nilai.findUnique({
      where: { idNilai: parseInt(id) }
    });
  }

  async update(id, data) {
    return await prisma.nilai.update({
      where: { idNilai: parseInt(id) },
      data: data,
      include: { user: { select: { nama: true } }, mataKuliah: true }
    });
  }

  async delete(id) {
    return await prisma.nilai.delete({
      where: { idNilai: parseInt(id) }
    });
  }

  async getNilaiByNomorInduk(nomorInduk) {
    return await prisma.nilai.findMany({
      where: { nomorInduk: nomorInduk },
      include: { mataKuliah: true }
    });
  }

  async getPengumpulanIndividu(idMataKuliah) {
    try {
      const intIdMk = parseInt(idMataKuliah);
      
      // Ambil semua pengumpulan tugas untuk mata kuliah ini (individu & kelompok)
      // Nanti difilter di frontend atau berdasarkan ada/tidaknya idKelompok
      const result = await prisma.pengumpulanTugas.findMany({
        where: { 
          tugas: {
            idMataKuliah: intIdMk
          }
        },
        include: { 
          mahasiswa: {
            include: { 
              user: {
                select: { nama: true, nomorInduk: true }
              }
            }
          },
          tugas: true
        },
        orderBy: { deadlineTugas: 'desc' }
      });
      
      return result;
    } catch (error) {
      console.error("[Repository] getPengumpulanIndividu error:", error.message);
      return [];
    }
  }

  async getNilaiTugas(nomorInduk, idMataKuliah) {
    return await prisma.nilai.findFirst({
      where: { 
        nomorInduk: nomorInduk, 
        idMataKuliah: parseInt(idMataKuliah) 
      }
    });
  }

  async upsertNilaiTugas(nomorInduk, idMataKuliah, nilaiTugas) {
    const existing = await this.getNilaiTugas(nomorInduk, idMataKuliah);
    if (existing) {
      return await prisma.nilai.update({
        where: { idNilai: existing.idNilai },
        data: { 
          nilaiTugas: parseFloat(nilaiTugas),
          nilaiAkhir: parseFloat(nilaiTugas)
        }
      });
    }
    return await prisma.nilai.create({
      data: {
        nomorInduk,
        idMataKuliah: parseInt(idMataKuliah),
        nilaiTugas: parseFloat(nilaiTugas),
        nilaiAkhir: parseFloat(nilaiTugas)
      }
    });
  }
}