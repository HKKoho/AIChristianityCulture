import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ImageIcon, FileText, Upload, AlertTriangle, Volume2, StopCircle } from 'lucide-react';
import { analyzeImage, analyzeText } from '../services/multiProviderChatService';
import { useTranslation } from 'react-i18next';

type AnalysisType = 'image' | 'text';

interface ModelContextProtocolProps {
  category?: 'eat' | 'walk' | 'listen' | 'see' | 'read' | 'meditate';
}

const fileToBase64 = async (file: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve({ data: base64, mimeType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const ModelContextProtocol: React.FC<ModelContextProtocolProps> = ({ category }) => {
  const { t } = useTranslation(['common']);
  const [analysisType, setAnalysisType] = useState<AnalysisType>('image');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const getCategoryContext = () => {
    switch (category) {
      case 'eat':
        return 'food traditions, communion, and agape feasts in Christianity';
      case 'walk':
        return 'pilgrimage routes, holy sites, and Christian walking traditions';
      case 'listen':
        return 'sacred music, hymns, chants, and Christian audio traditions';
      case 'see':
        return 'Christian art, architecture, icons, and visual culture';
      case 'read':
        return 'biblical manuscripts, theological texts, and Christian literature';
      case 'meditate':
        return 'spiritual practices, contemplation, and Christian meditation';
      default:
        return 'Christian culture and traditions';
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setError(t('common:messages.fileSizeLimit'));
        return;
      }
      setError('');
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setResult('');
    }
  };

  const handleAnalysis = useCallback(async (expanded: boolean = false) => {
    setIsLoading(true);
    setError('');
    setResult('');
    setIsExpanded(expanded);

    try {
      let analysisResult = '';
      const context = getCategoryContext();
      const wordLimit = expanded ? 500 : 100;

      if (analysisType === 'image' && imageFile) {
        const { data, mimeType } = await fileToBase64(imageFile);
        analysisResult = await analyzeImage(data, mimeType, context, wordLimit);
      } else if (analysisType === 'text' && inputText.trim()) {
        analysisResult = await analyzeText(inputText, context, wordLimit);
      } else {
        setError(t('common:messages.pleaseProvideInput'));
        setIsLoading(false);
        return;
      }
      setResult(analysisResult);
    } catch (err) {
      console.error(t('common:messages.analysisFailed'), err);
      setError(t('common:messages.analysisError'));
    } finally {
      setIsLoading(false);
    }
  }, [analysisType, imageFile, inputText, category, t]);

  const handleExpand = useCallback(async () => {
    await handleAnalysis(true);
  }, [handleAnalysis]);

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

    window.speechSynthesis.speak(utterance);
  }, [t]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const canAnalyze = (analysisType === 'image' && imageFile) || (analysisType === 'text' && inputText.trim());

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">模型上下文協議 (MCP)</h2>
        <h3 className="text-xl text-gray-600 mb-2">Model Context Protocol</h3>
        <p className="text-gray-600">分析圖片或文字以揭示深層的文化與歷史脈絡</p>
      </div>

      {/* Analysis Type Toggle */}
      <div className="bg-gray-100 p-2 rounded-lg max-w-md mx-auto flex gap-2">
        <button
          onClick={() => setAnalysisType('image')}
          className={`w-full flex justify-center items-center gap-2 p-3 rounded-md transition-all ${
            analysisType === 'image'
              ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-md'
              : 'hover:bg-gray-200 text-gray-700'
          }`}
        >
          <ImageIcon className="w-5 h-5" />
          <span className="font-semibold">{t('common:labels.imageAnalysis')}</span>
        </button>
        <button
          onClick={() => setAnalysisType('text')}
          className={`w-full flex justify-center items-center gap-2 p-3 rounded-md transition-all ${
            analysisType === 'text'
              ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-md'
              : 'hover:bg-gray-200 text-gray-700'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="font-semibold">{t('common:labels.textAnalysis')}</span>
        </button>
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
        {analysisType === 'image' ? (
          <div className="space-y-4">
            <label htmlFor="image-upload" className="block text-lg font-medium text-gray-800">
              {t('common:labels.uploadImage')}
            </label>
            <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10 hover:border-indigo-500 transition-colors cursor-pointer">
              <div className="text-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="mx-auto h-48 w-auto rounded-md object-contain" />
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="image-upload"
                        className="relative cursor-pointer rounded-md font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        <span>{t('common:buttons.clickToUpload')}</span>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                      </label>
                      <p className="pl-1">{t('common:messages.dragDropHint')}</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">{t('common:messages.fileFormats')}</p>
                  </>
                )}
                {!imagePreview && (
                  <input
                    id="image-upload"
                    name="image-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                )}
              </div>
            </div>
            {imageFile && <p className="text-sm text-gray-600 text-center">{t('common:messages.fileSelected')} {imageFile.name}</p>}
          </div>
        ) : (
          <div className="space-y-4">
            <label htmlFor="text-input" className="block text-lg font-medium text-gray-800">
              {t('common:labels.textToAnalyze')}
            </label>
            <textarea
              id="text-input"
              rows={8}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-gray-50 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              placeholder={t('common:placeholders.enterText')}
            />
          </div>
        )}
        <div className="mt-6 text-center">
          <button
            onClick={handleAnalysis}
            disabled={!canAnalyze || isLoading}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-bold rounded-lg shadow-md hover:from-indigo-600 hover:to-indigo-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
            {isLoading ? t('common:buttons.analyzing') : t('common:buttons.startAnalysis')}
          </button>
        </div>
      </div>

      {/* Results Area */}
      {(isLoading || error || result) && (
        <div ref={resultRef} className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-800">
              {t('common:labels.analysisResult')}
              {result && !isExpanded && (
                <span className="text-sm font-normal text-gray-500 ml-2">{t('common:messages.wordLimit')}</span>
              )}
            </h3>
            {result && (
              <button
                onClick={isSpeaking ? stopSpeaking : () => speakText(result)}
                className={`p-2 rounded-lg transition-colors ${
                  isSpeaking
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }`}
                title={isSpeaking ? t('common:buttons.stopPlaying') : t('common:buttons.readAloud')}
              >
                {isSpeaking ? <StopCircle className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}
          </div>
          {isLoading && (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
              <div className="prose prose-lg max-w-none text-gray-700">
                <div className="whitespace-pre-wrap">{result}</div>
              </div>
              {!isExpanded && (
                <div className="mt-4 text-center">
                  <button
                    onClick={handleExpand}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {t('common:buttons.expand')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
