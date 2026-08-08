import { useEffect, useState } from 'react';
import { X, ShoppingBag, MapPin, Phone, Mail } from 'lucide-react';
import { Customer } from '../../types';
import { useCustomerStore } from '../../store/useCustomerStore';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export function CustomerDetailModal({ isOpen, onClose, customer }: CustomerDetailModalProps) {
  const { getCustomerSales } = useCustomerStore();
  const [sales, setSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && customer) {
      const fetchSales = async () => {
        setIsLoading(true);
        try {
          const data = await getCustomerSales(customer.id);
          setSales(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSales();
    }
  }, [isOpen, customer, getCustomerSales]);

  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-4xl my-8 border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {customer.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex gap-4">
              {customer.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3"/> {customer.phone}</span>}
              {customer.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> {customer.email}</span>}
              {customer.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {customer.address}</span>}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Purchase History */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-primary-600" />
            Purchase History
          </h3>
          
          {isLoading ? (
            <div className="w-full space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : sales.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">No purchase history found for this customer.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-lg">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="px-4 py-3 font-medium">Invoice #</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Items</th>
                    <th className="px-4 py-3 font-medium">Payment</th>
                    <th className="px-4 py-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{sale.id.slice(-8).toUpperCase()}</td>
                      <td className="px-4 py-3 text-gray-500">{new Date(sale.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {sale.items?.reduce((acc: number, item: any) => acc + item.quantity, 0)} items
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge-gray capitalize">{sale.paymentMethod}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-right text-gray-900 dark:text-gray-100">
                        ${Number(sale.totalAmount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
