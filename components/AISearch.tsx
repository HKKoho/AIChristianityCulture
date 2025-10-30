import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, AlertTriangle, Loader, Mic, Volume2, StopCircle } from 'lucide-react';
import { performSearch } from '../services/multiProviderChatService';
import { useTranslation } from 'react-i18next';

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
  const { t, i18n } = useTranslation(['common', 'aiSearch']);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

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

  const handleSearch = useCallback(async (expanded: boolean = false) => {
    if (!query.trim()) {
      setError(t('common:messages.pleaseEnterQuery'));
      return;
    }
    setIsLoading(true);
    setError('');
    setResult(null);
    setIsExpanded(expanded);

    try {
      const wordLimit = expanded ? 500 : 100;
      const searchResult = await performSearch(query, categoryInfo.context, wordLimit);
      setResult(searchResult);
    } catch (err) {
      console.error(t('common:messages.searchFailed'), err);
      setError(t('common:messages.searchError'));
    } finally {
      setIsLoading(false);
    }
  }, [query, categoryInfo.context, t]);

  const handleExpand = useCallback(async () => {
    await handleSearch(true);
  }, [handleSearch]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError(t('common:messages.voiceNotSupported'));
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-TW';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(t('common:messages.voiceRecognitionFailed'));
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [t]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  // Auto-scroll to results when they appear
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const speakText = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      setError(t('common:messages.speechNotSupported'));
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setError(t('common:messages.speechFailed'));
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [t]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('aiSearch:title')}</h2>
        <h3 className="text-xl text-gray-600 mb-2">
          {t(`aiSearch:categories.${category}.title`)}
        </h3>
        <p className="text-gray-600">{t('aiSearch:description', { category: t(`aiSearch:categories.${category}.title`) })}</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg p-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t(`aiSearch:categories.${category}.placeholder`)}
            className="flex-1 bg-transparent p-3 text-gray-800 focus:outline-none w-full"
            disabled={isLoading || isListening}
          />
          <button
            onClick={isListening ? stopListening : startListening}
            className={`p-3 rounded-md transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            aria-label={isListening ? t('common:buttons.stopRecording') : t('common:buttons.voiceInput')}
            title={isListening ? t('common:buttons.stopRecording') : t('common:buttons.voiceInput')}
          >
            {isListening ? <StopCircle className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <button
            onClick={() => handleSearch()}
            disabled={!query.trim() || isLoading || isListening}
            className="p-3 text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-md hover:from-blue-600 hover:to-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            aria-label={t('common:buttons.search')}
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
        <div ref={resultRef} className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto animate-fade-in">
          {isLoading && (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">{t('common:messages.searching')}</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-md flex items-center gap-3">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
          {result && (
            <div className="max-h-[70vh] overflow-y-auto pr-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {t('common:labels.searchResult')}
                  {!isExpanded && (
                    <span className="text-sm font-normal text-gray-500 ml-2">{t('common:messages.wordLimit')}</span>
                  )}
                </h3>
                <button
                  onClick={isSpeaking ? stopSpeaking : () => speakText(result.text)}
                  className={`p-2 rounded-lg transition-colors ${
                    isSpeaking
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                  title={isSpeaking ? t('common:buttons.stopPlaying') : t('common:buttons.readAloud')}
                >
                  {isSpeaking ? <StopCircle className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700">
                <div className="whitespace-pre-wrap">{result.text}</div>
              </div>

              {!isExpanded && (
                <div className="mt-4 text-center">
                  <button
                    onClick={handleExpand}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t('common:buttons.expand')}
                  </button>
                </div>
              )}

              {result.sources && result.sources.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-300">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">{t('common:labels.sources')}</h4>
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
