/**
 * Speech-to-Text Hook
 * Uses Web Speech API for voice input
 */

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechToTextOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

interface UseSpeechToTextReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

export function useSpeechToText(options: UseSpeechToTextOptions = {}): UseSpeechToTextReturn {
  const {
    lang = 'zh-TW', // Default to Traditional Chinese
    continuous = false,
    interimResults = true,
    onResult,
    onError
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Check if speech recognition is supported
  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let currentTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          currentTranscript += result[0].transcript;
        } else if (interimResults) {
          currentTranscript += result[0].transcript;
        }
      }

      setTranscript(prev => prev + currentTranscript);
      if (onResult && currentTranscript) {
        onResult(currentTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      const errorMessage = `語音識別錯誤: ${event.error}`;
      setError(errorMessage);
      setIsListening(false);
      if (onError) {
        onError(errorMessage);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [lang, continuous, interimResults, isSupported, onResult, onError]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setError('無法啟動語音識別');
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;

    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.error('Error stopping speech recognition:', err);
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error
  };
}
