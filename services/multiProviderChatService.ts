/**
 * Multi-Provider Chat Service with Automatic Fallback
 *
 * Provider Priority Chain:
 * 1. Ollama kimi-k2:1t-cloud (Primary)
 * 2. Ollama qwen-coder:480b-cloud (Secondary)
 * 3. Google Gemini 2.0 Flash (Tertiary)
 * 4. OpenAI GPT-4o (Quaternary)
 *
 * Features:
 * - Automatic provider failover
 * - Feature-optimized routing (e.g., Gemini for web search)
 * - Conversation continuity across provider switches
 * - Detailed logging for debugging
 */

import { AIProvider } from '../types';
import * as UnifiedAPI from '../api/unified';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface SearchResult {
  title: string;
  snippet: string;
  link: string;
}

export interface ChatResponse {
  text: string;
  sources?: SearchResult[];
  provider?: AIProvider;
  model?: string;
}

/**
 * Chat class with automatic multi-provider fallback
 */
export class Chat {
  private messages: ChatMessage[] = [];
  private systemInstruction?: string;
  private temperature: number;
  private topP: number;
  private lastSuccessfulProvider?: AIProvider;

  constructor(
    systemInstruction?: string,
    options?: {
      temperature?: number;
      topP?: number;
    }
  ) {
    this.systemInstruction = systemInstruction;
    this.temperature = options?.temperature ?? 0.7;
    this.topP = options?.topP ?? 0.9;

    console.log('🤖 Multi-Provider Chat initialized');
    console.log(`📊 Temperature: ${this.temperature}, Top-P: ${this.topP}`);
  }

  /**
   * Send a message with automatic provider fallback
   */
  async sendMessage(userMessage: string): Promise<string> {
    console.log(`💬 Sending message (${this.messages.length} messages in history)`);

    this.messages.push({
      role: 'user',
      content: userMessage,
    });

    try {
      const requestMessages: UnifiedAPI.UnifiedMessage[] = [];

      if (this.systemInstruction) {
        requestMessages.push({
          role: 'system',
          content: this.systemInstruction,
        });
      }

      requestMessages.push(...this.messages);

      const response = await UnifiedAPI.chat({
        messages: requestMessages,
        temperature: this.temperature,
        topP: this.topP,
      });

      this.lastSuccessfulProvider = response.provider;

      this.messages.push({
        role: 'assistant',
        content: response.content,
      });

      console.log(`✅ Response received from ${response.provider} (${response.model})`);

      return response.content;
    } catch (error) {
      console.error('❌ All providers failed:', error);
      // Remove the user message since it failed
      this.messages.pop();
      throw error;
    }
  }

  /**
   * Analyze an image with automatic provider fallback
   * Priority: Gemini (best vision) → GPT-4o → Ollama (llava)
   */
  async analyzeImage(
    imageBase64: string,
    prompt: string
  ): Promise<string> {
    console.log('🖼️ Analyzing image with multi-provider fallback');

    try {
      const response = await UnifiedAPI.analyzeImage(imageBase64, prompt, {
        temperature: this.temperature,
        topP: this.topP,
      });

      console.log(`✅ Image analyzed by ${response.provider} (${response.model})`);

      return response.content;
    } catch (error) {
      console.error('❌ Image analysis failed on all providers:', error);
      throw error;
    }
  }

  /**
   * Get conversation history
   */
  getHistory(): ChatMessage[] {
    return [...this.messages];
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.messages = [];
    console.log('🗑️ Conversation history cleared');
  }

  /**
   * Get the last successful provider
   */
  getLastProvider(): AIProvider | undefined {
    return this.lastSuccessfulProvider;
  }
}

/**
 * Perform a web search with automatic fallback
 * Prioritizes Gemini (has built-in web search with sources)
 */
export async function performSearch(
  query: string,
  options?: {
    temperature?: number;
    topP?: number;
    maxLength?: number;
  }
): Promise<ChatResponse> {
  const maxLength = options?.maxLength || 500;

  console.log('🔍 Performing search with multi-provider fallback');
  console.log(`📏 Max length: ${maxLength} words`);

  // Try Gemini first (has web search capability)
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || '';

  if (GEMINI_API_KEY) {
    try {
      console.log('🔄 Trying Gemini with web search (优先选择)');
      const response = await performSearchWithGemini(query, maxLength, options);
      console.log('✅ Success with Gemini web search');
      return response;
    } catch (error) {
      console.log('⚠️ Gemini search failed, falling back to Ollama');
    }
  }

  // Fallback to Ollama (knowledge-based, no web search)
  try {
    console.log('🔄 Trying Ollama (knowledge-based)');
    const response = await performSearchWithOllama(query, maxLength, options);
    console.log('✅ Success with Ollama');
    return response;
  } catch (error) {
    console.log('⚠️ Ollama failed, trying GPT-4o');
  }

  // Final fallback to GPT-4o
  try {
    console.log('🔄 Trying GPT-4o');
    const response = await performSearchWithOpenAI(query, maxLength, options);
    console.log('✅ Success with GPT-4o');
    return response;
  } catch (error) {
    throw new Error('Search failed on all providers');
  }
}

/**
 * Search with Gemini (has web search)
 */
