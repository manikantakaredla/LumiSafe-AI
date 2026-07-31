import express from 'express';
import ComplaintController from './ComplaintController.js';

const router = express.Router();

router.post('/submit', ComplaintController.submit);
router.get('/', ComplaintController.getAll);
router.get('/:id', ComplaintController.getById);
router.patch('/:id/status', ComplaintController.updateStatus);

export default router;
