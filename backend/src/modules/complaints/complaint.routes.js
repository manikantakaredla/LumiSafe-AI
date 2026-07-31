import express from 'express';
import ComplaintController from './ComplaintController.js';

const router = express.Router();

router.post('/submit', ComplaintController.submit);

export default router;
