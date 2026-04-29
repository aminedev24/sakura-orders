import React, { useMemo, useState } from 'react';

const ReturnsPage = ({ admins }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const allReturns = useMemo(() => {
    const returns = [];
    admins.forEach(admin => {
      if (admin.returns) {
        admin.returns.forEach(ret => {
          returns.push({
            ...ret,
            adminName: admin.name
          });
        });
      }
    });
    // Sort by date descending
    return returns.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [admins]);

  const filteredReturns = allReturns.filter(ret => 
    ret.adminName.includes(searchTerm) || 
    ret.marketer_name.includes(searchTerm) || 
    ret.details.includes(searchTerm)
  );

  // Since all profits are deducted upon return, the contribution of returned orders to the totals is 0.
  // We keep the history of what they were, but they don't count towards current earnings.
  const totalMarketerDeductions = filteredReturns.reduce((sum, r) => sum + (r.marketer_profit || 0), 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 bg-orange-50 border-b flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-orange-800">سجل المرجوعات العام</h2>
          <div className="flex gap-4 mt-1 text-sm font-bold text-orange-600">
             <span>إجمالي خصم المسوقات: {totalMarketerDeductions.toLocaleString()} د.ج</span>
             <span className="opacity-60">(تم خصم جميع الأرباح المرتبطة بهذه الطلبيات من الإجمالي العام)</span>
          </div>
        </div>
        <input 
          type="text" 
          placeholder="ابحث عن أدمن، مسوقة، أو تفاصيل..." 
          className="w-full md:w-80 border border-orange-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse min-w-[800px]">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="p-4 border-b">الأدمن</th>
              <th className="p-4 border-b">المسوقة</th>
              <th className="p-4 border-b">الطلبية المرجوعة</th>
              <th className="p-4 border-b text-purple-700">فائدتي</th>
              <th className="p-4 border-b text-green-700">فائدة الأدمن</th>
              <th className="p-4 border-b text-red-600">خصم المسوقة</th>
              <th className="p-4 border-b">التاريخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredReturns.length > 0 ? filteredReturns.map(ret => (
              <tr key={ret.id} className="hover:bg-orange-50 transition-colors">
                <td className="p-4 font-bold text-gray-800">{ret.adminName}</td>
                <td className="p-4 text-gray-700">{ret.marketer_name}</td>
                <td className="p-4 text-gray-600">{ret.details}</td>
                <td className="p-4 text-purple-400 line-through font-mono text-xs font-bold">
                  {ret.my_profit.toLocaleString()} (خصمت)
                </td>
                <td className="p-4 text-green-400 line-through font-mono text-xs font-bold">
                  {ret.admin_profit.toLocaleString()} (خصمت)
                </td>
                <td className="p-4 font-mono font-bold text-red-600">-{ret.marketer_profit.toLocaleString()}</td>
                <td className="p-4 text-xs text-gray-500">{ret.created_at}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="p-10 text-center text-gray-400 font-bold">لا توجد مرجوعات مطابقة للبحث</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReturnsPage;
