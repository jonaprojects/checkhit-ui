import type { Route } from "./+types/lecturer.messages";
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
  Send, 
  Plus, 
  X, 
  AlertCircle, 
  Megaphone, 
  Users, 
  CheckCircle2, 
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useLecturerCourses } from "../hooks/useLecturerCourses";
import {
  useMessages,
  useMessageDetail,
  useSendMessage,
  useSendReply,
  useMarkMessageAsRead,
  useArchiveMessage,
  useDeleteMessage,
  formatMessageTime,
} from "../hooks/useMessages";
import type { MessageItem } from "../lib/api/types";
import { getLtiUserId } from "../lib/lti-session";
import { AccountContextError } from "../components/AccountContextError";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "הודעות מרצה | Check Hit" },
    { name: "description", content: "ניהול הודעות ופרסום עדכונים לקורסים" },
  ];
}

export default function LecturerMessages() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  const lecturerId = getLtiUserId(import.meta.env.VITE_LECTURER_ID);

  // Real Courses Data for compose modal
  const { data: courses = [], isLoading: isCoursesLoading } = useLecturerCourses();

  // State
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'broadcast' | 'direct' | 'sent'>('all');
  
  // Mobile drill-down view state
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  // Compose Modal State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [recipientMode, setRecipientMode] = useState<'broadcast' | 'individual'>('broadcast');
  const [studentInput, setStudentInput] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeContent, setComposeContent] = useState("");
  const [isHighPriority, setIsHighPriority] = useState(false);
  const [showSentToast, setShowSentToast] = useState(false);

  // Reply State
  const [replyContent, setReplyContent] = useState("");

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
  } = useMessages(lecturerId, {
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
  } = useMessageDetail(selectedMessageId, lecturerId);

  // Mutations
  const sendMessageMutation = useSendMessage(lecturerId);
  const sendReplyMutation = useSendReply(lecturerId);
  const markAsReadMutation = useMarkMessageAsRead(lecturerId);
  const archiveMutation = useArchiveMessage(lecturerId);
  const deleteMutation = useDeleteMessage(lecturerId);

  const selectedMessage = messageDetail || messages.find((m) => m.id === selectedMessageId);
  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const handleSelectMessage = (msg: MessageItem) => {
    setSelectedMessageId(msg.id);
    setIsMobileDetailOpen(true);

    if (!msg.isRead) {
      markAsReadMutation.mutate({ messageId: msg.id, isRead: true });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeSubject.trim() || !composeContent.trim() || !selectedCourseId || sendMessageMutation.isPending) return;

    try {
      const created = await sendMessageMutation.mutateAsync({
        courseId: selectedCourseId,
        targetType: recipientMode === 'broadcast' ? 'BROADCAST' : 'DIRECT',
        subject: composeSubject.trim(),
        content: composeContent.trim(),
        isPriority: isHighPriority,
      });

      setSelectedMessageId(created.id);
      setIsComposeOpen(false);
      setComposeSubject("");
      setComposeContent("");
      setStudentInput("");
      setIsHighPriority(false);
      setShowSentToast(true);
      setTimeout(() => setShowSentToast(false), 4000);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleSendReply = async () => {
    if (!replyContent.trim() || !selectedMessage || sendReplyMutation.isPending) return;

    try {
      await sendReplyMutation.mutateAsync({
        messageId: selectedMessage.id,
        content: replyContent.trim(),
      });
      setReplyContent("");
    } catch (err) {
      console.error("Failed to send reply:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      const remaining = messages.filter((m) => m.id !== id);
      if (selectedMessageId === id) {
        setSelectedMessageId(remaining[0]?.id || null);
        setIsMobileDetailOpen(false);
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await archiveMutation.mutateAsync({ messageId: id, isArchived: true });
      const remaining = messages.filter((m) => m.id !== id);
      if (selectedMessageId === id) {
        setSelectedMessageId(remaining[0]?.id || null);
        setIsMobileDetailOpen(false);
      }
    } catch (err) {
      console.error("Failed to archive message:", err);
    }
  };

  const unreadDirectCount = messages.filter((m) => !m.isRead && m.targetType === 'DIRECT').length;

  if (!lecturerId) {
    return (
      <MainLayout portalName={isEn ? "Lecturer Portal" : "פורטל מרצים"} view="lecturer">
        <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
          <header className="border-b border-gray-200 pb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <Mail className="text-[#00857e]" size={30} />
              {t('messages.title')}
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">{t('messages.lecturerSubtitle')}</p>
          </header>
          <AccountContextError view="lecturer" />
        </div>
      </MainLayout>
    );
  }

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
              {isListLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="flex gap-3 animate-pulse">
                      <div className="w-10 h-10 rounded-xl bg-gray-200 shrink-0"></div>
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
                <div className="p-10 text-center text-gray-400">
                  <Mail className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-sm font-medium">{t('messages.noMessagesFound')}</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isSelected = selectedMessageId === msg.id;
                  const isBroadcast = msg.targetType === 'BROADCAST';
                  const formattedTime = formatMessageTime(msg.createdAt, isEn);
                  const senderName = msg.sender?.name || (isEn ? "Sender" : "שולח");
                  const avatarUrl =
                    msg.sender?.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(senderName)}&background=00857e&color=fff`;

                  return (
                    <button
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`w-full text-start p-4 transition-all hover:bg-gray-100/70 flex items-start gap-3 relative cursor-pointer ${
                        isSelected 
                          ? 'bg-teal-50/70 border-s-4 border-[#00857e]' 
                          : msg.isRead 
                            ? 'bg-white' 
                            : 'bg-teal-50/20'
                      }`}
                    >
                      {/* Unread Dot */}
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
                          src={avatarUrl} 
                          alt={senderName} 
                          className="w-10 h-10 rounded-xl border border-gray-200 shrink-0 object-cover mt-0.5" 
                        />
                      )}

                      <div className="flex-1 min-w-0 pe-2">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 truncate">
                            {msg.courseCode && (
                              <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                                isBroadcast ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}>
                                {msg.courseCode}
                              </span>
                            )}
                            <h3 className={`text-sm truncate ${!msg.isRead ? 'font-black text-gray-900' : 'font-bold text-gray-800'}`}>
                              {senderName}
                            </h3>
                          </div>
                          <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap shrink-0">
                            {formattedTime.time || formattedTime.date}
                          </span>
                        </div>

                        <h4 className={`text-xs truncate mb-1 ${!msg.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {msg.isPriority && <span className="text-orange-600 font-extrabold me-1.5">⚠️</span>}
                          {msg.subject}
                        </h4>

                        <p className="text-xs text-gray-500 line-clamp-1">
                          {msg.snippet || msg.content}
                        </p>

                        {/* Broadcast read stats counter */}
                        {isBroadcast && msg.recipientCount !== undefined && msg.recipientCount > 0 && (
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
                        selectedMessage.targetType === 'BROADCAST' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-teal-100 text-[#00857e]'
                      }`}>
                        {selectedMessage.targetType === 'BROADCAST' ? t('messages.courseBroadcast') : t('messages.directInquiry')}
                      </span>
                      {selectedMessage.courseName && (
                        <span className="text-xs text-gray-500 font-medium">
                          {selectedMessage.courseName} {selectedMessage.courseCode ? `(${selectedMessage.courseCode})` : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleDelete(selectedMessage.id)}
                      disabled={deleteMutation.isPending}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer" 
                      title={t('messages.delete')}
                    >
                      <Trash2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleArchive(selectedMessage.id)}
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
                        {selectedMessage.targetType === 'BROADCAST' ? (
                          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
                            <Megaphone size={22} />
                          </div>
                        ) : (
                          <img 
                            src={
                              selectedMessage.sender?.avatarUrl ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMessage.sender?.name || 'User')}&background=00857e&color=fff`
                            } 
                            alt={selectedMessage.sender?.name || 'User'} 
                            className="w-12 h-12 rounded-2xl border border-gray-200 object-cover shadow-xs shrink-0" 
                          />
                        )}
                        <div>
                          <div className="font-extrabold text-gray-900 text-base">
                            {selectedMessage.sender?.name || (isEn ? "Sender" : "שולח")}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {selectedMessage.courseName || (selectedMessage.targetType === 'BROADCAST' ? t('messages.courseBroadcast') : t('messages.directInquiry'))}
                          </div>
                        </div>
                      </div>

                      <div className="text-end text-xs text-gray-400 font-medium whitespace-nowrap shrink-0">
                        <div className="flex items-center gap-1.5 text-gray-500 font-semibold justify-end">
                          <Clock size={13} />
                          <span>{formatMessageTime(selectedMessage.createdAt, isEn).time}</span>
                        </div>
                        <span className="mt-0.5 block">{formatMessageTime(selectedMessage.createdAt, isEn).date}</span>
                      </div>
                    </div>

                    {/* Broadcast Reach Statistics Pill */}
                    {selectedMessage.targetType === 'BROADCAST' && selectedMessage.recipientCount !== undefined && selectedMessage.recipientCount > 0 && (
                      <div className="p-4 bg-purple-50/70 border border-purple-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                            <Users size={18} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-purple-900">
                              {t('messages.broadcastAlert', { count: selectedMessage.recipientCount, course: selectedMessage.courseName || '' })}
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
                        {selectedMessage.replies.map((rep) => {
                          const isMyReply = rep.isMe || rep.senderId === lecturerId;
                          const replyTime = formatMessageTime(rep.createdAt, isEn);

                          return (
                            <div
                              key={rep.id}
                              className={`p-4 rounded-2xl border space-y-2 ${
                                isMyReply
                                  ? 'bg-teal-50/50 border-teal-100/80 ms-6 sm:ms-12'
                                  : 'bg-gray-50 border-gray-200 me-6 sm:me-12'
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-extrabold text-teal-900">
                                  {rep.sender?.name || (isMyReply ? (isEn ? "You" : "אתה") : (isEn ? "Student" : "סטודנט"))}
                                </span>
                                <span className="text-teal-700 font-medium">
                                  {replyTime.time} {replyTime.date ? `• ${replyTime.date}` : ''}
                                </span>
                              </div>
                              <p className="text-sm text-gray-800 leading-relaxed">{rep.content}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Quick Reply Box for Direct Message Thread */}
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
                          <span className="text-xs text-gray-400">
                            {t('messages.replyTo')} {selectedMessage.sender?.name || (isEn ? "Sender" : "השולח")}
                          </span>
                          <button
                            onClick={handleSendReply}
                            disabled={!replyContent.trim() || sendReplyMutation.isPending}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00857e] hover:bg-[#00706a] text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                          >
                            {sendReplyMutation.isPending ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Send size={14} />
                            )}
                            <span>{sendReplyMutation.isPending ? t('messages.sending') : t('messages.sendReply')}</span>
                          </button>
                        </div>
                      </div>
                    </div>

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
                  {isCoursesLoading ? (
                    <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-center gap-2 text-xs text-gray-500">
                      <Loader2 size={16} className="animate-spin text-[#00857e]" />
                      <span>{isEn ? "Loading courses..." : "טוען קורסים..."}</span>
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="p-4 bg-yellow-50 text-yellow-800 rounded-2xl text-xs">
                      {isEn ? "No courses found for this lecturer" : "לא נמצאו קורסים למרצה זה"}
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
                            <span className="text-[11px] text-gray-400 block mt-1">
                              {t('messages.studentsCount', { count: c.studentsCount || 0 })}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
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
                          {selectedCourse?.studentsCount || 0} {isEn ? "students in" : "סטודנטים ב"}-{selectedCourse?.code || ''}
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
