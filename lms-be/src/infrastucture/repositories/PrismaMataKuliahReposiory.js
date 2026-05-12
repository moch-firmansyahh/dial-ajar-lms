import { prisma } from "../../../lib/prisma.ts";

export class PrismaMataKuliahRepository {
  async create(data) {
    // Hapus idMataKuliah dari data agar auto-increment berjalan
    const { idMataKuliah, ...createData } = data;
    return await prisma.mataKuliah.create({ data: createData });
  }

  async findAll() {
    return await prisma.mataKuliah.findMany({
      include: {
        dosen: {
          include: { user: { select: { nama: true } } }
        }
      },
      orderBy: { idMataKuliah: 'asc' }
    });
  }

  async findByDosen(nipDosen) {
    return await prisma.mataKuliah.findMany({
      where: { nipDosen },
      include: {
        dosen: {
          include: { user: { select: { nama: true } } }
        }
      },
      orderBy: { idMataKuliah: 'asc' }
    });
  }

  async findByNim(nim) {
    // Mata kuliah yang diikuti mahasiswa, melalui relasi Presensi, Nilai, Tugas, atau Kelompok
    return await prisma.mataKuliah.findMany({
      where: {
        OR: [
          { presensi: { some: { nim: nim } } },
          { tugas: { some: { nim: nim } } },
          { kelompok: { some: { anggota: { some: { nim: nim } } } } },
        ],
      },
      include: {
        dosen: {
          include: { user: { select: { nama: true } } }
        }
      },
      orderBy: { idMataKuliah: "asc" },
    });
  }

  async findById(id) {
    return await prisma.mataKuliah.findUnique({
      where: { idMataKuliah: parseInt(id) },
      include: {
        dosen: {
          include: { user: { select: { nama: true, email: true } } }
        }
      }
    });
  }

  async update(id, data) {
    return await prisma.mataKuliah.update({
      where: { idMataKuliah: parseInt(id) },
      data,
    });
  }

  async delete(id) {
    return await prisma.mataKuliah.delete({
      where: { idMataKuliah: parseInt(id) },
    });
  }
}
