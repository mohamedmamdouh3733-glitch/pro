
import React, { useState, useMemo } from 'react';
import { Customer, Invoice, Product } from '../types';
import { Search, Plus, Printer, Trash2, Pencil, X, Save, Scan, QrCode, Building2, Phone, Mail } from 'lucide-react';

interface SalesProps {
  customers: Customer[];
  invoices: Invoice[];
  products: Product[];
  onAddInvoice?: (invoice: Invoice) => void;
  onUpdateInvoice?: (invoice: Invoice) => void;
  onDeleteInvoice?: (id: string) => void;
}

// Simple Arabic Tafqeet Helper
const tafqeet = (amount: number): string => {
   if (!amount) return "صفر";
   return `${amount.toLocaleString()} (فقط ${amount} ريال لا غير)`;
};

export const Sales: React.FC<SalesProps> = ({ 
   customers, invoices, products,
   onAddInvoice, onUpdateInvoice, onDeleteInvoice
}) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'list' | 'create'>('list');
  
  // States for Actions
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // -- Advanced Invoice Form State --
  const [invForm, setInvForm] = useState({
      id: '',
      customerId: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      warehouseId: 'WH-001',
      salesRep: 'أحمد محمد',
      currency: 'SAR',
      notes: '',
      items: [] as any[],
      paymentType: 'CASH' as 'CASH' | 'CREDIT',
      withholdingTaxRate: 0, 
      additionalDiscount: 0,
      additionalDiscountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
      status: 'Pending'
  });

  // Calculate Totals Live
  const totals = useMemo(() => {
      const rawSubtotal = invForm.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
      
      let globalDiscountAmount = 0;
      if (invForm.additionalDiscountType === 'PERCENTAGE') {
         globalDiscountAmount = rawSubtotal * (invForm.additionalDiscount / 100);
      } else {
         globalDiscountAmount = invForm.additionalDiscount;
      }

      const netAfterDiscount = Math.max(0, rawSubtotal - globalDiscountAmount);
      const vatAmount = netAfterDiscount * 0.14;
      const grossTotal = netAfterDiscount + vatAmount;
      const whtAmount = netAfterDiscount * (invForm.withholdingTaxRate / 100);
      const netPayable = grossTotal - whtAmount;

      return { rawSubtotal, globalDiscountAmount, netAfterDiscount, vatAmount, grossTotal, whtAmount, netPayable };
  }, [invForm.items, invForm.additionalDiscount, invForm.additionalDiscountType, invForm.withholdingTaxRate]);

  // -- Handlers --

  const handleCreateNewInvoice = () => {
      setInvForm({
          id: `INV-${Math.floor(Math.random() * 100000)}`,
          customerId: '',
          date: new Date().toISOString().split('T')[0],
          dueDate: new Date().toISOString().split('T')[0],
          warehouseId: 'WH-001',
          salesRep: 'أحمد محمد',
          currency: 'SAR',
          notes: '',
          items: [{ id: Date.now(), productId: '', name: '', unit: '', quantity: 1, price: 0, total: 0 }],
          paymentType: 'CASH',
          withholdingTaxRate: 0,
          additionalDiscount: 0,
          additionalDiscountType: 'PERCENTAGE',
          status: 'Pending'
      });
      setIsEditMode(false);
      setActiveView('create');
  };

  const handleEditInvoice = (invoice: Invoice) => {
      const formItems = invoice.items.map(item => {
          const product = products.find(p => p.id === item.productId);
          return {
              id: Date.now() + Math.random(),
              productId: item.productId,
              name: item.productName,
              unit: product?.unit || 'PCS',
              quantity: item.quantity,
              price: item.price,
              total: item.total
          };
      });

      setInvForm({
          id: invoice.id,
          customerId: invoice.customerId,
          date: invoice.date,
          dueDate: invoice.dueDate,
          warehouseId: 'WH-001',
          salesRep: 'أحمد محمد',
          currency: 'SAR',
          notes: invoice.notes || '',
          items: formItems,
          paymentType: invoice.paymentType || 'CASH',
          withholdingTaxRate: invoice.withholdingTaxRate || 0,
          additionalDiscount: invoice.additionalDiscount || 0,
          additionalDiscountType: invoice.additionalDiscountType || 'PERCENTAGE',
          status: invoice.status
      });
      setIsEditMode(true);
      setActiveView('create');
  };

  const handleProductSelect = (index: number, productId: string) => {
      const product = products.find(p => p.id === productId);
      if(!product) return;

      const newItems = [...invForm.items];
      newItems[index] = {
          ...newItems[index],
          productId: product.id,
          name: product.name,
          unit: product.unit || 'PCS',
          price: product.price,
          quantity: 1,
          total: product.price * 1
      };
      setInvForm({ ...invForm, items: newItems });
  };

  const updateLineItem = (index: number, field: string, value: any) => {
      const newItems = [...invForm.items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      const qty = Number(newItems[index].quantity) || 0;
      const price = Number(newItems[index].price) || 0;
      newItems[index].total = qty * price;
      setInvForm({ ...invForm, items: newItems });
  };

  const addLine = () => {
      setInvForm({ ...invForm, items: [...invForm.items, { id: Date.now(), productId: '', name: '', unit: '', quantity: 1, price: 0, total: 0 }] });
  };

  const removeLine = (index: number) => {
      if(invForm.items.length <= 1) return;
      const newItems = [...invForm.items];
      newItems.splice(index, 1);
      setInvForm({ ...invForm, items: newItems });
  };

  const handleSaveInvoice = () => {
      if(!invForm.customerId) { alert('يجب اختيار العميل'); return; }
      
      const newInvoice: Invoice = {
          id: invForm.id,
          customerId: invForm.customerId,
          customerName: customers.find(c => c.id === invForm.customerId)?.name || 'Unknown',
          date: invForm.date,
          dueDate: invForm.dueDate,
          status: invForm.status as any,
          subtotal: totals.rawSubtotal,
          discount: totals.globalDiscountAmount,
          tax: totals.vatAmount,
          total: totals.netPayable,
          items: invForm.items.map(i => ({
              id: i.id.toString(),
              productId: i.productId,
              productName: i.name,
              unit: i.unit,
              price: i.price,
              quantity: i.quantity,
              total: i.total
          })),
          notes: invForm.notes,
          paymentType: invForm.paymentType,
          withholdingTaxRate: invForm.withholdingTaxRate,
          withholdingTaxAmount: totals.whtAmount,
          additionalDiscount: invForm.additionalDiscount,
          additionalDiscountType: invForm.additionalDiscountType,
          amountInWords: tafqeet(totals.netPayable)
      };

      if(isEditMode && onUpdateInvoice) {
          onUpdateInvoice(newInvoice);
      } else if(onAddInvoice) {
          onAddInvoice(newInvoice);
      }
      setActiveView('list');
  };

  const renderInvoiceEditor = () => {
      const selectedCust = customers.find(c => c.id === invForm.customerId);

      return (
        <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in zoom-in-95 duration-200">
            {/* Toolbar */}
            <div className="bg-slate-800 text-white p-2 rounded-t-xl flex justify-between items-center shadow-md">
                <div className="flex items-center gap-2">
                    <button onClick={handleSaveInvoice} className="flex flex-col items-center gap-1 px-4 py-1 hover:bg-slate-700 rounded transition-colors group">
                        <Save className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold">حفظ</span>
                    </button>
                     <button onClick={() => setActiveView('list')} className="flex flex-col items-center gap-1 px-4 py-1 hover:bg-slate-700 rounded transition-colors group">
                        <X className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold">إغلاق</span>
                    </button>
                </div>
                <div className="text-right px-4">
                    <div className="text-xs text-slate-400">وضع المحرر</div>
                    <div className="text-sm font-bold text-emerald-400">{isEditMode ? 'تعديل فاتورة' : 'فاتورة جديدة'}</div>
                </div>
            </div>

            {/* Workspace */}
            <div className="flex-1 bg-slate-100 flex overflow-hidden border-x border-slate-200">
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header Fields */}
                    <div className="bg-white p-4 shadow-sm border-b border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-1">
                             <label className="block text-[11px] font-bold text-slate-500 mb-1">رقم الفاتورة #</label>
                             <input type="text" value={invForm.id} readOnly className="w-full bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded px-3 py-1.5 font-mono" />
                        </div>
                        <div className="md:col-span-1">
                             <label className="block text-[11px] font-bold text-slate-500 mb-1">تاريخ الفاتورة</label>
                             <input type="date" value={invForm.date} onChange={e => setInvForm({...invForm, date: e.target.value})} className="w-full bg-white border border-slate-300 text-slate-800 text-sm rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div className="md:col-span-2">
                             <label className="block text-[11px] font-bold text-blue-600 mb-1 flex justify-between">
                                <span>العميل</span>
                                {selectedCust && (
                                  <span className={`text-xs px-2 rounded ${selectedCust.balance > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    الرصيد الحالي: {selectedCust.balance.toLocaleString()}
                                  </span>
                                )}
                             </label>
                             <div className="flex gap-1">
                                <select 
                                   value={invForm.customerId} 
                                   onChange={e => setInvForm({...invForm, customerId: e.target.value})}
                                   className="flex-1 bg-yellow-50 border border-yellow-200 text-slate-800 text-sm font-bold rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">-- اختر العميل --</option>
                                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <button className="px-3 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"><Plus className="w-4 h-4" /></button>
                             </div>
                        </div>

                        <div className="md:col-span-1">
                             <label className="block text-[11px] font-bold text-slate-500 mb-1">طريقة الدفع</label>
                             <div className="flex bg-slate-100 rounded p-0.5">
                                <button 
                                  onClick={() => setInvForm({...invForm, paymentType: 'CASH'})}
                                  className={`flex-1 text-xs py-1 rounded transition-colors ${invForm.paymentType === 'CASH' ? 'bg-white shadow text-emerald-600 font-bold' : 'text-slate-500'}`}
                                >
                                  نقدي
                                </button>
                                <button 
                                  onClick={() => setInvForm({...invForm, paymentType: 'CREDIT'})}
                                  className={`flex-1 text-xs py-1 rounded transition-colors ${invForm.paymentType === 'CREDIT' ? 'bg-white shadow text-blue-600 font-bold' : 'text-slate-500'}`}
                                >
                                  آجل
                                </button>
                             </div>
                        </div>
                        <div className="md:col-span-1">
                             <label className="block text-[11px] font-bold text-slate-500 mb-1">تاريخ الاستحقاق</label>
                             <input 
                               type="date" 
                               value={invForm.dueDate} 
                               onChange={e => setInvForm({...invForm, dueDate: e.target.value})} 
                               disabled={invForm.paymentType === 'CASH'}
                               className={`w-full border border-slate-300 text-slate-800 text-sm rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none ${invForm.paymentType === 'CASH' ? 'bg-slate-100 text-slate-400' : 'bg-white'}`} 
                             />
                        </div>
                    </div>

                    {/* Data Grid */}
                    <div className="flex-1 overflow-auto bg-white relative custom-scrollbar">
                        <div className="min-w-[800px]">
                            <div className="bg-slate-100 border-y border-slate-300 flex text-xs font-bold text-slate-700 sticky top-0 z-10 shadow-sm">
                                <div className="w-10 py-2 text-center border-l border-slate-300">#</div>
                                <div className="flex-1 py-2 px-2 border-l border-slate-300 text-right">الصنف</div>
                                <div className="w-24 py-2 px-2 border-l border-slate-300 text-center">الوحدة</div>
                                <div className="w-24 py-2 px-2 border-l border-slate-300 text-center">الكمية</div>
                                <div className="w-28 py-2 px-2 border-l border-slate-300 text-center">السعر</div>
                                <div className="w-32 py-2 px-2 border-l border-slate-300 text-center bg-blue-50 text-blue-700">الإجمالي</div>
                                <div className="w-10 py-2 text-center"></div>
                            </div>
                            {invForm.items.map((item, idx) => (
                                <div key={item.id} className="flex border-b border-slate-200 hover:bg-blue-50/30 transition-colors text-sm">
                                    <div className="w-10 py-2 text-center border-l border-slate-100 text-slate-400 bg-slate-50 font-mono">{idx + 1}</div>
                                    <div className="flex-1 border-l border-slate-100 p-1">
                                         <select 
                                            value={item.productId}
                                            onChange={(e) => handleProductSelect(idx, e.target.value)}
                                            className="w-full h-full bg-transparent outline-none text-slate-800 font-bold text-xs focus:bg-white focus:ring-1 focus:ring-blue-400 rounded"
                                        >
                                            <option value="">اختر المنتج...</option>
                                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="w-24 border-l border-slate-100 p-1">
                                        <input type="text" value={item.unit} readOnly className="w-full h-full bg-transparent text-center outline-none text-slate-500 text-xs" />
                                    </div>
                                    <div className="w-24 border-l border-slate-100 p-1">
                                        <input type="number" value={item.quantity} onChange={(e) => updateLineItem(idx, 'quantity', e.target.value)} className="w-full h-full bg-white border border-slate-200 rounded text-center outline-none focus:border-blue-500 font-bold text-slate-800" />
                                    </div>
                                    <div className="w-28 border-l border-slate-100 p-1">
                                        <input type="number" value={item.price} onChange={(e) => updateLineItem(idx, 'price', e.target.value)} className="w-full h-full bg-white border border-slate-200 rounded text-center outline-none focus:border-blue-500 text-slate-800" />
                                    </div>
                                    <div className="w-32 border-l border-slate-100 p-2 bg-blue-50/50 text-center font-bold text-blue-700">
                                        {item.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <div className="w-10 text-center p-1 flex items-center justify-center">
                                        <button onClick={() => removeLine(idx)} className="text-slate-400 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                            <div className="p-2 border-b border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors text-slate-500 text-xs font-bold flex items-center justify-center gap-2" onClick={addLine}>
                                <Plus className="w-4 h-4" /> اضغط هنا لإضافة سطر جديد
                            </div>
                        </div>
                    </div>

                    {/* Footer Totals */}
                    <div className="bg-white border-t border-slate-300 p-4 shadow-lg z-10">
                        <div className="flex flex-col md:flex-row gap-6">
                             <div className="flex-1">
                                 <label className="block text-[11px] font-bold text-slate-500 mb-1">ملاحظات الفاتورة</label>
                                 <textarea 
                                    value={invForm.notes} 
                                    onChange={(e) => setInvForm({...invForm, notes: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs h-16 resize-none focus:bg-white focus:ring-1 focus:ring-blue-400 outline-none"
                                    placeholder="شروط التسليم / ملاحظات..."
                                 ></textarea>
                                 <div className="mt-2 text-xs font-bold text-indigo-700 bg-indigo-50 p-2 rounded border border-indigo-100">
                                    فقط {tafqeet(totals.netPayable)}
                                 </div>
                             </div>

                             <div className="w-full md:w-80 bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
                                 <div className="flex justify-between text-sm">
                                     <span className="font-bold text-slate-600">الإجمالي الفرعي:</span>
                                     <span className="font-mono text-slate-800">{totals.rawSubtotal.toFixed(2)}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-sm">
                                     <span className="font-bold text-rose-600">خصم إضافي:</span>
                                     <span className="font-mono text-rose-600">-{totals.globalDiscountAmount.toFixed(2)}</span>
                                 </div>
                                 <div className="flex justify-between text-sm">
                                     <span className="font-bold text-slate-600">ضريبة (14%):</span>
                                     <span className="font-mono text-slate-800">{totals.vatAmount.toFixed(2)}</span>
                                 </div>
                                 {invForm.withholdingTaxRate > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold text-amber-600">خصم المنبع ({invForm.withholdingTaxRate}%):</span>
                                        <span className="font-mono text-amber-600">-{totals.whtAmount.toFixed(2)}</span>
                                    </div>
                                 )}
                                 <div className="border-t border-slate-300 my-2"></div>
                                 <div className="flex justify-between text-xl font-bold">
                                     <span className="text-slate-800">الصافي للدفع:</span>
                                     <span className="font-mono text-blue-700 text-2xl">{totals.netPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Settings Panel */}
                <div className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 gap-6 shadow-inner overflow-y-auto">
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-3 border-b pb-2">إعدادات الفاتورة</h4>
                        <div className="mb-4">
                           <label className="text-xs font-bold text-slate-500 block mb-1">خصم إضافي</label>
                           <div className="flex gap-1 mb-1">
                              <button onClick={() => setInvForm({...invForm, additionalDiscountType: 'PERCENTAGE'})} className={`flex-1 py-1 text-xs rounded border ${invForm.additionalDiscountType === 'PERCENTAGE' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-500'}`}>نسبة %</button>
                              <button onClick={() => setInvForm({...invForm, additionalDiscountType: 'FIXED'})} className={`flex-1 py-1 text-xs rounded border ${invForm.additionalDiscountType === 'FIXED' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-500'}`}>مبلغ</button>
                           </div>
                           <input type="number" value={invForm.additionalDiscount} onChange={e => setInvForm({...invForm, additionalDiscount: Number(e.target.value)})} className="w-full p-2 border border-slate-200 rounded text-sm text-center font-bold" />
                        </div>
                        <div className="mb-4">
                           <label className="text-xs font-bold text-slate-500 block mb-1">خصم من المنبع</label>
                           <select value={invForm.withholdingTaxRate} onChange={e => setInvForm({...invForm, withholdingTaxRate: Number(e.target.value)})} className="w-full p-2 border border-slate-200 rounded text-sm bg-slate-50">
                              <option value="0">بدون خصم (0%)</option>
                              <option value="1">توريدات (1%)</option>
                              <option value="3">خدمات (3%)</option>
                           </select>
                        </div>
                    </div>
                    <div>
                       <h4 className="font-bold text-slate-800 text-sm mb-3 border-b pb-2">أدوات مساعدة</h4>
                       <button onClick={addLine} className="w-full flex items-center gap-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors text-xs font-bold mb-2"><Plus className="w-4 h-4" /> إضافة صنف جديد</button>
                       <button className="w-full flex items-center gap-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors text-xs font-bold mb-2"><Scan className="w-4 h-4" /> طباعة باركود</button>
                    </div>
                </div>
            </div>
        </div>
      );
  };

  const renderList = () => (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px] animate-fade-in">
         <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
             <h3 className="font-bold text-slate-700">سجل الفواتير</h3>
             <div className="flex-1"></div>
             <div className="relative w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="text" placeholder="بحث..." className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
             </div>
             <button onClick={handleCreateNewInvoice} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 shadow-sm flex items-center gap-2"><Plus className="w-4 h-4" /> جديد</button>
         </div>
         <div className="overflow-x-auto">
             <table className="w-full text-right text-sm">
                 <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                     <tr>
                        <th className="px-6 py-4">رقم الفاتورة</th>
                        <th className="px-6 py-4">العميل</th>
                        <th className="px-6 py-4">التاريخ</th>
                        <th className="px-6 py-4">طريقة الدفع</th>
                        <th className="px-6 py-4">الإجمالي</th>
                        <th className="px-6 py-4">الحالة</th>
                        <th className="px-6 py-4 text-center">إجراءات</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                     {invoices.map(inv => (
                         <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                             <td className="px-6 py-4 font-mono font-bold text-blue-600">{inv.id}</td>
                             <td className="px-6 py-4 font-bold text-slate-700">{inv.customerName}</td>
                             <td className="px-6 py-4 text-slate-500">{inv.date}</td>
                             <td className="px-6 py-4">
                                {inv.paymentType === 'CREDIT' ? <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">آجل</span> : <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">نقدي</span>}
                             </td>
                             <td className="px-6 py-4 font-bold text-slate-800">${inv.total.toLocaleString()}</td>
                             <td className="px-6 py-4">
                                 <span className={`px-2 py-1 rounded-full text-xs font-bold ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                     {inv.status === 'Paid' ? 'مدفوعة' : 'معلقة'}
                                 </span>
                             </td>
                             <td className="px-6 py-4 text-center">
                                 <div className="flex items-center justify-center gap-2">
                                     <button onClick={() => setPrintInvoice(inv)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Printer className="w-4 h-4" /></button>
                                     <button onClick={() => handleEditInvoice(inv)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"><Pencil className="w-4 h-4" /></button>
                                     <button onClick={() => setDeleteInvoiceId(inv.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                                 </div>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
      </div>
  );

  if (activeView === 'create') return renderInvoiceEditor();

  return (
    <div className="space-y-6 relative h-full">
        <div className="flex justify-between items-center">
             <div>
                <h2 className="text-2xl font-bold text-slate-800">المبيعات والفواتير</h2>
                <p className="text-slate-500 text-sm">إدارة الفواتير والمدفوعات والمستحقات.</p>
             </div>
             <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                <button onClick={() => setActiveView('dashboard')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeView === 'dashboard' ? 'bg-slate-100 text-slate-800' : 'text-slate-500'}`}>لوحة القيادة</button>
                <button onClick={() => setActiveView('list')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeView === 'list' ? 'bg-slate-100 text-slate-800' : 'text-slate-500'}`}>القائمة</button>
             </div>
        </div>

        {activeView === 'dashboard' ? (
           <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
                  <h2 className="text-3xl font-bold mb-2">نظام الفواتير المتقدم</h2>
                  <p className="text-blue-100 max-w-xl">إصدار فواتير ضريبية، متابعة مدفوعات العملاء، وإدارة المستحقات.</p>
                  <button onClick={handleCreateNewInvoice} className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
                      <Plus className="w-5 h-5" /> إصدار فاتورة جديدة
                  </button>
              </div>
           </div>
        ) : renderList()}
        
        {printInvoice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in zoom-in-95 duration-200">
               <div className="bg-white w-full h-full max-w-5xl rounded-xl shadow-2xl flex flex-col overflow-hidden">
                  <div className="bg-slate-800 text-white p-3 flex justify-between items-center no-print">
                     <h3 className="font-bold flex items-center gap-2"><Printer className="w-5 h-5"/> معاينة فاتورة ضريبية</h3>
                     <div className="flex gap-2">
                        <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-bold">طباعة</button>
                        <button onClick={() => setPrintInvoice(null)} className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg text-sm font-bold">إغلاق</button>
                     </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-10 bg-slate-100 flex justify-center">
                     <div className="bg-white w-[210mm] min-h-[297mm] shadow-2xl p-12 text-slate-900 relative">
                        {/* Header */}
                        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-8">
                           <div className="flex flex-col items-center">
                              <div className="w-24 h-24 border-2 border-slate-800 rounded-lg flex items-center justify-center mb-2">
                                <QrCode className="w-16 h-16 text-slate-800" />
                              </div>
                              <span className="text-xs font-bold text-slate-500">Scan for E-Invoice</span>
                           </div>
                           <div className="text-center">
                              <h1 className="text-3xl font-extrabold text-slate-800 tracking-wide mb-1">فاتورة ضريبية</h1>
                              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Tax Invoice</p>
                           </div>
                           <div className="text-left">
                              <div className="flex items-center gap-2 mb-1 justify-end">
                                 <Building2 className="w-5 h-5 text-slate-400" />
                                 <h2 className="text-xl font-bold text-slate-800">اسم الشركة</h2>
                              </div>
                              <p className="text-sm text-slate-500 mb-1">الرياض، المملكة العربية السعودية</p>
                              <p className="text-sm text-slate-500 mb-1">هاتف: 0501234567</p>
                              <p className="text-sm font-bold text-slate-700">رقم ضريبي: 300123456700003</p>
                           </div>
                        </div>

                        {/* Invoice Info Grid */}
                        <div className="grid grid-cols-2 gap-8 mb-8">
                           {/* Right: Invoice Meta */}
                           <div className="space-y-4">
                              <div className="flex justify-between border-b border-slate-200 pb-2">
                                 <span className="font-bold text-slate-600">رقم الفاتورة / Invoice No</span>
                                 <span className="font-mono font-bold text-slate-900 text-lg">{printInvoice.id}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-200 pb-2">
                                 <span className="font-bold text-slate-600">تاريخ الإصدار / Date</span>
                                 <span className="font-mono font-bold text-slate-900">{printInvoice.date}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-200 pb-2">
                                 <span className="font-bold text-slate-600">تاريخ الاستحقاق / Due Date</span>
                                 <span className="font-mono font-bold text-slate-900">{printInvoice.dueDate}</span>
                              </div>
                           </div>
                           
                           {/* Left: Customer Info */}
                           <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                              <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 border-b border-slate-200 pb-2">العميل / Bill To</h3>
                              <p className="font-bold text-lg text-slate-800 mb-1">{printInvoice.customerName}</p>
                              <div className="space-y-1 text-sm text-slate-500">
                                 <p className="flex items-center gap-2"><Phone className="w-3 h-3"/> 050xxxxxxx</p>
                                 <p className="flex items-center gap-2"><Mail className="w-3 h-3"/> client@example.com</p>
                                 <p className="font-bold text-slate-700 mt-2">رقم ضريبي: 300xxxxxxxxx</p>
                              </div>
                           </div>
                        </div>

                        {/* Items Table */}
                        <table className="w-full text-right border-collapse mb-8">
                           <thead>
                              <tr className="bg-slate-100 text-slate-700 border-y-2 border-slate-200">
                                 <th className="py-3 px-4 text-center w-12">#</th>
                                 <th className="py-3 px-4">الصنف / Description</th>
                                 <th className="py-3 px-4 text-center">الوحدة</th>
                                 <th className="py-3 px-4 text-center">الكمية</th>
                                 <th className="py-3 px-4 text-center">السعر</th>
                                 <th className="py-3 px-4 text-center">الإجمالي</th>
                              </tr>
                           </thead>
                           <tbody>
                              {printInvoice.items.map((item, i) => (
                                 <tr key={i} className="border-b border-slate-200">
                                    <td className="py-3 px-4 text-center text-slate-500 font-mono">{i + 1}</td>
                                    <td className="py-3 px-4 font-bold text-slate-800">{item.productName}</td>
                                    <td className="py-3 px-4 text-center text-slate-600 text-sm">{item.unit || '-'}</td>
                                    <td className="py-3 px-4 text-center font-bold font-mono">{item.quantity}</td>
                                    <td className="py-3 px-4 text-center font-mono">{item.price.toLocaleString()}</td>
                                    <td className="py-3 px-4 text-center font-mono font-bold">{item.total.toLocaleString()}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>

                        {/* Totals & Notes */}
                        <div className="flex flex-col md:flex-row gap-8 mb-12">
                           {/* Notes Area */}
                           <div className="flex-1">
                               <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-4 h-full">
                                  <h4 className="font-bold text-slate-700 mb-2 text-sm">التفقيط / Amount in Words</h4>
                                  <p className="text-slate-800 font-bold leading-relaxed">{printInvoice.amountInWords || tafqeet(printInvoice.total)}</p>
                               </div>
                           </div>

                           {/* Calculations */}
                           <div className="w-80">
                              <div className="space-y-3">
                                 <div className="flex justify-between text-sm">
                                    <span className="font-bold text-slate-600">الإجمالي (قبل الضريبة)</span>
                                    <span className="font-mono font-bold text-slate-900">{printInvoice.subtotal.toLocaleString()}</span>
                                 </div>
                                 {printInvoice.discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                       <span className="font-bold text-rose-600">خصم تجاري</span>
                                       <span className="font-mono font-bold text-rose-600">({printInvoice.discount.toLocaleString()})</span>
                                    </div>
                                 )}
                                 <div className="flex justify-between text-sm">
                                    <span className="font-bold text-slate-600">ضريبة القيمة المضافة (14%)</span>
                                    <span className="font-mono font-bold text-slate-900">{printInvoice.tax.toLocaleString()}</span>
                                 </div>
                                 {printInvoice.withholdingTaxAmount && printInvoice.withholdingTaxAmount > 0 && (
                                    <div className="flex justify-between text-sm">
                                       <span className="font-bold text-amber-600">خصم من المنبع</span>
                                       <span className="font-mono font-bold text-amber-600">({printInvoice.withholdingTaxAmount.toLocaleString()})</span>
                                    </div>
                                 )}
                                 <div className="border-t-2 border-slate-800 pt-3 flex justify-between items-center">
                                    <span className="font-bold text-xl text-slate-800">الصافي</span>
                                    <span className="font-mono font-extrabold text-2xl text-slate-900">{printInvoice.total.toLocaleString()}</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Footer */}
                        <div className="absolute bottom-12 left-12 right-12">
                            <div className="grid grid-cols-2 gap-12 mb-8">
                               <div>
                                  <h4 className="font-bold text-slate-700 mb-2 border-b pb-1">معلومات البنك</h4>
                                  <p className="text-sm text-slate-600">البنك الأهلي التجاري</p>
                                  <p className="text-sm text-slate-600 font-mono">IBAN: SA00 0000 0000 0000 0000 0000</p>
                               </div>
                               <div>
                                  <h4 className="font-bold text-slate-700 mb-2 border-b pb-1">الشروط والأحكام</h4>
                                  <p className="text-xs text-slate-500">الرجاء تحويل المبلغ المستحق قبل تاريخ الاستحقاق. البضاعة المباعة لا ترد ولا تستبدل بعد 14 يوم.</p>
                               </div>
                            </div>
                            <div className="flex justify-between items-end">
                               <div className="text-center w-40">
                                  <div className="h-16 border-b border-slate-400 mb-2"></div>
                                  <p className="font-bold text-sm text-slate-600">توقيع المستلم</p>
                               </div>
                               <div className="text-center w-40">
                                  <div className="h-16 border-b border-slate-400 mb-2"></div>
                                  <p className="font-bold text-sm text-slate-600">الختم والتوقيع</p>
                               </div>
                            </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
        )}
    </div>
  );
};
