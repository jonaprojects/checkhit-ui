import type { Route } from "./+types/lecturer.appeals";
import MainLayout from "../components/MainLayout";
import { useState } from "react";
import { Link } from "react-router";
import { Search, Filter, AlertCircle, CheckCircle2, ChevronLeft, Clock, FileText, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { FilterBar } from '../components/ui/FilterBar';
import { Select } from '../components/ui/Input';
import { useTranslation } from 'react-i18next';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Appeals Management | Lecturer Portal | Check Hit" },
  ];
}

const MOCK_APPEALS = {
  he: [
    {
      id: "app_1",
      studentName: "ישראל ישראלי",
      studentId: "123456789",
      courseName: "מבני נתונים ואלגוריתמים",
      assignmentName: "תרגיל בית 3: עצי חיפוש",
      date: "28.10.2023, 14:30",
      grade: "82/100",
      category: "grading_error",
      categoryLabel: "טעות בבדיקה",
      preview: "ה-AI הוריד לי נקודות על יעילות זמן הריצה, אבל המימוש שלי הוא O(log n) כמו שלמדנו...",
      status: "pending",
    },
    {
      id: "app_2",
      studentName: "שיר כהן",
      studentId: "987654321",
      courseName: "מבוא למדעי המחשב",
      assignmentName: "מטלה 1: משתנים ולולאות",
      date: "27.10.2023, 09:15",
      grade: "65/100",
      category: "misunderstanding",
      categoryLabel: "חוסר הבנה של הקוד",
      preview: "לדעתי המערכת לא הבינה את הלוגיקה של פונקציית העזר שלי שסופרת את האיברים...",
      status: "pending",
    },
    {
      id: "app_3",
      studentName: "נועם לוי",
      studentId: "333444555",
      courseName: "עיצוב ממשקים",
      assignmentName: "פרויקט אמצע",
      date: "25.10.2023, 18:45",
      grade: "90/100",
      category: "technical",
      categoryLabel: "בעיה טכנית",
      preview: "הקובץ לא עלה כראוי ולכן חסר חלק מהקוד בבדיקה.",
      status: "resolved",
    },
    {
      id: "app_4",
      studentName: "רועי גבאי",
      studentId: "111222333",
      courseName: "מבני נתונים ואלגוריתמים",
      assignmentName: "תרגיל 1: רשימות מקושרות",
      date: "24.10.2023, 10:00",
      grade: "75/100",
      category: "other",
      categoryLabel: "אחר",
      preview: "אני חושב שמגיעות לי עוד נקודות על הבונוס שעשיתי בסוף.",
      status: "resolved",
    }
  ],
  en: [
    {
      id: "app_1",
      studentName: "Israel Israeli",
      studentId: "123456789",
      courseName: "Data Structures & Algorithms",
      assignmentName: "Homework 3: Search Trees",
      date: "28.10.2023, 14:30",
      grade: "82/100",
      category: "grading_error",
      categoryLabel: "Grading Error",
      preview: "The AI deducted points for time efficiency, but my implementation is O(log n) as we learned...",
      status: "pending",
    },
    {
      id: "app_2",
      studentName: "Shir Cohen",
      studentId: "987654321",
      courseName: "Introduction to Computer Science",
      assignmentName: "Assignment 1: Variables and Loops",
      date: "27.10.2023, 09:15",
      grade: "65/100",
      category: "misunderstanding",
      categoryLabel: "Code Misunderstanding",
      preview: "I think the system didn't understand the logic of my helper function that counts elements...",
      status: "pending",
    },
    {
      id: "app_3",
      studentName: "Noam Levi",
      studentId: "333444555",
      courseName: "Interface Design",
      assignmentName: "Midterm Project",
      date: "25.10.2023, 18:45",
      grade: "90/100",
      category: "technical",
      categoryLabel: "Technical Issue",
      preview: "The file didn't upload properly so part of the code is missing in the check.",
      status: "resolved",
    },
    {
      id: "app_4",
      studentName: "Roei Gabay",
      studentId: "111222333",
      courseName: "Data Structures & Algorithms",
      assignmentName: "Exercise 1: Linked Lists",
      date: "24.10.2023, 10:00",
      grade: "75/100",
      category: "other",
      categoryLabel: "Other",
      preview: "I think I deserve more points for the bonus I did at the end.",
      status: "resolved",
    }
  ]
};

