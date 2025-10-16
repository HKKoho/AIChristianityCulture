import React, { useState, useEffect } from 'react';
import FlashCard from './FlashCard';
import type { VocabularyCard, UserVocabularyProgress } from '../../language/vocabularyData';
import {
  getAllVocabulary,
  getVocabularyByLanguage,
  getVocabularyByChapter
} from '../../language/vocabularyData';
import {
  calculateNextReview,
  initializeProgress,
  getDueCards,
  getStudySessionRecommendations,
  convertSimpleRatingToQuality,
  loadProgress,
  saveProgress,
  calculateRetentionStats
} from '../../services/spacedRepetition';

type ViewMode = 'menu' | 'session' | 'stats';
type SessionType = 'review' | 'new' | 'mixed';
type LanguageFilter = 'all' | 'Hebrew' | 'Greek';

const VocabularyPractice: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('menu');
  const [sessionType, setSessionType] = useState<SessionType>('mixed');
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>('all');

  const [allProgress, setAllProgress] = useState<UserVocabularyProgress[]>([]);
  const [sessionCards, setSessionCards] = useState<VocabularyCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    completed: 0,
    correct: 0
  });

  // Load progress on mount
  useEffect(() => {
    const loaded = loadProgress();
    setAllProgress(loaded);
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    if (allProgress.length > 0) {
      saveProgress(allProgress);
    }
  }, [allProgress]);

  // Get all vocabulary
  const allVocabulary = getAllVocabulary();

  // Get recommendations
  const recommendations = getStudySessionRecommendations(allProgress, allVocabulary.length);

  // Start a study session
  const startSession = (type: SessionType, language: LanguageFilter) => {
    let cards: VocabularyCard[] = [];

    // Get vocabulary based on language filter
    const filteredVocab =
      language === 'all'
        ? allVocabulary
        : getVocabularyByLanguage(language);

    // Get studied card IDs
    const studiedCardIds = new Set(allProgress.map(p => p.cardId));

    // Get due cards
    const dueCardIds = new Set(getDueCards(allProgress));

    if (type === 'review') {
      // Only review due cards
      cards = filteredVocab.filter(card => dueCardIds.has(card.id));
    } else if (type === 'new') {
      // Only new cards (not yet studied)
      cards = filteredVocab
        .filter(card => !studiedCardIds.has(card.id))
        .slice(0, 10); // Limit to 10 new cards
    } else {
      // Mixed: due cards + some new cards
      const reviewCards = filteredVocab.filter(card => dueCardIds.has(card.id));
      const newCards = filteredVocab
        .filter(card => !studiedCardIds.has(card.id))
        .slice(0, 5); // Add 5 new cards
      cards = [...reviewCards, ...newCards];
    }

    // Shuffle cards
    cards = cards.sort(() => Math.random() - 0.5);

    setSessionCards(cards);
    setCurrentCardIndex(0);
    setSessionStats({
      total: cards.length,
      completed: 0,
      correct: 0
    });
    setViewMode('session');
  };

  // Handle card rating
  const handleCardRating = (rating: 'again' | 'hard' | 'good' | 'easy', pronunciationScore?: number) => {
    if (sessionCards.length === 0) return;

    const currentCard = sessionCards[currentCardIndex];

    // Convert rating to quality score
    const wasCorrect = rating !== 'again';
    const confidence: 'easy' | 'medium' | 'hard' =
      rating === 'easy' ? 'easy' : rating === 'good' ? 'medium' : 'hard';
    const quality = convertSimpleRatingToQuality(wasCorrect, confidence);

    // If we have pronunciation score, factor it into the session stats
    const pronunciationSuccess = pronunciationScore ? pronunciationScore >= 70 : true;

    // Get or create progress for this card
    let cardProgress = allProgress.find(p => p.cardId === currentCard.id);
    if (!cardProgress) {
      cardProgress = initializeProgress(currentCard.id);
    }

    // Calculate next review
    const updatedProgress = calculateNextReview(cardProgress, quality);

    // Update progress array
    setAllProgress(prev => {
      const filtered = prev.filter(p => p.cardId !== currentCard.id);
      return [...filtered, updatedProgress];
    });

    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      completed: prev.completed + 1,
      correct: prev.correct + (wasCorrect ? 1 : 0)
    }));

    // Move to next card or end session
    if (currentCardIndex < sessionCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // Session complete
      setTimeout(() => {
        setViewMode('menu');
      }, 2000);
    }
  };

  // Calculate overall stats
  const calculateOverallStats = () => {
    const totalStudied = allProgress.length;
    const totalCards = allVocabulary.length;
    const dueToday = getDueCards(allProgress).length;

    const hebrewStudied = allProgress.filter(p => {
      const card = allVocabulary.find(c => c.id === p.cardId);
      return card?.language === 'Hebrew';
    }).length;

    const greekStudied = allProgress.filter(p => {
      const card = allVocabulary.find(c => c.id === p.cardId);
      return card?.language === 'Greek';
    }).length;

    const masteryLevels = allProgress.map(p => calculateRetentionStats(p).masteryLevel);
    const mastered = masteryLevels.filter(m => m === 'mastered').length;
    const advanced = masteryLevels.filter(m => m === 'advanced').length;
    const intermediate = masteryLevels.filter(m => m === 'intermediate').length;
    const learning = masteryLevels.filter(m => m === 'learning').length;

    return {
      totalStudied,
      totalCards,
      dueToday,
      hebrewStudied,
      greekStudied,
      mastered,
      advanced,
      intermediate,
      learning
    };
  };

  const overallStats = calculateOverallStats();

  // Render main menu
  if (viewMode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              聖經語言詞彙練習
            </h1>
            <p className="text-gray-600">
              使用間隔重複法掌握希伯來文和希臘文詞彙
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600">
                {overallStats.totalStudied}
              </div>
              <div className="text-sm text-gray-600 mt-1">已學習詞彙</div>
              <div className="text-xs text-gray-400 mt-1">
                / {overallStats.totalCards} 總詞彙
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-amber-600">
                {overallStats.dueToday}
              </div>
              <div className="text-sm text-gray-600 mt-1">今日待複習</div>
              <div className="text-xs text-gray-400 mt-1">
                需要你的注意
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600">
                {overallStats.mastered}
              </div>
              <div className="text-sm text-gray-600 mt-1">已掌握</div>
              <div className="text-xs text-gray-400 mt-1">
                完全記住的詞彙
              </div>
            </div>
          </div>

          {/* Language Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                希伯來文進度
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>已學習:</span>
                  <span className="font-bold">{overallStats.hebrewStudied} / 50</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${(overallStats.hebrewStudied / 50) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                希臘文進度
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>已學習:</span>
                  <span className="font-bold">{overallStats.greekStudied} / 50</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${(overallStats.greekStudied / 50) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation Box */}
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-300 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <h3 className="font-semibold text-indigo-900 mb-2">
                  今日學習建議
                </h3>
                <p className="text-indigo-800">{recommendations.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Session Type Selection */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              選擇練習模式
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <button
                onClick={() => setSessionType('review')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  sessionType === 'review'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-300 hover:border-amber-300'
                }`}
              >
                <div className="text-3xl mb-2">📚</div>
                <div className="font-semibold">複習模式</div>
                <div className="text-sm text-gray-600 mt-1">
                  只複習到期的詞彙
                </div>
                <div className="text-xs text-amber-600 mt-2 font-bold">
                  {recommendations.dueCards.length} 張卡片
                </div>
              </button>

              <button
                onClick={() => setSessionType('new')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  sessionType === 'new'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-300'
                }`}
              >
                <div className="text-3xl mb-2">✨</div>
                <div className="font-semibold">新詞彙</div>
                <div className="text-sm text-gray-600 mt-1">
                  學習新的詞彙
                </div>
                <div className="text-xs text-indigo-600 mt-2 font-bold">
                  最多 {recommendations.newCards} 張卡片
                </div>
              </button>

              <button
                onClick={() => setSessionType('mixed')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  sessionType === 'mixed'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-green-300'
                }`}
              >
                <div className="text-3xl mb-2">🎯</div>
                <div className="font-semibold">混合模式</div>
                <div className="text-sm text-gray-600 mt-1">
                  複習 + 新詞彙
                </div>
                <div className="text-xs text-green-600 mt-2 font-bold">
                  平衡學習
                </div>
              </button>
            </div>

            {/* Language Filter */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                語言選擇
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguageFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    languageFilter === 'all'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setLanguageFilter('Hebrew')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    languageFilter === 'Hebrew'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  希伯來文
                </button>
                <button
                  onClick={() => setLanguageFilter('Greek')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    languageFilter === 'Greek'
                      ? 'bg-green-600 text-white'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  希臘文
                </button>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => startSession(sessionType, languageFilter)}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              開始練習
            </button>
          </div>

          {/* Stats Button */}
          <button
            onClick={() => setViewMode('stats')}
            className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
          >
            查看詳細統計
          </button>
        </div>
      </div>
    );
  }

  // Render study session
  if (viewMode === 'session') {
    if (sessionCards.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-indigo-50 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              沒有需要複習的詞彙！
            </h2>
            <p className="text-gray-600 mb-6">
              所有詞彙都已完成，試試學習新詞彙吧！
            </p>
            <button
              onClick={() => setViewMode('menu')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all"
            >
              返回主選單
            </button>
          </div>
        </div>
      );
    }

    const currentCard = sessionCards[currentCardIndex];
    const isSessionComplete = sessionStats.completed === sessionStats.total;

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-gray-800">
                練習中 {sessionStats.completed + 1} / {sessionStats.total}
              </h2>
              <button
                onClick={() => {
                  if (confirm('確定要結束練習嗎？進度將不會被保存。')) {
                    setViewMode('menu');
                  }
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all"
              >
                結束練習
              </button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all"
                style={{
                  width: `${(sessionStats.completed / sessionStats.total) * 100}%`
                }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>已完成: {sessionStats.completed}</span>
              <span>
                正確率:{' '}
                {sessionStats.completed > 0
                  ? Math.round((sessionStats.correct / sessionStats.completed) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>

          {/* Flashcard */}
          {!isSessionComplete && (
            <FlashCard card={currentCard} onRate={handleCardRating} />
          )}

          {/* Session Complete Message */}
          {isSessionComplete && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                練習完成！
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                完成 {sessionStats.total} 張卡片，正確率{' '}
                {Math.round((sessionStats.correct / sessionStats.total) * 100)}%
              </p>
              <button
                onClick={() => setViewMode('menu')}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
              >
                返回主選單
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render detailed stats view
  if (viewMode === 'stats') {
    const masteryBreakdown = allProgress.map(p => ({
      cardId: p.cardId,
      card: allVocabulary.find(c => c.id === p.cardId),
      stats: calculateRetentionStats(p),
      progress: p
    }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">詳細統計</h1>
            <button
              onClick={() => setViewMode('menu')}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all"
            >
              返回主選單
            </button>
          </div>

          {/* Mastery Level Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              掌握程度分布
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {overallStats.mastered}
                </div>
                <div className="text-sm text-gray-600">已掌握</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {overallStats.advanced}
                </div>
                <div className="text-sm text-gray-600">進階</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {overallStats.intermediate}
                </div>
                <div className="text-sm text-gray-600">中級</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {overallStats.learning}
                </div>
                <div className="text-sm text-gray-600">學習中</div>
              </div>
            </div>
          </div>

          {/* Word List with Progress */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              詞彙進度詳情
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {masteryBreakdown
                .sort((a, b) => b.progress.repetitions - a.progress.repetitions)
                .map(({ cardId, card, stats, progress }) => {
                  if (!card) return null;
                  return (
                    <div
                      key={cardId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`text-xl font-bold ${
                            card.language === 'Hebrew' ? 'font-hebrew' : 'font-greek'
                          }`}
                        >
                          {card.word}
                        </div>
                        <div className="text-sm text-gray-600">
                          {card.transliteration}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-xs text-gray-500">
                          {stats.totalReviews} 次複習
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round(stats.retentionRate * 100)}% 正確
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            stats.masteryLevel === 'mastered'
                              ? 'bg-green-100 text-green-700'
                              : stats.masteryLevel === 'advanced'
                              ? 'bg-blue-100 text-blue-700'
                              : stats.masteryLevel === 'intermediate'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {stats.masteryLevel === 'mastered'
                            ? '已掌握'
                            : stats.masteryLevel === 'advanced'
                            ? '進階'
                            : stats.masteryLevel === 'intermediate'
                            ? '中級'
                            : '學習中'}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default VocabularyPractice;
