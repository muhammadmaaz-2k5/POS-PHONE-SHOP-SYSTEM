import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { usePurchaseStore } from '../store/usePurchaseStore';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { PurchasesTable } from '../components/purchases/PurchasesTable';
import { PurchaseDetailModal } from '../components/purchases/PurchaseDetailModal';
import { Pagination } from '../components/Pagination';
import { Purchase } from '../types';

export default function PurchasesPage() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const { purchases, isLoading, fetchPurchases, page, totalPages, setPage } = usePurchaseStore();
  
  const [activePurchase, setActivePurchase] = useState<Purchase | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const handleViewClick = (purchase: Purchase) => {
    setActivePurchase(purchase);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Purchases History</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View past stock replenishments and supplier invoices.
          </p>
        </div>
        
        {user?.isAdmin && (
          <button 
            onClick={() => navigate('/purchases/new')} 
            className="btn-primary whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Record Purchase
          </button>
        )}
      </div>

      <PurchasesTable
        purchases={purchases}
        isLoading={isLoading}
        onView={handleViewClick}
      />

      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />

      <PurchaseDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        purchase={activePurchase}
      />
    </div>
  );
}
