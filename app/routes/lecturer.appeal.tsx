import type { Route } from "./+types/lecturer.appeal";
import MainLayout from "../components/MainLayout";
import { Link, useParams } from "react-router";
import { useState } from "react";
import { Button } from '../components/ui/Button';
import { ChevronRight, ChevronLeft, FileText, Download, Eye, Bot, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Review Appeal | Lecturer Portal | Check Hit" },
  ];
}

const MOCK_APPEAL_DATA = {
  he: {
    id: "app_1",
    studentName: "ישראל ישראלי",
    studentId: "123456789",
    courseName: "מבני נתונים ואלגוריתמים",
    assignmentName: "תרגיל בית 3: עצי חיפוש",
    date: "28.10.2023, 14:30",
    originalGrade: 82,
    categoryLabel: "טעות בבדיקה",
    studentClaim: "ה-AI הוריד לי 18 נקודות על יעילות זמן הריצה בפונקציית המחיקה. אולם, כפי שניתן לראות בקובץ המצורף, המימוש שלי משתמש במציאת העוקב (Successor) בצורה נכונה ולכן הוא רץ בזמן O(log n) במקרה הממוצע כמו שלמדנו בכיתה. אשמח להערכה מחדש של סעיף זה.",
    attachments: [
      { name: "binary_tree_submission.pdf", size: "1.2 MB" },
      { name: "explanation_diagram.pdf", size: "0.5 MB" }
    ],
    originalFeedback: [
      { type: "positive", text: "מימוש פונקציית ה-insert יעיל ונכון (O(log n) במקרה הממוצע)." },
      { type: "negative", text: "פונקציית המחיקה אינה יעילה במקרי קצה מסוימים ועשויה לחרוג מ-O(log n)." }
    ]
  },
  en: {
    id: "app_1",
    studentName: "Israel Israeli",
    studentId: "123456789",
    courseName: "Data Structures & Algorithms",
    assignmentName: "Homework 3: Search Trees",
    date: "28.10.2023, 14:30",
    originalGrade: 82,
    categoryLabel: "Grading Error",
    studentClaim: "The AI deducted 18 points for runtime efficiency in the delete function. However, as can be seen in the attached file, my implementation correctly uses finding the Successor and therefore runs in O(log n) time on average as we learned in class. I would appreciate a re-evaluation of this section.",
    attachments: [
      { name: "binary_tree_submission.pdf", size: "1.2 MB" },
      { name: "explanation_diagram.pdf", size: "0.5 MB" }
    ],
    originalFeedback: [
      { type: "positive", text: "The implementation of the insert function is efficient and correct (O(log n) on average)." },
      { type: "negative", text: "The delete function is inefficient in some edge cases and may exceed O(log n)." }
    ]
  }
};

