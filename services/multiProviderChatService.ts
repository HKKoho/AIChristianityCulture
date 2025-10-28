/**
 * Multi-Provider Chat Service with Automatic Fallbacks
 * Tries providers in order: Ollama → Gemini → GPT-4o
 * Provides seamless failover for maximum reliability
 */

type Provider = 'ollama' | 'gemini' | 'openai';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ProviderConfig {
  name: Provider;
  model: string;
  endpoint: string;
}

// Provider configurations in priority order
const PROVIDER_CONFIGS: ProviderConfig[] = [
  {
    name: 'ollama',
    model: 'qwen-coder:480b-cloud',
    endpoint: '/api/ollama'
  },
  {
    name: 'gemini',
    model: 'gemini-2.0-flash-exp',
    endpoint: '/api/unified'
  },
  {
    name: 'openai',
    model: 'gpt-4o',
    endpoint: '/api/unified'
  }
];

export class Chat {
  private messages: ChatMessage[] = [];
  private wordLimit: number;
  private systemInstruction?: string;
  private currentProvider: Provider = 'ollama';
  private providerIndex: number = 0;

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

  private async callProvider(provider: ProviderConfig, userMessage: string): Promise<string> {
    const messagesToSend = [...this.messages, { role: 'user' as const, content: userMessage }];

    console.log(`🔄 Trying ${provider.name} (${provider.model})...`);

    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        provider: provider.name,
        model: provider.model,
        messages: messagesToSend,
        temperature: 0.7,
        max_tokens: this.wordLimit * 10,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${provider.name} API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    // Handle different response formats
    let content = '';
    if (data.choices && data.choices[0] && data.choices[0].message) {
      content = data.choices[0].message.content;
    } else if (data.content) {
      content = data.content;
    } else {
      throw new Error(`Invalid response format from ${provider.name}`);
    }

    console.log(`✅ ${provider.name} succeeded`);
    this.currentProvider = provider.name;
    return content;
  }

  async sendMessageStream(options: { message: string }) {
    const { message } = options;

    // Add user message to history
    this.messages.push({
      role: 'user',
      content: message
    });

    let lastError: Error | null = null;

    // Try each provider in sequence
    for (let i = this.providerIndex; i < PROVIDER_CONFIGS.length; i++) {
      const provider = PROVIDER_CONFIGS[i];

      try {
        const content = await this.callProvider(provider, message);

        // Success! Add response to history
        this.messages.push({
          role: 'assistant',
          content
        });

        // Update provider index for next call
        this.providerIndex = i;

        // Return stream-like object for compatibility
        return {
          text: content,
          stream: (async function* () {
            yield content;
          })()
        };

      } catch (error: any) {
        console.warn(`⚠️ ${provider.name} failed: ${error.message}`);
        lastError = error;

        // If this was the last provider, throw the error
        if (i === PROVIDER_CONFIGS.length - 1) {
          console.error('❌ All providers failed');
          throw new Error(`All AI providers failed. Last error: ${error.message}`);
        }

        // Otherwise, try next provider
        console.log(`↪️ Falling back to next provider...`);
        continue;
      }
    }

    // This shouldn't happen, but just in case
    throw lastError || new Error('Failed to get response from any provider');
  }

  getCurrentProvider(): Provider {
    return this.currentProvider;
  }

  getProviderStatus(): string {
    return `Using ${this.currentProvider} (${PROVIDER_CONFIGS[this.providerIndex].model})`;
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
    console.error('Failed to create chat session:', error);
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
  return true; // At least one provider should be available
};

async function callUnifiedAPI(
  provider: Provider,
  model: string,
  prompt: string,
  wordLimit: number
): Promise<string> {
  const response = await fetch('/api/unified', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      provider,
      model,
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
    throw new Error(`${provider} API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content || data.choices?.[0]?.message?.content || 'Unable to get response';
}

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

Briefly describe key rituals, symbols, art, architecture, or historical significance. Explain their theological meaning and cultural importance. Present your findings in a clear format using markdown. Respond in Traditional Chinese (繁體中文) with English terms in parentheses where appropriate.`;

  // Try Gemini first for image analysis (best vision capabilities)
  const providers: Array<{ name: Provider; model: string; supportsVision: boolean }> = [
    { name: 'gemini', model: 'gemini-2.0-flash-exp', supportsVision: true },
    { name: 'openai', model: 'gpt-4o', supportsVision: true },
    { name: 'ollama', model: 'llava:34b', supportsVision: true }
  ];

  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      console.log(`🔄 Trying ${provider.name} for image analysis...`);

      const response = await fetch('/api/unified', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider: provider.name,
          model: provider.model,
          messages: [
            {
              role: 'user',
              content: prompt,
              image: imageBase64,
              imageMimeType: mimeType
            }
          ],
          temperature: 0.7,
          max_tokens: wordLimit * 10,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`${provider.name} error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.content || data.choices?.[0]?.message?.content;

      if (content) {
        console.log(`✅ ${provider.name} image analysis succeeded`);
        return content;
      }

      throw new Error('No content in response');

    } catch (error: any) {
      console.warn(`⚠️ ${provider.name} image analysis failed: ${error.message}`);
      lastError = error;
      continue;
    }
  }

  throw new Error(`Image analysis failed with all providers. Last error: ${lastError?.message}`);
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

  // Try providers in order
  const providers: Array<{ name: Provider; model: string }> = [
    { name: 'ollama', model: 'qwen-coder:480b-cloud' },
    { name: 'gemini', model: 'gemini-2.0-flash-exp' },
    { name: 'openai', model: 'gpt-4o' }
  ];

  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      const result = await callUnifiedAPI(provider.name, provider.model, prompt, wordLimit);
      console.log(`✅ ${provider.name} text analysis succeeded`);
      return result;
    } catch (error: any) {
      console.warn(`⚠️ ${provider.name} text analysis failed: ${error.message}`);
      lastError = error;
      continue;
    }
  }

  throw new Error(`Text analysis failed with all providers. Last error: ${lastError?.message}`);
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

  // Try providers in order with Gemini first (has web search capability)
  const providers: Array<{ name: Provider; model: string; hasWebSearch: boolean }> = [
    { name: 'gemini', model: 'gemini-2.0-flash-exp', hasWebSearch: true },
    { name: 'ollama', model: 'qwen-coder:480b-cloud', hasWebSearch: false },
    { name: 'openai', model: 'gpt-4o', hasWebSearch: false }
  ];

  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      console.log(`🔄 Trying ${provider.name} for search...`);

      const response = await fetch('/api/unified', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider: provider.name,
          model: provider.model,
          messages: [
            {
              role: 'user',
              content: fullQuery
            }
          ],
          temperature: 0.7,
          max_tokens: wordLimit * 10,
          enableWebSearch: provider.hasWebSearch,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`${provider.name} error (${response.status}): ${await response.text()}`);
      }

      const data = await response.json();
      const text = data.content || data.choices?.[0]?.message?.content || 'Unable to perform search';

      // Extract sources if available (mainly from Gemini)
      const sources: GroundingChunk[] = data.sources || [];

      console.log(`✅ ${provider.name} search succeeded`);
      return { text, sources };

    } catch (error: any) {
      console.warn(`⚠️ ${provider.name} search failed: ${error.message}`);
      lastError = error;
      continue;
    }
  }

  throw new Error(`Search failed with all providers. Last error: ${lastError?.message}`);
};
