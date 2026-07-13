import type { Route } from "./+types/lecturer.settings";
import MainLayout from "../components/MainLayout";
import { useState } from "react";
import { Bell, Monitor, Shield, ChevronLeft, Check } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "הגדרות מרצה | Check Hit" },
    { name: "description", content: "הגדרות חשבון מרצה" },
  ];
}

type TabId = 'notifications' | 'display' | 'privacy';

export default function LecturerSettings() {
  const [activeTab, setActiveTab] = useState<TabId>('notifications');

  const [settings, setSettings] = useState({
    notifyAppeals: true,
    notifyAiDone: true,
    notifyLateSubmissions: false,
    theme: 'system', // 'light', 'dark', 'system'
    language: 'he', // 'he', 'en'
    allowAiAnalysis: true,
    showEmail: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      setSettings({ ...settings, [key]: !settings[key] });
    }
  };

  const ToggleSwitch = ({ checked, onChange, label, description }: any) => (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0">
      <div>
        <h3 className="font-medium text-gray-900">{label}</h3>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      <button 
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-[#00857e]' : 'bg-gray-200'}`}
        role="switch"
        aria-checked={checked}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? '-translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  return (
    <MainLayout portalName="פורטל מרצים" view="lecturer">
      <div className="animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">הגדרות מרצה</h1>
          <p className="text-gray-500 mt-1">נהל את ההעדפות וההגדרות של חשבון המרצה שלך</p>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Settings Navigation */}
          <div className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col space-y-1">
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-start ${
                  activeTab === 'notifications' 
                    ? 'bg-teal-50 text-[#00857e] font-bold' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Bell size={20} className={activeTab === 'notifications' ? 'text-[#00857e]' : 'text-gray-400'} />
                התראות
                <ChevronLeft size={16} className={`ms-auto ${activeTab === 'notifications' ? 'opacity-100' : 'opacity-0'}`} />
              </button>
              
              <button 
                onClick={() => setActiveTab('display')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-start ${
                  activeTab === 'display' 
                    ? 'bg-teal-50 text-[#00857e] font-bold' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Monitor size={20} className={activeTab === 'display' ? 'text-[#00857e]' : 'text-gray-400'} />
                תצוגה ונגישות
                <ChevronLeft size={16} className={`ms-auto ${activeTab === 'display' ? 'opacity-100' : 'opacity-0'}`} />
              </button>
              
              <button 
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-start ${
                  activeTab === 'privacy' 
                    ? 'bg-teal-50 text-[#00857e] font-bold' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Shield size={20} className={activeTab === 'privacy' ? 'text-[#00857e]' : 'text-gray-400'} />
                פרטיות ומידע
                <ChevronLeft size={16} className={`ms-auto ${activeTab === 'privacy' ? 'opacity-100' : 'opacity-0'}`} />
              </button>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6 lg:p-8 min-h-[500px]">
            {activeTab === 'notifications' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">הגדרות התראות</h2>
                
                <div className="mb-8">
                  <h3 className="text-sm font-bold tracking-wider text-gray-400 uppercase mb-4">עדכונים שוטפים</h3>
                  <div className="bg-gray-50/50 rounded-xl border border-gray-100 px-5">
                    <ToggleSwitch 
                      label="ערעורים חדשים" 
                      description="קבל התראה כאשר סטודנט מגיש ערעור על ציון במטלה"
                      checked={settings.notifyAppeals}
                      onChange={() => handleToggle('notifyAppeals')}
                    />
                    <ToggleSwitch 
                      label="סיום בדיקת AI" 
                      description="קבל התראה ברגע שמערכת ה-AI מסיימת לבדוק סבב הגשות"
                      checked={settings.notifyAiDone}
                      onChange={() => handleToggle('notifyAiDone')}
                    />
                    <ToggleSwitch 
                      label="הגשות באיחור" 
                      description="קבל התראה מיידית כאשר מתבצעת הגשה לאחר תאריך היעד"
                      checked={settings.notifyLateSubmissions}
                      onChange={() => handleToggle('notifyLateSubmissions')}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'display' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">תצוגה ונגישות</h2>
                
                <div className="space-y-6 max-w-lg">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">ערכת נושא</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['light', 'dark', 'system'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setSettings({ ...settings, theme: t })}
                          className={`py-2 px-4 rounded-xl border font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                            settings.theme === t 
                              ? 'bg-teal-50 border-[#00857e] text-[#00857e]' 
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {settings.theme === t && <Check size={16} />}
                          {t === 'light' ? 'בהיר' : t === 'dark' ? 'כהה' : 'מערכת'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">שפת ממשק</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['he', 'en'] as const).map((l) => (
                        <button
                          key={l}
                          onClick={() => setSettings({ ...settings, language: l })}
                          className={`py-2 px-4 rounded-xl border font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                            settings.language === l 
                              ? 'bg-teal-50 border-[#00857e] text-[#00857e]' 
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {settings.language === l && <Check size={16} />}
                          {l === 'he' ? 'עברית' : 'English'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">פרטיות ומידע</h2>
                
                <div className="mb-8">
                  <h3 className="text-sm font-bold tracking-wider text-gray-400 uppercase mb-4">ניהול נתונים</h3>
                  <div className="bg-gray-50/50 rounded-xl border border-gray-100 px-5">
                    <ToggleSwitch 
                      label="ניתוח מגמות בדיקה" 
                      description="אפשר למערכת ה-AI לנתח את דפוסי מתן הציונים שלך כדי להפיק תובנות וסטטיסטיקות"
                      checked={settings.allowAiAnalysis}
                      onChange={() => handleToggle('allowAiAnalysis')}
                    />
                    <ToggleSwitch 
                      label="הצג דוא״ל לסטודנטים" 
                      description="אפשר לסטודנטים הרשומים לקורסים שלך לראות את כתובת הדוא״ל האוניברסיטאית שלך"
                      checked={settings.showEmail}
                      onChange={() => handleToggle('showEmail')}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
