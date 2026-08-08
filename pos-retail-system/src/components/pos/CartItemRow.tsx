import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '../../types';
import { useCartStore } from '../../store/useCartStore';

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, quantity } = item;

  const isMaxStock = quantity >= product.stock;

  return (
    <div className="flex flex-col p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm animate-in slide-in-from-right-4 duration-300">
      
      {/* Top row: Name and Delete */}
      <div className="flex justify-between items-start gap-2 mb-2">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
            {product.name}
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ${Number(product.sellingPrice).toFixed(2)} each
          </span>
        </div>
        <button 
          onClick={() => removeItem(product.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom row: Qty Controls and Subtotal */}
      <div className="flex justify-between items-center mt-2">
        
        {/* Quantity Controls */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-lg p-0.5 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="p-1.5 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          
          <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">
            {quantity}
          </span>
          
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            disabled={isMaxStock}
            className={`p-1.5 rounded-md transition-colors ${
              isMaxStock 
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                : 'text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-gray-800'
            }`}
            title={isMaxStock ? 'Maximum stock reached' : 'Increase quantity'}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="font-bold text-gray-900 dark:text-white">
          ${(Number(product.sellingPrice) * quantity).toFixed(2)}
        </div>
        
      </div>
    </div>
  );
}
