
import React, { useState } from 'react';
import { Employee, Payroll, LeaveRequest } from '../types';
import { Search, Plus, User, Users, DollarSign, Calendar, CheckCircle2, XCircle, Clock, Briefcase } from 'lucide-react';

interface HRProps {
  employees: Employee[];
  payrolls: Payroll[];
  leaves: LeaveRequest[];
}

export const HR: React.FC<HRProps> = ({ employees, payrolls, leaves }) => {
  const [activeTab, setActiveTab] = useState<'employees' | 'payroll' | 'leaves'>('employees');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">الموارد البشرية</h2>
           <p className="text-slate-500 text-sm">إدارة شؤون الموظفين، الرواتب، والإجازات.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all">
          <Plus className="w-5 h-5" />
          <span className="font-bold">
            {activeTab === 'employees' ? 'موظف جديد' : activeTab === 'payroll' ? 'إصدار مسير رواتب' : 'طلب إجازة'}
          </span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 inline-flex shadow-sm">
        <button 
          onClick={() => setActiveTab('employees')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'employees' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Users className="w-4 h-4" />
          الموظفين
        </button>
        <button 
          onClick={() => setActiveTab('payroll')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'payroll' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <DollarSign className="w-4 h-4" />
          الرواتب
        </button>
        <button 
          onClick={() => setActiveTab('leaves')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'leaves' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Calendar className="w-4 h-4" />
          الإجازات
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
        
        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <>
             <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                <div className="relative flex-1 max-w-md">
                   <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                   <input 
                     type="text" 
                     placeholder="بحث باسم الموظف أو القسم..."
                     className="w-full pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                   <thead className="bg-slate-50 text-slate-500">
                      <tr>
                         <th className="px-6 py-4">الموظف</th>
                         <th className="px-6 py-4">القسم / الوظيفة</th>
                         <th className="px-6 py-4">تاريخ التعيين</th>
                         <th className="px-6 py-4">الراتب الأساسي</th>
                         <th className="px-6 py-4">الحالة</th>
                         <th className="px-6 py-4"></th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {employees.map(emp => (
                         <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                     {emp.avatar ? <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-slate-400" />}
                                  </div>
                                  <div>
                                     <p className="font-bold text-slate-800">{emp.name}</p>
                                     <p className="text-xs text-slate-400">#{emp.id}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <p className="font-medium text-slate-700">{emp.role}</p>
                               <p className="text-xs text-slate-500">{emp.department}</p>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{emp.joinDate}</td>
                            <td className="px-6 py-4 font-bold text-slate-800">${emp.salary.toLocaleString()}</td>
                            <td className="px-6 py-4">
                               <span className={`px-2 py-1 rounded-full text-xs font-bold ${emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                                  {emp.status === 'Active' ? 'على رأس العمل' : 'إجازة'}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-left">
                               <button className="text-indigo-600 font-bold hover:underline text-xs">عرض الملف</button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </>
        )}

        {/* Payroll Tab */}
        {activeTab === 'payroll' && (
           <div className="overflow-x-auto">
             <table className="w-full text-right text-sm">
                <thead className="bg-slate-50 text-slate-500">
                   <tr>
                      <th className="px-6 py-4">الموظف</th>
                      <th className="px-6 py-4">الشهر</th>
                      <th className="px-6 py-4">الراتب</th>
                      <th className="px-6 py-4 text-emerald-600">بدلات (+)</th>
                      <th className="px-6 py-4 text-rose-600">خصومات (-)</th>
                      <th className="px-6 py-4 font-bold">الصافي</th>
                      <th className="px-6 py-4">الحالة</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {payrolls.map(p => {
                      const emp = employees.find(e => e.id === p.employeeId);
                      return (
                         <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800">{emp?.name || p.employeeId}</td>
                            <td className="px-6 py-4">{p.month}</td>
                            <td className="px-6 py-4 text-slate-600">${p.salary.toLocaleString()}</td>
                            <td className="px-6 py-4 text-emerald-600">+${p.bonus.toLocaleString()}</td>
                            <td className="px-6 py-4 text-rose-600">-${p.deductions.toLocaleString()}</td>
                            <td className="px-6 py-4 font-bold text-indigo-700">${p.net.toLocaleString()}</td>
                            <td className="px-6 py-4">
                               {p.status === 'Paid' ? (
                                  <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs"><CheckCircle2 className="w-4 h-4" /> تم الصرف</span>
                               ) : (
                                  <span className="flex items-center gap-1 text-amber-600 font-bold text-xs"><Clock className="w-4 h-4" /> معلق</span>
                               )}
                            </td>
                         </tr>
                      );
                   })}
                </tbody>
             </table>
           </div>
        )}

        {/* Leaves Tab */}
        {activeTab === 'leaves' && (
           <div className="overflow-x-auto">
             <table className="w-full text-right text-sm">
                <thead className="bg-slate-50 text-slate-500">
                   <tr>
                      <th className="px-6 py-4">الموظف</th>
                      <th className="px-6 py-4">نوع الإجازة</th>
                      <th className="px-6 py-4">التاريخ</th>
                      <th className="px-6 py-4">السبب</th>
                      <th className="px-6 py-4">الحالة</th>
                      <th className="px-6 py-4">الإجراء</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {leaves.map(leave => {
                      const emp = employees.find(e => e.id === leave.employeeId);
                      return (
                         <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800">{emp?.name || leave.employeeId}</td>
                            <td className="px-6 py-4">
                               <span className={`px-2 py-1 rounded text-xs font-bold ${leave.type === 'Annual' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                                  {leave.type === 'Annual' ? 'سنوية' : 'مرضية'}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                               {leave.startDate} <span className="text-slate-400 mx-1">إلى</span> {leave.endDate}
                            </td>
                            <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{leave.reason}</td>
                            <td className="px-6 py-4">
                               {leave.status === 'Approved' && <span className="text-emerald-600 font-bold text-xs">مقبولة</span>}
                               {leave.status === 'Rejected' && <span className="text-rose-600 font-bold text-xs">مرفوضة</span>}
                               {leave.status === 'Pending' && <span className="text-amber-600 font-bold text-xs">قيد المراجعة</span>}
                            </td>
                            <td className="px-6 py-4">
                               {leave.status === 'Pending' && (
                                  <div className="flex gap-2">
                                     <button className="p-1 rounded bg-emerald-100 text-emerald-600 hover:bg-emerald-200"><CheckCircle2 className="w-4 h-4" /></button>
                                     <button className="p-1 rounded bg-rose-100 text-rose-600 hover:bg-rose-200"><XCircle className="w-4 h-4" /></button>
                                  </div>
                               )}
                            </td>
                         </tr>
                      );
                   })}
                </tbody>
             </table>
           </div>
        )}
      </div>
    </div>
  );
};
