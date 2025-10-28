import React, { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { BibleVersion } from '../constants';
import JournalModal from './JournalModal';
import Icon from './Icon';

const Header: React.FC = () => {
  const { bibleVersion, setBibleVersion } = useGame();
  const [isJournalOpen, setIsJournalOpen] = useState(false);

  return (
    <>
      <header className="p-4 bg-stone-900 bg-opacity-40 text-white shadow-lg flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl md:text-4xl font-extrabold" style={{fontFamily: "'Trajan Pro', serif"}}>
          聖言之旅
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="bible-version" className="text-sm font-semibold">版本：</label>
            <select
              id="bible-version"
              value={bibleVersion}
              onChange={(e) => setBibleVersion(e.target.value as BibleVersion)}
              className="bg-stone-700 border border-stone-600 text-white text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2"
            >
              {Object.values(BibleVersion).map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setIsJournalOpen(true)}
            className="flex items-center gap-2 bg-amber-800 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105"
            aria-label="開啟智慧卷軸"
          >
            <Icon name="book-open" className="w-5 h-5" />
            <span className="hidden sm:inline">日誌</span>
          </button>
        </div>
      </header>
      {isJournalOpen && <JournalModal onClose={() => setIsJournalOpen(false)} />}
    </>
  );
};

export default Header;