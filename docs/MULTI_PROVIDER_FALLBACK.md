# Multi-Provider AI System with Automatic Fallback

## Overview

This AI Theology application now features an intelligent multi-provider AI system with automatic failover across **four** AI providers. If one provider fails (API error, location restriction, timeout), the system automatically tries the next one in the priority chain.

## Provider Priority Chain

The system follows this priority order:

1. **🥇 Primary: Ollama Cloud - Kimi K2 1T**
   - Model: `kimi-k2:1t-cloud`
   - Best for: Deep theological analysis with massive parameter count
   - Ultra-large model with superior understanding and generation

2. **🥈 Secondary: Ollama Cloud - Qwen Coder 480B**
   - Model: `qwen-coder:480b-cloud`
   - Best for: Structured sermon content generation
   - Excellent at creating organized, well-formatted output

3. **🥉 Tertiary: Google Gemini 2.0 Flash**
   - Model: `gemini-2.0-flash-exp`
   - Best for: Web search with grounding sources
   - Only provider with built-in web search capability

4. **4️⃣ Quaternary: OpenAI GPT-4o**
   - Model: `gpt-4o`
   - Best for: Reliable fallback with strong general capabilities
   - Final safety net when all other providers fail

## Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                       Application Layer                      │
│                     (React Components)                       │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│          Multi-Provider Chat Service                        │
│      (services/multiProviderChatService.ts)                 │
│  • Automatic failover logic                                 │
│  • Conversation continuity                                  │
│  • Feature-optimized routing                                │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Unified API Layer                              │
│              (api/unified.ts)                               │
│  • Provider abstraction                                     │
│  • Response normalization                                   │
│  • Error handling                                           │
└───────┬──────────┬──────────┬─────────────────────────────┘
        │          │          │
   ┌────▼───┐ ┌───▼────┐ ┌───▼────┐
   │ Ollama │ │ Gemini │ │ OpenAI │
   │  API   │ │  API   │ │  API   │
   └────────┘ └────────┘ └────────┘
```

### File Structure

```
/api
  ├── ollama.ts          # Direct Ollama API proxy
  └── unified.ts         # Multi-provider unified API with fallback

/services
  ├── ollamaChatService.ts           # Ollama-specific chat service
  └── multiProviderChatService.ts    # Main multi-provider service

/types.ts                # Type definitions
  ├── LocalLLMConfig     # LLM configuration interface
  ├── AIProvider         # Provider enum
  └── SERMON_LLM_MODELS  # Available models list

/dev-api-server.mjs      # Development proxy server
  ├── /api/chat          # Single provider endpoint
  ├── /api/unified/chat  # Multi-provider with fallback
  └── /api/ollama/chat   # Ollama-specific endpoint
```

## Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# Ollama Cloud (Primary & Secondary)
OLLAMA_API_KEY=your_ollama_api_key
OLLAMA_API_URL=https://api.ollama.cloud

# Google Gemini (Tertiary)
GEMINI_API_KEY=your_gemini_api_key

# OpenAI (Quaternary)
OPENAI_API_KEY=your_openai_api_key
```

**Minimum requirement:** At least **ONE** provider API key must be configured.

### Model Configuration

Default models are defined in `types.ts`:

```typescript
export const DEFAULT_LOCAL_LLM_CONFIG: LocalLLMConfig = {
  model: 'kimi-k2:1t-cloud',  // Primary model
  temperature: 0.7,
  topP: 0.9
};
```

## Usage Examples

### Basic Chat with Automatic Fallback

```typescript
import { Chat } from './services/multiProviderChatService';

const chat = new Chat(
  'You are a helpful theology assistant.',
  { temperature: 0.7, topP: 0.9 }
);

const response = await chat.sendMessage('Explain the Trinity.');
console.log(response);  // Automatically uses best available provider
```

### Web Search (Prioritizes Gemini)

```typescript
import { performSearch } from './services/multiProviderChatService';

const result = await performSearch(
  'Latest developments in theological education',
  { maxLength: 500 }
);

console.log(result.text);
console.log(result.sources);  // Grounding sources (if Gemini was used)
console.log(result.provider);  // 'gemini', 'ollama', or 'openai'
```

### Text Analysis

