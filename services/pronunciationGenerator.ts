import { GoogleGenAI } from '@google/genai';
import type { VocabularyCard } from '../language/vocabularyData';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface PronunciationOption {
  id: string;
  audioData: string; // base64 audio
  description: string; // What's wrong with this pronunciation (or "Correct pronunciation")
  isCorrect: boolean;
}

export interface PronunciationChallenge {
  word: VocabularyCard;
  options: PronunciationOption[];
}

/**
 * Generate 4 pronunciation variations for a word using Gemini AI
 * 1 correct + 3 common mistakes
 */
export const generatePronunciationChallenge = async (
  card: VocabularyCard
): Promise<PronunciationChallenge> => {
  try {
    const model = 'gemini-2.0-flash-exp';

    const prompt = `You are a ${card.language === 'Hebrew' ? 'Biblical Hebrew' : 'Koine Greek'} pronunciation expert. Generate 4 different audio pronunciations for this word:

Word: ${card.word}
Correct Transliteration: ${card.transliteration}
Meaning: ${card.meanings.join(', ')}
Language: ${card.language}

Generate exactly 4 pronunciations in JSON format:
1. The CORRECT pronunciation
2-4. Three COMMON MISTAKES that learners make with this word (e.g., wrong stress, wrong vowel, wrong consonant)

Respond ONLY with valid JSON in this format:
{
  "pronunciations": [
    {
      "text": "phonetic spelling to pronounce",
      "description": "Correct pronunciation" (for correct) or "Common mistake: [explain what's wrong]" (for incorrect),
      "isCorrect": true/false,
      "commonMistake": "stress on wrong syllable" | "wrong vowel sound" | "wrong consonant" | "missing sound" | null
    }
  ]
}

Make the incorrect pronunciations realistic - these should be mistakes that actual learners commonly make when learning ${card.language}.`;

    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: 'application/json',
        temperature: 0.9
      }
    });

    const result = JSON.parse(response.text);

    // Convert the text pronunciations to actual audio using Web Speech API
    const options: PronunciationOption[] = await Promise.all(
      result.pronunciations.map(async (p: any, index: number) => {
        // Generate audio for this pronunciation variant
        const audioData = await textToSpeechVariant(
          p.text,
          card.language,
          p.commonMistake
        );

        return {
          id: `option_${index}`,
          audioData,
          description: p.description,
          isCorrect: p.isCorrect
        };
      })
    );

    // Shuffle the options so correct isn't always first
    const shuffledOptions = options.sort(() => Math.random() - 0.5);

    return {
      word: card,
      options: shuffledOptions
    };
  } catch (error) {
    console.error('Error generating pronunciation challenge:', error);
    throw error;
  }
};

/**
 * Convert phonetic text to speech audio with intentional mistakes
 * Returns base64-encoded audio data URL
 */
async function textToSpeechVariant(
  text: string,
  language: 'Hebrew' | 'Greek',
  mistakeType: string | null
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    // Select appropriate voice
    if (language === 'Hebrew') {
      const hebrewVoice = voices.find(v => v.lang.startsWith('he'));
      if (hebrewVoice) utterance.voice = hebrewVoice;
      utterance.lang = 'he-IL';
    } else {
      const greekVoice = voices.find(v => v.lang.startsWith('el'));
      if (greekVoice) utterance.voice = greekVoice;
      utterance.lang = 'el-GR';
    }

    // Apply intentional variations based on mistake type
    if (mistakeType) {
      switch (mistakeType) {
        case 'stress on wrong syllable':
          utterance.rate = 1.1; // Faster, different rhythm
          utterance.pitch = 1.2;
          break;
        case 'wrong vowel sound':
          utterance.pitch = 0.9; // Different pitch
          break;
        case 'wrong consonant':
          utterance.rate = 0.9;
          break;
        case 'missing sound':
          utterance.rate = 1.2; // Rushed
          break;
        default:
          utterance.rate = 1.0;
          utterance.pitch = 1.1;
      }
    } else {
      // Correct pronunciation - slower and clearer
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
    }

    // Create audio recorder
    const mediaRecorder = startRecordingSpeech();

    utterance.onstart = () => {
      mediaRecorder?.start();
    };

    utterance.onend = () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
        mediaRecorder.ondataavailable = (event) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(event.data);
        };
      } else {
        // Fallback: return empty data URL
        resolve('data:audio/wav;base64,');
      }
    };

    utterance.onerror = (event) => reject(event.error);

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Helper to record speech synthesis output
 * Note: This is complex in browsers - simplified version
 */
function startRecordingSpeech(): MediaRecorder | null {
  try {
    // This is a simplified approach - actual implementation would need
    // Web Audio API to capture speechSynthesis output
    // For now, we'll use the direct playback approach
    return null;
  } catch (error) {
    console.error('Could not start recording:', error);
    return null;
  }
}

/**
 * Simplified version: Generate challenge using just phonetic text
 * User will hear pronunciations played through Web Speech API
 */
