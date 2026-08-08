import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages (built in each sprint)
// import SignInPage from './pages/auth/SignInPage';
// import SignUpPage from './pages/auth/SignUpPage';
// import DashboardPage from './pages/DashboardPage';
// import POSPage from './pages/POSPage';
// import ProductsPage from './pages/ProductsPage';
// import CustomersPage from './pages/CustomersPage';
// import SuppliersPage from './pages/SuppliersPage';
// import PurchasesPage from './pages/PurchasesPage';
// import ReportsPage from './pages/ReportsPage';

// Layout (built in Sprint 1)
// import MainLayout from './components/layout/MainLayout';
// import ProtectedRoute from './components/auth/ProtectedRoute';

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#f9fafb' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#f9fafb' } },
        }}
      />
      <Routes>
        {/* Placeholder — routes are added as sprints complete */}
        <Route
          path="/"
          element={
            <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-primary-400 mb-2">📱 Phone Shop POS</h1>
                <p className="text-gray-400">Sprint 0 complete — setting up authentication in Sprint 1</p>
              </div>
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
