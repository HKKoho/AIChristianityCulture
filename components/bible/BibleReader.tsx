import React, { useState } from 'react';
import { OLD_TESTAMENT_BOOKS, NEW_TESTAMENT_BOOKS, getBibleGatewayUrl, type BibleBook } from '../../data/bibleBooks';
import { useGame } from '../../hooks/useGame';

const BibleReader: React.FC = () => {
  const { bibleVersion } = useGame();
  const [selectedTestament, setSelectedTestament] = useState<'OT' | 'NT'>('NT');
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);

  const books = selectedTestament === 'OT' ? OLD_TESTAMENT_BOOKS : NEW_TESTAMENT_BOOKS;

  const handleBookSelect = (book: BibleBook) => {
    setSelectedBook(book);
    setSelectedChapter(1); // Reset to chapter 1 when selecting a new book
  };

  const handleOpenBibleGateway = () => {
    if (selectedBook) {
      const url = getBibleGatewayUrl(selectedBook, selectedChapter, bibleVersion);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-6">
      {/* Testament Selector */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => {
            setSelectedTestament('OT');
            setSelectedBook(null);
          }}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            selectedTestament === 'OT'
              ? 'bg-amber-800 text-white shadow-lg'
              : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
          }`}
        >
          舊約聖經 (39卷)
        </button>
        <button
          onClick={() => {
            setSelectedTestament('NT');
            setSelectedBook(null);
          }}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            selectedTestament === 'NT'
              ? 'bg-amber-800 text-white shadow-lg'
              : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
          }`}
        >
          新約聖經 (27卷)
        </button>
      </div>

      {/* Book Selection */}
      {!selectedBook && (
        <div>
          <h3 className="text-xl font-bold text-amber-900 mb-4">
            選擇書卷 ({selectedTestament === 'OT' ? '舊約' : '新約'})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
            {books.map(book => (
              <button
                key={book.id}
                onClick={() => handleBookSelect(book)}
                className="p-3 bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 rounded-lg text-left transition-all hover:shadow-md"
              >
                <div className="font-bold text-amber-900">{book.nameChinese}</div>
                <div className="text-xs text-amber-700 mt-1">{book.nameEnglish}</div>
                <div className="text-xs text-amber-600 mt-1">{book.chapters} 章</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chapter Selection & Reader */}
      {selectedBook && (
        <div className="space-y-4">
          {/* Back Button */}
          <button
            onClick={() => setSelectedBook(null)}
            className="text-amber-800 hover:text-amber-900 font-semibold text-sm"
          >
            ← 返回書卷選擇
          </button>

          {/* Book Header */}
          <div className="bg-amber-100 p-4 rounded-lg border-2 border-amber-300">
            <h3 className="text-2xl font-bold text-amber-900">
              {selectedBook.nameChinese}
            </h3>
            <p className="text-sm text-amber-700 mt-1">
              {selectedBook.nameEnglish} · 共 {selectedBook.chapters} 章
            </p>
          </div>

          {/* Chapter Selector */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">
              選擇章節：
            </label>
            <div className="flex items-center gap-4">
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(parseInt(e.target.value))}
                className="flex-1 bg-white border-2 border-amber-300 text-amber-900 rounded-lg px-4 py-2 font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(
                  (chapter) => (
                    <option key={chapter} value={chapter}>
                      第 {chapter} 章
                    </option>
                  )
                )}
              </select>

              <button
                onClick={handleOpenBibleGateway}
                className="px-6 py-2 bg-amber-800 hover:bg-amber-700 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                閱讀經文
              </button>
            </div>
          </div>

          {/* Chapter Grid for Quick Selection */}
          <div>
            <p className="text-sm font-semibold text-amber-900 mb-2">
              快速跳轉：
            </p>
            <div className="grid grid-cols-10 gap-2 max-h-64 overflow-y-auto">
              {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(
                (chapter) => (
                  <button
                    key={chapter}
                    onClick={() => setSelectedChapter(chapter)}
                    className={`p-2 rounded font-semibold transition-all ${
                      selectedChapter === chapter
                        ? 'bg-amber-800 text-white'
                        : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                    }`}
                  >
                    {chapter}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r-lg">
            <p className="text-sm text-amber-900">
              <strong>提示：</strong>點擊「閱讀經文」按鈕將在新視窗中打開 Bible Gateway，
              使用 {bibleVersion} 版本閱讀 {selectedBook.nameChinese} 第 {selectedChapter} 章。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BibleReader;
