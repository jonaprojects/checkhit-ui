import type { Route } from "./+types/student.assignments";
import MainLayout from "../components/MainLayout";
import { FileText, Search, Filter, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { FilterBar } from '../components/ui/FilterBar';
import { useState, useRef, useEffect } from 'react';
import { StatusBadge, assignmentStatusConfig as statusConfig } from '../components/ui/StatusBadge';
import { useTranslation } from 'react-i18next';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Assignments | Check Hit" },
  ];
}

const assignmentsData = {
  he: [
    { id: 1, title: 'תרגיל בית 3: עצי חיפוש בינאריים', course: 'מבני נתונים ואלגוריתמים', dueDate: 'מחר, 23:59', status: 'pending' },
    { id: 2, title: 'מטלה 2: מיון מהיר', course: 'מבני נתונים ואלגוריתמים', dueDate: 'הוגש לפני יומיים', status: 'checked', grade: 95 },
    { id: 3, title: 'תרגיל 1: מודל OSI', course: 'רשתות תקשורת', dueDate: 'הוגש לפני שבוע', status: 'appeal', grade: 82 },
    { id: 4, title: 'פרויקט גמר - שלב א', course: 'תכנות מונחה עצמים', dueDate: 'הוגש אתמול', status: 'checking' },
  ],
  en: [
    { id: 1, title: 'Homework 3: Binary Search Trees', course: 'Data Structures & Algorithms', dueDate: 'Tomorrow, 23:59', status: 'pending' },
    { id: 2, title: 'Assignment 2: Quick Sort', course: 'Data Structures & Algorithms', dueDate: 'Submitted 2 days ago', status: 'checked', grade: 95 },
    { id: 3, title: 'Assignment 1: OSI Model', course: 'Computer Networks', dueDate: 'Submitted 1 week ago', status: 'appeal', grade: 82 },
    { id: 4, title: 'Final Project - Phase A', course: 'Object Oriented Programming', dueDate: 'Submitted yesterday', status: 'checking' },
  ]
};

export default function StudentAssignmentsRoute() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const assignments = isEn ? assignmentsData.en : assignmentsData.he;

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

  const uniqueCourses = Array.from(new Set(assignments.map(a => a.course)));

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
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(assignment.status);
    const matchesCourse = selectedCourses.length === 0 || selectedCourses.includes(assignment.course);
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const activeFiltersCount = selectedStatuses.length + selectedCourses.length;

  return (
    <MainLayout portalName={t('nav.dashboard')} view="student">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12 min-h-[101vh]">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-6 gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{t('dashboard.myAssignments')}</h1>
            <p className="text-gray-500 mt-2">{t('course.manageCourseAssignments')}</p>
          </div>
          <div className="w-full md:w-auto">
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
                      {Object.entries(statusConfig).map(([key, config]) => (
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
                </>
              }
            />
          </div>
        </header>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <Link to={`/student/assignments/${assignment.id}`} className="font-bold text-gray-900 group-hover:text-[#00857e] transition-colors flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#00857e] group-hover:border-teal-100 group-hover:bg-teal-50 transition-colors">
                            <FileText size={18} />
                          </div>
                          {assignment.title}
                        </Link>
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">
                        {assignment.course}
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">
                        {assignment.dueDate}
                      </TableCell>
                      <TableCell className="text-center">
                        <StatusBadge type="assignment" status={assignment.status} />
                      </TableCell>
                      <TableCell className="text-center font-bold text-gray-900">
                        {assignment.grade ? assignment.grade : '-'}
                      </TableCell>
                    </TableRow>
                  )
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
                  className="text-[#00857e] hover:underline font-medium"
                >
                  {isEn ? 'Clear all filters' : 'נקה את כל הסינונים'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
