import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { CartItemRow } from './CartItemRow';
import { CustomerSelect } from './CustomerSelect';
import { CheckoutModal } from './CheckoutModal';
import { ConfirmDialog } from '../ConfirmDialog';

export function CartPanel() {
  const { 
    items, 
    clearCart, 
    getSubtotal, 
    getTaxAmount, 
    getTotal, 
    discount, 
    setDiscount,
    taxRate,
    setTaxRate
  } = useCartStore();

  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Local state for inputs to avoid jumping cursors on every keystroke
  const [localDiscount, setLocalDiscount] = useState(discount.toString());
  const [localTax, setLocalTax] = useState(taxRate.toString());

  useEffect(() => {
    setLocalDiscount(discount.toString());
  }, [discount]);

  useEffect(() => {
    setLocalTax(taxRate.toString());
  }, [taxRate]);

  const handleDiscountBlur = () => {
    const val = parseFloat(localDiscount) || 0;
    setDiscount(val);
    setLocalDiscount(val.toString());
  };

  const handleTaxBlur = () => {
    const val = parseFloat(localTax) || 0;
    setTaxRate(val);
    setLocalTax(val.toString());
  };

  const isEmpty = items.length === 0;

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900/50 border-l border-gray-200 dark:border-gray-800">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900">
        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <ShoppingCart className="w-5 h-5 text-primary-600" />
          Current Sale
        </h2>
        
        {!isEmpty && (
          <button 
            onClick={() => setIsClearConfirmOpen(true)}
            className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {/* Customer Selection */}
      <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <CustomerSelect />
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 space-y-4">
            <ShoppingCart className="w-16 h-16 opacity-20" />
            <p className="font-medium">Cart is empty</p>
            <p className="text-sm">Search and tap products to add them.</p>
          </div>
        ) : (
          items.map(item => (
            <CartItemRow key={item.product.id} item={item} />
          ))
        )}
      </div>

      {/* Totals & Checkout Panel */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        
        <div className="space-y-3 mb-6 text-sm">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Subtotal</span>
            <span className="font-medium text-gray-900 dark:text-white">${getSubtotal().toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
            <span>Discount ($)</span>
            <input 
              type="number" 
              className="input py-1 px-2 text-right w-24 h-8" 
              min="0"
              step="0.01"
              value={localDiscount}
              onChange={(e) => setLocalDiscount(e.target.value)}
              onBlur={handleDiscountBlur}
            />
          </div>

          <div className="flex justify-between items-center text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-3">
            <span>Tax Rate (%)</span>
            <input 
              type="number" 
              className="input py-1 px-2 text-right w-24 h-8" 
              min="0"
              max="100"
              step="0.1"
              value={localTax}
              onChange={(e) => setLocalTax(e.target.value)}
              onBlur={handleTaxBlur}
            />
          </div>

          <div className="flex justify-between items-end pt-2">
            <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
            <div className="text-right">
              {getTaxAmount() > 0 && (
                <div className="text-xs text-gray-500 mb-1">Includes ${getTaxAmount().toFixed(2)} Tax</div>
              )}
              <span className="text-3xl font-black text-primary-600 dark:text-primary-400">
                ${getTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <button 
          className="btn-primary w-full h-14 text-lg font-bold shadow-lg shadow-primary-500/20"
          disabled={isEmpty}
          onClick={() => setIsCheckoutOpen(true)}
        >
          Checkout
        </button>
      </div>

      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        title="Clear Cart"
        message="Are you sure you want to clear the current cart? This action cannot be undone."
        confirmText="Clear Cart"
        onConfirm={() => {
          clearCart();
          setIsClearConfirmOpen(false);
        }}
        onCancel={() => setIsClearConfirmOpen(false)}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </div>
  );
}
