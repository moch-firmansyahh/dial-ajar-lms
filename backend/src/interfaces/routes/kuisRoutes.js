import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

// Endpoint akan diimplementasi nanti
router.get('/:idKuis/soal', (req, res) => {
  res.json({ message: 'KuisController belum diimplementasi', status: 'pending' });
});

router.post('/:idKuis/submit', (req, res) => {
  res.json({ message: 'KuisController belum diimplementasi', status: 'pending' });
});

export default router;