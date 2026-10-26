import express from 'express';
import multer from 'multer';
import {
  polishBullet,
  generateCoverLetterAI,
  suggestKeywords,
  analyzeJobMatch,
  getCareerRecommendations,
  getCareerRoadmap
} from '../controllers/aiController.js';
import { analyzeUploadedATS } from '../controllers/atsController.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = express.Router();

router.post('/polish', polishBullet);
router.post('/cover-letter', generateCoverLetterAI);
router.post('/keywords', suggestKeywords);
router.post('/job-match', upload.any(), analyzeJobMatch);
router.post('/analyze-ats', upload.any(), analyzeUploadedATS);
router.post('/career-recommendations', getCareerRecommendations);
router.post('/career-roadmap', getCareerRoadmap);

export default router;
