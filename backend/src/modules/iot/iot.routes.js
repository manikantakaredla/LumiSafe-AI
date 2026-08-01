import { Router } from 'express';
import { getTelemetry, getFailures, reportFailure } from './iotController.js';

const router = Router();

router.get('/telemetry', getTelemetry);
router.get('/failures', getFailures);
router.post('/failure', reportFailure);

export default router;
