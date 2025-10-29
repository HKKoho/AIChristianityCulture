import React, { useState } from 'react';
import { ArrowLeft, Eye, Image as ImageIcon } from 'lucide-react';
import type { VisualContent } from '../types';
import { AISearch } from './AISearch';
import { CulturalExplorer } from './CulturalExplorer';
import { ModelContextProtocol } from './ModelContextProtocol';
import { Slideshow } from './Slideshow';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

interface SeeProps {
  onBack: () => void;
}

export const See: React.FC<SeeProps> = ({ onBack }) => {
  const { t, i18n } = useTranslation(['see', 'common']);
  const [selectedVisual, setSelectedVisual] = useState<VisualContent | null>(null);
  const isEnglish = i18n.language === 'en';

  // Images for the See category slideshow
  const seeImages = [
    '/Cathedral.jpg',
    '/CircularCathedral.jpg',
    '/RoundTopCathedral.jpeg',
    '/ModernChurch.jpg',
    '/OldChurch.jpg',
    '/RuinChurch.jpg',
    '/EarlyChruch.jpg'
  ];

  const visualContents: VisualContent[] = [
    {
      id: '1',
      title: '最後的晚餐',
      titleEn: 'The Last Supper',
      description: '達文西的經典作品，描繪耶穌與十二門徒共進最後晚餐的場景。',
      descriptionEn: 'Leonardo da Vinci\'s classic masterpiece depicting Jesus and the twelve disciples sharing the Last Supper.',
      type: 'painting',
      imageUrl: '/images/last-supper.jpg',
      artist: '李奧納多·達文西 (Leonardo da Vinci)',
      period: '文藝復興時期 (1495-1498)',
      periodEn: 'Renaissance Period (1495-1498)',
      biblicalReference: '馬太福音 26:20-29',
      interpretation: '這幅壁畫描繪了耶穌宣布門徒中有人將出賣他的那一刻。達文西巧妙地捕捉了每位門徒的反應，展現了人性的複雜與戲劇性。畫面中央的耶穌形成穩定的三角形構圖，象徵神性的完美。這幅作品不僅是藝術傑作，也深刻表達了聖餐的神學意義。',
      interpretationEn: 'This mural depicts the moment when Jesus announced that one of his disciples would betray him. Da Vinci skillfully captured each disciple\'s reaction, revealing the complexity and drama of human nature. Jesus at the center forms a stable triangular composition, symbolizing divine perfection. This work is not only an artistic masterpiece but also profoundly expresses the theological significance of Communion.'
    },
    {
      id: '2',
      title: '基督全能者聖像',
      titleEn: 'Christ Pantocrator',
      description: '東正教傳統中最重要的基督聖像，展現基督作為宇宙統治者的形象。',
      descriptionEn: 'The most important Christ icon in Eastern Orthodox tradition, displaying Christ as the cosmic ruler.',
      type: 'icon',
      imageUrl: '/images/christ-pantocrator.jpg',
      artist: '拜占庭聖像畫師',
      period: '拜占庭時期 (6-15世紀)',
      periodEn: 'Byzantine Period (6th-15th century)',
      biblicalReference: '啟示錄 1:8',
      interpretation: '基督全能者（Pantocrator，意為「全能統治者」）是東正教最神聖的聖像之一。畫中基督右手舉起祝福手勢，左手持福音書。他的面容嚴肅而慈愛，象徵著神的公義與憐憫。聖像的金色背景代表天國的榮光，提醒信徒基督的神性與超越性。',
      interpretationEn: 'Christ Pantocrator (meaning "Almighty Ruler") is one of the most sacred icons in Eastern Orthodoxy. Christ raises his right hand in blessing while holding the Gospel in his left. His countenance is both solemn and loving, symbolizing God\'s justice and mercy. The icon\'s golden background represents the glory of heaven, reminding believers of Christ\'s divinity and transcendence.'
    },
    {
      id: '3',
      title: '聖母子',
      titleEn: 'Madonna and Child',
      description: '拉斐爾的聖母子像，展現母愛與神聖的完美結合。',
      descriptionEn: 'Raphael\'s Madonna and Child, showcasing the perfect union of maternal love and divine holiness.',
      type: 'painting',
      imageUrl: '/images/madonna-child.jpg',
      artist: '拉斐爾 (Raphael)',
      period: '文藝復興時期 (1505-1506)',
      periodEn: 'Renaissance Period (1505-1506)',
      biblicalReference: '路加福音 2:6-7',
      interpretation: '拉斐爾的聖母子像以其溫柔優雅著稱。聖母瑪利亞抱著嬰孩耶穌，展現人性與神性的交融。畫面構圖和諧，色彩柔和，體現了文藝復興時期對美與信仰結合的追求。這類作品幫助信徒默想道成肉身的奧秘。',
      interpretationEn: 'Raphael\'s Madonna and Child is renowned for its gentle elegance. The Virgin Mary holds the infant Jesus, displaying the fusion of humanity and divinity. The composition is harmonious, colors are soft, embodying the Renaissance pursuit of beauty united with faith. Such works help believers meditate on the mystery of the Incarnation.'
    },
    {
      id: '4',
      title: '哥德式大教堂',
      titleEn: 'Gothic Cathedral',
      description: '中世紀哥德式建築的代表，以高聳尖塔和彩色玻璃窗聞名。',
      descriptionEn: 'Representative of medieval Gothic architecture, renowned for soaring spires and stained glass windows.',
      type: 'architecture',
      imageUrl: '/images/gothic-cathedral.jpg',
      period: '哥德時期 (12-16世紀)',
      periodEn: 'Gothic Period (12th-16th century)',
      biblicalReference: '詩篇 27:4',
      interpretation: '哥德式大教堂是中世紀基督教建築的巔峰之作。高聳的尖頂象徵人對天國的渴望，彩色玻璃窗講述聖經故事，飛扶壁支撐起巨大的空間。當陽光透過彩窗灑入，整個教堂充滿神聖光輝，幫助信徒體驗神的榮耀與同在。',
      interpretationEn: 'Gothic cathedrals are the pinnacle of medieval Christian architecture. Soaring spires symbolize humanity\'s longing for heaven, stained glass windows narrate Biblical stories, and flying buttresses support vast spaces. When sunlight streams through the colored windows, the entire cathedral is filled with sacred radiance, helping believers experience God\'s glory and presence.'
    },
    {
      id: '5',
      title: '受難像',
      titleEn: 'The Crucifixion',
      description: '基督被釘十字架的雕塑作品，表達救贖的核心主題。',
      descriptionEn: 'Sculptural works of Christ crucified, expressing the central theme of redemption.',
      type: 'sculpture',
      imageUrl: '/images/crucifixion.jpg',
      period: '中世紀至現代',
      periodEn: 'Medieval to Modern',
      biblicalReference: '約翰福音 19:17-30',
      interpretation: '受難像是基督教藝術中最重要的主題之一。十字架上的基督形象提醒信徒神對人類的愛與犧牲。不同時期的藝術家以不同方式詮釋這一主題：中世紀強調痛苦與犧牲，文藝復興注重人性尊嚴，現代則探索更抽象的神學意義。',
      interpretationEn: 'The Crucifixion is one of the most important themes in Christian art. The image of Christ on the cross reminds believers of God\'s love and sacrifice for humanity. Artists from different periods have interpreted this theme differently: the medieval period emphasized suffering and sacrifice, the Renaissance focused on human dignity, and modern art explores more abstract theological meanings.'
    },
    {
      id: '6',
      title: '凱爾經書插圖',
      titleEn: 'Book of Kells Illumination',
      description: '中世紀愛爾蘭手抄本，以華麗的裝飾性插圖聞名。',
      type: 'manuscript',
      imageUrl: '/images/book-of-kells.jpg',
      artist: '凱爾修道院抄寫員',
      period: '中世紀早期 (約800年)',
      biblicalReference: '四福音書',
      interpretation: '凱爾經書是中世紀手抄本藝術的傑作，包含四福音書的拉丁文本。每一頁都裝飾著精美的凱爾特紋樣、動物圖案和幾何設計。這些裝飾不僅美觀，更象徵著神話語的寶貴與永恆。修道士們以敬畏之心抄寫聖經，將每個字母都變成讚美神的藝術品。'
    }
  ];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'painting': return t('see:painting');
      case 'icon': return t('see:icon');
      case 'sculpture': return t('see:sculpture');
      case 'architecture': return t('see:architecture');
      case 'manuscript': return t('see:manuscript');
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'painting': return 'bg-green-100 text-green-700';
      case 'icon': return 'bg-blue-100 text-blue-700';
      case 'sculpture': return 'bg-purple-100 text-purple-700';
      case 'architecture': return 'bg-amber-100 text-amber-700';
      case 'manuscript': return 'bg-rose-100 text-rose-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (selectedVisual) {
    return (
      <>
        <div className="w-full max-w-4xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setSelectedVisual(null)}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('common:navigation.backToList')}
            </button>
            <LanguageSwitcher />
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-700 p-8 text-white">
              <div className="flex items-center gap-3 mb-2">
                <ImageIcon className="w-8 h-8" />
                <h1 className="text-4xl font-bold">{selectedVisual.title}</h1>
              </div>
              <p className="text-xl opacity-90">{selectedVisual.titleEn}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/20">
                  {getTypeLabel(selectedVisual.type)}
                </span>
                {selectedVisual.artist && (
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/20">
                    {selectedVisual.artist}
                  </span>
                )}
              </div>
            </div>

            <div className="p-8">
              <p className="text-lg text-gray-700 mb-6">{selectedVisual.description}</p>

              {/* Image Placeholder */}
              <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center mb-6">
                <div className="text-center">
                  <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">{t('see:imagePending')}</p>
                  <p className="text-sm text-gray-400">{selectedVisual.imageUrl}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-2">{t('see:period')}</h3>
                  <p className="text-gray-700">{selectedVisual.period}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-2">{t('see:biblicalReference')}</h3>
                  <p className="text-gray-700">{selectedVisual.biblicalReference}</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('see:interpretation')}</h2>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-gray-700 leading-relaxed">{selectedVisual.interpretation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AISearch category="see" />
        <CulturalExplorer category="see" />
        <ModelContextProtocol category="see" />
      </>
    );
  }

  return (
    <>
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('common:navigation.backToHome')}
          </button>
          <LanguageSwitcher />
        </div>

        {/* Slideshow Section */}
        <div className="mb-8">
          <Slideshow images={seeImages} interval={3000} className="rounded-2xl shadow-lg" />
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Eye className="w-12 h-12 text-green-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
              {t('see:title')}
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            {t('see:subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visualContents.map((visual) => (
            <button
              key={visual.id}
              onClick={() => setSelectedVisual(visual)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group text-left"
            >
              <div className="bg-gradient-to-br from-green-500 to-green-700 p-6 text-white">
                <Eye className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-1">{visual.title}</h3>
                <p className="text-green-100">{visual.titleEn}</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-2">{visual.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(visual.type)}`}>
                    {getTypeLabel(visual.type)}
                  </span>
                  <span className="text-sm text-gray-500">{visual.period.split('(')[0].trim()}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <AISearch category="see" />
      <CulturalExplorer category="see" />
      <ModelContextProtocol category="see" />
    </>
  );
};
