import React, { useState } from 'react';
import { Language } from '../types';
import { HEBREW_ALPHABET, GREEK_ALPHABET, Letter } from '../alphabets';
import { ArrowLeft, Volume2 } from 'lucide-react';

interface AlphabetLearningProps {
  language: Language;
  onBack: () => void;
}

export const AlphabetLearning: React.FC<AlphabetLearningProps> = ({ language, onBack }) => {
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  const alphabet = language === Language.HEBREW ? HEBREW_ALPHABET : GREEK_ALPHABET;
  const languageName = language === Language.HEBREW ? '希伯來文' : '希臘文';
  const direction = language === Language.HEBREW ? 'rtl' : 'ltr';

  const handleLetterClick = (letter: Letter) => {
    setSelectedLetter(letter);
  };

  const handlePlayAudio = (letter: Letter) => {
    // Placeholder for TTS functionality
    const utterance = new SpeechSynthesisUtterance(letter.name);
    utterance.lang = language === Language.HEBREW ? 'he-IL' : 'el-GR';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full min-h-screen p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-stone-600 dark:text-stone-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回</span>
        </button>
        <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">
          {languageName}字母表
        </h1>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alphabet Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-stone-700 dark:text-stone-200 mb-4">
              所有字母 ({alphabet.length} 個)
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {alphabet.map((letter, index) => (
                <button
                  key={index}
                  onClick={() => handleLetterClick(letter)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all transform hover:scale-110 hover:shadow-lg ${
                    selectedLetter === letter
                      ? 'bg-sky-500 text-white shadow-xl scale-105'
                      : 'bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-900/30 dark:to-sky-800/30 text-stone-800 dark:text-stone-100 hover:from-sky-100 hover:to-sky-200 dark:hover:from-sky-800/40 dark:hover:to-sky-700/40'
                  }`}
                >
                  <div
                    className="text-3xl font-bold mb-1"
                    dir={direction}
                    style={{ fontFamily: language === Language.HEBREW ? 'serif' : 'serif' }}
                  >
                    {letter.letter.split(' ')[0]}
                  </div>
                  <div className="text-xs opacity-80">{letter.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Letter Details Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg p-6 sticky top-6">
            {selectedLetter ? (
              <div className="space-y-4 animate-fade-in">
                <div className="text-center pb-4 border-b border-stone-200 dark:border-stone-700">
                  <div
                    className="text-7xl font-bold text-sky-600 dark:text-sky-400 mb-3"
                    dir={direction}
                    style={{ fontFamily: language === Language.HEBREW ? 'serif' : 'serif' }}
                  >
                    {selectedLetter.letter}
                  </div>
                  <h3 className="text-2xl font-semibold text-stone-800 dark:text-stone-100 mb-1">
                    {selectedLetter.name}
                  </h3>
                  <button
                    onClick={() => handlePlayAudio(selectedLetter)}
                    className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-sky-100 dark:bg-sky-900/50 hover:bg-sky-200 dark:hover:bg-sky-800/50 rounded-lg transition-colors text-sky-700 dark:text-sky-300"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span className="text-sm">播放發音</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-1">
                      轉寫
                    </h4>
                    <p className="text-lg text-stone-800 dark:text-stone-100 font-mono bg-stone-50 dark:bg-stone-900/50 px-3 py-2 rounded-lg">
                      {selectedLetter.transliteration}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-1">
                      發音
                    </h4>
                    <p className="text-base text-stone-700 dark:text-stone-200 bg-stone-50 dark:bg-stone-900/50 px-3 py-2 rounded-lg">
                      {selectedLetter.pronunciation}
                    </p>
                  </div>

                  {selectedLetter.numericalValue && (
                    <div>
                      <h4 className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-1">
                        數值
                      </h4>
                      <p className="text-lg text-stone-800 dark:text-stone-100 font-mono bg-stone-50 dark:bg-stone-900/50 px-3 py-2 rounded-lg">
                        {selectedLetter.numericalValue}
                      </p>
                    </div>
                  )}

                  {selectedLetter.notes && (
                    <div>
                      <h4 className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-1">
                        注意事項
                      </h4>
                      <p className="text-sm text-stone-600 dark:text-stone-300 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800">
                        {selectedLetter.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-stone-400 dark:text-stone-500">
                <p className="text-lg mb-2">點選字母</p>
                <p className="text-sm">查看詳細資訊</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
