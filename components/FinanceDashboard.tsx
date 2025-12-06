




import React, { useState } from 'react';
import { Account, TreasuryAccount, Budget, Voucher, FinancialDocument } from '../types';
import { StatsCard } from './StatsCard';
import { DollarSign, TrendingUp, PieChart, Activity, FileText, ArrowUpRight, ArrowDownLeft, Wallet, Briefcase, Plus, X, Save, Printer, Trash2, Eye, MoreHorizontal, LayoutDashboard, List } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface FinanceDashboardProps {
  accounts: Account[];
  treasuryAccounts: TreasuryAccount[];
  budgets: Budget[];
  financialDocuments: FinancialDocument[];
  onVoucherCreate: (voucher: Voucher) => void;
  onPettyCashSettle: (amount: number, expenses: {accountId: string, amount: number}[]) => void;
  onDeleteDocument: (id: string) => void;
  onNewJournalRequest: () => void;
}

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ 
  accounts, treasuryAccounts, budgets, financialDocuments, onVoucherCreate, onPettyCashSettle, onDeleteDocument, onNewJournalRequest 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'log'>('overview');
  
  // Calculate Totals derived from COA
  const totalAssets = accounts.filter(a => a.type === 'ASSET').reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = accounts.filter(a => a.type === 'LIABILITY').reduce((sum, a) => sum + a.balance, 0);
  const totalRevenue = accounts.filter(a => a.type === 'REVENUE').reduce((sum, a) => sum + a.balance, 0);
  const totalExpenses = accounts.filter(a => a.type === 'EXPENSE').reduce((sum, a) => sum + a.balance, 0);
  const netProfit = totalRevenue - totalExpenses;

  // Modals State
  const [modalType, setModalType] = useState<'NONE' | 'PAYMENT' | 'RECEIPT' | 'PETTY_CASH'>('NONE');
  const [printDocument, setPrintDocument] = useState<FinancialDocument | null>(null);
  
  // Forms State
  const [voucherForm, setVoucherForm] = useState({
     accountId: '',
     targetAccountId: '',
     amount: 0,
     description: '',
     reference: '',
     date: new Date().toISOString().split('T')[0]
  });

  const [pettyCashForm, setPettyCashForm] = useState({
     totalAmount: 0,
     expenses: [{ accountId: '', amount: 0 }]
  });

  // Mock data for charts
  const cashFlowData = [
    { name: 'يناير', income: 4000, expense: 2400 },
    { name: 'فبراير', income: 3000, expense: 1398 },
    { name: 'مارس', income: 2000, expense: 9800 },
    { name: 'أبريل', income: 2780, expense: 3908 },
    { name: 'مايو', income: 1890, expense: 4800 },
    { name: 'يونيو', income: 2390, expense: 3800 },
  ];

  const expenseBreakdown = [
    { name: 'رواتب', value: 45000, color: '#6366f1' },
    { name: 'مرافق', value: 3500, color: '#a855f7' },
    { name: 'تسويق', value: 12000, color: '#ec4899' },
    { name: 'مشتريات', value: 95000, color: '#14b8a6' },
  ];

  // Helper lists
  const assetAccounts = accounts.filter(a => a.type === 'ASSET'); // For Source of Payment / Destination of Receipt
  const expenseAccounts = accounts.filter(a => a.type === 'EXPENSE'); // For Payment Destination
  const revenueAccounts = accounts.filter(a => a.type === 'REVENUE'); // For Receipt Source

  const handleVoucherSubmit = () => {
    if(!voucherForm.accountId || !voucherForm.targetAccountId || voucherForm.amount <= 0) return;
    
    onVoucherCreate({
      id: '', // Generated in App
      type: modalType === 'PAYMENT' ? 'PAYMENT' : 'RECEIPT',
      ...voucherForm
    });
    setModalType('NONE');
    setVoucherForm({ accountId: '', targetAccountId: '', amount: 0, description: '', reference: '', date: new Date().toISOString().split('T')[0] });
  };

  const handlePettyCashSubmit = () => {
     const total = pettyCashForm.expenses.reduce((sum, e) => sum + e.amount, 0);
     if(total <= 0) return;
     onPettyCashSettle(total, pettyCashForm.expenses);
     setModalType('NONE');
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">المركز المالي والعمليات</h2>
           <p className="text-slate-500 text-sm">نظرة شاملة على الأداء المالي، التخطيط، وتسجيل العمليات اليومية.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-left">
              <p className="text-xs text-slate-400 mb-1 font-bold">صافي الربح الحالي</p>
              <h3 className={`text-xl font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                 {netProfit >= 0 ? '+' : ''}${netProfit.toLocaleString()}
              </h3>
           </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-1">
         <button 
           onClick={() => setActiveTab('overview')}
           className={`px-4 py-2 text-sm font-bold flex items-center gap-2 rounded-t-lg transition-colors ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700'}`}
         >
            <LayoutDashboard className="w-4 h-4" />
            لوحة القيادة
         </button>
         <button 
           onClick={() => setActiveTab('log')}
           className={`px-4 py-2 text-sm font-bold flex items-center gap-2 rounded-t-lg transition-colors ${activeTab === 'log' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700'}`}
         >
            <List className="w-4 h-4" />
            سجل العمليات (السندات)
         </button>
      </div>

      {activeTab === 'overview' && (
         <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <button 
                 onClick={() => setModalType('PAYMENT')}
                 className="bg-white hover:bg-rose-50 border-2 border-slate-100 hover:border-rose-200 rounded-2xl p-4 flex flex-col items-center gap-3 transition-all group shadow-sm hover:shadow-md"
               >
                  <div className="p-3 bg-rose-100 text-rose-600 rounded-xl group-hover:scale-110 transition-transform">
                     <ArrowUpRight className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-700">سند صرف جديد</span>
               </button>

               <button 
                 onClick={() => setModalType('RECEIPT')}
                 className="bg-white hover:bg-emerald-50 border-2 border-slate-100 hover:border-emerald-200 rounded-2xl p-4 flex flex-col items-center gap-3 transition-all group shadow-sm hover:shadow-md"
               >
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                     <ArrowDownLeft className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-700">سند قبض جديد</span>
               </button>

               <button 
                 onClick={() => setModalType('PETTY_CASH')}
                 className="bg-white hover:bg-indigo-50 border-2 border-slate-100 hover:border-indigo-200 rounded-2xl p-4 flex flex-col items-center gap-3 transition-all group shadow-sm hover:shadow-md"
               >
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                     <Wallet className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-700">تسوية عهدة</span>
               </button>

               <button 
                 onClick={onNewJournalRequest}
                 className="bg-white hover:bg-slate-50 border-2 border-slate-100 hover:border-slate-300 rounded-2xl p-4 flex flex-col items-center gap-3 transition-all group shadow-sm hover:shadow-md"
               >
                  <div className="p-3 bg-slate-100 text-slate-600 rounded-xl group-hover:scale-110 transition-transform">
                     <FileText className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-700">قيد يومية</span>
               </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatsCard 
                 title="إجمالي الأصول" 
                 value={`$${totalAssets.toLocaleString()}`} 
                 change={12} 
                 icon={DollarSign} 
                 colorClass="bg-emerald-500" 
                 iconBgClass="bg-emerald-50" 
                 iconColorClass="text-emerald-600" 
              />
              <StatsCard 
                 title="إجمالي الالتزامات" 
                 value={`$${totalLiabilities.toLocaleString()}`} 
                 change={-5} 
                 icon={Activity} 
                 colorClass="bg-rose-500" 
                 iconBgClass="bg-rose-50" 
                 iconColorClass="text-rose-600" 
              />
              <StatsCard 
                 title="الإيرادات (YTD)" 
                 value={`$${totalRevenue.toLocaleString()}`} 
                 change={24} 
                 icon={TrendingUp} 
                 colorClass="bg-indigo-500" 
                 iconBgClass="bg-indigo-50" 
                 iconColorClass="text-indigo-600" 
              />
              <StatsCard 
                 title="المصروفات (YTD)" 
                 value={`$${totalExpenses.toLocaleString()}`} 
                 change={8} 
                 icon={PieChart} 
                 colorClass="bg-amber-500" 
                 iconBgClass="bg-amber-50" 
                 iconColorClass="text-amber-600" 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Cash Flow Chart */}
               <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">تحليل التدفق النقدي</h3>
                  <div className="h-80 w-full" dir="ltr">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={cashFlowData}>
                           <defs>
                              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                 <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                                 <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#94a3b8" fontSize={12} />
                           <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" fontSize={12} />
                           <Tooltip 
                              contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                           />
                           <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" name="مقبوضات" />
                           <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" name="مدفوعات" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               {/* Budget Planning & Analysis */}
               <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                     <Briefcase className="w-5 h-5 text-indigo-600" />
                     تخطيط الموازنة (Budgets)
                  </h3>
                  <div className="space-y-6 flex-1">
                     {budgets.map((budget) => {
                        const percentage = Math.min((budget.spent / budget.allocated) * 100, 100);
                        const isOverBudget = budget.spent > budget.allocated;
                        return (
                           <div key={budget.id}>
                              <div className="flex justify-between text-sm mb-1">
                                 <span className="font-bold text-slate-700">{budget.category}</span>
                                 <span className={isOverBudget ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                                    {percentage.toFixed(0)}%
                                 </span>
                              </div>
                              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                 <div 
                                   className={`h-full rounded-full transition-all duration-1000 ${isOverBudget ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                                   style={{ width: `${percentage}%` }}
                                 ></div>
                              </div>
                              <div className="flex justify-between text-xs text-slate-400 mt-1">
                                 <span>أنفق: {budget.spent.toLocaleString()}</span>
                                 <span>المخصص: {budget.allocated.toLocaleString()}</span>
                              </div>
                           </div>
                        );
                     })}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-100">
                     <h4 className="font-bold text-slate-800 mb-4">توزيع المصروفات</h4>
                     <div className="h-40 w-full" dir="ltr">
                       <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={expenseBreakdown}>
                             <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {expenseBreakdown.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                             </Bar>
                             <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                          </BarChart>
                       </ResponsiveContainer>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* OPERATIONS LOG TAB */}
      {activeTab === 'log' && (
         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-right-4 duration-300">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div>
                  <h3 className="font-bold text-slate-800">سجل العمليات المالية</h3>
                  <p className="text-xs text-slate-500 mt-1">جميع سندات القبض والصرف والتسويات المسجلة</p>
               </div>
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full text-right text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                     <tr>
                        <th className="px-6 py-4">رقم المرجع</th>
                        <th className="px-6 py-4">النوع</th>
                        <th className="px-6 py-4">التاريخ</th>
                        <th className="px-6 py-4">البيان</th>
                        <th className="px-6 py-4">المستفيد</th>
                        <th className="px-6 py-4">المبلغ</th>
                        <th className="px-6 py-4 text-left">إجراءات</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {financialDocuments.map(doc => (
                        <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                           <td className="px-6 py-4 font-mono text-slate-600">{doc.reference}</td>
                           <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                                 doc.type === 'PAYMENT_VOUCHER' ? 'bg-rose-50 text-rose-700' : 
                                 doc.type === 'RECEIPT_VOUCHER' ? 'bg-emerald-50 text-emerald-700' : 
                                 'bg-indigo-50 text-indigo-700'
                              }`}>
                                 {doc.type === 'PAYMENT_VOUCHER' ? <ArrowUpRight className="w-3 h-3" /> : 
                                  doc.type === 'RECEIPT_VOUCHER' ? <ArrowDownLeft className="w-3 h-3" /> : 
                                  <Wallet className="w-3 h-3" />}
                                 {doc.type === 'PAYMENT_VOUCHER' ? 'سند صرف' : doc.type === 'RECEIPT_VOUCHER' ? 'سند قبض' : 'تسوية عهدة'}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-slate-600">{doc.date}</td>
                           <td className="px-6 py-4 text-slate-800 max-w-xs truncate">{doc.description}</td>
                           <td className="px-6 py-4 text-slate-600">{doc.beneficiary || '-'}</td>
                           <td className="px-6 py-4 font-bold text-slate-800">${doc.amount.toLocaleString()}</td>
                           <td className="px-6 py-4 text-left">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button onClick={() => setPrintDocument(doc)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="طباعة">
                                    <Printer className="w-4 h-4" />
                                 </button>
                                 <button onClick={() => onDeleteDocument(doc.id)} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="حذف">
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                     {financialDocuments.length === 0 && (
                        <tr>
                           <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                              <FileText className="w-12 h-12 mx-auto mb-2 opacity-20" />
                              <p>لا توجد مستندات مسجلة بعد.</p>
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      )}

      {/* --- MODALS --- */}

      {/* Payment/Receipt Modal */}
      {(modalType === 'PAYMENT' || modalType === 'RECEIPT') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              {modalType === 'PAYMENT' ? <ArrowUpRight className="w-6 h-6 text-rose-600" /> : <ArrowDownLeft className="w-6 h-6 text-emerald-600" />}
              {modalType === 'PAYMENT' ? 'سند صرف جديد' : 'سند قبض جديد'}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">التاريخ</label>
                    <input type="date" value={voucherForm.date} onChange={(e) => setVoucherForm({...voucherForm, date: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">رقم المرجع (اختياري)</label>
                    <input type="text" value={voucherForm.reference} onChange={(e) => setVoucherForm({...voucherForm, reference: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" placeholder="تلقائي" />
                 </div>
              </div>
              
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">المبلغ</label>
                 <input type="number" value={voucherForm.amount} onChange={(e) => setVoucherForm({...voucherForm, amount: Number(e.target.value)})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold text-lg" placeholder="0.00" />
              </div>

              {/* Source/Target Logic */}
              {modalType === 'PAYMENT' ? (
                 <>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">حساب الدفع (من)</label>
                      <select 
                        value={voucherForm.accountId} 
                        onChange={(e) => setVoucherForm({...voucherForm, accountId: e.target.value})}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                      >
                         <option value="">اختر الخزنة أو البنك...</option>
                         {assetAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} (رصيد: {acc.balance})</option>)}
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">حساب المصروف / المستفيد (إلى)</label>
                      <select 
                        value={voucherForm.targetAccountId} 
                        onChange={(e) => setVoucherForm({...voucherForm, targetAccountId: e.target.value})}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                      >
                         <option value="">اختر حساب المصروف...</option>
                         {expenseAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                         <option disabled>--- الالتزامات ---</option>
                         {accounts.filter(a => a.type === 'LIABILITY').map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                      </select>
                   </div>
                 </>
              ) : (
                 <>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">حساب الإيداع (إلى)</label>
                      <select 
                        value={voucherForm.accountId} 
                        onChange={(e) => setVoucherForm({...voucherForm, accountId: e.target.value})}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                      >
                         <option value="">اختر الخزنة أو البنك...</option>
                         {assetAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">حساب الإيراد / المصدر (من)</label>
                      <select 
                        value={voucherForm.targetAccountId} 
                        onChange={(e) => setVoucherForm({...voucherForm, targetAccountId: e.target.value})}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                      >
                         <option value="">اختر حساب الإيراد...</option>
                         {revenueAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                      </select>
                   </div>
                 </>
              )}

              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">البيان / ملاحظات</label>
                 <textarea value={voucherForm.description} onChange={(e) => setVoucherForm({...voucherForm, description: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none h-20 resize-none" placeholder="شرح للعملية..." />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
               <button onClick={() => setModalType('NONE')} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-lg">إلغاء</button>
               <button 
                 onClick={handleVoucherSubmit} 
                 className={`px-6 py-2 text-white font-bold rounded-lg shadow-md transition-colors ${modalType === 'PAYMENT' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
               >
                 تأكيد العملية
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Petty Cash Modal */}
      {modalType === 'PETTY_CASH' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in zoom-in-95 duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 p-6 flex flex-col max-h-[90vh]">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <Wallet className="w-6 h-6 text-indigo-600" />
                 تسوية عهدة مصروفات
              </h3>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                 {pettyCashForm.expenses.map((exp, idx) => (
                    <div key={idx} className="flex gap-2 mb-3 items-end">
                       <div className="flex-1">
                          <label className="block text-xs font-bold text-slate-500 mb-1">حساب المصروف</label>
                          <select 
                             value={exp.accountId}
                             onChange={(e) => {
                                const newExp = [...pettyCashForm.expenses];
                                newExp[idx].accountId = e.target.value;
                                setPettyCashForm({...pettyCashForm, expenses: newExp});
                             }}
                             className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                          >
                             <option value="">اختر...</option>
                             {expenseAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                          </select>
                       </div>
                       <div className="w-24">
                          <label className="block text-xs font-bold text-slate-500 mb-1">القيمة</label>
                          <input 
                             type="number" 
                             value={exp.amount}
                             onChange={(e) => {
                                const newExp = [...pettyCashForm.expenses];
                                newExp[idx].amount = Number(e.target.value);
                                setPettyCashForm({...pettyCashForm, expenses: newExp});
                             }}
                             className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                          />
                       </div>
                    </div>
                 ))}
                 <button 
                   onClick={() => setPettyCashForm({...pettyCashForm, expenses: [...pettyCashForm.expenses, {accountId: '', amount: 0}]})}
                   className="text-sm text-indigo-600 font-bold hover:underline mt-2"
                 >
                    + إضافة بند مصروف آخر
                 </button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                 <div>
                    <p className="text-sm text-slate-500">الإجمالي</p>
                    <p className="text-xl font-bold text-slate-800">${pettyCashForm.expenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}</p>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => setModalType('NONE')} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-lg">إلغاء</button>
                    <button onClick={handlePettyCashSubmit} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md">تسوية العهدة</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* PRINT PREVIEW MODAL */}
      {printDocument && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in zoom-in-95 duration-200">
            <div className="bg-white w-full max-w-2xl min-h-[500px] flex flex-col shadow-2xl">
               {/* Print Actions Header */}
               <div className="bg-slate-800 text-white p-3 flex justify-between items-center no-print">
                  <h3 className="font-bold flex items-center gap-2"><Printer className="w-4 h-4"/> معاينة الطباعة</h3>
                  <div className="flex gap-2">
                     <button onClick={() => window.print()} className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 rounded text-sm font-bold transition-colors">طباعة</button>
                     <button onClick={() => setPrintDocument(null)} className="px-3 py-1 bg-slate-600 hover:bg-slate-700 rounded text-sm font-bold transition-colors">إغلاق</button>
                  </div>
               </div>

               {/* Printable Content */}
               <div className="p-8 flex-1 flex flex-col justify-between print:p-0" id="printable-area">
                  <div>
                     {/* Header */}
                     <div className="flex justify-between items-center border-b-2 border-slate-800 pb-4 mb-8">
                        <div>
                           <h1 className="text-2xl font-bold text-slate-900 mb-1">شركة النخبة للتجارة</h1>
                           <p className="text-sm text-slate-500">الرياض، طريق الملك فهد</p>
                           <p className="text-sm text-slate-500">هاتف: 0501234567</p>
                        </div>
                        <div className="text-left">
                           <div className="inline-block bg-slate-100 border border-slate-300 px-4 py-2 rounded-lg">
                              <h2 className="text-xl font-bold text-slate-800">
                                 {printDocument.type === 'PAYMENT_VOUCHER' ? 'سند صرف نقدية' : 
                                  printDocument.type === 'RECEIPT_VOUCHER' ? 'سند قبض نقدية' : 'إذن تسوية'}
                              </h2>
                           </div>
                        </div>
                     </div>

                     {/* Details */}
                     <div className="grid grid-cols-2 gap-8 mb-8">
                        <div className="space-y-3">
                           <div className="flex">
                              <span className="w-24 font-bold text-slate-600">رقم السند:</span>
                              <span className="font-mono font-bold text-slate-900">{printDocument.reference}</span>
                           </div>
                           <div className="flex">
                              <span className="w-24 font-bold text-slate-600">التاريخ:</span>
                              <span className="font-mono text-slate-900">{printDocument.date}</span>
                           </div>
                           <div className="flex">
                              <span className="w-24 font-bold text-slate-600">المبلغ:</span>
                              <span className="font-bold text-slate-900 text-lg bg-slate-50 px-2 rounded border border-slate-200">
                                 ${printDocument.amount.toLocaleString()}
                              </span>
                           </div>
                        </div>
                        <div className="space-y-3">
                           {printDocument.beneficiary && (
                              <div className="flex">
                                 <span className="w-24 font-bold text-slate-600">
                                    {printDocument.type === 'PAYMENT_VOUCHER' ? 'يصرف للسيد:' : 'استلمنا من:'}
                                 </span>
                                 <span className="font-bold text-slate-900 border-b border-slate-300 flex-1">{printDocument.beneficiary}</span>
                              </div>
                           )}
                           <div className="flex">
                              <span className="w-24 font-bold text-slate-600">وذلك عن:</span>
                              <span className="text-slate-900 border-b border-slate-300 flex-1 pb-1">{printDocument.description}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Footer / Signatures */}
                  <div className="mt-12 pt-8 border-t border-slate-200">
                     <div className="grid grid-cols-3 gap-8 text-center">
                        <div>
                           <p className="font-bold text-slate-600 mb-8">إعداد / المحاسب</p>
                           <div className="border-t border-slate-400 w-3/4 mx-auto"></div>
                        </div>
                        <div>
                           <p className="font-bold text-slate-600 mb-8">المدير المالي</p>
                           <div className="border-t border-slate-400 w-3/4 mx-auto"></div>
                        </div>
                        <div>
                           <p className="font-bold text-slate-600 mb-8">
                              {printDocument.type === 'PAYMENT_VOUCHER' ? 'توقيع المستلم' : 'أمين الصندوق'}
                           </p>
                           <div className="border-t border-slate-400 w-3/4 mx-auto"></div>
                        </div>
                     </div>
                     <div className="mt-8 text-center text-xs text-slate-400">
                        تم استخراج هذا المستند إلكترونياً من نظام ERP PRO بتاريخ {new Date().toLocaleDateString()}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};