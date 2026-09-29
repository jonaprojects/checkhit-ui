import type { Route } from "./+types/lecturer.appeal";
import MainLayout from "../components/MainLayout";
import { Link, useParams } from "react-router";
import { useState, useEffect, useRef } from "react";
import { Button } from '../components/ui/Button';
import {
  ChevronRight,
  ChevronLeft,
  FileText,
  Download,
  Bot,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useAppealDetail, useClaimAppeal, useResolveAppeal } from '../hooks/useLecturerAppeals';
import { downloadAppealEvidence } from '../lib/api/appeals';
import { getLtiUserId } from '../lib/lti-session';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Review Appeal | Lecturer Portal | Check Hit" },
  ];
}

export default function LecturerAppealReviewRoute() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const { appealId } = useParams();
  const lecturerId = getLtiUserId(
    import.meta.env.VITE_LECTURER_ID || '5a205d7f-7084-4f91-ba7c-aeb0b6078256'
  );

  const {
    data: appeal,
    isLoading,
    isError,
    error,
    refetch,
  } = useAppealDetail(appealId, isEn);

  const resolveMutation = useResolveAppeal();
  const claimMutation = useClaimAppeal();
  const claimStarted = useRef(false);

  const [newGrade, setNewGrade] = useState<number | string>('');
  const [lecturerFeedback, setLecturerFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Sync state when appeal data arrives
  useEffect(() => {
    if (appeal) {
      setNewGrade(appeal.resultEvaluation?.score ?? appeal.evaluation?.score ?? 0);
      if (appeal.resolution) {
        setLecturerFeedback(appeal.resolution);
      }
    }
  }, [appeal]);

  useEffect(() => {
    if (!appealId || appeal?.status !== 'SUBMITTED' || claimStarted.current) return;
    claimStarted.current = true;
    claimMutation.mutate(appealId);
  }, [appeal?.status, appealId]);

  const originalGrade = appeal?.evaluation?.score ?? 0;
  const maxScore = appeal?.evaluation?.maxScore ?? 100;

  const handleResolve = async (
    decisionStatus: 'ACCEPTED' | 'REJECTED',
    resolutionOverride?: string,
  ) => {
    if (!appealId) return;
    setSubmissionError(null);

    const gradeToSend = decisionStatus === 'ACCEPTED' ? Number(newGrade) : undefined;
    if (decisionStatus === 'ACCEPTED' && (!Number.isFinite(gradeToSend) || gradeToSend! < 0 || gradeToSend! > maxScore)) {
      setSubmissionError(isEn ? `The revised grade must be between 0 and ${maxScore}.` : `הציון המתוקן חייב להיות בין 0 ל-${maxScore}.`);
      return;
    }
    const feedbackToSend =
      resolutionOverride || lecturerFeedback.trim() ||
      (decisionStatus === 'REJECTED'
        ? (isEn ? "The appeal was reviewed and rejected. Original evaluation stands." : "הערעור נבדק ונדחה. ההערכה המקורית נשארת בעינה.")
        : (isEn ? "The appeal was accepted and grade updated." : "הערעור התקבל והציון עודכן."));

    try {
      await resolveMutation.mutateAsync({
        appealId,
        data: {
          status: decisionStatus,
          resolution: feedbackToSend,
          newScore: gradeToSend,
        },
      });
      setIsSubmitted(true);
    } catch (err: any) {
      setSubmissionError(err.message || (isEn ? 'Failed to save appeal decision.' : 'שגיאה בשמירת החלטת הערעור.'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleResolve('ACCEPTED');
  };

  const handleEvidenceDownload = async (fileId: string) => {
    setSubmissionError(null);
    try {
      if (appealId) await downloadAppealEvidence(appealId, fileId);
    } catch (err) {
      setSubmissionError(err instanceof Error ? err.message : (isEn ? 'Failed to download evidence.' : 'הורדת האסמכתא נכשלה.'));
    }
  };

  if (isSubmitted) {
    return (
      <MainLayout portalName={isEn ? "Lecturer Portal" : "פורטל מרצים"} view="lecturer">
        <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in duration-500 max-w-lg mx-auto text-center px-4">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            {t('appealReview.successTitle')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
            {t('appealReview.successDesc')}
          </p>
          <Link
            to="/lecturer/appeals"
            className="bg-[#00857e] hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm cursor-pointer"
          >
            {t('appealReview.backToAppeals')}
          </Link>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout portalName={isEn ? "Lecturer Portal" : "פורטל מרצים"} view="lecturer">
        <div className="space-y-6 animate-pulse max-w-7xl mx-auto pb-12">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-48 mb-4" />
          <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-44 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
              <div className="h-36 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError || !appeal) {
    return (
      <MainLayout portalName={isEn ? "Lecturer Portal" : "פורטל מרצים"} view="lecturer">
        <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEn ? 'Appeal Not Found' : 'הערעור לא נמצא'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {error instanceof Error ? error.message : (isEn ? 'Could not load appeal data from server.' : 'לא ניתן היה לטעון את פרטי הערעור מהשרת.')}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold transition-colors cursor-pointer"
            >
              <RefreshCw size={16} />
              <span>{t('appeals.retry')}</span>
            </button>
            <Link
              to="/lecturer/appeals"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-bold transition-colors cursor-pointer"
            >
              <span>{t('appealReview.backToAppeals')}</span>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isPending = appeal.uiStatus === 'pending';
  const isAccepted = appeal.uiStatus === 'accepted';
  const isRejected = appeal.uiStatus === 'rejected';
  const canResolve = appeal.status === 'UNDER_REVIEW' && appeal.reviewerId === lecturerId;
  const claimedByOther = appeal.status === 'UNDER_REVIEW' && appeal.reviewerId !== lecturerId;
  const claimError = claimMutation.error instanceof Error ? claimMutation.error.message : null;

  return (
    <MainLayout portalName={isEn ? "Lecturer Portal" : "פורטל מרצים"} view="lecturer">
      <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-[#263330] pb-6">
          <Link
            to="/lecturer/appeals"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#00857e] dark:hover:text-teal-300 transition-colors mb-4 cursor-pointer"
          >
            <ChevronRight size={16} className={isEn ? "rotate-180" : ""} /> {t('appealReview.backToAppeals')}
          </Link>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                {isEn ? `Review Appeal: ${appeal.studentName}` : `בדיקת ערעור: ${appeal.studentName}`}
                {appeal.studentId && (
                  <span className="text-sm font-normal text-gray-400 font-mono mt-1" dir="ltr">
                    ({appeal.studentId.slice(0, 8)})
                  </span>
                )}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-md text-sm font-bold">
                  {appeal.courseName}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  {appeal.assignmentName}
                </span>
                {appeal.formattedDate && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{appeal.formattedDate}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white dark:bg-[#17211f] border border-gray-200 dark:border-[#263330] rounded-2xl p-4 shadow-2xs">
              <div className={`text-center px-4 ${isEn ? 'border-r border-gray-200 dark:border-gray-800' : 'border-l border-gray-200 dark:border-gray-800'}`}>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('appealReview.originalGrade')}</div>
                <div className="text-2xl font-black text-[#00857e] dark:text-teal-300">{appeal.gradeDisplay}</div>
              </div>
              <div className="px-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('appeals.status')}</div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold block text-center ${
                    isPending
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      : isAccepted
                      ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                  }`}
                >
                  {isPending
                    ? t('appeals.waitingReview')
                    : isAccepted
                    ? (isEn ? 'Accepted' : 'התקבל')
                    : isRejected
                    ? (isEn ? 'Rejected' : 'נדחה')
                    : t('appeals.resolved')}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Context */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Claim */}
            <section className="bg-white dark:bg-[#17211f] rounded-2xl border border-gray-200 dark:border-[#263330] shadow-2xs overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                <h2 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <AlertCircle size={18} className="text-[#00857e] dark:text-teal-300" />
                  {t('appealReview.studentClaimTitle')}
                </h2>
              </div>
              <div className="p-6">
                {appeal.category && (
                  <p className="text-xs font-bold uppercase tracking-wide text-[#00857e] dark:text-teal-300 mb-3">
                    {appeal.category.replace('_', ' ')}
                  </p>
                )}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {appeal.reason || (isEn ? 'No specific justification provided by student.' : 'לא צוין נימוק מפורט על ידי הסטודנט.')}
                </p>
              </div>
            </section>

            {/* Attachments / Files */}
            {appeal.files && appeal.files.length > 0 && (
              <section className="bg-white dark:bg-[#17211f] rounded-2xl border border-gray-200 dark:border-[#263330] shadow-2xs overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                  <h2 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <FileText size={18} className="text-gray-500 dark:text-gray-400" />
                    {t('appealReview.attachmentsTitle')}
                  </h2>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {appeal.files.map((file, idx) => (
                    <div
                      key={file.id || idx}
                      className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 group"
                    >
                      <div className="w-10 h-10 bg-teal-100 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300 rounded-lg flex items-center justify-center shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate" dir="ltr">
                          {file.name || `File ${idx + 1}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {file.sizeBytes
                            ? `${Math.round(file.sizeBytes / 1024)} KB`
                            : 'Attachment'}
                        </p>
                      </div>
                      {file.downloadUrl && (
                        <button
                          type="button"
                          onClick={() => handleEvidenceDownload(file.fileId)}
                          className="p-1.5 text-gray-500 hover:text-[#00857e] dark:text-gray-400 dark:hover:text-teal-300 rounded-lg"
                          title={t('appealReview.download')}
                        >
                          <Download size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Original Evaluation Feedback */}
            <section className="bg-white dark:bg-[#17211f] rounded-2xl border border-gray-200 dark:border-[#263330] shadow-2xs overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                <h2 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Bot size={18} className="text-[#E8B43F]" />
                  {t('appealReview.originalFeedbackTitle')}
                </h2>
              </div>
              <div className="p-6">
                {appeal.evaluation?.feedback ? (
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    {appeal.evaluation.feedback}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    {isEn ? 'No previous automated feedback recorded.' : 'לא תועד משוב הערכה קודם במערכת.'}
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Decision Form */}
          <div className="space-y-6">
            {/* Manual Decision Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-[#17211f] rounded-2xl border border-gray-200 dark:border-[#263330] shadow-2xs overflow-hidden"
            >
              <div className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                <h3 className="font-bold text-gray-800 dark:text-gray-200">
                  {t('appealReview.lecturerDecisionTitle')}
                </h3>
              </div>
              <div className="p-6 space-y-6">
                {(submissionError || claimError) && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
                    {submissionError || claimError}
                  </div>
                )}
                {claimedByOther && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-xs">
                    {isEn ? 'Another lecturer has already claimed this appeal.' : 'מרצה אחר כבר שייך את הערעור אליו.'}
                  </div>
                )}
                {claimMutation.isPending && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-xs">
                    {isEn ? 'Claiming this appeal for review…' : 'הערעור משויך אליך לבדיקה…'}
                  </div>
                )}
                {!isPending && (
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm">
                    <strong>{isEn ? 'Decision recorded.' : 'ההחלטה נשמרה.'}</strong>
                    {appeal.resultEvaluation && (
                      <span className="block mt-1">
                        {isEn ? 'Revised grade' : 'ציון מתוקן'}: {appeal.resultEvaluation.score}/{appeal.resultEvaluation.maxScore}
                      </span>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    {t('appealReview.newGradeLabel')}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={maxScore}
                      value={newGrade}
                      onChange={(e) => setNewGrade(e.target.value)}
                      disabled={!canResolve}
                      className="w-24 text-center font-bold text-xl border border-gray-300 dark:border-gray-700 rounded-xl p-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00857e] focus:outline-none"
                    />
                    <span className="text-gray-500 dark:text-gray-400 font-bold">/ {maxScore}</span>

                    {Number(newGrade) > originalGrade && (
                      <span className="text-green-600 dark:text-green-400 text-sm font-bold bg-green-50 dark:bg-green-950/40 px-2.5 py-1 rounded-lg ms-auto">
                        +{Number(newGrade) - originalGrade} {t('appealReview.points')}
                      </span>
                    )}
                    {Number(newGrade) < originalGrade && Number(newGrade) !== 0 && (
                      <span className="text-red-600 dark:text-red-400 text-sm font-bold bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded-lg ms-auto">
                        {Number(newGrade) - originalGrade} {t('appealReview.points')}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    {t('appealReview.feedbackLabel')}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={lecturerFeedback}
                    onChange={(e) => setLecturerFeedback(e.target.value)}
                    maxLength={5000}
                    disabled={!canResolve}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00857e] focus:outline-none text-sm resize-none"
                    placeholder={t('appealReview.feedbackPlaceholder')}
                  ></textarea>
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full !rounded-xl"
                    disabled={!canResolve || resolveMutation.isPending}
                  >
                    {resolveMutation.isPending
                      ? t('appealReview.savingBtn')
                      : t('appealReview.submitDecisionBtn')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full !rounded-xl text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40 border-gray-200 dark:border-gray-700 hover:border-red-200"
                    disabled={!canResolve || resolveMutation.isPending}
                    onClick={() => {
                      const rejection =
                        isEn
                          ? "After a thorough review of your appeal claims, the implementation does not meet the necessary criteria. The original grade stands."
                          : "לאחר בדיקה מעמיקה של טענותיך, המימוש אינו עומד בקריטריונים הנדרשים. הציון המקורי נותר בעינו.";
                      setNewGrade(originalGrade);
                      setLecturerFeedback(rejection);
                      handleResolve('REJECTED', rejection);
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
