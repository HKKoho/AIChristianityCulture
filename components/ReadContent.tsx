import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Book } from 'lucide-react';
import type { ReadingContent } from '../types';
import { AISearch } from './AISearch';
import { CulturalExplorer } from './CulturalExplorer';
import { ModelContextProtocol } from './ModelContextProtocol';
import { Slideshow } from './Slideshow';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

interface ReadContentProps {
  onBack: () => void;
}

export const ReadContent: React.FC<ReadContentProps> = ({ onBack }) => {
  const { t, i18n } = useTranslation(['read', 'common']);
  const [selectedReading, setSelectedReading] = useState<ReadingContent | null>(null);
  const isEnglish = i18n.language === 'en';

  // Images for the Read category slideshow
  const readImages = [
    '/ReadBible.jpeg',
    '/Lectron.jpg',
    '/Lutrin.jpeg'
  ];

  const readingContents: ReadingContent[] = [
    {
      id: '1',
      title: '約翰福音抄本片段',
      titleEn: 'Fragment of the Gospel of John',
      author: '使徒約翰',
      authorEn: 'Apostle John',
      excerpt: '太初有道，道與神同在，道就是神。這道太初與神同在。萬物是藉著他造的；凡被造的，沒有一樣不是藉著他造的。生命在他裡頭，這生命就是人的光。光照在黑暗裡，黑暗卻不接受光。（約翰福音 1:1-5）',
      excerptEn: 'In the beginning was the Word, and the Word was with God, and the Word was God. He was with God in the beginning. Through him all things were made; without him nothing was made that has been made. In him was life, and that life was the light of all mankind. The light shines in the darkness, and the darkness has not overcome it. (John 1:1-5)',
      type: 'scripture',
      period: '公元1-2世紀',
      periodEn: '1st-2nd Century AD',
      context: '約翰福音的開篇宣告了基督的神性與創造大能。這段經文在早期教會抄本中被精心保存，是基督教神學的基石。最古老的約翰福音抄本片段（P52）可追溯至公元125年左右，見證了福音書的早期流傳。',
      contextEn: 'The opening of the Gospel of John proclaims Christ\'s divinity and creative power. This passage was carefully preserved in early church manuscripts and is a cornerstone of Christian theology. The oldest fragment of John\'s Gospel (P52) dates to around 125 AD, witnessing the early circulation of the Gospel.',
      reflection: '「道成了肉身」是基督教信仰的核心奧秘。這段經文提醒我們，創造天地的神願意成為人，住在我們中間。當我們閱讀這些古老的文字時，我們與歷代信徒一同見證了這偉大的真理。',
      reflectionEn: 'The "Word became flesh" is the central mystery of Christian faith. This passage reminds us that the God who created heaven and earth was willing to become human and dwell among us. When we read these ancient words, we join believers throughout the ages in witnessing this great truth.'
    },
    {
      id: '2',
      title: '死海古卷 - 以賽亞書',
      titleEn: 'Dead Sea Scrolls - Book of Isaiah',
      author: '先知以賽亞',
      authorEn: 'Prophet Isaiah',
      excerpt: '因有一嬰孩為我們而生，有一子賜給我們。政權必擔在他的肩頭上。他名稱為奇妙、策士、全能的神、永在的父、和平的君。（以賽亞書 9:6）',
      excerptEn: 'For to us a child is born, to us a son is given, and the government will be on his shoulders. And he will be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace. (Isaiah 9:6)',
      type: 'scripture',
      period: '公元前2世紀',
      periodEn: '2nd Century BC',
      context: '1947年在死海附近的昆蘭洞穴發現的死海古卷，包含了完整的以賽亞書卷軸，是迄今發現最古老的希伯來聖經抄本之一。這項發現證實了聖經抄寫的精確性，並見證了彌賽亞預言的古老性。',
      contextEn: 'The Dead Sea Scrolls discovered in 1947 in the Qumran caves near the Dead Sea include a complete scroll of Isaiah, one of the oldest Hebrew Bible manuscripts ever found. This discovery confirms the accuracy of biblical copying and witnesses to the ancient nature of Messianic prophecies.',
      reflection: '以賽亞書的預言在耶穌基督身上應驗，這份古老的抄本讓我們看見神救贖計畫的延續性。從先知的預言到道成肉身，神的話語跨越千年依然有效。',
      reflectionEn: 'The prophecies of Isaiah were fulfilled in Jesus Christ. This ancient manuscript shows us the continuity of God\'s redemptive plan. From prophetic word to incarnation, God\'s Word remains effective across millennia.'
    },
    {
      id: '3',
      title: '早期教會禮儀文獻',
      titleEn: 'Early Church Liturgical Texts',
      author: '早期教父',
      authorEn: 'Early Church Fathers',
      excerpt: '我們感謝你，我們的父，為了你僕人大衛的聖葡萄樹，就是你藉著你僕人耶穌向我們顯明的。願榮耀歸於你，直到永遠。（《十二使徒遺訓》）',
      excerptEn: 'We give thanks to you, our Father, for the holy vine of David your servant, which you have made known to us through Jesus your servant. To you be glory forever. (The Didache)',
      type: 'liturgy',
      period: '公元1-2世紀',
      periodEn: '1st-2nd Century AD',
      context: '《十二使徒遺訓》（Didache）是最早的基督教文獻之一，記錄了早期教會的禮儀實踐，包括聖餐禮、洗禮和禱告。這份文獻讓我們一窺使徒時代教會的敬拜生活。',
      contextEn: 'The Didache is one of the earliest Christian documents, recording the liturgical practices of the early church, including Eucharist, baptism, and prayer. This document gives us a glimpse into the worship life of the apostolic church.',
      reflection: '早期基督徒如何慶祝聖餐？這些古老的禮儀文本連結我們與使徒時代的教會。他們的禱告與感恩，在今日的教會中仍然迴響。',
      reflectionEn: 'How did early Christians celebrate Communion? These ancient liturgical texts connect us with the apostolic church. Their prayers and thanksgiving still echo in today\'s church.'
    },
    {
      id: '4',
      title: '奧古斯丁《懺悔錄》',
      titleEn: 'Augustine\'s Confessions',
      author: '聖奧古斯丁',
      authorEn: 'Saint Augustine',
      excerpt: '你為自己創造了我們，我們的心如不安息在你懷中便不會安寧。（《懺悔錄》第一卷）',
      excerptEn: 'You have made us for yourself, O Lord, and our hearts are restless until they rest in you. (Confessions, Book I)',
      type: 'devotional',
      period: '公元397-400年',
      periodEn: '397-400 AD',
      context: '奧古斯丁的《懺悔錄》是西方文學史上第一部自傳體作品，也是基督教靈修文學的經典。在這部作品中，奧古斯丁坦誠地記錄了自己從罪惡到歸信的心路歷程，深刻影響了後世的神學思想。',
      contextEn: 'Augustine\'s Confessions is the first autobiographical work in Western literature and a classic of Christian devotional writing. In this work, Augustine candidly records his journey from sin to conversion, profoundly influencing later theological thought.',
      reflection: '奧古斯丁的懺悔提醒我們，人心深處對神有著難以抑制的渴望。無論我們如何尋求世界的滿足，唯有在神裡面才能找到真正的安息。',
      reflectionEn: 'Augustine\'s confession reminds us that deep in the human heart is an irrepressible longing for God. No matter how we seek satisfaction in the world, only in God can we find true rest.'
    },
    {
      id: '5',
      title: '加爾文《基督教要義》',
      titleEn: 'Calvin\'s Institutes of the Christian Religion',
      author: '約翰·加爾文',
      authorEn: 'John Calvin',
      excerpt: '認識神和認識自己，這二者之間有著密不可分的關聯。我們不能真正認識自己，除非先認識神；我們也不能真正認識神，除非先認識自己。',
      excerptEn: 'There is an inseparable connection between the knowledge of God and the knowledge of ourselves. We cannot truly know ourselves unless we first know God; nor can we truly know God unless we first know ourselves.',
      type: 'theology',
      period: '公元1536年（初版）',
      periodEn: '1536 AD (First Edition)',
      context: '加爾文的《基督教要義》是宗教改革時期最重要的神學著作之一，系統地闡述了改革宗神學。這部作品影響了後世新教神學的發展，成為許多教會的神學基礎。',
      contextEn: 'Calvin\'s Institutes of the Christian Religion is one of the most important theological works of the Reformation, systematically expounding Reformed theology. This work has influenced the development of Protestant theology and become the theological foundation for many churches.',
      reflection: '加爾文提醒我們，神學不僅是理性的探究，更是自我認識的旅程。當我們認識神的聖潔時，才能看見自己的有限；當我們認識神的恩典時，才能理解救恩的寶貴。',
      reflectionEn: 'Calvin reminds us that theology is not merely rational inquiry, but a journey of self-knowledge. When we know God\'s holiness, we see our own limitations; when we know God\'s grace, we understand the preciousness of salvation.'
    },
    {
      id: '6',
      title: '克萊沃的伯爾納《論愛神》',
      titleEn: 'Bernard of Clairvaux - On Loving God',
      author: '克萊沃的伯爾納',
      authorEn: 'Bernard of Clairvaux',
      excerpt: '愛神的原因就是神自己，愛神的方式就是無限度地愛。神配得無限的愛，因為他先無限地愛了我們。',
      excerptEn: 'The reason for loving God is God himself, and the measure of our love should be to love without measure. God deserves infinite love because he first loved us infinitely.',
      type: 'devotional',
      period: '公元12世紀',
      periodEn: '12th Century AD',
      context: '伯爾納是中世紀最重要的靈修大師之一，他的作品強調對神的愛與默想。《論愛神》探討了愛神的四個階段，從為己愛神到純粹為神自己而愛神，展現了靈修生命的成長歷程。',
      contextEn: 'Bernard was one of the most important spiritual masters of the Middle Ages. His works emphasize love for God and meditation. "On Loving God" explores four stages of loving God, from loving God for one\'s own sake to loving God purely for himself, revealing the growth process of spiritual life.',
      reflection: '愛神不是一種義務，而是對神之愛的回應。伯爾納的教導提醒我們，靈修生命是一個不斷成長的旅程，從自我中心到以神為中心，從有條件的愛到無條件的愛。',
      reflectionEn: 'Loving God is not a duty but a response to God\'s love. Bernard\'s teaching reminds us that spiritual life is a journey of continuous growth, from self-centeredness to God-centeredness, from conditional love to unconditional love.'
    }
  ];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'scripture': return t('read:scripture');
      case 'liturgy': return t('read:liturgy');
      case 'theology': return t('read:theology');
      case 'devotional': return t('read:devotional');
      case 'historical': return t('read:historical');
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
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setSelectedReading(null)}
            className="flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('common:navigation.backToList')}
          </button>
          <LanguageSwitcher />
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-rose-500 to-rose-700 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Book className="w-8 h-8" />
              <h1 className="text-4xl font-bold">
                {isEnglish ? selectedReading.titleEn : selectedReading.title}
              </h1>
            </div>
            <p className="text-xl opacity-90">
              {isEnglish ? selectedReading.title : selectedReading.titleEn}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/20">
                {getTypeLabel(selectedReading.type)}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/20">
                {isEnglish && selectedReading.authorEn ? selectedReading.authorEn : selectedReading.author}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/20">
                {isEnglish && selectedReading.periodEn ? selectedReading.periodEn : selectedReading.period}
              </span>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('read:excerpt')}</h2>
              <div className="bg-rose-50 border-l-4 border-rose-500 p-6 rounded">
                <p className="text-gray-800 leading-relaxed text-lg italic">
                  {isEnglish && selectedReading.excerptEn ? selectedReading.excerptEn : selectedReading.excerpt}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('read:context')}</h2>
              <p className="text-gray-700 leading-relaxed">
                {isEnglish && selectedReading.contextEn ? selectedReading.contextEn : selectedReading.context}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('read:reflection')}</h2>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <p className="text-gray-700 leading-relaxed">
                  {isEnglish && selectedReading.reflectionEn ? selectedReading.reflectionEn : selectedReading.reflection}
                </p>
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
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('common:navigation.backToHome')}
          </button>
          <LanguageSwitcher />
        </div>

        {/* Slideshow Section */}
        <div className="mb-8">
          <Slideshow images={readImages} interval={3000} className="rounded-2xl shadow-lg" />
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-rose-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent">
              {t('read:title')}
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            {t('read:subtitle')}
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
                <h3 className="text-2xl font-bold mb-1">
                  {isEnglish ? reading.titleEn : reading.title}
                </h3>
                <p className="text-rose-100">
                  {isEnglish ? reading.title : reading.titleEn}
                </p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm italic">
                  {isEnglish && reading.excerptEn ? reading.excerptEn : reading.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(reading.type)}`}>
                    {getTypeLabel(reading.type)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {isEnglish && reading.authorEn ? reading.authorEn : reading.author}
                  </span>
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
