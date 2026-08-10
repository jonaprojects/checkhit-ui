import type { Route } from "./+types/student.messages";
import MainLayout from "../components/MainLayout";
import { useState } from "react";
import { Search, Mail, MailOpen, User, Clock, MoreVertical, Archive, Trash2, Reply } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { isRtlLanguage } from '../lib/i18n';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "הודעות | Check Hit" },
    { name: "description", content: "הודעות סטודנט" },
  ];
}

const MOCK_MESSAGES_DATA = [
  {
    id: 1,
    senderKey: 'messages.mock1Sender',
    avatar: "https://ui-avatars.com/api/?name=System&background=00857e&color=fff",
    subjectKey: 'messages.mock1Subject',
    snippetKey: 'messages.mock1Snippet',
    time: "08:30",
    dateKey: 'messages.mock1Date',
    isRead: false,
    contentKey: 'messages.mock1Content',
  },
  {
    id: 2,
    senderKey: 'messages.mock2Sender',
    avatar: "https://i.pravatar.cc/150?img=33",
    subjectKey: 'messages.mock2Subject',
    snippetKey: 'messages.mock2Snippet',
    timeKey: 'messages.mock2Time',
    dateKey: 'messages.mock2Date',
    isRead: true,
    contentKey: 'messages.mock2Content',
  },
  {
    id: 3,
    senderKey: 'messages.mock3Sender',
    avatar: "https://ui-avatars.com/api/?name=Admin&background=E8B43F&color=fff",
    subjectKey: 'messages.mock3Subject',
    snippetKey: 'messages.mock3Snippet',
    timeKey: 'messages.mock3Time',
    dateKey: 'messages.mock3Date',
    isRead: true,
    contentKey: 'messages.mock3Content',
  },
];

export default function StudentMessages() {
  const { t, i18n } = useTranslation();
  const isRtl = isRtlLanguage(i18n.language);
  const [messages, setMessages] = useState(MOCK_MESSAGES_DATA);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(MOCK_MESSAGES_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedMessage = messages.find(m => m.id === selectedMessageId);

  const filteredMessages = messages.filter(m =>
    t(m.subjectKey).includes(searchQuery) ||
    t(m.senderKey).includes(searchQuery) ||
    t(m.contentKey).includes(searchQuery)
  );

  const handleMessageClick = (id: number) => {
    setSelectedMessageId(id);
    // Mark as read
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, isRead: true } : m));
  };

  return (
    <MainLayout portalName={t('nav.dashboard')} view="student">
      <div className="animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-6 flex flex-col md:h-[calc(100vh-140px)]">
        
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">{t('messages.title')}</h1>
          <p className="text-gray-500 mt-1">{t('messages.subtitle')}</p>
        </header>

        {/* Main Content: Split Pane Layout */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col md:flex-row shadow-sm">
          
          {/* Right Pane: Message List */}
          <div className="w-full md:w-1/3 lg:w-[350px] border-e border-gray-200 flex flex-col bg-gray-50/50">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="relative">
                <div className={`absolute inset-y-0 ${!isRtl ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
                  <Search className={`h-5 w-5 text-gray-400 ${!isRtl ? 'mr-3' : 'ms-3'}`} />
                </div>
                <input
                  type="text"
                  placeholder={t('messages.searchMessages')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`block w-full ${!isRtl ? 'pl-10 pr-3' : 'ps-10 pe-3'} py-2 border border-gray-200 rounded-lg focus:ring-[#00857e] focus:border-[#00857e] transition-colors text-sm`}
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Mail className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p>{t('messages.noMessagesFound')}</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredMessages.map((message) => (
                    <button
                      key={message.id}
                      onClick={() => handleMessageClick(message.id)}
                      className={`w-full text-start p-4 transition-colors hover:bg-gray-50 flex items-start gap-3 relative ${
                        selectedMessageId === message.id ? 'bg-teal-50/50' : ''
                      }`}
                    >
                      {/* Unread Indicator */}
                      {!message.isRead && (
                        <div className={`absolute top-1/2 -mt-1 ${!isRtl ? 'left-3' : 'end-3'} w-2 h-2 bg-[#00857e] rounded-full`}></div>
                      )}

                      <img src={message.avatar} alt={t(message.senderKey)} className="w-10 h-10 rounded-full border border-gray-200 mt-1 shrink-0" />
                      <div className="flex-1 min-w-0 pe-4">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className={`text-sm truncate pe-2 ${!message.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                            {t(message.senderKey)}
                          </h3>
                          <span className={`text-xs shrink-0 ${!message.isRead ? 'text-[#00857e] font-semibold' : 'text-gray-500'}`}>
                            {message.timeKey ? t(message.timeKey) : message.time}
                          </span>
                        </div>
                        <h4 className={`text-sm truncate mb-1 ${!message.isRead ? 'font-bold text-gray-800' : 'font-medium text-gray-800'}`}>
                          {t(message.subjectKey)}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          {t(message.snippetKey)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Left Pane: Message Detail */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {selectedMessage ? (
              <>
                {/* Detail Toolbar */}
                <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors" title={t('messages.reply')}>
                      <Reply size={20} />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors" title={t('messages.archive')}>
                      <Archive size={20} />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title={t('messages.delete')}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>

                {/* Detail Content Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10">
                  <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{t(selectedMessage.subjectKey)}</h2>

                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        <img src={selectedMessage.avatar} alt={t(selectedMessage.senderKey)} className="w-12 h-12 rounded-full border border-gray-200" />
                        <div>
                          <div className="font-bold text-gray-900">{t(selectedMessage.senderKey)}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                            <span>{t('messages.toMe')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Clock size={14} />
                        {t(selectedMessage.dateKey)}, {selectedMessage.timeKey ? t(selectedMessage.timeKey) : selectedMessage.time}
                      </div>
                    </div>

                    <div className="prose prose-gray max-w-none prose-p:leading-relaxed text-gray-800 whitespace-pre-wrap">
                      {t(selectedMessage.contentKey)}
                    </div>

                    {/* Reply Box Placeholder */}
                    <div className="mt-12 pt-6 border-t border-gray-100">
                      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                        <div className="text-gray-500 mb-3 flex items-center gap-2">
                          <Reply size={16} />
                          {t('messages.replyTo')} {t(selectedMessage.senderKey)}...
                        </div>
                        <div className="h-12 bg-white border border-gray-200 rounded-lg cursor-text hover:border-gray-300 transition-colors"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
                <MailOpen className="h-20 w-20 mb-4 text-gray-200" />
                <p className="text-lg font-medium text-gray-500">{t('messages.selectMessage')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
