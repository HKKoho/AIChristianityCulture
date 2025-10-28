
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ModelContextProtocol from './components/ModelContextProtocol';
import Chatbot from './components/Chatbot';
import Search from './components/Search';

type View = 'mcp' | 'chatbot' | 'search';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('mcp');

  const handleViewChange = useCallback((view: View) => {
    setActiveView(view);
  }, []);

  return (
    <div className="min-h-screen bg-primary flex flex-col font-sans">
      <Header activeView={activeView} onNavigate={handleViewChange} />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {activeView === 'mcp' && <ModelContextProtocol />}
        {activeView === 'chatbot' && <Chatbot />}
        {activeView === 'search' && <Search />}
      </main>
      <footer className="text-center p-4 text-text-secondary text-sm">
        <p>&copy; 2025 Cultural Context Explorer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
