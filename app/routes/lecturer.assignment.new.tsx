import type { Route } from "./+types/lecturer.assignment.new";
import MainLayout from "../components/MainLayout";
import { ChevronRight, Save, X, Calendar, Settings } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create Assignment | Check Hit" },
  ];
}

export default function LecturerAssignmentNewRoute() {
  const { courseId } = useParams();
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
      <MainLayout portalName="פורטל מרצים" view="lecturer">
        <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <Save size={40} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">המטלה נוצרה בהצלחה!</h1>
          <p className="text-gray-500 max-w-md text-center mb-8">המטלה הופצה ל-120 סטודנטים הרשומים לקורס, וה-AI מוכן לבדוק את ההגשות.</p>
          <Link to={`/lecturer/courses/${courseId}`} className="bg-[#00857e] text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors">
            חזרה לדף הקורס
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout portalName="פורטל מרצים" view="lecturer">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
        <header className="border-b border-gray-200 pb-6">
          <Link to={`/lecturer/courses/${courseId}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#00857e] transition-colors mb-4">
            <ChevronRight size={16} /> ביטול וחזרה
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-teal-50 text-[#00857e] px-2 py-1 rounded text-sm font-bold tracking-widest">CS101</span>
                <h1 className="text-3xl font-extrabold text-gray-900">יצירת מטלה חדשה</h1>
              </div>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8 space-y-8">
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">שם המטלה <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                className="w-full border border-gray-200 rounded-xl p-3 text-lg focus:ring-2 focus:ring-[#00857e] focus:outline-none bg-gray-50 hover:bg-white focus:bg-white transition-colors"
                placeholder="למשל: תרגיל בית 4: גרפים"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} className="text-[#00857e]" />
                  תאריך יעד להגשה <span className="text-red-500">*</span>
                </label>
                <input 
                  type="datetime-local" 
                  required
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#00857e] focus:outline-none bg-gray-50 hover:bg-white focus:bg-white transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Settings size={16} className="text-[#00857e]" />
                  סוג מטלה (הגשה) <span className="text-red-500">*</span>
                </label>
                <select className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#00857e] focus:outline-none bg-gray-50 hover:bg-white focus:bg-white transition-colors">
                  <option value="file">העלאת קובץ (ZIP / PDF)</option>
                  <option value="text">הזנת טקסט חופשי</option>
                  <option value="github">קישור ל-GitHub Repository</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">תיאור והנחיות למטלה <span className="text-red-500">*</span></label>
              <textarea 
                required
                rows={8}
                className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#00857e] focus:outline-none bg-gray-50 hover:bg-white focus:bg-white transition-colors resize-none"
                placeholder="הקלד כאן את הנחיות המטלה לסטודנטים, דרישות המערכת, תנאי הגשה וכדומה..."
              ></textarea>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
            <Link to={`/lecturer/courses/${courseId}`} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2">
              <X size={18} />
              ביטול
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#00857e] text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>שומר מטלה...</>
              ) : (
                <>
                  <Save size={18} />
                  פרסם מטלה
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </MainLayout>
  );
}
