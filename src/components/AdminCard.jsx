import React, { useState, useMemo } from 'react';

const AdminCard = ({ admin }) => {
  const [viewMode, setViewMode] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const itemsPerPage = 5;

  const totals = useMemo(() => admin.orders.reduce((acc, order) => {
    acc.admin += order.admin_profit;
    acc.marketer += order.marketer_profit;
    acc.mine += order.my_profit;
    return acc;
  }, { admin: 0, marketer: 0, mine: 0 }), [admin.orders]);

  const uniqueMarketers = useMemo(() => [...new Set(admin.orders.map(o => o.marketer_name))], [admin.orders]);

  const filteredOrders = useMemo(() => {
    if (viewMode === 'all') return admin.orders;
    return admin.orders.filter(o => o.marketer_name === viewMode);
  }, [admin.orders, viewMode]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const handleViewChange = (e) => {
    setViewMode(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-8">
      <div 
        className="p-5 bg-gray-50 border-b flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          <span className={`transform transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}>
            ▼
          </span>
          <h2 className="text-xl font-bold text-gray-800">{admin.name}</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-sm" onClick={(e) => e.stopPropagation()}>
          <div className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-lg font-bold">فائدتي: {totals.mine.toLocaleString()} د.ج</div>
          <div className="bg-green-100 text-green-800 px-3 py-1.5 rounded-lg font-bold">فائدة الأدمن: {totals.admin.toLocaleString()} د.ج</div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg font-bold">المسوقات: {totals.marketer.toLocaleString()} د.ج</div>
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div className="p-4 border-b flex items-center gap-4 bg-white">
            <span className="text-sm font-bold text-gray-600">عرض المسوقات:</span>
            <select 
              className="border border-gray-300 rounded-lg p-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={viewMode}
              onChange={handleViewChange}
            >
              <option value="all">عرض الكل</option>
              {uniqueMarketers.map((m, idx) => (
                <option key={idx} value={m}>المسوقة: {m}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[600px]">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="p-4 border-b">المسوقة</th>
                  <th className="p-4 border-b">الطلبية</th>
                  <th className="p-4 border-b text-purple-700">فائدتي</th>
                  <th className="p-4 border-b text-green-700">فائدة الأدمن</th>
                  <th className="p-4 border-b text-blue-700">فائدة المسوقة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentOrders.length > 0 ? currentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-800">{order.marketer_name}</td>
                    <td className="p-4 text-gray-600">{order.details}</td>
                    <td className="p-4 font-mono font-bold text-purple-600">+{order.my_profit}</td>
                    <td className="p-4 font-mono font-bold text-green-600">+{order.admin_profit}</td>
                    <td className="p-4 font-mono font-bold text-blue-600">+{order.marketer_profit}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="p-6 text-center text-gray-400">لا توجد طلبيات</td></tr>
                )}
                </tbody>
                <tfoot className="bg-gray-100 font-bold border-t">
                  <tr>
                    <td className="p-4 text-left">المجموع</td>
                    <td className="p-4"></td>
                    <td className="p-4 text-purple-700">{filteredOrders.reduce((sum, o) => sum + (o.my_profit || 0), 0).toLocaleString()} د.ج</td>
                    <td className="p-4 text-green-700">{filteredOrders.reduce((sum, o) => sum + (o.admin_profit || 0), 0).toLocaleString()} د.ج</td>
                    <td className="p-4 text-blue-700">{filteredOrders.reduce((sum, o) => sum + (o.marketer_profit || 0), 0).toLocaleString()} د.ج</td>
                  </tr>
                </tfoot>
              </table>
            </div>

          {totalPages > 1 && (
            <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-4 py-2 bg-white border rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-gray-100"
              >
                السابق
              </button>
              <span className="text-sm text-gray-600">صفحة {currentPage} من {totalPages}</span>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-4 py-2 bg-white border rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-gray-100"
              >
                التالي
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminCard;
