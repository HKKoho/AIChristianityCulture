import React, { useState, useMemo } from 'react';
import Timeline from './components/Timeline';
import Editor from './components/Editor';
import Dialogue from './components/Dialogue';
import MindMap from './components/MindMap';
import { STAGES } from './constants';
import { JourneyStage, TheologicalPerspective, ChatMessage, MindMapData } from './types';
import * as geminiService from './services/geminiService';

const App: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<JourneyStage>(JourneyStage.InitialConcept);
  const [journalEntries, setJournalEntries] = useState<Record<JourneyStage, string>>({
    [JourneyStage.InitialConcept]: '',
    [JourneyStage.CreedContrast]: '',
    [JourneyStage.BiblicalInterpretation]: '',
    [JourneyStage.DoubtPhase]: '',
    [JourneyStage.Revelation]: '',
  });
  const [dialogueHistory, setDialogueHistory] = useState<ChatMessage[]>([]);
  const [currentPerspective, setCurrentPerspective] = useState<TheologicalPerspective>(TheologicalPerspective.Socratic);
  const [mindMapData, setMindMapData] = useState<MindMapData>({ nodes: [], links: [] });
  const [isDialogueLoading, setIsDialogueLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const activeStage = useMemo(() => STAGES.find(s => s.key === currentStage)!, [currentStage]);
  const activeJournalText = journalEntries[currentStage];

  const handleTextChange = (text: string) => {
    setJournalEntries(prev => ({ ...prev, [currentStage]: text }));
  };

  const handleDialogueSubmit = async (message: string) => {
    const userMessage: ChatMessage = { role: 'user', content: message };
    const historyForApi = [...dialogueHistory];
    
    setDialogueHistory(prev => [...prev, userMessage]);
    setIsDialogueLoading(true);

    try {
      const response = await geminiService.getSocraticResponse(historyForApi, currentPerspective, message);
      const modelMessage: ChatMessage = { role: 'model', content: response };
      setDialogueHistory(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error fetching dialogue response:", error);
      const errorMessage: ChatMessage = { role: 'model', content: "抱歉，發生錯誤。" };
      setDialogueHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsDialogueLoading(false);
    }
  };
  
  const handleRefine = async () => {
    if (!activeJournalText) return;
    setIsProcessing(true);
    try {
        const refinedText = await geminiService.getRefinedText(activeJournalText, activeStage.title);
        handleTextChange(refinedText);
    } catch (error) {
        console.error("Error refining text:", error);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleGetCitations = async () => {
      if (!activeJournalText) return;
      setIsProcessing(true);
      try {
          const result = await geminiService.getCitations(activeJournalText);
          handleTextChange(activeJournalText + '\n\n--- Citations ---\n' + result);
      } catch (error) {
          console.error("Error getting citations:", error);
      } finally {
          setIsProcessing(false);
      }
  };
  
  const handleGenerateMindMap = async () => {
    if (!activeJournalText) return;
    setIsProcessing(true);
    try {
        const data = await geminiService.generateMindMapData(activeJournalText);
        setMindMapData(data);
    } catch (error) {
        console.error("Error generating mind map:", error);
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <main className="bg-slate-900 text-slate-200 h-screen w-screen flex flex-col font-sans">
      <header className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex-1"></div>
        <h1 className="text-2xl font-bold text-center">神學家思想路線圖</h1>
        <div className="flex-1 flex justify-end">
          <span className="text-xs text-slate-400">Powered by Gemini AI</span>
        </div>
      </header>
      <div className="flex-grow grid grid-cols-1 md:grid-cols-12 lg:grid-cols-10 gap-0 overflow-hidden">
        <div className="md:col-span-3 lg:col-span-2 overflow-y-auto">
          <Timeline
            stages={STAGES}
            currentStage={currentStage}
            onSelectStage={setCurrentStage}
          />
        </div>
        <div className="md:col-span-9 lg:col-span-8 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
          <div className="overflow-y-auto">
            <Editor
              text={activeJournalText}
              onTextChange={handleTextChange}
              stage={activeStage}
              onRefine={handleRefine}
              onGetCitations={handleGetCitations}
              onGenerateMindMap={handleGenerateMindMap}
              isProcessing={isProcessing}
            />
          </div>
          <div className="grid grid-rows-2 gap-0 overflow-hidden">
            <div className="overflow-y-auto">
                <Dialogue
                    history={dialogueHistory}
                    perspective={currentPerspective}
                    onPerspectiveChange={setCurrentPerspective}
                    onSubmit={handleDialogueSubmit}
                    isLoading={isDialogueLoading}
                />
            </div>
            <div className="overflow-y-auto">
                <MindMap data={mindMapData} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default App;
