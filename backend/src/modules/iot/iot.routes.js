import { Router } from 'express';
import { getTelemetry, reportFailure } from './iotController.js';

const router = Router();

router.get('/telemetry', getTelemetry);
router.post('/failure', reportFailure);

export default router;
