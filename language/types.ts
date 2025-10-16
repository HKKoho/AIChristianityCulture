
export enum Language {
  HEBREW = 'Hebrew',
  GREEK = 'Greek',
}

export interface Word {
  word: string;
  transliteration: string;
  meaning: string;
}

export type GameState = 'selecting' | 'ready' | 'recording' | 'processing' | 'feedback' | 'error';

export type LearningMode = 'alphabet-learning' | 'word-practice' | 'verse-learning' | 'vocabulary-flashcards' | 'listening-game' | 'pronunciation-challenge';
