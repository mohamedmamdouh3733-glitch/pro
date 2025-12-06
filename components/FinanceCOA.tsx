

import React, { useState } from 'react';
import { Account, AccountType, JournalEntry, JournalEntryLine } from '../types';
import { Search, Plus, Folder, FileText, ChevronRight, ChevronDown, DollarSign, PieChart, ArrowUpRight, ArrowDownLeft, TrendingUp, Wallet, Landmark, CreditCard, Activity, Pencil, Trash2, Save, X, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface FinanceCOAProps {
  accounts: Account[];
  journalEntries: JournalEntry[];
  onAddAccount: (account: Account) => void;
  onUpdateAccount: (account: Account) => void;
  onDeleteAccount: (id: string) => void;
  onAddJournalEntry: (entry: JournalEntry) => void;
}

export const FinanceCOA: React.FC<FinanceCOAProps> = ({ 
  accounts, journalEntries, onAddAccount, onUpdateAccount, onDeleteAccount, onAddJournalEntry 
}) => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({
    'ASSET': true, 'LIABILITY': true, 'EQUITY': false, 'REVENUE': false, 'EXPENSE': false
  });
  
  // Modals
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Forms
  const [accountForm, setAccountForm] = useState<Partial<Account>>({
     name: '', code: '', type: 'ASSET', balance: 0
  });

  const [journalForm, setJournalForm] = useState<{
     date: string;
     reference: string;
     description: string;
     lines: { accountId: string, debit: number, credit: number, id: string }[];
  }>({
     date: new Date().toISOString().split('T')[0],
     reference: '',
     description: '',
     lines: [
        { id: '1', accountId: '', debit: 0, credit: 0 },
        { id: '2', accountId: '', debit: 0, credit: 0 }
     ]
  });

  // Helper to filter and group accounts
  const filteredAccounts = accounts.filter(acc => 
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    acc.code.includes(searchTerm)
  );

  const getAccountsByType = (type: AccountType) => filteredAccounts.filter(acc => acc.type === type);

  const toggleType = (type: string) => {
    setExpandedTypes(prev => ({...prev, [type]: !prev[type]}));
  };

  // Handlers
  const openAddAccount = () => {
     setAccountForm({ name: '', code: '', type: 'ASSET', balance: 0 });
     setIsEditMode(false);
     setIsAccountModalOpen(true);
  };

  const openEditAccount = (acc: Account) => {
     setAccountForm({ ...acc });
     setIsEditMode(true);
     setIsAccountModalOpen(true);
  };

  const handleSaveAccount = () => {
     if(!accountForm.name || !accountForm.code) return;
     
     if(isEditMode && accountForm.id) {
        onUpdateAccount(accountForm as Account);
     } else {
        const newAcc: Account = {
           id: `ACC-${Math.floor(Math.random() * 10000)}`,
           name: accountForm.name!,
           code: accountForm.code!,
           type: accountForm.type as AccountType,
           balance: Number(accountForm.balance) || 0,
           isHeader: false,
           level: 1
        };
        onAddAccount(newAcc);
     }
     setIsAccountModalOpen(false);
  };

  // Journal Handlers
  const addJournalLine = () => {
     setJournalForm({
        ...journalForm,
        lines: [...journalForm.lines, { id: Date.now().toString(), accountId: '', debit: 0, credit: 0 }]
     });
  };

  const removeJournalLine = (id: string) => {
     if(journalForm.lines.length <= 2) return;
     setJournalForm({
        ...journalForm,
        lines: journalForm.lines.filter(l => l.id !== id)
     });
  };

  const updateJournalLine = (id: string, field: string, value: any) => {
     const newLines = journalForm.lines.map(l => {
        if(l.id === id) return { ...l, [field]: value };
        return l;
     });
     setJournalForm({ ...journalForm, lines: newLines });
  };

  const handleSaveJournal = () => {
     const totalDebit = journalForm.lines.reduce((sum, l) => sum + Number(l.debit), 0);
     const totalCredit = journalForm.lines.reduce((sum, l) => sum + Number(l.credit), 0);

     if(totalDebit !== totalCredit) {
        alert("القيد غير متوازن! يجب أن يتساوى المدين مع الدائن.");
        return;
     }
     if(totalDebit === 0) {
        alert("لا يمكن حفظ قيد صفري.");
        return;
     }

     const newEntry: JournalEntry = {
        id: `JE-${Math.floor(Math.random() * 10000)}`,
        date: journalForm.date,
        reference: journalForm.reference || `REF-${Math.floor(Math.random() * 1000)}`,
        description: journalForm.description,
        status: 'Posted',
        createdAt: new Date().toISOString(),
        lines: journalForm.lines.map(l => ({
           id: l.id,
           accountId: l.accountId,
           debit: Number(l.debit),
           credit: Number(l.credit)
        }))
     };
     
     onAddJournalEntry(newEntry);
     setIsJournalModalOpen(false);
     setJournalForm({
        date: new Date().toISOString().split('T')[0],
        reference: '',
        description: '',
        lines: [
           { id: '1', accountId: '', debit: 0, credit: 0 },
           { id: '2', accountId: '', debit: 0, credit: 0 }
        ]
     });
  };


  // Visual Helpers
  const getTypeColor = (type: AccountType) => {
    switch (type) {
      case 'ASSET': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: Wallet, gradient: 'from-emerald-500 to-teal-600' };
      case 'LIABILITY': return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: Landmark, gradient: 'from-rose-500 to-pink-600' };
      case 'EQUITY': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: PieChart, gradient: 'from-blue-500 to-indigo-600' };
      case 'REVENUE': return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: TrendingUp, gradient: 'from-indigo-500 to-violet-600' };
      case 'EXPENSE': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: CreditCard, gradient: 'from-amber-500 to-orange-600' };
    }
  };

  const getTypeName = (type: AccountType) => {
    switch (type) {
      case 'ASSET': return 'الأصول';
      case 'LIABILITY': return 'الخصوم / الالتزامات';
      case 'EQUITY': return 'حقوق الملكية';
      case 'REVENUE': return 'الإيرادات';
      case 'EXPENSE': return 'المصروفات';
    }
  };

  // Calculate Account Statement (Ledger)
  const getAccountStatement = (accId: string) => {
     const entries = journalEntries
        .filter(je => je.lines.some(l => l.accountId === accId))
        .map(je => {
           const line = je.lines.find(l => l.accountId === accId);
           return {
              date: je.date,
              reference: je.reference,
              description: je.description,
              debit: line?.debit || 0,
              credit: line?.credit || 0
           };
        })
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
     return entries;
  };

  const totalAssets = accounts.filter(a => a.type === 'ASSET').reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = accounts.filter(a => a.type === 'LIABILITY').reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 animate-fade-in relative">
      
      {/* Header Actions */}
      <div className="absolute -top-16 left-0 flex gap-3">
         <button 
           onClick={() => setIsJournalModalOpen(true)}
           className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md flex items-center gap-2"
         >
            <FileText className="w-4 h-4" />
            قيد يومية جديد
         </button>
      </div>

      {/* LEFT SIDE: Account Tree */}
      <div className="w-full md:w-5/12 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                دليل الحسابات
              </h3>
              <button onClick={openAddAccount} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                <Plus className="w-4 h-4" />
              </button>
           </div>
           <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="بحث برقم الحساب أو الاسم..."
                className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        {/* Tree List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
           {['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'].map((type) => {
              const typeAccounts = getAccountsByType(type as AccountType);
              const styles = getTypeColor(type as AccountType);
              const Icon = styles.icon;
              const isExpanded = expandedTypes[type];

              if (typeAccounts.length === 0) return null;

              return (
                 <div key={type} className="border border-slate-100 rounded-xl overflow-hidden mb-2">
                    <button 
                      onClick={() => toggleType(type)}
                      className={`w-full flex items-center justify-between p-3 ${styles.bg} transition-colors`}
                    >
                       <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg bg-white/60 ${styles.text}`}>
                             <Icon className="w-4 h-4" />
                          </div>
                          <span className={`font-bold text-sm ${styles.text}`}>{getTypeName(type as AccountType)}</span>
                          <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full text-slate-600 font-mono">
                             {typeAccounts.length}
                          </span>
                       </div>
                       {isExpanded ? <ChevronDown className={`w-4 h-4 ${styles.text}`} /> : <ChevronRight className={`w-4 h-4 ${styles.text}`} />}
                    </button>
                    
                    {isExpanded && (
                       <div className="bg-white p-2 space-y-1">
                          {typeAccounts.map(acc => (
                             <div 
                               key={acc.id}
                               onClick={() => setSelectedAccount(acc)}
                               className={`
                                 flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all border
                                 ${selectedAccount?.id === acc.id 
                                   ? `bg-slate-800 text-white border-slate-800 shadow-md transform scale-[1.02]` 
                                   : 'hover:bg-slate-50 border-transparent hover:border-slate-100 text-slate-600'}
                               `}
                             >
                                <div className="flex items-center gap-3">
                                   <div className={`w-1.5 h-1.5 rounded-full ${selectedAccount?.id === acc.id ? 'bg-indigo-400' : 'bg-slate-300'}`}></div>
                                   <div>
                                      <p className="font-bold text-sm">{acc.name}</p>
                                      <p className={`text-[10px] font-mono ${selectedAccount?.id === acc.id ? 'text-slate-400' : 'text-slate-400'}`}>
                                         {acc.code}
                                      </p>
                                   </div>
                                </div>
                                <span className={`text-sm font-bold font-mono ${selectedAccount?.id === acc.id ? 'text-emerald-300' : 'text-slate-700'}`}>
                                   ${acc.balance.toLocaleString()}
                                </span>
                             </div>
                          ))}
                       </div>
                    )}
                 </div>
              );
           })}
        </div>
      </div>

      {/* RIGHT SIDE: Dashboard / Details */}
      <div className="w-full md:w-7/12 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
        
        {/* 1. General Stats (Visible when no account selected) */}
        {!selectedAccount ? (
           <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20">
                    <div className="flex justify-between items-start mb-4">
                       <div className="p-2 bg-white/20 rounded-xl"><Wallet className="w-6 h-6" /></div>
                       <span className="text-xs bg-white/20 px-2 py-1 rounded">الميزانية العمومية</span>
                    </div>
                    <p className="text-emerald-100 text-sm mb-1">إجمالي الأصول</p>
                    <h3 className="text-3xl font-bold">${totalAssets.toLocaleString()}</h3>
                 </div>
                 <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg shadow-rose-500/20">
                    <div className="flex justify-between items-start mb-4">
                       <div className="p-2 bg-white/20 rounded-xl"><Landmark className="w-6 h-6" /></div>
                       <span className="text-xs bg-white/20 px-2 py-1 rounded">الميزانية العمومية</span>
                    </div>
                    <p className="text-rose-100 text-sm mb-1">إجمالي الخصوم</p>
                    <h3 className="text-3xl font-bold">${totalLiabilities.toLocaleString()}</h3>
                 </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                 <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <Activity className="w-10 h-10 text-indigo-600" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 mb-2">اختر حساباً لعرض التفاصيل</h3>
                 <p className="text-slate-500 max-w-xs mx-auto">
                    قم بتحديد حساب من القائمة الجانبية لعرض بطاقة الحساب، الرصيد، وسجل العمليات.
                 </p>
              </div>
           </div>
        ) : (
           /* 2. Selected Account Details */
           <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
              {/* Colored Account Card */}
              <div className={`rounded-3xl p-8 text-white shadow-xl bg-gradient-to-br ${getTypeColor(selectedAccount.type).gradient} relative overflow-hidden group`}>
                 <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                 
                 <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                       <div>
                          <p className="text-white/80 text-sm font-mono mb-1">#{selectedAccount.code}</p>
                          <h2 className="text-3xl font-bold">{selectedAccount.name}</h2>
                          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm">
                             {getTypeName(selectedAccount.type)}
                          </span>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => openEditAccount(selectedAccount)} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"><Pencil className="w-5 h-5"/></button>
                          <button onClick={() => onDeleteAccount(selectedAccount.id)} className="p-2 bg-white/20 hover:bg-rose-500/50 rounded-lg backdrop-blur-sm transition-colors"><Trash2 className="w-5 h-5"/></button>
                       </div>
                    </div>

                    <div className="flex items-end gap-2">
                       <span className="text-5xl font-bold tracking-tight">${selectedAccount.balance.toLocaleString()}</span>
                       <span className="mb-2 text-white/80 font-medium">الرصيد الحالي</span>
                    </div>
                 </div>
              </div>

              {/* Account Statement (Ledger) */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                 <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                       <FileText className="w-5 h-5 text-indigo-600" />
                       كشف الحساب (Ledger)
                    </h4>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm">
                       <thead className="bg-slate-50 text-slate-500">
                          <tr>
                             <th className="px-4 py-3">التاريخ</th>
                             <th className="px-4 py-3">المرجع</th>
                             <th className="px-4 py-3">البيان</th>
                             <th className="px-4 py-3">مدين</th>
                             <th className="px-4 py-3">دائن</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {getAccountStatement(selectedAccount.id).length > 0 ? (
                             getAccountStatement(selectedAccount.id).map((entry, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                   <td className="px-4 py-3 font-mono text-slate-600">{entry.date}</td>
                                   <td className="px-4 py-3 font-mono text-slate-500 text-xs">{entry.reference}</td>
                                   <td className="px-4 py-3 text-slate-700">{entry.description}</td>
                                   <td className="px-4 py-3 font-bold text-slate-800">{entry.debit > 0 ? entry.debit.toLocaleString() : '-'}</td>
                                   <td className="px-4 py-3 font-bold text-slate-800">{entry.credit > 0 ? entry.credit.toLocaleString() : '-'}</td>
                                </tr>
                             ))
                          ) : (
                             <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">لا توجد حركات مسجلة لهذا الحساب.</td>
                             </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* Account Modal */}
      {isAccountModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in zoom-in-95 duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
               <h3 className="text-xl font-bold text-slate-800 mb-4">{isEditMode ? 'تعديل الحساب' : 'إضافة حساب جديد'}</h3>
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">اسم الحساب</label>
                     <input type="text" value={accountForm.name} onChange={(e) => setAccountForm({...accountForm, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">رقم الحساب (Code)</label>
                     <input type="text" value={accountForm.code} onChange={(e) => setAccountForm({...accountForm, code: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none" />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">نوع الحساب</label>
                     <select value={accountForm.type} onChange={(e) => setAccountForm({...accountForm, type: e.target.value as AccountType})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none">
                        <option value="ASSET">أصول</option>
                        <option value="LIABILITY">خصوم</option>
                        <option value="EQUITY">حقوق ملكية</option>
                        <option value="REVENUE">إيرادات</option>
                        <option value="EXPENSE">مصروفات</option>
                     </select>
                  </div>
               </div>
               <div className="flex justify-end gap-2 mt-6">
                  <button onClick={() => setIsAccountModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg">إلغاء</button>
                  <button onClick={handleSaveAccount} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold">حفظ</button>
               </div>
            </div>
         </div>
      )}

      {/* Journal Entry Modal */}
      {isJournalModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in zoom-in-95 duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
               <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                     <FileText className="w-6 h-6 text-indigo-600"/>
                     قيد يومية جديد
                  </h3>
                  <button onClick={() => setIsJournalModalOpen(false)}><X className="w-6 h-6 text-slate-400 hover:text-red-500"/></button>
               </div>
               
               <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                  {/* Header Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">التاريخ</label>
                        <input type="date" value={journalForm.date} onChange={(e) => setJournalForm({...journalForm, date: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">رقم المرجع (Ref)</label>
                        <input type="text" value={journalForm.reference} onChange={(e) => setJournalForm({...journalForm, reference: e.target.value})} placeholder="تلقائي" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">البيان / الوصف</label>
                        <input type="text" value={journalForm.description} onChange={(e) => setJournalForm({...journalForm, description: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
                     </div>
                  </div>

                  {/* Lines Table */}
                  <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden mb-4">
                     <table className="w-full text-right text-sm">
                        <thead className="bg-slate-100 text-slate-600">
                           <tr>
                              <th className="px-4 py-3 w-[40%]">الحساب</th>
                              <th className="px-4 py-3 w-[25%]">مدين</th>
                              <th className="px-4 py-3 w-[25%]">دائن</th>
                              <th className="px-4 py-3 w-[10%]"></th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                           {journalForm.lines.map((line) => (
                              <tr key={line.id}>
                                 <td className="px-4 py-2">
                                    <select 
                                      value={line.accountId}
                                      onChange={(e) => updateJournalLine(line.id, 'accountId', e.target.value)}
                                      className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                                    >
                                       <option value="">اختر حساب...</option>
                                       {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>)}
                                    </select>
                                 </td>
                                 <td className="px-4 py-2">
                                    <input 
                                      type="number" 
                                      value={line.debit} 
                                      onChange={(e) => updateJournalLine(line.id, 'debit', Number(e.target.value))}
                                      className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                                      disabled={line.credit > 0}
                                    />
                                 </td>
                                 <td className="px-4 py-2">
                                    <input 
                                      type="number" 
                                      value={line.credit} 
                                      onChange={(e) => updateJournalLine(line.id, 'credit', Number(e.target.value))}
                                      className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                                      disabled={line.debit > 0}
                                    />
                                 </td>
                                 <td className="px-4 py-2 text-center">
                                    <button onClick={() => removeJournalLine(line.id)} className="text-rose-500 hover:text-rose-700"><Trash2 className="w-4 h-4"/></button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                        <tfoot className="bg-slate-100 font-bold text-slate-800">
                           <tr>
                              <td className="px-4 py-3">الإجمالي</td>
                              <td className="px-4 py-3 text-emerald-600">{journalForm.lines.reduce((s, l) => s + l.debit, 0).toLocaleString()}</td>
                              <td className="px-4 py-3 text-rose-600">{journalForm.lines.reduce((s, l) => s + l.credit, 0).toLocaleString()}</td>
                              <td></td>
                           </tr>
                        </tfoot>
                     </table>
                  </div>
                  <button onClick={addJournalLine} className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:underline">
                     <Plus className="w-4 h-4" /> إضافة سطر جديد
                  </button>
               </div>

               <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                  <button onClick={() => setIsJournalModalOpen(false)} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100">إلغاء</button>
                  <button onClick={handleSaveJournal} className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 flex items-center gap-2">
                     <CheckCircle2 className="w-5 h-5" />
                     ترحيل القيد
                  </button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};