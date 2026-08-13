import type { Route } from "./+types/lecturer.courses";
import MainLayout from "../components/MainLayout";
import { Users, BookOpen, ChevronLeft, Plus, CheckCircle2, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { LinkButton, Button } from '../components/ui/Button';
import { CourseGridSkeleton } from '../components/ui/Skeleton';
import { useLecturerCourses } from '../hooks/useLecturerCourses';
import { useTranslation } from 'react-i18next';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Manage Courses | Check Hit" },
  ];
}

export default function LecturerCoursesRoute() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const { data: courses, isLoading, isError, error, refetch, isFetching } = useLecturerCourses();

  return (
    <MainLayout portalName={t('nav.dashboard')} view="lecturer">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{t('courses.manageCourses')}</h1>
            <p className="text-gray-500 mt-2 text-base">{t('courses.manageCoursesDesc')}</p>
          </div>

          <div className="flex items-center gap-3">
            {courses && courses.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-50 text-teal-800 text-sm font-bold border border-teal-200/60 shadow-xs">
                <Layers size={16} className="text-teal-600" />
                <span>{courses.length} {t('nav.courses')}</span>
              </span>
            )}
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              title={t('courses.retry')}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
            >
              <RefreshCw size={18} className={isFetching ? 'animate-spin text-teal-600' : ''} />
            </button>
            <LinkButton to="/lecturer/courses/new" variant="primary">
              <Plus size={18} />
              {t('courses.createNewCourse')}
            </LinkButton>
          </div>
        </header>

        {/* Loading Shimmer State */}
        {isLoading && (
          <CourseGridSkeleton count={6} variant="detailed" mode="lecturer" />
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="rounded-2xl border border-red-200 bg-red-50/70 p-8 text-center max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <AlertCircle size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900">{t('courses.errorTitle')}</h3>
              <p className="text-sm text-red-700 mt-1 max-w-md mx-auto">
                {error instanceof Error ? error.message : t('courses.errorDesc')}
              </p>
            </div>
            <Button
              onClick={() => refetch()}
              variant="danger"
              className="inline-flex items-center gap-2"
            >
              <RefreshCw size={16} />
              <span>{t('courses.retry')}</span>
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && courses && courses.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
            <div className="w-16 h-16 bg-gray-100 text-gray-500 rounded-2xl flex items-center justify-center mx-auto">
              <BookOpen size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{t('courses.noCoursesTitle')}</h3>
              <p className="text-sm text-gray-500 mt-1">{t('courses.noCoursesDesc')}</p>
            </div>
            <LinkButton to="/lecturer/courses/new" variant="primary">
              <Plus size={18} />
              {t('courses.createNewCourse')}
            </LinkButton>
          </div>
        )}

        {/* Dynamic Courses Grid */}
        {!isLoading && !isError && courses && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard
                key={course.id}
                name={course.displayTitle}
                code={course.code}
                accent={course.accent}
                to={`/lecturer/courses/${course.id}`}
                variant="detailed"
                footer={
                  <>
                    <div className="flex items-center text-xs">
                      {course.pendingAppeals > 0 ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/80 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          <span>{course.pendingAppeals} {t('courses.pendingAppeals')}</span>
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
                      <strong className="text-gray-900 font-semibold">{course.studentsCount}</strong>{' '}
                      {t('courses.registeredStudents')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-gray-400 shrink-0" />
                    <span>
                      <strong className="text-gray-900 font-semibold">{course.activeAssignments}</strong>{' '}
                      {t('courses.activeAssignments')}
                    </span>
                  </div>
                </div>
              </CourseCard>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
