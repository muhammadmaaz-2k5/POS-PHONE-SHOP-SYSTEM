import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface ProductSearchBarProps {
  onSearch: (searchTerm: string) => void;
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function ProductSearchBar({ onSearch, categories, activeCategory, onCategoryChange }: ProductSearchBarProps) {
  const [localSearch, setLocalSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(localSearch);
    }, 250);
    return () => clearTimeout(timer);
  }, [localSearch, onSearch]);

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search products by name, brand, or model..."
          className="input pl-10 h-12 text-lg shadow-sm"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => onCategoryChange('')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            activeCategory === '' 
              ? 'bg-primary-600 text-white shadow-md' 
              : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          }`}
        >
          All Items
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors capitalize ${
              activeCategory === category 
                ? 'bg-primary-600 text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
