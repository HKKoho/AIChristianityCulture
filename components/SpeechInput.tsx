/**
 * Speech Input Component
 * Text input with speech-to-text button
 */

import React, { useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechToText } from '../hooks/useSpeechToText';

interface SpeechInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  lang?: string;
  maxLength?: number;
  type?: string;
}

export const SpeechInput: React.FC<SpeechInputProps> = ({
  value,
  onChange,
  onKeyPress,
  placeholder,
  className = '',
  disabled = false,
  multiline = false,
  rows = 3,
  lang = 'zh-TW',
  maxLength,
  type = 'text'
}) => {
  const {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error
  } = useSpeechToText({
    lang,
    continuous: false,
    interimResults: true,
    onResult: (newTranscript) => {
      // Append new transcript to current value
      onChange(value + newTranscript);
    }
  });

  // Reset transcript when component unmounts or when manually stopped
  useEffect(() => {
    if (!isListening && transcript) {
      resetTranscript();
    }
  }, [isListening, transcript, resetTranscript]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const inputClasses = `flex-1 px-4 py-2 pr-12 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 text-white ${className}`;

  return (
    <div className="relative flex-1">
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder={placeholder}
          className={`${inputClasses} resize-none`}
          disabled={disabled || isListening}
          rows={rows}
          maxLength={maxLength}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder={placeholder}
          className={inputClasses}
          disabled={disabled || isListening}
          maxLength={maxLength}
        />
      )}

      {isSupported && (
        <button
          type="button"
          onClick={handleMicClick}
          disabled={disabled}
          className={`absolute right-2 ${multiline ? 'top-2' : 'top-1/2 -translate-y-1/2'} p-2 rounded-lg transition-colors ${
            isListening
              ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
              : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={isListening ? '停止語音輸入' : '開始語音輸入'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      )}

      {isListening && (
        <div className="absolute -bottom-6 left-0 text-xs text-blue-400 animate-pulse">
          🎤 正在聆聽...
        </div>
      )}

      {error && !isListening && (
        <div className="absolute -bottom-6 left-0 text-xs text-red-400">
          {error}
        </div>
      )}
    </div>
  );
};

export default SpeechInput;
