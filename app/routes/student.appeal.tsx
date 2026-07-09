import type { Route } from "./+types/student.appeal";
import MainLayout from "../components/MainLayout";
import { ChevronRight, FileText, UploadCloud, AlertCircle } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Appeal Assignment | Check Hit" },
  ];
}

export default function StudentAppealRoute() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <MainLayout portalName="פורטל סטודנטים" view="student">
        <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={40} className="transform rotate-180" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">הערעור הוגש בהצלחה</h1>
          <p className="text-gray-500 max-w-md text-center mb-8">הערעור שלך הועבר לצוות ההוראה ותקבל עדכון ברגע שתתקבל החלטה.</p>
          <Link to="/student/assignments" className="bg-[#00857e] text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors">
            חזרה למטלות
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout portalName="פורטל סטודנטים" view="student">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto pb-12">
        <header className="border-b border-gray-200 pb-6">
          <Link to="/student/assignments" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#00857e] transition-colors mb-4">
            <ChevronRight size={16} /> ביטול וחזרה
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">הגשת ערעור</h1>
          <p className="text-gray-500 mt-2">מטלה 2: מיון מהיר (ציון: 82)</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          
          <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-xl text-sm flex gap-3">
            <AlertCircle className="shrink-0 text-blue-500" />
            <div>
              <strong className="block mb-1">שים לב לפני הגשת הערעור:</strong>
              בדוק היטב את הערות ה-AI והמרצה למטלה שלך. ערעור דורש נימוק מבוסס. הציון עשוי לעלות, לרדת או להישאר ללא שינוי.
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">נימוק הערעור (חובה)</label>
            <textarea 
              required
              rows={6}
              className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#00857e] focus:outline-none bg-gray-50 hover:bg-white focus:bg-white transition-colors resize-none"
              placeholder="הסבר בפירוט מדוע לדעתך יש לשנות את הציון..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">קובץ מצורף (אופציונלי)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-teal-50 hover:border-teal-300 transition-colors cursor-pointer group">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-gray-400 group-hover:text-[#00857e] transition-colors">
                <UploadCloud size={28} />
              </div>
              <p className="text-gray-700 font-bold mb-1">גרור קובץ לכאן או לחץ להעלאה</p>
              <p className="text-sm text-gray-500">ניתן להעלות קובצי Markdown או Text בלבד</p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#00857e] text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>שולח ערעור...</>
              ) : (
                <>הגש ערעור לבדיקה</>
              )}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
