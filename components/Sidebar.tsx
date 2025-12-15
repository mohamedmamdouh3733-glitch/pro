
import React from 'react';
import { ModuleType } from '../types';
import { LayoutDashboard, Package, Users, DollarSign, BrainCircuit, Box, LogOut, FileSpreadsheet, Landmark, Truck, Receipt, UserCheck, ShoppingCart, Settings, BarChart2 } from 'lucide-react';

interface SidebarProps {
  currentModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
  onLogout?: () => void; // Add optional prop for logout
}

export const Sidebar: React.FC<SidebarProps> = ({ currentModule, onModuleChange, onLogout }) => {
  
  const mainItems = [
    { id: ModuleType.DASHBOARD, label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: ModuleType.REPORTS, label: 'التقارير والتحليلات', icon: BarChart2 },
    { id: ModuleType.INVENTORY, label: 'المخزون والمنتجات', icon: Package },
  ];

  const commercialItems = [
    { id: ModuleType.CUSTOMERS, label: 'العملاء', icon: UserCheck },
    { id: ModuleType.SALES, label: 'فواتير المبيعات', icon: Receipt },
    { id: ModuleType.SUPPLIERS, label: 'الموردين', icon: Truck },
    { id: ModuleType.PURCHASING, label: 'أوامر الشراء', icon: ShoppingCart },
  ];

  const financeItems = [
    { id: ModuleType.FINANCE_DASHBOARD, label: 'المالية العامة', icon: DollarSign },
    { id: ModuleType.FINANCE_COA, label: 'شجرة الحسابات', icon: FileSpreadsheet },
    { id: ModuleType.FINANCE_TREASURY, label: 'الخزنة والبنوك', icon: Landmark },
  ];

  const adminItems = [
    { id: ModuleType.HR, label: 'الموارد البشرية', icon: Users },
    { id: ModuleType.SETTINGS, label: 'الإعدادات', icon: Settings },
  ];

  const renderNavItem = (item: any) => {
    const Icon = item.icon;
    const isActive = currentModule === item.id;
    return (
      <button
        key={item.id}
        onClick={() => onModuleChange(item.id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
          isActive 
            ? 'bg-primary text-white shadow-lg shadow-primary/30 translate-x-1' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
        }`}
      >
        {/* Active Indicator Glow */}
        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/30"></div>}
        
        <Icon className={`w-5 h-5 relative z-10 transition-transform duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary group-hover:scale-110'}`} />
        <span className="font-medium text-sm relative z-10">{item.label}</span>
      </button>
    );
  };

  return (
    <aside className="w-64 bg-white border-l border-slate-200 h-screen flex flex-col justify-between shadow-2xl z-20 hidden md:flex overflow-y-auto custom-scrollbar">
      <div>
        <div className="h-24 flex items-center justify-center border-b border-slate-50 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3 text-primary font-extrabold text-2xl tracking-tight">
             <div className="bg-gradient-to-br from-primary to-secondary text-white p-2 rounded-xl shadow-lg shadow-primary/30">
                <Box className="w-6 h-6 fill-white" />
             </div>
             <span>ERP PRO</span>
          </div>
        </div>
        
        <nav className="p-4 space-y-6">
          {/* Main Section */}
          <div className="space-y-1">
             <div className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-8 h-[1px] bg-slate-200"></span> الرئيسية
             </div>
             {mainItems.map(item => renderNavItem(item))}
          </div>

          {/* Commercial Section */}
          <div className="space-y-1">
             <div className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-8 h-[1px] bg-slate-200"></span> العمليات التجارية
             </div>
             {commercialItems.map(item => renderNavItem(item))}
          </div>

          {/* Finance Section */}
          <div className="space-y-1">
             <div className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-8 h-[1px] bg-slate-200"></span> الإدارة المالية
             </div>
             {financeItems.map(item => renderNavItem(item))}
          </div>

          {/* HR & Admin Section */}
          <div className="space-y-1">
             <div className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-8 h-[1px] bg-slate-200"></span> الإدارة
             </div>
             {adminItems.map(item => renderNavItem(item))}
          </div>
          
          {/* AI Section */}
          <div className="space-y-1">
             <button
                onClick={() => onModuleChange(ModuleType.AI_INSIGHTS)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden relative ${
                  currentModule === ModuleType.AI_INSIGHTS 
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/30' 
                    : 'text-slate-600 hover:bg-violet-50 hover:text-violet-600 border border-transparent hover:border-violet-100'
                }`}
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                
                <BrainCircuit className="w-5 h-5 relative z-10" />
                <span className="font-bold text-sm relative z-10">المساعد الذكي</span>
              </button>
          </div>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors group font-bold"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};
