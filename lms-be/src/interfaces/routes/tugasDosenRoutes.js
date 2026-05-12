import express from 'express';
import { TugasDosenController } from '../controllers/TugasDosenController.js';
import { TugasDosenUseCase } from '../../usecases/TugasDosenUseCase.js';
import { PrismaTugasDosenRepository } from '../../infrastucture/repositories/PrismaTugasDosenRepository.js';
import { PrismaMataKuliahRepository } from '../../infrastucture/repositories/PrismaMataKuliahReposiory.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

const repository = new PrismaTugasDosenRepository();
const matkulRepo = new PrismaMataKuliahRepository();
const usecase = new TugasDosenUseCase(repository, matkulRepo);
const controller = new TugasDosenController(usecase);

router.use(authMiddleware);

router.get('/', (req, res) => controller.getAllTugas(req, res));
router.get('/mata-kuliah/:idMataKuliah', (req, res) => {
  // Pass the idMataKuliah into the query or handle it in controller
  // For simplicity, we just attach it to req.query so the controller can optionally use it
  req.query.idMataKuliah = req.params.idMataKuliah;
  controller.getAllTugas(req, res);
});
router.post('/', (req, res) => controller.create(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.patch('/:id', (req, res) => controller.update(req, res)); // S1 PATCH
router.delete('/:id', (req, res) => controller.destroy(req, res));
router.post('/grades', (req, res) => controller.submitGrades(req, res));

export default router;