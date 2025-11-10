import React, { useState } from 'react';
import { ArrowLeft, Headphones, Play, Pause, Music } from 'lucide-react';
import type { AudioContent } from '../types';
import { AISearch } from './AISearch';
import { CulturalExplorer } from './CulturalExplorer';
import { ModelContextProtocol } from './ModelContextProtocol';
import { Slideshow } from './Slideshow';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

interface ListenProps {
  onBack: () => void;
}

export const Listen: React.FC<ListenProps> = ({ onBack }) => {
  const { t, i18n } = useTranslation(['listen', 'common']);
  const [selectedAudio, setSelectedAudio] = useState<AudioContent | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isEnglish = i18n.language === 'en';

  // Helper function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : '';
  };

  // Images for the Listen category slideshow
  const listenImages = [
    '/Worship.jpeg',
    '/ChurchWorhsip.jpeg',
    '/Lutrin.jpeg',
    '/Lectron.jpg'
  ];

  const audioContents: AudioContent[] = [
    {
      id: '1',
      title: '奇異恩典',
      titleEn: 'Amazing Grace',
      description: '最著名的基督教聖詩之一，由約翰·牛頓作詞，表達神的恩典與救贖。',
      descriptionEn: 'One of the most famous Christian hymns, written by John Newton, expressing God\'s grace and redemption.',
      type: 'hymn',
      audioUrl: 'https://www.youtube.com/watch?v=mZlUFj_VvGE',
      audioUrlEn: 'https://www.youtube.com/watch?v=CDdvReNKKuk',
      duration: '4:30',
      background: '約翰·牛頓（1725-1807）曾是奴隸船船長，後來歸信基督教並成為牧師。這首詩歌寫於1772年，反映了他從罪惡生活中被拯救的經歷。歌詞「我曾迷失，如今被尋回；曾經盲目，如今看見」成為基督教信仰中悔改與重生的經典表達。',
      backgroundEn: 'John Newton (1725-1807) was a slave ship captain who later converted to Christianity and became a minister. Written in 1772, this hymn reflects his experience of being saved from a life of sin. The lyrics "I once was lost, but now am found; was blind, but now I see" have become a classic expression of repentance and rebirth in Christian faith.',
      transcript: '奇異恩典，何等甘甜\n我罪已得赦免\n前我失喪，今被尋回\n瞎眼今得看見\n\n如此恩典，使我敬畏\n使我心得安慰\n初信之時，即蒙恩惠\n真是何等寶貴\n\n許多危險，試煉網羅\n我已安然經過\n靠主恩典，安全不怕\n更引導我歸家',
      transcriptEn: 'Amazing grace, how sweet the sound\nThat saved a wretch like me\nI once was lost, but now am found\nWas blind, but now I see\n\n\'Twas grace that taught my heart to fear\nAnd grace my fears relieved\nHow precious did that grace appear\nThe hour I first believed\n\nThrough many dangers, toils and snares\nI have already come\n\'Tis grace hath brought me safe thus far\nAnd grace will lead me home'
    },
    {
      id: '2',
      title: '格列高利聖歌',
      titleEn: 'Gregorian Chant',
      description: '中世紀天主教會的禮儀音樂，以單聲部聖歌為特色。',
      descriptionEn: 'Medieval Catholic liturgical music characterized by monophonic chant.',
      type: 'chant',
      audioUrl: 'https://www.youtube.com/watch?v=W-hrBhA4XkM',
      audioUrlEn: 'https://www.youtube.com/watch?v=W-hrBhA4XkM',
      duration: '6:15',
      background: '格列高利聖歌起源於中世紀早期，以教宗格列高利一世命名。這種音樂形式在9-10世紀達到巔峰，特點是單聲部、自由節奏、拉丁文歌詞。聖歌用於天主教彌撒和日課禮儀中，營造莊嚴神聖的氛圍。',
      backgroundEn: 'Gregorian chant originated in the early Middle Ages, named after Pope Gregory I. This musical form reached its peak in the 9th-10th centuries, characterized by monophonic texture, free rhythm, and Latin lyrics. The chants are used in Catholic Mass and Divine Office liturgy, creating a solemn and sacred atmosphere.',
      transcript: 'Kyrie eleison（求主憐憫）\nChriste eleison（求基督憐憫）\nKyrie eleison（求主憐憫）\n\nGloria in excelsis Deo（榮耀歸於至高神）\nEt in terra pax hominibus（在地上平安歸於祂所喜悅的人）',
      transcriptEn: 'Kyrie eleison (Lord, have mercy)\nChriste eleison (Christ, have mercy)\nKyrie eleison (Lord, have mercy)\n\nGloria in excelsis Deo (Glory to God in the highest)\nEt in terra pax hominibus (And on earth peace to people of good will)'
    },
    {
      id: '3',
      title: '主禱文詠唱',
      titleEn: 'The Lord\'s Prayer Chant',
      description: '耶穌教導門徒的禱告，以聖歌形式詠唱。',
      descriptionEn: 'The prayer Jesus taught his disciples, sung in chant form.',
      type: 'prayer',
      audioUrl: 'https://www.youtube.com/watch?v=jKVb7FZlTvI',
      audioUrlEn: 'https://www.youtube.com/watch?v=dL32KkMcHYs',
      duration: '3:45',
      background: '主禱文記載於馬太福音6:9-13和路加福音11:2-4。這是基督教最重要的禱告文之一，耶穌用它教導門徒如何禱告。歷代教會發展出各種音樂形式來詠唱主禱文，從簡單的單聲吟唱到複雜的合唱作品。',
      backgroundEn: 'The Lord\'s Prayer is recorded in Matthew 6:9-13 and Luke 11:2-4. It is one of Christianity\'s most important prayers, used by Jesus to teach disciples how to pray. Throughout history, churches have developed various musical forms to chant this prayer, from simple monophonic singing to complex choral works.',
      transcript: '我們在天上的父\n願人都尊你的名為聖\n願你的國降臨\n願你的旨意行在地上\n如同行在天上\n\n我們日用的飲食\n今日賜給我們\n免我們的債\n如同我們免了人的債\n不叫我們遇見試探\n救我們脫離兇惡\n\n因為國度、權柄、榮耀\n全是你的，直到永遠\n阿們',
      transcriptEn: 'Our Father in heaven\nHallowed be your name\nYour kingdom come\nYour will be done\nOn earth as it is in heaven\n\nGive us today our daily bread\nAnd forgive us our debts\nAs we also have forgiven our debtors\nAnd lead us not into temptation\nBut deliver us from the evil one\n\nFor yours is the kingdom\nAnd the power and the glory\nForever\nAmen'
    },
    {
      id: '4',
      title: '古老十架',
      titleEn: 'The Old Rugged Cross',
      description: '讚美基督十字架的經典聖詩，由喬治·班納德創作。',
      descriptionEn: 'A classic hymn praising Christ\'s cross, written by George Bennard.',
      type: 'hymn',
      audioUrl: 'https://www.youtube.com/watch?v=Rwu8dB-9MJ0',
      audioUrlEn: 'https://www.youtube.com/watch?v=kSelSPd1_7M',
      duration: '5:00',
      background: '這首聖詩由美國牧師喬治·班納德（1873-1958）於1912年創作。歌詞深刻描繪了十字架的意義：雖然世人藐視，但對基督徒而言，它象徵著基督的犧牲與愛。副歌「我要永遠愛高舉那古老的十架」表達了對救恩的感恩與委身。',
      backgroundEn: 'This hymn was written by American pastor George Bennard (1873-1958) in 1912. The lyrics profoundly portray the meaning of the cross: though despised by the world, for Christians it symbolizes Christ\'s sacrifice and love. The chorus "I will cling to the old rugged cross" expresses gratitude for salvation and commitment.',
      transcript: '各各他山嶺上，孤立古舊十架\n這乃是羞辱痛苦記號\n神愛子主耶穌，為我們被釘死\n這十架為我最愛最寶\n\n副歌：\n故我愛高舉十字寶架\n直到在主台前見主面\n我一生要背負十字架\n此十架可換公義冠冕\n\n各各他的十架，雖滿血跡斑斑\n顯出神奇妙愛無比\n主耶穌在十架，受盡羞辱痛苦\n為救我罪人離開墓',
      transcriptEn: 'On a hill far away stood an old rugged cross\nThe emblem of suffering and shame\nAnd I love that old cross where the dearest and best\nFor a world of lost sinners was slain\n\nChorus:\nSo I\'ll cherish the old rugged cross\nTill my trophies at last I lay down\nI will cling to the old rugged cross\nAnd exchange it someday for a crown\n\nO that old rugged cross, so despised by the world\nHas a wondrous attraction for me\nFor the dear Lamb of God left His glory above\nTo bear it to dark Calvary'
    },
    {
      id: '5',
      title: '靈修默想音樂',
      titleEn: 'Contemplative Meditation Music',
      description: '柔和的器樂音樂，幫助進入安靜默想的狀態。',
      descriptionEn: 'Gentle instrumental music to help enter a state of quiet contemplation.',
      type: 'meditation',
      audioUrl: 'https://www.youtube.com/watch?v=SJcKwv5m-Oo',
      audioUrlEn: 'https://www.youtube.com/watch?v=SJcKwv5m-Oo',
      duration: '10:00',
      background: '基督教默想音樂結合了傳統聖樂元素與現代冥想實踐。常使用管風琴、豎琴、長笛等樂器，創造寧靜祥和的氛圍。這類音樂幫助信徒在禱告和靈修時集中心神，體驗神的同在。',
      backgroundEn: 'Christian meditation music combines traditional sacred music elements with modern contemplative practices. Often using organ, harp, flute and other instruments, it creates a peaceful and serene atmosphere. This music helps believers focus during prayer and devotion, experiencing God\'s presence.',
      transcript: '此為器樂音樂，無歌詞。\n適合於禱告、靈修、默想時聆聽。\n讓心靈在音樂中安靜，體會神的同在。',
      transcriptEn: 'This is instrumental music with no lyrics.\nSuitable for listening during prayer, devotion, and meditation.\nLet your spirit rest in the music and experience God\'s presence.'
    },
    {
      id: '6',
      title: '詩篇23篇吟唱',
      titleEn: 'Psalm 23 Chant',
      description: '大衛的詩篇，以音樂形式呈現「耶和華是我的牧者」。',
      descriptionEn: 'David\'s psalm, presenting "The Lord is my shepherd" in musical form.',
      type: 'chant',
      audioUrl: 'https://www.youtube.com/watch?v=hCLkvyn7c5w',
      audioUrlEn: 'https://www.youtube.com/watch?v=LrJhfLsWFPo',
      duration: '4:15',
      background: '詩篇23篇是聖經中最著名的詩篇之一，描繪神如同牧人般的看顧與引導。歷代教會用各種音樂形式演繹這篇詩篇，從古老的猶太傳統吟唱到現代的流行聖樂。這段經文給予無數信徒在困境中的安慰與盼望。',
      backgroundEn: 'Psalm 23 is one of the most famous psalms in the Bible, depicting God\'s care and guidance like a shepherd. Throughout history, churches have interpreted this psalm in various musical forms, from ancient Jewish traditional chanting to modern contemporary worship music. This passage has given countless believers comfort and hope in times of difficulty.',
      transcript: '耶和華是我的牧者\n我必不致缺乏\n他使我躺臥在青草地上\n領我在可安歇的水邊\n\n他使我的靈魂甦醒\n為自己的名引導我走義路\n我雖然行過死蔭的幽谷\n也不怕遭害\n因為你與我同在\n你的杖，你的竿，都安慰我\n\n在我敵人面前\n你為我擺設筵席\n你用油膏了我的頭\n使我的福杯滿溢\n\n我一生一世必有恩惠慈愛隨著我\n我且要住在耶和華的殿中\n直到永遠',
      transcriptEn: 'The Lord is my shepherd\nI shall not want\nHe makes me lie down in green pastures\nHe leads me beside quiet waters\n\nHe refreshes my soul\nHe guides me along the right paths\nFor his name\'s sake\nEven though I walk through the darkest valley\nI will fear no evil\nFor you are with me\nYour rod and your staff, they comfort me\n\nYou prepare a table before me\nIn the presence of my enemies\nYou anoint my head with oil\nMy cup overflows\n\nSurely your goodness and love will follow me\nAll the days of my life\nAnd I will dwell in the house of the Lord\nForever'
    }
  ];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'hymn': return t('listen:hymn');
      case 'chant': return t('listen:chant');
      case 'sermon': return t('listen:sermon');
      case 'prayer': return t('listen:prayer');
      case 'meditation': return t('listen:meditation');
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hymn': return 'bg-purple-100 text-purple-700';
      case 'chant': return 'bg-blue-100 text-blue-700';
      case 'sermon': return 'bg-green-100 text-green-700';
      case 'prayer': return 'bg-rose-100 text-rose-700';
      case 'meditation': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (selectedAudio) {
    return (
      <>
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => { setSelectedAudio(null); setIsPlaying(false); }}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('common:navigation.backToList')}
          </button>
          <LanguageSwitcher />
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Music className="w-8 h-8" />
              <h1 className="text-4xl font-bold">
                {isEnglish ? selectedAudio.titleEn : selectedAudio.title}
              </h1>
            </div>
            <p className="text-xl opacity-90">
              {isEnglish ? selectedAudio.title : selectedAudio.titleEn}
            </p>
            <span className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-semibold bg-white/20`}>
              {getTypeLabel(selectedAudio.type)}
            </span>
          </div>

          <div className="p-8">
            <p className="text-lg text-gray-700 mb-6">
              {isEnglish && selectedAudio.descriptionEn ? selectedAudio.descriptionEn : selectedAudio.description}
            </p>

            {/* YouTube Player */}
            <div className="bg-purple-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">{t('common:duration')}: {selectedAudio.duration}</span>
              </div>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(isEnglish && selectedAudio.audioUrlEn ? selectedAudio.audioUrlEn : selectedAudio.audioUrl)}`}
                  title={isEnglish ? selectedAudio.titleEn : selectedAudio.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('listen:backgroundAndMeaning')}</h2>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <p className="text-gray-700 leading-relaxed">
                  {isEnglish && selectedAudio.backgroundEn ? selectedAudio.backgroundEn : selectedAudio.background}
                </p>
              </div>
            </div>

            {selectedAudio.transcript && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('listen:lyricsText')}</h2>
                <div className="bg-gray-50 p-4 rounded font-mono text-sm whitespace-pre-line">
                  {isEnglish && selectedAudio.transcriptEn ? selectedAudio.transcriptEn : selectedAudio.transcript}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <AISearch category="listen" />
      <CulturalExplorer category="listen" />
      <ModelContextProtocol category="listen" />
      </>
    );
  }

  return (
    <>
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('common:navigation.backToHome')}
          </button>
          <LanguageSwitcher />
        </div>

        {/* Slideshow Section */}
        <div className="mb-8">
          <Slideshow images={listenImages} interval={3000} className="rounded-2xl shadow-lg" />
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Headphones className="w-12 h-12 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">
              {t('listen:title')}
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            {t('listen:subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audioContents.map((audio) => (
            <button
              key={audio.id}
              onClick={() => setSelectedAudio(audio)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group text-left"
            >
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 text-white">
                <Headphones className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-1">
                  {isEnglish ? audio.titleEn : audio.title}
                </h3>
                <p className="text-purple-100">
                  {isEnglish ? audio.title : audio.titleEn}
                </p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {isEnglish && audio.descriptionEn ? audio.descriptionEn : audio.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(audio.type)}`}>
                    {getTypeLabel(audio.type)}
                  </span>
                  <span className="text-sm text-gray-500">{audio.duration}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <AISearch category="listen" />
      <CulturalExplorer category="listen" />
      <ModelContextProtocol category="listen" />
    </>
  );
};
