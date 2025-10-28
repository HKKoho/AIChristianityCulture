# 數碼講壇 (Digital Pulpit) - Sermon Generator Status

## ✅ Fully Functional - No Mock Version

The sermon generation feature is **fully operational** with real AI/LLM services. There is **NO mock version** - all engines use actual AI models.

## 🚀 Available AI Engines

### 1. **Google Gemini** (Recommended)
- **Status**: ✅ Fully functional
- **Service**: `services/geminiService.ts`
- **Model**: Gemini 2.5 Flash
- **Features**:
  - AI-generated sermon content with structured JSON output
  - Image generation using Imagen 4.0
  - Speaker headshot generation
  - Audience image generation
  - 5 custom slide background images (stained glass style)
  - Scripture reference validation
  - Customizable AI persona via Admin Panel

- **Requirements**:
  - `GEMINI_API_KEY` in `.env.local`
  - Internet connection

- **Generation Flow**:
  1. Load system prompt config from localStorage
  2. Build persona-based system instruction
  3. Generate sermon script with Gemini 2.5 Flash (structured JSON)
  4. Generate 7 images in parallel (1 speaker + 1 audience + 5 slides)
  5. Assemble final presentation

### 2. **Local LLM** (Ollama Cloud)
- **Status**: ✅ Fully functional
- **Service**: `services/localLLMService.ts`
- **Models Available**:
  - Kimi K2 1T (超大參數模型 - 1T params)
  - Qwen3 Coder 480B (編碼模型 - 480B params)
  - DeepSeek V3.1 671B (推理模型 - 671B params)
  - GPT-OSS 120B (大型模型 - 120B params)
  - GPT-OSS 20B (平衡模型 - 20B params)

- **Features**:
  - Real-time sermon generation via Ollama Cloud API
  - Adjustable temperature (0-1) for creativity control
  - Adjustable top-P (0-1) for response diversity
  - Automatic JSON parsing with fallback
  - Placeholder images from picsum.photos
  - Fallback to default slides if API fails

- **Requirements**:
  - `OLLAMA_API_KEY` in `.env.local`
  - Internet connection
  - Running `dev-api-server.mjs` on port 3001

- **API Endpoint**: `http://localhost:3001/api/chat`
- **Proxy**: Vite proxy forwards `/api/ollama` to dev server

## 🔧 Recent Changes

### ✅ Removed MOCK Button (2025-10-15)
- **Issue**: UI had a "MOCK" button but `AiEngine.MOCK` was not defined in types
- **Resolution**: Removed MOCK button from InputForm.tsx
- **UI Change**: Changed from 3-column grid to 2-column grid for AI engine selection
- **Result**: Clean UI with only functional options (Gemini and Local LLM)

### Previous State (Problematic):
```typescript
// Grid with 3 buttons: Gemini | Local LLM | MOCK
<div className="grid grid-cols-3 gap-2">
  <button>Google Gemini</button>
  <button>Local LLM</button>
  <button>Mock</button>  // ❌ Would error - not implemented
</div>
```

### Current State (Fixed):
```typescript
// Grid with 2 buttons: Gemini | Local LLM
<div className="grid grid-cols-2 gap-2">
  <button>Google Gemini</button>
  <button>Local LLM</button>
</div>
```

## 📊 Service Comparison

| Feature | Google Gemini | Local LLM (Ollama Cloud) |
|---------|--------------|--------------------------|
| Sermon Content | ✅ AI-generated | ✅ AI-generated |
| Images | ✅ Imagen 4.0 | ⚠️ Placeholder (picsum) |
| Scripture Refs | ✅ Validated | ✅ Requested |
| Customization | ✅ Persona config | ✅ Model + params |
| Offline Mode | ❌ No | ❌ No |
| API Cost | 💰 Gemini API | 💰 Ollama Cloud API |
| Speed | 🚀 Fast | 🐢 Slower (large models) |
| Quality | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 🎯 User Journey

1. **Select AI Engine**
   - Click "Google Gemini" or "Local LLM"
   - If Gemini selected but no API key: shows warning
   - If Local LLM selected: shows model configuration panel

2. **Configure Settings** (Local LLM only)
   - Choose from 5 cloud models
   - Adjust creativity (temperature: 0-1)
   - Adjust diversity (top-P: 0-1)

3. **Choose Sermon Basis**
   - Biblical Study (釋經研究)
   - Church History (教會歷史)
   - Systematic Theology (系統神學)

4. **Set Sermon Length**
   - 3 minutes
   - 5 minutes
   - 10 minutes

5. **Enter Content**
   - Topic (主題) - Required
   - Key Points (鑰節或要點) - Optional, up to 5

6. **Generate**
   - Click "生成講道" button
   - Shows loading screen with progress messages
   - Waits for AI generation + image creation
   - Displays final presentation

## 🔄 Generation Process

### Gemini Flow:
```
User Input
  ↓
Load Admin Config (persona settings)
  ↓
Build System Instruction
  ↓
Generate Sermon Script (Gemini 2.5 Flash)
  ↓
Parse JSON Response
  ↓
Generate 7 Images in Parallel (Imagen 4.0)
  ↓
Assemble Presentation
  ↓
Display Result
```

