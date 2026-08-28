import type { Route } from "./+types/student.dashboard";
import MainLayout from "../components/MainLayout";
import { CheckCircle, AlertCircle, ArrowLeft, Calendar as CalendarIcon, CheckCircle2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router';
import { StudentAssignmentCard } from '../components/StudentAssignmentCard';
import { CourseCard } from '../components/CourseCard';
import { Card } from '../components/ui/Card';
import {
  AssignmentListSkeleton,
  CourseCardSkeleton,
  DashboardRecentGradesSkeleton,
  DashboardAppealsSkeleton,
} from '../components/ui/Skeleton';
import { useStudentAssignments } from '../hooks/useStudentAssignments';
import { useStudentGrades } from '../hooks/useStudentGrades';
import { useStudentAppeals } from '../hooks/useStudentAppeals';
import { useStudentCourses } from '../hooks/useStudentCourses';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useTranslation } from 'react-i18next';
import { StudentContextUnavailableError } from '../lib/query-errors';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Student Dashboard | Check Hit" },
  ];
}

export default function StudentDashboardRoute() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const {
    data: currentUser,
    isError: isProfileError,
    refetch: refetchProfile,
    isFetching: isFetchingProfile,
  } = useCurrentUser('student');
  const welcomeName = currentUser?.name?.trim();

  // 1. Fetch upcoming active assignments
  const {
    data: upcomingAssignments = [],
    isLoading: isLoadingAssignments,
    isError: isAssignmentsError,
    error: assignmentsError,
    refetch: refetchAssignments,
    isFetching: isFetchingAssignments,
  } = useStudentAssignments({ upcoming: true, limit: 4 }, isEn);

  // 2. Fetch recent grades
  const {
    data: recentGrades = [],
    isLoading: isLoadingGrades,
    isError: isGradesError,
    error: gradesError,
    refetch: refetchGrades,
    isFetching: isFetchingGrades,
  } = useStudentGrades(3, isEn);

  // 3. Fetch appeals in progress
  const {
    data: activeAppeals = [],
    isLoading: isLoadingAppeals,
    isError: isAppealsError,
    error: appealsError,
    refetch: refetchAppeals,
    isFetching: isFetchingAppeals,
  } = useStudentAppeals({ status: 'IN_PROGRESS', limit: 1 }, isEn);

  // 4. Fetch urgent enrolled courses
  const {
    data: urgentCourses = [],
    isLoading: isLoadingCourses,
    isError: isCoursesError,
    error: coursesError,
    refetch: refetchCourses,
    isFetching: isFetchingCourses,
  } = useStudentCourses({ urgent: true, limit: 3 });

  const hasMissingStudentContext = [assignmentsError, gradesError, appealsError, coursesError]
    .some((queryError) => queryError instanceof StudentContextUnavailableError);

  return (
    <MainLayout portalName={t('nav.dashboard')} view="student">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        {/* Welcome Header */}
        <header className="flex justify-between items-end border-b border-gray-200 dark:border-gray-800 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
              {welcomeName
                ? t('dashboard.welcome', { name: welcomeName })
                : t('dashboard.welcomeFallback')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">{t('dashboard.subtitle')}</p>
          </div>
        </header>

        {isProfileError && !hasMissingStudentContext && (
          <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span>{t('dashboard.profileError')}</span>
            <button
              type="button"
              onClick={() => refetchProfile()}
              disabled={isFetchingProfile}
              className="inline-flex items-center gap-2 font-bold hover:underline disabled:opacity-60 self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw size={15} className={isFetchingProfile ? 'animate-spin' : ''} />
              {t('dashboard.retry')}
            </button>
          </div>
        )}

        {hasMissingStudentContext ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50/70 p-8 text-center max-w-2xl mx-auto space-y-3 dark:border-red-900/60 dark:bg-red-950/30">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto dark:bg-red-950 dark:text-red-300">
              <AlertCircle size={28} />
            </div>
            <h2 className="text-lg font-bold text-red-900 dark:text-red-200">{t('dashboard.sessionErrorTitle')}</h2>
            <p className="text-sm text-red-700 dark:text-red-300 max-w-lg mx-auto">{t('dashboard.sessionErrorDesc')}</p>
          </div>
        ) : (
          <>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upcoming Assignments */}
          <div className="md:col-span-2 bg-white dark:bg-[#17211f] rounded-xl border border-gray-200 dark:border-[#263330] p-4 sm:p-5 flex flex-col shadow-xs">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
                {t('dashboard.upcomingAssignments')}
              </h2>
              <div className="flex items-center gap-3">
                <Link
                  to="/student/assignments?view=calendar"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-200 dark:border-teal-800/60 bg-teal-50 dark:bg-teal-950/40 text-[#00857e] dark:text-teal-300 hover:bg-teal-100/70 dark:hover:bg-teal-900/50 text-xs font-bold transition-colors shadow-2xs"
                >
                  <CalendarIcon size={14} />
                  <span>{t('dashboard.viewCalendar')}</span>
                </Link>
                <Link
                  to="/student/assignments"
                  className="text-[#00857e] dark:text-teal-400 font-bold text-sm flex items-center gap-1 hover:underline"
                >
                  {t('dashboard.allAssignments')}{' '}
                  {isEn ? <ArrowLeft size={16} className="rotate-180" /> : <ArrowLeft size={16} />}
                </Link>
              </div>
            </div>

            <div className="space-y-4 flex-1 flex flex-col justify-start">
              {isLoadingAssignments ? (
                <AssignmentListSkeleton count={4} responsiveLimit={3} />
              ) : isAssignmentsError ? (
                <DashboardSectionError
                  message={t('dashboard.assignmentsError')}
                  onRetry={() => refetchAssignments()}
                  isRetrying={isFetchingAssignments}
                />
              ) : upcomingAssignments.length === 0 ? (
                <div className="p-8 text-center bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center my-auto">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2.5 stroke-[1.5]" />
                  <p className="font-bold text-gray-800 dark:text-gray-200 text-base">{t('dashboard.noUpcomingAssignments')}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">{t('dashboard.allCaughtUp')}</p>
                </div>
              ) : (
                upcomingAssignments.map((assignment, index) => (
                  <div
                    key={assignment.id}
                    className={index >= 3 ? 'hidden md:block' : 'block'}
                  >
                    <StudentAssignmentCard
                      title={assignment.name}
                      course={assignment.courseName || t('dashboard.courseDetailsUnavailable')}
                      dueDate={assignment.formattedDueDate}
                      actionText={assignment.uiStatus === 'pending' ? t('dashboard.toSubmit') : t('dashboard.view')}
                      linkTo={`/student/assignments/${assignment.id}`}
                    />
                  </div>
                ))
              )}
            </div>

            {upcomingAssignments.length > 0 && !isLoadingAssignments && !isAssignmentsError && (
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-[#263330] flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium">
                  {t('dashboard.showingUpcoming', { count: upcomingAssignments.length })}
                </span>
                <Link
                  to="/student/assignments"
                  className="inline-flex items-center gap-1 font-bold text-[#00857e] dark:text-teal-400 hover:underline"
                >
                  <span>{t('dashboard.allAssignments')}</span>
                  {isEn ? <ArrowLeft size={14} className="rotate-180" /> : <ArrowLeft size={14} />}
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Recent Grades */}
            <Card className="p-6 dark:bg-[#17211f] dark:border-[#263330]">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-500" /> {t('dashboard.recentGrades')}
              </h2>
              {isLoadingGrades ? (
                <DashboardRecentGradesSkeleton count={2} />
              ) : isGradesError ? (
                <DashboardSectionError
                  message={t('dashboard.gradesError')}
                  onRetry={() => refetchGrades()}
                  isRetrying={isFetchingGrades}
                  compact
                />
              ) : recentGrades.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-3">{t('dashboard.noGrades')}</p>
              ) : (
                <div className="space-y-4">
                  {recentGrades.map((grade) => (
                    <div
                      key={grade.id}
                      className="flex justify-between items-center pb-3 border-b border-gray-50 dark:border-gray-800/50 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="font-bold text-sm text-gray-900 dark:text-gray-100">{grade.assignmentTitle}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {grade.courseName || t('dashboard.courseDetailsUnavailable')}
                        </div>
                      </div>
                      <div className="font-extrabold text-lg text-gray-900 dark:text-gray-100">
                        {grade.score}
                        {grade.maxScore && grade.maxScore !== 100 && (
                          <span className="text-xs font-medium text-gray-400 ms-0.5">/{grade.maxScore}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!isGradesError && (
                <Link
                  to="/student/assignments"
                  className="text-sm text-[#00857e] dark:text-teal-400 font-semibold mt-4 inline-block hover:underline"
                >
                  {t('dashboard.allGrades')}
                </Link>
              )}
            </Card>

            {/* Appeal Status */}
            <Card className="p-6 dark:bg-[#17211f] dark:border-[#263330]">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <AlertCircle className="text-orange-500" /> {t('dashboard.appealsInProgress')}
              </h2>
              {isLoadingAppeals ? (
                <DashboardAppealsSkeleton />
              ) : isAppealsError ? (
                <DashboardSectionError
                  message={t('dashboard.appealsError')}
                  onRetry={() => refetchAppeals()}
                  isRetrying={isFetchingAppeals}
                  compact
                />
              ) : activeAppeals.length === 0 ? (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800 text-start">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('dashboard.noAppeals')}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.noAppealsDesc')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeAppeals.map((appeal) => (
                    <div
                      key={appeal.id}
                      className="p-4 bg-orange-50/80 dark:bg-orange-950/30 rounded-xl border border-orange-200/70 dark:border-orange-900/40"
                    >
                      <div className="font-bold text-orange-900 dark:text-orange-200 text-sm">
                        {appeal.assignmentTitle || t('dashboard.assignmentUnavailable')}
                      </div>
                      <div className="text-xs text-orange-700 dark:text-orange-300 mt-0.5">
                        {appeal.courseName || t('dashboard.courseDetailsUnavailable')}
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs font-bold text-orange-700 dark:text-orange-300 bg-white dark:bg-gray-800 px-2.5 py-1 rounded-md w-fit shadow-2xs border border-orange-200/60 dark:border-orange-800/60">
                        {t('dashboard.pendingLecturerReview')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!isAppealsError && (
                <Link
                  to="/student/appeals"
                  className="text-sm text-[#00857e] dark:text-teal-400 font-semibold mt-4 inline-block hover:underline"
                >
                  {t('dashboard.allAppeals')}
                </Link>
              )}
            </Card>
          </div>
        </div>

        {/* Urgent & Enrolled Courses Section */}
        <div className="bg-white dark:bg-[#17211f] rounded-xl border border-gray-200 dark:border-[#263330] p-4 sm:p-5 flex flex-col shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
              {t('dashboard.recentCourses')}
            </h2>
            <Link
              to="/student/courses"
              className="text-[#00857e] dark:text-teal-400 font-bold flex items-center gap-2 hover:underline text-sm"
            >
              {t('dashboard.allCourses')}{' '}
              {isEn ? <ArrowLeft size={16} className="rotate-180" /> : <ArrowLeft size={16} />}
            </Link>
          </div>

          {isLoadingCourses ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <CourseCardSkeleton key={idx} variant="compact" />
              ))}
            </div>
          ) : isCoursesError ? (
            <DashboardSectionError
              message={t('dashboard.coursesError')}
              onRetry={() => refetchCourses()}
              isRetrying={isFetchingCourses}
            />
          ) : urgentCourses.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">{t('dashboard.noCourses')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {urgentCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  name={course.name}
                  code={course.code}
                  accent={course.accent}
                  to={`/student/courses/${course.id}`}
                  variant="compact"
                >
                  {[course.code, course.instructorName].filter(Boolean).join(' • ') || t('dashboard.courseDetailsUnavailable')}
                </CourseCard>
              ))}
            </div>
          )}
        </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

function DashboardSectionError({
  message,
  onRetry,
  isRetrying,
  compact = false,
}: {
  message: string;
  onRetry: () => void;
  isRetrying: boolean;
  compact?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div role="alert" className={`rounded-xl border border-red-200 bg-red-50/70 text-center dark:border-red-900/60 dark:bg-red-950/30 ${compact ? 'p-4' : 'p-6'}`}>
      <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-300 mx-auto mb-2" />
      <p className="text-sm font-semibold text-red-800 dark:text-red-200">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-red-700 dark:text-red-300 hover:underline disabled:opacity-60 cursor-pointer"
      >
        <RefreshCw size={14} className={isRetrying ? 'animate-spin' : ''} />
        {isRetrying ? t('dashboard.retrying') : t('dashboard.retry')}
      </button>
    </div>
  );
}
