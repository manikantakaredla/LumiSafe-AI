import express from 'express';
import { queryCopilot } from './copilotController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Currently unprotected for ease of dev, can re-add protect later
router.post('/query', queryCopilot);

export default router;
