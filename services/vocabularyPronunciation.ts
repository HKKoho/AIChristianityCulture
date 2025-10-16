import { GoogleGenAI } from '@google/genai';
import type { VocabularyCard } from '../language/vocabularyData';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface PronunciationFeedback {
  isCorrect: boolean;
  score: number; // 0-100
  feedback: string;
  suggestions?: string;
}

export const getVocabularyPronunciationFeedback = async (
  card: VocabularyCard,
  audioBase64: string,
  mimeType: string
): Promise<PronunciationFeedback> => {
  try {
    const model = 'gemini-2.0-flash-exp';

    const prompt = `You are an expert biblical language pronunciation coach specializing in ${card.language} (${card.language === 'Hebrew' ? 'Biblical Hebrew' : 'Koine Greek'}).

The student is attempting to pronounce the word:
- Original: ${card.word}
- Transliteration: ${card.transliteration}
- Meaning: ${card.meanings.join(', ')}
- Part of Speech: ${card.partOfSpeech}
${card.grammaticalNotes ? `- Grammar Notes: ${card.grammaticalNotes}` : ''}

Please analyze their pronunciation and respond in JSON format with:
{
  "isCorrect": true/false (true if pronunciation is good enough, false if needs improvement),
  "score": 0-100 (0 = completely wrong, 100 = perfect),
  "feedback": "Brief encouraging feedback in Traditional Chinese (2-3 sentences)",
  "suggestions": "If not perfect, specific suggestions for improvement in Traditional Chinese (optional)"
}

Be encouraging but honest. Consider:
- Correct consonant sounds
- Correct vowel sounds
- Proper stress/emphasis
- Overall fluency

Respond ONLY with valid JSON, no other text.`;

    const audioPart = {
      inlineData: {
        data: audioBase64,
        mimeType,
      },
    };
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model,
      contents: { parts: [textPart, audioPart] },
      config: {
        responseMimeType: 'application/json'
      }
    });

    const result = JSON.parse(response.text);
    return {
      isCorrect: result.isCorrect || false,
      score: result.score || 0,
      feedback: result.feedback || '無法分析發音',
      suggestions: result.suggestions
    };
  } catch (error) {
    console.error('Error getting pronunciation feedback from Gemini:', error);
    return {
      isCorrect: false,
      score: 0,
      feedback: '抱歉，無法分析您的發音。請重試。',
      suggestions: undefined
    };
  }
};

/**
 * Convert pronunciation score to spaced repetition quality rating
 */
export const scoreToQuality = (score: number): 0 | 1 | 2 | 3 | 4 | 5 => {
  if (score >= 95) return 5; // Perfect
  if (score >= 85) return 4; // Good
  if (score >= 70) return 3; // OK but needs work
  if (score >= 50) return 2; // Incorrect but close
  if (score >= 25) return 1; // Incorrect but recognized attempt
  return 0; // Complete failure
};
