import React, { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { locations, quests, levels } from '../data/gameData';
import type { Quest } from '../types';
import QuestModal from './QuestModal';
import LevelCompleteModal from './LevelCompleteModal';
import Icon from './Icon';

const GameMap: React.FC = () => {
  const { unlockedLocations, completedQuests } = useGame();
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [completedLevelId, setCompletedLevelId] = useState<string | null>(null);

  const handleLocationClick = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (quest) {
      setActiveQuest(quest);
    }
  };
  
  const handleQuestClose = (questId: string) => {
    setActiveQuest(null);
    
    // Check if a level is completed
    const newlyCompletedQuests = new Set(completedQuests).add(questId);
    for (const level of levels) {
      const levelLocations = locations.filter(l => level.locationIds.includes(l.id));
      const levelQuests = levelLocations.map(l => l.questId);
      if (levelQuests.every(qId => newlyCompletedQuests.has(qId))) {
        // Check if this is the first time completing this level
        const oldLevelQuests = levelLocations.filter(l => completedQuests.has(l.questId));
        if (oldLevelQuests.length < levelQuests.length) {
            setCompletedLevelId(level.id);
        }
      }
    }
  };

  const currentLevel = levels.find(l => l.id === completedLevelId);

  return (
    <div className="relative w-full max-w-5xl mx-auto aspect-video rounded-lg shadow-2xl overflow-hidden border-4 border-amber-900" 
         style={{backgroundImage: 'url(https://picsum.photos/seed/map/1200/675)', backgroundSize: 'cover'}}>
      
      <div className="absolute inset-0 bg-black/30"></div>

      {locations.map(location => {
        const isUnlocked = unlockedLocations.has(location.id);
        const isCompleted = completedQuests.has(location.questId);
        
        let statusClasses = 'bg-gray-600 text-gray-300 cursor-not-allowed';
        if (isUnlocked) statusClasses = 'bg-amber-500 text-stone-900 hover:bg-amber-400 cursor-pointer animate-pulse';
        if (isCompleted) statusClasses = 'bg-green-700 text-white hover:bg-green-600 cursor-pointer animate-none';

        return (
          <button
            key={location.id}
            disabled={!isUnlocked}
            onClick={() => handleLocationClick(location.questId)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-white/50 group ${statusClasses}`}
            style={{ top: location.position.top, left: location.position.left }}
            aria-label={`地點：${location.name}`}
          >
            {isCompleted ? <Icon name="check" className="w-5 h-5"/> : isUnlocked ? <Icon name="unlock" className="w-5 h-5"/> : <Icon name="lock" className="w-5 h-5"/>}
             <div className="absolute bottom-full mb-2 w-max bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none" role="tooltip">
              <span className="font-bold">{location.name}</span><br/>
              <span className="text-gray-300">{location.era}</span>
            </div>
          </button>
        );
      })}

      {activeQuest && <QuestModal quest={activeQuest} onClose={() => handleQuestClose(activeQuest.id)} />}
      {currentLevel && <LevelCompleteModal level={currentLevel} onClose={() => setCompletedLevelId(null)} />}
    </div>
  );
};

export default GameMap;