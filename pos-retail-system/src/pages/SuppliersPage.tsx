import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useSupplierStore } from '../store/useSupplierStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { SuppliersTable } from '../components/suppliers/SuppliersTable';
import { SupplierFormModal } from '../components/suppliers/SupplierFormModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Pagination } from '../components/Pagination';
import { Supplier } from '../types';

export default function SuppliersPage() {
  const { suppliers, isLoading, fetchSuppliers, page, totalPages, setPage, deleteSupplier, search, setSearch } = useSupplierStore();
  const { user } = useCurrentUser();
  
  const [localSearch, setLocalSearch] = useState(search);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeSupplier, setActiveSupplier] = useState<Supplier | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

  const handleAddClick = () => {
    setActiveSupplier(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (supplier: Supplier) => {
    setActiveSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (supplier: Supplier) => {
    setActiveSupplier(supplier);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (activeSupplier) {
      try {
        await deleteSupplier(activeSupplier.id);
      } catch (error: any) {
        console.error(error);
      } finally {
        setDeleteConfirmOpen(false);
        setActiveSupplier(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Suppliers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your stock providers and track restocking history.
          </p>
        </div>
        
        {user?.isAdmin && (
          <button onClick={handleAddClick} className="btn-primary whitespace-nowrap">
            <Plus className="w-5 h-5" />
            Add Supplier
          </button>
        )}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name or company..."
          className="input pl-10"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>

      <SuppliersTable
        suppliers={suppliers}
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

      <SupplierFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        supplier={activeSupplier} 
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Supplier"
        message={`Are you sure you want to delete "${activeSupplier?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
}