export default function LecturerAppealsRoute() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const appeals = isEn ? MOCK_APPEALS.en : MOCK_APPEALS.he;

  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("pending");

  const filteredAppeals = appeals.filter(appeal => {
    const matchesSearch = appeal.studentName.includes(searchTerm) || appeal.studentId.includes(searchTerm);
    const matchesCourse = courseFilter === "all" || appeal.courseName === courseFilter;
    const matchesStatus = statusFilter === "all" || appeal.status === statusFilter;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  // Extract unique courses for the filter dropdown
  const uniqueCourses = Array.from(new Set(appeals.map(a => a.courseName)));

  return (
    <MainLayout portalName={isEn ? "Lecturer Portal" : "פורטל מרצים"} view="lecturer">
      <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{t('appeals.lecturerTitle')}</h1>
            <p className="text-gray-500 mt-2">{t('appeals.lecturerSubtitle')}</p>
          </div>
          <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-lg text-[#00857e] font-bold">
            <AlertCircle size={20} />
            <span>{appeals.filter(a => a.status === 'pending').length} {t('appeals.pendingCount')}</span>
          </div>
        </header>

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={t('appeals.searchPlaceholder')}
          className="mb-6"
        >
          <div className="relative w-full md:w-1/2">
            <Filter className={`absolute ${isEn ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-400`} size={16} />
            <Select 
              className={`w-full ${isEn ? 'pr-4 pl-10' : 'pl-4 pr-10'} py-2.5 !bg-gray-50 border-gray-200`}
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="all">{t('appeals.allCourses')}</option>
              {uniqueCourses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </Select>
          </div>
          <div className="w-full md:w-1/2 flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setStatusFilter("pending")}
              className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-colors cursor-pointer ${statusFilter === "pending" ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t('appeals.pending')}
            </button>
            <button 
              onClick={() => setStatusFilter("resolved")}
              className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-colors cursor-pointer ${statusFilter === "resolved" ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t('appeals.resolved')}
            </button>
            <button 
              onClick={() => setStatusFilter("all")}
              className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-colors cursor-pointer ${statusFilter === "all" ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t('appeals.all')}
            </button>
          </div>
        </FilterBar>

        {/* Appeals List */}
        <div className="space-y-3">
          {filteredAppeals.length > 0 ? (
            filteredAppeals.map(appeal => (
              <AppealCard key={appeal.id} appeal={appeal} />
            ))
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500">
              <CheckCircle2 className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-lg font-medium">{t('appeals.noAppeals')}</p>
            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
}

function AppealCard({ appeal }: { appeal: any }) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'grading_error': return 'bg-red-50 text-red-700 border-red-200';
      case 'technical': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'misunderstanding': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center gap-4">
      {/* Left side: Student & Status info */}
      <div className="flex flex-col md:w-1/4 shrink-0 border-b md:border-b-0 md:border-l border-gray-100 pb-4 md:pb-0 md:pl-4">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-gray-900 text-sm">{appeal.studentName}</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md font-mono">{appeal.studentId}</span>
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
          <span className={`w-2 h-2 rounded-full ${appeal.status === 'pending' ? 'bg-[#E8B43F]' : 'bg-green-500'}`}></span>
          {appeal.status === 'pending' ? t('appeals.waitingReview') : t('appeals.resolved')} • {appeal.date}
        </div>
      </div>

      {/* Middle: Context & Preview */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md truncate max-w-[150px]">
            {appeal.courseName}
          </span>
          <ChevronLeft size={12} className="text-gray-400 shrink-0" />
          <span className="text-xs text-gray-600 truncate max-w-[150px]">
            {appeal.assignmentName}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ml-auto ${getCategoryColor(appeal.category)}`}>
            {appeal.categoryLabel}
          </span>
        </div>
        
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-xs font-bold bg-[#00857e]/10 text-[#00857e] px-2 py-0.5 rounded">
            {t('appeals.originalGrade')}: {appeal.grade}
          </span>
        </div>
      </div>

      {/* Right side: Action */}
      <div className="shrink-0 pt-2 md:pt-0">
        <Link 
          to={`/lecturer/appeals/${appeal.id}`} 
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white border border-[#00857e] text-[#00857e] hover:bg-teal-50 px-6 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer"
        >
          {t('appeals.reviewBtn')}
          <ChevronLeft size={16} className={isEn ? "rotate-180" : ""} />
        </Link>
      </div>
    </div>
  );
}
