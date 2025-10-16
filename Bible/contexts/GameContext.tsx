
import React, { createContext, useState, useMemo, useCallback, ReactNode } from 'react';
import type { GameContextType, JournalEntry } from '../types';
import { BibleVersion } from '../constants';
import { locations } from '../data/gameData';

export const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [completedQuests, setCompletedQuests] = useState<Set<string>>(new Set());
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [bibleVersion, setBibleVersion] = useState<BibleVersion>(BibleVersion.NIV);

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
    completeQuest,
    setBibleVersion,
  }), [completedQuests, unlockedLocations, journalEntries, bibleVersion, completeQuest]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
