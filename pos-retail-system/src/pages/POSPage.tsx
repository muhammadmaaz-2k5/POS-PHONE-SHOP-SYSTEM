import { useEffect, useState } from 'react';
import { useProductStore } from '../store/useProductStore';
import { ProductSearchBar } from '../components/pos/ProductSearchBar';
import { ProductGrid } from '../components/pos/ProductGrid';
import { CartPanel } from '../components/pos/CartPanel';

export default function POSPage() {
  const { products, fetchProducts, isLoading } = useProductStore();
  
  // Local state for POS grid filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

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
