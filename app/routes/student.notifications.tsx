import type { Route } from "./+types/student.notifications";
import MainLayout from "~/components/MainLayout";
import { Bell, CheckCircle2, Clock, Info, Check } from "lucide-react";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "התראות | Check Hit" },
    { name: "description", content: "התראות סטודנט" },
  ];
}

const mockNotifications = [
  { id: 1, title: 'תזכורת הגשה', desc: 'מטלה 3 במבוא למדעי המחשב מסתיימת בעוד 12 שעות!', time: 'לפני שעה', unread: true, type: 'warning' },
  { id: 2, title: 'ציון חדש', desc: 'הציון ומשוב ה-AI למטלה 2 "מיון מהיר" זמינים כעת (ציון: 95)', time: 'לפני 3 שעות', unread: true, type: 'success' },
  { id: 3, title: 'עדכון קורס', desc: 'חומר עזר חדש הועלה למערכת על ידי ד"ר לוי', time: 'לפני יום', unread: false, type: 'info' },
  { id: 4, title: 'תשובה לערעור', desc: 'התקבלה תשובה מהמרצה על הערעור שהגשת במטלה 1', time: 'לפני יומיים', unread: false, type: 'info' },
];

const typeConfig: Record<string, { icon: any, color: string, bg: string }> = {
  warning: { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-100' },
  success: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-100' },
};

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <MainLayout portalName="פורטל סטודנטים" view="student">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12 min-h-[101vh]">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <Bell className="text-[#00857e]" size={32} />
              התראות
            </h1>
            <p className="text-gray-500 mt-2 text-lg">כל העדכונים וההודעות עבורך במערכת</p>
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-colors font-medium text-sm"
            >
              <Check size={18} />
              סמן הכל כנקרא
            </button>
          )}
        </header>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="divide-y divide-gray-100">
          {notifications.map((notif) => {
            const config = typeConfig[notif.type] || typeConfig.info;
            const Icon = config.icon;

            return (
              <div 
                key={notif.id} 
                onClick={() => notif.unread && markAsRead(notif.id)}
                className={`flex items-center gap-4 px-6 py-4 transition-colors cursor-pointer group relative
                  ${notif.unread ? 'bg-teal-50/10' : 'hover:bg-gray-50/80'}
                `}
              >
                {notif.unread && (
                  <span className="absolute top-1/2 -translate-y-1/2 start-2 w-2 h-2 bg-[#00857e] rounded-full"></span>
                )}
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.bg} ${config.color}`}>
                  <Icon size={20} />
                </div>
                
                <div className="flex-1 text-start flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex-1">
                    <h3 className={`text-base ${notif.unread ? 'font-extrabold text-gray-900' : 'font-bold text-gray-700'}`}>
                      {notif.title}
                    </h3>
                    <p className={`text-sm mt-0.5 ${notif.unread ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                      {notif.desc}
                    </p>
                  </div>
                  <span className="text-sm text-gray-400 whitespace-nowrap shrink-0 sm:ms-auto font-medium">{notif.time}</span>
                </div>
              </div>
            );
          })}
          </div>
          
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
