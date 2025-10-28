import React from 'react';
import LanguageApp from '../language/App';
import { ArrowLeft } from 'lucide-react';

interface BiblicalLanguageProps {
  onBack: () => void;
}

export const BiblicalLanguage: React.FC<BiblicalLanguageProps> = ({ onBack }) => {
  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-stone-50 to-sky-100 dark:from-gray-900 dark:to-stone-900 transition-colors">
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 text-stone-700 dark:text-stone-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">返回主頁</span>
        </button>
      </div>
      <LanguageApp />
    </div>
  );
};
