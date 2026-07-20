import type { Route } from "./+types/lecturer.course";
import MainLayout from "../components/MainLayout";
import { Search, ChevronLeft, Plus, Users, FileText, BarChart3, Clock, AlertCircle, ChevronRight, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button, LinkButton } from '../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Course Assignments | Check Hit" },
  ];
}

const assignmentsData = {
  he: [
    { id: 1, title: 'תרגיל בית 3: עצי חיפוש בינאריים', dueDate: 'מחר, 23:59', submissions: 85, totalStudents: 120, status: 'active' },
    { id: 2, title: 'מטלה 2: מיון מהיר', dueDate: 'לפני שבועיים', submissions: 115, totalStudents: 120, status: 'closed' },
    { id: 3, title: 'מטלה 1: סיבוכיות זמן ריצה', dueDate: 'לפני חודש', submissions: 118, totalStudents: 120, status: 'closed' },
  ],
  en: [
    { id: 1, title: 'Homework 3: Binary Search Trees', dueDate: 'Tomorrow, 23:59', submissions: 85, totalStudents: 120, status: 'active' },
    { id: 2, title: 'Assignment 2: Quick Sort', dueDate: '2 weeks ago', submissions: 115, totalStudents: 120, status: 'closed' },
    { id: 3, title: 'Assignment 1: Time Complexity', dueDate: '1 month ago', submissions: 118, totalStudents: 120, status: 'closed' },
  ]
};

export default function LecturerCourseRoute() {
  const { courseId } = useParams();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const assignments = isEn ? assignmentsData.en : assignmentsData.he;

  return (
    <MainLayout portalName={t('nav.dashboard')} view="lecturer">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        <header className="border-b border-gray-200 pb-6">
          <Link to="/lecturer/courses" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#00857e] transition-colors mb-4">
            {isEn ? <ChevronLeft size={16} /> : <ChevronRight size={16} />} {t('course.backToCourses')}
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-teal-50 text-[#00857e] px-2 py-1 rounded text-sm font-bold tracking-widest">CS101</span>
                <h1 className="text-3xl font-extrabold text-gray-900">{isEn ? 'Data Structures & Algorithms' : 'מבני נתונים ואלגוריתמים'}</h1>
              </div>
              <p className="text-gray-500">{t('course.manageCourseAssignments')} (120 {t('course.studentsRegistered')})</p>
            </div>
            
            <Link to={`/lecturer/courses/${courseId}/assignments/new`} className="flex items-center gap-2 px-5 py-2.5 bg-[#00857e] text-white rounded-xl hover:bg-teal-700 transition-colors font-bold">
              <Plus size={18} />
              {t('course.createNewAssignment')}
            </Link>
          </div>
        </header>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <FileText size={18} className="text-gray-400" />
              {t('course.courseAssignments')}
            </h2>
            <div className="relative w-64">
              <Search className={`absolute ${isEn ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-400`} size={16} />
              <input 
                type="text" 
                placeholder={t('course.searchAssignment')} 
                className={`w-full ${isEn ? 'pl-10 pr-4' : 'pl-4 pr-10'} py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00857e] transition-all bg-white`}
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-2/5">{t('course.assignmentName')}</TableHead>
                <TableHead>{t('course.dueDate')}</TableHead>
                <TableHead className="text-center">{t('course.submissions')}</TableHead>
                <TableHead className="text-center">{t('course.submissionRate')}</TableHead>
                <TableHead className="text-center">{t('course.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => {
                const submitPercentage = Math.round((assignment.submissions / assignment.totalStudents) * 100);
                return (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <Link to={`/lecturer/assignments/${assignment.id}`} className="font-bold text-gray-900 group-hover:text-[#00857e] transition-colors">
                        {assignment.title}
                      </Link>
                      {assignment.status === 'active' && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 ${isEn ? 'ml-2' : 'mr-2'}`}>{t('course.active')}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {assignment.dueDate}
                    </TableCell>
                    <TableCell className="text-center text-gray-600">
                      <span className="font-bold text-gray-900">{assignment.submissions}</span> / {assignment.totalStudents}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-center">
                        <div className="w-24 bg-gray-200 rounded-full h-1.5 overflow-hidden flex-shrink-0">
                          <div className={`h-1.5 rounded-full ${submitPercentage > 80 ? 'bg-green-500' : 'bg-[#00857e]'}`} style={{ width: `${submitPercentage}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-gray-500 w-8">{submitPercentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <LinkButton to={`/lecturer/assignments/${assignment.id}`} variant="ghost" size="sm" className="text-[#00857e]">
                          {t('course.viewAndManage')}
                        </LinkButton>
                        <Button variant="ghost" size="icon" className="text-gray-400">
                          <MoreVertical size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
