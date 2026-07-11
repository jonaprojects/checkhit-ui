import type { Route } from "./+types/student.assignments";
import MainLayout from "../components/MainLayout";
import { FileText, Clock, CheckCircle2, Search, Filter, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';
import { useState, useRef, useEffect } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Assignments | Check Hit" },
  ];
}

const statusConfig: Record<string, { label: string, color: string, icon: any }> = {
  'pending': { label: 'טרם הוגש', color: 'bg-gray-100 text-gray-700', icon: Clock },
  'checking': { label: 'בבדיקת AI', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  'checked': { label: 'נבדק', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  'appeal': { label: 'בערעור', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
};

const assignments = [
  { id: 1, title: 'תרגיל בית 3: עצי חיפוש בינאריים', course: 'מבני נתונים ואלגוריתמים', dueDate: 'מחר, 23:59', status: 'pending' },
  { id: 2, title: 'מטלה 2: מיון מהיר', course: 'מבני נתונים ואלגוריתמים', dueDate: 'הוגש לפני יומיים', status: 'checked', grade: 95 },
  { id: 3, title: 'תרגיל 1: מודל OSI', course: 'רשתות תקשורת', dueDate: 'הוגש לפני שבוע', status: 'appeal', grade: 82 },
  { id: 4, title: 'פרויקט גמר - שלב א', course: 'תכנות מונחה עצמים', dueDate: 'הוגש אתמול', status: 'checking' },
];

export default function StudentAssignmentsRoute() {
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
    <MainLayout portalName="פורטל סטודנטים" view="student">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12 min-h-[101vh]">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">המטלות שלי</h1>
            <p className="text-gray-500 mt-2">מעקב אחר כלל המטלות בקורסים שלך</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="חיפוש מטלה..." 
                className="w-full pl-4 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00857e] transition-all bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative" ref={filterRef}>
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-colors font-medium ${
                  activeFiltersCount > 0 
                    ? 'bg-teal-50 border-teal-200 text-[#00857e]' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter size={18} />
                סינון
              </button>

              {/* Filter Popover */}
              {isFilterOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <span className="font-bold text-gray-800">סינון מטלות</span>
                    {activeFiltersCount > 0 && (
                      <button onClick={clearFilters} className="text-xs text-[#00857e] hover:underline font-medium">
                        נקה הכל
                      </button>
                    )}
                  </div>
                  
                  <div className="p-4 max-h-96 overflow-y-auto space-y-6">
                    {/* Status Filter */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">סטטוס</h3>
                      <div className="space-y-2">
                        {Object.entries(statusConfig).map(([key, config]) => (
                          <label key={key} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                              <input 
                                type="checkbox" 
                                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-[#00857e] checked:border-[#00857e] transition-all cursor-pointer"
                                checked={selectedStatuses.includes(key)}
                                onChange={() => toggleStatus(key)}
                              />
                              <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                            </div>
                            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{config.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Course Filter */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">קורס</h3>
                      <div className="space-y-2">
                        {uniqueCourses.map(course => (
                          <label key={course} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                              <input 
                                type="checkbox" 
                                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-[#00857e] checked:border-[#00857e] transition-all cursor-pointer"
                                checked={selectedCourses.includes(course)}
                                onChange={() => toggleCourse(course)}
                              />
                              <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                            </div>
                            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{course}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {filteredAssignments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-start">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm">
                    <th className="px-6 py-4 font-medium w-1/3">מטלה</th>
                    <th className="px-6 py-4 font-medium">קורס</th>
                    <th className="px-6 py-4 font-medium">תאריך הגשה</th>
                    <th className="px-6 py-4 font-medium text-center">סטטוס</th>
                    <th className="px-6 py-4 font-medium text-center">ציון</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAssignments.map((assignment) => {
                    const StatusIcon = statusConfig[assignment.status].icon;
                    return (
                      <tr key={assignment.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <Link to={`/student/assignments/${assignment.id}`} className="font-bold text-gray-900 group-hover:text-[#00857e] transition-colors flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#00857e] group-hover:border-teal-100 group-hover:bg-teal-50 transition-colors">
                              <FileText size={18} />
                            </div>
                            {assignment.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {assignment.course}
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {assignment.dueDate}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusConfig[assignment.status].color}`}>
                            <StatusIcon size={14} />
                            {statusConfig[assignment.status].label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-gray-900">
                          {assignment.grade ? assignment.grade : '-'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">לא נמצאו תוצאות</h3>
              <p className="text-gray-500 max-w-sm mb-6">
                לא מצאנו מטלות שמתאימות לסינון או לחיפוש שלך. כדאי לנסות לשנות את הבחירה.
              </p>
              {(activeFiltersCount > 0 || searchQuery) && (
                <button 
                  onClick={() => {
                    clearFilters();
                    setSearchQuery('');
                  }} 
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  נקה הכל
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
