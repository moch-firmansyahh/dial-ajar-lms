import { prisma } from '../../prismaClient.js';
export class PrismaTugasDosenRepository {
async findAllByDosen(idMataKuliahList) {
    // Mengambil tugas dan kuis berdasarkan mata kuliah yang diajar dosen
    const allTugas = await prisma.tugas.findMany({
        where: { idMataKuliah: { in: idMataKuliahList } },
        include: { mataKuliah: true, pengumpulanTugas: true },
        orderBy: { deadlineTugas: 'asc' }
    });

    // Deduplicate tugas — grup berdasarkan judul + idMataKuliah + deadline
    // Dosen seharusnya melihat 1 baris per "tugas", bukan 1 baris per mahasiswa
    const tugasMap = new Map();
    for (const t of allTugas) {
      const key = `${t.judul}__${t.idMataKuliah}__${t.deadlineTugas?.toISOString() || ''}`;
      if (!tugasMap.has(key)) {
        tugasMap.set(key, {
          ...t,
          pengumpulanTugas: [...(t.pengumpulanTugas || [])],
          _totalMahasiswa: 1,
        });
      } else {
        const existing = tugasMap.get(key);
        existing.pengumpulanTugas.push(...(t.pengumpulanTugas || []));
        existing._totalMahasiswa += 1;
      }
    }
    const tugas = Array.from(tugasMap.values());
    
    const kuis = await prisma.kuis.findMany({
        where: { idMataKuliah: { in: idMataKuliahList } },
        include: { mataKuliah: true, soal: true }
    });

    return { tugas, kuis };
    }

async createTugas(data) {
    // The Tugas model has a nim FK to Mahasiswa, but dosen creates it for all students.
    // We use the first available mahasiswa or a placeholder. If no mahasiswa exists, skip nim.
    let nimValue = data.nim || null;
    if (!nimValue) {
        try {
            const firstMahasiswa = await prisma.mahasiswa.findFirst({ select: { nim: true } });
            nimValue = firstMahasiswa?.nim;
        } catch (e) {
            // If no mahasiswa, this will fail - that's expected
        }
    }
    return await prisma.tugas.create({
        data: {
            idMataKuliah: parseInt(data.idMataKuliah),
            nim: nimValue || 'system',
            judul: data.judul,
            detailTugas: data.deskripsi || data.detailTugas || '',
            deadlineTugas: data.deadlineTugas ? new Date(data.deadlineTugas) : null,
        }
    });
}

async createKuis(data, quizData) {
    // Menyimpan Kuis beserta Soal dan Pilihan Jawabannya
    return await prisma.kuis.create({
    data: {
        idMataKuliah: data.idMataKuliah,
        judul: data.judul,
        deadlineKuis: new Date(data.deadlineTugas),
        soal: {
            create: quizData.map((q) => ({
            pertanyaan: q.text,
            kunciJawaban: q.options[q.correctIndex],
            pilihanJawaban: {
                create: q.options.map((opt) => ({
                teksJawaban: opt
                }))
            }
            }))
        }
        }
    });
}

async updateTugas(idTugas, data) {
    return await prisma.tugas.update({
        where: { idTugas: parseInt(idTugas) },
        data: {
            idMataKuliah: data.idMataKuliah ? parseInt(data.idMataKuliah) : undefined,
            judul: data.judul,
            detailTugas: data.deskripsi || data.detailTugas || "",
            deadlineTugas: data.deadlineTugas ? new Date(data.deadlineTugas) : undefined,
        }
    });
}

async deleteTugas(idTugas) {
    const parsedId = parseInt(idTugas);
    // Hapus PengumpulanTugas yang terkait terlebih dahulu untuk menghindari constraint error
    await prisma.pengumpulanTugas.deleteMany({
        where: { idTugas: parsedId }
    });
    
    return await prisma.tugas.delete({
        where: { idTugas: parsedId }
    });
}
async saveGrades(gradesData) {
    // Menyimpan nilai ke tabel Nilai (create jika belum ada, update jika sudah)
    // gradesData adalah array objek { nomorInduk, idMataKuliah, nilaiTugas }
    return await prisma.$transaction(async (tx) => {
        const results = [];
        for (const grade of gradesData) {
            const idMataKuliah = parseInt(grade.idMataKuliah);
            const nilaiTugas = parseFloat(grade.nilaiTugas);
            if (!grade.nomorInduk || Number.isNaN(idMataKuliah) || Number.isNaN(nilaiTugas)) continue;

            const existing = await tx.nilai.findFirst({
                where: { nomorInduk: grade.nomorInduk, idMataKuliah }
            });
            if (existing) {
                results.push(await tx.nilai.update({
                    where: { idNilai: existing.idNilai },
                    data: { nilaiTugas }
                }));
            } else {
                results.push(await tx.nilai.create({
                    data: { nomorInduk: grade.nomorInduk, idMataKuliah, nilaiTugas }
                }));
            }
        }
        return results;
    });
    }
}