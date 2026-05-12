export class DashboardMahasiswaUseCase {
constructor(mataKuliahRepository, forumRepository) {
    this.mataKuliahRepository = mataKuliahRepository;
    this.forumRepository = forumRepository;
    }

async getDashboardData(nim) {
    try {
    const mataKuliah = await this.mataKuliahRepository.findAll();
    const threads = await this.forumRepository.getRecentThreads ? await this.forumRepository.getRecentThreads(3) : [];

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
        threads: threads.map(t => ({
        id: t.idForumDiskusi,
        judul: t.judul,
        authorName: t.user?.nama || 'Unknown'
    }))
    };
    } catch (error) {
        throw new Error('Dashboard data gagal dimuat: ' + error.message);
    }
}
}