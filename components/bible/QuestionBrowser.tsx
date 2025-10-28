import React, { useState } from 'react';
import { quests } from '../../data/gameData';
import type { Quest } from '../../types';
import { useGame } from '../../hooks/useGame';
import Icon from './Icon';

interface QuestionBrowserProps {
  onSelectQuest: (quest: Quest) => void;
  onClose: () => void;
  additionalQuests?: Quest[];
}

const QuestionBrowser: React.FC<QuestionBrowserProps> = ({ onSelectQuest, onClose, additionalQuests = [] }) => {
  const { completedQuests } = useGame();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompleted, setFilterCompleted] = useState<'all' | 'completed' | 'incomplete'>('all');

  // Combine static quests with additional generated quests
  const allQuests = [...quests, ...additionalQuests];

  const filteredQuests = allQuests.filter(quest => {
    const matchesSearch = quest.character.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quest.question.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterCompleted === 'all' ||
      (filterCompleted === 'completed' && completedQuests.has(quest.id)) ||
      (filterCompleted === 'incomplete' && !completedQuests.has(quest.id));

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div
        className="bg-cover bg-center rounded-lg shadow-2xl w-full max-w-5xl border-4 border-amber-900 text-stone-900 p-6 relative max-h-[90vh] overflow-hidden flex flex-col"
        style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/old-paper.png')"}}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-600 hover:text-stone-900 transition-colors rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 z-10"
          aria-label="關閉問題瀏覽器"
        >
          <Icon name="x" className="w-8 h-8"/>
        </button>

        <h2 className="text-3xl font-bold text-amber-900 mb-4">選擇問題</h2>

        {/* Search and Filter */}
        <div className="mb-4 space-y-3">
          <input
            type="text"
            placeholder="搜尋角色或問題..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border-2 border-amber-700 bg-amber-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setFilterCompleted('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterCompleted === 'all'
                  ? 'bg-amber-800 text-white'
                  : 'bg-stone-300 text-stone-700 hover:bg-stone-400'
              }`}
            >
              全部 ({allQuests.length})
            </button>
            <button
              onClick={() => setFilterCompleted('incomplete')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterCompleted === 'incomplete'
                  ? 'bg-amber-800 text-white'
                  : 'bg-stone-300 text-stone-700 hover:bg-stone-400'
              }`}
            >
              未完成 ({allQuests.filter(q => !completedQuests.has(q.id)).length})
            </button>
            <button
              onClick={() => setFilterCompleted('completed')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterCompleted === 'completed'
                  ? 'bg-amber-800 text-white'
                  : 'bg-stone-300 text-stone-700 hover:bg-stone-400'
              }`}
            >
              已完成 ({completedQuests.size})
            </button>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuests.map((quest) => {
              const isCompleted = completedQuests.has(quest.id);

              return (
                <button
                  key={quest.id}
                  onClick={() => onSelectQuest(quest)}
                  className={`text-left p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    quest.id.startsWith('qg')
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200'
                      : 'border-amber-700 bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={quest.characterImage}
                      alt={quest.character}
                      className="w-16 h-16 rounded-full border-2 border-amber-800 object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-amber-900">{quest.character}</h3>
                        {quest.id.startsWith('qg') && (
                          <span className="flex items-center gap-1 text-purple-700 text-xs bg-purple-200 px-2 py-0.5 rounded">
                            <Icon name="sparkles" className="w-3 h-3"/>
                            AI生成
                          </span>
                        )}
                        {isCompleted && (
                          <span className="flex items-center gap-1 text-green-700 text-sm">
                            <Icon name="check" className="w-4 h-4"/>
                            已完成
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-stone-700 line-clamp-2">{quest.question}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredQuests.length === 0 && (
            <div className="text-center py-12 text-stone-600">
              <p className="text-lg">找不到符合條件的問題</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionBrowser;
