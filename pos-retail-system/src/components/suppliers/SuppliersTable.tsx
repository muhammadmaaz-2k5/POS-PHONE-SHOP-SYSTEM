import { Supplier } from '../../types';
import { Edit, Trash2 } from 'lucide-react';

interface SuppliersTableProps {
  suppliers: Supplier[];
  isLoading: boolean;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
  isAdmin: boolean;
}

export function SuppliersTable({ suppliers, isLoading, onEdit, onDelete, isAdmin }: SuppliersTableProps) {
  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No suppliers found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-6 py-4 font-medium">Name & Company</th>
              <th className="px-6 py-4 font-medium">Contact</th>
              <th className="px-6 py-4 font-medium">Address</th>
              <th className="px-6 py-4 font-medium">Total Purchases</th>
              {isAdmin && <th className="px-6 py-4 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{supplier.name}</span>
                    {supplier.company && <span className="text-xs text-gray-500">{supplier.company}</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-xs">
                    {supplier.phone && <span className="text-gray-600 dark:text-gray-400">{supplier.phone}</span>}
                    {supplier.email && <span className="text-gray-500">{supplier.email}</span>}
                    {!supplier.phone && !supplier.email && <span className="text-gray-400 italic">No contact info</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-600 dark:text-gray-400 truncate max-w-[200px] inline-block" title={supplier.address || ''}>
                    {supplier.address || '-'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="badge-primary">{supplier._count?.purchases || 0} Purchases</span>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onEdit(supplier)}
                        className="p-1.5 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(supplier)}
                        className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
