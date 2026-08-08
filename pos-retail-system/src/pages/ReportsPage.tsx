import { useState, useEffect } from 'react';
import { useAnalyticsStore } from '../store/useAnalyticsStore';
import { ExportButton } from '../components/reports/ExportButton';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

type Tab = 'daily' | 'monthly' | 'products' | 'cashier' | 'inventory';

const COLORS = ['#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316', '#eab308'];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('daily');
  const { fetchReports, dailySales, monthlySales, topProducts, salesByCashier, inventory, isLoading } = useAnalyticsStore();

  useEffect(() => {
    fetchReports(30);
  }, [fetchReports]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'daily':
        return (
          <div className="space-y-6">
            <div className="flex justify-end">
              <ExportButton data={dailySales} filename="daily-sales" />
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm h-[400px]">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Daily Revenue (Last 30 Days)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-10" />
                  <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(v) => `$${v}`} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(v: any) => `$${Number(v).toFixed(2)}`} />
                  <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'monthly':
        return (
          <div className="space-y-6">
            <div className="flex justify-end">
              <ExportButton data={monthlySales} filename="monthly-sales" />
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm h-[400px]">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Monthly Revenue (Last 12 Months)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-10" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(v) => `$${v}`} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(v: any) => `$${Number(v).toFixed(2)}`} />
                  <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex justify-end">
              <ExportButton data={topProducts} filename="top-products" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm h-[400px]">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top 10 Products by Volume</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" className="dark:opacity-10" />
                    <XAxis type="number" tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={120} tick={{fontSize: 12}} />
                    <Tooltip />
                    <Bar dataKey="unitsSold" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col h-[400px]">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Profit Leaders</h3>
                </div>
                <div className="overflow-y-auto flex-1">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500">
                      <tr>
                        <th className="px-4 py-2 font-medium">Product</th>
                        <th className="px-4 py-2 font-medium text-right">Revenue</th>
                        <th className="px-4 py-2 font-medium text-right">Profit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {[...topProducts].sort((a,b) => (b.profit||0) - (a.profit||0)).map((p, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/20">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 truncate max-w-[200px]">{p.name}</td>
                          <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">${p.revenue.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right font-bold text-green-600 dark:text-green-400">${p.profit?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 'cashier':
        return (
          <div className="space-y-6">
            <div className="flex justify-end">
              <ExportButton data={salesByCashier} filename="sales-by-cashier" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm h-[400px] flex flex-col items-center justify-center">
                <h3 className="text-lg font-semibold w-full text-left mb-2 text-gray-900 dark:text-white">Sales Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesByCashier}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="revenue"
                      nameKey="name"
                    >
                      {salesByCashier.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => `$${Number(v).toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col h-[400px]">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Cashier Performance</h3>
                </div>
                <div className="overflow-y-auto flex-1">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500">
                      <tr>
                        <th className="px-4 py-2 font-medium">Name</th>
                        <th className="px-4 py-2 font-medium text-center">Orders</th>
                        <th className="px-4 py-2 font-medium text-right">Total Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {salesByCashier.map((c, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/20">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                            {c.name}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">{c.orders}</td>
                          <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">${c.revenue.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 'inventory':
        return (
          <div className="space-y-6">
            <div className="flex justify-end">
              <ExportButton data={inventory} filename="inventory-report" />
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Product Name</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-right">Stock</th>
                      <th className="px-4 py-3 font-medium text-right">Cost Value</th>
                      <th className="px-4 py-3 font-medium text-right">Retail Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {inventory.map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/20">
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{item.name}</td>
                        <td className="px-4 py-3 text-gray-500">{item.category}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                            item.status === 'Out of Stock' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : item.status === 'Low Stock' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {item.stock} <span className="text-gray-400 text-xs">/ {item.minimumStock}</span>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">${item.stockValue.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">${item.retailValue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <td colSpan={4} className="px-4 py-4 text-right font-bold text-gray-900 dark:text-white">TOTAL PORTFOLIO VALUE:</td>
                      <td className="px-4 py-4 text-right font-bold text-gray-900 dark:text-white">${inventory.reduce((sum, item) => sum + item.stockValue, 0).toFixed(2)}</td>
                      <td className="px-4 py-4 text-right font-bold text-primary-600 dark:text-primary-400">${inventory.reduce((sum, item) => sum + item.retailValue, 0).toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Deep dive into your store's performance metrics.
        </p>
      </div>

      <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 dark:border-gray-800">
        {[
          { id: 'daily', label: 'Daily Sales' },
          { id: 'monthly', label: 'Monthly Sales' },
          { id: 'products', label: 'Top Products' },
          { id: 'cashier', label: 'By Cashier' },
          { id: 'inventory', label: 'Inventory' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in duration-300">
        {renderContent()}
      </div>

    </div>
  );
}
