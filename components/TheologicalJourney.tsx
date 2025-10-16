import React from 'react';
import JourneyApp from '../theological-journey/App';
import { ArrowLeft } from 'lucide-react';

interface TheologicalJourneyProps {
  onBack: () => void;
}

export const TheologicalJourney: React.FC<TheologicalJourneyProps> = ({ onBack }) => {
  return (
    <div className="w-full h-full min-h-screen relative">
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 text-slate-200 border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">返回主頁</span>
        </button>
      </div>
      <JourneyApp />
    </div>
  );
};