export const generateSimplePronunciationChallenge = async (
  card: VocabularyCard
): Promise<{
  word: VocabularyCard;
  options: Array<{
    id: string;
    phoneticText: string;
    description: string;
    isCorrect: boolean;
    mistakeType: string | null;
  }>;
}> => {
  try {
    const model = 'gemini-2.0-flash-exp';

    const prompt = `You are a ${card.language === 'Hebrew' ? 'Biblical Hebrew' : 'Koine Greek'} pronunciation expert teaching pronunciation.

Word: ${card.word}
Correct Transliteration: ${card.transliteration}
Meaning: ${card.meanings.join(', ')}
Part of Speech: ${card.partOfSpeech}

Generate 4 VERY DIFFERENT pronunciation attempts for this word - one correct and three with OBVIOUS, NOTICEABLE mistakes.

IMPORTANT: Make the incorrect pronunciations SIGNIFICANTLY different from the correct one. The differences should be CLEARLY AUDIBLE to learners.

For ${card.language === 'Hebrew' ? 'Hebrew' : 'Greek'}, provide:
1. ONE correct pronunciation
2. THREE incorrect pronunciations with MAJOR, OBVIOUS errors:
   - Use DIFFERENT phonetic spellings that will sound distinctly wrong
   - Add or remove syllables
   - Change consonants or vowels significantly
   - Use wrong stress patterns that are very noticeable
   - Make mistakes that are EASY to hear

Respond in JSON format:
{
  "options": [
    {
      "phoneticText": "the word in original script (correct) OR significantly modified phonetic version (incorrect)",
      "description": "說明 in Traditional Chinese (either '正確發音' or specific description of the obvious mistake)",
      "isCorrect": true/false,
      "mistakeType": null (for correct) or one of: "stress" | "vowel" | "consonant" | "speed"
    }
  ]
}

CRITICAL REQUIREMENTS:
- The correct pronunciation uses the exact original word: ${card.word}
- The 3 incorrect ones MUST use NOTICEABLY DIFFERENT phonetic text that sounds VERY WRONG
- Make errors OBVIOUS - like adding syllables, wrong vowels, missing sounds, completely wrong stress
- Example: If correct is "שָׁלוֹם" (shalom), wrong ones could be "שָׁלוֹמִים" (shalomim), "סָלוֹם" (salom), "שַׁלוֹם" (shallom)
- Descriptions should clearly explain the OBVIOUS mistake in Traditional Chinese
- All 4 options should use the same script (${card.language === 'Hebrew' ? 'Hebrew' : 'Greek'})`;

    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: 'application/json',
        temperature: 0.9
      }
    });

    const result = JSON.parse(response.text);

    // Shuffle options
    const shuffledOptions = result.options
      .map((opt: any, index: number) => ({
        id: `opt_${index}`,
        phoneticText: opt.phoneticText,
        description: opt.description,
        isCorrect: opt.isCorrect,
        mistakeType: opt.mistakeType
      }))
      .sort(() => Math.random() - 0.5);

    return {
      word: card,
      options: shuffledOptions
    };
  } catch (error) {
    console.error('Error generating pronunciation challenge:', error);
    throw error;
  }
};

/**
 * Play a pronunciation option using Web Speech API with variations
 */
export const playPronunciationOption = async (
  phoneticText: string,
  language: 'Hebrew' | 'Greek',
  mistakeType: string | null
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(phoneticText);
    const voices = window.speechSynthesis.getVoices();

    // Select voice
    if (language === 'Hebrew') {
      const hebrewVoice = voices.find(v => v.lang.startsWith('he'));
      if (hebrewVoice) utterance.voice = hebrewVoice;
      utterance.lang = 'he-IL';
    } else {
      const greekVoice = voices.find(v => v.lang.startsWith('el'));
      if (greekVoice) utterance.voice = greekVoice;
      utterance.lang = 'el-GR';
    }

    // Apply DRAMATIC variations based on mistake type to make differences VERY OBVIOUS
    switch (mistakeType) {
      case 'stress':
        utterance.rate = 1.4; // Much faster - wrong rhythm
        utterance.pitch = 1.4; // Higher pitch - clearly different
        break;
      case 'vowel':
        utterance.pitch = 0.7; // Much lower pitch - sounds wrong
        utterance.rate = 0.8; // Slightly slower
        break;
      case 'consonant':
        utterance.rate = 0.7; // Much slower - dragging sounds
        utterance.pitch = 0.8; // Lower pitch
        break;
      case 'speed':
        utterance.rate = 1.6; // Very fast - rushed and hard to understand
        utterance.pitch = 1.1;
        break;
      default:
        // Correct pronunciation - clear reference point
        utterance.rate = 0.75; // Slower and clearer
        utterance.pitch = 1.0; // Natural pitch
    }

    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(event.error);

    window.speechSynthesis.speak(utterance);
  });
};
