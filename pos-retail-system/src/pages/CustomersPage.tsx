import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useCustomerStore } from '../store/useCustomerStore';
import { CustomersTable } from '../components/customers/CustomersTable';
import { CustomerFormModal } from '../components/customers/CustomerFormModal';
import { CustomerDetailModal } from '../components/customers/CustomerDetailModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Pagination } from '../components/Pagination';
import { Customer } from '../types';

export default function CustomersPage() {
  const { customers, isLoading, fetchCustomers, page, totalPages, setPage, deleteCustomer, search, setSearch } = useCustomerStore();
  
  const [localSearch, setLocalSearch] = useState(search);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

  const handleAddClick = () => {
    setActiveCustomer(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (customer: Customer) => {
    setActiveCustomer(customer);
    setIsFormOpen(true);
  };

  const handleViewClick = (customer: Customer) => {
    setActiveCustomer(customer);
    setIsDetailOpen(true);
  };

  const handleDeleteClick = (customer: Customer) => {
    setActiveCustomer(customer);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (activeCustomer) {
      try {
        await deleteCustomer(activeCustomer.id);
      } catch (error: any) {
        // Handled globally or by toast, but we can catch to prevent closing if it failed
        console.error(error);
      } finally {
        setDeleteConfirmOpen(false);
        setActiveCustomer(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your customer database and view their purchase histories.
          </p>
        </div>
        
        <button onClick={handleAddClick} className="btn-primary whitespace-nowrap">
          <Plus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name, phone, or email..."
          className="input pl-10"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>

      <CustomersTable
        customers={customers}
        isLoading={isLoading}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onView={handleViewClick}
      />

      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />

      <CustomerFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        customer={activeCustomer} 
      />

      <CustomerDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        customer={activeCustomer}
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete Customer"
        message={`Are you sure you want to delete "${activeCustomer?.name}"? If they have existing sales, you will not be able to delete them.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
}
