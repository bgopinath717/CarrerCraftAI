import express from 'express';
import multer from 'multer';
import {
  getPublicPortfolio,
  getPortfolioSettings,
  updatePortfolioSettings,
  generatePortfolioFromResume,
} from '../controllers/portfolioController.js';
import { protect } from '../middleware/auth.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const router = express.Router();

// Optional auth helper: attempts authentication if token present, but never blocks unauthenticated requests
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

// AI Resume-to-Website generator endpoint
router.post('/generate-from-resume', optionalAuth, upload.any(), generatePortfolioFromResume);

// Public routes for viewing published portfolios
router.get('/public/:slug', getPublicPortfolio);
router.get('/view/:slug', getPublicPortfolio);

// Authenticated routes for managing portfolio settings
router.get('/', protect, getPortfolioSettings);
router.put('/', protect, updatePortfolioSettings);

export default router;
