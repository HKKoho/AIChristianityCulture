import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  ArrowLeft, MessageCircle, Settings, FileText, Upload,
  Send, Trash2, Save, Edit3, CheckCircle, AlertCircle,
  Book, GraduationCap, Users, Search, Filter, Info
} from 'lucide-react';
import {
  TheologyAssistantMode,
  AssignmentStage,
  AcademicLevel,
  TheologyAssistantState,
  ChatMessage,
  UploadedDocument,
  AssignmentPlan,
  AssignmentDraft,
  AssignmentCritique,
  LocalLLMModel
} from '../types';
import SpeechInput from './SpeechInput';

interface TheologyAssistantProps {
  onBack: () => void;
}

// Cloud AI Models (API-based)
const CLOUD_AI_MODELS: LocalLLMModel[] = [
  {
    id: 'gemini-2.0-flash',
    name: 'Google Gemini 2.0 Flash',
    size: 'Cloud',
    description: '最新的Google AI模型，多模態支援，快速回應'
  },
  {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o',
    size: 'Cloud',
    description: 'OpenAI最先進模型，卓越的理解和生成能力'
  },
  {
    id: 'gpt-4o-mini',
    name: 'OpenAI GPT-4o Mini',
    size: 'Cloud',
    description: '輕量快速版本，性價比高'
  }
];

// Ollama Cloud Models (actual available models in your account)
const OLLAMA_CLOUD_MODELS: LocalLLMModel[] = [
  {
    id: 'kimi-k2:1t',
    name: 'Kimi K2 1T Cloud',
    size: 'Cloud (1T)',
    description: '超大參數模型，極致的理解和生成能力'
  },
  {
    id: 'qwen3-coder:480b',
    name: 'Qwen3 Coder 480B Cloud',
    size: 'Cloud (480B)',
    description: '超大規模編碼模型，適合結構化內容生成'
  },
  {
    id: 'deepseek-v3.1:671b',
    name: 'DeepSeek V3.1 671B Cloud',
    size: 'Cloud (671B)',
    description: '超大規模模型，頂級推理能力，適合高難度神學論證'
  },
  {
    id: 'gpt-oss:120b',
    name: 'GPT-OSS 120B Cloud',
    size: 'Cloud (120B)',
    description: '大型雲端模型，適合複雜的神學分析'
  },
  {
    id: 'gpt-oss:20b',
    name: 'GPT-OSS 20B Cloud',
    size: 'Cloud (20B)',
    description: '平衡效能和速度，適合一般神學討論和問答'
  }
];

// Local Ollama Models (locally installed - only models you actually have)
const LOCAL_OLLAMA_MODELS: LocalLLMModel[] = [
  {
    id: 'qwen2.5vl:32b',
    name: 'Qwen 2.5 VL 32B',
    size: '32 GB',
    description: '中英雙語視覺語言模型，適合繁體中文神學討論',
    hasVision: true
  },
  {
    id: 'llama4:scout',
    name: 'Llama 4 Scout',
    size: '67 GB',
    description: '最新版本的Llama模型，適合複雜的神學討論和分析'
  },
  {
    id: 'mistral-small:24b',
    name: 'Mistral Small 24B',
    size: '14 GB',
    description: '輕量高效的模型，快速回應神學問題'
  },
  {
    id: 'llama3.3:latest',
    name: 'Llama 3.3',
    size: '42 GB',
    description: '高性能的通用語言模型，平衡效率與質量'
  },
  {
    id: 'llava:34b',
    name: 'LLaVA 34B',
    size: '20 GB',
    description: '多模態模型，支援圖像和文字的神學資料分析',
    hasVision: true
  },
  {
    id: 'deepseek-r1:32b',
    name: 'DeepSeek R1 32B',
    size: '19 GB',
    description: '推理能力強的模型，適合深度神學分析'
  },
  {
    id: 'llama3.2-vision:latest',
    name: 'Llama 3.2 Vision',
    size: '7.9 GB',
    description: '視覺語言模型，可分析聖經插圖和神學圖表',
    hasVision: true
  }
];

