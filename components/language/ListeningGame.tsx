import React, { useState, useEffect } from 'react';
import type { VocabularyCard } from '../../language/vocabularyData';
import { getAllVocabulary, getVocabularyByLanguage } from '../../language/vocabularyData';
import { speakWord, preloadVoices } from '../../services/textToSpeech';

type GameState = 'ready' | 'playing' | 'correct' | 'incorrect' | 'complete';

interface ListeningGameProps {
  language: 'Hebrew' | 'Greek';
  onBack: () => void;
}

const ListeningGame: React.FC<ListeningGameProps> = ({ language, onBack }) => {
  const [gameState, setGameState] = useState<GameState>('ready');
  const [currentQuestion, setCurrentQuestion] = useState<{
    correct: VocabularyCard;
    options: VocabularyCard[];
  } | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  const TOTAL_QUESTIONS = 10;

  // Preload voices on mount
  useEffect(() => {
    preloadVoices().then(() => {
      setVoicesLoaded(true);
    });
  }, []);

  // Generate a new question
  const generateQuestion = () => {
    const vocabulary = getVocabularyByLanguage(language);

    // Pick random correct answer
    const correctCard = vocabulary[Math.floor(Math.random() * vocabulary.length)];

    // Pick 3 random wrong answers (different from correct)
    const wrongOptions: VocabularyCard[] = [];
    const availableCards = vocabulary.filter(card => card.id !== correctCard.id);

    while (wrongOptions.length < 3 && availableCards.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      wrongOptions.push(availableCards[randomIndex]);
      availableCards.splice(randomIndex, 1);
    }

    // Shuffle options
    const options = [correctCard, ...wrongOptions].sort(() => Math.random() - 0.5);

    setCurrentQuestion({ correct: correctCard, options });
    setSelectedAnswer(null);
    setGameState('playing');
  };

  // Start the game
  const handleStart = () => {
    setScore({ correct: 0, total: 0 });
    setQuestionsCompleted(0);
    generateQuestion();
  };

  // Play audio for current word
  const handlePlayAudio = async () => {
    if (!currentQuestion || isPlaying) return;

    setIsPlaying(true);
    try {
      await speakWord(currentQuestion.correct);
    } catch (error) {
      console.error('Error playing audio:', error);
      alert('無法播放音頻。您的瀏覽器可能不支援此語言的語音合成。');
    } finally {
      setIsPlaying(false);
    }
  };

  // Handle answer selection
  const handleSelectAnswer = (card: VocabularyCard) => {
    if (gameState !== 'playing') return;

    setSelectedAnswer(card.id);

    const isCorrect = card.id === currentQuestion?.correct.id;

    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    setGameState(isCorrect ? 'correct' : 'incorrect');

    // Auto-advance after 2 seconds
    setTimeout(() => {
      const nextQuestion = questionsCompleted + 1;
      setQuestionsCompleted(nextQuestion);

      if (nextQuestion >= TOTAL_QUESTIONS) {
        setGameState('complete');
      } else {
        generateQuestion();
      }
    }, 2000);
  };

  // Render ready screen
  if (gameState === 'ready') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="mb-6 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← 返回
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-6">👂</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              聽力理解遊戲
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {language === 'Hebrew' ? '希伯來文' : '希臘文'}
            </p>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">遊戲規則</h3>
              <ul className="text-sm text-gray-700 space-y-2 text-left max-w-md mx-auto">
                <li>🔊 點擊喇叭圖示聽取單詞發音</li>
                <li>👀 查看 4 個選項</li>
                <li>✅ 選擇你聽到的正確單詞</li>
                <li>🎯 完成 {TOTAL_QUESTIONS} 個問題</li>
              </ul>
            </div>

            {!voicesLoaded && (
              <div className="text-sm text-amber-600 mb-4">
                載入語音中...
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={!voicesLoaded}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              開始遊戲
            </button>

            <div className="mt-6 text-xs text-gray-500">
              提示：確保您的設備音量已開啟
            </div>
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-6">
              {isExcellent ? '🎉' : isGood ? '👍' : '💪'}
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              遊戲完成！
            </h1>

            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-8 mb-6">
              <div className="text-5xl font-bold text-purple-600 mb-2">
                {score.correct} / {score.total}
              </div>
              <div className="text-2xl font-semibold text-gray-700">
                {percentage}% 正確
              </div>
            </div>

            <div className="text-lg text-gray-700 mb-8">
              {isExcellent && '太棒了！您的聽力理解能力很出色！'}
              {isGood && !isExcellent && '做得不錯！繼續練習會更好！'}
              {!isGood && '繼續加油！多聽多練習會進步的！'}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleStart}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all"
              >
                再玩一次
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6">
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
            問題 {questionsCompleted + 1} / {TOTAL_QUESTIONS}
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
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-3 rounded-full transition-all"
              style={{
                width: `${((questionsCompleted + 1) / TOTAL_QUESTIONS) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Audio Player Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              你聽到哪個單詞？
            </h2>

            {/* Play Button */}
            <button
              onClick={handlePlayAudio}
              disabled={isPlaying || gameState !== 'playing'}
              className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 transition-all transform hover:scale-110 shadow-2xl ${
                isPlaying
                  ? 'bg-purple-400 cursor-wait'
                  : 'bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
              }`}
            >
              <span className="text-6xl text-white">
                {isPlaying ? '⏸️' : '🔊'}
              </span>
            </button>

            <p className="text-gray-600 text-sm">
              {isPlaying ? '播放中...' : '點擊播放發音'}
            </p>

            {gameState === 'playing' && (
              <button
                onClick={handlePlayAudio}
                disabled={isPlaying}
                className="mt-4 text-sm text-purple-600 hover:text-purple-700 underline"
              >
                重新播放
              </button>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion?.options.map((card) => {
            const isSelected = selectedAnswer === card.id;
            const isCorrect = card.id === currentQuestion.correct.id;
            const showResult = gameState === 'correct' || gameState === 'incorrect';

            return (
              <button
                key={card.id}
                onClick={() => handleSelectAnswer(card)}
                disabled={gameState !== 'playing'}
                className={`p-6 rounded-xl border-4 transition-all transform hover:scale-105 ${
                  showResult && isCorrect
                    ? 'bg-green-100 border-green-500'
                    : showResult && isSelected && !isCorrect
                    ? 'bg-red-100 border-red-500'
                    : gameState === 'playing'
                    ? 'bg-white border-gray-300 hover:border-purple-400'
                    : 'bg-white border-gray-300'
                }`}
              >
                <div
                  className={`text-4xl font-bold mb-2 ${
                    card.language === 'Hebrew' ? 'font-hebrew' : 'font-greek'
                  }`}
                  dir={card.language === 'Hebrew' ? 'rtl' : 'ltr'}
                >
                  {card.word}
                </div>
                <div className="text-sm text-gray-600 italic mb-1">
                  {card.transliteration}
                </div>

                {/* Show meaning after answer */}
                {showResult && (
                  <div className="text-xs text-gray-600 mt-2">
                    {card.meanings.join(', ')}
                  </div>
                )}

                {/* Result indicator */}
                {showResult && isCorrect && (
                  <div className="mt-3 text-green-600 font-bold">
                    ✓ 正確答案
                  </div>
                )}
                {showResult && isSelected && !isCorrect && (
                  <div className="mt-3 text-red-600 font-bold">✗ 錯誤</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {gameState === 'correct' && (
          <div className="mt-6 p-4 bg-green-100 border-2 border-green-400 rounded-lg text-center">
            <span className="text-2xl mr-2">🎉</span>
            <span className="text-green-800 font-semibold">太棒了！答對了！</span>
          </div>
        )}
        {gameState === 'incorrect' && (
          <div className="mt-6 p-4 bg-red-100 border-2 border-red-400 rounded-lg text-center">
            <span className="text-2xl mr-2">💪</span>
            <span className="text-red-800 font-semibold">
              答錯了！正確答案是: {currentQuestion?.correct.word}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListeningGame;
