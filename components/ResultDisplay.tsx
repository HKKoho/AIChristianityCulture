import React, { useState, useEffect, useCallback } from 'react';
import type { GeneratedPresentation, GeneratedSlide, SavedPresentation } from '../types';

declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

interface SlideViewProps {
    slide: GeneratedSlide;
    speakerImageUrl: string;
    audienceImageUrl: string;
    isActive: boolean;
    onUpdate: (updatedSlide: GeneratedSlide) => void;
}

interface ResultDisplayProps {
  presentation: GeneratedPresentation | SavedPresentation;
  topic: string;
  onReset: () => void;
  onSave: (presentation: GeneratedPresentation) => void;
  isSaved: boolean;
}

const SlideView: React.FC<SlideViewProps> = ({ slide, speakerImageUrl, audienceImageUrl, isActive, onUpdate }) => {
  
  const handleContentBlur = (field: 'title' | 'talkingPoint', value: string, pointIndex?: number) => {
    let updatedSlide = { ...slide };
    if (field === 'title') {
        updatedSlide.title = value;
    } else if (field === 'talkingPoint' && pointIndex !== undefined) {
        const newTalkingPoints = [...slide.talkingPoints];
        newTalkingPoints[pointIndex] = value;
        updatedSlide.talkingPoints = newTalkingPoints;
    }
    onUpdate(updatedSlide);
  };

  return (
    <div className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl border border-gray-700 bg-black">
            <img src={slide.backgroundUrl} alt="Slide background" className="absolute inset-0 w-full h-full object-cover blur-sm scale-110" />
            <div className="absolute inset-0 bg-black/60"></div>
            
            <img src={audienceImageUrl} alt="Audience silhouette" className="absolute bottom-0 left-0 w-full h-1/3 object-cover opacity-30 pointer-events-none" />

            <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-between text-white">
                <div className="flex-grow">
                    <h3 
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleContentBlur('title', e.currentTarget.innerText)}
                      className="text-3xl md:text-4xl font-bold mb-6 text-shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-sm p-1 -m-1"
                    >
                      {slide.title}
                    </h3>
                    <ul className="space-y-3 list-disc list-inside">
                        {slide.talkingPoints.map((point, i) => (
                            <li 
                              key={i} 
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleContentBlur('talkingPoint', e.currentTarget.innerText, i)}
                              className="text-lg md:text-xl text-gray-200 text-shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-sm p-1 -m-1"
                            >
                              {point}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="absolute right-8 bottom-8 md:right-12 md:bottom-12 w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-indigo-500/50 shadow-lg">
                    <img src={speakerImageUrl} alt="AI Speaker" className="w-full h-full object-cover" />
                </div>
            </div>
        </div>
    </div>
  );
};

const RichTextToolbar: React.FC = () => {
    const handleFormat = (command: string, value: string | null = null) => {
        document.execCommand(command, false, value);
    };

    return (
        <div className="flex items-center gap-1 p-2 bg-gray-700 rounded-t-md border-b border-gray-600">
            <button onClick={() => handleFormat('bold')} className="p-2 rounded hover:bg-gray-600" title="加粗">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M5.75 3a.75.75 0 000 1.5h1.597c.54 0 .979.412 1.026.953l.23 2.766c-.226-.061-.465-.094-.712-.094C6.23 8.125 5 9.355 5 10.944v.211c0 1.59 1.23 2.819 2.841 2.819 1.43 0 2.61-1.07 2.818-2.473H13.5a.75.75 0 000-1.5h-2.91c-.052-.249-.126-.489-.22-.723a.75.75 0 00-1.342-.495A3.001 3.001 0 007.559 11l-.23-2.766A2.525 2.525 0 019.826 5.5H11.5a.75.75 0 000-1.5H9.826C8.618 4 7.643 4.935 7.523 6.12L7.292 8.9H7.25a.75.75 0 000 1.5h.073a4.502 4.502 0 01-1.468 2.555.75.75 0 101.13 1.009A2.988 2.988 0 007.84 13.9c.074.45.19.882.343 1.288a.75.75 0 001.4-.476 3.002 3.002 0 01-.32-1.212c1.23-.2 2.158-1.28 2.158-2.527v-.211c0-1.28-1.018-2.35-2.291-2.433l-.23-2.766A2.5 2.5 0 019.826 4.5h1.674a.75.75 0 000-1.5H5.75z" /></svg>
            </button>
            <button onClick={() => handleFormat('italic')} className="p-2 rounded hover:bg-gray-600" title="斜體">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M7.75 3a.75.75 0 000 1.5h1.259l-2.34 9.363A.75.75 0 007.5 15.5h3.75a.75.75 0 000-1.5H9.991l2.34-9.363A.75.75 0 0011.5 3H7.75z" /></svg>
            </button>
             <button onClick={() => handleFormat('insertUnorderedList')} className="p-2 rounded hover:bg-gray-600" title="項目符號列表">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2 5.75A.75.75 0 012.75 5h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 5.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 4.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
            </button>
            <select onChange={(e) => handleFormat('fontSize', e.target.value)} defaultValue="3" className="bg-gray-800 text-white rounded p-1.5 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none" title="字體大小">
                <option value="2">小</option>
                <option value="3">正常</option>
                <option value="5">大</option>
            </select>
        </div>
    );
};


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ presentation, topic, onReset, onSave, isSaved }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [editedScript, setEditedScript] = useState('');
  const [editablePresentation, setEditablePresentation] = useState(presentation);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  
  const stripHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };
  
  // Load volume from localStorage on initial render
  useEffect(() => {
    try {
      const savedVolume = localStorage.getItem('sermon-speech-volume');
      if (savedVolume !== null) {
        setVolume(parseFloat(savedVolume));
      }
    } catch (error) {
        console.error("Could not load volume from local storage", error);
    }
  }, []);

  // Save volume to localStorage whenever it changes
  useEffect(() => {
    try {
        localStorage.setItem('sermon-speech-volume', String(volume));
    } catch (error) {
        console.error("Could not save volume to local storage", error);
    }
  }, [volume]);

  // Effect to stop speech synthesis on component unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  const handleToggleSpeech = useCallback(() => {
    const plainTextScript = stripHtml(editedScript);
    if (!plainTextScript.trim()) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Clear any previous utterances
        const utterance = new SpeechSynthesisUtterance(plainTextScript);
        utterance.lang = 'zh-TW'; // Set language for better pronunciation
        utterance.volume = volume; // Set the volume from state
        utterance.onend = () => {
          setIsSpeaking(false);
        };
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setIsSpeaking(false);
        };
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      } else {
        alert('抱歉，您的瀏覽器不支援語音合成功能。');
      }
    }
  }, [isSpeaking, editedScript, volume]);

  useEffect(() => {
    setEditablePresentation(presentation);
    const isHtml = /<[a-z][\s\S]*>/i.test(presentation.fullScript);
    if (!isHtml) {
        // Convert plain text to paragraphs for better editing experience
        const htmlScript = presentation.fullScript
            .split('\n')
            .filter(p => p.trim() !== '')
            .map(p => `<p>${p}</p>`)
            .join('');
        setEditedScript(htmlScript);
    } else {
        setEditedScript(presentation.fullScript);
    }
  }, [presentation]);
  
  useEffect(() => {
    const slideDuration = 10000; // 10 seconds per slide
    const interval = setInterval(() => {
      setCurrentSlideIndex(prevIndex => (prevIndex + 1) % editablePresentation.slides.length);
    }, slideDuration);

    return () => clearInterval(interval);
  }, [editablePresentation.slides.length]);

  const handleSlideUpdate = (updatedSlide: GeneratedSlide, index: number) => {
    const newSlides = [...editablePresentation.slides];
    newSlides[index] = updatedSlide;
    setEditablePresentation(prev => ({ ...prev, slides: newSlides }));
  };
  
  const handleSaveWrapper = (script: string) => {
    if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }
    const presentationToSave = {
        ...editablePresentation,
        fullScript: script,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, topic: savedTopic, savedAt, ...contentToSave } = presentationToSave as SavedPresentation;
    onSave(contentToSave);
  };

  const handleExportPdf = async () => {
      setIsExporting(true);
      try {
          const { jsPDF } = window.jspdf;
          const html2canvas = window.html2canvas;

          const pdfContainer = document.createElement('div');
          pdfContainer.style.position = 'absolute';
          pdfContainer.style.left = '-9999px';
          pdfContainer.style.width = '800px';
          pdfContainer.style.padding = '40px';
          pdfContainer.style.fontFamily = 'Inter, sans-serif';
          pdfContainer.style.color = '#111827';
          pdfContainer.style.background = 'white';

          pdfContainer.innerHTML = `
              <style>
                p { margin-bottom: 1em; line-height: 1.6; }
                ul { list-style-position: inside; padding-left: 1em; }
                li { margin-bottom: 0.5em; }
                b, strong { font-weight: bold; }
                i, em { font-style: italic; }
              </style>
              <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 24px; border-bottom: 2px solid #ddd; padding-bottom: 8px;">${topic}</h1>
              <div style="background-color: #f3f4f6; border-left: 4px solid #6366f1; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                  <h2 style="font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">講道摘要</h2>
                  <p style="font-size: 14px; font-style: italic; color: #4b5563; margin: 0;">${editablePresentation.summary}</p>
              </div>
              <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">講道手稿</h2>
              <div>${editedScript}</div>
          `;
          
          document.body.appendChild(pdfContainer);

          const canvas = await html2canvas(pdfContainer, { scale: 2 }); // Higher scale for better quality
          
          document.body.removeChild(pdfContainer);

          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = imgWidth / imgHeight;
          const newImgHeight = (pdfWidth / ratio);
          
          let heightLeft = newImgHeight;
          let position = 0;
          
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, newImgHeight);
          heightLeft -= pdf.internal.pageSize.getHeight();

          while (heightLeft > 0) {
              position -= pdf.internal.pageSize.getHeight();
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, newImgHeight);
              heightLeft -= pdf.internal.pageSize.getHeight();
          }

          pdf.save(`sermon-${topic.replace(/\s+/g, '_').toLowerCase()}.pdf`);

      } catch (error) {
          console.error("Failed to export PDF:", error);
          alert("無法匯出 PDF。請檢查主控台是否有錯誤。");
      } finally {
          setIsExporting(false);
      }
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Slideshow */}
        <div className="lg:col-span-3">
            <div className="relative aspect-video">
                {editablePresentation.slides.map((slide, index) => (
                    <SlideView
                        key={index}
                        slide={slide}
                        speakerImageUrl={editablePresentation.speakerImageUrl}
                        audienceImageUrl={editablePresentation.audienceImageUrl}
                        isActive={index === currentSlideIndex}
                        onUpdate={(updatedSlide) => handleSlideUpdate(updatedSlide, index)}
                    />
                ))}
            </div>
            {/* Progress Bar */}
             <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
                <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-linear" 
                    style={{ width: `${((currentSlideIndex + 1) / editablePresentation.slides.length) * 100}%` }}
                ></div>
            </div>
        </div>

        {/* Script & Controls */}
        <div className="lg:col-span-2 bg-gray-800/50 rounded-lg border border-gray-700 flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-gray-600 p-6 pb-3 gap-2">
                <h3 className="text-2xl font-bold">講道手稿</h3>
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                          <path d="M8.25 3.75L6 6H4.5A1.5 1.5 0 003 7.5v5A1.5 1.5 0 004.5 14H6l2.25 2.25a.75.75 0 001.25-.53V4.28a.75.75 0 00-1.25-.53z" />
                          <path d="M11.5 6.162a.75.75 0 011.5 0v7.676a.75.75 0 01-1.5 0V6.162zm2.501.334a.75.75 0 011.498-.058l.002.058v7.084l-.001.058a.75.75 0 01-1.498-.058l-.002-.058V6.496z" />
                        </svg>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-20 md:w-24 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            aria-label="調整音量"
                        />
                    </div>
                    <button
                        onClick={handleToggleSpeech}
                        className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-live="polite"
                        disabled={!stripHtml(editedScript).trim()}
                        aria-label={isSpeaking ? '停止朗讀' : '朗讀手稿'}
                    >
                        {isSpeaking ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M5.25 3A2.25 2.25 0 003 5.25v9.5A2.25 2.25 0 005.25 17h9.5A2.25 2.25 0 0017 14.75v-9.5A2.25 2.25 0 0014.75 3h-9.5z" />
                            </svg>
                            <span className="hidden md:inline">停止</span>
                        </>
                        ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                            <span className="hidden md:inline">朗讀</span>
                        </>
                        )}
                    </button>
                </div>
            </div>
             <div className="mx-6 mb-4 p-4 bg-gray-900/50 border-l-4 border-indigo-500 rounded-r-lg">
                <h4 className="font-semibold text-gray-200 mb-1">講道摘要</h4>
                <p className="text-sm text-gray-400 italic">{editablePresentation.summary}</p>
            </div>
            <div className="flex-grow flex flex-col mx-6" style={{ minHeight: '340px' }}>
                <RichTextToolbar />
                <div
                    contentEditable={true}
                    onInput={(e) => setEditedScript(e.currentTarget.innerHTML)}
                    dangerouslySetInnerHTML={{ __html: editedScript }}
                    className="w-full flex-grow bg-gray-900/50 text-gray-300 leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-b-md p-3 overflow-y-auto"
                    aria-label="講道手稿編輯區"
                    style={{ minHeight: '280px' }}
                />
            </div>
            <div className="mt-6 p-6 pt-6 border-t border-gray-600 flex flex-col space-y-3">
                {!isSaved && (
                    <button
                        onClick={() => handleSaveWrapper(editedScript)}
                        className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900 transition-colors"
                    >
                        儲存講道
                    </button>
                )}
                 <button
                    onClick={handleExportPdf}
                    disabled={isExporting}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-gray-600 rounded-md shadow-sm text-lg font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-colors disabled:opacity-50"
                >
                    {isExporting ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.707a1 1 0 011.414 0L9 11.001V3a1 1 0 112 0v8.001l1.293-1.294a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    )}
                    {isExporting ? '匯出中...' : '匯出為 PDF'}
                </button>
                <button
                    onClick={onReset}
                    className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-colors"
                >
                    建立另一篇講道
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};