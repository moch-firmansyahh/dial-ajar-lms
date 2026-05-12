import { prisma } from '../../prismaClient.js';

export class PrismaTugasRepository {
  async findAllTugas(filter = {}) {
    const where = {};
    if (filter.idMataKuliah) {
      where.idMataKuliah = parseInt(filter.idMataKuliah);
    }
    return await prisma.tugas.findMany({
      where,
      include: { 
        mataKuliah: true, 
        pengumpulanTugas: filter.nim ? {
          where: { nim: filter.nim }
        } : true 
      },
      orderBy: { deadlineTugas: 'asc' }
    });
  }

  async findTugasById(idTugas) {
    return await prisma.tugas.findUnique({
      where: { idTugas: parseInt(idTugas) },
      include: { mataKuliah: true, pengumpulanTugas: { include: { mahasiswa: true } } }
    });
  }

  async findPengumpulanByNimAndTugas(nim, idTugas) {
    return await prisma.pengumpulanTugas.findFirst({
      where: { nim, idTugas: parseInt(idTugas) }
    });
  }

  async createPengumpulan(data) {
    return await prisma.pengumpulanTugas.create({
      data: {
        idTugas: parseInt(data.idTugas),
        nim: data.nim,
        judul: data.judul,
        detailTugas: data.detailTugas,
        fileJawaban: data.fileJawaban,
        deadlineTugas: data.deadlineTugas ? new Date(data.deadlineTugas) : null,
        idKelompok: data.idKelompok ? parseInt(data.idKelompok) : null
      }
    });
  }

  async updatePengumpulan(id, data) {
    return await prisma.pengumpulanTugas.update({
      where: { idPengumpulan: parseInt(id) },
      data: {
        judul: data.judul,
        detailTugas: data.detailTugas,
        fileJawaban: data.fileJawaban,
      }
    });
  }

  async getSubmission(idTugas, nim) {
    return await this.findPengumpulanByNimAndTugas(nim, idTugas);
  }

  async deleteSubmission(idPengumpulan) {
    return await prisma.pengumpulanTugas.delete({
      where: { idPengumpulan: parseInt(idPengumpulan) }
    });
  }
}
