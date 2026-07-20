import { BookOpen, AlertCircle, Users, CheckCircle2, Clock, FileWarning, ArrowLeft, MoreVertical, ClipboardList, ChevronLeft } from 'lucide-react';
import { Card } from './ui/Card';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function LecturerDashboard() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
      {/* Welcome Section */}
      <div className="text-center md:text-start bg-white p-8 rounded-xl border border-gray-200 relative overflow-hidden">
        <div className="absolute top-0 end-0 -mt-10 -me-10 w-40 h-40 bg-teal-50 rounded-full blur-3xl opacity-60"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">{t('lecturerDashboard.welcome')}</h1>
          <p className="text-gray-600 text-lg">{t('lecturerDashboard.subtitle')}</p>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          icon={<BookOpen className="text-emerald-600 group-hover:scale-110 transition-transform" size={26} />}
          title={t('lecturerDashboard.activeCourses')}
          value="4"
          subtitle={t('lecturerDashboard.semester')}
        />
        <MetricCard 
          icon={<AlertCircle className="text-rose-600 group-hover:scale-110 transition-transform" size={26} />}
          title={t('lecturerDashboard.appealsToReview')}
          value="7"
          subtitle={t('lecturerDashboard.pendingReview')}
          badgeIcon={true}
        />
        <MetricCard 
          icon={<Users className="text-indigo-600 group-hover:scale-110 transition-transform" size={26} />}
          title={t('lecturerDashboard.studentsAtRisk')}
          value="3"
          subtitle={t('lecturerDashboard.interventionNeeded')}
        />
      </div>

      {/* Activity Feed Section */}
      <Card className="p-8 mt-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900">{t('lecturerDashboard.recentActivity')}</h2>
        </div>
        <div className="space-y-6 relative before:absolute before:inset-y-0 before:start-5 before:w-0.5 before:bg-gray-100">
          <ActivityItem 
            active={true}
            iconBg="bg-white border-4 border-teal-200"
            title={isEn ? "AI Checking Complete" : "סיום בדיקת AI"}
            time={isEn ? "An hour ago" : "לפני שעה"}
            description={isEn ? "The system finished checking 85 submissions for 'Assignment 3 - Recursion'. Grades are ready for approval." : "המערכת סיימה לבדוק 85 הגשות עבור 'תרגיל 3 - רקורסיה'. הציונים מוכנים לאישור."}
          />
          <ActivityItem 
            active={false}
            iconBg="bg-white border-2 border-gray-200"
            title={isEn ? "New Appeal Received" : "ערעור חדש התקבל"}
            time={isEn ? "Today, 10:30" : "היום, 10:30"}
            description={isEn ? "Yossi Cohen submitted an appeal for 'Assignment 2'. Reason: 'Calculation error in part B'." : "יוסי כהן הגיש ערעור על הציון ב'מטלה 2'. סיבה: 'טעות בחישוב ניקוד סעיף ב'."}
          />
          <ActivityItem 
            active={false}
            iconBg="bg-white border-2 border-gray-200"
            title={isEn ? "Late Submission" : "הגשה באיחור"}
            time={isEn ? "Yesterday, 23:45" : "אתמול, 23:45"}
            description={isEn ? "Michal Raz submitted the Midterm Project 2 days late." : "מיכל רז הגישה את פרויקט האמצע באיחור של יומיים."}
          />
          <Link to="/lecturer/appeals" className="text-[#00857e] font-bold mt-6 inline-flex items-center gap-1 hover:underline">
            {t('lecturerDashboard.viewAll')} {isEn ? <ChevronLeft size={18} className="rotate-180" /> : <ChevronLeft size={18} />}
          </Link>
        </div>
      </Card>

      {/* Active Courses Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900">{t('lecturerDashboard.activeCourses')}</h2>
          <Link to="/lecturer/courses" className="text-[#00857e] font-bold flex items-center gap-2 hover:underline">
            {t('lecturerDashboard.allCourses')} {isEn ? <ArrowLeft size={18} className="rotate-180" /> : <ArrowLeft size={18} />}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <CourseCard 
            title={isEn ? "Object Oriented Programming" : "תכנות מונחה עצמים"}
            code="CS303"
            semester={t('lecturerDashboard.semester')}
            students={85}
            activeAssignments={2}
            accent={{
              gradient: 'from-purple-600 to-indigo-400',
              text: 'text-purple-700',
              bg: 'bg-purple-50',
              borderHover: 'hover:border-purple-300',
              groupHoverText: 'group-hover:text-purple-600',
              groupHoverBorder: 'group-hover:border-purple-100',
              topBorder: 'border-purple-500'
            }}
          />
          <CourseCard 
            title={isEn ? "Data Structures & Algorithms" : "מבני נתונים ואלגוריתמים"}
            code="CS101"
            semester={t('lecturerDashboard.semester')}
            students={120}
            activeAssignments={1}
            accent={{
              gradient: 'from-teal-600 to-cyan-400',
              text: 'text-teal-700',
              bg: 'bg-teal-50',
              borderHover: 'hover:border-teal-300',
              groupHoverText: 'group-hover:text-teal-600',
              groupHoverBorder: 'group-hover:border-teal-100',
              topBorder: 'border-teal-500'
            }}
          />
        </div>
      </section>
    </div>
  );
}

function MetricCard({ icon, title, value, subtitle, badgeIcon = false }: { icon: React.ReactNode, title: string, value: string | number, subtitle: string, badgeIcon?: boolean }) {
  return (
    <Card className="p-6 flex flex-col relative transition-all duration-300 hover:shadow-sm hover:-translate-y-1 group overflow-visible">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-4xl font-black text-[#00857e]">{value}</h3>
        <div className="p-4 bg-gray-50/80 border border-gray-100 rounded-xl relative transition-colors group-hover:bg-gray-100">
          {icon}
          {badgeIcon && (
            <span className="absolute -top-1.5 -end-1.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
            </span>
          )}
        </div>
      </div>
      <p className="text-xl font-extrabold text-gray-800 mb-1">{title}</p>
      <p className="text-sm text-gray-500 font-medium">{subtitle}</p>
    </Card>
  );
}

function CourseCard({ title, code, semester, students, activeAssignments, accent }) {
  const { t } = useTranslation();
  return (
    <div className={`bg-white rounded-xl border border-gray-200 hover:shadow-md ${accent.borderHover} transition-all duration-300 relative group cursor-pointer flex flex-col h-full hover:-translate-y-1 overflow-hidden`}>
      <div className={`h-0 w-full border-t-[6px] ${accent.topBorder} transition-colors`}></div>
      <div className="p-6 flex flex-col flex-1">
        <div className="text-start mb-6">
          <p className="text-sm text-gray-500 font-medium mb-2">{code} · {semester}</p>
          <h3 className="text-2xl font-black text-gray-900 transition-colors">{title}</h3>
        </div>
        
        <div className="mt-auto flex justify-between items-center text-[#00857e] font-bold">
          <div className="flex items-center gap-2">
            <Users size={20} />
            <span className="text-lg">{students}</span>
          </div>
          <div className="flex items-center gap-2">
            <ClipboardList size={20} />
            <span className="text-base">{activeAssignments} {t('lecturerDashboard.activeAssignments')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ iconBg, title, time, description, active, extra }: { iconBg: any, title: any, time: any, description: any, active: any, extra?: any }) {
  return (
    <div className="relative ps-14 pb-8 group last:pb-0">
      <div className={`absolute start-[12px] top-1 w-4 h-4 rounded-full flex items-center justify-center z-10 ${iconBg} ${active ? 'ring-4 ring-teal-50 shadow-sm' : ''} transition-all duration-300 group-hover:scale-110`}>
        {active && <div className="w-2 h-2 bg-[#00857e] rounded-full animate-pulse"></div>}
      </div>
      <div className="bg-white border border-transparent group-hover:border-teal-100 group-hover:bg-teal-50/30 rounded-xl p-5 transition-all -mt-4 cursor-pointer">
        <div className="flex justify-between items-baseline mb-2 gap-2">
          <h4 className="text-lg font-bold text-gray-900">{title}</h4>
          <span className="text-xs font-bold text-gray-500 whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full">{time}</span>
        </div>
        <p className="text-base text-gray-600 leading-snug">{description}</p>
        {extra && <div className="mt-3">{extra}</div>}
      </div>
    </div>
  );
}


