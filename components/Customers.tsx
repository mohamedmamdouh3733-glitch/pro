
import React, { useState } from 'react';
import { Customer, CustomerTransaction, CustomerInteraction } from '../types';
import { Search, Plus, User, Users, Phone, MapPin, Mail, MoreVertical, FileText, PhoneCall, Calendar, Clock, ArrowUpRight, ArrowDownLeft, Wallet, Star, Shield, Filter, Printer, X, Save, Edit, Trash2, CheckCircle2 } from 'lucide-react';

interface CustomersProps {
  customers: Customer[];
  transactions: CustomerTransaction[];
  interactions: CustomerInteraction[];
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
}

export const Customers: React.FC<CustomersProps> = ({ 
  customers, transactions, interactions, onAddCustomer, onUpdateCustomer, onDeleteCustomer 
}) => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Customer>>({
     name: '', phone: '', email: '', address: '', creditLimit: 0, taxNumber: '', status: 'Active', category: 'Regular'
  });

  // Derived Data
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const customerTransactions = transactions.filter(t => t.customerId === selectedCustomerId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const customerInteractions = interactions.filter(i => i.customerId === selectedCustomerId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // KPIs
  const totalDebt = customers.reduce((sum, c) => sum + c.balance, 0);
  const vipCount = customers.filter(c => c.category === 'VIP').length;
  const activeCount = customers.filter(c => c.status === 'Active').length;

  // Handlers
  const handleOpenModal = (customer?: Customer) => {
     if (customer) {
        setFormData(customer);
        setIsEditMode(true);
     } else {
        setFormData({ name: '', phone: '', email: '', address: '', creditLimit: 0, taxNumber: '', status: 'Active', category: 'Regular', balance: 0 });
        setIsEditMode(false);
     }
     setIsModalOpen(true);
  };

  const handleSave = () => {
     if (!formData.name || !formData.phone) return;
     
     if (isEditMode && formData.id) {
        onUpdateCustomer(formData as Customer);
     } else {
        const newCustomer = {
           ...formData,
           id: `C-${Math.floor(Math.random() * 10000)}`,
           balance: 0
        } as Customer;
        onAddCustomer(newCustomer);
     }
     setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
     if(confirm('هل أنت متأكد من حذف هذا العميل؟')) {
        onDeleteCustomer(id);
        if (selectedCustomerId === id) setView('list');
     }
  };

  // --- RENDER HELPERS ---

  const renderDashboard = () => (
     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-fade-in">
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-3 bg-white/10 rounded-bl-2xl"><User className="w-6 h-6" /></div>
           <p className="text-blue-100 text-sm font-medium mb-1">إجمالي العملاء</p>
           <h3 className="text-3xl font-bold">{customers.length}</h3>
        </div>
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg shadow-rose-500/20 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-3 bg-white/10 rounded-bl-2xl"><Wallet className="w-6 h-6" /></div>
           <p className="text-rose-100 text-sm font-medium mb-1">إجمالي المديونيات</p>
           <h3 className="text-3xl font-bold">${totalDebt.toLocaleString()}</h3>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg shadow-amber-500/20 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-3 bg-white/10 rounded-bl-2xl"><Star className="w-6 h-6" /></div>
           <p className="text-amber-100 text-sm font-medium mb-1">عملاء VIP</p>
           <h3 className="text-3xl font-bold">{vipCount}</h3>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-3 bg-white/10 rounded-bl-2xl"><CheckCircle2 className="w-6 h-6" /></div>
           <p className="text-emerald-100 text-sm font-medium mb-1">عملاء نشطين</p>
           <h3 className="text-3xl font-bold">{activeCount}</h3>
        </div>
     </div>
  );

  const renderList = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
       <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full md:w-96">
             <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
             <input 
               type="text" 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="بحث بالاسم، رقم الهاتف، أو الرقم الضريبي..." 
               className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
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
                   <th className="px-6 py-4">اسم العميل</th>
                   <th className="px-6 py-4">معلومات الاتصال</th>
                   <th className="px-6 py-4">التصنيف</th>
                   <th className="px-6 py-4">الرصيد</th>
                   <th className="px-6 py-4">الحالة</th>
                   <th className="px-6 py-4 text-center">إجراءات</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {customers.filter(c => c.name.includes(searchTerm) || c.phone.includes(searchTerm)).map(customer => (
                   <tr key={customer.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => { setSelectedCustomerId(customer.id); setView('detail'); }}>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                               customer.category === 'VIP' ? 'bg-amber-500' : 'bg-indigo-500'
                            }`}>
                               {customer.name.charAt(0)}
                            </div>
                            <div>
                               <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{customer.name}</p>
                               <p className="text-xs text-slate-400 font-mono">#{customer.id}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                         <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400"/> {customer.phone}</span>
                            {customer.email && <span className="flex items-center gap-1.5 text-xs"><Mail className="w-3 h-3 text-slate-400"/> {customer.email}</span>}
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         {customer.category === 'VIP' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                               <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> VIP
                            </span>
                         ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                               <User className="w-3 h-3" /> عادي
                            </span>
                         )}
                      </td>
                      <td className="px-6 py-4 font-bold">
                         <span className={customer.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                            ${customer.balance.toLocaleString()}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            customer.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                         }`}>
                            {customer.status === 'Active' ? 'نشط' : 'غير نشط'}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                         <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenModal(customer)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit className="w-4 h-4"/></button>
                            <button onClick={() => handleDelete(customer.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
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
     if(!selectedCustomer) return null;
     
     return (
        <div className="animate-in slide-in-from-right-8 duration-300">
           <button onClick={() => setView('list')} className="mb-4 text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 rotate-180" /> العودة للقائمة
           </button>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit">
                 <div className="text-center mb-6">
                    <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 border-4 border-white shadow-lg ${
                       selectedCustomer.category === 'VIP' ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}>
                       {selectedCustomer.name.charAt(0)}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedCustomer.name}</h2>
                    <p className="text-slate-500 font-mono text-sm">#{selectedCustomer.id}</p>
                    <div className="mt-4 flex justify-center gap-2">
                       <button onClick={() => handleOpenModal(selectedCustomer)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors">تعديل الملف</button>
                       <button className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"><Phone className="w-4 h-4" /> اتصال</button>
                    </div>
                 </div>

                 <div className="space-y-4 border-t border-slate-100 pt-6">
                    <div className="flex items-center gap-3 text-slate-600">
                       <Phone className="w-5 h-5 text-slate-400" />
                       <span className="text-sm font-medium">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                       <Mail className="w-5 h-5 text-slate-400" />
                       <span className="text-sm font-medium">{selectedCustomer.email || 'لا يوجد بريد إلكتروني'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                       <MapPin className="w-5 h-5 text-slate-400" />
                       <span className="text-sm font-medium">{selectedCustomer.address || 'العنوان غير مسجل'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                       <Shield className="w-5 h-5 text-slate-400" />
                       <span className="text-sm font-medium">الرقم الضريبي: {selectedCustomer.taxNumber || '-'}</span>
                    </div>
                 </div>

                 <div className="mt-8 bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">الملخص المالي</p>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-sm text-slate-600">الرصيد الحالي</span>
                       <span className={`text-lg font-bold ${selectedCustomer.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>${selectedCustomer.balance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-sm text-slate-600">الحد الائتماني</span>
                       <span className="text-sm font-bold text-slate-800">${selectedCustomer.creditLimit?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                       <div 
                         className={`h-full ${selectedCustomer.balance > (selectedCustomer.creditLimit || 0) ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                         style={{ width: `${Math.min(((selectedCustomer.balance / (selectedCustomer.creditLimit || 1)) * 100), 100)}%` }}
                       ></div>
                    </div>
                 </div>
              </div>

              {/* Main Info Tabs */}
              <div className="lg:col-span-2 space-y-6">
                 {/* Interactions Card */}
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                       <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <PhoneCall className="w-5 h-5 text-indigo-600" />
                          سجل المتابعة والتواصل
                       </h3>
                       <button className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold hover:bg-indigo-100">إضافة ملاحظة</button>
                    </div>
                    <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar">
                       {customerInteractions.map(interaction => (
                          <div key={interaction.id} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                interaction.type === 'CALL' ? 'bg-blue-100 text-blue-600' :
                                interaction.type === 'MEETING' ? 'bg-purple-100 text-purple-600' :
                                'bg-slate-100 text-slate-600'
                             }`}>
                                {interaction.type === 'CALL' ? <Phone className="w-5 h-5" /> : 
                                 interaction.type === 'MEETING' ? <Users className="w-5 h-5" /> : 
                                 <FileText className="w-5 h-5" />}
                             </div>
                             <div className="flex-1">
                                <div className="flex justify-between items-start">
                                   <p className="font-bold text-slate-800 text-sm">{interaction.summary}</p>
                                   <span className="text-xs text-slate-400">{interaction.date}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{interaction.outcome}</p>
                             </div>
                          </div>
                       ))}
                       {customerInteractions.length === 0 && <p className="text-center text-slate-400 text-sm py-4">لا توجد سجلات تواصل سابقة.</p>}
                    </div>
                 </div>

                 {/* Ledger / Transactions Card */}
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
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
                                <th className="px-4 py-3">مدين (فواتير)</th>
                                <th className="px-4 py-3">دائن (سداد)</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {customerTransactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                   <td className="px-4 py-3 font-mono text-slate-600">{tx.date}</td>
                                   <td className="px-4 py-3 text-xs font-bold text-slate-500">{tx.reference}</td>
                                   <td className="px-4 py-3 text-slate-800">{tx.description}</td>
                                   <td className="px-4 py-3 font-bold text-rose-600">{tx.type === 'INVOICE' ? tx.amount.toLocaleString() : '-'}</td>
                                   <td className="px-4 py-3 font-bold text-emerald-600">{tx.type === 'PAYMENT' ? Math.abs(tx.amount).toLocaleString() : '-'}</td>
                                </tr>
                             ))}
                             {customerTransactions.length === 0 && (
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
       {/* Header */}
       {view === 'list' && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
                <h2 className="text-2xl font-bold text-slate-800">إدارة العملاء (CRM)</h2>
                <p className="text-slate-500 text-sm">قاعدة بيانات العملاء، متابعة المديونيات، وسجل التواصل.</p>
             </div>
             <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5">
                <Plus className="w-5 h-5" />
                <span className="font-bold">عميل جديد</span>
             </button>
          </div>
       )}

       {view === 'list' && renderDashboard()}
       {view === 'list' ? renderList() : renderDetail()}

       {/* Add/Edit Modal */}
       {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in zoom-in-95 duration-200">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <User className="w-6 h-6 text-indigo-600" />
                      {isEditMode ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}
                   </h3>
                   <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-red-500" /></button>
                </div>
                
                <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar p-1">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">اسم العميل <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="الاسم التجاري أو الشخصي" />
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
                         <label className="block text-sm font-bold text-slate-700 mb-2">الحد الائتماني</label>
                         <input type="number" value={formData.creditLimit} onChange={e => setFormData({...formData, creditLimit: Number(e.target.value)})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">التصنيف</label>
                         <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none">
                            <option value="Regular">عادي (Regular)</option>
                            <option value="VIP">مميز (VIP)</option>
                            <option value="New">جديد (New)</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">الحالة</label>
                         <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none">
                            <option value="Active">نشط</option>
                            <option value="Inactive">غير نشط</option>
                         </select>
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
