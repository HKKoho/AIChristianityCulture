import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Book } from 'lucide-react';
import type { ReadingContent } from '../types';
import { AISearch } from './AISearch';
import { CulturalExplorer } from './CulturalExplorer';
import { ModelContextProtocol } from './ModelContextProtocol';

interface ReadContentProps {
  onBack: () => void;
}

export const ReadContent: React.FC<ReadContentProps> = ({ onBack }) => {
  const [selectedReading, setSelectedReading] = useState<ReadingContent | null>(null);

  const readingContents: ReadingContent[] = [
    {
      id: '1',
      title: '約翰福音抄本片段',
      titleEn: 'Fragment of the Gospel of John',
      author: '使徒約翰',
      excerpt: '太初有道，道與神同在，道就是神。這道太初與神同在。萬物是藉著他造的；凡被造的，沒有一樣不是藉著他造的。生命在他裡頭，這生命就是人的光。光照在黑暗裡，黑暗卻不接受光。（約翰福音 1:1-5）',
      type: 'scripture',
      period: '公元1-2世紀',
      context: '約翰福音的開篇宣告了基督的神性與創造大能。這段經文在早期教會抄本中被精心保存，是基督教神學的基石。最古老的約翰福音抄本片段（P52）可追溯至公元125年左右，見證了福音書的早期流傳。',
      reflection: '「道成了肉身」是基督教信仰的核心奧秘。這段經文提醒我們，創造天地的神願意成為人，住在我們中間。當我們閱讀這些古老的文字時，我們與歷代信徒一同見證了這偉大的真理。'
    },
    {
      id: '2',
      title: '死海古卷 - 以賽亞書',
      titleEn: 'Dead Sea Scrolls - Book of Isaiah',
      author: '先知以賽亞',
      excerpt: '因有一嬰孩為我們而生，有一子賜給我們。政權必擔在他的肩頭上。他名稱為奇妙、策士、全能的神、永在的父、和平的君。（以賽亞書 9:6）',
      type: 'scripture',
      period: '公元前2世紀',
      context: '1947年在死海附近的昆蘭洞穴發現的死海古卷，包含了完整的以賽亞書卷軸，是迄今發現最古老的希伯來聖經抄本之一。這項發現證實了聖經抄寫的精確性，並見證了彌賽亞預言的古老性。',
      reflection: '以賽亞書的預言在耶穌基督身上應驗，這份古老的抄本讓我們看見神救贖計畫的延續性。從先知的預言到道成肉身，神的話語跨越千年依然有效。'
    },
    {
      id: '3',
      title: '早期教會禮儀文獻',
      titleEn: 'Early Church Liturgical Texts',
      author: '早期教父',
      excerpt: '我們感謝你，我們的父，為了你僕人大衛的聖葡萄樹，就是你藉著你僕人耶穌向我們顯明的。願榮耀歸於你，直到永遠。（《十二使徒遺訓》）',
      type: 'liturgy',
      period: '公元1-2世紀',
      context: '《十二使徒遺訓》（Didache）是最早的基督教文獻之一，記錄了早期教會的禮儀實踐，包括聖餐禮、洗禮和禱告。這份文獻讓我們一窺使徒時代教會的敬拜生活。',
      reflection: '早期基督徒如何慶祝聖餐？這些古老的禮儀文本連結我們與使徒時代的教會。他們的禱告與感恩，在今日的教會中仍然迴響。'
    },
    {
      id: '4',
      title: '奧古斯丁《懺悔錄》',
      titleEn: 'Augustine\'s Confessions',
      author: '聖奧古斯丁',
      excerpt: '你為自己創造了我們，我們的心如不安息在你懷中便不會安寧。（《懺悔錄》第一卷）',
      type: 'devotional',
      period: '公元397-400年',
      context: '奧古斯丁的《懺悔錄》是西方文學史上第一部自傳體作品，也是基督教靈修文學的經典。在這部作品中，奧古斯丁坦誠地記錄了自己從罪惡到歸信的心路歷程，深刻影響了後世的神學思想。',
      reflection: '奧古斯丁的懺悔提醒我們，人心深處對神有著難以抑制的渴望。無論我們如何尋求世界的滿足，唯有在神裡面才能找到真正的安息。'
    },
    {
      id: '5',
      title: '加爾文《基督教要義》',
      titleEn: 'Calvin\'s Institutes of the Christian Religion',
      author: '約翰·加爾文',
      excerpt: '認識神和認識自己，這二者之間有著密不可分的關聯。我們不能真正認識自己，除非先認識神；我們也不能真正認識神，除非先認識自己。',
      type: 'theology',
      period: '公元1536年（初版）',
      context: '加爾文的《基督教要義》是宗教改革時期最重要的神學著作之一，系統地闡述了改革宗神學。這部作品影響了後世新教神學的發展，成為許多教會的神學基礎。',
      reflection: '加爾文提醒我們，神學不僅是理性的探究，更是自我認識的旅程。當我們認識神的聖潔時，才能看見自己的有限；當我們認識神的恩典時，才能理解救恩的寶貴。'
    },
    {
      id: '6',
      title: '克萊沃的伯爾納《論愛神》',
      titleEn: 'Bernard of Clairvaux - On Loving God',
      author: '克萊沃的伯爾納',
      excerpt: '愛神的原因就是神自己，愛神的方式就是無限度地愛。神配得無限的愛，因為他先無限地愛了我們。',
      type: 'devotional',
      period: '公元12世紀',
      context: '伯爾納是中世紀最重要的靈修大師之一，他的作品強調對神的愛與默想。《論愛神》探討了愛神的四個階段，從為己愛神到純粹為神自己而愛神，展現了靈修生命的成長歷程。',
      reflection: '愛神不是一種義務，而是對神之愛的回應。伯爾納的教導提醒我們，靈修生命是一個不斷成長的旅程，從自我中心到以神為中心，從有條件的愛到無條件的愛。'
    }
  ];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'scripture': return '聖經';
      case 'liturgy': return '禮儀';
      case 'theology': return '神學';
      case 'devotional': return '靈修';
      case 'historical': return '歷史';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'scripture': return 'bg-rose-100 text-rose-700';
      case 'liturgy': return 'bg-blue-100 text-blue-700';
      case 'theology': return 'bg-purple-100 text-purple-700';
      case 'devotional': return 'bg-amber-100 text-amber-700';
      case 'historical': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (selectedReading) {
    return (
      <>
      <div className="w-full max-w-4xl mx-auto p-6">
        <button
          onClick={() => setSelectedReading(null)}
          className="flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回閱讀列表
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-rose-500 to-rose-700 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Book className="w-8 h-8" />
              <h1 className="text-4xl font-bold">{selectedReading.title}</h1>
            </div>
            <p className="text-xl opacity-90">{selectedReading.titleEn}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/20">
                {getTypeLabel(selectedReading.type)}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/20">
                {selectedReading.author}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/20">
                {selectedReading.period}
              </span>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">經文/節錄</h2>
              <div className="bg-rose-50 border-l-4 border-rose-500 p-6 rounded">
                <p className="text-gray-800 leading-relaxed text-lg italic">{selectedReading.excerpt}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">歷史背景</h2>
              <p className="text-gray-700 leading-relaxed">{selectedReading.context}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">靈修默想</h2>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <p className="text-gray-700 leading-relaxed">{selectedReading.reflection}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AISearch category="read" />
      <CulturalExplorer category="read" />
      <ModelContextProtocol category="read" />
      </>
    );
  }

  return (
    <>
      <div className="w-full max-w-6xl mx-auto p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回首頁
        </button>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-rose-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent">
              讀
            </h1>
          </div>
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">Read</h2>
          <p className="text-xl text-gray-600">
            閱讀與默想：聖經抄本、手稿歷史與經文研究
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {readingContents.map((reading) => (
            <button
              key={reading.id}
              onClick={() => setSelectedReading(reading)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group text-left"
            >
              <div className="bg-gradient-to-br from-rose-500 to-rose-700 p-6 text-white">
                <BookOpen className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-1">{reading.title}</h3>
                <p className="text-rose-100">{reading.titleEn}</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm italic">{reading.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(reading.type)}`}>
                    {getTypeLabel(reading.type)}
                  </span>
                  <span className="text-xs text-gray-500">{reading.author}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <AISearch category="read" />
      <CulturalExplorer category="read" />
      <ModelContextProtocol category="read" />
    </>
  );
};
