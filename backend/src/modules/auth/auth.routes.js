import express from 'express';
import AuthController from './authController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', AuthController.login);
router.get('/me', protect, AuthController.me);

export default router;
