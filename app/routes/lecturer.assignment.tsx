import { useState } from 'react';
import type { Route } from "./+types/lecturer.assignment";
import MainLayout from "../components/MainLayout";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Edit,
  AlertCircle,
  RefreshCw,
  Search,
  Check,
  FileCheck,
  Bot,
  HelpCircle,
  ExternalLink,
  Award,
} from 'lucide-react';
import { Link, useParams, useSearchParams } from "react-router";
import { useTranslation } from 'react-i18next';
import { Button, LinkButton } from '../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { SearchBar } from '../components/ui/SearchBar';
import { useLecturerAssignmentOverview } from '../hooks/useLecturerAssignmentOverview';
import type { LecturerAssignmentStudentStatus } from '../lib/api/types';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Assignment Overview | Check Hit" },
  ];
}

type FilterTab = 'ALL' | LecturerAssignmentStudentStatus;

export default function LecturerAssignmentRoute() {
  const { assignmentId } = useParams();
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const ltik = searchParams.get('ltik') || undefined;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterTab>('ALL');
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading, isError, error, refetch, isFetching } = useLecturerAssignmentOverview(
    assignmentId,
    {},
    isEn,
    ltik
  );

  const ChevronBack = isEn ? ChevronLeft : ChevronRight;

  // Filter students
  const students = data?.students || [];
  const filteredStudents = students.filter((item) => {
    // Status filter
    if (selectedFilter !== 'ALL') {
      if (selectedFilter === 'NOT_STARTED') {
        if (item.status !== 'NOT_STARTED' && item.status !== 'OVERDUE') return false;
      } else if (item.status !== selectedFilter) {
        return false;
      }
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const nameMatch = item.student.name.toLowerCase().includes(q);
      const emailMatch = item.student.email.toLowerCase().includes(q);
      const numMatch = item.student.studentNumber?.toLowerCase().includes(q);
      if (!nameMatch && !emailMatch && !numMatch) return false;
    }

    return true;
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (!data) return;
    setIsExporting(true);

    try {
      const headers = ['Student Name', 'Student ID', 'Email', 'Status', 'Submitted At', 'Score', 'Max Score', 'Evaluated At', 'Appeal Status'];
      const rows = data.students.map((s) => [
        `"${s.student.name.replace(/"/g, '""')}"`,
        `"${(s.student.studentNumber || '').replace(/"/g, '""')}"`,
        `"${s.student.email.replace(/"/g, '""')}"`,
        `"${s.status}"`,
        `"${s.formattedSubmittedAt}"`,
        s.evaluation?.score != null ? s.evaluation.score : '',
        s.evaluation?.maxScore || data.maxScore || 100,
        `"${s.formattedEvaluatedAt}"`,
        `"${s.appeal?.status || 'None'}"`,
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${data.course.code}_${data.name.replace(/\s+/g, '_')}_grades.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export CSV', err);
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusBadge = (status: LecturerAssignmentStudentStatus) => {
    switch (status) {
      case 'GRADED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 rounded-full text-xs font-semibold">
            <FileCheck size={13} />
            {t('lecturerAssignment.graded')}
          </span>
        );
      case 'EVALUATING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60 rounded-full text-xs font-semibold animate-pulse">
            <Bot size={13} />
            {t('lecturerAssignment.evaluating')}
          </span>
        );
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60 rounded-full text-xs font-semibold">
            <Check size={13} />
            {t('lecturerAssignment.submitted')}
          </span>
        );
      case 'APPEAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 rounded-full text-xs font-semibold">
            <HelpCircle size={13} />
            {t('lecturerAssignment.inAppeal')}
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60 rounded-full text-xs font-semibold">
            <XCircle size={13} />
            {t('lecturerAssignment.overdue')}
          </span>
        );
      case 'NOT_STARTED':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium">
            {t('lecturerAssignment.notStarted')}
          </span>
        );
    }
  };

  return (
    <MainLayout portalName={t('nav.dashboard')} view="lecturer">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-8 animate-pulse">
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="flex justify-between items-end border-b border-gray-200 dark:border-gray-800 pb-6">
              <div className="space-y-3">
                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-8 w-72 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 bg-slate-100 dark:bg-slate-800/60 rounded-xl"></div>
              ))}
            </div>
            <div className="h-20 bg-slate-100 dark:bg-slate-800/60 rounded-xl"></div>
            <div className="h-96 bg-slate-100 dark:bg-slate-800/60 rounded-xl"></div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 p-6 rounded-2xl text-center space-y-4">
            <div className="inline-flex p-3 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full">
              <AlertCircle size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900 dark:text-red-200">
                {t('lecturerAssignment.errorTitle')}
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300/80 mt-1">
                {(error as Error)?.message || t('lecturerAssignment.errorDesc')}
              </p>
            </div>
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              className="gap-2 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40"
            >
              <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
              {t('common.retry')}
            </Button>
          </div>
        )}

        {/* Loaded Assignment View */}
        {!isLoading && !isError && data && (
          <>
            {/* Header */}
            <header className="border-b border-gray-200 dark:border-gray-800 pb-6">
              <Link
                to={`/lecturer/courses/${data.courseId}`}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-[#00857e] dark:hover:text-teal-300 transition-colors mb-4 font-medium"
              >
                <ChevronBack size={16} /> {t('lecturerAssignment.backToCourse')}: {data.course.name} ({data.course.code})
              </Link>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300 px-2.5 py-1 rounded-lg text-sm font-bold tracking-wider border border-teal-200/50 dark:border-teal-800/50">
                      {data.course.code}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                      {data.name}
                    </h1>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {data.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock size={15} className="text-[#00857e] dark:text-teal-400" />
                    <span>
                      {t('lecturerAssignment.dueDate')}:{' '}
                      <strong className="text-gray-700 dark:text-gray-200">
                        {data.formattedDueDate || t('lecturerAssignment.noDeadline')}
                      </strong>
                    </span>
                    {data.isOverdue && (
                      <span className="text-xs px-2 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 rounded font-bold">
                        {t('lecturerAssignment.ended')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2.5 w-full md:w-auto">
                  <Button
                    onClick={handleExportCSV}
                    disabled={isExporting}
                    variant="outline"
                    className="flex-1 md:flex-none items-center gap-2 font-medium bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    <Download size={16} />
                    {isExporting ? t('lecturerAssignment.exporting') : t('lecturerAssignment.exportGrades')}
                  </Button>
                </div>
              </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Total Students */}
              <div className="bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center shadow-xs">
                <div className="w-10 h-10 bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300 rounded-xl flex items-center justify-center mb-3">
                  <Users size={20} />
                </div>
                <div className="text-3xl font-black text-gray-900 dark:text-white">
                  {data.stats.totalStudents}
                </div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide">
                  {t('lecturerAssignment.totalStudents')}
                </div>
              </div>

              {/* Submitted */}
              <div className="bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center shadow-xs">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 rounded-xl flex items-center justify-center mb-3">
                  <CheckCircle2 size={20} />
                </div>
                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {data.stats.submitted}
                </div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide">
                  {t('lecturerAssignment.submitted')} ({data.stats.graded} {t('lecturerAssignment.graded')})
                </div>
              </div>

              {/* Missing / Not Submitted */}
              <div className="bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center shadow-xs">
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400 rounded-xl flex items-center justify-center mb-3">
                  <XCircle size={20} />
                </div>
                <div className="text-3xl font-black text-rose-600 dark:text-rose-400">
                  {data.stats.missing}
                </div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide">
                  {t('lecturerAssignment.missing')}
                </div>
              </div>

              {/* Remaining Time / Status */}
              <div className="bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center shadow-xs">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 rounded-xl flex items-center justify-center mb-3">
                  <Clock size={20} />
                </div>
                <div className="text-xl md:text-2xl font-black text-gray-900 dark:text-white line-clamp-1">
                  {data.remainingTimeLabel}
                </div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide">
                  {t('lecturerAssignment.remainingTime')}
                </div>
              </div>
            </div>

            {/* Overall Submission Rate Progress Bar */}
            <div className="bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
              <div className="flex justify-between items-end mb-3">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-[#00857e] dark:text-teal-400" />
                  <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                    {t('lecturerAssignment.submissionProgress')}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {data.stats.submitted} / {data.stats.totalStudents} {t('lecturerAssignment.table.student')}
                  </span>
                  <span className="font-black text-2xl text-[#00857e] dark:text-teal-400">
                    {data.stats.submissionRate}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-3.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-500 to-[#00857e] dark:from-teal-400 dark:to-teal-600 h-3.5 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(data.stats.submissionRate, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Students Submissions Section */}
            <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xs">
              {/* Table Toolbar: Filter Chips & Search Bar */}
              <div className="p-4 md:p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-slate-800/40 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
                  <button
                    onClick={() => setSelectedFilter('ALL')}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                      selectedFilter === 'ALL'
                        ? 'bg-[#00857e] text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {t('lecturerAssignment.all')} ({data.stats.totalStudents})
                  </button>

                  <button
                    onClick={() => setSelectedFilter('GRADED')}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                      selectedFilter === 'GRADED'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {t('lecturerAssignment.graded')} ({data.stats.graded})
                  </button>

                  <button
                    onClick={() => setSelectedFilter('EVALUATING')}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                      selectedFilter === 'EVALUATING'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {t('lecturerAssignment.evaluating')} ({data.stats.evaluating})
                  </button>

                  <button
                    onClick={() => setSelectedFilter('SUBMITTED')}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                      selectedFilter === 'SUBMITTED'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {t('lecturerAssignment.submitted')}
                  </button>

                  <button
                    onClick={() => setSelectedFilter('NOT_STARTED')}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                      selectedFilter === 'NOT_STARTED'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {t('lecturerAssignment.missing')} ({data.stats.missing})
                  </button>

                  {data.stats.appealsCount > 0 && (
                    <button
                      onClick={() => setSelectedFilter('APPEAL')}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                        selectedFilter === 'APPEAL'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {t('lecturerAssignment.inAppeal')} ({data.stats.appealsCount})
                    </button>
                  )}
                </div>

                {/* Search Bar */}
                <div className="w-full md:w-72">
                  <SearchBar
                    value={searchTerm}
                    onChange={(val) => setSearchTerm(val)}
                    onClear={() => setSearchTerm('')}
                    placeholder={t('lecturerAssignment.searchStudents')}
                    size="sm"
                    variant="default"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <Table className="min-w-[760px]">
                  <TableHeader>
                    <TableRow className="border-b border-gray-100 dark:border-gray-800">
                      <TableHead>{t('lecturerAssignment.table.student')}</TableHead>
                      <TableHead>{t('lecturerAssignment.table.studentId')}</TableHead>
                      <TableHead className="text-center">{t('lecturerAssignment.table.status')}</TableHead>
                      <TableHead className="text-center">{t('lecturerAssignment.table.submittedAt')}</TableHead>
                      <TableHead className="text-center">{t('lecturerAssignment.table.grade')}</TableHead>
                      <TableHead className="text-center">{t('lecturerAssignment.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((item, i) => {
                        const hasScore = item.evaluation?.score != null;
                        const score = item.evaluation?.score;
                        const maxScore = item.evaluation?.maxScore || data.maxScore || 100;
                        const initial = item.student.name ? item.student.name.charAt(0).toUpperCase() : 'S';

                        return (
                          <TableRow
                            key={item.student.userId || i}
                            className="border-b border-gray-50 dark:border-gray-800/60 hover:bg-teal-50/30 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            {/* Student */}
                            <TableCell className="font-bold text-gray-900 dark:text-white">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/60 text-[#00857e] dark:text-teal-300 flex items-center justify-center text-xs font-bold shrink-0">
                                  {initial}
                                </div>
                                <div className="flex flex-col">
                                  <span>{item.student.name}</span>
                                  <span className="text-xs text-gray-400 font-normal md:hidden">
                                    {item.student.email}
                                  </span>
                                </div>
                              </div>
                            </TableCell>

                            {/* ID / Email */}
                            <TableCell className="text-gray-600 dark:text-gray-300 text-xs font-mono">
                              <div>{item.student.studentNumber || item.student.email}</div>
                            </TableCell>

                            {/* Status */}
                            <TableCell className="text-center">
                              {getStatusBadge(item.status)}
                            </TableCell>

                            {/* Submitted At */}
                            <TableCell className="text-center text-xs text-gray-500 dark:text-gray-400">
                              {item.formattedSubmittedAt}
                            </TableCell>

                            {/* Final Grade */}
                            <TableCell className="text-center">
                              {hasScore ? (
                                <div className="inline-flex items-baseline gap-1 font-black text-gray-900 dark:text-white text-base">
                                  <span
                                    className={
                                      (score || 0) >= 85
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : (score || 0) >= 60
                                        ? 'text-teal-600 dark:text-teal-400'
                                        : 'text-rose-600 dark:text-rose-400'
                                    }
                                  >
                                    {score}
                                  </span>
                                  <span className="text-xs text-gray-400 font-normal">
                                    / {maxScore}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm font-medium">—</span>
                              )}
                            </TableCell>

                            {/* Actions */}
                            <TableCell className="text-center">
                              {item.appeal ? (
                                <Link
                                  to={`/lecturer/appeals/${item.appeal.id}`}
                                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                                >
                                  {t('lecturerAssignment.table.viewAppeal')}
                                  <ExternalLink size={12} />
                                </Link>
                              ) : item.evaluation ? (
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                  {t('lecturerAssignment.table.viewReview')}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <div className="max-w-md mx-auto space-y-2">
                            <Search size={32} className="mx-auto text-gray-300 dark:text-gray-600" />
                            <h4 className="font-bold text-gray-800 dark:text-gray-200">
                              {t('lecturerAssignment.emptyRoster')}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {t('lecturerAssignment.emptyRosterDesc')}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
