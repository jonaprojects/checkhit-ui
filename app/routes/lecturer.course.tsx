import type { Route } from "./+types/lecturer.course";
import MainLayout from "../components/MainLayout";
import { ChevronRight, FileText, Plus, Users, Search, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Link, useParams } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Course Assignments | Check Hit" },
  ];
}

const assignments = [
  { id: 1, title: 'תרגיל בית 3: עצי חיפוש בינאריים', dueDate: 'מחר, 23:59', submissions: 85, totalStudents: 120, status: 'active' },
  { id: 2, title: 'מטלה 2: מיון מהיר', dueDate: 'לפני שבועיים', submissions: 115, totalStudents: 120, status: 'closed' },
  { id: 3, title: 'מטלה 1: סיבוכיות זמן ריצה', dueDate: 'לפני חודש', submissions: 118, totalStudents: 120, status: 'closed' },
];

export default function LecturerCourseRoute() {
  const { courseId } = useParams();

  return (
    <MainLayout portalName="פורטל מרצים" view="lecturer">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        <header className="border-b border-gray-200 pb-6">
          <Link to="/lecturer/courses" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#00857e] transition-colors mb-4">
            <ChevronRight size={16} /> חזרה לקורסים
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-teal-50 text-[#00857e] px-2 py-1 rounded text-sm font-bold tracking-widest">CS101</span>
                <h1 className="text-3xl font-extrabold text-gray-900">מבני נתונים ואלגוריתמים</h1>
              </div>
              <p className="text-gray-500">ניהול מטלות הקורס (120 סטודנטים רשומים)</p>
            </div>
            
            <Link to={`/lecturer/courses/${courseId}/assignments/new`} className="flex items-center gap-2 px-5 py-2.5 bg-[#00857e] text-white rounded-xl hover:bg-teal-700 transition-colors font-bold shadow-sm">
              <Plus size={18} />
              יצירת מטלה חדשה
            </Link>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <FileText size={18} className="text-gray-400" />
              מטלות הקורס
            </h2>
            <div className="relative w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="חיפוש מטלה..." 
                className="w-full pl-4 pr-10 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00857e] transition-all bg-white"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start text-sm">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500">
                  <th className="px-6 py-4 font-medium w-2/5">שם המטלה</th>
                  <th className="px-6 py-4 font-medium">מועד הגשה</th>
                  <th className="px-6 py-4 font-medium text-center">הגשות</th>
                  <th className="px-6 py-4 font-medium text-center">אחוז הגשה</th>
                  <th className="px-6 py-4 font-medium text-center">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assignments.map((assignment) => {
                  const submitPercentage = Math.round((assignment.submissions / assignment.totalStudents) * 100);
                  return (
                    <tr key={assignment.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <Link to={`/lecturer/assignments/${assignment.id}`} className="font-bold text-gray-900 group-hover:text-[#00857e] transition-colors">
                          {assignment.title}
                        </Link>
                        {assignment.status === 'active' && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">פעיל</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {assignment.dueDate}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        <span className="font-bold text-gray-900">{assignment.submissions}</span> / {assignment.totalStudents}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-24 bg-gray-200 rounded-full h-1.5 overflow-hidden flex-shrink-0">
                            <div className={`h-1.5 rounded-full ${submitPercentage > 80 ? 'bg-green-500' : 'bg-[#00857e]'}`} style={{ width: `${submitPercentage}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-gray-500 w-8">{submitPercentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link to={`/lecturer/assignments/${assignment.id}`} className="text-[#00857e] hover:bg-teal-50 px-3 py-1.5 rounded-lg font-medium transition-colors border border-transparent hover:border-teal-100">
                            צפייה וניהול
                          </Link>
                          <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
