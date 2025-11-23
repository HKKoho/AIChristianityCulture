import React from 'react';
import { Utensils, Footprints, Headphones, Eye, BookOpen, Heart, Home } from 'lucide-react';
import type { CultureCategory } from '../types';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

interface LandingPageProps {
  onNavigate: (destination: CultureCategory) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { t } = useTranslation(['landing', 'common']);

  // Mapping feature IDs to translation keys
  const getFeatureKey = (id: string) => {
    const mapping: Record<string, string> = {
      'love-feast': 'eat',
      'travel-pilgrim': 'walk',
      'music-hymns': 'listen',
      'church-aesthetics': 'see',
      'bible-manuscripts': 'read',
      'soul-spirituality': 'meditate'
    };
    return mapping[id] || id;
  };

  const features = [
    {
      id: 'love-feast' as const,
      title: '吃： 愛筵與主餐',
      subtitle: 'Eat： Agape Table and Communion',
      description: '聖餐愛筵：食物製作方法，體驗共享意義',
      icon: Utensils,
      color: 'from-amber-500 to-amber-700',
      hoverColor: 'hover:from-amber-600 hover:to-amber-800',
    },
    {
      id: 'travel-pilgrim' as const,
      title: '行：旅遊與朝聖',
      subtitle: 'Walk： Travel and Pilgrim Route',
      description: '聖地路線：朝聖之路，信徒信仰歷程',
      icon: Footprints,
      color: 'from-blue-500 to-blue-700',
      hoverColor: 'hover:from-blue-600 hover:to-blue-800',
    },
    {
      id: 'music-hymns' as const,
      title: '聽：音樂與聖樂',
      subtitle: 'Listen： Music and Worship Hythms ',
      description: '聆聽天籟：聖樂、聖詩音頻的崇拜體驗',
      icon: Headphones,
      color: 'from-purple-500 to-purple-700',
      hoverColor: 'hover:from-purple-600 hover:to-purple-800',
    },
    {
      id: 'church-aesthetics' as const,
      title: '看: 教堂與美學',
      subtitle: 'See： Church Buildings with Aesthetic',
      description: '視覺藝術：教堂建築、觸覺神的榮耀',
      icon: Eye,
      color: 'from-green-500 to-green-700',
      hoverColor: 'hover:from-green-600 hover:to-green-800',
    },
    {
      id: 'bible-manuscripts' as const,
      title: '讀: 聖經與感受',
      subtitle: 'Read： Scripture to Feeling',
      description: '閱讀想象：敘事文學帶動更深領受',
      icon: BookOpen,
      color: 'from-r ose-500 to-rose-700',
      hoverColor: 'hover:from-rose-600 hover:to-rose-800',
    },
    {
      id: 'soul-spirituality' as const,
      title: '思：平靜與靈修',
      subtitle: 'Meditate： Peace in Spirituality',
      description: '進入安靜：靈裏探索、靈性操練',
      icon: Heart,
      color: 'from-indigo-500 to-indigo-700',
      hoverColor: 'hover:from-indigo-600 hover:to-indigo-800',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto relative">
      {/* Background pattern overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'url(/fish-bread-pattern.jpg)',
          backgroundRepeat: 'repeat',
          backgroundSize: '400px 400px'
        }}
      />

      <div className="relative z-10">
      {/* Platform Link and Language Switcher */}
      <div className="flex justify-between items-center mb-6 px-4">
        <a
          href="https://christianplatform.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-gray-800 hover:text-rose-600 font-medium group"
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>{t('landing:platformLink')}</span>
        </a>
        <LanguageSwitcher />
      </div>

      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">
          {t('landing:mainTitle')}
        </h1>
        <p className="text-xl text-gray-700">
          {t('landing:subtitle')}
        </p>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <button
              key={feature.id}
              onClick={() => onNavigate(feature.id)}
              className={`group relative overflow-hidden rounded-2xl backdrop-blur-sm p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-white/30`}
              style={{
                background: `linear-gradient(to bottom right, ${feature.color.includes('rose') ? 'rgba(244, 63, 94, 0.4), rgba(190, 18, 60, 0.5)' :
                  feature.color.includes('blue') ? 'rgba(59, 130, 246, 0.4), rgba(29, 78, 216, 0.5)' :
                  feature.color.includes('green') ? 'rgba(34, 197, 94, 0.4), rgba(21, 128, 61, 0.5)' :
                  feature.color.includes('purple') ? 'rgba(168, 85, 247, 0.4), rgba(126, 34, 206, 0.5)' :
                  feature.color.includes('amber') ? 'rgba(245, 158, 11, 0.4), rgba(180, 83, 9, 0.5)' :
                  'rgba(99, 102, 241, 0.4), rgba(67, 56, 202, 0.5)'}`
              }}
            >
              <div className="relative z-10">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-white/30 rounded-full backdrop-blur-sm shadow-lg">
                    <Icon className="w-12 h-12 text-white drop-shadow-lg" />
                  </div>
                </div>

                <div className="bg-black/20 rounded-lg p-4 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-md">
                    {t(`landing:categories.${getFeatureKey(feature.id)}.title`)}
                  </h2>
                  <p className="text-white leading-relaxed drop-shadow-sm">
                    {t(`landing:categories.${getFeatureKey(feature.id)}.description`)}
                  </p>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          );
        })}
      </div>

      <div className="mt-16 text-center text-gray-600 text-sm">
        <p>{t('landing:footer.choose')}</p>
      </div>
      </div>
    </div>
  );
};
