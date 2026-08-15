import React from 'react';
import { Link } from 'react-router';
import { Settings, HelpCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UserAvatar } from './UserAvatar';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  view: 'student' | 'lecturer';
  className?: string;
}

export function ProfileDropdown({
  isOpen,
  onClose,
  view,
  className = '',
}: ProfileDropdownProps) {
  const { t } = useTranslation();
  const { data: currentUser } = useCurrentUser(view);
  const displayName = currentUser?.name?.trim() || '';
  const displayEmail = currentUser?.email?.trim() || '';

  if (!isOpen) return null;

  const handleReturnToMoodle = () => {
    onClose();
    // In production LTI environment, redirects to Moodle return URL or closes embedded tab
    window.location.href = "about:blank";
  };

  return (
    <div
      className={`fixed inset-x-4 top-20 mt-2 md:absolute md:inset-x-auto md:top-full md:end-0 md:mt-3 w-auto md:w-80 bg-white dark:bg-[#17211f] rounded-2xl border border-gray-200 dark:border-[#263330] shadow-2xl overflow-hidden z-50 origin-top-right animate-in fade-in zoom-in-95 duration-150 ${className}`}
    >
      {/* User Identity Header */}
      <div className="p-4 bg-gray-50/80 dark:bg-[#131d1b]/90 border-b border-gray-100 dark:border-[#263330]">
        <div className="flex items-center gap-3">
          <UserAvatar name={displayName} size="lg" className="ring-2 ring-[#00857e]/20 shrink-0" />
          <div className="min-w-0 flex-1">
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white truncate">
              {displayName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {displayEmail}
            </p>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60 text-[10px] font-bold px-2 py-0.5 rounded-md">
                {view === 'lecturer' ? t('profileMenu.lecturerRole') : t('profileMenu.studentRole')}
              </span>
              <span className="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck size={11} />
                <span>{t('profileMenu.syncedFromMoodle')}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Actions List */}
      <div className="p-2 space-y-1">
        <Link
          to={view === 'lecturer' ? '/lecturer/settings' : '/student/settings'}
          onClick={onClose}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-[#1f2c29] transition-colors cursor-pointer"
        >
          <Settings size={18} className="text-gray-400 dark:text-gray-500" />
          <span>{t('profileMenu.settings')}</span>
        </Link>

        <Link
          to={view === 'lecturer' ? '/lecturer/help' : '/student/help'}
          onClick={onClose}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-[#1f2c29] transition-colors cursor-pointer"
        >
          <HelpCircle size={18} className="text-gray-400 dark:text-gray-500" />
          <span>{t('profileMenu.help')}</span>
        </Link>
      </div>

      {/* Footer Section: LTI Session Exit */}
      <div className="p-2 border-t border-gray-100 dark:border-[#263330] bg-gray-50/50 dark:bg-[#131d1b]/50">
        <button
          onClick={handleReturnToMoodle}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/70 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
        >
          <span>{t('profileMenu.returnToMoodle')}</span>
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
}
