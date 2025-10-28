import React from 'react';
import { useGame } from '../hooks/useGame';
import Icon from './Icon';

interface JournalModalProps {
  onClose: () => void;
}

const JournalModal: React.FC<JournalModalProps> = ({ onClose }) => {
  const { journalEntries } = useGame();

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="journal-title"
    >
      <div 
        className="bg-cover bg-center rounded-lg shadow-2xl w-full max-w-2xl border-4 border-amber-900 text-stone-900 p-6 relative max-h-[90vh] flex flex-col"
        style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/old-paper.png')"}}
      >
        <div className="flex justify-between items-start">
            <h2 id="journal-title" className="text-4xl font-bold text-amber-900 mb-4" style={{fontFamily: "'Trajan Pro', serif"}}>
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

        <div className="overflow-y-auto flex-grow pr-2">
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
      </div>
    </div>
  );
};

export default JournalModal;