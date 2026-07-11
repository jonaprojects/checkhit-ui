import type { Route } from "./+types/lecturer.courses";
import MainLayout from "../components/MainLayout";
import { GraduationCap, Users, BookOpen, ChevronLeft, Plus } from 'lucide-react';
import { Link } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Manage Courses | Check Hit" },
  ];
}

const courses = [
  { id: 1, name: 'מבני נתונים ואלגוריתמים', code: 'CS101', students: 120, assignments: 5, appeals: 2, accent: { bg: 'bg-teal-50', text: 'text-teal-700', groupHoverBg: 'group-hover:bg-teal-600', borderHover: 'hover:border-teal-300' } },
  { id: 2, name: 'תכנות מונחה עצמים', code: 'CS303', students: 85, assignments: 4, appeals: 0, accent: { bg: 'bg-purple-50', text: 'text-purple-700', groupHoverBg: 'group-hover:bg-purple-600', borderHover: 'hover:border-purple-300' } },
  { id: 3, name: 'סמינר בבינה מלאכותית', code: 'CS505', students: 30, assignments: 2, appeals: 1, accent: { bg: 'bg-amber-50', text: 'text-amber-700', groupHoverBg: 'group-hover:bg-amber-500', borderHover: 'hover:border-amber-300' } },
];

export default function LecturerCoursesRoute() {
  return (
    <MainLayout portalName="פורטל מרצים" view="lecturer">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">ניהול קורסים</h1>
            <p className="text-gray-500 mt-2">רשימת הקורסים הפעילים שאתה מלמד בסמסטר הנוכחי</p>
          </div>
          <Link to="/lecturer/courses/new" className="flex items-center gap-2 px-4 py-2 bg-[#00857e] text-white rounded-xl hover:bg-teal-700 transition-colors font-bold shadow-sm">
            <Plus size={18} />
            יצירת קורס חדש
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Link key={course.id} to={`/lecturer/courses/${course.id}`} className={`group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md ${course.accent.borderHover} transition-all duration-300 flex flex-col h-full hover:-translate-y-1`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl ${course.accent.bg} ${course.accent.text} flex items-center justify-center ${course.accent.groupHoverBg} group-hover:text-white transition-colors`}>
                  <GraduationCap size={28} />
                </div>
                <div className={`${course.accent.bg} ${course.accent.text} px-3 py-1.5 rounded-lg text-xs font-black tracking-widest border border-white/50`}>
                  {course.code}
                </div>
              </div>
              
              <h2 className={`text-xl font-extrabold text-gray-900 mb-4 group-hover:${course.accent.text} transition-colors`}>{course.name}</h2>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500 flex items-center gap-1.5 mb-1"><Users size={14} /> סטודנטים</div>
                  <div className="font-bold text-gray-900 text-lg">{course.students}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500 flex items-center gap-1.5 mb-1"><BookOpen size={14} /> מטלות</div>
                  <div className="font-bold text-gray-900 text-lg">{course.assignments}</div>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  {course.appeals > 0 ? (
                    <div className="flex items-center gap-1.5 text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded">
                      <span>{course.appeals} ערעורים להמתנה</span>
                    </div>
                  ) : (
                    <div className="text-gray-400">אין ערעורים פעילים</div>
                  )}
                </div>
                <ChevronLeft size={18} className={`text-gray-400 group-hover:${course.accent.text} transition-all duration-300 -translate-x-2 group-hover:translate-x-0`} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
