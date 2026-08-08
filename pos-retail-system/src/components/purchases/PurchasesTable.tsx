import { Purchase } from '../../types';
import { Eye } from 'lucide-react';

interface PurchasesTableProps {
  purchases: Purchase[];
  isLoading: boolean;
  onView: (purchase: Purchase) => void;
}

export function PurchasesTable({ purchases, isLoading, onView }: PurchasesTableProps) {
  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No purchases found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-6 py-4 font-medium">Invoice ID</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Supplier</th>
              <th className="px-6 py-4 font-medium">Recorded By</th>
              <th className="px-6 py-4 font-medium">Items Count</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {purchases.map((purchase) => (
              <tr key={purchase.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">
                  {purchase.id.slice(-8).toUpperCase()}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {new Date(purchase.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{purchase.supplier?.name}</span>
                  {purchase.supplier?.company && <span className="text-xs text-gray-500 block">{purchase.supplier.company}</span>}
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {purchase.user?.name}
                </td>
                <td className="px-6 py-4">
                  <span className="badge-gray">{purchase._count?.items || 0} items</span>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-100">
                  ${Number(purchase.total).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onView(purchase)}
                    className="p-1.5 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors inline-flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
