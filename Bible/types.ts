
import { BibleVersion } from './constants';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
}

export interface Quest {
  id: string;
  character: string;
  characterImage: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  journalPrompt: {
    title: string;
    content: string;
  };
  deepDive: {
    title: string;
    content: string;
    sources: {
      text: string;
      url: string;
    }[];
  };
}

export interface Location {
  id: string;
  name: string;
  era: string;
  position: { top: string; left: string };
  questId: string;
  dependency?: string; // ID of location that must be completed first
}

export interface Level {
  id: string;
  name: string;
  locationIds: string[];
  discussionPrompts: string[];
}

export interface GameContextType {
  completedQuests: Set<string>;
  unlockedLocations: Set<string>;
  journalEntries: JournalEntry[];
  bibleVersion: BibleVersion;
  completeQuest: (questId: string, journalEntry: JournalEntry) => void;
  setBibleVersion: (version: BibleVersion) => void;
}
