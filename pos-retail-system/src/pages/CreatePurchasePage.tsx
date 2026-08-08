import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Save, ArrowLeft, Building2 } from 'lucide-react';
import { usePurchaseStore } from '../store/usePurchaseStore';
import { useSupplierStore } from '../store/useSupplierStore';
import { useProductStore } from '../store/useProductStore';
import toast from 'react-hot-toast';

const purchaseItemSchema = z.object({
  productId: z.string().min(1, 'Product required'),
  quantity: z.number().int().min(1, 'Min 1'),
  price: z.number().min(0, 'Min 0'),
});

const purchaseSchema = z.object({
  supplierId: z.string().min(1, 'Supplier is required'),
  notes: z.string().optional(),
  items: z.array(purchaseItemSchema).min(1, 'Add at least one item'),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

export default function CreatePurchasePage() {
  const navigate = useNavigate();
  const { createPurchase } = usePurchaseStore();
  
  // Data for dropdowns
  const { suppliers, fetchSuppliers } = useSupplierStore();
  const { products, fetchProducts } = useProductStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load dropdown data
    const prevLimitSupplier = useSupplierStore.getState().limit;
    const prevLimitProduct = useProductStore.getState().limit;
    
    useSupplierStore.setState({ limit: 1000 });
    useProductStore.setState({ limit: 1000 });
    
    fetchSuppliers();
    fetchProducts();
    
    return () => {
      useSupplierStore.setState({ limit: prevLimitSupplier });
      useProductStore.setState({ limit: prevLimitProduct });
    };
  }, [fetchSuppliers, fetchProducts]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      supplierId: '',
      notes: '',
      items: [{ productId: '', quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchItems = watch('items');

  const calculateTotal = () => {
    return watchItems.reduce((acc, item) => {
      return acc + (Number(item.quantity) || 0) * (Number(item.price) || 0);
    }, 0);
  };

  const onSubmit = async (data: PurchaseFormData) => {
    setIsSubmitting(true);
    try {
      await createPurchase(data);
      toast.success('Purchase recorded and stock updated!');
      navigate('/purchases');
    } catch (error: any) {
      toast.error(error.message || 'Failed to record purchase');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/purchases')}
            className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Record Purchase</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Log stock received from suppliers to increment inventory.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Section 1: General Info */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary-600" />
            Supplier Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="label">Select Supplier *</label>
              <select className="input" {...register('supplierId')}>
                <option value="">-- Choose a supplier --</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name} {s.company ? `(${s.company})` : ''}</option>
                ))}
              </select>
              {errors.supplierId && <p className="text-xs text-red-500">{errors.supplierId.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="label">Internal Notes</label>
              <input type="text" className="input" placeholder="Optional notes about this shipment" {...register('notes')} />
            </div>
          </div>
        </div>

        {/* Section 2: Items Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary-600" />
              Received Items
            </h2>
            <button 
              type="button" 
              onClick={() => append({ productId: '', quantity: 1, price: 0 })}
              className="btn-secondary text-sm"
            >
              <Plus className="w-4 h-4" /> Add Row
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-lg">Product</th>
                  <th className="px-4 py-3 font-medium w-32">Qty Received</th>
                  <th className="px-4 py-3 font-medium w-40">Unit Cost ($)</th>
                  <th className="px-4 py-3 font-medium w-32 text-right">Subtotal</th>
                  <th className="px-4 py-3 font-medium w-16 text-center rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {fields.map((field, index) => {
                  const qty = Number(watchItems[index]?.quantity) || 0;
                  const price = Number(watchItems[index]?.price) || 0;
                  const subtotal = qty * price;

                  return (
                    <tr key={field.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                      <td className="px-4 py-3">
                        <select 
                          className="input w-full min-w-[200px]" 
                          {...register(`items.${index}.productId` as const)}
                        >
                          <option value="">Select product...</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} {p.brand ? `(${p.brand})` : ''} - Curr Stock: {p.stock}
                            </option>
                          ))}
                        </select>
                        {errors.items?.[index]?.productId && <p className="text-xs text-red-500 mt-1">{errors.items[index]?.productId?.message}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <input 
                          type="number" 
                          className="input w-full" 
                          min="1"
                          {...register(`items.${index}.quantity` as const, { valueAsNumber: true })} 
                        />
                        {errors.items?.[index]?.quantity && <p className="text-xs text-red-500 mt-1">{errors.items[index]?.quantity?.message}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <input 
                          type="number" 
                          className="input w-full" 
                          min="0"
                          step="0.01"
                          {...register(`items.${index}.price` as const, { valueAsNumber: true })} 
                        />
                        {errors.items?.[index]?.price && <p className="text-xs text-red-500 mt-1">{errors.items[index]?.price?.message}</p>}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                        ${subtotal.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          type="button"
                          onClick={() => remove(index)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          disabled={fields.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {errors.items?.root && (
            <p className="text-sm text-red-500 mt-2">{errors.items.root.message}</p>
          )}

        </div>

        {/* Section 3: Footer Totals */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Purchase Value</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">
              ${calculateTotal().toFixed(2)}
            </p>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary w-full md:w-auto px-8 py-3 text-lg h-auto shadow-lg shadow-primary-500/30"
          >
            {isSubmitting ? 'Saving...' : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Record Purchase & Update Stock
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
