import { useState } from 'react';
import { UploadCloud, File, AlertCircle, Bot, CheckCircle2, ChevronLeft, ArrowRight, MessageSquare, Download } from 'lucide-react';

export default function StudentAssignmentDetail({ initialState = 'not-submitted' }) {
  // 'not-submitted' | 'checking' | 'checked'
  const [submissionState, setSubmissionState] = useState(initialState);
  
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header/Breadcrumb */}
      <div className="flex items-center gap-4 mb-8">
        <button className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <ArrowRight size={20} />
        </button>
        <div>
          <div className="flex items-center text-sm text-gray-500 gap-2 mb-1">
            <span className="hover:text-gray-700 cursor-pointer">הקורסים שלי</span>
            <ChevronLeft size={14} />
            <span className="hover:text-gray-700 cursor-pointer">מבני נתונים ואלגוריתמים</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">תרגיל בית 3: עצי חיפוש בינאריים</h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Assignment Details */}
        <div className="p-6 md:p-8 border-b border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">הנחיות המטלה</h2>
            <span className="bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm font-bold">15% מהציון</span>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            בתרגיל זה תממשו עץ חיפוש בינארי ב-Java, הכולל פעולות הכנסה, מחיקה, וחיפוש.
            אנא הקפידו על סיבוכיות זמן הריצה הנדרשת כפי שלמדנו בכיתה. את הקוד יש להגיש בקובץ ZIP יחיד.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 border border-gray-200">
              <AlertCircle size={16} className="text-[#00857e]" /> מועד הגשה: 25.10.2023, 23:59
            </div>
            <div className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
              <Download size={16} className="text-[#00857e]" /> קובץ עזר.pdf
            </div>
          </div>
        </div>

        {/* State-dependent UI */}
        <div className="p-6 md:p-8 bg-gray-50/30">
          {submissionState === 'not-submitted' && (
            <NotSubmittedView onUpload={() => setSubmissionState('checking')} />
          )}
          {submissionState === 'checking' && (
            <CheckingView onFinish={() => setSubmissionState('checked')} />
          )}
          {submissionState === 'checked' && (
            <CheckedView onReset={() => setSubmissionState('not-submitted')} />
          )}
        </div>
      </div>
      
      {/* State Switcher for Demo Purposes */}
      <div className="fixed bottom-4 start-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200 flex gap-2 z-50">
        <span className="text-xs text-gray-500 font-bold self-center me-2">שליטה על תצוגה (למטרות הדגמה):</span>
        <button onClick={() => setSubmissionState('not-submitted')} className={`text-xs px-3 py-1.5 rounded-md ${submissionState==='not-submitted' ? 'bg-[#00857e] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>ללא הגשה</button>
        <button onClick={() => setSubmissionState('checking')} className={`text-xs px-3 py-1.5 rounded-md ${submissionState==='checking' ? 'bg-[#E8B43F] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>בבדיקה</button>
        <button onClick={() => setSubmissionState('checked')} className={`text-xs px-3 py-1.5 rounded-md ${submissionState==='checked' ? 'bg-[#00857e] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>נבדק</button>
      </div>
    </div>
  );
}

function NotSubmittedView({ onUpload }) {
  return (
    <div 
      className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-xl bg-white hover:border-[#00857e] hover:bg-teal-50/50 transition-colors cursor-pointer group" 
      onClick={onUpload}
    >
      <div className="w-16 h-16 bg-gray-50 group-hover:bg-teal-100 text-gray-400 group-hover:text-[#00857e] rounded-full flex items-center justify-center mb-4 transition-colors">
        <UploadCloud size={32} />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#00857e] transition-colors">גרור קבצים לכאן או לחץ להעלאה</h3>
      <p className="text-gray-500 text-sm text-center max-w-sm">
        ניתן להעלות קבצים מסוג ZIP בלבד, עד גודל של 50MB. המערכת תתחיל לסרוק ולבדוק אוטומטית לאחר ההגשה.
      </p>
      <button className="mt-8 bg-[#00857e] text-white px-8 py-2.5 rounded-lg font-bold shadow-sm hover:bg-teal-700 transition-colors">
        בחר קובץ להגשה
      </button>
    </div>
  );
}

function CheckingView({ onFinish }) {
  return (
    <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl border border-[#E8B43F]/40 shadow-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E8B43F]/10 to-transparent animate-[pulse_2s_infinite]"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#E8B43F] opacity-30 animate-ping"></div>
          <div className="w-24 h-24 bg-gradient-to-br from-[#E8B43F] to-yellow-600 text-white rounded-full flex items-center justify-center shadow-lg relative z-10">
            <Bot size={48} className="animate-pulse" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-3">ה-AI שלנו בודק את המטלה שלך</h3>
        <p className="text-gray-500 text-center max-w-md leading-relaxed">
          מערכת ההערכה החכמה סורקת את הקוד, מחפשת שגיאות, בודקת יעילות ועמידה בדרישות. פעולה זו לוקחת לרוב כמספר דקות.
        </p>
        
        <div className="w-full max-w-sm bg-gray-100 h-2 rounded-full mt-8 overflow-hidden">
          <div className="bg-[#E8B43F] h-full w-2/3 rounded-full animate-pulse transition-all duration-1000"></div>
        </div>
        
        {/* Hidden button to simulate process finishing for the demo */}
        <button onClick={onFinish} className="mt-8 text-xs text-gray-400 hover:text-gray-600 underline">דלג לסיום התהליך (הדגמה)</button>
      </div>
    </div>
  );
}

function CheckedView({ onReset }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Grade Banner */}
      <div className="bg-[#00857e] rounded-xl p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute top-0 end-0 opacity-10 pointer-events-none text-[150px] font-black leading-none -mt-4 -me-4">
          95
        </div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner">
            <CheckCircle2 size={36} className="text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-extrabold mb-1">המטלה נבדקה בהצלחה</h3>
            <p className="text-teal-100 flex items-center gap-2 font-medium">
              <Bot size={18} />
              הערכה אוטומטית באמצעות AI הושלמה
            </p>
          </div>
        </div>
        <div className="text-center bg-white text-[#00857e] px-8 py-4 rounded-2xl shadow-md relative z-10">
          <span className="block text-sm font-bold text-gray-500 mb-1">ציון סופי</span>
          <span className="text-5xl font-black">95</span>
          <span className="text-xl font-bold text-gray-400">/100</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feedback */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">פירוט ההערכה</h3>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 start-0 w-1 h-full bg-[#E8B43F]"></div>
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Bot className="text-[#E8B43F]" /> משוב ה-AI
            </h4>
            <div className="space-y-4">
              <FeedbackItem type="positive" text="מימוש פונקציית ה-insert יעיל ונכון (O(log n) במקרה הממוצע)." />
              <FeedbackItem type="positive" text="טיפול נכון במקרי קצה בעת מחיקת צומת בעל שני בנים (מציאת עוקב והחלפה)." />
              <FeedbackItem type="warning" text="שם המשתנה `tmpNode` בשורה 45 אינו מעיד על תפקידו. מומלץ להשתמש בשמות בעלי משמעות גבוהה יותר כמו `nodeToDelete`." />
              <FeedbackItem type="negative" text="חסר תיעוד (JavaDoc) בחלק מהמתודות הציבוריות של המחלקה. תיעוד הוא חלק מדרישות המטלה." />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h4 className="text-lg font-bold text-gray-800 mb-2">הערת המרצה</h4>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg italic">
              "עבודה יפה מאוד. שימו לב להערת ה-AI בנושא התיעוד להבא."
            </p>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-4 pt-2">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center">
             <div className="w-12 h-12 bg-teal-50 text-[#00857e] rounded-full flex items-center justify-center mx-auto mb-4">
               <File size={24} />
             </div>
             <h4 className="font-bold text-gray-800 mb-2">קובץ ההגשה שלך</h4>
             <p className="text-sm text-gray-500 mb-4">
               binary_tree_submission.zip (1.2 MB)
             </p>
             <button className="w-full bg-gray-50 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2">
               <Download size={16} />
               הורד קובץ
             </button>
          </div>

          <div className="bg-teal-50 rounded-xl p-6 border border-teal-100">
             <h4 className="font-bold text-gray-800 mb-2">מרגיש שהציון לא הוגן?</h4>
             <p className="text-sm text-gray-600 mb-4">
               ניתן להגיש ערעור על הציון והמשוב של ה-AI. מרצה הקורס יעבור על הערעור באופן ידני.
             </p>
             <button className="w-full bg-white text-[#00857e] border-2 border-[#00857e] hover:bg-teal-50 px-4 py-2.5 rounded-lg font-bold transition-colors shadow-sm flex items-center justify-center gap-2">
               <MessageSquare size={18} />
               הגש ערעור
             </button>
          </div>
          
          <button onClick={onReset} className="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors">
             הגש קובץ מתוקן (למטרות תרגול)
          </button>
        </div>
      </div>
    </div>
  );
}

function FeedbackItem({ type, text }) {
  const styles = {
    positive: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle2 size={18} className="text-green-600 mt-0.5 shrink-0" />
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: <AlertCircle size={18} className="text-yellow-600 mt-0.5 shrink-0" />
    },
    negative: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
    },
  };
  
  const style = styles[type];
  
  return (
    <div className={`p-4 rounded-lg border ${style.bg} ${style.border} flex items-start gap-3`}>
      {style.icon}
      <p className={`text-sm font-medium ${style.text}`}>{text}</p>
    </div>
  );
}
