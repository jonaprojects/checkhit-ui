import type { Route } from "./+types/student.courses";
import MainLayout from "../components/MainLayout";
import { GraduationCap, Users, BookOpen, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Courses | Check Hit" },
  ];
}

const courses = [
  { id: 1, name: 'מבני נתונים ואלגוריתמים', code: 'CS101', instructor: 'פרופ׳ כהן', assignmentsCount: 5, activeAssignments: 1, accent: { bg: 'bg-teal-50', text: 'text-teal-700', groupHoverBg: 'group-hover:bg-teal-600', borderHover: 'hover:border-teal-300' } },
  { id: 2, name: 'רשתות תקשורת', code: 'CS202', instructor: 'ד״ר לוי', assignmentsCount: 3, activeAssignments: 0, accent: { bg: 'bg-blue-50', text: 'text-blue-700', groupHoverBg: 'group-hover:bg-blue-600', borderHover: 'hover:border-blue-300' } },
  { id: 3, name: 'תכנות מונחה עצמים', code: 'CS303', instructor: 'ד״ר ישראלי', assignmentsCount: 4, activeAssignments: 2, accent: { bg: 'bg-purple-50', text: 'text-purple-700', groupHoverBg: 'group-hover:bg-purple-600', borderHover: 'hover:border-purple-300' } },
  { id: 4, name: 'מערכות הפעלה', code: 'CS404', instructor: 'פרופ׳ אהרוני', assignmentsCount: 2, activeAssignments: 0, accent: { bg: 'bg-emerald-50', text: 'text-emerald-700', groupHoverBg: 'group-hover:bg-emerald-600', borderHover: 'hover:border-emerald-300' } },
];

export default function StudentCoursesRoute() {
  return (
    <MainLayout portalName="פורטל סטודנטים" view="student">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        <header className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">הקורסים שלי</h1>
          <p className="text-gray-500 mt-2">רשימת הקורסים אליהם אתה רשום בסמסטר הנוכחי</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Link key={course.id} to={`/student/courses/${course.id}`} className={`group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md ${course.accent.borderHover} transition-all duration-300 flex flex-col h-full hover:-translate-y-1`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl ${course.accent.bg} ${course.accent.text} flex items-center justify-center ${course.accent.groupHoverBg} group-hover:text-white transition-colors`}>
                  <GraduationCap size={28} />
                </div>
                <div className={`${course.accent.bg} ${course.accent.text} px-3 py-1.5 rounded-lg text-xs font-black tracking-widest border border-white/50`}>
                  {course.code}
                </div>
              </div>
              
              <h2 className={`text-xl font-extrabold text-gray-900 mb-1 group-hover:${course.accent.text} transition-colors`}>{course.name}</h2>
              <div className="text-gray-500 text-sm flex items-center gap-2 mb-6">
                <Users size={14} /> {course.instructor}
              </div>

              <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <BookOpen size={16} className="text-gray-400" />
                    <span>{course.assignmentsCount} מטלות</span>
                  </div>
                  {course.activeAssignments > 0 && (
                    <div className="flex items-center gap-1.5 text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">
                      <span>{course.activeAssignments} להגשה</span>
                    </div>
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
