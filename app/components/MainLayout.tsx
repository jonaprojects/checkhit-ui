import { useState } from 'react';
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
  Home
} from 'lucide-react';

export default function MainLayout({ children, portalName = "פורטל סטודנטים", view }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

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
        <div className="p-6 flex flex-col items-center justify-center border-b border-gray-100 min-h-[100px]">
          <Link to="/" className="w-full flex justify-center">
            <img src="/logo.png" alt="Check Hit Logo" className="h-10 w-auto object-contain cursor-pointer transition-transform hover:scale-105" />
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
            </>
          )}

          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors border-s-4 border-transparent hover:border-gray-300 mt-4">
            <Settings size={20} />
            הגדרות
          </a>
          
          <div className="pt-6 mt-6 border-t border-gray-100">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors border-s-4 border-transparent">
              <Home size={20} />
              חזרה לעמוד הבית
            </Link>
          </div>
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
             <a href="#" className="text-[#00857e] font-bold border-b-2 border-[#00857e] pb-1">ראשי</a>
             <a href="#" className="hover:text-gray-900 pb-1 relative">
               הודעות
               <span className="absolute top-0 start-[-8px] w-2 h-2 bg-red-500 rounded-full"></span>
             </a>
          </div>

          <div className="flex items-center gap-4 lg:gap-6 ms-auto">

            <div className="flex items-center gap-3 px-4 border-s border-gray-200">
              <button className="text-gray-500 hover:text-gray-800 transition-colors relative">
                <Bell size={22} />
                <span className="absolute top-0 start-0 w-2 h-2 bg-[#E8B43F] rounded-full border border-white"></span>
              </button>
              <button className="text-gray-500 hover:text-gray-800 transition-colors">
                <HelpCircle size={22} />
              </button>
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
