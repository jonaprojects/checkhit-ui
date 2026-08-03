import type { Route } from "./+types/lecturer.messages";
import MainLayout from "../components/MainLayout";
import { useState } from "react";
import { 
  Search, 
  Mail, 
  MailOpen, 
  Clock, 
  MoreVertical, 
  Archive, 
  Trash2, 
  Reply, 
  Send, 
  Plus, 
  Radio, 
  Users, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  ArrowLeft, 
  ArrowRight,
  BookOpen,
  Filter,
  Check,
  Megaphone,
  Sparkles
} from "lucide-react";
import { useTranslation } from 'react-i18next';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "הודעות מרצה | Check Hit" },
    { name: "description", content: "ניהול הודעות ותפוצה לסגל" },
  ];
}

interface MessageItem {
  id: string;
  sender: string;
  senderRole?: string;
  avatar?: string;
  targetType: 'broadcast' | 'direct';
  courseCode: string;
  courseName: string;
  recipientCount?: number;
  readCount?: number;
  recipientName?: string;
  recipientEmail?: string;
  subject: string;
  snippet: string;
  time: string;
  date: string;
  isRead: boolean;
  isPriority?: boolean;
  isSentByMe?: boolean;
  content: string;
  replies?: Array<{
    id: string;
    sender: string;
    avatar?: string;
    time: string;
    content: string;
    isMe: boolean;
  }>;
}

const COURSES_DATA = [
  { id: "cs101", code: "CS101", nameHe: "מבוא למדעי המחשב", nameEn: "Intro to Computer Science", studentCount: 84 },
  { id: "cs202", code: "CS202", nameHe: "מבני נתונים ואלגוריתמים", nameEn: "Data Structures & Algorithms", studentCount: 62 },
  { id: "cs303", code: "CS303", nameHe: "תכנות מונחה עצמים", nameEn: "Object Oriented Programming", studentCount: 45 },
];

