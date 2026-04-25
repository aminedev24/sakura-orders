import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import AdminForm from './components/AdminForm';
import OrderForm from './components/OrderForm';
import AdminCard from './components/AdminCard';
import { fetchAdmins, addAdmin, addOrder } from './api/api';

function App() {
  const [admins, setAdmins] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminViewMode, setAdminViewMode] = useState('all'); 

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAdmins();
      setAdmins(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('فشل في تحميل البيانات. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddAdmin = async (name) => {
    try {
      const result = await addAdmin(name);
      if (result.success) {
        loadData();
      }
    } catch (err) {
      alert('حدث خطأ أثناء إضافة الأدمن');
    }
  };

  const handleAddOrder = async (orderData) => {
    try {
      const result = await addOrder(orderData);
      if (result.success) {
        loadData();
      }
    } catch (err) {
      alert('حدث خطأ أثناء إضافة الطلبية');
    }
  };

  const filteredAdmins = admins
    .filter(admin => admin.name.includes(adminSearch))
    .filter(admin => adminViewMode === 'all' || admin.id === parseInt(adminViewMode));

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10 font-sans selection:bg-blue-200" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        <Header 
          adminViewMode={adminViewMode} 
          setAdminViewMode={setAdminViewMode} 
          adminSearch={adminSearch} 
          setAdminSearch={setAdminSearch} 
          admins={admins} 
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 text-center font-bold">
            {error}
          </div>
        )}

        <AdminForm onAddAdmin={handleAddAdmin} />
        
        <div className="mt-4">
          <OrderForm admins={admins} onAddOrder={handleAddOrder} />
        </div>

        {loading ? (
          <div className="text-center p-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500 font-bold">جاري التحميل...</p>
          </div>
        ) : (
          <div>
            {filteredAdmins.length === 0 ? (
              <div className="text-center p-10 text-gray-500 font-bold bg-white rounded-2xl border">
                لا توجد جداول لعرضها
              </div>
            ) : (
              filteredAdmins.map(admin => (
                <AdminCard key={admin.id} admin={admin} />
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
