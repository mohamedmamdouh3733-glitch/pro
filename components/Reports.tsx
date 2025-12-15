
import React, { useState, useMemo } from 'react';
import { Product, Invoice, FinancialDocument, Employee, Customer, Supplier, StockMovement } from '../types';
import { 
  BarChart2, TrendingUp, Package, Users, DollarSign, Calendar, FileText, Printer, Filter, 
  ArrowUpRight, ArrowDownLeft, Wallet, AlertTriangle, ClipboardList, History, XCircle, Search 
} from 'lucide-react';

interface ReportsProps {
  invoices: Invoice[];
  products: Product[];
  financialDocuments: FinancialDocument[];
  employees: Employee[];
  customers: Customer[];
  suppliers: Supplier[];
  stockMovements: StockMovement[];
}

// Helper to check date range
const isDateInRange = (dateStr: string, startStr: string, endStr: string) => {
  if (!startStr && !endStr) return true;
  const target = new Date(dateStr);
  const start = startStr ? new Date(startStr) : new Date('2000-01-01');
  const end = endStr ? new Date(endStr) : new Date('2100-01-01');
  return target.getTime() >= start.getTime() && target.getTime() <= end.getTime();
};

export const Reports: React.FC<ReportsProps> = ({
  invoices, products, financialDocuments, employees, customers, suppliers, stockMovements
}) => {
  // Filters State
  const [reportCategory, setReportCategory] = useState<'INVENTORY' | 'FINANCE' | 'SALES' | 'PARTNERS'>('INVENTORY');
  const [reportType, setReportType] = useState<string>('STOCK_BALANCE'); 
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]); 
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // --- DATA PROCESSING LOGIC ---

  // 1. INVENTORY REPORTS
  const inventoryData = useMemo(() => {
    switch (reportType) {
      case 'STOCK_BALANCE': // Current Stock
        return products.map(p => {
          const cost = p.cost || 0;
          const totalValue = p.stock * cost;
          return {
            col1: p.name,
            col2: p.category,
            col3: p.stock,
            col4: cost,
            col5: totalValue,
            status: p.status
          };
        });
      case 'SHORTAGES': // Low Stock
        return products.filter(p => p.stock <= (p.minStock || 0)).map(p => {
          const shortage = (p.minStock || 0) - p.stock;
          return {
            col1: p.name,
            col2: p.stock,
            col3: p.minStock,
            col4: shortage,
            col5: 'يجب الطلب'
          };
        });
      case 'MOVEMENTS': // Stock Movements
        return stockMovements
          .filter(m => isDateInRange(m.date, startDate, endDate))
          .map(m => {
             const prod = products.find(p => p.id === m.productId);
             let typeName = 'أخرى';
             if (m.type === 'SALE') typeName = 'بيع';
             else if (m.type === 'PURCHASE') typeName = 'شراء';
             else if (m.type === 'TRANSFER') typeName = 'تحويل';
             else if (m.type === 'ADJUSTMENT') typeName = 'تسوية';

             return {
               col1: m.date,
               col2: prod?.name || 'Unknown',
               col3: typeName,
               col4: m.quantity,
               col5: m.user
             };
          }).sort((a,b) => new Date(b.col1).getTime() - new Date(a.col1).getTime());
      case 'DAMAGES': // Damaged/Adjusted Out
        return stockMovements
          .filter(m => isDateInRange(m.date, startDate, endDate) && m.type === 'ADJUSTMENT' && m.quantity < 0)
          .map(m => {
             const prod = products.find(p => p.id === m.productId);
             const qty = Math.abs(m.quantity);
             const cost = prod?.cost || 0;
             const loss = qty * cost;
             return {
               col1: m.date,
               col2: prod?.name || 'Unknown',
               col3: qty,
               col4: cost,
               col5: loss,
               notes: m.notes
             };
          });
      default: return [];
    }
  }, [reportType, products, stockMovements, startDate, endDate]);

  // 2. FINANCE REPORTS
  const financeData = useMemo(() => {
     switch (reportType) {
        case 'INCOME_STATEMENT': 
           const income = financialDocuments.filter(d => d.type === 'RECEIPT_VOUCHER' && isDateInRange(d.date, startDate, endDate));
           const expense = financialDocuments.filter(d => d.type !== 'RECEIPT_VOUCHER' && isDateInRange(d.date, startDate, endDate));
           const mappedIncome = income.map(d => ({ col1: d.date, col2: 'إيراد / قبض', col3: d.description, col4: d.amount, type: 'IN' }));
           const mappedExpense = expense.map(d => ({ col1: d.date, col2: 'مصروف / صرف', col3: d.description, col4: d.amount, type: 'OUT' }));
           return [...mappedIncome, ...mappedExpense].sort((a,b) => new Date(b.col1).getTime() - new Date(a.col1).getTime());
        default: return [];
     }
  }, [reportType, financialDocuments, startDate, endDate]);

  // 3. PARTNERS REPORTS
  const partnersData = useMemo(() => {
     if (reportType === 'CUSTOMER_BALANCES') {
        return customers.map(c => ({ col1: c.name, col2: c.phone, col3: c.category, col4: c.lastOrderDate || '-', col5: c.balance }));
     }
     if (reportType === 'SUPPLIER_BALANCES') {
        return suppliers.map(s => ({ col1: s.name, col2: s.phone, col3: s.contactPerson, col4: '-', col5: s.balance }));
     }
     return [];
  }, [reportType, customers, suppliers]);


  // --- RENDERERS ---

  const renderSidebar = () => (
    <div className="w-full md:w-64 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 h-fit no-print">
       <h3 className="font-bold text-slate-800 mb-4 px-2">أنواع التقارير</h3>
       
       <div className="space-y-6">
          {/* Inventory Group */}
          <div>
             <div 
               className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${reportCategory === 'INVENTORY' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
               onClick={() => { setReportCategory('INVENTORY'); setReportType('STOCK_BALANCE'); }}
             >
                <Package className="w-5 h-5" />
                <span className="font-bold text-sm">تقارير المخزون</span>
             </div>
             {reportCategory === 'INVENTORY' && (
                <div className="mr-6 mt-2 space-y-1 border-r-2 border-indigo-100 pr-2">
                   <button onClick={() => setReportType('STOCK_BALANCE')} className={`block w-full text-right text-xs py-1.5 px-2 rounded ${reportType === 'STOCK_BALANCE' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-500 hover:text-indigo-600'}`}>جرد المخزون الحالي</button>
                   <button onClick={() => setReportType('SHORTAGES')} className={`block w-full text-right text-xs py-1.5 px-2 rounded ${reportType === 'SHORTAGES' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-500 hover:text-indigo-600'}`}>النواقص وحد الطلب</button>
                   <button onClick={() => setReportType('MOVEMENTS')} className={`block w-full text-right text-xs py-1.5 px-2 rounded ${reportType === 'MOVEMENTS' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-500 hover:text-indigo-600'}`}>سجل الحركات التفصيلي</button>
                   <button onClick={() => setReportType('DAMAGES')} className={`block w-full text-right text-xs py-1.5 px-2 rounded ${reportType === 'DAMAGES' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-500 hover:text-indigo-600'}`}>تقرير التوالف والإتلاف</button>
                </div>
             )}
          </div>

          {/* Finance Group */}
          <div>
             <div 
               className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${reportCategory === 'FINANCE' ? 'bg-rose-50 text-rose-700' : 'text-slate-600 hover:bg-slate-50'}`}
               onClick={() => { setReportCategory('FINANCE'); setReportType('INCOME_STATEMENT'); }}
             >
                <DollarSign className="w-5 h-5" />
                <span className="font-bold text-sm">التقارير المالية</span>
             </div>
             {reportCategory === 'FINANCE' && (
                <div className="mr-6 mt-2 space-y-1 border-r-2 border-rose-100 pr-2">
                   <button onClick={() => setReportType('INCOME_STATEMENT')} className={`block w-full text-right text-xs py-1.5 px-2 rounded ${reportType === 'INCOME_STATEMENT' ? 'text-rose-600 font-bold bg-rose-50/50' : 'text-slate-500 hover:text-rose-600'}`}>كشف حركة الأموال</button>
                </div>
             )}
          </div>

          {/* Partners Group */}
          <div>
             <div 
               className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${reportCategory === 'PARTNERS' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
               onClick={() => { setReportCategory('PARTNERS'); setReportType('CUSTOMER_BALANCES'); }}
             >
                <Users className="w-5 h-5" />
                <span className="font-bold text-sm">العملاء والموردين</span>
             </div>
             {reportCategory === 'PARTNERS' && (
                <div className="mr-6 mt-2 space-y-1 border-r-2 border-blue-100 pr-2">
                   <button onClick={() => setReportType('CUSTOMER_BALANCES')} className={`block w-full text-right text-xs py-1.5 px-2 rounded ${reportType === 'CUSTOMER_BALANCES' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-500 hover:text-blue-600'}`}>أرصدة العملاء</button>
                   <button onClick={() => setReportType('SUPPLIER_BALANCES')} className={`block w-full text-right text-xs py-1.5 px-2 rounded ${reportType === 'SUPPLIER_BALANCES' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-500 hover:text-blue-600'}`}>أرصدة الموردين</button>
                </div>
             )}
          </div>
       </div>
    </div>
  );

  const getReportTitle = () => {
     switch(reportType) {
        case 'STOCK_BALANCE': return 'تقرير جرد المخزون الشامل';
        case 'SHORTAGES': return 'تقرير النواقص وحد الطلب';
        case 'MOVEMENTS': return 'سجل حركات المخزون التفصيلي';
        case 'DAMAGES': return 'تقرير التوالف والإتلاف المخزني';
        case 'INCOME_STATEMENT': return 'سجل الحركات المالية (مقبوضات ومدفوعات)';
        case 'CUSTOMER_BALANCES': return 'كشف أرصدة العملاء';
        case 'SUPPLIER_BALANCES': return 'كشف أرصدة الموردين';
        default: return 'تقرير';
     }
  };

  const getTableHeaders = () => {
     switch(reportType) {
        case 'STOCK_BALANCE': return ['اسم المنتج', 'التصنيف', 'الكمية الحالية', 'متوسط التكلفة', 'إجمالي القيمة'];
        case 'SHORTAGES': return ['اسم المنتج', 'الرصيد الحالي', 'حد الطلب', 'الكمية المطلوبة', 'الحالة'];
        case 'MOVEMENTS': return ['التاريخ', 'المنتج', 'نوع الحركة', 'الكمية', 'المستخدم'];
        case 'DAMAGES': return ['التاريخ', 'المنتج', 'الكمية التالفة', 'تكلفة الوحدة', 'إجمالي الخسارة'];
        case 'INCOME_STATEMENT': return ['التاريخ', 'نوع العملية', 'البيان', 'المبلغ', ''];
        case 'CUSTOMER_BALANCES': return ['اسم العميل', 'الهاتف', 'التصنيف', 'آخر طلب', 'الرصيد الحالي'];
        case 'SUPPLIER_BALANCES': return ['اسم المورد', 'الهاتف', 'المسؤول', '-', 'الرصيد المستحق'];
        default: return [];
     }
  };

  const totalValue = inventoryData.reduce((s, i) => s + (Number(i.col5) || 0), 0);

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in pb-10">
      
      {/* Sidebar Navigation */}
      {renderSidebar()}

      {/* Main Report Area */}
      <div className="flex-1 space-y-6">
         
         {/* Filter Bar */}
         <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-end md:items-center justify-between gap-4 no-print">
            <div>
               <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-indigo-600" />
                  {getReportTitle()}
               </h2>
               <p className="text-sm text-slate-500 mt-1">قم بتحديد الفترة الزمنية لعرض البيانات</p>
            </div>
            
            <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
               <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500">من تاريخ</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
               </div>
               <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500">إلى تاريخ</label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
               </div>
               <div className="flex flex-col gap-1 justify-end h-full">
                  <label className="opacity-0 text-[10px]">Action</label>
                  <button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-900 transition-colors shadow-lg">
                     <Printer className="w-4 h-4" /> طباعة
                  </button>
               </div>
            </div>
         </div>

         {/* Report Content (Printable) */}
         <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[500px]" id="printable-report">
            
            {/* Print Header */}
            <div className="border-b-2 border-slate-800 pb-6 mb-6 flex justify-between items-start">
               <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 mb-2">{getReportTitle()}</h1>
                  <div className="flex gap-4 text-sm text-slate-600">
                     <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> الفترة: {startDate} إلى {endDate}</span>
                     <span className="flex items-center gap-1"><Filter className="w-4 h-4" /> التصنيف: {reportCategory}</span>
                  </div>
               </div>
               <div className="text-left">
                  <h2 className="text-lg font-bold text-slate-800">NexGen ERP</h2>
                  <p className="text-xs text-slate-500">تاريخ الإصدار: {new Date().toLocaleDateString()}</p>
               </div>
            </div>

            {/* Summary Cards based on Report Type */}
            {reportType === 'STOCK_BALANCE' && (
               <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                     <p className="text-slate-500 text-xs font-bold">إجمالي الأصناف</p>
                     <p className="text-2xl font-bold text-slate-800">{inventoryData.length}</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                     <p className="text-emerald-700 text-xs font-bold">إجمالي قيمة المخزون (تكلفة)</p>
                     <p className="text-2xl font-bold text-emerald-800">${totalValue.toLocaleString()}</p>
                  </div>
               </div>
            )}

            {reportType === 'DAMAGES' && (
               <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 mb-8 flex items-center gap-4">
                  <AlertTriangle className="w-8 h-8 text-rose-600" />
                  <div>
                     <p className="text-rose-700 text-sm font-bold">إجمالي قيمة الخسائر / التوالف للفترة المحددة</p>
                     <p className="text-2xl font-bold text-rose-800">${totalValue.toLocaleString()}</p>
                  </div>
               </div>
            )}

            {/* Data Table */}
            <div className="overflow-x-auto">
               <table className="w-full text-right text-sm border-collapse">
                  <thead>
                     <tr className="bg-slate-100 text-slate-700 border-y border-slate-300">
                        {getTableHeaders().map((h, i) => (
                           <th key={i} className="py-3 px-4 font-bold">{h}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                     {/* Dynamic Rendering based on active data set */}
                     {(reportCategory === 'INVENTORY' ? inventoryData : 
                       reportCategory === 'FINANCE' ? financeData : 
                       partnersData).map((row: any, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                           <td className="py-3 px-4 font-bold text-slate-800">{row.col1}</td>
                           <td className="py-3 px-4 text-slate-600">{row.col2}</td>
                           <td className="py-3 px-4 text-slate-600">{row.col3}</td>
                           <td className="py-3 px-4 font-mono text-slate-700 dir-ltr">{typeof row.col4 === 'number' ? row.col4.toLocaleString() : row.col4}</td>
                           <td className={`py-3 px-4 font-bold ${
                              reportType === 'DAMAGES' ? 'text-rose-600' : 
                              (row.type === 'IN' || (typeof row.col5 === 'number' && row.col5 > 0)) ? 'text-emerald-700' : 'text-slate-800'
                           }`}>
                              {typeof row.col5 === 'number' ? row.col5.toLocaleString() : row.col5}
                              {row.type === 'IN' && <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded mr-2">وارد</span>}
                              {row.type === 'OUT' && <span className="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded mr-2">صادر</span>}
                           </td>
                        </tr>
                     ))}
                     
                     {/* Empty States */}
                     {((reportCategory === 'INVENTORY' && inventoryData.length === 0) || 
                       (reportCategory === 'FINANCE' && financeData.length === 0) ||
                       (reportCategory === 'PARTNERS' && partnersData.length === 0)) && (
                        <tr>
                           <td colSpan={5} className="py-12 text-center text-slate-400">
                              لا توجد بيانات للعرض في هذه الفترة.
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>

            {/* Print Footer */}
            <div className="hidden print:flex justify-between items-end mt-12 pt-8 border-t border-slate-300">
               <div className="text-center w-32">
                  <p className="font-bold text-sm mb-8">المحاسب</p>
                  <div className="border-b border-slate-400"></div>
               </div>
               <div className="text-center w-32">
                  <p className="font-bold text-sm mb-8">مدير المستودع</p>
                  <div className="border-b border-slate-400"></div>
               </div>
               <div className="text-center w-32">
                  <p className="font-bold text-sm mb-8">المدير العام</p>
                  <div className="border-b border-slate-400"></div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};
