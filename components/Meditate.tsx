import React, { useState } from 'react';
import { ArrowLeft, Heart, Clock, Play } from 'lucide-react';
import type { MeditationGuide } from '../types';
import { AISearch } from './AISearch';
import { CulturalExplorer } from './CulturalExplorer';
import { ModelContextProtocol } from './ModelContextProtocol';
import { Slideshow } from './Slideshow';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

interface MeditateProps {
  onBack: () => void;
}

export const Meditate: React.FC<MeditateProps> = ({ onBack }) => {
  const { t } = useTranslation(['meditate', 'common']);
  const [selectedMeditation, setSelectedMeditation] = useState<MeditationGuide | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Images for the Meditate category slideshow
  const meditateImages = [
    '/ChurchMeditation.jpg',
    '/BibleMeditate.webp',
    '/NatureMeditate.jpeg'
  ];

  const meditationGuides: MeditationGuide[] = [
    {
      id: '1',
      title: '聖言誦禱（Lectio Divina）',
      titleEn: 'Lectio Divina',
      description: '古老的聖經默想方法，透過誦讀、默想、祈禱和默觀四個步驟，深入神的話語。',
      type: 'lectio-divina',
      duration: '20-30 分鐘',
      steps: [
        {
          title: '誦讀（Lectio）',
          instruction: '選擇一段聖經經文，慢慢地、反覆地朗讀。留意那些吸引你注意的字詞或句子。讓神的話語進入你的心。',
          duration: '5 分鐘'
        },
        {
          title: '默想（Meditatio）',
          instruction: '安靜下來，思想剛才讀到的經文。這段話對你的生命有什麼意義？神透過這段話對你說什麼？讓經文在心中反芻。',
          duration: '5 分鐘'
        },
        {
          title: '祈禱（Oratio）',
          instruction: '回應神的話語，將你的思想、感受和渴望帶到神面前。這是與神對話的時刻，誠實地表達你的心。',
          duration: '5 分鐘'
        },
        {
          title: '默觀（Contemplatio）',
          instruction: '放下所有思想和言語，單純地安息在神的同在中。讓神的愛充滿你，體驗與神的合一。',
          duration: '10 分鐘'
        }
      ],
      scriptureBase: '詩篇 119:105 - 你的話是我腳前的燈，是我路上的光。',
      guidance: '聖言誦禱源於早期修道院傳統，幫助信徒不只是研讀聖經，更是與神相遇。不要急於完成步驟，讓聖靈引導你的節奏。'
    },
    {
      id: '2',
      title: '中心祈禱（Centering Prayer）',
      titleEn: 'Centering Prayer',
      description: '現代默觀祈禱方法，透過聖詞和安靜，進入神的同在深處。',
      type: 'centering-prayer',
      duration: '20 分鐘',
      steps: [
        {
          title: '選擇聖詞',
          instruction: '選擇一個簡短的詞彙（如「耶穌」、「平安」、「愛」）作為你對神同在的象徵。這個詞將幫助你回到神的同在。',
          duration: '1 分鐘'
        },
        {
          title: '安靜坐下',
          instruction: '找一個舒適的姿勢坐下，閉上眼睛。讓身體放鬆，呼吸自然。將注意力轉向內在，預備迎接神的同在。',
          duration: '2 分鐘'
        },
        {
          title: '進入安靜',
          instruction: '當思緒浮現時，輕輕地重複你的聖詞，將注意力帶回神。不要抗拒思緒，只是讓它們流過，回到神的同在。',
          duration: '15 分鐘'
        },
        {
          title: '結束祈禱',
          instruction: '慢慢地結束祈禱。可以用主禱文或其他禱告來結束。給自己一點時間重新調整，然後睜開眼睛。',
          duration: '2 分鐘'
        }
      ],
      scriptureBase: '詩篇 46:10 - 你們要休息，要知道我是神。',
      guidance: '中心祈禱由托馬斯·基廷神父推廣，幫助現代人在忙碌中經歷神的同在。關鍵不是沒有思緒，而是不執著於思緒。'
    },
    {
      id: '3',
      title: '依納爵式想像祈禱',
      titleEn: 'Ignatian Contemplation',
      description: '聖依納爵的默想方法，透過想像進入聖經場景，與耶穌相遇。',
      type: 'ignatian',
      duration: '25-30 分鐘',
      steps: [
        {
          title: '準備與放鬆',
          instruction: '找一個安靜的地方，舒適地坐下或躺下。做幾個深呼吸，讓身體和心靈放鬆。祈求聖靈引導你的默想。',
          duration: '3 分鐘'
        },
        {
          title: '閱讀福音',
          instruction: '選擇一段福音書的故事，慢慢閱讀。注意場景、人物和情節。讓故事在心中成形。',
          duration: '5 分鐘'
        },
        {
          title: '進入場景',
          instruction: '用你的想像力進入這個場景。你看到什麼？聽到什麼？聞到什麼？觸摸到什麼？讓自己成為故事的一部分。',
          duration: '10 分鐘'
        },
        {
          title: '與耶穌對話',
          instruction: '在場景中與耶穌互動。他對你說什麼？你想對他說什麼？讓這成為一個真實的相遇。',
          duration: '5 分鐘'
        },
        {
          title: '反思與感恩',
          instruction: '慢慢離開場景。反思這次經歷帶給你什麼。為這次相遇感恩，將從中得到的領受帶入生活。',
          duration: '5 分鐘'
        }
      ],
      scriptureBase: '建議場景：最後的晚餐（約翰福音 13）、以馬忤斯路上（路加福音 24）',
      guidance: '依納爵式默想幫助我們不只是理性地理解聖經，更是情感地、全人地體驗神的故事。讓你的想像力自由發揮，信任聖靈的引導。'
    },
    {
      id: '4',
      title: '主禱文默想',
      titleEn: 'Lord\'s Prayer Meditation',
      description: '逐句默想主禱文，深入理解耶穌教導的祈禱。',
      type: 'contemplative',
      duration: '15-20 分鐘',
      steps: [
        {
          title: '我們在天上的父',
          instruction: '默想神是你的父，你屬於神的家庭。神愛你如同父親愛孩子。感受這份親密關係。',
          duration: '3 分鐘'
        },
        {
          title: '願人都尊你的名為聖',
          instruction: '思想神的聖潔與榮耀。你如何在生活中尊崇神的名？祈求神幫助你活出聖潔。',
          duration: '2 分鐘'
        },
        {
          title: '願你的國降臨',
          instruction: '想像神的國：公義、和平、喜樂。神的國如何在你的生命和世界中彰顯？你如何參與其中？',
          duration: '3 分鐘'
        },
        {
          title: '願你的旨意行在地上',
          instruction: '將你的意志交給神。神對你的生命有什麼旨意？祈求力量順服神的帶領。',
          duration: '2 分鐘'
        },
        {
          title: '我們日用的飲食，今日賜給我們',
          instruction: '為神的供應感恩。將你的需要帶到神面前，信靠神的看顧。',
          duration: '2 分鐘'
        },
        {
          title: '免我們的債，如同我們免了人的債',
          instruction: '承認你的罪，接受神的赦免。思想你需要饒恕的人，求神幫助你饒恕。',
          duration: '3 分鐘'
        },
        {
          title: '不叫我們遇見試探，救我們脫離兇惡',
          instruction: '承認你的軟弱，祈求神的保護和力量。將你的掙扎交託給神。',
          duration: '3 分鐘'
        }
      ],
      scriptureBase: '馬太福音 6:9-13',
      guidance: '主禱文是耶穌親自教導的祈禱，包含了基督徒信仰生活的核心。慢慢默想每一句，讓這禱告成為你生命的實踐。'
    }
  ];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'lectio-divina': return t('meditate:lectioDivina');
      case 'contemplative': return t('meditate:contemplative');
      case 'ignatian': return t('meditate:ignatian');
      case 'centering-prayer': return t('meditate:centeringPrayer');
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lectio-divina': return 'bg-indigo-100 text-indigo-700';
      case 'contemplative': return 'bg-purple-100 text-purple-700';
      case 'ignatian': return 'bg-blue-100 text-blue-700';
      case 'centering-prayer': return 'bg-violet-100 text-violet-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (selectedMeditation) {
    return (
      <>
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => { setSelectedMeditation(null); setCurrentStep(0); }}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('common:navigation.backToList')}
          </button>
          <LanguageSwitcher />
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-8 h-8" />
              <h1 className="text-4xl font-bold">{selectedMeditation.title}</h1>
            </div>
            <p className="text-xl opacity-90">{selectedMeditation.titleEn}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/20 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {selectedMeditation.duration}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/20">
                {getTypeLabel(selectedMeditation.type)}
              </span>
            </div>
          </div>

          <div className="p-8">
            <p className="text-lg text-gray-700 mb-6">{selectedMeditation.description}</p>

            <div className="mb-6 bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
              <p className="text-sm font-semibold text-indigo-800 mb-1">{t('meditate:scriptureBase')}</p>
              <p className="text-gray-700 italic">{selectedMeditation.scriptureBase}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('meditate:steps')}</h2>
              <div className="space-y-4">
                {selectedMeditation.steps.map((step, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-5 transition-all ${
                      currentStep === index
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        currentStep === index
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-800">{step.title}</h3>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{step.instruction}</p>
                        {currentStep === index && (
                          <button
                            onClick={() => setCurrentStep(Math.min(currentStep + 1, selectedMeditation.steps.length - 1))}
                            className="mt-3 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm"
                            disabled={currentStep === selectedMeditation.steps.length - 1}
                          >
                            <Play className="w-4 h-4" />
                            {currentStep === selectedMeditation.steps.length - 1 ? t('meditate:completed') : t('meditate:nextStep')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(0)}
                  className="mt-4 px-4 py-2 text-indigo-600 hover:text-indigo-700 transition-colors text-sm"
                >
                  {t('meditate:restart')}
                </button>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('meditate:guidance')}</h2>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <p className="text-gray-700 leading-relaxed">{selectedMeditation.guidance}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AISearch category="meditate" />
      <CulturalExplorer category="meditate" />
      <ModelContextProtocol category="meditate" />
      </>
    );
  }

  return (
    <>
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('common:navigation.backToHome')}
          </button>
          <LanguageSwitcher />
        </div>

        {/* Slideshow Section */}
        <div className="mb-8">
          <Slideshow images={meditateImages} interval={3000} className="rounded-2xl shadow-lg" />
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-12 h-12 text-indigo-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-500 to-indigo-700 bg-clip-text text-transparent">
              {t('meditate:title')}
            </h1>
          </div>
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">{t('common:categories.meditate')}</h2>
          <p className="text-xl text-gray-600">
            {t('meditate:subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {meditationGuides.map((meditation) => (
            <button
              key={meditation.id}
              onClick={() => setSelectedMeditation(meditation)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group text-left"
            >
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 text-white">
                <Heart className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-1">{meditation.title}</h3>
                <p className="text-indigo-100">{meditation.titleEn}</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-2">{meditation.description}</p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(meditation.type)}`}>
                    {getTypeLabel(meditation.type)}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {meditation.duration}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <AISearch category="meditate" />
      <CulturalExplorer category="meditate" />
      <ModelContextProtocol category="meditate" />
    </>
  );
};
