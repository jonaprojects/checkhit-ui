import type { Route } from "./+types/student.assignments";
import MainLayout from "../components/MainLayout";
import { FileText, Clock, CheckCircle2, Search, Filter, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Assignments | Check Hit" },
  ];
}

const statusConfig: Record<string, { label: string, color: string, icon: any }> = {
  'pending': { label: 'טרם הוגש', color: 'bg-gray-100 text-gray-700', icon: Clock },
  'checking': { label: 'בבדיקת AI', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  'checked': { label: 'נבדק', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  'appeal': { label: 'בערעור', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
};

const assignments = [
  { id: 1, title: 'תרגיל בית 3: עצי חיפוש בינאריים', course: 'מבני נתונים ואלגוריתמים', dueDate: 'מחר, 23:59', status: 'pending' },
  { id: 2, title: 'מטלה 2: מיון מהיר', course: 'מבני נתונים ואלגוריתמים', dueDate: 'הוגש לפני יומיים', status: 'checked', grade: 95 },
  { id: 3, title: 'תרגיל 1: מודל OSI', course: 'רשתות תקשורת', dueDate: 'הוגש לפני שבוע', status: 'appeal', grade: 82 },
  { id: 4, title: 'פרויקט גמר - שלב א', course: 'תכנות מונחה עצמים', dueDate: 'הוגש אתמול', status: 'checking' },
];

export default function StudentAssignmentsRoute() {
  return (
    <MainLayout portalName="פורטל סטודנטים" view="student">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#00857e]">המטלות שלי</h1>
            <p className="text-gray-500 mt-2">מעקב אחר כלל המטלות בקורסים שלך</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="חיפוש מטלה..." 
                className="w-full pl-4 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00857e] transition-all bg-white"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 font-medium">
              <Filter size={18} />
              סינון
            </button>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm">
                  <th className="px-6 py-4 font-medium w-1/3">מטלה</th>
                  <th className="px-6 py-4 font-medium">קורס</th>
                  <th className="px-6 py-4 font-medium">תאריך הגשה</th>
                  <th className="px-6 py-4 font-medium text-center">סטטוס</th>
                  <th className="px-6 py-4 font-medium text-center">ציון</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assignments.map((assignment) => {
                  const StatusIcon = statusConfig[assignment.status].icon;
                  return (
                    <tr key={assignment.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <Link to={`/student/assignments/${assignment.id}`} className="font-bold text-gray-900 group-hover:text-[#00857e] transition-colors flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#00857e] group-hover:border-teal-100 group-hover:bg-teal-50 transition-colors">
                            <FileText size={18} />
                          </div>
                          {assignment.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {assignment.course}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {assignment.dueDate}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusConfig[assignment.status].color}`}>
                          <StatusIcon size={14} />
                          {statusConfig[assignment.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-900">
                        {assignment.grade ? assignment.grade : '-'}
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
