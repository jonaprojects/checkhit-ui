import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('he') ? 'en' : 'he';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition"
      title="Change Language"
      aria-label="Toggle language between English and Hebrew"
    >
      <Globe size={20} className="me-1" />
      <span className="font-medium text-sm">
        {i18n.language.startsWith('en') ? 'עב' : 'EN'}
      </span>
    </button>
  );
}
