import type { Route } from "./+types/student.assignments";
import MainLayout from "../components/MainLayout";
import { FileText, Search, AlertCircle, RefreshCw, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';
import { Checkbox } from '../components/ui/Checkbox';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { FilterBar } from '../components/ui/FilterBar';
import { useState, useRef, useEffect } from 'react';
import { StatusBadge, assignmentStatusConfig as statusConfig } from '../components/ui/StatusBadge';
import { AssignmentTableSkeleton } from '../components/ui/Skeleton';
import { useStudentAssignments } from '../hooks/useStudentAssignments';
import { useTranslation } from 'react-i18next';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Assignments | Check Hit" },
  ];
}

export default function StudentAssignmentsRoute() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const { data: assignments = [], isLoading, isError, error, refetch, isFetching } = useStudentAssignments(isEn);

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter popover on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const uniqueCourses = Array.from(new Set(assignments.map(a => a.courseName).filter(Boolean)));

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const toggleCourse = (course: string) => {
    setSelectedCourses(prev => 
      prev.includes(course) ? prev.filter(c => c !== course) : [...prev, course]
    );
  };

  const clearFilters = () => {
    setSelectedStatuses([]);
    setSelectedCourses([]);
    setIsFilterOpen(false);
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = 
      assignment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(assignment.uiStatus);
    const matchesCourse = selectedCourses.length === 0 || selectedCourses.includes(assignment.courseName);
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const activeFiltersCount = selectedStatuses.length + selectedCourses.length;

  return (
    <MainLayout portalName={t('nav.dashboard')} view="student">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12 min-h-[101vh]">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-6 gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{t('dashboard.myAssignments')}</h1>
            <p className="text-gray-500 mt-2">{t('course.manageCourseAssignments')}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="text-sm text-gray-500 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-xs">
                {isEn ? "Total:" : "סה״כ:"} <strong className="text-gray-900">{assignments.length}</strong>
              </div>
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                title={t('courses.retry')}
                className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
              >
                <RefreshCw size={18} className={isFetching ? 'animate-spin text-teal-600' : ''} />
              </button>
            </div>
            <div className="w-full sm:w-auto">
              <FilterBar
                compact
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder={t('course.searchAssignment')}
                activeFiltersCount={activeFiltersCount}
                onClearFilters={clearFilters}
                filterContent={
                  <>
                    {/* Status Filter */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('course.status')}</h3>
                      <div className="space-y-2">
                        {Object.entries(statusConfig).map(([key]) => (
                          <Checkbox
                            key={key}
                            label={t(`status.assignment.${key}`)}
                            checked={selectedStatuses.includes(key)}
                            onChange={() => toggleStatus(key)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Course Filter */}
                    {uniqueCourses.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('nav.courses')}</h3>
                        <div className="space-y-2">
                          {uniqueCourses.map(course => (
                            <Checkbox
                              key={course}
                              label={course}
                              checked={selectedCourses.includes(course)}
                              onChange={() => toggleCourse(course)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                }
              />
            </div>
          </div>
        </header>

        {/* Loading State */}
        {isLoading && <AssignmentTableSkeleton rows={5} />}

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

        {/* Empty State (No assignments in database) */}
        {!isLoading && !isError && assignments.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
            <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <FileText size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {isEn ? 'No assignments found' : 'לא נמצאו מטלות'}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {isEn ? 'You do not have any published assignments in your enrolled courses.' : 'אין מטלות שפורסמו בקורסים אליהם הינך רשום.'}
              </p>
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

        {/* Table Content */}
        {!isLoading && !isError && assignments.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
            {filteredAssignments.length > 0 ? (
              <Table className="min-w-[700px]">
                <TableHeader className="text-sm">
                  <TableRow>
                    <TableHead className="w-1/3">{t('course.assignmentName')}</TableHead>
                    <TableHead>{t('nav.courses')}</TableHead>
                    <TableHead>{t('course.dueDate')}</TableHead>
                    <TableHead className="text-center">{t('course.status')}</TableHead>
                    <TableHead className="text-center">{t('course.grade')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.map((assignment) => {
                    return (
                      <TableRow key={assignment.id} className="group hover:bg-gray-50/80 transition-colors">
                        <TableCell>
                          <Link to={`/student/assignments/${assignment.id}`} className="font-bold text-gray-900 group-hover:text-[#00857e] transition-colors flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#00857e] group-hover:border-teal-100 group-hover:bg-teal-50 transition-colors shrink-0">
                              <FileText size={18} />
                            </div>
                            <span className="line-clamp-1">{assignment.name}</span>
                          </Link>
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          <span className="line-clamp-1">{assignment.courseName || '-'}</span>
                        </TableCell>
                        <TableCell className={`text-sm ${assignment.isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                          {assignment.formattedDueDate}
                        </TableCell>
                        <TableCell className="text-center">
                          <StatusBadge type="assignment" status={assignment.uiStatus} />
                        </TableCell>
                        <TableCell className="text-center font-bold text-gray-900">
                          {assignment.grade !== undefined && assignment.grade !== null ? assignment.grade : '-'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{isEn ? 'No results found' : 'לא נמצאו תוצאות'}</h3>
                <p className="text-gray-500 max-w-sm mb-6">
                  {isEn ? 'No assignments match your search or filters. Try changing your selection.' : 'לא מצאנו מטלות שמתאימות לסינון או לחיפוש שלך. כדאי לנסות לשנות את הבחירה.'}
                </p>
                {(activeFiltersCount > 0 || searchQuery) && (
                  <button 
                    onClick={() => {
                      clearFilters();
                      setSearchQuery('');
                    }} 
                    className="text-[#00857e] hover:underline font-medium cursor-pointer"
                  >
                    {isEn ? 'Clear all filters' : 'נקה את כל הסינונים'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
