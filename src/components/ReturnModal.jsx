import React from 'react';

const ReturnModal = ({ isOpen, onClose, onConfirm, order }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl">
        <div className="p-6 bg-orange-600 text-white">
          <h3 className="text-xl font-black">تأكيد إرجاع الطلبية</h3>
          <p className="text-orange-100 mt-1">المسوقة: {order?.marketer_name}</p>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
            <p className="text-sm text-orange-800 font-bold mb-2">سيتم إجراء ما يلي:</p>
            <ul className="text-xs text-orange-700 space-y-2 list-disc pr-4">
              <li>حذف الطلبية من قائمة الطلبيات النشطة.</li>
              <li>خصم كامل فائدة المسوقة (<span className="font-bold">{order?.marketer_profit} د.ج</span>).</li>
              <li>بقاء فائدة الأدمن وفائدتك كما هي.</li>
              <li>إضافة الطلبية إلى سجل المرجوعات.</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              onClick={() => onConfirm()}
              className="flex-grow bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-95"
            >
              تأكيد الإرجاع
            </button>
            <button 
              onClick={onClose}
              className="px-8 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-4 rounded-2xl transition-all active:scale-95"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnModal;
