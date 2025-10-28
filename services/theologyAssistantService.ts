/**
 * Theology Assistant Service
 * Handles AI chat interactions for the Theology Assistant feature
 */

export interface ChatRequest {
  model: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  temperature: number;
  topP: number;
}

export interface ChatResponse {
  content: string;
  model: string;
}

/**
 * Call Ollama Cloud API for chat completions
 * Uses unified /api/chat endpoint (works in both dev and production)
 */
async function callOllamaCloud(request: ChatRequest): Promise<ChatResponse> {
  try {
    // Use unified API endpoint that works in both dev (Vite proxy) and production (Vercel)
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        provider: 'ollama',
        model: request.model,
        messages: request.messages,
        temperature: request.temperature,
        topP: request.topP,
        maxTokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama Cloud API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    // The unified endpoint returns { content, model, provider, usage }
    if (data.content) {
      return {
        content: data.content,
        model: data.model
      };
    }

    throw new Error('Invalid response format from Ollama Cloud API');
  } catch (error: any) {
    console.error('Ollama Cloud API error:', error);
    throw new Error(`Failed to get response: ${error.message}`);
  }
}

/**
 * Call OpenAI API for GPT models
 * Uses unified /api/chat endpoint (works in both dev and production)
 */
async function callOpenAI(request: ChatRequest): Promise<ChatResponse> {
  try {
    // Use unified API endpoint that works in both dev (Vite proxy) and production (Vercel)
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        provider: 'openai',
        model: request.model,
        messages: request.messages,
        temperature: request.temperature,
        topP: request.topP,
        maxTokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    // The unified endpoint returns { content, model, provider, usage }
    if (data.content) {
      return {
        content: data.content,
        model: data.model
      };
    }

    throw new Error('Invalid response format from OpenAI API');
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    throw new Error(`Failed to get response from OpenAI: ${error.message}`);
  }
}

/**
 * Call Google Gemini API
 */
async function callGemini(request: ChatRequest): Promise<ChatResponse> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to .env.local to use Gemini models.');
  }

  try {
    // Convert messages to Gemini format
    const geminiMessages = request.messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    // Extract system message if exists
    const systemMessage = request.messages.find(m => m.role === 'system');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${request.model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: geminiMessages,
          systemInstruction: systemMessage ? {
            parts: [{ text: systemMessage.content }]
          } : undefined,
          generationConfig: {
            temperature: request.temperature,
            topP: request.topP,
            maxOutputTokens: 2000
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const content = data.candidates[0].content.parts
        .map((part: any) => part.text)
        .join('');

      return {
        content,
        model: request.model
      };
    }

    throw new Error('Invalid response format from Gemini API');
  } catch (error: any) {
    console.error('Gemini API error:', error);
    throw new Error(`Failed to get response from Gemini: ${error.message}`);
  }
}

/**
 * Mock call for local Ollama models
 */
async function callLocalOllama(request: ChatRequest): Promise<ChatResponse> {
  const LOCAL_OLLAMA_URL = 'http://localhost:11434';

  try {
    const response = await fetch(`${LOCAL_OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        stream: false,
        options: {
          temperature: request.temperature,
          top_p: request.topP,
          num_predict: 2000
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Local Ollama error: ${response.status}`);
    }

    const data = await response.json();

    if (data.message && data.message.content) {
      return {
        content: data.message.content,
        model: request.model
      };
    }

    throw new Error('Invalid response from local Ollama');
  } catch (error: any) {
    console.error('Local Ollama error:', error);
    throw new Error(`無法連接到本地 Ollama 服務。請確保：\n1. Ollama 已安裝並正在運行\n2. 模型已下載 (ollama pull ${request.model})\n3. 服務運行在 http://localhost:11434`);
  }
}

// Define which models should use Ollama Cloud (actual models in your account)
const OLLAMA_CLOUD_MODELS = [
  'kimi-k2:1t',
  'qwen3-coder:480b',
  'deepseek-v3.1:671b',
  'gpt-oss:120b',
  'gpt-oss:20b'
];

/**
 * Main chat function - routes to appropriate service based on model
 */
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const model = request.model;

  // Determine which service to use based on model ID
  if (OLLAMA_CLOUD_MODELS.includes(model)) {
    // Ollama Cloud models (standard model names that are available in cloud)
    return callOllamaCloud(request);
  } else if (model.startsWith('gpt-')) {
    // OpenAI GPT models
    return callOpenAI(request);
  } else if (model.startsWith('gemini-')) {
    // Google Gemini models
    return callGemini(request);
  } else {
    // Local Ollama models
    return callLocalOllama(request);
  }
}

/**
 * Create system prompt for theology context
 */
export function createTheologySystemPrompt(mode: string): string {
  const basePrompt = `你是一位專業的神學研究助手，擁有深厚的聖經知識、教會歷史和系統神學理解。你的回應應該：

1. 基於聖經真理和正統神學傳統
2. 提供準確的經文引用和歷史背景
3. 以學術嚴謹但易於理解的方式表達
4. 尊重不同的神學立場，但明確指出你的觀點基礎
5. 鼓勵深入思考和屬靈成長

請用繁體中文回應。`;

  const modeSpecific = {
    'Theology Chat': '當前模式：神學對話。請針對用戶的神學問題提供深入且平衡的回答。',
    'Reading Q&A': '當前模式：文檔問答。請基於已上傳的文檔內容回答問題，並提供相關的引用和分析。',
    'Assignment Assistant': '當前模式：作業助手。請幫助用戶完成神學作業，提供學術性的指導和建議。',
    'Resource Search': '當前模式：資源搜尋。請幫助用戶找到相關的神學資源和參考文獻。'
  };

  return `${basePrompt}\n\n${modeSpecific[mode as keyof typeof modeSpecific] || modeSpecific['Theology Chat']}`;
}
