import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
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
  FileWarning,
  Mail
} from 'lucide-react';
import { NotificationItem } from './ui/NotificationItem';
import { UserAvatar } from './ui/UserAvatar';
import { ProfileDropdown } from './ui/ProfileDropdown';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from './ui/LanguageToggle';
import { 
  useNotifications, 
  useUnreadNotificationCount, 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead 
} from '../hooks/useNotifications';
import { useUnreadMessageCount } from '../hooks/useMessages';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { getLtiUserId } from '../lib/lti-session';
import { AccountContextError } from './AccountContextError';

export default function MainLayout({
  children,
  portalName = "פורטל סטודנטים",
  view,
  documentScroll = false,
}: any) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isEn = i18n.language.startsWith('en');

  const userId = getLtiUserId(
    view === 'lecturer'
      ? import.meta.env.VITE_LECTURER_ID
      : import.meta.env.VITE_STUDENT_ID
  );
  const { data: currentUser } = useCurrentUser(view);

  // Live Notifications via TanStack Query
  const { data: notifications = [], isError: isNotificationsError } = useNotifications(userId, { limit: 5 }, isEn);
  const { data: unreadCount = 0 } = useUnreadNotificationCount(userId);
  const { data: unreadMessagesCount = 0 } = useUnreadMessageCount(userId);
  const markAsReadMutation = useMarkNotificationAsRead(userId);
  const markAllAsReadMutation = useMarkAllNotificationsAsRead(userId);

  // Click outside to close notifications & profile dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!documentScroll || window.parent === window) return;

    let animationFrame = 0;
    const requestParentResize = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const height = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
        );
        window.parent.postMessage(
          JSON.stringify({ subject: 'lti.frameResize', height: height + 24 }),
          '*',
        );
      });
    };

    const resizeObserver = new ResizeObserver(requestParentResize);
    resizeObserver.observe(document.body);
    window.addEventListener('resize', requestParentResize);
    requestParentResize();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener('resize', requestParentResize);
    };
  }, [documentScroll]);

  const handleNotificationClick = (notifId: string, isRead: boolean, link?: string | null) => {
    if (!isRead) {
      markAsReadMutation.mutate(notifId);
    }
    setIsNotificationsOpen(false);
    if (link) {
      navigate(link);
    }
  };

  const handleMarkAllRead = () => {
    markAllAsReadMutation.mutate();
  };

  const NavItem = ({ to, icon: Icon, label, badge }: { to: string; icon: any; label: string; badge?: number }) => {
    const isActive = currentPath === to || (to !== '/lecturer' && to !== '/student' && currentPath.startsWith(to));
    return (
      <Link 
        to={to} 
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors border-s-4 ${
          isActive 
            ? 'bg-teal-50 text-[#00857e] font-bold border-[#00857e]' 
            : 'text-gray-600 hover:bg-gray-50 border-transparent hover:border-gray-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={20} />
          <span>{label}</span>
        </div>
        {Boolean(badge && badge > 0) && (
          <span className="min-w-[18px] h-[18px] px-1.5 bg-[#00857e] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
            {badge! > 99 ? '99+' : badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className={`${documentScroll ? 'min-h-screen overflow-visible' : 'h-screen overflow-hidden'} bg-gray-50 flex text-gray-800 font-sans text-start`}>
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
              <NavItem to="/lecturer/messages" icon={Mail} label={t('nav.messages')} badge={unreadMessagesCount} />
            </>
          ) : (
            <>
              <NavItem to="/student" icon={LayoutDashboard} label={t('nav.dashboard')} />
              <NavItem to="/student/courses" icon={GraduationCap} label={t('nav.myCourses')} />
              <NavItem to="/student/assignments" icon={FileText} label={t('nav.assignments')} />
              <NavItem to="/student/appeals" icon={FileWarning} label={t('nav.appeals')} />
              <NavItem to="/student/messages" icon={Mail} label={t('nav.messages')} badge={unreadMessagesCount} />
            </>
          )}

          <NavItem to={view === 'lecturer' ? '/lecturer/notifications' : '/student/notifications'} icon={Bell} label={t('nav.notifications')} badge={unreadCount} />
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
      <div className={`flex-1 flex flex-col ${documentScroll ? 'min-h-screen' : 'h-full overflow-hidden'}`}>
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
               {unreadMessagesCount > 0 && (
                 <span className="absolute top-0 start-[-8px] w-2 h-2 bg-[#00857e] rounded-full"></span>
               )}
             </Link>
          </div>

          <div className="flex items-center gap-4 lg:gap-6 ms-auto">
            <div className="flex items-center gap-3 px-4 border-s border-gray-200">
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    if (isProfileOpen) setIsProfileOpen(false);
                  }}
                  className={`cursor-pointer text-gray-500 hover:text-gray-800 transition-colors relative p-2 rounded-xl flex items-center justify-center ${isNotificationsOpen ? 'bg-gray-100 text-gray-900' : ''}`}
                >
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 end-1 min-w-[18px] h-[18px] px-1 bg-[#E8B43F] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-xs">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="fixed inset-x-4 top-20 mt-2 md:absolute md:inset-x-auto md:top-full md:end-0 md:mt-3 w-auto md:w-84 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                      <h3 className="font-bold text-gray-900 text-sm">{t('notifications.title')}</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllRead}
                          disabled={markAllAsReadMutation.isPending}
                          className="text-xs text-[#00857e] hover:underline font-medium cursor-pointer"
                        >
                          {t('notifications.markAllRead')}
                        </button>
                      )}
                    </div>
                    <div className="max-h-[350px] overflow-y-auto divide-y divide-gray-50">
                      {!userId ? (
                        <AccountContextError view={view} compact />
                      ) : isNotificationsError ? (
                        <div role="alert" className="py-8 px-4 text-center text-sm text-red-600 bg-red-50/60">
                          {t('notifications.errorDesc')}
                        </div>
                      ) : (
                        <>
                          {notifications.map((notif) => (
                            <NotificationItem
                              key={notif.id}
                              id={notif.id}
                              title={notif.title}
                              desc={notif.body}
                              time={notif.formattedTime}
                              unread={!notif.isRead}
                              type={notif.uiType}
                              variant="compact"
                              onClick={() => handleNotificationClick(notif.id, notif.isRead, notif.link)}
                            />
                          ))}
                          {notifications.length === 0 && (
                        <div className="py-8 text-center text-sm text-gray-500">
                          {t('notifications.emptyDesc')}
                        </div>
                          )}
                        </>
                      )}
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
            <div className="relative ms-2" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  if (isNotificationsOpen) setIsNotificationsOpen(false);
                }}
                className={`p-0.5 rounded-full transition-all cursor-pointer focus:outline-none ${
                  isProfileOpen ? 'ring-2 ring-[#00857e] ring-offset-2 dark:ring-offset-[#17211f]' : 'hover:opacity-90'
                }`}
                aria-expanded={isProfileOpen}
                aria-label={t('profileMenu.settings')}
              >
                <UserAvatar 
                  name={currentUser?.name?.trim() || ''}
                  className="transition-transform" 
                />
              </button>

              <ProfileDropdown
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                view={view}
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={`flex-1 overflow-x-hidden p-4 lg:p-8 ${documentScroll ? 'overflow-y-visible' : 'overflow-y-auto'}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
