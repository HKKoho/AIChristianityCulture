export enum JourneyStage {
  InitialConcept = 'initial-concept',
  CreedContrast = 'creed-contrast',
  BiblicalInterpretation = 'biblical-interpretation',
  DoubtPhase = 'doubt-phase',
  Revelation = 'revelation',
}

export interface Stage {
  key: JourneyStage;
  title: string;
  description: string;
  promptHint: string;
}

export enum TheologicalPerspective {
  Socratic = 'socratic',
  Orthodox = 'orthodox',
  Reformed = 'reformed',
  Catholic = 'catholic',
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export enum EntryClassification {
    Crucial = "Crucial",
    Reference = "Reference",
    Minor = "Minor",
}

export interface ClassificationResult {
    classification: EntryClassification;
    justification: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  group: number;
  x?: number;
  y?: number;
}

export interface MindMapLink {
  source: string;
  target: string;
  value: number;
}

export interface MindMapData {
  nodes: MindMapNode[];
  links: MindMapLink[];
}
