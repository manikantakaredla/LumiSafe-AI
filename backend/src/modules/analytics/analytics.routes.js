import { Router } from 'express';
import { 
  getOverview, 
  getTrends, 
  getWards, 
  getTeams, 
  getSla, 
  getVerification 
} from './analyticsController.js';

const router = Router();

router.get('/overview', getOverview);
router.get('/trends', getTrends);
router.get('/wards', getWards);
router.get('/teams', getTeams);
router.get('/sla', getSla);
router.get('/verification', getVerification);

export default router;
