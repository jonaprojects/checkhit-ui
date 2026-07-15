import type { Route } from "./+types/student.messages";
import MainLayout from "../components/MainLayout";
import { useState } from "react";
import { Search, Mail, MailOpen, User, Clock, MoreVertical, Archive, Trash2, Reply } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "הודעות | Check Hit" },
    { name: "description", content: "הודעות סטודנט" },
  ];
}

const MOCK_MESSAGES = [
  {
    id: 1,
    sender: "מערכת Check Hit",
    avatar: "https://ui-avatars.com/api/?name=System&background=00857e&color=fff",
    subject: "עדכון גרסה למערכת הגשת המטלות",
    snippet: "שים לב, בלילה שבין שני לשלישי המערכת תרד לשדרוג שרתים...",
    time: "08:30",
    date: "היום",
    isRead: false,
    content: `סטודנטים יקרים,
    
ברצוננו לעדכן אתכם כי בלילה שבין יום שני ליום שלישי הקרוב, בין השעות 02:00 ל-06:00 בבוקר, תתבצע תחזוקת שרתים ושדרוג גרסה למערכת הגשת המטלות. 

במהלך שעות אלו ייתכנו שיבושים בגישה לאתר ולא יתאפשר להעלות קבצים. אנו ממליצים לתכנן את זמני ההגשה בהתאם ולהימנע מהגשות ברגע האחרון.

בברכה,
צוות התמיכה הטכנית
Check Hit`
  },
  {
    id: 2,
    sender: "ד\"ר עמית שפירא",
    avatar: "https://i.pravatar.cc/150?img=33",
    subject: "הערות על מטלה 3 - מבוא למדעי המחשב",
    snippet: "בדקתי את המטלה שהגשת, יש לשים לב ליעילות האלגוריתם בחלק ב'...",
    time: "אתמול",
    date: "10 באוקטובר",
    isRead: true,
    content: `שלום רב,

הבדיקה של מטלה 3 הסתיימה. בסך הכל העבודה הייתה טובה מאוד, אך שמתי לב שבחלק ב' השתמשת בלולאות מקוננות שמעלות את סיבוכיות הזמן ל-O(n^2). 

ניתן לשפר את היעילות על ידי שימוש במבנה נתונים מסוג מילון (Hash Map) שיוריד את הסיבוכיות ל-O(n). אני ממליץ לעבור על החומר של הרצאה 4 שוב.

בהצלחה בהמשך,
ד"ר עמית שפירא`
  },
  {
    id: 3,
    sender: "מזכירות הפקולטה",
    avatar: "https://ui-avatars.com/api/?name=Admin&background=E8B43F&color=fff",
    subject: "רישום לקורסי בחירה סמסטר ב'",
    snippet: "תזכורת: חלון הרישום לקורסי הבחירה ייסגר בעוד כיומיים. אנא ודאו...",
    time: "8 באוקט",
    date: "8 באוקטובר",
    isRead: true,
    content: `תזכורת חשובה,

חלון הרישום לקורסי הבחירה של סמסטר ב' עומד להיסגר בעוד כיומיים (12 באוקטובר בחצות).
סטודנטים שטרם השלימו את מערכת השעות מתבקשים לעשות זאת בהקדם דרך הפורטל האישי.

שימו לב: לאחר סגירת החלון, שינויים במערכת יתאפשרו רק באישור ועדה חריגים.

בברכה,
מזכירות הפקולטה למדעים מדויקים`
  },
];

export default function StudentMessages() {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(MOCK_MESSAGES[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedMessage = messages.find(m => m.id === selectedMessageId);

  const filteredMessages = messages.filter(m => 
    m.subject.includes(searchQuery) || 
    m.sender.includes(searchQuery) ||
    m.content.includes(searchQuery)
  );

  const handleMessageClick = (id: number) => {
    setSelectedMessageId(id);
    // Mark as read
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, isRead: true } : m));
  };

  return (
    <MainLayout portalName="פורטל סטודנטים" view="student">
      <div className="animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-6 flex flex-col md:h-[calc(100vh-140px)]">
        
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">הודעות</h1>
          <p className="text-gray-500 mt-1">תיבת הדואר הנכנס שלך</p>
        </header>

        {/* Main Content: Split Pane Layout */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col md:flex-row shadow-sm">
          
          {/* Right Pane: Message List */}
          <div className="w-full md:w-1/3 lg:w-[350px] border-e border-gray-200 flex flex-col bg-gray-50/50">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 ms-3" />
                </div>
                <input
                  type="text"
                  placeholder="חיפוש הודעות..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full ps-10 pe-3 py-2 border border-gray-200 rounded-lg focus:ring-[#00857e] focus:border-[#00857e] transition-colors text-sm"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Mail className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p>לא נמצאו הודעות</p>
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
                        <div className="absolute top-1/2 -mt-1 end-3 w-2 h-2 bg-[#00857e] rounded-full"></div>
                      )}
                      
                      <img src={message.avatar} alt={message.sender} className="w-10 h-10 rounded-full border border-gray-200 mt-1 shrink-0" />
                      <div className="flex-1 min-w-0 pe-4">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className={`text-sm truncate pe-2 ${!message.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                            {message.sender}
                          </h3>
                          <span className={`text-xs shrink-0 ${!message.isRead ? 'text-[#00857e] font-semibold' : 'text-gray-500'}`}>
                            {message.time}
                          </span>
                        </div>
                        <h4 className={`text-sm truncate mb-1 ${!message.isRead ? 'font-bold text-gray-800' : 'font-medium text-gray-800'}`}>
                          {message.subject}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          {message.snippet}
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
                    <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors" title="השב">
                      <Reply size={20} />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors" title="ארכיון">
                      <Archive size={20} />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="מחק">
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedMessage.subject}</h2>
                    
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        <img src={selectedMessage.avatar} alt={selectedMessage.sender} className="w-12 h-12 rounded-full border border-gray-200" />
                        <div>
                          <div className="font-bold text-gray-900">{selectedMessage.sender}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                            <span>אל: אותי</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Clock size={14} />
                        {selectedMessage.date}, {selectedMessage.time}
                      </div>
                    </div>

                    <div className="prose prose-gray max-w-none prose-p:leading-relaxed text-gray-800 whitespace-pre-wrap">
                      {selectedMessage.content}
                    </div>

                    {/* Reply Box Placeholder */}
                    <div className="mt-12 pt-6 border-t border-gray-100">
                      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                        <div className="text-gray-500 mb-3 flex items-center gap-2">
                          <Reply size={16} />
                          השב ל{selectedMessage.sender}...
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
                <p className="text-lg font-medium text-gray-500">בחר הודעה לקריאה</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
