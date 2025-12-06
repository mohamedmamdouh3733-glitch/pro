
import React, { useState } from 'react';
import { Customer, Invoice } from '../types';
import { Search, Plus, UserCheck, Phone, Mail, MapPin, Receipt, ArrowUpRight, MoreVertical } from 'lucide-react';

interface SalesProps {
  customers: Customer[];
  invoices: Invoice[];
  mode: 'customers' | 'invoices';
}

export const Sales: React.FC<SalesProps> = ({ customers, invoices, mode }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">
             {mode === 'customers' ? 'إدارة العملاء' : 'فواتير المبيعات'}
           </h2>
           <p className="text-slate-500 text-sm">
             {mode === 'customers' 
               ? 'قاعدة بيانات العملاء، الأرصدة، وسجلات التواصل.' 
               : 'إصدار ومتابعة فواتير المبيعات والتحصيلات.'}
           </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all">
          <Plus className="w-5 h-5" />
          <span className="font-bold">
            {mode === 'customers' ? 'إضافة عميل جديد' : 'إنشاء فاتورة جديدة'}
          </span>
        </button>
      </div>

      {/* Stats Overview */}
      {mode === 'customers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><UserCheck className="w-6 h-6" /></div>
            <div>
              <p className="text-slate-500 text-xs font-bold">إجمالي العملاء</p>
              <h3 className="text-xl font-bold text-slate-800">{customers.length}</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><UserCheck className="w-6 h-6" /></div>
            <div>
              <p className="text-slate-500 text-xs font-bold">عملاء نشطين</p>
              <h3 className="text-xl font-bold text-slate-800">{customers.filter(c => c.status === 'Active').length}</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600"><ArrowUpRight className="w-6 h-6" /></div>
            <div>
              <p className="text-slate-500 text-xs font-bold">إجمالي المديونية</p>
              <h3 className="text-xl font-bold text-slate-800">${customers.reduce((acc, curr) => acc + curr.balance, 0).toLocaleString()}</h3>
            </div>
          </div>
        </div>
      )}

      {mode === 'invoices' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Receipt className="w-6 h-6" /></div>
            <div>
              <p className="text-slate-500 text-xs font-bold">فواتير اليوم</p>
              <h3 className="text-xl font-bold text-slate-800">12</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><Receipt className="w-6 h-6" /></div>
            <div>
              <p className="text-slate-500 text-xs font-bold">المحصل اليوم</p>
              <h3 className="text-xl font-bold text-slate-800">$4,250</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="bg-rose-50 p-3 rounded-xl text-rose-600"><Receipt className="w-6 h-6" /></div>
            <div>
              <p className="text-slate-500 text-xs font-bold">فواتير مستحقة</p>
              <h3 className="text-xl font-bold text-slate-800">8</h3>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder={mode === 'customers' ? "بحث عن عميل بالاسم أو الهاتف..." : "بحث برقم الفاتورة..."}
                className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        {mode === 'customers' && (
          <div className="overflow-x-auto">
             <table className="w-full text-right text-sm">
               <thead className="bg-slate-50 text-slate-500 font-bold">
                 <tr>
                   <th className="px-6 py-4">العميل</th>
                   <th className="px-6 py-4">معلومات الاتصال</th>
                   <th className="px-6 py-4">العنوان</th>
                   <th className="px-6 py-4">الرصيد</th>
                   <th className="px-6 py-4">الحالة</th>
                   <th className="px-6 py-4"></th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {customers.map(customer => (
                   <tr key={customer.id} className="hover:bg-slate-50 transition-colors group">
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                           {customer.name.charAt(0)}
                         </div>
                         <div>
                           <p className="font-bold text-slate-800">{customer.name}</p>
                           <p className="text-xs text-slate-400 font-mono">#{customer.id}</p>
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <div className="flex flex-col gap-1 text-slate-600">
                         <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {customer.phone}</span>
                         {customer.email && <span className="flex items-center gap-1.5 text-xs"><Mail className="w-3.5 h-3.5 text-slate-400" /> {customer.email}</span>}
                       </div>
                     </td>
                     <td className="px-6 py-4 text-slate-600">
                        {customer.address ? <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {customer.address}</span> : '-'}
                     </td>
                     <td className="px-6 py-4 font-bold">
                       <span className={customer.balance > 0 ? 'text-amber-600' : 'text-slate-800'}>
                         ${customer.balance.toLocaleString()}
                       </span>
                     </td>
                     <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded-full text-xs font-bold ${customer.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500'}`}>
                         {customer.status === 'Active' ? 'نشط' : 'غير نشط'}
                       </span>
                     </td>
                     <td className="px-6 py-4 text-left">
                       <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                         <MoreVertical className="w-4 h-4" />
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}

        {mode === 'invoices' && (
          <div className="p-12 text-center text-slate-400">
             <Receipt className="w-16 h-16 mx-auto mb-4 opacity-20" />
             <p className="text-lg font-medium text-slate-500">سجل الفواتير</p>
             <p className="text-sm">لا توجد فواتير لعرضها حالياً. ابدأ بإنشاء فاتورة جديدة.</p>
          </div>
        )}
      </div>
    </div>
  );
};