export default function LecturerAppealReviewRoute() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const MOCK_APPEAL = isEn ? MOCK_APPEAL_DATA.en : MOCK_APPEAL_DATA.he;
  const { appealId } = useParams();
  
  // AI Assistant State: 'idle' | 'analyzing' | 'done'
  const [aiState, setAiState] = useState<'idle' | 'analyzing' | 'done'>('idle');
  const [newGrade, setNewGrade] = useState<number | string>(MOCK_APPEAL.originalGrade);
  const [lecturerFeedback, setLecturerFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAiAnalysis = () => {
    setAiState('analyzing');
    setTimeout(() => {
      setAiState('done');
    }, 2500); // Simulate network delay
  };

  const handleApplyAiRecommendation = () => {
    setNewGrade(95); // Example AI recommendation
    setLecturerFeedback(isEn 
      ? "After a re-evaluation with the help of AI, it seems you are correct. The implementation of finding the successor indeed guarantees logarithmic running time on average. The grade has been updated accordingly."
      : "לאחר בדיקה חוזרת בעזרת ה-AI, נראה שהצדק איתך. המימוש של מציאת העוקב אכן מבטיח זמן ריצה לוגריתמי בממוצע. הציון תוקן בהתאם.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <MainLayout portalName={isEn ? "Lecturer Portal" : "פורטל מרצים"} view="lecturer">
        <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{t('appealReview.successTitle')}</h1>
          <p className="text-gray-500 max-w-md text-center mb-8">{t('appealReview.successDesc')}</p>
          <Link to="/lecturer/appeals" className="bg-[#00857e] text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors cursor-pointer">
            {t('appealReview.backToAppeals')}
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout portalName={isEn ? "Lecturer Portal" : "פורטל מרצים"} view="lecturer">
      <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
        
        {/* Header */}
        <header className="border-b border-gray-200 pb-6">
          <Link to="/lecturer/appeals" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#00857e] transition-colors mb-4 cursor-pointer">
            <ChevronRight size={16} className={isEn ? "rotate-180" : ""} /> {t('appealReview.backToAppeals')}
          </Link>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                בדיקת ערעור: {MOCK_APPEAL.studentName}
                <span className="text-lg font-normal text-gray-400 font-mono mt-1">({MOCK_APPEAL.studentId})</span>
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm font-bold">{MOCK_APPEAL.courseName}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600 text-sm">{MOCK_APPEAL.assignmentName}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500 text-sm">{MOCK_APPEAL.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
              <div className={`text-center px-4 ${isEn ? 'border-r border-gray-200' : 'border-l border-gray-200'}`}>
                <div className="text-xs text-gray-500 mb-1">{t('appealReview.originalGrade')}</div>
                <div className="text-2xl font-black text-[#00857e]">{MOCK_APPEAL.originalGrade}</div>
              </div>
              <div className="px-4">
                <div className="text-xs text-gray-500 mb-1">{t('appealReview.category')}</div>
                <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded text-xs font-bold block text-center">
                  {MOCK_APPEAL.categoryLabel}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Context */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Student Claim */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <AlertCircle size={18} className="text-[#00857e]" />
                  {t('appealReview.studentClaimTitle')}
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {MOCK_APPEAL.studentClaim}
                </p>
              </div>
            </section>

            {/* Attachments */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <FileText size={18} className="text-gray-500" />
                  {t('appealReview.attachmentsTitle')}
                </h2>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOCK_APPEAL.attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50/50 group">
                    <div className="w-10 h-10 bg-red-100 text-red-600 rounded flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate" dir="ltr">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.size}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-500 hover:text-[#00857e] hover:bg-teal-50 rounded cursor-pointer" title={t('appealReview.preview')}>
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-[#00857e] hover:bg-teal-50 rounded cursor-pointer" title={t('appealReview.download')}>
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Original Evaluation Context */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <Bot size={18} className="text-[#E8B43F]" />
                  {t('appealReview.originalFeedbackTitle')}
                </h2>
              </div>
              <div className="p-6 space-y-3">
                {MOCK_APPEAL.originalFeedback.map((feedback, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border flex items-start gap-3 ${feedback.type === 'positive' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    <AlertCircle size={18} className={`shrink-0 mt-0.5 ${feedback.type === 'positive' ? 'text-green-600' : 'text-red-600'}`} />
                    <p className="text-sm font-medium">{feedback.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Action & AI */}
          <div className="space-y-6">
            
            {/* AI Assistant Card */}
            <div className="bg-gradient-to-b from-teal-50 to-white rounded-xl border-2 border-teal-100 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#00857e] to-[#E8B43F]"></div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={20} className="text-[#E8B43F]" />
                  <h3 className="text-lg font-bold text-gray-900">{t('appealReview.aiAssessmentTitle')}</h3>
                </div>
                
                {aiState === 'idle' && (
                  <>
                    <p className="text-sm text-gray-600 mb-6">
                      {t('appealReview.aiScanIdleDesc')}
                    </p>
                    <button 
                      onClick={handleAiAnalysis}
                      className="w-full bg-white border border-[#00857e] text-[#00857e] hover:bg-teal-50 py-2.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Bot size={18} />
                      {t('appealReview.aiScanBtn')}
                    </button>
                  </>
                )}

                {aiState === 'analyzing' && (
                  <div className="flex flex-col items-center py-6">
                    <div className="relative">
                       <Bot size={40} className="text-[#00857e] animate-pulse relative z-10" />
                       <div className="absolute inset-0 bg-[#E8B43F] rounded-full blur-xl opacity-40 animate-pulse"></div>
                    </div>
                    <p className="text-sm font-bold text-gray-700 mt-4 mb-1">{t('appealReview.aiScanningTitle')}</p>
                    <p className="text-xs text-gray-500">{t('appealReview.aiScanningDesc')}</p>
                  </div>
                )}

                {aiState === 'done' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white rounded-lg border border-teal-100 p-4 mb-4 shadow-sm">
                      <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                        <strong>{t('appealReview.aiConclusionTitle')}</strong> {isEn ? "The student's claim is correct. A re-evaluation shows that the helper function prevents overflow in edge cases, and the complexity remains O(log n)." : "טענת הסטודנט נכונה. בבדיקה חוזרת עולה כי פונקציית העזר מונעת גלישה במקרי קצה, והסיבוכיות נשמרת על O(log n)."}
                      </p>
                      <div className="flex items-center justify-between bg-green-50 px-3 py-2 rounded border border-green-100">
                         <span className="text-sm font-bold text-green-800">{t('appealReview.aiRecommendation')}</span>
                         <span className="text-lg font-black text-green-700">+13 {t('appealReview.aiPoints')}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={handleApplyAiRecommendation}
                      variant="primary"
                      size="md"
                      className="w-full"
                    >
                      <CheckCircle2 size={18} />
                      {t('appealReview.aiApplyBtn')}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Manual Evaluation Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <h3 className="font-bold text-gray-800">{t('appealReview.lecturerDecisionTitle')}</h3>
              </div>
              <div className="p-6 space-y-6">
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('appealReview.newGradeLabel')}</label>
                  <div className="flex items-center">
                    <input 
                      type="number" 
                      min="0" max="100"
                      value={newGrade}
                      onChange={(e) => setNewGrade(e.target.value)}
                      className="w-24 text-center font-bold text-xl border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#00857e] focus:outline-none"
                    />
                    <span className={`text-gray-500 font-bold ${isEn ? 'mr-2' : 'ml-2'}`}>/ 100</span>
                    {Number(newGrade) > MOCK_APPEAL.originalGrade && (
                      <span className={`text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded-md ${isEn ? 'ml-auto' : 'mr-auto'}`}>
                        +{Number(newGrade) - MOCK_APPEAL.originalGrade} {t('appealReview.points')}
                      </span>
                    )}
                    {Number(newGrade) < MOCK_APPEAL.originalGrade && (
                      <span className={`text-red-600 text-sm font-bold bg-red-50 px-2 py-1 rounded-md ${isEn ? 'ml-auto' : 'mr-auto'}`}>
                        {Number(newGrade) - MOCK_APPEAL.originalGrade} {t('appealReview.points')}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('appealReview.feedbackLabel')}</label>
                  <textarea 
                    required
                    rows={5}
                    value={lecturerFeedback}
                    onChange={(e) => setLecturerFeedback(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00857e] focus:outline-none text-sm resize-none"
                    placeholder={t('appealReview.feedbackPlaceholder')}
                  ></textarea>
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  <Button 
                    type="submit" 
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('appealReview.savingBtn') : t('appealReview.submitDecisionBtn')}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200 hover:border-red-200"
                    onClick={() => {
                      setNewGrade(MOCK_APPEAL.originalGrade);
                      setLecturerFeedback(isEn 
                        ? "After a thorough review of your claims, the implementation still does not meet the efficiency requirements. The original grade remains."
                        : "לאחר בדיקה מעמיקה של טענותיך, המימוש עדיין לא עומד בדרישות היעילות. הציון נותר בעינו.");
                    }}
                  >
                    {t('appealReview.rejectAppealBtn')}
                  </Button>
                </div>
              </div>
            </form>

          </div>
        </div>

      </div>
    </MainLayout>
  );
}
