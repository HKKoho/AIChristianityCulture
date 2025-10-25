import React, { useState } from 'react';
import { AiEngine, SermonBasis, SermonLength, SERMON_LENGTH_OPTIONS, SERMON_LLM_MODELS } from '../types';
import SpeechInput from './SpeechInput';

interface LocalLLMConfig {
  model: string;
  temperature: number;
  topP: number;
}

interface InputFormProps {
  onGenerate: (topic: string, keyPoints: string[], sermonBasis: SermonBasis, sermonLength: SermonLength, localLLMConfig?: LocalLLMConfig) => void;
  selectedEngine: AiEngine;
  onEngineChange: (engine: AiEngine) => void;
  onShowSaved: () => void;
  onBackToLanding: () => void;
  hasSavedPresentations: boolean;
}

const KeyPointInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  isFirst: boolean;
}> = ({ value, onChange, onRemove, isFirst }) => (
  <div className="flex items-center space-x-2">
    <SpeechInput
      value={value}
      onChange={onChange}
      placeholder="輸入鑰節或要點..."
      className="w-full"
      lang="zh-TW"
    />
    {!isFirst && (
      <button
        type="button"
        onClick={onRemove}
        className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
        aria-label="移除要點"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </button>
    )}
  </div>
);

export const InputForm: React.FC<InputFormProps> = ({ onGenerate, selectedEngine, onEngineChange, onShowSaved, onBackToLanding, hasSavedPresentations }) => {
  const [topic, setTopic] = useState('');
  const [keyPoints, setKeyPoints] = useState<string[]>(['']);
  const [sermonBasis, setSermonBasis] = useState<SermonBasis>(SermonBasis.BIBLICAL_STUDY);
  const [sermonLength, setSermonLength] = useState<SermonLength>(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLLMModel, setSelectedLLMModel] = useState('qwen-coder:480b-cloud'); // Default Ollama model
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);

  const isGeminiAvailable = !!process.env.API_KEY;

  const handleAddKeyPoint = () => {
    if (keyPoints.length < 5) {
      setKeyPoints([...keyPoints, '']);
    }
  };

  const handleRemoveKeyPoint = (index: number) => {
    const newKeyPoints = keyPoints.filter((_, i) => i !== index);
    setKeyPoints(newKeyPoints);
  };

  const handleKeyPointChange = (index: number, value: string) => {
    const newKeyPoints = [...keyPoints];
    newKeyPoints[index] = value;
    setKeyPoints(newKeyPoints);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
        setIsGenerating(true);
        const localLLMConfig = selectedEngine === AiEngine.LOCAL_LLM ? {
          model: selectedLLMModel,
          temperature,
          topP
        } : undefined;
        onGenerate(topic, keyPoints.filter(p => p.trim() !== ''), sermonBasis, sermonLength, localLLMConfig);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-gray-800/50 rounded-lg shadow-2xl p-8 border border-gray-700">
      <h2 className="text-2xl font-bold text-center mb-2">撰寫您的 AI 講道</h2>
      <p className="text-center text-gray-400 mb-6">輸入主題，選擇基礎，讓 AI 為您構建講道。</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">AI 引擎</label>
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-700 p-1">
                <button
                    type="button"
                    disabled={!isGeminiAvailable}
                    onClick={() => onEngineChange(AiEngine.GEMINI)}
                    className={`w-full rounded-md px-3 py-2 text-sm font-medium transition ${
                        selectedEngine === AiEngine.GEMINI
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-gray-300 hover:bg-gray-600/50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-pressed={selectedEngine === AiEngine.GEMINI}
                >
                    {AiEngine.GEMINI}
                </button>
                <button
                    type="button"
                    onClick={() => onEngineChange(AiEngine.LOCAL_LLM)}
                    className={`w-full rounded-md px-3 py-2 text-sm font-medium transition ${
                        selectedEngine === AiEngine.LOCAL_LLM
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-gray-300 hover:bg-gray-600/50'
                    }`}
                    aria-pressed={selectedEngine === AiEngine.LOCAL_LLM}
                >
                    {AiEngine.LOCAL_LLM}
                </button>
            </div>
            {!isGeminiAvailable && (
                <p className="text-xs text-yellow-500/80 mt-2 text-center">
                    Google Gemini 無法使用。您必須提供 API 金鑰。
                </p>
            )}
        </div>

        {/* Local LLM Configuration */}
        {selectedEngine === AiEngine.LOCAL_LLM && (
          <div className="space-y-4 bg-gray-800/50 rounded-lg p-4 border border-gray-600">
            <h3 className="text-lg font-medium text-gray-200">本地 LLM 配置</h3>

            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">選擇模型</label>
              <select
                value={selectedLLMModel}
                onChange={(e) => setSelectedLLMModel(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
              >
                {SERMON_LLM_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.size})
                    {model.hasVision ? ' 🎨' : ''}
                  </option>
                ))}
              </select>
              <div className="mt-2 p-3 bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-300">
                  {SERMON_LLM_MODELS.find(m => m.id === selectedLLMModel)?.description}
                </p>
                {SERMON_LLM_MODELS.find(m => m.id === selectedLLMModel)?.hasVision && (
                  <span className="text-xs text-yellow-400 mt-1 block">🎨 支援視覺分析功能</span>
                )}
              </div>
            </div>

            {/* Model Parameters */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  創造性程度: {temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>保守</span>
                  <span>創新</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  回答多樣性: {topP}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={topP}
                  onChange={(e) => setTopP(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>聚焦</span>
                  <span>多元</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">講道基礎</label>
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-700 p-1">
                {(Object.values(SermonBasis) as SermonBasis[]).map((basis) => (
                     <button
                        key={basis}
                        type="button"
                        onClick={() => setSermonBasis(basis)}
                        className={`w-full rounded-md px-3 py-2 text-sm font-medium transition ${
                            sermonBasis === basis
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-gray-300 hover:bg-gray-600/50'
                        }`}
                        aria-pressed={sermonBasis === basis}
                    >
                        {basis}
                    </button>
                ))}
            </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">講道時長</label>
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-700 p-1">
                {SERMON_LENGTH_OPTIONS.map((length) => (
                     <button
                        key={length}
                        type="button"
                        onClick={() => setSermonLength(length)}
                        className={`w-full rounded-md px-3 py-2 text-sm font-medium transition ${
                            sermonLength === length
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-gray-300 hover:bg-gray-600/50'
                        }`}
                        aria-pressed={sermonLength === length}
                    >
                        {length} 分鐘
                    </button>
                ))}
            </div>
        </div>
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-2">主題</label>
          <SpeechInput
            value={topic}
            onChange={setTopic}
            placeholder="例如：撒種的比喻（馬太福音 13 章）"
            className="w-full text-lg"
            lang="zh-TW"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">鑰節或要點</label>
          <div className="space-y-3">
            {keyPoints.map((point, index) => (
              <KeyPointInput
                key={index}
                value={point}
                onChange={(value) => handleKeyPointChange(index, value)}
                onRemove={() => handleRemoveKeyPoint(index)}
                isFirst={index === 0}
              />
            ))}
          </div>
          {keyPoints.length < 5 && (
            <button
              type="button"
              onClick={handleAddKeyPoint}
              className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              + 新增另一要點
            </button>
          )}
        </div>
        <div className="pt-2 space-y-3">
          <button
            type="submit"
            disabled={!topic.trim() || isGenerating}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:bg-indigo-900/50 disabled:cursor-not-allowed transition-all"
          >
            {isGenerating ? '生成中...' : '生成講道'}
          </button>
           {hasSavedPresentations && (
              <button
                type="button"
                onClick={onShowSaved}
                className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-colors"
              >
                載入已儲存的講道
              </button>
            )}
            <button
              type="button"
              onClick={onBackToLanding}
              className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-400 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900 transition-colors"
            >
              返回主頁
            </button>
        </div>
      </form>
    </div>
  );
};