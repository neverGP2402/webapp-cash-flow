import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './en/common.json';
import viCommonTranslations from './vi/common.json';
import viAssetDetailTranslations from './vi/asset-detail.json';
import viProfileSettingsTranslations from './vi/profile-settings.json';
import deTranslations from './de/common.json';
import frTranslations from './fr/common.json';

// Supported languages
export const SUPPORTED_LANGUAGES = {
  en: {
    name: 'English',
    code: 'en',
    flag: '🇺🇸',
  },
  vi: {
    name: 'Tiếng Việt',
    code: 'vi',
    flag: '🇻🇳',
  },
  de: {
    name: 'German',
    code: 'de',
    flag: '🇩🇪',
  },
  fr: {
    name: 'French',
    code: 'fr',
    flag: '🇫🇷',
  },
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// Default language
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// Get saved language or use default
const getInitialLanguage = (): SupportedLanguage => {
  const savedLanguage = localStorage.getItem('selectedLanguage') as SupportedLanguage;
  return savedLanguage || DEFAULT_LANGUAGE;
};

// i18n configuration
const i18nConfig = {
  lng: getInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  debug: process.env.NODE_ENV === 'development',
  
  interpolation: {
    escapeValue: false,
  },
  
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage'],
  },
  
  resources: {
    en: {
      common: enTranslations,
    },
    vi: {
      common: viCommonTranslations,
      assetDetail: viAssetDetailTranslations,
      profileSettings: viProfileSettingsTranslations,
    },
    de: {
      common: deTranslations,
    },
    fr: {
      common: frTranslations,
    },
  },
};

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(i18nConfig);

export default i18n;
