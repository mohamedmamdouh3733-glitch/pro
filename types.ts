
export enum ModuleType {
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  HR = 'HR',
  // Commercial Modules
  SALES = 'SALES',                 // فواتير المبيعات
  CUSTOMERS = 'CUSTOMERS',         // العملاء (New)
  PURCHASING = 'PURCHASING',       // أوامر الشراء
  SUPPLIERS = 'SUPPLIERS',         // الموردين (New)
  // Finance Modules
  FINANCE_DASHBOARD = 'FINANCE_DASHBOARD', // المالية العامة
  FINANCE_COA = 'FINANCE_COA',             // شجرة الحسابات
  FINANCE_TREASURY = 'FINANCE_TREASURY',   // الخزنة
  AI_INSIGHTS = 'AI_INSIGHTS',
  SETTINGS = 'SETTINGS'
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  isRead: boolean;
}

export interface KPI {
  title: string;
  value: string;
  change: number;
  icon: string; // Icon name
  color: string; // Tailwind color class
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  itemCount: number;
}

export interface Unit {
  id: string;
  name: string;
  shortName: string; // e.g. "kg", "pcs"
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
}

export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER' | 'SALE' | 'PURCHASE';

export interface StockMovement {
  id: string;
  productId: string;
  date: string;
  type: MovementType;
  quantity: number;
  balanceAfter: number;
  warehouseId: string;
  reference: string; // Invoice #, Order #
  notes?: string;
  user: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
  // Professional ERP Fields
  barcode?: string;
  unit?: string;
  cost?: number;
  minStock?: number;
  expiryDate?: string;
  productionDate?: string;
  warehouseId?: string; // Main warehouse location
}

export interface StockOperationPayload {
  productId: string;
  type: 'ADJUSTMENT' | 'TRANSFER' | 'STOCKTAKING';
  quantity: number;
  warehouseId?: string;
  targetWarehouseId?: string;
  notes?: string;
  adjustmentType?: 'IN' | 'OUT'; // For adjustments only
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'Active' | 'On Leave';
  avatar: string;
  salary: number;
  joinDate: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  month: string;
  salary: number;
  bonus: number;
  deductions: number;
  net: number;
  status: 'Paid' | 'Pending';
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'Annual' | 'Sick' | 'Unpaid';
  startDate: string;
  endDate: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  reason: string;
}

export interface Transaction {
  id: string;
  customer: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface SalesData {
  name: string;
  revenue: number;
  profit: number;
}

// --- Sales & CRM Types ---
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  balance: number; // Positive means they owe us
  status: 'Active' | 'Inactive';
  lastOrderDate?: string;
}

export interface Invoice {
  id: string;
  customerId: string;
  date: string;
  dueDate: string;
  total: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  itemsCount: number;
}

// --- Purchasing & SRM Types ---
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  balance: number; // Positive means we owe them
  rating: number; // 1-5 stars
  status: 'Active' | 'Blocked';
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  date: string;
  expectedDelivery: string;
  total: number;
  status: 'Draft' | 'Sent' | 'Received' | 'Cancelled';
}
