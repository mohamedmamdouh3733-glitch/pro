
import React, { useState } from 'react';
import { Supplier, PurchaseOrder } from '../types';
import { Search, Plus, Truck, Phone, Star, Package, FileText, ArrowDownLeft, MoreVertical, ShoppingCart } from 'lucide-react';

interface PurchasingProps {
  suppliers: Supplier[];
  orders: PurchaseOrder[];
  mode: 'suppliers' | 'orders';
}

export const Purchasing: React.FC<PurchasingProps> = ({ suppliers, orders, mode }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">
              {mode === 'suppliers' ? 'إدارة الموردين' : 'أوامر الشراء'}
           </h2>
           <p className="text-slate-500 text-sm">
              {mode === 'suppliers' 
                 ? 'قاعدة بيانات الموردين وتقييمات الأداء.' 
                 : 'متابعة طلبات الشراء الواردة وحالتها.'}
           </p>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-slate-500/30 transition-all">
          <Plus className="w-5 h-5" />
          <span className="font-bold">
            {mode === 'suppliers' ? 'إضافة مورد جديد' : 'أمر شراء جديد'}
          </span>
        </button>
      </div>

      {/* Stats Overview */}
      {mode === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
             <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><Truck className="w-6 h-6" /></div>
             <div>
               <p className="text-slate-500 text-xs font-bold">عدد الموردين</p>
               <h3 className="text-xl font-bold text-slate-800">{suppliers.length}</h3>
             </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
             <div className="bg-purple-50 p-3 rounded-xl text-purple-600"><Star className="w-6 h-6" /></div>
             <div>
               <p className="text-slate-500 text-xs font-bold">الموردين المميزين</p>
               <h3 className="text-xl font-bold text-slate-800">{suppliers.filter(s => s.rating >= 4.5).length}</h3>
             </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
             <div className="bg-rose-50 p-3 rounded-xl text-rose-600"><ArrowDownLeft className="w-6 h-6" /></div>
             <div>
               <p className="text-slate-500 text-xs font-bold">مستحقات الموردين</p>
               <h3 className="text-xl font-bold text-slate-800">${suppliers.reduce((acc, curr) => acc + curr.balance, 0).toLocaleString()}</h3>
             </div>
          </div>
        </div>
      )}

      {mode === 'orders' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
             <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><ShoppingCart className="w-6 h-6" /></div>
             <div>
               <p className="text-slate-500 text-xs font-bold">طلبات جديدة</p>
               <h3 className="text-xl font-bold text-slate-800">3</h3>
             </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
             <div className="bg-amber-50 p-3 rounded-xl text-amber-600"><Package className="w-6 h-6" /></div>
             <div>
               <p className="text-slate-500 text-xs font-bold">قيد الشحن</p>
               <h3 className="text-xl font-bold text-slate-800">2</h3>
             </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
             <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><FileText className="w-6 h-6" /></div>
             <div>
               <p className="text-slate-500 text-xs font-bold">مكتملة هذا الشهر</p>
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
                placeholder={mode === 'suppliers' ? "بحث اسم المورد أو الشركة..." : "بحث برقم أمر الشراء..."}
                className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        {mode === 'suppliers' && (
          <div className="overflow-x-auto">
             <table className="w-full text-right text-sm">
               <thead className="bg-slate-50 text-slate-500 font-bold">
                 <tr>
                   <th className="px-6 py-4">الشركة / المورد</th>
                   <th className="px-6 py-4">جهة الاتصال</th>
                   <th className="px-6 py-4">التقييم</th>
                   <th className="px-6 py-4">المستحقات</th>
                   <th className="px-6 py-4">الحالة</th>
                   <th className="px-6 py-4"></th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {suppliers.map(supplier => (
                   <tr key={supplier.id} className="hover:bg-slate-50 transition-colors group">
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                           <Truck className="w-5 h-5" />
                         </div>
                         <div>
                           <p className="font-bold text-slate-800">{supplier.name}</p>
                           <p className="text-xs text-slate-400 font-mono">#{supplier.id}</p>
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <div className="flex flex-col gap-1 text-slate-600">
                         <span className="font-bold">{supplier.contactPerson}</span>
                         <span className="flex items-center gap-1.5 text-xs"><Phone className="w-3 h-3 text-slate-400" /> {supplier.phone}</span>
                       </div>
                     </td>
                     <td className="px-6 py-4 text-slate-600">
                        <div className="flex text-amber-400 gap-0.5">
                           {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < supplier.rating ? 'fill-current' : 'text-slate-200'}`} />
                           ))}
                        </div>
                     </td>
                     <td className="px-6 py-4 font-bold">
                       <span className={supplier.balance > 0 ? 'text-rose-600' : 'text-slate-800'}>
                         ${supplier.balance.toLocaleString()}
                       </span>
                     </td>
                     <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded-full text-xs font-bold ${supplier.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700'}`}>
                         {supplier.status === 'Active' ? 'نشط' : 'محظور'}
                       </span>
                     </td>
                     <td className="px-6 py-4 text-left">
                       <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                         <MoreVertical className="w-4 h-4" />
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}

        {mode === 'orders' && (
          <div className="p-12 text-center text-slate-400">
             <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
             <p className="text-lg font-medium text-slate-500">سجل أوامر الشراء</p>
             <p className="text-sm">لا توجد أوامر شراء نشطة حالياً.</p>
          </div>
        )}
      </div>
    </div>
  );
};