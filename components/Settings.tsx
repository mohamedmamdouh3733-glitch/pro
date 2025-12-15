
import React, { useState, useRef } from 'react';
import { Settings as SettingsIcon, Building2, Users, Shield, Database, Bell, Save, Globe, Mail, Lock, Plus, X, CheckSquare, Square, KeyRound, BellRing, Smartphone, MessageSquare, Upload, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ModuleType, SystemUser } from '../types';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'security' | 'backup' | 'notifications'>('general');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [restoreStatus, setRestoreStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // --- Users Management Logic ---
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [users, setUsers] = useState<SystemUser[]>([
    { id: 'U-001', name: 'أحمد محمد', email: 'ahmed@example.com', role: 'مدير نظام', status: 'Active', pin: '1234', permissions: Object.values(ModuleType) },
    { id: 'U-002', name: 'سارة علي', email: 'sara@example.com', role: 'مبيعات', status: 'Active', pin: '0000', permissions: [ModuleType.SALES, ModuleType.CUSTOMERS, ModuleType.DASHBOARD] },
  ]);

  const [newUserForm, setNewUserForm] = useState<Partial<SystemUser>>({
    name: '', email: '', role: 'موظف', status: 'Active', pin: '', permissions: []
  });

  // Notification Settings State
  const [notifSettings, setNotifSettings] = useState({
     lowStock: true,
     newOrder: true,
     paymentReceived: true,
     newCustomer: false,
     emailAlerts: true,
     smsAlerts: false
  });

  const availableModules = [
    { id: ModuleType.DASHBOARD, label: 'لوحة التحكم' },
    { id: ModuleType.REPORTS, label: 'التقارير' },
    { id: ModuleType.INVENTORY, label: 'المخزون' },
    { id: ModuleType.SALES, label: 'المبيعات' },
    { id: ModuleType.CUSTOMERS, label: 'العملاء' },
    { id: ModuleType.PURCHASING, label: 'المشتريات' },
    { id: ModuleType.SUPPLIERS, label: 'الموردين' },
    { id: ModuleType.FINANCE_DASHBOARD, label: 'المالية العامة' },
    { id: ModuleType.FINANCE_COA, label: 'شجرة الحسابات' },
    { id: ModuleType.FINANCE_TREASURY, label: 'الخزنة والبنوك' },
    { id: ModuleType.HR, label: 'الموارد البشرية' },
    { id: ModuleType.AI_INSIGHTS, label: 'المساعد الذكي' },
    { id: ModuleType.SETTINGS, label: 'الإعدادات' },
  ];

  const handleOpenAddUser = () => {
    setNewUserForm({ name: '', email: '', role: 'موظف', status: 'Active', pin: '', permissions: [] });
    setIsUserModalOpen(true);
  };

  const togglePermission = (module: ModuleType) => {
    const currentPermissions = newUserForm.permissions || [];
    if (currentPermissions.includes(module)) {
      setNewUserForm({ ...newUserForm, permissions: currentPermissions.filter(p => p !== module) });
    } else {
      setNewUserForm({ ...newUserForm, permissions: [...currentPermissions, module] });
    }
  };

  const toggleAllPermissions = () => {
    if (newUserForm.permissions?.length === availableModules.length) {
      setNewUserForm({ ...newUserForm, permissions: [] });
    } else {
      setNewUserForm({ ...newUserForm, permissions: availableModules.map(m => m.id) });
    }
  };

  const handleSaveUser = () => {
    if (!newUserForm.name || !newUserForm.email || !newUserForm.pin) {
      alert("الرجاء إدخال الاسم، البريد، والرقم السري (PIN)");
      return;
    }
    const newUser: SystemUser = {
      id: `U-${Date.now()}`,
      name: newUserForm.name!,
      email: newUserForm.email!,
      role: newUserForm.role || 'موظف',
      status: newUserForm.status as any,
      pin: newUserForm.pin!,
      permissions: newUserForm.permissions || []
    };
    setUsers([...users, newUser]);
    setIsUserModalOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    if(confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  // --- Backup & Restore Logic ---
  const handleCreateBackup = () => {
    const data: Record<string, any> = {};
    // Collect all keys starting with 'erp_'
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('erp_')) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) || 'null');
        } catch (e) {
          data[key] = localStorage.getItem(key);
        }
      }
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NexGenERP_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRestoreBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (typeof json !== 'object') throw new Error('Invalid backup file');

        // Clear current ERP data
        Object.keys(json).forEach(key => {
           if(key.startsWith('erp_')) {
              localStorage.setItem(key, JSON.stringify(json[key]));
           }
        });
        
        setRestoreStatus('success');
        setTimeout(() => {
           window.location.reload(); // Reload to apply changes
        }, 1500);
      } catch (err) {
        console.error(err);
        setRestoreStatus('error');
      }
    };
    reader.readAsText(file);
  };

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
             onClick={() => setActiveTab('notifications')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'notifications' ? 'bg-white text-indigo-600 shadow-md border border-indigo-100' : 'text-slate-500 hover:bg-slate-100'}`}
           >
             <BellRing className="w-5 h-5" />
             إعدادات التنبيهات
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
                        <p className="text-sm text-slate-500">إضافة وتعديل حسابات الموظفين وتعيين الصلاحيات.</p>
                      </div>
                      <button 
                        onClick={handleOpenAddUser}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-indigo-500/20 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        إضافة مستخدم
                      </button>
                   </div>

                   <div className="overflow-x-auto">
                      <table className="w-full text-right text-sm">
                         <thead className="bg-slate-50 text-slate-500">
                            <tr>
                               <th className="px-4 py-3 rounded-r-lg">الاسم</th>
                               <th className="px-4 py-3">البريد الإلكتروني</th>
                               <th className="px-4 py-3">الدور الوظيفي</th>
                               <th className="px-4 py-3">الرمز (PIN)</th>
                               <th className="px-4 py-3">الصلاحيات</th>
                               <th className="px-4 py-3">الحالة</th>
                               <th className="px-4 py-3 rounded-l-lg text-center">إجراءات</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                            {users.map(user => (
                              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                 <td className="px-4 py-3 font-bold text-slate-800">{user.name}</td>
                                 <td className="px-4 py-3 text-slate-500">{user.email}</td>
                                 <td className="px-4 py-3"><span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">{user.role}</span></td>
                                 <td className="px-4 py-3 font-mono text-slate-400">****</td>
                                 <td className="px-4 py-3 text-slate-600 text-xs">
                                    <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                      {user.permissions.length} شاشات
                                    </span>
                                 </td>
                                 <td className="px-4 py-3">
                                    <span className={`text-xs font-bold flex items-center gap-1 ${user.status === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                       <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span> 
                                       {user.status === 'Active' ? 'نشط' : 'غير نشط'}
                                    </span>
                                 </td>
                                 <td className="px-4 py-3 text-center">
                                    <button onClick={() => handleDeleteUser(user.id)} className="text-rose-500 hover:text-rose-700 font-bold text-xs">حذف</button>
                                 </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <div className="border-b border-slate-100 pb-4 mb-6">
                      <h3 className="text-lg font-bold text-slate-800">إعدادات التنبيهات</h3>
                      <p className="text-sm text-slate-500">تخصيص الإشعارات التي تظهر في النظام والبريد الإلكتروني.</p>
                   </div>

                   <div className="space-y-6">
                      <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                         <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-indigo-600" />
                            تنبيهات النظام
                         </h4>
                         <div className="space-y-3">
                            <label className="flex items-center justify-between cursor-pointer">
                               <span className="text-sm text-slate-700">تنبيه عند انخفاض المخزون</span>
                               <div className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" checked={notifSettings.lowStock} onChange={() => setNotifSettings({...notifSettings, lowStock: !notifSettings.lowStock})} className="sr-only peer" />
                                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                               </div>
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                               <span className="text-sm text-slate-700">تنبيه عند استلام طلب شراء جديد</span>
                               <div className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" checked={notifSettings.newOrder} onChange={() => setNotifSettings({...notifSettings, newOrder: !notifSettings.newOrder})} className="sr-only peer" />
                                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                               </div>
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                               <span className="text-sm text-slate-700">تنبيه عند تسجيل دفعة مالية</span>
                               <div className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" checked={notifSettings.paymentReceived} onChange={() => setNotifSettings({...notifSettings, paymentReceived: !notifSettings.paymentReceived})} className="sr-only peer" />
                                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                               </div>
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                               <span className="text-sm text-slate-700">تنبيه عند إضافة عميل جديد</span>
                               <div className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" checked={notifSettings.newCustomer} onChange={() => setNotifSettings({...notifSettings, newCustomer: !notifSettings.newCustomer})} className="sr-only peer" />
                                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                               </div>
                            </label>
                         </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                         <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-emerald-600" />
                            الإشعارات الخارجية
                         </h4>
                         <div className="space-y-3">
                            <label className="flex items-center justify-between cursor-pointer">
                               <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-slate-400" />
                                  <span className="text-sm text-slate-700">إرسال ملخص يومي عبر البريد الإلكتروني</span>
                               </div>
                               <div className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" checked={notifSettings.emailAlerts} onChange={() => setNotifSettings({...notifSettings, emailAlerts: !notifSettings.emailAlerts})} className="sr-only peer" />
                                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                               </div>
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                               <div className="flex items-center gap-2">
                                  <Smartphone className="w-4 h-4 text-slate-400" />
                                  <span className="text-sm text-slate-700">إرسال تنبيهات عاجلة عبر SMS</span>
                               </div>
                               <div className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" checked={notifSettings.smsAlerts} onChange={() => setNotifSettings({...notifSettings, smsAlerts: !notifSettings.smsAlerts})} className="sr-only peer" />
                                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                               </div>
                            </label>
                         </div>
                      </div>
                   </div>
                   
                   <div className="flex justify-end pt-4">
                      <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/30 font-bold transition-all">
                         <Save className="w-5 h-5" />
                         حفظ الإعدادات
                      </button>
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
                            <h4 className="font-bold text-indigo-900 text-lg">البيانات المحلية (Local Storage)</h4>
                            <p className="text-indigo-700 text-sm mt-1">يتم حفظ البيانات تلقائياً في المتصفح. يمكنك تحميل نسخة احتياطية (JSON) وحفظها على جهازك.</p>
                            <div className="mt-4 flex gap-3">
                               <button onClick={handleCreateBackup} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2 transition-colors">
                                  <Download className="w-4 h-4" />
                                  تحميل نسخة احتياطية
                               </button>
                               <button onClick={() => fileInputRef.current?.click()} className="bg-white text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 flex items-center gap-2 transition-colors">
                                  <Upload className="w-4 h-4" />
                                  استعادة نسخة سابقة
                               </button>
                               <input type="file" ref={fileInputRef} onChange={handleRestoreBackup} className="hidden" accept=".json" />
                            </div>
                            {restoreStatus === 'success' && <p className="text-emerald-600 text-sm mt-2 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> تم استعادة البيانات بنجاح! جاري التحديث...</p>}
                            {restoreStatus === 'error' && <p className="text-rose-600 text-sm mt-2 font-bold flex items-center gap-1"><AlertTriangle className="w-4 h-4"/> حدث خطأ في الملف المختار.</p>}
                         </div>
                      </div>
                   </div>

                   <h4 className="font-bold text-slate-800 mb-3">سجل العمليات</h4>
                   <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                         <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-bold text-slate-700">نسخ تلقائي للنظام</span>
                         </div>
                         <span className="text-xs text-slate-500">الآن</span>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* --- ADD USER MODAL --- */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in zoom-in-95 duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center rounded-t-2xl">
                 <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Users className="w-6 h-6 text-indigo-600" />
                    إضافة مستخدم جديد
                 </h3>
                 <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                 {/* Basic Info */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">اسم الموظف</label>
                       <input 
                         type="text" 
                         value={newUserForm.name} 
                         onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})} 
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                         placeholder="الاسم الكامل"
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
                       <input 
                         type="email" 
                         value={newUserForm.email} 
                         onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})} 
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                         placeholder="email@company.com"
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">المسمى الوظيفي</label>
                       <select 
                         value={newUserForm.role} 
                         onChange={(e) => setNewUserForm({...newUserForm, role: e.target.value})} 
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                       >
                          <option value="مدير نظام">مدير نظام</option>
                          <option value="محاسب">محاسب</option>
                          <option value="مبيعات">مبيعات</option>
                          <option value="مخازن">أمين مخزن</option>
                          <option value="موظف">موظف عادي</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">الرقم السري (PIN) للدخول</label>
                       <div className="relative">
                          <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input 
                            type="text" 
                            maxLength={4}
                            value={newUserForm.pin} 
                            onChange={(e) => setNewUserForm({...newUserForm, pin: e.target.value.replace(/\D/g,'')})} 
                            className="w-full pr-10 pl-4 py-3 bg-white border-2 border-indigo-100 rounded-xl focus:outline-none focus:border-indigo-500 text-center font-mono text-lg tracking-widest" 
                            placeholder="0000"
                          />
                       </div>
                       <p className="text-xs text-slate-400 mt-1">يستخدم هذا الرمز لتسجيل الدخول السريع.</p>
                    </div>
                 </div>

                 {/* Permissions Selection */}
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                       <h4 className="font-bold text-slate-800 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-emerald-600" />
                          تحديد الصلاحيات (الشاشات المسموحة)
                       </h4>
                       <button onClick={toggleAllPermissions} className="text-xs text-indigo-600 font-bold hover:underline">
                          تحديد / إلغاء تحديد الكل
                       </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                       {availableModules.map((mod) => {
                          const isSelected = newUserForm.permissions?.includes(mod.id);
                          return (
                             <div 
                               key={mod.id}
                               onClick={() => togglePermission(mod.id)}
                               className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                  isSelected 
                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' 
                                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                               }`}
                             >
                                {isSelected 
                                   ? <CheckSquare className="w-5 h-5 text-indigo-600" /> 
                                   : <Square className="w-5 h-5 text-slate-300" />
                                }
                                <span className="text-sm font-bold">{mod.label}</span>
                             </div>
                          );
                       })}
                    </div>
                 </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl bg-white">
                 <button onClick={() => setIsUserModalOpen(false)} className="px-6 py-2.5 rounded-xl text-slate-500 font-bold hover:bg-slate-50">إلغاء</button>
                 <button onClick={handleSaveUser} className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    حفظ المستخدم
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
