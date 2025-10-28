import React from 'react';
import type { SavedPresentation } from '../types';

interface SavedPresentationsProps {
  presentations: SavedPresentation[];
  onLoad: (presentation: SavedPresentation) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export const SavedPresentations: React.FC<SavedPresentationsProps> = ({ presentations, onLoad, onDelete, onBack }) => {
  return (
    <div className="w-full max-w-3xl bg-gray-800/50 rounded-lg shadow-2xl p-8 border border-gray-700">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold">已儲存的講道</h2>
            <button
              onClick={onBack}
              className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-md font-semibold transition-colors"
            >
              &larr; 返回建立
            </button>
        </div>

        {presentations.length === 0 ? (
            <p className="text-center text-gray-400 py-8">您沒有已儲存的講道。</p>
        ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {presentations.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()).map(p => (
                    <div key={p.id} className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-lg">{p.topic}</h3>
                            <p className="text-xs text-gray-400">
                                儲存於： {new Date(p.savedAt).toLocaleString()}
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => onLoad(p)}
                                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors"
                            >
                                載入
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm('您確定要刪除這篇講道嗎？')) {
                                        onDelete(p.id)
                                    }
                                }}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                aria-label="刪除講道"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};