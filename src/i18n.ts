import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationTA from './locales/ta/translation.json';
import translationHI from './locales/hi/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  ta: {
    translation: translationTA,
  },
  hi: {
    translation: translationHI,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector) // detect user language
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
