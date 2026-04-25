import React, { useState } from 'react';

const AdminForm = ({ onAddAdmin }) => {
  const [newAdminName, setNewAdminName] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newAdminName.trim()) return;
    onAddAdmin(newAdminName.trim());
    setNewAdminName('');
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
      <div 
        className="p-3 bg-gray-50 border-b flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-sm font-bold text-gray-800">إضافة أدمن جديد</h3>
        <span className={`text-xs transform transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </div>
      
      {!isCollapsed && (
        <div className="p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input 
              className="flex-1 border p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="اسم الأدمن" 
              value={newAdminName}
              onChange={(e) => setNewAdminName(e.target.value)}
            />
            <button className="bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded-xl hover:bg-blue-700 transition shadow-sm whitespace-nowrap">
              إضافة
            </button>
          </form>
        </div>
      )}
    </section>
  );
};

export default AdminForm;
