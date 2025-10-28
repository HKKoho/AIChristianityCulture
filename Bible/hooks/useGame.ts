
import { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import type { GameContextType } from '../types';

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
