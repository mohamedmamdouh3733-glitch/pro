
import React, { useState } from 'react';
import { Box, Lock, Mail, ArrowRight, AlertCircle, Info } from 'lucide-react';

interface LoginProps {
  onLogin: (user: { name: string; role: string }) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // محاكاة عملية تحقق بسيطة
    setTimeout(() => {
      if (email === 'admin' && password === 'admin') {
        // دخول المدير الافتراضي
        onLogin({ name: 'المدير العام', role: 'مدير النظام' });
      } else if (email && password) {
         // للسماح بالدخول التجريبي بأي بيانات، نستخدم الاسم من البريد الإلكتروني
         const derivedName = email.includes('@') ? email.split('@')[0] : email;
         // تحسين مظهر الاسم (تكبير الحرف الأول إذا كان إنجليزياً)
         const displayName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
         onLogin({ name: displayName, role: 'موظف' });
      } else {
        setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden font-sans" dir="rtl">
      {/* خلفية متحركة وألوان */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600 rounded-full blur-[120px] opacity-40 animate-pulse delay-1000"></div>
      
      {/* نمط شبكي للخلفية */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

      <div className="w-full max-w-md p-8 relative z-10 animate-fade-in">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden p-8">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 shadow-lg shadow-indigo-500/30 mb-4">
              <Box className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">NexGen ERP</h1>
            <p className="text-slate-300 text-sm">نظام إدارة موارد المؤسسات المتكامل</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 mr-1 block">اسم المستخدم / البريد</label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3.5 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-500"
                  placeholder="admin"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 mr-1 block">كلمة المرور</label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-fuchsia-400 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-3.5 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 transition-all placeholder:text-slate-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-400 text-sm bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  جاري التحقق...
                </>
              ) : (
                <>
                  تسجيل الدخول <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Login Hint */}
          <div className="mt-6 bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 flex items-start gap-3">
             <Info className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
             <div className="text-right">
                <p className="text-slate-300 text-xs font-bold mb-1">بيانات الدخول الافتراضية (للإدارة):</p>
                <div className="flex gap-4 text-xs font-mono text-indigo-300 dir-ltr">
                   <span>User: <strong className="text-white">admin</strong></span>
                   <span>Pass: <strong className="text-white">admin</strong></span>
                </div>
             </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-xs">
              جميع الحقوق محفوظة © 2024 NexGen ERP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
