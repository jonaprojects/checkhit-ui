import type { Route } from "./+types/lecturer.appeals";
import MainLayout from "../components/MainLayout";
import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  RefreshCw,
  Clock,
  BookOpen,
  Award,
  Layers,
  MessageSquare,
} from 'lucide-react';
import { FilterBar } from '../components/ui/FilterBar';
import { Select } from '../components/ui/Input';
import { AppealListSkeleton } from '../components/ui/Skeleton';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useTranslation } from 'react-i18next';
import { useLecturerAppeals, useLecturerAppealsStats, type ProcessedLecturerAppeal } from '../hooks/useLecturerAppeals';
import { useLecturerCourses } from '../hooks/useLecturerCourses';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Appeals Management | Lecturer Portal | Check Hit" },
  ];
}

export default function LecturerAppealsRoute() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"pending" | "resolved" | "all">("pending");

  // Map tab filter to backend status query param
  const apiStatusParam = useMemo(() => {
    if (statusFilter === "pending") return "PENDING";
    if (statusFilter === "resolved") return "RESOLVED";
    return undefined;
  }, [statusFilter]);

  const apiCourseParam = courseFilter !== "all" ? courseFilter : undefined;

  // Fetch live stats & appeals
  const {
    data: stats,
    isLoading: isStatsLoading,
  } = useLecturerAppealsStats();

  const {
    data: appeals = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useLecturerAppeals(
    {
      status: apiStatusParam,
      courseId: apiCourseParam,
      search: searchTerm.trim() || undefined,
    },
    isEn
  );

  // Fetch lecturer courses for dropdown filter
  const { data: courses = [] } = useLecturerCourses();

  const pendingCount = stats?.pendingCount ?? appeals.filter((a) => a.uiStatus === 'pending').length;

  return (
    <MainLayout portalName={isEn ? "Lecturer Portal" : "פורטל מרצים"} view="lecturer">
      <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#263330] pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {t('appeals.lecturerTitle')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {t('appeals.lecturerSubtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-teal-50 dark:bg-teal-950/50 border border-teal-200/60 dark:border-teal-800/60 px-4 py-2 rounded-xl text-[#00857e] dark:text-teal-300 font-bold shadow-2xs">
            <AlertCircle size={20} className="shrink-0" />
            <span>
              {pendingCount} {t('appeals.pendingCount')}
            </span>
          </div>
        </header>

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={t('appeals.searchPlaceholder')}
          className="mb-6"
        >
          {/* Course Filter Dropdown */}
          <div className="relative w-full md:w-1/2">
            <Filter
              className={`absolute ${isEn ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-400`}
              size={16}
            />
            <Select
              className={`w-full ${isEn ? 'pr-4 pl-10' : 'pl-4 pr-10'} py-2.5 !bg-gray-50 dark:!bg-gray-800/60 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200`}
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="all">{t('appeals.allCourses')}</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Status Tabs */}
          <div className="w-full md:w-1/2 flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter("pending")}
              className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                statusFilter === "pending"
                  ? 'bg-white dark:bg-[#17211f] shadow-xs text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {t('appeals.pending')} {stats ? `(${stats.pendingCount})` : ''}
            </button>
            <button
              onClick={() => setStatusFilter("resolved")}
              className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                statusFilter === "resolved"
                  ? 'bg-white dark:bg-[#17211f] shadow-xs text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {t('appeals.resolved')} {stats ? `(${stats.resolvedCount})` : ''}
            </button>
            <button
              onClick={() => setStatusFilter("all")}
              className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                statusFilter === "all"
                  ? 'bg-white dark:bg-[#17211f] shadow-xs text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {t('appeals.all')} {stats ? `(${stats.totalCount})` : ''}
            </button>
          </div>
        </FilterBar>

        {/* Loading State */}
        {isLoading && <AppealListSkeleton count={4} />}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-red-900 dark:text-red-200 text-lg">
                {t('appeals.errorTitle')}
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {error instanceof Error ? error.message : t('appeals.errorDesc')}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
              <span>{t('appeals.retry')}</span>
            </button>
          </div>
        )}

        {/* Appeals List */}
        {!isLoading && !isError && (
          <div className="space-y-3">
            {appeals.length > 0 ? (
              appeals.map((appeal) => (
                <LecturerAppealCard key={appeal.id} appeal={appeal} isEn={isEn} />
              ))
            ) : (
              <div className="bg-white dark:bg-[#17211f] border border-gray-200 dark:border-[#263330] rounded-2xl p-12 text-center text-gray-500 dark:text-gray-400 shadow-xs space-y-3">
                <CheckCircle2 className="mx-auto text-gray-300 dark:text-gray-600" size={48} />
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {t('appeals.noAppeals')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  {searchTerm || courseFilter !== 'all'
                    ? (isEn ? 'Try adjusting your search or course filters.' : 'נסה לשנות את פרמטרי החיפוש או הסינון.')
                    : (isEn ? 'No appeals submitted by students at this time.' : 'אין ערעורים הממתינים לטיפולך כרגע.')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

interface LecturerAppealCardProps {
  appeal: ProcessedLecturerAppeal;
  isEn: boolean;
}

function LecturerAppealCard({ appeal, isEn }: LecturerAppealCardProps) {
  const { t } = useTranslation();

  const isPending = appeal.uiStatus === 'pending';
  const isAccepted = appeal.uiStatus === 'accepted';
  const isRejected = appeal.uiStatus === 'rejected';

  return (
    <div className="bg-white dark:bg-[#17211f] border border-gray-200 dark:border-[#263330] rounded-xl p-4 sm:p-5 hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center gap-4 shadow-2xs">
      {/* Student & Status Info */}
      <div className="flex flex-col md:w-1/4 shrink-0 border-b md:border-b-0 md:border-e border-gray-100 dark:border-gray-800/80 pb-3 md:pb-0 md:pe-4">
        <div className="flex items-center justify-between mb-1 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300 flex items-center justify-center font-bold text-xs shrink-0">
              {appeal.studentInitials}
            </div>
            <span className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate">
              {appeal.studentName}
            </span>
          </div>
          {appeal.studentId && (
            <span className="text-[11px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded font-mono truncate max-w-[100px]" dir="ltr">
              {appeal.studentId.slice(0, 8)}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isPending ? 'bg-[#E8B43F]' : isAccepted ? 'bg-green-500' : 'bg-red-500'
            }`}
          ></span>
          <span>
            {isPending
              ? t('appeals.waitingReview')
              : isAccepted
              ? (isEn ? 'Accepted' : 'התקבל')
              : isRejected
              ? (isEn ? 'Rejected' : 'נדחה')
              : t('appeals.resolved')}
          </span>
          {appeal.formattedDate && (
            <>
              <span>•</span>
              <span className="truncate">{appeal.formattedDate}</span>
            </>
          )}
        </div>
      </div>

      {/* Middle: Course, Assignment, Grade & Reason Preview */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md truncate max-w-[180px]">
            {appeal.courseName}
          </span>
          <ChevronLeft size={12} className={`text-gray-400 shrink-0 ${isEn ? 'rotate-180' : ''}`} />
          <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[220px]">
            {appeal.assignmentName}
          </span>
          <span className="text-xs font-bold bg-[#00857e]/10 dark:bg-teal-950/40 text-[#00857e] dark:text-teal-300 border border-[#00857e]/20 dark:border-teal-800/40 px-2.5 py-0.5 rounded ms-auto flex items-center gap-1">
            <Award size={12} className="text-amber-500" />
            {t('appeals.originalGrade')}: {appeal.gradeDisplay}
          </span>
        </div>

        {appeal.reason && (
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 italic bg-gray-50/70 dark:bg-gray-800/40 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
            "{appeal.reason}"
          </p>
        )}
      </div>

      {/* Right side: Action Button */}
      <div className="shrink-0 pt-2 md:pt-0">
        <Link
          to={`/lecturer/appeals/${appeal.id}`}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-[#17211f] border border-[#00857e] dark:border-teal-500 text-[#00857e] dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/50 px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-2xs cursor-pointer group-hover:bg-[#00857e] group-hover:text-white dark:group-hover:bg-teal-600 dark:group-hover:text-white"
        >
          <span>{t('appeals.reviewBtn')}</span>
          <ChevronLeft size={16} className={`transition-transform group-hover:-translate-x-0.5 ${isEn ? "rotate-180 group-hover:translate-x-0.5" : ""}`} />
        </Link>
      </div>
    </div>
  );
}
