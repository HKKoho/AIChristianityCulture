# Model Configuration Update Summary

## Updated: 2025-10-14

### Overview
Updated all model lists in the application to accurately reflect:
1. **Ollama Cloud Models** (5 available in your account)
2. **Local Ollama Models** (7 models you have installed)

---

## 1. Ollama Cloud Models (via Proxy)

These 5 models are available in your Ollama Cloud account and accessible via the Vite proxy at `/api/ollama`:

1. **kimi-k2:1t** - 超大參數模型 (1T parameters)
2. **qwen3-coder:480b** - 超大規模編碼模型 (480B parameters)
3. **deepseek-v3.1:671b** - 超大規模模型 (671B parameters)
4. **gpt-oss:120b** - 大型雲端模型 (120B parameters)
5. **gpt-oss:20b** - 平衡效能和速度 (20B parameters)

**Configuration Location:**
- `services/theologyAssistantService.ts:216-222` - OLLAMA_CLOUD_MODELS array

---

## 2. Local Ollama Models (Installed)

These 7 models are installed locally on your machine and accessible via `http://localhost:11434`:

1. **qwen2.5vl:32b** - 中英雙語視覺語言模型 (32 GB) 🎨
2. **llama4:scout** - 最新版本Llama模型 (67 GB)
3. **mistral-small:24b** - 輕量高效模型 (14 GB)
4. **llama3.3:latest** - 高性能通用模型 (42 GB)
5. **llava:34b** - 多模態模型 (20 GB) 🎨
6. **deepseek-r1:32b** - 推理能力強 (19 GB)
7. **llama3.2-vision:latest** - 視覺語言模型 (7.9 GB) 🎨

🎨 = Supports vision/multimodal capabilities

**Configuration Locations:**
- `types.ts:269-315` - SERMON_LLM_MODELS array (for sermon generation)
- `components/TheologyAssistant.tsx:81-127` - LOCAL_OLLAMA_MODELS array (for theology assistant)

---

## 3. Cloud AI Models (API-based)

These models use direct API calls (no local installation required):

### Google Gemini:
- **gemini-2.0-flash** - Latest Google AI model (via direct API)

### OpenAI (via Proxy at `/api/openai`):
- **gpt-4o** - Most advanced OpenAI model
- **gpt-4o-mini** - Lightweight fast version

---

## 4. Files Updated

### types.ts (Sermon Generation Models)
```typescript
export const SERMON_LLM_MODELS: LocalLLMModel[] = [
  // 5 Ollama Cloud Models
  // 7 Local Ollama Models
];
```

### components/TheologyAssistant.tsx (Theology Assistant Models)
```typescript
const CLOUD_AI_MODELS = [...]; // Gemini + OpenAI
const OLLAMA_CLOUD_MODELS = [...]; // 5 cloud models
const LOCAL_OLLAMA_MODELS = [...]; // 7 local models
const LOCAL_LLM_MODELS = [...CLOUD_AI_MODELS, ...OLLAMA_CLOUD_MODELS, ...LOCAL_OLLAMA_MODELS];
```

### services/theologyAssistantService.ts (Model Routing)
```typescript
const OLLAMA_CLOUD_MODELS = [
  'kimi-k2:1t',
  'qwen3-coder:480b',
  'deepseek-v3.1:671b',
  'gpt-oss:120b',
  'gpt-oss:20b'
];
```

---

## 5. API Key Configuration

**Current Setup in `.env.local`:**
```bash
GEMINI_API_KEY=AIzaSyDcN6U-3ferwZqCG-r93GR2kpKpC9U1SA4
OLLAMA_API_KEY=a1fa9d11a66540bc96f0e4367b9539ae.W_ogeNGe8qiaPaT70sCzKSND
OPENAI_API_KEY=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
```

**Security:**
- Gemini API key exposed to frontend (needed for direct API calls - Gemini has CORS support)
- Ollama & OpenAI keys **NOT** exposed to frontend (handled by Vite proxy in `vite.config.ts`)

---

## 6. Model Selection in UI

Users can now select from three categories in the Theology Assistant:

1. **☁️ 雲端 AI 模型** (Gemini / OpenAI) - 3 models
2. **☁️ Ollama Cloud 模型** - 5 models
3. **🖥️ 本地 Ollama 模型** - 7 models

**Total: 15 models available**

---

## 7. Testing Recommendations

### Test Ollama Cloud Models:
```bash
curl -X POST 'http://localhost:3000/api/ollama' \
  -H 'Content-Type: application/json' \
  -d '{"model":"gpt-oss:20b","messages":[{"role":"user","content":"Hello"}],"temperature":0.7,"max_tokens":50}'
```

### Test OpenAI Models:
```bash
curl -X POST 'http://localhost:3000/api/openai' \
  -H 'Content-Type: application/json' \
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}],"temperature":0.7,"max_tokens":50}'
```

### Test Local Ollama Models:
Ensure Ollama is running locally:
```bash
ollama list  # Verify all 7 models are installed
curl http://localhost:11434/api/tags  # Check Ollama service
```

---

## 8. Notes

- All model lists now accurately reflect what's actually available
- Removed non-existent models from the UI
- Model routing in `theologyAssistantService.ts` correctly directs to:
  - Ollama Cloud (via `/api/ollama` proxy) for the 5 cloud models
  - OpenAI (via `/api/openai` proxy) for GPT models
  - Gemini (direct API) for Gemini models
  - Local Ollama (http://localhost:11434) for the 7 local models

---

## 9. Future Considerations

- If you install additional local Ollama models, add them to the LOCAL_OLLAMA_MODELS arrays
- If your Ollama Cloud account gets new models, add them to OLLAMA_CLOUD_MODELS arrays and the routing logic
- Keep the model IDs exactly as they appear in `ollama list` output
