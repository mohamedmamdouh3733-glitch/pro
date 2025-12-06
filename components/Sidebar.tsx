
import React from 'react';
import { ModuleType } from '../types';
import { LayoutDashboard, Package, Users, DollarSign, BrainCircuit, Box, LogOut, FileSpreadsheet, Landmark, ShoppingBag, Truck, Receipt, UserCheck, ShoppingCart, Settings, Briefcase } from 'lucide-react';

interface SidebarProps {
  currentModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentModule, onModuleChange }) => {
  
  const mainItems = [
    { id: ModuleType.DASHBOARD, label: 'لوحة التحكم', icon: LayoutDashboard },
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

  const NavItem = ({ item }: { item: any }) => {
    const Icon = item.icon;
    const isActive = currentModule === item.id;
    return (
      <button
        onClick={() => onModuleChange(item.id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive 
            ? 'bg-primary text-white shadow-lg shadow-primary/30' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
        }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`} />
        <span className="font-medium text-sm">{item.label}</span>
      </button>
    );
  };

  return (
    <aside className="w-64 bg-white border-l border-slate-200 h-screen flex flex-col justify-between shadow-xl z-20 hidden md:flex overflow-y-auto custom-scrollbar">
      <div>
        <div className="h-20 flex items-center justify-center border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2 text-primary font-bold text-2xl">
            <Box className="w-8 h-8 fill-primary text-white" />
            <span>ERP PRO</span>
          </div>
        </div>
        
        <nav className="p-4 space-y-4">
          {/* Main Section */}
          <div className="space-y-1">
             <div className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">الرئيسية</div>
             {mainItems.map(item => <NavItem key={item.id} item={item} />)}
          </div>

          {/* Commercial Section */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
             <div className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">العمليات التجارية</div>
             {commercialItems.map(item => <NavItem key={item.id} item={item} />)}
          </div>

          {/* Finance Section */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
             <div className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">الإدارة المالية</div>
             {financeItems.map(item => <NavItem key={item.id} item={item} />)}
          </div>

          {/* HR & Admin Section */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
             <div className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">الموارد البشرية والإدارة</div>
             {adminItems.map(item => <NavItem key={item.id} item={item} />)}
          </div>
          
          {/* AI Section */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
             <div className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">الذكاء الاصطناعي</div>
             <button
                onClick={() => onModuleChange(ModuleType.AI_INSIGHTS)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  currentModule === ModuleType.AI_INSIGHTS 
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                    : 'text-slate-600 hover:bg-violet-50 hover:text-violet-600'
                }`}
              >
                <BrainCircuit className="w-5 h-5" />
                <span className="font-medium text-sm">المساعد الذكي</span>
              </button>
          </div>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};
