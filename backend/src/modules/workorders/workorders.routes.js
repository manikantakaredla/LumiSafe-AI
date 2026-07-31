import { Router } from 'express';
import { optimizeRoutes, manualAssign, updateStatus, supervisorReview } from './workOrderController.js';
// We can use the authMiddleware if needed, but for hackathon keeping it open/mocked is fine, or we can use protect.
import { protect } from '../../middleware/authMiddleware.js';

const router = Router();

router.post('/optimize', optimizeRoutes);
router.patch('/:id/assign', manualAssign);
router.patch('/:id/status', updateStatus);
router.post('/:id/review', supervisorReview);

export default router;
