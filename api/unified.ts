/**
 * Unified API Proxy for Multiple AI Providers
 * Supports: Ollama Cloud, Google Gemini, OpenAI GPT-4o
 * Handles different API formats and provides consistent response
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { provider, model, messages, temperature, max_tokens, enableWebSearch, image, imageMimeType } = req.body;

    if (!provider || !model || !messages) {
      return res.status(400).json({ error: 'Missing required fields: provider, model, messages' });
    }

    let apiResponse;

    switch (provider) {
      case 'ollama':
        apiResponse = await handleOllama(model, messages, temperature, max_tokens);
        break;

      case 'gemini':
        apiResponse = await handleGemini(model, messages, temperature, max_tokens, enableWebSearch, image, imageMimeType);
        break;

      case 'openai':
        apiResponse = await handleOpenAI(model, messages, temperature, max_tokens, image, imageMimeType);
        break;

      default:
        return res.status(400).json({ error: `Unsupported provider: ${provider}` });
    }

    return res.status(200).json(apiResponse);

  } catch (error: any) {
    console.error('Unified API error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
}

// Ollama Cloud handler
async function handleOllama(
  model: string,
  messages: any[],
  temperature?: number,
  max_tokens?: number
) {
  const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;
  const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'https://api.ollama.cloud';

  if (!OLLAMA_API_KEY) {
    throw new Error('OLLAMA_API_KEY not configured');
  }

  const response = await fetch(`${OLLAMA_API_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OLLAMA_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 2000,
      stream: false
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama API error (${response.status}): ${errorText}`);
  }

  return await response.json();
}

// Google Gemini handler
async function handleGemini(
  model: string,
  messages: any[],
  temperature?: number,
  max_tokens?: number,
  enableWebSearch?: boolean,
  imageBase64?: string,
  imageMimeType?: string
) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  // Convert messages to Gemini format
  const geminiMessages = messages
    .filter((m: any) => m.role !== 'system')
    .map((m: any) => {
      const parts: any[] = [{ text: m.content }];

      // Add image if provided
      if (imageBase64 && imageMimeType) {
        parts.push({
          inline_data: {
            mime_type: imageMimeType,
            data: imageBase64
          }
        });
      }

      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts
      };
    });

  const systemMessage = messages.find((m: any) => m.role === 'system');

  const requestBody: any = {
    contents: geminiMessages,
    generationConfig: {
      temperature: temperature || 0.7,
      topP: 0.95,
      maxOutputTokens: max_tokens || 2000
    }
  };

  // Add system instruction if present
  if (systemMessage) {
    requestBody.systemInstruction = {
      parts: [{ text: systemMessage.content }]
    };
  }

  // Add web search tool if enabled
  if (enableWebSearch) {
    requestBody.tools = [{ googleSearch: {} }];
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  // Extract content
  const content = data.candidates?.[0]?.content?.parts
    ?.map((part: any) => part.text)
    ?.join('') || '';

  // Extract grounding sources if web search was used
  const sources = data.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  // Return in OpenAI-compatible format
  return {
    choices: [
      {
        message: {
          role: 'assistant',
          content
        },
        finish_reason: 'stop',
        index: 0
      }
    ],
    content, // Also include direct content field
    sources, // Include grounding sources
    model,
    usage: {
      prompt_tokens: data.usageMetadata?.promptTokenCount || 0,
      completion_tokens: data.usageMetadata?.candidatesTokenCount || 0,
      total_tokens: data.usageMetadata?.totalTokenCount || 0
    }
  };
}

// OpenAI GPT-4o handler
async function handleOpenAI(
  model: string,
  messages: any[],
  temperature?: number,
  max_tokens?: number,
  imageBase64?: string,
  imageMimeType?: string
) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  // Convert messages for vision if image is provided
  let processedMessages = messages;
  if (imageBase64 && imageMimeType) {
    processedMessages = messages.map((m: any) => {
      if (m.role === 'user' && m.image) {
        return {
          role: 'user',
          content: [
            { type: 'text', text: m.content },
            {
              type: 'image_url',
              image_url: {
                url: `data:${imageMimeType};base64,${imageBase64}`
              }
            }
          ]
        };
      }
      return m;
    });
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages: processedMessages,
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 2000
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  // Add content field for consistency
  return {
    ...data,
    content: data.choices?.[0]?.message?.content || ''
  };
}
