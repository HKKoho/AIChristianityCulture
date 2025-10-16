/**
 * Spaced Repetition Algorithm (SM-2)
 * Based on SuperMemo 2 algorithm by Piotr Wozniak
 * https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */

import type { UserVocabularyProgress } from '../language/vocabularyData';

export interface ReviewResult {
  cardId: string;
  quality: 0 | 1 | 2 | 3 | 4 | 5; // 0-5 rating of recall quality
  timestamp: Date;
}

/**
 * Calculate next review date using SM-2 algorithm
 *
 * @param progress Current progress for the card
 * @param quality Quality of recall (0-5):
 *   0 - complete blackout
 *   1 - incorrect response; correct one remembered
 *   2 - incorrect response; correct one seemed easy to recall
 *   3 - correct response recalled with serious difficulty
 *   4 - correct response after hesitation
 *   5 - perfect response
 * @returns Updated progress with new review schedule
 */
export const calculateNextReview = (
  progress: UserVocabularyProgress,
  quality: ReviewResult['quality']
): UserVocabularyProgress => {
  const now = new Date();

  // If quality < 3, reset repetitions and start over
  if (quality < 3) {
    return {
      ...progress,
      lastReviewed: now,
      nextReview: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day
      correctCount: progress.correctCount,
      incorrectCount: progress.incorrectCount + 1,
      easinessFactor: Math.max(1.3, progress.easinessFactor - 0.2), // Decrease EF, minimum 1.3
      interval: 1,
      repetitions: 0
    };
  }

  // Quality >= 3: continue with spaced repetition
  const newRepetitions = progress.repetitions + 1;
  const newCorrectCount = progress.correctCount + 1;

  // Calculate new easiness factor
  // EF' = EF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  const newEasinessFactor = Math.max(
    1.3,
    progress.easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // Calculate new interval
  let newInterval: number;
  if (newRepetitions === 1) {
    newInterval = 1; // First repetition: 1 day
  } else if (newRepetitions === 2) {
    newInterval = 6; // Second repetition: 6 days
  } else {
    // Subsequent repetitions: previous interval * EF
    newInterval = Math.round(progress.interval * newEasinessFactor);
  }

  // Calculate next review date
  const nextReviewDate = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

  return {
    ...progress,
    lastReviewed: now,
    nextReview: nextReviewDate,
    correctCount: newCorrectCount,
    incorrectCount: progress.incorrectCount,
    easinessFactor: newEasinessFactor,
    interval: newInterval,
    repetitions: newRepetitions
  };
};

/**
 * Initialize progress for a new card
 */
export const initializeProgress = (cardId: string): UserVocabularyProgress => {
  const now = new Date();
  return {
    cardId,
    lastReviewed: now,
    nextReview: now, // Due immediately for first review
    correctCount: 0,
    incorrectCount: 0,
    easinessFactor: 2.5, // Default EF
    interval: 0,
    repetitions: 0
  };
};

/**
 * Get cards that are due for review
 */
export const getDueCards = (
  allProgress: UserVocabularyProgress[],
  currentDate: Date = new Date()
): string[] => {
  return allProgress
    .filter(progress => progress.nextReview <= currentDate)
    .sort((a, b) => a.nextReview.getTime() - b.nextReview.getTime())
    .map(progress => progress.cardId);
};

/**
 * Get upcoming review schedule
 */
export const getUpcomingReviews = (
  allProgress: UserVocabularyProgress[],
  days: number = 7
): Map<string, number> => {
  const now = new Date();
  const schedule = new Map<string, number>();

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split('T')[0];

    const count = allProgress.filter(progress => {
      const reviewDate = new Date(progress.nextReview);
      return reviewDate.toISOString().split('T')[0] === dateKey;
    }).length;

    schedule.set(dateKey, count);
  }

  return schedule;
};

/**
 * Calculate retention statistics
 */
