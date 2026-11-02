import express from 'express';
import { getCareerHistory, saveCareerGuidance } from '../controllers/careerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/history', getCareerHistory);
router.post('/save', saveCareerGuidance);

export default router;

