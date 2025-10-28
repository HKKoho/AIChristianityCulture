import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultDisplay } from './components/ResultDisplay';
import { SavedPresentations } from './components/SavedPresentations';
import { AdminPanel } from './components/AdminPanel';
import { LandingPage } from './components/LandingPage';
import { Eat } from './components/Eat';
import { Walk } from './components/Walk';
import { Listen } from './components/Listen';
import { See } from './components/See';
import { ReadContent } from './components/ReadContent';
import { Meditate } from './components/Meditate';
import { generatePresentation as generateWithGemini } from './services/geminiService';
import { generatePresentation as generateWithLocalLLM } from './services/localLLMService';
import type { GeneratedPresentation, SavedPresentation, SystemPromptConfig, SermonBasis, SermonLength, CultureCategory } from './types';
import { AppState, AiEngine, DEFAULT_SYSTEM_PROMPT_CONFIG } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [aiEngine, setAiEngine] = useState<AiEngine>(AiEngine.LOCAL_LLM); // Default to Ollama Local LLM
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedPresentation | SavedPresentation | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [savedPresentations, setSavedPresentations] = useState<SavedPresentation[]>([]);
  const [systemPromptConfig, setSystemPromptConfig] = useState<SystemPromptConfig>(DEFAULT_SYSTEM_PROMPT_CONFIG);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ai-insights-presentations');
      if (saved) {
        setSavedPresentations(JSON.parse(saved));
      }
      const savedConfig = localStorage.getItem('ai-insights-prompt-config');
      if (savedConfig) {
        setSystemPromptConfig(JSON.parse(savedConfig));
      }
    } catch (e) {
      console.error("Failed to load data from local storage", e);
    }
  }, []);

  const handleGenerate = useCallback(async (
    topic: string,
    keyPoints: string[],
    sermonBasis: SermonBasis,
    sermonLength: SermonLength,
    localLLMConfig?: { model: string; temperature: number; topP: number }
  ) => {
    setAppState(AppState.LOADING);
    setError(null);
    setGeneratedContent(null);
    setCurrentTopic(topic);

    try {
      let presentation: GeneratedPresentation;

      if (aiEngine === AiEngine.GEMINI) {
        presentation = await generateWithGemini(topic, keyPoints, sermonBasis, sermonLength, setLoadingMessage);
      } else if (aiEngine === AiEngine.LOCAL_LLM && localLLMConfig) {
        presentation = await generateWithLocalLLM(topic, keyPoints, sermonBasis, sermonLength, setLoadingMessage, localLLMConfig);
      } else {
        throw new Error('Please select an AI engine');
      }

      setGeneratedContent(presentation);
      setAppState(AppState.RESULT);
    } catch (err) {
      console.error('Generation failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`生成失敗。 ${errorMessage}`);
      setAppState(AppState.ERROR);
    }
  }, [aiEngine]);

  const handleReset = () => {
    setAppState(AppState.INPUT);
    setGeneratedContent(null);
    setError(null);
    setCurrentTopic('');
  };

  const handleBackToLanding = () => {
    setAppState(AppState.LANDING);
    setGeneratedContent(null);
    setError(null);
    setCurrentTopic('');
  };

  const handleNavigateFromLanding = (destination: CultureCategory) => {
    switch (destination) {
      case 'love-feast':
        setAppState(AppState.LOVE_FEAST);
        break;
      case 'travel-pilgrim':
        setAppState(AppState.TRAVEL_PILGRIM);
        break;
      case 'bible-manuscripts':
        setAppState(AppState.BIBLE_MANUSCRIPTS);
        break;
      case 'church-aesthetics':
        setAppState(AppState.CHURCH_AESTHETICS);
        break;
      case 'music-hymns':
        setAppState(AppState.MUSIC_HYMNS);
        break;
      case 'soul-spirituality':
        setAppState(AppState.SOUL_SPIRITUALITY);
        break;
    }
  };

  const handleSavePresentation = (updatedContent: GeneratedPresentation) => {
    if (!currentTopic) return;

    const newSave: SavedPresentation = {
      ...updatedContent,
      id: new Date().toISOString(),
      topic: currentTopic,
      savedAt: new Date().toISOString(),
    };

    const updatedSaves = [...savedPresentations, newSave];
    setSavedPresentations(updatedSaves);
    localStorage.setItem('ai-insights-presentations', JSON.stringify(updatedSaves));
    setGeneratedContent(newSave); // Update content to reflect it's now saved
  };

  const handleLoadPresentation = (presentation: SavedPresentation) => {
    setGeneratedContent(presentation);
    setCurrentTopic(presentation.topic);
    setAppState(AppState.RESULT);
  };
  
  const handleDeletePresentation = (id: string) => {
    const updatedSaves = savedPresentations.filter(p => p.id !== id);
    setSavedPresentations(updatedSaves);
    localStorage.setItem('ai-insights-presentations', JSON.stringify(updatedSaves));
  };

  const handleSaveConfig = (config: SystemPromptConfig) => {
    setSystemPromptConfig(config);
    localStorage.setItem('ai-insights-prompt-config', JSON.stringify(config));
    setAppState(AppState.INPUT); // Go back to the main screen after saving
  }

  const renderContent = () => {
    switch (appState) {
      case AppState.LANDING:
        return <LandingPage onNavigate={handleNavigateFromLanding} />;
      case AppState.LOVE_FEAST:
        return <Eat onBack={handleBackToLanding} />;
      case AppState.TRAVEL_PILGRIM:
        return <Walk onBack={handleBackToLanding} />;
      case AppState.MUSIC_HYMNS:
        return <Listen onBack={handleBackToLanding} />;
      case AppState.CHURCH_AESTHETICS:
        return <See onBack={handleBackToLanding} />;
      case AppState.BIBLE_MANUSCRIPTS:
        return <ReadContent onBack={handleBackToLanding} />;
      case AppState.SOUL_SPIRITUALITY:
        return <Meditate onBack={handleBackToLanding} />;
      case AppState.LOADING:
        return <LoadingScreen message={loadingMessage} />;
      case AppState.RESULT:
        return generatedContent && <ResultDisplay presentation={generatedContent} topic={currentTopic} onReset={handleReset} onSave={handleSavePresentation} isSaved={'id' in generatedContent} />;
      case AppState.ERROR:
        return (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-500 mb-4">生成失敗</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors"
            >
              再試一次
            </button>
          </div>
        );
      case AppState.SAVED:
        return <SavedPresentations
                  presentations={savedPresentations}
                  onLoad={handleLoadPresentation}
                  onDelete={handleDeletePresentation}
                  onBack={handleReset}
               />;
      case AppState.ADMIN:
        return <AdminPanel
                  config={systemPromptConfig}
                  onSave={handleSaveConfig}
                  onBack={handleReset}
               />
      case AppState.INPUT:
      default:
        return <InputForm
                  onGenerate={handleGenerate}
                  selectedEngine={aiEngine}
                  onEngineChange={setAiEngine}
                  onShowSaved={() => setAppState(AppState.SAVED)}
                  onBackToLanding={handleBackToLanding}
                  hasSavedPresentations={savedPresentations.length > 0}
               />;
    }
  };

  const showHeader = appState !== AppState.LANDING &&
    appState !== AppState.LOVE_FEAST &&
    appState !== AppState.TRAVEL_PILGRIM &&
    appState !== AppState.BIBLE_MANUSCRIPTS &&
    appState !== AppState.CHURCH_AESTHETICS &&
    appState !== AppState.MUSIC_HYMNS &&
    appState !== AppState.SOUL_SPIRITUALITY;

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {showHeader && <Header aiEngine={aiEngine} onShowAdmin={() => setAppState(AppState.ADMIN)} />}
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;