export const calculateRetentionStats = (
  progress: UserVocabularyProgress
): {
  totalReviews: number;
  retentionRate: number;
  masteryLevel: 'new' | 'learning' | 'intermediate' | 'advanced' | 'mastered';
} => {
  const totalReviews = progress.correctCount + progress.incorrectCount;
  const retentionRate = totalReviews > 0 ? progress.correctCount / totalReviews : 0;

  let masteryLevel: 'new' | 'learning' | 'intermediate' | 'advanced' | 'mastered';
  if (progress.repetitions === 0) {
    masteryLevel = 'new';
  } else if (progress.repetitions < 3) {
    masteryLevel = 'learning';
  } else if (progress.repetitions < 6) {
    masteryLevel = 'intermediate';
  } else if (progress.repetitions < 10) {
    masteryLevel = 'advanced';
  } else {
    masteryLevel = 'mastered';
  }

  return {
    totalReviews,
    retentionRate,
    masteryLevel
  };
};

/**
 * Get study session recommendations
 */
export const getStudySessionRecommendations = (
  allProgress: UserVocabularyProgress[],
  totalCards: number,
  maxNewCardsPerDay: number = 10,
  maxReviewsPerSession: number = 20
): {
  dueCards: string[];
  newCards: number;
  totalForToday: number;
  recommendation: string;
} => {
  const now = new Date();
  const dueCards = getDueCards(allProgress, now);
  const studiedCardIds = new Set(allProgress.map(p => p.cardId));
  const newCardsAvailable = totalCards - studiedCardIds.size;

  const newCardsToday = Math.min(maxNewCardsPerDay, newCardsAvailable);
  const reviewsToday = Math.min(maxReviewsPerSession, dueCards.length);
  const totalForToday = newCardsToday + reviewsToday;

  let recommendation: string;
  if (reviewsToday > maxReviewsPerSession) {
    recommendation = `You have ${dueCards.length} cards due for review. Focus on reviews today to maintain your progress.`;
  } else if (newCardsAvailable === 0) {
    recommendation = `Great job! You've studied all available cards. Keep reviewing to maintain mastery.`;
  } else if (reviewsToday === 0) {
    recommendation = `No reviews due today. Perfect time to learn ${newCardsToday} new cards!`;
  } else {
    recommendation = `Balance your session: ${reviewsToday} reviews + ${newCardsToday} new cards = ${totalForToday} cards total.`;
  }

  return {
    dueCards,
    newCards: newCardsToday,
    totalForToday,
    recommendation
  };
};

/**
 * Convert quality rating from simple correct/incorrect to 0-5 scale
 */
export const convertSimpleRatingToQuality = (
  wasCorrect: boolean,
  confidence: 'easy' | 'medium' | 'hard'
): ReviewResult['quality'] => {
  if (!wasCorrect) {
    return 1; // Incorrect response
  }

  switch (confidence) {
    case 'easy':
      return 5; // Perfect response
    case 'medium':
      return 4; // Correct after hesitation
    case 'hard':
      return 3; // Correct with serious difficulty
    default:
      return 4;
  }
};

/**
 * Save progress to localStorage
 */
export const saveProgress = (progress: UserVocabularyProgress[]): void => {
  try {
    // Convert Date objects to ISO strings for storage
    const serializedProgress = progress.map(p => ({
      ...p,
      lastReviewed: p.lastReviewed.toISOString(),
      nextReview: p.nextReview.toISOString()
    }));
    localStorage.setItem('biblical-language-vocab-progress', JSON.stringify(serializedProgress));
  } catch (error) {
    console.error('Failed to save vocabulary progress:', error);
  }
};

/**
 * Load progress from localStorage
 */
export const loadProgress = (): UserVocabularyProgress[] => {
  try {
    const stored = localStorage.getItem('biblical-language-vocab-progress');
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    // Convert ISO strings back to Date objects
    return parsed.map((p: any) => ({
      ...p,
      lastReviewed: new Date(p.lastReviewed),
      nextReview: new Date(p.nextReview)
    }));
  } catch (error) {
    console.error('Failed to load vocabulary progress:', error);
    return [];
  }
};
