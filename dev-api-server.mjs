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

  // Only handle /api/chat endpoint
  if (req.url !== '/api/chat') {
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
      const { provider, model, messages, temperature, topP, maxTokens } = JSON.parse(body);

      let apiUrl;
      let headers;
      let requestBody;

      switch (provider) {
        case 'ollama':
          apiUrl = 'https://ollama.com/v1/chat/completions';
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

server.listen(PORT, () => {
  console.log('\n🚀 Local API Server Running');
  console.log(`   http://localhost:${PORT}/api/chat\n`);
  console.log('Available API Keys:');
  console.log(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✓ Set' : '✗ Not set'}`);
  console.log(`   OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '✓ Set' : '✗ Not set'}`);
  console.log(`   OLLAMA_API_KEY: ${process.env.OLLAMA_API_KEY ? '✓ Set' : '✗ Not set'}\n`);
});
