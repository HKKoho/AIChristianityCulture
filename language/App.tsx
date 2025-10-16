
import React, { useState, useRef, useCallback } from 'react';
import { LanguageSelector } from './components/LanguageSelector';
import { AlphabetLearning } from './components/AlphabetLearning';
import { WordCard } from './components/WordCard';
import { RecordButton } from './components/RecordButton';
import { FeedbackDisplay } from './components/FeedbackDisplay';
import { VerseSelector } from './components/VerseSelector';
import { VerseDisplay } from './components/VerseDisplay';
import VocabularyPractice from '../components/language/VocabularyPractice';
import ListeningGame from '../components/language/ListeningGame';
import PronunciationChallenge from '../components/language/PronunciationChallenge';
import { WORD_LISTS } from './constants';
import { getPronunciationFeedback } from './services/geminiService';
import type { Language, Word, GameState, LearningMode } from './types';
import type { BibleVerse } from './bibleVerses';

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error('File could not be read as a string.'));
      }
      const base64String = reader.result;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export default function App() {
  const [learningMode, setLearningMode] = useState<LearningMode | null>(null);
  const [gameState, setGameState] = useState<GameState>('selecting');
  const [language, setLanguage] = useState<Language | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedVerse, setSelectedVerse] = useState<BibleVerse | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const currentWords = language ? WORD_LISTS[language] : [];
  const currentWord = currentWords[currentWordIndex];

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setCurrentWordIndex(0);
    setFeedback(null);
    setError(null);
    setGameState('ready');
  };

  const handleSelectMode = (mode: LearningMode, lang: Language) => {
    setLearningMode(mode);
    setLanguage(lang);
    setCurrentWordIndex(0);
    setFeedback(null);
    setError(null);
    if (mode === 'word-practice') {
      setGameState('ready');
    }
  };

  const handleSelectVerse = (verse: BibleVerse) => {
    setSelectedVerse(verse);
  };

  const handleBackFromVerse = () => {
    setSelectedVerse(null);
  };

  const handleBackToModeSelection = () => {
    setLearningMode(null);
    setLanguage(null);
    setSelectedVerse(null);
    setGameState('selecting');
  };

  const handleMicPermission = () => {
    setError(null);
    setGameState('ready');
  }

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (!currentWord || !language) return;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setFeedback(null);
        setGameState('recording');
        
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];

        recorder.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        recorder.onstop = async () => {
            setGameState('processing');
            const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
            
            try {
              const base64Audio = await blobToBase64(audioBlob);
              const result = await getPronunciationFeedback(currentWord, language, base64Audio, recorder.mimeType);
              setFeedback(result);
            } catch (apiError) {
              console.error(apiError);
              setError('無法從 AI 獲取反饋，請重試。');
              setGameState('error');
            } finally {
               setGameState('feedback');
            }
            stream.getTracks().forEach(track => track.stop()); // Release microphone
        };

        recorder.start();
    } catch (err) {
        console.error('Error accessing microphone:', err);
        setError('需要麥克風權限才能使用。請在瀏覽器設定中啟用麥克風。');
        setGameState('error');
    }
  }, [currentWord, language]);

  const handleRecordClick = () => {
    if (gameState === 'recording') {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const handleNextWord = () => {
    setFeedback(null);
    setError(null);
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % currentWords.length);
    setGameState('ready');
  };

  const resetGame = () => {
    setGameState('selecting');
    setLanguage(null);
    setCurrentWordIndex(0);
    setFeedback(null);
    setError(null);
  }

  return (
    <main className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen font-sans">
      <div className="w-full max-w-5xl flex flex-col items-center">
        {/* Powered by indicator */}
        <div className="absolute top-4 right-4 text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
          <span>Pronunciation powered by</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">Google Gemini 2.5 Flash</span>
        </div>
        {/* Mode selection screen */}
        {!learningMode && gameState === 'selecting' && (
          <LanguageSelector onSelectMode={handleSelectMode} onSelect={handleSelectLanguage} />
        )}

        {/* Alphabet Learning Mode */}
        {learningMode === 'alphabet-learning' && language && (
          <AlphabetLearning language={language} onBack={handleBackToModeSelection} />
        )}

        {/* Verse Learning Mode */}
        {learningMode === 'verse-learning' && language && !selectedVerse && (
          <VerseSelector
            language={language}
            onSelectVerse={handleSelectVerse}
            onBack={handleBackToModeSelection}
          />
        )}

        {learningMode === 'verse-learning' && selectedVerse && (
          <VerseDisplay verse={selectedVerse} onBack={handleBackFromVerse} />
        )}

        {/* Vocabulary Flashcards Mode */}
        {learningMode === 'vocabulary-flashcards' && (
          <VocabularyPractice />
        )}

        {/* Listening Game Mode */}
        {learningMode === 'listening-game' && language && (
          <ListeningGame
            language={language === 'Hebrew' ? 'Hebrew' : 'Greek'}
            onBack={handleBackToModeSelection}
          />
        )}

        {/* Pronunciation Challenge Mode */}
        {learningMode === 'pronunciation-challenge' && language && (
          <PronunciationChallenge
            language={language === 'Hebrew' ? 'Hebrew' : 'Greek'}
            onBack={handleBackToModeSelection}
          />
        )}

        {/* Word Practice Mode */}
        {learningMode === 'word-practice' && gameState !== 'selecting' && (
          <>
            <button onClick={handleBackToModeSelection} className="absolute top-4 left-4 text-sm text-stone-500 hover:text-sky-600 transition-colors">
                &larr; 切換模式
            </button>

            {language && currentWord && (
              <div className="flex flex-col items-center w-full">
                <WordCard wordData={currentWord} language={language} />

                {error && (
                  <div className="w-full max-w-2xl mt-8 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-xl p-6 text-center animate-fade-in">
                    <p className="text-red-800 dark:text-red-200">{error}</p>
                    { gameState === 'error' && error.includes('麥克風') && (
                         <button onClick={handleMicPermission} className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
                            重試
                        </button>
                    )}
                  </div>
                )}

                <FeedbackDisplay feedback={feedback} />

                <div className="mt-12 flex flex-col items-center gap-6">
                  <RecordButton gameState={gameState} onClick={handleRecordClick} />
                  {gameState === 'feedback' && (
                      <button onClick={handleNextWord} className="px-8 py-3 bg-green-600 text-white rounded-full font-bold shadow-md hover:bg-green-700 transition-all transform hover:scale-105 animate-fade-in">
                          下一個單字 &rarr;
                      </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
