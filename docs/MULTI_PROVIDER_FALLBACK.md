# Multi-Provider AI System with Automatic Fallbacks

This application now features an intelligent multi-provider AI system that automatically falls back to alternative providers if the primary one fails. This ensures maximum reliability and uptime.

## Provider Priority Chain

The system tries providers in this order:

1. **Ollama Cloud** (Primary) - `qwen-coder:480b-cloud`
   - Fast and cost-effective
   - Good for most queries

2. **Google Gemini** (Secondary) - `gemini-2.0-flash-exp`
   - Excellent vision capabilities
   - Built-in web search support
   - Better for complex reasoning

3. **OpenAI GPT-4o** (Tertiary) - `gpt-4o`
   - Most reliable fallback
   - Excellent general performance
   - Premium tier backup

## How It Works

### Automatic Failover

When you make a request:

1. System tries **Ollama** first
2. If Ollama fails (API error, timeout, location restriction, etc.), automatically tries **Gemini**
3. If Gemini also fails, falls back to **GPT-4o**
4. Only returns error if ALL providers fail

### Console Logging

The system provides detailed console logs:

```
🔄 Trying ollama (qwen-coder:480b-cloud)...
⚠️ ollama failed: User location is not supported for the API use.
↪️ Falling back to next provider...
🔄 Trying gemini (gemini-2.0-flash-exp)...
✅ gemini succeeded
```

## Feature-Specific Optimizations

### Search (`performSearch`)
- Tries **Gemini first** (has built-in web search with grounding sources)
- Falls back to Ollama, then GPT-4o
- Returns sources when available (Gemini only)

### Image Analysis (`analyzeImage`)
- Tries **Gemini first** (best vision model)
- Falls back to GPT-4o (also excellent vision)
- Finally tries Ollama with `llava:34b` (if available)

### Text Analysis & Chat
- Standard priority: Ollama → Gemini → GPT-4o
- Maintains conversation history across provider switches

## Configuration

### Environment Variables

Required API keys in `.env.local`:

```bash
# Ollama Cloud (Primary)
OLLAMA_API_KEY=your_ollama_api_key_here
OLLAMA_API_URL=https://api.ollama.cloud

# Google Gemini (Secondary)
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI (Tertiary - Fallback)
OPENAI_API_KEY=your_openai_api_key_here
```

**Note:** You don't need ALL keys. The system will skip providers without configured keys.

### Minimum Requirements

For basic functionality:
- **At least ONE provider** must be configured
- Recommended: Configure at least 2 for reliability

### Cost Optimization

If you want to minimize costs:
1. Only configure Ollama (cheapest)
2. Add Gemini as free tier backup
3. Only add GPT-4o if you need maximum reliability

## API Endpoints

### `/api/unified` (Recommended)

Unified endpoint for all providers:

```typescript
POST /api/unified

Body:
{
  "provider": "ollama" | "gemini" | "openai",
  "model": "model-name",
  "messages": [...],
  "temperature": 0.7,
  "max_tokens": 2000,
  "enableWebSearch": true,  // Gemini only
  "image": "base64...",      // For vision
  "imageMimeType": "image/jpeg"
}
```

### `/api/ollama` (Direct)

Direct Ollama endpoint (no fallback):

```typescript
POST /api/ollama

Body:
{
  "model": "qwen-coder:480b-cloud",
  "messages": [...],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

## Services

### `multiProviderChatService.ts`

Main service with automatic fallbacks. Exports:

- `createChatSession(wordLimit)` - Creates chat with fallback support
- `sendChatMessage(chat, message)` - Sends message with auto-retry
- `performSearch(query, context, wordLimit)` - Search with Gemini priority
- `analyzeImage(base64, mimeType, context, wordLimit)` - Vision with fallbacks
- `analyzeText(text, context, wordLimit)` - Text analysis with fallbacks

### Chat Class Methods

```typescript
const chat = createChatSession(100);

// Send message (auto-fallback)
const response = await chat.sendMessageStream({ message: "Hello" });

// Check current provider
console.log(chat.getCurrentProvider());  // "ollama" | "gemini" | "openai"

