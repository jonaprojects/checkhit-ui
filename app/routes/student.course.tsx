import type { Route } from "./+types/student.course";
import MainLayout from "../components/MainLayout";
import { BookOpen, FileText, Download, ChevronRight, ChevronLeft, Clock, PlayCircle } from 'lucide-react';
import { Link } from 'react-router';
import { StatusBadge, assignmentStatusConfig as statusConfig } from '../components/ui/StatusBadge';
import { Card } from '../components/ui/Card';
import { useTranslation } from 'react-i18next';
import { isRtlLanguage } from '../lib/i18n';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Course Details | Check Hit" },
  ];
}

const assignmentsData = [
  { id: 1, titleKey: 'course.assignmentPlaceholder1', dueDateKey: 'course.dueDateTomorrow', status: 'pending' },
  { id: 2, titleKey: 'course.assignmentPlaceholder2', dueDateKey: 'course.submitted2DaysAgo', status: 'checked', grade: 95 },
  { id: 5, titleKey: 'course.assignmentPlaceholder3', dueDateKey: 'course.submitted3WeeksAgo', status: 'checked', grade: 100 },
];

const resourcesData = [
  { id: 1, titleKey: 'course.materialPlaceholder1', type: 'pdf', size: '2.4 MB' },
  { id: 2, titleKey: 'course.materialPlaceholder2', type: 'zip', size: '15 KB' },
  { id: 3, titleKey: 'course.materialPlaceholder3', type: 'video', size: '120 MB' },
];

export default function StudentCourseRoute() {
  const { t, i18n } = useTranslation();
  const isRtl = isRtlLanguage(i18n.language);
  const assignments = assignmentsData;
  const resources = resourcesData;

  return (
    <MainLayout portalName={t('nav.dashboard')} view="student">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        <header className="border-b border-gray-200 pb-6">
          <Link to="/student/courses" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#00857e] transition-colors mb-4">
            {!isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />} {t('course.backToCourses')}
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-teal-50 text-[#00857e] px-2 py-1 rounded text-sm font-bold tracking-widest">CS101</span>
                <h1 className="text-3xl font-extrabold text-gray-900">{t('courses.coursePlaceholder1')}</h1>
              </div>
              <p className="text-gray-500">{t('course.profCohen')}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Assignments List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="text-[#00857e]" /> {t('course.courseAssignments')}
            </h2>
            
            <div className="space-y-4">
              {assignments.map(assignment => {
                return (
                  <Link key={assignment.id} to={`/student/assignments/${assignment.id}`} className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-teal-200 hover:shadow-sm transition-all group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#00857e] transition-colors">{t(assignment.titleKey)}</h3>
                      <div className="flex items-center gap-4 text-sm mt-2 sm:mt-0">
                        <StatusBadge type="assignment" status={assignment.status} />
                        {assignment.grade && (
                          <span className={`font-bold text-gray-900 border-gray-200 ${!isRtl ? 'border-l pl-4' : 'border-r pr-4'}`}>
                            {t('course.grade')}: {assignment.grade}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-500 flex items-center gap-2">
                        <Clock size={16} /> {t(assignment.dueDateKey)}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Resources Sidebar */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="text-teal-600" /> {t('course.courseMaterials')}
            </h2>
            
            <Card className="p-6 space-y-4">
              <p className="text-sm text-gray-500 mb-2">{t('course.courseMaterialsDesc')}</p>
              
              {resources.map(resource => (
                <div key={resource.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 group-hover:text-[#00857e] transition-colors">
                      {resource.type === 'video' ? <PlayCircle size={18} /> : <FileText size={18} />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">{t(resource.titleKey)}</div>
                      <div className="text-xs text-gray-400 uppercase">{resource.type} • {resource.size}</div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-[#00857e] transition-colors" title={t('course.download')}>
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </Card>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
