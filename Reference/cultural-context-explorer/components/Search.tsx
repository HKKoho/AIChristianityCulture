
import React, { useState, useCallback } from 'react';
import { performSearch } from '../services/geminiService';
import type { SearchResult } from '../types';
import { SearchIcon, AlertTriangleIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      setError('Please enter a search query.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const searchResult = await performSearch(query);
      setResult(searchResult);
    } catch (err) {
      console.error('Search failed:', err);
      setError('An error occurred during the search. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [query]);
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-text-primary">AI-Powered Cultural Search</h2>
        <p className="mt-2 text-text-secondary">Explore information on Agape tables and Communion, grounded in web search.</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 bg-secondary rounded-lg shadow-lg p-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for 'ancient Agape feast menus'..."
            className="flex-1 bg-transparent p-3 text-text-primary focus:outline-none w-full"
            disabled={isLoading}
          />
          <button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            className="p-3 text-white bg-accent rounded-md hover:bg-accent-hover disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            aria-label="Perform Search"
          >
            {isLoading ? <LoadingSpinner /> : <SearchIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {(isLoading || error || result) && (
        <div className="bg-secondary rounded-lg shadow-lg p-6 max-w-3xl mx-auto mt-6 animate-fade-in">
          {isLoading && <div className="flex justify-center p-8"><LoadingSpinner /></div>}
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md flex items-center gap-3">
              <AlertTriangleIcon className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
          {result && (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-center text-text-primary">Search Result</h3>
              <div className="prose prose-invert max-w-none text-text-primary whitespace-pre-wrap">{result.text}</div>
              
              {result.sources && result.sources.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-700">
                  <h4 className="text-lg font-semibold text-text-primary mb-3">Sources:</h4>
                  <ul className="space-y-2 list-disc list-inside">
                    {result.sources.map((source, index) => (
                      <li key={index}>
                        <a
                          href={source.web.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent-hover underline transition-colors"
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

export default Search;
