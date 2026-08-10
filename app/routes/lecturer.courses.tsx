import type { Route } from "./+types/lecturer.courses";
import MainLayout from "../components/MainLayout";
import { GraduationCap, Users, BookOpen, ChevronLeft, Plus } from 'lucide-react';
import { Link } from 'react-router';
import { CourseCard } from '../components/CourseCard';
import { LinkButton } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';
import { isRtlLanguage } from '../lib/i18n';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Manage Courses | Check Hit" },
  ];
}

const coursesData = [
  { id: 1, nameKey: 'courses.coursePlaceholder1', code: 'CS101', students: 120, assignments: 5, appeals: 2, accent: { bg: 'bg-teal-50', text: 'text-teal-700', groupHoverBg: 'group-hover:bg-teal-600', borderHover: 'hover:border-teal-300' } },
  { id: 2, nameKey: 'courses.coursePlaceholder3', code: 'CS303', students: 85, assignments: 4, appeals: 0, accent: { bg: 'bg-purple-50', text: 'text-purple-700', groupHoverBg: 'group-hover:bg-purple-600', borderHover: 'hover:border-purple-300' } },
  { id: 3, nameKey: 'courses.coursePlaceholder5', code: 'CS505', students: 30, assignments: 2, appeals: 1, accent: { bg: 'bg-amber-50', text: 'text-amber-700', groupHoverBg: 'group-hover:bg-amber-500', borderHover: 'hover:border-amber-300' } },
];

export default function LecturerCoursesRoute() {
  const { t, i18n } = useTranslation();
  const isRtl = isRtlLanguage(i18n.language);
  const courses = coursesData;

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
              name={t(course.nameKey)}
              code={course.code}
              accent={course.accent}
              to={`/lecturer/courses/${course.id}`}
              variant="detailed"
              footer={
                <>
                  <div className="flex items-center gap-4 text-sm">
                    {course.appeals > 0 ? (
                      <div className="flex items-center gap-1.5 text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded">
                        <span>{course.appeals} {t('courses.pendingAppeals')}</span>
                      </div>
                    ) : (
                      <div className="text-gray-400">{t('courses.noActiveAppeals')}</div>
                    )}
                  </div>
                  <ChevronLeft size={18} className={`text-gray-400 group-hover:${course.accent.text} transition-all duration-300 ${!isRtl ? 'translate-x-2 group-hover:translate-x-0 rotate-180' : '-translate-x-2 group-hover:translate-x-0'}`} />
                </>
              }
            >
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500 mb-1 flex items-center gap-1.5"><Users size={14} /> {t('courses.registeredStudents')}</div>
                  <div className="font-bold text-gray-900">{course.students}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500 mb-1 flex items-center gap-1.5"><BookOpen size={14} /> {t('courses.activeAssignments')}</div>
                  <div className="font-bold text-gray-900">{course.assignments}</div>
                </div>
              </div>
            </CourseCard>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
