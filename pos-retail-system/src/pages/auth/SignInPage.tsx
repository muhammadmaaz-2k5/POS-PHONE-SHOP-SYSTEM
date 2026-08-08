import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Key } from 'lucide-react';
import { SignIn } from '@clerk/clerk-react';
import { useState } from 'react';

export default function SignInPage() {
  const navigate = useNavigate();
  const [showClerk, setShowClerk] = useState(false);

  const handleLogin = (role: 'admin' | 'cashier') => {
    localStorage.setItem('mock_role', role);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Phone POS System
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Assessment Login
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {showClerk ? (
          <div className="flex flex-col items-center">
            <SignIn fallbackRedirectUrl="/" />
            <button
              onClick={() => setShowClerk(false)}
              className="mt-4 text-sm text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Back to Assessment Login
            </button>
          </div>
        ) : (
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => handleLogin('admin')}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  Login as Admin
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleLogin('cashier')}
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <User className="w-5 h-5 mr-2" />
                  Login as Cashier
                </button>
              </div>

              <div className="relative pt-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or real auth</span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => setShowClerk(true)}
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <Key className="w-5 h-5 mr-2" />
                  Login with Clerk
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Demo Environment</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Authentication has been bypassed for this assessment. Select a role above to proceed without a password.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
