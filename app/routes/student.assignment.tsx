import type { Route } from "./+types/student.assignment";
import { useParams, Link } from 'react-router';
import MainLayout from "../components/MainLayout";
import StudentAssignmentDetail from "../components/StudentAssignmentDetail";
import { AssignmentDetailSkeleton } from "../components/ui/Skeleton";
import { useStudentAssignmentDetail } from "../hooks/useStudentAssignmentDetail";
import { useTranslation } from 'react-i18next';
import { AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Assignment Details | Check Hit" },
  ];
}

export default function StudentAssignmentRoute() {
  const { assignmentId } = useParams();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const {
    data: assignment,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useStudentAssignmentDetail(assignmentId, isEn);

  return (
    <MainLayout portalName={t('nav.dashboard')} view="student">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-12">
        {/* Loading State */}
        {isLoading && <AssignmentDetailSkeleton />}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/30 p-8 text-center max-w-xl mx-auto space-y-4 shadow-xs my-12">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <AlertCircle size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900 dark:text-red-200">
                {t('assignmentDetail.notFound')}
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1 max-w-md mx-auto">
                {error instanceof Error ? error.message : t('assignmentDetail.notFoundDesc')}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
                <span>{t('courses.retry')}</span>
              </button>
              <Link
                to="/student/assignments"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-bold transition-colors shadow-2xs"
              >
                <span>{t('assignmentDetail.backToAssignments')}</span>
              </Link>
            </div>
          </div>
        )}

        {/* Loaded State */}
        {!isLoading && !isError && assignment && (
          <StudentAssignmentDetail assignment={assignment} onRefetch={() => refetch()} />
        )}
      </div>
    </MainLayout>
  );
}
