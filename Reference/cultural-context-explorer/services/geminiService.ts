
import { GoogleGenAI, Chat, GenerateContentStreamResult } from "@google/genai";
import type { GroundingChunk, SearchResult } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // Here, we rely on the execution environment to provide the key.
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const analyzeImage = async (imageBase64: string, mimeType: string): Promise<string> => {
  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: "Analyze this image for its cultural context. Describe any rituals, foods, symbols, or historical significance you can infer. Present your findings in a clear, structured format using markdown.",
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
  });

  return response.text;
};

export const analyzeText = async (text: string): Promise<string> => {
  const prompt = `Analyze the following text (which might be a menu, a list of items, or a description) for its cultural context. Identify food items, locations, or historical periods. Explain their significance and connections. Present your findings in a clear, structured format using markdown.\n\nText to analyze:\n---\n${text}`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text;
};

export const performSearch = async (query: string): Promise<SearchResult> => {
  const fullQuery = `Regarding the cultural or historical context of Agape tables and Communion, answer the following question: "${query}". Provide a comprehensive answer and use markdown for formatting.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: fullQuery,
    config: {
      tools: [{googleSearch: {}}],
    },
  });

  const text = response.text;
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

  return { text, sources };
};

export const createChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are a "Serving Officer," an AI expert on cultural and historical contexts, especially concerning traditions like Apage and Communion. You are formal, knowledgeable, and helpful. Your role is to answer user questions with accuracy and cultural sensitivity. Use markdown for formatting.',
    },
  });
};

export const sendMessageToChat = async (chat: Chat, message: string): Promise<GenerateContentStreamResult> => {
  return chat.sendMessageStream({ message });
};
