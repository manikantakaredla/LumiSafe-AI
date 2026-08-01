import express from 'express';
import GisController from './gisController.js';

const router = express.Router();

// Point-in-Polygon spatial query endpoint
router.post('/spatial-lookup', GisController.spatialLookup);

// Get all Ward boundary Polygons
router.get('/wards', GisController.getWards);

export default router;
