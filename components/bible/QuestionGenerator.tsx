import React, { useState } from 'react';
import { generateBiblicalQuestion, generateBiblicalQuestionWithTopic } from '../../services/bibleQuestionGenerator';
import type { Quest } from '../../types';
import Icon from './Icon';

interface QuestionGeneratorProps {
  onQuestionGenerated: (question: Omit<Quest, 'id' | 'characterImage'>) => void;
  onClose: () => void;
}

const QuestionGenerator: React.FC<QuestionGeneratorProps> = ({ onQuestionGenerated, onClose }) => {
  const [generationMode, setGenerationMode] = useState<'free' | 'guided'>('guided');
  const [characterName, setCharacterName] = useState('');
  const [topic, setTopic] = useState('');
  const [testament, setTestament] = useState<'old' | 'new' | 'both'>('both');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedQuestion, setGeneratedQuestion] = useState<Omit<Quest, 'id' | 'characterImage'> | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedQuestion(null);

    try {
      let question: Omit<Quest, 'id' | 'characterImage'>;

      if (generationMode === 'free') {
        if (!customPrompt.trim()) {
          throw new Error('請輸入自訂提示');
        }
        question = await generateBiblicalQuestion(customPrompt);
      } else {
        question = await generateBiblicalQuestionWithTopic(
          characterName.trim() || undefined,
          topic.trim() || undefined,
          testament
        );
      }

      setGeneratedQuestion(question);
    } catch (err) {
      console.error('Question generation error:', err);
      setError(err instanceof Error ? err.message : '生成問題時發生錯誤，請重試。');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveQuestion = () => {
    if (generatedQuestion) {
      onQuestionGenerated(generatedQuestion);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div
        className="bg-cover bg-center rounded-lg shadow-2xl w-full max-w-4xl border-4 border-amber-900 text-stone-900 p-6 relative max-h-[90vh] overflow-y-auto"
        style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/old-paper.png')"}}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-600 hover:text-stone-900 transition-colors rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 z-10"
          aria-label="關閉"
        >
          <Icon name="x" className="w-8 h-8"/>
        </button>

        <h2 className="text-3xl font-bold text-amber-900 mb-2">AI 問題生成器</h2>
        <p className="text-stone-700 mb-2">使用 AI 生成新的聖經學習問題</p>
        <p className="text-xs text-stone-500 mb-4 flex items-center gap-2">
          <span>⚡ Powered by</span>
          <span className="font-semibold text-blue-600">Google Gemini 2.0 Flash Experimental</span>
        </p>

        {/* Mode Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-amber-900 mb-2">生成模式</label>
          <div className="flex gap-3">
            <button
              onClick={() => setGenerationMode('guided')}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
                generationMode === 'guided'
                  ? 'bg-amber-800 text-white'
                  : 'bg-stone-300 text-stone-700 hover:bg-stone-400'
              }`}
            >
              引導式生成
            </button>
            <button
              onClick={() => setGenerationMode('free')}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${
                generationMode === 'free'
                  ? 'bg-amber-800 text-white'
                  : 'bg-stone-300 text-stone-700 hover:bg-stone-400'
              }`}
            >
              自由提示
            </button>
          </div>
        </div>

        {/* Guided Mode */}
        {generationMode === 'guided' && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                聖經人物（選填）
              </label>
              <input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="例如：摩西、大衛、保羅"
                className="w-full px-4 py-2 rounded-lg border-2 border-amber-700 bg-amber-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                主題（選填）
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="例如：信心、順服、領導力"
                className="w-full px-4 py-2 rounded-lg border-2 border-amber-700 bg-amber-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">聖經範圍</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTestament('both')}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                    testament === 'both'
                      ? 'bg-amber-700 text-white'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  新舊約
                </button>
                <button
                  onClick={() => setTestament('old')}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                    testament === 'old'
                      ? 'bg-amber-700 text-white'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  舊約
                </button>
                <button
                  onClick={() => setTestament('new')}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                    testament === 'new'
                      ? 'bg-amber-700 text-white'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  新約
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Free Mode */}
        {generationMode === 'free' && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-amber-900 mb-2">
              自訂提示
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="例如：生成一個關於耶穌登山寶訓的問題，著重於八福的教導"
              rows={4}
              className="w-full px-4 py-2 rounded-lg border-2 border-amber-700 bg-amber-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border-2 border-red-400 rounded-lg">
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}

        {/* Generated Question Preview */}
        {generatedQuestion && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-400 rounded-lg">
            <h3 className="text-lg font-bold text-green-900 mb-2">✓ 問題已生成</h3>
            <p className="text-sm text-green-800 mb-2">
              <strong>角色：</strong>{generatedQuestion.character}
            </p>
            <p className="text-sm text-green-800 mb-2">
              <strong>問題：</strong>{generatedQuestion.question}
            </p>
            <p className="text-xs text-green-700">點擊「加入遊戲」將此問題添加到遊戲中</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
              isGenerating
                ? 'bg-stone-400 text-stone-200 cursor-not-allowed'
                : 'bg-amber-700 hover:bg-amber-600 text-white'
            }`}
          >
            {isGenerating ? (
              <>
                <Icon name="loader" className="w-5 h-5 animate-spin"/>
                生成中...
              </>
            ) : (
              <>
                <Icon name="sparkles" className="w-5 h-5"/>
                生成問題
              </>
            )}
          </button>

          {generatedQuestion && (
            <button
              onClick={handleSaveQuestion}
              className="flex-1 px-6 py-3 bg-green-700 hover:bg-green-600 text-white rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Icon name="check" className="w-5 h-5"/>
              加入遊戲
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionGenerator;
