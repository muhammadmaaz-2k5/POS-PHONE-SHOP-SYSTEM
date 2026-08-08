import { useEffect } from 'react';
import { DollarSign, TrendingUp, ShoppingCart, Package } from 'lucide-react';
import { useAnalyticsStore } from '../store/useAnalyticsStore';
import { KPICard } from '../components/dashboard/KPICard';
import { SalesChart } from '../components/dashboard/SalesChart';
import { RecentSalesTable } from '../components/dashboard/RecentSalesTable';
import { LowStockAlert } from '../components/dashboard/LowStockAlert';

export default function DashboardPage() {
  const { dashboardData, dailySales, lowStock, fetchDashboard, fetchReports, isLoading } = useAnalyticsStore();

  useEffect(() => {
    fetchDashboard();
    fetchReports(7); // Fetch last 7 days for the dashboard chart

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchDashboard();
      fetchReports(7);
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchDashboard, fetchReports]);

  if (isLoading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <LowStockAlert products={lowStock} />

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Today's Sales" 
          value={`$${(dashboardData?.todaySales || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}`} 
          icon={<DollarSign className="w-6 h-6" />}
        />
        <KPICard 
          title="Today's Profit" 
          value={`$${(dashboardData?.todayProfit || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}`} 
          icon={<TrendingUp className="w-6 h-6" />}
        />
        <KPICard 
          title="Orders Today" 
          value={dashboardData?.todayOrders || 0} 
          icon={<ShoppingCart className="w-6 h-6" />}
        />
        <KPICard 
          title="Total Products" 
          value={dashboardData?.totalProducts || 0} 
          icon={<Package className="w-6 h-6" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Revenue (Last 7 Days)</h3>
          <SalesChart data={dailySales} />
        </div>

        {/* Recent Sales Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
          <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
          </div>
          <div className="flex-1">
            <RecentSalesTable sales={dashboardData?.recentSales || []} />
          </div>
        </div>
      </div>
      
    </div>
  );
}
