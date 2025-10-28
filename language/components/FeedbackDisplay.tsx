
import React from 'react';

interface FeedbackDisplayProps {
  feedback: string | null;
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div className="w-full max-w-2xl mt-8 bg-sky-100 dark:bg-sky-900/50 border border-sky-200 dark:border-sky-700 rounded-xl p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-sky-800 dark:text-sky-200 mb-2">反饋</h3>
      <p className="text-stone-700 dark:text-stone-300">{feedback}</p>
    </div>
  );
};
