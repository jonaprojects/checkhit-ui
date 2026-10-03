import type { Route } from './+types/student.appeal';
import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { AlertCircle, CheckCircle2, ChevronRight, FileText, UploadCloud } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../components/MainLayout';
import { Button } from '../components/ui/Button';
import { Label, Select, Textarea } from '../components/ui/Input';
import { useCreateAppeal } from '../hooks/useCreateAppeal';
import { useStudentAssignmentDetail } from '../hooks/useStudentAssignmentDetail';
import type { AppealCategory } from '../lib/api/types';
import { getLtiSession } from '../lib/lti-session';

const MAX_PDF_BYTES = 20 * 1024 * 1024;

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Appeal Assignment | Check Hit' }];
}

export default function StudentAppealRoute() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const { assignmentId } = useParams();
  const session = getLtiSession();
  const assignmentQuery = useStudentAssignmentDetail(assignmentId, isEn, {
    ltik: session.ltik,
    userId: session.userId,
  });
  const createMutation = useCreateAppeal(assignmentId);
  const [category, setCategory] = useState<AppealCategory | ''>('');
  const [reason, setReason] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const assignment = assignmentQuery.data;
  const submission = assignment?.submission;
  const evaluation = submission?.evaluation;
  const canAppeal =
    submission?.status === 'SUBMITTED' &&
    evaluation?.status === 'COMPLETED' &&
    evaluation.score !== null &&
    !assignment?.appeal;

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setValidationError(null);
    if (!file) return setSelectedFile(null);
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setValidationError(isEn ? 'Evidence must be a PDF file.' : 'האסמכתא חייבת להיות קובץ PDF.');
      event.target.value = '';
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      setValidationError(isEn ? 'The PDF may not exceed 20 MB.' : 'קובץ ה-PDF לא יכול לחרוג מ-20MB.');
      event.target.value = '';
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationError(null);
    const trimmedReason = reason.trim();
    if (!submission || !canAppeal) return;
    if (trimmedReason.length < 20 || trimmedReason.length > 5000) {
      setValidationError(
        isEn
          ? 'Explain your appeal using between 20 and 5,000 characters.'
          : 'יש להסביר את הערעור באמצעות 20 עד 5,000 תווים.',
      );
      return;
    }
    try {
      await createMutation.mutateAsync({
        submissionId: submission.id,
        reason: trimmedReason,
        category: category || undefined,
        file: selectedFile,
      });
      setIsSubmitted(true);
    } catch {
      // React Query exposes the server's validation/conflict message below.
    }
  };

  const backLink = assignmentId ? `/student/assignments/${assignmentId}` : '/student/assignments';

  if (assignmentQuery.isLoading) {
    return (
      <MainLayout portalName={isEn ? 'Student Portal' : 'פורטל סטודנטים'} view="student">
        <div className="max-w-3xl mx-auto space-y-5 animate-pulse">
          <div className="h-10 w-2/3 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        </div>
      </MainLayout>
    );
  }

  if (assignmentQuery.isError || !assignment) {
    return (
      <MainLayout portalName={isEn ? 'Student Portal' : 'פורטל סטודנטים'} view="student">
        <StateMessage
          title={isEn ? 'Assignment unavailable' : 'המטלה אינה זמינה'}
          detail={assignmentQuery.error instanceof Error ? assignmentQuery.error.message : ''}
          href="/student/assignments"
          isEn={isEn}
        />
      </MainLayout>
    );
  }

  if (isSubmitted) {
    return (
      <MainLayout portalName={isEn ? 'Student Portal' : 'פורטל סטודנטים'} view="student">
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <CheckCircle2 size={72} className="text-green-600 mb-5" />
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{t('appealForm.successTitle')}</h1>
          <p className="text-gray-500 max-w-md mb-8">{t('appealForm.successDesc')}</p>
          <Link to={backLink} className="bg-[#00857e] text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700">
            {isEn ? 'Back to assignment' : 'חזרה למטלה'}
          </Link>
        </div>
      </MainLayout>
    );
  }

  if (!canAppeal) {
    const detail = assignment.appeal
      ? (isEn ? 'An appeal already exists for this submission.' : 'כבר קיים ערעור עבור הגשה זו.')
      : (isEn ? 'Only a completed, graded submission can be appealed.' : 'ניתן לערער רק על הגשה שנבדקה וקיבלה ציון.');
    return (
      <MainLayout portalName={isEn ? 'Student Portal' : 'פורטל סטודנטים'} view="student">
        <StateMessage title={isEn ? 'Appeal unavailable' : 'לא ניתן להגיש ערעור'} detail={detail} href={backLink} isEn={isEn} />
      </MainLayout>
    );
  }

  const serverError = createMutation.error instanceof Error ? createMutation.error.message : null;
  return (
    <MainLayout portalName={isEn ? 'Student Portal' : 'פורטל סטודנטים'} view="student">
      <div className="space-y-8 max-w-3xl mx-auto pb-12">
        <header className="border-b border-gray-200 dark:border-gray-800 pb-6">
          <Link to={backLink} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#00857e] mb-4">
            <ChevronRight size={16} className={isEn ? 'rotate-180' : ''} /> {t('appealForm.cancelAndReturn')}
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{t('appealForm.title')}</h1>
          <p className="text-gray-500 mt-2">
            {assignment.name} ({isEn ? 'Grade' : 'ציון'}: {evaluation?.score}/{evaluation?.maxScore || assignment.maxScore})
          </p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#17211f] rounded-xl border border-gray-200 dark:border-gray-800 p-8 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-sm flex gap-3">
            <AlertCircle className="shrink-0 text-blue-500" />
            <div><strong className="block mb-1">{t('appealForm.noticeTitle')}</strong>{t('appealForm.noticeDesc')}</div>
          </div>
          {(validationError || serverError) && (
            <div role="alert" className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm">
              {validationError || serverError}
            </div>
          )}
          <div>
            <Label>{t('appealForm.categoryLabel')}</Label>
            <Select value={category} onChange={(event) => setCategory(event.target.value as AppealCategory | '')}>
              <option value="">{t('appealForm.categorySelect')}</option>
              <option value="grading_error">{t('appealForm.catGradingError')}</option>
              <option value="misunderstanding">{t('appealForm.catMisunderstanding')}</option>
              <option value="technical">{t('appealForm.catTechnical')}</option>
              <option value="other">{t('appealForm.catOther')}</option>
            </Select>
          </div>
          <div>
            <Label>{t('appealForm.detailsLabel')}</Label>
            <Textarea required minLength={20} maxLength={5000} rows={6} value={reason} onChange={(event) => setReason(event.target.value)} className="resize-none" placeholder={t('appealForm.detailsPlaceholder')} />
            <p className="text-xs text-gray-400 mt-1 text-end">{reason.length}/5000</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('appealForm.filesLabel')}</label>
            {!selectedFile ? (
              <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center bg-gray-50 dark:bg-gray-800/40 hover:border-teal-300">
                <input type="file" accept="application/pdf,.pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={onFileChange} />
                <UploadCloud size={36} className="mx-auto mb-3 text-gray-400" />
                <p className="text-gray-700 dark:text-gray-300 font-bold">{t('appealForm.dragFiles')}</p>
                <p className="text-sm text-gray-500">{t('appealForm.pdfOnly')} · 20 MB</p>
              </div>
            ) : (
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <FileText className="text-[#00857e]" />
                <div className="flex-1 min-w-0"><p className="font-bold truncate" dir="ltr">{selectedFile.name}</p><p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p></div>
                <Button type="button" variant="danger" size="sm" onClick={() => setSelectedFile(null)} disabled={createMutation.isPending}>{t('appealForm.removeFile')}</Button>
              </div>
            )}
          </div>
          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" size="lg" disabled={createMutation.isPending}>
              {createMutation.isPending ? t('appealForm.submitting') : t('appealForm.submitBtn')}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

function StateMessage({ title, detail, href, isEn }: { title: string; detail: string; href: string; isEn: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
      <AlertCircle size={56} className="text-amber-500 mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
      <p className="text-gray-500 mb-6">{detail}</p>
      <Link to={href} className="bg-[#00857e] text-white px-6 py-2.5 rounded-xl font-bold">
        {isEn ? 'Back' : 'חזרה'}
      </Link>
    </div>
  );
}
