import React from 'react';
import { Link } from 'react-router';
import { AlertTriangle, Scale, Bot, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RequiresAttentionStripSkeleton } from './ui/Skeleton';
import type { RequiresAttentionItem } from '../lib/api/types';

export interface AttentionItem {
  id?: string;
  type?: 'appeal' | 'ai-grading' | 'deadline' | string;
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  actionText: string;
  actionHref: string;
  accentColor?: 'rose' | 'teal' | 'amber' | 'indigo' | string;
}

export interface RequiresAttentionStripProps {
  className?: string;
  items?: AttentionItem[] | RequiresAttentionItem[];
  isLoading?: boolean;
}

export function RequiresAttentionStrip({ className = '', items, isLoading }: RequiresAttentionStripProps) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  if (isLoading) {
    return <RequiresAttentionStripSkeleton />;
  }

  // Default items if none provided
  const defaultItems: AttentionItem[] = [
    {
      id: 'appeals',
      type: 'appeal',
      title: t('lecturerDashboard.requiresAttention.pendingAppealsUrgent', { count: 3 }),
      subtitle: `CS101 · ${isEn ? 'Binary Trees & Recursion' : 'עצים בינאריים ורקורסיה'}`,
      actionText: t('lecturerDashboard.requiresAttention.resolveNow'),
      actionHref: '/lecturer/appeals',
      accentColor: 'rose',
    },
    {
      id: 'ai-grading',
      type: 'ai-grading',
      title: t('lecturerDashboard.requiresAttention.aiReadyToPublish', { count: 85 }),
      subtitle: `CS303 · ${isEn ? 'Lab 1 OOP Design' : 'תרגיל מעבדה 1 תכנות מונחה עצמים'}`,
      actionText: t('lecturerDashboard.requiresAttention.publishGrades'),
      actionHref: '/lecturer/courses',
      accentColor: 'teal',
    },
    {
      id: 'deadline',
      type: 'deadline',
      title: t('lecturerDashboard.requiresAttention.upcomingDeadline', {
        title: isEn ? 'HW2 - BST' : 'תרגיל 2 - עצי חיפוש',
        hours: 12,
        count: 18,
      }),
      subtitle: `CS101 · ${isEn ? 'Due tonight at 23:59' : 'מועד הגשה הלילה ב-23:59'}`,
      actionText: t('lecturerDashboard.requiresAttention.sendReminder'),
      actionHref: '/lecturer/messages',
      accentColor: 'amber',
    },
  ];

  const displayItems = items !== undefined ? items : defaultItems;

  const getAccentStyles = (accent: string = 'amber', type?: string) => {
    // If type is specified, match corresponding icon
    let defaultIcon = <Clock size={16} />;
    if (type === 'appeal') defaultIcon = <Scale size={16} />;
    if (type === 'ai-grading') defaultIcon = <Bot size={16} />;

    switch (accent) {
      case 'rose':
        return {
          cardBg: 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/60',
          iconBg: 'bg-rose-100 dark:bg-rose-900/80 text-rose-700 dark:text-rose-300',
          actionText: 'text-rose-700 dark:text-rose-300',
          icon: defaultIcon,
        };
      case 'teal':
        return {
          cardBg: 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-100 dark:border-teal-900/60',
          iconBg: 'bg-teal-100 dark:bg-teal-900/80 text-[#00857e] dark:text-teal-300',
          actionText: 'text-[#00857e] dark:text-teal-300',
          icon: defaultIcon,
        };
      case 'amber':
      default:
        return {
          cardBg: 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/60',
          iconBg: 'bg-amber-100 dark:bg-amber-900/80 text-amber-700 dark:text-amber-300',
          actionText: 'text-amber-700 dark:text-amber-300',
          icon: defaultIcon,
        };
    }
  };

  return (
    <div className={`bg-white dark:bg-[#17211f] rounded-2xl border border-amber-200/70 dark:border-amber-900/50 p-6 shadow-xs relative overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-100/70 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white">
              {t('lecturerDashboard.requiresAttention.title')}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('lecturerDashboard.requiresAttention.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Triage Cards Grid */}
      {displayItems.length === 0 ? (
        <div className="p-6 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
            {isEn ? 'All caught up! No urgent tasks currently require your attention.' : 'הכל מעודכן! אין משימות דחופות הדורשות את תשומת לבך כרגע.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayItems.map((item, idx) => {
            const styles = getAccentStyles(item.accentColor || 'amber', item.type);
            return (
              <div
                key={item.id || idx}
                className={`p-4 rounded-xl border flex flex-col justify-between hover:shadow-xs transition-shadow ${styles.cardBg}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${styles.iconBg}`}>
                    {'icon' in item && item.icon ? item.icon : styles.icon}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <Link
                  to={item.actionHref}
                  className={`self-end inline-flex items-center gap-1 text-xs font-black hover:underline mt-2 ${styles.actionText}`}
                >
                  <span>{item.actionText}</span>
                  <ChevronRight size={14} className={isEn ? '' : 'rotate-180'} />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
