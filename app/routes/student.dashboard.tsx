import type { Route } from "./+types/student.dashboard";
import MainLayout from "../components/MainLayout";
import { CheckCircle, AlertCircle, ArrowLeft, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';
import { StudentAssignmentCard } from '../components/StudentAssignmentCard';
import { CourseCard } from '../components/CourseCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Card } from '../components/ui/Card';
import {
  AssignmentListSkeleton,
  CourseCardSkeleton,
  DashboardRecentGradesSkeleton,
  DashboardAppealsSkeleton,
} from '../components/ui/Skeleton';
import { useStudentAssignments } from '../hooks/useStudentAssignments';
import { useStudentGrades } from '../hooks/useStudentGrades';
import { useStudentAppeals } from '../hooks/useStudentAppeals';
import { useStudentCourses } from '../hooks/useStudentCourses';
import { useTranslation } from 'react-i18next';

const DASHBOARD_TEXTS = {
  he: {
    welcome: "ברוך שובך!",
    subtitle: "סקירה כללית על המטלות הקרובות, הציונים והקורסים הפעילים שלך.",
    upcomingAssignments: "מטלות קרובות להגשה",
    allAssignments: "לכל המטלות",
    noUpcomingAssignments: "אין מטלות קרובות להגשה",
    allCaughtUp: "כל הכבוד! הגשת את כל המטלות הפעילות בזמן.",
    toSubmit: "להגשה",
    view: "צפייה",
    recentGrades: "ציונים אחרונים",
    allGrades: "לכל הציונים",
    noGrades: "טרם הוזנו ציונים למטלות.",
    appealsInProgress: "ערעורים בתהליך",
    allAppeals: "לכל הערעורים",
    noAppeals: "אין ערעורים פעילים",
    noAppealsDesc: "אין לך כרגע ערעורי ציונים הממתינים לבדיקת מרצה.",
    pendingLecturerReview: "ממתין לתשובת מרצה",
    underReview: "בבדיקה",
    recentCourses: "קורסים פעילים ודחופים",
    allCourses: "לכל הקורסים",
    noCourses: "לא נמצאו קורסים פעילים.",
    viewCalendar: "צפה בלוח שנה",
  },
  en: {
    welcome: "Welcome Back!",
    subtitle: "Here is your academic overview, upcoming deadlines, and recent performance.",
    upcomingAssignments: "Upcoming Assignments",
    allAssignments: "All Assignments",
    noUpcomingAssignments: "No upcoming assignments due",
    allCaughtUp: "Great job! You have submitted all active assignments on time.",
    toSubmit: "To Submit",
    view: "View",
    recentGrades: "Recent Grades",
    allGrades: "All Grades",
    noGrades: "No graded assignments yet.",
    appealsInProgress: "Appeals in Progress",
    allAppeals: "All Appeals",
    noAppeals: "No appeals in progress",
    noAppealsDesc: "You currently have no pending grade appeals under review.",
    pendingLecturerReview: "Pending Lecturer Review",
    underReview: "Under Review",
    recentCourses: "Recent & Urgent Courses",
    allCourses: "All Courses",
    noCourses: "No enrolled courses found.",
    viewCalendar: "View Calendar",
  },
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Student Dashboard | Check Hit" },
  ];
}

