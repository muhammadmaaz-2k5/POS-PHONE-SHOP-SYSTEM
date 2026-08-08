import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Product } from '../../types';
import { useProductStore } from '../../store/useProductStore';
import toast from 'react-hot-toast';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  category: z.string().min(1, 'Category is required'),
  imei: z.string().nullable().optional(),
  ram: z.string().nullable().optional(),
  storage: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  purchasePrice: z.number().min(0, 'Must be positive'),
  sellingPrice: z.number().min(0, 'Must be positive'),
  stock: z.number().int().min(0, 'Must be 0 or more'),
  minimumStock: z.number().int().min(1, 'Must be 1 or more'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

const CATEGORIES = ['Phones', 'Tablets', 'Accessories', 'Chargers', 'Cases', 'Other'];
const RAM_OPTIONS = ['4GB', '6GB', '8GB', '12GB', '16GB', 'Other'];
const STORAGE_OPTIONS = ['64GB', '128GB', '256GB', '512GB', '1TB', 'Other'];

export function ProductFormModal({ isOpen, onClose, product }: ProductFormModalProps) {
  const { createProduct, updateProduct } = useProductStore();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      ...product,
      purchasePrice: Number(product.purchasePrice),
      sellingPrice: Number(product.sellingPrice),
    } : {
      minimumStock: 5,
      stock: 0,
      purchasePrice: 0,
      sellingPrice: 0,
    },
  });

  // Calculate profit margin
  const purchasePrice = watch('purchasePrice') || 0;
  const sellingPrice = watch('sellingPrice') || 0;
  const profitMargin = purchasePrice > 0 
    ? (((sellingPrice - purchasePrice) / purchasePrice) * 100).toFixed(1) 
    : '0.0';

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (product) {
        await updateProduct(product.id, data);
        toast.success('Product updated successfully');
      } else {
        await createProduct(data);
        toast.success('Product added successfully');
      }
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl my-8 border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-1 md:col-span-2">
              <label className="label">Product Name *</label>
              <input type="text" className="input" {...register('name')} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="label">Brand *</label>
              <input type="text" className="input" {...register('brand')} />
              {errors.brand && <p className="text-xs text-red-500">{errors.brand.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="label">Model *</label>
              <input type="text" className="input" {...register('model')} />
              {errors.model && <p className="text-xs text-red-500">{errors.model.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="label">Category *</label>
              <select className="input" {...register('category')}>
                <option value="">Select Category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="label">IMEI / Serial Number</label>
              <input type="text" className="input" {...register('imei')} />
              {errors.imei && <p className="text-xs text-red-500">{errors.imei.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="label">RAM (Optional)</label>
              <select className="input" {...register('ram')}>
                <option value="">None</option>
                {RAM_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="label">Storage (Optional)</label>
              <select className="input" {...register('storage')}>
                <option value="">None</option>
                {STORAGE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="label">Color (Optional)</label>
              <input type="text" className="input" {...register('color')} />
            </div>

            <div className="space-y-1">
              <label className="label">Purchase Price *</label>
              <input type="number" step="0.01" className="input" {...register('purchasePrice', { valueAsNumber: true })} />
              {errors.purchasePrice && <p className="text-xs text-red-500">{errors.purchasePrice.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="label">Selling Price *</label>
              <input type="number" step="0.01" className="input" {...register('sellingPrice', { valueAsNumber: true })} />
              {errors.sellingPrice && <p className="text-xs text-red-500">{errors.sellingPrice.message}</p>}
            </div>
            
            <div className="space-y-1 md:col-span-2">
              <span className={`text-sm font-medium ${Number(profitMargin) > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                Profit Margin: {profitMargin}%
              </span>
            </div>

            <div className="space-y-1">
              <label className="label">Current Stock *</label>
              <input type="number" className="input" {...register('stock', { valueAsNumber: true })} />
              {errors.stock && <p className="text-xs text-red-500">{errors.stock.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="label">Minimum Stock *</label>
              <input type="number" className="input" {...register('minimumStock', { valueAsNumber: true })} />
              {errors.minimumStock && <p className="text-xs text-red-500">{errors.minimumStock.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
