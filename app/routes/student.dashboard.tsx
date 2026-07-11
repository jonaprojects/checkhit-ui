import type { Route } from "./+types/student.dashboard";
import MainLayout from "../components/MainLayout";
import { Clock, FileText, CheckCircle, AlertCircle, ArrowLeft, GraduationCap } from 'lucide-react';
import { Link } from 'react-router';

const dashboardCourses = [
  { id: 1, name: 'מבני נתונים ואלגוריתמים', code: 'CS101', instructor: 'פרופ׳ כהן', accent: { bg: 'bg-teal-50', text: 'text-teal-700', groupHoverBg: 'group-hover:bg-teal-600', borderHover: 'hover:border-teal-300' } },
  { id: 2, name: 'רשתות תקשורת', code: 'CS202', instructor: 'ד״ר לוי', accent: { bg: 'bg-blue-50', text: 'text-blue-700', groupHoverBg: 'group-hover:bg-blue-600', borderHover: 'hover:border-blue-300' } },
  { id: 3, name: 'תכנות מונחה עצמים', code: 'CS303', instructor: 'ד״ר ישראלי', accent: { bg: 'bg-purple-50', text: 'text-purple-700', groupHoverBg: 'group-hover:bg-purple-600', borderHover: 'hover:border-purple-300' } },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Student Dashboard | Check Hit" },
  ];
}

export default function StudentDashboardRoute() {
  return (
    <MainLayout portalName="פורטל סטודנטים" view="student">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        <header className="flex justify-between items-end border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">שלום, יוסי</h1>
            <p className="text-gray-500 mt-2 text-lg">הנה סקירה של המצב האקדמי שלך להיום</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Upcoming Assignments */}
          <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900">
                מטלות קרובות
              </h2>
              <Link to="/student/assignments" className="text-[#00857e] font-bold flex items-center gap-2 hover:underline">
                לכל המטלות <ArrowLeft size={18} />
              </Link>
            </div>
            <div className="space-y-4 flex-1">
              <Link to="/student/assignments" className="flex items-center justify-between p-5 rounded-xl border border-gray-200 bg-white hover:border-teal-200 hover:shadow-sm transition-all group">
                <div className="text-start flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-extrabold text-gray-900 text-xl group-hover:text-[#00857e] transition-colors">תרגיל 3 - רקורסיה</h3>
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md font-bold">טרם הוגש</span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">מבוא למדעי המחשב</p>
                </div>
                <div className="text-end flex items-center gap-6">
                  <div className="hidden sm:block">
                    <p className="text-sm text-gray-400 font-bold mb-1">הגשה עד</p>
                    <p className="font-black text-gray-900">2026-07-14</p>
                  </div>
                  <button className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm group-hover:bg-[#00857e] group-hover:border-[#00857e] group-hover:text-white transition-colors flex items-center gap-2">
                    להגשה <ArrowLeft size={16} />
                  </button>
                </div>
              </Link>
              
              <Link to="/student/assignments" className="flex items-center justify-between p-5 rounded-xl border border-gray-200 bg-white hover:border-teal-200 hover:shadow-sm transition-all group">
                <div className="text-start flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-extrabold text-gray-900 text-xl group-hover:text-[#00857e] transition-colors">תרגיל 4</h3>
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1">
                      <Clock size={12} /> בבדיקת AI
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">מבני נתונים ואלגוריתמים</p>
                </div>
                <div className="text-end flex items-center gap-6">
                  <div className="hidden sm:block">
                    <p className="text-sm text-gray-400 font-bold mb-1">הגשה עד</p>
                    <p className="font-black text-gray-900">2026-07-20</p>
                  </div>
                  <button className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm group-hover:bg-[#00857e] group-hover:border-[#00857e] group-hover:text-white transition-colors flex items-center gap-2">
                    צפייה <ArrowLeft size={16} />
                  </button>
                </div>
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            {/* Recent Grades */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-500" /> ציונים אחרונים
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                  <div>
                    <div className="font-bold text-sm">מטלה 2: מיון מהיר</div>
                    <div className="text-xs text-gray-500">מבני נתונים</div>
                  </div>
                  <div className="font-extrabold text-lg text-gray-900">95</div>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                  <div>
                    <div className="font-bold text-sm">פרויקט אמצע</div>
                    <div className="text-xs text-gray-500">תכנות מונחה עצמים</div>
                  </div>
                  <div className="font-extrabold text-lg text-gray-900">88</div>
                </div>
              </div>
              <Link to="/student/assignments" className="text-sm text-[#00857e] font-medium mt-4 inline-block hover:underline">לכל הציונים</Link>
            </div>

            {/* Appeal Status */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="text-orange-500" /> ערעור בתהליך
              </h2>
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="font-bold text-orange-900 text-sm">מטלה 1: מודל OSI</div>
                <div className="text-sm text-orange-700 mt-1">רשתות תקשורת</div>
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-orange-600 bg-white px-2 py-1 rounded-md w-fit">
                  ממתין לתשובת מרצה
                </div>
              </div>
            </div>
            </div>
        </div>

        {/* Small Courses Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900">
              הקורסים שלי
            </h2>
            <Link to="/student/courses" className="text-[#00857e] font-bold flex items-center gap-2 hover:underline">
              <ArrowLeft size={18} /> לכל הקורסים
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {dashboardCourses.map(course => (
              <Link key={course.id} to={`/student/courses/${course.id}`} className={`group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md ${course.accent.borderHover} transition-all duration-300 flex items-center gap-4 hover:-translate-y-1`}>
                <div className={`w-12 h-12 rounded-xl ${course.accent.bg} ${course.accent.text} flex items-center justify-center ${course.accent.groupHoverBg} group-hover:text-white transition-colors shrink-0`}>
                  <GraduationCap size={24} />
                </div>
                <div className="flex-1 overflow-hidden text-start">
                  <h3 className="font-bold text-gray-900 text-base mb-1 truncate">{course.name}</h3>
                  <div className="text-sm text-gray-500 font-medium truncate">{course.code} • {course.instructor}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
