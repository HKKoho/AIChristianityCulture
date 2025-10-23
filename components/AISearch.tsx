import React, { useState, useCallback } from 'react';
import { Search, AlertTriangle, Loader } from 'lucide-react';
import { performSearch } from '../services/geminiChatService';

interface SearchResult {
  text: string;
  sources: GroundingChunk[];
}

interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

interface AISearchProps {
  category: 'eat' | 'walk' | 'listen' | 'see' | 'read' | 'meditate';
}

export const AISearch: React.FC<AISearchProps> = ({ category }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const getCategoryInfo = () => {
    switch (category) {
      case 'eat':
        return {
          title: '食物與聖餐',
          titleEn: 'Food & Communion',
          context: 'Christian food traditions, communion, agape feasts, and biblical meals',
          placeholder: '例如：聖餐的歷史起源、無酵餅的意義...',
        };
      case 'walk':
        return {
          title: '朝聖之路',
          titleEn: 'Pilgrimage Routes',
          context: 'Christian pilgrimage routes, holy sites, and biblical locations',
          placeholder: '例如：以馬忤斯之路的歷史、耶路撒冷朝聖...',
        };
      case 'listen':
        return {
          title: '聖樂與讚美',
          titleEn: 'Sacred Music',
          context: 'Christian sacred music, hymns, chants, and worship traditions',
          placeholder: '例如：格列高利聖歌的起源、讚美詩的發展...',
        };
      case 'see':
        return {
          title: '藝術與建築',
          titleEn: 'Art & Architecture',
          context: 'Christian art, icons, architecture, and visual culture',
          placeholder: '例如：拜占庭聖像畫、哥德式建築特色...',
        };
      case 'read':
        return {
          title: '聖經與文獻',
          titleEn: 'Scripture & Manuscripts',
          context: 'Biblical manuscripts, church fathers, and theological literature',
          placeholder: '例如：死海古卷的發現、早期教父著作...',
        };
      case 'meditate':
        return {
          title: '靈修與默想',
          titleEn: 'Meditation & Spirituality',
          context: 'Christian meditation, contemplative prayer, and spiritual practices',
          placeholder: '例如：Lectio Divina 的步驟、默觀禱告的歷史...',
        };
      default:
        return {
          title: '基督教文化',
          titleEn: 'Christian Culture',
          context: 'Christian cultural traditions and history',
          placeholder: '輸入您的問題...',
        };
    }
  };

  const categoryInfo = getCategoryInfo();

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      setError('請輸入搜尋問題');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const searchResult = await performSearch(query, categoryInfo.context);
      setResult(searchResult);
    } catch (err) {
      console.error('搜尋失敗:', err);
      setError('搜尋過程中發生錯誤，請檢查 API 設定或稍後再試');
    } finally {
      setIsLoading(false);
    }
  }, [query, categoryInfo.context]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">AI 智能搜尋</h2>
        <h3 className="text-xl text-gray-600 mb-2">
          {categoryInfo.title} - {categoryInfo.titleEn}
        </h3>
        <p className="text-gray-600">探索 {categoryInfo.title} 相關的文化與歷史資訊</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg p-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={categoryInfo.placeholder}
            className="flex-1 bg-transparent p-3 text-gray-800 focus:outline-none w-full"
            disabled={isLoading}
          />
          <button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            className="p-3 text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-md hover:from-blue-600 hover:to-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            aria-label="搜尋"
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin" />
            ) : (
              <Search className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {(isLoading || error || result) && (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto animate-fade-in">
          {isLoading && (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">正在搜尋中...</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-md flex items-center gap-3">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
          {result && (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">搜尋結果</h3>
              <div className="prose prose-lg max-w-none text-gray-700">
                <div className="whitespace-pre-wrap">{result.text}</div>
              </div>

              {result.sources && result.sources.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-300">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">參考來源：</h4>
                  <ul className="space-y-2">
                    {result.sources.map((source, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <a
                          href={source.web.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline transition-colors flex-1"
                        >
                          {source.web.title || source.web.uri}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
