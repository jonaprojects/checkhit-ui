import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface StudentAssignmentCardProps {
  title: string;
  course: string;
  dueDate: string;
  actionText: string;
  linkTo: string;
  statusBadge?: React.ReactNode;
  dueDateLabel?: string;
}

export function StudentAssignmentCard({
  title,
  course,
  dueDate,
  actionText,
  linkTo,
  statusBadge,
  dueDateLabel,
}: StudentAssignmentCardProps) {
  const { i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const label = dueDateLabel || (isEn ? 'Due by' : 'הגשה עד');

  return (
    <Link
      to={linkTo}
      className="flex items-center justify-between gap-4 sm:gap-8 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-[#263330] bg-white dark:bg-[#17211f] hover:border-teal-200 dark:hover:border-teal-700/50 hover:shadow-sm transition-all group"
    >
      <div className="text-start flex-1 min-w-0 pe-2 sm:pe-4">
        <div className="flex flex-col sm:flex-row sm:items-center items-start gap-2 sm:gap-3 mb-1">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base sm:text-lg group-hover:text-[#00857e] dark:group-hover:text-teal-300 transition-colors truncate max-w-full text-start">
            {title}
          </h3>
          {statusBadge}
        </div>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium truncate text-start">
          {course}
        </p>
      </div>
      <div className="text-end flex items-center gap-4 sm:gap-6 shrink-0">
        <div className="hidden sm:block">
          <p className="text-xs text-gray-400 dark:text-gray-400 font-bold mb-0.5">{label}</p>
          <p className="font-black text-gray-900 dark:text-gray-100 text-sm">{dueDate}</p>
        </div>
        <span className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl font-bold text-sm group-hover:bg-[#00857e] dark:group-hover:bg-teal-600 group-hover:border-[#00857e] dark:group-hover:border-teal-600 group-hover:text-white transition-colors flex items-center gap-2">
          {actionText}{' '}
          <ArrowLeft size={16} className={isEn ? 'rotate-180' : ''} />
        </span>
      </div>
    </Link>
  );
}
