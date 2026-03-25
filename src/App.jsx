import React, { useState, useMemo, useEffect } from 'react';

// --- Admin Card Component (Unchanged from previous version) ---
const AdminCard = ({ admin }) => {
  const [viewMode, setViewMode] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totals = admin.orders.reduce((acc, order) => {
    acc.admin += order.admin_profit;
    acc.marketer += order.marketer_profit;
    acc.mine += order.my_profit;
    return acc;
  }, { admin: 0, marketer: 0, mine: 0 });

  const uniqueMarketers = [...new Set(admin.orders.map(o => o.marketer_name))];

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
      <div className="p-5 bg-gray-50 border-b flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">{admin.name}</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          <div className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-lg font-bold">فائدتي: {totals.mine} د.ج</div>
          <div className="bg-green-100 text-green-800 px-3 py-1.5 rounded-lg font-bold">فائدة الأدمن: {totals.admin} د.ج</div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg font-bold">المسوقات: {totals.marketer} د.ج</div>
        </div>
      </div>

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
    </div>
  );
};

// --- Main App Component ---
function App() {
  const [admins, setAdmins] = useState([]);

  const [adminSearch, setAdminSearch] = useState('');
  
  // NEW STATE: Toggle between 'all' or a specific admin ID
  const [adminViewMode, setAdminViewMode] = useState('all'); 

  const [form, setForm] = useState({
    adminId: 1, marketerName: '', details: '', adminProfit: '', marketerProfit: '', myProfit: ''
  });

  const [newAdminName, setNewAdminName] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost/orders-app/server/api.php?action=fetch');
      const data = await res.json();
      setAdmins(data);
      // Set default adminId if admins exist
      if (data.length > 0 && !data.find(a => a.id == form.adminId)) {
        setForm(prev => ({ ...prev, adminId: data[0].id }));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminName.trim()) return;

    try {
      const res = await fetch('http://localhost/orders-app/server/api.php?action=add_admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newAdminName.trim() })
      });
      const result = await res.json();
      if (result.success) {
        setNewAdminName('');
        fetchData();
      }
    } catch (err) {
      console.error('Error adding admin:', err);
    }
  };

  const addOrder = async (e) => {
    e.preventDefault();
    if (!form.marketerName || form.adminProfit === '' || form.myProfit === '') return;

    try {
      const res = await fetch('http://localhost/orders-app/server/api.php?action=add_order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: parseInt(form.adminId),
          marketerName: form.marketerName,
          details: form.details,
          myProfit: parseFloat(form.myProfit),
          adminProfit: parseFloat(form.adminProfit),
          marketerProfit: parseFloat(form.marketerProfit)
        })
      });
      const result = await res.json();
      if (result.success) {
        setForm({ ...form, marketerName: '', details: '', adminProfit: '', marketerProfit: '', myProfit: '' });
        fetchData(); // Refetch to update UI with new data
      }
    } catch (err) {
      console.error('Error adding order:', err);
    }
  };

  // Filter 1: Apply the search bar
  const searchedAdmins = admins.filter(admin => 
    admin.name.includes(adminSearch)
  );

  // Filter 2: Apply the View Mode toggle (All vs Specific Admin)
  const displayedAdmins = searchedAdmins.filter(admin => {
    if (adminViewMode === 'all') return true;
    return admin.id === parseInt(adminViewMode);
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10 font-sans selection:bg-blue-200" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div className="text-right">
            <h1 className="text-3xl font-black text-gray-900 mb-2">نظام إدارة الطلبيات</h1>
            <p className="text-gray-500">تتبع دقيق لأرباح (فائدتي، الأدمن، المسوقات)</p>
          </div>
          
          {/* Controls: View Mode & Search */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* NEW: Admin View Mode Toggle */}
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

            {/* Existing Search Bar */}
            <input 
              type="text" 
              placeholder="🔍 ابحث عن أدمن..." 
              className="w-full sm:w-64 border border-gray-300 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
            />
          </div>
        </header>

        {/* Add Admin Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">إضافة أدمن جديد</h3>
          <form onSubmit={addAdmin} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-bold text-gray-600">اسم الأدمن</label>
              <input 
                className="w-full border p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="أدخل اسم الأدمن" 
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
              />
            </div>
            <button className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-blue-700 transition shadow-md">
              إضافة الأدمن
            </button>
          </form>
        </section>

        {/* Form Section (Unchanged) */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-10">
          <form onSubmit={addOrder} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="flex flex-col lg:col-span-1">
              <label className="mb-1 text-sm font-bold text-gray-600">الأدمن</label>
              <select 
                className="border p-2.5 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-gray-400"
                value={form.adminId}
                onChange={(e) => setForm({...form, adminId: e.target.value})}
              >
                {admins.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            
            <div className="flex flex-col lg:col-span-1">
              <label className="mb-1 text-sm font-bold text-gray-600">المسوقة</label>
              <input 
                className="border p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="الاسم" 
                value={form.marketerName}
                onChange={(e) => setForm({...form, marketerName: e.target.value})}
              />
            </div>

            <div className="flex flex-col lg:col-span-1">
              <label className="mb-1 text-sm font-bold text-gray-600">التفاصيل</label>
              <input 
                className="border p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="المنتج" 
                value={form.details}
                onChange={(e) => setForm({...form, details: e.target.value})}
              />
            </div>

            <div className="flex flex-col lg:col-span-1">
              <label className="mb-1 text-sm font-bold text-purple-700">فائدتي</label>
              <input 
                type="number" className="border border-purple-200 bg-purple-50 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-purple-500" 
                value={form.myProfit}
                onChange={(e) => setForm({...form, myProfit: e.target.value})}
              />
            </div>

            <div className="flex flex-col lg:col-span-1">
              <label className="mb-1 text-sm font-bold text-green-700">فائدة الأدمن</label>
              <input 
                type="number" className="border border-green-200 bg-green-50 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-green-500" 
                value={form.adminProfit}
                onChange={(e) => setForm({...form, adminProfit: e.target.value})}
              />
            </div>

            <div className="flex flex-col lg:col-span-1">
              <label className="mb-1 text-sm font-bold text-blue-700">فائدة المسوقة</label>
              <input 
                type="number" className="border border-blue-200 bg-blue-50 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                value={form.marketerProfit}
                onChange={(e) => setForm({...form, marketerProfit: e.target.value})}
              />
            </div>

            <div className="lg:col-span-6 mt-2">
              <button className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition shadow-md">
                إضافة الطلبية
              </button>
            </div>
          </form>
        </section>

        {/* Admins List Section */}
        <div>
          {displayedAdmins.length === 0 ? (
            <div className="text-center p-10 text-gray-500 font-bold bg-white rounded-2xl border">
              لا توجد جداول لعرضها
            </div>
          ) : (
            displayedAdmins.map(admin => (
              <AdminCard key={admin.id} admin={admin} />
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default App;