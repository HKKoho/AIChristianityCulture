import React, { useState } from 'react';
import { useGame } from '../../hooks/useGame';
import Icon from './Icon';
import BibleReader from './BibleReader';

interface JournalModalProps {
  onClose: () => void;
}

type TabType = 'journal' | 'bible';

const JournalModal: React.FC<JournalModalProps> = ({ onClose }) => {
  const { journalEntries } = useGame();
  const [activeTab, setActiveTab] = useState<TabType>('journal');

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="journal-title"
    >
      <div
        className="bg-cover bg-center rounded-lg shadow-2xl w-full max-w-4xl border-4 border-amber-900 text-stone-900 p-6 relative max-h-[90vh] flex flex-col"
        style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/old-paper.png')"}}
      >
        <div className="flex justify-between items-start mb-4">
            <h2 id="journal-title" className="text-4xl font-bold text-amber-900" style={{fontFamily: "'Trajan Pro', serif"}}>
                智慧卷軸
            </h2>
            <button
              onClick={onClose}
              className="text-stone-600 hover:text-stone-900 transition-colors rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500 focus-visible:ring-offset-amber-100"
              aria-label="關閉日誌"
            >
                <Icon name="x" className="w-8 h-8"/>
            </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b-2 border-amber-300">
          <button
            onClick={() => setActiveTab('journal')}
            className={`px-6 py-3 font-bold transition-all relative ${
              activeTab === 'journal'
                ? 'text-amber-900 bg-amber-100/70'
                : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50/50'
            }`}
          >
            📖 任務日誌
            {activeTab === 'journal' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-800"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('bible')}
            className={`px-6 py-3 font-bold transition-all relative ${
              activeTab === 'bible'
                ? 'text-amber-900 bg-amber-100/70'
                : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50/50'
            }`}
          >
            📜 聖經閱讀
            {activeTab === 'bible' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-800"></div>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto flex-grow pr-2">
          {/* Journal Entries Tab */}
          {activeTab === 'journal' && (
            <div>
              {journalEntries.length === 0 ? (
                  <p className="text-center text-stone-700 mt-8">您的日誌是空的。完成任務以收集智慧。</p>
              ) : (
                  <div className="space-y-4">
                      {journalEntries.map(entry => (
                          <div key={entry.id} className="p-4 bg-amber-50/50 border-l-4 border-amber-800 rounded-r-lg">
                              <h3 className="font-bold text-xl text-amber-900">{entry.title}</h3>
                              <p className="mt-1 text-stone-800">{entry.content}</p>
                          </div>
                      ))}
                  </div>
              )}
            </div>
          )}

          {/* Bible Reader Tab */}
          {activeTab === 'bible' && (
            <BibleReader />
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalModal;