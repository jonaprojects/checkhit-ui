import React from 'react';
import {
  BookOpen,
  AlertCircle,
  Users,
  ArrowLeft,
  ClipboardList,
  Plus,
  Send,
  Scale,
  TrendingUp,
  Bot,
} from 'lucide-react';
import { Card } from './ui/Card';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { GradeDistributionChart } from './charts/GradeDistributionChart';
import { AssignmentCompletionChart } from './charts/AssignmentCompletionChart';
import { CourseCard } from './CourseCard';
import { RequiresAttentionStrip } from './RequiresAttentionStrip';
import { useLecturerDashboard } from '../hooks/useLecturerDashboard';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { LecturerMetricSkeleton, CourseCardSkeleton } from './ui/Skeleton';
import { COURSE_ACCENTS } from '../hooks/useStudentCourses';

export default function LecturerDashboard() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const { data: dashboard, isLoading } = useLecturerDashboard();
  const { data: currentUser } = useCurrentUser('lecturer');
  const welcomeName = currentUser?.name?.trim();

  const kpis = dashboard?.kpis;
  const activeCoursesCount = kpis?.activeCourses ?? (isLoading ? '—' : 0);
  const pendingAppealsCount = kpis?.pendingAppeals ?? (isLoading ? '—' : 0);
  const readyToPublishCount = kpis?.readyToPublish ?? (isLoading ? '—' : 0);
  const avgScore =
    kpis?.averageScore != null
      ? Number(kpis.averageScore).toFixed(1)
      : isLoading
        ? '—'
        : '0.0';

  const recentCourses = dashboard?.recentCourses || [];

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto pb-16">
      {/* Welcome Hero & Quick Actions Toolbar */}
      <div className="bg-white dark:bg-[#17211f] p-7 md:p-8 rounded-2xl border border-gray-200 dark:border-[#263330] relative overflow-hidden shadow-xs transition-colors">
        <div className="absolute top-0 end-0 -mt-10 -me-10 w-48 h-48 bg-teal-50 dark:bg-teal-950/40 rounded-full blur-3xl opacity-70"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
              {welcomeName
                ? t('lecturerDashboard.welcome', { name: welcomeName })
                : t('lecturerDashboard.welcomeFallback')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">
              {t('lecturerDashboard.subtitle')}
            </p>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Link
              to="/lecturer/courses"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00857e] hover:bg-[#006e68] text-white font-bold text-sm transition-all shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-0.5"
            >
              <Plus size={18} />
              <span>{t('lecturerDashboard.newAssignment')}</span>
            </Link>

            <Link
              to="/lecturer/messages"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-sm transition-colors cursor-pointer"
            >
              <Send size={16} className="text-[#00857e] dark:text-teal-300" />
              <span>{t('lecturerDashboard.broadcast')}</span>
            </Link>

            <Link
              to="/lecturer/appeals"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-bold text-sm transition-colors cursor-pointer"
            >
              <Scale size={16} />
              <span>{t('lecturerDashboard.reviewAppeals')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metrics Section */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          <LecturerMetricSkeleton />
          <LecturerMetricSkeleton />
          <LecturerMetricSkeleton />
          <LecturerMetricSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          <MetricCard
            icon={<BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 dark:text-teal-300 group-hover:scale-110 transition-transform" />}
            title={t('lecturerDashboard.activeCourses')}
            value={activeCoursesCount}
            subtitle={t('lecturerDashboard.semester')}
          />
          <MetricCard
            icon={<AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />}
            title={t('lecturerDashboard.appealsToReview')}
            value={pendingAppealsCount}
            subtitle={t('lecturerDashboard.pendingReview')}
            badgeIcon={typeof pendingAppealsCount === 'number' && pendingAppealsCount > 0}
          />
          <MetricCard
            icon={<Bot className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />}
            title={t('lecturerDashboard.readyToPublish')}
            value={readyToPublishCount}
            subtitle={t('lecturerDashboard.readyToPublishSubtitle')}
          />
          <MetricCard
            icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />}
            title={t('lecturerDashboard.avgScore')}
            value={avgScore}
            subtitle={t('lecturerDashboard.gradeDistribution.allCourses')}
          />
        </div>
      )}

      {/* Actionable Triage Strip ("Requires Attention") */}
      <RequiresAttentionStrip
        items={dashboard?.requiresAttention}
        isLoading={isLoading}
      />

      {/* Visual Analytics Section (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GradeDistributionChart
          distributionData={dashboard?.gradeDistribution}
          isLoading={isLoading}
        />
        <AssignmentCompletionChart
          completionData={dashboard?.assignmentCompletion}
          isLoading={isLoading}
        />
      </div>

      {/* Active Courses Section */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              {t('lecturerDashboard.activeCourses')}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {t('courses.manageCoursesDesc')}
            </p>
          </div>
          <Link
            to="/lecturer/courses"
            className="text-[#00857e] dark:text-teal-300 font-bold flex items-center gap-1.5 hover:underline text-sm"
          >
            <span>{t('lecturerDashboard.allCourses')}</span>
            <ArrowLeft size={16} className={isEn ? 'rotate-180' : ''} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {isLoading ? (
            <>
              <CourseCardSkeleton variant="detailed" mode="lecturer" />
              <CourseCardSkeleton variant="detailed" mode="lecturer" />
            </>
          ) : recentCourses.length > 0 ? (
            recentCourses.slice(0, 2).map((c, idx) => {
              const accent = COURSE_ACCENTS[idx % COURSE_ACCENTS.length];
              return (
                <CourseCard
                  key={c.id}
                  name={c.name}
                  code={c.code}
                  accent={accent}
                  to={`/lecturer/courses/${c.id}`}
                  variant="detailed"
                  footer={
                    <>
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                        {c.studentsCount} {t('courses.registeredStudents')}
                      </span>
                      <span className="text-sm font-bold text-[#00857e] dark:text-teal-300">
                        {c.activeAssignments} {t('courses.activeAssignments')}
                      </span>
                    </>
                  }
                >
                  <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-400 dark:text-teal-300/80" />
                      <span>{c.studentsCount} {t('courses.registeredStudents')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClipboardList size={16} className="text-gray-400 dark:text-teal-300/80" />
                      <span>{c.activeAssignments} {t('courses.activeAssignments')}</span>
                    </div>
                  </div>
                </CourseCard>
              );
            })
          ) : (
            <div className="col-span-full p-8 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-center">
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                {isEn ? 'No courses found.' : 'לא נמצאו קורסים פעילים.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  icon,
  title,
  value,
  subtitle,
  badgeIcon = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  badgeIcon?: boolean;
}) {
  return (
    <Card className="p-3.5 sm:p-5 flex flex-col justify-between relative transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5 group overflow-visible">
      <div className="flex justify-between items-start mb-2 sm:mb-3">
        <h3 className="text-2xl sm:text-3xl font-black text-[#00857e] dark:text-teal-300">{value}</h3>
        <div className="p-2 sm:p-3 bg-gray-50/80 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg sm:rounded-xl relative transition-colors group-hover:bg-gray-100 dark:group-hover:bg-gray-700">
          {icon}
          {badgeIcon && (
            <span className="absolute -top-1 -end-1 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-rose-500 border-2 border-white dark:border-[#17211f]"></span>
            </span>
          )}
        </div>
      </div>
      <div>
        <p className="text-xs sm:text-base font-extrabold text-gray-900 dark:text-white mb-0.5 line-clamp-1">{title}</p>
        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium truncate">{subtitle}</p>
      </div>
    </Card>
  );
}
