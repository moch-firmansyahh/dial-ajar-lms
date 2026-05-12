import { prisma } from "../../../lib/prisma.ts";
export class PrismaPresensiDosenRepository {
async getMahasiswaByMatkul(idMataKuliah) {
    const presensiList = await prisma.presensi.findMany({
        where: { idMataKuliah: parseInt(idMataKuliah) },
        include: {
            mahasiswa: {
            include: { user: true }
            }
        }
    });

    // Melakukan transformasi data agar sesuai dengan format INITIAL_STUDENTS di React
    return presensiList.map((p) => {
        const nama = p.mahasiswa.user.nama;
        const initials = nama.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
        const statusUI = p.statusKehadiran === "Alpha" ? "Alpa" : p.statusKehadiran;
        return {
            id: p.idPresensi,
            nim: p.nim,
            name: nama,
            initials: initials,
            color: "#2f9696",
            status: statusUI,
            tanggalPertemuan: p.tanggalPertemuan,
            waktuPresensi: p.waktuPresensi
        };
    });
}

async updateStatusPresensi(idPresensi, statusKehadiran) {
    // Kembalikan format Alpa ke Alpha untuk database
    const statusDB = statusKehadiran === "Alpa" ? "Alpha" : statusKehadiran;
    
    return await prisma.presensi.update({
        where: { idPresensi: parseInt(idPresensi) },
        data: { 
            statusKehadiran: statusDB,
            waktuPresensi: new Date()
        }
        });
    }
}