import { useState, useRef } from 'react';
import { Link } from 'react-router';
import {
  UploadCloud,
  File as FileIcon,
  AlertCircle,
  Bot,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  MessageSquare,
  Download,
  Clock,
  Award,
  Layers,
  FileCheck,
  Info,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Save,
  LoaderCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StatusBadge } from './ui/StatusBadge';
import type { ProcessedStudentAssignmentDetail, ProcessedSubmissionFile } from '../hooks/useStudentAssignmentDetail';
import type { AppealStatus, EvaluationQuestionResult } from '../lib/api/types';
import {
  useSaveStudentSubmissionDraft,
  useSubmitStudentAssignment,
} from '../hooks/useStudentSubmission';
import { useEvaluationDetail } from '../hooks/useEvaluationDetail';
import { validateSubmissionFile } from '../lib/submission-validation';
import { ApiError } from '../lib/api/client';
import type { TFunction } from 'i18next';

function getSubmissionErrorMessage(error: unknown, t: TFunction): string {
  if (error instanceof ApiError) {
    if (error.status === 409) return t('assignmentDetail.errors.alreadySubmitted');
    if (error.status === 413) return t('assignmentDetail.errors.fileTooLarge');
    if (error.status === 401 || error.status === 403) return t('assignmentDetail.errors.unauthorized');
    if (error.status >= 500) return t('assignmentDetail.errors.server');
  }
  if (error instanceof TypeError) return t('assignmentDetail.errors.network');
  return t('assignmentDetail.errors.generic');
}

interface StudentAssignmentDetailProps {
  assignment: ProcessedStudentAssignmentDetail;
  onRefetch?: () => void;
}

