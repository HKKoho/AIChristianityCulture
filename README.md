# AI Christianity Platform (AI 基督教信仰平台)

A comprehensive AI-powered Christian platform featuring sermon generation, interactive Bible games, and theological study assistance.

## 🌟 Features

### 📖 AI Sermon Generator (數碼講壇)
- **✅ Fully Functional** - No mock version, real AI generation
- **Dual AI Engines**:
  - Google Gemini 2.5 Flash with Imagen 4.0 image generation
  - Ollama Cloud LLMs (5 models up to 1T parameters)
- **Complete Sermon Creation**: Generate full sermons with presentation slides, speaker notes, and visual materials
- **Customizable Parameters**: Choose from different theological foundations (Biblical Study, Church History, Systematic Theology)
- **Multiple Lengths**: 3, 5, or 10-minute sermon options
- **Visual Generation**: AI-generated speaker headshots, audience scenes, and slide backgrounds (Gemini only)
- **Scripture Integration**: Automatic inclusion of relevant biblical references throughout sermons
- **Save & Export**: Local storage of generated sermons for future reference
- **🎤 Voice Input**: Speech-to-text support for all text input fields

### 🎮 Bible Interactive Game (聖經互動遊戲)
- **Interactive Journey**: Travel through 15 biblical locations across different eras
- **15 Diverse Quests**: Featuring characters from Abraham to the Apostles
- **Progressive Levels**: 5 thematic levels covering faith foundations to church establishment
- **Educational Content**: Deep theological explanations and historical context
- **Journal System**: Personal reflection prompts and spiritual insights
- **Achievement System**: Unlock new locations as you complete quests

