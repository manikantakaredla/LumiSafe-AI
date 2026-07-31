import express from 'express';
import { uploadEvidence } from './evidenceController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/upload', uploadEvidence);

export default router;
