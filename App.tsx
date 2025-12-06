

import React, { useState } from 'react';
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
import { ModuleType, KPI, SalesData, Product, Category, Unit, Warehouse, StockMovement, StockOperationPayload, Customer, Supplier, AppNotification, Employee, Payroll, LeaveRequest, Account, JournalEntry, TreasuryAccount, TreasuryTransaction, Voucher, Budget, FinancialDocument, CustomerTransaction, CustomerInteraction, Invoice, SupplierTransaction, PurchaseOrder } from './types';
import { Bell, Search, Menu, Users, Settings as SettingsIcon } from 'lucide-react';

const App: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<ModuleType>(ModuleType.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: '1', title: 'تنبيه مخزون', message: 'المنتج "شاشة 4K" وصل للحد الأدنى للمخزون (0).', type: 'warning', timestamp: 'منذ ساعتين', isRead: false },
    { id: '2', title: 'نسخة احتياطية', message: 'تم إجراء النسخ الاحتياطي التلقائي للبيانات بنجاح.', type: 'success', timestamp: 'منذ 5 ساعات', isRead: true },
    { id: '3', title: 'تحديث نظام', message: 'تم تحديث أسعار الصرف للعملات الأجنبية.', type: 'info', timestamp: 'أمس', isRead: true },
  ]);

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

  // Mock Data
  const kpis: KPI[] = [
    { title: 'إجمالي المبيعات', value: '$124,500', change: 12.5, icon: 'dollar', color: 'blue' },
    { title: 'العملاء الجدد', value: '1,240', change: 8.2, icon: 'users', color: 'emerald' },
    { title: 'الطلبات', value: '845', change: -2.4, icon: 'cart', color: 'amber' },
    { title: 'صافي الربح', value: '$45,200', change: 15.3, icon: 'trend', color: 'rose' },
  ];

  const salesData: SalesData[] = [
    { name: 'يناير', revenue: 4000, profit: 2400 },
    { name: 'فبراير', revenue: 3000, profit: 1398 },
    { name: 'مارس', revenue: 2000, profit: 9800 },
    { name: 'أبريل', revenue: 2780, profit: 3908 },
    { name: 'مايو', revenue: 1890, profit: 4800 },
    { name: 'يونيو', revenue: 2390, profit: 3800 },
    { name: 'يوليو', revenue: 3490, profit: 4300 },
  ];

  // Mock Categories
  const [categories, setCategories] = useState<Category[]>([
    { id: 'CAT-001', name: 'إلكترونيات', itemCount: 150, description: 'أجهزة ومعدات إلكترونية' },
    { id: 'CAT-002', name: 'أثاث', itemCount: 45, description: 'أثاث مكتبي ومنزلي' },
    { id: 'CAT-003', name: 'ملابس', itemCount: 320, description: 'ملابس رجالية ونسائية' },
    { id: 'CAT-004', name: 'هواتف', itemCount: 85, description: 'هواتف ذكية وإكسسوارات' },
  ]);

  // Mock Units
  const [units, setUnits] = useState<Unit[]>([
    { id: 'U-001', name: 'قطعة', shortName: 'PCS' },
    { id: 'U-002', name: 'كرتونة', shortName: 'BOX' },
    { id: 'U-003', name: 'كيلوجرام', shortName: 'KG' },
    { id: 'U-004', name: 'لتر', shortName: 'L' },
    { id: 'U-005', name: 'متر', shortName: 'M' },
  ]);

  // Mock Warehouses
  const [warehouses] = useState<Warehouse[]>([
    { id: 'WH-001', name: 'المخزن الرئيسي', location: 'المنطقة الصناعية' },
    { id: 'WH-002', name: 'فرع وسط البلد', location: 'وسط المدينة' },
  ]);

  const [products, setProducts] = useState<Product[]>([
    { 
      id: 'P-1001', 
      name: 'سماعة بلوتوث احترافية', 
      category: 'إلكترونيات', 
      price: 120, 
      cost: 80,
      stock: 45, 
      unit: 'قطعة',
      barcode: '629104001',
      minStock: 10,
      status: 'In Stock', 
      lastUpdated: '2023-10-25' 
    },
    { 
      id: 'P-1002', 
      name: 'كرسي مكتب مريح', 
      category: 'أثاث', 
      price: 350, 
      cost: 200,
      stock: 8, 
      unit: 'قطعة',
      barcode: '629104002',
      minStock: 5,
      status: 'Low Stock', 
      lastUpdated: '2023-10-24' 
    },
    { 
      id: 'P-1003', 
      name: 'شاشة 4K فائقة الوضوح', 
      category: 'إلكترونيات', 
      price: 500, 
      cost: 350,
      stock: 0, 
      unit: 'كرتونة',
      barcode: '629104003',
      minStock: 2,
      status: 'Out of Stock', 
      lastUpdated: '2023-10-20' 
    },
    { 
      id: 'P-1004', 
      name: 'لوحة مفاتيح ميكانيكية', 
      category: 'إكسسوارات', 
      price: 85, 
      cost: 40,
      stock: 120, 
      unit: 'قطعة',
      barcode: '629104004',
      minStock: 20,
      status: 'In Stock', 
      lastUpdated: '2023-10-22' 
    },
    { 
      id: 'P-1005', 
      name: 'هاتف ذكي حديث', 
      category: 'هواتف', 
      price: 999, 
      cost: 800,
      stock: 15, 
      unit: 'قطعة',
      barcode: '629104005',
      minStock: 5,
      status: 'In Stock', 
      lastUpdated: '2023-10-26' 
    },
  ]);

  // Mock Movements Data
  const [movements, setMovements] = useState<StockMovement[]>([
    { id: 'MV-001', productId: 'P-1001', date: '2023-10-25', type: 'PURCHASE', quantity: 50, balanceAfter: 50, warehouseId: 'WH-001', reference: 'INV-2023-001', user: 'Admin' },
    { id: 'MV-002', productId: 'P-1001', date: '2023-10-26', type: 'SALE', quantity: -5, balanceAfter: 45, warehouseId: 'WH-001', reference: 'ORD-9921', user: 'Sales Rep' },
    { id: 'MV-003', productId: 'P-1002', date: '2023-10-20', type: 'PURCHASE', quantity: 20, balanceAfter: 20, warehouseId: 'WH-001', reference: 'INV-2023-005', user: 'Admin' },
    { id: 'MV-004', productId: 'P-1002', date: '2023-10-22', type: 'TRANSFER', quantity: -10, balanceAfter: 10, warehouseId: 'WH-001', reference: 'TRF-101', notes: 'نقل للفرع', user: 'Store Manager' },
    { id: 'MV-005', productId: 'P-1002', date: '2023-10-24', type: 'ADJUSTMENT', quantity: -2, balanceAfter: 8, warehouseId: 'WH-001', reference: 'ADJ-004', notes: 'تالف مخزني', user: 'Admin' },
  ]);

  // Mock Customers
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 'C-001', name: 'شركة الأفق للتجارة', phone: '0501234567', email: 'contact@alufq.com', address: 'الرياض, العليا', balance: 5400, status: 'Active', creditLimit: 10000, category: 'VIP', taxNumber: '30001231230003' },
    { id: 'C-002', name: 'مؤسسة النور', phone: '0559876543', address: 'جدة, التحلية', balance: 0, status: 'Active', creditLimit: 5000, category: 'Regular' },
    { id: 'C-003', name: 'خالد عبد الرحمن', phone: '0561122334', balance: 1250, status: 'Active', category: 'New' },
  ]);

  // Mock Invoices
  const [invoices, setInvoices] = useState<Invoice[]>([
    { 
       id: 'INV-001', 
       customerId: 'C-001', 
       customerName: 'شركة الأفق للتجارة',
       date: '2023-10-25', 
       dueDate: '2023-11-25', 
       subtotal: 5000,
       tax: 750,
       discount: 0,
       total: 5750, 
       status: 'Pending', 
       items: [
          { id: '1', productId: 'P-1001', productName: 'سماعة بلوتوث احترافية', price: 120, quantity: 10, total: 1200 },
          { id: '2', productId: 'P-1005', productName: 'هاتف ذكي حديث', price: 999, quantity: 2, total: 1998 }
       ] 
    },
    { 
       id: 'INV-002', 
       customerId: 'C-002', 
       customerName: 'مؤسسة النور',
       date: '2023-10-20', 
       dueDate: '2023-10-20', 
       subtotal: 1200,
       tax: 180,
       discount: 0,
       total: 1380, 
       status: 'Paid', 
       items: [
          { id: '1', productId: 'P-1001', productName: 'سماعة بلوتوث احترافية', price: 120, quantity: 10, total: 1200 }
       ] 
    },
  ]);

  // Mock Customer Transactions (Ledger)
  const [customerTransactions, setCustomerTransactions] = useState<CustomerTransaction[]>([
    { id: 'TX-100', customerId: 'C-001', date: '2023-10-01', type: 'INVOICE', reference: 'INV-23-001', amount: 3000, description: 'فاتورة مبيعات #1' },
    { id: 'TX-101', customerId: 'C-001', date: '2023-10-05', type: 'PAYMENT', reference: 'PAY-100', amount: -1000, description: 'دفعة نقدية' },
    { id: 'TX-102', customerId: 'C-001', date: '2023-10-15', type: 'INVOICE', reference: 'INV-23-050', amount: 3400, description: 'فاتورة مبيعات #50' },
  ]);

  const [customerInteractions, setCustomerInteractions] = useState<CustomerInteraction[]>([
    { id: 'INT-01', customerId: 'C-001', date: '2023-10-20', type: 'CALL', summary: 'متابعة سداد الفواتير المتأخرة', outcome: 'وعد بالسداد الأسبوع القادم' },
    { id: 'INT-02', customerId: 'C-002', date: '2023-10-22', type: 'MEETING', summary: 'زيارة لفرع العميل وعرض منتجات جديدة', nextActionDate: '2023-11-01' },
  ]);

  // Mock Suppliers
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 'S-001', name: 'المتحدة للإلكترونيات', contactPerson: 'م. أحمد', phone: '0101010101', balance: 25000, rating: 5, status: 'Active', address: 'الرياض, المنطقة الصناعية', taxNumber: '30099887766001' },
    { id: 'S-002', name: 'مصنع الأثاث الحديث', contactPerson: 'سعيد علي', phone: '0123456789', balance: 8200, rating: 4, status: 'Active', address: 'الدمام' },
  ]);

  const [supplierTransactions, setSupplierTransactions] = useState<SupplierTransaction[]>([
    { id: 'STX-01', supplierId: 'S-001', date: '2023-10-01', type: 'INVOICE', reference: 'PINV-901', amount: 30000, description: 'شراء بضاعة (إلكترونيات)' },
    { id: 'STX-02', supplierId: 'S-001', date: '2023-10-10', type: 'PAYMENT', reference: 'PV-502', amount: -5000, description: 'دفعة تحت الحساب' },
  ]);

  // Mock Purchase Orders
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: 'PO-2023-001',
      supplierId: 'S-001',
      supplierName: 'المتحدة للإلكترونيات',
      date: '2023-10-01',
      dueDate: '2023-10-15',
      status: 'Received',
      subtotal: 5000,
      tax: 750,
      discount: 0,
      total: 5750,
      paymentType: 'CREDIT',
      items: [
         { id: '1', productId: 'P-1001', productName: 'سماعة بلوتوث احترافية', quantity: 50, cost: 80, total: 4000 },
         { id: '2', productId: 'P-1003', productName: 'شاشة 4K', quantity: 2, cost: 500, total: 1000 }
      ]
    }
  ]);

  // Mock HR Data
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 'EMP-001', name: 'محمد أحمد', role: 'محاسب عام', department: 'المالية', status: 'Active', avatar: '', salary: 8500, joinDate: '2022-03-15' },
    { id: 'EMP-002', name: 'سارة خالد', role: 'مدير مبيعات', department: 'المبيعات', status: 'Active', avatar: '', salary: 12000, joinDate: '2021-11-01' },
    { id: 'EMP-003', name: 'عمر يوسف', role: 'أمين مستودع', department: 'المخازن', status: 'On Leave', avatar: '', salary: 6000, joinDate: '2023-01-20' },
  ]);

  const [payrolls, setPayrolls] = useState<Payroll[]>([
    { id: 'PAY-1001', employeeId: 'EMP-001', month: 'أكتوبر 2023', salary: 8500, bonus: 500, deductions: 200, net: 8800, status: 'Paid' },
    { id: 'PAY-1002', employeeId: 'EMP-002', month: 'أكتوبر 2023', salary: 12000, bonus: 1500, deductions: 0, net: 13500, status: 'Paid' },
    { id: 'PAY-1003', employeeId: 'EMP-003', month: 'أكتوبر 2023', salary: 6000, bonus: 0, deductions: 0, net: 6000, status: 'Pending' },
  ]);

  const [leaves, setLeaves] = useState<LeaveRequest[]>([
    { id: 'LV-001', employeeId: 'EMP-003', type: 'Annual', startDate: '2023-11-01', endDate: '2023-11-15', status: 'Approved', reason: 'إجازة سنوية' },
    { id: 'LV-002', employeeId: 'EMP-001', type: 'Sick', startDate: '2023-10-10', endDate: '2023-10-12', status: 'Approved', reason: 'ظرف صحي' },
  ]);

  // Mock COA Data
  const [accounts, setAccounts] = useState<Account[]>([
    { id: 'ACC-101', code: '101', name: 'النقدية في الخزينة', type: 'ASSET', balance: 50000, isHeader: false, level: 1 },
    { id: 'ACC-102', code: '102', name: 'البنك الأهلي', type: 'ASSET', balance: 125000, isHeader: false, level: 1 },
    { id: 'ACC-103', code: '103', name: 'العملاء', type: 'ASSET', balance: 45000, isHeader: false, level: 1 },
    { id: 'ACC-104', code: '104', name: 'المخزون', type: 'ASSET', balance: 89000, isHeader: false, level: 1 },
    { id: 'ACC-201', code: '201', name: 'الموردين', type: 'LIABILITY', balance: 32000, isHeader: false, level: 1 },
    { id: 'ACC-202', code: '202', name: 'قروض قصيرة الأجل', type: 'LIABILITY', balance: 15000, isHeader: false, level: 1 },
    { id: 'ACC-301', code: '301', name: 'رأس المال', type: 'EQUITY', balance: 250000, isHeader: false, level: 1 },
    { id: 'ACC-401', code: '401', name: 'إيرادات المبيعات', type: 'REVENUE', balance: 180000, isHeader: false, level: 1 },
    { id: 'ACC-501', code: '501', name: 'تكلفة البضاعة المباعة', type: 'EXPENSE', balance: 95000, isHeader: false, level: 1 },
    { id: 'ACC-502', code: '502', name: 'مصروفات الرواتب', type: 'EXPENSE', balance: 45000, isHeader: false, level: 1 },
    { id: 'ACC-503', code: '503', name: 'مصروفات الكهرباء والمياه', type: 'EXPENSE', balance: 3500, isHeader: false, level: 1 },
  ]);

  // Mock Journal Entries
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
     {
        id: 'JE-001',
        date: '2023-10-01',
        reference: 'REF-001',
        description: 'رأس المال الافتتاحي',
        status: 'Posted',
        createdAt: '2023-10-01',
        lines: [
           { id: 'L1', accountId: 'ACC-102', debit: 250000, credit: 0 },
           { id: 'L2', accountId: 'ACC-301', debit: 0, credit: 250000 }
        ]
     },
     {
        id: 'JE-002',
        date: '2023-10-05',
        reference: 'INV-100',
        description: 'مبيعات نقدية',
        status: 'Posted',
        createdAt: '2023-10-05',
        lines: [
           { id: 'L3', accountId: 'ACC-101', debit: 5000, credit: 0 },
           { id: 'L4', accountId: 'ACC-401', debit: 0, credit: 5000 }
        ]
     }
  ]);

  // Financial Documents History
  const [financialDocuments, setFinancialDocuments] = useState<FinancialDocument[]>([
    { id: 'DOC-101', type: 'PAYMENT_VOUCHER', date: '2023-10-20', reference: 'VCH-1001', description: 'سداد دفعة للمورد', amount: 5000, status: 'Posted', beneficiary: 'المتحدة للإلكترونيات' },
    { id: 'DOC-102', type: 'RECEIPT_VOUCHER', date: '2023-10-22', reference: 'VCH-1002', description: 'تحصيل من عميل', amount: 2500, status: 'Posted', beneficiary: 'شركة الأفق' }
  ]);

  // Mock Treasury Data
  const [treasuryAccounts, setTreasuryAccounts] = useState<TreasuryAccount[]>([
    { id: 'TR-01', name: 'الخزينة الرئيسية', type: 'CASH', balance: 50000, currency: 'SAR' },
    { id: 'TR-02', name: 'البنك الأهلي', type: 'BANK', balance: 125000, currency: 'SAR', accountNumber: 'SA000000123456789' },
  ]);
  
  const [treasuryTransactions, setTreasuryTransactions] = useState<TreasuryTransaction[]>([
    { id: 'TX-01', date: '2023-10-01', type: 'INCOME', amount: 5000, accountId: 'TR-01', description: 'مبيعات نقدية', category: 'Sales' },
    { id: 'TX-02', date: '2023-10-02', type: 'EXPENSE', amount: 200, accountId: 'TR-01', description: 'ضيافة', category: 'General' },
  ]);

  // Mock Budgets
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: 'B-01', category: 'مصروفات الرواتب', allocated: 50000, spent: 45000, period: 'Oct 2023' },
    { id: 'B-02', category: 'تسويق', allocated: 15000, spent: 8000, period: 'Oct 2023' },
    { id: 'B-03', category: 'مرافق وكهرباء', allocated: 5000, spent: 3500, period: 'Oct 2023' },
  ]);

  // --- Handlers for Interactivity ---

  // Customer Handlers
  const handleAddCustomer = (c: Customer) => {
    setCustomers([...customers, c]);
    addNotification('عميل جديد', `تم إضافة العميل ${c.name} بنجاح`, 'success');
  };

  const handleUpdateCustomer = (c: Customer) => {
    setCustomers(customers.map(cust => cust.id === c.id ? c : cust));
    addNotification('تحديث بيانات', `تم تحديث بيانات العميل ${c.name}`, 'info');
  };

  const handleDeleteCustomer = (id: string) => {
    const cust = customers.find(c => c.id === id);
    setCustomers(customers.filter(c => c.id !== id));
    addNotification('حذف عميل', `تم حذف العميل ${cust?.name} نهائياً`, 'warning');
  };

  // Supplier Handlers
  const handleAddSupplier = (s: Supplier) => {
    setSuppliers([...suppliers, s]);
    addNotification('مورد جديد', `تم إضافة المورد ${s.name} بنجاح`, 'success');
  };

  const handleUpdateSupplier = (s: Supplier) => {
    setSuppliers(suppliers.map(supp => supp.id === s.id ? s : supp));
    addNotification('تحديث مورد', `تم تحديث بيانات المورد ${s.name}`, 'info');
  };

  const handleDeleteSupplier = (id: string) => {
    const supp = suppliers.find(s => s.id === id);
    setSuppliers(suppliers.filter(s => s.id !== id));
    addNotification('حذف مورد', `تم حذف المورد ${supp?.name}`, 'warning');
  };

  // Invoice Handlers
  const handleAddInvoice = (inv: Invoice) => {
     setInvoices([...invoices, inv]);
     addNotification('فاتورة جديدة', `تم إصدار فاتورة مبيعات جديدة للعميل ${inv.customerName}`, 'success');
  };

  const handleUpdateInvoice = (inv: Invoice) => {
     setInvoices(invoices.map(i => i.id === inv.id ? inv : i));
  };

  const handleDeleteInvoice = (id: string) => {
     setInvoices(invoices.filter(i => i.id !== id));
     addNotification('حذف فاتورة', 'تم حذف الفاتورة بنجاح.', 'warning');
  };

  // Purchase Order Handlers
  const handleAddPurchaseOrder = (order: PurchaseOrder) => {
    setPurchaseOrders([...purchaseOrders, order]);
    addNotification('أمر شراء', `تم إنشاء أمر شراء جديد للمورد ${order.supplierName}`, 'success');
  };

  const handleUpdatePurchaseOrder = (order: PurchaseOrder) => {
    setPurchaseOrders(purchaseOrders.map(po => po.id === order.id ? order : po));
    addNotification('تحديث أمر شراء', `تم تحديث أمر الشراء ${order.id}`, 'info');
  };

  const handleDeletePurchaseOrder = (id: string) => {
    setPurchaseOrders(purchaseOrders.filter(po => po.id !== id));
    addNotification('حذف أمر شراء', 'تم حذف أمر الشراء بنجاح.', 'warning');
  };


  const handleAddProduct = (newProduct: Product) => {
    setProducts([...products, newProduct]);
    addNotification('منتج جديد', `تم إضافة المنتج "${newProduct.name}" بنجاح.`, 'success');
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setProducts(products.filter(p => p.id !== productId));
    if (product) {
      addNotification('حذف منتج', `تم حذف المنتج "${product.name}" من النظام.`, 'info');
    }
  };

  const handleStockOperation = (payload: StockOperationPayload) => {
    const product = products.find(p => p.id === payload.productId);
    if (!product) return;

    let quantityChange = 0;
    let movementType: any = 'ADJUSTMENT';

    // Determine quantity change based on operation
    if (payload.type === 'STOCKTAKING') {
       quantityChange = payload.quantity; // Assuming the user enters the difference
       movementType = 'ADJUSTMENT';
    } else if (payload.type === 'ADJUSTMENT') {
       quantityChange = payload.adjustmentType === 'OUT' ? -payload.quantity : payload.quantity;
       movementType = 'ADJUSTMENT';
    } else if (payload.type === 'TRANSFER') {
       quantityChange = -payload.quantity; // Deduct from source
       movementType = 'TRANSFER';
    }

    const newStock = product.stock + quantityChange;
    const newStatus = newStock <= 0 ? 'Out of Stock' : (newStock <= (product.minStock || 0) ? 'Low Stock' : 'In Stock');

    // 1. Update Product
    const updatedProduct = {
      ...product,
      stock: newStock,
      status: newStatus as any,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    handleUpdateProduct(updatedProduct);

    // 2. Add Movement Record
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
      user: 'Admin' // Hardcoded for now
    };
    setMovements([newMovement, ...movements]);

    // 3. Trigger Notification on Low Stock
    if (newStock <= (product.minStock || 0)) {
       addNotification(
         'تنبيه مخزون منخفض', 
         `المنتج "${product.name}" وصل للحد الأدنى. الرصيد الحالي: ${newStock} ${product.unit}`, 
         'warning'
       );
    }
    
    if (payload.type === 'TRANSFER') {
      addNotification('تحويل مخزني', `تم تحويل ${Math.abs(quantityChange)} من "${product.name}".`, 'info');
    }
  };

  // --- Finance Handlers ---
  const handleAddAccount = (account: Account) => {
     setAccounts([...accounts, account]);
     addNotification('حساب جديد', `تم إضافة الحساب "${account.name}" بنجاح.`, 'success');
  };

  const handleUpdateAccount = (account: Account) => {
     setAccounts(accounts.map(a => a.id === account.id ? account : a));
     addNotification('تعديل حساب', `تم تحديث بيانات الحساب "${account.name}".`, 'info');
  };

  const handleDeleteAccount = (id: string) => {
     const acc = accounts.find(a => a.id === id);
     const hasHistory = journalEntries.some(je => je.lines.some(l => l.accountId === id));
     if(hasHistory) {
        addNotification('خطأ حذف', `لا يمكن حذف الحساب "${acc?.name}" لأنه يحتوي على حركات مالية مسجلة.`, 'error');
        return;
     }

     setAccounts(accounts.filter(a => a.id !== id));
     addNotification('حذف حساب', `تم حذف الحساب "${acc?.name}".`, 'warning');
  };

  const handleAddJournalEntry = (entry: JournalEntry) => {
      setJournalEntries([entry, ...journalEntries]);
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

    setFinancialDocuments([doc, ...financialDocuments]);
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

     setFinancialDocuments([doc, ...financialDocuments]);
     handleAddJournalEntry(entry);
     addNotification('تسوية عهدة', `تم تسوية مصروفات بقيمة ${totalAmount}`, 'success');
  };

  const handleDeleteDocument = (id: string) => {
     setFinancialDocuments(financialDocuments.filter(d => d.id !== id));
     addNotification('حذف مستند', 'تم حذف المستند المالي بنجاح (تنبيه: يجب مراجعة القيود يدوياً)', 'warning');
  };

  // --- Treasury Handlers ---
  const handleAddTreasuryAccount = (acc: TreasuryAccount) => {
    setTreasuryAccounts([...treasuryAccounts, acc]);
    addNotification('خزينة/بنك جديد', `تم إضافة الحساب "${acc.name}" بنجاح.`, 'success');
  };

  const handleUpdateTreasuryAccount = (acc: TreasuryAccount) => {
    setTreasuryAccounts(treasuryAccounts.map(a => a.id === acc.id ? acc : a));
    addNotification('تحديث حساب', `تم تعديل بيانات الحساب "${acc.name}".`, 'info');
  };

  const handleDeleteTreasuryAccount = (id: string) => {
    const acc = treasuryAccounts.find(a => a.id === id);
    setTreasuryAccounts(treasuryAccounts.filter(a => a.id !== id));
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
     setTreasuryTransactions([newTx, ...treasuryTransactions]);
     
     const msg = payload.type === 'TRANSFER' ? 'تحويل أموال' : payload.type === 'INCOME' ? 'عملية إيداع' : 'عملية صرف';
     addNotification(msg, `تم تنفيذ العملية بقيمة ${payload.amount} بنجاح.`, 'success');
  };

  const renderContent = () => {
    switch (currentModule) {
      case ModuleType.DASHBOARD:
        return <Dashboard kpis={kpis} salesData={salesData} notifications={notifications} />;
      case ModuleType.INVENTORY:
        return (
          <Inventory 
            products={products} 
            categories={categories} 
            units={units} 
            warehouses={warehouses}
            stockMovements={movements}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onStockOperation={handleStockOperation}
          />
        );
      
      // Commercial Modules - Separated
      case ModuleType.CUSTOMERS:
        return <Customers 
                 customers={customers} 
                 transactions={customerTransactions}
                 interactions={customerInteractions}
                 onAddCustomer={handleAddCustomer}
                 onUpdateCustomer={handleUpdateCustomer}
                 onDeleteCustomer={handleDeleteCustomer}
               />;
      case ModuleType.SALES:
        return <Sales 
                  customers={customers} 
                  invoices={invoices} 
                  products={products}
                  onAddInvoice={handleAddInvoice}
                  onUpdateInvoice={handleUpdateInvoice}
                  onDeleteInvoice={handleDeleteInvoice}
               />;
      
      case ModuleType.SUPPLIERS:
        return <Suppliers 
                 suppliers={suppliers} 
                 transactions={supplierTransactions}
                 onAddSupplier={handleAddSupplier}
                 onUpdateSupplier={handleUpdateSupplier}
                 onDeleteSupplier={handleDeleteSupplier}
               />;
      case ModuleType.PURCHASING:
        return <Purchasing 
                  suppliers={suppliers} 
                  orders={purchaseOrders} 
                  products={products}
                  onAddOrder={handleAddPurchaseOrder}
                  onUpdateOrder={handleUpdatePurchaseOrder}
                  onDeleteOrder={handleDeletePurchaseOrder}
               />;
        
      case ModuleType.AI_INSIGHTS:
        return <AIInsights kpis={kpis} salesData={salesData} />;
      
      case ModuleType.SETTINGS:
        return <Settings />;

      case ModuleType.HR:
        return <HR employees={employees} payrolls={payrolls} leaves={leaves} />;
      
      case ModuleType.FINANCE_COA:
        return <FinanceCOA 
                  accounts={accounts} 
                  journalEntries={journalEntries}
                  onAddAccount={handleAddAccount}
                  onUpdateAccount={handleUpdateAccount}
                  onDeleteAccount={handleDeleteAccount}
                  onAddJournalEntry={handleAddJournalEntry}
               />;

      case ModuleType.FINANCE_TREASURY:
        return <FinanceTreasury 
                  accounts={treasuryAccounts} 
                  transactions={treasuryTransactions} 
                  onAddAccount={handleAddTreasuryAccount}
                  onUpdateAccount={handleUpdateTreasuryAccount}
                  onDeleteAccount={handleDeleteTreasuryAccount}
                  onTransaction={handleTreasuryTransaction}
               />;
        
      case ModuleType.FINANCE_DASHBOARD:
        return <FinanceDashboard 
                 accounts={accounts} 
                 treasuryAccounts={treasuryAccounts} 
                 budgets={budgets}
                 financialDocuments={financialDocuments}
                 onVoucherCreate={handleVoucherOperation}
                 onPettyCashSettle={handlePettyCashSettlement}
                 onDeleteDocument={handleDeleteDocument}
                 onNewJournalRequest={() => setCurrentModule(ModuleType.FINANCE_COA)} 
               />;

      default:
        return <div className="p-10 text-center text-slate-500">جاري العمل على هذه الوحدة...</div>;
    }
  };

  const getPageTitle = () => {
     if(currentModule === ModuleType.DASHBOARD) return 'لوحة التحكم';
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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans" dir="rtl">
      {/* Sidebar (Desktop) */}
      <Sidebar currentModule={currentModule} onModuleChange={setCurrentModule} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-slate-500" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
                className="bg-slate-100 border-none rounded-full py-2 pr-10 pl-4 w-64 text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
              />
            </div>
            
            <button 
              onClick={() => setCurrentModule(ModuleType.DASHBOARD)}
              className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
              title="التنبيهات"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
              )}
            </button>
            
            <div className="flex items-center gap-3 pl-2 border-r border-slate-200 pr-4">
               <div className="text-left hidden md:block">
                 <p className="text-sm font-bold text-slate-800">أحمد محمد</p>
                 <p className="text-xs text-slate-500">مدير النظام</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md shadow-primary/20">
                 A
               </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
           {renderContent()}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative bg-white w-3/4 max-w-xs h-full shadow-2xl animate-slide-in-right">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center">
               <span className="font-bold text-lg">القائمة</span>
               <button onClick={() => setMobileMenuOpen(false)}>X</button>
             </div>
             <div className="p-4 flex flex-col gap-2 overflow-y-auto">
                <button onClick={() => {setCurrentModule(ModuleType.DASHBOARD); setMobileMenuOpen(false)}} className="p-3 text-right rounded-lg hover:bg-slate-50">لوحة التحكم</button>
                <button onClick={() => {setCurrentModule(ModuleType.INVENTORY); setMobileMenuOpen(false)}} className="p-3 text-right rounded-lg hover:bg-slate-50">المخزون</button>
                
                <div className="py-2 border-t border-b border-slate-100 my-2">
                   <div className="px-3 mb-2 text-xs text-slate-400 font-bold">العمليات التجارية</div>
                   <button onClick={() => {setCurrentModule(ModuleType.CUSTOMERS); setMobileMenuOpen(false)}} className="w-full p-2 text-right rounded-lg hover:bg-slate-50 text-sm">العملاء</button>
                   <button onClick={() => {setCurrentModule(ModuleType.SALES); setMobileMenuOpen(false)}} className="w-full p-2 text-right rounded-lg hover:bg-slate-50 text-sm">المبيعات</button>
                   <button onClick={() => {setCurrentModule(ModuleType.SUPPLIERS); setMobileMenuOpen(false)}} className="w-full p-2 text-right rounded-lg hover:bg-slate-50 text-sm">الموردين</button>
                   <button onClick={() => {setCurrentModule(ModuleType.PURCHASING); setMobileMenuOpen(false)}} className="w-full p-2 text-right rounded-lg hover:bg-slate-50 text-sm">المشتريات</button>
                </div>

                <div className="py-2 border-b border-slate-100 my-2">
                   <div className="px-3 mb-2 text-xs text-slate-400 font-bold">المالية</div>
                   <button onClick={() => {setCurrentModule(ModuleType.FINANCE_DASHBOARD); setMobileMenuOpen(false)}} className="w-full p-2 text-right rounded-lg hover:bg-slate-50 text-sm">المالية العامة</button>
                   <button onClick={() => {setCurrentModule(ModuleType.FINANCE_COA); setMobileMenuOpen(false)}} className="w-full p-2 text-right rounded-lg hover:bg-slate-50 text-sm">شجرة الحسابات</button>
                   <button onClick={() => {setCurrentModule(ModuleType.FINANCE_TREASURY); setMobileMenuOpen(false)}} className="w-full p-2 text-right rounded-lg hover:bg-slate-50 text-sm">الخزنة</button>
                </div>

                <div className="py-2 border-b border-slate-100 my-2">
                    <div className="px-3 mb-2 text-xs text-slate-400 font-bold">الموارد البشرية والإدارة</div>
                    <button onClick={() => {setCurrentModule(ModuleType.HR); setMobileMenuOpen(false)}} className="w-full p-2 text-right rounded-lg hover:bg-slate-50 text-sm flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      الموارد البشرية
                    </button>
                    <button onClick={() => {setCurrentModule(ModuleType.SETTINGS); setMobileMenuOpen(false)}} className="w-full p-2 text-right rounded-lg hover:bg-slate-50 text-sm flex items-center gap-2">
                      <SettingsIcon className="w-4 h-4" />
                      الإعدادات
                    </button>
                </div>

                <button onClick={() => {setCurrentModule(ModuleType.AI_INSIGHTS); setMobileMenuOpen(false)}} className="p-3 text-right rounded-lg hover:bg-slate-50 text-indigo-600 font-bold">المساعد الذكي</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;