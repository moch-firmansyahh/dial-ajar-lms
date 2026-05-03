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
}