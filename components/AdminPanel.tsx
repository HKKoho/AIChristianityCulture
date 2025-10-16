import React, { useState } from 'react';
import type { SystemPromptConfig } from '../types';
import { DEFAULT_SYSTEM_PROMPT_CONFIG } from '../types';

interface AdminPanelProps {
  config: SystemPromptConfig;
  onSave: (config: SystemPromptConfig) => void;
  onBack: () => void;
}

type ConfigKey = keyof SystemPromptConfig;

const options: Record<keyof Omit<SystemPromptConfig, 'personaEnabled' | 'personality'>, string[]> = {
  ethics: ['principled', 'pragmatic', 'neutral'],
  politicalStand: ['neutral', 'centrist', 'left-leaning', 'right-leaning'],
  powerfulness: ['subtle', 'direct', 'authoritative'],
  sentiment: ['optimistic', 'neutral', 'realistic', 'pessimistic'],
  empathy: ['low', 'medium', 'high'],
};

const translations: Record<string, string> = {
    // Labels
    personaEnabled: '啟用 AI 角色',
    ethics: '道德框架',
    politicalStand: '政治立場',
    powerfulness: '語氣力度',
    sentiment: '情緒',
    personality: '個性',
    empathy: '同理心',
    // Options
    principled: '有原則的',
    pragmatic: '務實的',
    neutral: '中立的',
    centrist: '中間派',
    'left-leaning': '左傾',
    'right-leaning': '右傾',
    subtle: '含蓄的',
    direct: '直接的',
    authoritative: '權威的',
    optimistic: '樂觀的',
    realistic: '現實的',
    pessimistic: '悲觀的',
    low: '低',
    medium: '中',
    high: '高',
};

const labels: Record<ConfigKey, string> = {
  personaEnabled: translations.personaEnabled,
  ethics: translations.ethics,
  politicalStand: translations.politicalStand,
  powerfulness: translations.powerfulness,
  sentiment: translations.sentiment,
  personality: translations.personality,
  empathy: translations.empathy,
};

const OptionSelector: React.FC<{
    label: string;
    value: string;
    options: string[];
    onChange: (value: any) => void;
}> = ({ label, value, options, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-lg bg-gray-700 p-1">
            {options.map(option => (
                <button
                    key={option}
                    type="button"
                    onClick={() => onChange(option)}
                    className={`w-full rounded-md px-3 py-2 text-sm font-medium transition capitalize ${
                        value === option
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-gray-300 hover:bg-gray-600/50'
                    }`}
                >
                    {translations[option] || option}
                </button>
            ))}
        </div>
    </div>
);

export const AdminPanel: React.FC<AdminPanelProps> = ({ config, onSave, onBack }) => {
  const [currentConfig, setCurrentConfig] = useState<SystemPromptConfig>(config);

  const handleSave = () => {
    onSave(currentConfig);
  };

  const handleReset = () => {
    setCurrentConfig(DEFAULT_SYSTEM_PROMPT_CONFIG);
  }

  const handleChange = (key: ConfigKey, value: string | boolean) => {
    setCurrentConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full max-w-3xl bg-gray-800/50 rounded-lg shadow-2xl p-8 border border-gray-700 animate-fade-in">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold">AI 神學家角色</h2>
            <button
              onClick={onBack}
              className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-md font-semibold transition-colors"
            >
              &larr; 返回建立
            </button>
        </div>

        <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div>
                    <h3 className="font-semibold text-white">{labels.personaEnabled}</h3>
                    <p className="text-sm text-gray-400">自訂 AI 的個性與回應風格。</p>
                </div>
                <button
                    type="button"
                    onClick={() => handleChange('personaEnabled', !currentConfig.personaEnabled)}
                    className={`${
                        currentConfig.personaEnabled ? 'bg-indigo-600' : 'bg-gray-600'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
                    aria-pressed={currentConfig.personaEnabled}
                >
                    <span
                        className={`${
                            currentConfig.personaEnabled ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                </button>
            </div>

            <fieldset disabled={!currentConfig.personaEnabled} className="space-y-6 transition-opacity duration-300 disabled:opacity-50">
                {(Object.keys(options) as (keyof typeof options)[]).map(key => (
                    <OptionSelector
                        key={key}
                        label={labels[key]}
                        value={currentConfig[key]}
                        options={options[key]}
                        onChange={(value) => handleChange(key, value)}
                    />
                ))}
                
                <div>
                    <label htmlFor="personality" className="block text-sm font-medium text-gray-300 mb-2">{labels.personality}</label>
                    <textarea
                        id="personality"
                        value={currentConfig.personality}
                        onChange={(e) => handleChange('personality', e.target.value)}
                        rows={3}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:bg-gray-700/50"
                        placeholder="描述 AI 的個性..."
                    />
                </div>
            </fieldset>

            <div className="pt-4 border-t border-gray-700 flex flex-col sm:flex-row-reverse gap-3">
                 <button
                    onClick={handleSave}
                    className="w-full sm:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors"
                >
                    儲存變更
                </button>
                <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-md font-semibold transition-colors"
                >
                    重設為預設值
                </button>
            </div>
        </div>
    </div>
  );
};