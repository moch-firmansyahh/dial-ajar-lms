export class MataKuliahUseCase {

  constructor(mataKuliahRepository) {
    this.mataKuliahRepository = mataKuliahRepository;
  }

  async addMataKuliah(data) {
    if (!data.namaMataKuliah) throw new Error("Nama Mata Kuliah wajib diisi");
    return await this.mataKuliahRepository.create(data);
  }

  async getAll() {
    return await this.mataKuliahRepository.findAll();
  }

  async getById(id) {
    const mk = await this.mataKuliahRepository.findById(id);
    if (!mk) throw new Error("Mata Kuliah tidak ditemukan");
    return mk;
  }

  async updateMataKuliah(id, data) {
    return await this.mataKuliahRepository.update(id, data);
  }

  async deleteMataKuliah(id) {
    return await this.mataKuliahRepository.delete(id);
  }
  
  async getDetailMataKuliah(idMataKuliah) {
    // Repository harus melakukan "include" Dosen dan ModulAjar
    const course = await this.mataKuliahRepository.getDetailWithModules ? 
      await this.mataKuliahRepository.getDetailWithModules(idMataKuliah) : 
      await this.mataKuliahRepository.findById(idMataKuliah);
    
    if (!course) throw new Error("Mata kuliah tidak ditemukan");

    // Mapping data agar sesuai dengan struktur di controller
    return {
      id: course.idMataKuliah,
      nama: course.namaMataKuliah
    };
  }
}