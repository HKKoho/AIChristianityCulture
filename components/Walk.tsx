import React, { useState } from 'react';
import { ArrowLeft, Footprints, MapPin, Clock, TrendingUp } from 'lucide-react';
import type { WalkRoute } from '../types';
import { AISearch } from './AISearch';
import { CulturalExplorer } from './CulturalExplorer';
import { ModelContextProtocol } from './ModelContextProtocol';
import { Slideshow } from './Slideshow';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

interface WalkProps {
  onBack: () => void;
}

export const Walk: React.FC<WalkProps> = ({ onBack }) => {
  const { t, i18n } = useTranslation(['walk', 'common']);
  const [selectedRoute, setSelectedRoute] = useState<WalkRoute | null>(null);
  const isEnglish = i18n.language === 'en';

  // Images for the Walk category slideshow
  const walkImages = [
    '/Road.jpg',
    '/Follower.jpg',
    '/Ephesus.webp',
    '/Stand.jpg'
  ];

  const routes: WalkRoute[] = [
    {
      id: '1',
      name: '最後晚餐之路',
      nameEn: 'The Way of the Last Supper',
      description: '跟隨耶穌從客西馬尼園到最後晚餐樓的路徑。',
      descriptionEn: 'Follow Jesus\' path from Gethsemane to the Upper Room.',
      location: '耶路撒冷舊城',
      locationEn: 'Old City of Jerusalem',
      duration: '1.5 小時',
      difficulty: 'easy',
      biblicalSignificance: '馬可福音 14:12-26 記載了耶穌與門徒共進最後晚餐，設立聖餐的時刻。這條路線帶你體驗那個神聖夜晚的地理環境。',
      biblicalSignificanceEn: 'Mark 14:12-26 records Jesus sharing the Last Supper with his disciples and instituting Communion. This route lets you experience the geography of that sacred night.',
      waypoints: [
        {
          name: '錫安門',
          nameEn: 'Zion Gate',
          description: '進入舊城，前往最後晚餐樓的起點',
          descriptionEn: 'Entry into the Old City, starting point to the Upper Room'
        },
        {
          name: '最後晚餐樓（馬可樓）',
          nameEn: 'Upper Room (Cenacle)',
          description: '傳統上認為耶穌與門徒共進最後晚餐的地方',
          descriptionEn: 'Traditionally believed to be where Jesus shared the Last Supper with his disciples'
        },
        {
          name: '大衛墓',
          nameEn: 'Tomb of David',
          description: '位於最後晚餐樓下方，反思猶太傳統與基督教的連結',
          descriptionEn: 'Located below the Upper Room, reflecting the connection between Jewish tradition and Christianity'
        },
        {
          name: '汲淪谷',
          nameEn: 'Kidron Valley',
          description: '耶穌飯後前往客西馬尼園經過的山谷',
          descriptionEn: 'The valley Jesus crossed after dinner on his way to Gethsemane'
        },
        {
          name: '客西馬尼園',
          nameEn: 'Garden of Gethsemane',
          description: '耶穌在此禱告，被捕前的最後時刻',
          descriptionEn: 'Where Jesus prayed, his final moments before arrest'
        }
      ]
    },
    {
      id: '2',
      name: '以馬忤斯之路',
      nameEn: 'Road to Emmaus',
      description: '重走復活的耶穌與兩位門徒同行的道路。',
      descriptionEn: 'Retrace the path where the risen Jesus walked with two disciples.',
      location: '耶路撒冷至以馬忤斯',
      locationEn: 'Jerusalem to Emmaus',
      duration: '3 小時',
      difficulty: 'moderate',
      biblicalSignificance: '路加福音 24:13-35 記載復活的耶穌與兩位門徒同行，在擘餅時顯現。這是聖餐與復活相連的重要故事。',
      biblicalSignificanceEn: 'Luke 24:13-35 records the risen Jesus walking with two disciples and revealing himself in the breaking of bread. This is an important story connecting Communion with the resurrection.',
      waypoints: [
        {
          name: '耶路撒冷城門',
          nameEn: 'Jerusalem Gate',
          description: '兩位失望的門徒離開耶路撒冷的起點',
          descriptionEn: 'Starting point where two disappointed disciples left Jerusalem'
        },
        {
          name: '山間小徑',
          nameEn: 'Mountain Path',
          description: '體驗古代朝聖者的行走路線',
          descriptionEn: 'Experience the ancient pilgrims\' walking route'
        },
        {
          name: '休息處',
          nameEn: 'Resting Place',
          description: '默想耶穌如何解開聖經給門徒聽',
          descriptionEn: 'Meditate on how Jesus explained the Scriptures to the disciples'
        },
        {
          name: '以馬忤斯村',
          nameEn: 'Village of Emmaus',
          description: '門徒認出耶穌的地方，現代的 Abu Ghosh 村',
          descriptionEn: 'Where the disciples recognized Jesus, modern-day Abu Ghosh village'
        },
        {
          name: '擘餅紀念堂',
          nameEn: 'Breaking of Bread Memorial',
          description: '在耶穌擘餅顯現的地方默想聖餐的意義',
          descriptionEn: 'Meditate on the meaning of Communion where Jesus revealed himself in breaking bread'
        }
      ]
    },
    {
      id: '3',
      name: '聖地朝聖之路',
      nameEn: 'Pilgrimage Path',
      description: '連結多個與聖餐相關的聖地的朝聖路線。',
      descriptionEn: 'A pilgrimage route connecting multiple holy sites related to Communion.',
      location: '耶路撒冷至伯利恆',
      locationEn: 'Jerusalem to Bethlehem',
      duration: '全日',
      difficulty: 'challenging',
      biblicalSignificance: '這條路線連結了從耶穌誕生的伯利恆（生命糧）到設立聖餐的耶路撒冷，完整體驗救恩歷史。',
      biblicalSignificanceEn: 'This route connects Bethlehem, where Jesus was born (Bread of Life), to Jerusalem, where Communion was instituted, offering a complete experience of salvation history.',
      waypoints: [
        {
          name: '伯利恆主誕堂',
          nameEn: 'Church of the Nativity',
          description: '耶穌誕生的地方，他自稱為「生命的糧」的起源',
          descriptionEn: 'Birthplace of Jesus, the origin of him calling himself "Bread of Life"'
        },
        {
          name: '牧羊人野地',
          nameEn: 'Shepherds\' Fields',
          description: '天使向牧羊人報喜訊的地方',
          descriptionEn: 'Where angels announced the good news to shepherds'
        },
        {
          name: '猶大曠野',
          nameEn: 'Judean Wilderness',
          description: '體驗曠野旅程，想像以色列人的出埃及經歷',
          descriptionEn: 'Experience the wilderness journey, imagining Israel\'s Exodus'
        },
        {
          name: '耶利哥',
          nameEn: 'Jericho',
          description: '經過耶穌傳道的城市',
          descriptionEn: 'Pass through the city where Jesus ministered'
        },
        {
          name: '橄欖山',
          nameEn: 'Mount of Olives',
          description: '俯瞰耶路撒冷，預備進入聖城',
          descriptionEn: 'Overlook Jerusalem, preparing to enter the Holy City'
        },
        {
          name: '聖殿山',
          nameEn: 'Temple Mount',
          description: '耶穌潔淨聖殿的地方',
          descriptionEn: 'Where Jesus cleansed the temple'
        },
        {
          name: '最後晚餐樓',
          nameEn: 'Upper Room',
          description: '結束於設立聖餐的地方',
          descriptionEn: 'End at the place where Communion was instituted'
        }
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'moderate': return 'bg-yellow-100 text-yellow-700';
      case 'challenging': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return t('walk:easy');
      case 'moderate': return t('walk:moderate');
      case 'challenging': return t('walk:challenging');
      default: return difficulty;
    }
  };

  if (selectedRoute) {
    return (
      <>
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setSelectedRoute(null)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('common:navigation.backToList')}
          </button>
          <LanguageSwitcher />
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Footprints className="w-8 h-8" />
              <h1 className="text-4xl font-bold">{selectedRoute.name}</h1>
            </div>
            <p className="text-xl opacity-90">{selectedRoute.nameEn}</p>
          </div>

          <div className="p-8">
            <p className="text-lg text-gray-700 mb-6">
              {isEnglish && selectedRoute.descriptionEn ? selectedRoute.descriptionEn : selectedRoute.description}
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                  <MapPin className="w-5 h-5" />
                  <span className="font-semibold">{t('common:location')}</span>
                </div>
                <p className="text-gray-700">
                  {isEnglish && selectedRoute.locationEn ? selectedRoute.locationEn : selectedRoute.location}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">{t('common:duration')}</span>
                </div>
                <p className="text-gray-700">{selectedRoute.duration}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">{t('common:difficulty')}</span>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(selectedRoute.difficulty)}`}>
                  {getDifficultyText(selectedRoute.difficulty)}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('walk:biblicalSignificance')}</h2>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-gray-700 leading-relaxed">
                  {isEnglish && selectedRoute.biblicalSignificanceEn ? selectedRoute.biblicalSignificanceEn : selectedRoute.biblicalSignificance}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('walk:waypoints')}</h2>
              <div className="space-y-4">
                {selectedRoute.waypoints.map((waypoint, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {isEnglish && waypoint.nameEn ? waypoint.nameEn : waypoint.name}
                      </h3>
                      <p className="text-gray-600">
                        {isEnglish && waypoint.descriptionEn ? waypoint.descriptionEn : waypoint.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AISearch category="walk" />
      <CulturalExplorer category="walk" />
      <ModelContextProtocol category="walk" />
      </>
    );
  }

  return (
    <>
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('common:navigation.backToHome')}
          </button>
          <LanguageSwitcher />
        </div>

        {/* Slideshow Section */}
        <div className="mb-8">
          <Slideshow images={walkImages} interval={3000} className="rounded-2xl shadow-lg" />
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Footprints className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              {t('walk:title')}
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            {t('walk:subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <button
              key={route.id}
              onClick={() => setSelectedRoute(route)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group text-left"
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 text-white">
                <Footprints className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-1">{route.name}</h3>
                <p className="text-blue-100">{route.nameEn}</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {isEnglish && route.descriptionEn ? route.descriptionEn : route.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {route.duration}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(route.difficulty)}`}>
                    {getDifficultyText(route.difficulty)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <AISearch category="walk" />
      <CulturalExplorer category="walk" />
      <ModelContextProtocol category="walk" />
    </>
  );
};
