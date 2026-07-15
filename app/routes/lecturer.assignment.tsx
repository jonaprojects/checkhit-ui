import type { Route } from "./+types/lecturer.assignment";
import MainLayout from "../components/MainLayout";
import { ChevronRight, Users, CheckCircle2, XCircle, Clock, Search, Download, Edit } from 'lucide-react';
import { Link, useParams } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Assignment Details | Check Hit" },
  ];
}

const students = [
  { id: '204918231', name: 'יוסי כהן', status: 'submitted', grade: 95, time: 'אתמול, 14:30' },
  { id: '315293841', name: 'מיכל לוי', status: 'checking', grade: null, time: 'היום, 09:15' },
  { id: '201928374', name: 'דניאל אברהם', status: 'missing', grade: null, time: '-' },
  { id: '312847562', name: 'נועה ישראלי', status: 'submitted', grade: 100, time: 'לפני יומיים' },
  { id: '203948571', name: 'איתי אהרוני', status: 'missing', grade: null, time: '-' },
];

export default function LecturerAssignmentRoute() {
  const { assignmentId } = useParams();
  
  // Basic mock stats
  const totalStudents = 120;
  const submitted = 85;
  const missing = 35;
  const submitPercentage = Math.round((submitted / totalStudents) * 100);

  return (
    <MainLayout portalName="פורטל מרצים" view="lecturer">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        <header className="border-b border-gray-200 pb-6">
          <Link to="/lecturer/courses/1" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#00857e] transition-colors mb-4">
            <ChevronRight size={16} /> חזרה לקורס
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-teal-50 text-[#00857e] px-2 py-1 rounded text-sm font-bold tracking-widest">CS101</span>
                <h1 className="text-3xl font-extrabold text-gray-900">תרגיל בית 3: עצי חיפוש בינאריים</h1>
              </div>
              <p className="text-gray-500">תאריך הגשה: מחר, 23:59</p>
            </div>
            
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium shadow-sm">
                <Edit size={16} />
                ערוך מטלה
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium shadow-sm">
                <Download size={16} />
                ייצוא ציונים
              </button>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-teal-50 text-[#00857e] rounded-full flex items-center justify-center mb-3">
              <Users size={20} />
            </div>
            <div className="text-3xl font-black text-gray-900">{totalStudents}</div>
            <div className="text-sm text-gray-500 mt-1 font-medium">סה״כ סטודנטים</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 size={20} />
            </div>
            <div className="text-3xl font-black text-gray-900">{submitted}</div>
            <div className="text-sm text-gray-500 mt-1 font-medium">הגישו</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-3">
              <XCircle size={20} />
            </div>
            <div className="text-3xl font-black text-gray-900">{missing}</div>
            <div className="text-sm text-gray-500 mt-1 font-medium">טרם הגישו</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
              <Clock size={20} />
            </div>
            <div className="text-3xl font-black text-gray-900">28<span className="text-lg">ש׳</span></div>
            <div className="text-sm text-gray-500 mt-1 font-medium">זמן נותר</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-end mb-2">
            <span className="font-bold text-gray-700">אחוז הגשה כולל</span>
            <span className="font-black text-2xl text-[#00857e]">{submitPercentage}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div className="bg-[#00857e] h-3 rounded-full transition-all duration-1000" style={{ width: `${submitPercentage}%` }}></div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-bold text-gray-800">רשימת הגשות סטודנטים</h2>
            <div className="relative w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="חיפוש סטודנט (שם או ת.ז)..." 
                className="w-full pl-4 pr-10 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00857e] transition-all bg-white"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-start text-sm">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500">
                  <th className="px-6 py-4 font-medium">סטודנט</th>
                  <th className="px-6 py-4 font-medium">ת.ז</th>
                  <th className="px-6 py-4 font-medium text-center">סטטוס הגשה</th>
                  <th className="px-6 py-4 font-medium text-center">תאריך הגשה</th>
                  <th className="px-6 py-4 font-medium text-center">ציון סופי</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                      {student.id}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {student.status === 'submitted' && <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold w-24">נבדק</span>}
                      {student.status === 'checking' && <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold w-24">בבדיקת AI</span>}
                      {student.status === 'missing' && <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-bold w-24">טרם הוגש</span>}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500">
                      {student.time}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-900 text-base">
                      {student.grade !== null ? student.grade : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
