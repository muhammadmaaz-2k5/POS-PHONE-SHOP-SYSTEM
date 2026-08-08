import { Router } from 'express';
import {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../controllers/supplierController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', getAllSuppliers);
router.get('/:id', getSupplierById);

// Only admins can modify suppliers
router.post('/', authorize('admin'), createSupplier);
router.put('/:id', authorize('admin'), updateSupplier);
router.delete('/:id', authorize('admin'), deleteSupplier);

export default router;
