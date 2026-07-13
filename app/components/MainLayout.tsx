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

export default function MainLayout({ children, portalName = "פורטל סטודנטים", view }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const currentPath = location.pathname;

  // Mock notifications based on view
  const notifications = view === 'lecturer' ? [
    { id: 1, title: 'מטלות ממתינות לבדיקה', desc: 'יש לך 15 מטלות להעריך בקורס "עיצוב ממשקים"', time: 'לפני שעתיים', unread: true },
    { id: 2, title: 'ערעור חדש', desc: 'יוסי כהן הגיש ערעור על הציון במטלה 2', time: 'לפני 4 שעות', unread: true },
    { id: 3, title: 'תזכורת מערכת', desc: 'הזנת ציונים לקורס "מבוא למדעי המחשב" נסגרת מחר', time: 'אתמול', unread: false },
  ] : [
    { id: 1, title: 'תזכורת הגשה', desc: 'מטלה 3 במבוא למדעי המחשב מסתיימת בעוד 12 שעות!', time: 'לפני שעה', unread: true },
    { id: 2, title: 'ציון חדש', desc: 'הציון ומשוב ה-AI למטלה 2 זמינים כעת', time: 'לפני 3 שעות', unread: true },
    { id: 3, title: 'עדכון קורס', desc: 'חומר עזר חדש הועלה למערכת', time: 'לפני יום', unread: false },
  ];

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
      <aside className={`
        fixed lg:static inset-y-0 start-0 z-50 w-72 h-full bg-white shadow-xl lg:shadow-sm
        flex flex-col transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-[100%] lg:translate-x-0'}
        border-e border-gray-100 shrink-0
      `}>
        <div className="h-20 px-6 flex flex-col items-center justify-center border-b border-gray-100 shrink-0">
          <Link to="/" className="w-full flex justify-center">
            <img src="/logo.png" alt="Check Hit Logo" className="h-8 w-auto object-contain cursor-pointer transition-transform hover:scale-105" />
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {view === 'lecturer' ? (
            <>
              <NavItem to="/lecturer" icon={LayoutDashboard} label="לוח בקרה" />
              <NavItem to="/lecturer/courses" icon={GraduationCap} label="הקורסים שלי" />
              {/* Using a placeholder for appeals as there's no dedicated top-level route right now */}
              <NavItem to="/lecturer/appeals" icon={FileText} label="ערעורים" />
            </>
          ) : (
            <>
              <NavItem to="/student" icon={LayoutDashboard} label="לוח בקרה" />
              <NavItem to="/student/courses" icon={GraduationCap} label="הקורסים שלי" />
              <NavItem to="/student/assignments" icon={FileText} label="מטלות" />
              <NavItem to="/student/appeals" icon={FileWarning} label="ערעורים" />
            </>
          )}

          <NavItem to={view === 'lecturer' ? '/lecturer/notifications' : '/student/notifications'} icon={Bell} label="התראות" />
          <NavItem to={view === 'lecturer' ? '/lecturer/settings' : '/student/settings'} icon={Settings} label="הגדרות" />
          <NavItem to={view === 'lecturer' ? '/lecturer/help' : '/student/help'} icon={HelpCircle} label="עזרה ותמיכה" />
          
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-[#00857e] hover:bg-teal-50 transition-colors border border-gray-200">
            <LifeBuoy size={20} />
            תמיכה טכנית
          </button>
          <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium">
            <LogOut size={20} />
            התנתקות
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
             <Link to={view === 'lecturer' ? '/lecturer' : '/student'} className={!currentPath.includes('/messages') ? "text-[#00857e] font-bold border-b-2 border-[#00857e] pb-1" : "hover:text-gray-900 pb-1"}>ראשי</Link>
             <Link to={view === 'lecturer' ? '/lecturer/messages' : '/student/messages'} className={currentPath.includes('/messages') ? "text-[#00857e] font-bold border-b-2 border-[#00857e] pb-1 relative" : "hover:text-gray-900 pb-1 relative"}>
               הודעות
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
                  <div className="absolute top-full end-[-60px] md:end-0 mt-3 w-80 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                      <h3 className="font-bold text-gray-900">התראות מערכת</h3>
                      <button className="text-xs text-[#00857e] hover:underline font-medium">סמן הכל כנקרא</button>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto">
                      {notifications.map((notif) => (
                        <div key={notif.id} className={`p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors relative ${notif.unread ? 'bg-teal-50/30' : ''}`}>
                          {notif.unread && (
                            <span className="absolute top-5 start-2 w-2 h-2 bg-[#00857e] rounded-full"></span>
                          )}
                          <div className="ps-3">
                            <h4 className={`text-sm ${notif.unread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                              {notif.title}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{notif.desc}</p>
                            <span className="text-xs text-gray-400 mt-2 block">{notif.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 p-2 bg-gray-50/50 text-center">
                      <Link 
                        to={view === 'lecturer' ? '/lecturer/notifications' : '/student/notifications'}
                        onClick={() => setIsNotificationsOpen(false)}
                        className="block text-sm text-gray-600 hover:text-gray-900 font-medium w-full py-1 text-center"
                      >
                        הצג את כל ההתראות
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <Link to={view === 'lecturer' ? '/lecturer/help' : '/student/help'} className="text-gray-500 hover:text-gray-800 transition-colors cursor-pointer p-1 rounded-md flex items-center justify-center">
                <HelpCircle size={22} />
              </Link>
            </div>
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm cursor-pointer hover:border-[#00857e] transition">
              <img src="https://i.pravatar.cc/150?img=11" alt="User profile" className="w-full h-full object-cover" />
            </div>
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
