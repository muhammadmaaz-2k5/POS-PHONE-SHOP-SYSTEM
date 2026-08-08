import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Supplier } from '../../types';
import { useSupplierStore } from '../../store/useSupplierStore';
import toast from 'react-hot-toast';

const supplierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

interface SupplierFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: Supplier | null;
}

export function SupplierFormModal({ isOpen, onClose, supplier }: SupplierFormModalProps) {
  const { createSupplier, updateSupplier } = useSupplierStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: supplier ? {
      name: supplier.name,
      company: supplier.company || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
    } : {
      name: '',
      company: '',
      phone: '',
      email: '',
      address: '',
    },
  });

  const onSubmit = async (data: SupplierFormData) => {
    // Convert empty strings to null where appropriate
    const payload = {
      ...data,
      company: data.company || null,
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
    };

    try {
      if (supplier) {
        await updateSupplier(supplier.id, payload as any);
        toast.success('Supplier updated successfully');
      } else {
        await createSupplier(payload as any);
        toast.success('Supplier added successfully');
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
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md my-8 border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {supplier ? 'Edit Supplier' : 'Add New Supplier'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="space-y-1">
            <label className="label">Contact Person Name *</label>
            <input type="text" className="input" {...register('name')} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="label">Company / Supplier Name</label>
            <input type="text" className="input" {...register('company')} />
            {errors.company && <p className="text-xs text-red-500">{errors.company.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="label">Phone Number</label>
            <input type="text" className="input" {...register('phone')} />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="label">Email Address</label>
            <input type="email" className="input" {...register('email')} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="label">Address</label>
            <textarea className="input min-h-[80px]" {...register('address')} />
            {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Supplier'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
