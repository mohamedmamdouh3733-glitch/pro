
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Sales } from './components/Sales';
import { Customers } from './components/Customers';
import { Purchasing } from './components/Purchasing';
import { Suppliers } from './components/Suppliers';
import { AIInsights } from './components/AIInsights';
import { Settings } from './components/Settings';
import { HR } from './components/HR';
import { FinanceCOA } from './components/FinanceCOA';
import { FinanceTreasury } from './components/FinanceTreasury';
import { FinanceDashboard } from './components/FinanceDashboard';
import { Reports } from './components/Reports';
import { Login } from './components/Login';
import { ModuleType, KPI, SalesData, Product, Category, Unit, Warehouse, StockMovement, StockOperationPayload, Customer, Supplier, AppNotification, Employee, Payroll, LeaveRequest, Account, JournalEntry, TreasuryAccount, TreasuryTransaction, Voucher, Budget, FinancialDocument, CustomerTransaction, CustomerInteraction, Invoice, SupplierTransaction, PurchaseOrder } from './types';
import { Bell, Search, Menu, CheckCircle2, AlertTriangle, Info, Trash2 } from 'lucide-react';

// --- Local Storage Helper ---
function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useStickyState<boolean>(false, 'erp_auth_v1');
  const [currentUser, setCurrentUser] = useStickyState<{name: string, role: string}>({ name: 'أحمد محمد', role: 'مدير النظام' }, 'erp_current_user');
  const [currentModule, setCurrentModule] = useState<ModuleType>(ModuleType.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Initial Mock Data (Used only on first load) ---
  const initialProducts: Product[] = [
    { id: 'P-1001', name: 'سماعة بلوتوث احترافية', category: 'إلكترونيات', price: 120, cost: 80, stock: 45, unit: 'قطعة', barcode: '629104001', minStock: 10, status: 'In Stock', lastUpdated: '2023-10-25' },
    { id: 'P-1002', name: 'كرسي مكتب مريح', category: 'أثاث', price: 350, cost: 200, stock: 8, unit: 'قطعة', barcode: '629104002', minStock: 5, status: 'Low Stock', lastUpdated: '2023-10-24' },
  ];
  
  const initialCustomers: Customer[] = [
    { id: 'C-001', name: 'شركة الأفق للتجارة', phone: '0501234567', email: 'contact@alufq.com', address: 'الرياض, العليا', balance: 5400, status: 'Active', creditLimit: 10000, category: 'VIP', taxNumber: '30001231230003' },
  ];

  const initialSuppliers: Supplier[] = [
    { id: 'S-001', name: 'المتحدة للإلكترونيات', contactPerson: 'م. أحمد', phone: '0101010101', balance: 25000, rating: 5, status: 'Active', address: 'الرياض, المنطقة الصناعية', taxNumber: '30099887766001' },
  ];

  const initialAccounts: Account[] = [
    { id: 'ACC-101', code: '101', name: 'النقدية في الخزينة', type: 'ASSET', balance: 50000, isHeader: false, level: 1 },
    { id: 'ACC-102', code: '102', name: 'البنك الأهلي', type: 'ASSET', balance: 125000, isHeader: false, level: 1 },
    { id: 'ACC-301', code: '301', name: 'رأس المال', type: 'EQUITY', balance: 250000, isHeader: false, level: 1 },
    { id: 'ACC-401', code: '401', name: 'إيرادات المبيعات', type: 'REVENUE', balance: 180000, isHeader: false, level: 1 },
    { id: 'ACC-501', code: '501', name: 'تكلفة البضاعة المباعة', type: 'EXPENSE', balance: 95000, isHeader: false, level: 1 },
  ];

  // --- State with Local Persistence ---
  const [notifications, setNotifications] = useStickyState<AppNotification[]>([], 'erp_notifications');
  const [products, setProducts] = useStickyState<Product[]>(initialProducts, 'erp_products');
  const [categories, setCategories] = useStickyState<Category[]>([
    { id: 'CAT-001', name: 'إلكترونيات', itemCount: 150 }, { id: 'CAT-002', name: 'أثاث', itemCount: 45 }
  ], 'erp_categories');
  const [units, setUnits] = useStickyState<Unit[]>([
    { id: 'U-001', name: 'قطعة', shortName: 'PCS' }, { id: 'U-002', name: 'كرتونة', shortName: 'BOX' }
  ], 'erp_units');
  const [warehouses, setWarehouses] = useStickyState<Warehouse[]>([
    { id: 'WH-001', name: 'المخزن الرئيسي', location: 'المنطقة الصناعية' }
  ], 'erp_warehouses');
  const [movements, setMovements] = useStickyState<StockMovement[]>([], 'erp_movements');
  const [customers, setCustomers] = useStickyState<Customer[]>(initialCustomers, 'erp_customers');
  const [invoices, setInvoices] = useStickyState<Invoice[]>([], 'erp_invoices');
  const [customerTransactions, setCustomerTransactions] = useStickyState<CustomerTransaction[]>([], 'erp_cust_transactions');
  const [customerInteractions, setCustomerInteractions] = useStickyState<CustomerInteraction[]>([], 'erp_cust_interactions');
  const [suppliers, setSuppliers] = useStickyState<Supplier[]>(initialSuppliers, 'erp_suppliers');
  const [supplierTransactions, setSupplierTransactions] = useStickyState<SupplierTransaction[]>([], 'erp_supp_transactions');
  const [purchaseOrders, setPurchaseOrders] = useStickyState<PurchaseOrder[]>([], 'erp_purchase_orders');
  const [employees, setEmployees] = useStickyState<Employee[]>([], 'erp_employees');
  const [payrolls, setPayrolls] = useStickyState<Payroll[]>([], 'erp_payrolls');
  const [leaves, setLeaves] = useStickyState<LeaveRequest[]>([], 'erp_leaves');
  const [accounts, setAccounts] = useStickyState<Account[]>(initialAccounts, 'erp_accounts');
  const [journalEntries, setJournalEntries] = useStickyState<JournalEntry[]>([], 'erp_journal_entries');
  const [treasuryAccounts, setTreasuryAccounts] = useStickyState<TreasuryAccount[]>([
    { id: 'TR-01', name: 'الخزينة الرئيسية', type: 'CASH', balance: 50000, currency: 'SAR' }
  ], 'erp_treasury_accounts');
  const [treasuryTransactions, setTreasuryTransactions] = useStickyState<TreasuryTransaction[]>([], 'erp_treasury_tx');
  const [financialDocuments, setFinancialDocuments] = useStickyState<FinancialDocument[]>([], 'erp_financial_docs');
  const [budgets, setBudgets] = useStickyState<Budget[]>([], 'erp_budgets');

  // Hardcoded Dashboard Data
  const kpis: KPI[] = [
    { title: 'إجمالي المبيعات', value: '$124,500', change: 12.5, icon: 'dollar', color: 'blue' },
    { title: 'العملاء الجدد', value: customers.length.toString(), change: 8.2, icon: 'users', color: 'emerald' },
    { title: 'الطلبات', value: invoices.length.toString(), change: -2.4, icon: 'cart', color: 'amber' },
    { title: 'صافي الربح', value: '$45,200', change: 15.3, icon: 'trend', color: 'rose' },
  ];

  const salesData: SalesData[] = [
    { name: 'يناير', revenue: 4000, profit: 2400 },
    { name: 'فبراير', revenue: 3000, profit: 1398 },
    { name: 'مارس', revenue: 2000, profit: 9800 },
    { name: 'أبريل', revenue: 2780, profit: 3908 },
    { name: 'مايو', revenue: 1890, profit: 4800 },
  ];

  const addNotification = (title: string, message: string, type: 'info' | 'warning' | 'success' | 'error') => {
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: 'الآن',
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // --- Handlers ---
  const handleLogin = (user: { name: string; role: string }) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    addNotification('تسجيل دخول', `مرحباً بك في نظام NexGen ERP، ${user.name}`, 'info');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleAddCustomer = (c: Customer) => {
    setCustomers(prev => [...prev, c]);
    addNotification('عميل جديد', `تم إضافة العميل ${c.name} بنجاح`, 'success');
  };

  const handleUpdateCustomer = (c: Customer) => {
    setCustomers(prev => prev.map(cust => cust.id === c.id ? c : cust));
    addNotification('تحديث بيانات', `تم تحديث بيانات العميل ${c.name}`, 'info');
  };

  const handleDeleteCustomer = (id: string) => {
    const cust = customers.find(c => c.id === id);
    setCustomers(prev => prev.filter(c => c.id !== id));
    addNotification('حذف عميل', `تم حذف العميل ${cust?.name} نهائياً`, 'warning');
  };

  const handleAddSupplier = (s: Supplier) => {
    setSuppliers(prev => [...prev, s]);
    addNotification('مورد جديد', `تم إضافة المورد ${s.name} بنجاح`, 'success');
  };

  const handleUpdateSupplier = (s: Supplier) => {
    setSuppliers(prev => prev.map(supp => supp.id === s.id ? s : supp));
    addNotification('تحديث مورد', `تم تحديث بيانات المورد ${s.name}`, 'info');
  };

  const handleDeleteSupplier = (id: string) => {
    const supp = suppliers.find(s => s.id === id);
    setSuppliers(prev => prev.filter(s => s.id !== id));
    addNotification('حذف مورد', `تم حذف المورد ${supp?.name}`, 'warning');
  };

  const handleAddInvoice = (inv: Invoice) => {
     setInvoices(prev => [...prev, inv]);
     addNotification('فاتورة جديدة', `تم إصدار فاتورة مبيعات جديدة للعميل ${inv.customerName}`, 'success');
  };

  const handleUpdateInvoice = (inv: Invoice) => {
     setInvoices(prev => prev.map(i => i.id === inv.id ? inv : i));
  };

  const handleDeleteInvoice = (id: string) => {
     setInvoices(prev => prev.filter(i => i.id !== id));
     addNotification('حذف فاتورة', 'تم حذف الفاتورة بنجاح.', 'warning');
  };

  const handleAddPurchaseOrder = (order: PurchaseOrder) => {
    setPurchaseOrders(prev => [...prev, order]);
    addNotification('أمر شراء', `تم إنشاء أمر شراء جديد للمورد ${order.supplierName}`, 'success');
  };

  const handleUpdatePurchaseOrder = (order: PurchaseOrder) => {
    setPurchaseOrders(prev => prev.map(po => po.id === order.id ? order : po));
    addNotification('تحديث أمر شراء', `تم تحديث أمر الشراء ${order.id}`, 'info');
  };

  const handleDeletePurchaseOrder = (id: string) => {
    setPurchaseOrders(prev => prev.filter(po => po.id !== id));
    addNotification('حذف أمر شراء', 'تم حذف أمر الشراء بنجاح.', 'warning');
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
    addNotification('منتج جديد', `تم إضافة المنتج "${newProduct.name}" بنجاح.`, 'success');
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
    if (product) {
      addNotification('حذف منتج', `تم حذف المنتج "${product.name}" من النظام.`, 'info');
    }
  };

  const handleStockOperation = (payload: StockOperationPayload) => {
    const product = products.find(p => p.id === payload.productId);
    if (!product) return;

    let quantityChange = 0;
    let movementType: any = 'ADJUSTMENT';

    if (payload.type === 'STOCKTAKING') {
       quantityChange = payload.quantity; 
       movementType = 'ADJUSTMENT';
    } else if (payload.type === 'ADJUSTMENT') {
       quantityChange = payload.adjustmentType === 'OUT' ? -payload.quantity : payload.quantity;
       movementType = 'ADJUSTMENT';
    } else if (payload.type === 'TRANSFER') {
       quantityChange = -payload.quantity;
       movementType = 'TRANSFER';
    }

    const newStock = product.stock + quantityChange;
    const newStatus = newStock <= 0 ? 'Out of Stock' : (newStock <= (product.minStock || 0) ? 'Low Stock' : 'In Stock');

    const updatedProduct = {
      ...product,
      stock: newStock,
      status: newStatus as any,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    handleUpdateProduct(updatedProduct);

    const newMovement: StockMovement = {
      id: `MV-${Math.floor(Math.random() * 10000)}`,
      productId: product.id,
      date: new Date().toISOString().split('T')[0],
      type: movementType,
      quantity: quantityChange,
      balanceAfter: newStock,
      warehouseId: payload.warehouseId || 'WH-001',
      reference: `${payload.type.substring(0,3)}-${Math.floor(Math.random() * 1000)}`,
      notes: payload.notes,
      user: 'Admin'
    };
    setMovements(prev => [newMovement, ...prev]);

    if (newStock <= (product.minStock || 0)) {
       addNotification(
         'تنبيه مخزون منخفض', 
         `المنتج "${product.name}" وصل للحد الأدنى. الرصيد الحالي: ${newStock} ${product.unit}`, 
         'warning'
       );
    }
  };

  const handleAddAccount = (account: Account) => {
     setAccounts(prev => [...prev, account]);
     addNotification('حساب جديد', `تم إضافة الحساب "${account.name}" بنجاح.`, 'success');
  };

  const handleUpdateAccount = (account: Account) => {
     setAccounts(prev => prev.map(a => a.id === account.id ? account : a));
     addNotification('تعديل حساب', `تم تحديث بيانات الحساب "${account.name}".`, 'info');
  };

  const handleDeleteAccount = (id: string) => {
     const acc = accounts.find(a => a.id === id);
     setAccounts(prev => prev.filter(a => a.id !== id));
     addNotification('حذف حساب', `تم حذف الحساب "${acc?.name}".`, 'warning');
  };

  const handleAddJournalEntry = (entry: JournalEntry) => {
      setJournalEntries(prev => [entry, ...prev]);
      const newAccounts = [...accounts];
      entry.lines.forEach(line => {
         const accIndex = newAccounts.findIndex(a => a.id === line.accountId);
         if(accIndex >= 0) {
            const acc = newAccounts[accIndex];
            let change = 0;
            if (['ASSET', 'EXPENSE'].includes(acc.type)) {
               change = line.debit - line.credit;
            } else {
               change = line.credit - line.debit;
            }
            newAccounts[accIndex] = { ...acc, balance: acc.balance + change };
         }
      });
      setAccounts(newAccounts);
      addNotification('قيد يومية', `تم ترحيل القيد رقم ${entry.reference} بنجاح.`, 'success');
  };

  const handleVoucherOperation = (voucher: Voucher) => {
    let debitLine, creditLine;
    let descriptionPrefix = '';
    let docType: 'PAYMENT_VOUCHER' | 'RECEIPT_VOUCHER' = 'PAYMENT_VOUCHER';

    if (voucher.type === 'PAYMENT') {
       creditLine = { id: 'L1', accountId: voucher.accountId, debit: 0, credit: voucher.amount };
       debitLine = { id: 'L2', accountId: voucher.targetAccountId, debit: voucher.amount, credit: 0 };
       descriptionPrefix = 'سند صرف: ';
       docType = 'PAYMENT_VOUCHER';
    } else {
       debitLine = { id: 'L1', accountId: voucher.accountId, debit: voucher.amount, credit: 0 };
       creditLine = { id: 'L2', accountId: voucher.targetAccountId, debit: 0, credit: voucher.amount };
       descriptionPrefix = 'سند قبض: ';
       docType = 'RECEIPT_VOUCHER';
    }

    const reference = voucher.reference || `VCH-${Math.floor(Math.random() * 10000)}`;
    const entry: JournalEntry = {
       id: `JE-${Date.now()}`,
       date: voucher.date,
       reference: reference,
       description: `${descriptionPrefix}${voucher.description}`,
       status: 'Posted',
       createdAt: new Date().toISOString(),
       lines: [debitLine, creditLine]
    };
    const doc: FinancialDocument = {
       id: `DOC-${Date.now()}`,
       type: docType,
       date: voucher.date,
       reference: reference,
       description: voucher.description,
       amount: voucher.amount,
       status: 'Posted',
       beneficiary: 'عام'
    };

    setFinancialDocuments(prev => [doc, ...prev]);
    handleAddJournalEntry(entry);
    addNotification('عملية مالية', `تم تسجيل ${descriptionPrefix} بقيمة ${voucher.amount}`, 'success');
  };

  const handlePettyCashSettlement = (totalAmount: number, expenses: { accountId: string, amount: number }[]) => {
     const cashAccount = accounts.find(a => a.name.includes('النقدية')) || accounts[0];
     const creditLine = { id: 'L-Credit', accountId: cashAccount.id, debit: 0, credit: totalAmount };
     const debitLines = expenses.map((exp, idx) => ({
        id: `L-Debit-${idx}`,
        accountId: exp.accountId,
        debit: exp.amount,
        credit: 0
     }));
     const reference = `PC-${Math.floor(Math.random() * 1000)}`;
     const entry: JournalEntry = {
        id: `JE-PC-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        reference: reference,
        description: 'تسوية عهدة / مصروفات نقدية',
        status: 'Posted',
        createdAt: new Date().toISOString(),
        lines: [creditLine, ...debitLines]
     };
     const doc: FinancialDocument = {
        id: `DOC-PC-${Date.now()}`,
        type: 'PETTY_CASH',
        date: new Date().toISOString().split('T')[0],
        reference: reference,
        description: 'تسوية عهدة مصروفات',
        amount: totalAmount,
        status: 'Posted',
        details: expenses
     };
     setFinancialDocuments(prev => [doc, ...prev]);
     handleAddJournalEntry(entry);
     addNotification('تسوية عهدة', `تم تسوية مصروفات بقيمة ${totalAmount}`, 'success');
  };

  const handleDeleteDocument = (id: string) => {
     setFinancialDocuments(prev => prev.filter(d => d.id !== id));
     addNotification('حذف مستند', 'تم حذف المستند المالي بنجاح (تنبيه: يجب مراجعة القيود يدوياً)', 'warning');
  };

  const handleAddTreasuryAccount = (acc: TreasuryAccount) => {
    setTreasuryAccounts(prev => [...prev, acc]);
    addNotification('خزينة/بنك جديد', `تم إضافة الحساب "${acc.name}" بنجاح.`, 'success');
  };

  const handleUpdateTreasuryAccount = (acc: TreasuryAccount) => {
    setTreasuryAccounts(prev => prev.map(a => a.id === acc.id ? acc : a));
    addNotification('تحديث حساب', `تم تعديل بيانات الحساب "${acc.name}".`, 'info');
  };

  const handleDeleteTreasuryAccount = (id: string) => {
    const acc = treasuryAccounts.find(a => a.id === id);
    setTreasuryAccounts(prev => prev.filter(a => a.id !== id));
    addNotification('حذف حساب', `تم حذف حساب "${acc?.name}".`, 'warning');
  };

  const handleTreasuryTransaction = (payload: { type: 'INCOME'|'EXPENSE'|'TRANSFER', amount: number, accountId: string, targetAccountId?: string, description: string, category: string }) => {
     const updatedAccounts = [...treasuryAccounts];
     const sourceIdx = updatedAccounts.findIndex(a => a.id === payload.accountId);
     
     if(sourceIdx === -1) return;

     if(payload.type === 'INCOME') {
        updatedAccounts[sourceIdx].balance += payload.amount;
     } else if(payload.type === 'EXPENSE') {
        updatedAccounts[sourceIdx].balance -= payload.amount;
     } else if(payload.type === 'TRANSFER' && payload.targetAccountId) {
        const targetIdx = updatedAccounts.findIndex(a => a.id === payload.targetAccountId);
        if(targetIdx !== -1) {
           updatedAccounts[sourceIdx].balance -= payload.amount;
           updatedAccounts[targetIdx].balance += payload.amount;
        }
     }
     setTreasuryAccounts(updatedAccounts);

     const newTx: TreasuryTransaction = {
        id: `TX-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: payload.type,
        amount: payload.amount,
        accountId: payload.accountId,
        targetAccountId: payload.targetAccountId,
        description: payload.description,
        category: payload.category
     };
     setTreasuryTransactions(prev => [newTx, ...prev]);
     addNotification(payload.type === 'TRANSFER' ? 'تحويل أموال' : payload.type === 'INCOME' ? 'عملية إيداع' : 'عملية صرف', `تم تنفيذ العملية بقيمة ${payload.amount}`, 'success');
  };

  const renderContent = () => {
    switch (currentModule) {
      case ModuleType.DASHBOARD:
        return <Dashboard kpis={kpis} salesData={salesData} notifications={notifications} />;
      case ModuleType.REPORTS:
        return (
          <Reports 
            invoices={invoices} products={products} financialDocuments={financialDocuments}
            employees={employees} customers={customers} suppliers={suppliers} stockMovements={movements}
          />
        );
      case ModuleType.INVENTORY:
        return (
          <Inventory 
            products={products} categories={categories} units={units} warehouses={warehouses} stockMovements={movements}
            onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct} onStockOperation={handleStockOperation}
          />
        );
      case ModuleType.CUSTOMERS:
        return <Customers customers={customers} transactions={customerTransactions} interactions={customerInteractions} onAddCustomer={handleAddCustomer} onUpdateCustomer={handleUpdateCustomer} onDeleteCustomer={handleDeleteCustomer} />;
      case ModuleType.SALES:
        return <Sales customers={customers} invoices={invoices} products={products} onAddInvoice={handleAddInvoice} onUpdateInvoice={handleUpdateInvoice} onDeleteInvoice={handleDeleteInvoice} />;
      case ModuleType.SUPPLIERS:
        return <Suppliers suppliers={suppliers} transactions={supplierTransactions} onAddSupplier={handleAddSupplier} onUpdateSupplier={handleUpdateSupplier} onDeleteSupplier={handleDeleteSupplier} />;
      case ModuleType.PURCHASING:
        return <Purchasing suppliers={suppliers} orders={purchaseOrders} products={products} onAddOrder={handleAddPurchaseOrder} onUpdateOrder={handleUpdatePurchaseOrder} onDeleteOrder={handleDeletePurchaseOrder} />;
      case ModuleType.AI_INSIGHTS:
        return <AIInsights kpis={kpis} salesData={salesData} />;
      case ModuleType.SETTINGS:
        return <Settings />;
      case ModuleType.HR:
        return <HR employees={employees} payrolls={payrolls} leaves={leaves} />;
      case ModuleType.FINANCE_COA:
        return <FinanceCOA accounts={accounts} journalEntries={journalEntries} onAddAccount={handleAddAccount} onUpdateAccount={handleUpdateAccount} onDeleteAccount={handleDeleteAccount} onAddJournalEntry={handleAddJournalEntry} />;
      case ModuleType.FINANCE_TREASURY:
        return <FinanceTreasury accounts={treasuryAccounts} transactions={treasuryTransactions} onAddAccount={handleAddTreasuryAccount} onUpdateAccount={handleUpdateTreasuryAccount} onDeleteAccount={handleDeleteTreasuryAccount} onTransaction={handleTreasuryTransaction} />;
      case ModuleType.FINANCE_DASHBOARD:
        return <FinanceDashboard accounts={accounts} treasuryAccounts={treasuryAccounts} budgets={budgets} financialDocuments={financialDocuments} onVoucherCreate={handleVoucherOperation} onPettyCashSettle={handlePettyCashSettlement} onDeleteDocument={handleDeleteDocument} onNewJournalRequest={() => setCurrentModule(ModuleType.FINANCE_COA)} />;
      default:
        return <div className="p-10 text-center text-slate-500">جاري العمل على هذه الوحدة...</div>;
    }
  };

  const getPageTitle = () => {
     if(currentModule === ModuleType.DASHBOARD) return 'لوحة التحكم';
     if(currentModule === ModuleType.REPORTS) return 'التقارير والتحليلات';
     if(currentModule === ModuleType.INVENTORY) return 'المخزون';
     if(currentModule === ModuleType.CUSTOMERS) return 'العملاء';
     if(currentModule === ModuleType.SALES) return 'المبيعات';
     if(currentModule === ModuleType.SUPPLIERS) return 'الموردين';
     if(currentModule === ModuleType.PURCHASING) return 'المشتريات';
     if(currentModule === ModuleType.FINANCE_DASHBOARD) return 'المالية العامة';
     if(currentModule === ModuleType.FINANCE_COA) return 'شجرة الحسابات';
     if(currentModule === ModuleType.FINANCE_TREASURY) return 'الخزنة';
     if(currentModule === ModuleType.AI_INSIGHTS) return 'المساعد الذكي';
     if(currentModule === ModuleType.SETTINGS) return 'الإعدادات';
     if(currentModule === ModuleType.HR) return 'الموارد البشرية';
     return 'الرئيسية';
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans" dir="rtl">
      <Sidebar currentModule={currentModule} onModuleChange={setCurrentModule} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 z-10 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu />
            </button>
            <h1 className="text-xl font-bold text-slate-800 hidden md:block">
              {getPageTitle()}
            </h1>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="بحث عام..." 
                className="bg-slate-100 border-none rounded-full py-2 pr-10 pl-4 w-64 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
              />
            </div>
            
            {/* Notifications Section */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
                title="التنبيهات"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute left-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                   <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                         التنبيهات
                         {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{unreadCount} جديد</span>}
                      </h3>
                      <div className="flex gap-2 text-xs">
                         <button onClick={markAllNotificationsAsRead} className="text-indigo-600 hover:text-indigo-800 font-medium">قراءة الكل</button>
                         <button onClick={clearNotifications} className="text-slate-400 hover:text-rose-500 font-medium">مسح</button>
                      </div>
                   </div>
                   <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                      {notifications.length > 0 ? (
                         notifications.map((notif) => (
                            <div key={notif.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 ${!notif.isRead ? 'bg-indigo-50/30' : ''}`}>
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                                  notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 
                                  notif.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                  notif.type === 'error' ? 'bg-rose-100 text-rose-600' :
                                  'bg-blue-100 text-blue-600'
                               }`}>
                                  {notif.type === 'success' ? <CheckCircle2 className="w-4 h-4"/> : 
                                   notif.type === 'warning' ? <AlertTriangle className="w-4 h-4"/> : 
                                   notif.type === 'error' ? <AlertTriangle className="w-4 h-4"/> : 
                                   <Info className="w-4 h-4"/>}
                               </div>
                               <div>
                                  <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-slate-800' : 'font-medium text-slate-700'}`}>{notif.title}</h4>
                                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.message}</p>
                                  <span className="text-[10px] text-slate-400 mt-2 block">{notif.timestamp}</span>
                               </div>
                            </div>
                         ))
                      ) : (
                         <div className="p-8 text-center text-slate-400">
                            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>لا توجد إشعارات حالياً</p>
                         </div>
                      )}
                   </div>
                   <button onClick={() => { setCurrentModule(ModuleType.SETTINGS); setShowNotifications(false); }} className="w-full p-3 text-center text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-colors border-t border-slate-50">
                      إعدادات التنبيهات
                   </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pl-2 border-r border-slate-200 pr-4 cursor-pointer" onClick={handleLogout} title="تسجيل خروج">
               <div className="text-left hidden md:block">
                 <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                 <p className="text-xs text-slate-500">{currentUser.role}</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md shadow-primary/20">
                 {currentUser.name.charAt(0).toUpperCase()}
               </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-hidden p-6 md:p-10 relative">
           <div className="h-full overflow-y-auto custom-scrollbar pb-20">
              {renderContent()}
           </div>
        </main>
      </div>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative bg-white w-3/4 max-w-xs h-full shadow-2xl animate-slide-in-right">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center">
               <span className="font-bold text-lg">القائمة</span>
               <button onClick={() => setMobileMenuOpen(false)}>X</button>
             </div>
             <div className="p-4 flex flex-col gap-2 overflow-y-auto h-full">
                <button onClick={() => {setCurrentModule(ModuleType.DASHBOARD); setMobileMenuOpen(false)}} className="p-3 text-right rounded-lg hover:bg-slate-50 font-bold text-slate-700">لوحة التحكم</button>
                <button onClick={() => {setCurrentModule(ModuleType.REPORTS); setMobileMenuOpen(false)}} className="p-3 text-right rounded-lg hover:bg-slate-50 font-bold text-slate-700">التقارير</button>
                <button onClick={() => {setCurrentModule(ModuleType.INVENTORY); setMobileMenuOpen(false)}} className="p-3 text-right rounded-lg hover:bg-slate-50 font-bold text-slate-700">المخزون</button>
                <button onClick={() => {setCurrentModule(ModuleType.SALES); setMobileMenuOpen(false)}} className="p-3 text-right rounded-lg hover:bg-slate-50 font-bold text-slate-700">المبيعات</button>
                <button onClick={() => {setCurrentModule(ModuleType.CUSTOMERS); setMobileMenuOpen(false)}} className="p-3 text-right rounded-lg hover:bg-slate-50 font-bold text-slate-700">العملاء</button>
                <button onClick={() => {setCurrentModule(ModuleType.SUPPLIERS); setMobileMenuOpen(false)}} className="p-3 text-right rounded-lg hover:bg-slate-50 font-bold text-slate-700">الموردين</button>
                <button onClick={handleLogout} className="p-3 text-right rounded-lg hover:bg-red-50 font-bold text-red-600 mt-4 border-t border-slate-100">تسجيل خروج</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
