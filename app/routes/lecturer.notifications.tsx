import type { Route } from "./+types/lecturer.notifications";
import MainLayout from "~/components/MainLayout";
import { Bell, Check } from "lucide-react";
import { useState } from "react";
import { NotificationItem } from "~/components/ui/NotificationItem";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "התראות | Check Hit" },
    { name: "description", content: "התראות מרצה" },
  ];
}

const mockNotifications = [
  { id: 1, title: 'מטלות ממתינות לבדיקה', desc: 'יש לך 15 מטלות להעריך בקורס "עיצוב ממשקים" תרגיל 2', time: 'לפני שעתיים', unread: true, type: 'assignment' },
  { id: 2, title: 'ערעור חדש', desc: 'יוסי כהן הגיש ערעור על הציון במטלה 2 במבוא למדעי המחשב', time: 'לפני 4 שעות', unread: true, type: 'warning' },
  { id: 3, title: 'תזכורת מערכת', desc: 'הזנת ציונים לקורס "מבוא למדעי המחשב" נסגרת מחר ב-23:59', time: 'אתמול', unread: false, type: 'warning' },
  { id: 4, title: 'הגשה מאוחרת', desc: 'דנה ישראלי הגישה את המטלה באיחור של יומיים באישור רפואי', time: 'לפני 3 ימים', unread: false, type: 'info' },
];

export default function LecturerNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <MainLayout portalName="פורטל מרצים" view="lecturer">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12 min-h-[101vh]">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <Bell className="text-[#00857e]" size={32} />
              התראות
            </h1>
            <p className="text-gray-500 mt-2 text-lg">כל העדכונים וההודעות במערכת</p>
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-colors font-medium text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <Check size={18} />
              סמן הכל כנקרא
            </button>
          )}
        </header>

        <div className="space-y-4">
          {notifications.map((notif) => {
            return (
              <NotificationItem
                key={notif.id}
                id={notif.id}
                title={notif.title}
                desc={notif.desc}
                time={notif.time}
                unread={notif.unread}
                type={notif.type as any}
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
               <h3 className="text-xl font-bold text-gray-800 mb-2">אין התראות חדשות</h3>
               <p className="text-gray-500 max-w-sm">
                 כרגע אין לך הודעות או עדכונים שממתינים לך.
               </p>
             </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