```typescript
import { analyzeText } from './services/multiProviderChatService';

const result = await analyzeText(
  'Analyze the theological themes in Romans 8',
  {
    temperature: 0.5,
    systemInstruction: 'You are a biblical scholar.'
  }
);

console.log(result.text);
console.log(`Used provider: ${result.provider}`);
```

### Image Analysis

```typescript
import { analyzeImage } from './services/multiProviderChatService';

const result = await analyzeImage(
  imageBase64String,
  'Describe the theological symbolism in this artwork',
  { temperature: 0.6 }
);

console.log(result.text);
```

## API Endpoints

### Development Server

Start the development API server:

```bash
node dev-api-server.mjs
```

The server runs on `http://localhost:3001` with three endpoints:

#### 1. Single Provider (`/api/chat`)

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "ollama",
    "model": "kimi-k2:1t-cloud",
    "messages": [
      {"role": "user", "content": "Hello"}
    ],
    "temperature": 0.7,
    "topP": 0.9
  }'
```

#### 2. Multi-Provider with Fallback (`/api/unified/chat`)

```bash
curl -X POST http://localhost:3001/api/unified/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Explain justification by faith"}
    ],
    "temperature": 0.7,
    "topP": 0.9,
    "maxTokens": 4096
  }'
```

**Response:**
```json
{
  "content": "Justification by faith is...",
  "provider": "ollama",
  "model": "kimi-k2:1t-cloud",
  "usage": {
    "promptTokens": 15,
    "completionTokens": 324,
    "totalTokens": 339
  }
}
```

#### 3. Ollama-Specific (`/api/ollama/chat`)

```bash
curl -X POST http://localhost:3001/api/ollama/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen-coder:480b-cloud",
    "messages": [
      {"role": "user", "content": "Generate a sermon outline"}
    ]
  }'
```

## Failover Behavior

### Scenario 1: All Providers Available

```
User Request
    ↓
Try Ollama (kimi-k2:1t-cloud)
    ✅ Success
    ↓
Return Response
```

### Scenario 2: Primary Provider Fails

```
User Request
    ↓
Try Ollama (kimi-k2:1t-cloud)
    ❌ Failed (API Error)
    ↓
Try Ollama (qwen-coder:480b-cloud)
    ✅ Success
    ↓
Return Response
```

### Scenario 3: Ollama Unavailable

```
User Request
    ↓
Try Ollama (kimi-k2:1t-cloud)
    ❌ Failed (No API Key)
    ↓
Try Ollama (qwen-coder:480b-cloud)
    ❌ Failed (No API Key)
    ↓
Try Gemini (gemini-2.0-flash-exp)
    ✅ Success
    ↓
Return Response
```

### Scenario 4: All Providers Fail

```
User Request
    ↓
Try all providers...
    ❌ All Failed
    ↓
Throw Error with details:
  - Ollama (kimi-k2:1t-cloud): Connection timeout
  - Ollama (qwen-coder:480b-cloud): Connection timeout
  - Gemini: API quota exceeded
  - OpenAI: Invalid API key
```

## Error Handling

The system provides detailed error information:

```typescript
try {
  const response = await chat.sendMessage('Hello');
} catch (error) {
  console.error('All providers failed:');
  console.error(error.message);
  // Output:
  // All AI providers failed:
  // ollama (kimi-k2:1t-cloud): Connection timeout
  // ollama (qwen-coder:480b-cloud): Connection timeout
  // gemini: API quota exceeded
  // openai: Invalid API key
}
```

## Console Logging

The system provides transparent logging for debugging:

```
🔄 Trying Ollama with kimi-k2:1t-cloud...
✅ Success with Ollama (kimi-k2:1t-cloud)

// Or on failure:
🔄 Trying Ollama with kimi-k2:1t-cloud...
⚠️ Ollama (kimi-k2:1t-cloud) failed: Connection timeout
↪️ Falling back to Ollama (qwen-coder:480b-cloud)
🔄 Trying Ollama with qwen-coder:480b-cloud...
✅ Success with Ollama (qwen-coder:480b-cloud)
```

## Feature-Optimized Routing

Different features use different provider priorities:

### Standard Chat & Text Analysis
**Priority:** Ollama → Gemini → OpenAI
- Cost-effective with Ollama first
- Leverages massive parameter counts

### Web Search
**Priority:** Gemini → Ollama → OpenAI
- Gemini has built-in web search with sources
- Returns grounding metadata

### Image Analysis (Vision)
**Priority:** Gemini → OpenAI → Ollama (llava:34b)
- Gemini has best vision capabilities
- OpenAI GPT-4o as strong second option
- Ollama llava:34b as local fallback

## Testing the System

### Check Provider Availability

```typescript
import { checkAvailableProviders } from './services/multiProviderChatService';