// Get status
console.log(chat.getProviderStatus());  // "Using ollama (qwen-coder:480b-cloud)"
```

## Components Using Multi-Provider

All these components now have automatic fallback:

1. **AISearch.tsx** - AI-powered search
2. **CulturalExplorer.tsx** - Chat interface
3. **ModelContextProtocol.tsx** - Image/text analysis

## Testing Fallback Behavior

### Test 1: Simulate Ollama Failure

1. Remove `OLLAMA_API_KEY` from `.env.local`
2. Restart dev server
3. Try a search - should automatically use Gemini

### Test 2: Simulate Multiple Failures

1. Set invalid keys for Ollama and Gemini
2. Keep OpenAI key valid
3. Try a search - should fall back to GPT-4o

### Test 3: All Providers Available

1. Configure all three API keys
2. Monitor console logs
3. Should primarily use Ollama (most cost-effective)

## Development

### Local Development

```bash
# Start API proxy server (handles all providers)
npm run dev:api

# Start Vite dev server
npm run dev

# Or run both together
npm run dev:full
```

### Production (Vercel)

Set environment variables in Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add all three provider keys:
   - `OLLAMA_API_KEY`
   - `OLLAMA_API_URL`
   - `GEMINI_API_KEY`
   - `OPENAI_API_KEY`
3. Deploy

## Error Handling

### Provider-Specific Errors

The system handles:
- **Location restrictions** (Gemini: "User location not supported")
- **Rate limits** (automatically switches provider)
- **API timeouts** (tries next provider)
- **Invalid API keys** (skips to next provider)
- **Model not available** (falls back)

### Final Error

If ALL providers fail:
```
Error: All AI providers failed. Last error: [error message]
```

## Provider Comparison

| Feature | Ollama | Gemini | GPT-4o |
|---------|--------|--------|--------|
| **Cost** | Low | Free tier | High |
| **Speed** | Fast | Very Fast | Fast |
| **Vision** | Limited (llava) | Excellent | Excellent |
| **Web Search** | ❌ | ✅ | ❌ |
| **Reliability** | Good | Good | Excellent |
| **Best For** | Text, Code | Search, Vision | Premium backup |

## Provider Selection Logic

```
┌─────────────────┐
│  User Request   │
└────────┬────────┘
         │
         ▼
    ┌────────┐
    │ Ollama │ ◄── Try first (cost-effective)
    └───┬────┘
        │ ❌ Failed
        ▼
    ┌────────┐
    │ Gemini │ ◄── Fallback (web search, vision)
    └───┬────┘
        │ ❌ Failed
        ▼
    ┌─────────┐
    │ GPT-4o  │ ◄── Final fallback (most reliable)
    └───┬─────┘
        │
        ▼
    ┌─────────┐     ┌────────┐
    │ Success │ OR  │ Error  │
    └─────────┘     └────────┘
```

## Monitoring

### Console Indicators

- `🔄` Trying provider
- `✅` Provider succeeded
- `⚠️` Provider failed, falling back
- `↪️` Switching to next provider
- `❌` All providers failed

### Provider Status

Check which provider is being used:

```typescript
import { Chat } from './services/multiProviderChatService';

const chat = new Chat(100);
// ... after sending messages
console.log(chat.getCurrentProvider());  // Current active provider
console.log(chat.getProviderStatus());   // Detailed status
```

## Best Practices

1. **Configure Multiple Providers** - Don't rely on just one
2. **Monitor Logs** - Watch for frequent fallbacks (might indicate API issues)
3. **Set Appropriate Word Limits** - Shorter responses = faster + cheaper
4. **Use Feature-Specific Priority** - System automatically optimizes (e.g., Gemini for search)
5. **Test Regularly** - Ensure all API keys are valid

## Troubleshooting

### Issue: Always using fallback provider

**Solution:** Check primary provider API key and quota

### Issue: "All providers failed"

**Solutions:**
1. Verify at least one API key is valid
2. Check API key quotas/billing
3. Check network connectivity
4. Review console logs for specific errors

### Issue: Slow responses

**Solutions:**
1. Check which provider is being used (console logs)
2. Consider using faster models
3. Reduce `max_tokens` / `wordLimit`

### Issue: No web search sources

**Cause:** Only Gemini supports web search
**Solution:** Ensure `GEMINI_API_KEY` is configured and Gemini is available

---

## Summary

The multi-provider system provides:

✅ **Automatic failover** - No manual intervention needed
✅ **Maximum reliability** - Multiple backup providers
✅ **Cost optimization** - Uses cheapest provider first
✅ **Feature optimization** - Right provider for each task
✅ **Transparent logging** - Clear visibility into what's happening

Your application will now work reliably even if individual providers have issues!
