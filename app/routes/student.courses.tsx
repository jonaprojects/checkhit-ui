import type { Route } from "./+types/student.courses";
import MainLayout from "../components/MainLayout";
import { Users, BookOpen, ChevronLeft, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { CourseGridSkeleton } from '../components/ui/Skeleton';
import { useStudentCourses } from '../hooks/useStudentCourses';
import { useTranslation } from 'react-i18next';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Courses | Check Hit" },
  ];
}

export default function StudentCoursesRoute() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const { data: courses, isLoading, isError, error, refetch, isFetching } = useStudentCourses();

  return (
    <MainLayout portalName={t('nav.dashboard')} view="student">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        {/* Header Section */}
        <header className="border-b border-gray-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{t('courses.myCourses')}</h1>
            <p className="text-gray-500 mt-2 text-base">{t('courses.myCoursesDesc')}</p>
          </div>

          {/* Enrolled Courses Counter Badge & Refresh button */}
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
          </div>
        </header>

        {/* Loading Shimmer State */}
        {isLoading && (
          <CourseGridSkeleton count={6} variant="detailed" mode="student" />
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
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw size={16} />
              <span>{t('courses.retry')}</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && courses && courses.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
            <div className="w-16 h-16 bg-gray-100 text-gray-500 rounded-2xl flex items-center justify-center mx-auto">
              <BookOpen size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{t('courses.emptyTitle')}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{t('courses.emptyDesc')}</p>
          </div>
        )}

        {/* Live Loaded Courses Grid */}
        {!isLoading && !isError && courses && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                name={course.displayTitle}
                code={course.code}
                accent={course.accent}
                to={`/student/courses/${course.id}`}
                variant="detailed"
                footer={
                  <>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <BookOpen size={16} className="text-gray-400" />
                        <span>
                          {course.assignmentsCount} {t('courses.assignments')}
                        </span>
                      </div>
                      {course.activeAssignments > 0 && (
                        <div className="flex items-center gap-1.5 text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">
                          <span>
                            {course.activeAssignments} {t('courses.toSubmit')}
                          </span>
                        </div>
                      )}
                    </div>
                    <ChevronLeft
                      size={18}
                      className={`text-gray-400 group-hover:${course.accent.text} transition-all duration-300 ${
                        isEn
                          ? 'translate-x-2 group-hover:translate-x-0 rotate-180'
                          : '-translate-x-2 group-hover:translate-x-0'
                      }`}
                    />
                  </>
                }
              >
                <div className="text-gray-500 text-sm flex items-center gap-2 mb-6">
                  <Users size={14} className="shrink-0 text-gray-400" />
                  <span className="truncate">
                    {course.instructorName || t('courses.noInstructor')}
                  </span>
                </div>
              </CourseCard>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