### 🎓 Theology Study Assistant (神學研究助手)
- **AI-Powered Chat**: Theological discussions with configurable local LLM models
- **Document Analysis**: Upload and analyze theological texts (PDF, DOCX, TXT, MD)
- **Assignment Helper**: Step-by-step academic assignment creation and refinement
- **Resource Search**: Access to theological literature and scholarly materials
- **Multi-Model Support**: Choose from 11 different local LLM models including:
  - Llama 4 Scout (67GB) - Latest model for complex discussions
  - DeepSeek R1 32B (19GB) - Strong reasoning capabilities
  - QwQ (19GB) - Q&A specialized model
  - Qwen 2.5v1 32B (32GB) - Chinese-English optimized
  - LLaVA 34B (20GB) - Multimodal vision support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key (optional - falls back to mock mode)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AIChristianity
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the project root:

   ```bash
   # Google Gemini API Key (for AI Sermon Generator)
   GEMINI_API_KEY=your_gemini_api_key_here

   # Ollama Cloud API (for cloud-based LLM models)
   OLLAMA_API_KEY=your_ollama_api_key_here
   OLLAMA_API_URL=https://ollama.com
   ```

   **Getting API Keys:**
   - **Gemini**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - **Ollama Cloud**: Visit [Ollama](https://ollama.com) and sign up for cloud access

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000` (or the port shown in terminal)

### Production Build

```bash
npm run build
npm run preview
```

## 🏗️ Technical Architecture

### Frontend Framework
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **Lucide React** for icons

### State Management
- React hooks with centralized state patterns
- Local storage for data persistence
- No external state management library required

### AI Integration
- **Gemini AI**: Primary AI service with structured JSON outputs
- **Imagen 4.0**: Image generation for visual content
- **Ollama Cloud**: Cloud-based LLM access (5 models up to 1T parameters)
- **Local LLM Support**: Integration with Ollama and local models
- **Mock Service**: Development/testing without API requirements

### Data Structure
```typescript
// Core sermon generation types
interface GeneratedPresentation {
  slides: GeneratedSlide[];
  speakerImageUrl: string;
  audienceImageUrl: string;
  fullScript: string;
  summary: string;
}

// Bible game quest system
interface Quest {
  id: string;
  character: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  journalPrompt: JournalPrompt;
  deepDive: DeepDiveContent;
}

// Theology assistant state
interface TheologyAssistantState {
  mode: TheologyAssistantMode;
  messages: ChatMessage[];
  selectedModel: string;
  temperature: number;
  topP: number;
  // ... additional configuration
}
```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── bible/           # Bible game specific components
│   ├── AdminPanel.tsx   # AI persona configuration
│   ├── BibleGame.tsx    # Main Bible game component
│   ├── Header.tsx       # Application header
│   ├── InputForm.tsx    # Sermon input form
│   ├── LandingPage.tsx  # Main landing page
│   ├── LoadingScreen.tsx
│   ├── ResultDisplay.tsx
│   ├── SavedPresentations.tsx
│   └── TheologyAssistant.tsx
├── contexts/            # React contexts
├── data/               # Game data and configurations
│   └── gameData.ts     # Bible quests and locations
├── hooks/              # Custom React hooks
├── services/           # AI service integrations
│   ├── geminiService.ts
│   └── mockAiService.ts
├── types.ts           # TypeScript type definitions
├── App.tsx           # Main application component
└── index.tsx         # Application entry point
```

## 🎯 Key Features in Detail

### Sermon Generation Pipeline
1. **Input Processing**: Topic, key points, theological basis, length
2. **AI Persona Configuration**: Customizable ethics, tone, and personality
3. **Structured Content Generation**: 5-part presentation with speaker notes
4. **Visual Asset Creation**: Parallel image generation for enhanced presentations
5. **Scripture Integration**: Automatic biblical reference inclusion
6. **Export & Storage**: Local persistence with metadata

### Bible Game Progression
1. **Linear Progression**: Unlock locations sequentially through biblical history
2. **Character Interactions**: Meet biblical figures in their historical contexts
3. **Educational Integration**: Deep theological content with scholarly sources
4. **Reflection System**: Journal prompts for personal spiritual growth
5. **Discussion Framework**: Group study questions for each level

### Theology Assistant Modes
1. **AI Chat**: Configurable theological discussions
2. **Document Analysis**: Upload and analyze theological texts
3. **Assignment Helper**: Academic writing assistance with iterative refinement
4. **Resource Search**: Theological literature database access

## 🛠️ Configuration

### AI Model Selection

#### Ollama Cloud Models (Recommended ☁️)
The application now supports powerful cloud-based models without requiring local GPU hardware:

```typescript
const OLLAMA_CLOUD_MODELS = [
  'kimi-k2:1t',          // 1T params - Ultra-long text processing
  'qwen3-coder:480b',    // 480B params - Bilingual Chinese-English
  'deepseek-v3.1:671b',  // 671B params - Top-tier reasoning and exegesis
  'gpt-oss:120b',        // 120B params - Complex theological analysis
  'gpt-oss:20b',         // 20B params - Fast daily sermon generation
];
```

**Usage:**
1. Set `OLLAMA_API_KEY` in `.env.local`
2. Select "Local LLM" as AI engine
3. Choose any model with ☁️ cloud icon
4. Generate sermons using cloud processing

**Benefits:**
- ✅ No GPU required
- ✅ Access to models up to 1T parameters
- ✅ Faster than most local setups
- ✅ Automatic updates to latest models

**See [OLLAMA_CLOUD_SETUP.md](./OLLAMA_CLOUD_SETUP.md) for detailed setup guide.**

#### Local LLM Models (本地模型)
For users who prefer local processing or have local Ollama installed:

```typescript
const LOCAL_LLM_MODELS = [
  'llava:34b',         // 20GB - Multimodal vision support
  'llama4:scout',      // 67GB - Complex discussions
  'llama3.3:latest',   // 42GB - Balanced performance
  'deepseek-r1:32b',   // 19GB - Strong reasoning
  'qwen2.5v1:32b',     // 32GB - Chinese-English optimized
  // ... additional models
];
```

**Requirements:**
- Local Ollama installation
- GPU with 24GB+ VRAM (for larger models)
- Downloaded models via `ollama pull <model-name>`

### Environment Variables
```bash
# Google Gemini AI (for AI Sermon Generator)
GEMINI_API_KEY=your_gemini_api_key

# Ollama Cloud API (for cloud-based LLMs)
OLLAMA_API_KEY=your_ollama_api_key
OLLAMA_API_URL=https://ollama.com

# Optional: Local Ollama endpoint (if not using cloud)
# OLLAMA_API_URL=http://localhost:11434
```

### Model Comparison

| Feature | Ollama Cloud ☁️ | Local Models 🖥️ | Gemini AI 🌐 |
|---------|----------------|------------------|--------------|
| **GPU Required** | ❌ No | ✅ Yes (24GB+) | ❌ No |
| **Setup Complexity** | Easy (API key only) | Medium (install + download) | Easy (API key only) |
| **Max Model Size** | 1T parameters | ~70B parameters | Unknown |
| **Cost** | Pay per use | Free (electricity) | Pay per use |
| **Privacy** | Cloud | 100% Local | Cloud |
| **Speed** | Fast | Depends on GPU | Very Fast |
| **Best For** | Most users | Privacy-conscious | Image generation |

## 🔧 Development

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Tailwind CSS for consistent styling
- Component-based architecture

### Key Development Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Code linting
npm run type-check   # TypeScript checking
```

### Adding New Bible Quests
1. Add quest data to `data/gameData.ts`
2. Create corresponding location entries
3. Update level groupings
4. Test quest flow and dependencies

### Extending AI Services
1. Implement service interface in `services/`
2. Add service selection to UI components
3. Update type definitions as needed
4. Test integration with existing flows

## 📖 Biblical Content

### Quest Coverage
- **Old Testament**: Abraham through Daniel (9 quests)
- **New Testament**: John the Baptist through early church (6 quests)
- **Themes**: Covenant, law, prophecy, wisdom, redemption, church

### Theological Depth
- Scripture references with multiple translations
- Historical context and cultural background
- Cross-references to church history and systematic theology
- Contemporary application and reflection prompts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code patterns and TypeScript conventions
- Add appropriate type definitions for new features
- Include Chinese translations for UI text
- Test thoroughly with both Gemini and mock AI services
- Ensure biblical content accuracy and theological soundness

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for advanced language model capabilities
- **Ollama** for local LLM integration support
- **React Community** for excellent framework and ecosystem
- **Biblical Scholars** whose work informs the theological content
- **Open Source Contributors** who make projects like this possible

## 📞 Support

For questions, suggestions, or theological discussions:
- Create an issue in the GitHub repository
- Refer to the inline documentation in the codebase
- Check the component-level comments for implementation details

---

**Built with ❤️ for the Christian community and theological education**

*"Study to show yourself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth." - 2 Timothy 2:15*
