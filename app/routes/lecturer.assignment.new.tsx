import { useMemo, useState, type FormEvent } from "react";
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Plus,
  Save,
  Settings,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router";
import type { Route } from "./+types/lecturer.assignment.new";
import MainLayout from "../components/MainLayout";
import {
  createAssignment,
  generateDeeplink,
  getQuestionImportStatus,
  importAssignmentQuestions,
  replaceAssignmentQuestions,
  type AssignmentQuestionInput,
  type AssignmentStatus,
} from "../lib/api";
import { getLtiSession } from "../lib/lti-session";

type QuestionMode = "none" | "manual" | "document";
type ManualQuestion = Omit<AssignmentQuestionInput, "orderIndex"> & {
  id: number;
  maxScoreText: string;
};

const fieldClass =
  "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/70 p-3 text-gray-900 dark:text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#00857e] disabled:cursor-not-allowed disabled:opacity-60";

const toIsoDate = (value: FormDataEntryValue | null): string | null => {
  if (typeof value !== "string" || !value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const waitForQuestionImport = async (
  importId: string,
  ltik: string,
  onProgress: (message: string) => void,
): Promise<void> => {
  const maxPolls = 120;

  for (let poll = 0; poll < maxPolls; poll += 1) {
    const result = await getQuestionImportStatus(importId, ltik);
    if (result.status === "COMPLETED") return;
    if (result.status === "FAILED" || result.status === "SUPERSEDED") {
      throw new Error(
        result.errorMessage || "עיבוד מסמך השאלות לא הושלם בהצלחה.",
      );
    }

    onProgress(
      result.status === "PROCESSING"
        ? `מעבד את מסמך השאלות (ניסיון ${result.attemptCount}/${result.maxAttempts})...`
        : "מסמך השאלות ממתין לעיבוד...",
    );
    await new Promise((resolve) => window.setTimeout(resolve, 2_000));
  }

  throw new Error("עיבוד מסמך השאלות נמשך זמן רב מדי. ניתן לבדוק אותו מאוחר יותר.");
};

export function meta({}: Route.MetaArgs) {
  return [{ title: "Create Assignment | Check Hit" }];
}

export default function LecturerAssignmentNewRoute() {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionStage, setSubmissionStage] = useState("");
  const [assignmentType, setAssignmentType] = useState("file");
  const [questionMode, setQuestionMode] = useState<QuestionMode>("none");
  const [questionFile, setQuestionFile] = useState<File | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<ManualQuestion[]>([
    {
      id: 1,
      questionKey: "1",
      prompt: "",
      rubric: null,
      maxScore: 0,
      maxScoreText: "",
    },
  ]);

  const questionTotal = useMemo(
    () =>
      questions.reduce(
        (sum, question) => sum + (Number(question.maxScoreText) || 0),
        0,
      ),
    [questions],
  );
  const activeQuestion = questions[activeQuestionIndex] ?? questions[0];

  const updateQuestion = (
    id: number,
    field: "questionKey" | "prompt" | "rubric" | "maxScoreText",
    value: string,
  ) => {
    setQuestions((current) =>
      current.map((question) =>
        question.id === id
          ? {
              ...question,
              [field]: field === "rubric" ? value || null : value,
            }
          : question,
      ),
    );
  };

  const addQuestion = () => {
    setQuestions((current) => {
      const nextQuestions = [
        ...current,
        {
        id: Math.max(...current.map((question) => question.id), 0) + 1,
        questionKey: String(current.length + 1),
        prompt: "",
        rubric: null,
        maxScore: 0,
        maxScoreText: "",
      },
      ];
      setActiveQuestionIndex(nextQuestions.length - 1);
      return nextQuestions;
    });
  };

  const removeQuestion = (id: number) => {
    setQuestions((current) => {
      if (current.length === 1) return current;
      const nextQuestions = current.filter((question) => question.id !== id);
      setActiveQuestionIndex((index) =>
        Math.min(index, nextQuestions.length - 1),
      );
      return nextQuestions;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const status: AssignmentStatus =
      submitter?.value === "DRAFT" ? "DRAFT" : "PUBLISHED";
    const ltik = searchParams.get("ltik") || getLtiSession().ltik;

    if (!courseId || !ltik) {
      setSubmitError("לא ניתן ליצור מטלה ללא פרטי הקורס והפעלת Moodle.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const startAt = toIsoDate(formData.get("startAt"));
    const dueAt = toIsoDate(formData.get("dueAt"));
    const maxScore = Number(formData.get("maxScore"));
    const type =
      assignmentType === "other"
        ? String(formData.get("customType") ?? "").trim()
        : assignmentType;

    if (!type) {
      setSubmitError("יש להזין סוג מטלה.");
      return;
    }

    if (startAt && dueAt && new Date(dueAt) <= new Date(startAt)) {
      setSubmitError("מועד ההגשה חייב להיות מאוחר ממועד הפתיחה.");
      return;
    }

    let manualQuestions: AssignmentQuestionInput[] = [];
    if (questionMode === "manual") {
      manualQuestions = questions.map((question, orderIndex) => ({
        questionKey: question.questionKey.trim(),
        orderIndex,
        prompt: question.prompt.trim(),
        rubric: question.rubric?.trim() || null,
        maxScore: Number(question.maxScoreText),
      }));

      const invalidQuestionIndex = manualQuestions.findIndex(
        (question) =>
          !question.questionKey ||
          !question.prompt ||
          !Number.isFinite(question.maxScore) ||
          question.maxScore <= 0,
      );
      if (invalidQuestionIndex >= 0) {
        setActiveQuestionIndex(invalidQuestionIndex);
        setSubmitError("יש למלא מפתח, נוסח וציון חיובי לכל שאלה.");
        return;
      }

      if (new Set(manualQuestions.map((question) => question.questionKey)).size !== manualQuestions.length) {
        const duplicateIndex = manualQuestions.findIndex(
          (question, index) =>
            manualQuestions.findIndex(
              (candidate) => candidate.questionKey === question.questionKey,
            ) !== index,
        );
        if (duplicateIndex >= 0) setActiveQuestionIndex(duplicateIndex);
        setSubmitError("המפתח של כל שאלה חייב להיות ייחודי.");
        return;
      }

      if (questionTotal < maxScore) {
        setSubmitError("סכום ציוני השאלות חייב להיות לפחות הציון המרבי של המטלה.");
        return;
      }
    }

    if (questionMode === "document" && !questionFile) {
      setSubmitError("יש לבחור מסמך שאלות לייבוא.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmissionStage("יוצר את המטלה...");

    let assignmentCreated = false;
    try {
      const assignment = await createAssignment(courseId, ltik, {
        name: String(formData.get("name") ?? "").trim(),
        description: String(formData.get("description") ?? "").trim(),
        type,
        evaluationInstructions: String(
          formData.get("evaluationInstructions") ?? "",
        ).trim(),
        maxScore,
        startAt,
        dueAt,
        status,
      });
      assignmentCreated = true;

      if (!assignment.id) {
        throw new Error("השרת לא החזיר מזהה עבור המטלה שנוצרה.");
      }

      if (questionMode === "manual") {
        setSubmissionStage("שומר את השאלות ומחוון הבדיקה...");
        await replaceAssignmentQuestions(assignment.id, ltik, manualQuestions);
      } else if (questionMode === "document" && questionFile) {
        setSubmissionStage("מעלה את מסמך השאלות לעיבוד...");
        const questionImport = await importAssignmentQuestions(
          assignment.id,
          ltik,
          questionFile,
        );
        await waitForQuestionImport(
          questionImport.importId,
          ltik,
          setSubmissionStage,
        );
      }

      setSubmissionStage("מחבר את המטלה ל-Moodle...");
      const deepLinkForm = await generateDeeplink(assignment.id, ltik);

      // ltijs returns an auto-submitting HTML form that completes the flow in Moodle.
      document.open();
      document.write(deepLinkForm);
      document.close();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "יצירת המטלה נכשלה.";
      setSubmitError(
        assignmentCreated
          ? `המטלה נוצרה, אך השלמת ההגדרה נכשלה: ${message}`
          : message,
      );
      setSubmissionStage("");
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout portalName="פורטל מרצים" view="lecturer" documentScroll>
      <div className="mx-auto max-w-5xl animate-in space-y-8 pb-12 duration-500 fade-in">
        <header className="border-b border-gray-200 pb-6 dark:border-gray-800">
          <Link
            to={`/lecturer/courses/${courseId}`}
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-[#00857e] dark:text-gray-400"
          >
            <ChevronRight size={16} /> ביטול וחזרה
          </Link>
          <div className="flex items-center gap-3">
            <span className="rounded bg-teal-50 px-2 py-1 text-sm font-bold tracking-widest text-[#00857e] dark:bg-teal-950/60 dark:text-teal-300">
              מטלה חדשה
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              יצירת מטלה חדשה
            </h1>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            הגדירו את פרטי המטלה, זמני הפרסום ואופן ההערכה.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-[#17211f] md:p-8"
        >
          <fieldset disabled={isSubmitting} className="space-y-8">
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-gray-800">
                <BookOpen size={19} className="text-[#00857e]" />
                <h2 className="font-bold text-gray-900 dark:text-white">פרטי המטלה</h2>
              </div>

              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
                  שם המטלה <span className="text-red-500">*</span>
                </label>
                <input id="name" name="name" type="text" required maxLength={255} className={fieldClass} placeholder="למשל: תרגיל בית 4: גרפים" />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="type" className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200">
                    <Settings size={16} className="text-[#00857e]" />
                    סוג מטלה <span className="text-red-500">*</span>
                  </label>
                  <select id="type" name="type" value={assignmentType} onChange={(event) => setAssignmentType(event.target.value)} className={fieldClass}>
                    <option value="file">העלאת קובץ</option>
                    <option value="text">הזנת טקסט חופשי</option>
                    <option value="github">קישור ל-GitHub Repository</option>
                    <option value="other">סוג אחר</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="maxScore" className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
                    ציון מרבי <span className="text-red-500">*</span>
                  </label>
                  <input id="maxScore" name="maxScore" type="number" min="0.01" step="0.01" defaultValue="100" required className={fieldClass} />
                </div>
              </div>

              {assignmentType === "other" && (
                <div>
                  <label htmlFor="customType" className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
                    שם סוג המטלה <span className="text-red-500">*</span>
                  </label>
                  <input id="customType" name="customType" type="text" required maxLength={100} className={fieldClass} />
                </div>
              )}

              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
                  תיאור והנחיות לסטודנטים <span className="text-red-500">*</span>
                </label>
                <textarea id="description" name="description" required rows={6} className={`${fieldClass} resize-y`} placeholder="דרישות המטלה, תנאי ההגשה והמידע שיוצג לסטודנטים..." />
              </div>

              <div>
                <label htmlFor="evaluationInstructions" className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
                  הנחיות להערכה אוטומטית <span className="text-red-500">*</span>
                </label>
                <textarea id="evaluationInstructions" name="evaluationInstructions" required rows={5} className={`${fieldClass} resize-y`} placeholder="קריטריונים לבדיקה, דגשים ומדיניות הורדת נקודות..." />
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">הנחיות אלה משמשות את מנגנון הבדיקה ואינן מחליפות את התיאור לסטודנטים.</p>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-gray-800">
                <Calendar size={19} className="text-[#00857e]" />
                <h2 className="font-bold text-gray-900 dark:text-white">זמינות</h2>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="startAt" className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">מועד פתיחה</label>
                  <input id="startAt" name="startAt" type="datetime-local" className={fieldClass} />
                </div>
                <div>
                  <label htmlFor="dueAt" className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">מועד אחרון להגשה</label>
                  <input id="dueAt" name="dueAt" type="datetime-local" className={fieldClass} />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-gray-800">
                <FileText size={19} className="text-[#00857e]" />
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white">שאלות ומחוון</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">אופציונלי — ניתן להגדיר ידנית או לייבא ממסמך.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {([
                  ["none", "ללא שאלות"],
                  ["manual", "הגדרה ידנית"],
                  ["document", "ייבוא ממסמך"],
                ] as const).map(([value, label]) => (
                  <label key={value} className={`cursor-pointer rounded-xl border p-4 text-center text-sm font-bold transition-colors ${questionMode === value ? "border-[#00857e] bg-teal-50 text-[#00857e] dark:bg-teal-950/40 dark:text-teal-300" : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300"}`}>
                    <input type="radio" name="questionMode" value={value} checked={questionMode === value} onChange={() => {
                      setQuestionMode(value);
                      if (value === "manual") setActiveQuestionIndex(0);
                    }} className="sr-only" />
                    {label}
                  </label>
                ))}
              </div>

              {questionMode === "manual" && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2 rounded-xl bg-gray-50 p-3 dark:bg-gray-900/40">
                    {questions.map((question, index) => {
                      const isComplete =
                        Boolean(question.questionKey.trim()) &&
                        Boolean(question.prompt.trim()) &&
                        Number(question.maxScoreText) > 0;
                      return (
                        <button
                          key={question.id}
                          type="button"
                          onClick={() => setActiveQuestionIndex(index)}
                          aria-current={activeQuestionIndex === index ? "step" : undefined}
                          className={`flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-bold transition-all ${
                            activeQuestionIndex === index
                              ? "border-[#00857e] bg-[#00857e] text-white shadow-sm"
                              : isComplete
                                ? "border-teal-200 bg-teal-50 text-[#00857e] dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300"
                                : "border-gray-200 bg-white text-gray-500 hover:border-[#00857e] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="flex h-10 items-center gap-1.5 rounded-full border border-dashed border-[#00857e] px-3 text-sm font-bold text-[#00857e] hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-950/30"
                    >
                      <Plus size={16} /> שאלה חדשה
                    </button>
                    <span className="ms-auto text-sm font-bold text-gray-600 dark:text-gray-300">
                      סה״כ ניקוד: {questionTotal}
                    </span>
                  </div>

                  {activeQuestion && (
                    <div key={activeQuestion.id} className="animate-in space-y-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4 duration-200 fade-in dark:border-gray-700 dark:bg-gray-900/30 md:p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-gray-800 dark:text-gray-100">
                            שאלה {activeQuestionIndex + 1}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {activeQuestionIndex + 1} מתוך {questions.length}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeQuestion(activeQuestion.id)}
                          disabled={questions.length === 1}
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 dark:hover:bg-red-950/30"
                          aria-label={`מחיקת שאלה ${activeQuestionIndex + 1}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_160px]">
                        <div>
                          <label className="mb-1.5 block text-xs font-bold text-gray-600 dark:text-gray-300">מפתח שאלה</label>
                          <input value={activeQuestion.questionKey} onChange={(event) => updateQuestion(activeQuestion.id, "questionKey", event.target.value)} maxLength={100} required className={fieldClass} />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-bold text-gray-600 dark:text-gray-300">ניקוד</label>
                          <input value={activeQuestion.maxScoreText} onChange={(event) => updateQuestion(activeQuestion.id, "maxScoreText", event.target.value)} type="number" min="0.01" step="0.01" required className={fieldClass} />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-gray-600 dark:text-gray-300">נוסח השאלה</label>
                        <textarea value={activeQuestion.prompt} onChange={(event) => updateQuestion(activeQuestion.id, "prompt", event.target.value)} rows={3} required className={`${fieldClass} resize-y`} />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-gray-600 dark:text-gray-300">מחוון בדיקה (אופציונלי)</label>
                        <textarea value={activeQuestion.rubric ?? ""} onChange={(event) => updateQuestion(activeQuestion.id, "rubric", event.target.value)} rows={2} className={`${fieldClass} resize-y`} />
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                        <button
                          type="button"
                          onClick={() => setActiveQuestionIndex((index) => index - 1)}
                          disabled={activeQuestionIndex === 0}
                          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold text-gray-600 hover:bg-white disabled:invisible dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <ChevronRight size={17} /> הקודמת
                        </button>
                        {activeQuestionIndex < questions.length - 1 ? (
                          <button
                            type="button"
                            onClick={() => setActiveQuestionIndex((index) => index + 1)}
                            className="inline-flex items-center gap-1 rounded-lg bg-gray-200 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200"
                          >
                            הבאה <ChevronLeft size={17} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={addQuestion}
                            className="inline-flex items-center gap-1 rounded-lg bg-teal-50 px-3 py-2 text-sm font-bold text-[#00857e] hover:bg-teal-100 dark:bg-teal-950/40 dark:text-teal-300"
                          >
                            <Plus size={17} /> הוספת שאלה
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {questionMode === "document" && (
                <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
                  <Upload size={30} className="mx-auto mb-3 text-[#00857e]" />
                  <label htmlFor="questionFile" className="cursor-pointer font-bold text-[#00857e] hover:underline">בחירת מסמך שאלות</label>
                  <input id="questionFile" type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" required onChange={(event) => setQuestionFile(event.target.files?.[0] ?? null)} className="sr-only" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{questionFile ? questionFile.name : "PDF, DOCX או TXT, עד 20MB"}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">המסמך יעובד ברקע והשאלות והמחוונים יחולצו אוטומטית.</p>
                </div>
              )}
            </section>
          </fieldset>

          {submitError && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
              {submitError}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-4 border-t border-gray-100 pt-6 dark:border-gray-800">
            <Link to={`/lecturer/courses/${courseId}`} className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-6 py-3 font-bold text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              <X size={18} /> ביטול
            </Link>
            <button
              type="submit"
              value="DRAFT"
              disabled={isSubmitting}
              className="flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#00857e] px-6 py-3 font-bold text-[#00857e] transition-colors hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-70 dark:text-teal-300 dark:hover:bg-teal-950/30"
            >
              <Save size={18} /> שמירה כטיוטה
            </button>
            <button
              type="submit"
              value="PUBLISHED"
              disabled={isSubmitting}
              className="flex min-w-40 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#00857e] px-8 py-3 font-bold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? submissionStage || "מפרסם מטלה..." : <><Save size={18} /> פרסום והמשך ל-Moodle</>}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