export default function StudentAssignmentDetail({ assignment }: StudentAssignmentDetailProps) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const {
    id: assignmentId,
    name,
    course,
    courseId,
    description,
    evaluationInstructions,
    maxScore,
    type: assignmentType,
    formattedDueDate,
    formattedStartDate,
    isOverdue,
    studentStatus,
    submission,
    appeal,
  } = assignment;

  const [localSubmissionFile, setLocalSubmissionFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const saveDraftMutation = useSaveStudentSubmissionDraft();
  const submitMutation = useSubmitStudentAssignment();

  const isGraded = studentStatus === 'GRADED' && Boolean(submission?.evaluation);
  const isSubmittedNotGraded =
    submission?.status === 'SUBMITTED' &&
    (!submission.evaluation || submission.evaluation.status !== 'COMPLETED');
  const isNotSubmitted = !isGraded && !isSubmittedNotGraded;
  const draftSubmission = submission?.status === 'DRAFT' ? submission : null;
  const busyAction = saveDraftMutation.isPending
    ? 'draft'
    : submitMutation.isPending
      ? 'submit'
      : null;

  const validateSelectedFile = () => {
    if (!localSubmissionFile) return true;
    const validationError = validateSubmissionFile(localSubmissionFile);
    if (!validationError) return true;

    setFeedback({
      type: 'error',
      message: t(`assignmentDetail.fileValidation.${validationError}`),
    });
    return false;
  };

  const handleSaveDraft = async () => {
    if (!localSubmissionFile) {
      setFeedback({ type: 'error', message: t('assignmentDetail.fileValidation.draftRequiresFile') });
      return;
    }
    if (!validateSelectedFile()) return;

    setFeedback(null);
    try {
      await saveDraftMutation.mutateAsync({
        assignmentId,
        submissionId: draftSubmission?.id,
        file: localSubmissionFile,
      });
      setLocalSubmissionFile(null);
      setFeedback({ type: 'success', message: t('assignmentDetail.draftSaved') });
    } catch (error) {
      setFeedback({ type: 'error', message: getSubmissionErrorMessage(error, t) });
    }
  };

  const handleSubmit = async () => {
    const hasExistingDraftFile = Boolean(draftSubmission?.files.length);
    if (!localSubmissionFile && !hasExistingDraftFile) {
      setFeedback({ type: 'error', message: t('assignmentDetail.fileValidation.required') });
      return;
    }
    if (!validateSelectedFile()) return;

    setFeedback(null);
    try {
      await submitMutation.mutateAsync({
        assignmentId,
        submissionId: draftSubmission?.id,
        file: localSubmissionFile || undefined,
      });
      setLocalSubmissionFile(null);
      setFeedback({ type: 'success', message: t('assignmentDetail.submissionAccepted') });
    } catch (error) {
      setFeedback({ type: 'error', message: getSubmissionErrorMessage(error, t) });
    }
  };

  // Map API status to StatusBadge status
  const badgeStatus = isGraded
    ? 'checked'
    : isSubmittedNotGraded
    ? 'checking'
    : isOverdue
    ? 'pending'
    : 'pending';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-16">
      {/* Header/Breadcrumb */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/student/assignments"
          className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#17211f] rounded-xl border border-gray-200 dark:border-[#263330] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-2xs shrink-0"
          title={t('assignmentDetail.backToAssignments')}
        >
          {isEn ? <ArrowRight size={20} className="rotate-180" /> : <ArrowRight size={20} />}
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2 mb-1 w-full max-w-full overflow-hidden">
            <Link
              to={`/student/courses/${course?.id || courseId}`}
              className="hover:text-[#00857e] dark:hover:text-teal-300 transition-colors cursor-pointer whitespace-nowrap font-medium"
            >
              {course?.name || (isEn ? 'Course' : 'קורס')}
            </Link>
            <ChevronLeft size={14} className={`shrink-0 ${isEn ? 'rotate-180' : ''}`} />
            <span className="text-gray-800 dark:text-gray-200 font-semibold truncate">{name}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white truncate">{name}</h1>
            <StatusBadge type="assignment" status={badgeStatus} rounded="md" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#17211f] rounded-xl border border-gray-200 dark:border-[#263330] overflow-hidden shadow-xs">
        {/* Assignment Details Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Layers size={20} className="text-[#00857e] dark:text-teal-400" />
              {t('assignmentDetail.instructions')}
            </h2>
            <div className="flex items-center gap-2">
              {assignmentType && (
                <span className="bg-teal-50 dark:bg-teal-950/50 text-[#00857e] dark:text-teal-300 border border-teal-200/70 dark:border-teal-800/60 px-3 py-1 rounded-md text-xs font-bold shadow-2xs">
                  {assignmentType}
                </span>
              )}
              {maxScore && (
                <span className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-md text-xs font-bold shadow-2xs flex items-center gap-1.5">
                  <Award size={14} className="text-amber-500" />
                  {maxScore} {isEn ? 'pts' : 'נקודות'}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-line text-sm sm:text-base">
            {description || (isEn ? 'No instructions provided.' : 'לא הוזנו הנחיות למטלה זו.')}
          </div>

          {/* Evaluation Instructions / Rubric Note if exists */}
          {evaluationInstructions && (
            <div className="mb-6 p-4 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40">
              <h3 className="text-sm font-bold text-[#00857e] dark:text-teal-300 mb-1 flex items-center gap-1.5">
                <Info size={16} />
                {t('assignmentDetail.evalInstructions')}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {evaluationInstructions}
              </p>
            </div>
          )}

          {/* Metadata Badges */}
          <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
            <div
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 border shadow-2xs ${
                isOverdue && isNotSubmitted
                  ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900/50'
                  : 'bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700/60'
              }`}
            >
              <Clock size={16} className={isOverdue && isNotSubmitted ? 'text-red-500' : 'text-[#00857e] dark:text-teal-400'} />
              <span>
                {t('assignmentDetail.dueDate')} {formattedDueDate}
              </span>
              {isOverdue && isNotSubmitted && (
                <span className="text-xs font-bold bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded ms-1">
                  {t('assignmentDetail.overdue')}
                </span>
              )}
            </div>

            {formattedStartDate && (
              <div className="bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium flex items-center gap-2 border border-gray-200 dark:border-gray-700/60 shadow-2xs">
                <Clock size={16} className="text-gray-400" />
                <span>
                  {t('assignmentDetail.startDate')} {formattedStartDate}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* State-dependent Dynamic UI */}
        <div className="p-6 md:p-8 bg-gray-50/30 dark:bg-[#121c1a]/50">
          {feedback && (
            <div
              role={feedback.type === 'error' ? 'alert' : 'status'}
              className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
                feedback.type === 'error'
                  ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300'
              }`}
            >
              {feedback.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              <span>{feedback.message}</span>
            </div>
          )}

          {isGraded && submission && (
            <GradedView
              assignment={assignment}
              submission={submission}
              appeal={appeal}
              isEn={isEn}
              onReset={() => {
                setLocalSubmissionFile(null);
              }}
            />
          )}

          {isSubmittedNotGraded && (
            <CheckingView
              submission={submission}
              localFile={localSubmissionFile}
              isEn={isEn}
            />
          )}

          {isNotSubmitted && (
            <NotSubmittedView
              selectedFile={localSubmissionFile}
              setSelectedFile={setLocalSubmissionFile}
              existingFiles={draftSubmission?.files || []}
              isDraft={Boolean(draftSubmission)}
              busyAction={busyAction}
              onSaveDraft={handleSaveDraft}
              onSubmit={handleSubmit}
              onFileRejected={(message) => setFeedback({ type: 'error', message })}
              isOverdue={isOverdue}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 1. NOT SUBMITTED VIEW (Drag & Drop File Upload)
 */
interface NotSubmittedViewProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  existingFiles: ProcessedSubmissionFile[];
  isDraft: boolean;
  busyAction: 'draft' | 'submit' | null;
  onSaveDraft: () => void;
  onSubmit: () => void;
  onFileRejected: (message: string) => void;
  isOverdue: boolean;
}

function NotSubmittedView({
  selectedFile,
  setSelectedFile,
  existingFiles,
  isDraft,
  busyAction,
  onSaveDraft,
  onSubmit,
  onFileRejected,
  isOverdue,
}: NotSubmittedViewProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = (file?: File) => {
    if (file) {
      const validationError = validateSubmissionFile(file);
      if (validationError) {
        onFileRejected(t(`assignmentDetail.fileValidation.${validationError}`));
        return;
      }
      setSelectedFile(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  if (selectedFile || isDraft) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-[#17211f] shadow-sm max-w-lg mx-auto">
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={onFileInputChange}
          accept=".pdf,.md,.zip"
        />

        {isDraft && (
          <div className="mb-4 w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
            <p className="font-bold">{t('assignmentDetail.draftTitle')}</p>
            <p className="mt-0.5 text-xs">{t('assignmentDetail.draftDesc')}</p>
          </div>
        )}

        {selectedFile ? (
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/60 w-full p-4 rounded-lg border border-gray-100 dark:border-gray-800 mb-6">
          <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300 rounded-full flex items-center justify-center shrink-0">
            <FileIcon size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-800 dark:text-gray-200 truncate text-start" dir="ltr">
              {selectedFile.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-start">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={() => setSelectedFile(null)}
            className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 font-medium px-3 py-1.5 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/60 rounded-md transition-colors whitespace-nowrap cursor-pointer"
            disabled={Boolean(busyAction)}
          >
            {t('assignmentDetail.removeFile')}
          </button>
          </div>
        ) : (
          <div className="w-full space-y-2 mb-6">
            {existingFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/60">
                <FileIcon size={20} className="shrink-0 text-[#00857e] dark:text-teal-300" />
                <div className="min-w-0 text-start">
                  <p className="truncate text-sm font-bold text-gray-800 dark:text-gray-200" dir="ltr">{file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{file.formattedSize}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={Boolean(busyAction)}
          className="mb-4 text-sm font-bold text-[#00857e] hover:underline disabled:opacity-50 dark:text-teal-300"
        >
          {selectedFile || existingFiles.length ? t('assignmentDetail.replaceFile') : t('assignmentDetail.chooseFile')}
        </button>

        {isOverdue && (
          <div className="mb-4 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 px-3 py-2 rounded-lg w-full">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{t('assignmentDetail.overdueWarning')}</span>
          </div>
        )}

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onSaveDraft}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 font-bold text-gray-700 shadow-xs transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            disabled={Boolean(busyAction) || !selectedFile}
          >
            {busyAction === 'draft' ? <LoaderCircle size={17} className="animate-spin" /> : <Save size={17} />}
            {busyAction === 'draft' ? t('assignmentDetail.savingDraft') : t('assignmentDetail.saveDraft')}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#00857e] px-5 py-3 font-bold text-white shadow-sm transition-colors hover:bg-teal-700 disabled:opacity-50 dark:bg-teal-600 dark:hover:bg-teal-500"
            disabled={Boolean(busyAction)}
          >
            {busyAction === 'submit' && <LoaderCircle size={17} className="animate-spin" />}
            {busyAction === 'submit' ? t('assignmentDetail.uploading') : t('assignmentDetail.submit')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl transition-colors cursor-pointer group ${
        isDragging
          ? 'border-[#00857e] bg-teal-50/50 dark:bg-teal-950/20'
          : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-[#17211f] hover:border-[#00857e] dark:hover:border-teal-400 hover:bg-teal-50/40 dark:hover:bg-teal-950/10'
      }`}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={onFileInputChange}
        accept=".pdf,.md,.zip"
      />
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
          isDragging
            ? 'bg-teal-100 text-[#00857e]'
            : 'bg-gray-50 dark:bg-gray-800 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/60 text-gray-400 dark:text-gray-400 group-hover:text-[#00857e] dark:group-hover:text-teal-300'
        }`}
      >
        <UploadCloud size={32} />
      </div>
      <h3
        className={`text-xl font-bold mb-2 transition-colors ${
          isDragging ? 'text-[#00857e] dark:text-teal-300' : 'text-gray-800 dark:text-gray-200 group-hover:text-[#00857e] dark:group-hover:text-teal-300'
        }`}
      >
        {t('assignmentDetail.dragFiles')}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm text-center max-w-sm">
        {t('assignmentDetail.fileRules')}
      </p>
      <button className="mt-8 bg-[#00857e] dark:bg-teal-600 text-white px-8 py-2.5 rounded-lg font-bold shadow-sm hover:bg-teal-700 dark:hover:bg-teal-500 transition-colors disabled:opacity-50 cursor-pointer">
        {t('assignmentDetail.chooseFile')}
      </button>
    </div>
  );
}

/**
 * 2. SUBMITTED / CHECKING VIEW (Awaiting grading or in processing)
 */
interface CheckingViewProps {
  submission: ProcessedStudentAssignmentDetail['submission'];
  localFile: File | null;
  isEn: boolean;
  onSimulateGraded?: () => void;
}

function CheckingView({ submission, localFile, isEn }: CheckingViewProps) {
  const { t } = useTranslation();

  const files = submission?.files || [];
  const submittedDate = submission?.formattedSubmittedAt;
  const evaluationStatus = submission?.evaluation?.status;
  const isPending = !evaluationStatus || evaluationStatus === 'PENDING';
  const isFailed = evaluationStatus === 'FAILED';

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#17211f] rounded-xl border border-[#E8B43F]/50 dark:border-amber-600/40 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E8B43F]/10 dark:via-amber-500/10 to-transparent animate-[pulse_2s_infinite]"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#E8B43F] opacity-30 animate-ping"></div>
            <div className="w-20 h-20 bg-gradient-to-br from-[#E8B43F] to-amber-600 text-white rounded-full flex items-center justify-center shadow-lg relative z-10">
              <Bot size={40} className="animate-pulse" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-2">
            {isFailed
              ? t('assignmentDetail.evaluationFailed')
              : isPending
                ? t('assignmentDetail.evaluationPending')
                : t('assignmentDetail.aiChecking')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md leading-relaxed text-sm">
            {isFailed
              ? t('assignmentDetail.evaluationFailedDesc')
              : isPending
                ? t('assignmentDetail.evaluationPendingDesc')
                : t('assignmentDetail.aiCheckingDesc')}
          </p>

          {!isFailed && (
            <div className="w-full max-w-xs bg-gray-100 dark:bg-gray-800 h-2 rounded-full mt-6 overflow-hidden">
              <div
                className={`bg-[#E8B43F] h-full rounded-full animate-pulse transition-all duration-1000 ${
                  isPending ? 'w-1/3' : 'w-2/3'
                }`}
              ></div>
            </div>
          )}

          {submittedDate && (
            <p className="text-xs text-gray-400 dark:text-gray-400 mt-4 flex items-center gap-1.5">
              <Clock size={14} />
              <span>
                {t('assignmentDetail.submittedAt')} {submittedDate}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Submitted Files List */}
      {(files.length > 0 || localFile) && (
        <div className="bg-white dark:bg-[#17211f] rounded-xl p-6 border border-gray-200 dark:border-[#263330] shadow-xs">
          <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <FileCheck size={18} className="text-[#00857e] dark:text-teal-400" />
            {t('assignmentDetail.yourFiles')}
          </h4>
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300 rounded-lg flex items-center justify-center shrink-0">
                    <FileIcon size={18} />
                  </div>
                  <div className="min-w-0 text-start">
                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate" dir="ltr">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">{file.formattedSize}</p>
                  </div>
                </div>
                {file.downloadUrl && (
                  <a
                    href={file.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    <Download size={16} />
                  </a>
                )}
              </div>
            ))}

            {localFile && files.length === 0 && (
              <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300 rounded-lg flex items-center justify-center shrink-0">
                    <FileIcon size={18} />
                  </div>
                  <div className="min-w-0 text-start">
                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate" dir="ltr">
                      {localFile.name}
                    </p>
                    <p className="text-xs text-gray-400">{(localFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 3. GRADED VIEW (Evaluation results, feedback, appeal status/trigger)
 */
interface GradedViewProps {
  assignment: ProcessedStudentAssignmentDetail;
  submission: NonNullable<ProcessedStudentAssignmentDetail['submission']>;
  appeal: ProcessedStudentAssignmentDetail['appeal'];
  isEn: boolean;
  onReset: () => void;
}

function GradedView({ assignment, submission, appeal, isEn, onReset }: GradedViewProps) {
  const { t } = useTranslation();
  const evaluation = submission.evaluation;
  const score = evaluation?.score ?? 0;
  const maxScore = evaluation?.maxScore || assignment.maxScore || 100;
  const files = submission.files || [];
  const evaluationDetail = useEvaluationDetail(evaluation?.id);
  const questionResults = [...(evaluationDetail.data?.questionResults ?? [])].sort(
    (a, b) => (a.orderIndex ?? Number.MAX_SAFE_INTEGER) - (b.orderIndex ?? Number.MAX_SAFE_INTEGER)
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Grade Banner */}
      <div className="bg-[#00857e] dark:bg-teal-900 rounded-xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute top-0 end-0 opacity-10 pointer-events-none text-[150px] font-black leading-none -mt-4 -me-4 select-none">
          {score}
        </div>

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner shrink-0">
            <CheckCircle2 size={36} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-1">{t('assignmentDetail.checkedSuccessfully')}</h3>
            <p className="text-teal-100 flex items-center gap-2 font-medium text-sm">
              <Bot size={18} />
              {t('assignmentDetail.aiEvalComplete')}
            </p>
            {evaluation?.formattedEvaluatedAt && (
              <p className="text-teal-200/80 text-xs mt-1">
                {t('assignmentDetail.evaluatedAt')} {evaluation.formattedEvaluatedAt}
              </p>
            )}
          </div>
        </div>

        <div className="text-center bg-white dark:bg-[#17211f] text-[#00857e] dark:text-teal-300 px-8 py-4 rounded-xl shadow-sm relative z-10 min-w-[140px]">
          <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
            {t('assignmentDetail.finalGrade')}
          </span>
          <span className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white">{score}</span>
          <span className="text-lg font-bold text-gray-400 ms-0.5">/{maxScore}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Main Feedback Column */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('assignmentDetail.evalDetails')}</h3>

          {/* Feedback Card */}
          <div className="bg-white dark:bg-[#17211f] rounded-xl p-6 border border-gray-200 dark:border-[#263330] shadow-xs relative overflow-hidden">
            <div className="absolute top-0 start-0 w-1.5 h-full bg-[#E8B43F]"></div>
            <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Bot className="text-[#E8B43F]" /> {t('assignmentDetail.aiFeedback')}
            </h4>

            {evaluation?.feedback ? (
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base whitespace-pre-line bg-gray-50/70 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                {evaluation.feedback}
              </div>
            ) : (
              <div className="space-y-3">
                <FeedbackItem
                  type="positive"
                  text={
                    isEn
                      ? 'The implementation meets all core functional requirements and edge cases.'
                      : 'המימוש עומד בכל דרישות הפונקציונליות ומקרי הקצה.'
                  }
                />
                <FeedbackItem
                  type="positive"
                  text={
                    isEn
                      ? 'Clean code structure with appropriate naming conventions.'
                      : 'מבנה קוד נקי ותקני עם שמות משתנים ברורים.'
                  }
                />
              </div>
            )}
          </div>

          <section className="space-y-4" aria-labelledby="question-results-heading">
            <div>
              <h4
                id="question-results-heading"
                className="text-xl font-bold text-gray-900 dark:text-gray-100"
              >
                {t('assignmentDetail.questionResults')}
              </h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('assignmentDetail.questionResultsDesc')}
              </p>
            </div>

            {evaluationDetail.isLoading && (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500 dark:border-[#263330] dark:bg-[#17211f] dark:text-gray-400">
                <LoaderCircle size={18} className="animate-spin text-[#00857e] dark:text-teal-400" />
                {t('assignmentDetail.loadingQuestionResults')}
              </div>
            )}

            {evaluationDetail.isError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                <div className="flex items-start gap-2">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{t('assignmentDetail.questionResultsError')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => evaluationDetail.refetch()}
                  className="mt-3 font-bold underline underline-offset-2"
                >
                  {t('assignmentDetail.retry')}
                </button>
              </div>
            )}

            {evaluationDetail.isSuccess && questionResults.length === 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500 dark:border-[#263330] dark:bg-[#17211f] dark:text-gray-400">
                {t('assignmentDetail.noQuestionResults')}
              </div>
            )}

            {questionResults.map((result, index) => (
              <QuestionResultCard key={result.id} result={result} fallbackNumber={index + 1} />
            ))}
          </section>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-4">
          {/* Submission Files Card */}
          <div className="bg-white dark:bg-[#17211f] rounded-xl p-5 border border-gray-200 dark:border-[#263330] shadow-xs text-start">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-teal-50 dark:bg-teal-950/60 text-[#00857e] dark:text-teal-300 rounded-lg flex items-center justify-center shrink-0">
                <FileIcon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                  {t('assignmentDetail.yourFiles')}
                </h4>
                <p className="text-xs text-gray-400">
                  {t('assignmentDetail.attempt')} #{submission.attemptNumber || 1}
                </p>
              </div>
            </div>

            {files.length > 0 ? (
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[140px]" dir="ltr">
                      {file.name}
                    </span>
                    <span className="text-gray-400">{file.formattedSize}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isEn ? 'Solution submitted' : 'ההגשה נקלטה במערכת'}
              </p>
            )}
          </div>

          {/* Appeal Status or Submit Appeal CTA */}
          {appeal ? (
            <AppealStatusCard appeal={appeal} isEn={isEn} />
          ) : (
            <div className="bg-teal-50/70 dark:bg-teal-950/30 rounded-xl p-5 border border-teal-100 dark:border-teal-900/40">
              <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1.5 flex items-center gap-1.5">
                <MessageSquare size={16} className="text-[#00857e] dark:text-teal-300" />
                {t('assignmentDetail.unfairGrade')}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                {t('assignmentDetail.appealDesc')}
              </p>
              <Link
                to={`/student/assignments/${assignment.id}/appeal`}
                className="w-full bg-white dark:bg-[#17211f] text-[#00857e] dark:text-teal-300 border-2 border-[#00857e] dark:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950/50 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-2xs flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} />
                {t('assignmentDetail.submitAppeal')}
              </Link>
            </div>
          )}

          <button
            onClick={onReset}
            className="w-full text-center text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 py-1.5 transition-colors cursor-pointer"
          >
            {t('assignmentDetail.resubmitPrac')}
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestionResultCard({
  result,
  fallbackNumber,
}: {
  result: EvaluationQuestionResult;
  fallbackNumber: number;
}) {
  const { t } = useTranslation();
  const questionLabel =
    result.questionKey || t('assignmentDetail.questionNumber', { number: fallbackNumber });

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs dark:border-[#263330] dark:bg-[#17211f]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-teal-50 px-2.5 py-1 text-xs font-bold text-[#00857e] dark:bg-teal-950/60 dark:text-teal-300">
              {questionLabel}
            </span>
            {!result.isAnswered && (
              <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                {t('assignmentDetail.unanswered')}
              </span>
            )}
            {!result.countsTowardTotal && (
              <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {t('assignmentDetail.notCounted')}
              </span>
            )}
          </div>
          {result.prompt && (
            <p className="whitespace-pre-line text-sm font-semibold leading-relaxed text-gray-800 dark:text-gray-200">
              {result.prompt}
            </p>
          )}
        </div>
        <div className="shrink-0 rounded-lg bg-gray-50 px-4 py-2 text-center dark:bg-gray-800/70">
          <span className="text-xl font-black text-gray-900 dark:text-white">{result.score}</span>
          <span className="text-sm font-bold text-gray-400">/{result.maxScore}</span>
          <span className="ms-1 text-xs text-gray-500 dark:text-gray-400">
            {t('assignmentDetail.points')}
          </span>
        </div>
      </div>

      <div className="space-y-4 px-5 py-4">
        {result.feedback && (
          <div>
            <h5 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {t('assignmentDetail.questionFeedback')}
            </h5>
            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {result.feedback}
            </p>
          </div>
        )}

        {result.evidence && (
          <div className="rounded-lg border border-teal-100 bg-teal-50/60 p-3 dark:border-teal-900/50 dark:bg-teal-950/20">
            <h5 className="mb-1 text-xs font-bold text-[#00857e] dark:text-teal-300">
              {t('assignmentDetail.evidence')}
            </h5>
            <p className="whitespace-pre-line text-sm italic leading-relaxed text-gray-700 dark:text-gray-300">
              “{result.evidence}”
            </p>
          </div>
        )}

        {!result.countsTowardTotal && result.selectionReason && (
          <p className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Info size={14} className="mt-0.5 shrink-0" />
            <span>{result.selectionReason}</span>
          </p>
        )}
      </div>
    </article>
  );
}

/**
 * 4. APPEAL STATUS CARD (When student already appealed)
 */
function AppealStatusCard({
  appeal,
  isEn,
}: {
  appeal: NonNullable<ProcessedStudentAssignmentDetail['appeal']>;
  isEn: boolean;
}) {
  const { t } = useTranslation();

  const getStatusBadge = (status: AppealStatus) => {
    switch (status) {
      case 'ACCEPTED':
        return {
          bg: 'bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800/60',
          text: 'text-green-800 dark:text-green-300',
          title: t('assignmentDetail.appealAccepted'),
          icon: <CheckCircle2 size={16} className="text-green-600" />,
        };
      case 'REJECTED':
        return {
          bg: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60',
          text: 'text-red-800 dark:text-red-300',
          title: t('assignmentDetail.appealRejected'),
          icon: <AlertCircle size={16} className="text-red-600" />,
        };
      case 'UNDER_REVIEW':
      case 'SUBMITTED':
      default:
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
          text: 'text-amber-800 dark:text-amber-300',
          title: t('assignmentDetail.appealUnderReview'),
          icon: <Clock size={16} className="text-amber-600" />,
        };
    }
  };

  const style = getStatusBadge(appeal.status);

  return (
    <div className={`rounded-xl p-5 border ${style.bg} space-y-3`}>
      <div className="flex items-center justify-between">
        <span className={`font-bold text-xs flex items-center gap-1.5 ${style.text}`}>
          {style.icon}
          {style.title}
        </span>
        {appeal.formattedCreatedAt && (
          <span className="text-[11px] text-gray-500 dark:text-gray-400">{appeal.formattedCreatedAt}</span>
        )}
      </div>

      {appeal.reason && (
        <div className="bg-white/70 dark:bg-gray-800/60 p-3 rounded-lg border border-black/5 dark:border-white/5">
          <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
            {t('assignmentDetail.appealReason')}:
          </p>
          <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed italic">"{appeal.reason}"</p>
        </div>
      )}

      {appeal.resolution && (
        <div className="bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg border border-black/5 dark:border-white/5">
          <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1">
            {t('assignmentDetail.appealResolution')}:
          </p>
          <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">{appeal.resolution}</p>
        </div>
      )}
    </div>
  );
}

function FeedbackItem({ type, text }: { type: 'positive' | 'warning' | 'negative'; text: string }) {
  const styles = {
    positive: {
      bg: 'bg-green-50/80 dark:bg-green-950/30',
      border: 'border-green-200/80 dark:border-green-900/50',
      text: 'text-green-800 dark:text-green-300',
      icon: <CheckCircle2 size={18} className="text-green-600 dark:text-green-400 mt-0.5 shrink-0" />,
    },
    warning: {
      bg: 'bg-yellow-50/80 dark:bg-yellow-950/30',
      border: 'border-yellow-200/80 dark:border-yellow-900/50',
      text: 'text-yellow-800 dark:text-yellow-300',
      icon: <AlertCircle size={18} className="text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />,
    },
    negative: {
      bg: 'bg-red-50/80 dark:bg-red-950/30',
      border: 'border-red-200/80 dark:border-red-900/50',
      text: 'text-red-800 dark:text-red-300',
      icon: <AlertCircle size={18} className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" />,
    },
  };

  const style = styles[type];

  return (
    <div className={`p-3.5 rounded-lg border ${style.bg} ${style.border} flex items-start gap-3`}>
      {style.icon}
      <p className={`text-sm font-medium ${style.text}`}>{text}</p>
    </div>
  );
}
