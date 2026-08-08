import { Router } from 'express';
import {
  getDashboardKPIs,
  getDailySales,
  getMonthlySales,
  getTopProducts,
  getSalesByCashier,
  getInventoryReport,
  getLowStock,
} from '../controllers/analyticsController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Protect all analytics endpoints and restrict to admins
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardKPIs);
router.get('/sales/daily', getDailySales);
router.get('/sales/monthly', getMonthlySales);
router.get('/sales/by-product', getTopProducts);
router.get('/sales/by-cashier', getSalesByCashier);
router.get('/inventory', getInventoryReport);
router.get('/low-stock', getLowStock);

export default router;
