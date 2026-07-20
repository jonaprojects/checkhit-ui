import type { Route } from "./+types/student.help";
import MainLayout from "~/components/MainLayout";
import { HelpCircle, MessageSquare, ChevronDown, Send, User, Bot } from "lucide-react";
import { useState } from "react";
import { useTranslation } from 'react-i18next';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "עזרה ותמיכה | Check Hit" },
    { name: "description", content: "עזרה ותמיכה לסטודנטים" },
  ];
}

const faqsData = {
  he: [
    { q: "איך מגישים ערעור על מטלה?", a: "כדי להגיש ערעור, היכנס לעמוד המטלה הספציפית דרך רשימת המטלות, ולחץ על כפתור ״הגש ערעור״. הזן את פירוט הערעור ושלח." },
    { q: "מתי אקבל ציון על המטלה שלי?", a: "לאחר הגשת המטלה, היא תעבור בדיקה אוטומטית של AI שתיקח מספר דקות. לאחר מכן, המרצה יוכל לאשר או לשנות את הציון." },
    { q: "האם אני יכול להגיש מטלה באיחור?", a: "הגשה באיחור תלויה בהגדרות הקורס והמרצה. בחלק מהקורסים יש קנס על איחור, ובחלקם לא ניתן להגיש כלל." },
    { q: "איך מתחברים למערכת?", a: "ניתן להתחבר באמצעות שם המשתמש והסיסמה האוניברסיטאיים שלך." },
  ],
  en: [
    { q: "How do I submit an appeal for an assignment?", a: "To submit an appeal, go to the specific assignment page through the assignments list, and click on the 'Submit Appeal' button. Enter the appeal details and submit." },
    { q: "When will I get a grade on my assignment?", a: "After submitting the assignment, it will undergo automatic AI grading which takes a few minutes. Then, the lecturer can approve or change the grade." },
    { q: "Can I submit an assignment late?", a: "Late submission depends on the course and lecturer settings. Some courses have a late penalty, and some do not allow late submissions at all." },
    { q: "How do I log in to the system?", a: "You can log in using your university username and password." },
  ]
};

export default function StudentHelp() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const faqs = isEn ? faqsData.en : faqsData.he;
  
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, text: t('help.studentWelcome'), sender: 'bot', time: '10:00' }
  ]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Add user message
    const newUserMsg = { id: Date.now(), text: message, sender: 'user', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setChatHistory(prev => [...prev, newUserMsg]);
    setMessage('');
    
    // Auto-reply mock
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        id: Date.now() + 1,
        text: t('help.autoReply'),
        sender: 'bot',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
    }, 1000);
  };

  return (
    <MainLayout portalName={t('nav.dashboard')} view="student">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12 min-h-[101vh]">
        <header className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <HelpCircle className="text-[#00857e]" size={32} />
            {t('help.title')}
          </h1>
          <p className="text-gray-500 mt-2 text-lg">{t('help.subtitle')}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-[600px]">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              {t('help.faqTitle')}
            </h2>
            <div className="space-y-4 overflow-y-auto flex-1 pe-2">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300">
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className={`w-full flex items-center justify-between p-4 text-start font-bold transition-colors ${openFaq === idx ? 'bg-teal-50 text-[#00857e]' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
                  >
                    {faq.q}
                    <ChevronDown size={20} className={`transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  <div 
                    className={`transition-all duration-300 overflow-hidden ${openFaq === idx ? 'max-h-40 border-t border-gray-100' : 'max-h-0'}`}
                  >
                    <div className="p-4 text-gray-600 leading-relaxed bg-white">
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Section */}
          <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-[600px] overflow-hidden">
            <div className="bg-[#00857e] p-4 text-white flex items-center gap-3">
              <MessageSquare size={24} />
              <div>
                <h2 className="font-extrabold text-lg">{t('help.chatTitle')}</h2>
                <p className="text-teal-100 text-sm">{t('help.chatSubtitle')}</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-teal-100 text-[#00857e]'}`}>
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${msg.sender === 'user' ? 'bg-[#00857e] text-white rounded-tl-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tr-none shadow-sm'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <span className={`text-[10px] mt-1 block ${msg.sender === 'user' ? 'text-teal-200 text-start' : 'text-gray-400 text-end'}`}>{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex items-center gap-2">
              <input 
                type="text" 
                placeholder={t('help.typeMessage')} 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-[#00857e] focus:ring-2 focus:ring-teal-100 rounded-xl px-4 py-2.5 transition-all outline-none text-sm"
              />
              <button 
                type="submit" 
                disabled={!message.trim()}
                className="w-10 h-10 rounded-xl bg-[#00857e] text-white flex items-center justify-center hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                <Send size={18} className="-ms-1" />
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </MainLayout>
  );
}