// Combined list for backward compatibility
const LOCAL_LLM_MODELS = [...CLOUD_AI_MODELS, ...OLLAMA_CLOUD_MODELS, ...LOCAL_OLLAMA_MODELS];

const INITIAL_STATE: TheologyAssistantState = {
  mode: TheologyAssistantMode.THEOLOGY_CHAT,
  messages: [],
  documents: [],
  assignmentTopic: '',
  theologyArea: '',
  academicLevel: AcademicLevel.UNDERGRADUATE,
  assignmentLength: 1500,
  assignmentTone: 'academic',
  assignmentStage: AssignmentStage.INPUT,
  revisionNumber: 0,
  maxRevisions: 3,
  selectedModel: 'gpt-oss:20b', // Default to Ollama Cloud model
  temperature: 0,
  topP: 0.9,
  isProcessing: false,
};

interface UploadStatus {
  fileName: string;
  isProcessing: boolean;
}

// Search Results Interface (kept from original TheologySearch)
interface SearchResult {
  title: string;
  author: string;
  type: 'book' | 'article' | 'commentary' | 'encyclopedia' | 'thesis' | 'website';
  description: string;
  url?: string;
  tags: string[];
  source?: string;
}

const mockResults: SearchResult[] = [
  {
    title: '系統神學導論 (Introduction to Systematic Theology)',
    author: '路易斯·柏克富 (Louis Berkhof)',
    type: 'book',
    description: '經典的改革宗系統神學著作，全面探討基督教教義的各個方面，包括神論、人論、基督論、救恩論等核心主題。',
    url: 'https://example.com',
    tags: ['系統神學', '改革宗', '教義'],
    source: '本地示例資料庫'
  },
  {
    title: '聖經註釋：羅馬書 (Romans Commentary)',
    author: '約翰·加爾文 (John Calvin)',
    type: 'commentary',
    description: '加爾文對羅馬書的深入註釋,闡述保羅的神學思想，特別關注因信稱義和神的主權等核心議題。',
    url: 'https://example.com',
    tags: ['聖經註釋', '羅馬書', '因信稱義'],
    source: '本地示例資料庫'
  },
  {
    title: '教會歷史研究：宗教改革時期 (Reformation History)',
    author: '多位作者',
    type: 'article',
    description: '探討16世紀宗教改革運動的歷史背景、神學爭議和對現代教會的影響。',
    tags: ['教會歷史', '宗教改革', '馬丁路德'],
    source: '本地示例資料庫'
  },
  {
    title: '三一神論的聖經基礎 (Biblical Basis for Trinity)',
    author: '奧古斯丁 (Augustine)',
    type: 'thesis',
    description: '從聖經角度深入探討三位一體教義的神學基礎和歷史發展。',
    url: 'https://example.com',
    tags: ['三一神論', '教義', '教父神學'],
    source: '本地示例資料庫'
  },
];

