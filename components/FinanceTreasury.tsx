import React, { useState } from 'react';
import { TreasuryAccount, TreasuryTransaction } from '../types';
import { Landmark, Wallet, ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Search, Plus, Filter, CreditCard, DollarSign, MoreVertical, Trash2, Pencil, Printer, FileText, CheckCircle2, X } from 'lucide-react';

interface FinanceTreasuryProps {
  accounts: TreasuryAccount[];
  transactions: TreasuryTransaction[];
  onAddAccount: (account: TreasuryAccount) => void;
  onUpdateAccount: (account: TreasuryAccount) => void;
  onDeleteAccount: (id: string) => void;
  onTransaction: (payload: { type: 'INCOME'|'EXPENSE'|'TRANSFER', amount: number, accountId: string, targetAccountId?: string, description: string, category: string }) => void;
}

export const FinanceTreasury: React.FC<FinanceTreasuryProps> = ({ 
   accounts, transactions, onAddAccount, onUpdateAccount, onDeleteAccount, onTransaction 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');
  
  // Modals
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  
  // Forms
  const [accountForm, setAccountForm] = useState<Partial<TreasuryAccount>>({ name: '', type: 'CASH', currency: 'SAR', balance: 0 });
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [txForm, setTxForm] = useState({
     type: 'INCOME' as 'INCOME' | 'EXPENSE' | 'TRANSFER',
     amount: 0,
     accountId: '',
     targetAccountId: '',
     description: '',
     category: 'General'
  });

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Handlers
  const openAddAccount = () => {
     setAccountForm({ name: '', type: 'CASH', currency: 'SAR', balance: 0 });
     setIsEditMode(false);
     setIsAccountModalOpen(true);
  };

  const openEditAccount = (acc: TreasuryAccount) => {
     setAccountForm(acc);
     setIsEditMode(true);
     setIsAccountModalOpen(true);
  };

  const handleSaveAccount = () => {
     if(!accountForm.name) return;
     
     if(isEditMode && accountForm.id) {
        onUpdateAccount(accountForm as TreasuryAccount);
     } else {
        const newAcc: TreasuryAccount = {
           id: `TR-${Math.floor(Math.random() * 10000)}`,
           name: accountForm.name,
           type: accountForm.type as 'CASH' | 'BANK',
           balance: Number(accountForm.balance) || 0,
           currency: accountForm.currency || 'SAR',
           accountNumber: accountForm.accountNumber
        };
        onAddAccount(newAcc);
     }
     setIsAccountModalOpen(false);
  };

  const handleSaveTx = () => {
     if(txForm.amount <= 0 || !txForm.accountId) {
        alert("الرجاء إدخال المبلغ وتحديد الحساب.");
        return;
     }
     if(txForm.type === 'TRANSFER' && !txForm.targetAccountId) {
        alert("الرجاء تحديد الحساب المحول إليه.");
        return;
     }

     onTransaction(txForm);
     setIsTxModalOpen(false);
     // Reset
     setTxForm({ ...txForm, amount: 0, description: '' });
  };

  const openTxModal = (type: 'INCOME' | 'EXPENSE' | 'TRANSFER') => {
     setTxForm({ ...txForm, type: type, amount: 0, description: '' });
     setIsTxModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">الخزنة والبنوك</h2>
           <p className="text-slate-500 text-sm">إدارة النقدية، الحسابات البنكية، وتسجيل المقبوضات والمدفوعات.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => openTxModal('TRANSFER')} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all">
              <ArrowRightLeft className="w-4 h-4" />
              تحويل
           </button>
           <button onClick={openAddAccount} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all">
             <Plus className="w-5 h-5" />
             <span className="font-bold">حساب جديد</span>
           </button>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Total Balance Card */}
         <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between min-h-[160px]">
            <div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/10 rounded-lg"><Wallet className="w-6 h-6" /></div>
                  <span className="font-bold text-slate-200">إجمالي السيولة</span>
               </div>
               <h3 className="text-3xl font-bold mb-1" dir="ltr">${totalBalance.toLocaleString()}</h3>
               <p className="text-slate-400 text-sm">متاح في جميع الحسابات</p>
            </div>
            <div className="flex gap-2 mt-4">
               <button onClick={() => openTxModal('INCOME')} className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 py-2 rounded-lg text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-colors">إيداع (+)</button>
               <button onClick={() => openTxModal('EXPENSE')} className="flex-1 bg-rose-500/20 hover:bg-rose-500/30 py-2 rounded-lg text-rose-300 text-xs font-bold border border-rose-500/30 transition-colors">سحب (-)</button>
            </div>
         </div>

         {/* Individual Accounts */}
         {accounts.map(acc => (
            <div key={acc.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all min-h-[160px] flex flex-col justify-between">
               <div className={`absolute top-0 right-0 w-1 h-full ${acc.type === 'BANK' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
               
               <div>
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h4 className="font-bold text-slate-800">{acc.name}</h4>
                        <p className="text-xs text-slate-500 font-mono mt-1">{acc.type === 'BANK' ? 'حساب بنكي' : 'خزينة نقدية'}</p>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => openEditAccount(acc)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Pencil className="w-4 h-4"/></button>
                        <button onClick={() => onDeleteAccount(acc.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                     </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2" dir="ltr">${acc.balance.toLocaleString()}</h3>
                  {acc.accountNumber && (
                    <p className="text-xs text-slate-400 font-mono tracking-wider">**** {acc.accountNumber.slice(-4)}</p>
                  )}
               </div>
               
               <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold">{acc.currency}</span>
                  <div className={`p-2 rounded-full ${acc.type === 'BANK' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                     {acc.type === 'BANK' ? <Landmark className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* Transactions Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
               <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
               سجل المعاملات
            </h3>
            <div className="flex gap-2">
               <button onClick={() => window.print()} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="طباعة الكشف"><Printer className="w-4 h-4" /></button>
            </div>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
               <thead className="bg-slate-50 text-slate-500">
                  <tr>
                     <th className="px-6 py-4">التاريخ</th>
                     <th className="px-6 py-4">نوع الحركة</th>
                     <th className="px-6 py-4">الوصف</th>
                     <th className="px-6 py-4">الحساب</th>
                     <th className="px-6 py-4">المبلغ</th>
                     <th className="px-6 py-4">التصنيف</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {transactions.map(tx => (
                     <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-slate-600">{tx.date}</td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${
                              tx.type === 'INCOME' ? 'bg-emerald-50 text-emerald-700' : 
                              tx.type === 'EXPENSE' ? 'bg-rose-50 text-rose-700' : 
                              'bg-blue-50 text-blue-700'
                           }`}>
                              {tx.type === 'INCOME' ? <ArrowDownLeft className="w-3 h-3" /> : 
                               tx.type === 'EXPENSE' ? <ArrowUpRight className="w-3 h-3" /> : 
                               <ArrowRightLeft className="w-3 h-3" />}
                              {tx.type === 'INCOME' ? 'قبض' : tx.type === 'EXPENSE' ? 'صرف' : 'تحويل'}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-slate-800">{tx.description}</td>
                        <td className="px-6 py-4 text-slate-600">
                           {accounts.find(a => a.id === tx.accountId)?.name}
                           {tx.targetAccountId && (
                              <span className="text-xs text-slate-400 mx-1">
                                 <ArrowRightLeft className="w-3 h-3 inline mx-1" />
                                 {accounts.find(a => a.id === tx.targetAccountId)?.name}
                              </span>
                           )}
                        </td>
                        <td className={`px-6 py-4 font-bold ltr ${
                           tx.type === 'INCOME' ? 'text-emerald-600' : 
                           tx.type === 'EXPENSE' ? 'text-rose-600' : 'text-blue-600'
                        }`}>
                           {tx.type === 'INCOME' ? '+' : tx.type === 'EXPENSE' ? '-' : ''}${tx.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                           <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                              {tx.category}
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* 1. Account Modal */}
      {isAccountModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in zoom-in-95 duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
               <h3 className="text-xl font-bold text-slate-800 mb-4">{isEditMode ? 'تعديل الحساب' : 'إضافة حساب خزينة/بنك'}</h3>
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">اسم الحساب</label>
                     <input type="text" value={accountForm.name} onChange={(e) => setAccountForm({...accountForm, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" placeholder="مثال: الخزينة الرئيسية" />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">النوع</label>
                     <select value={accountForm.type} onChange={(e) => setAccountForm({...accountForm, type: e.target.value as any})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none">
                        <option value="CASH">خزينة نقدية (Cash)</option>
                        <option value="BANK">حساب بنكي (Bank)</option>
                     </select>
                  </div>
                  {accountForm.type === 'BANK' && (
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">رقم الحساب / الآيبان</label>
                        <input type="text" value={accountForm.accountNumber || ''} onChange={(e) => setAccountForm({...accountForm, accountNumber: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" placeholder="SA..." />
                     </div>
                  )}
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">الرصيد الافتتاحي</label>
                     <input type="number" value={accountForm.balance} onChange={(e) => setAccountForm({...accountForm, balance: Number(e.target.value)})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" disabled={isEditMode} />
                  </div>
               </div>
               <div className="flex justify-end gap-2 mt-6">
                  <button onClick={() => setIsAccountModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg">إلغاء</button>
                  <button onClick={handleSaveAccount} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-md">حفظ</button>
               </div>
            </div>
         </div>
      )}

      {/* 2. Transaction Modal */}
      {isTxModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in zoom-in-95 duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                     {txForm.type === 'TRANSFER' ? <ArrowRightLeft className="w-5 h-5 text-indigo-600" /> : txForm.type === 'INCOME' ? <ArrowDownLeft className="w-5 h-5 text-emerald-600" /> : <ArrowUpRight className="w-5 h-5 text-rose-600" />}
                     {txForm.type === 'TRANSFER' ? 'تحويل بين الحسابات' : txForm.type === 'INCOME' ? 'عملية إيداع' : 'عملية صرف'}
                  </h3>
                  <button onClick={() => setIsTxModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
               </div>
               
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">
                        {txForm.type === 'TRANSFER' ? 'من حساب' : 'الحساب'}
                     </label>
                     <select value={txForm.accountId} onChange={(e) => setTxForm({...txForm, accountId: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none">
                        <option value="">اختر...</option>
                        {accounts.map(a => <option key={a.id} value={a.id}>{a.name} (رصيد: {a.balance})</option>)}
                     </select>
                  </div>
                  
                  {txForm.type === 'TRANSFER' && (
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">إلى حساب</label>
                        <select value={txForm.targetAccountId} onChange={(e) => setTxForm({...txForm, targetAccountId: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none">
                           <option value="">اختر...</option>
                           {accounts.filter(a => a.id !== txForm.accountId).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                     </div>
                  )}

                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">المبلغ</label>
                     <input type="number" value={txForm.amount} onChange={(e) => setTxForm({...txForm, amount: Number(e.target.value)})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold text-lg" placeholder="0.00" />
                  </div>
                  
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">الوصف</label>
                     <input type="text" value={txForm.description} onChange={(e) => setTxForm({...txForm, description: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" placeholder="بيان العملية..." />
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">التصنيف</label>
                     <select value={txForm.category} onChange={(e) => setTxForm({...txForm, category: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none">
                        <option value="General">عام</option>
                        <option value="Sales">مبيعات</option>
                        <option value="Expenses">مصروفات تشغيلية</option>
                        <option value="Salary">رواتب</option>
                        <option value="Transfer">تحويل داخلي</option>
                     </select>
                  </div>
               </div>

               <div className="flex justify-end gap-2 mt-6">
                  <button onClick={() => setIsTxModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg">إلغاء</button>
                  <button onClick={handleSaveTx} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-md">تنفيذ</button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};