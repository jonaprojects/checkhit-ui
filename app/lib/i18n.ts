import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import heTranslations from '../locales/he.json';
import enTranslations from '../locales/en.json';

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources: {
      he: heTranslations,
      en: enTranslations
    },
    fallbackLng: 'he',
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already escapes values
    }
  });

export default i18n;
