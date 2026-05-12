export class TugasDosenController {
constructor(tugasDosenUseCase) {
    this.tugasDosenUseCase = tugasDosenUseCase;
}

async getAllTugas(req, res) {
    try {
        let matkulIds = [];
        if (req.query.idMataKuliah) {
            matkulIds = [parseInt(req.query.idMataKuliah)];
        } else if (req.user && req.user.role === 'DOSEN' && req.user.dosen) {
             const matkuls = await this.tugasDosenUseCase.mataKuliahRepository.findByDosen(req.user.dosen.nip);
             matkulIds = matkuls.map(m => m.idMataKuliah);
        }
        const tasks = await this.tugasDosenUseCase.getDaftarTugas(matkulIds);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async create(req, res) {
    try {
      // payload dari frontend form
        const newTask = await this.tugasDosenUseCase.createTugasAtauKuis(req.body);
        res.status(201).json({ message: "Tugas berhasil dibuat", data: newTask });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async update(req, res) {
    try {
        const { id } = req.params;
        const updated = await this.tugasDosenUseCase.updateTugas(id, req.body);
        res.status(200).json({ message: "Tugas berhasil diperbarui", data: updated });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async destroy(req, res) {
    try {
        const { id } = req.params;
        await this.tugasDosenUseCase.deleteTugas(id);
        res.status(200).json({ message: "Tugas berhasil dihapus" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async submitGrades(req, res) {
    try {
        await this.tugasDosenUseCase.gradeTugas(req.body);
        res.status(200).json({ message: "Nilai berhasil disimpan" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    }
}