# API Keys Setup Guide

This document explains how to configure API keys for all supported AI services in the AI Christianity Platform.

## Overview

The platform now supports **3 different AI service providers**:

1. **Ollama Cloud** - Cloud-hosted Ollama models (5 models)
2. **OpenAI** - GPT-4o and GPT-4o-mini models (2 models)
3. **Google Gemini** - Gemini 2.0 Flash model (1 model)
4. **Local Ollama** - Locally hosted models (11 models)

## Quick Setup

Add these lines to your `.env.local` file in the project root:

```bash
# Ollama Cloud API (required for cloud Ollama models)
OLLAMA_API_KEY=your_ollama_api_key_here
OLLAMA_API_URL=https://api.ollama.cloud

# OpenAI API (required for GPT-4o models)
OPENAI_API_KEY=your_openai_api_key_here

# Google Gemini API (required for Gemini models)
GEMINI_API_KEY=your_gemini_api_key_here
```

## Detailed Setup Instructions

### 1. Ollama Cloud API (Already Configured ✅)

**Your current API key:** `a1fa9d11a66540bc96f0e4367b9539ae.W_ogeNGe8qiaPaT70sCzKSND`

This key is already configured and working for these models:
- Llama 3.3 70B Cloud ✅
- Qwen 2.5 72B Cloud ✅
- DeepSeek R1 32B Cloud ✅
- Mistral 7B Cloud ✅
- Llama 3.2 3B Cloud ✅

**No additional setup needed!**

### 2. OpenAI API (For GPT-4o Models)

**Models supported:**
- GPT-4o
- GPT-4o-mini

**How to get your API key:**

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Go to **API Keys** section
4. Click **"Create new secret key"**
5. Copy your API key (starts with `sk-...`)

**Add to `.env.local`:**
```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Restart dev server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

**Pricing:**
- GPT-4o: ~$5 per 1M input tokens, ~$15 per 1M output tokens
- GPT-4o-mini: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens

### 3. Google Gemini API (For Gemini Models)

**Models supported:**
- Gemini 2.0 Flash

**How to get your API key:**

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select or create a Google Cloud project
5. Copy your API key

**Add to `.env.local`:**
```bash
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Restart dev server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

**Pricing:**
- Gemini 2.0 Flash: Free tier available, then pay-as-you-go
- Check [Gemini Pricing](https://ai.google.dev/pricing) for details

### 4. Local Ollama (No API Key Required)

**Models supported:**
- 11 local models including Llama 4 Scout, Llama 3.3, DeepSeek R1, etc.

**Setup:**

1. **Install Ollama:**
   ```bash
   # macOS
   brew install ollama

   # Or download from https://ollama.com
   ```

2. **Start Ollama service:**
   ```bash
   ollama serve
   ```

3. **Download models:**
   ```bash
   ollama pull llama3.3:latest
   ollama pull deepseek-r1:32b
   # etc.
   ```

4. **Models will be available automatically** - no API key needed!

## Complete .env.local Example

```bash
# Ollama Cloud API (Currently Working ✅)
OLLAMA_API_KEY=a1fa9d11a66540bc96f0e4367b9539ae.W_ogeNGe8qiaPaT70sCzKSND
OLLAMA_API_URL=https://api.ollama.cloud

# OpenAI API (Add your key to enable GPT-4o models)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google Gemini API (Add your key to enable Gemini models)
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Model Availability Matrix

| Model | Service | Status | Requires API Key |
|-------|---------|--------|------------------|
| Llama 3.3 70B Cloud | Ollama Cloud | ✅ Working | Yes (configured) |
| Qwen 2.5 72B Cloud | Ollama Cloud | ✅ Working | Yes (configured) |
| DeepSeek R1 32B Cloud | Ollama Cloud | ✅ Working | Yes (configured) |
| Mistral 7B Cloud | Ollama Cloud | ✅ Working | Yes (configured) |
| Llama 3.2 3B Cloud | Ollama Cloud | ✅ Working | Yes (configured) |
| **GPT-4o** | OpenAI | ⚠️ Needs key | **Add OPENAI_API_KEY** |
| **GPT-4o-mini** | OpenAI | ⚠️ Needs key | **Add OPENAI_API_KEY** |
| **Gemini 2.0 Flash** | Google | ⚠️ Needs key | **Add GEMINI_API_KEY** |
| Llama 4 Scout (local) | Local Ollama | ✅ Free | No (local only) |
| + 10 more local models | Local Ollama | ✅ Free | No (local only) |

## Testing Your Setup

### Test Ollama Cloud (Already Working)
1. Open http://localhost:3005/
2. Click "神學研究助手" (Theology Assistant)
3. Select "Llama 3.3 70B Cloud"
4. Ask a question
5. Should receive response ✅

### Test OpenAI (After Adding Key)
1. Add `OPENAI_API_KEY` to `.env.local`
2. Restart dev server
3. Select "OpenAI GPT-4o" model
4. Ask a question
5. Should receive response ✅

### Test Gemini (After Adding Key)
1. Add `GEMINI_API_KEY` to `.env.local`
2. Restart dev server
3. Select "Google Gemini 2.0 Flash" model
4. Ask a question
5. Should receive response ✅

## Error Messages

### "OPENAI_API_KEY is not configured"
**Solution:** Add your OpenAI API key to `.env.local` and restart the dev server.

### "GEMINI_API_KEY is not configured"
**Solution:** Add your Gemini API key to `.env.local` and restart the dev server.

### "OLLAMA_API_KEY is not configured"
**Solution:** This shouldn't happen as it's already configured! Check your `.env.local` file.

## Cost Considerations

| Service | Free Tier | Paid Pricing |
|---------|-----------|--------------|
| **Ollama Cloud** | No | Pay per token (varies by model) |
| **OpenAI** | $5 free credit (new users) | $5-15 per 1M tokens |
| **Google Gemini** | Yes (limited) | Pay per token |
| **Local Ollama** | ✅ **Completely Free** | Free (only electricity cost) |

**Recommendation:** Start with Ollama Cloud (already working) or Local Ollama (free). Add OpenAI/Gemini keys only if you need those specific models.

## Architecture

The application automatically routes requests to the correct API based on model name:

```typescript
// Ollama Cloud models (configured ✅)
'llama3.3:70b' → Ollama Cloud API

// OpenAI models (needs key)
'gpt-4o' → OpenAI API
'gpt-4o-mini' → OpenAI API

// Gemini models (needs key)
'gemini-2.0-flash' → Gemini API

// Local models (no key needed)
'llama4:scout' → Local Ollama (localhost:11434)
```

## Support

**Having issues?**
- Check that your API keys are correct
- Ensure `.env.local` is in the project root
- Restart the dev server after adding keys
- Check browser console (F12) for detailed error messages

**API Key Resources:**
- Ollama Cloud: https://ollama.com
- OpenAI: https://platform.openai.com/
- Google Gemini: https://aistudio.google.com/

---

**Last Updated:** 2025-10-14
**Status:** Ollama Cloud ✅ | OpenAI ⚠️ (needs key) | Gemini ⚠️ (needs key) | Local ✅
