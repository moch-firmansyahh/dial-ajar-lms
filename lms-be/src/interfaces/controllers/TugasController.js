import { prisma } from '../../../lib/prisma.ts';

export class TugasController {
  constructor(tugasUseCase) {
    this.tugasUseCase = tugasUseCase;
  }

  async getAll(req, res) {
    try {
      const { idMataKuliah } = req.query;
      const filter = {};
      if (idMataKuliah) filter.idMataKuliah = idMataKuliah;
      
      const nim = req.user?.mahasiswa?.nim;
      if (nim) {
        filter.nim = nim;
      } else if (req.user?.nomorInduk) {
        const mhs = await prisma.mahasiswa.findUnique({ where: { nomorInduk: req.user.nomorInduk } });
        if (mhs) filter.nim = mhs.nim;
      }
      
      const data = await this.tugasUseCase.getDaftarTugas(filter);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getDetail(req, res) {
    try {
      const { id } = req.params;
      const nim = req.user?.mahasiswa?.nim || req.query.nim;
      if (!nim) return res.status(400).json({ error: "NIM diperlukan" });
      const data = await this.tugasUseCase.getDetailTugas(id, nim);
      res.status(200).json(data);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async submit(req, res) {
    try {
      console.log("=== SUBMIT DEBUG ===");
      console.log("params:", req.params);
      console.log("body:", req.body);
      console.log("user:", req.user);
      console.log("file:", req.file);
      
      const idTugas = req.params.idTugas || req.body.idTugas;
      const nim = req.user?.mahasiswa?.nim || req.body.nim;
      const { judul, detailTugas, fileJawaban } = req.body;
      
      console.log("idTugas:", idTugas, "nim:", nim);
      
      if (!idTugas || !nim) {
        return res.status(400).json({ error: "idTugas dan nim wajib diisi" });
      }
      const uploadedFilePath = req.file
        ? `/uploads/${req.file.filename}`
        : fileJawaban || "";
      const result = await this.tugasUseCase.kumpulTugas({
        idTugas: parseInt(idTugas),
        nim,
        judul,
        detailTugas,
        fileJawaban: uploadedFilePath,
      });
      res
        .status(201)
        .json({ message: "Tugas berhasil dikumpulkan", data: result });
    } catch (error) {
      console.error("SUBMIT ERROR:", error);
      res.status(400).json({ error: error.message });
    }
  }

  async getSubmission(req, res) {
    try {
      const { idTugas } = req.params;
      const nim = req.query.nim;
      if (!nim) {
        return res
          .status(400)
          .json({ error: "NIM diperlukan sebagai query parameter" });
      }
      const data = await this.tugasUseCase.tugasRepository.getSubmission(
        idTugas,
        nim,
      );
      res.status(200).json(data || {});
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async deleteSubmission(req, res) {
    try {
      const { idPengumpulan } = req.params;
      await this.tugasUseCase.tugasRepository.deleteSubmission(idPengumpulan);
      res.status(200).json({ message: "Pengumpulan berhasil dibatalkan" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
