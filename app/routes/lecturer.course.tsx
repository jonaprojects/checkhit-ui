import { useState } from 'react';
import type { Route } from "./+types/lecturer.course";
import MainLayout from "../components/MainLayout";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  FileText,
  AlertCircle,
  RefreshCw,
  MoreVertical,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { Button, LinkButton } from '../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { SearchBar } from '../components/ui/SearchBar';
import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLecturerCourse } from '../hooks/useLecturerCourse';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Course Assignments | Check Hit" },
  ];
}

export default function LecturerCourseRoute() {
  const { courseId } = useParams();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError, error, refetch, isFetching } = useLecturerCourse(courseId, isEn);

  const course = data?.course;
  const assignments = data?.assignments || [];

  const filteredAssignments = assignments.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout portalName={t('nav.dashboard')} view="lecturer">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        {/* Header Section */}
        <header className="border-b border-gray-200 dark:border-gray-800 pb-6">
          <Link
            to="/lecturer/courses"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#00857e] dark:hover:text-teal-300 transition-colors mb-4"
          >
            {isEn ? <ChevronLeft size={16} /> : <ChevronRight size={16} />} {t('course.backToCourses')}
          </Link>

          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
              <div className="h-9 w-72 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
              <div className="h-4 w-48 bg-gray-100 dark:bg-gray-800/60 rounded"></div>
            </div>
          ) : course ? (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300 px-2.5 py-1 rounded-lg text-sm font-bold tracking-wider border border-teal-200/60 dark:border-teal-800/60">
                    {course.code}
                  </span>
                  <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    {course.displayTitle}
                  </h1>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {t('course.manageCourseAssignments')}
                  {course.studentsCount != null && (
                    <span> ({course.studentsCount} {t('course.studentsRegistered')})</span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  title={t('courses.retry')}
                  className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
                >
                  <RefreshCw size={18} className={isFetching ? 'animate-spin text-teal-600 dark:text-teal-400' : ''} />
                </button>
                <Link
                  to={`/lecturer/courses/${courseId}/assignments/new`}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#00857e] hover:bg-teal-700 text-white rounded-xl transition-colors font-bold shadow-xs cursor-pointer"
                >
                  <Plus size={18} />
                  <span>{t('course.createNewAssignment')}</span>
                </Link>
              </div>
            </div>
          ) : null}
        </header>

        {/* Error State */}
        {isError && !isLoading && (
          <div className="rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/30 p-8 text-center max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <AlertCircle size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900 dark:text-red-200">
                {isEn ? 'Failed to load course assignments' : 'שגיאה בטעינת מטלות הקורס'}
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1 max-w-md mx-auto">
                {error instanceof Error ? error.message : 'Unknown error'}
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

        {/* Assignments Table Section */}
        {!isError && (
          <div className="bg-white dark:bg-[#17211f] rounded-2xl border border-gray-200 dark:border-[#263330] overflow-hidden shadow-xs">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-gray-50/50 dark:bg-gray-800/40">
              <h2 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-base">
                <FileText size={18} className="text-[#00857e] dark:text-teal-300" />
                <span>{t('course.courseAssignments')}</span>
                {!isLoading && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {assignments.length}
                  </span>
                )}
              </h2>
              <div className="w-full sm:w-72">
                <SearchBar
                  value={searchTerm}
                  onChange={(val) => setSearchTerm(val)}
                  onClear={() => setSearchTerm('')}
                  placeholder={t('course.searchAssignment')}
                  size="sm"
                  variant="default"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800/50 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : filteredAssignments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-2/5">{t('course.assignmentName')}</TableHead>
                    <TableHead>{t('course.dueDate')}</TableHead>
                    <TableHead className="text-center">{t('course.status')}</TableHead>
                    <TableHead className="text-center">{t('course.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.map((assignment) => {
                    const isPublished = assignment.status === 'PUBLISHED';
                    return (
                      <TableRow key={assignment.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/lecturer/assignments/${assignment.id}`}
                              className="font-bold text-gray-900 dark:text-gray-100 hover:text-[#00857e] dark:hover:text-teal-300 transition-colors"
                            >
                              {assignment.name}
                            </Link>
                            {isPublished && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                                {t('course.active')}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                            <Calendar size={14} className="text-gray-400 dark:text-gray-500" />
                            <span className={assignment.isOverdue ? 'text-amber-600 dark:text-amber-400 font-medium' : ''}>
                              {assignment.formattedDueDate}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                              isPublished
                                ? 'bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {assignment.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <LinkButton
                              to={`/lecturer/assignments/${assignment.id}`}
                              variant="ghost"
                              size="sm"
                              className="text-[#00857e] dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 font-bold"
                            >
                              {t('course.viewAndManage')}
                            </LinkButton>
                            <Button variant="ghost" size="icon" className="text-gray-400 dark:text-gray-500">
                              <MoreVertical size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-2xl flex items-center justify-center mx-auto">
                  <BookOpen size={32} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {searchTerm
                      ? (isEn ? 'No assignments match your search' : 'לא נמצאו מטלות התואמות לחיפוש')
                      : (isEn ? 'No assignments created yet' : 'עדיין לא נוצרו מטלות בקורס זה')}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {searchTerm
                      ? (isEn ? 'Try adjusting your search keywords.' : 'נסה לחפש במילים אחרות.')
                      : (isEn ? 'Get started by publishing the first assignment.' : 'התחל על ידי יצירת המטלה הראשונה.')}
                  </p>
                </div>
                {!searchTerm && (
                  <LinkButton
                    to={`/lecturer/courses/${courseId}/assignments/new`}
                    variant="primary"
                    size="sm"
                    className="mt-2"
                  >
                    <Plus size={16} />
                    <span>{t('course.createNewAssignment')}</span>
                  </LinkButton>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
