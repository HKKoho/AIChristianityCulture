import React, { useState } from 'react';
import type { Quest } from '../types';
import { useGame } from '../hooks/useGame';
import Icon from './Icon';
import { GoogleGenAI } from '@google/genai';

interface DeepDiveContentProps {
  deepDive: Quest['deepDive'];
  onBack: () => void;
}

const DeepDiveContent: React.FC<DeepDiveContentProps> = ({ deepDive, onBack }) => {
  const { bibleVersion } = useGame();
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedModel, setSelectedModel] = useState<'gemini' | 'openai'>('gemini');

  const formatUrl = (url: string, text: string) => {
    if (url === '#') return url;
    const urlObj = new URL(url);
    urlObj.searchParams.set('version', bibleVersion);
    return urlObj.toString();
  };

  const handleGenerateAnswer = async () => {
    if (!aiQuestion.trim()) return;
    
    setIsLoading(true);
    setAiAnswer('');
    setError('');

    try {
      if (selectedModel === 'gemini') {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        
        const systemInstruction = `You are a helpful Bible study assistant. Your purpose is to answer questions based on the provided context in a clear, concise, and theologically sound manner. Ground your answers in trustworthy biblical sources and historical context, similar to information found on Wikipedia for historical background. Do not speculate or provide personal opinions. Your response should be in Traditional Chinese.`;
        
        const prompt = `Context about "${deepDive.title}":\n${deepDive.content}\n\nBased on this context and general biblical knowledge, answer the following question:\n\nQuestion: "${aiQuestion}"`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction: systemInstruction,
          }
        });
        
        setAiAnswer(response.text);

      } else if (selectedModel === 'openai') {
        // Placeholder for OpenAI integration
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAiAnswer("OpenAI 整合即將推出。目前，請使用 Gemini 模型進行查詢。");
      }
    } catch (err) {
      console.error("Error generating AI answer:", err);
      setError("抱歉，生成答案時發生錯誤。請稍後再試。");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex-grow overflow-y-auto pr-4 -mr-4">
        <h2 id="deepdive-title" className="text-4xl font-bold text-amber-900 mb-4 flex items-center gap-3" style={{fontFamily: "'Trajan Pro', serif"}}>
            <Icon name="lightbulb" className="w-8 h-8"/>
            深入探索：{deepDive.title}
        </h2>

        <p className="text-lg text-stone-800 leading-relaxed mb-6 whitespace-pre-wrap">{deepDive.content}</p>

        <h3 className="text-2xl font-bold text-amber-900 border-b-2 border-amber-800 pb-2 mb-4">
            來源查找器
        </h3>
        <ul className="space-y-2 mb-8">
            {deepDive.sources.map((source, index) => (
                <li key={index}>
                    <a 
                        href={formatUrl(source.url, source.text)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-amber-800 hover:text-amber-600 hover:underline transition-colors font-semibold rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                    >
                        {source.text.replace(/\((NIV|ESV|KJV)\)/, `(${bibleVersion})`)}
                    </a>
                </li>
            ))}
        </ul>

         <div className="border-t-4 border-dashed border-amber-800/50 my-8"></div>
        
        <h3 className="text-2xl font-bold text-amber-900 pb-2 mb-4 flex items-center gap-3">
            <Icon name="sparkles" className="w-7 h-7"/>
            探索更深
        </h3>
        <p className="text-stone-700 mb-4">對這個主題有更多問題嗎？問問 AI 助理！</p>
        
        <div className="mb-2">
          <span className="text-sm font-bold text-stone-600 mr-4">選擇模型:</span>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button type="button" onClick={() => setSelectedModel('gemini')} className={`px-4 py-2 text-sm font-medium border rounded-l-lg transition-colors focus:z-10 focus:ring-2 focus:ring-amber-500 ${selectedModel === 'gemini' ? 'bg-amber-800 text-white border-amber-800' : 'bg-white text-stone-900 border-stone-300 hover:bg-stone-100'}`}>
              Gemini
            </button>
            <button type="button" onClick={() => setSelectedModel('openai')} className={`px-4 py-2 text-sm font-medium border rounded-r-lg transition-colors focus:z-10 focus:ring-2 focus:ring-amber-500 ${selectedModel === 'openai' ? 'bg-amber-800 text-white border-amber-800' : 'bg-white text-stone-900 border-stone-300 hover:bg-stone-100'}`}>
              OpenAI
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <textarea
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder={`例如：這個概念如何應用在現代教會中？`}
              className="flex-grow p-2 border-2 border-amber-700/50 rounded-lg bg-amber-50/50 placeholder:text-stone-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              rows={2}
              disabled={isLoading}
          />
          <button onClick={handleGenerateAnswer} disabled={isLoading || !aiQuestion.trim()} className="bg-amber-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center w-24 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500 focus-visible:ring-offset-amber-100">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : "發問"}
          </button>
        </div>
        
        {error && <p className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
        
        {aiAnswer && (
            <div className="mt-4 p-4 bg-amber-50/70 border-l-4 border-amber-800 rounded-r-lg animate-fade-in">
                <p className="text-stone-800 whitespace-pre-wrap">{aiAnswer}</p>
            </div>
        )}
        <div className="mt-8 border-t-2 border-amber-800/20 pt-6">
            <button 
              onClick={onBack} 
              className="bg-stone-600 hover:bg-stone-500 text-white font-bold py-2 px-4 rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500 focus-visible:ring-offset-amber-100"
            >
              返回說明
            </button>
        </div>
    </div>
  );
};

export default DeepDiveContent;