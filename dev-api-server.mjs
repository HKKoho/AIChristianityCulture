/**
 * Local Development API Server
 * Runs the /api/chat endpoint locally on port 3001
 */

import { createServer } from 'http';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
const envPath = join(__dirname, '.env.local');
try {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = value;
    }
  });
  console.log('✓ Loaded environment variables from .env.local');
} catch (error) {
  console.warn('⚠ Could not load .env.local file');
}

const PORT = 3001;

const server = createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle /api/chat, /api/ollama, and /api/unified endpoints
  if (req.url !== '/api/chat' && req.url !== '/api/ollama' && req.url !== '/api/unified') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  // Parse request body
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      // Handle /api/ollama endpoint (direct Ollama calls)
      if (req.url === '/api/ollama') {
        const { model, messages, temperature, max_tokens, stream } = JSON.parse(body);

        if (!model || !messages) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing required fields: model and messages' }));
          return;
        }

        const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;
        const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'https://api.ollama.cloud';

        if (!OLLAMA_API_KEY) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'OLLAMA_API_KEY not configured' }));
          return;
        }

        const apiUrl = `${OLLAMA_API_URL}/v1/chat/completions`;

        console.log(`→ Calling Ollama Cloud API (model: ${model})...`);
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
          console.error(`✗ Ollama API error (${response.status}):`, errorText);
          res.writeHead(response.status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: `Ollama API error (${response.status}): ${errorText}`
          }));
          return;
        }

        const data = await response.json();
        console.log(`✓ Ollama API response received`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
        return;
      }

      // Handle /api/unified endpoint (multi-provider with unified response)
      if (req.url === '/api/unified') {
        const { provider, model, messages, temperature, max_tokens, enableWebSearch, image, imageMimeType } = JSON.parse(body);

        if (!provider || !model || !messages) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing required fields: provider, model, messages' }));
          return;
        }

        let apiResponse;

        try {
          switch (provider) {
            case 'ollama':
              apiResponse = await handleOllamaUnified(model, messages, temperature, max_tokens);
              break;

            case 'gemini':
              apiResponse = await handleGeminiUnified(model, messages, temperature, max_tokens, enableWebSearch, image, imageMimeType);
              break;

            case 'openai':
              apiResponse = await handleOpenAIUnified(model, messages, temperature, max_tokens, image, imageMimeType);
              break;

            default:
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: `Unsupported provider: ${provider}` }));
              return;
          }

          console.log(`✓ ${provider} API response received via unified endpoint`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(apiResponse));
          return;

        } catch (error) {
          console.error(`✗ ${provider} unified API error:`, error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
          return;
        }
      }

      // Handle /api/chat endpoint (multi-provider)
      const { provider, model, messages, temperature, topP, maxTokens } = JSON.parse(body);

      let apiUrl;
      let headers;
      let requestBody;

      switch (provider) {
        case 'ollama':
          apiUrl = `${process.env.OLLAMA_API_URL || 'https://api.ollama.cloud'}/v1/chat/completions`;
          headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}`
          };
          requestBody = {
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
          requestBody = {
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
            .filter(m => m.role !== 'system')
            .map(m => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }]
            }));

          const systemMessage = messages.find(m => m.role === 'system');

          apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
          headers = {
            'Content-Type': 'application/json'
          };
          requestBody = {
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
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid provider' }));
          return;
      }

      // Make the API request
      console.log(`→ Calling ${provider} API (model: ${model})...`);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`✗ ${provider} API error (${response.status}):`, errorText);
        res.writeHead(response.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: `API error (${response.status}): ${errorText}`
        }));
        return;
      }

      const data = await response.json();

      // Normalize response format
      let content;
      if (provider === 'gemini') {
        content = data.candidates?.[0]?.content?.parts
          ?.map(part => part.text)
          ?.join('') || '';
      } else {
        content = data.choices?.[0]?.message?.content || '';
      }

      console.log(`✓ ${provider} API response received (${content.length} chars)`);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        content,
        model,
        provider,
        usage: data.usage
      }));

    } catch (error) {
      console.error('✗ Proxy error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: error.message || 'Internal server error'
      }));
    }
  });
});

// Handler functions for unified API endpoint
async function handleOllamaUnified(model, messages, temperature, max_tokens) {
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

async function handleGeminiUnified(model, messages, temperature, max_tokens, enableWebSearch, imageBase64, imageMimeType) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  // Convert messages to Gemini format
  const geminiMessages = messages
    .filter(m => m.role !== 'system')
    .map(m => {
      const parts = [{ text: m.content }];

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

  const systemMessage = messages.find(m => m.role === 'system');

  const requestBody = {
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
    ?.map(part => part.text)
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
    content,
    sources,
    model,
    usage: {
      prompt_tokens: data.usageMetadata?.promptTokenCount || 0,
      completion_tokens: data.usageMetadata?.candidatesTokenCount || 0,
      total_tokens: data.usageMetadata?.totalTokenCount || 0
    }
  };
}

async function handleOpenAIUnified(model, messages, temperature, max_tokens, imageBase64, imageMimeType) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  // Convert messages for vision if image is provided
  let processedMessages = messages;
  if (imageBase64 && imageMimeType) {
    processedMessages = messages.map(m => {
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

server.listen(PORT, () => {
  console.log('\n🚀 Local API Server Running');
  console.log(`   http://localhost:${PORT}/api/chat\n`);
  console.log('Available API Keys:');
  console.log(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✓ Set' : '✗ Not set'}`);
  console.log(`   OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '✓ Set' : '✗ Not set'}`);
  console.log(`   OLLAMA_API_KEY: ${process.env.OLLAMA_API_KEY ? '✓ Set' : '✗ Not set'}\n`);
});
