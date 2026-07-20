import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export type StatusType = 'assignment' | 'appeal';
export type AssignmentStatus = 'pending' | 'checking' | 'checked' | 'appeal';
export type AppealStatus = 'pending' | 'accepted' | 'rejected' | 'resolved';

interface StatusConfig {
  label: string;
  color: string;
  icon: React.ElementType;
}

export const assignmentStatusConfig: Record<AssignmentStatus, StatusConfig> = {
  'pending': { label: 'טרם הוגש', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', icon: Clock },
  'checking': { label: 'בבדיקת AI', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400', icon: Clock },
  'checked': { label: 'נבדק', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400', icon: CheckCircle2 },
  'appeal': { label: 'בערעור', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400', icon: AlertCircle },
};

export const appealStatusConfig: Record<AppealStatus, StatusConfig> = {
  'pending': { label: 'בבדיקה', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400', icon: Clock },
  'accepted': { label: 'התקבל', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400', icon: CheckCircle2 },
  'rejected': { label: 'נדחה', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400', icon: AlertCircle },
  'resolved': { label: 'טופל', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400', icon: CheckCircle2 },
};

interface StatusBadgeProps {
  type: StatusType;
  status: string;
  className?: string;
  rounded?: 'full' | 'md';
}

export function StatusBadge({ type, status, className = '', rounded = 'full' }: StatusBadgeProps) {
  let config: StatusConfig | undefined;
  
  if (type === 'assignment') {
    config = assignmentStatusConfig[status as AssignmentStatus];
  } else if (type === 'appeal') {
    config = appealStatusConfig[status as AppealStatus];
  }

  // Fallback if status is unknown
  if (!config) {
    return null;
  }

  const { label, color, icon: Icon } = config;
  const roundedClass = rounded === 'full' ? 'rounded-full' : 'rounded-md';

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${roundedClass} text-xs font-bold whitespace-nowrap shrink-0 ${color} ${className}`}>
      <Icon size={14} />
      {label}
    </span>
  );
}
