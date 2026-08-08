import { Router } from 'express';
import {
  getAllCustomers,
  getCustomerById,
  getCustomerPurchaseHistory,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customerController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.get('/:id/sales', getCustomerPurchaseHistory);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;
