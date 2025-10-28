import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh-TW' ? 'en' : 'zh-TW';
    i18n.changeLanguage(newLang);
  };

  const currentLanguageLabel = i18n.language === 'zh-TW' ? '中文' : 'EN';

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
      aria-label="Switch language"
    >
      <Globe className="w-4 h-4" />
      <span className="font-medium">{currentLanguageLabel}</span>
    </button>
  );
};
