import { useEffect, useState, useRef } from 'react';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { ProductSearchBar } from '../components/pos/ProductSearchBar';
import { ProductGrid } from '../components/pos/ProductGrid';
import { CartPanel } from '../components/pos/CartPanel';
import { Search } from 'lucide-react';

export default function POSPage() {
  const { products, fetchProducts, isLoading } = useProductStore();
  const { items, clearCart } = useCartStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCheckoutOpen && e.key !== 'Escape') return;

      switch (e.key) {
        case 'F2':
          e.preventDefault();
          searchInputRef.current?.focus();
          break;
        case 'F9':
          e.preventDefault();
          if (items.length > 0) setIsCheckoutOpen(true);
          break;
        case 'Escape':
          e.preventDefault();
          if (isCheckoutOpen) {
            setIsCheckoutOpen(false);
          } else if (items.length > 0) {
            if (window.confirm('Are you sure you want to clear the cart?')) {
              clearCart();
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items.length, isCheckoutOpen, clearCart]);

  // Fetch all products on mount. In a massive DB we'd paginate, 
  // but for POS we might want a large limit (e.g. 100) or infinite scroll.
  useEffect(() => {
    // Force a large limit for POS grid so cashier can see everything
    const currentLimit = useProductStore.getState().limit;
    useProductStore.setState({ limit: 100 });
    fetchProducts();
    
    // Cleanup limit on unmount if needed
    return () => {
      useProductStore.setState({ limit: currentLimit });
    };
  }, [fetchProducts]);

  // Extract unique categories dynamically from fetched products
  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  // Client-side filter
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = activeCategory === '' || product.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-[calc(100vh-64px)] -m-6 flex flex-col md:flex-row overflow-hidden bg-gray-100 dark:bg-gray-950">
      
      {/* Left side: Products (60%) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden p-4 md:p-6 pb-24 md:pb-6">
        <ProductSearchBar 
          onSearch={setSearchTerm}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="relative mb-6 mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search products by name, brand, or IMEI... (Press F2)"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-thin pr-2">
          <ProductGrid 
            products={filteredProducts} 
            isLoading={isLoading} 
          />
        </div>
      </div>

      {/* Right side: Cart Panel (40%) */}
      <div className="w-full md:w-[400px] lg:w-[450px] shrink-0 h-[60vh] md:h-full z-20 shadow-2xl md:shadow-none fixed bottom-0 md:relative md:bottom-auto">
        <CartPanel />
      </div>

    </div>
  );
}
