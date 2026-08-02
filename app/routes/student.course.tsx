import type { Route } from "./+types/student.course";
import MainLayout from "../components/MainLayout";
import { BookOpen, FileText, Download, ChevronRight, ChevronLeft, Clock, PlayCircle, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Card } from '../components/ui/Card';
import { CourseDetailSkeleton } from '../components/ui/Skeleton';
import { useStudentCourse } from '../hooks/useStudentCourse';
import { useTranslation } from 'react-i18next';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Course Details | Check Hit" },
  ];
}

const resourcesData = {
  he: [
    { id: '1', title: 'מצגת הרצאה 4 - עצי חיפוש', type: 'pdf', size: '2.4 MB' },
    { id: '2', title: 'קוד מקור הדגמה - Java', type: 'zip', size: '15 KB' },
    { id: '3', title: 'הקלטת תרגול 3', type: 'video', size: '120 MB' },
  ],
  en: [
    { id: '1', title: 'Lecture 4 Presentation - Trees', type: 'pdf', size: '2.4 MB' },
    { id: '2', title: 'Demo Source Code - Java', type: 'zip', size: '15 KB' },
    { id: '3', title: 'Practice 3 Recording', type: 'video', size: '120 MB' },
  ]
};

export default function StudentCourseRoute() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;

  const { data, isLoading, isError, error, refetch, isFetching } = useStudentCourse(courseId, isEn);
  const resources = isEn ? resourcesData.en : resourcesData.he;

  const course = data?.course;
  const assignments = data?.assignments || [];

  return (
    <MainLayout portalName={t('nav.dashboard')} view="student">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/student/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-teal-700 transition-colors"
          >
            {isEn ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            <span>{t('course.backToCourses')}</span>
          </Link>
        </div>

        {/* Shimmer Loading State */}
        {isLoading && <CourseDetailSkeleton />}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="rounded-2xl border border-red-200 bg-red-50/70 p-8 text-center max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <AlertCircle size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900">{t('course.errorTitle')}</h3>
              <p className="text-sm text-red-700 mt-1 max-w-md mx-auto">
                {error instanceof Error ? error.message : t('course.errorDesc')}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw size={16} />
              <span>{t('course.retry')}</span>
            </button>
          </div>
        )}

        {/* Loaded Course Content */}
        {!isLoading && !isError && course && (
          <>
            {/* Header */}
            <header className="border-b border-gray-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="bg-teal-50 text-teal-800 border border-teal-200/60 px-2.5 py-1 rounded-lg text-xs font-black tracking-widest">
                    {course.code}
                  </span>
                  {course.semester && (
                    <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                      {course.semester} {course.academicYear}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900">{course.displayTitle}</h1>
                <p className="text-gray-500 mt-1 text-sm font-medium">
                  {course.instructors || t('course.noInstructor')}
                </p>
              </div>

              {/* Refresh / Action button */}
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                title={t('course.retry')}
                className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 shadow-xs cursor-pointer self-start md:self-auto"
              >
                <RefreshCw size={18} className={isFetching ? 'animate-spin text-teal-600' : ''} />
              </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Assignments List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="text-teal-600" />
                    <span>{t('course.courseAssignments')}</span>
                  </h2>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                    {assignments.length}
                  </span>
                </div>

                {assignments.length === 0 ? (
                  <div className="rounded-xl border border-gray-200 bg-white p-8 text-center space-y-3 shadow-xs">
                    <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center mx-auto">
                      <FileText size={24} />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">{t('course.noAssignments')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <Link
                        key={assignment.id}
                        to={`/student/assignments/${assignment.id}`}
                        className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-teal-300 hover:shadow-sm transition-all duration-200 group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-teal-700 transition-colors">
                            {assignment.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm mt-2 sm:mt-0 flex-wrap">
                            <StatusBadge type="assignment" status={assignment.uiStatus} />
                            {assignment.grade !== undefined && (
                              <span
                                className={`font-black text-gray-900 border-gray-200 ${
                                  isEn ? 'border-l pl-3' : 'border-r pr-3'
                                }`}
                              >
                                {t('course.grade')}: {assignment.grade} / {assignment.maxScore}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm pt-1 border-t border-gray-50">
                          <div
                            className={`flex items-center gap-2 font-medium ${
                              assignment.isOverdue && assignment.uiStatus === 'pending'
                                ? 'text-red-600 font-bold'
                                : 'text-gray-500'
                            }`}
                          >
                            <Clock size={15} className="shrink-0" />
                            <span>{assignment.formattedDueDate}</span>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-semibold text-teal-700 opacity-0 group-hover:opacity-100 transition-opacity">
                            {isEn ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Resources Sidebar */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="text-teal-600" />
                  <span>{t('course.courseMaterials')}</span>
                </h2>

                <Card className="p-6 space-y-4">
                  <p className="text-sm text-gray-500">{t('course.courseMaterialsDesc')}</p>

                  {resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-100/80 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 group-hover:text-teal-700 transition-colors shrink-0">
                          {resource.type === 'video' ? <PlayCircle size={18} /> : <FileText size={18} />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-800 line-clamp-1">{resource.title}</div>
                          <div className="text-xs text-gray-400 uppercase">
                            {resource.type} • {resource.size}
                          </div>
                        </div>
                      </div>
                      <button
                        className="text-gray-400 hover:text-teal-700 transition-colors p-1"
                        title={t('course.download')}
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
