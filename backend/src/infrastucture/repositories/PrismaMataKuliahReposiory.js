import { prisma } from "../../../lib/prisma.ts";

export class PrismaMataKuliahRepository {
  async create(data) {
    return await prisma.mataKuliah.create({ data });
  }

  async findAll() {
    return await prisma.mataKuliah.findMany();
  }

  async findById(id) {
    return await prisma.mataKuliah.findUnique({
      where: { idMataKuliah: parseInt(id) }
    });
  }

  async update(id, data) {
    return await prisma.mataKuliah.update({
      where: { idMataKuliah: parseInt(id) },
      data
    });
  }

  async delete(id) {
    return await prisma.mataKuliah.delete({
      where: { idMataKuliah: parseInt(id) }
    });
  }
}