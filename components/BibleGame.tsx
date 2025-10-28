import React from 'react';
import { GameProvider } from '../contexts/GameContext';
import Header from './bible/Header';
import GameMap from './bible/GameMap';
import { ArrowLeft } from 'lucide-react';

interface BibleGameProps {
  onBack: () => void;
}

export const BibleGame: React.FC<BibleGameProps> = ({ onBack }) => {
  return (
    <GameProvider>
      <div className="fixed inset-0 bg-cover bg-center text-stone-900 font-serif" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/old-wall.png')"}}>
        <div className="bg-stone-800 bg-opacity-60 min-h-screen overflow-auto">
          <div className="p-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-stone-200 hover:text-white transition-colors mb-4 bg-stone-700 hover:bg-stone-600 px-4 py-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              返回主頁
            </button>
          </div>
          <Header />
          <main className="p-4 sm:p-6 md:p-8">
            <GameMap />
          </main>
          <footer className="text-center py-4 text-stone-400 text-sm">
            <p>📖 Default questions curated by biblical scholars</p>
            <p className="text-xs mt-1">⚡ AI Question Generator powered by Google Gemini 2.0 Flash Experimental</p>
          </footer>
        </div>
      </div>
    </GameProvider>
  );
};
