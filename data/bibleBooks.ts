/**
 * Bible Books Structure
 * Contains book names in Traditional Chinese and English with chapter counts
 */

export interface BibleBook {
  id: string;
  nameChinese: string;
  nameEnglish: string;
  chapters: number;
  testament: 'OT' | 'NT';
}

export const OLD_TESTAMENT_BOOKS: BibleBook[] = [
  { id: 'gen', nameChinese: '創世記', nameEnglish: 'Genesis', chapters: 50, testament: 'OT' },
  { id: 'exo', nameChinese: '出埃及記', nameEnglish: 'Exodus', chapters: 40, testament: 'OT' },
  { id: 'lev', nameChinese: '利未記', nameEnglish: 'Leviticus', chapters: 27, testament: 'OT' },
  { id: 'num', nameChinese: '民數記', nameEnglish: 'Numbers', chapters: 36, testament: 'OT' },
  { id: 'deu', nameChinese: '申命記', nameEnglish: 'Deuteronomy', chapters: 34, testament: 'OT' },
  { id: 'jos', nameChinese: '約書亞記', nameEnglish: 'Joshua', chapters: 24, testament: 'OT' },
  { id: 'jdg', nameChinese: '士師記', nameEnglish: 'Judges', chapters: 21, testament: 'OT' },
  { id: 'rut', nameChinese: '路得記', nameEnglish: 'Ruth', chapters: 4, testament: 'OT' },
  { id: '1sa', nameChinese: '撒母耳記上', nameEnglish: '1 Samuel', chapters: 31, testament: 'OT' },
  { id: '2sa', nameChinese: '撒母耳記下', nameEnglish: '2 Samuel', chapters: 24, testament: 'OT' },
  { id: '1ki', nameChinese: '列王紀上', nameEnglish: '1 Kings', chapters: 22, testament: 'OT' },
  { id: '2ki', nameChinese: '列王紀下', nameEnglish: '2 Kings', chapters: 25, testament: 'OT' },
  { id: '1ch', nameChinese: '歷代志上', nameEnglish: '1 Chronicles', chapters: 29, testament: 'OT' },
  { id: '2ch', nameChinese: '歷代志下', nameEnglish: '2 Chronicles', chapters: 36, testament: 'OT' },
  { id: 'ezr', nameChinese: '以斯拉記', nameEnglish: 'Ezra', chapters: 10, testament: 'OT' },
  { id: 'neh', nameChinese: '尼希米記', nameEnglish: 'Nehemiah', chapters: 13, testament: 'OT' },
  { id: 'est', nameChinese: '以斯帖記', nameEnglish: 'Esther', chapters: 10, testament: 'OT' },
  { id: 'job', nameChinese: '約伯記', nameEnglish: 'Job', chapters: 42, testament: 'OT' },
  { id: 'psa', nameChinese: '詩篇', nameEnglish: 'Psalms', chapters: 150, testament: 'OT' },
  { id: 'pro', nameChinese: '箴言', nameEnglish: 'Proverbs', chapters: 31, testament: 'OT' },
  { id: 'ecc', nameChinese: '傳道書', nameEnglish: 'Ecclesiastes', chapters: 12, testament: 'OT' },
  { id: 'sng', nameChinese: '雅歌', nameEnglish: 'Song of Solomon', chapters: 8, testament: 'OT' },
  { id: 'isa', nameChinese: '以賽亞書', nameEnglish: 'Isaiah', chapters: 66, testament: 'OT' },
  { id: 'jer', nameChinese: '耶利米書', nameEnglish: 'Jeremiah', chapters: 52, testament: 'OT' },
  { id: 'lam', nameChinese: '耶利米哀歌', nameEnglish: 'Lamentations', chapters: 5, testament: 'OT' },
  { id: 'ezk', nameChinese: '以西結書', nameEnglish: 'Ezekiel', chapters: 48, testament: 'OT' },
  { id: 'dan', nameChinese: '但以理書', nameEnglish: 'Daniel', chapters: 12, testament: 'OT' },
  { id: 'hos', nameChinese: '何西阿書', nameEnglish: 'Hosea', chapters: 14, testament: 'OT' },
  { id: 'jol', nameChinese: '約珥書', nameEnglish: 'Joel', chapters: 3, testament: 'OT' },
  { id: 'amo', nameChinese: '阿摩司書', nameEnglish: 'Amos', chapters: 9, testament: 'OT' },
  { id: 'oba', nameChinese: '俄巴底亞書', nameEnglish: 'Obadiah', chapters: 1, testament: 'OT' },
  { id: 'jon', nameChinese: '約拿書', nameEnglish: 'Jonah', chapters: 4, testament: 'OT' },
  { id: 'mic', nameChinese: '彌迦書', nameEnglish: 'Micah', chapters: 7, testament: 'OT' },
  { id: 'nam', nameChinese: '那鴻書', nameEnglish: 'Nahum', chapters: 3, testament: 'OT' },
  { id: 'hab', nameChinese: '哈巴谷書', nameEnglish: 'Habakkuk', chapters: 3, testament: 'OT' },
  { id: 'zep', nameChinese: '西番雅書', nameEnglish: 'Zephaniah', chapters: 3, testament: 'OT' },
  { id: 'hag', nameChinese: '哈該書', nameEnglish: 'Haggai', chapters: 2, testament: 'OT' },
  { id: 'zec', nameChinese: '撒迦利亞書', nameEnglish: 'Zechariah', chapters: 14, testament: 'OT' },
  { id: 'mal', nameChinese: '瑪拉基書', nameEnglish: 'Malachi', chapters: 4, testament: 'OT' },
];

