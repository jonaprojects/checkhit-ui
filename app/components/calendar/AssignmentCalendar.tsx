import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  CalendarDays,
  CalendarRange,
  CalendarCheck,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  FileText,
  Upload,
  Maximize2,
  X,
} from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AssignmentCalendarModal } from './AssignmentCalendarModal';
import { StatusBadge } from '../ui/StatusBadge';
import type { ProcessedStudentAssignment } from '../../hooks/useStudentAssignments';

interface AssignmentCalendarProps {
  assignments: ProcessedStudentAssignment[];
}

const COURSE_COLOR_PALETTES = [
  {
    bg: 'bg-teal-50 dark:bg-teal-950/50',
    border: 'border-teal-200 dark:border-teal-800/60',
    text: 'text-teal-800 dark:text-teal-200',
    dot: 'bg-teal-500',
  },
  {
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    border: 'border-blue-200 dark:border-blue-800/60',
    text: 'text-blue-800 dark:text-blue-200',
    dot: 'bg-blue-500',
  },
  {
    bg: 'bg-purple-50 dark:bg-purple-950/50',
    border: 'border-purple-200 dark:border-purple-800/60',
    text: 'text-purple-800 dark:text-purple-200',
    dot: 'bg-purple-500',
  },
  {
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    border: 'border-amber-200 dark:border-amber-800/60',
    text: 'text-amber-800 dark:text-amber-200',
    dot: 'bg-amber-500',
  },
  {
    bg: 'bg-rose-50 dark:bg-rose-950/50',
    border: 'border-rose-200 dark:border-rose-800/60',
    text: 'text-rose-800 dark:text-rose-200',
    dot: 'bg-rose-500',
  },
  {
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    text: 'text-emerald-800 dark:text-emerald-200',
    dot: 'bg-emerald-500',
  },
];

const formatWeekRange = (start: Date, end: Date, isEn: boolean) => {
  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = new Intl.DateTimeFormat(isEn ? 'en-US' : 'he-IL', { month: 'short' }).format(start);
  const endMonth = new Intl.DateTimeFormat(isEn ? 'en-US' : 'he-IL', { month: 'short' }).format(end);
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  if (startYear !== endYear) {
    return isEn
      ? `${startMonth} ${startDay}, ${startYear} – ${endMonth} ${endDay}, ${endYear}`
      : `${startDay} ב${startMonth} ${startYear} – ${endDay} ב${endMonth} ${endYear}`;
  }
  if (start.getMonth() !== end.getMonth()) {
    return isEn
      ? `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${startYear}`
      : `${startDay} ב${startMonth} – ${endDay} ב${endMonth} ${startYear}`;
  }
  return isEn
    ? `${startMonth} ${startDay} – ${endDay}, ${startYear}`
    : `${startDay} – ${endDay} ב${startMonth} ${startYear}`;
};

