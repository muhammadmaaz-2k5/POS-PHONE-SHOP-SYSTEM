import { Router } from 'express';
import {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
} from '../controllers/purchaseController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', getAllPurchases);
router.get('/:id', getPurchaseById);

// Only admins can create stock purchases
router.post('/', authorize('admin'), createPurchase);

export default router;
