
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface WebSource {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: WebSource;
}

export interface SearchResult {
  text: string;
  sources: GroundingChunk[];
}
