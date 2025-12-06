
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Sales } from './components/Sales';
import { Purchasing } from './components/Purchasing';
import { AIInsights } from './components/AIInsights';
import { Settings } from './components/Settings';
import { HR } from './components/HR';
import { ModuleType, KPI, SalesData, Product, Category, Unit, Warehouse, StockMovement, StockOperationPayload, Customer, Supplier, AppNotification, Employee, Payroll, LeaveRequest } from './types';
import { Bell, Search, Menu, Calculator, FileSpreadsheet, Landmark, Settings as SettingsIcon, Users } from 'lucide-react';

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

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
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
    { id: 'C-001', name: 'شركة الأفق للتجارة', phone: '0501234567', email: 'contact@alufq.com', address: 'الرياض, العليا', balance: 5400, status: 'Active' },
    { id: 'C-002', name: 'مؤسسة النور', phone: '0559876543', address: 'جدة, التحلية', balance: 0, status: 'Active' },
    { id: 'C-003', name: 'خالد عبد الرحمن', phone: '0561122334', balance: 1250, status: 'Active' },
  ]);

  // Mock Suppliers
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 'S-001', name: 'المتحدة للإلكترونيات', contactPerson: 'م. أحمد', phone: '0101010101', balance: 25000, rating: 5, status: 'Active' },
    { id: 'S-002', name: 'مصنع الأثاث الحديث', contactPerson: 'سعيد علي', phone: '0123456789', balance: 8200, rating: 4, status: 'Active' },
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

  // --- Handlers for Interactivity ---

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
    
    // Notification for the operation itself
    if (payload.type === 'TRANSFER') {
      addNotification('تحويل مخزني', `تم تحويل ${Math.abs(quantityChange)} من "${product.name}".`, 'info');
    }
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
        return <Sales customers={customers} invoices={[]} mode="customers" />;
      case ModuleType.SALES:
        return <Sales customers={[]} invoices={[]} mode="invoices" />;
      
      case ModuleType.SUPPLIERS:
        return <Purchasing suppliers={suppliers} orders={[]} mode="suppliers" />;
      case ModuleType.PURCHASING:
        return <Purchasing suppliers={[]} orders={[]} mode="orders" />;
        
      case ModuleType.AI_INSIGHTS:
        return <AIInsights kpis={kpis} salesData={salesData} />;
      
      case ModuleType.SETTINGS:
        return <Settings />;

      case ModuleType.HR:
        return <HR employees={employees} payrolls={payrolls} leaves={leaves} />;
      
      // Finance Placeholders
      case ModuleType.FINANCE_DASHBOARD:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-fade-in">
             <div className="bg-emerald-100 p-6 rounded-full"><Calculator className="w-12 h-12 text-emerald-600" /></div>
             <h2 className="text-2xl font-bold text-slate-800">المالية العامة</h2>
             <p className="text-slate-500">شاشة التقارير المالية والقيود اليومية (قيد التطوير).</p>
          </div>
        );
      case ModuleType.FINANCE_COA:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-fade-in">
             <div className="bg-blue-100 p-6 rounded-full"><FileSpreadsheet className="w-12 h-12 text-blue-600" /></div>
             <h2 className="text-2xl font-bold text-slate-800">شجرة الحسابات</h2>
             <p className="text-slate-500">دليل الحسابات والأرصدة الافتتاحية (قيد التطوير).</p>
          </div>
        );
      case ModuleType.FINANCE_TREASURY:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-fade-in">
             <div className="bg-amber-100 p-6 rounded-full"><Landmark className="w-12 h-12 text-amber-600" /></div>
             <h2 className="text-2xl font-bold text-slate-800">الخزنة والبنوك</h2>
             <p className="text-slate-500">إدارة النقدية والشيكات والبنوك (قيد التطوير).</p>
          </div>
        );

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
