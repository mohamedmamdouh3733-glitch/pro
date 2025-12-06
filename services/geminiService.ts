import { GoogleGenAI } from "@google/genai";
import { KPI, SalesData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBusinessInsights = async (
  kpis: KPI[],
  salesData: SalesData[]
): Promise<string> => {
  try {
    const kpiSummary = kpis.map(k => `${k.title}: ${k.value} (${k.change > 0 ? '+' : ''}${k.change}%)`).join(', ');
    const salesSummary = salesData.map(s => `${s.name}: Revenue ${s.revenue}, Profit ${s.profit}`).join('; ');

    const prompt = `
      بصفتك مستشار أعمال خبير لنظام ERP، قم بتحليل البيانات التالية وقدم 3 رؤى استراتيجية قصيرة ومحددة باللغة العربية لتحسين الأداء.
      استخدم نبرة مهنية ومشجعة.
      
      البيانات الحالية:
      KPIs: ${kpiSummary}
      Sales Trend: ${salesSummary}
      
      المطلوب: 3 نقاط قصيرة جداً.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "لم يتم العثور على رؤى متاحة حالياً.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "نعتذر، خدمة الذكاء الاصطناعي غير متاحة مؤقتاً.";
  }
};