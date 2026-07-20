import type { Route } from "./+types/student.dashboard";
import MainLayout from "../components/MainLayout";
import { Clock, FileText, CheckCircle, AlertCircle, ArrowLeft, GraduationCap } from 'lucide-react';
import { Link } from 'react-router';
import { StudentAssignmentCard } from '../components/StudentAssignmentCard';
import { CourseCard } from '../components/CourseCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

import { useTranslation } from 'react-i18next';

const dashboardCoursesData = {
  he: [
    { id: 1, name: 'מבני נתונים ואלגוריתמים', code: 'CS101', instructor: 'פרופ׳ כהן', accent: { bg: 'bg-teal-50', text: 'text-teal-700', groupHoverBg: 'group-hover:bg-teal-600', borderHover: 'hover:border-teal-300' } },
    { id: 2, name: 'רשתות תקשורת', code: 'CS202', instructor: 'ד״ר לוי', accent: { bg: 'bg-blue-50', text: 'text-blue-700', groupHoverBg: 'group-hover:bg-blue-600', borderHover: 'hover:border-blue-300' } },
    { id: 3, name: 'תכנות מונחה עצמים', code: 'CS303', instructor: 'ד״ר ישראלי', accent: { bg: 'bg-purple-50', text: 'text-purple-700', groupHoverBg: 'group-hover:bg-purple-600', borderHover: 'hover:border-purple-300' } },
  ],
  en: [
    { id: 1, name: 'Data Structures & Algorithms', code: 'CS101', instructor: 'Prof. Cohen', accent: { bg: 'bg-teal-50', text: 'text-teal-700', groupHoverBg: 'group-hover:bg-teal-600', borderHover: 'hover:border-teal-300' } },
    { id: 2, name: 'Computer Networks', code: 'CS202', instructor: 'Dr. Levi', accent: { bg: 'bg-blue-50', text: 'text-blue-700', groupHoverBg: 'group-hover:bg-blue-600', borderHover: 'hover:border-blue-300' } },
    { id: 3, name: 'Object Oriented Programming', code: 'CS303', instructor: 'Dr. Israeli', accent: { bg: 'bg-purple-50', text: 'text-purple-700', groupHoverBg: 'group-hover:bg-purple-600', borderHover: 'hover:border-purple-300' } },
  ]
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Student Dashboard | Check Hit" },
  ];
}

export default function StudentDashboardRoute() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const dashboardCourses = isEn ? dashboardCoursesData.en : dashboardCoursesData.he;

  return (
    <MainLayout portalName={t('nav.dashboard')} view="student">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        <header className="flex justify-between items-end border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">{t('dashboard.welcome')}</h1>
            <p className="text-gray-500 mt-2 text-lg">{t('dashboard.subtitle')}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Upcoming Assignments */}
          <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-4 sm:p-5 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900">
                {t('dashboard.upcomingAssignments')}
              </h2>
              <Link to="/student/assignments" className="text-[#00857e] font-bold flex items-center gap-2 hover:underline">
                {t('dashboard.allAssignments')} {isEn ? <ArrowLeft size={18} className="rotate-180" /> : <ArrowLeft size={18} />}
              </Link>
            </div>
            <div className="space-y-4 flex-1">
              <StudentAssignmentCard
                title={isEn ? "Assignment 3 - Recursion" : "תרגיל 3 - רקורסיה"}
                course={isEn ? "Intro to Computer Science" : "מבוא למדעי המחשב"}
                dueDate="2026-07-14"
                actionText={t('dashboard.toSubmit')}
                linkTo="/student/assignments"
                statusBadge={<StatusBadge type="assignment" status="pending" rounded="md" />}
              />
              
              <StudentAssignmentCard
                title={isEn ? "Assignment 4" : "תרגיל 4"}
                course={isEn ? "Data Structures & Algorithms" : "מבני נתונים ואלגוריתמים"}
                dueDate="2026-07-20"
                actionText={t('dashboard.view')}
                linkTo="/student/assignments"
                statusBadge={<StatusBadge type="assignment" status="checking" rounded="md" />}
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Recent Grades */}
            <Card className="p-6">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-500" /> {t('dashboard.recentGrades')}
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                  <div>
                    <div className="font-bold text-sm">{isEn ? 'Assignment 2' : 'תרגיל 2'}</div>
                    <div className="text-xs text-gray-500">{isEn ? 'Intro to Computer Science' : 'מבוא למדעי המחשב'}</div>
                  </div>
                  <div className="font-extrabold text-lg text-gray-900">95</div>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                  <div>
                    <div className="font-bold text-sm">{isEn ? 'Midterm Project' : 'פרויקט אמצע'}</div>
                    <div className="text-xs text-gray-500">{isEn ? 'Object Oriented Programming' : 'תכנות מונחה עצמים'}</div>
                  </div>
                  <div className="font-extrabold text-lg text-gray-900">88</div>
                </div>
              </div>
              <Link to="/student/assignments" className="text-sm text-[#00857e] font-medium mt-4 inline-block hover:underline">{t('dashboard.allGrades')}</Link>
            </Card>

            {/* Appeal Status */}
            <Card className="p-6">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="text-orange-500" /> {t('dashboard.appealsInProgress')}
              </h2>
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="font-bold text-orange-900 text-sm">{isEn ? 'Assignment 1: OSI Model' : 'מטלה 1: מודל OSI'}</div>
                <div className="text-sm text-orange-700 mt-1">{isEn ? 'Computer Networks' : 'רשתות תקשורת'}</div>
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-orange-600 bg-white px-2 py-1 rounded-md w-fit">
                  {isEn ? 'Pending Lecturer Review' : 'ממתין לתשובת מרצה'}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Small Courses Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900">
                {t('dashboard.recentCourses')}
              </h2>
              <Link to="/student/courses" className="text-[#00857e] font-bold flex items-center gap-2 hover:underline text-sm">
                {t('dashboard.allCourses')} {isEn ? <ArrowLeft size={16} className="rotate-180" /> : <ArrowLeft size={16} />}
              </Link>
            </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {dashboardCourses.map(course => (
              <CourseCard
                key={course.id}
                name={course.name}
                code={course.code}
                accent={course.accent}
                to={`/student/courses/${course.id}`}
                variant="compact"
              >
                {course.code} • {course.instructor}
              </CourseCard>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
