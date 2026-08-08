import { Sale } from '../../types';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface RecentSalesTableProps {
  sales: Sale[];
}

export function RecentSalesTable({ sales }: RecentSalesTableProps) {
  const navigate = useNavigate();

  if (!sales || sales.length === 0) {
    return <div className="p-4 text-center text-gray-500">No recent sales.</div>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3 font-medium">Invoice</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                  {sale.invoiceNumber}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                  {sale.customer ? sale.customer.name : 'Walk-in'}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {sale.items?.length || 0}
                </td>
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-gray-100">
                  ${Number(sale.total).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span className="capitalize px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md">
                    {sale.paymentMethod}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t border-gray-100 dark:border-gray-800 text-center">
        <button 
          onClick={() => navigate('/pos')}
          className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 inline-flex items-center gap-1"
        >
          Go to POS <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
