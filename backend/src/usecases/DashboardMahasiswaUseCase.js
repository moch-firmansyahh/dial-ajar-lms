export class DashboardMahasiswaUseCase {
constructor(mataKuliahRepository, forumRepository) {
    this.mataKuliahRepository = mataKuliahRepository;
    this.forumRepository = forumRepository;
    }

async getDashboardData(nim) {
    try {
    // 1. Ambil semua mata kuliah
    const mataKuliah = await this.mataKuliahRepository.findAll();
    
    // 2. Ambil forum threads
    const threads = await this.forumRepository.findAll ? await this.forumRepository.findAll() : [];

    // 3. Hitung progress tugas (Mock data untuk sekarang)
    const totalTugas = 12;
    const tugasSelesai = 8;
    const persentase = Math.round((tugasSelesai / totalTugas) * 100);

    return {
        progress: {
        persentase,
        tugasSelesai,
        totalTugas,
    },
    mataKuliah: mataKuliah.slice(0, 5).map(mk => ({
        id: mk.idMataKuliah,
        nama: mk.namaMataKuliah
    })),
    threads: threads.slice(0, 3).map(t => ({
        id: t.id,
        title: t.title || 'Thread'
    }))
    };
    } catch (error) {
        throw new Error('Dashboard data gagal dimuat: ' + error.message);
    }
}
}