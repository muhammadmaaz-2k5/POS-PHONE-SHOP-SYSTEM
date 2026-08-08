import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';

export function ProductFilters() {
  const { search, category, lowStockOnly, setSearch, setCategory, setLowStockOnly } = useProductStore();
  const [localSearch, setLocalSearch] = useState(search);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

  const CATEGORIES = ['All', 'Phones', 'Tablets', 'Accessories', 'Chargers', 'Cases', 'Other'];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search products, brands, IMEI..."
          className="input pl-10"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            className="input pl-9 cursor-pointer appearance-none pr-8"
            value={category || 'All'}
            onChange={(e) => setCategory(e.target.value === 'All' ? '' : e.target.value)}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-gray-800 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg">
          <input
            type="checkbox"
            className="rounded text-primary-600 focus:ring-primary-500"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Low Stock
          </span>
        </label>
      </div>
    </div>
  );
}
