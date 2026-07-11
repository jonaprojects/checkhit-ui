import type { Route } from "./+types/lecturer.course.new";
import MainLayout from "../components/MainLayout";
import { ChevronRight, Save, X, BookOpen, GraduationCap, Calendar, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Create New Course | Check Hit" },
  ];
}

export default function NewCourseRoute() {
  const navigate = useNavigate();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Normally we'd save to API, then redirect
    navigate('/lecturer/courses');
  };

  return (
    <MainLayout portalName="פורטל מרצים" view="lecturer">
      <div className="max-w-3xl mx-auto pb-12 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="mb-8">
          <Link to="/lecturer/courses" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4 w-fit transition-colors">
            <ChevronRight size={18} /> חזרה לקורסים
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">יצירת קורס חדש</h1>
          <p className="text-gray-500 mt-2 text-lg">הזן את פרטי הקורס החדש שברצונך לפתוח</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Field: Course Name */}
            <div>
              <label htmlFor="courseName" className="block text-sm font-bold text-gray-700 mb-2">
                שם הקורס
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-gray-400">
                  <BookOpen size={20} />
                </div>
                <input
                  type="text"
                  id="courseName"
                  className="block w-full ps-12 pe-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#00857e] focus:border-transparent transition-all outline-none"
                  placeholder="לדוגמה: מבני נתונים ואלגוריתמים"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Field: Course Code */}
              <div>
                <label htmlFor="courseCode" className="block text-sm font-bold text-gray-700 mb-2">
                  קוד קורס
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-gray-400">
                    <GraduationCap size={20} />
                  </div>
                  <input
                    type="text"
                    id="courseCode"
                    className="block w-full ps-12 pe-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#00857e] focus:border-transparent transition-all outline-none"
                    placeholder="לדוגמה: CS101"
                    required
                  />
                </div>
              </div>

              {/* Field: Semester */}
              <div>
                <label htmlFor="semester" className="block text-sm font-bold text-gray-700 mb-2">
                  סמסטר ושנה
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-gray-400">
                    <Calendar size={20} />
                  </div>
                  <input
                    type="text"
                    id="semester"
                    className="block w-full ps-12 pe-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#00857e] focus:border-transparent transition-all outline-none"
                    placeholder="לדוגמה: סמסטר א׳ תשפ״ו"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Field: Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
                תיאור הקורס (אופציונלי)
              </label>
              <div className="relative">
                <div className="absolute top-3 start-0 ps-4 flex items-start pointer-events-none text-gray-400">
                  <FileText size={20} />
                </div>
                <textarea
                  id="description"
                  rows={4}
                  className="block w-full ps-12 pe-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#00857e] focus:border-transparent transition-all outline-none resize-none"
                  placeholder="תיאור קצר של מטרות ותכני הקורס..."
                ></textarea>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-end gap-4">
              <Link to="/lecturer/courses" className="px-6 py-3 text-gray-500 font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2">
                <X size={20} />
                ביטול
              </Link>
              <button type="submit" className="px-8 py-3 bg-[#00857e] text-white font-bold rounded-xl hover:bg-teal-700 transition-colors shadow-sm flex items-center gap-2">
                <Save size={20} />
                שמירת קורס
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
