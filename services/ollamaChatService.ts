/**
 * Ollama Chat Service
 * Provides chat functionality using Ollama Cloud API via proxy
 * Mirrors the interface of geminiChatService.ts for drop-in replacement
 */

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatSession {
  messages: ChatMessage[];
  wordLimit: number;
  systemInstruction?: string;
}

// Simple chat session object that maintains conversation history
export class Chat {
  private messages: ChatMessage[] = [];
  private wordLimit: number;
  private systemInstruction?: string;

  constructor(wordLimit: number = 100, systemInstruction?: string) {
    this.wordLimit = wordLimit;
    this.systemInstruction = systemInstruction;

    // Add system instruction as first message if provided
    if (systemInstruction) {
      this.messages.push({
        role: 'system',
        content: systemInstruction
      });
    }
  }

  async sendMessageStream(options: { message: string }) {
    const { message } = options;

    // Add user message to history
    this.messages.push({
      role: 'user',
      content: message
    });

    try {
      // Call Ollama API via proxy
      const response = await fetch('/api/ollama', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'qwen-coder:480b-cloud', // Default model
          messages: this.messages,
          temperature: 0.7,
          max_tokens: this.wordLimit * 10, // Rough estimate: 10 tokens per word
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();

      // Extract content from OpenAI-compatible response
      let content = '';
      if (data.choices && data.choices[0] && data.choices[0].message) {
        content = data.choices[0].message.content;
      } else {
        throw new Error('Invalid response format from Ollama API');
      }

      // Add assistant response to history
      this.messages.push({
        role: 'assistant',
        content
      });

      // Return a stream-like object for compatibility
      return {
        text: content,
        stream: (async function* () {
          yield content;
        })()
      };
    } catch (error: any) {
      console.error('Ollama chat error:', error);
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }
}

export const createChatSession = (wordLimit: number = 100): Chat | null => {
  const systemInstruction = `You are a Cultural Explorer Assistant, an AI expert on Christian cultural traditions, history, and practices.

Your expertise covers:
- Christian food traditions, communion, agape feasts, and biblical meals
- Pilgrimage routes, holy sites, and biblical locations
- Sacred music, hymns, chants, and worship traditions
- Christian art, icons, architecture, and visual culture
- Biblical manuscripts, church fathers, and theological literature
- Christian meditation, contemplative prayer, and spiritual practices

You are knowledgeable, respectful, and culturally sensitive. Answer questions with historical accuracy, theological depth, and pastoral wisdom. Use markdown for formatting when appropriate. Always be helpful and encouraging in exploring the richness of Christian cultural heritage.

IMPORTANT: Limit each response to approximately ${wordLimit} words unless the user explicitly asks for more details or a longer explanation. Be concise and focused on the most essential information.

Respond primarily in Traditional Chinese (繁體中文) unless the user writes in English.`;

  try {
    return new Chat(wordLimit, systemInstruction);
  } catch (error) {
    console.error('Failed to create Ollama chat session:', error);
    return null;
  }
};

export const sendChatMessage = async (
  chat: Chat,
  message: string
): Promise<any> => {
  if (!chat) {
    throw new Error('Chat session not initialized');
  }

  return chat.sendMessageStream({ message });
};

export const isServiceAvailable = (): boolean => {
  // Ollama is available if the API key is configured
  return true; // The proxy will handle the actual check
};

export const analyzeImage = async (
  imageBase64: string,
  mimeType: string,
  categoryContext?: string,
  wordLimit: number = 100
): Promise<string> => {
  const contextPrompt = categoryContext
    ? `Analyze this image in the context of ${categoryContext}.`
    : 'Analyze this image for its cultural and historical context in Christianity.';

  const prompt = `${contextPrompt}

IMPORTANT: Limit your response to approximately ${wordLimit} words. Be concise and focused.

Briefly describe key rituals, symbols, art, architecture, or historical significance. Explain their theological meaning and cultural importance. Present your findings in a clear format using markdown. Respond in Traditional Chinese (繁體中文) with English terms in parentheses where appropriate.

[Image data would be included here - Note: Ollama vision models may have different capabilities]`;

  try {
    // For image analysis, we'd use a vision-capable model like llava
    const response = await fetch('/api/ollama', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llava:34b', // Vision model
        messages: [
          {
            role: 'user',
            content: prompt,
            images: [imageBase64] // Some Ollama models support images in messages
          }
        ],
        temperature: 0.7,
        max_tokens: wordLimit * 10,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama image analysis error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Unable to analyze image';
  } catch (error: any) {
    console.error('Ollama image analysis error:', error);
    throw new Error(`Failed to analyze image: ${error.message}`);
  }
};

export const analyzeText = async (
  text: string,
  categoryContext?: string,
  wordLimit: number = 100
): Promise<string> => {
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

  try {
    const response = await fetch('/api/ollama', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen-coder:480b-cloud',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: wordLimit * 10,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama text analysis error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Unable to analyze text';
  } catch (error: any) {
    console.error('Ollama text analysis error:', error);
    throw new Error(`Failed to analyze text: ${error.message}`);
  }
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

export const performSearch = async (
  query: string,
  categoryContext?: string,
  wordLimit: number = 100
): Promise<SearchResult> => {
  const contextPrompt = categoryContext
    ? `Regarding the cultural or historical context of ${categoryContext}, answer the following question: "${query}".`
    : `Regarding Christian cultural and historical context, answer the following question: "${query}".`;

  const fullQuery = `${contextPrompt}

IMPORTANT: Limit your response to approximately ${wordLimit} words. Be concise and focused on the most essential information.

Provide a brief answer with key historical details, theological significance, and cultural context. Use markdown for formatting. Respond in Traditional Chinese (繁體中文) with English terms in parentheses where appropriate.`;

  try {
    const response = await fetch('/api/ollama', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen-coder:480b-cloud',
        messages: [
          {
            role: 'user',
            content: fullQuery
          }
        ],
        temperature: 0.7,
        max_tokens: wordLimit * 10,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama search error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || 'Unable to perform search';

    // Note: Ollama doesn't have built-in web search like Gemini
    // So we return empty sources array
    const sources: GroundingChunk[] = [];

    return { text, sources };
  } catch (error: any) {
    console.error('Ollama search error:', error);
    throw new Error(`Failed to perform search: ${error.message}`);
  }
};
