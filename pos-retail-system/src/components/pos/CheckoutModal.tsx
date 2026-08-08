import { useState } from 'react';
import { X, CheckCircle2, Banknote, CreditCard, Wallet } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import toast from 'react-hot-toast';
import { ReceiptModal } from './ReceiptModal';
import { Sale } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { 
    items, 
    paymentMethod, 
    setPaymentMethod, 
    getTotal, 
    completeSale, 
    isProcessing,
    clearCart
  } = useCartStore();

  const [cashReceived, setCashReceived] = useState('');
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  const total = getTotal();
  const change = Number(cashReceived) - total;

  const handleConfirm = async () => {
    if (paymentMethod === 'cash' && Number(cashReceived) < total) {
      toast.error('Cash received is less than total amount');
      return;
    }

    try {
      const sale = await completeSale();
      toast.success('Sale completed successfully!');
      setCompletedSale(sale);
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete sale');
    }
  };

  const handleFinish = () => {
    clearCart();
    setCompletedSale(null);
    setCashReceived('');
    onClose();
  };

  if (!isOpen) return null;

  // Receipt View Mode
  if (completedSale) {
    return (
      <ReceiptModal 
        sale={completedSale} 
        onClose={handleFinish} 
        cashReceived={paymentMethod === 'cash' ? Number(cashReceived) : undefined}
      />
    );
  }

  // Checkout View Mode
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Checkout</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Amount Due Banner */}
          <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-xl border border-primary-100 dark:border-primary-800 text-center">
            <p className="text-primary-600 dark:text-primary-400 font-medium mb-1">Amount Due</p>
            <p className="text-5xl font-black text-gray-900 dark:text-white">
              ${total.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-2">{items.length} item(s) in cart</p>
          </div>

          {/* Payment Method Tabs */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Payment Method</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'cash' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary-200 dark:hover:border-primary-800'
                }`}
              >
                <Banknote className="w-6 h-6" />
                <span className="text-sm font-semibold">Cash</span>
              </button>
              
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'card' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary-200 dark:hover:border-primary-800'
                }`}
              >
                <CreditCard className="w-6 h-6" />
                <span className="text-sm font-semibold">Card</span>
              </button>

              <button
                onClick={() => setPaymentMethod('other')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'other' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary-200 dark:hover:border-primary-800'
                }`}
              >
                <Wallet className="w-6 h-6" />
                <span className="text-sm font-semibold">Other</span>
              </button>
            </div>
          </div>

          {/* Cash Input & Change Logic */}
          {paymentMethod === 'cash' && (
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4 animate-in slide-in-from-top-2">
              <div>
                <label className="label">Amount Received ($)</label>
                <input 
                  type="number" 
                  className="input text-lg font-semibold"
                  placeholder="0.00"
                  min={total}
                  step="0.01"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  autoFocus
                />
              </div>

              {Number(cashReceived) >= total && (
                <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                  <span className="text-green-700 dark:text-green-400 font-medium">Change to return:</span>
                  <span className="text-xl font-bold text-green-700 dark:text-green-400">
                    ${change.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-0">
          <button 
            onClick={handleConfirm}
            disabled={isProcessing || (paymentMethod === 'cash' && Number(cashReceived) < total)}
            className="w-full h-14 btn-primary text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 disabled:shadow-none"
          >
            {isProcessing ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6" />
                Confirm Payment
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
