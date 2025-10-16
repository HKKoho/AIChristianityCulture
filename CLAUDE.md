# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI-powered Christian sermon generator built with React, TypeScript, and Vite. The application generates complete sermons with presentation slides, visual materials, and speaker notes based on user-specified topics, theological foundations, and key points.

**Chinese Name:** AI講道稿生成 (AI Sermon Generator)

## Development Commands

### Running the Application
```bash
npm run dev        # Start dev server on http://0.0.0.0:3000
npm run build      # Build for production
npm run preview    # Preview production build
```

### Environment Setup
- Create `.env.local` file in the root directory
- Set `GEMINI_API_KEY` environment variable to your Google Gemini API key
- The app will fall back to mock AI mode if no API key is provided

## Architecture

### State Management
The application uses a state machine pattern with `AppState` enum to manage UI flow:
- `INPUT` - Initial form for sermon parameters
- `LOADING` - Shows loading screen during generation
- `RESULT` - Displays generated sermon presentation
- `ERROR` - Error state with retry option
- `SAVED` - View saved presentations from localStorage
- `ADMIN` - Admin panel for configuring AI persona settings

All state is managed in `App.tsx` with React hooks - there is no external state management library.

### AI Engine Architecture
The app supports two AI engines (see `AiEngine` enum in `types.ts`):
1. **Gemini** (`services/geminiService.ts`) - Uses Google's Gemini AI API with Imagen for image generation
2. **Mock** (`services/mockAiService.ts`) - Simulated AI for development/testing without API key

Both engines implement the same interface: `generatePresentation(topic, keyPoints, sermonBasis, sermonLength, setLoadingMessage)` returning a `GeneratedPresentation` object.

### Sermon Generation Pipeline (Gemini Service)
The generation process in `geminiService.ts` follows these steps:
1. **Load persona config** from localStorage (see SystemPromptConfig in types.ts)
2. **Generate sermon script** - Uses Gemini 2.5 Flash with structured JSON output schema
   - Includes system instruction for AI persona if enabled
   - Returns 5-part presentation structure with speaker notes and talking points
   - Must include scripture references throughout
3. **Generate images in parallel** - Uses Imagen 4.0 for:
   - Speaker headshot
   - Audience/congregation scene
   - 5 slide background images (stained glass art style)
4. **Assemble presentation** - Combines all generated content into final structure

### Data Models
Key types defined in `types.ts`:
- `SlideContent` - Title, talking points, speaker notes, image prompt
- `GeneratedSlide` - Extends SlideContent with generated backgroundUrl
- `GeneratedPresentation` - Complete sermon with slides, images, script, summary
- `SavedPresentation` - Extends GeneratedPresentation with id, topic, savedAt
- `SystemPromptConfig` - AI persona configuration (ethics, political stance, tone, empathy)
- `SermonBasis` - Theological foundation: Biblical Study, Church History, or Systematic Theology
- `SermonLength` - Duration in minutes: 3, 5, or 10

### Component Structure
All components are in `components/` directory:
- `Header.tsx` - App header with AI engine indicator and admin button
- `InputForm.tsx` - Main form for topic, key points, basis, length, and engine selection
- `LoadingScreen.tsx` - Animated loading state with progress messages
- `ResultDisplay.tsx` - Displays generated sermon with slides, script, and save functionality
- `SavedPresentations.tsx` - List view of saved sermons from localStorage
- `AdminPanel.tsx` - Configure AI persona settings (SystemPromptConfig)

### Persistence
All data is stored in browser localStorage:
- `ai-insights-presentations` - Array of SavedPresentation objects
- `ai-insights-prompt-config` - SystemPromptConfig object for AI persona

### Environment Variables
Defined in `vite.config.ts`:
- `process.env.API_KEY` - Mapped from `GEMINI_API_KEY` in .env.local
- `process.env.GEMINI_API_KEY` - Also mapped for compatibility

### Styling
The app uses Tailwind CSS classes throughout with a dark theme:
- Background: gray-900
- Text: gray-100/300
- Accent: indigo-600/700

## Key Technical Details

### Structured Output
The Gemini service uses a strict JSON schema (`scriptResponseSchema`) to ensure consistent output format with required fields for summary, slides array, and fullScript.

### Scripture References
A critical requirement enforced in prompts: all sermon content must include accurate Biblical scripture references (e.g., "John 3:16", "Romans 8:28") to support theological points.

### Image Generation
Images are generated as base64-encoded JPEGs with 16:9 aspect ratio. Slide backgrounds use "stained glass art style" with reverent, cinematic lighting.

### Sermon Basis Instructions
Each `SermonBasis` type has specific instructions in `geminiService.ts`:
- **Biblical Study**: Exegesis with historical/literary context
- **Church History**: Historical events/figures with modern relevance
- **Systematic Theology**: Clear doctrinal explanations grounded in Scripture

### Path Alias
The project uses `@/` as an alias for the root directory (configured in both `vite.config.ts` and `tsconfig.json`), though it's not heavily utilized in the current codebase.
