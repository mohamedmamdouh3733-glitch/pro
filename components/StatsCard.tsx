import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  colorClass: string; // e.g., "bg-blue-500"
  iconBgClass: string; // e.g., "bg-blue-100"
  iconColorClass: string; // e.g., "text-blue-600"
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, value, change, icon: Icon, colorClass, iconBgClass, iconColorClass 
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-1 h-full ${colorClass}`}></div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${iconBgClass} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${iconColorClass}`} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${change >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {change >= 0 ? '+' : ''}{change}%
        </span>
        <span className="text-xs text-slate-400">مقارنة بالشهر الماضي</span>
      </div>
    </div>
  );
};