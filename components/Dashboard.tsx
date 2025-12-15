
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { StatsCard } from './StatsCard';
import { TrendingUp, Users, ShoppingCart, DollarSign, Activity, Bell, AlertTriangle, CheckCircle, Info, ArrowRight, Target, BarChart3, Wallet, FileText, Zap } from 'lucide-react';
import { KPI, SalesData, AppNotification } from '../types';

interface DashboardProps {
  salesData: SalesData[];
  kpis: KPI[];
  notifications: AppNotification[];
}

export const Dashboard: React.FC<DashboardProps> = ({ salesData, kpis, notifications }) => {
  const [timeRange, setTimeRange] = useState('monthly');

  // Enhanced Colors for Cards with Gradients
  const getCardStyles = (index: number) => {
    const styles = [
      { gradient: 'from-indigo-600 to-violet-600', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
      { gradient: 'from-emerald-500 to-teal-500', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
      { gradient: 'from-amber-500 to-orange-500', iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
      { gradient: 'from-rose-500 to-pink-500', iconBg: 'bg-rose-50', iconColor: 'text-rose-600' },
    ];
    return styles[index % styles.length];
  };

  // Mock Data for Pie Chart
  const categoryData = [
    { name: 'إلكترونيات', value: 45, color: '#6366f1' },
    { name: 'أثاث', value: 25, color: '#10b981' },
    { name: 'ملابس', value: 20, color: '#f59e0b' },
    { name: 'خدمات', value: 10, color: '#f43f5e' },
  ];

  const getIcon = (name: string) => {
    switch (name) {
      case 'dollar': return DollarSign;
      case 'users': return Users;
      case 'cart': return ShoppingCart;
      case 'trend': return TrendingUp;
      default: return Activity;
    }
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
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Professional Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -mr-20 -mt-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -ml-20 -mb-20 animate-pulse animation-delay-2000"></div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-indigo-200 backdrop-blur-md">
                 NexGen ERP v1.0
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-300 backdrop-blur-md flex items-center gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                 متصل
              </span>
            </div>
            <h1 className="text-4xl font-extrabold mb-3 flex items-center gap-3 tracking-tight">
              نظرة عامة على النظام <span className="text-3xl animate-bounce">📊</span>
            </h1>
            <p className="text-slate-300 max-w-2xl text-lg leading-relaxed font-light">
              مرحباً بك مجدداً. إليك ملخص لأداء شركتك اليوم. لديك <span className="text-white font-bold border-b-2 border-indigo-400">{notifications.filter(n => !n.isRead).length} إشعارات جديدة</span> تتطلب انتباهك.
            </p>
          </div>
          <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-lg">
            <button 
              onClick={() => setTimeRange('weekly')}
              className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${timeRange === 'weekly' ? 'bg-white text-indigo-900 shadow-md transform scale-105' : 'text-indigo-100 hover:text-white hover:bg-white/5'}`}
            >
              أسبوعي
            </button>
            <button 
               onClick={() => setTimeRange('monthly')}
               className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${timeRange === 'monthly' ? 'bg-white text-indigo-900 shadow-md transform scale-105' : 'text-indigo-100 hover:text-white hover:bg-white/5'}`}
            >
              شهري
            </button>
          </div>
        </div>
      </div>

      {/* KPI Grid - Colorful Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const style = getCardStyles(idx);
          return (
            <StatsCard
              key={idx}
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              icon={getIcon(kpi.icon)}
              colorClass={style.gradient}
              iconBgClass={style.iconBg}
              iconColorClass={style.iconColor}
            />
          );
        })}
      </div>

      {/* Charts Section - Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:border-indigo-100 transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-8">
             <div>
               <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                 <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                 </div>
                 تحليل الإيرادات
               </h3>
               <p className="text-sm text-slate-400 mt-1 font-medium">مقارنة الإيرادات وصافي الربح</p>
             </div>
             <button className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-1">
               تقرير مفصل <ArrowRight className="w-4 h-4" />
             </button>
          </div>
          
          <div className="h-80 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} fontWeigth="bold" />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} dx={-10} fontWeight="bold" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', border: 'none', padding: '16px' }}
                  itemStyle={{ color: '#1e293b', fontWeight: 'bold', fontSize: '14px' }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" name="الإيرادات" />
                <Area type="monotone" dataKey="profit" stroke="#a855f7" strokeWidth={4} fillOpacity={1} fill="url(#colorProfit)" name="الربح الصافي" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart & Quick Actions Column */}
        <div className="flex flex-col gap-6">
           {/* Distribution Chart */}
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                     <Target className="w-5 h-5 text-emerald-600" />
                     توزيع المبيعات
                  </h3>
               </div>
               <div className="h-48 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                     <span className="text-2xl font-extrabold text-slate-800">100%</span>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-2 mt-2">
                  {categoryData.map((cat, idx) => (
                     <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 p-2 rounded-lg">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></div>
                        {cat.name} ({cat.value}%)
                     </div>
                  ))}
               </div>
           </div>

           {/* Quick Actions Panel */}
           <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex-1">
              {/* Abstract shapes */}
              <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-indigo-500 rounded-full blur-[50px] opacity-40"></div>
              <div className="absolute bottom-[-30px] left-[-30px] w-40 h-40 bg-pink-500 rounded-full blur-[60px] opacity-30"></div>

              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                الوصول السريع
              </h3>
              <div className="grid grid-cols-2 gap-3 relative z-10">
                 <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-2xl flex flex-col items-center gap-3 transition-all group border border-white/5 hover:border-white/20 hover:-translate-y-1">
                    <div className="bg-emerald-500/20 p-2 rounded-xl group-hover:bg-emerald-500/40 transition-colors">
                       <ShoppingCart className="w-5 h-5 text-emerald-300" />
                    </div>
                    <span className="text-xs font-bold">فاتورة جديدة</span>
                 </button>
                 <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-2xl flex flex-col items-center gap-3 transition-all group border border-white/5 hover:border-white/20 hover:-translate-y-1">
                    <div className="bg-blue-500/20 p-2 rounded-xl group-hover:bg-blue-500/40 transition-colors">
                       <Users className="w-5 h-5 text-blue-300" />
                    </div>
                    <span className="text-xs font-bold">إضافة عميل</span>
                 </button>
                 <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-2xl flex flex-col items-center gap-3 transition-all group border border-white/5 hover:border-white/20 hover:-translate-y-1">
                    <div className="bg-amber-500/20 p-2 rounded-xl group-hover:bg-amber-500/40 transition-colors">
                       <Wallet className="w-5 h-5 text-amber-300" />
                    </div>
                    <span className="text-xs font-bold">تسجيل مصروف</span>
                 </button>
                 <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-2xl flex flex-col items-center gap-3 transition-all group border border-white/5 hover:border-white/20 hover:-translate-y-1">
                    <div className="bg-purple-500/20 p-2 rounded-xl group-hover:bg-purple-500/40 transition-colors">
                       <FileText className="w-5 h-5 text-purple-300" />
                    </div>
                    <span className="text-xs font-bold">تقارير</span>
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <Bell className="w-5 h-5 text-indigo-600" />
               آخر التنبيهات
            </h3>
            <button className="text-sm font-bold text-slate-400 hover:text-indigo-600">عرض الكل</button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {notifications.slice(0, 3).map((notif) => (
                <div key={notif.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex gap-3 group">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${getNotificationBg(notif.type)} group-hover:scale-110 transition-transform`}>
                     {getNotificationIcon(notif.type)}
                   </div>
                   <div>
                     <h4 className="text-sm font-bold text-slate-800">{notif.title}</h4>
                     <p className="text-xs text-slate-500 mt-1 line-clamp-1">{notif.message}</p>
                     <span className="text-[10px] text-slate-400 mt-2 block">{notif.timestamp}</span>
                   </div>
                </div>
             ))}
         </div>
      </div>
    </div>
  );
};
