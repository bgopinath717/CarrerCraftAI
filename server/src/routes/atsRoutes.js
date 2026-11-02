import express from 'express';
import multer from 'multer';
import {
  analyzeUploadedATS,
  getAtsHistory,
  getAtsById,
} from '../controllers/atsController.js';
import { protect, optionalProtect } from '../middleware/auth.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const router = express.Router();

router.get('/history', protect, getAtsHistory);
router.post('/analyze', optionalProtect, upload.any(), analyzeUploadedATS);
router.get('/:id', protect, getAtsById);

export default router;
