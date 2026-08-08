import { Router } from 'express';
import { getMe } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = Router();

// Apply protect middleware to ensure a valid Clerk session exists
router.get('/me', protect, getMe);

export default router;
