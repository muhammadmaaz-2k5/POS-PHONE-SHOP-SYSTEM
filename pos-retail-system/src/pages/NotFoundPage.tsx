import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 rounded-full">
            <ShieldAlert className="w-12 h-12" />
          </div>
        </div>
        <h1 className="text-6xl font-black text-gray-900 dark:text-white mb-2">404</h1>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Page Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
