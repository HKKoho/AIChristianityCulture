import React, { useState, useEffect } from 'react';
import { useGame } from '../../hooks/useGame';
import { locations, quests, levels } from '../../data/gameData';
import type { Quest } from '../../types';
import QuestModal from './QuestModal';
import LevelCompleteModal from './LevelCompleteModal';
import QuestionBrowser from './QuestionBrowser';
import QuestionGenerator from './QuestionGenerator';
import Icon from './Icon';

const STORAGE_KEY = 'bible-game-generated-questions';

const GameMap: React.FC = () => {
  const { unlockedLocations, completedQuests, isFreeChoiceMode, setIsFreeChoiceMode } = useGame();
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [completedLevelId, setCompletedLevelId] = useState<string | null>(null);
  const [showQuestionBrowser, setShowQuestionBrowser] = useState<boolean>(false);
  const [showQuestionGenerator, setShowQuestionGenerator] = useState<boolean>(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Quest[]>([]);

  // Load generated questions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setGeneratedQuestions(parsed);
      }
    } catch (error) {
      console.error('Failed to load generated questions:', error);
    }
  }, []);

  // Save generated questions to localStorage whenever they change
  useEffect(() => {
    try {
      if (generatedQuestions.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(generatedQuestions));
      }
    } catch (error) {
      console.error('Failed to save generated questions:', error);
    }
  }, [generatedQuestions]);

  // Combine static quests with generated questions
  const allQuests = [...quests, ...generatedQuestions];

  const handleLocationClick = (questId: string) => {
    const quest = allQuests.find(q => q.id === questId);
    if (quest) {
      setActiveQuest(quest);
    }
  };

  const handleQuestSelect = (quest: Quest) => {
    setActiveQuest(quest);
    setShowQuestionBrowser(false);
  };

  const handleQuestionGenerated = (question: Omit<Quest, 'id' | 'characterImage'>) => {
    // Generate a unique ID for the new question
    const newId = `qg${Date.now()}`;
    const newQuest: Quest = {
      ...question,
      id: newId,
      characterImage: `https://picsum.photos/seed/${newId}/100`
    };

    setGeneratedQuestions(prev => [...prev, newQuest]);
    setActiveQuest(newQuest);
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
    <>
      {/* Mode Toggle and Browse Button */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
        <div className="bg-stone-800/90 rounded-lg p-3 border-2 border-amber-700 flex items-center gap-3">
          <span className="text-amber-200 font-semibold">遊戲模式：</span>
          <button
            onClick={() => setIsFreeChoiceMode(!isFreeChoiceMode)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              !isFreeChoiceMode
                ? 'bg-amber-600 text-white'
                : 'bg-stone-600 text-stone-300 hover:bg-stone-500'
            }`}
          >
            順序解鎖
          </button>
          <button
            onClick={() => setIsFreeChoiceMode(!isFreeChoiceMode)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              isFreeChoiceMode
                ? 'bg-amber-600 text-white'
                : 'bg-stone-600 text-stone-300 hover:bg-stone-500'
            }`}
          >
            自由選擇
          </button>
        </div>

        {isFreeChoiceMode && (
          <>
            <button
              onClick={() => setShowQuestionBrowser(true)}
              className="bg-amber-700 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 border-2 border-amber-900"
            >
              <Icon name="list" className="w-5 h-5"/>
              瀏覽所有問題
            </button>
            <button
              onClick={() => setShowQuestionGenerator(true)}
              className="bg-purple-700 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 border-2 border-purple-900"
            >
              <Icon name="sparkles" className="w-5 h-5"/>
              AI 生成問題
            </button>
          </>
        )}
      </div>

      <div className="relative w-full max-w-5xl mx-auto aspect-video rounded-lg shadow-2xl overflow-hidden border-4 border-amber-900"
           style={{backgroundImage: 'url(https://picsum.photos/seed/map/1200/675)', backgroundSize: 'cover'}}>

        <div className="absolute inset-0 bg-black/30"></div>

        {locations.map(location => {
          // In free choice mode, all locations are unlocked
          const isUnlocked = isFreeChoiceMode || unlockedLocations.has(location.id);
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

      {showQuestionBrowser && (
        <QuestionBrowser
          onSelectQuest={handleQuestSelect}
          onClose={() => setShowQuestionBrowser(false)}
          additionalQuests={generatedQuestions}
        />
      )}

      {showQuestionGenerator && (
        <QuestionGenerator
          onQuestionGenerated={handleQuestionGenerated}
          onClose={() => setShowQuestionGenerator(false)}
        />
      )}
    </>
  );
};

export default GameMap;