import type { Route } from "./+types/lecturer.courses";
import MainLayout from "../components/MainLayout";
import { GraduationCap, Users, BookOpen, ChevronLeft, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';
import { CourseCard } from '../components/CourseCard';
import { LinkButton } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Manage Courses | Check Hit" },
  ];
}

const coursesData = {
  he: [
    { id: 1, name: 'מבני נתונים ואלגוריתמים', code: 'CS101', students: 120, assignments: 5, appeals: 2, accent: { bg: 'bg-teal-50', text: 'text-teal-700', groupHoverBg: 'group-hover:bg-teal-600', borderHover: 'hover:border-teal-300' } },
    { id: 2, name: 'תכנות מונחה עצמים', code: 'CS303', students: 85, assignments: 4, appeals: 0, accent: { bg: 'bg-purple-50', text: 'text-purple-700', groupHoverBg: 'group-hover:bg-purple-600', borderHover: 'hover:border-purple-300' } },
    { id: 3, name: 'סמינר בבינה מלאכותית', code: 'CS505', students: 30, assignments: 2, appeals: 1, accent: { bg: 'bg-amber-50', text: 'text-amber-700', groupHoverBg: 'group-hover:bg-amber-500', borderHover: 'hover:border-amber-300' } },
  ],
  en: [
    { id: 1, name: 'Data Structures & Algorithms', code: 'CS101', students: 120, assignments: 5, appeals: 2, accent: { bg: 'bg-teal-50', text: 'text-teal-700', groupHoverBg: 'group-hover:bg-teal-600', borderHover: 'hover:border-teal-300' } },
    { id: 2, name: 'Object Oriented Programming', code: 'CS303', students: 85, assignments: 4, appeals: 0, accent: { bg: 'bg-purple-50', text: 'text-purple-700', groupHoverBg: 'group-hover:bg-purple-600', borderHover: 'hover:border-purple-300' } },
    { id: 3, name: 'Seminar in AI', code: 'CS505', students: 30, assignments: 2, appeals: 1, accent: { bg: 'bg-amber-50', text: 'text-amber-700', groupHoverBg: 'group-hover:bg-amber-500', borderHover: 'hover:border-amber-300' } },
  ]
};

export default function LecturerCoursesRoute() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const courses = isEn ? coursesData.en : coursesData.he;

  return (
    <MainLayout portalName={t('nav.dashboard')} view="lecturer">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{t('courses.manageCourses')}</h1>
            <p className="text-gray-500 mt-2">{t('courses.manageCoursesDesc')}</p>
          </div>
          <LinkButton to="/lecturer/courses/new" variant="primary">
            <Plus size={18} />
            {t('courses.createNewCourse')}
          </LinkButton>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard
              key={course.id}
              name={course.name}
              code={course.code}
              accent={course.accent}
              to={`/lecturer/courses/${course.id}`}
              variant="detailed"
              footer={
                <>
                  <div className="flex items-center text-xs">
                    {course.appeals > 0 ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/80 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        <span>{course.appeals} {t('courses.pendingAppeals')}</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 text-gray-400 font-medium">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        <span>{t('courses.noActiveAppeals')}</span>
                      </div>
                    )}
                  </div>
                  <ChevronLeft size={18} className={`text-gray-400 group-hover:${course.accent.text} transition-all duration-300 ${isEn ? 'translate-x-1 group-hover:translate-x-0 rotate-180' : '-translate-x-1 group-hover:translate-x-0'}`} />
                </>
              }
            >
              <div className="space-y-2 text-sm text-gray-600 text-start">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400 shrink-0" />
                  <span>
                    <strong className="text-gray-900 font-semibold">{course.students}</strong>{' '}
                    {t('courses.registeredStudents')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-gray-400 shrink-0" />
                  <span>
                    <strong className="text-gray-900 font-semibold">{course.assignments}</strong>{' '}
                    {t('courses.activeAssignments')}
                  </span>
                </div>
              </div>
            </CourseCard>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
