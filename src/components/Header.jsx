import React from 'react';

const Header = ({ adminViewMode, setAdminViewMode, adminSearch, setAdminSearch, admins, grandTotal = 0, currentView, setCurrentView }) => {
  return (
    <header className="mb-8 flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="text-right">
          <h1 className="text-3xl font-black text-gray-900 mb-2">نظام إدارة الطلبيات</h1>
          <p className="text-gray-500">تتبع دقيق لأرباح (فائدتي، الأدمن، المسوقات)</p>
          <div className="mt-4 inline-block bg-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
            <span className="text-sm opacity-80 block">إجمالي أرباحي الصافي:</span>
            <span className="text-2xl font-black">{grandTotal.toLocaleString()} د.ج</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${currentView === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
          >
            الرئيسية
          </button>
          <button 
            onClick={() => setCurrentView('returns')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${currentView === 'returns' ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
          >
            المرجوعات
          </button>
        </div>
      </div>

      {currentView === 'dashboard' && (
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto self-end">
          <select 
            className="border border-gray-300 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white"
            value={adminViewMode}
            onChange={(e) => setAdminViewMode(e.target.value)}
          >
            <option value="all">عرض كل الجداول</option>
            {admins.map(a => (
              <option key={a.id} value={a.id}>جدول: {a.name}</option>
            ))}
          </select>

          <input 
            type="text" 
            placeholder="🔍 ابحث عن أدمن..." 
            className="w-full sm:w-64 border border-gray-300 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={adminSearch}
            onChange={(e) => setAdminSearch(e.target.value)}
          />
        </div>
      )}
    </header>
  );
};

export default Header;
