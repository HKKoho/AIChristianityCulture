import React from 'react';
import { JourneyStage, Stage } from '../types';

interface TimelineProps {
  stages: Stage[];
  currentStage: JourneyStage;
  onSelectStage: (stage: JourneyStage) => void;
}

const Timeline: React.FC<TimelineProps> = ({ stages, currentStage, onSelectStage }) => {
  return (
    <div className="p-6 h-full border-r border-slate-700">
      <h2 className="text-xl font-bold text-sky-300 mb-6">神學之旅</h2>
      <nav>
        <ol className="relative border-l border-slate-600">
          {stages.map((stage, index) => (
            <li key={stage.key} className="mb-10 ml-6">
              <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-slate-800 ${
                currentStage === stage.key ? 'bg-sky-500' : 'bg-slate-600'
              }`}>
                <span className="text-white font-bold">{index + 1}</span>
              </span>
              <div className="ml-2">
                <h3 className={`flex items-center mb-1 text-lg font-semibold cursor-pointer ${
                  currentStage === stage.key ? 'text-sky-300' : 'text-slate-200'
                }`} onClick={() => onSelectStage(stage.key)}>
                  {stage.title}
                </h3>
                <p className="block mb-2 text-sm font-normal leading-none text-slate-400">
                  {stage.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Timeline;
