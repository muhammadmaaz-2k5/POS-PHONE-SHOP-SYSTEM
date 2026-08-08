import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { ProductFilters } from '../components/products/ProductFilters';
import { ProductsTable } from '../components/products/ProductsTable';
import { ProductFormModal } from '../components/products/ProductFormModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Pagination } from '../components/Pagination';
import { Product } from '../types';

export default function ProductsPage() {
  const { products, isLoading, fetchProducts, page, totalPages, setPage, deleteProduct } = useProductStore();
  const { user } = useCurrentUser();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddClick = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id);
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products & Inventory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your store's products, track stock, and monitor pricing.
          </p>
        </div>
        
        {user?.isAdmin && (
          <button onClick={handleAddClick} className="btn-primary">
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        )}
      </div>

      <ProductFilters />

      <ProductsTable
        products={products}
        isLoading={isLoading}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        isAdmin={!!user?.isAdmin}
      />

      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />

      <ProductFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        product={editingProduct} 
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
}
