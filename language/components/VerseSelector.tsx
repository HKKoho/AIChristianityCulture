import React, { useState, useMemo } from 'react';
import { BookOpen, Search, Filter } from 'lucide-react';
import { Language } from '../types';
import { BibleVerse, getVersesByLanguage } from '../bibleVerses';

interface VerseSelectorProps {
  language: Language;
  onSelectVerse: (verse: BibleVerse) => void;
  onBack: () => void;
}

export const VerseSelector: React.FC<VerseSelectorProps> = ({ language, onSelectVerse, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<string>('all');

  const verses = getVersesByLanguage(language);
  const languageTitle = language === Language.HEBREW ? '希伯來文經文' : '希臘文經文';
  const testament = language === Language.HEBREW ? '舊約聖經' : '新約聖經';

  // Extract unique books from verses
  const books = useMemo(() => {
    const bookSet = new Set(verses.map(v => {
      // Extract book name - handle both "Book Chapter:Verse" and "中文書卷名 Chapter:Verse"
      const parts = v.reference.split(' ');
      // For multi-word book names like "1 Corinthians", keep both parts
      if (parts[0] && !isNaN(parseInt(parts[0])) && parts.length > 1) {
        return `${parts[0]} ${parts[1]}`;
      }
      return parts[0];
    }));
    return ['all', ...Array.from(bookSet)];
  }, [verses]);

  // Filter verses based on search and book filter
  const filteredVerses = useMemo(() => {
    return verses.filter(verse => {
      const matchesSearch =
        verse.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        verse.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        verse.highlightedWords.some(word =>
          word.original.includes(searchQuery) ||
          word.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
          word.meaning.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesBook = selectedBook === 'all' || verse.reference.startsWith(selectedBook);

      return matchesSearch && matchesBook;
    });
  }, [verses, searchQuery, selectedBook]);

  const bookNameMap: Record<string, string> = {
    'all': '全部經卷',
    // Old Testament (Hebrew)
    'Genesis': '創世記',
    '出埃及記': '出埃及記',
    'Exodus': '出埃及記',
    'Psalm': '詩篇',
    '箴言': '箴言',
    'Proverbs': '箴言',
    '傳道書': '傳道書',
    'Ecclesiastes': '傳道書',
    'Isaiah': '以賽亞書',
    '耶利米書': '耶利米書',
    'Jeremiah': '耶利米書',
    '彌迦書': '彌迦書',
    'Micah': '彌迦書',
    '耶利米哀歌': '耶利米哀歌',
    'Lamentations': '耶利米哀歌',
    '瑪拉基書': '瑪拉基書',
    'Malachi': '瑪拉基書',
    '民數記': '民數記',
    'Numbers': '民數記',
    '1 Chronicles': '歷代志上',
    'Chronicles': '歷代志',
    '約書亞記': '約書亞記',
    'Joshua': '約書亞記',
    '但以理書': '但以理書',
    'Daniel': '但以理書',
    'Deuteronomy': '申命記',
    // New Testament (Greek)
    'Matthew': '馬太福音',
    'Mark': '馬可福音',
    'Luke': '路加福音',
    'John': '約翰福音',
    'Acts': '使徒行傳',
    'Romans': '羅馬書',
    '1 Corinthians': '哥林多前書',
    'Galatians': '加拉太書',
    'Ephesians': '以弗所書',
    'Philippians': '腓立比書',
    'Colossians': '歌羅西書',
    '1 Thessalonians': '帖撒羅尼迦前書',
    '2 Timothy': '提摩太後書',
    'Hebrews': '希伯來書',
    'James': '雅各書',
    '1 Peter': '彼得前書',
    '1 John': '約翰一書',
    'Revelation': '啟示錄'
  };

  return (
    <div className="w-full max-w-4xl p-6 animate-fade-in">
      <button
        onClick={onBack}
        className="mb-6 text-sm text-stone-500 hover:text-sky-600 transition-colors"
      >
        &larr; 返回練習模式
      </button>

      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-sky-800 dark:text-sky-300 mb-2">{languageTitle}</h2>
        <p className="text-lg text-stone-600 dark:text-stone-400">{testament}</p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋經文、詞彙或翻譯..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Book Filter */}
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-stone-500" />
          <div className="flex flex-wrap gap-2">
            {books.map(book => (
              <button
                key={book}
                onClick={() => setSelectedBook(book)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedBook === book
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-600'
                }`}
              >
                {bookNameMap[book] || book}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-stone-500 dark:text-stone-400">
          找到 {filteredVerses.length} 個經文
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVerses.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <p className="text-lg text-stone-500 dark:text-stone-400 mb-2">沒有找到符合條件的經文</p>
            <p className="text-sm text-stone-400 dark:text-stone-500">請嘗試其他搜尋條件</p>
          </div>
        ) : (
          filteredVerses.map((verse) => (
          <button
            key={verse.reference}
            onClick={() => onSelectVerse(verse)}
            className="group p-6 bg-white dark:bg-stone-800 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-left border-2 border-transparent hover:border-sky-500"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-lg group-hover:bg-sky-200 dark:group-hover:bg-sky-800/50 transition-colors">
                <BookOpen className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-sky-900 dark:text-sky-200 mb-2">
                  {verse.reference}
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2">
                  {verse.translation}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {verse.highlightedWords.slice(0, 3).map((word, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs rounded-md font-medium"
                    >
                      {word.original}
                    </span>
                  ))}
                  {verse.highlightedWords.length > 3 && (
                    <span className="px-2 py-1 text-stone-500 dark:text-stone-400 text-xs">
                      +{verse.highlightedWords.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))
        )}
      </div>
    </div>
  );
};
