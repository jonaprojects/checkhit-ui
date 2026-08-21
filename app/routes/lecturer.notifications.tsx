import type { Route } from "./+types/lecturer.notifications";
import MainLayout from "~/components/MainLayout";
import { Bell, Check, AlertCircle, RefreshCw } from "lucide-react";
import { NotificationItem } from "~/components/ui/NotificationItem";
import { NotificationListSkeleton } from "~/components/ui/Skeleton";
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from "~/hooks/useNotifications";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { getLtiUserId } from "~/lib/lti-session";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Notifications - Lecturer Portal | CheckHit" },
    { name: "description", content: "Lecturer Notifications" },
  ];
}

export default function LecturerNotifications() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const navigate = useNavigate();
  const lecturerId = getLtiUserId(import.meta.env.VITE_LECTURER_ID);

  const { data: notifications = [], isLoading, isError, error, refetch, isFetching } = useNotifications(
    lecturerId,
    undefined,
    isEn
  );

  const markAsReadMutation = useMarkNotificationAsRead(lecturerId);
  const markAllAsReadMutation = useMarkAllNotificationsAsRead(lecturerId);

  const handleNotificationClick = (notifId: string, isRead: boolean, link?: string | null) => {
    if (!isRead) {
      markAsReadMutation.mutate(notifId);
    }
    if (link) {
      navigate(link);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <MainLayout portalName={isEn ? "Lecturer Portal" : "פורטל מרצים"} view="lecturer">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12 min-h-[101vh]">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <Bell className="text-[#00857e]" size={32} />
              {t('notifications.title')}
            </h1>
            <p className="text-gray-500 mt-2 text-lg">{t('notifications.lecturerSubtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              title="Refresh"
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
            >
              <RefreshCw size={18} className={isFetching ? 'animate-spin text-teal-600' : ''} />
            </button>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-colors font-medium text-sm disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <Check size={18} />
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>
        </header>

        {/* Shimmer Loading Skeleton */}
        {isLoading && <NotificationListSkeleton count={4} />}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="rounded-2xl border border-red-200 bg-red-50/70 p-8 text-center max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <AlertCircle size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900">Failed to load notifications</h3>
              <p className="text-sm text-red-700 mt-1 max-w-md mx-auto">
                {error instanceof Error ? error.message : 'An error occurred while fetching notifications.'}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw size={16} />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        {!isLoading && !isError && (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                id={notif.id}
                title={notif.title}
                desc={notif.body}
                time={notif.formattedTime}
                unread={!notif.isRead}
                type={notif.uiType}
                variant="full"
                onClick={() => handleNotificationClick(notif.id, notif.isRead, notif.link)}
              />
            ))}
            
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
        )}
      </div>
    </MainLayout>
  );
}
