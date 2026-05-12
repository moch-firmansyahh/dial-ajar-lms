export class TugasUseCase {
  constructor(tugasRepository) {
    this.tugasRepository = tugasRepository;
  }

  async getDaftarTugas(filter = {}) {
    const tugasList = await this.tugasRepository.findAllTugas(filter);
    return tugasList.map(t => {
      const userSubmission = t.pengumpulanTugas && t.pengumpulanTugas.length > 0 ? t.pengumpulanTugas[0] : null;
      return {
        id: t.idTugas,
        idMataKuliah: t.idMataKuliah,
        judul: t.judul,
        detailTugas: t.detailTugas,
        deadlineTugas: t.deadlineTugas ? t.deadlineTugas.toISOString() : null,
        mataKuliah: t.mataKuliah ? t.mataKuliah.namaMataKuliah : "Unknown",
        sudahKumpul: !!userSubmission,
        fileJawaban: userSubmission?.fileJawaban || null
      };
    });
  }

  async getDetailTugas(idTugas, nim) {
    const tugas = await this.tugasRepository.findTugasById(idTugas);
    if (!tugas) throw new Error("Tugas tidak ditemukan");

    const existingSubmission = await this.tugasRepository.findPengumpulanByNimAndTugas(nim, idTugas);

    return {
      id: tugas.idTugas,
      idMataKuliah: tugas.idMataKuliah,
      judul: tugas.judul,
      detailTugas: tugas.detailTugas,
      deadlineTugas: tugas.deadlineTugas ? tugas.deadlineTugas.toISOString() : null,
      mataKuliah: tugas.mataKuliah ? tugas.mataKuliah.namaMataKuliah : "Unknown",
      sudahKumpul: !!existingSubmission,
      pengumpulan: existingSubmission ? {
        idPengumpulan: existingSubmission.idPengumpulan,
        fileJawaban: existingSubmission.fileJawaban,
        tanggalKumpul: existingSubmission.deadlineTugas
      } : null
    };
  }

  async kumpulTugas(payload) {
    const { idTugas, nim, judul, detailTugas, fileJawaban } = payload;

    const existing = await this.tugasRepository.findPengumpulanByNimAndTugas(nim, idTugas);
    if (existing) {
      return await this.tugasRepository.updatePengumpulan(existing.idPengumpulan, {
        judul,
        detailTugas,
        fileJawaban
      });
    }

    const tugas = await this.tugasRepository.findTugasById(idTugas);
    if (!tugas) throw new Error("Tugas tidak ditemukan");

    return await this.tugasRepository.createPengumpulan({
      idTugas,
      nim,
      judul: judul || tugas.judul,
      detailTugas: detailTugas || "",
      fileJawaban,
      deadlineTugas: tugas.deadlineTugas
    });
  }
}