export default function StudentDashboardRoute() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const texts = isEn ? DASHBOARD_TEXTS.en : DASHBOARD_TEXTS.he;

  // 1. Fetch upcoming active assignments
  const {
    data: upcomingAssignments = [],
    isLoading: isLoadingAssignments,
  } = useStudentAssignments({ upcoming: true, limit: 3 }, isEn);

  // 2. Fetch recent grades
  const {
    data: recentGrades = [],
    isLoading: isLoadingGrades,
  } = useStudentGrades(3, isEn);

  // 3. Fetch appeals in progress
  const {
    data: activeAppeals = [],
    isLoading: isLoadingAppeals,
  } = useStudentAppeals({ status: 'IN_PROGRESS', limit: 1 }, isEn);

  // 4. Fetch urgent enrolled courses
  const {
    data: urgentCourses = [],
    isLoading: isLoadingCourses,
  } = useStudentCourses({ urgent: true, limit: 3 });

  return (
    <MainLayout portalName={t('nav.dashboard')} view="student">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        {/* Welcome Header */}
        <header className="flex justify-between items-end border-b border-gray-200 dark:border-gray-800 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">{texts.welcome}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">{texts.subtitle}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upcoming Assignments */}
          <div className="md:col-span-2 bg-white dark:bg-[#17211f] rounded-xl border border-gray-200 dark:border-[#263330] p-4 sm:p-5 flex flex-col shadow-xs">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
                {texts.upcomingAssignments}
              </h2>
              <div className="flex items-center gap-3">
                <Link
                  to="/student/assignments?view=calendar"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-200 dark:border-teal-800/60 bg-teal-50 dark:bg-teal-950/40 text-[#00857e] dark:text-teal-300 hover:bg-teal-100/70 dark:hover:bg-teal-900/50 text-xs font-bold transition-colors shadow-2xs"
                >
                  <CalendarIcon size={14} />
                  <span>{texts.viewCalendar}</span>
                </Link>
                <Link
                  to="/student/assignments"
                  className="text-[#00857e] dark:text-teal-400 font-bold text-sm flex items-center gap-1 hover:underline"
                >
                  {texts.allAssignments}{' '}
                  {isEn ? <ArrowLeft size={16} className="rotate-180" /> : <ArrowLeft size={16} />}
                </Link>
              </div>
            </div>

            <div className="space-y-4 flex-1 flex flex-col justify-start">
              {isLoadingAssignments ? (
                <AssignmentListSkeleton count={2} />
              ) : upcomingAssignments.length === 0 ? (
                <div className="p-8 text-center bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center my-auto">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2.5 stroke-[1.5]" />
                  <p className="font-bold text-gray-800 dark:text-gray-200 text-base">{texts.noUpcomingAssignments}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">{texts.allCaughtUp}</p>
                </div>
              ) : (
                upcomingAssignments.map((assignment) => (
                  <StudentAssignmentCard
                    key={assignment.id}
                    title={assignment.name}
                    course={assignment.courseName}
                    dueDate={assignment.formattedDueDate}
                    actionText={assignment.uiStatus === 'pending' ? texts.toSubmit : texts.view}
                    linkTo="/student/assignments"
                    statusBadge={<StatusBadge type="assignment" status={assignment.uiStatus} rounded="md" />}
                  />
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Recent Grades */}
            <Card className="p-6 dark:bg-[#17211f] dark:border-[#263330]">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-500" /> {texts.recentGrades}
              </h2>
              {isLoadingGrades ? (
                <DashboardRecentGradesSkeleton count={2} />
              ) : recentGrades.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-3">{texts.noGrades}</p>
              ) : (
                <div className="space-y-4">
                  {recentGrades.map((grade) => (
                    <div
                      key={grade.id}
                      className="flex justify-between items-center pb-3 border-b border-gray-50 dark:border-gray-800/50 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="font-bold text-sm text-gray-900 dark:text-gray-100">{grade.assignmentTitle}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{grade.courseName}</div>
                      </div>
                      <div className="font-extrabold text-lg text-gray-900 dark:text-gray-100">
                        {grade.score}
                        {grade.maxScore && grade.maxScore !== 100 && (
                          <span className="text-xs font-medium text-gray-400 ms-0.5">/{grade.maxScore}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link
                to="/student/assignments"
                className="text-sm text-[#00857e] dark:text-teal-400 font-semibold mt-4 inline-block hover:underline"
              >
                {texts.allGrades}
              </Link>
            </Card>

            {/* Appeal Status */}
            <Card className="p-6 dark:bg-[#17211f] dark:border-[#263330]">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <AlertCircle className="text-orange-500" /> {texts.appealsInProgress}
              </h2>
              {isLoadingAppeals ? (
                <DashboardAppealsSkeleton />
              ) : activeAppeals.length === 0 ? (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800 text-start">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{texts.noAppeals}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{texts.noAppealsDesc}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeAppeals.map((appeal) => (
                    <div
                      key={appeal.id}
                      className="p-4 bg-orange-50/80 dark:bg-orange-950/30 rounded-xl border border-orange-200/70 dark:border-orange-900/40"
                    >
                      <div className="font-bold text-orange-900 dark:text-orange-200 text-sm">{appeal.assignmentTitle}</div>
                      <div className="text-xs text-orange-700 dark:text-orange-300 mt-0.5">{appeal.courseName}</div>
                      <div className="mt-3 flex items-center gap-2 text-xs font-bold text-orange-700 dark:text-orange-300 bg-white dark:bg-gray-800 px-2.5 py-1 rounded-md w-fit shadow-2xs border border-orange-200/60 dark:border-orange-800/60">
                        {texts.pendingLecturerReview}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link
                to="/student/appeals"
                className="text-sm text-[#00857e] dark:text-teal-400 font-semibold mt-4 inline-block hover:underline"
              >
                {texts.allAppeals}
              </Link>
            </Card>
          </div>
        </div>

        {/* Urgent & Enrolled Courses Section */}
        <div className="bg-white dark:bg-[#17211f] rounded-xl border border-gray-200 dark:border-[#263330] p-4 sm:p-5 flex flex-col shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
              {texts.recentCourses}
            </h2>
            <Link
              to="/student/courses"
              className="text-[#00857e] dark:text-teal-400 font-bold flex items-center gap-2 hover:underline text-sm"
            >
              {texts.allCourses}{' '}
              {isEn ? <ArrowLeft size={16} className="rotate-180" /> : <ArrowLeft size={16} />}
            </Link>
          </div>

          {isLoadingCourses ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <CourseCardSkeleton key={idx} variant="compact" />
              ))}
            </div>
          ) : urgentCourses.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">{texts.noCourses}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {urgentCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  name={course.name}
                  code={course.code}
                  accent={course.accent}
                  to={`/student/courses/${course.id}`}
                  variant="compact"
                >
                  {course.code} {course.instructorName ? `• ${course.instructorName}` : ''}
                </CourseCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
