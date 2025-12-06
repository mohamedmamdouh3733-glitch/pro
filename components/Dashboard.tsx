
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { StatsCard } from './StatsCard';
import { TrendingUp, Users, ShoppingCart, DollarSign, Activity, Bell, AlertTriangle, CheckCircle, Info, Clock } from 'lucide-react';
import { KPI, SalesData, AppNotification } from '../types';

interface DashboardProps {
  salesData: SalesData[];
  kpis: KPI[];
  notifications: AppNotification[];
}

export const Dashboard: React.FC<DashboardProps> = ({ salesData, kpis, notifications }) => {
  const [timeRange, setTimeRange] = useState('monthly');

  // Helper to map icon string to component (simplified for this demo)
  const getIcon = (name: string) => {
    switch (name) {
      case 'dollar': return DollarSign;
      case 'users': return Users;
      case 'cart': return ShoppingCart;
      case 'trend': return TrendingUp;
      default: return Activity;
    }
  };

  const getColors = (index: number) => {
    const colors = [
      { border: 'bg-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-600' },
      { border: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
      { border: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-600' },
      { border: 'bg-rose-500', bg: 'bg-rose-50', text: 'text-rose-600' },
    ];
    return colors[index % colors.length];
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch(type) {
      case 'warning': return 'bg-amber-50';
      case 'success': return 'bg-emerald-50';
      case 'error': return 'bg-rose-50';
      default: return 'bg-blue-50';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">نظرة عامة</h2>
          <p className="text-slate-500 text-sm">مرحباً بك مرة أخرى، إليك ملخص لأداء شركتك اليوم.</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <button 
            onClick={() => setTimeRange('weekly')}
            className={`px-4 py-1.5 text-sm rounded-md transition-all ${timeRange === 'weekly' ? 'bg-primary text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
          >
            أسبوعي
          </button>
          <button 
             onClick={() => setTimeRange('monthly')}
             className={`px-4 py-1.5 text-sm rounded-md transition-all ${timeRange === 'monthly' ? 'bg-primary text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
          >
            شهري
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const colors = getColors(idx);
          return (
            <StatsCard
              key={idx}
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              icon={getIcon(kpi.icon)}
              colorClass={colors.border}
              iconBgClass={colors.bg}
              iconColorClass={colors.text}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">تحليل الإيرادات والأرباح</h3>
          <div className="h-80 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: 'none' }}
                  itemStyle={{ color: '#1e293b' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="الإيرادات" />
                <Area type="monotone" dataKey="profit" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" name="الربح الصافي" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Notifications & Alerts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <Bell className="w-5 h-5 text-indigo-600" />
               الإشعارات
             </h3>
             <span className="text-xs font-medium text-white bg-red-500 px-2 py-0.5 rounded-full">
               {notifications.filter(n => !n.isRead).length} جديد
             </span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 max-h-[350px]">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif.id} className={`p-3 rounded-xl border flex gap-3 transition-colors ${notif.isRead ? 'bg-white border-slate-100' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationBg(notif.type)}`}>
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                       <h4 className="text-sm font-bold text-slate-800">{notif.title}</h4>
                       <span className="text-[10px] text-slate-400 flex items-center gap-1">
                         <Clock className="w-3 h-3" /> {notif.timestamp}
                       </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p>لا توجد إشعارات جديدة</p>
              </div>
            )}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-slate-500 font-medium hover:bg-slate-50 rounded-lg transition-colors border border-dashed border-slate-200">
            عرض كل الإشعارات
          </button>
        </div>
      </div>
    </div>
  );
};
