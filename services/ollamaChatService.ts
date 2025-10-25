/**
 * Ollama Chat Service
 * High-level chat interface for Ollama API
 * Mirrors geminiChatService interface for compatibility
 */

import * as OllamaAPI from '../api/ollama';

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
}

/**
 * Chat class for maintaining conversation history with Ollama
 */
export class Chat {
  private messages: OllamaAPI.OllamaMessage[] = [];
  private model: string;
  private temperature: number;
  private topP: number;

  constructor(
    model: string = 'kimi-k2:1t-cloud',
    systemInstruction?: string,
    options?: {
      temperature?: number;
      topP?: number;
    }
  ) {
    this.model = model;
    this.temperature = options?.temperature ?? 0.7;
    this.topP = options?.topP ?? 0.9;

    if (systemInstruction) {
      this.messages.push({
        role: 'system',
        content: systemInstruction,
      });
    }

    console.log(`🤖 Ollama Chat initialized with model: ${this.model}`);
  }

  /**
   * Send a message and get a response
   */
  async sendMessage(userMessage: string): Promise<string> {
    console.log(`💬 Ollama: Sending message (${this.messages.length} messages in history)`);

    this.messages.push({
      role: 'user',
      content: userMessage,
    });

    try {
      const response = await OllamaAPI.chat({
        model: this.model,
        messages: this.messages,
        options: {
          temperature: this.temperature,
          top_p: this.topP,
        },
      });

      const assistantMessage = response.message.content;

      this.messages.push({
        role: 'assistant',
        content: assistantMessage,
      });

      console.log(`✅ Ollama: Response received (${assistantMessage.length} chars)`);

      return assistantMessage;
    } catch (error) {
      console.error('❌ Ollama chat error:', error);
      // Remove the user message we just added since it failed
      this.messages.pop();
      throw error;
    }
  }

  /**
   * Analyze an image (requires vision-capable model)
   */
  async analyzeImage(
    imageBase64: string,
    prompt: string
  ): Promise<string> {
    console.log('🖼️ Ollama: Analyzing image');

    // Use vision model for image analysis
    const visionModel = this.model.includes('vision') || this.model.includes('llava')
      ? this.model
      : 'llava:34b';

    const response = await OllamaAPI.analyzeImage(imageBase64, prompt, visionModel);

    return response;
  }

  /**
   * Get current conversation history
   */
  getHistory(): ChatMessage[] {
    return this.messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  /**
   * Clear conversation history (keeps system message if any)
   */
  clearHistory(): void {
    const systemMessage = this.messages.find(msg => msg.role === 'system');
    this.messages = systemMessage ? [systemMessage] : [];
    console.log('🗑️ Ollama: Conversation history cleared');
  }

  /**
   * Get the current model being used
   */
  getModel(): string {
    return this.model;
  }

  /**
   * Change the model
   */
  setModel(model: string): void {
    console.log(`🔄 Ollama: Switching model from ${this.model} to ${model}`);
    this.model = model;
  }
}

/**
 * Perform a text analysis (simple one-shot query)
 */
export async function analyzeText(
  prompt: string,
  options?: {
    model?: string;
    temperature?: number;
    topP?: number;
    systemInstruction?: string;
  }
): Promise<ChatResponse> {
  const model = options?.model || 'kimi-k2:1t-cloud';

  console.log(`📝 Ollama: Analyzing text with ${model}`);

  const response = await OllamaAPI.generate(
    model,
    prompt,
    {
      temperature: options?.temperature ?? 0.7,
      top_p: options?.topP ?? 0.9,
      system: options?.systemInstruction,
    }
  );

  return {
    text: response,
  };
}

/**
 * Perform a search (Note: Ollama doesn't have built-in web search)
 * This is a compatibility function that performs text generation instead
 */
export async function performSearch(
  query: string,
  options?: {
    model?: string;
    temperature?: number;
    topP?: number;
    maxLength?: number;
  }
): Promise<ChatResponse> {
  const model = options?.model || 'kimi-k2:1t-cloud';
  const maxLength = options?.maxLength || 500;

  console.log(`🔍 Ollama: Performing search-style query with ${model}`);
  console.log(`⚠️ Note: Ollama doesn't have web search. Using knowledge-based response.`);

  const enhancedQuery = `請回答以下問題（限制在 ${maxLength} 字以內）：

${query}

注意：請基於你的知識提供準確的回答。如果不確定，請明確說明。`;

  const response = await OllamaAPI.generate(
    model,
    enhancedQuery,
    {
      temperature: options?.temperature ?? 0.7,
      top_p: options?.topP ?? 0.9,
    }
  );

  return {
    text: response,
  };
}

/**
 * Analyze an image (standalone function)
 */
export async function analyzeImage(
  imageBase64: string,
  prompt: string,
  options?: {
    model?: string;
    temperature?: number;
    topP?: number;
  }
): Promise<ChatResponse> {
  const model = options?.model || 'llava:34b';

  console.log(`🖼️ Ollama: Analyzing image with ${model}`);

  const response = await OllamaAPI.analyzeImage(imageBase64, prompt, model);

  return {
    text: response,
  };
}

/**
 * Generate a structured response (e.g., for sermon generation)
 */
export async function generateStructured<T>(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    topP?: number;
    systemInstruction?: string;
    schema?: any; // JSON schema for structured output
  }
): Promise<T> {
  const model = options.model || 'kimi-k2:1t-cloud';

  console.log(`📋 Ollama: Generating structured output with ${model}`);

  // Add JSON formatting instruction to prompt
  const enhancedPrompt = `${prompt}

請以 JSON 格式回應，確保符合以下結構：
${options.schema ? JSON.stringify(options.schema, null, 2) : '標準 JSON 物件'}

只回傳 JSON，不要包含其他文字說明。`;

  const response = await OllamaAPI.generate(
    model,
    enhancedPrompt,
    {
      temperature: options.temperature ?? 0.7,
      top_p: options.topP ?? 0.9,
      system: options.systemInstruction,
    }
  );

  // Try to extract JSON from response
  try {
    // Try to find JSON in the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // If no JSON found, try parsing the whole response
    return JSON.parse(response);
  } catch (error) {
    console.error('❌ Failed to parse JSON response:', error);
    console.log('Raw response:', response);
    throw new Error(`Failed to parse structured response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if Ollama service is available
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const isHealthy = await OllamaAPI.checkHealth();
    console.log(`🏥 Ollama health check: ${isHealthy ? '✅ Healthy' : '❌ Unhealthy'}`);
    return isHealthy;
  } catch (error) {
    console.error('❌ Ollama health check failed:', error);
    return false;
  }
}

/**
 * List available models
 */
export async function listAvailableModels(): Promise<string[]> {
  try {
    const models = await OllamaAPI.listModels();
    console.log(`📋 Available Ollama models: ${models.length}`);
    return models;
  } catch (error) {
    console.error('❌ Failed to list models:', error);
    return [];
  }
}

// Export for backward compatibility
export default {
  Chat,
  analyzeText,
  performSearch,
  analyzeImage,
  generateStructured,
  checkHealth,
  listAvailableModels,
};
