import React from 'react';
import { AiEngine } from '../types';

interface HeaderProps {
  aiEngine: AiEngine;
  onShowAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ aiEngine, onShowAdmin }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="w-1/4">
           <input 
            id="searchWidgetTrigger" 
            placeholder="搜尋聖經資源..."
            className="bg-gray-700/80 border border-gray-600 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder-gray-400 w-full max-w-xs"
          />
        </div>
        <div className="flex-1 flex justify-center">
            <div className="flex flex-col items-center">
                <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                  Do you know Christianity?
                </h1>
                <p className="text-xs text-gray-400 font-medium tracking-wider mt-1">
                    由 {aiEngine} 驅動
                </p>
            </div>
        </div>
        <div className="w-1/4 flex justify-end">
          <button
            onClick={onShowAdmin}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
            aria-label="開啟 AI 角色設定"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
          </button>
        </div>
      </div>
    </header>
  );
};