import type { Route } from "./+types/lecturer.help";
import MainLayout from "~/components/MainLayout";
import { HelpCircle, MessageSquare, ChevronDown, Send, User, Bot } from "lucide-react";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "עזרה ותמיכה | Check Hit" },
    { name: "description", content: "עזרה ותמיכה למרצים" },
  ];
}

const faqs = [
  { q: "איך פותחים קורס חדש?", a: "ניתן לפתוח קורס חדש מלשונית ״הקורסים שלי״ על ידי לחיצה על כפתור ״הוסף קורס״." },
  { q: "איך מאשרים ציונים ממודל ה-AI?", a: "הכנס למטלה הרצויה, עבור על הציונים המוצעים ולחץ על כפתור ״אשר ציונים״ או ערוך ידנית במידת הצורך." },
  { q: "האם אפשר להאריך מועד הגשה?", a: "כן. במסך הגדרות המטלה ניתן לשנות את תאריך היעד או לאפשר הגשות באיחור תחת סעיף ״מדיניות איחורים״." },
  { q: "איך מגיבים לערעור סטודנט?", a: "בערעורים פתוחים תראה התראה. כנס למטלה דרך לשונית ערעורים, קרא את טענת הסטודנט, הוסף משוב ואשר/דחה את הערעור." },
];

export default function LecturerHelp() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, text: "שלום סגל הוראה! איך אפשר לעזור היום?", sender: 'bot', time: '10:00' }
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
        text: "תודה רבה על פנייתך. נציג תמיכה אקדמית יתחבר לשיחה בקרוב...",
        sender: 'bot',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
    }, 1000);
  };

  return (
    <MainLayout portalName="פורטל מרצים" view="lecturer">
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12 min-h-[101vh]">
        <header className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <HelpCircle className="text-[#00857e]" size={32} />
            עזרה ותמיכה
          </h1>
          <p className="text-gray-500 mt-2 text-lg">כאן תוכל למצוא תשובות לשאלות נפוצות או לשוחח עם התמיכה הטכנית.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-[600px]">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              שאלות נפוצות - סגל
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
                <h2 className="font-extrabold text-lg">צ'אט תמיכה טכנית</h2>
                <p className="text-teal-100 text-sm">שירות זמין עבור סגל ההוראה</p>
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
                placeholder="הקלד הודעה..." 
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
