
import React from 'react';
import type { GameState } from '../types';

interface RecordButtonProps {
  gameState: GameState;
  onClick: () => void;
}

const MicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm5 10.5a.5.5 0 01.5.5v.5a.5.5 0 01-1 0V15a.5.5 0 01.5-.5zM7 15a.5.5 0 00-1 0v.5a.5.5 0 001 0V15z" clipRule="evenodd" />
        <path d="M5.5 11.5A3.5 3.5 0 019 8h2a3.5 3.5 0 013.5 3.5v.5a.5.5 0 01-1 0v-.5A2.5 2.5 0 0011 9H9a2.5 2.5 0 00-2.5 2.5v.5a.5.5 0 01-1 0v-.5z" />
        <path d="M4 11a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" />
    </svg>
);

const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-white"></div>
);

export const RecordButton: React.FC<RecordButtonProps> = ({ gameState, onClick }) => {
    const isRecording = gameState === 'recording';
    const isProcessing = gameState === 'processing';
    const isIdle = gameState === 'ready';

    const getButtonClasses = () => {
        if (isRecording) return 'bg-red-600 hover:bg-red-700 animate-pulse';
        if (isProcessing) return 'bg-gray-500 cursor-not-allowed';
        return 'bg-sky-600 hover:bg-sky-700';
    };
    
    return (
        <button
            onClick={onClick}
            disabled={isProcessing}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-lg transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800 ${getButtonClasses()} ${isIdle ? 'hover:scale-110' : ''}`}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
            {isProcessing && <LoadingSpinner />}
            {isRecording && <StopIcon />}
            {(gameState === 'ready' || gameState === 'feedback' || gameState === 'error') && <MicIcon />}
        </button>
    );
};
