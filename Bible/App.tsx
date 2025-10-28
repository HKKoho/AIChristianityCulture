
import React from 'react';
import { GameProvider } from './contexts/GameContext';
import Header from './components/Header';
import GameMap from './components/GameMap';

const App: React.FC = () => {
  return (
    <GameProvider>
      <div className="min-h-screen bg-cover bg-center text-stone-900 font-serif" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/old-wall.png')"}}>
        <div className="bg-stone-800 bg-opacity-60 min-h-screen">
          <Header />
          <main className="p-4 sm:p-6 md:p-8">
            <GameMap />
          </main>
        </div>
      </div>
    </GameProvider>
  );
};

export default App;