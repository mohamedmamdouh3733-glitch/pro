import React, { useState } from 'react';
import { BrainCircuit, Sparkles, Send, Loader2 } from 'lucide-react';
import { getBusinessInsights } from '../services/geminiService';
import { KPI, SalesData } from '../types';

interface AIInsightsProps {
  kpis: KPI[];
  salesData: SalesData[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ kpis, salesData }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await getBusinessInsights(kpis, salesData);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
       <div className="text-center space-y-4">
         <div className="w-16 h-16 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-violet-500/40">
            <BrainCircuit className="w-8 h-8 text-white" />
         </div>
         <h2 className="text-3xl font-extrabold text-slate-800">مساعد الأعمال الذكي</h2>
         <p className="text-slate-500 max-w-lg mx-auto">
           استخدم قوة الذكاء الاصطناعي لتحليل بيانات شركتك والحصول على توصيات استراتيجية لتحسين الأداء وزيادة الأرباح.
         </p>
       </div>

       <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
         <div className="p-8">
            {!insight && !loading && (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">جاهز للتحليل</h3>
                <p className="text-slate-500 mb-8">اضغط على الزر أدناه لبدء تحليل بيانات المبيعات والمخزون الحالية.</p>
                <button 
                  onClick={handleGenerate}
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-transform active:scale-95 shadow-lg"
                >
                  <BrainCircuit className="w-5 h-5" />
                  <span>توليد تقرير ذكي</span>
                </button>
              </div>
            )}

            {loading && (
              <div className="text-center py-20 flex flex-col items-center">
                <Loader2 className="w-10 h-10 text-violet-600 animate-spin mb-4" />
                <p className="text-slate-600 font-medium animate-pulse">جاري الاتصال بخوادم Gemini للتحليل...</p>
              </div>
            )}

            {insight && !loading && (
              <div className="prose prose-lg text-slate-700 max-w-none">
                 <div className="bg-violet-50 border-r-4 border-violet-500 p-6 rounded-l-xl mb-6">
                   <h3 className="text-violet-900 font-bold text-lg mb-1 flex items-center gap-2">
                     <Sparkles className="w-5 h-5" />
                     نتيجة التحليل
                   </h3>
                   <div className="text-sm text-violet-700">تم التوليد بواسطة Gemini 2.5 Flash</div>
                 </div>
                 <div className="whitespace-pre-line leading-relaxed">
                   {insight}
                 </div>
                 <div className="mt-8 text-center">
                    <button 
                      onClick={() => setInsight(null)}
                      className="text-slate-400 hover:text-slate-600 text-sm font-medium"
                    >
                      إجراء تحليل جديد
                    </button>
                 </div>
              </div>
            )}
         </div>
       </div>
    </div>
  );
};