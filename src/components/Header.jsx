import React from 'react';

const Header = ({ adminViewMode, setAdminViewMode, adminSearch, setAdminSearch, admins }) => {
  return (
    <header className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
      <div className="text-right">
        <h1 className="text-3xl font-black text-gray-900 mb-2">نظام إدارة الطلبيات</h1>
        <p className="text-gray-500">تتبع دقيق لأرباح (فائدتي، الأدمن، المسوقات)</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
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
    </header>
  );
};

export default Header;
