import { GoogleGenAI, Chat, GenerateContentStreamResult } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const createChatSession = (wordLimit: number = 100): Chat | null => {
  if (!ai) {
    console.warn('Gemini API key not configured');
    return null;
  }

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are a Cultural Explorer Assistant, an AI expert on Christian cultural traditions, history, and practices.

Your expertise covers:
- Christian food traditions, communion, agape feasts, and biblical meals
- Pilgrimage routes, holy sites, and biblical locations
- Sacred music, hymns, chants, and worship traditions
- Christian art, icons, architecture, and visual culture
- Biblical manuscripts, church fathers, and theological literature
- Christian meditation, contemplative prayer, and spiritual practices

You are knowledgeable, respectful, and culturally sensitive. Answer questions with historical accuracy, theological depth, and pastoral wisdom. Use markdown for formatting when appropriate. Always be helpful and encouraging in exploring the richness of Christian cultural heritage.

IMPORTANT: Limit each response to approximately ${wordLimit} words unless the user explicitly asks for more details or a longer explanation. Be concise and focused on the most essential information.

Respond primarily in Traditional Chinese (繁體中文) unless the user writes in English.`,
    },
  });
};

export const sendChatMessage = async (
  chat: Chat,
  message: string
): Promise<GenerateContentStreamResult> => {
  if (!chat) {
    throw new Error('Chat session not initialized');
  }

  return chat.sendMessageStream({ message });
};

export const isServiceAvailable = (): boolean => {
  return ai !== null;
};

export const analyzeImage = async (
  imageBase64: string,
  mimeType: string,
  categoryContext?: string,
  wordLimit: number = 100
): Promise<string> => {
  if (!ai) {
    throw new Error('Gemini API not configured. Please set GEMINI_API_KEY environment variable.');
  }

  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType: mimeType,
    },
  };

  const contextPrompt = categoryContext
    ? `Analyze this image in the context of ${categoryContext}.`
    : 'Analyze this image for its cultural and historical context in Christianity.';

  const textPart = {
    text: `${contextPrompt}

IMPORTANT: Limit your response to approximately ${wordLimit} words. Be concise and focused.

Briefly describe key rituals, symbols, art, architecture, or historical significance. Explain their theological meaning and cultural importance. Present your findings in a clear format using markdown. Respond in Traditional Chinese (繁體中文) with English terms in parentheses where appropriate.`,
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
  });

  return response.text;
};

export const analyzeText = async (text: string, categoryContext?: string, wordLimit: number = 100): Promise<string> => {
  if (!ai) {
    throw new Error('Gemini API not configured. Please set GEMINI_API_KEY environment variable.');
  }

  const contextPrompt = categoryContext
    ? `Analyze the following text in the context of ${categoryContext}.`
    : 'Analyze the following text for its cultural and historical context in Christianity.';

  const prompt = `${contextPrompt}

IMPORTANT: Limit your response to approximately ${wordLimit} words. Be concise and focused.

Briefly identify the most relevant:
- Biblical references and theological concepts
- Historical periods, events, or figures
- Cultural practices and traditions
- Symbolic meanings and spiritual significance

Explain their key importance and connections to Christian faith and practice. Present findings concisely using markdown.

Respond in Traditional Chinese (繁體中文) with English terms in parentheses where appropriate.

Text to analyze:
---
${text}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text;
};

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export interface SearchResult {
  text: string;
  sources: GroundingChunk[];
}

export const performSearch = async (query: string, categoryContext?: string, wordLimit: number = 100): Promise<SearchResult> => {
  if (!ai) {
    throw new Error('Gemini API not configured. Please set GEMINI_API_KEY environment variable.');
  }

  const contextPrompt = categoryContext
    ? `Regarding the cultural or historical context of ${categoryContext}, answer the following question: "${query}".`
    : `Regarding Christian cultural and historical context, answer the following question: "${query}".`;

  const fullQuery = `${contextPrompt}

IMPORTANT: Limit your response to approximately ${wordLimit} words. Be concise and focused on the most essential information.

Provide a brief answer with key historical details, theological significance, and cultural context. Use markdown for formatting. Respond in Traditional Chinese (繁體中文) with English terms in parentheses where appropriate.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: fullQuery,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text;
  const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[]) || [];

  return { text, sources };
};