const providers = await checkAvailableProviders();
console.log(providers);
// { ollama: true, gemini: true, openai: false }
```

### Get Detailed Provider Status

```typescript
import { getProviderStatus } from './services/multiProviderChatService';

const status = await getProviderStatus();
console.log(status);
/*
{
  primary: { name: 'Ollama (Kimi K2)', available: true, model: 'kimi-k2:1t-cloud' },
  secondary: { name: 'Ollama (Qwen Coder)', available: true, model: 'qwen-coder:480b-cloud' },
  tertiary: { name: 'Google Gemini', available: true, model: 'gemini-2.0-flash-exp' },
  quaternary: { name: 'OpenAI GPT-4o', available: false, model: 'gpt-4o' }
}
*/
```

## Best Practices

### 1. Configure Multiple Providers

For maximum reliability, configure **at least 2-3 providers**:

```bash
OLLAMA_API_KEY=...
GEMINI_API_KEY=...
# OpenAI optional but recommended for critical applications
OPENAI_API_KEY=...
```

### 2. Use Feature-Optimized Functions

- For web search → Use `performSearch()` (prioritizes Gemini)
- For vision tasks → Use `analyzeImage()` (prioritizes Gemini/GPT-4o)
- For general chat → Use `Chat` class (prioritizes Ollama)

### 3. Monitor Console Logs

Enable console logging in development to see which providers are being used:

```typescript
// Console will show:
// 🔄 Trying Ollama with kimi-k2:1t-cloud...
// ✅ Success with Ollama (kimi-k2:1t-cloud)
```

### 4. Handle Errors Gracefully

Always wrap AI calls in try-catch blocks:

```typescript
try {
  const response = await chat.sendMessage(userInput);
  displayResponse(response);
} catch (error) {
  console.error('AI service unavailable:', error);
  showErrorToUser('服務暫時無法使用，請稍後再試');
}
```

### 5. Optimize Temperature and Top-P

Different tasks need different settings:

```typescript
// Creative content (sermons, prayers)
{ temperature: 0.8, topP: 0.95 }

// Factual analysis (biblical exegesis)
{ temperature: 0.4, topP: 0.85 }

// Structured output (JSON, outlines)
{ temperature: 0.3, topP: 0.8 }
```

## Troubleshooting

### Issue: All providers failing

**Solution:**
1. Check `.env.local` exists and contains API keys
2. Verify API keys are valid and active
3. Check internet connectivity
4. Check API service status pages

### Issue: Slow responses

**Solution:**
1. Primary providers may be slow/unavailable
2. Check console logs to see which provider succeeded
3. Consider setting shorter timeouts
4. Use smaller models for faster responses

### Issue: Inconsistent output quality

**Solution:**
1. Check which provider is being used (console logs)
2. Different providers have different strengths
3. Adjust temperature/topP for consistency
4. Consider forcing a specific provider for critical tasks

## Advanced: Direct Provider Access

If you need to bypass automatic fallback and use a specific provider:

### Ollama Only

```typescript
import { Chat } from './services/ollamaChatService';

const chat = new Chat('kimi-k2:1t-cloud', systemInstruction);
const response = await chat.sendMessage('Hello');
```

### Unified API with Provider Preference

```typescript
import * as UnifiedAPI from './api/unified';

const response = await UnifiedAPI.chat({
  messages: [{ role: 'user', content: 'Hello' }],
  model: 'kimi-k2:1t-cloud',  // Prefer this model
  temperature: 0.7
});
```

## Conclusion

The multi-provider AI system provides:

✅ **Reliability** - Automatic failover ensures uptime
✅ **Cost Optimization** - Uses cheapest providers first
✅ **Feature Optimization** - Routes to best provider per task
✅ **Transparency** - Clear logging of provider usage
✅ **Flexibility** - Easy to add new providers

The system will continue working even if 3 out of 4 providers fail, ensuring maximum availability for your AI theology application.
