
import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import type { Word } from '../types';

interface WordCardProps {
  wordData: Word;
  language: string;
}

export const WordCard: React.FC<WordCardProps> = ({ wordData, language }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playPronunciation = () => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return;
    }

    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(wordData.transliteration);

    // Set language-specific voice settings
    if (language === 'Hebrew') {
      utterance.lang = 'he-IL';
    } else if (language === 'Greek') {
      utterance.lang = 'el-GR';
    }

    utterance.rate = 0.8; // Slower for learning
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.cancel(); // Clear any pending speech
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-stone-800 rounded-2xl shadow-lg p-8 md:p-12 text-center transform transition-all duration-500 animate-fade-in-up">
      <h2 className="text-6xl md:text-8xl font-serif text-sky-900 dark:text-sky-200 mb-4" lang="he" dir="rtl">{wordData.word}</h2>
      <div className="flex items-center justify-center gap-3 mb-2">
        <p className="text-2xl text-stone-600 dark:text-stone-400">{wordData.transliteration}</p>
        <button
          onClick={playPronunciation}
          disabled={isPlaying}
          className="p-2 rounded-full bg-sky-500 hover:bg-sky-600 disabled:bg-stone-400 text-white transition-all transform hover:scale-110 active:scale-95"
          title="Play pronunciation"
        >
          <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
        </button>
      </div>
      <p className="text-lg text-stone-500 dark:text-stone-500 italic">"{wordData.meaning}"</p>
    </div>
  );
};
