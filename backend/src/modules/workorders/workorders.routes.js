import { Router } from 'express';
import { getAll, getById, getTeams, optimizeRoutes, manualAssign, updateStatus, supervisorReview } from './workOrderController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = Router();

router.get('/', getAll);
router.get('/teams', getTeams);
router.get('/:id', getById);
router.post('/optimize', optimizeRoutes);
router.patch('/:id/assign', manualAssign);
router.patch('/:id/status', updateStatus);
router.post('/:id/review', supervisorReview);

export default router;
