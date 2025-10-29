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
      audioUrl: '/audio/amazing-grace.mp3',
      duration: '4:30',
      background: '約翰·牛頓（1725-1807）曾是奴隸船船長，後來歸信基督教並成為牧師。這首詩歌寫於1772年，反映了他從罪惡生活中被拯救的經歷。歌詞「我曾迷失，如今被尋回；曾經盲目，如今看見」成為基督教信仰中悔改與重生的經典表達。',
      backgroundEn: 'John Newton (1725-1807) was a slave ship captain who later converted to Christianity and became a minister. Written in 1772, this hymn reflects his experience of being saved from a life of sin. The lyrics "I once was lost, but now am found; was blind, but now I see" have become a classic expression of repentance and rebirth in Christian faith.',
      transcript: 'Amazing grace, how sweet the sound\nThat saved a wretch like me\nI once was lost, but now am found\nWas blind, but now I see...'
    },
    {
      id: '2',
      title: '格列高利聖歌',
      titleEn: 'Gregorian Chant',
      description: '中世紀天主教會的禮儀音樂，以單聲部聖歌為特色。',
      descriptionEn: 'Medieval Catholic liturgical music characterized by monophonic chant.',
      type: 'chant',
      audioUrl: '/audio/gregorian-chant.mp3',
      duration: '6:15',
      background: '格列高利聖歌起源於中世紀早期，以教宗格列高利一世命名。這種音樂形式在9-10世紀達到巔峰，特點是單聲部、自由節奏、拉丁文歌詞。聖歌用於天主教彌撒和日課禮儀中，營造莊嚴神聖的氛圍。',
      backgroundEn: 'Gregorian chant originated in the early Middle Ages, named after Pope Gregory I. This musical form reached its peak in the 9th-10th centuries, characterized by monophonic texture, free rhythm, and Latin lyrics. The chants are used in Catholic Mass and Divine Office liturgy, creating a solemn and sacred atmosphere.',
    },
    {
      id: '3',
      title: '主禱文詠唱',
      titleEn: 'The Lord\'s Prayer Chant',
      description: '耶穌教導門徒的禱告，以聖歌形式詠唱。',
      descriptionEn: 'The prayer Jesus taught his disciples, sung in chant form.',
      type: 'prayer',
      audioUrl: '/audio/lords-prayer.mp3',
      duration: '3:45',
      background: '主禱文記載於馬太福音6:9-13和路加福音11:2-4。這是基督教最重要的禱告文之一，耶穌用它教導門徒如何禱告。歷代教會發展出各種音樂形式來詠唱主禱文，從簡單的單聲吟唱到複雜的合唱作品。',
      backgroundEn: 'The Lord\'s Prayer is recorded in Matthew 6:9-13 and Luke 11:2-4. It is one of Christianity\'s most important prayers, used by Jesus to teach disciples how to pray. Throughout history, churches have developed various musical forms to chant this prayer, from simple monophonic singing to complex choral works.',
      transcript: '我們在天上的父，願人都尊你的名為聖。願你的國降臨。願你的旨意行在地上，如同行在天上...',
      transcriptEn: 'Our Father in heaven, hallowed be your name. Your kingdom come, your will be done, on earth as it is in heaven...'
    },
    {
      id: '4',
      title: '古老十架',
      titleEn: 'The Old Rugged Cross',
      description: '讚美基督十字架的經典聖詩，由喬治·班納德創作。',
      descriptionEn: 'A classic hymn praising Christ\'s cross, written by George Bennard.',
      type: 'hymn',
      audioUrl: '/audio/old-rugged-cross.mp3',
      duration: '5:00',
      background: '這首聖詩由美國牧師喬治·班納德（1873-1958）於1912年創作。歌詞深刻描繪了十字架的意義：雖然世人藐視，但對基督徒而言，它象徵著基督的犧牲與愛。副歌「我要永遠愛高舉那古老的十架」表達了對救恩的感恩與委身。',
      backgroundEn: 'This hymn was written by American pastor George Bennard (1873-1958) in 1912. The lyrics profoundly portray the meaning of the cross: though despised by the world, for Christians it symbolizes Christ\'s sacrifice and love. The chorus "I will cling to the old rugged cross" expresses gratitude for salvation and commitment.',
    },
    {
      id: '5',
      title: '靈修默想音樂',
      titleEn: 'Contemplative Meditation Music',
      description: '柔和的器樂音樂，幫助進入安靜默想的狀態。',
      descriptionEn: 'Gentle instrumental music to help enter a state of quiet contemplation.',
      type: 'meditation',
      audioUrl: '/audio/meditation.mp3',
      duration: '10:00',
      background: '基督教默想音樂結合了傳統聖樂元素與現代冥想實踐。常使用管風琴、豎琴、長笛等樂器，創造寧靜祥和的氛圍。這類音樂幫助信徒在禱告和靈修時集中心神，體驗神的同在。',
      backgroundEn: 'Christian meditation music combines traditional sacred music elements with modern contemplative practices. Often using organ, harp, flute and other instruments, it creates a peaceful and serene atmosphere. This music helps believers focus during prayer and devotion, experiencing God\'s presence.',
    },
    {
      id: '6',
      title: '詩篇23篇吟唱',
      titleEn: 'Psalm 23 Chant',
      description: '大衛的詩篇，以音樂形式呈現「耶和華是我的牧者」。',
      descriptionEn: 'David\'s psalm, presenting "The Lord is my shepherd" in musical form.',
      type: 'chant',
      audioUrl: '/audio/psalm23.mp3',
      duration: '4:15',
      background: '詩篇23篇是聖經中最著名的詩篇之一，描繪神如同牧人般的看顧與引導。歷代教會用各種音樂形式演繹這篇詩篇，從古老的猶太傳統吟唱到現代的流行聖樂。這段經文給予無數信徒在困境中的安慰與盼望。',
      backgroundEn: 'Psalm 23 is one of the most famous psalms in the Bible, depicting God\'s care and guidance like a shepherd. Throughout history, churches have interpreted this psalm in various musical forms, from ancient Jewish traditional chanting to modern contemporary worship music. This passage has given countless believers comfort and hope in times of difficulty.',
      transcript: '耶和華是我的牧者，我必不致缺乏。他使我躺臥在青草地上，領我在可安歇的水邊...',
      transcriptEn: 'The Lord is my shepherd, I shall not want. He makes me lie down in green pastures, he leads me beside quiet waters...'
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
              <h1 className="text-4xl font-bold">{selectedAudio.title}</h1>
            </div>
            <p className="text-xl opacity-90">{selectedAudio.titleEn}</p>
            <span className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-semibold bg-white/20`}>
              {getTypeLabel(selectedAudio.type)}
            </span>
          </div>

          <div className="p-8">
            <p className="text-lg text-gray-700 mb-6">
              {isEnglish && selectedAudio.descriptionEn ? selectedAudio.descriptionEn : selectedAudio.description}
            </p>

            {/* Audio Player Placeholder */}
            <div className="bg-purple-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">{t('common:duration')}: {selectedAudio.duration}</span>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5" />
                      <span>{t('listen:pause')}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      <span>{t('listen:play')}</span>
                    </>
                  )}
                </button>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: isPlaying ? '30%' : '0%' }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2 italic">{t('listen:audioFilePending')}</p>
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
                <h3 className="text-2xl font-bold mb-1">{audio.title}</h3>
                <p className="text-purple-100">{audio.titleEn}</p>
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
