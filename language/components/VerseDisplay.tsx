import React, { useState } from 'react';
import { Volume2, BookOpen, ArrowLeft } from 'lucide-react';
import { BibleVerse, HighlightedWord } from '../bibleVerses';

interface VerseDisplayProps {
  verse: BibleVerse;
  onBack: () => void;
}

export const VerseDisplay: React.FC<VerseDisplayProps> = ({ verse, onBack }) => {
  const [selectedWord, setSelectedWord] = useState<HighlightedWord | null>(null);
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [isPlayingVerse, setIsPlayingVerse] = useState(false);

  const playPronunciation = (word: HighlightedWord) => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return;
    }

    setPlayingWord(word.original);
    const utterance = new SpeechSynthesisUtterance(word.transliteration);

    // Set language-specific voice settings
    utterance.lang = verse.language === 'Hebrew' ? 'he-IL' : 'el-GR';
    utterance.rate = 0.7;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setPlayingWord(null);
    };

    utterance.onerror = () => {
      setPlayingWord(null);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const playEntireVerse = () => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return;
    }

    if (!verse.originalText) {
      console.error('No original text available');
      return;
    }

    setIsPlayingVerse(true);
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(verse.originalText);

    // Set language-specific voice settings
    utterance.lang = verse.language === 'Hebrew' ? 'he-IL' : 'el-GR';
    utterance.rate = 0.6; // Slower for full verse comprehension
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setIsPlayingVerse(false);
    };

    utterance.onerror = () => {
      setIsPlayingVerse(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopVerse = () => {
    window.speechSynthesis.cancel();
    setIsPlayingVerse(false);
  };

  return (
    <div className="w-full max-w-5xl p-6 animate-fade-in-up">
      <button
        onClick={onBack}
        className="mb-6 text-sm text-stone-500 hover:text-sky-600 transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        返回經文列表
      </button>

      {/* Reference Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-3 px-6 py-3 bg-sky-100 dark:bg-sky-900/30 rounded-full">
          <BookOpen className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          <h2 className="text-2xl font-bold text-sky-800 dark:text-sky-300">{verse.reference}</h2>
        </div>
      </div>

      {/* Translation */}
      <div className="mb-8 p-6 bg-white dark:bg-stone-800 rounded-2xl shadow-lg">
        <h3 className="text-sm font-semibold text-stone-500 dark:text-stone-400 mb-3 uppercase tracking-wide">
          英文翻譯
        </h3>
        <p className="text-xl text-stone-700 dark:text-stone-200 leading-relaxed italic">
          "{verse.translation}"
        </p>
      </div>

      {/* Original Text (if available) */}
      {verse.originalText && (
        <div className="mb-8 p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
              原文經文
            </h3>
            <button
              onClick={isPlayingVerse ? stopVerse : playEntireVerse}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                isPlayingVerse
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              <Volume2 className={`w-5 h-5 ${isPlayingVerse ? 'animate-pulse' : ''}`} />
              <span className="text-sm">
                {isPlayingVerse ? '停止朗讀' : '朗讀整段經文'}
              </span>
            </button>
          </div>
          <p
            className="text-3xl md:text-4xl text-amber-900 dark:text-amber-200 leading-relaxed font-serif"
            dir={verse.language === 'Hebrew' ? 'rtl' : 'ltr'}
          >
            {verse.originalText}
          </p>
          <div className="mt-3 text-xs text-amber-700 dark:text-amber-400 italic">
            {verse.language === 'Hebrew' ? '希伯來語朗讀' : '希臘語朗讀'} ·
            點擊上方按鈕聆聽完整經文發音
          </div>
        </div>
      )}

      {/* Highlighted Words */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-sky-800 dark:text-sky-300 mb-4">
          重點詞彙學習
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {verse.highlightedWords.map((word, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedWord(word);
                playPronunciation(word);
              }}
              className={`group p-5 rounded-xl transition-all duration-300 border-2 text-left ${
                selectedWord?.original === word.original
                  ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-500 shadow-lg scale-105'
                  : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-sky-400 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="text-3xl font-serif text-sky-900 dark:text-sky-200"
                  dir={verse.language === 'Hebrew' ? 'rtl' : 'ltr'}
                >
                  {word.original}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playPronunciation(word);
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    playingWord === word.original
                      ? 'bg-sky-500 text-white'
                      : 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-800/50'
                  }`}
                >
                  <Volume2 className={`w-4 h-4 ${playingWord === word.original ? 'animate-pulse' : ''}`} />
                </button>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-medium text-stone-700 dark:text-stone-300">
                  {word.transliteration}
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  {word.meaning}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Word Details */}
      {selectedWord && (
        <div className="p-6 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl shadow-xl text-white animate-fade-in">
          <h3 className="text-sm font-semibold uppercase tracking-wide mb-3 opacity-90">
            當前選擇的詞彙
          </h3>
          <div className="flex items-center gap-6">
            <div
              className="text-6xl font-serif"
              dir={verse.language === 'Hebrew' ? 'rtl' : 'ltr'}
            >
              {selectedWord.original}
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold mb-1">{selectedWord.transliteration}</p>
              <p className="text-lg opacity-90">{selectedWord.meaning}</p>
            </div>
            <button
              onClick={() => playPronunciation(selectedWord)}
              className="p-4 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <Volume2 className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
