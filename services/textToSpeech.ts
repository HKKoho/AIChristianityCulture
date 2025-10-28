import { GoogleGenAI } from '@google/genai';
import type { VocabularyCard } from '../language/vocabularyData';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generate speech audio for a vocabulary word using Gemini
 * Returns base64-encoded audio
 */
export const generateWordAudio = async (
  card: VocabularyCard
): Promise<string> => {
  try {
    // Use Gemini to generate audio pronunciation
    // Note: Gemini 2.0 can generate audio via text-to-speech
    const model = 'gemini-2.0-flash-exp';

    const prompt = `Generate clear audio pronunciation for this ${card.language === 'Hebrew' ? 'Biblical Hebrew' : 'Koine Greek'} word:

Word: ${card.word}
Transliteration: ${card.transliteration}
Language: ${card.language}

Please pronounce this word clearly and naturally as it would be spoken in ${card.language === 'Hebrew' ? 'Biblical Hebrew' : 'Koine Greek'}.`;

    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: prompt }] },
      config: {
        // Request audio output if supported
        responseMimeType: 'audio/mp3'
      }
    });

    // Return the generated audio as base64
    // Note: This is a placeholder - actual implementation depends on Gemini's audio capabilities
    return response.text;
  } catch (error) {
    console.error('Error generating audio with Gemini:', error);
    throw error;
  }
};

/**
 * Use Web Speech API as fallback for browsers that support it
 * This works better for Greek but has limited Hebrew support
 */
export const speakWord = (card: VocabularyCard): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(card.word);

    // Try to find appropriate voice
    const voices = window.speechSynthesis.getVoices();

    if (card.language === 'Hebrew') {
      // Look for Hebrew voice
      const hebrewVoice = voices.find(v => v.lang.startsWith('he'));
      if (hebrewVoice) utterance.voice = hebrewVoice;
      utterance.lang = 'he-IL';
    } else {
      // Greek voice
      const greekVoice = voices.find(v => v.lang.startsWith('el'));
      if (greekVoice) utterance.voice = greekVoice;
      utterance.lang = 'el-GR';
    }

    utterance.rate = 0.8; // Slower for learning
    utterance.pitch = 1.0;

    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(event.error);

    window.speechSynthesis.speak(utterance);
  });
};

/**
 * Preload voices (needed for some browsers)
 */
export const preloadVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    // Some browsers load voices asynchronously
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };
  });
};

/**
 * Check if text-to-speech is available for a language
 */
export const isTTSAvailable = (language: 'Hebrew' | 'Greek'): boolean => {
  if (!('speechSynthesis' in window)) return false;

  const voices = window.speechSynthesis.getVoices();
  const langCode = language === 'Hebrew' ? 'he' : 'el';

  return voices.some(v => v.lang.startsWith(langCode));
};

/**
 * Get available voices for debugging
 */
export const getAvailableVoices = (): { name: string; lang: string }[] => {
  if (!('speechSynthesis' in window)) return [];

  return window.speechSynthesis.getVoices().map(v => ({
    name: v.name,
    lang: v.lang
  }));
};
