import { Language } from '../types';

// API Configuration
const BIBLE_API_BASE = 'https://api.scripture.api.bible/v1';
const BIBLE_SEARCH_API = 'https://api.esv.org/v3/passage';

// Bible API Keys (Note: Users should get their own free API keys)
// Get free API key from: https://scripture.api.bible/signup
const API_KEY = process.env.BIBLE_API_KEY || 'demo-key';

export interface BibleSearchResult {
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: number;
  language: Language;
  translations: {
    english?: string;
    chinese?: string;
    original?: string; // Hebrew or Greek
  };
  strongsNumbers?: string[]; // For Hebrew/Greek word analysis
}

export interface HebrewGreekWord {
  original: string;
  strongs: string;
  transliteration: string;
  meaning: string;
  morphology?: string;
}

/**
 * Search Bible verses with real-time API
 */
export async function searchBibleVerses(
  query: string,
  language: Language,
  limit: number = 20
): Promise<BibleSearchResult[]> {
  try {
    // For demo purposes, we'll use a combination of APIs
    // In production, you'd want to use a comprehensive API like:
    // - Bible.com API (requires authentication)
    // - ESV API for English
    // - Crossway API for original languages

    const results: BibleSearchResult[] = [];

    // Simple verse reference parsing (e.g., "John 3:16")
    const versePattern = /^(\d?\s?[A-Za-z]+)\s+(\d+):(\d+)(-(\d+))?$/i;
    const match = query.match(versePattern);

    if (match) {
      const [, book, chapter, startVerse, , endVerse] = match;
      const result = await fetchVerseByReference(book, chapter, startVerse, endVerse);
      if (result) results.push(result);
    } else {
      // Keyword search
      const keywordResults = await searchByKeyword(query, language, limit);
      results.push(...keywordResults);
    }

    return results;
  } catch (error) {
    console.error('Bible API search error:', error);
    return [];
  }
}

/**
 * Fetch specific verse by reference
 */
async function fetchVerseByReference(
  book: string,
  chapter: string,
  startVerse: string,
  endVerse?: string
): Promise<BibleSearchResult | null> {
  try {
    // This is a simplified implementation
    // In production, you'd use actual API calls

    const reference = `${book} ${chapter}:${startVerse}${endVerse ? `-${endVerse}` : ''}`;

    // Mock response for demonstration
    return {
      reference,
      text: 'API verse text would appear here',
      book: book,
      chapter: parseInt(chapter),
      verse: parseInt(startVerse),
      language: Language.HEBREW, // Determine based on book
      translations: {
        english: 'English translation from API',
        chinese: '來自API的中文翻譯',
        original: 'Original Hebrew/Greek from API'
      },
      strongsNumbers: []
    };
  } catch (error) {
    console.error('Fetch verse error:', error);
    return null;
  }
}

/**
 * Search verses by keyword
 */
async function searchByKeyword(
  keyword: string,
  language: Language,
  limit: number
): Promise<BibleSearchResult[]> {
  // This would make actual API calls to search Bible text
  // For now, returning mock data
  return [];
}

/**
 * Get Hebrew/Greek word analysis using Strong's numbers
 */
export async function getWordAnalysis(
  strongsNumber: string
): Promise<HebrewGreekWord | null> {
  try {
    // This would fetch from Strong's concordance API
    // Example: H430 (Elohim), G3056 (Logos)

    const isHebrew = strongsNumber.startsWith('H');
    const isGreek = strongsNumber.startsWith('G');

    // Mock response
    if (isHebrew) {
      return {
        original: 'אֱלֹהִים',
        strongs: strongsNumber,
        transliteration: 'Elohim',
        meaning: 'God, gods',
        morphology: 'Noun, masculine plural'
      };
    } else if (isGreek) {
      return {
        original: 'λόγος',
        strongs: strongsNumber,
        transliteration: 'logos',
        meaning: 'word, reason, discourse',
        morphology: 'Noun, masculine'
      };
    }

    return null;
  } catch (error) {
    console.error('Word analysis error:', error);
    return null;
  }
}

/**
 * Fetch verse with all translations (English, Chinese, Hebrew/Greek)
 */
export async function getVerseWithTranslations(
  reference: string
): Promise<{
  reference: string;
  english: string;
  chinese: string;
  hebrew?: string;
  greek?: string;
  words: HebrewGreekWord[];
} | null> {
  try {
    // This would make parallel API calls to get all translations
    // For demonstration, returning mock structure

    const isOldTestament = !reference.toLowerCase().includes('john') &&
                          !reference.toLowerCase().includes('corinthians') &&
                          !reference.toLowerCase().includes('philippians');

    return {
      reference,
      english: 'English translation would come from ESV or NIV API',
      chinese: '中文翻譯將來自和合本或新譯本API',
      hebrew: isOldTestament ? 'Hebrew text from WLC API' : undefined,
      greek: !isOldTestament ? 'Greek text from NA28/TR API' : undefined,
      words: []
    };
  } catch (error) {
    console.error('Translation fetch error:', error);
    return null;
  }
}

/**
 * Get available Bible books for the selected language
 */
export function getBibleBooks(language: Language): { name: string; hebrew?: string; greek?: string }[] {
  const oldTestamentBooks = [
    { name: 'Genesis', hebrew: 'בְּרֵאשִׁית' },
    { name: 'Exodus', hebrew: 'שְׁמוֹת' },
    { name: 'Leviticus', hebrew: 'וַיִּקְרָא' },
    { name: 'Numbers', hebrew: 'בְּמִדְבַּר' },
    { name: 'Deuteronomy', hebrew: 'דְּבָרִים' },
    { name: 'Psalms', hebrew: 'תְּהִלִּים' },
    { name: 'Proverbs', hebrew: 'מִשְׁלֵי' },
    { name: 'Isaiah', hebrew: 'יְשַׁעְיָהוּ' },
    // Add more...
  ];

  const newTestamentBooks = [
    { name: 'Matthew', greek: 'Κατὰ Μαθθαῖον' },
    { name: 'Mark', greek: 'Κατὰ Μάρκον' },
    { name: 'Luke', greek: 'Κατὰ Λουκᾶν' },
    { name: 'John', greek: 'Κατὰ Ἰωάννην' },
    { name: 'Romans', greek: 'Πρὸς Ῥωμαίους' },
    { name: '1 Corinthians', greek: 'Πρὸς Κορινθίους Α' },
    { name: 'Philippians', greek: 'Πρὸς Φιλιππησίους' },
    // Add more...
  ];

  return language === Language.HEBREW ? oldTestamentBooks : newTestamentBooks;
}
