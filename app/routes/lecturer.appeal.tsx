import type { Route } from "./+types/lecturer.appeal";
import MainLayout from "../components/MainLayout";
import { Link, useParams } from "react-router";
import { useState } from "react";
import { Button } from '../components/ui/Button';
import { ChevronRight, FileText, Download, Eye, Bot, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Review Appeal | Lecturer Portal | Check Hit" },
  ];
}

const MOCK_APPEAL = {
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
};

export default function LecturerAppealReviewRoute() {
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
    setLecturerFeedback("לאחר בדיקה חוזרת בעזרת ה-AI, נראה שהצדק איתך. המימוש של מציאת העוקב אכן מבטיח זמן ריצה לוגריתמי בממוצע. הציון תוקן בהתאם.");
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
      <MainLayout portalName="פורטל מרצים" view="lecturer">
        <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">ההחלטה נשמרה בהצלחה</h1>
          <p className="text-gray-500 max-w-md text-center mb-8">הסטודנט יקבל התראה על עדכון הציון והמשוב החדש.</p>
          <Link to="/lecturer/appeals" className="bg-[#00857e] text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors cursor-pointer">
            חזרה לרשימת הערעורים
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout portalName="פורטל מרצים" view="lecturer">
      <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
        
        {/* Header */}
        <header className="border-b border-gray-200 pb-6">
          <Link to="/lecturer/appeals" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#00857e] transition-colors mb-4 cursor-pointer">
            <ChevronRight size={16} /> חזרה לרשימת הערעורים
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
              <div className="text-center px-4 border-l border-gray-200">
                <div className="text-xs text-gray-500 mb-1">ציון מקורי</div>
                <div className="text-2xl font-black text-[#00857e]">{MOCK_APPEAL.originalGrade}</div>
              </div>
              <div className="px-4">
                <div className="text-xs text-gray-500 mb-1">קטגוריה</div>
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
                  נימוק הערעור מפי הסטודנט
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
                  קבצים מצורפים
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
                      <button className="p-1.5 text-gray-500 hover:text-[#00857e] hover:bg-teal-50 rounded cursor-pointer" title="תצוגה מקדימה">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-[#00857e] hover:bg-teal-50 rounded cursor-pointer" title="הורדה">
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
                  הקשר הערכה מקורית (משוב AI)
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
                  <h3 className="text-lg font-bold text-gray-900">הערכת AI חכמה</h3>
                </div>
                
                {aiState === 'idle' && (
                  <>
                    <p className="text-sm text-gray-600 mb-6">
                      תנו ל-AI לנתח את טענת הסטודנט מול קוד ההגשה המקורי ולהמליץ על פעולה.
                    </p>
                    <button 
                      onClick={handleAiAnalysis}
                      className="w-full bg-white border border-[#00857e] text-[#00857e] hover:bg-teal-50 py-2.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Bot size={18} />
                      נתח ערעור בעזרת AI
                    </button>
                  </>
                )}

                {aiState === 'analyzing' && (
                  <div className="flex flex-col items-center py-6">
                    <div className="relative">
                       <Bot size={40} className="text-[#00857e] animate-pulse relative z-10" />
                       <div className="absolute inset-0 bg-[#E8B43F] rounded-full blur-xl opacity-40 animate-pulse"></div>
                    </div>
                    <p className="text-sm font-bold text-gray-700 mt-4 mb-1">ה-AI סורק את ההגשה...</p>
                    <p className="text-xs text-gray-500">משווה בין טענת הסטודנט למימוש בפועל</p>
                  </div>
                )}

                {aiState === 'done' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white rounded-lg border border-teal-100 p-4 mb-4 shadow-sm">
                      <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                        <strong>מסקנת ה-AI:</strong> טענת הסטודנט נכונה. בבדיקה חוזרת עולה כי פונקציית העזר מונעת גלישה במקרי קצה, והסיבוכיות נשמרת על O(log n).
                      </p>
                      <div className="flex items-center justify-between bg-green-50 px-3 py-2 rounded border border-green-100">
                         <span className="text-sm font-bold text-green-800">המלצה: העלאת ציון</span>
                         <span className="text-lg font-black text-green-700">+13 נק'</span>
                      </div>
                    </div>
                    <Button 
                      onClick={handleApplyAiRecommendation}
                      variant="primary"
                      size="md"
                      className="w-full"
                    >
                      <CheckCircle2 size={18} />
                      החל המלצת AI בטופס
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Manual Evaluation Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <h3 className="font-bold text-gray-800">החלטת מרצה</h3>
              </div>
              <div className="p-6 space-y-6">
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ציון סופי מעודכן</label>
                  <div className="flex items-center">
                    <input 
                      type="number" 
                      min="0" max="100"
                      value={newGrade}
                      onChange={(e) => setNewGrade(e.target.value)}
                      className="w-24 text-center font-bold text-xl border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#00857e] focus:outline-none"
                    />
                    <span className="text-gray-500 font-bold ml-2">/ 100</span>
                    {Number(newGrade) > MOCK_APPEAL.originalGrade && (
                      <span className="text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded-md mr-auto">
                        +{Number(newGrade) - MOCK_APPEAL.originalGrade} נקודות
                      </span>
                    )}
                    {Number(newGrade) < MOCK_APPEAL.originalGrade && (
                      <span className="text-red-600 text-sm font-bold bg-red-50 px-2 py-1 rounded-md mr-auto">
                        {Number(newGrade) - MOCK_APPEAL.originalGrade} נקודות
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">משוב והסבר לסטודנט</label>
                  <textarea 
                    required
                    rows={5}
                    value={lecturerFeedback}
                    onChange={(e) => setLecturerFeedback(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00857e] focus:outline-none text-sm resize-none"
                    placeholder="הזן משוב המסביר את החלטתך..."
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
                    {isSubmitting ? 'שומר...' : 'שלח החלטה סופית לסטודנט'}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200 hover:border-red-200"
                    onClick={() => {
                      setNewGrade(MOCK_APPEAL.originalGrade);
                      setLecturerFeedback("לאחר בדיקה מעמיקה של טענותיך, המימוש עדיין לא עומד בדרישות היעילות. הציון נותר בעינו.");
                    }}
                  >
                    דחה ערעור (השאר ציון מקורי)
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
