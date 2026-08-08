import { Customer } from '../../types';
import { Edit, Trash2, Eye } from 'lucide-react';

interface CustomersTableProps {
  customers: Customer[];
  isLoading: boolean;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onView: (customer: Customer) => void;
}

export function CustomersTable({ customers, isLoading, onEdit, onDelete, onView }: CustomersTableProps) {
  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No customers found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Contact</th>
              <th className="px-6 py-4 font-medium">Address</th>
              <th className="px-6 py-4 font-medium">Total Sales</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{customer.name}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-xs">
                    {customer.phone && <span className="text-gray-600 dark:text-gray-400">{customer.phone}</span>}
                    {customer.email && <span className="text-gray-500">{customer.email}</span>}
                    {!customer.phone && !customer.email && <span className="text-gray-400 italic">No contact info</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-600 dark:text-gray-400 truncate max-w-[200px] inline-block" title={customer.address || ''}>
                    {customer.address || '-'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="badge-primary">{customer._count?.sales || 0} Sales</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onView(customer)}
                      className="p-1.5 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onEdit(customer)}
                      className="p-1.5 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="Edit Customer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(customer)}
                      className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="Delete Customer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
