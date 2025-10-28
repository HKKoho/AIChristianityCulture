import React from 'react';

interface LoadingScreenProps {
  message: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
      <h2 className="text-2xl font-bold mt-6 mb-2 text-gray-200">AI 已登台</h2>
      <p className="text-gray-400">{message}</p>
    </div>
  );
};