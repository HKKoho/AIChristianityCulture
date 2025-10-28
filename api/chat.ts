/**
 * API Proxy for Chat Completions
 * This file creates a backend endpoint that proxies requests to various AI services
 * to avoid CORS issues when calling from the browser
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
    const { provider, model, messages, temperature, topP, maxTokens } = req.body;

    let apiUrl: string;
    let headers: Record<string, string>;
    let body: any;

    switch (provider) {
      case 'ollama':
        apiUrl = 'https://ollama.com/v1/chat/completions';
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}`
        };
        body = {
          model,
          messages,
          temperature,
          top_p: topP,
          max_tokens: maxTokens || 2000,
          stream: false
        };
        break;

      case 'openai':
        apiUrl = 'https://api.openai.com/v1/chat/completions';
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        };
        body = {
          model,
          messages,
          temperature,
          top_p: topP,
          max_tokens: maxTokens || 2000
        };
        break;

      case 'gemini':
        // Gemini has different endpoint structure
        const geminiMessages = messages
          .filter((m: any) => m.role !== 'system')
          .map((m: any) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          }));

        const systemMessage = messages.find((m: any) => m.role === 'system');

        apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
        headers = {
          'Content-Type': 'application/json'
        };
        body = {
          contents: geminiMessages,
          systemInstruction: systemMessage ? {
            parts: [{ text: systemMessage.content }]
          } : undefined,
          generationConfig: {
            temperature,
            topP,
            maxOutputTokens: maxTokens || 2000
          }
        };
        break;

      default:
        return res.status(400).json({ error: 'Invalid provider' });
    }

    // Make the API request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `API error (${response.status}): ${errorText}`
      });
    }

    const data = await response.json();

    // Normalize response format
    let content: string;
    if (provider === 'gemini') {
      content = data.candidates?.[0]?.content?.parts
        ?.map((part: any) => part.text)
        ?.join('') || '';
    } else {
      content = data.choices?.[0]?.message?.content || '';
    }

    return res.status(200).json({
      content,
      model,
      provider,
      usage: data.usage
    });

  } catch (error: any) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
}
