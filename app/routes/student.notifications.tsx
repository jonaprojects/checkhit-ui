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

const mockNotificationsData = {
  he: [
    { id: 1, title: 'ציון חדש הוקלד', desc: 'הציון שלך במטלה 3 בקורס מבוא למדעי המחשב הוקלד.', time: 'לפני 10 דקות', unread: true, type: 'success' },
    { id: 2, title: 'הערעור התקבל', desc: 'הערעור שהגשת על שאלה 2 במטלה 1 התקבל. ציונך עודכן.', time: 'לפני שעתיים', unread: true, type: 'appeal' },
    { id: 3, title: 'מטלה חדשה', desc: 'פורסמה מטלה 4 בקורס תכנות מונחה עצמים.', time: 'אתמול, 14:30', unread: false, type: 'assignment' },
    { id: 4, title: 'חשד להעתקה', desc: 'נמצא דמיון חריג במטלה 2. נא לפנות למרצה הקורס לבירור.', time: 'לפני יומיים', unread: false, type: 'warning' },
    { id: 5, title: 'תזכורת: הגשת מטלה', desc: 'המטלה בקורס מסדי נתונים נסגרת להגשה מחר בחצות.', time: '15/05/2026', unread: false, type: 'info' },
    { id: 6, title: 'עדכון מערכת', desc: 'המערכת תרד לתחזוקה ביום שבת בין השעות 02:00 ל-04:00.', time: '14/05/2026', unread: false, type: 'system' }
  ],
  en: [
    { id: 1, title: 'New Grade Entered', desc: 'Your grade for Assignment 3 in Intro to Computer Science has been entered.', time: '10 mins ago', unread: true, type: 'success' },
    { id: 2, title: 'Appeal Accepted', desc: 'The appeal you submitted for question 2 in Assignment 1 has been accepted. Your grade was updated.', time: '2 hours ago', unread: true, type: 'appeal' },
    { id: 3, title: 'New Assignment', desc: 'Assignment 4 in Object Oriented Programming has been published.', time: 'Yesterday, 14:30', unread: false, type: 'assignment' },
    { id: 4, title: 'Suspected Plagiarism', desc: 'Anomalous similarity found in Assignment 2. Please contact the course lecturer for clarification.', time: '2 days ago', unread: false, type: 'warning' },
    { id: 5, title: 'Reminder: Assignment Submission', desc: 'The assignment in the Databases course closes for submission tomorrow at midnight.', time: '15/05/2026', unread: false, type: 'info' },
    { id: 6, title: 'System Update', desc: 'The system will go down for maintenance on Saturday between 02:00 and 04:00.', time: '14/05/2026', unread: false, type: 'system' }
  ]
};

export default function StudentNotifications() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const initialNotifications = isEn ? mockNotificationsData.en : mockNotificationsData.he;
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <MainLayout portalName={isEn ? "Student Portal" : "פורטל סטודנטים"} view="student">
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
