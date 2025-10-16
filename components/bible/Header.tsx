import React, { useState } from 'react';
import { useGame } from '../../hooks/useGame';
import { BibleVersion } from '../../Bible/constants';
import JournalModal from './JournalModal';
import Icon from './Icon';

const Header: React.FC = () => {
  const { bibleVersion, setBibleVersion, journalEntries } = useGame();
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [showInstruction, setShowInstruction] = useState(false);

  const handleJournalClick = () => {
    if (journalEntries.length === 0) {
      setShowInstruction(true);
    } else {
      setIsJournalOpen(true);
    }
  };

  return (
    <>
      <header className="p-4 bg-stone-900 bg-opacity-40 text-white shadow-lg flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-xl md:text-3xl font-extrabold" style={{fontFamily: "'Trajan Pro', serif"}}>
          聖言之旅: 探索『唯獨聖經』認證的信仰
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
            onClick={handleJournalClick}
            className="flex items-center gap-2 bg-amber-800 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105"
            aria-label="開啟智慧卷軸"
          >
            <Icon name="book-open" className="w-5 h-5" />
            <span className="hidden sm:inline">日誌</span>
          </button>
        </div>
      </header>

      {/* Instruction Modal */}
      {showInstruction && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setShowInstruction(false)}
        >
          <div
            className="bg-cover bg-center rounded-lg shadow-2xl w-full max-w-2xl border-4 border-amber-900 text-stone-900 p-8 relative"
            style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/old-paper.png')"}}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold text-amber-900" style={{fontFamily: "'Trajan Pro', serif"}}>
                📜 如何開始您的旅程
              </h2>
              <button
                onClick={() => setShowInstruction(false)}
                className="text-stone-600 hover:text-stone-900 transition-colors"
                aria-label="關閉"
              >
                <Icon name="x" className="w-8 h-8"/>
              </button>
            </div>

            <div className="space-y-4 text-stone-800">
              <p className="text-lg font-semibold">
                歡迎來到聖言之旅！您的智慧卷軸目前是空的。
              </p>

              <div className="bg-amber-50/70 border-l-4 border-amber-600 p-4 rounded-r-lg">
                <h3 className="font-bold text-amber-900 mb-2">📖 任務日誌功能：</h3>
                <p className="mb-2">完成地圖上的任務以解鎖智慧內容。每完成一個任務，您將獲得：</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>聖經知識與洞見</li>
                  <li>神學智慧的記錄</li>
                  <li>屬靈成長的里程碑</li>
                </ul>
              </div>

              <div className="bg-amber-50/70 border-l-4 border-amber-600 p-4 rounded-r-lg">
                <h3 className="font-bold text-amber-900 mb-2">📜 聖經閱讀功能：</h3>
                <p>即使沒有完成任務，您也可以使用「聖經閱讀」標籤：</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>瀏覽舊約39卷、新約27卷</li>
                  <li>選擇任何書卷和章節</li>
                  <li>在 Bible Gateway 閱讀經文</li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-amber-300 flex gap-3">
                <button
                  onClick={() => setShowInstruction(false)}
                  className="flex-1 px-6 py-3 bg-stone-600 hover:bg-stone-700 text-white font-bold rounded-lg transition-all"
                >
                  開始探索地圖
                </button>
                <button
                  onClick={() => {
                    setShowInstruction(false);
                    setIsJournalOpen(true);
                  }}
                  className="flex-1 px-6 py-3 bg-amber-800 hover:bg-amber-700 text-white font-bold rounded-lg transition-all"
                >
                  直接閱讀聖經 →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isJournalOpen && <JournalModal onClose={() => setIsJournalOpen(false)} />}
    </>
  );
};

export default Header;