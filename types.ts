
export enum ModuleType {
  DASHBOARD = 'DASHBOARD',
  REPORTS = 'REPORTS',             // موديول التقارير الجديد
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
export interface CustomerInteraction {
  id: string;
  customerId: string;
  date: string;
  type: 'CALL' | 'MEETING' | 'EMAIL' | 'NOTE';
  summary: string;
  outcome?: string;
  nextActionDate?: string;
}

export interface CustomerTransaction {
  id: string;
  customerId: string;
  date: string;
  type: 'INVOICE' | 'PAYMENT' | 'RETURN';
  reference: string;
  amount: number; // Positive for Invoice, Negative for Payment
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  balance: number; // Positive means they owe us
  creditLimit?: number;
  taxNumber?: string;
  status: 'Active' | 'Inactive';
  lastOrderDate?: string;
  category?: 'VIP' | 'Regular' | 'New';
}

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  unit?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string; // Denormalized for display
  date: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  items: InvoiceItem[];
  notes?: string;
  
  // Advanced ERP Fields
  paymentType?: 'CASH' | 'CREDIT';
  withholdingTaxRate?: number; // e.g., 0, 1, 3
  withholdingTaxAmount?: number;
  additionalDiscount?: number;
  additionalDiscountType?: 'PERCENTAGE' | 'FIXED';
  amountInWords?: string;
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
  address?: string;
  taxNumber?: string;
}

export interface SupplierTransaction {
  id: string;
  supplierId: string;
  date: string;
  type: 'INVOICE' | 'PAYMENT' | 'RETURN';
  reference: string;
  amount: number; // Positive = We owe them (Invoice), Negative = We paid (Payment)
  description: string;
}

export interface PurchaseItem {
  id: string;
  productId: string;
  productName: string;
  unit?: string;
  quantity: number;
  cost: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  dueDate: string;
  expectedDelivery?: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Received' | 'Cancelled';
  items: PurchaseItem[];
  notes?: string;
  paymentType?: 'CASH' | 'CREDIT';
  additionalDiscount?: number;
  additionalDiscountType?: 'PERCENTAGE' | 'FIXED';
  amountInWords?: string;
}

// --- Finance Types ---
export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  balance: number;
  parentAccount?: string;
  isHeader: boolean;
  level: number;
}

export interface JournalEntryLine {
  id: string;
  accountId: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  reference: string;
  description: string;
  lines: JournalEntryLine[];
  status: 'Posted' | 'Draft';
  createdAt: string;
}

export interface TreasuryAccount {
  id: string;
  name: string;
  type: 'CASH' | 'BANK';
  balance: number;
  currency: string;
  accountNumber?: string;
}

export interface TreasuryTransaction {
  id: string;
  date: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  accountId: string;
  targetAccountId?: string; // For transfers
  description: string;
  category: string;
}

export interface Voucher {
  id: string;
  type: 'PAYMENT' | 'RECEIPT';
  date: string;
  amount: number;
  accountId: string; // Bank/Cash Account
  targetAccountId: string; // Expense/Revenue/Party Account
  description: string;
  payee?: string;
  reference?: string; // Optional reference number
}

export interface FinancialDocument {
  id: string;
  type: 'PAYMENT_VOUCHER' | 'RECEIPT_VOUCHER' | 'PETTY_CASH';
  date: string;
  reference: string;
  description: string;
  amount: number;
  status: 'Posted' | 'Void';
  beneficiary?: string; // Payee or Payer
  details?: any; // For petty cash lines or extra info
}

export interface Budget {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  period: string;
}

// --- System Users & Security ---
export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  pin: string; // Login PIN
  permissions: ModuleType[]; // Allowed Modules
}
