
import React from 'react';
import { Mic, Volume2, Info } from 'lucide-react';
import { Language, LearningMode } from '../types';

interface LanguageSelectorProps {
  onSelect: (language: Language) => void;
  onSelectMode?: (mode: LearningMode, language: Language) => void;
}

const LanguageCard: React.FC<{
  title: string;
  description: string;
  language: Language;
  onSelectMode: (mode: LearningMode, lang: Language) => void;
}> = ({ title, description, language, onSelectMode }) => (
  <div className="w-full max-w-sm">
    <h2 className="text-2xl font-bold text-sky-800 dark:text-sky-300 mb-4 text-center">{title}</h2>
    <p className="text-stone-600 dark:text-stone-400 mb-4 text-center">{description}</p>
    <div className="flex flex-col gap-3">
      <button
        onClick={() => onSelectMode('alphabet-learning', language)}
        className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
      >
        <div className="text-lg font-bold mb-1">字母表學習</div>
        <div className="text-sm opacity-90">學習所有字母與發音</div>
      </button>
      <button
        onClick={() => onSelectMode('word-practice', language)}
        className="p-6 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
      >
        <div className="text-lg font-bold mb-1">單字練習</div>
        <div className="text-sm opacity-90">發音練習與AI反饋</div>
      </button>
      <button
        onClick={() => onSelectMode('verse-learning', language)}
        className="p-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
      >
        <div className="text-lg font-bold mb-1">經文學習</div>
        <div className="text-sm opacity-90">聖經經文重點詞彙</div>
      </button>
      <button
        onClick={() => onSelectMode('vocabulary-flashcards', language)}
        className="p-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
      >
        <div className="text-lg font-bold mb-1">詞彙記憶卡</div>
        <div className="text-sm opacity-90">間隔重複法學習詞彙</div>
      </button>
      <button
        onClick={() => onSelectMode('listening-game', language)}
        className="p-6 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
      >
        <div className="text-lg font-bold mb-1">聽力理解遊戲</div>
        <div className="text-sm opacity-90">聽音辨詞 100 詞挑戰</div>
      </button>
      <button
        onClick={() => onSelectMode('pronunciation-challenge', language)}
        className="p-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
      >
        <div className="text-lg font-bold mb-1">發音挑戰</div>
        <div className="text-sm opacity-90">辨別正確與錯誤發音</div>
      </button>
    </div>
  </div>
);

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect, onSelectMode }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in px-4">
        <h1 className="text-5xl font-extrabold text-stone-700 dark:text-stone-200 mb-4 text-center">歡迎來到聖經文本學習基礎</h1>
        <p className="text-xl text-stone-500 dark:text-stone-400 mb-8 text-center">選擇一種聖經語言來學習</p>

        {/* Permissions Info */}
        <div className="w-full max-w-2xl mb-8 p-6 bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-700 rounded-xl">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-sky-900 dark:text-sky-100 mb-2">需要權限</h3>
              <p className="text-sm text-sky-800 dark:text-sky-200 mb-3">此應用程式需要訪問您的麥克風和揚聲器才能正常運作：</p>
            </div>
          </div>

          <div className="space-y-3 ml-8">
            <div className="flex items-start gap-3">
              <Volume2 className="w-5 h-5 text-sky-600 dark:text-sky-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-sky-900 dark:text-sky-100">揚聲器權限</p>
                <p className="text-xs text-sky-700 dark:text-sky-300">播放發音範例並聆聽正確的發音</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mic className="w-5 h-5 text-sky-600 dark:text-sky-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-sky-900 dark:text-sky-100">麥克風權限</p>
                <p className="text-xs text-sky-700 dark:text-sky-300">錄製您的發音並接收 AI 反饋</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-sky-200 dark:border-sky-700">
            <p className="text-xs text-sky-600 dark:text-sky-400">
              <strong>提示：</strong>瀏覽器會在需要時請求權限，請點擊「允許」以啟用所有功能。
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
            <LanguageCard
                title="希伯來文"
                description="舊約聖經"
                language={Language.HEBREW}
                onSelectMode={onSelectMode || ((mode, lang) => onSelect(lang))}
            />
            <LanguageCard
                title="古典希臘文"
                description="新約聖經"
                language={Language.GREEK}
                onSelectMode={onSelectMode || ((mode, lang) => onSelect(lang))}
            />
        </div>
    </div>
  );
};
