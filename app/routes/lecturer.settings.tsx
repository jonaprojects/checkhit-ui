import type { Route } from "./+types/lecturer.settings";
import MainLayout from "../components/MainLayout";
import { useState } from "react";
import { Bell, Monitor, Shield, ChevronLeft, Check } from "lucide-react";
import { useTheme } from "../lib/theme";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "הגדרות מרצה | Check Hit" },
    { name: "description", content: "הגדרות חשבון מרצה" },
  ];
}

type TabId = 'notifications' | 'display' | 'privacy';

export default function LecturerSettings() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const [activeTab, setActiveTab] = useState<TabId>('notifications');
  const { theme, setTheme } = useTheme();

  const [settings, setSettings] = useState({
    notifyAppeals: true,
    notifyAiDone: true,
    notifyLateSubmissions: false,
    language: i18n.language.startsWith('en') ? 'en' : 'he',
    allowAiAnalysis: true,
    showEmail: false,
  });

  // Sync settings state if language is changed externally
  useEffect(() => {
    setSettings(s => ({ ...s, language: i18n.language.startsWith('en') ? 'en' : 'he' }));
  }, [i18n.language]);

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
    <MainLayout portalName={isEn ? "Lecturer Portal" : "פורטל מרצים"} view="lecturer">
      <div className="animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
        
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">{t('settings.lecturerTitle')}</h1>
          <p className="text-gray-500 mt-1">{t('settings.lecturerSubtitle')}</p>
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
                {t('settings.tabNotifications')}
                <ChevronLeft size={16} className={`${isEn ? 'mr-auto rotate-180' : 'ms-auto'} ${activeTab === 'notifications' ? 'opacity-100' : 'opacity-0'}`} />
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
                {t('settings.tabDisplay')}
                <ChevronLeft size={16} className={`${isEn ? 'mr-auto rotate-180' : 'ms-auto'} ${activeTab === 'display' ? 'opacity-100' : 'opacity-0'}`} />
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
                {t('settings.tabPrivacy')}
                <ChevronLeft size={16} className={`${isEn ? 'mr-auto rotate-180' : 'ms-auto'} ${activeTab === 'privacy' ? 'opacity-100' : 'opacity-0'}`} />
              </button>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6 lg:p-8 min-h-[500px]">
            {activeTab === 'notifications' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">{t('settings.notificationsTitle')}</h2>
                
                <div className="mb-8">
                  <h3 className="text-sm font-bold tracking-wider text-gray-400 uppercase mb-4">{t('settings.routineUpdatesTitle')}</h3>
                  <div className="bg-gray-50/50 rounded-xl border border-gray-100 px-5">
                    <ToggleSwitch 
                      label={t('settings.newAppealsTitle')} 
                      description={t('settings.newAppealsDesc')}
                      checked={settings.notifyAppeals}
                      onChange={() => handleToggle('notifyAppeals')}
                    />
                    <ToggleSwitch 
                      label={t('settings.aiDoneTitle')} 
                      description={t('settings.aiDoneDesc')}
                      checked={settings.notifyAiDone}
                      onChange={() => handleToggle('notifyAiDone')}
                    />
                    <ToggleSwitch 
                      label={t('settings.lateSubmissionsTitle')} 
                      description={t('settings.lateSubmissionsDesc')}
                      checked={settings.notifyLateSubmissions}
                      onChange={() => handleToggle('notifyLateSubmissions')}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'display' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">{t('settings.displayTitle')}</h2>
                
                <div className="space-y-6 max-w-lg">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">{t('settings.themeTitle')}</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setTheme('light')}
                        className={`py-3 px-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${theme === 'light' ? 'border-[#00857e] bg-teal-50 text-[#00857e]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >
                        <div className="w-8 h-8 rounded-full bg-[#ffffff] border border-[#d1d5db] shadow-sm flex items-center justify-center">
                          {theme === 'light' && <Check size={16} className="text-[#00857e]" />}
                        </div>
                        <span className="font-medium text-sm">{t('settings.themeLight')}</span>
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`py-3 px-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${theme === 'dark' ? 'border-[#00857e] bg-teal-50 text-[#00857e]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >
                        <div className="w-8 h-8 rounded-full bg-[#111827] border border-[#374151] shadow-sm flex items-center justify-center">
                          {theme === 'dark' && <Check size={16} className="text-white" />}
                        </div>
                        <span className="font-medium text-sm">{t('settings.themeDark')}</span>
                      </button>
                      <button
                        onClick={() => setTheme('system')}
                        className={`py-3 px-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${theme === 'system' ? 'border-[#00857e] bg-teal-50 text-[#00857e]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#111827] to-[#ffffff] border border-[#d1d5db] shadow-sm flex items-center justify-center">
                          {theme === 'system' && <Check size={16} className="text-[#6b7280]" />}
                        </div>
                        <span className="font-medium text-sm">{t('settings.themeSystem')}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">{t('settings.languageTitle')}</label>
                    <select
                      value={settings.language}
                      onChange={(e) => {
                        const newLang = e.target.value;
                        setSettings({ ...settings, language: newLang });
                        i18n.changeLanguage(newLang);
                      }}
                      className={`mt-1 block w-full rounded-lg border-gray-200 py-3 px-4 text-gray-900 focus:border-[#00857e] focus:ring-[#00857e] sm:text-sm bg-gray-50 outline-none ${isEn ? 'text-left' : 'text-right'}`}
                      dir="auto"
                    >
                      <option value="he">{t('settings.languageHe')}</option>
                      <option value="en">{t('settings.languageEn')}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">{t('settings.privacyTitle')}</h2>
                
                <div className="mb-8">
                  <h3 className="text-sm font-bold tracking-wider text-gray-400 uppercase mb-4">{t('settings.dataManagementTitle')}</h3>
                  <div className="bg-gray-50/50 rounded-xl border border-gray-100 px-5">
                    <ToggleSwitch 
                      label={t('settings.analyzeTrendsTitle')} 
                      description={t('settings.analyzeTrendsDesc')}
                      checked={settings.allowAiAnalysis}
                      onChange={() => handleToggle('allowAiAnalysis')}
                    />
                    <ToggleSwitch 
                      label={t('settings.showEmailTitle')} 
                      description={t('settings.showEmailDesc')}
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
