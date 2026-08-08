import { Router } from 'express';
import {
  getAllSales,
  getSaleById,
  createSale,
  getTodaySales,
} from '../controllers/saleController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', getAllSales);
router.get('/today', getTodaySales);
router.get('/:id', getSaleById);
router.post('/', createSale);

export default router;
