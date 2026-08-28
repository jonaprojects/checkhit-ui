import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AccountContextError({
  view,
  compact = false,
}: {
  view: 'student' | 'lecturer';
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const titleKey = view === 'student'
    ? 'accountContext.studentTitle'
    : 'accountContext.lecturerTitle';
  const descriptionKey = view === 'student'
    ? 'accountContext.studentDesc'
    : 'accountContext.lecturerDesc';

  if (compact) {
    return (
      <div role="alert" className="px-4 py-6 text-center text-red-700 bg-red-50/60">
        <AlertCircle className="w-7 h-7 mx-auto mb-2 text-red-500" />
        <p className="text-sm font-bold">{t(titleKey)}</p>
        <p className="text-xs mt-1 text-red-600">{t(descriptionKey)}</p>
      </div>
    );
  }

  return (
    <div role="alert" className="rounded-2xl border border-red-200 bg-red-50/70 p-8 text-center max-w-2xl mx-auto space-y-3 dark:border-red-900/60 dark:bg-red-950/30">
      <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto dark:bg-red-950 dark:text-red-300">
        <AlertCircle size={28} />
      </div>
      <h2 className="text-lg font-bold text-red-900 dark:text-red-200">{t(titleKey)}</h2>
      <p className="text-sm text-red-700 dark:text-red-300 max-w-lg mx-auto">{t(descriptionKey)}</p>
    </div>
  );
}
