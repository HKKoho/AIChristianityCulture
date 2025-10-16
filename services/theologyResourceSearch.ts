/**
 * Theology Resource Search Service
 * Uses Google Gemini with Google Search grounding to find theological resources
 */

import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY not configured - search will not work');
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export interface ResourceSearchResult {
  title: string;
  author: string;
  type: 'book' | 'article' | 'commentary' | 'encyclopedia' | 'thesis' | 'website';
  description: string;
  url?: string;
  tags: string[];
  source?: string;
}

export interface SearchResponse {
  results: ResourceSearchResult[];
  summary: string;
}

export enum SearchMode {
  GOOGLE_SEARCH = 'googleSearch',           // Google Search grounding
  URL_CONTEXT = 'urlContext',               // Search specific URLs
  CODE_EXECUTION = 'codeExecution',         // Execute code for analysis
  GENERAL_KNOWLEDGE = 'generalKnowledge'    // No tools, just knowledge
}

/**
 * Search for theological resources using different Gemini MCP tools
 */
export async function searchTheologyResources(
  query: string,
  resourceType?: string,
  searchMode: SearchMode = SearchMode.GOOGLE_SEARCH,
  targetURLs?: string[],
  urlSourceCategory?: string
): Promise<SearchResponse> {

  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to .env.local to use search.');
  }

  const typeFilter = resourceType && resourceType !== 'all'
    ? `Focus on finding ${resourceType} resources. `
    : '';

  let searchPrompt = '';
  let tools: any[] = [];
  let configOverrides: any = {};

  // Configure based on search mode
  switch (searchMode) {
    case SearchMode.GOOGLE_SEARCH:
      searchPrompt = `
你是一位神學研究專家。請使用 Google Search 搜尋關於「${query}」的神學資源。

${typeFilter}請找出：
1. 相關的神學書籍
2. 學術文章和論文
3. 聖經註釋
4. 神學百科條目
5. 可信的神學網站

對於每個資源，請提供：
- 準確的標題（中文或英文）
- 作者姓名
- 資源類型（書籍、文章、註釋、百科、論文、網站）
- 簡短描述（2-3句話）
- 網址（如果有）
- 相關標籤

請優先考慮正統基督教神學資源，並確保信息的準確性和學術性。
`;
      tools = [{ googleSearch: {} }];
      break;

    case SearchMode.URL_CONTEXT:
      if (!targetURLs || targetURLs.length === 0) {
        throw new Error('URL Context mode requires target URLs');
      }
      searchPrompt = `
請分析以下神學網站的內容，找出關於「${query}」的相關信息：

目標網站：
${targetURLs.map(url => `- ${url}`).join('\n')}

${typeFilter}請提供：
1. 每個網站上的相關內容
2. 作者或組織名稱
3. 資源類型
4. 關鍵引用和摘要
5. 內容的神學立場

請整理成結構化的資源列表。
`;
      tools = [
        {
          urlContext: {
            urls: targetURLs
          }
        }
      ];
      break;

    case SearchMode.CODE_EXECUTION:
      searchPrompt = `
請使用代碼執行能力分析神學文獻搜尋結果「${query}」。

${typeFilter}執行以下任務：
1. 分類不同類型的神學資源
2. 統計資源的時代分布
3. 識別主要作者和學派
4. 生成資源推薦優先級

請提供結構化的分析報告和資源列表。
`;
      tools = [
        {
          codeExecution: {}
        }
      ];
      break;

    case SearchMode.GENERAL_KNOWLEDGE:
      searchPrompt = `
基於你的神學知識庫，請提供關於「${query}」的神學資源推薦。

${typeFilter}請列出：
1. 經典神學著作
2. 重要學者和作品
3. 相關聖經註釋
4. 神學百科條目
5. 推薦閱讀順序

請提供準確的書目信息和簡短描述。
`;
      tools = [];  // No external tools, use model knowledge only
      configOverrides.temperature = 0.5;  // Slightly higher for general knowledge
      break;
  }

  try {
    // Build config
    const config: any = {
      temperature: configOverrides.temperature ?? 0.3,
      topP: 0.9,
      maxOutputTokens: 3000,
      ...(tools.length > 0 && { tools })
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: searchPrompt,
      config
    });

    const searchText = response.text;

    // Parse the response to extract structured results
    const results = parseSearchResults(searchText);

    const modeDescriptions = {
      [SearchMode.GOOGLE_SEARCH]: 'Google Search',
      [SearchMode.URL_CONTEXT]: 'URL Context',
      [SearchMode.CODE_EXECUTION]: 'Code Execution Analysis',
      [SearchMode.GENERAL_KNOWLEDGE]: 'Knowledge Base'
    };

    // URL category descriptions for better source info
    const urlCategoryDescriptions: Record<string, string> = {
      reformed: '改革宗資源',
      catholic: '天主教資源',
      orthodox: '東正教資源',
      academic: '學術資源',
      chinese: '華人神學資源'
    };

    // Add source information to all results
    let sourceLabel = `Gemini MCP: ${modeDescriptions[searchMode]}`;
    if (searchMode === SearchMode.URL_CONTEXT && urlSourceCategory) {
      sourceLabel = `${urlCategoryDescriptions[urlSourceCategory] || urlSourceCategory} (URL Context)`;
    }

    const resultsWithSource = results.map(result => ({
      ...result,
      source: result.source || sourceLabel
    }));

    return {
      results: resultsWithSource,
      summary: `透過 ${modeDescriptions[searchMode]} 找到 ${results.length} 個關於「${query}」的神學資源`
    };

  } catch (error: any) {
    console.error('Theology search error:', error);
    throw new Error(`搜尋失敗：${error.message}`);
  }
}

