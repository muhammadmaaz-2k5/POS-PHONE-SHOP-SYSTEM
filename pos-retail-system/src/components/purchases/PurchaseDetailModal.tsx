import { useState, useEffect } from 'react';
import { X, PackagePlus, Building2, User } from 'lucide-react';
import { Purchase } from '../../types';
import api from '../../lib/axios';

interface PurchaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchase: Purchase | null;
}

export function PurchaseDetailModal({ isOpen, onClose, purchase }: PurchaseDetailModalProps) {
  const [details, setDetails] = useState<Purchase | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && purchase) {
      const fetchDetails = async () => {
        setIsLoading(true);
        try {
          const response = await api.get(`/purchases/${purchase.id}`);
          setDetails(response.data.data);
        } catch (error) {
          console.error('Failed to fetch purchase details', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    } else {
      setDetails(null);
    }
  }, [isOpen, purchase]);

  if (!isOpen || !purchase) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-4xl my-8 border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <PackagePlus className="w-5 h-5 text-primary-600" />
              Purchase Details
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">
              ID: {purchase.id.toUpperCase()}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-gray-500" /> Supplier Information
              </h3>
              <p className="font-medium text-gray-900 dark:text-white">{purchase.supplier?.name}</p>
              {purchase.supplier?.company && <p className="text-sm text-gray-600 dark:text-gray-400">{purchase.supplier.company}</p>}
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-gray-500" /> Record Information
              </h3>
              <p className="text-sm text-gray-900 dark:text-white">
                <span className="text-gray-500">Recorded By:</span> {purchase.user?.name}
              </p>
              <p className="text-sm text-gray-900 dark:text-white mt-1">
                <span className="text-gray-500">Date:</span> {new Date(purchase.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Items Purchased</h3>
            {isLoading || !details ? (
              <div className="w-full space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-4 py-3 font-medium">Product</th>
                      <th className="px-4 py-3 font-medium">Brand</th>
                      <th className="px-4 py-3 font-medium text-center">Qty</th>
                      <th className="px-4 py-3 font-medium text-right">Unit Cost</th>
                      <th className="px-4 py-3 font-medium text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {details.items?.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{item.product.name}</td>
                        <td className="px-4 py-3 text-gray-500">{item.product.brand}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="badge-primary">{item.quantity}</span>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                          ${Number(item.price).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 font-semibold text-right text-gray-900 dark:text-white">
                          ${Number(item.subtotal).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <tr>
                      <td colSpan={4} className="px-4 py-4 text-right font-bold text-gray-900 dark:text-white">
                        TOTAL PAID
                      </td>
                      <td className="px-4 py-4 text-right font-black text-primary-600 dark:text-primary-400 text-lg">
                        ${Number(details.total).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
