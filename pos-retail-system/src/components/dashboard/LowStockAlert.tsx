import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LowStockAlertProps {
  products: any[];
}

export function LowStockAlert({ products }: LowStockAlertProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  if (!products || products.length === 0) return null;

  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl overflow-hidden mb-6">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-orange-100/50 dark:hover:bg-orange-900/40 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 dark:bg-orange-800 text-orange-600 dark:text-orange-400 p-2 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-orange-800 dark:text-orange-400">Inventory Alert</h3>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              {products.length} product(s) are running low on stock
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); navigate('/purchases/new'); }}
            className="text-sm font-semibold bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg shadow-sm transition-colors"
          >
            Order Stock
          </button>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-orange-600" /> : <ChevronDown className="w-5 h-5 text-orange-600" />}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-orange-200 dark:border-orange-800 bg-white/50 dark:bg-black/20 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map(p => (
              <div key={p.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-orange-100 dark:border-orange-900/50 flex justify-between items-center shadow-sm">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.brand}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600 dark:text-red-400 text-lg leading-none">{p.stock}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Left</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
