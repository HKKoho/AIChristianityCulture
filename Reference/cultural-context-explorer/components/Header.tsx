
import React from 'react';
import { BrainCircuitIcon, MessageSquareIcon, SearchIcon } from './icons';

type View = 'mcp' | 'chatbot' | 'search';

interface HeaderProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

const NavButton: React.FC<{
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ isActive, onClick, icon, label }) => {
  const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-accent";
  const activeClasses = "bg-accent text-white shadow-lg";
  const inactiveClasses = "text-text-secondary hover:bg-secondary hover:text-text-primary";
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      aria-pressed={isActive}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ activeView, onNavigate }) => {
  return (
    <header className="bg-secondary/50 backdrop-blur-sm sticky top-0 z-10 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="https://picsum.photos/40/40" alt="Logo" className="rounded-full" />
            <h1 className="text-xl font-bold text-text-primary">
              Cultural Context Explorer
            </h1>
          </div>
          <nav className="flex items-center gap-2 sm:gap-4 p-1 bg-primary rounded-lg">
             <NavButton
              isActive={activeView === 'mcp'}
              onClick={() => onNavigate('mcp')}
              icon={<BrainCircuitIcon className="w-5 h-5" />}
              label="MCP Analysis"
            />
            <NavButton
              isActive={activeView === 'chatbot'}
              onClick={() => onNavigate('chatbot')}
              icon={<MessageSquareIcon className="w-5 h-5" />}
              label="Serving Officer Chat"
            />
            <NavButton
              isActive={activeView === 'search'}
              onClick={() => onNavigate('search')}
              icon={<SearchIcon className="w-5 h-5" />}
              label="AI Search"
            />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
