import React, { useState } from 'react';
import { ArrowLeft, Utensils, ChefHat, Book } from 'lucide-react';
import type { Recipe } from '../types';
import { AISearch } from './AISearch';
import { CulturalExplorer } from './CulturalExplorer';
import { ModelContextProtocol } from './ModelContextProtocol';
import { Slideshow } from './Slideshow';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

interface EatProps {
  onBack: () => void;
}

export const Eat: React.FC<EatProps> = ({ onBack }) => {
  const { t, i18n } = useTranslation(['eat', 'common']);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const isEnglish = i18n.language === 'en';

  // Images for the Eat category slideshow
  const eatImages = [
    '/ApageTable.jpg',
    '/AgapeTable.webp',
    '/ChurchMeal.webp',
    '/fish-bread-pattern.jpg'
  ];

  const recipes: Recipe[] = [
    {
      id: '1',
      name: '無酵餅',
      nameEn: 'Unleavened Bread',
      description: '傳統逾越節與聖餐使用的無酵餅，象徵著純潔與迅速的救贖。',
      descriptionEn: 'Traditional unleavened bread used for Passover and Communion, symbolizing purity and swift redemption.',
      ingredients: [
        '2 杯中筋麵粉',
        '1/2 茶匙鹽',
        '2/3 杯水',
        '2 湯匙橄欖油'
      ],
      ingredientsEn: [
        '2 cups all-purpose flour',
        '1/2 teaspoon salt',
        '2/3 cup water',
        '2 tablespoons olive oil'
      ],
      instructions: [
        '將麵粉和鹽混合在一個大碗中',
        '加入水和橄欖油，攪拌成麵團',
        '揉麵團約 5 分鐘直到光滑',
        '將麵團分成小塊，擀成薄片',
        '用叉子在麵團上戳洞',
        '在預熱 230°C 的烤箱中烤 8-10 分鐘至金黃色'
      ],
      instructionsEn: [
        'Mix flour and salt in a large bowl',
        'Add water and olive oil, stir into dough',
        'Knead dough for about 5 minutes until smooth',
        'Divide dough into small pieces and roll thin',
        'Poke holes in dough with a fork',
        'Bake in preheated 450°F (230°C) oven for 8-10 minutes until golden'
      ],
      biblicalContext: '出埃及記 12:15-20 記載了以色列人在逾越節吃無酵餅的命令。這象徵著他們匆忙離開埃及，沒有時間讓麵包發酵。在聖餐中，無酵餅代表基督無罪的身體。',
      biblicalContextEn: 'Exodus 12:15-20 records the command for Israelites to eat unleavened bread during Passover. This symbolizes their hurried departure from Egypt with no time for bread to rise. In Communion, unleavened bread represents Christ\'s sinless body.',
      category: 'bread'
    },
    {
      id: '2',
      name: '聖餐葡萄汁',
      nameEn: 'Communion Grape Juice',
      description: '代表基督寶血的葡萄汁，在聖餐中使用。',
      descriptionEn: 'Grape juice representing Christ\'s precious blood, used in Communion.',
      ingredients: [
        '2 公斤新鮮葡萄',
        '1/4 杯蜂蜜（可選）',
        '少許檸檬汁'
      ],
      ingredientsEn: [
        '2 kg fresh grapes',
        '1/4 cup honey (optional)',
        'A little lemon juice'
      ],
      instructions: [
        '將葡萄洗淨，去除莖部',
        '將葡萄放入果汁機或壓榨器中',
        '用細網過濾葡萄汁，去除皮和籽',
        '如果需要，加入蜂蜜調味',
        '加入少許檸檬汁以防氧化',
        '冷藏保存，使用前搖勻'
      ],
      instructionsEn: [
        'Wash grapes and remove stems',
        'Place grapes in juicer or press',
        'Strain juice through fine mesh to remove skins and seeds',
        'Add honey for taste if desired',
        'Add a little lemon juice to prevent oxidation',
        'Refrigerate and shake before serving'
      ],
      biblicalContext: '馬太福音 26:27-29 記載了耶穌設立聖餐時說：「這是我立約的血。」葡萄汁（或葡萄酒）象徵基督為我們流出的寶血，帶來罪的赦免和新的約。',
      biblicalContextEn: 'Matthew 26:27-29 records Jesus establishing Communion saying, "This is my blood of the covenant." Grape juice (or wine) symbolizes Christ\'s blood shed for us, bringing forgiveness of sins and a new covenant.',
      category: 'wine'
    },
    {
      id: '3',
      name: '愛筵餐點',
      nameEn: 'Agape Feast Meal',
      description: '早期教會愛筵的傳統餐點，強調共融與分享。',
      descriptionEn: 'Traditional meal of the early church agape feast, emphasizing communion and sharing.',
      ingredients: [
        '麵包（多種）',
        '橄欖油和香草',
        '羊乳酪',
        '烤蔬菜',
        '扁豆湯',
        '無花果和蜜棗',
        '葡萄酒或葡萄汁'
      ],
      ingredientsEn: [
        'Bread (various types)',
        'Olive oil and herbs',
        'Sheep cheese',
        'Roasted vegetables',
        'Lentil soup',
        'Figs and dates',
        'Wine or grape juice'
      ],
      instructions: [
        '準備多種麵包：全麥、大麥、無酵餅',
        '製作香草橄欖油：混合橄欖油、迷迭香、百里香',
        '準備羊乳酪拼盤',
        '烤製蔬菜：茄子、櫛瓜、彩椒',
        '煮扁豆湯：扁豆、洋蔥、香料',
        '擺盤無花果和蜜棗作為甜點',
        '準備葡萄酒或葡萄汁供大家享用'
      ],
      instructionsEn: [
        'Prepare various breads: whole wheat, barley, unleavened',
        'Make herbed olive oil: mix olive oil, rosemary, thyme',
        'Prepare sheep cheese platter',
        'Roast vegetables: eggplant, zucchini, bell peppers',
        'Cook lentil soup: lentils, onions, spices',
        'Arrange figs and dates as dessert',
        'Prepare wine or grape juice for sharing'
      ],
      biblicalContext: '猶大書 1:12 提到「愛筵」，指的是早期基督徒聚會時的共同用餐。這種做法源於使徒行傳 2:46 描述的「在家中擘餅」，強調信徒之間的共融和彼此相愛。',
      biblicalContextEn: 'Jude 1:12 mentions "love feasts," referring to the communal meals of early Christian gatherings. This practice stems from Acts 2:46\'s description of "breaking bread in their homes," emphasizing communion and mutual love among believers.',
      category: 'early-church'
    }
  ];

  if (selectedRecipe) {
    return (
      <>
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setSelectedRecipe(null)}
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('common:navigation.backToList')}
          </button>
          <LanguageSwitcher />
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-amber-700 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <ChefHat className="w-8 h-8" />
              <h1 className="text-4xl font-bold">{selectedRecipe.name}</h1>
            </div>
            <p className="text-xl opacity-90">{selectedRecipe.nameEn}</p>
          </div>

          <div className="p-8">
            <p className="text-lg text-gray-700 mb-6">
              {isEnglish && selectedRecipe.descriptionEn ? selectedRecipe.descriptionEn : selectedRecipe.description}
            </p>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Book className="w-6 h-6 text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-800">{t('eat:biblicalContext')}</h2>
              </div>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <p className="text-gray-700 leading-relaxed">
                  {isEnglish && selectedRecipe.biblicalContextEn ? selectedRecipe.biblicalContextEn : selectedRecipe.biblicalContext}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('eat:ingredients')}</h2>
                <ul className="space-y-2">
                  {(isEnglish && selectedRecipe.ingredientsEn ? selectedRecipe.ingredientsEn : selectedRecipe.ingredients).map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('eat:instructions')}</h2>
                <ol className="space-y-3">
                  {(isEnglish && selectedRecipe.instructionsEn ? selectedRecipe.instructionsEn : selectedRecipe.instructions).map((instruction, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 pt-0.5">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AISearch category="eat" />
      <CulturalExplorer category="eat" />
      <ModelContextProtocol category="eat" />
      </>
    );
  }

  return (
    <>
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('common:navigation.backToHome')}
          </button>
          <LanguageSwitcher />
        </div>

        {/* Slideshow Section */}
        <div className="mb-8">
          <Slideshow images={eatImages} interval={3000} className="rounded-2xl shadow-lg" />
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Utensils className="w-12 h-12 text-amber-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
              {t('eat:title')}
            </h1>
          </div>
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">{t('common:categories.eat')}</h2>
          <p className="text-xl text-gray-600">
            {t('eat:subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-6 text-white">
                <ChefHat className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-1">{recipe.name}</h3>
                <p className="text-amber-100">{recipe.nameEn}</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 line-clamp-3">
                  {isEnglish && recipe.descriptionEn ? recipe.descriptionEn : recipe.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <AISearch category="eat" />
      <CulturalExplorer category="eat" />
      <ModelContextProtocol category="eat" />
    </>
  );
};