/**
 * Parse Gemini's response into structured search results
 */
function parseSearchResults(text: string): ResourceSearchResult[] {
  const results: ResourceSearchResult[] = [];

  // This is a basic parser - you may need to adjust based on actual response format
  // Split by numbered list or sections
  const sections = text.split(/\n\d+\.\s+/).filter(s => s.trim());

  for (const section of sections) {
    try {
      const result = parseSection(section);
      if (result) {
        results.push(result);
      }
    } catch (err) {
      console.warn('Failed to parse section:', err);
    }
  }

  return results;
}

function parseSection(section: string): ResourceSearchResult | null {
  // Extract title, author, description, URL from the section
  const titleMatch = section.match(/(?:標題|Title|書名)[:：]\s*(.+?)(?:\n|$)/i);
  const authorMatch = section.match(/(?:作者|Author)[:：]\s*(.+?)(?:\n|$)/i);
  const descMatch = section.match(/(?:描述|Description|簡介)[:：]\s*(.+?)(?:\n|$)/i);
  const urlMatch = section.match(/(https?:\/\/[^\s]+)/);
  const typeMatch = section.match(/(?:類型|Type)[:：]\s*(.+?)(?:\n|$)/i);

  if (!titleMatch) return null;

  const title = titleMatch[1].trim();
  const author = authorMatch ? authorMatch[1].trim() : '未知作者';
  const description = descMatch ? descMatch[1].trim() : section.substring(0, 150);
  const url = urlMatch ? urlMatch[1] : undefined;
  const typeStr = typeMatch ? typeMatch[1].toLowerCase() : '';

  // Determine resource type
  let type: ResourceSearchResult['type'] = 'article';
  if (typeStr.includes('書') || typeStr.includes('book')) type = 'book';
  else if (typeStr.includes('註釋') || typeStr.includes('commentary')) type = 'commentary';
  else if (typeStr.includes('百科') || typeStr.includes('encyclopedia')) type = 'encyclopedia';
  else if (typeStr.includes('論文') || typeStr.includes('thesis')) type = 'thesis';
  else if (typeStr.includes('網') || typeStr.includes('website')) type = 'website';

  // Extract tags from section
  const tags: string[] = [];
  if (section.includes('神學')) tags.push('神學');
  if (section.includes('聖經')) tags.push('聖經');
  if (section.includes('改革宗')) tags.push('改革宗');
  if (section.includes('系統神學')) tags.push('系統神學');

  return {
    title,
    author,
    type,
    description,
    url,
    tags,
    source: 'Google Search (Gemini)'
  };
}

/**
 * Predefined theological resource URLs for URL Context search
 */
export const THEOLOGY_RESOURCE_URLS = {
  reformed: [
    'https://www.monergism.com',
    'https://www.ligonier.org',
    'https://www.thegospelcoalition.org'
  ],
  catholic: [
    'https://www.vatican.va',
    'https://www.catholic.com',
    'https://www.newadvent.org'
  ],
  orthodox: [
    'https://www.oca.org',
    'https://www.goarch.org'
  ],
  academic: [
    'https://www.logos.com',
    'https://www.biblicalstudies.org.uk',
    'https://www.jstor.org'
  ],
  chinese: [
    'https://www.ccbiblestudy.org',
    'https://www.cclw.net',
    'https://www.livingwater4u.com'
  ]
};
