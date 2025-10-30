import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from '../locales/en/common.json';
import enEat from '../locales/en/eat.json';
import enWalk from '../locales/en/walk.json';
import enListen from '../locales/en/listen.json';
import enSee from '../locales/en/see.json';
import enRead from '../locales/en/read.json';
import enMeditate from '../locales/en/meditate.json';
import enLanding from '../locales/en/landing.json';
import enAiSearch from '../locales/en/aiSearch.json';
import enMcp from '../locales/en/mcp.json';
import enExplorer from '../locales/en/explorer.json';

import zhCommon from '../locales/zh-TW/common.json';
import zhEat from '../locales/zh-TW/eat.json';
import zhWalk from '../locales/zh-TW/walk.json';
import zhListen from '../locales/zh-TW/listen.json';
import zhSee from '../locales/zh-TW/see.json';
import zhRead from '../locales/zh-TW/read.json';
import zhMeditate from '../locales/zh-TW/meditate.json';
import zhLanding from '../locales/zh-TW/landing.json';
import zhAiSearch from '../locales/zh-TW/aiSearch.json';
import zhMcp from '../locales/zh-TW/mcp.json';
import zhExplorer from '../locales/zh-TW/explorer.json';

const resources = {
  en: {
    common: enCommon,
    eat: enEat,
    walk: enWalk,
    listen: enListen,
    see: enSee,
    read: enRead,
    meditate: enMeditate,
    landing: enLanding,
    aiSearch: enAiSearch,
    mcp: enMcp,
    explorer: enExplorer,
  },
  'zh-TW': {
    common: zhCommon,
    eat: zhEat,
    walk: zhWalk,
    listen: zhListen,
    see: zhSee,
    read: zhRead,
    meditate: zhMeditate,
    landing: zhLanding,
    aiSearch: zhAiSearch,
    mcp: zhMcp,
    explorer: zhExplorer,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh-TW', // Default to Traditional Chinese
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
