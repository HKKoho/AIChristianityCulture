
import React, { createContext, useState, useMemo, useCallback, useEffect, ReactNode } from 'react';
import type { GameContextType, JournalEntry } from '../types';
import { BibleVersion } from '../types';
import { locations } from '../data/gameData';

export const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [completedQuests, setCompletedQuests] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('bible-game-completed-quests');
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch {
        return new Set();
      }
    }
    return new Set();
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('bible-game-journal-entries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [bibleVersion, setBibleVersion] = useState<BibleVersion>(BibleVersion.NIV);
  const [isFreeChoiceMode, setIsFreeChoiceMode] = useState<boolean>(false);

  // Persist completed quests to localStorage
  useEffect(() => {
    localStorage.setItem('bible-game-completed-quests', JSON.stringify(Array.from(completedQuests)));
  }, [completedQuests]);

  // Persist journal entries to localStorage
  useEffect(() => {
    localStorage.setItem('bible-game-journal-entries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  const unlockedLocations = useMemo(() => {
    const unlocked = new Set<string>();
    locations.forEach(location => {
      if (!location.dependency) {
        unlocked.add(location.id);
      } else {
        const depQuestId = locations.find(l => l.id === location.dependency)?.questId;
        if (depQuestId && completedQuests.has(depQuestId)) {
          unlocked.add(location.id);
        }
      }
    });
    return unlocked;
  }, [completedQuests]);

  const completeQuest = useCallback((questId: string, journalEntry: JournalEntry) => {
    setCompletedQuests(prev => new Set(prev).add(questId));
    setJournalEntries(prev => [...prev, { ...journalEntry, id: questId }]);
  }, []);

  const value = useMemo(() => ({
    completedQuests,
    unlockedLocations,
    journalEntries,
    bibleVersion,
    isFreeChoiceMode,
    completeQuest,
    setBibleVersion,
    setIsFreeChoiceMode,
  }), [completedQuests, unlockedLocations, journalEntries, bibleVersion, isFreeChoiceMode, completeQuest]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
