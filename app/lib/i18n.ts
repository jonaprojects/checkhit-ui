import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import heTranslations from '../locales/he.json';
import enTranslations from '../locales/en.json';
import arTranslations from '../locales/ar.json';
import ruTranslations from '../locales/ru.json';

export const SUPPORTED_LANGUAGES = ['he', 'en', 'ar', 'ru'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const RTL_LANGUAGES: SupportedLanguage[] = ['he', 'ar'];

export function isRtlLanguage(lang: string): boolean {
  return RTL_LANGUAGES.includes(lang.split('-')[0] as SupportedLanguage);
}

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources: {
      he: heTranslations,
      en: enTranslations,
      ar: arTranslations,
      ru: ruTranslations
    },
    supportedLngs: SUPPORTED_LANGUAGES,
    fallbackLng: 'he',
    debug: false,

    interpolation: {
      escapeValue: false, // React already escapes values
    }
  });

export default i18n;
