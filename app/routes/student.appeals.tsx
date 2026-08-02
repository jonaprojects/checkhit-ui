import type { Route } from "./+types/student.appeals";
import MainLayout from "../components/MainLayout";
import { FileText, AlertCircle, ChevronLeft, ChevronRight, RefreshCw, MessageSquare } from 'lucide-react';
import { Link } from 'react-router';
import { StatusBadge, appealStatusConfig as statusConfig } from '../components/ui/StatusBadge';
import { AppealListSkeleton } from '../components/ui/Skeleton';
import { useStudentAppeals } from '../hooks/useStudentAppeals';
import { useTranslation } from 'react-i18next';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Appeals | Check Hit" },
  ];
}

export default function StudentAppealsRoute() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const { data: appeals = [], isLoading, isError, error, refetch, isFetching } = useStudentAppeals(isEn);

  return (
    <MainLayout portalName={isEn ? "Student Portal" : "פורטל סטודנטים"} view="student">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        {/* Header */}
        <header className="border-b border-gray-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{t('appeals.title')}</h1>
            <p className="text-gray-500 text-lg">{t('appeals.subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-xs">
              {t('appeals.totalSubmitted')} <strong className="text-gray-900">{appeals.length} {t('appeals.appealsCount')}</strong>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              title={t('appeals.retry')}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
            >
              <RefreshCw size={18} className={isFetching ? 'animate-spin text-teal-600' : ''} />
            </button>
          </div>
        </header>

        {/* Shimmer Loading Skeleton */}
        {isLoading && <AppealListSkeleton count={3} />}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="rounded-2xl border border-red-200 bg-red-50/70 p-8 text-center max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <AlertCircle size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900">{t('appeals.errorTitle')}</h3>
              <p className="text-sm text-red-700 mt-1 max-w-md mx-auto">
                {error instanceof Error ? error.message : t('appeals.errorDesc')}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw size={16} />
              <span>{t('appeals.retry')}</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && appeals.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
            <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <FileText size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{t('appeals.emptyTitle')}</h3>
              <p className="text-sm text-gray-500 mt-2">{t('appeals.emptyDesc')}</p>
            </div>
            <Link
              to="/student/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold transition-colors shadow-xs"
            >
              <span>{t('nav.courses')}</span>
              {isEn ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </Link>
          </div>
        )}

        {/* Appeals List */}
        {!isLoading && !isError && appeals.length > 0 && (
          <div className="space-y-4">
            {appeals.map((appeal) => {
              const currentStatusConfig = statusConfig[appeal.uiStatus] || statusConfig.pending;
              const StatusIcon = currentStatusConfig.icon;

              return (
                <div
                  key={appeal.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-teal-300 hover:shadow-xs transition-all"
                >
                  <div className="flex-1 flex items-start gap-4">
                    <div
                      className={`mt-1 shrink-0 flex items-center justify-center w-12 h-12 rounded-full ${currentStatusConfig.color} group-hover:scale-105 transition-transform`}
                    >
                      <StatusIcon size={24} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-900">{appeal.assignmentTitle}</h3>
                        <StatusBadge type="appeal" status={appeal.uiStatus} />
                      </div>
                      <div className="text-gray-500 text-sm">
                        {appeal.courseName && <span>{appeal.courseName}</span>}
                        {appeal.courseName && <span className="mx-2">•</span>}
                        <span>{t('appeals.submitted')} {appeal.formattedDate}</span>
                      </div>
                      {appeal.reason && (
                        <p className="text-xs text-gray-600 mt-2 bg-gray-50 rounded-lg p-2.5 border border-gray-100 line-clamp-2">
                          <strong className="text-gray-700">{t('appeals.reason')}: </strong>
                          {appeal.reason}
                        </p>
                      )}
                      {appeal.resolution && (
                        <p className="text-xs text-teal-800 mt-1 bg-teal-50/70 rounded-lg p-2.5 border border-teal-100">
                          <strong className="text-teal-900">{t('appeals.resolution')}: </strong>
                          {appeal.resolution}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4 border-t md:border-t-0 md:border-s border-gray-100 pt-4 md:pt-0 md:ps-8 min-w-[200px] w-full md:w-auto">
                    <div className="flex justify-between md:justify-end w-full items-center gap-4 text-start md:text-end">
                      {appeal.originalGrade !== null && (
                        <div>
                          <span className="text-xs text-gray-500 block">{t('appeals.originalGrade')}</span>
                          <span className={`text-base font-bold ${appeal.uiStatus === 'accepted' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                            {appeal.originalGrade}
                          </span>
                        </div>
                      )}

                      {appeal.uiStatus === 'accepted' && appeal.newGrade !== null ? (
                        <div>
                          <span className="text-xs text-gray-500 block">{t('appeals.newGrade')}</span>
                          <span className="text-2xl font-black text-green-600">{appeal.newGrade}</span>
                        </div>
                      ) : appeal.uiStatus === 'rejected' ? (
                        <div>
                          <span className="text-xs text-gray-500 block">{t('appeals.decision')}</span>
                          <span className="text-xl font-bold text-gray-900">{appeal.originalGrade}</span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-xs text-gray-500 block">{t('appeals.status')}</span>
                          <span className="text-sm font-bold text-yellow-600">{t('appeals.checking')}</span>
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/student/assignments/${appeal.assignmentId}`}
                      className="w-full md:w-auto text-center md:text-start bg-gray-100 hover:bg-teal-700 text-gray-700 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <span>{t('appeals.viewAssignment')}</span>
                      {isEn ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