async function performSearchWithGemini(
  query: string,
  maxLength: number,
  options?: { temperature?: number; topP?: number }
): Promise<ChatResponse> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || '';

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      temperature: options?.temperature ?? 0.7,
      topP: options?.topP ?? 0.9,
    },
  });

  const chat = model.startChat({
    history: [],
    tools: [{
      googleSearch: {}
    }],
  });

  const enhancedQuery = `請回答以下問題（限制在 ${maxLength} 字以內）：

${query}

請提供準確、簡潔的回答，並在適當時引用來源。`;

  const result = await chat.sendMessage(enhancedQuery);
  const response = result.response;

  // Extract grounding sources if available
  const sources: SearchResult[] = [];
  const groundingMetadata = (response as any).candidates?.[0]?.groundingMetadata;

  if (groundingMetadata?.groundingSupports) {
    for (const support of groundingMetadata.groundingSupports) {
      if (support.groundingChunkIndices && support.segment) {
        for (const chunkIndex of support.groundingChunkIndices) {
          const chunk = groundingMetadata.groundingChunks?.[chunkIndex];
          if (chunk?.web) {
            sources.push({
              title: chunk.web.title || chunk.web.uri,
              snippet: support.segment.text || '',
              link: chunk.web.uri,
            });
          }
        }
      }
    }
  }

  return {
    text: response.text(),
    sources: sources.length > 0 ? sources : undefined,
    provider: AIProvider.GEMINI,
    model: 'gemini-2.0-flash-exp',
  };
}

/**
 * Search with Ollama (knowledge-based, no web search)
 */
async function performSearchWithOllama(
  query: string,
  maxLength: number,
  options?: { temperature?: number; topP?: number }
): Promise<ChatResponse> {
  const enhancedQuery = `請回答以下問題（限制在 ${maxLength} 字以內）：

${query}

注意：請基於你的知識提供準確的回答。如果不確定，請明確說明。`;

  const response = await UnifiedAPI.chat({
    messages: [
      { role: 'user', content: enhancedQuery }
    ],
    temperature: options?.temperature ?? 0.7,
    topP: options?.topP ?? 0.9,
    model: 'kimi-k2:1t-cloud', // Use primary model
  });

  return {
    text: response.content,
    provider: response.provider,
    model: response.model,
  };
}

/**
 * Search with OpenAI GPT-4o
 */
async function performSearchWithOpenAI(
  query: string,
  maxLength: number,
  options?: { temperature?: number; topP?: number }
): Promise<ChatResponse> {
  const enhancedQuery = `請回答以下問題（限制在 ${maxLength} 字以內）：

${query}

請提供準確、簡潔的回答。`;

  const response = await UnifiedAPI.chat({
    messages: [
      { role: 'user', content: enhancedQuery }
    ],
    temperature: options?.temperature ?? 0.7,
    topP: options?.topP ?? 0.9,
  });

  return {
    text: response.content,
    provider: response.provider,
    model: response.model,
  };
}

/**
 * Analyze text with automatic fallback
 */
export async function analyzeText(
  prompt: string,
  options?: {
    temperature?: number;
    topP?: number;
    systemInstruction?: string;
  }
): Promise<ChatResponse> {
  console.log('📝 Analyzing text with multi-provider fallback');

  try {
    const messages: UnifiedAPI.UnifiedMessage[] = [];

    if (options?.systemInstruction) {
      messages.push({
        role: 'system',
        content: options.systemInstruction,
      });
    }

    messages.push({
      role: 'user',
      content: prompt,
    });

    const response = await UnifiedAPI.chat({
      messages,
      temperature: options?.temperature ?? 0.7,
      topP: options?.topP ?? 0.9,
    });

    console.log(`✅ Text analyzed by ${response.provider} (${response.model})`);

    return {
      text: response.content,
      provider: response.provider,
      model: response.model,
    };
  } catch (error) {
    console.error('❌ Text analysis failed on all providers:', error);
    throw error;
  }
}

/**
 * Analyze an image (standalone function)
 */
export async function analyzeImage(
  imageBase64: string,
  prompt: string,
  options?: {
    temperature?: number;
    topP?: number;
  }
): Promise<ChatResponse> {
  console.log('🖼️ Analyzing image (standalone)');

  try {
    const response = await UnifiedAPI.analyzeImage(imageBase64, prompt, {
      temperature: options?.temperature ?? 0.7,
      topP: options?.topP ?? 0.9,
    });

    return {
      text: response.content,
      provider: response.provider,
      model: response.model,
    };
  } catch (error) {
    console.error('❌ Image analysis failed:', error);
    throw error;
  }
}

/**
 * Check which providers are currently available
 */
export async function checkAvailableProviders(): Promise<{
  ollama: boolean;
  gemini: boolean;
  openai: boolean;
}> {
  const available = await UnifiedAPI.checkAvailableProviders();
  console.log('🏥 Provider availability:', available);
  return available;
}

/**
 * Get provider status with detailed information
 */
export async function getProviderStatus(): Promise<{
  primary: { name: string; available: boolean; model: string };
  secondary: { name: string; available: boolean; model: string };
  tertiary: { name: string; available: boolean; model: string };
  quaternary: { name: string; available: boolean; model: string };
}> {
  const available = await checkAvailableProviders();

  return {
    primary: {
      name: 'Ollama (Kimi K2)',
      available: available.ollama,
      model: 'kimi-k2:1t-cloud',
    },
    secondary: {
      name: 'Ollama (Qwen Coder)',
      available: available.ollama,
      model: 'qwen-coder:480b-cloud',
    },
    tertiary: {
      name: 'Google Gemini',
      available: available.gemini,
      model: 'gemini-2.0-flash-exp',
    },
    quaternary: {
      name: 'OpenAI GPT-4o',
      available: available.openai,
      model: 'gpt-4o',
    },
  };
}

// Export default for backward compatibility
export default {
  Chat,
  performSearch,
  analyzeText,
  analyzeImage,
  checkAvailableProviders,
  getProviderStatus,
};
