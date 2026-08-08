import { X, Printer } from 'lucide-react';
import { Sale } from '../../types';

// Inject print styles globally when this component is mounted
const printStyles = `
  @media print {
    @page {
      margin: 0;
    }
    body {
      margin: 0;
      padding: 0;
    }
    body * {
      visibility: hidden;
    }
    #printable-receipt, #printable-receipt * {
      visibility: visible;
    }
    #printable-receipt {
      position: absolute;
      left: 0;
      top: 0;
      width: 80mm; /* Standard thermal receipt width */
      margin: 0;
      padding: 5mm;
      box-shadow: none !important;
      border: none !important;
      color: black;
    }
    /* Hide scrollbars during print */
    ::-webkit-scrollbar {
        display: none;
    }
  }
`;

interface ReceiptModalProps {
  sale: Sale;
  onClose: () => void;
  cashReceived?: number;
}

export function ReceiptModal({ sale, onClose, cashReceived }: ReceiptModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>{printStyles}</style>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col h-[90vh] md:h-auto max-h-[800px] animate-in slide-in-from-bottom-4 duration-300">
          
          {/* Action Header (Not printed) */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Transaction Complete</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Receipt Area */}
          <div className="p-6 overflow-y-auto flex-1 flex justify-center">
            {/* The actual receipt paper */}
            <div id="printable-receipt" className="bg-white text-black p-6 rounded shadow-sm w-full max-w-[320px] font-mono text-sm leading-tight select-text border border-gray-200">
              
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold uppercase mb-1">PHONE SHOP POS</h1>
                <p className="text-xs text-gray-500">123 Retail Ave, Tech City</p>
                <p className="text-xs text-gray-500">Tel: (555) 123-4567</p>
              </div>

              <div className="border-b border-dashed border-gray-300 pb-3 mb-3">
                <p>Invoice: {sale.invoiceNumber}</p>
                <p>Date: {new Date(sale.createdAt).toLocaleString()}</p>
                {/* We assume the API returns the user relation, otherwise fallback to ID */}
                <p>Cashier: {sale.user?.name || sale.userId}</p>
                {sale.customer && (
                  <p className="mt-2 text-gray-600">
                    Customer: {sale.customer.name}<br/>
                    {sale.customer.phone && `Tel: ${sale.customer.phone}`}
                  </p>
                )}
              </div>

              <div className="border-b border-dashed border-gray-300 pb-3 mb-3 space-y-2">
                {sale.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="flex-1 pr-2">
                      <p className="font-semibold truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity} x ${Number(item.price).toFixed(2)}</p>
                    </div>
                    <div className="font-semibold pt-1">
                      ${Number(item.subtotal).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-1 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${Number(sale.subtotal).toFixed(2)}</span>
                </div>
                {Number(sale.discount) > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Discount:</span>
                    <span>-${Number(sale.discount).toFixed(2)}</span>
                  </div>
                )}
                {Number(sale.tax) > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax:</span>
                    <span>${Number(sale.tax).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-black">
                  <span>TOTAL:</span>
                  <span>${Number(sale.total).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-300 pt-3 text-center space-y-1">
                <p className="capitalize font-semibold text-left">Payment: {sale.paymentMethod}</p>
                
                {sale.paymentMethod === 'cash' && cashReceived && (
                  <>
                    <div className="flex justify-between">
                      <span>Received:</span>
                      <span>${cashReceived.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Change:</span>
                      <span>${(cashReceived - Number(sale.total)).toFixed(2)}</span>
                    </div>
                  </>
                )}

                <p className="mt-4 font-bold">THANK YOU FOR YOUR BUSINESS!</p>
                <p className="text-xs text-gray-500">Please keep receipt for warranty</p>
              </div>

            </div>
          </div>

          {/* Action Footer (Not printed) */}
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex gap-3 shrink-0">
            <button 
              onClick={handlePrint}
              className="flex-1 btn-secondary flex justify-center items-center gap-2"
            >
              <Printer className="w-5 h-5" />
              Print Receipt
            </button>
            <button 
              onClick={onClose}
              className="flex-1 btn-primary"
            >
              New Sale
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