export const NEW_TESTAMENT_BOOKS: BibleBook[] = [
  { id: 'mat', nameChinese: '馬太福音', nameEnglish: 'Matthew', chapters: 28, testament: 'NT' },
  { id: 'mrk', nameChinese: '馬可福音', nameEnglish: 'Mark', chapters: 16, testament: 'NT' },
  { id: 'luk', nameChinese: '路加福音', nameEnglish: 'Luke', chapters: 24, testament: 'NT' },
  { id: 'jhn', nameChinese: '約翰福音', nameEnglish: 'John', chapters: 21, testament: 'NT' },
  { id: 'act', nameChinese: '使徒行傳', nameEnglish: 'Acts', chapters: 28, testament: 'NT' },
  { id: 'rom', nameChinese: '羅馬書', nameEnglish: 'Romans', chapters: 16, testament: 'NT' },
  { id: '1co', nameChinese: '哥林多前書', nameEnglish: '1 Corinthians', chapters: 16, testament: 'NT' },
  { id: '2co', nameChinese: '哥林多後書', nameEnglish: '2 Corinthians', chapters: 13, testament: 'NT' },
  { id: 'gal', nameChinese: '加拉太書', nameEnglish: 'Galatians', chapters: 6, testament: 'NT' },
  { id: 'eph', nameChinese: '以弗所書', nameEnglish: 'Ephesians', chapters: 6, testament: 'NT' },
  { id: 'php', nameChinese: '腓立比書', nameEnglish: 'Philippians', chapters: 4, testament: 'NT' },
  { id: 'col', nameChinese: '歌羅西書', nameEnglish: 'Colossians', chapters: 4, testament: 'NT' },
  { id: '1th', nameChinese: '帖撒羅尼迦前書', nameEnglish: '1 Thessalonians', chapters: 5, testament: 'NT' },
  { id: '2th', nameChinese: '帖撒羅尼迦後書', nameEnglish: '2 Thessalonians', chapters: 3, testament: 'NT' },
  { id: '1ti', nameChinese: '提摩太前書', nameEnglish: '1 Timothy', chapters: 6, testament: 'NT' },
  { id: '2ti', nameChinese: '提摩太後書', nameEnglish: '2 Timothy', chapters: 4, testament: 'NT' },
  { id: 'tit', nameChinese: '提多書', nameEnglish: 'Titus', chapters: 3, testament: 'NT' },
  { id: 'phm', nameChinese: '腓利門書', nameEnglish: 'Philemon', chapters: 1, testament: 'NT' },
  { id: 'heb', nameChinese: '希伯來書', nameEnglish: 'Hebrews', chapters: 13, testament: 'NT' },
  { id: 'jas', nameChinese: '雅各書', nameEnglish: 'James', chapters: 5, testament: 'NT' },
  { id: '1pe', nameChinese: '彼得前書', nameEnglish: '1 Peter', chapters: 5, testament: 'NT' },
  { id: '2pe', nameChinese: '彼得後書', nameEnglish: '2 Peter', chapters: 3, testament: 'NT' },
  { id: '1jn', nameChinese: '約翰一書', nameEnglish: '1 John', chapters: 5, testament: 'NT' },
  { id: '2jn', nameChinese: '約翰二書', nameEnglish: '2 John', chapters: 1, testament: 'NT' },
  { id: '3jn', nameChinese: '約翰三書', nameEnglish: '3 John', chapters: 1, testament: 'NT' },
  { id: 'jud', nameChinese: '猶大書', nameEnglish: 'Jude', chapters: 1, testament: 'NT' },
  { id: 'rev', nameChinese: '啟示錄', nameEnglish: 'Revelation', chapters: 22, testament: 'NT' },
];

export const ALL_BIBLE_BOOKS = [...OLD_TESTAMENT_BOOKS, ...NEW_TESTAMENT_BOOKS];

/**
 * Get a book by ID
 */
export const getBookById = (bookId: string): BibleBook | undefined => {
  return ALL_BIBLE_BOOKS.find(book => book.id === bookId);
};

/**
 * Generate Bible Gateway URL for a specific passage
 */
export const getBibleGatewayUrl = (
  book: BibleBook,
  chapter: number,
  version: string = 'CUVMPT'
): string => {
  const passage = `${book.nameEnglish}+${chapter}`;
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(passage)}&version=${version}`;
};
