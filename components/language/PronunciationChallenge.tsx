import React, { useState, useEffect } from 'react';
import type { VocabularyCard } from '../../language/vocabularyData';
import { getVocabularyByLanguage } from '../../language/vocabularyData';
import {
  generateSimplePronunciationChallenge,
  playPronunciationOption
} from '../../services/pronunciationGenerator';
import { preloadVoices } from '../../services/textToSpeech';

type GameState = 'ready' | 'loading' | 'playing' | 'correct' | 'incorrect' | 'complete';

interface PronunciationChallengeProps {
  language: 'Hebrew' | 'Greek';
  onBack: () => void;
}

const PronunciationChallenge: React.FC<PronunciationChallengeProps> = ({
  language,
  onBack
}) => {
  const [gameState, setGameState] = useState<GameState>('ready');
  const [currentChallenge, setCurrentChallenge] = useState<{
    word: VocabularyCard;
    options: Array<{
      id: string;
      phoneticText: string;
      description: string;
      isCorrect: boolean;
      mistakeType: string | null;
    }>;
  } | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [playingOption, setPlayingOption] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const TOTAL_QUESTIONS = 10;

  // Preload voices on mount
  useEffect(() => {
    preloadVoices().then(() => {
      setVoicesLoaded(true);
    });
  }, []);

  // Generate a new challenge
  const generateChallenge = async () => {
    setGameState('loading');
    setError(null);

    try {
      const vocabulary = getVocabularyByLanguage(language);
      const randomCard = vocabulary[Math.floor(Math.random() * vocabulary.length)];

      const challenge = await generateSimplePronunciationChallenge(randomCard);

      setCurrentChallenge(challenge);
      setSelectedAnswer(null);
      setGameState('playing');
    } catch (err) {
      console.error('Error generating challenge:', err);
      setError('生成挑戰失敗，請重試。');
      setGameState('ready');
    }
  };

  // Start the game
  const handleStart = () => {
    setScore({ correct: 0, total: 0 });
    setQuestionsCompleted(0);
    generateChallenge();
  };

  // Play an option's pronunciation
  const handlePlayOption = async (
    optionId: string,
    phoneticText: string,
    mistakeType: string | null
  ) => {
    if (playingOption || gameState !== 'playing') return;

    setPlayingOption(optionId);
    try {
      await playPronunciationOption(phoneticText, language, mistakeType);
    } catch (error) {
      console.error('Error playing pronunciation:', error);
      setError('無法播放音頻，請檢查瀏覽器設定。');
    } finally {
      setPlayingOption(null);
    }
  };

  // Handle answer selection
  const handleSelectAnswer = (optionId: string, isCorrect: boolean) => {
    if (gameState !== 'playing') return;

    setSelectedAnswer(optionId);

    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    setGameState(isCorrect ? 'correct' : 'incorrect');

    // Auto-advance after 3 seconds
    setTimeout(() => {
      const nextQuestion = questionsCompleted + 1;
      setQuestionsCompleted(nextQuestion);

      if (nextQuestion >= TOTAL_QUESTIONS) {
        setGameState('complete');
      } else {
        generateChallenge();
      }
    }, 3000);
  };

  // Render ready screen
  if (gameState === 'ready') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="mb-6 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← 返回
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              發音挑戰
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {language === 'Hebrew' ? '希伯來文' : '希臘文'}
            </p>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">挑戰規則</h3>
              <ul className="text-sm text-gray-700 space-y-2 text-left max-w-md mx-auto">
                <li>👀 看到一個單詞</li>
                <li>🔊 點擊聽 4 種不同的發音</li>
                <li>✅ 選擇正確的發音</li>
                <li>⚠️ 其他 3 個是常見錯誤</li>
                <li>🎯 完成 {TOTAL_QUESTIONS} 個挑戰</li>
              </ul>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {!voicesLoaded && (
              <div className="text-sm text-amber-600 mb-4">載入語音中...</div>
            )}

            <button
              onClick={handleStart}
              disabled={!voicesLoaded}
              className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              開始挑戰
            </button>

            <div className="mt-6 text-xs text-gray-500">
              提示：仔細聽每個發音的細微差異
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render loading screen
  if (gameState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🤖</div>
          <div className="text-xl font-semibold text-gray-700">
            AI 正在生成挑戰...
          </div>
        </div>
      </div>
    );
  }

  // Render complete screen
  if (gameState === 'complete') {
    const percentage = Math.round((score.correct / score.total) * 100);
    const isExcellent = percentage >= 80;
    const isGood = percentage >= 60;

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-6">
              {isExcellent ? '🏆' : isGood ? '🎯' : '💪'}
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              挑戰完成！
            </h1>

            <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-8 mb-6">
              <div className="text-5xl font-bold text-orange-600 mb-2">
                {score.correct} / {score.total}
              </div>
              <div className="text-2xl font-semibold text-gray-700">
                {percentage}% 正確
              </div>
            </div>

            <div className="text-lg text-gray-700 mb-8">
              {isExcellent && '驚人！您能辨別細微的發音差異！'}
              {isGood && !isExcellent && '不錯！您的發音辨識能力正在進步！'}
              {!isGood && '繼續練習！多聽會幫助您的耳朵變得更敏銳！'}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleStart}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg shadow-lg transition-all"
              >
                再挑戰一次
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition-all"
              >
                返回選單
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render game screen
  if (!currentChallenge) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← 返回
          </button>
          <div className="text-lg font-semibold text-gray-700">
            挑戰 {questionsCompleted + 1} / {TOTAL_QUESTIONS}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>進度</span>
            <span>
              正確: {score.correct} / {score.total}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-orange-600 to-red-600 h-3 rounded-full transition-all"
              style={{
                width: `${((questionsCompleted + 1) / TOTAL_QUESTIONS) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Word Display */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-600 mb-4">
              哪個是正確的發音？
            </h2>

            <div
              className={`text-6xl font-bold mb-4 ${
                currentChallenge.word.language === 'Hebrew'
                  ? 'font-hebrew'
                  : 'font-greek'
              }`}
              dir={currentChallenge.word.language === 'Hebrew' ? 'rtl' : 'ltr'}
            >
              {currentChallenge.word.word}
            </div>

            <div className="text-xl text-gray-600 italic mb-2">
              {currentChallenge.word.transliteration}
            </div>

            <div className="text-sm text-gray-500">
              {currentChallenge.word.meanings.join(', ')}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Pronunciation Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentChallenge.options.map((option, index) => {
            const isSelected = selectedAnswer === option.id;
            const showResult = gameState === 'correct' || gameState === 'incorrect';
            const isPlaying = playingOption === option.id;

            return (
              <div
                key={option.id}
                className={`p-6 rounded-xl border-4 transition-all ${
                  showResult && option.isCorrect
                    ? 'bg-green-100 border-green-500'
                    : showResult && isSelected && !option.isCorrect
                    ? 'bg-red-100 border-red-500'
                    : gameState === 'playing'
                    ? 'bg-white border-gray-300'
                    : 'bg-white border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-gray-700">
                    選項 {index + 1}
                  </span>
                  <button
                    onClick={() =>
                      handlePlayOption(
                        option.id,
                        option.phoneticText,
                        option.mistakeType
                      )
                    }
                    disabled={isPlaying || gameState !== 'playing'}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isPlaying
                        ? 'bg-orange-400 cursor-wait animate-pulse'
                        : 'bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 transform hover:scale-110'
                    }`}
                  >
                    <span className="text-2xl text-white">
                      {isPlaying ? '⏸️' : '🔊'}
                    </span>
                  </button>
                </div>

                {/* Show description after answer */}
                {showResult && (
                  <div className="text-sm text-gray-700 mb-3 bg-gray-50 p-3 rounded">
                    {option.description}
                  </div>
                )}

                {/* Select Button */}
                <button
                  onClick={() => handleSelectAnswer(option.id, option.isCorrect)}
                  disabled={gameState !== 'playing'}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${
                    gameState === 'playing'
                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {gameState === 'playing' ? '選擇此發音' : '已選擇'}
                </button>

                {/* Result indicator */}
                {showResult && option.isCorrect && (
                  <div className="mt-3 text-green-600 font-bold text-center">
                    ✓ 這是正確發音
                  </div>
                )}
                {showResult && isSelected && !option.isCorrect && (
                  <div className="mt-3 text-red-600 font-bold text-center">
                    ✗ 這是錯誤發音
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Feedback */}
        {gameState === 'correct' && (
          <div className="mt-6 p-4 bg-green-100 border-2 border-green-400 rounded-lg text-center">
            <span className="text-2xl mr-2">🎉</span>
            <span className="text-green-800 font-semibold">
              太棒了！您選對了正確的發音！
            </span>
          </div>
        )}
        {gameState === 'incorrect' && (
          <div className="mt-6 p-4 bg-red-100 border-2 border-red-400 rounded-lg text-center">
            <span className="text-2xl mr-2">💪</span>
            <span className="text-red-800 font-semibold">
              答錯了！仔細聽每個發音的差異。
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PronunciationChallenge;