export function AssignmentCalendar({ assignments }: AssignmentCalendarProps) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');

  const [calendarMode, setCalendarMode] = useState<'month' | 'week' | 'day'>('month');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Fullscreen escape key & document scroll locking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // Initial date based on earliest upcoming assignment or today
  const [currentDate, setCurrentDate] = useState(() => {
    if (assignments.length > 0) {
      const validDueDates = assignments
        .map((a) => (a.dueAt ? new Date(a.dueAt) : null))
        .filter(Boolean) as Date[];
      if (validDueDates.length > 0) {
        return new Date(validDueDates[0].getTime());
      }
    }
    return new Date();
  });

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Touch swipe support for mobile navigation
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  // Map course names to consistent color palettes
  const courseColorMap = useMemo(() => {
    const map = new Map<string, (typeof COURSE_COLOR_PALETTES)[0]>();
    const uniqueCourses = Array.from(new Set(assignments.map((a) => a.courseName).filter(Boolean)));
    uniqueCourses.forEach((course, index) => {
      map.set(course, COURSE_COLOR_PALETTES[index % COURSE_COLOR_PALETTES.length]);
    });
    return map;
  }, [assignments]);

  // Index assignments by date key "YYYY-M-D"
  const assignmentMap = useMemo(() => {
    const map = new Map<string, ProcessedStudentAssignment[]>();
    assignments.forEach((assignment) => {
      if (assignment.dueAt) {
        const d = new Date(assignment.dueAt);
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        const existing = map.get(key) || [];
        existing.push(assignment);
        map.set(key, existing);
      }
    });
    return map;
  }, [assignments]);

  // Monthly Grid computations (Sunday to Saturday)
  const { monthGrid, monthLabel, yearLabel, todayKey } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday

    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

    const today = new Date();
    const todayKeyStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

    interface CalendarDay {
      date: Date;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      dateKey: string;
      assignments: ProcessedStudentAssignment[];
    }

    const days: CalendarDay[] = [];

    // Previous month filler days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, totalDaysInPrevMonth - i);
      const key = `${prevDate.getFullYear()}-${prevDate.getMonth()}-${prevDate.getDate()}`;
      days.push({
        date: prevDate,
        dayNumber: totalDaysInPrevMonth - i,
        isCurrentMonth: false,
        isToday: key === todayKeyStr,
        dateKey: key,
        assignments: assignmentMap.get(key) || [],
      });
    }

    // Current month days
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const date = new Date(year, month, day);
      const key = `${year}-${month}-${day}`;
      days.push({
        date,
        dayNumber: day,
        isCurrentMonth: true,
        isToday: key === todayKeyStr,
        dateKey: key,
        assignments: assignmentMap.get(key) || [],
      });
    }

    // Next month filler days to complete grid
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      const key = `${nextDate.getFullYear()}-${nextDate.getMonth()}-${nextDate.getDate()}`;
      days.push({
        date: nextDate,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: key === todayKeyStr,
        dateKey: key,
        assignments: assignmentMap.get(key) || [],
      });
    }

    const monthFormatted = new Intl.DateTimeFormat(isEn ? 'en-US' : 'he-IL', {
      month: 'long',
    }).format(firstDayOfMonth);

    return {
      monthGrid: days,
      monthLabel: monthFormatted,
      yearLabel: year,
      todayKey: todayKeyStr,
    };
  }, [currentDate, assignmentMap, isEn]);

  // Weekly Grid computations (Sunday to Saturday)
  const weekData = useMemo(() => {
    const currentDayOfWeek = currentDate.getDay(); // 0 is Sunday
    const startOfWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDayOfWeek
    );
    const endOfWeek = new Date(
      startOfWeek.getFullYear(),
      startOfWeek.getMonth(),
      startOfWeek.getDate() + 6
    );

    const today = new Date();
    const todayKeyStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(
        startOfWeek.getFullYear(),
        startOfWeek.getMonth(),
        startOfWeek.getDate() + i
      );
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      days.push({
        date,
        dayNumber: date.getDate(),
        isToday: key === todayKeyStr,
        dateKey: key,
        assignments: assignmentMap.get(key) || [],
      });
    }

    const weekRangeLabel = formatWeekRange(startOfWeek, endOfWeek, isEn);
    const assignmentsCount = days.reduce((sum, d) => sum + d.assignments.length, 0);

    return {
      weekDays: days,
      weekRangeLabel,
      assignmentsCount,
    };
  }, [currentDate, assignmentMap, isEn]);

  // Daily View computations
  const dayData = useMemo(() => {
    const today = new Date();
    const todayKeyStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const currentKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
    const dayAssignments = assignmentMap.get(currentKey) || [];

    const formattedFullDate = new Intl.DateTimeFormat(isEn ? 'en-US' : 'he-IL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(currentDate);

    // Find next upcoming deadline after currentDate if current day has 0
    let nextUpcomingDate: Date | null = null;
    if (dayAssignments.length === 0 && assignments.length > 0) {
      const futureAssignments = assignments
        .filter((a) => a.dueAt && new Date(a.dueAt).getTime() > currentDate.getTime())
        .sort((a, b) => new Date(a.dueAt!).getTime() - new Date(b.dueAt!).getTime());

      if (futureAssignments.length > 0) {
        nextUpcomingDate = new Date(futureAssignments[0].dueAt!);
      }
    }

    return {
      dayAssignments,
      isToday: currentKey === todayKeyStr,
      formattedFullDate,
      nextUpcomingDate,
    };
  }, [currentDate, assignmentMap, assignments, isEn]);

  // Weekday column titles (Sunday to Saturday)
  const weekdays = isEn
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

  const handlePrev = () => {
    if (calendarMode === 'day') {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1));
    } else if (calendarMode === 'week') {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7));
    } else {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }
  };

  const handleNext = () => {
    if (calendarMode === 'day') {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1));
    } else if (calendarMode === 'week') {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7));
    } else {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleOpenDayModal = (date: Date) => {
    setSelectedDay(date);
    setIsModalOpen(true);
  };

  // Touch Gestures for mobile swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        isEn ? handleNext() : handlePrev();
      } else {
        isEn ? handlePrev() : handleNext();
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

  const selectedDayAssignments = useMemo(() => {
    if (!selectedDay) return [];
    const key = `${selectedDay.getFullYear()}-${selectedDay.getMonth()}-${selectedDay.getDate()}`;
    return assignmentMap.get(key) || [];
  }, [selectedDay, assignmentMap]);

  // Current month assignments count
  const currentMonthAssignmentsCount = useMemo(() => {
    return monthGrid
      .filter((d) => d.isCurrentMonth)
      .reduce((sum, d) => sum + d.assignments.length, 0);
  }, [monthGrid]);

  // Render Calendar Grid Body
  const renderCalendarBody = (isFull: boolean) => (
    <div className="w-full flex-1 flex flex-col">
      {/* Mode 1: Monthly View Grid */}
      {calendarMode === 'month' && (
        <div className="bg-white dark:bg-[#17211f] rounded-xl border border-gray-200 dark:border-[#263330] shadow-xs overflow-hidden flex-1 flex flex-col">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-[#263330] bg-gray-50/80 dark:bg-[#131c1a]">
            {weekdays.map((day, idx) => (
              <div
                key={day}
                className={`py-2 sm:py-2.5 md:py-3 text-center text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
                  idx === 5 || idx === 6
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day Cells Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-gray-100 dark:divide-[#263330] border-b border-gray-100 dark:border-[#263330] flex-1">
            {monthGrid.map((dayCell) => {
              const hasAssignments = dayCell.assignments.length > 0;
              const maxPills = isFull ? 4 : 3;
              const displayedAssignments = dayCell.assignments.slice(0, maxPills);
              const extraCount = dayCell.assignments.length - maxPills;

              return (
                <div
                  key={dayCell.dateKey}
                  onClick={() => handleOpenDayModal(dayCell.date)}
                  className={`${
                    isFull
                      ? 'min-h-[100px] sm:min-h-[120px] md:min-h-[135px] p-2 sm:p-2.5'
                      : 'min-h-[68px] sm:min-h-[84px] md:min-h-[104px] lg:min-h-[116px] p-1.5 sm:p-2 md:p-2.5'
                  } transition-all flex flex-col justify-between cursor-pointer group ${
                    dayCell.isCurrentMonth
                      ? 'bg-white dark:bg-[#17211f] hover:bg-teal-50/30 dark:hover:bg-teal-950/20'
                      : 'bg-gray-50/50 dark:bg-[#121a18]/60 text-gray-300 dark:text-gray-600'
                  } ${dayCell.isToday ? 'ring-2 ring-inset ring-teal-500 dark:ring-teal-400' : ''}`}
                >
                  {/* Day Header (Number + Today Badge) */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`inline-flex items-center justify-center text-[11px] sm:text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full ${
                        dayCell.isToday
                          ? 'bg-[#00857e] text-white shadow-xs'
                          : dayCell.isCurrentMonth
                          ? 'text-gray-800 dark:text-gray-200 group-hover:text-[#00857e]'
                          : 'text-gray-400 dark:text-gray-600'
                      }`}
                    >
                      {dayCell.dayNumber}
                    </span>

                    {hasAssignments && (
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400 sm:hidden shrink-0" />
                    )}
                  </div>

                  {/* Assignment Pills */}
                  <div className="space-y-1 flex-1 overflow-hidden">
                    {displayedAssignments.map((assignment) => {
                      const color =
                        courseColorMap.get(assignment.courseName) || COURSE_COLOR_PALETTES[0];
                      const dueTime = assignment.dueAt
                        ? new Date(assignment.dueAt).toLocaleTimeString(isEn ? 'en-US' : 'he-IL', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '';

                      return (
                        <div
                          key={assignment.id}
                          className={`hidden sm:flex items-center justify-between gap-1 px-1.5 py-0.5 md:py-1 rounded-md border text-[10px] md:text-[11px] font-semibold leading-tight transition-all shadow-2xs ${color.bg} ${color.border} ${color.text} hover:scale-[1.01]`}
                        >
                          <div className="flex items-center gap-1 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full ${color.dot} shrink-0`} />
                            <span className="truncate">{assignment.name}</span>
                          </div>
                          {dueTime && <span className="opacity-75 shrink-0 text-[9px] md:text-[10px]">{dueTime}</span>}
                        </div>
                      );
                    })}

                    {extraCount > 0 && (
                      <span className="hidden sm:block text-[9px] md:text-[10px] font-bold text-gray-500 dark:text-gray-400 px-1">
                        {t('calendar.moreAssignments', { count: extraCount })}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 2: Weekly View */}
      {calendarMode === 'week' && (
        <div
          className={`bg-white dark:bg-[#17211f] rounded-2xl border border-gray-200 dark:border-[#263330] shadow-sm overflow-hidden flex flex-col ${
            isFull ? 'min-h-[560px] lg:min-h-[660px] flex-1' : 'min-h-[480px] lg:min-h-[560px]'
          }`}
        >
          {/* A. Desktop View: Full 7-Column Grid (hidden on mobile, visible md and up) */}
          <div className="hidden md:flex flex-col flex-1">
            {/* Weekday Header Row */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-[#263330] bg-gray-50/90 dark:bg-[#131c1a] divide-x divide-gray-100 dark:divide-[#263330]">
              {weekData.weekDays.map((dayCell, idx) => (
                <div
                  key={`header-${dayCell.dateKey}`}
                  className={`py-3 px-2 text-center transition-colors ${
                    dayCell.isToday
                      ? 'bg-teal-50/80 dark:bg-teal-950/50 text-[#00857e] dark:text-teal-300'
                      : ''
                  }`}
                >
                  <span
                    className={`block text-xs font-bold uppercase tracking-wider ${
                      dayCell.isToday
                        ? 'text-[#00857e] dark:text-teal-300 font-extrabold'
                        : idx === 5 || idx === 6
                        ? 'text-gray-400 dark:text-gray-500'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {isEn ? weekdays[idx] : `יום ${['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳'][idx] || 'שבת'}`}
                  </span>
                  <div className="mt-1.5 flex items-center justify-center">
                    <span
                      className={`inline-flex items-center justify-center text-sm font-extrabold w-8 h-8 rounded-full transition-transform ${
                        dayCell.isToday
                          ? 'bg-[#00857e] text-white shadow-md scale-105 ring-2 ring-teal-200 dark:ring-teal-900'
                          : 'text-gray-800 dark:text-gray-100 hover:bg-gray-200/60 dark:hover:bg-[#1e2c29]'
                      }`}
                    >
                      {dayCell.dayNumber}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 7 Columns Body */}
            <div
              className={`grid grid-cols-7 divide-x divide-gray-100 dark:divide-[#263330] flex-1 bg-white dark:bg-[#17211f] ${
                isFull ? 'min-h-[480px] lg:min-h-[580px]' : 'min-h-[440px] lg:min-h-[500px]'
              }`}
            >
              {weekData.weekDays.map((dayCell) => {
                const hasAssignments = dayCell.assignments.length > 0;

                return (
                  <div
                    key={dayCell.dateKey}
                    onClick={() => handleOpenDayModal(dayCell.date)}
                    className={`p-2.5 flex flex-col gap-2.5 transition-colors cursor-pointer group relative [--calendar-line:rgba(0,0,0,0.035)] dark:[--calendar-line:rgba(255,255,255,0.035)] ${
                      dayCell.isToday
                        ? 'bg-teal-50/15 dark:bg-teal-950/10'
                        : 'hover:bg-gray-50/50 dark:hover:bg-[#151e1c]/60'
                    }`}
                    style={{
                      backgroundImage:
                        'linear-gradient(to bottom, transparent 51px, var(--calendar-line) 52px)',
                      backgroundSize: '100% 52px',
                    }}
                  >
                    {hasAssignments ? (
                      dayCell.assignments.map((assignment) => {
                        const color =
                          courseColorMap.get(assignment.courseName) || COURSE_COLOR_PALETTES[0];
                        const dueTime = assignment.dueAt
                          ? new Date(assignment.dueAt).toLocaleTimeString(isEn ? 'en-US' : 'he-IL', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '';

                        return (
                          <div
                            key={assignment.id}
                            className={`p-3 rounded-xl border transition-all shadow-2xs hover:shadow-md hover:-translate-y-0.5 relative z-10 ${color.bg} ${color.border}`}
                          >
                            <div className="flex items-center gap-1.5 text-[10.5px] font-bold mb-1 truncate text-gray-700 dark:text-gray-300">
                              <span className={`w-2 h-2 rounded-full ${color.dot} shrink-0`} />
                              <span className="truncate">{assignment.courseName}</span>
                            </div>
                            <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white line-clamp-2 leading-snug mb-2">
                              {assignment.name}
                            </h4>
                            <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10.5px] text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1 font-semibold">
                                <Clock size={12} className="text-gray-400 dark:text-gray-500" />
                                {dueTime || '23:59'}
                              </span>
                              <StatusBadge type="assignment" status={assignment.uiStatus} rounded="md" />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-0 group-hover:opacity-100 transition-opacity select-none text-center">
                        <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                          {isEn ? 'No deadlines' : 'אין מועדי הגשה'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* B. Mobile View: 7-Day Selector Strip + Day Agenda (visible on md:hidden) */}
          <div className="flex md:hidden flex-col flex-1">
            {/* 7-Day Interactive Selector Strip */}
            <div className="grid grid-cols-7 gap-1 p-2 bg-gray-50/90 dark:bg-[#131c1a] border-b border-gray-200 dark:border-[#263330]">
              {weekData.weekDays.map((dayCell, idx) => {
                const isSelected =
                  dayCell.date.getDate() === currentDate.getDate() &&
                  dayCell.date.getMonth() === currentDate.getMonth() &&
                  dayCell.date.getFullYear() === currentDate.getFullYear();
                const hasAssignments = dayCell.assignments.length > 0;

                return (
                  <button
                    key={`mobile-strip-${dayCell.dateKey}`}
                    type="button"
                    onClick={() => setCurrentDate(dayCell.date)}
                    className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#00857e] text-white shadow-md font-bold scale-[1.03]'
                        : dayCell.isToday
                        ? 'bg-teal-50/80 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1f2d29]'
                    }`}
                  >
                    <span
                      className={`text-[10px] uppercase font-bold tracking-tight ${
                        isSelected
                          ? 'text-teal-100'
                          : idx === 5 || idx === 6
                          ? 'text-gray-400 dark:text-gray-500'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {isEn ? weekdays[idx].slice(0, 3) : ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'שבת'][idx]}
                    </span>
                    <span className="text-xs font-extrabold mt-0.5">{dayCell.dayNumber}</span>

                    {/* Assignment Indicator Dots */}
                    <div className="flex items-center justify-center gap-0.5 mt-1 h-1.5">
                      {hasAssignments ? (
                        dayCell.assignments.slice(0, 3).map((a, dotIdx) => {
                          const color =
                            courseColorMap.get(a.courseName) || COURSE_COLOR_PALETTES[0];
                          return (
                            <span
                              key={`${a.id}-${dotIdx}`}
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSelected ? 'bg-white' : color.dot
                              }`}
                            />
                          );
                        })
                      ) : (
                        <span className="w-1.5 h-1.5 opacity-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Day Agenda Content */}
            <div className="p-3.5 sm:p-4 flex-1 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-[#263330]">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white capitalize">
                  {new Intl.DateTimeFormat(isEn ? 'en-US' : 'he-IL', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  }).format(currentDate)}
                </h4>
                <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                  {dayData.dayAssignments.length} {isEn ? 'deadlines' : 'מועדי הגשה'}
                </span>
              </div>

              {dayData.dayAssignments.length > 0 ? (
                <div className="space-y-2.5">
                  {dayData.dayAssignments.map((assignment) => {
                    const color =
                      courseColorMap.get(assignment.courseName) || COURSE_COLOR_PALETTES[0];
                    const dueTime = assignment.dueAt
                      ? new Date(assignment.dueAt).toLocaleTimeString(isEn ? 'en-US' : 'he-IL', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '';

                    return (
                      <div
                        key={assignment.id}
                        className={`p-3.5 rounded-xl border transition-all shadow-xs ${color.bg} ${color.border} flex flex-col gap-2.5`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 truncate">
                            <span className={`w-2 h-2 rounded-full ${color.dot} shrink-0`} />
                            <span className="truncate">{assignment.courseName}</span>
                          </div>
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 dark:text-gray-300 shrink-0">
                            <Clock size={12} className="text-[#00857e]" />
                            {dueTime || '23:59'}
                          </span>
                        </div>

                        <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">
                          {assignment.name}
                        </h3>

                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-200/50 dark:border-gray-700/40">
                          <div className="flex items-center gap-2">
                            <StatusBadge type="assignment" status={assignment.uiStatus} rounded="full" />
                            {assignment.grade !== undefined && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[11px] font-bold">
                                {assignment.grade}
                              </span>
                            )}
                          </div>

                          {(() => {
                            const isSubmitted =
                              Boolean(assignment.submission) || assignment.uiStatus !== 'pending';
                            return (
                              <Link
                                to={`/student/assignments/${assignment.id}`}
                                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#00857e] hover:bg-[#006e68] text-white transition-colors shadow-2xs cursor-pointer"
                              >
                                {isSubmitted ? (
                                  <>
                                    <FileText size={12} />
                                    {t('calendar.openAssignment')}
                                  </>
                                ) : (
                                  <>
                                    <Upload size={12} />
                                    {t('calendar.submitAssignment')}
                                  </>
                                )}
                                {isEn ? <ArrowRight size={12} /> : <ArrowLeft size={12} />}
                              </Link>
                            );
                          })()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 px-4 text-center rounded-xl bg-gray-50/60 dark:bg-[#131c1a] border border-dashed border-gray-200 dark:border-[#263330] space-y-2">
                  <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-950/50 text-[#00857e] dark:text-teal-400 mx-auto flex items-center justify-center shadow-2xs">
                    <CalendarCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      {t('calendar.noAssignmentsOnDay')}
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {isEn
                        ? 'Tap another day in the strip above to see deadlines.'
                        : 'הקש על יום אחר בסרגל למעלה כדי לצפות במטלות.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Daily View */}
      {calendarMode === 'day' && (
        <div
          className={`bg-white dark:bg-[#17211f] rounded-2xl border border-gray-200 dark:border-[#263330] shadow-sm overflow-hidden p-4 sm:p-6 space-y-4 ${
            isFull ? 'flex-1' : ''
          }`}
        >
          {/* Day Navigation Banner */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#263330]">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                  dayData.isToday
                    ? 'bg-[#00857e] text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-[#202d29] text-gray-700 dark:text-gray-300'
                }`}
              >
                {dayData.isToday ? t('calendar.today') : t('calendar.day')}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {t('calendar.swipeHint')}
              </span>
            </div>
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {dayData.dayAssignments.length}{' '}
              {isEn ? 'deadlines' : 'מועדי הגשה'}
            </div>
          </div>

          {/* Assignments List */}
          {dayData.dayAssignments.length > 0 ? (
            <div className="space-y-3">
              {dayData.dayAssignments.map((assignment) => {
                const color =
                  courseColorMap.get(assignment.courseName) || COURSE_COLOR_PALETTES[0];
                const dueTime = assignment.dueAt
                  ? new Date(assignment.dueAt).toLocaleTimeString(isEn ? 'en-US' : 'he-IL', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '';

                return (
                  <div
                    key={assignment.id}
                    className={`p-4 sm:p-5 rounded-xl border transition-all shadow-xs hover:shadow-md ${color.bg} ${color.border} flex flex-col md:flex-row md:items-center justify-between gap-4`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300">
                        <span className={`w-2.5 h-2.5 rounded-full ${color.dot} shrink-0`} />
                        <span>{assignment.courseName}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white">
                        {assignment.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-300 pt-1">
                        <span className="flex items-center gap-1 font-semibold">
                          <Clock size={13} className="text-[#00857e]" />
                          {t('calendar.dueAt')} {dueTime || '23:59'}
                        </span>
                        <StatusBadge type="assignment" status={assignment.uiStatus} rounded="full" />
                        {assignment.grade !== undefined && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold">
                            ציון: {assignment.grade}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-200/60 dark:border-gray-700/50">
                      {(() => {
                        const isSubmitted =
                          Boolean(assignment.submission) || assignment.uiStatus !== 'pending';
                        return (
                          <Link
                            to={`/student/assignments/${assignment.id}`}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#00857e] hover:bg-[#006e68] text-white transition-colors shadow-2xs w-full md:w-auto cursor-pointer"
                          >
                            {isSubmitted ? (
                              <>
                                <FileText size={14} />
                                {t('calendar.openAssignment')}
                              </>
                            ) : (
                              <>
                                <Upload size={14} />
                                {t('calendar.submitAssignment')}
                              </>
                            )}
                            {isEn ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
                          </Link>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 px-4 text-center rounded-xl bg-gray-50/60 dark:bg-[#131c1a] border border-dashed border-gray-200 dark:border-[#263330] space-y-3">
              <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950/50 text-[#00857e] dark:text-teal-400 mx-auto flex items-center justify-center shadow-2xs">
                <CalendarCheck size={24} />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-800 dark:text-gray-200">
                  {t('calendar.noAssignmentsOnDay')}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                  {isEn
                    ? 'No assignment deadlines scheduled for this day. Enjoy your free time or navigate to upcoming dates.'
                    : 'אין מועדי הגשה המתוכננים ליום זה. תוכל לנווט לתאריכים הבאים או לחזור לתצוגת חודש ושבוע.'}
                </p>
              </div>

              {dayData.nextUpcomingDate && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentDate(dayData.nextUpcomingDate!)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300 hover:bg-teal-100/70 border border-teal-200 dark:border-teal-800/60 transition-colors cursor-pointer"
                  >
                    <Sparkles size={13} />
                    {t('calendar.jumpToNextDeadline')} (
                    {new Intl.DateTimeFormat(isEn ? 'en-US' : 'he-IL', {
                      day: 'numeric',
                      month: 'short',
                    }).format(dayData.nextUpcomingDate)}
                    )
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Standard In-Page Calendar Layout */}
      <div
        className="space-y-3.5 select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Calendar Header & Toolbar */}
        <div className="bg-white dark:bg-[#17211f] rounded-xl border border-gray-200 dark:border-[#263330] px-3.5 sm:px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          {/* Title & Stats */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300 flex items-center justify-center font-bold">
                {calendarMode === 'month' && <CalendarIcon size={16} />}
                {calendarMode === 'week' && <CalendarRange size={16} />}
                {calendarMode === 'day' && <CalendarDays size={16} />}
              </div>
              <div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white capitalize flex items-center gap-2">
                  {calendarMode === 'month' && `${monthLabel} ${yearLabel}`}
                  {calendarMode === 'week' && weekData.weekRangeLabel}
                  {calendarMode === 'day' && dayData.formattedFullDate}
                </h2>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {calendarMode === 'month' &&
                    (isEn
                      ? `${currentMonthAssignmentsCount} assignment${currentMonthAssignmentsCount !== 1 ? 's' : ''} in ${monthLabel}`
                      : `${currentMonthAssignmentsCount} מטלות בחודש ${monthLabel}`)}
                  {calendarMode === 'week' &&
                    (isEn
                      ? `${weekData.assignmentsCount} assignment${weekData.assignmentsCount !== 1 ? 's' : ''} this week`
                      : `${weekData.assignmentsCount} מטלות בשבוע זה`)}
                  {calendarMode === 'day' &&
                    (isEn
                      ? `${dayData.dayAssignments.length} assignment${dayData.dayAssignments.length !== 1 ? 's' : ''} due today`
                      : `${dayData.dayAssignments.length} מטלות להגשה ביום זה`)}
                </p>
              </div>
            </div>
          </div>

          {/* View Switcher Dropdown & Navigation Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Streamlined View Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-[#263330] bg-white dark:bg-[#131c1a] hover:bg-gray-50 dark:hover:bg-[#1a2623] text-gray-700 dark:text-gray-200 transition-colors shadow-2xs cursor-pointer"
              >
                {calendarMode === 'month' && <CalendarIcon size={14} className="text-[#00857e]" />}
                {calendarMode === 'week' && <CalendarRange size={14} className="text-[#00857e]" />}
                {calendarMode === 'day' && <CalendarDays size={14} className="text-[#00857e]" />}
                <span>
                  {calendarMode === 'month' && t('calendar.monthView')}
                  {calendarMode === 'week' && t('calendar.weekView')}
                  {calendarMode === 'day' && t('calendar.dayView')}
                </span>
                <ChevronDown
                  size={13}
                  className={`transition-transform text-gray-400 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full mt-1.5 start-0 z-50 min-w-[135px] p-1 bg-white dark:bg-[#1a2623] border border-gray-200 dark:border-[#263330] rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setCalendarMode('day');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      calendarMode === 'day'
                        ? 'bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#22332f]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CalendarDays size={14} />
                      {t('calendar.dayView')}
                    </span>
                    {calendarMode === 'day' && (
                      <Check size={13} className="text-[#00857e] dark:text-teal-300" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCalendarMode('week');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      calendarMode === 'week'
                        ? 'bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#22332f]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CalendarRange size={14} />
                      {t('calendar.weekView')}
                    </span>
                    {calendarMode === 'week' && (
                      <Check size={13} className="text-[#00857e] dark:text-teal-300" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCalendarMode('month');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      calendarMode === 'month'
                        ? 'bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#22332f]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CalendarIcon size={14} />
                      {t('calendar.monthView')}
                    </span>
                    {calendarMode === 'month' && (
                      <Check size={13} className="text-[#00857e] dark:text-teal-300" />
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToday}
                className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-[#263330] bg-white dark:bg-[#131c1a] hover:bg-gray-50 dark:hover:bg-[#1a2623] text-gray-700 dark:text-gray-200 transition-colors shadow-2xs cursor-pointer"
              >
                {t('calendar.today')}
              </button>

              <div className="flex items-center gap-0.5 border border-gray-200 dark:border-[#263330] rounded-lg p-0.5 bg-white dark:bg-[#131c1a] shadow-2xs">
                <button
                  onClick={handlePrev}
                  title={isEn ? 'Previous' : 'הקודם'}
                  className="p-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1e2a27] transition-colors cursor-pointer"
                >
                  {isEn ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>
                <button
                  onClick={handleNext}
                  title={isEn ? 'Next' : 'הבא'}
                  className="p-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1e2a27] transition-colors cursor-pointer"
                >
                  {isEn ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
              </div>

              {/* Fullscreen / Full View Toggle Button */}
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                title={t('calendar.fullscreen')}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-[#263330] bg-white dark:bg-[#131c1a] hover:bg-gray-50 dark:hover:bg-[#1a2623] text-gray-700 dark:text-gray-200 transition-colors shadow-2xs cursor-pointer"
              >
                <Maximize2 size={14} className="text-[#00857e]" />
                <span className="hidden sm:inline">{t('calendar.fullscreen')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Standard Calendar Grid Body */}
        {renderCalendarBody(false)}

        {/* Course Color Legend */}
        {courseColorMap.size > 0 && (
          <div className="bg-white dark:bg-[#17211f] rounded-xl border border-gray-200 dark:border-[#263330] px-3.5 py-2 flex flex-wrap items-center gap-3 text-xs font-semibold shadow-xs">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1 text-xs">
              <BookOpen size={13} />
              {t('nav.courses')}:
            </span>
            {Array.from(courseColorMap.entries()).map(([course, color]) => (
              <span
                key={course}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] ${color.bg} ${color.border} ${color.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
                {course}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Clean Full View Modal: Calendar Body Only + Outside Click Handler */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto flex items-center justify-center animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsFullscreen(false);
            }
          }}
        >
          <div
            className="w-full max-w-5xl bg-white dark:bg-[#17211f] rounded-2xl border border-gray-200 dark:border-[#263330] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header: Clean Title, Simple Navigation, Close X button */}
            <div className="px-4 sm:px-6 py-3.5 border-b border-gray-200 dark:border-[#263330] flex items-center justify-between bg-gray-50/75 dark:bg-[#131c1a] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300 flex items-center justify-center font-bold">
                  {calendarMode === 'month' && <CalendarIcon size={16} />}
                  {calendarMode === 'week' && <CalendarRange size={16} />}
                  {calendarMode === 'day' && <CalendarDays size={16} />}
                </div>
                <div>
                  <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white capitalize">
                    {calendarMode === 'month' && `${monthLabel} ${yearLabel}`}
                    {calendarMode === 'week' && weekData.weekRangeLabel}
                    {calendarMode === 'day' && dayData.formattedFullDate}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToday}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-gray-200 dark:border-[#263330] bg-white dark:bg-[#131c1a] hover:bg-gray-50 dark:hover:bg-[#1a2623] text-gray-700 dark:text-gray-200 transition-colors shadow-2xs cursor-pointer"
                >
                  {t('calendar.today')}
                </button>

                <div className="flex items-center gap-0.5 border border-gray-200 dark:border-[#263330] rounded-lg p-0.5 bg-white dark:bg-[#131c1a] shadow-2xs">
                  <button
                    onClick={handlePrev}
                    title={isEn ? 'Previous' : 'הקודם'}
                    className="p-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1e2a27] transition-colors cursor-pointer"
                  >
                    {isEn ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <button
                    onClick={handleNext}
                    title={isEn ? 'Next' : 'הבא'}
                    className="p-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1e2a27] transition-colors cursor-pointer"
                  >
                    {isEn ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1f2d29] transition-colors cursor-pointer ms-1"
                  title={t('common.close') || 'Close'}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body: ONLY the calendar body itself */}
            <div className="p-3 sm:p-5 overflow-y-auto flex-1 flex flex-col">
              {renderCalendarBody(true)}
            </div>
          </div>
        </div>
      )}

      {/* Assignment Day Inspection Modal */}
      <AssignmentCalendarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDay}
        assignments={selectedDayAssignments}
      />
    </>
  );
}
