
import React, { useState, useCallback } from 'react';
import { analyzeImage, analyzeText } from '../services/geminiService';
import { ImageIcon, FileTextIcon, UploadCloudIcon, AlertTriangleIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';

type AnalysisType = 'image' | 'text';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const ModelContextProtocol: React.FC = () => {
  const [analysisType, setAnalysisType] = useState<AnalysisType>('image');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if(file.size > 4 * 1024 * 1024) {
        setError("Image size should not exceed 4MB.");
        return;
      }
      setError('');
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setResult('');
    }
  };
  
  const handleAnalysis = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setResult('');

    try {
      let analysisResult = '';
      if (analysisType === 'image' && imageFile) {
        const imagePart = await fileToGenerativePart(imageFile);
        analysisResult = await analyzeImage(imagePart.inlineData.data, imagePart.inlineData.mimeType);
      } else if (analysisType === 'text' && inputText.trim()) {
        analysisResult = await analyzeText(inputText);
      } else {
        setError('Please provide input for analysis.');
        setIsLoading(false);
        return;
      }
      setResult(analysisResult);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('An error occurred during analysis. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [analysisType, imageFile, inputText]);

  const canAnalyze = (analysisType === 'image' && imageFile) || (analysisType === 'text' && inputText.trim());

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-text-primary">Model Context Protocol (MCP)</h2>
        <p className="mt-2 text-text-secondary">Analyze images or text to uncover deep cultural and historical context.</p>
      </div>

      <div className="bg-secondary p-2 rounded-lg max-w-md mx-auto flex gap-2">
        <button
          onClick={() => setAnalysisType('image')}
          className={`w-full flex justify-center items-center gap-2 p-2 rounded-md transition-colors ${analysisType === 'image' ? 'bg-accent text-white' : 'hover:bg-primary'}`}
        >
          <ImageIcon className="w-5 h-5" /> Image Analysis
        </button>
        <button
          onClick={() => setAnalysisType('text')}
          className={`w-full flex justify-center items-center gap-2 p-2 rounded-md transition-colors ${analysisType === 'text' ? 'bg-accent text-white' : 'hover:bg-primary'}`}
        >
          <FileTextIcon className="w-5 h-5" /> Text Analysis
        </button>
      </div>

      <div className="bg-secondary rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
        {analysisType === 'image' ? (
          <div className="space-y-4">
            <label htmlFor="image-upload" className="block text-lg font-medium text-text-primary">Upload an Image</label>
            <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-slate-600 px-6 py-10 hover:border-accent transition-colors">
              <div className="text-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="mx-auto h-48 w-auto rounded-md object-contain" />
                ) : (
                  <>
                    <UploadCloudIcon className="mx-auto h-12 w-12 text-text-secondary" />
                    <div className="mt-4 flex text-sm leading-6 text-text-secondary">
                      <p className="pl-1">Drag and drop or click to upload</p>
                    </div>
                    <p className="text-xs leading-5 text-text-secondary">PNG, JPG, GIF up to 4MB</p>
                  </>
                )}
                <input id="image-upload" name="image-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
              </div>
            </div>
             {imageFile && <p className="text-sm text-text-secondary text-center">Selected file: {imageFile.name}</p>}
          </div>
        ) : (
          <div className="space-y-4">
            <label htmlFor="text-input" className="block text-lg font-medium text-text-primary">Enter Text for Analysis</label>
            <textarea
              id="text-input"
              rows={8}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-primary p-3 rounded-md border border-slate-600 focus:ring-2 focus:ring-accent focus:outline-none transition"
              placeholder="Paste a menu, a list of items, or a description here..."
            />
          </div>
        )}
        <div className="mt-6 text-center">
          <button
            onClick={handleAnalysis}
            disabled={!canAnalyze || isLoading}
            className="px-8 py-3 bg-accent text-white font-bold rounded-lg shadow-md hover:bg-accent-hover disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>
      
      {(isLoading || error || result) && (
        <div className="bg-secondary rounded-lg shadow-lg p-6 max-w-3xl mx-auto mt-6 animate-fade-in">
          <h3 className="text-2xl font-bold mb-4 text-center text-text-primary">Analysis Result</h3>
          {isLoading && <div className="flex justify-center p-8"><LoadingSpinner /></div>}
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md flex items-center gap-3">
              <AlertTriangleIcon className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
          {result && <div className="prose prose-invert max-w-none text-text-primary whitespace-pre-wrap">{result}</div>}
        </div>
      )}

    </div>
  );
};

export default ModelContextProtocol;
