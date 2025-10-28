# Ollama Cloud API Setup Guide

This guide explains how to use **Ollama Cloud API** for AI sermon generation in this application.

## 🌟 What is Ollama Cloud?

Ollama Cloud provides access to powerful large language models through the cloud, without requiring local GPU hardware. The application now supports **5 cloud models**.

## Available Cloud Models

| Model | Size | Best For |
|-------|------|----------|
| **kimi-k2:1t** | 1T params | Ultra-long text processing, complete scripture passages |
| **qwen3-coder:480b** | 480B params | Bilingual Chinese-English sermon content |
| **deepseek-v3.1:671b** | 671B params | Top-tier reasoning, logical theological arguments, deep exegesis |
| **gpt-oss:120b** | 120B params | Complex theological analysis and deep sermon generation |
| **gpt-oss:20b** | 20B params | Fast daily sermon generation |

## Setup Instructions

### Step 1: Get Your Ollama API Key

1. Visit [Ollama](https://ollama.com) and create an account
2. Navigate to your API settings
3. Generate a new API key
4. Copy your API key (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.XXXXXXXXXXXXXXXX`)

### Step 2: Configure Environment Variables

Add the following to your `.env.local` file in the project root:

```bash
# Ollama Cloud API Configuration
OLLAMA_API_KEY=your_api_key_here
OLLAMA_API_URL=https://ollama.com
```

**Example:**
```bash
OLLAMA_API_KEY=a1fa9d11a66540bc96f0e4367b9539ae.W_ogeNGe8qiaPaT70sCzKSND
OLLAMA_API_URL=https://ollama.com
```

### Step 3: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Start again
npm run dev
```

## Usage

### 1. Access the Sermon Generator

1. Open the application at `http://localhost:3000`
2. Click on **"AI講道稿生成"** (AI Sermon Generator)

### 2. Select AI Engine

- Choose **"Local LLM"** as the AI Engine
- This will now use Ollama Cloud API (despite the name "Local")

### 3. Select Cloud Model

In the **"本地 LLM 配置"** (Local LLM Configuration) section:
- Open the **"選擇模型"** (Select Model) dropdown
- Choose any model with the ☁️ cloud icon
- Recommended: **"GPT-OSS 120B Cloud ☁️"** for best results

### 4. Configure Parameters

- **創造性程度** (Temperature): 0.7 (default) - Higher = more creative
- **回答多樣性** (Top-P): 0.9 (default) - Higher = more diverse outputs

### 5. Generate Sermon

1. Enter your sermon **主題** (Topic)
2. Add **鑰節或要點** (Key Points or Scripture)
3. Select **講道基礎** (Sermon Basis):
   - 聖經研究 (Biblical Study)
   - 教會歷史 (Church History)
   - 系統神學 (Systematic Theology)
4. Choose **講道時長** (Sermon Length): 3, 5, or 10 minutes
5. Click **"生成講道"** (Generate Sermon)

## Testing the Connection

### Manual Test

You can verify your Ollama Cloud connection by generating a simple sermon:

1. **Topic:** "上帝的愛" (God's Love)
2. **Key Point:** "約翰福音 3:16" (John 3:16)
3. **Basis:** 聖經研究 (Biblical Study)
4. **Length:** 3 minutes
5. **Model:** gpt-oss:120b

If configured correctly, the AI will generate a complete sermon in about 10-30 seconds.

## Architecture Overview

### How It Works

```
User Input (Topic, Points, Basis)
        ↓
   App.tsx (handleGenerate)
        ↓
generateWithLocalLLM() in localLLMService.ts
        ↓
callOllamaCloud() - Direct Fetch API
        ↓
Ollama Cloud API (HTTPS)
        ↓
Cloud Model (e.g., gpt-oss:120b-cloud)
        ↓
Generated Sermon JSON Response
        ↓
Parsed & Displayed to User
```

### Code Structure

**Key Files:**
- `services/localLLMService.ts` - Ollama Cloud API integration using browser-compatible fetch
- `.env.local` - Environment variables (API key, URL)
- `vite.config.ts` - Exposes env vars to frontend
- `types.ts` - Model definitions (SERMON_LLM_MODELS)
- `components/InputForm.tsx` - Model selection UI

### API Call Example

The application uses browser-compatible fetch API to call Ollama Cloud (OpenAI-compatible endpoint):

```typescript
const callOllamaCloud = async (
  model: string,
  prompt: string,
  temperature: number = 0.7
): Promise<string> => {
  const response = await fetch(`${OLLAMA_API_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OLLAMA_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature,
      max_tokens: 4000,
      stream: false
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
};
```

## Troubleshooting

### Error: "OLLAMA_API_KEY is not configured"

**Solution:** Check that `.env.local` exists and contains:
```bash
OLLAMA_API_KEY=your_actual_key
```

Then restart the dev server.

### Error: "Failed to generate with Ollama Cloud"

**Possible Causes:**
1. Invalid API key
2. Network connection issues
3. API rate limits exceeded
4. Model name incorrect

**Solution:**
- Verify API key is correct
- Check internet connection
- Ensure you're using the correct model name (without `-cloud` suffix)
- Review browser console for detailed error messages

### Generation Takes Too Long

**Solution:**
- Use a smaller model like `gpt-oss:20b`
- Reduce sermon length to 3 minutes
- Check your network speed

### Model Not Found

**Solution:**
- Ensure you're selecting models with the ☁️ cloud icon
- Cloud models use standard names (e.g., `gpt-oss:120b`, `kimi-k2:1t`)
- Local models require local Ollama installation

## Cost Considerations

Ollama Cloud operates on a usage-based pricing model:
- Charged per token generated
- Larger models cost more per token
- Check [Ollama Pricing](https://ollama.com/pricing) for current rates

**Tips to Save Costs:**
- Use `gpt-oss:20b` for quick drafts
- Reserve `deepseek-v3.1:671b` for final, polished sermons
- Keep sermon length to 3-5 minutes when testing

## Comparison: Cloud vs Local Models

| Feature | Cloud Models ☁️ | Local Models 🖥️ |
|---------|----------------|------------------|
| **Hardware** | No GPU needed | Requires GPU (24GB+ VRAM) |
| **Setup** | Just API key | Install Ollama + download models |
| **Speed** | Fast | Depends on GPU |
| **Cost** | Pay per use | Free (electricity only) |
| **Privacy** | Data sent to cloud | 100% local |
| **Model Size** | Up to 1T params | Limited by VRAM (~70B max) |

## Support

**Issue with API key?**
- Email: support@ollama.com
- Discord: https://discord.gg/ollama

**Issue with this app?**
- Check GitHub Issues
- Review console logs (F12 in browser)

## Next Steps

1. ✅ Configure `.env.local` with API key
2. ✅ Restart dev server
3. ✅ Select "Local LLM" engine
4. ✅ Choose a cloud model (☁️)
5. ✅ Generate your first sermon!

---

**Note:** The application will automatically use Ollama Cloud API when:
1. "Local LLM" engine is selected
2. A cloud model is chosen (those shown in the Ollama Cloud list)
3. `OLLAMA_API_KEY` is configured in `.env.local`

Happy preaching! 🙏📖
