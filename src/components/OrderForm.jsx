import React, { useState, useEffect } from 'react';

const OrderForm = ({ admins, onAddOrder, onUpdateOrder, editingOrder, setEditingOrder }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [form, setForm] = useState({
    adminId: '', marketerName: '', details: '', adminProfit: '', marketerProfit: '', myProfit: ''
  });

  useEffect(() => {
    if (editingOrder) {
      setForm({
        adminId: editingOrder.admin_id.toString(),
        marketerName: editingOrder.marketer_name,
        details: editingOrder.details,
        adminProfit: editingOrder.admin_profit.toString(),
        marketerProfit: editingOrder.marketer_profit.toString(),
        myProfit: editingOrder.my_profit.toString()
      });
      setIsCollapsed(false);
    } else {
      setForm(prev => ({
        ...prev,
        marketerName: '',
        details: '',
        adminProfit: '',
        marketerProfit: '',
        myProfit: ''
      }));
    }
  }, [editingOrder]);

  useEffect(() => {
    if (admins.length > 0 && !form.adminId) {
      setForm(prev => ({ ...prev, adminId: admins[0].id.toString() }));
    }
  }, [admins]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.marketerName || form.adminProfit === '' || form.myProfit === '') return;
    
    const orderData = {
      adminId: parseInt(form.adminId),
      marketerName: form.marketerName,
      details: form.details,
      myProfit: parseFloat(form.myProfit),
      adminProfit: parseFloat(form.adminProfit),
      marketerProfit: parseFloat(form.marketerProfit || 0)
    };

    if (editingOrder) {
      onUpdateOrder({ ...orderData, id: editingOrder.id });
    } else {
      onAddOrder(orderData);
      setForm({ ...form, marketerName: '', details: '', adminProfit: '', marketerProfit: '', myProfit: '' });
    }
  };

  const handleCancel = () => {
    setEditingOrder(null);
    setForm({ ...form, marketerName: '', details: '', adminProfit: '', marketerProfit: '', myProfit: '' });
  };

  return (
    <section className={`bg-white rounded-2xl shadow-sm border mb-6 overflow-hidden ${editingOrder ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'}`}>
      <div 
        className={`p-3 border-b flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors ${editingOrder ? 'bg-blue-50 border-blue-100' : 'bg-gray-50'}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className={`text-sm font-bold ${editingOrder ? 'text-blue-800' : 'text-gray-800'}`}>
          {editingOrder ? 'تعديل الطلبية' : 'إضافة طلبية جديدة'}
        </h3>
        <span className={`text-xs transform transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </div>

      {!isCollapsed && (
        <div className="p-4">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-bold text-gray-600">الأدمن</label>
              <select 
                className="border p-2 rounded-xl bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-gray-400"
                value={form.adminId}
                onChange={(e) => setForm({...form, adminId: e.target.value})}
              >
                {admins.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-bold text-gray-600">المسوقة</label>
              <input 
                className="border p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="الاسم" 
                value={form.marketerName}
                onChange={(e) => setForm({...form, marketerName: e.target.value})}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-xs font-bold text-gray-600">التفاصيل</label>
              <input 
                className="border p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="المنتج" 
                value={form.details}
                onChange={(e) => setForm({...form, details: e.target.value})}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-xs font-bold text-purple-700">فائدتي</label>
              <input 
                type="number" step="any" className="border border-purple-200 bg-purple-50 p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500" 
                value={form.myProfit}
                onChange={(e) => setForm({...form, myProfit: e.target.value})}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-xs font-bold text-green-700">فائدة الأدمن</label>
              <input 
                type="number" step="any" className="border border-green-200 bg-green-50 p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500" 
                value={form.adminProfit}
                onChange={(e) => setForm({...form, adminProfit: e.target.value})}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-xs font-bold text-blue-700">فائدة المسوقة</label>
              <input 
                type="number" step="any" className="border border-blue-200 bg-blue-50 p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                value={form.marketerProfit}
                onChange={(e) => setForm({...form, marketerProfit: e.target.value})}
              />
            </div>

            <div className="col-span-2 md:col-span-3 lg:col-span-6 flex gap-2">
              <button className={`flex-grow ${editingOrder ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-black'} text-white font-bold py-2.5 rounded-xl transition shadow-md text-sm`}>
                {editingOrder ? 'حفظ التعديلات' : 'إضافة الطلبية'}
              </button>
              {editingOrder && (
                <button 
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 font-bold py-2.5 px-6 rounded-xl hover:bg-gray-300 transition text-sm"
                >
                  إلغاء
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default OrderForm;
