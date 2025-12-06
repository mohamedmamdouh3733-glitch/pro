
import React, { useState } from 'react';
import { Settings as SettingsIcon, Building2, Users, Shield, Database, Bell, Save, Globe, Mail, Lock } from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'security' | 'backup'>('general');

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-slate-800 p-3 rounded-2xl text-white">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
           <h2 className="text-2xl font-bold text-slate-800">إعدادات النظام</h2>
           <p className="text-slate-500 text-sm">تحكم في بيانات المؤسسة، المستخدمين، والصلاحيات.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1 space-y-2">
           <button 
             onClick={() => setActiveTab('general')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'general' ? 'bg-white text-indigo-600 shadow-md border border-indigo-100' : 'text-slate-500 hover:bg-slate-100'}`}
           >
             <Building2 className="w-5 h-5" />
             عام والمؤسسة
           </button>
           <button 
             onClick={() => setActiveTab('users')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'users' ? 'bg-white text-indigo-600 shadow-md border border-indigo-100' : 'text-slate-500 hover:bg-slate-100'}`}
           >
             <Users className="w-5 h-5" />
             إدارة المستخدمين
           </button>
           <button 
             onClick={() => setActiveTab('security')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'security' ? 'bg-white text-indigo-600 shadow-md border border-indigo-100' : 'text-slate-500 hover:bg-slate-100'}`}
           >
             <Shield className="w-5 h-5" />
             الأمان والصلاحيات
           </button>
           <button 
             onClick={() => setActiveTab('backup')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'backup' ? 'bg-white text-indigo-600 shadow-md border border-indigo-100' : 'text-slate-500 hover:bg-slate-100'}`}
           >
             <Database className="w-5 h-5" />
             النسخ الاحتياطي
           </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[500px]">
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <div className="border-b border-slate-100 pb-4 mb-6">
                      <h3 className="text-lg font-bold text-slate-800">بيانات المؤسسة</h3>
                      <p className="text-sm text-slate-500">هذه البيانات ستظهر في الفواتير والتقارير الرسمية.</p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-2 flex justify-center mb-4">
                         <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-colors">
                            <div className="text-center text-slate-400">
                               <Building2 className="w-8 h-8 mx-auto mb-1" />
                               <span className="text-xs">رفع الشعار</span>
                            </div>
                         </div>
                      </div>

                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">اسم المؤسسة</label>
                         <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" defaultValue="شركة النخبة للتجارة" />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">الرقم الضريبي</label>
                         <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" defaultValue="300123456700003" />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">رقم الهاتف</label>
                         <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" defaultValue="+966 50 123 4567" />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
                         <input type="email" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" defaultValue="info@elite-trading.com" />
                      </div>
                      <div className="col-span-2">
                         <label className="block text-sm font-bold text-slate-700 mb-2">العنوان</label>
                         <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" defaultValue="الرياض، طريق الملك فهد، مبنى رقم 12" />
                      </div>
                   </div>

                   <div className="flex justify-end pt-6 border-t border-slate-100">
                      <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/30 font-bold transition-all">
                         <Save className="w-5 h-5" />
                         حفظ التغييرات
                      </button>
                   </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">إدارة المستخدمين</h3>
                        <p className="text-sm text-slate-500">إضافة وتعديل حسابات الموظفين.</p>
                      </div>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold">إضافة مستخدم</button>
                   </div>

                   <div className="overflow-x-auto">
                      <table className="w-full text-right text-sm">
                         <thead className="bg-slate-50 text-slate-500">
                            <tr>
                               <th className="px-4 py-3 rounded-r-lg">الاسم</th>
                               <th className="px-4 py-3">البريد الإلكتروني</th>
                               <th className="px-4 py-3">الدور الوظيفي</th>
                               <th className="px-4 py-3">الحالة</th>
                               <th className="px-4 py-3 rounded-l-lg">إجراءات</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                            <tr>
                               <td className="px-4 py-3 font-bold text-slate-800">أحمد محمد</td>
                               <td className="px-4 py-3 text-slate-500">ahmed@example.com</td>
                               <td className="px-4 py-3"><span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">مدير نظام</span></td>
                               <td className="px-4 py-3"><span className="text-emerald-600 font-bold text-xs flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> نشط</span></td>
                               <td className="px-4 py-3 text-indigo-600 font-bold cursor-pointer hover:underline">تعديل</td>
                            </tr>
                            <tr>
                               <td className="px-4 py-3 font-bold text-slate-800">سارة علي</td>
                               <td className="px-4 py-3 text-slate-500">sara@example.com</td>
                               <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">مبيعات</span></td>
                               <td className="px-4 py-3"><span className="text-emerald-600 font-bold text-xs flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> نشط</span></td>
                               <td className="px-4 py-3 text-indigo-600 font-bold cursor-pointer hover:underline">تعديل</td>
                            </tr>
                            <tr>
                               <td className="px-4 py-3 font-bold text-slate-800">خالد يوسف</td>
                               <td className="px-4 py-3 text-slate-500">khaled@example.com</td>
                               <td className="px-4 py-3"><span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">محاسب</span></td>
                               <td className="px-4 py-3"><span className="text-slate-400 font-bold text-xs flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400"></span> غير نشط</span></td>
                               <td className="px-4 py-3 text-indigo-600 font-bold cursor-pointer hover:underline">تعديل</td>
                            </tr>
                         </tbody>
                      </table>
                   </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <div className="border-b border-slate-100 pb-4 mb-6">
                      <h3 className="text-lg font-bold text-slate-800">الأمان والخصوصية</h3>
                      <p className="text-sm text-slate-500">إعدادات الأمان وسياسات كلمة المرور.</p>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                         <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-600"><Lock className="w-5 h-5" /></div>
                            <div>
                               <h4 className="font-bold text-slate-800">المصادقة الثنائية (2FA)</h4>
                               <p className="text-xs text-slate-500">زيادة الأمان عن طريق طلب رمز OTP عند تسجيل الدخول.</p>
                            </div>
                         </div>
                         <div className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                         </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                         <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg shadow-sm text-emerald-600"><Globe className="w-5 h-5" /></div>
                            <div>
                               <h4 className="font-bold text-slate-800">تسجيل الجلسات النشطة</h4>
                               <p className="text-xs text-slate-500">مراقبة وتسجيل جميع عمليات تسجيل الدخول للنظام.</p>
                            </div>
                         </div>
                         <div className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {/* Backup Tab */}
              {activeTab === 'backup' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <div className="border-b border-slate-100 pb-4 mb-6">
                      <h3 className="text-lg font-bold text-slate-800">النسخ الاحتياطي والاستعادة</h3>
                      <p className="text-sm text-slate-500">حماية بياناتك هي أولويتنا القصوى.</p>
                   </div>

                   <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-6">
                      <div className="flex items-start gap-4">
                         <Database className="w-8 h-8 text-indigo-600 mt-1" />
                         <div>
                            <h4 className="font-bold text-indigo-900 text-lg">النسخ الاحتياطي التلقائي مفعل</h4>
                            <p className="text-indigo-700 text-sm mt-1">يتم أخذ نسخة احتياطية من قاعدة البيانات يومياً في الساعة 12:00 صباحاً.</p>
                            <div className="mt-4 flex gap-3">
                               <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700">إنشاء نسخة الآن</button>
                               <button className="bg-white text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50">إعدادات الجدول</button>
                            </div>
                         </div>
                      </div>
                   </div>

                   <h4 className="font-bold text-slate-800 mb-3">سجل النسخ الاحتياطي</h4>
                   <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                         <span className="text-sm font-bold text-slate-700">Backup_2023_10_26.sql</span>
                         <span className="text-xs text-slate-500">12 MB • منذ يوم</span>
                      </div>
                      <div className="p-3 border-b border-slate-100 bg-white flex justify-between items-center">
                         <span className="text-sm font-bold text-slate-700">Backup_2023_10_25.sql</span>
                         <span className="text-xs text-slate-500">11.8 MB • منذ يومين</span>
                      </div>
                      <div className="p-3 bg-white flex justify-between items-center">
                         <span className="text-sm font-bold text-slate-700">Backup_2023_10_24.sql</span>
                         <span className="text-xs text-slate-500">11.5 MB • منذ 3 أيام</span>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
