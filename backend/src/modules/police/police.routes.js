import express from 'express';
import * as policeController from './policeController.js';

const router = express.Router();

router.get('/units', policeController.getAllUnits);
router.patch('/units/:unitId/state', policeController.updateUnitState);
router.get('/crimes', policeController.getCrimes);
router.get('/darkness-risk', policeController.getDarknessRiskAssessment);

export default router;
