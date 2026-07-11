import type { Route } from "./+types/student.settings";
import MainLayout from "../components/MainLayout";
import { useState } from "react";
import { Bell, Monitor, Shield, ChevronLeft, Check } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "הגדרות | Check Hit" },
    { name: "description", content: "הגדרות חשבון סטודנט" },
  ];
}

type TabId = 'notifications' | 'display' | 'privacy';

export default function StudentSettings() {
  const [activeTab, setActiveTab] = useState<TabId>('notifications');

  const [settings, setSettings] = useState({
    notifyNewAssignments: true,
    notifyGrades: true,
    notifyDeadlines: false,
    theme: 'system', // 'light', 'dark', 'system'
    language: 'he', // 'he', 'en'
    allowAiAnalytics: true,
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
    <MainLayout portalName="פורטל סטודנטים" view="student">
      <div className="animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">הגדרות</h1>
          <p className="text-gray-500 mt-1">נהל את ההעדפות וההגדרות של החשבון שלך</p>
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
                  <h3 className="text-sm font-bold tracking-wider text-gray-400 uppercase mb-4">עדכונים אקדמיים</h3>
                  <div className="bg-gray-50/50 rounded-xl border border-gray-100 px-5">
                    <ToggleSwitch 
                      label="מטלות חדשות" 
                      description="קבל התראה כאשר מרצה מפרסם מטלה חדשה בקורס"
                      checked={settings.notifyNewAssignments}
                      onChange={() => handleToggle('notifyNewAssignments')}
                    />
                    <ToggleSwitch 
                      label="ציונים ומשוב AI" 
                      description="קבל התראה ברגע שציון או משוב אוטומטי זמין לצפייה"
                      checked={settings.notifyGrades}
                      onChange={() => handleToggle('notifyGrades')}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold tracking-wider text-gray-400 uppercase mb-4">תזכורות</h3>
                  <div className="bg-gray-50/50 rounded-xl border border-gray-100 px-5">
                    <ToggleSwitch 
                      label="התקרבות למועד הגשה" 
                      description="תזכורת 24 שעות לפני מועד ההגשה של מטלה פתוחה"
                      checked={settings.notifyDeadlines}
                      onChange={() => handleToggle('notifyDeadlines')}
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
                      <button 
                        onClick={() => setSettings({...settings, theme: 'light'})}
                        className={`py-3 px-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${settings.theme === 'light' ? 'border-[#00857e] bg-teal-50 text-[#00857e]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >
                        <div className="w-8 h-8 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center">
                          {settings.theme === 'light' && <Check size={16} />}
                        </div>
                        <span className="font-medium text-sm">בהיר</span>
                      </button>
                      <button 
                        onClick={() => setSettings({...settings, theme: 'dark'})}
                        className={`py-3 px-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${settings.theme === 'dark' ? 'border-[#00857e] bg-teal-50 text-[#00857e]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-700 shadow-sm flex items-center justify-center text-white">
                          {settings.theme === 'dark' && <Check size={16} />}
                        </div>
                        <span className="font-medium text-sm">כהה</span>
                      </button>
                      <button 
                        onClick={() => setSettings({...settings, theme: 'system'})}
                        className={`py-3 px-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${settings.theme === 'system' ? 'border-[#00857e] bg-teal-50 text-[#00857e]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-900 to-white border border-gray-300 shadow-sm flex items-center justify-center">
                          {settings.theme === 'system' && <Check size={16} className="text-gray-500" />}
                        </div>
                        <span className="font-medium text-sm">מערכת</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">שפת ממשק</label>
                    <select 
                      value={settings.language}
                      onChange={(e) => setSettings({...settings, language: e.target.value})}
                      className="mt-1 block w-full rounded-lg border-gray-200 py-3 px-4 text-gray-900 focus:border-[#00857e] focus:ring-[#00857e] sm:text-sm bg-gray-50 outline-none"
                    >
                      <option value="he">עברית (Hebrew)</option>
                      <option value="en">English (אנגלית)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">פרטיות ומערכת AI</h2>
                
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 mb-8 flex gap-3 text-sm">
                  <Shield size={20} className="shrink-0 text-blue-600" />
                  <div>
                    <strong>שקיפות נתונים:</strong> המערכת פועלת תחת תקנות הפרטיות המחמירות ביותר. הנתונים שלך משמשים אך ורק לצורך בדיקת המטלות ומתן משוב.
                  </div>
                </div>

                <div className="bg-gray-50/50 rounded-xl border border-gray-100 px-5">
                  <ToggleSwitch 
                    label="תרומה לשיפור מודל הבדיקה" 
                    description="אפשר שימוש בנתונים אנונימיים מהמטלות שלך (ללא פרטים מזהים) כדי לשפר את אלגוריתם הבדיקה האוטומטית של מוסד הלימודים."
                    checked={settings.allowAiAnalytics}
                    onChange={() => handleToggle('allowAiAnalytics')}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
