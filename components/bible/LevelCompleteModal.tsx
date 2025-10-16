import React from 'react';
import type { Level } from '../../types';
import Icon from './Icon';

interface LevelCompleteModalProps {
  level: Level;
  onClose: () => void;
}

const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({ level, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="level-complete-title"
      aria-describedby="level-complete-description"
    >
      <div 
        className="bg-cover bg-center rounded-lg shadow-2xl w-full max-w-2xl border-4 border-amber-900 text-stone-900 p-8 relative"
        style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/old-paper.png')"}}
      >
        <div className="text-center">
            <h2 id="level-complete-title" className="text-3xl font-bold text-amber-900" style={{fontFamily: "'Trajan Pro', serif"}}>
                時代完成！
            </h2>
            <p id="level-complete-description" className="text-xl text-stone-700 mt-1 mb-6">您已完成「{level.name}」時代。</p>
        </div>

        <div>
            <h3 className="text-2xl font-bold text-amber-900 border-b-2 border-amber-800 pb-2 mb-4">
                討論提示
            </h3>
            <ul className="space-y-3 list-disc list-inside text-stone-800">
                {level.discussionPrompts.map((prompt, index) => (
                    <li key={index} className="text-lg">{prompt}</li>
                ))}
            </ul>
        </div>
        
        <div className="mt-8 text-center">
            <button 
                onClick={onClose} 
                className="bg-amber-800 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500 focus-visible:ring-offset-amber-100"
            >
                繼續您的旅程
            </button>
        </div>
      </div>
    </div>
  );
};

export default LevelCompleteModal;