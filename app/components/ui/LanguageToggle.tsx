import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES, getCurrentLanguage, type SupportedLanguage } from '../../lib/i18n';

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  he: 'עברית',
  en: 'English',
  ar: 'العربية',
  ru: 'Русский',
};

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentLang = getCurrentLanguage(i18n.language);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectLanguage = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition"
        title="Change Language"
        aria-label="Change interface language"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe size={20} className="me-1" />
        <span className="font-medium text-sm">{LANGUAGE_LABELS[currentLang]}</span>
      </button>

      {isOpen && (
        <div className="absolute end-0 top-full mt-2 w-40 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 z-50 overflow-hidden py-1">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => selectLanguage(lang)}
              className="w-full flex items-center justify-between gap-2 px-4 py-2 text-sm text-start text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <span>{LANGUAGE_LABELS[lang]}</span>
              {lang === currentLang && <Check size={16} className="text-[#00857e]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
