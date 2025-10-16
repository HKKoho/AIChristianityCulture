/**
 * Bible API Service using Gemini AI for real-time Bible verse analysis
 * Provides Hebrew/Greek original text with English and Chinese translations
 */

import { GoogleGenerativeAI } from '@google/genai';
import { Language } from '../types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface BibleVerseResult {
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  translations: {
    english: string;
    traditionalChinese: string;
    original: string; // Hebrew or Greek
  };
  highlightedWords: {
    original: string;
    transliteration: string;
    meaning: string;
    strongsNumber?: string;
    position: number;
  }[];
  language: Language;
}

/**
 * Search and fetch Bible verse with all translations using Gemini AI
 */
export async function fetchBibleVerse(
  reference: string,
  language: Language
): Promise<BibleVerseResult | null> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const testament = language === Language.HEBREW ? 'Old Testament' : 'New Testament';
    const originalLanguage = language === Language.HEBREW ? 'Hebrew' : 'Greek';

    const prompt = `You are a biblical scholar. Provide the following information for ${reference} from the ${testament}:

1. The exact ${originalLanguage} original text
2. English translation (ESV or NIV style)
3. Traditional Chinese translation (和合本 style)
4. Identify 3-5 key theological or significant words in the original ${originalLanguage}
5. For each key word provide:
   - Original ${originalLanguage} text
   - Transliteration
   - English meaning
   - Position in the verse (0-based index)

Return as JSON with this exact structure:
{
  "reference": "${reference}",
  "book": "book name",
  "chapter": number,
  "verse": number,
  "translations": {
    "english": "English text",
    "traditionalChinese": "繁體中文",
    "original": "${originalLanguage} text"
  },
  "highlightedWords": [
    {
      "original": "${originalLanguage} word",
      "transliteration": "romanization",
      "meaning": "English meaning",
      "position": 0
    }
  ]
}

Be accurate with the ${originalLanguage} text and ensure the Traditional Chinese uses proper theological terminology.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const verseData = JSON.parse(text);

    return {
      ...verseData,
      language
    };
  } catch (error) {
    console.error('Gemini Bible fetch error:', error);
    return null;
  }
}

/**
 * Search Bible verses by keyword using Gemini AI
 */
export async function searchBibleByKeyword(
  keyword: string,
  language: Language,
  limit: number = 10
): Promise<BibleVerseResult[]> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const testament = language === Language.HEBREW ? 'Old Testament' : 'New Testament';
    const originalLanguage = language === Language.HEBREW ? 'Hebrew' : 'Greek';

    const prompt = `Find ${limit} significant verses from the ${testament} that relate to the keyword "${keyword}".

For each verse provide:
1. The reference (e.g., "Genesis 1:1")
2. ${originalLanguage} original text
3. English translation
4. Traditional Chinese translation (和合本)
5. 2-3 key words from the original ${originalLanguage} with transliterations and meanings

Return as JSON array with this structure:
[
  {
    "reference": "Book Chapter:Verse",
    "book": "book name",
    "chapter": number,
    "verse": number,
    "translations": {
      "english": "text",
      "traditionalChinese": "文本",
      "original": "${originalLanguage} text"
    },
    "highlightedWords": [
      {
        "original": "word",
        "transliteration": "romanization",
        "meaning": "meaning",
        "position": 0
      }
    ]
  }
]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const verses = JSON.parse(text);

    return verses.map((v: any) => ({
      ...v,
      language
    }));
  } catch (error) {
    console.error('Gemini search error:', error);
    return [];
  }
}

/**
 * Get detailed word analysis for Hebrew/Greek words
 */
export async function analyzeWord(
  word: string,
  language: Language
): Promise<{
  original: string;
  transliteration: string;
  meaning: string;
  etymology: string;
  usageExamples: string[];
  relatedWords: string[];
} | null> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const languageName = language === Language.HEBREW ? 'Biblical Hebrew' : 'Koine Greek';

    const prompt = `Provide detailed linguistic analysis for the ${languageName} word "${word}":

Return as JSON:
{
  "original": "${word}",
  "transliteration": "romanization",
  "meaning": "primary meaning",
  "etymology": "word origin and root",
  "usageExamples": ["example verse reference 1", "example verse reference 2"],
  "relatedWords": ["related word 1", "related word 2"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Word analysis error:', error);
    return null;
  }
}

/**
 * Get passage with verse-by-verse breakdown
 */
export async function getPassageAnalysis(
  startReference: string,
  endReference: string,
  language: Language
): Promise<BibleVerseResult[]> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const originalLanguage = language === Language.HEBREW ? 'Hebrew' : 'Greek';

    const prompt = `Provide verse-by-verse analysis from ${startReference} to ${endReference}.

For each verse include:
- ${originalLanguage} original text
- English translation
- Traditional Chinese translation
- Key theological words with transliterations

Return as JSON array of verses.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const verses = JSON.parse(text);

    return verses.map((v: any) => ({
      ...v,
      language
    }));
  } catch (error) {
    console.error('Passage analysis error:', error);
    return [];
  }
}
