import { prisma } from "../../../lib/prisma.ts";
export class PrismaDashboardDosenRepository {
  async getDosenInfo(nomorInduk) {
    return await prisma.dosen.findUnique({
      where: { nomorInduk },
      include: {
        user: true,
      }
    });
  }

  async getPendingTasks(nipDosen) {
    try {
      return await prisma.pengumpulanTugas.findMany({
        where: {
          tugas: {
            mataKuliah: {
              nipDosen: nipDosen
            }
          }
        },
        include: {
          tugas: { include: { mataKuliah: true } },
          mahasiswa: { include: { user: true } },
          kelompok: true
        },
        orderBy: { deadlineTugas: 'asc' },
        take: 5
      });
    } catch (error) {
      console.error("getPendingTasks error:", error.message);
      return [];
    }
  }

  async getSchedule(nipDosen) {
    try {
      return await prisma.mataKuliah.findMany({
        where: { nipDosen: nipDosen },
        take: 5
      });
    } catch (error) {
      console.error("getSchedule error:", error.message);
      return [];
    }
  }

  async getTotalMahasiswa(nipDosen) {
    try {
      const result = await prisma.nilai.groupBy({
        by: ['nomorInduk'],
        where: {
          mataKuliah: {
            nipDosen: nipDosen
          }
        }
      });
      return result.length;
    } catch (error) {
      console.error("getTotalMahasiswa error:", error.message);
      return 0;
    }
  }
}