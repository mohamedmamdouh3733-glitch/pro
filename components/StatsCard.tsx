
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  colorClass: string; // expects tailwind gradient classes like "from-blue-500 to-blue-600"
  iconBgClass: string; 
  iconColorClass: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, value, change, icon: Icon, colorClass, iconBgClass, iconColorClass 
}) => {
  // Extract color for the wave based on the gradient class
  const getStrokeColor = () => {
    if (colorClass.includes('indigo')) return '#6366f1';
    if (colorClass.includes('emerald')) return '#10b981';
    if (colorClass.includes('amber')) return '#f59e0b';
    if (colorClass.includes('rose')) return '#f43f5e';
    return '#64748b';
  };

  return (
    <div className="relative overflow-hidden bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group cursor-default">
      {/* Dynamic Background Wave SVG */}
      <div className="absolute bottom-0 left-0 right-0 h-24 opacity-10 pointer-events-none group-hover:scale-110 group-hover:opacity-20 transition-all duration-700 ease-in-out">
        <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
          <path fill={getStrokeColor()} fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      {/* Decorative Blur Blobs */}
      <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${colorClass} opacity-[0.05] rounded-full blur-3xl group-hover:opacity-[0.15] transition-opacity duration-500`}></div>

      <div className="relative z-10 flex justify-between items-start mb-4">
        <div className={`p-3.5 rounded-2xl shadow-sm ${iconBgClass} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ring-1 ring-black/5`}>
          <Icon className={`w-7 h-7 ${iconColorClass}`} />
        </div>
        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm ${change >= 0 ? 'bg-emerald-50/80 text-emerald-700 border-emerald-100' : 'bg-rose-50/80 text-rose-700 border-rose-100'}`}>
           <span>{change >= 0 ? '▲' : '▼'}</span>
           <span>{Math.abs(change)}%</span>
        </div>
      </div>

      <div className="relative z-10 mt-2">
        <h3 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-1 group-hover:translate-x-1 transition-transform">{value}</h3>
        <p className="text-slate-500 text-sm font-bold opacity-80 flex items-center gap-2">
          {title}
        </p>
      </div>
      
      {/* Bottom Border Line for extra pop on hover */}
      <div className={`absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r ${colorClass} opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>
    </div>
  );
};
