
import React, { useState } from 'react';
import CustomerView from './components/CustomerView';
import MerchantView from './components/MerchantView';
import AdminView from './components/AdminView';

type View = 'customer' | 'merchant' | 'admin';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('customer');

  const ViewSwitcher: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg flex items-center space-x-2 fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <button
        onClick={() => setCurrentView('customer')}
        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
          currentView === 'customer'
            ? 'bg-blue-500 text-white shadow'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
      >
        Warga
      </button>
      <button
        onClick={() => setCurrentView('merchant')}
        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
          currentView === 'merchant'
            ? 'bg-emerald-500 text-white shadow'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
      >
        Pedagang
      </button>
      <button
        onClick={() => setCurrentView('admin')}
        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
          currentView === 'admin'
            ? 'bg-purple-500 text-white shadow'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
      >
        Admin
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center font-sans p-4 bg-slate-100 dark:bg-slate-900">
      <div className="w-full max-w-sm h-[800px] max-h-[90vh] bg-white dark:bg-slate-950 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col border-4 border-slate-800 dark:border-slate-600">
        <ViewSwitcher />
        <div className="flex-grow overflow-y-auto">
          {currentView === 'customer' && <CustomerView />}
          {currentView === 'merchant' && <MerchantView />}
          {currentView === 'admin' && <AdminView />}
        </div>
      </div>
    </div>
  );
};

export default App;
