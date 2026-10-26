import express from 'express';
import {
  getCoverLetters,
  createCoverLetter,
  updateCoverLetter,
  deleteCoverLetter,
} from '../controllers/coverLetterController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', getCoverLetters);
router.post('/', createCoverLetter);
router.put('/:id', updateCoverLetter);
router.delete('/:id', deleteCoverLetter);

export default router;
