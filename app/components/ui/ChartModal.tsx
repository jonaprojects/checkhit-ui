import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}

export function ChartModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  headerActions,
  children,
}: ChartModalProps) {
  const { t } = useTranslation();

  // Handle ESC key and scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content Card */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#17211f] rounded-2xl border border-gray-200 dark:border-[#263330] shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 flex flex-col my-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-[#131c1a]">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300 shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white truncate">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
            {headerActions}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors cursor-pointer"
              title={t('lecturerDashboard.closeExpanded', 'Close Full View')}
              aria-label={t('lecturerDashboard.closeExpanded', 'Close Full View')}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[82vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