export const TheologyAssistant: React.FC<TheologyAssistantProps> = ({ onBack }) => {
  const [state, setState] = useState<TheologyAssistantState>(INITIAL_STATE);
  const [currentMessage, setCurrentMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState<'googleSearch' | 'urlContext' | 'codeExecution' | 'generalKnowledge'>('googleSearch');
  const [urlSource, setUrlSource] = useState<string>('reformed');
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  const updateState = (updates: Partial<TheologyAssistantState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Chat functionality
  const handleSendMessage = async () => {
    if (!currentMessage.trim() || state.isProcessing) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString(),
    };

    updateState({
      messages: [...state.messages, userMessage],
      isProcessing: true,
    });

    setCurrentMessage('');

    try {
      // Import the service dynamically
      const { sendChatMessage, createTheologySystemPrompt } = await import('../services/theologyAssistantService');

      // Prepare messages with system context
      let systemPrompt = createTheologySystemPrompt(state.mode);

      // If in Reading Q&A mode and documents are uploaded, include document context
      if (state.mode === TheologyAssistantMode.READING_QA && state.documents.length > 0) {
        const documentsContext = state.documents.map(doc =>
          `\n\n--- 文檔: ${doc.name} ---\n${doc.content.substring(0, 10000)}\n--- 文檔結束 ---`
        ).join('\n');

        systemPrompt += `\n\n你現在正在分析以下上傳的神學文檔。請根據這些文檔的內容來回答用戶的問題：${documentsContext}\n\n請基於上述文檔內容回答問題，並在適當時引用文檔中的具體內容。`;
      }

      const conversationMessages = [
        { role: 'user' as const, content: systemPrompt },
        ...state.messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content: currentMessage }
      ];

      // Call the API
      const response = await sendChatMessage({
        model: state.selectedModel,
        messages: conversationMessages,
        temperature: state.temperature,
        topP: state.topP
      });

      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
      };

      updateState({
        messages: [...state.messages, userMessage, aiMessage],
        isProcessing: false,
      });
    } catch (error: any) {
      console.error('Chat error:', error);

      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `❌ 錯誤：${error.message}\n\n請檢查：\n1. 模型配置是否正確\n2. API 金鑰是否已設置\n3. 網絡連接是否正常`,
        timestamp: new Date().toISOString(),
      };

      updateState({
        messages: [...state.messages, userMessage, errorMessage],
        isProcessing: false,
      });
    }
  };

  // Document upload functionality
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    for (const file of files) {
      const fileType = file.name.split('.').pop()?.toLowerCase() || 'txt';

      if (fileType === 'pdf') {
        // Handle PDF files
        setUploadStatus({ fileName: file.name, isProcessing: true });
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdfjsLib = await import('pdfjs-dist');

          // Set worker path to local file
          pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = '';

          // Extract text from all pages
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ');
            fullText += pageText + '\n\n';
          }

          const document: UploadedDocument = {
            name: file.name,
            content: fullText,
            type: 'pdf',
          };

          updateState({
            documents: [...state.documents, document],
          });
          setUploadStatus(null);
        } catch (error) {
          console.error('PDF parsing error:', error);
          setUploadStatus(null);
          alert(`無法解析 PDF 文件: ${file.name}\n\n錯誤: ${error}`);
        }
      } else {
        // Handle text files (txt, md, docx as text)
        setUploadStatus({ fileName: file.name, isProcessing: true });
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const document: UploadedDocument = {
            name: file.name,
            content,
            type: fileType as any,
          };

          updateState({
            documents: [...state.documents, document],
          });
          setUploadStatus(null);
        };
        reader.onerror = () => {
          setUploadStatus(null);
          alert(`無法讀取文件: ${file.name}`);
        };
        reader.readAsText(file);
      }
    }
  };

  // Assignment Assistant functionality
  const createAssignmentPlan = async () => {
    if (!state.assignmentTopic.trim() || !state.theologyArea.trim()) return;

    updateState({
      isProcessing: true,
      assignmentStage: AssignmentStage.PLANNING
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const plan: AssignmentPlan = {
        id: Date.now().toString(),
        topic: state.assignmentTopic,
        content: `# 神學作業計劃：${state.assignmentTopic}

## 研究領域
${state.theologyArea}

## 學術水平
${state.academicLevel}

## 作業長度
約 ${state.assignmentLength} 字

## 研究大綱
1. 引言和背景
2. 聖經基礎分析
3. 神學傳統觀點
4. 當代應用
5. 結論和反思

## 參考資源
- 聖經經文研究
- 教父著作
- 現代神學評論
- 學術期刊文章

這個計劃將指導您完成一份全面的神學作業。`,
        createdAt: new Date().toISOString(),
      };

      updateState({
        currentPlan: plan,
        isProcessing: false,
        assignmentStage: AssignmentStage.DRAFTING,
      });
    } catch (error) {
      updateState({ isProcessing: false });
    }
  };

  const createAssignmentDraft = async () => {
    if (!state.currentPlan) return;

    updateState({
      isProcessing: true,
      assignmentStage: AssignmentStage.CRITIQUING
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const draft: AssignmentDraft = {
        id: Date.now().toString(),
        topic: state.assignmentTopic,
        content: `# ${state.assignmentTopic}

## 引言

${state.assignmentTopic}是當代神學研究中的重要議題。本文將從聖經、教會歷史和系統神學的角度來探討這個主題。

## 聖經基礎

根據聖經教導，我們可以看到相關的原則和指導...

## 神學分析

從${state.theologyArea}的角度來看，這個議題涉及到多個重要的神學概念...

## 當代應用

在現代教會和基督徒生活中，這些原則如何應用...

## 結論

通過深入研究，我們可以得出...

*注意：這是一個示例草稿，實際實現中會生成更詳細和準確的內容。*`,
        stage: AssignmentStage.DRAFTING,
        revisionNumber: state.revisionNumber,
        createdAt: new Date().toISOString(),
      };

      updateState({
        currentDraft: draft,
        isProcessing: false,
      });
    } catch (error) {
      updateState({ isProcessing: false });
    }
  };

  // Search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    try {
      // Import the real search service
      const { searchTheologyResources, SearchMode, THEOLOGY_RESOURCE_URLS } = await import('../services/theologyResourceSearch');

      // Get target URLs if using URL Context mode
      let targetURLs: string[] | undefined;
      if (searchMode === 'urlContext') {
        targetURLs = THEOLOGY_RESOURCE_URLS[urlSource as keyof typeof THEOLOGY_RESOURCE_URLS] || [];
      }

      // Call Gemini search with selected mode
      const response = await searchTheologyResources(
        searchQuery,
        selectedType,
        SearchMode[searchMode.toUpperCase() as keyof typeof SearchMode],
        targetURLs,
        searchMode === 'urlContext' ? urlSource : undefined
      );

      setSearchResults(response.results);
    } catch (error: any) {
      console.error('Search error:', error);

      // Fallback to mock results on error
      let filtered = mockResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      if (selectedType !== 'all') {
        filtered = filtered.filter(result => result.type === selectedType);
      }

      setSearchResults(filtered);

      // Show error notification
      alert(`搜尋時發生錯誤：${error.message}\n\n已顯示本地模擬結果。請確保 GEMINI_API_KEY 已配置。`);
    } finally {
      setIsSearching(false);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      book: '📚',
      article: '📄',
      commentary: '📖',
      encyclopedia: '📕',
      thesis: '🎓',
      website: '🌐',
    };
    return icons[type as keyof typeof icons] || '📝';
  };

  const getTypeName = (type: string) => {
    const names = {
      book: '書籍',
      article: '文章',
      commentary: '註釋',
      encyclopedia: '百科',
      thesis: '論文',
      website: '網站',
    };
    return names[type as keyof typeof names] || type;
  };

  const renderTabButton = (mode: TheologyAssistantMode, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => updateState({ mode })}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        state.mode === mode
          ? 'bg-indigo-600 text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  // Reusable model selection component
  const renderModelSelection = () => (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-4">AI 模型設定</h3>

      {/* Model Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          選擇 AI 模型
        </label>
        <select
          value={state.selectedModel}
          onChange={(e) => updateState({ selectedModel: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
        >
          <optgroup label="☁️ 雲端 AI 模型 (Gemini / OpenAI)">
            {CLOUD_AI_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.size})
              </option>
            ))}
          </optgroup>
          <optgroup label="☁️ Ollama Cloud 模型">
            {OLLAMA_CLOUD_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.size})
              </option>
            ))}
          </optgroup>
          <optgroup label="🖥️ 本地 Ollama 模型">
            {LOCAL_OLLAMA_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.size})
              </option>
            ))}
          </optgroup>
        </select>
        <div className="mt-2 p-3 bg-gray-700/50 rounded-lg">
          <p className="text-xs text-gray-300">
            {LOCAL_LLM_MODELS.find(m => m.id === state.selectedModel)?.description}
          </p>
          {LOCAL_LLM_MODELS.find(m => m.id === state.selectedModel)?.hasVision && (
            <span className="text-xs text-yellow-400 mt-1 block">🎨 支援視覺分析功能</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            創造性程度: {state.temperature}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={state.temperature}
            onChange={(e) => updateState({ temperature: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>保守</span>
            <span>創新</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            回答多樣性: {state.topP}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={state.topP}
            onChange={(e) => updateState({ topP: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>聚焦</span>
            <span>多元</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTheologyChat = () => {
    return (
      <div className="space-y-4">
        {renderModelSelection()}

      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800 rounded-lg min-h-96">
          {state.messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl lg:max-w-4xl px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}
          {state.isProcessing && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
                  思考中...
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <SpeechInput
              value={currentMessage}
              onChange={setCurrentMessage}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="輸入您的神學問題..."
              disabled={state.isProcessing}
              lang="zh-TW"
            />
            <button
              onClick={handleSendMessage}
              disabled={state.isProcessing || !currentMessage.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
    );
  };

  const renderReadingQA = () => (
    <div className="space-y-6">
      {renderModelSelection()}

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">文檔上傳</h3>
        <div
          className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-300">點擊上傳神學文檔</p>
          <p className="text-sm text-gray-500 mt-2">支持 PDF, DOCX, TXT, MD 格式</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md"
          onChange={handleFileUpload}
          className="hidden"
        />

        {uploadStatus && (
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
              <div>
                <p className="text-sm font-medium text-blue-300">正在處理 PDF 文件...</p>
                <p className="text-xs text-blue-400">{uploadStatus.fileName}</p>
              </div>
            </div>
          </div>
        )}

        {state.documents.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-300 mb-2">已上傳的文檔：</h4>
            <div className="space-y-2">
              {state.documents.map((doc, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-700 rounded">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">{doc.name}</span>
                  <span className="text-xs text-green-400 ml-auto">✓ 已解析</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {state.documents.length > 0 && (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800 rounded-lg min-h-96">
            {state.messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl lg:max-w-4xl px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}
            {state.isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
                    分析文檔中...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <SpeechInput
                value={currentMessage}
                onChange={setCurrentMessage}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="詢問關於已上傳文檔的問題..."
                disabled={state.isProcessing}
                lang="zh-TW"
              />
              <button
                onClick={handleSendMessage}
                disabled={state.isProcessing || !currentMessage.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAssignmentAssistant = () => (
    <div className="space-y-6">
      {renderModelSelection()}

      {state.assignmentStage === AssignmentStage.INPUT && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">作業設定</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                作業主題
              </label>
              <SpeechInput
                value={state.assignmentTopic}
                onChange={(value) => updateState({ assignmentTopic: value })}
                placeholder="例：三一神論的聖經基礎"
                className="w-full"
                lang="zh-TW"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                神學領域
              </label>
              <SpeechInput
                value={state.theologyArea}
                onChange={(value) => updateState({ theologyArea: value })}
                placeholder="例：系統神學"
                className="w-full"
                lang="zh-TW"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                學術水平
              </label>
              <select
                value={state.academicLevel}
                onChange={(e) => updateState({ academicLevel: e.target.value as AcademicLevel })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
              >
                <option value={AcademicLevel.UNDERGRADUATE}>學士</option>
                <option value={AcademicLevel.GRADUATE}>碩士</option>
                <option value={AcademicLevel.DOCTORAL}>博士</option>
                <option value={AcademicLevel.GENERAL}>一般</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                作業長度 (字數)
              </label>
              <input
                type="number"
                value={state.assignmentLength}
                onChange={(e) => updateState({ assignmentLength: parseInt(e.target.value) })}
                min="500"
                max="10000"
                step="500"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
              />
            </div>
          </div>

          <button
            onClick={createAssignmentPlan}
            disabled={!state.assignmentTopic.trim() || !state.theologyArea.trim() || state.isProcessing}
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            {state.isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                生成計劃中...
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                創建作業計劃
              </>
            )}
          </button>
        </div>
      )}

      {state.currentPlan && state.assignmentStage === AssignmentStage.DRAFTING && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">作業計劃</h3>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-200">
              {state.currentPlan.content}
            </pre>
          </div>
          <button
            onClick={createAssignmentDraft}
            disabled={state.isProcessing}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            {state.isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                生成草稿中...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                創建作業草稿
              </>
            )}
          </button>
        </div>
      )}

      {state.currentDraft && state.assignmentStage === AssignmentStage.CRITIQUING && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">作業草稿</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">修訂次數: {state.revisionNumber}</span>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-200">
              {state.currentDraft.content}
            </pre>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => updateState({
                assignmentStage: AssignmentStage.INPUT,
                currentPlan: undefined,
                currentDraft: undefined,
                revisionNumber: 0
              })}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              重新開始
            </button>
            <button
              onClick={() => {
                // Save draft functionality would go here
                alert('草稿已保存！');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              保存草稿
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderResourceSearch = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <div className="flex-1">
              <SpeechInput
                value={searchQuery}
                onChange={setSearchQuery}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSearch()}
                placeholder="搜尋神學主題、作者或關鍵字..."
                className="w-full pl-10"
                lang="zh-TW"
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                搜尋中...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                搜尋
              </>
            )}
          </button>
        </div>

        {/* Search Mode Selection */}
        <div className="mb-4 p-4 bg-gray-700/30 rounded-lg">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            🔍 搜尋模式 (Gemini MCP Tools):
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => setSearchMode('googleSearch')}
              className={`p-3 rounded-lg text-left transition-colors ${
                searchMode === 'googleSearch'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="font-semibold">🌐 Google Search</div>
              <div className="text-xs mt-1 opacity-80">即時網路搜尋神學資源</div>
            </button>

            <button
              onClick={() => setSearchMode('urlContext')}
              className={`p-3 rounded-lg text-left transition-colors ${
                searchMode === 'urlContext'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="font-semibold">🔗 URL Context</div>
              <div className="text-xs mt-1 opacity-80">從指定神學網站搜尋</div>
            </button>

            <button
              onClick={() => setSearchMode('codeExecution')}
              className={`p-3 rounded-lg text-left transition-colors ${
                searchMode === 'codeExecution'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="font-semibold">⚡ Code Execution</div>
              <div className="text-xs mt-1 opacity-80">程式碼分析和統計</div>
            </button>

            <button
              onClick={() => setSearchMode('generalKnowledge')}
              className={`p-3 rounded-lg text-left transition-colors ${
                searchMode === 'generalKnowledge'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="font-semibold">📚 Knowledge Base</div>
              <div className="text-xs mt-1 opacity-80">使用 AI 知識庫推薦</div>
            </button>
          </div>

          {/* URL Source selector (only shown for URL Context mode) */}
          {searchMode === 'urlContext' && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                選擇神學資源來源:
              </label>
              <select
                value={urlSource}
                onChange={(e) => setUrlSource(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 text-white"
              >
                <option value="reformed">改革宗資源 (Monergism, Ligonier, TGC)</option>
                <option value="catholic">天主教資源 (Vatican, Catholic.com)</option>
                <option value="orthodox">東正教資源 (OCA, Greek Orthodox)</option>
                <option value="academic">學術資源 (Logos, JSTOR)</option>
                <option value="chinese">華人神學資源</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400 text-sm">資源類型篩選:</span>
          <div className="flex gap-2 flex-wrap">
            {['all', 'book', 'article', 'commentary', 'encyclopedia', 'thesis', 'website'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedType === type
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {type === 'all' ? '全部' : getTypeName(type)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-300 mb-1">找到 {searchResults.length} 個結果</h3>
                <p className="text-sm text-blue-200/80">
                  {searchMode === 'googleSearch' && '使用 Google Search 即時搜尋神學資源，包含網路上的最新內容。'}
                  {searchMode === 'urlContext' && `從 ${urlSource === 'reformed' ? '改革宗' : urlSource === 'catholic' ? '天主教' : urlSource === 'orthodox' ? '東正教' : urlSource === 'academic' ? '學術' : '華人神學'} 資源網站搜尋相關內容。`}
                  {searchMode === 'codeExecution' && '使用程式碼執行分析神學文獻數據，提供統計和分類資訊。'}
                  {searchMode === 'generalKnowledge' && '基於 AI 知識庫推薦經典神學著作和重要學者作品。'}
                </p>
                <p className="text-xs text-blue-300/60 mt-2">
                  💡 請查看每個結果的「資料來源」標籤，以確定是否適合引用
                </p>
              </div>
            </div>
          </div>

          {searchResults.map((result, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors border border-gray-700 hover:border-green-500"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{getTypeIcon(result.type)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {result.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        作者: {result.author}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs font-medium whitespace-nowrap">
                      {getTypeName(result.type)}
                    </span>
                  </div>

                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {result.description}
                  </p>

                  <div className="space-y-3">
                    {/* Source Information */}
                    {result.source && (
                      <div className="flex items-center gap-2 text-xs border-l-2 border-blue-500 pl-3 py-1">
                        <Info className="w-3 h-3 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-500">資料來源:</span>
                        <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded font-medium">
                          {result.source}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        {result.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {result.url && (
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                        >
                          <Book className="w-4 h-4" />
                          查看資源
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchResults.length === 0 && searchQuery && !isSearching && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            未找到相關資源
          </h3>
          <p className="text-gray-400">
            嘗試使用不同的關鍵字或調整篩選條件
          </p>
        </div>
      )}

      {searchResults.length === 0 && !searchQuery && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            開始搜尋神學資源
          </h3>
          <p className="text-gray-400 mb-6">
            輸入關鍵字搜尋書籍、文章、註釋和學術論文
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <span>熱門搜尋:</span>
            {['三一神論', '因信稱義', '教會歷史', '系統神學'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  setTimeout(handleSearch, 100);
                }}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (state.mode) {
      case TheologyAssistantMode.THEOLOGY_CHAT:
        return renderTheologyChat();
      case TheologyAssistantMode.READING_QA:
        return renderReadingQA();
      case TheologyAssistantMode.ASSIGNMENT_ASSISTANT:
        return renderAssignmentAssistant();
      case TheologyAssistantMode.RESOURCE_SEARCH:
        return renderResourceSearch();
      default:
        return renderTheologyChat();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          返回主頁
        </button>

        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          神學研究助手
        </h1>
        <p className="text-gray-400">探索信仰、聖經和神學理解的全方位平台</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {renderTabButton(
          TheologyAssistantMode.THEOLOGY_CHAT,
          <MessageCircle className="w-4 h-4" />,
          '神學對話'
        )}
        {renderTabButton(
          TheologyAssistantMode.READING_QA,
          <FileText className="w-4 h-4" />,
          '上傳文檔簡閱或問答'
        )}
        {renderTabButton(
          TheologyAssistantMode.ASSIGNMENT_ASSISTANT,
          <GraduationCap className="w-4 h-4" />,
          '作業助手'
        )}
        {renderTabButton(
          TheologyAssistantMode.RESOURCE_SEARCH,
          <Search className="w-4 h-4" />,
          '資源搜尋'
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0">
        {renderContent()}
      </div>
    </div>
  );
};