const INITIAL_MESSAGES: { he: MessageItem[]; en: MessageItem[] } = {
  he: [
    {
      id: "msg-1",
      sender: "יוסי כהן (סטודנט)",
      senderRole: "סטודנט • מבוא למדעי המחשב",
      avatar: "https://i.pravatar.cc/150?img=11",
      targetType: "direct",
      courseCode: "CS101",
      courseName: "מבוא למדעי המחשב",
      subject: "שאלה לגבי פונקציה רקורסיבית במטלה 2",
      snippet: "שלום ד\"ר פלג, רציתי לשאול לגבי תנאי העצירה בשאלה 3 האם מותר להניח שהקלט תמיד חיובי...",
      time: "10:15",
      date: "היום",
      isRead: false,
      isPriority: true,
      content: `שלום ד"ר פלג,

רציתי לשאול לגבי תנאי העצירה בשאלה 3 במטלה 2. 
האם מותר להניח במבחני הקצה שהקלט תמיד יהיה מספר שלם חיובי או שעלינו לבדוק מקרים של קלט 0 ומספרים שליליים?

בנוסף, האם מותר להשתמש בפונקציית עזר (helper function) נוספת?

תודה רבה,
יוסי כהן (ת.ז 318294821)`,
      replies: []
    },
    {
      id: "msg-2",
      sender: "ד\"ר דן פלג (תפוצה)",
      senderRole: "מרצה הקורס",
      targetType: "broadcast",
      courseCode: "CS101",
      courseName: "מבוא למדעי המחשב",
      recipientCount: 84,
      readCount: 76,
      isSentByMe: true,
      subject: "הבהרה חשובה ודחיית מועד הגשה למטלה 3",
      snippet: "סטודנטים יקרים, בעקבות שאלות רבות שעלו בנוגע לחלק ב' במטלה, עודכן קובץ ההנחיות...",
      time: "אתמול",
      date: "2 באוגוסט",
      isRead: true,
      isPriority: true,
      content: `סטודנטים יקרים,

בעקבות שאלות רבות שעלו בתרגול בנוגע לחלק ב' במטלה 3 (עצי חיפוש בינאריים), עודכן קובץ ההנחיות בפורטל הקורס עם דוגמאות הרצה נוספות.

לבקשתכם, מועד ההגשה נדחה ב-48 שעות:
📅 מועד הגשה חדש: יום חמישי, 06/08/2026 בשעה 23:59.

שימו לב: המערכת האוטומטית תיסגר בדיוק בשעה זו ולא יתקבלו הגשות באיחור ללא אישור מראש.

בהצלחה,
ד"ר דן פלג`,
      replies: []
    },
    {
      id: "msg-3",
      sender: "נועה לוי (סטודנטית)",
      senderRole: "סטודנטית • מבני נתונים",
      avatar: "https://i.pravatar.cc/150?img=47",
      targetType: "direct",
      courseCode: "CS202",
      courseName: "מבני נתונים ואלגוריתמים",
      subject: "בקשה להארכת מועד עקב שירות מילואים",
      snippet: "שלום ד\"ר פלג, מצורף טופס 3010 עבור שירות מילואים פעיל של שבוע...",
      time: "30 ביולי",
      date: "30 ביולי",
      isRead: true,
      isPriority: false,
      content: `שלום ד"ר פלג,

חזרתי אתמול משבוע שירות מילואים פעיל. 
אשמח לקבל הארכה של 4 ימים בהגשת תרגיל 2 במבני נתונים. 

צירפתי את אישור השמ\"פ המאושר מהיחידה.

בברכה,
נועה לוי`,
      replies: [
        {
          id: "rep-1",
          sender: "ד\"ר דן פלג",
          time: "30 ביולי, 16:40",
          content: "שלום נועה, תודה על השירות. הבקשה מאושרת, מועד ההגשה עודכן במערכת ליום ראשון.",
          isMe: true
        }
      ]
    },
    {
      id: "msg-4",
      sender: "ד\"ר דן פלג (תפוצה)",
      senderRole: "מרצה הקורס",
      targetType: "broadcast",
      courseCode: "CS303",
      courseName: "תכנות מונחה עצמים",
      recipientCount: 45,
      readCount: 41,
      isSentByMe: true,
      subject: "פרסום הנחיות לפרויקט הגמר בסמסטר",
      snippet: "שלום לכולם, מסמך הדרישות לפרויקט הגמר ב-Java פורסם בלשונית המטלות...",
      time: "24 ביולי",
      date: "24 ביולי",
      isRead: true,
      isPriority: false,
      content: `שלום לכולם,

מסמך הדרישות והמחוון לפרויקט הגמר בקורס פורסם כעת בעמוד הקורס.
חלוקה לצוותים (זוגות) תתבצע עד סוף השבוע הבא דרך הקישור שהועלה.

נא לקרוא בעיון את דרישות ה-Design Patterns והבדיקות האוטומטיות.

שבוע טוב,
ד"ר דן פלג`,
      replies: []
    }
  ],
  en: [
    {
      id: "msg-1",
      sender: "Yossi Cohen (Student)",
      senderRole: "Student • Intro to Computer Science",
      avatar: "https://i.pravatar.cc/150?img=11",
      targetType: "direct",
      courseCode: "CS101",
      courseName: "Intro to Computer Science",
      subject: "Question regarding recursive base case in Assignment 2",
      snippet: "Hello Dr. Peleg, I wanted to ask regarding the base case in question 3 if we can assume input is always positive...",
      time: "10:15",
      date: "Today",
      isRead: false,
      isPriority: true,
      content: `Hello Dr. Peleg,

I wanted to ask regarding question 3 in Assignment 2 (Recursion).
Can we assume in edge cases that the input is always a strictly positive integer, or should we handle 0 and negative inputs?

Also, are we allowed to declare a separate private helper function?

Thank you,
Yossi Cohen (ID 318294821)`,
      replies: []
    },
    {
      id: "msg-2",
      sender: "Dr. Dan Peleg (Broadcast)",
      senderRole: "Course Lecturer",
      targetType: "broadcast",
      courseCode: "CS101",
      courseName: "Intro to Computer Science",
      recipientCount: 84,
      readCount: 76,
      isSentByMe: true,
      subject: "Important Clarification & 48h Deadline Extension for Assignment 3",
      snippet: "Dear students, following questions in class regarding Part B, the guidelines document was updated...",
      time: "Yesterday",
      date: "Aug 2",
      isRead: true,
      isPriority: true,
      content: `Dear students,

Following multiple inquiries regarding Part B in Assignment 3 (Binary Search Trees), the guidelines file has been updated with extra test cases.

By popular request, the submission deadline is extended by 48 hours:
📅 New Deadline: Thursday, 06/08/2026 at 23:59.

Please note: The automated grading pipeline will close promptly at midnight.

Best regards,
Dr. Dan Peleg`,
      replies: []
    },
    {
      id: "msg-3",
      sender: "Noa Levi (Student)",
      senderRole: "Student • Data Structures",
      avatar: "https://i.pravatar.cc/150?img=47",
      targetType: "direct",
      courseCode: "CS202",
      courseName: "Data Structures & Algorithms",
      subject: "Request for extension due to Reserve Military Service",
      snippet: "Hello Dr. Peleg, attached is Form 3010 for 1 week of active duty military service...",
      time: "Jul 30",
      date: "Jul 30",
      isRead: true,
      isPriority: false,
      content: `Hello Dr. Peleg,

I returned yesterday from a week of active military reserve duty. 
I would appreciate a 4-day extension for submitting Exercise 2 in Data Structures.

I have attached my official service verification form.

Warm regards,
Noa Levi`,
      replies: [
        {
          id: "rep-1",
          sender: "Dr. Dan Peleg",
          time: "Jul 30, 16:40",
          content: "Hello Noa, thank you for your service. Your extension is approved and updated in the system until Sunday.",
          isMe: true
        }
      ]
    },
    {
      id: "msg-4",
      sender: "Dr. Dan Peleg (Broadcast)",
      senderRole: "Course Lecturer",
      targetType: "broadcast",
      courseCode: "CS303",
      courseName: "Object Oriented Programming",
      recipientCount: 45,
      readCount: 41,
      isSentByMe: true,
      subject: "Final Term Project Guidelines & Team Registration",
      snippet: "Hello everyone, the final Java project specification has been published on the course page...",
      time: "Jul 24",
      date: "Jul 24",
      isRead: true,
      isPriority: false,
      content: `Hello everyone,

The project rubric and specification for the final Java project have been published.
Pair team registration should be completed by next week.

Please review the Design Patterns requirements carefully.

Best regards,
Dr. Dan Peleg`,
      replies: []
    }
  ]
};

