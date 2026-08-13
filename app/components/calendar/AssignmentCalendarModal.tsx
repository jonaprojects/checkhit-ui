import React, { useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, BookOpen, ChevronLeft, ChevronRight, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { StatusBadge } from '../ui/StatusBadge';
import type { ProcessedStudentAssignment } from '../../hooks/useStudentAssignments';

export interface AssignmentCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  assignments: ProcessedStudentAssignment[];
}

export function AssignmentCalendarModal({
  isOpen,
  onClose,
  selectedDate,
  assignments,
}: AssignmentCalendarModalProps) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !selectedDate) return null;

  const formattedDateTitle = new Intl.DateTimeFormat(isEn ? 'en-US' : 'he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(selectedDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#17211f] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#263330] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-[#131c1a]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300 flex items-center justify-center">
              <CalendarIcon size={18} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">
                {formattedDateTitle}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {assignments.length > 0
                  ? isEn
                    ? `${assignments.length} assignment${assignments.length > 1 ? 's' : ''} due`
                    : `${assignments.length} מטלות להגשה`
                  : t('calendar.noAssignmentsOnDay')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Assignments List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {assignments.length === 0 ? (
            <div className="py-10 text-center text-gray-400 dark:text-gray-500 text-sm">
              <CalendarIcon size={32} className="mx-auto mb-2 opacity-40" />
              {t('calendar.noAssignmentsOnDay')}
            </div>
          ) : (
            assignments.map((assignment) => {
              const dueTime = assignment.dueAt
                ? new Date(assignment.dueAt).toLocaleTimeString(isEn ? 'en-US' : 'he-IL', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : null;

              return (
                <div
                  key={assignment.id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-[#263330] bg-white dark:bg-[#131c1a] hover:border-teal-300 dark:hover:border-teal-700/60 transition-all shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm hover:text-[#00857e] transition-colors">
                        <Link to={`/student/assignments/${assignment.id}`} onClick={onClose}>
                          {assignment.name}
                        </Link>
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1 font-medium">
                          <BookOpen size={13} className="text-teal-600 dark:text-teal-400" />
                          {assignment.courseName || '-'}
                        </span>
                        {dueTime && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock size={13} />
                              {dueTime}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <StatusBadge type="assignment" status={assignment.uiStatus} rounded="md" />
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {assignment.grade !== undefined && assignment.grade !== null ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {isEn ? `Grade: ${assignment.grade}` : `ציון: ${assignment.grade}`}
                        </span>
                      ) : assignment.isOverdue ? (
                        <span className="text-red-500 font-medium">
                          {isEn ? 'Past Due' : 'מועד ההגשה עבר'}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          {assignment.formattedDueDate}
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/student/assignments/${assignment.id}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#00857e] dark:text-teal-300 hover:underline"
                    >
                      <span>{t('calendar.openAssignment')}</span>
                      {isEn ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50/50 dark:bg-[#111917] border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            {isEn ? 'Close' : 'סגור'}
          </button>
        </div>
      </div>
    </div>
  );
}
