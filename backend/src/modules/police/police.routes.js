import express from 'express';
import * as policeController from './policeController.js';

const router = express.Router();

router.get('/units', policeController.getAllUnits);
router.patch('/units/:unitId/state', policeController.updateUnitState);

export default router;
