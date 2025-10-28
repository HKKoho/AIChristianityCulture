import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, TheologicalPerspective } from '../types';
import { PERSPECTIVES } from '../constants';
import { LoadingSpinner } from './icons';

interface DialogueProps {
  history: ChatMessage[];
  perspective: TheologicalPerspective;
  onPerspectiveChange: (perspective: TheologicalPerspective) => void;
  onSubmit: (message: string) => void;
  isLoading: boolean;
}

const Dialogue: React.FC<DialogueProps> = ({ history, perspective, onPerspectiveChange, onSubmit, isLoading }) => {
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
    <div className="p-4 h-full flex flex-col bg-slate-800/50 border-l border-slate-700">
      <h3 className="text-xl font-bold text-amber-300 mb-2">AI 對話夥伴</h3>
      <div className="mb-4">
        <label htmlFor="perspective" className="block text-sm font-medium text-slate-400 mb-1">
          對話模式
        </label>
        <select
          id="perspective"
          value={perspective}
          onChange={(e) => onPerspectiveChange(e.target.value as TheologicalPerspective)}
          className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
        >
          {PERSPECTIVES.map(p => <option key={p.key} value={p.key}>{p.name}</option>)}
        </select>
      </div>
      <div className="flex-grow overflow-y-auto mb-4 pr-2 space-y-4">
        {history.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${
              msg.role === 'user' ? 'bg-sky-800 text-white' : 'bg-slate-700 text-slate-200'
            }`}>
              <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
            </div>
          </div>
        ))}
         {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-slate-200 p-3 rounded-lg">
                <LoadingSpinner className="w-6 h-6 text-amber-300" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="挑戰你的想法..."
          className="flex-grow p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 disabled:cursor-not-allowed text-white font-semibold rounded-md transition-colors duration-200">
          傳送
        </button>
      </form>
    </div>
  );
};

export default Dialogue;
