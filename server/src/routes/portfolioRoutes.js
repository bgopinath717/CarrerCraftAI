import express from 'express';
import multer from 'multer';
import {
  getPublicPortfolio,
  getPortfolioSettings,
  updatePortfolioSettings,
  deletePortfolio,
  generatePortfolioFromResume,
} from '../controllers/portfolioController.js';
import { protect, optionalProtect } from '../middleware/auth.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const router = express.Router();

// AI Resume-to-Website generator endpoint
router.post('/generate-from-resume', optionalProtect, upload.any(), generatePortfolioFromResume);

// Public routes for viewing published portfolios
router.get('/public/:slug', getPublicPortfolio);
router.get('/view/:slug', getPublicPortfolio);

// Authenticated routes for managing portfolio settings
router.get('/', protect, getPortfolioSettings);
router.post('/', protect, updatePortfolioSettings);
router.put('/', protect, updatePortfolioSettings);
router.put('/:id', protect, updatePortfolioSettings);
router.delete('/:id', protect, deletePortfolio);
router.delete('/', protect, deletePortfolio);

export default router;
