import type { Route } from "./+types/student.appeals";
import MainLayout from "../components/MainLayout";
import { FileText, Clock, CheckCircle2, AlertCircle, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Appeals | Check Hit" },
  ];
}

const statusConfig: Record<string, { label: string, color: string, icon: any }> = {
  'pending': { label: 'בבדיקה', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  'accepted': { label: 'התקבל', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  'rejected': { label: 'נדחה', color: 'bg-red-100 text-red-700', icon: AlertCircle },
};

const appeals = [
  { 
    id: 1, 
    assignmentId: 2,
    assignmentTitle: 'מטלה 2: מיון מהיר', 
    courseName: 'מבני נתונים ואלגוריתמים', 
    submissionDate: 'היום, 09:30', 
    status: 'pending',
    originalGrade: 82,
    newGrade: null,
    reason: "לדעתי יש טעות בבדיקה של סעיף 3, השתמשתי בפונקציית עזר כנדרש."
  },
  { 
    id: 2, 
    assignmentId: 3,
    assignmentTitle: 'תרגיל 1: מודל OSI', 
    courseName: 'רשתות תקשורת', 
    submissionDate: 'לפני שבוע', 
    status: 'accepted',
    originalGrade: 75,
    newGrade: 85,
    reason: "הורד לי ניקוד על חישוב מסכות רשת למרות שהחישוב היה נכון לפי ההרצאה."
  },
  { 
    id: 3, 
    assignmentId: 5,
    assignmentTitle: 'תרגיל בית 1: מורכבות', 
    courseName: 'מבני נתונים ואלגוריתמים', 
    submissionDate: 'לפני חודש', 
    status: 'rejected',
    originalGrade: 90,
    newGrade: 90,
    reason: "אני חושב שמגיע לי בונוס על פתרון בסיבוכיות O(n) במקום O(n log n)."
  }
];

export default function StudentAppealsRoute() {
  return (
    <MainLayout portalName="פורטל סטודנטים" view="student">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        <header className="border-b border-gray-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">הערעורים שלי</h1>
            <p className="text-gray-500 text-lg">מעקב אחר סטטוס הערעורים שהוגשו לבדיקה מחדש.</p>
          </div>
          <div className="text-sm text-gray-500 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm">
            סה״כ הוגשו: <strong className="text-gray-900">{appeals.length} ערעורים</strong>
          </div>
        </header>

        <div className="space-y-4">
          {appeals.map((appeal) => {
            const StatusIcon = statusConfig[appeal.status].icon;
            return (
              <div key={appeal.id} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-teal-100 hover:bg-teal-50/30 transition-all cursor-pointer">
                
                <div className="flex-1 flex items-start gap-4">
                  <div className={`mt-1 shrink-0 flex items-center justify-center w-12 h-12 rounded-full ${statusConfig[appeal.status].color} group-hover:scale-110 transition-transform`}>
                    <StatusIcon size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{appeal.assignmentTitle}</h3>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusConfig[appeal.status].color}`}>
                        {statusConfig[appeal.status].label}
                      </span>
                    </div>
                    <div className="text-gray-500 text-sm mb-3">
                      <span>{appeal.courseName}</span>
                      <span className="mx-2">•</span>
                      <span>הוגש {appeal.submissionDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4 border-t md:border-t-0 md:border-s border-gray-100 pt-4 md:pt-0 md:pe-8 min-w-[200px] w-full md:w-auto">
                  <div className="flex justify-between md:justify-end w-full items-center gap-4 text-start md:text-end">
                    <div>
                      <span className="text-sm text-gray-500 block">ציון מקורי</span>
                      <span className="text-lg font-bold text-gray-400 line-through">{appeal.originalGrade}</span>
                    </div>
                    {appeal.status === 'accepted' ? (
                      <div>
                        <span className="text-sm text-gray-500 block">ציון חדש</span>
                        <span className="text-2xl font-black text-green-600">{appeal.newGrade}</span>
                      </div>
                    ) : appeal.status === 'rejected' ? (
                      <div>
                        <span className="text-sm text-gray-500 block">החלטה</span>
                        <span className="text-xl font-bold text-gray-900">{appeal.originalGrade}</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-sm text-gray-500 block">סטטוס</span>
                        <span className="text-xl font-bold text-yellow-600">בדיקה</span>
                      </div>
                    )}
                  </div>
                  
                  <Link 
                    to={`/student/assignments/${appeal.assignmentId}`}
                    className="w-full md:w-auto text-center md:text-start bg-gray-100 hover:bg-[#00857e] text-gray-700 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors inline-flex items-center justify-center gap-2"
                  >
                    צפה במטלה <ChevronLeft size={16} />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
