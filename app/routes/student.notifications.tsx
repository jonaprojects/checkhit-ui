import type { Route } from "./+types/student.notifications";
import MainLayout from "~/components/MainLayout";
import { Bell, Check, BookOpen, Scale, CheckCircle2, AlertCircle, Info, Inbox } from "lucide-react";
import { useState } from "react";
import { NotificationItem } from "~/components/ui/NotificationItem";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "התראות - פורטל סטודנטים | CheckHit" },
  ];
}

const mockNotificationsData = [
  { id: 1, titleKey: 'notifications.studentMock1Title', descKey: 'notifications.studentMock1Desc', timeKey: 'notifications.studentMock1Time', unread: true, type: 'success' as const },
  { id: 2, titleKey: 'notifications.studentMock2Title', descKey: 'notifications.studentMock2Desc', timeKey: 'notifications.studentMock2Time', unread: true, type: 'appeal' as const },
  { id: 3, titleKey: 'notifications.studentMock3Title', descKey: 'notifications.studentMock3Desc', timeKey: 'notifications.studentMock3Time', unread: false, type: 'assignment' as const },
  { id: 4, titleKey: 'notifications.studentMock4Title', descKey: 'notifications.studentMock4Desc', timeKey: 'notifications.studentMock4Time', unread: false, type: 'warning' as const },
  { id: 5, titleKey: 'notifications.studentMock5Title', descKey: 'notifications.studentMock5Desc', time: '15/05/2026', unread: false, type: 'info' as const },
  { id: 6, titleKey: 'notifications.studentMock6Title', descKey: 'notifications.studentMock6Desc', time: '14/05/2026', unread: false, type: 'system' as const }
];

export default function StudentNotifications() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(mockNotificationsData);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <MainLayout portalName={t('nav.studentPortal')} view="student">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12 min-h-[101vh]">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <Bell className="text-[#00857e]" size={32} />
              {t('notifications.title')}
            </h1>
            <p className="text-gray-500 mt-2 text-lg">{t('notifications.studentSubtitle')}</p>
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-colors font-medium text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <Check size={18} />
              {t('notifications.markAllRead')}
            </button>
          )}
        </header>

        <div className="space-y-4">
          {notifications.map((notif) => {
            return (
              <NotificationItem
                key={notif.id}
                id={notif.id}
                title={t(notif.titleKey)}
                desc={t(notif.descKey)}
                time={notif.timeKey ? t(notif.timeKey) : (notif.time ?? '')}
                unread={notif.unread}
                type={notif.type}
                variant="full"
                onClick={() => notif.unread && markAsRead(notif.id)}
              />
            );
          })}
          
          {notifications.length === 0 && (
             <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-xl border border-gray-200">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                 <Bell size={32} />
               </div>
               <h3 className="text-xl font-bold text-gray-800 mb-2">{t('notifications.emptyTitle')}</h3>
               <p className="text-gray-500 max-w-sm">
                 {t('notifications.emptyDesc')}
               </p>
             </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
