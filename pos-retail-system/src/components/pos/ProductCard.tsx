import { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCartStore();
  
  // Find if already in cart to show count and disable if max stock reached
  const cartItem = items.find(i => i.product.id === product.id);
  const cartQty = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock === 0;
  const isMaxStockInCart = cartQty >= product.stock;

  const handleClick = () => {
    if (isOutOfStock || isMaxStockInCart) return;
    addItem(product);
  };

  return (
    <div 
      onClick={handleClick}
      className={`relative p-4 rounded-xl border flex flex-col justify-between transition-all duration-200 select-none
        ${isOutOfStock 
          ? 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800 opacity-60 cursor-not-allowed' 
          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:shadow-md cursor-pointer'
        }
      `}
    >
      {/* Stock overlay indicator */}
      {isOutOfStock && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/40 dark:bg-black/40 rounded-xl backdrop-blur-[1px]">
          <span className="font-bold text-red-600 dark:text-red-400 bg-white dark:bg-gray-900 px-3 py-1 rounded-full shadow-sm">
            Out of Stock
          </span>
        </div>
      )}

      {/* Cart quantity badge */}
      {cartQty > 0 && !isOutOfStock && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm z-10 animate-in zoom-in">
          {cartQty}
        </div>
      )}
      
      {/* Product Image */}
      {product.imageUrl ? (
        <div className="w-full h-32 mb-3 bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-2 border border-gray-100 dark:border-gray-700">
          <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain drop-shadow-sm" />
        </div>
      ) : (
        <div className="w-full h-32 mb-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex-shrink-0 flex items-center justify-center border border-gray-100 dark:border-gray-700">
          <Package className="w-8 h-8 text-gray-300 dark:text-gray-600" />
        </div>
      )}

      <div className="mb-2">
        <span className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1 block">
          {product.brand}
        </span>
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
          {product.model} {product.color ? `· ${product.color}` : ''} {product.storage ? `· ${product.storage}` : ''}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="font-bold text-gray-900 dark:text-white">
          ${Number(product.sellingPrice).toFixed(2)}
        </span>
        <span className={`text-xs font-medium px-2 py-1 rounded-md ${
          isOutOfStock ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
          : product.stock <= product.minimumStock ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        }`}>
          {product.stock} left
        </span>
      </div>
    </div>
  );
}
