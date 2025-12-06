
import React, { useState, useEffect } from 'react';
import { Product, Category, Unit, Warehouse, StockMovement, StockOperationPayload } from '../types';
import { Search, Filter, Plus, MoreVertical, ScanBarcode, Scale, Package, DollarSign, Calendar, Save, X, AlertCircle, FileText, Tag, ChevronDown, Layers, Ruler, ArrowRightLeft, History, ClipboardCheck, ArrowUpRight, ArrowDownLeft, Eye, Pencil, Trash2, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface InventoryProps {
  products: Product[];
  categories: Category[];
  units: Unit[];
  warehouses: Warehouse[];
  stockMovements: StockMovement[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onStockOperation: (payload: StockOperationPayload) => void;
}

type Tab = 'products' | 'categories' | 'units' | 'operations';

export const Inventory: React.FC<InventoryProps> = ({ 
  products, categories, units, warehouses, stockMovements, 
  onAddProduct, onUpdateProduct, onDeleteProduct, onStockOperation 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Modals State
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // To distinguish Add vs Edit
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusTargetProduct, setStatusTargetProduct] = useState<Product | null>(null);

  // New Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [isOperationModalOpen, setIsOperationModalOpen] = useState(false);
  const [operationType, setOperationType] = useState<'ADJUSTMENT' | 'TRANSFER' | 'STOCKTAKING'>('ADJUSTMENT');

  // Form State for Product
  const initialProductState = {
    name: '',
    barcode: '',
    category: '',
    unit: '',
    stock: 0,
    minStock: 0,
    cost: 0,
    price: 0,
    expiryDate: '',
    productionDate: ''
  };
  const [productForm, setProductForm] = useState(initialProductState);

  // Form State for Operations
  const [opForm, setOpForm] = useState({
    productId: '',
    warehouseId: '',
    targetWarehouseId: '',
    quantity: 0,
    adjustmentType: 'IN' as 'IN' | 'OUT',
    notes: ''
  });

  // Initialize form when opening modal for Edit
  useEffect(() => {
    if (isEditMode && selectedProduct) {
      setProductForm({
        name: selectedProduct.name,
        barcode: selectedProduct.barcode || '',
        category: selectedProduct.category, 
        unit: selectedProduct.unit || '',
        stock: selectedProduct.stock,
        minStock: selectedProduct.minStock || 0,
        cost: selectedProduct.cost || 0,
        price: selectedProduct.price,
        expiryDate: selectedProduct.expiryDate || '',
        productionDate: selectedProduct.productionDate || ''
      });
    } else {
      setProductForm(initialProductState);
    }
  }, [isEditMode, selectedProduct, isAddProductModalOpen]);


  const getMovementColor = (type: string) => {
    switch(type) {
      case 'PURCHASE': return 'text-emerald-600 bg-emerald-50';
      case 'SALE': return 'text-rose-600 bg-rose-50';
      case 'TRANSFER': return 'text-blue-600 bg-blue-50';
      case 'ADJUSTMENT': return 'text-amber-600 bg-amber-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getMovementIcon = (type: string) => {
    switch(type) {
      case 'PURCHASE': return <ArrowDownLeft className="w-4 h-4" />;
      case 'SALE': return <ArrowUpRight className="w-4 h-4" />;
      case 'TRANSFER': return <ArrowRightLeft className="w-4 h-4" />;
      default: return <ClipboardCheck className="w-4 h-4" />;
    }
  };

  // Handlers
  const handleSaveProduct = () => {
    if (isEditMode && selectedProduct) {
      const updated: Product = {
        ...selectedProduct,
        ...productForm,
        lastUpdated: new Date().toISOString().split('T')[0],
        status: productForm.stock <= 0 ? 'Out of Stock' : (productForm.stock <= (productForm.minStock || 0) ? 'Low Stock' : 'In Stock')
      };
      onUpdateProduct(updated);
      setSelectedProduct(updated); 
    } else {
      const newProduct: Product = {
        id: `P-${Math.floor(Math.random() * 10000)}`,
        ...productForm,
        status: productForm.stock <= 0 ? 'Out of Stock' : (productForm.stock <= (productForm.minStock || 0) ? 'Low Stock' : 'In Stock'),
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      onAddProduct(newProduct);
    }
    setIsAddProductModalOpen(false);
    setIsEditMode(false);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete.id);
      if (selectedProduct?.id === productToDelete.id) {
        setSelectedProduct(null);
      }
      setProductToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const openDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditMode(true);
    setIsAddProductModalOpen(true);
  };

  const openStatusModal = (product: Product) => {
    setStatusTargetProduct(product);
    setIsStatusModalOpen(true);
  };

  const changeProductStatus = (newStatus: 'In Stock' | 'Low Stock' | 'Out of Stock') => {
    if (statusTargetProduct) {
      const updated = { ...statusTargetProduct, status: newStatus };
      onUpdateProduct(updated);
      if (selectedProduct?.id === statusTargetProduct.id) {
        setSelectedProduct(updated);
      }
      setIsStatusModalOpen(false);
      setStatusTargetProduct(null);
    }
  };

  const handleExecuteOperation = () => {
    if(!opForm.productId) {
      alert("الرجاء اختيار المنتج");
      return;
    }
    if(opForm.quantity <= 0) {
      alert("الرجاء إدخال كمية صحيحة");
      return;
    }
    
    onStockOperation({
      productId: opForm.productId,
      type: operationType,
      quantity: opForm.quantity,
      warehouseId: opForm.warehouseId,
      targetWarehouseId: opForm.targetWarehouseId,
      notes: opForm.notes,
      adjustmentType: opForm.adjustmentType
    });

    setIsOperationModalOpen(false);
    // Reset minimal form but keep generic fields reasonable
    setOpForm({ ...opForm, quantity: 0, notes: '', adjustmentType: 'IN' });
  };


  // --- ITEM CARD VIEW (Product Details) ---
  if (selectedProduct && !isAddProductModalOpen && !isStatusModalOpen && !isDeleteModalOpen) {
    const productMovements = stockMovements.filter(m => m.productId === selectedProduct.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header & Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowRight className="w-6 h-6 text-slate-500" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
               {selectedProduct.name}
               <button 
                 onClick={() => openStatusModal(selectedProduct)}
                 className={`text-xs px-2 py-1 rounded-full border cursor-pointer hover:opacity-80 transition-opacity ${
                   selectedProduct.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                   selectedProduct.status === 'Low Stock' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                   'bg-rose-100 text-rose-700 border-rose-200'
                 }`}
               >
                 {selectedProduct.status === 'In Stock' ? 'متوفر' : selectedProduct.status === 'Low Stock' ? 'منخفض' : 'غير متوفر'}
                 <span className="mr-1 text-[10px] opacity-70">(تغيير)</span>
               </button>
            </h2>
            <div className="flex items-center gap-3 text-slate-500 text-sm mt-1">
               <span className="flex items-center gap-1"><ScanBarcode className="w-4 h-4"/> {selectedProduct.barcode}</span>
               <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
               <span>{selectedProduct.category}</span>
            </div>
          </div>
          <div className="mr-auto flex gap-2">
            <button 
              onClick={() => openEditModal(selectedProduct)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-bold shadow-sm"
            >
              <Pencil className="w-4 h-4" /> تعديل
            </button>
            <button 
              onClick={() => openDeleteModal(selectedProduct)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 rounded-lg text-rose-600 hover:bg-rose-50 font-bold shadow-sm"
            >
              <Trash2 className="w-4 h-4" /> حذف
            </button>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-bold mb-1">الرصيد الحالي</p>
                <h3 className="text-2xl font-bold text-slate-800">{selectedProduct.stock} <span className="text-sm font-normal text-slate-400">{selectedProduct.unit}</span></h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Package className="w-6 h-6" /></div>
           </div>
           <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-bold mb-1">سعر التكلفة</p>
                <h3 className="text-2xl font-bold text-slate-800">${selectedProduct.cost}</h3>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><DollarSign className="w-6 h-6" /></div>
           </div>
           <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-bold mb-1">سعر البيع</p>
                <h3 className="text-2xl font-bold text-slate-800">${selectedProduct.price}</h3>
              </div>
              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><Tag className="w-6 h-6" /></div>
           </div>
           <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-bold mb-1">حد الطلب</p>
                <h3 className="text-2xl font-bold text-slate-800">{selectedProduct.minStock}</h3>
              </div>
              <div className="bg-rose-50 p-3 rounded-xl text-rose-600"><AlertCircle className="w-6 h-6" /></div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main: Movement History */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <History className="w-5 h-5 text-indigo-600" />
                 سجل حركات الصنف
               </h3>
               <button className="text-xs text-indigo-600 font-bold hover:underline">تحميل المزيد</button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3">التاريخ</th>
                      <th className="px-4 py-3">نوع الحركة</th>
                      <th className="px-4 py-3">المستند / المرجع</th>
                      <th className="px-4 py-3">الكمية</th>
                      <th className="px-4 py-3">الرصيد بعد</th>
                      <th className="px-4 py-3">المسؤول</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {productMovements.length > 0 ? productMovements.map(move => (
                      <tr key={move.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-600 font-mono">{move.date}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${getMovementColor(move.type)}`}>
                             {getMovementIcon(move.type)}
                             {move.type === 'PURCHASE' ? 'فاتورة شراء' : 
                              move.type === 'SALE' ? 'فاتورة بيع' : 
                              move.type === 'TRANSFER' ? 'تحويل مخزني' : 'تسوية جردية'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{move.reference}</td>
                        <td className={`px-4 py-3 font-bold ${move.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {move.quantity > 0 ? '+' : ''}{move.quantity}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-800">{move.balanceAfter}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{move.user}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-400">لا توجد حركات مسجلة لهذا الصنف بعد.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>

          {/* Sidebar: Details & Quick Actions */}
          <div className="space-y-6">
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">بيانات تفصيلية</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">تاريخ الانتهاء</span>
                    <span className="text-slate-800 font-medium">{selectedProduct.expiryDate || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">تاريخ الانتاج</span>
                    <span className="text-slate-800 font-medium">{selectedProduct.productionDate || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">آخر تحديث</span>
                    <span className="text-slate-800 font-medium">{selectedProduct.lastUpdated}</span>
                  </div>
                   <div className="flex justify-between">
                    <span className="text-slate-500">المخزن الافتراضي</span>
                    <span className="text-slate-800 font-medium">المخزن الرئيسي</span>
                  </div>
                </div>
             </div>
             
             {/* Quick Actions Panel */}
             <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="font-bold text-lg mb-2">إجراءات سريعة</h3>
                <p className="text-indigo-100 text-sm mb-6">يمكنك تنفيذ عمليات مخزنية مباشرة من هنا.</p>
                <div className="grid grid-cols-2 gap-3">
                   <button 
                      onClick={() => { 
                        setOperationType('TRANSFER'); 
                        setOpForm({ ...opForm, productId: selectedProduct.id, warehouseId: 'WH-001' }); 
                        setIsOperationModalOpen(true); 
                      }} 
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-xl flex flex-col items-center gap-2 transition-all"
                   >
                      <ArrowRightLeft className="w-5 h-5" />
                      <span className="text-xs font-bold">تحويل</span>
                   </button>
                   
                   <button 
                      onClick={() => { 
                        setOperationType('STOCKTAKING'); 
                        setOpForm({ ...opForm, productId: selectedProduct.id, adjustmentType: 'IN' }); 
                        setIsOperationModalOpen(true); 
                      }} 
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-xl flex flex-col items-center gap-2 transition-all"
                   >
                      <ClipboardCheck className="w-5 h-5" />
                      <span className="text-xs font-bold">جرد</span>
                   </button>
                   
                   <button 
                      onClick={() => { 
                        setOperationType('ADJUSTMENT'); 
                        // Automatically set to OUT for scrap/damage scenario and pre-fill note
                        setOpForm({ ...opForm, productId: selectedProduct.id, adjustmentType: 'OUT', notes: 'تالف مخزني / إتلاف' }); 
                        setIsOperationModalOpen(true); 
                      }} 
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-xl flex flex-col items-center gap-2 transition-all"
                   >
                      <Trash2 className="w-5 h-5" />
                      <span className="text-xs font-bold">إتلاف</span>
                   </button>
                   
                   <button 
                      onClick={() => openEditModal(selectedProduct)} 
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-xl flex flex-col items-center gap-2 transition-all"
                   >
                      <Pencil className="w-5 h-5" />
                      <span className="text-xs font-bold">تعديل</span>
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-6 animate-fade-in relative font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">إدارة المخزون</h2>
           <p className="text-slate-500 text-sm">شاشة شاملة للمنتجات، الجرد، والتسويات المخزنية.</p>
        </div>
        
        {/* Dynamic Add Button */}
        <button 
          onClick={() => {
            if(activeTab === 'products') {
               setIsEditMode(false);
               setSelectedProduct(null);
               setIsAddProductModalOpen(true);
            }
            if(activeTab === 'categories') setIsAddCategoryModalOpen(true);
            if(activeTab === 'units') setIsAddUnitModalOpen(true);
            if(activeTab === 'operations') {
               setOperationType('TRANSFER');
               setIsOperationModalOpen(true);
            }
          }}
          className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
        >
          <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform duration-300">
            <Plus className="w-5 h-5" />
          </div>
          <span className="font-bold">
            {activeTab === 'products' ? 'إضافة منتج جديد' : 
             activeTab === 'categories' ? 'إضافة تصنيف' : 
             activeTab === 'units' ? 'إضافة وحدة قياس' : 'عملية جديدة'}
          </span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 inline-flex shadow-sm overflow-x-auto max-w-full">
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'products' ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          <Package className="w-4 h-4" />
          المنتجات
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'categories' ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          <Layers className="w-4 h-4" />
          التصنيفات
        </button>
        <button 
          onClick={() => setActiveTab('units')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'units' ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          <Ruler className="w-4 h-4" />
          وحدات القياس
        </button>
        <button 
          onClick={() => setActiveTab('operations')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'operations' ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          العمليات المخزنية
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* View: Products */}
        {activeTab === 'products' && (
          <>
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
              <div className="relative w-full sm:w-96">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="بحث باسم المنتج، الكود، أو الباركود..." 
                  className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-bold shadow-sm transition-colors">
                  <Filter className="w-4 h-4" />
                  <span>تصفية</span>
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-bold shadow-sm transition-colors">
                  <FileText className="w-4 h-4" />
                  <span>تصدير</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                    <th className="px-6 py-4">تفاصيل المنتج</th>
                    <th className="px-6 py-4">الوحدة</th>
                    <th className="px-6 py-4">السعر والتكلفة</th>
                    <th className="px-6 py-4">الرصيد</th>
                    <th className="px-6 py-4 text-center">الحالة</th>
                    <th className="px-6 py-4 text-left">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedProduct(product)}>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                            <Package className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm mb-1 group-hover:text-indigo-600 transition-colors">{product.name}</div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">{product.id}</span>
                              {product.barcode && (
                                <span className="flex items-center gap-1 text-slate-400">
                                  <ScanBarcode className="w-3 h-3"/> 
                                  {product.barcode}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                          {product.unit || 'قطعة'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">${product.price.toLocaleString()}</span>
                          {product.cost && <span className="text-xs text-slate-400 line-through">${product.cost}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-slate-800 font-bold">{product.stock}</div>
                          {product.minStock && product.stock <= product.minStock && (
                              <div className="group/tooltip relative">
                                <AlertCircle className="w-4 h-4 text-rose-500 cursor-help" />
                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-slate-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10">وصل لحد الطلب</span>
                              </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={(e) => { e.stopPropagation(); openStatusModal(product); }}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm transition-all hover:scale-105 ${
                          product.status === 'In Stock' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          product.status === 'Low Stock' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ml-2 ${
                            product.status === 'In Stock' ? 'bg-emerald-500' :
                            product.status === 'Low Stock' ? 'bg-amber-500' :
                            'bg-rose-500'
                          }`}></span>
                          {product.status === 'In Stock' ? 'متوفر' : product.status === 'Low Stock' ? 'منخفض' : 'نفذت الكمية'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-left">
                         <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setSelectedProduct(product)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all" title="كارت الصنف">
                               <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => openEditModal(product)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all" title="تعديل">
                               <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => openDeleteModal(product)} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all" title="حذف">
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* View: Categories */}
        {activeTab === 'categories' && (
           <div className="overflow-x-auto">
             <table className="w-full text-right">
               <thead>
                 <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                   <th className="px-6 py-4">اسم التصنيف</th>
                   <th className="px-6 py-4">الوصف</th>
                   <th className="px-6 py-4">عدد المنتجات</th>
                   <th className="px-6 py-4 text-left">إجراءات</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {categories.map((cat) => (
                   <tr key={cat.id} className="hover:bg-indigo-50/30 transition-colors">
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                         <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                           <Layers className="w-5 h-5" />
                         </div>
                         <span className="font-bold text-slate-800">{cat.name}</span>
                       </div>
                     </td>
                     <td className="px-6 py-4 text-sm text-slate-500">{cat.description || '-'}</td>
                     <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
                          {cat.itemCount} منتج
                        </span>
                     </td>
                     <td className="px-6 py-4 text-left">
                       <button className="text-slate-400 hover:text-indigo-600 transition-colors p-2">
                         <MoreVertical className="w-5 h-5" />
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        )}

        {/* View: Units */}
        {activeTab === 'units' && (
           <div className="overflow-x-auto">
             <table className="w-full text-right">
               <thead>
                 <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                   <th className="px-6 py-4">اسم الوحدة</th>
                   <th className="px-6 py-4">الرمز المختصر</th>
                   <th className="px-6 py-4">المعرف</th>
                   <th className="px-6 py-4 text-left">إجراءات</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {units.map((unit) => (
                   <tr key={unit.id} className="hover:bg-indigo-50/30 transition-colors">
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                         <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                           <Ruler className="w-5 h-5" />
                         </div>
                         <span className="font-bold text-slate-800">{unit.name}</span>
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <span className="bg-slate-100 font-mono text-slate-600 px-2 py-1 rounded text-sm border border-slate-200">
                         {unit.shortName}
                       </span>
                     </td>
                     <td className="px-6 py-4 text-sm text-slate-400 font-mono">{unit.id}</td>
                     <td className="px-6 py-4 text-left">
                       <button className="text-slate-400 hover:text-indigo-600 transition-colors p-2">
                         <MoreVertical className="w-5 h-5" />
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        )}

        {/* View: Operations (Stocktaking, Transfers, Adjustments) */}
        {activeTab === 'operations' && (
           <div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Operation Buttons */}
                 <div onClick={() => { setOperationType('STOCKTAKING'); setIsOperationModalOpen(true); }} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all">
                    <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                      <ClipboardCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">جرد المخزون</h3>
                    <p className="text-slate-400 text-sm">مطابقة الأرصدة الفعلية مع الدفترية وتسوية الفروقات.</p>
                 </div>
                 
                 <div onClick={() => { setOperationType('TRANSFER'); setIsOperationModalOpen(true); }} className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all shadow-indigo-500/20">
                    <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                      <ArrowRightLeft className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">تحويل مخزني</h3>
                    <p className="text-indigo-100 text-sm">نقل البضائع بين الفروع والمستودعات المختلفة.</p>
                 </div>

                 <div onClick={() => { setOperationType('ADJUSTMENT'); setIsOperationModalOpen(true); }} className="bg-gradient-to-br from-rose-600 to-rose-700 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all shadow-rose-500/20">
                    <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">تسوية / إتلاف</h3>
                    <p className="text-rose-100 text-sm">إخراج بضاعة تالفة أو تسوية عجز مباشر.</p>
                 </div>
              </div>

              <div className="border-t border-slate-100 p-4">
                <h3 className="font-bold text-slate-800 mb-4">آخر العمليات المسجلة</h3>
                <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3">المستند</th>
                      <th className="px-4 py-3">النوع</th>
                      <th className="px-4 py-3">المنتج</th>
                      <th className="px-4 py-3">الكمية</th>
                      <th className="px-4 py-3">ملاحظات</th>
                      <th className="px-4 py-3">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stockMovements.filter(m => ['TRANSFER', 'ADJUSTMENT'].includes(m.type)).map(move => (
                      <tr key={move.id}>
                        <td className="px-4 py-3 font-mono">{move.reference}</td>
                        <td className="px-4 py-3">
                           <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${getMovementColor(move.type)}`}>
                             {getMovementIcon(move.type)}
                             {move.type === 'TRANSFER' ? 'تحويل' : 'تسوية'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-700">{products.find(p => p.id === move.productId)?.name}</td>
                        <td className="px-4 py-3 ltr" dir="ltr">{move.quantity}</td>
                        <td className="px-4 py-3 text-slate-500">{move.notes || '-'}</td>
                        <td className="px-4 py-3 text-slate-500">{move.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
           </div>
        )}
        
        {/* Pagination (Shared Visual) */}
        {activeTab !== 'operations' && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
             <span>عرض السجلات الحالية</span>
             <div className="flex gap-1">
               <button className="px-3 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-50">السابق</button>
               <button className="px-3 py-1 rounded-md bg-indigo-600 text-white border border-indigo-600">1</button>
               <button className="px-3 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-100">التالي</button>
             </div>
          </div>
        )}
      </div>

      {/* --- Modals --- */}

      {/* 1. Add/Edit Product Modal */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-50 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200 animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="px-8 py-5 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-100">
                  <Package className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{isEditMode ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}</h3>
                  <p className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    النظام جاهز لاستقبال البيانات
                  </p>
                </div>
              </div>
              <button onClick={() => setIsAddProductModalOpen(false)} className="p-2.5 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-500 transition-colors border border-transparent hover:border-rose-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleSaveProduct(); }}>
                {/* Basic Info */}
                <div className="relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:border-blue-300 transition-colors duration-300">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
                     <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Tag className="w-5 h-5" /></div>
                     <h4 className="text-base font-bold text-slate-800">البيانات الأساسية</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">اسم المنتج <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          value={productForm.name}
                          onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" 
                          placeholder="مثال: سماعة بلوتوث" 
                          required
                        />
                     </div>
                     <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">الباركود / SKU</label>
                        <div className="relative group/input">
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-500 transition-colors"><ScanBarcode className="w-5 h-5" /></div>
                          <input 
                            type="text" 
                            value={productForm.barcode}
                            onChange={(e) => setProductForm({...productForm, barcode: e.target.value})}
                            className="w-full pr-10 pl-24 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-mono text-sm" 
                            placeholder="Scan..." 
                          />
                          <button type="button" onClick={() => setProductForm({...productForm, barcode: String(Math.floor(Math.random() * 1000000000))})} className="absolute left-2 top-2 bottom-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold transition-colors border border-blue-100">توليد</button>
                        </div>
                     </div>
                     <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">التصنيف</label>
                        <div className="relative">
                          <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                          <select 
                            value={productForm.category}
                            onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                          >
                            <option value="">اختر تصنيف...</option>
                            {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                          </select>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Inventory & Units */}
                <div className="relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:border-cyan-300 transition-colors duration-300">
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                  <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
                     <div className="bg-cyan-50 p-2 rounded-lg text-cyan-600"><Scale className="w-5 h-5" /></div>
                     <h4 className="text-base font-bold text-slate-800">المخزون والوحدات</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">وحدة القياس</label>
                      <div className="relative">
                         <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                         <select 
                            value={productForm.unit}
                            onChange={(e) => setProductForm({...productForm, unit: e.target.value})}
                            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all appearance-none cursor-pointer"
                         >
                            <option value="">اختر الوحدة...</option>
                            {units.map(u => <option key={u.id} value={u.name}>{u.name} ({u.shortName})</option>)}
                         </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">الرصيد الافتتاحي</label>
                      <input 
                        type="number" 
                        value={productForm.stock}
                        onChange={(e) => setProductForm({...productForm, stock: Number(e.target.value)})}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all" 
                        placeholder="0" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">حد الطلب (تنبيه)</label>
                      <input 
                        type="number" 
                        value={productForm.minStock}
                        onChange={(e) => setProductForm({...productForm, minStock: Number(e.target.value)})}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all" 
                        placeholder="10" 
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing & Dates */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:border-violet-300 transition-colors duration-300">
                        <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
                        <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
                            <div className="bg-violet-50 p-2 rounded-lg text-violet-600"><DollarSign className="w-5 h-5" /></div>
                            <h4 className="text-base font-bold text-slate-800">التسعير</h4>
                        </div>
                        <div className="flex gap-4">
                             <input 
                               type="number" 
                               value={productForm.cost}
                               onChange={(e) => setProductForm({...productForm, cost: Number(e.target.value)})}
                               className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl" 
                               placeholder="التكلفة" 
                             />
                             <input 
                               type="number" 
                               value={productForm.price}
                               onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})}
                               className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold" 
                               placeholder="سعر البيع" 
                             />
                        </div>
                    </div>
                    <div className="relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:border-rose-300 transition-colors duration-300">
                        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                        <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
                            <div className="bg-rose-50 p-2 rounded-lg text-rose-600"><Calendar className="w-5 h-5" /></div>
                            <h4 className="text-base font-bold text-slate-800">التواريخ</h4>
                        </div>
                        <div className="flex gap-4">
                             <input 
                               type="date" 
                               value={productForm.expiryDate}
                               onChange={(e) => setProductForm({...productForm, expiryDate: e.target.value})}
                               className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500" 
                             />
                             <input 
                               type="date" 
                               value={productForm.productionDate}
                               onChange={(e) => setProductForm({...productForm, productionDate: e.target.value})}
                               className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500" 
                             />
                        </div>
                    </div>
                 </div>

              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3 sticky bottom-0 z-20">
               <button onClick={() => setIsAddProductModalOpen(false)} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50">إلغاء</button>
               <button onClick={handleSaveProduct} className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/30 flex items-center gap-2">
                 <Save className="w-5 h-5" />
                 <span>{isEditMode ? 'حفظ التعديلات' : 'حفظ المنتج'}</span>
               </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Change Status Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in zoom-in-95 duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 overflow-hidden">
             <div className="p-6 text-center">
                <h3 className="text-lg font-bold text-slate-800 mb-2">تحديث حالة المنتج</h3>
                <p className="text-slate-500 text-sm mb-6">اختر الحالة الجديدة للمنتج: <br/> <span className="font-bold text-slate-800">{statusTargetProduct?.name}</span></p>
                
                <div className="space-y-3">
                   <button 
                     onClick={() => changeProductStatus('In Stock')}
                     className="w-full p-3 rounded-xl border flex items-center justify-between hover:bg-emerald-50 hover:border-emerald-200 group transition-all"
                   >
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                         <span className="font-bold text-slate-700 group-hover:text-emerald-700">متوفر (In Stock)</span>
                      </div>
                      {statusTargetProduct?.status === 'In Stock' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                   </button>
                   
                   <button 
                     onClick={() => changeProductStatus('Low Stock')}
                     className="w-full p-3 rounded-xl border flex items-center justify-between hover:bg-amber-50 hover:border-amber-200 group transition-all"
                   >
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                         <span className="font-bold text-slate-700 group-hover:text-amber-700">منخفض (Low Stock)</span>
                      </div>
                      {statusTargetProduct?.status === 'Low Stock' && <CheckCircle2 className="w-5 h-5 text-amber-600" />}
                   </button>

                   <button 
                     onClick={() => changeProductStatus('Out of Stock')}
                     className="w-full p-3 rounded-xl border flex items-center justify-between hover:bg-rose-50 hover:border-rose-200 group transition-all"
                   >
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                         <span className="font-bold text-slate-700 group-hover:text-rose-700">غير متوفر (Out of Stock)</span>
                      </div>
                      {statusTargetProduct?.status === 'Out of Stock' && <CheckCircle2 className="w-5 h-5 text-rose-600" />}
                   </button>
                </div>
             </div>
             <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-center">
                <button onClick={() => setIsStatusModalOpen(false)} className="text-slate-500 font-bold text-sm hover:text-slate-700">إلغاء</button>
             </div>
           </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in zoom-in-95 duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 overflow-hidden">
             <div className="p-6 text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <AlertTriangle className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">هل أنت متأكد؟</h3>
                <p className="text-slate-500 text-sm mb-6">
                  أنت على وشك حذف المنتج <span className="font-bold text-slate-800">{productToDelete?.name}</span>. لا يمكن التراجع عن هذا الإجراء.
                </p>
                <div className="flex gap-3">
                   <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors">إلغاء</button>
                   <button onClick={confirmDeleteProduct} className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-lg shadow-rose-500/30 transition-colors">نعم، حذف</button>
                </div>
             </div>
           </div>
        </div>
      )}

      {/* 3. Add Category Modal */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              إضافة تصنيف جديد
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">اسم التصنيف</label>
                <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="مثال: مشروبات" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الوصف (اختياري)</label>
                <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none h-24 resize-none" placeholder="وصف للتصنيف..."></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
               <button onClick={() => setIsAddCategoryModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-50 font-bold text-sm">إلغاء</button>
               <button onClick={() => setIsAddCategoryModalOpen(false)} className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 text-sm shadow-md shadow-indigo-500/20">حفظ</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Add Unit Modal */}
      {isAddUnitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Ruler className="w-5 h-5 text-emerald-600" />
              إضافة وحدة قياس
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">اسم الوحدة</label>
                <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="مثال: جرام" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الرمز المختصر</label>
                <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none" placeholder="مثال: gm" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
               <button onClick={() => setIsAddUnitModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-50 font-bold text-sm">إلغاء</button>
               <button onClick={() => setIsAddUnitModalOpen(false)} className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-sm shadow-md shadow-emerald-500/20">حفظ</button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Operations Modal (Transfer / Adjustment) */}
      {isOperationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in zoom-in-95 duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                 <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                   {operationType === 'TRANSFER' && <ArrowRightLeft className="w-5 h-5 text-indigo-600" />}
                   {operationType === 'ADJUSTMENT' && <AlertCircle className="w-5 h-5 text-rose-600" />}
                   {operationType === 'STOCKTAKING' && <ClipboardCheck className="w-5 h-5 text-slate-800" />}
                   {operationType === 'TRANSFER' ? 'تحويل مخزني جديد' : operationType === 'ADJUSTMENT' ? 'تسوية / إذن إضافة' : 'جرد مخزني'}
                 </h3>
                 <button onClick={() => setIsOperationModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-red-500" /></button>
              </div>
              
              <div className="p-6 space-y-4">
                 {/* Product Selection */}
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">المنتج</label>
                    <select 
                      value={opForm.productId}
                      onChange={(e) => setOpForm({...opForm, productId: e.target.value})}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      disabled={!!selectedProduct && !isAddProductModalOpen} // Disable if opened from Item Card
                    >
                       <option value="">اختر المنتج...</option>
                       {products.map(p => <option key={p.id} value={p.id}>{p.name} (الرصيد: {p.stock})</option>)}
                    </select>
                 </div>

                 {/* For Transfers: Source/Destination */}
                 {operationType === 'TRANSFER' && (
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">من مخزن</label>
                          <select 
                            value={opForm.warehouseId}
                            onChange={(e) => setOpForm({...opForm, warehouseId: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                          >
                             <option value="">اختر..</option>
                             {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                          </select>
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">إلى مخزن</label>
                          <select 
                            value={opForm.targetWarehouseId}
                            onChange={(e) => setOpForm({...opForm, targetWarehouseId: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                          >
                             <option value="">اختر..</option>
                             {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                          </select>
                       </div>
                    </div>
                 )}

                 {/* For Stocktaking/Adjustment */}
                 {operationType !== 'TRANSFER' && (
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">نوع الحركة</label>
                         <select 
                           value={opForm.adjustmentType}
                           onChange={(e) => setOpForm({...opForm, adjustmentType: e.target.value as any})}
                           className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                         >
                            <option value="IN">إضافة / فائض (+)</option>
                            <option value="OUT">صرف / عجز / تالف (-)</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">المخزن</label>
                         <select 
                           value={opForm.warehouseId}
                           onChange={(e) => setOpForm({...opForm, warehouseId: e.target.value})}
                           className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                         >
                             <option value="">اختر..</option>
                             {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                         </select>
                      </div>
                   </div>
                 )}
                 
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">الكمية</label>
                    <input 
                      type="number" 
                      value={opForm.quantity}
                      onChange={(e) => setOpForm({...opForm, quantity: Number(e.target.value)})}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                      placeholder="0" 
                    />
                 </div>
                 
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">ملاحظات</label>
                    <textarea 
                      value={opForm.notes}
                      onChange={(e) => setOpForm({...opForm, notes: e.target.value})}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none h-20 resize-none" 
                      placeholder="سبب الحركة..."
                    ></textarea>
                 </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                 <button onClick={() => setIsOperationModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-500 font-bold hover:bg-slate-200 transition-colors">إلغاء</button>
                 <button onClick={handleExecuteOperation} className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">تأكيد العملية</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
