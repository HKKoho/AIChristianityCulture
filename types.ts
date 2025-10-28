export enum AppState {
  LANDING = 'LANDING',
  INPUT = 'INPUT',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
  ERROR = 'ERROR',
  SAVED = 'SAVED',
  ADMIN = 'ADMIN',
  // Christianity Culture Journey Categories
  LOVE_FEAST = 'LOVE_FEAST', // eat
  TRAVEL_PILGRIM = 'TRAVEL_PILGRIM', // walk
  MUSIC_HYMNS = 'MUSIC_HYMNS', // listen
  CHURCH_AESTHETICS = 'CHURCH_AESTHETICS', // see
  BIBLE_MANUSCRIPTS = 'BIBLE_MANUSCRIPTS', // read
  SOUL_SPIRITUALITY = 'SOUL_SPIRITUALITY', // meditate
}

export type CultureCategory = 'love-feast' | 'travel-pilgrim' | 'music-hymns' | 'church-aesthetics' | 'bible-manuscripts' | 'soul-spirituality';

// Love Feast & Lord's Supper App Types
export interface Recipe {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  biblicalContext: string;
  imageUrl?: string;
  category: 'bread' | 'wine' | 'early-church' | 'traditional';
}

export interface WalkRoute {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  location: string;
  duration: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  biblicalSignificance: string;
  waypoints: { name: string; description: string }[];
  mapUrl?: string;
}

export interface AudioContent {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  type: 'hymn' | 'chant' | 'sermon' | 'prayer' | 'meditation';
  audioUrl: string;
  duration: string;
  transcript?: string;
  background: string;
}

export interface VisualContent {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  type: 'painting' | 'icon' | 'sculpture' | 'architecture' | 'manuscript';
  imageUrl: string;
  artist?: string;
  period: string;
  biblicalReference: string;
  interpretation: string;
}

export interface ReadingContent {
  id: string;
  title: string;
  titleEn: string;
  author: string;
  excerpt: string;
  fullText?: string;
  type: 'scripture' | 'liturgy' | 'theology' | 'devotional' | 'historical';
  period: string;
  context: string;
  reflection: string;
}

export interface MeditationGuide {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  type: 'lectio-divina' | 'contemplative' | 'ignatian' | 'centering-prayer';
  duration: string;
  steps: { title: string; instruction: string; duration: string }[];
  scriptureBase?: string;
  guidance: string;
}

// Bible Game Types
export enum BibleVersion {
  NIV = "NIV",
  ESV = "ESV",
  KJV = "KJV",
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
}

export interface Quest {
  id: string;
  character: string;
  characterImage: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  journalPrompt: {
    title: string;
    content: string;
  };
  deepDive: {
    title: string;
    content: string;
    sources: {
      text: string;
      url: string;
    }[];
  };
}

export interface BibleLocation {
  id: string;
  name: string;
  era: string;
  position: { top: string; left: string };
  questId: string;
  dependency?: string;
}

export interface Level {
  id: string;
  name: string;
  locationIds: string[];
  discussionPrompts: string[];
}

export interface GameContextType {
  completedQuests: Set<string>;
  unlockedLocations: Set<string>;
  journalEntries: JournalEntry[];
  bibleVersion: BibleVersion;
  isFreeChoiceMode: boolean;
  completeQuest: (questId: string, journalEntry: JournalEntry) => void;
  setBibleVersion: (version: BibleVersion) => void;
  setIsFreeChoiceMode: (mode: boolean) => void;
}

// Theology Assistant Types
export enum TheologyAssistantMode {
  THEOLOGY_CHAT = 'Theology Chat',
  READING_QA = 'Reading Q&A',
  ASSIGNMENT_ASSISTANT = 'Assignment Assistant',
  RESOURCE_SEARCH = 'Resource Search'
}

export enum AssignmentStage {
  INPUT = 'input',
  PLANNING = 'planning',
  DRAFTING = 'drafting',
  CRITIQUING = 'critiquing',
  REVISING = 'revising'
}

export enum AcademicLevel {
  UNDERGRADUATE = 'undergraduate',
  GRADUATE = 'graduate',
  DOCTORAL = 'doctoral',
  GENERAL = 'general'
}

export interface AssignmentPlan {
  id: string;
  topic: string;
  content: string;
  createdAt: string;
}

export interface AssignmentDraft {
  id: string;
  topic: string;
  content: string;
  stage: AssignmentStage;
  revisionNumber: number;
  createdAt: string;
}

export interface AssignmentCritique {
  content: string;
  suggestions: string[];
  strengths: string[];
  improvements: string[];
}

export interface DocumentSummary {
  content: string;
  keyPoints: string[];
  themes: string[];
}

export interface UploadedDocument {
  name: string;
  content: string;
  type: 'pdf' | 'docx' | 'txt' | 'md';
  summary?: DocumentSummary;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface LocalLLMModel {
  id: string;
  name: string;
  size: string;
  description: string;
  hasVision?: boolean;
}

export interface TheologyAssistantState {
  mode: TheologyAssistantMode;
  messages: ChatMessage[];
  documents: UploadedDocument[];
  documentSummary?: DocumentSummary;

  // Assignment Assistant specific
  assignmentTopic: string;
  theologyArea: string;
  academicLevel: AcademicLevel;
  assignmentLength: number;
  assignmentTone: string;
  assignmentStage: AssignmentStage;
  currentPlan?: AssignmentPlan;
  currentDraft?: AssignmentDraft;
  currentCritique?: AssignmentCritique;
  revisionNumber: number;
  maxRevisions: number;

