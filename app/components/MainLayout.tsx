import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { 
  Menu, 
  LayoutDashboard, 
  GraduationCap, 
  FileText, 
  Settings, 
  LifeBuoy, 
  LogOut,
  Bell,
  HelpCircle,
  Upload,
  Home,
  FileWarning
} from 'lucide-react';
import { NotificationItem } from './ui/NotificationItem';
import { UserAvatar } from './ui/UserAvatar';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from './ui/LanguageToggle';

export default function MainLayout({ children, portalName = "פורטל סטודנטים", view }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname;

  const isEn = i18n.language.startsWith('en');

  // Mock notifications based on view
  const notifications = view === 'lecturer' ? (isEn ? [
    { id: 1, title: 'Assignments pending grading', desc: 'You have 15 assignments to grade in the "Interface Design" course', time: '2 hours ago', unread: true, type: 'assignment' as const },
    { id: 2, title: 'New Appeal', desc: 'Yossi Cohen submitted an appeal for the grade in Assignment 2', time: '4 hours ago', unread: true, type: 'appeal' as const },
    { id: 3, title: 'System Reminder', desc: 'Grade entry for "Intro to Computer Science" closes tomorrow', time: 'Yesterday', unread: false, type: 'system' as const },
  ] : [
    { id: 1, title: 'מטלות ממתינות לבדיקה', desc: 'יש לך 15 מטלות להעריך בקורס "עיצוב ממשקים"', time: 'לפני שעתיים', unread: true, type: 'assignment' as const },
    { id: 2, title: 'ערעור חדש', desc: 'יוסי כהן הגיש ערעור על הציון במטלה 2', time: 'לפני 4 שעות', unread: true, type: 'appeal' as const },
    { id: 3, title: 'תזכורת מערכת', desc: 'הזנת ציונים לקורס "מבוא למדעי המחשב" נסגרת מחר', time: 'אתמול', unread: false, type: 'system' as const },
  ]) : (isEn ? [
    { id: 1, title: 'Submission Reminder', desc: 'Assignment 3 in Intro to Computer Science ends in 12 hours!', time: '1 hour ago', unread: true, type: 'assignment' as const },
    { id: 2, title: 'New Grade', desc: 'The grade and AI feedback for Assignment 2 are now available', time: '3 hours ago', unread: true, type: 'success' as const },
    { id: 3, title: 'Course Update', desc: 'New supplementary material has been uploaded to the system', time: '1 day ago', unread: false, type: 'system' as const },
  ] : [
    { id: 1, title: 'תזכורת הגשה', desc: 'מטלה 3 במבוא למדעי המחשב מסתיימת בעוד 12 שעות!', time: 'לפני שעה', unread: true, type: 'assignment' as const },
    { id: 2, title: 'ציון חדש', desc: 'הציון ומשוב ה-AI למטלה 2 זמינים כעת', time: 'לפני 3 שעות', unread: true, type: 'success' as const },
    { id: 3, title: 'עדכון קורס', desc: 'חומר עזר חדש הועלה למערכת', time: 'לפני יום', unread: false, type: 'system' as const },
  ]);

  // Click outside to close notifications
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const NavItem = ({ to, icon: Icon, label }: any) => {
    const isActive = currentPath === to || (to !== '/lecturer' && to !== '/student' && currentPath.startsWith(to));
    return (
      <Link 
        to={to} 
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors border-s-4 ${
          isActive 
            ? 'bg-teal-50 text-[#00857e] font-bold border-[#00857e]' 
            : 'text-gray-600 hover:bg-gray-50 border-transparent hover:border-gray-300'
        }`}
      >
        <Icon size={20} />
        {label}
      </Link>
    );
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex text-gray-800 font-sans text-start">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        key={i18n.language}
        className={`
        fixed lg:static inset-y-0 start-0 z-50 w-72 h-full bg-white shadow-xl lg:shadow-sm
        flex flex-col transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full lg:translate-x-0 rtl:lg:translate-x-0'}
        border-e border-gray-100 shrink-0
      `}>
        <div className="h-20 px-6 flex flex-col items-center justify-center border-b border-gray-100 shrink-0">
          <Link to="/" className="w-full flex justify-center">
            <img src="/logo.png" alt="Check Hit Logo" className="h-8 w-auto object-contain cursor-pointer transition-transform hover:scale-105 dark:hidden" />
            <img src="/logo-dark1.png" alt="Check Hit Logo" className="h-8 w-auto object-contain cursor-pointer transition-transform hover:scale-105 hidden dark:block" />
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {view === 'lecturer' ? (
            <>
              <NavItem to="/lecturer" icon={LayoutDashboard} label={t('nav.dashboard')} />
              <NavItem to="/lecturer/courses" icon={GraduationCap} label={t('nav.myCourses')} />
              <NavItem to="/lecturer/appeals" icon={FileWarning} label={t('nav.appeals')} />
            </>
          ) : (
            <>
              <NavItem to="/student" icon={LayoutDashboard} label={t('nav.dashboard')} />
              <NavItem to="/student/courses" icon={GraduationCap} label={t('nav.myCourses')} />
              <NavItem to="/student/assignments" icon={FileText} label={t('nav.assignments')} />
              <NavItem to="/student/appeals" icon={FileWarning} label={t('nav.appeals')} />
            </>
          )}

          <NavItem to={view === 'lecturer' ? '/lecturer/notifications' : '/student/notifications'} icon={Bell} label={t('nav.notifications')} />
          <NavItem to={view === 'lecturer' ? '/lecturer/settings' : '/student/settings'} icon={Settings} label={t('nav.settings')} />
          
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link to={`/${view}/help`} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-[#00857e] hover:bg-teal-50 transition-colors border border-gray-200 cursor-pointer">
            <LifeBuoy size={20} />
            {t('nav.support')}
          </Link>
          <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium">
            <LogOut size={20} />
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm h-20 flex items-center justify-between px-4 lg:px-8 z-30 relative">
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
              <Menu size={24} />
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-gray-600 font-medium">
             <Link to={view === 'lecturer' ? '/lecturer' : '/student'} className={!currentPath.includes('/messages') ? "text-[#00857e] font-bold border-b-2 border-[#00857e] pb-1" : "hover:text-gray-900 pb-1"}>{t('nav.home')}</Link>
             <Link to={view === 'lecturer' ? '/lecturer/messages' : '/student/messages'} className={currentPath.includes('/messages') ? "text-[#00857e] font-bold border-b-2 border-[#00857e] pb-1 relative" : "hover:text-gray-900 pb-1 relative"}>
               {t('nav.messages')}
               <span className="absolute top-0 start-[-8px] w-2 h-2 bg-red-500 rounded-full"></span>
             </Link>
          </div>

          <div className="flex items-center gap-4 lg:gap-6 ms-auto">

            <div className="flex items-center gap-3 px-4 border-s border-gray-200">
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className={`cursor-pointer text-gray-500 hover:text-gray-800 transition-colors relative p-1 rounded-md flex items-center justify-center ${isNotificationsOpen ? 'bg-gray-100 text-gray-900' : ''}`}
                >
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 start-0 w-4 h-4 bg-[#E8B43F] text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white translate-x-1 -translate-y-1">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="fixed inset-x-4 top-20 mt-2 md:absolute md:inset-x-auto md:top-full md:end-0 md:mt-3 w-auto md:w-80 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                      <h3 className="font-bold text-gray-900">{t('notifications.title')}</h3>
                      <button className="text-xs text-[#00857e] hover:underline font-medium">{t('notifications.markAllRead')}</button>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto">
                      {notifications.map((notif) => (
                        <NotificationItem
                          key={notif.id}
                          id={notif.id}
                          title={notif.title}
                          desc={notif.desc}
                          time={notif.time}
                          unread={notif.unread}
                          type={notif.type as any}
                          variant="compact"
                        />
                      ))}
                    </div>
                    <div className="border-t border-gray-100 p-2 bg-gray-50/50 text-center">
                      <Link 
                        to={view === 'lecturer' ? '/lecturer/notifications' : '/student/notifications'}
                        onClick={() => setIsNotificationsOpen(false)}
                        className="block text-sm text-gray-600 hover:text-gray-900 font-medium w-full py-1 text-center"
                      >
                        {t('notifications.viewAll')}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <Link to={view === 'lecturer' ? '/lecturer/help' : '/student/help'} className="text-gray-500 hover:text-gray-800 transition-colors cursor-pointer p-1 rounded-md flex items-center justify-center">
                <HelpCircle size={22} />
              </Link>
            </div>
            <LanguageToggle />
            <UserAvatar 
              name={view === 'lecturer' ? "דן פלג" : "יונתן ישראלי"}
              className="cursor-pointer transition ms-2" 
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
