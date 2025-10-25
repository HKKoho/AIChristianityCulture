/**
 * API Proxy for Ollama Cloud
 * This endpoint proxies requests to Ollama Cloud API to avoid CORS issues
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
    const { model, messages, temperature, max_tokens, stream } = req.body;

    if (!model || !messages) {
      return res.status(400).json({ error: 'Missing required fields: model and messages' });
    }

    // Get API credentials from environment
    const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;
    const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'https://api.ollama.cloud';

    if (!OLLAMA_API_KEY) {
      return res.status(500).json({ error: 'OLLAMA_API_KEY not configured on server' });
    }

    // Call Ollama Cloud API (OpenAI-compatible endpoint)
    const apiUrl = `${OLLAMA_API_URL}/v1/chat/completions`;

    const response = await fetch(apiUrl, {
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
        stream: stream || false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama API error:', errorText);
      return res.status(response.status).json({
        error: `Ollama API error (${response.status}): ${errorText}`
      });
    }

    const data = await response.json();

    // Return OpenAI-compatible response format
    return res.status(200).json(data);

  } catch (error: any) {
    console.error('Ollama proxy error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
}
