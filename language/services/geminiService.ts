
import { GoogleGenAI } from '@google/genai';
import type { Word } from '../types';
import { Language } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getPronunciationFeedback = async (
  word: Word,
  language: Language,
  audioBase64: string,
  mimeType: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `You are a friendly and encouraging biblical language pronunciation coach. The user is trying to pronounce the ${language} word "${word.word}". Please listen to the audio and provide brief, clear, and positive feedback on their pronunciation in 1-2 sentences. If they are correct, praise them. If they are slightly off, gently guide them on the correct sound. For reference, the word is transliterated as "${word.transliteration}" and means "${word.meaning}".`;

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
    });
    
    return response.text;
  } catch (error) {
    console.error('Error getting feedback from Gemini:', error);
    return 'Sorry, I encountered an error trying to analyze your pronunciation. Please try again.';
  }
};