export default function LecturerMessages() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const initialMessages = isEn ? INITIAL_MESSAGES.en : INITIAL_MESSAGES.he;

  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(initialMessages[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'broadcast' | 'direct' | 'sent'>('all');
  
  // Mobile drill-down view state
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  // Compose Modal State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("cs101");
  const [recipientMode, setRecipientMode] = useState<'broadcast' | 'individual'>('broadcast');
  const [studentInput, setStudentInput] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeContent, setComposeContent] = useState("");
  const [isHighPriority, setIsHighPriority] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showSentToast, setShowSentToast] = useState(false);

  // Reply State
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const selectedCourse = COURSES_DATA.find(c => c.id === selectedCourseId) || COURSES_DATA[0];

  // Filtering
  const filteredMessages = messages.filter((m) => {
    // Filter tab
    if (activeFilter === 'broadcast' && m.targetType !== 'broadcast') return false;
    if (activeFilter === 'direct' && (m.targetType !== 'direct' || m.isSentByMe)) return false;
    if (activeFilter === 'sent' && !m.isSentByMe) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSubject = m.subject.toLowerCase().includes(q);
      const matchSender = m.sender.toLowerCase().includes(q);
      const matchCourse = m.courseName.toLowerCase().includes(q) || m.courseCode.toLowerCase().includes(q);
      const matchContent = m.content.toLowerCase().includes(q);
      return matchSubject || matchSender || matchCourse || matchContent;
    }
    return true;
  });

  const selectedMessage = messages.find(m => m.id === selectedMessageId);

  const handleSelectMessage = (id: string) => {
    setSelectedMessageId(id);
    setIsMobileDetailOpen(true);
    // Mark as read
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, isRead: true } : m));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeSubject.trim() || !composeContent.trim()) return;

    setIsSending(true);

    setTimeout(() => {
      const courseName = isEn ? selectedCourse.nameEn : selectedCourse.nameHe;
      const newMessage: MessageItem = {
        id: `msg-user-${Date.now()}`,
        sender: isEn ? "Dr. Dan Peleg (You)" : "ד\"ר דן פלג (אתה)",
        senderRole: isEn ? "Course Lecturer" : "מרצה הקורס",
        targetType: recipientMode,
        courseCode: selectedCourse.code,
        courseName: courseName,
        recipientCount: recipientMode === 'broadcast' ? selectedCourse.studentCount : 1,
        readCount: 0,
        recipientName: recipientMode === 'individual' ? studentInput : undefined,
        subject: composeSubject,
        snippet: composeContent.substring(0, 100) + '...',
        time: isEn ? "Just now" : "זה עתה",
        date: isEn ? "Today" : "היום",
        isRead: true,
        isPriority: isHighPriority,
        isSentByMe: true,
        content: composeContent,
        replies: []
      };

      setMessages([newMessage, ...messages]);
      setSelectedMessageId(newMessage.id);
      setIsSending(false);
      setIsComposeOpen(false);
      setComposeSubject("");
      setComposeContent("");
      setStudentInput("");
      setIsHighPriority(false);
      setShowSentToast(true);
      setTimeout(() => setShowSentToast(false), 4000);
    }, 600);
  };

  const handleSendReply = () => {
    if (!replyContent.trim() || !selectedMessage) return;
    setIsReplying(true);

    setTimeout(() => {
      const updatedReplies = [
        ...(selectedMessage.replies || []),
        {
          id: `rep-${Date.now()}`,
          sender: isEn ? "Dr. Dan Peleg" : "ד\"ר דן פלג",
          time: isEn ? "Just now" : "זה עתה",
          content: replyContent,
          isMe: true
        }
      ];

      setMessages(msgs => msgs.map(m => m.id === selectedMessage.id ? { ...m, replies: updatedReplies } : m));
      setReplyContent("");
      setIsReplying(false);
    }, 400);
  };

  const handleDelete = (id: string) => {
    const nextMessages = messages.filter(m => m.id !== id);
    setMessages(nextMessages);
    if (selectedMessageId === id) {
      setSelectedMessageId(nextMessages[0]?.id || null);
      setIsMobileDetailOpen(false);
    }
  };

  const unreadDirectCount = messages.filter(m => !m.isRead && m.targetType === 'direct').length;

  return (
    <MainLayout portalName={isEn ? "Lecturer Portal" : "פורטל מרצים"} view="lecturer">
      <div className="animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-6 flex flex-col h-full">
        
        {/* Top Notification Toast */}
        {showSentToast && (
          <div className="fixed top-6 start-1/2 -translate-x-1/2 z-50 bg-teal-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-teal-700 animate-in slide-in-from-top-4 duration-300">
            <CheckCircle2 size={20} className="text-teal-300" />
            <span className="text-sm font-bold">{t('messages.messageSentSuccess')}</span>
          </div>
        )}

        {/* Page Header */}
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <Mail className="text-[#00857e]" size={30} />
              {t('messages.title')}
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">{t('messages.lecturerSubtitle')}</p>
          </div>
          
          <button
            onClick={() => setIsComposeOpen(true)}
            className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-[#00857e] hover:bg-[#00706a] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer shrink-0"
          >
            <Plus size={18} />
            <span>{t('messages.newMessage')}</span>
          </button>
        </header>

        {/* Main Master-Detail Box */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm min-h-[620px] max-h-[750px]">
          
          {/* ========================================================================= */}
          {/* PANE 1: LIST / SIDEBAR (Hidden on mobile if detail is actively opened)     */}
          {/* ========================================================================= */}
          <div className={`
            w-full md:w-[380px] lg:w-[420px] border-e border-gray-200 flex flex-col bg-gray-50/40 shrink-0
            ${isMobileDetailOpen ? 'hidden md:flex' : 'flex'}
          `}>
            {/* Search & Filter Bar */}
            <div className="p-4 border-b border-gray-200 bg-white space-y-3">
              <div className="relative">
                <div className={`absolute inset-y-0 ${isEn ? 'left-0 pl-3.5' : 'right-0 pr-3.5'} flex items-center pointer-events-none text-gray-400`}>
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder={t('messages.searchMessages')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`block w-full ${isEn ? 'pl-10 pr-4' : 'ps-10 pe-4'} py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00857e]/20 focus:border-[#00857e] transition-all text-sm`}
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors shrink-0 cursor-pointer ${
                    activeFilter === 'all' 
                      ? 'bg-teal-700 text-white shadow-xs' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t('messages.all')}
                </button>
                <button
                  onClick={() => setActiveFilter('broadcast')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer ${
                    activeFilter === 'broadcast' 
                      ? 'bg-teal-700 text-white shadow-xs' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Megaphone size={13} />
                  {t('messages.broadcasts')}
                </button>
                <button
                  onClick={() => setActiveFilter('direct')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer ${
                    activeFilter === 'direct' 
                      ? 'bg-teal-700 text-white shadow-xs' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <User size={13} />
                  {t('messages.direct')}
                  {unreadDirectCount > 0 && (
                    <span className="bg-[#E8B43F] text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                      {unreadDirectCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveFilter('sent')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer ${
                    activeFilter === 'sent' 
                      ? 'bg-teal-700 text-white shadow-xs' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Send size={13} />
                  {t('messages.sent')}
                </button>
              </div>
            </div>

            {/* Message List Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {filteredMessages.length === 0 ? (
                <div className="p-10 text-center text-gray-400">
                  <Mail className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-sm font-medium">{t('messages.noMessagesFound')}</p>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isSelected = selectedMessageId === msg.id;
                  const isBroadcast = msg.targetType === 'broadcast';

                  return (
                    <button
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg.id)}
                      className={`w-full text-start p-4 transition-all hover:bg-gray-100/70 flex items-start gap-3 relative cursor-pointer ${
                        isSelected 
                          ? 'bg-teal-50/70 border-s-4 border-[#00857e]' 
                          : msg.isRead 
                            ? 'bg-white' 
                            : 'bg-teal-50/20'
                      }`}
                    >
                      {/* Priority or Unread Dot */}
                      {!msg.isRead && (
                        <span className={`absolute top-4 ${isEn ? 'right-4' : 'left-4'} w-2.5 h-2.5 bg-[#00857e] rounded-full shadow-xs`}></span>
                      )}

                      {/* Icon or Avatar */}
                      {isBroadcast ? (
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                          <Megaphone size={18} />
                        </div>
                      ) : (
                        <img 
                          src={msg.avatar || "https://ui-avatars.com/api/?name=User&background=00857e&color=fff"} 
                          alt={msg.sender} 
                          className="w-10 h-10 rounded-xl border border-gray-200 shrink-0 object-cover mt-0.5" 
                        />
                      )}

                      <div className="flex-1 min-w-0 pe-2">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 truncate">
                            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                              isBroadcast ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              {msg.courseCode}
                            </span>
                            <h3 className={`text-sm truncate ${!msg.isRead ? 'font-black text-gray-900' : 'font-bold text-gray-800'}`}>
                              {msg.sender}
                            </h3>
                          </div>
                          <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap shrink-0">
                            {msg.time}
                          </span>
                        </div>

                        <h4 className={`text-xs truncate mb-1 ${!msg.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {msg.isPriority && <span className="text-orange-600 font-extrabold me-1.5">⚠️</span>}
                          {msg.subject}
                        </h4>

                        <p className="text-xs text-gray-500 line-clamp-1">
                          {msg.snippet}
                        </p>

                        {/* Broadcast read stats counter if sent by lecturer */}
                        {isBroadcast && msg.recipientCount && (
                          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-purple-800 font-semibold bg-purple-50/80 px-2 py-0.5 rounded-md w-fit">
                            <Users size={12} />
                            <span>{t('messages.studentsCount', { count: msg.recipientCount })}</span>
                            {msg.readCount !== undefined && (
                              <span className="text-purple-600 font-normal">({msg.readCount} read)</span>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* PANE 2: DETAIL VIEWER                                                     */}
          {/* ========================================================================= */}
          <div className={`
            flex-1 flex-col bg-white overflow-hidden
            ${isMobileDetailOpen ? 'flex' : 'hidden md:flex'}
          `}>
            {selectedMessage ? (
              <>
                {/* Detail Header & Action Toolbar */}
                <div className="border-b border-gray-200 p-4 bg-white flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    {/* Mobile Back Button */}
                    <button
                      onClick={() => setIsMobileDetailOpen(false)}
                      className="md:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer flex items-center gap-1 text-sm font-bold"
                    >
                      {isEn ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                      <span>{t('messages.backToInbox')}</span>
                    </button>

                    <div className="hidden md:flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        selectedMessage.targetType === 'broadcast' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-teal-100 text-[#00857e]'
                      }`}>
                        {selectedMessage.targetType === 'broadcast' ? t('messages.courseBroadcast') : t('messages.directInquiry')}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {selectedMessage.courseName} ({selectedMessage.courseCode})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer" 
                      title={t('messages.delete')}
                    >
                      <Trash2 size={18} />
                    </button>
                    <button 
                      className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer" 
                      title={t('messages.archive')}
                    >
                      <Archive size={18} />
                    </button>
                  </div>
                </div>

                {/* Message Body Scroll Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                  <div className="max-w-3xl mx-auto space-y-6">
                    
                    {/* Subject & Priority */}
                    <div className="space-y-2">
                      {selectedMessage.isPriority && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold rounded-lg">
                          <AlertCircle size={14} />
                          <span>{t('messages.highPriority')}</span>
                        </div>
                      )}
                      <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-snug">
                        {selectedMessage.subject}
                      </h2>
                    </div>

                    {/* Sender Info Bar */}
                    <div className="flex items-center justify-between pb-5 border-b border-gray-100 gap-4">
                      <div className="flex items-center gap-3.5">
                        {selectedMessage.targetType === 'broadcast' ? (
                          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
                            <Megaphone size={22} />
                          </div>
                        ) : (
                          <img 
                            src={selectedMessage.avatar || "https://ui-avatars.com/api/?name=User&background=00857e&color=fff"} 
                            alt={selectedMessage.sender} 
                            className="w-12 h-12 rounded-2xl border border-gray-200 object-cover shadow-xs shrink-0" 
                          />
                        )}
                        <div>
                          <div className="font-extrabold text-gray-900 text-base">{selectedMessage.sender}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {selectedMessage.senderRole || selectedMessage.courseName}
                          </div>
                        </div>
                      </div>

                      <div className="text-end text-xs text-gray-400 font-medium whitespace-nowrap shrink-0">
                        <div className="flex items-center gap-1.5 text-gray-500 font-semibold justify-end">
                          <Clock size={13} />
                          <span>{selectedMessage.time}</span>
                        </div>
                        <span className="mt-0.5 block">{selectedMessage.date}</span>
                      </div>
                    </div>

                    {/* Broadcast Reach Statistics Pill */}
                    {selectedMessage.targetType === 'broadcast' && selectedMessage.recipientCount && (
                      <div className="p-4 bg-purple-50/70 border border-purple-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                            <Users size={18} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-purple-900">
                              {t('messages.broadcastAlert', { count: selectedMessage.recipientCount, course: selectedMessage.courseName })}
                            </div>
                            <div className="text-xs text-purple-700 mt-0.5">
                              {t('messages.readBy', { count: selectedMessage.readCount || 0, total: selectedMessage.recipientCount })}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold px-3 py-1 bg-purple-200 text-purple-900 rounded-full w-fit">
                          {Math.round(((selectedMessage.readCount || 0) / selectedMessage.recipientCount) * 100)}% {t('messages.delivered')}
                        </span>
                      </div>
                    )}

                    {/* Message Content */}
                    <div className="text-gray-800 text-sm md:text-base leading-relaxed whitespace-pre-wrap py-2">
                      {selectedMessage.content}
                    </div>

                    {/* Thread History / Replies */}
                    {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
                          {isEn ? "Conversation History" : "היסטוריית שיחה"}
                        </h4>
                        {selectedMessage.replies.map((rep) => (
                          <div key={rep.id} className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100/80 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-extrabold text-teal-900">{rep.sender}</span>
                              <span className="text-teal-700 font-medium">{rep.time}</span>
                            </div>
                            <p className="text-sm text-gray-800 leading-relaxed">{rep.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Reply Box for 1-on-1 */}
                    {selectedMessage.targetType === 'direct' && (
                      <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50 focus-within:bg-white focus-within:border-[#00857e] focus-within:ring-2 focus-within:ring-[#00857e]/20 transition-all">
                          <textarea
                            rows={3}
                            placeholder={t('messages.typeReply')}
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="w-full bg-transparent border-0 resize-none focus:outline-hidden text-sm text-gray-800 placeholder-gray-400"
                          />
                          <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                            <span className="text-xs text-gray-400">{t('messages.replyTo')} {selectedMessage.sender}</span>
                            <button
                              onClick={handleSendReply}
                              disabled={!replyContent.trim() || isReplying}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#00857e] hover:bg-[#00706a] text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                            >
                              <Send size={14} />
                              <span>{isReplying ? t('messages.sending') : t('messages.sendReply')}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400 bg-gray-50/20">
                <MailOpen className="w-16 h-16 text-gray-200 mb-3" />
                <p className="text-base font-bold text-gray-600">{t('messages.selectMessage')}</p>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COMPOSE / BROADCAST MESSAGE MODAL                                         */}
        {/* ========================================================================= */}
        {isComposeOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
              
              {/* Modal Header */}
              <div className="p-5 px-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-[#00857e] flex items-center justify-center">
                    <Plus size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">{t('messages.compose')}</h3>
                    <p className="text-xs text-gray-500">{t('messages.lecturerSubtitle')}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsComposeOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form Content */}
              <form onSubmit={handleSendMessage} className="p-6 overflow-y-auto space-y-5 flex-1 text-start">
                
                {/* Course Selection */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1.5 uppercase tracking-wide">
                    {t('messages.selectCourse')} *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {COURSES_DATA.map((c) => {
                      const isSelected = selectedCourseId === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedCourseId(c.id)}
                          className={`p-3 rounded-2xl border text-start transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-[#00857e] bg-teal-50/70 ring-2 ring-[#00857e]/20' 
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <span className="text-xs font-black text-teal-800">{c.code}</span>
                          <p className="text-xs font-bold text-gray-800 truncate mt-0.5">
                            {isEn ? c.nameEn : c.nameHe}
                          </p>
                          <span className="text-[11px] text-gray-400 block mt-1">
                            {t('messages.studentsCount', { count: c.studentCount })}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Recipient Targeting Mode */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1.5 uppercase tracking-wide">
                    {t('messages.recipientType')}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRecipientMode('broadcast')}
                      className={`p-3.5 rounded-2xl border text-start flex items-center gap-3 transition-all cursor-pointer ${
                        recipientMode === 'broadcast'
                          ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-600/20'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        recipientMode === 'broadcast' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Megaphone size={18} />
                      </div>
                      <div>
                        <span className="text-xs font-black text-gray-900 block">
                          {t('messages.allStudentsInCourse')}
                        </span>
                        <span className="text-[11px] text-purple-700 font-semibold">
                          {selectedCourse.studentCount} {isEn ? "students in" : "סטודנטים ב"}-{selectedCourse.code}
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRecipientMode('individual')}
                      className={`p-3.5 rounded-2xl border text-start flex items-center gap-3 transition-all cursor-pointer ${
                        recipientMode === 'individual'
                          ? 'border-[#00857e] bg-teal-50/70 ring-2 ring-[#00857e]/20'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        recipientMode === 'individual' ? 'bg-[#00857e] text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <User size={18} />
                      </div>
                      <div>
                        <span className="text-xs font-black text-gray-900 block">
                          {t('messages.individualStudent')}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {isEn ? "1-on-1 direct message" : "פנייה ישירה לסטודנט"}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Individual Student Input if selected */}
                {recipientMode === 'individual' && (
                  <div className="animate-in fade-in duration-200">
                    <label className="block text-xs font-extrabold text-gray-700 mb-1.5 uppercase tracking-wide">
                      {t('messages.studentNameOrId')} *
                    </label>
                    <div className="relative">
                      <Search size={16} className={`absolute inset-y-0 ${isEn ? 'left-3' : 'right-3'} my-auto text-gray-400`} />
                      <input
                        type="text"
                        required
                        placeholder={isEn ? "e.g., Yossi Cohen (318294821)" : "לדוגמה: יוסי כהן (318294821)"}
                        value={studentInput}
                        onChange={(e) => setStudentInput(e.target.value)}
                        className={`w-full ${isEn ? 'pl-9 pr-3' : 'ps-9 pe-3'} py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#00857e]/20 focus:border-[#00857e] transition-all`}
                      />
                    </div>
                  </div>
                )}

                {/* Subject */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1.5 uppercase tracking-wide">
                    {t('messages.subject')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('messages.subjectPlaceholder')}
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-[#00857e]/20 focus:border-[#00857e] transition-all"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1.5 uppercase tracking-wide">
                    {t('messages.messageContent')} *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder={t('messages.contentPlaceholder')}
                    value={composeContent}
                    onChange={(e) => setComposeContent(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm leading-relaxed focus:bg-white focus:ring-2 focus:ring-[#00857e]/20 focus:border-[#00857e] transition-all"
                  />
                </div>

                {/* High Priority Switch */}
                <div className="flex items-center justify-between p-3.5 bg-orange-50/60 border border-orange-200/80 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={20} className="text-orange-600 shrink-0" />
                    <div>
                      <div className="text-xs font-black text-orange-900">{t('messages.highPriority')}</div>
                      <div className="text-[11px] text-orange-700">{t('messages.highPriorityHint')}</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isHighPriority}
                    onChange={(e) => setIsHighPriority(e.target.checked)}
                    className="w-5 h-5 accent-orange-600 rounded-md cursor-pointer"
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsComposeOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 font-bold text-sm transition cursor-pointer"
                  >
                    {t('messages.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSending || !composeSubject.trim() || !composeContent.trim()}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00857e] hover:bg-[#00706a] text-white font-black text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Send size={16} />
                    <span>{isSending ? t('messages.sending') : t('messages.send')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
