import React, { useState, useMemo } from 'react';

const AdminCard = ({ admin, onUpdateAdmin, onDeleteAdmin, onEditOrder, onDeleteOrder }) => {
  const [viewMode, setViewMode] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(admin.name);
  const itemsPerPage = 5;

  const totals = useMemo(() => admin.orders.reduce((acc, order) => {
    acc.admin += (order.admin_profit || 0);
    acc.marketer += (order.marketer_profit || 0);
    acc.mine += (order.my_profit || 0);
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

  const handleUpdateName = (e) => {
    e.stopPropagation();
    if (editedName.trim() && editedName !== admin.name) {
      onUpdateAdmin(admin.id, editedName);
    }
    setIsEditingName(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-8">
      <div 
        className="p-5 bg-gray-50 border-b flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3 flex-grow">
          <span className={`transform transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}>
            ▼
          </span>
          {isEditingName ? (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <input 
                type="text" 
                value={editedName} 
                onChange={(e) => setEditedName(e.target.value)}
                className="border border-blue-500 rounded px-2 py-1 text-lg font-bold outline-none"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateName(e)}
              />
              <button onClick={handleUpdateName} className="text-green-600 hover:text-green-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button onClick={(e) => { e.stopPropagation(); setIsEditingName(false); setEditedName(admin.name); }} className="text-red-600 hover:text-red-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-800">{admin.name}</h2>
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => setIsEditingName(true)} 
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="تعديل الاسم"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  onClick={() => onDeleteAdmin(admin.id)} 
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="حذف الأدمن"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          )}
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
            <table className="w-full text-right border-collapse min-w-[700px]">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="p-4 border-b">المسوقة</th>
                  <th className="p-4 border-b">الطلبية</th>
                  <th className="p-4 border-b text-purple-700">فائدتي</th>
                  <th className="p-4 border-b text-green-700">فائدة الأدمن</th>
                  <th className="p-4 border-b text-blue-700">فائدة المسوقة</th>
                  <th className="p-4 border-b text-center">الإجراءات</th>
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
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => onEditOrder(order)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="تعديل الطلبية"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => onDeleteOrder(order.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="حذف الطلبية"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="p-6 text-center text-gray-400">لا توجد طلبيات</td></tr>
                )}
                </tbody>
                <tfoot className="bg-gray-100 font-bold border-t">
                  <tr>
                    <td className="p-4 text-left">المجموع</td>
                    <td className="p-4"></td>
                    <td className="p-4 text-purple-700">{filteredOrders.reduce((sum, o) => sum + (o.my_profit || 0), 0).toLocaleString()} د.ج</td>
                    <td className="p-4 text-green-700">{filteredOrders.reduce((sum, o) => sum + (o.admin_profit || 0), 0).toLocaleString()} د.ج</td>
                    <td className="p-4 text-blue-700">{filteredOrders.reduce((sum, o) => sum + (o.marketer_profit || 0), 0).toLocaleString()} د.ج</td>
                    <td className="p-4"></td>
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