  // Model configuration
  selectedModel: string;
  temperature: number;
  topP: number;
  isProcessing: boolean;
}

// Sermon generation specific LLM models
export const SERMON_LLM_MODELS: LocalLLMModel[] = [
  // Ollama Cloud Models (actual available models in your account)
  // Default primary model
  {
    id: 'qwen-coder:480b-cloud',
    name: 'Qwen Coder 480B Cloud ☁️ (預設)',
    size: 'Cloud (480B)',
    description: '預設雲端模型，超大規模編碼能力，最適合結構化講道內容生成'
  },
  // Fallback model
  {
    id: 'kimi-k2:1t-cloud',
    name: 'Kimi K2 1T Cloud ☁️ (備用)',
    size: 'Cloud (1T)',
    description: '備用模型，超大參數，極致的理解和生成能力'
  },
  {
    id: 'gpt-oss:120b',
    name: 'GPT-OSS 120B Cloud ☁️',
    size: 'Cloud (120B)',
    description: '最大雲端模型，適合複雜的神學分析和深入講道'
  },
  {
    id: 'deepseek-v3.1:671b',
    name: 'DeepSeek V3.1 671B Cloud ☁️',
    size: 'Cloud (671B)',
    description: '超大規模模型，頂級推理能力，適合高難度神學論證'
  },
  {
    id: 'qwen3-coder:480b',
    name: 'Qwen3 Coder 480B Cloud ☁️',
    size: 'Cloud (480B)',
    description: '超大規模編碼模型，適合結構化講道內容生成'
  },
  {
    id: 'gpt-oss:20b',
    name: 'GPT-OSS 20B Cloud ☁️',
    size: 'Cloud (20B)',
    description: '雲端模型，平衡效能和速度，適合一般講道生成'
  },
  {
    id: 'kimi-k2:1t',
    name: 'Kimi K2 1T Cloud ☁️',
    size: 'Cloud (1T)',
    description: '超大參數模型，極致的理解和生成能力'
  },
  // Local Models (locally installed)
  {
    id: 'qwen2.5vl:32b',
    name: 'Qwen 2.5 VL 32B (本地)',
    size: '32 GB',
    description: '中英雙語視覺語言模型，適合繁體中文講道',
    hasVision: true
  },
  {
    id: 'llama4:scout',
    name: 'Llama 4 Scout (本地)',
    size: '67 GB',
    description: '最新版本，適合深度神學分析和複雜講道結構'
  },
  {
    id: 'mistral-small:24b',
    name: 'Mistral Small 24B (本地)',
    size: '14 GB',
    description: '高效率小型模型，快速生成講道內容'
  },
  {
    id: 'llama3.3:latest',
    name: 'Llama 3.3 (本地)',
    size: '42 GB',
    description: '高性能通用模型，平衡質量與效率'
  },
  {
    id: 'llava:34b',
    name: 'LLaVA 34B (本地)',
    size: '20 GB',
    description: '多模態模型，支援視覺分析，適合包含圖像的講道內容',
    hasVision: true
  },
  {
    id: 'deepseek-r1:32b',
    name: 'DeepSeek R1 32B (本地)',
    size: '19 GB',
    description: '推理能力強，適合邏輯性神學論證和釋經'
  },
  {
    id: 'llama3.2-vision:latest',
    name: 'Llama 3.2 Vision (本地)',
    size: '7.9 GB',
    description: '輕量級視覺模型，快速處理視覺內容',
    hasVision: true
  }
];

export interface SermonGenerationState {
  selectedLLMModel: string;
  temperature: number;
  topP: number;
}

// AI Engine Types
export enum AiEngine {
  GEMINI = 'Gemini',
  LOCAL_LLM = 'Local LLM'
}

// AI Provider Types (for multi-provider service)
export type AIProvider = 'ollama' | 'gemini' | 'openai';

// Sermon Types
export enum SermonBasis {
  BIBLICAL_STUDY = 'biblical-study',
  CHURCH_HISTORY = 'church-history',
  SYSTEMATIC_THEOLOGY = 'systematic-theology'
}

export enum SermonLength {
  THREE_MIN = 3,
  FIVE_MIN = 5,
  TEN_MIN = 10
}

export const SERMON_LENGTH_OPTIONS = [
  { value: SermonLength.THREE_MIN, label: '3 分鐘' },
  { value: SermonLength.FIVE_MIN, label: '5 分鐘' },
  { value: SermonLength.TEN_MIN, label: '10 分鐘' }
];

// Sermon Presentation Types
export interface SlideContent {
  title: string;
  talkingPoints: string[];
  speakerNotes: string;
  imagePrompt: string;
}

export interface GeneratedSlide extends SlideContent {
  backgroundUrl: string;
}

export interface GeneratedPresentation {
  slides: GeneratedSlide[];
  fullScript: string;
  summary: string;
  speakerHeadshotUrl?: string;
  audienceImageUrl?: string;
}

export interface SavedPresentation extends GeneratedPresentation {
  id: string;
  topic: string;
  savedAt: string;
}

export interface SystemPromptConfig {
  enabled: boolean;
  ethicalStance: string;
  politicalStance: string;
  tone: string;
  empathyLevel: string;
}

export const DEFAULT_SYSTEM_PROMPT_CONFIG: SystemPromptConfig = {
  enabled: false,
  ethicalStance: 'neutral',
  politicalStance: 'neutral',
  tone: 'balanced',
  empathyLevel: 'moderate'
};