### Local LLM Flow:
```
User Input
  ↓
Build Prompt with Model Settings
  ↓
Call Ollama Cloud API
  ↓
Parse JSON Response (with fallback)
  ↓
Add Placeholder Images
  ↓
Assemble Presentation
  ↓
Display Result
```

## 🛡️ Error Handling

### Gemini Service:
- ❌ No API key → Shows warning, disables button
- ❌ Generation fails → Shows error screen with retry
- ❌ Image generation fails → Uses fallback images
- ❌ JSON parsing fails → Throws error

### Local LLM Service:
- ❌ API call fails → Falls back to default slides
- ❌ JSON parsing fails → Creates structure from plain text
- ❌ Invalid response → Uses fallback presentation
- ⚠️ All errors logged to console

## 📝 Code Locations

| Component | File Path | Purpose |
|-----------|-----------|---------|
| Main App | `/App.tsx` | Orchestrates generation flow |
| Input Form | `/components/InputForm.tsx` | User input UI |
| Gemini Service | `/services/geminiService.ts` | Gemini AI integration |
| Local LLM Service | `/services/localLLMService.ts` | Ollama Cloud integration |
| Result Display | `/components/ResultDisplay.tsx` | Shows generated sermon |
| Loading Screen | `/components/LoadingScreen.tsx` | Progress indicator |
| Types | `/types.ts` | TypeScript interfaces |

## 🧪 Testing

### Test Gemini Engine:
1. Ensure `GEMINI_API_KEY` is set in `.env.local`
2. Navigate to 數碼講壇
3. Select "Google Gemini"
4. Enter topic: "愛的真諦 (1 Corinthians 13)"
5. Click "生成講道"
6. Verify: 5 slides with images, full script, summary

### Test Local LLM Engine:
1. Ensure `OLLAMA_API_KEY` is set in `.env.local`
2. Run `npm run dev:api` (or `npm run dev:full`)
3. Navigate to 數碼講壇
4. Select "Local LLM"
5. Choose model (e.g., GPT-OSS 20B)
6. Enter topic: "撒種的比喻 (Matthew 13)"
7. Click "生成講道"
8. Verify: 5 slides with placeholder images, full script

## 🚨 Common Issues

### Issue: "Google Gemini 無法使用"
- **Cause**: No GEMINI_API_KEY in .env.local
- **Fix**: Add `GEMINI_API_KEY=your_key_here` to .env.local
- **Restart**: Restart dev server

### Issue: "API server not available"
- **Cause**: dev-api-server.mjs not running
- **Fix**: Run `npm run dev:api` in separate terminal
- **Or**: Use `npm run dev:full` to run both servers

### Issue: "Generation failed"
- **Cause**: Network error, invalid API key, or API quota exceeded
- **Fix**: Check console for detailed error
- **Check**: API key validity, internet connection, API quotas

### Issue: Images not loading (Gemini)
- **Cause**: Imagen API quota or network issue
- **Fix**: Check Gemini API console for quotas
- **Fallback**: Use Local LLM with placeholder images

## 📖 API Documentation

### Gemini API:
- **Model**: gemini-2.5-flash
- **Image Model**: imagen-4.0-generate-001
- **Docs**: https://ai.google.dev/gemini-api/docs

### Ollama Cloud API:
- **Endpoint**: https://ollama.com/v1/chat/completions
- **Format**: OpenAI-compatible
- **Docs**: https://ollama.com/docs/api

## 🎓 Admin Panel Integration

The Gemini service integrates with the Admin Panel for persona customization:

**Configurable Settings:**
- Ethics (Balanced, Progressive, Conservative)
- Political Stance (Neutral, Left-leaning, Right-leaning)
- Tone Powerfulness (Gentle, Moderate, Powerful)
- Sentiment (Hopeful, Reflective, Joyful, Serious)
- Empathy Level (High, Moderate, Low)
- Custom Personality Description

**Access**: Click gear icon in header → Configure → Save

## ✨ Future Enhancements

Potential improvements:
1. **Offline Mode**: True local Ollama models without cloud API
2. **Custom Templates**: User-defined sermon structures
3. **Multi-language**: English, Simplified Chinese support
4. **Export Options**: PDF, Word, PowerPoint export
5. **Image Upload**: Custom background images
6. **Voice Preview**: Text-to-speech for sermon preview
7. **Collaboration**: Share and edit with team members

## 📊 Current Status Summary

✅ **Fully Functional**
- No mock/demo version
- Real AI generation
- Production-ready
- Both engines operational

⚠️ **Known Limitations**
- Requires internet connection
- API costs apply
- Image generation quota limits (Gemini)
- Placeholder images only (Local LLM)

🎯 **Recommended Usage**
- **Best Quality**: Use Google Gemini
- **Custom Models**: Use Local LLM
- **No API Key**: Feature unavailable (no offline mode)
