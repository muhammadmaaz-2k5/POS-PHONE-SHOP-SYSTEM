import { useState, useEffect, useRef } from 'react';
import { User, Search, X } from 'lucide-react';
import { useCustomerStore } from '../../store/useCustomerStore';
import { useCartStore } from '../../store/useCartStore';

export function CustomerSelect() {
  const { customers, fetchCustomers, setSearch } = useCustomerStore();
  const { customer, setCustomer } = useCartStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Initialize store if empty
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      {/* Selected Customer View */}
      {customer ? (
        <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{customer.name}</p>
              {customer.phone && <p className="text-xs text-gray-500">{customer.phone}</p>}
            </div>
          </div>
          <button 
            onClick={() => setCustomer(null)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-colors"
            title="Remove Customer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Walk-in or Search View */
        <div 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Walk-in Customer</p>
            <p className="text-xs text-gray-500">Click to attach to profile</p>
          </div>
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && !customer && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="p-2 border-b border-gray-100 dark:border-gray-800">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search customers..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border-none rounded-lg focus:ring-0"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {customers.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No customers found.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {customers.map(c => (
                  <li 
                    key={c.id}
                    onClick={() => {
                      setCustomer(c);
                      setIsOpen(false);
                      setLocalSearch('');
                    }}
                    className="p-3 hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer transition-colors"
                  >
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.phone || c.email || 'No contact info'}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
