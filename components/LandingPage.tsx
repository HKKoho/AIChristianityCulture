import React from 'react';
import { Wine, Compass, BookOpen, Church, Music, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (destination: 'love-feast' | 'travel-pilgrim' | 'bible-manuscripts' | 'church-aesthetics' | 'music-hymns' | 'soul-spirituality') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const features = [
    {
      id: 'love-feast' as const,
      title: '愛筵與聖餐',
      subtitle: 'Love Feast & Lord\'s Supper',
      description: '探索基督教共融傳統：從早期教會的愛筵到聖餐禮的神學意義與實踐',
      icon: Wine,
      color: 'from-rose-500 to-rose-700',
      hoverColor: 'hover:from-rose-600 hover:to-rose-800',
    },
    {
      id: 'travel-pilgrim' as const,
      title: '旅程與朝聖',
      subtitle: 'Travel & Pilgrimage',
      description: '踏上信仰之旅：探訪聖地、朝聖傳統，以及靈性旅程的深刻意義',
      icon: Compass,
      color: 'from-blue-500 to-blue-700',
      hoverColor: 'hover:from-blue-600 hover:to-blue-800',
    },
    {
      id: 'music-hymns' as const,
      title: '音樂與詩歌',
      subtitle: 'Music & Hymns',
      description: '聆聽天籟之音：探索聖樂傳統、詩歌創作與敬拜音樂的靈性力量',
      icon: Music,
      color: 'from-green-500 to-green-700',
      hoverColor: 'hover:from-green-600 hover:to-green-800',
    },
    {
      id: 'church-aesthetics' as const,
      title: '教堂建築與美學',
      subtitle: 'Church Architecture & Aesthetics',
      description: '欣賞神聖空間：從哥德式大教堂到現代禮拜堂的建築藝術與神學象徵',
      icon: Church,
      color: 'from-purple-500 to-purple-700',
      hoverColor: 'hover:from-purple-600 hover:to-purple-800',
    },
    {
      id: 'bible-manuscripts' as const,
      title: '聖經與抄本',
      subtitle: 'Bible & Manuscripts',
      description: '深入了解聖經的歷史：古代抄本、翻譯傳統與經文形成的奇妙過程',
      icon: BookOpen,
      color: 'from-amber-500 to-amber-700',
      hoverColor: 'hover:from-amber-600 hover:to-amber-800',
    },
    {
      id: 'soul-spirituality' as const,
      title: '安靜與靈修',
      subtitle: 'Silence & Spiritual Practice',
      description: '探索內在生命：靈性操練、默觀祈禱與靈魂成長的屬靈旅程',
      icon: Sparkles,
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
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Do you know Christianity?
        </h1>
        <p className="text-xl text-gray-700">
          基督教 AI 知識平台 - 讓你認識基督教，一個影響著生活的信仰
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
                  <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
                    {feature.title}
                  </h2>
                  <p className="text-sm text-white mb-4 font-medium drop-shadow-md">
                    {feature.subtitle}
                  </p>
                  <p className="text-white leading-relaxed drop-shadow-sm">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          );
        })}
      </div>

      <div className="mt-16 text-center text-gray-600 text-sm">
        <p>選擇一個主題，開始您的基督教文化探索之旅</p>
        <p className="mt-2">Choose a topic to begin your Christian cultural exploration</p>
      </div>
      </div>
    </div>
  );
};
