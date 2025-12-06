
import React, { useState } from 'react';
import { Supplier, SupplierTransaction } from '../types';
import { Search, Plus, Truck, Phone, Star, Package, FileText, ArrowDownLeft, MoreVertical, MapPin, Mail, Shield, ArrowUpRight, ArrowRightLeft, Printer, Filter, X, Edit, Trash2, CheckCircle2 } from 'lucide-react';

interface SuppliersProps {
  suppliers: Supplier[];
  transactions: SupplierTransaction[];
  onAddSupplier: (supplier: Supplier) => void;
  onUpdateSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (id: string) => void;
}

export const Suppliers: React.FC<SuppliersProps> = ({ 
  suppliers, transactions, onAddSupplier, onUpdateSupplier, onDeleteSupplier 
}) => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Supplier>>({
     name: '', contactPerson: '', phone: '', email: '', address: '', balance: 0, rating: 5, status: 'Active', taxNumber: ''
  });

  // Derived Data
  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId);
  const supplierTransactions = transactions.filter(t => t.supplierId === selectedSupplierId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const totalDebt = suppliers.reduce((sum, s) => sum + s.balance, 0);
  const activeCount = suppliers.filter(s => s.status === 'Active').length;

  // Handlers
  const handleOpenModal = (supplier?: Supplier) => {
     if (supplier) {
        setFormData(supplier);
        setIsEditMode(true);
     } else {
        setFormData({ name: '', contactPerson: '', phone: '', email: '', address: '', balance: 0, rating: 5, status: 'Active', taxNumber: '' });
        setIsEditMode(false);
     }
     setIsModalOpen(true);
  };

  const handleSave = () => {
     if (!formData.name) return;
     if (isEditMode && formData.id) {
        onUpdateSupplier(formData as Supplier);
     } else {
        const newSupplier = { ...formData, id: `S-${Math.floor(Math.random() * 10000)}` } as Supplier;
        onAddSupplier(newSupplier);
     }
     setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
     if(confirm('هل أنت متأكد من حذف هذا المورد؟')) {
        onDeleteSupplier(id);
        if(selectedSupplierId === id) setView('list');
     }
  };

  const toggleStatus = (supplier: Supplier) => {
     onUpdateSupplier({
        ...supplier,
        status: supplier.status === 'Active' ? 'Blocked' : 'Active'
     });
  };

  const renderList = () => (
     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
           <div className="relative w-full md:w-96">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                 type="text" 
                 placeholder="بحث باسم المورد، الشركة، أو الهاتف..." 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
           </div>
           <div className="flex gap-2">
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600"><Filter className="w-4 h-4" /></button>
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600"><Printer className="w-4 h-4" /></button>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                 <tr>
                    <th className="px-6 py-4">اسم المورد / الشركة</th>
                    <th className="px-6 py-4">جهة الاتصال</th>
                    <th className="px-6 py-4">المستحقات</th>
                    <th className="px-6 py-4">التقييم</th>
                    <th className="px-6 py-4">الحالة</th>
                    <th className="px-6 py-4 text-center">إجراءات</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {suppliers.filter(s => s.name.includes(searchTerm) || s.phone.includes(searchTerm)).map(supplier => (
                    <tr 
                       key={supplier.id} 
                       className="hover:bg-slate-50 transition-colors group cursor-pointer"
                       onClick={() => { setSelectedSupplierId(supplier.id); setView('detail'); }}
                    >
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                                <Truck className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{supplier.name}</p>
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
                       <td className="px-6 py-4 font-bold">
                          <span className={supplier.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                             ${supplier.balance.toLocaleString()}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-slate-600">
                          <div className="flex text-amber-400 gap-0.5">
                             {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < supplier.rating ? 'fill-current' : 'text-slate-200'}`} />
                             ))}
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${supplier.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700'}`}>
                             {supplier.status === 'Active' ? 'نشط' : 'محظور'}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-center" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => handleOpenModal(supplier)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit className="w-4 h-4"/></button>
                             <button onClick={() => handleDelete(supplier.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
     </div>
  );

  const renderDetail = () => {
     if(!selectedSupplier) return null;

     return (
        <div className="animate-in slide-in-from-right-8 duration-300">
           <button onClick={() => setView('list')} className="mb-4 text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 rotate-180" /> العودة للقائمة
           </button>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit">
                 <div className="text-center mb-6">
                    <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-bold bg-indigo-50 text-indigo-600 mb-4 border-4 border-white shadow-lg">
                       <Truck className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedSupplier.name}</h2>
                    <p className="text-slate-500 font-mono text-sm">#{selectedSupplier.id}</p>
                    <div className="mt-4 flex justify-center gap-2">
                       <button onClick={() => handleOpenModal(selectedSupplier)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors">تعديل الملف</button>
                       <button onClick={() => toggleStatus(selectedSupplier)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${selectedSupplier.status === 'Active' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                          {selectedSupplier.status === 'Active' ? 'حظر المورد' : 'تنشيط المورد'}
                       </button>
                    </div>
                 </div>

                 <div className="space-y-4 border-t border-slate-100 pt-6">
                    <div className="flex items-center gap-3 text-slate-600">
                       <Phone className="w-5 h-5 text-slate-400" />
                       <span className="text-sm font-medium">{selectedSupplier.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                       <Mail className="w-5 h-5 text-slate-400" />
                       <span className="text-sm font-medium">{selectedSupplier.email || 'لا يوجد بريد إلكتروني'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                       <MapPin className="w-5 h-5 text-slate-400" />
                       <span className="text-sm font-medium">{selectedSupplier.address || 'العنوان غير مسجل'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                       <Shield className="w-5 h-5 text-slate-400" />
                       <span className="text-sm font-medium">الرقم الضريبي: {selectedSupplier.taxNumber || '-'}</span>
                    </div>
                 </div>

                 <div className="mt-8 bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">رصيد المورد (مستحقات)</p>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-sm text-slate-600">الرصيد الحالي</span>
                       <span className={`text-lg font-bold ${selectedSupplier.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>${selectedSupplier.balance.toLocaleString()}</span>
                    </div>
                 </div>
              </div>

              {/* Ledger Tab */}
              <div className="lg:col-span-2">
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                       <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-indigo-600" />
                          كشف الحساب (Ledger)
                       </h3>
                       <button className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1">
                          <Printer className="w-3 h-3" /> طباعة الكشف
                       </button>
                    </div>
                    <div className="overflow-x-auto">
                       <table className="w-full text-right text-sm">
                          <thead className="bg-slate-50 text-slate-500">
                             <tr>
                                <th className="px-4 py-3">التاريخ</th>
                                <th className="px-4 py-3">المرجع</th>
                                <th className="px-4 py-3">البيان</th>
                                <th className="px-4 py-3">مدين (سداد)</th>
                                <th className="px-4 py-3">دائن (فواتير)</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {supplierTransactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                   <td className="px-4 py-3 font-mono text-slate-600">{tx.date}</td>
                                   <td className="px-4 py-3 text-xs font-bold text-slate-500">{tx.reference}</td>
                                   <td className="px-4 py-3 text-slate-800">{tx.description}</td>
                                   <td className="px-4 py-3 font-bold text-emerald-600">{tx.type === 'PAYMENT' ? Math.abs(tx.amount).toLocaleString() : '-'}</td>
                                   <td className="px-4 py-3 font-bold text-rose-600">{tx.type === 'INVOICE' ? tx.amount.toLocaleString() : '-'}</td>
                                </tr>
                             ))}
                             {supplierTransactions.length === 0 && (
                                <tr><td colSpan={5} className="text-center py-8 text-slate-400">لا توجد حركات مالية مسجلة.</td></tr>
                             )}
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>
           </div>
        </div>
     );
  };

  return (
     <div className="space-y-6">
        {view === 'list' && (
           <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800">إدارة الموردين (SRM)</h2>
                    <p className="text-slate-500 text-sm">قاعدة بيانات الموردين، متابعة المستحقات، وتقييم الأداء.</p>
                 </div>
                 <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-slate-500/30 transition-all">
                    <Plus className="w-5 h-5" />
                    <span className="font-bold">مورد جديد</span>
                 </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><Truck className="w-6 h-6" /></div>
                    <div>
                       <p className="text-slate-500 text-xs font-bold">عدد الموردين</p>
                       <h3 className="text-xl font-bold text-slate-800">{suppliers.length}</h3>
                    </div>
                 </div>
                 <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><CheckCircle2 className="w-6 h-6" /></div>
                    <div>
                       <p className="text-slate-500 text-xs font-bold">موردين نشطين</p>
                       <h3 className="text-xl font-bold text-slate-800">{activeCount}</h3>
                    </div>
                 </div>
                 <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="bg-rose-50 p-3 rounded-xl text-rose-600"><ArrowDownLeft className="w-6 h-6" /></div>
                    <div>
                       <p className="text-slate-500 text-xs font-bold">إجمالي المستحقات</p>
                       <h3 className="text-xl font-bold text-slate-800">${totalDebt.toLocaleString()}</h3>
                    </div>
                 </div>
              </div>
           </>
        )}

        {view === 'list' ? renderList() : renderDetail()}

        {/* Add/Edit Modal */}
        {isModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in zoom-in-95 duration-200">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-slate-200">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                       <Truck className="w-6 h-6 text-indigo-600" />
                       {isEditMode ? 'تعديل بيانات المورد' : 'إضافة مورد جديد'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-red-500" /></button>
                 </div>
                 
                 <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar p-1">
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">اسم المورد / الشركة <span className="text-red-500">*</span></label>
                       <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">الشخص المسؤول</label>
                       <input type="text" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">رقم الهاتف <span className="text-red-500">*</span></label>
                          <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
                          <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                       </div>
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">العنوان</label>
                       <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">الرقم الضريبي</label>
                          <input type="text" value={formData.taxNumber} onChange={e => setFormData({...formData, taxNumber: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">الرصيد الافتتاحي</label>
                          <input type="number" value={formData.balance} onChange={e => setFormData({...formData, balance: Number(e.target.value)})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" disabled={isEditMode} />
                       </div>
                    </div>
                 </div>

                 <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-lg">إلغاء</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md">حفظ البيانات</button>
                 </div>
              </div>
           </div>
        )}
     </div>
  );
};
