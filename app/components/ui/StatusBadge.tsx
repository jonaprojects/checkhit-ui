import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type StatusType = 'assignment' | 'appeal';
export type AssignmentStatus = 'pending' | 'checking' | 'checked' | 'appeal';
export type AppealStatus = 'pending' | 'accepted' | 'rejected' | 'resolved';

interface StatusConfig {
  label: string;
  color: string;
  icon: React.ElementType;
}

export const assignmentStatusConfig: Record<AssignmentStatus, Omit<StatusConfig, 'label'>> = {
  'pending': { color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', icon: Clock },
  'checking': { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400', icon: Clock },
  'checked': { color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400', icon: CheckCircle2 },
  'appeal': { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400', icon: AlertCircle },
};

export const appealStatusConfig: Record<AppealStatus, Omit<StatusConfig, 'label'>> = {
  'pending': { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400', icon: Clock },
  'accepted': { color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400', icon: CheckCircle2 },
  'rejected': { color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400', icon: AlertCircle },
  'resolved': { color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400', icon: CheckCircle2 },
};

interface StatusBadgeProps {
  type: StatusType;
  status: string;
  className?: string;
  rounded?: 'full' | 'md';
}

export function StatusBadge({ type, status, className = '', rounded = 'full' }: StatusBadgeProps) {
  const { t } = useTranslation();
  let config: Omit<StatusConfig, 'label'> | undefined;
  let label = '';
  
  if (type === 'assignment') {
    config = assignmentStatusConfig[status as AssignmentStatus];
    label = t(`status.assignment.${status}`);
  } else if (type === 'appeal') {
    config = appealStatusConfig[status as AppealStatus];
    label = t(`status.appeal.${status}`);
  }

  // Fallback if status is unknown
  if (!config) {
    return null;
  }

  const { color, icon: Icon } = config;
  const roundedClass = rounded === 'full' ? 'rounded-full' : 'rounded-md';

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${roundedClass} text-xs font-bold whitespace-nowrap shrink-0 ${color} ${className}`}>
      <Icon size={14} className="shrink-0" />
      <span>{label}</span>
    </span>
  );
}
