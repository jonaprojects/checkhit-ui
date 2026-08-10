import type { Route } from "./+types/student.appeals";
import MainLayout from "../components/MainLayout";
import { FileText, Clock, CheckCircle2, AlertCircle, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';
import { StatusBadge, appealStatusConfig as statusConfig } from '../components/ui/StatusBadge';
import { useTranslation } from 'react-i18next';
import { isRtlLanguage } from '../lib/i18n';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Appeals | Check Hit" },
  ];
}

const appealsData = [
  {
    id: 1,
    assignmentId: 2,
    titleKey: 'course.assignmentPlaceholder2',
    courseKey: 'courses.coursePlaceholder1',
    dateKey: 'appeals.mockAppeal1Date',
    status: 'pending',
    originalGrade: 82,
    newGrade: null,
    reasonKey: 'appeals.mockAppeal1Reason',
  },
  {
    id: 2,
    assignmentId: 3,
    titleKey: 'appeals.mockAppeal2Title',
    courseKey: 'courses.coursePlaceholder2',
    dateKey: 'appeals.mockAppeal2Date',
    status: 'accepted',
    originalGrade: 75,
    newGrade: 85,
    reasonKey: 'appeals.mockAppeal2Reason',
  },
  {
    id: 3,
    assignmentId: 5,
    titleKey: 'appeals.mockAppeal3Title',
    courseKey: 'courses.coursePlaceholder1',
    dateKey: 'appeals.mockAppeal3Date',
    status: 'rejected',
    originalGrade: 90,
    newGrade: 90,
    reasonKey: 'appeals.mockAppeal3Reason',
  },
];

export default function StudentAppealsRoute() {
  const { t, i18n } = useTranslation();
  const isRtl = isRtlLanguage(i18n.language);
  const appeals = appealsData;

  return (
    <MainLayout portalName={t('nav.studentPortal')} view="student">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        <header className="border-b border-gray-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{t('appeals.title')}</h1>
            <p className="text-gray-500 text-lg">{t('appeals.subtitle')}</p>
          </div>
          <div className="text-sm text-gray-500 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm">
            {t('appeals.totalSubmitted')} <strong className="text-gray-900">{appeals.length} {t('appeals.appealsCount')}</strong>
          </div>
        </header>

        <div className="space-y-4">
          {appeals.map((appeal) => {
            const StatusIcon = statusConfig[appeal.status].icon;
            return (
              <div key={appeal.id} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-teal-100 hover:bg-teal-50/30 transition-all cursor-pointer">
                
                <div className="flex-1 flex items-start gap-4">
                  <div className={`mt-1 shrink-0 flex items-center justify-center w-12 h-12 rounded-full ${statusConfig[appeal.status].color} group-hover:scale-110 transition-transform`}>
                    <StatusIcon size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{t(appeal.titleKey)}</h3>
                      <StatusBadge type="appeal" status={appeal.status} />
                    </div>
                    <div className="text-gray-500 text-sm mb-3">
                      <span>{t(appeal.courseKey)}</span>
                      <span className="mx-2">•</span>
                      <span>{t('appeals.submitted')} {t(appeal.dateKey)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4 border-t md:border-t-0 md:border-s border-gray-100 pt-4 md:pt-0 md:pe-8 min-w-[200px] w-full md:w-auto">
                  <div className="flex justify-between md:justify-end w-full items-center gap-4 text-start md:text-end">
                    <div>
                      <span className="text-sm text-gray-500 block">{t('appeals.originalGrade')}</span>
                      <span className="text-lg font-bold text-gray-400 line-through">{appeal.originalGrade}</span>
                    </div>
                    {appeal.status === 'accepted' ? (
                      <div>
                        <span className="text-sm text-gray-500 block">{t('appeals.newGrade')}</span>
                        <span className="text-2xl font-black text-green-600">{appeal.newGrade}</span>
                      </div>
                    ) : appeal.status === 'rejected' ? (
                      <div>
                        <span className="text-sm text-gray-500 block">{t('appeals.decision')}</span>
                        <span className="text-xl font-bold text-gray-900">{appeal.originalGrade}</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-sm text-gray-500 block">{t('appeals.status')}</span>
                        <span className="text-xl font-bold text-yellow-600">{t('appeals.checking')}</span>
                      </div>
                    )}
                  </div>
                  
                  <Link 
                    to={`/student/assignments/${appeal.assignmentId}`}
                    className={`w-full md:w-auto text-center md:text-start bg-gray-100 hover:bg-[#00857e] text-gray-700 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors inline-flex items-center justify-center gap-2`}
                  >
                    {t('appeals.viewAssignment')} <ChevronLeft size={16} className={!isRtl ? "rotate-180" : ""} />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
