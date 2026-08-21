import type { Route } from "./+types/student.messages";
import MainLayout from "../components/MainLayout";
import { useState, useEffect } from "react";
import {
  Search,
  Mail,
  MailOpen,
  User,
  Clock,
  Archive,
  Trash2,
  Reply,
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  AlertCircle,
  CheckCircle2,
  Plus,
  X,
  GraduationCap,
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useStudentCourses } from "../hooks/useStudentCourses";
import {
  useMessages,
  useMessageDetail,
  useSendMessage,
  useMarkMessageAsRead,
  useSendReply,
  useArchiveMessage,
  useDeleteMessage,
  formatMessageTime,
} from "../hooks/useMessages";
import type { MessageItem } from "../lib/api/types";
import { getLtiUserId } from "../lib/lti-session";
import { AccountContextError } from "../components/AccountContextError";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "הודעות | Check Hit" },
    { name: "description", content: "הודעות ופניות סטודנט" },
  ];
}

export default function StudentMessages() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const studentId = getLtiUserId(import.meta.env.VITE_STUDENT_ID);

  // Real Courses Data for student compose modal
  const { data: courses = [], isLoading: isCoursesLoading } = useStudentCourses();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'broadcast' | 'direct' | 'sent'>('all');
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // Compose Modal State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeContent, setComposeContent] = useState("");

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Set default course for compose modal
  useEffect(() => {
    if (!selectedCourseId && courses.length > 0) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  // Messages Query
  const folderParam = activeFilter === 'sent' ? 'sent' : 'inbox';
  const targetTypeParam =
    activeFilter === 'broadcast' ? 'BROADCAST' : activeFilter === 'direct' ? 'DIRECT' : undefined;

  const {
    data: messagesData,
    isLoading: isListLoading,
    isError: isListError,
    refetch,
  } = useMessages(studentId, {
    folder: folderParam,
    targetType: targetTypeParam,
    search: debouncedSearch.trim() || undefined,
  });

  const messages: MessageItem[] = messagesData?.messages || [];

  // Automatically select first message if none selected
  useEffect(() => {
    if (!selectedMessageId && messages.length > 0) {
      setSelectedMessageId(messages[0].id);
    }
  }, [messages, selectedMessageId]);

  // Message Detail Query
  const {
    data: messageDetail,
  } = useMessageDetail(selectedMessageId, studentId);

  // Mutations
  const sendMessageMutation = useSendMessage(studentId);
  const markAsReadMutation = useMarkMessageAsRead(studentId);
  const sendReplyMutation = useSendReply(studentId);
  const archiveMutation = useArchiveMessage(studentId);
  const deleteMutation = useDeleteMessage(studentId);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const handleMessageClick = (msg: MessageItem) => {
    setSelectedMessageId(msg.id);
    setIsMobileDetailOpen(true);

    if (!msg.isRead) {
      markAsReadMutation.mutate({ messageId: msg.id, isRead: true });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeSubject.trim() || !composeContent.trim() || !selectedCourseId || sendMessageMutation.isPending) return;

    const recipientId = selectedCourse?.instructorId || import.meta.env.VITE_LECTURER_ID;

    try {
      const created = await sendMessageMutation.mutateAsync({
        courseId: selectedCourseId,
        recipientId,
        targetType: 'DIRECT',
        subject: composeSubject.trim(),
        content: composeContent.trim(),
        isPriority: false,
      });

      setSelectedMessageId(created.id);
      setIsComposeOpen(false);
      setComposeSubject("");
      setComposeContent("");
      setActionSuccessToast(t('messages.messageSentSuccess'));
      setTimeout(() => setActionSuccessToast(null), 3500);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyContent.trim() || !selectedMessageId || sendReplyMutation.isPending) return;

    try {
      await sendReplyMutation.mutateAsync({
        messageId: selectedMessageId,
        content: replyContent.trim(),
      });
      setReplyContent("");
    } catch (err) {
      console.error("Failed to send reply:", err);
    }
  };

  const handleArchive = async (msgId: string) => {
    try {
      await archiveMutation.mutateAsync({ messageId: msgId, isArchived: true });
      setActionSuccessToast(isEn ? "Message archived" : "ההודעה הועברה לארכיון");
      setTimeout(() => setActionSuccessToast(null), 3000);
      
      const remaining = messages.filter((m) => m.id !== msgId);
      if (selectedMessageId === msgId) {
        setSelectedMessageId(remaining[0]?.id || null);
        setIsMobileDetailOpen(false);
      }
    } catch (err) {
      console.error("Failed to archive message:", err);
    }
  };

  const handleDelete = async (msgId: string) => {
    try {
      await deleteMutation.mutateAsync(msgId);
      setActionSuccessToast(isEn ? "Message deleted" : "ההודעה נמחקה");
      setTimeout(() => setActionSuccessToast(null), 3000);

      const remaining = messages.filter((m) => m.id !== msgId);
      if (selectedMessageId === msgId) {
        setSelectedMessageId(remaining[0]?.id || null);
        setIsMobileDetailOpen(false);
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const activeMessage = messageDetail || messages.find((m) => m.id === selectedMessageId);
  const unreadDirectCount = messages.filter((m) => !m.isRead && m.targetType === 'DIRECT').length;

  if (!studentId) {
    return (
      <MainLayout portalName={t('nav.dashboard')} view="student">
        <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
          <header className="border-b border-gray-200 pb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <Mail className="text-[#00857e]" size={30} />
              {t('messages.title')}
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">{t('messages.subtitle')}</p>
          </header>
          <AccountContextError view="student" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout portalName={t('nav.dashboard')} view="student">
      <div className="animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-6 flex flex-col md:h-[calc(100vh-140px)]">
        
        {/* Toast Notification */}
        {actionSuccessToast && (
          <div className="fixed bottom-6 end-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm animate-in slide-in-from-bottom-5">
            <CheckCircle2 size={18} className="text-teal-400" />
            <span>{actionSuccessToast}</span>
          </div>
        )}

        {/* Header */}
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <Mail className="text-[#00857e]" size={30} />
              {t('messages.title')}
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">{t('messages.subtitle')}</p>
          </div>

          <button
            onClick={() => setIsComposeOpen(true)}
            className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-[#00857e] hover:bg-[#00706a] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer shrink-0"
          >
            <Plus size={18} />
            <span>{t('messages.newMessage')}</span>
          </button>
        </header>

        {/* Main Content: Split Pane Layout */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm min-h-[620px]">
          
          {/* Right Pane: Message List */}
          <div className={`w-full md:w-1/3 lg:w-[380px] border-e border-gray-200 flex flex-col bg-gray-50/50 ${
            isMobileDetailOpen ? 'hidden md:flex' : 'flex'
          }`}>
            {/* Search & Filter Bar */}
            <div className="p-4 border-b border-gray-200 bg-white space-y-3">
              <div className="relative">
                <div className={`absolute inset-y-0 ${isEn ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={t('messages.searchMessages')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`block w-full ${isEn ? 'pl-9 pr-3' : 'ps-9 pe-3'} py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00857e]/20 focus:border-[#00857e] transition-colors text-sm`}
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

            {/* Message List Scroll Area */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {isListLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="flex gap-3 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-100 rounded w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : isListError ? (
                <div className="p-8 text-center text-red-500 space-y-3">
                  <AlertCircle className="mx-auto h-10 w-10 text-red-400" />
                  <p className="text-sm font-medium">{isEn ? "Failed to load messages" : "טעינת ההודעות נכשלה"}</p>
                  <button
                    onClick={() => refetch()}
                    className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors"
                  >
                    {isEn ? "Try Again" : "נסה שוב"}
                  </button>
                </div>
              ) : messages.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Mail className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="font-medium text-sm">{t('messages.noMessagesFound')}</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {messages.map((message) => {
                    const formatted = formatMessageTime(message.createdAt, isEn);
                    const isSelected = selectedMessageId === message.id;
                    const isBroadcast = message.targetType === 'BROADCAST';
                    const senderName = message.sender?.name || (isEn ? "Unknown Sender" : "שולח לא ידוע");
                    const avatarUrl =
                      message.sender?.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(senderName)}&background=00857e&color=fff`;

                    return (
                      <button
                        key={message.id}
                        onClick={() => handleMessageClick(message)}
                        className={`w-full text-start p-4 transition-all hover:bg-gray-100/70 flex items-start gap-3 relative cursor-pointer ${
                          isSelected ? 'bg-teal-50/80 hover:bg-teal-50/90 border-s-4 border-[#00857e]' : 'bg-white'
                        }`}
                      >
                        {/* Unread Indicator */}
                        {!message.isRead && (
                          <div className={`absolute top-4 ${isEn ? 'right-4' : 'left-4'} w-2.5 h-2.5 bg-[#00857e] rounded-full shadow-xs`}></div>
                        )}
                        
                        <div className="relative shrink-0 mt-0.5">
                          {isBroadcast ? (
                            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm border border-purple-200 shadow-xs">
                              <Megaphone size={18} />
                            </div>
                          ) : (
                            <img
                              src={avatarUrl}
                              alt={senderName}
                              className="w-10 h-10 rounded-xl border border-gray-200 object-cover shadow-xs"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0 pe-2">
                          <div className="flex justify-between items-baseline mb-1 gap-1">
                            <div className="flex items-center gap-1.5 truncate">
                              {message.courseCode && (
                                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                                  isBroadcast ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-700'
                                }`}>
                                  {message.courseCode}
                                </span>
                              )}
                              <h3 className={`text-sm truncate ${!message.isRead ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}>
                                {senderName}
                              </h3>
                            </div>
                            <span className={`text-[11px] shrink-0 whitespace-nowrap ${!message.isRead ? 'text-[#00857e] font-bold' : 'text-gray-400'}`}>
                              {formatted.time || formatted.date}
                            </span>
                          </div>

                          <h4 className={`text-xs truncate mb-1 ${!message.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}>
                            {message.isPriority && <span className="text-orange-600 font-extrabold me-1.5">⚠️</span>}
                            {message.subject}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-1 leading-relaxed">
                            {message.snippet || message.content}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Left Pane: Message Detail & Thread */}
          <div className={`flex-1 flex flex-col bg-white overflow-hidden ${
            !isMobileDetailOpen ? 'hidden md:flex' : 'flex'
          }`}>
            {activeMessage ? (
              <>
                {/* Detail Toolbar */}
                <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 bg-white shrink-0">
                  <div className="flex items-center gap-2">
                    {/* Mobile Back Button */}
                    <button
                      onClick={() => setIsMobileDetailOpen(false)}
                      className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1 text-sm font-semibold"
                    >
                      {isEn ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                      <span>{t('messages.backToInbox')}</span>
                    </button>

                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      activeMessage.targetType === 'BROADCAST' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-teal-100 text-[#00857e]'
                    }`}>
                      {activeMessage.targetType === 'BROADCAST' ? t('messages.courseBroadcast') : t('messages.directInquiry')}
                    </span>

                    {activeMessage.courseName && (
                      <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                        {activeMessage.courseName} {activeMessage.courseCode ? `(${activeMessage.courseCode})` : ''}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(activeMessage.id)}
                      disabled={deleteMutation.isPending}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title={t('messages.delete')}
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      onClick={() => handleArchive(activeMessage.id)}
                      disabled={archiveMutation.isPending}
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
                    
                    {/* Header: Subject & Tags */}
                    <div className="space-y-2">
                      {activeMessage.isPriority && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold rounded-lg">
                          <AlertCircle size={14} />
                          <span>{t('messages.highPriority')}</span>
                        </div>
                      )}
                      <h2 className="text-2xl font-black text-gray-900 leading-snug">
                        {activeMessage.subject}
                      </h2>
                    </div>

                    {/* Sender Info Bar */}
                    <div className="flex items-center justify-between pb-6 border-b border-gray-100 gap-4">
                      <div className="flex items-center gap-3.5">
                        {activeMessage.targetType === 'BROADCAST' ? (
                          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg border border-purple-200 shrink-0">
                            <Megaphone size={22} />
                          </div>
                        ) : (
                          <img
                            src={
                              activeMessage.sender?.avatarUrl ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(activeMessage.sender?.name || 'User')}&background=00857e&color=fff`
                            }
                            alt={activeMessage.sender?.name || 'User'}
                            className="w-12 h-12 rounded-2xl border border-gray-200 object-cover shrink-0"
                          />
                        )}
                        <div>
                          <div className="font-extrabold text-gray-900 text-base">
                            {activeMessage.sender?.name || (isEn ? "System" : "מערכת")}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <span>{t('messages.toMe')}</span>
                            {activeMessage.targetType === 'BROADCAST' && (
                              <span className="text-purple-700 font-semibold">• {t('messages.courseBroadcast')}</span>
                            )}
                            {activeMessage.courseName && (
                              <span className="text-gray-400">• {activeMessage.courseName}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-end text-xs text-gray-400 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-gray-500 font-semibold justify-end">
                          <Clock size={13} />
                          <span>{formatMessageTime(activeMessage.createdAt, isEn).time}</span>
                        </div>
                        <span className="mt-0.5 block">{formatMessageTime(activeMessage.createdAt, isEn).date}</span>
                      </div>
                    </div>

                    {/* Main Content Body */}
                    <div className="text-gray-800 text-sm md:text-base leading-relaxed whitespace-pre-wrap py-2">
                      {activeMessage.content}
                    </div>

                    {/* Threaded Replies List */}
                    {activeMessage.replies && activeMessage.replies.length > 0 && (
                      <div className="space-y-4 pt-6 border-t border-gray-100">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          {isEn ? "Thread Replies" : "תגובות בשיחה"}
                        </h4>
                        <div className="space-y-3">
                          {activeMessage.replies.map((reply) => {
                            const isMyReply = reply.isMe || reply.senderId === studentId;
                            const replyTime = formatMessageTime(reply.createdAt, isEn);

                            return (
                              <div
                                key={reply.id}
                                className={`p-4 rounded-2xl border transition-all ${
                                  isMyReply
                                    ? 'bg-teal-50/60 border-teal-200/80 ms-6 sm:ms-12'
                                    : 'bg-gray-50 border-gray-200 me-6 sm:me-12'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-xs font-bold ${isMyReply ? 'text-teal-900' : 'text-gray-900'}`}>
                                      {reply.sender?.name || (isMyReply ? (isEn ? "You" : "אתה") : (isEn ? "Lecturer" : "מרצה"))}
                                    </span>
                                    {isMyReply && (
                                      <span className="text-[10px] bg-teal-200 text-teal-900 font-bold px-1.5 py-0.2 rounded">
                                        {isEn ? "You" : "אתה"}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-gray-400">
                                    {replyTime.time} {replyTime.date ? `• ${replyTime.date}` : ''}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                                  {reply.content}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Interactive Reply Composer */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <form onSubmit={handleSendReply} className="border border-gray-200 rounded-2xl p-4 bg-gray-50/80 focus-within:bg-white focus-within:border-[#00857e] focus-within:ring-2 focus-within:ring-[#00857e]/20 transition-all shadow-xs">
                        <div className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
                          <Reply size={14} className="text-[#00857e]" />
                          <span>
                            {t('messages.replyTo')} {activeMessage.sender?.name || (isEn ? "Sender" : "השולח")}
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder={t('messages.typeReply')}
                          className="w-full bg-transparent border-0 resize-none focus:ring-0 text-sm text-gray-800 placeholder-gray-400 p-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                              handleSendReply();
                            }
                          }}
                        />
                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-200/60">
                          <span className="text-[11px] text-gray-400 hidden sm:inline">
                            {isEn ? "Press Ctrl+Enter to send" : "הקש Ctrl+Enter לשליחה"}
                          </span>
                          <button
                            type="submit"
                            disabled={!replyContent.trim() || sendReplyMutation.isPending}
                            className="px-4 py-2 bg-[#00857e] hover:bg-[#00706a] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm ms-auto cursor-pointer"
                          >
                            {sendReplyMutation.isPending ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Send size={14} />
                            )}
                            <span>{t('messages.sendReply')}</span>
                          </button>
                        </div>
                      </form>
                    </div>

                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30 p-8">
                <MailOpen className="h-16 w-16 mb-4 text-gray-200" />
                <p className="text-base font-semibold text-gray-500">{t('messages.selectMessage')}</p>
              </div>
            )}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* COMPOSE / STUDENT DIRECT INQUIRY MODAL                                     */}
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
                    <p className="text-xs text-gray-500">{t('messages.studentComposeSubtitle')}</p>
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
                  {isCoursesLoading ? (
                    <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-center gap-2 text-xs text-gray-500">
                      <Loader2 size={16} className="animate-spin text-[#00857e]" />
                      <span>{isEn ? "Loading courses..." : "טוען קורסים..."}</span>
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="p-4 bg-yellow-50 text-yellow-800 rounded-2xl text-xs">
                      {isEn ? "No enrolled courses found" : "לא נמצאו קורסים רשומים"}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {courses.map((c) => {
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
                              {c.displayTitle || c.name}
                            </p>
                            {c.instructorName && (
                              <span className="text-[11px] text-gray-500 block mt-1 truncate">
                                {c.instructorName}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Recipient Target Info Banner */}
                {selectedCourse && (
                  <div className="p-3.5 bg-teal-50/60 border border-teal-100 rounded-2xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#00857e] text-white flex items-center justify-center shrink-0">
                      <GraduationCap size={16} />
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-teal-950 block">{t('messages.inquiryToStaff')}</span>
                      <span className="text-teal-700">{selectedCourse.displayTitle || selectedCourse.name} ({selectedCourse.code})</span>
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
                    placeholder={t('messages.studentSubjectPlaceholder')}
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
                    placeholder={t('messages.studentContentPlaceholder')}
                    value={composeContent}
                    onChange={(e) => setComposeContent(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm leading-relaxed focus:bg-white focus:ring-2 focus:ring-[#00857e]/20 focus:border-[#00857e] transition-all"
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
                    disabled={sendMessageMutation.isPending || !composeSubject.trim() || !composeContent.trim()}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00857e] hover:bg-[#00706a] text-white font-black text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    <span>{sendMessageMutation.isPending ? t('messages.sending') : t('messages.send')}</span>
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
