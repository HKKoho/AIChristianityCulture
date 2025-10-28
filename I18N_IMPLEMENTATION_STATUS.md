# i18n Implementation Status

## ✅ Completed

### 1. Infrastructure Setup
- ✅ Installed i18next, react-i18next, i18next-browser-languagedetector
- ✅ Created locales folder structure (en/ and zh-TW/)
- ✅ Created translation JSON files for all 6 categories
- ✅ Configured i18n in config/i18n.ts
- ✅ Created LanguageSwitcher component
- ✅ Initialized i18n in index.tsx

### 2. Components Updated
- ✅ **Eat Component** - Fully internationalized
  - Added useTranslation hook
  - Replaced hardcoded Chinese text with t() function
  - Added LanguageSwitcher to header
  - Translations for: title, subtitle, back button, ingredients, instructions, biblical context

- ✅ **LandingPage** - Language switcher added

## 🚧 In Progress / Remaining

### Components Needing i18n Update

Each component needs the following pattern applied (see Eat.tsx as reference):

#### **Walk Component** (components/Walk.tsx)
```typescript
// 1. Add imports
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

// 2. Add hook in component
const { t } = useTranslation(['walk', 'common']);

// 3. Replace text:
// "返回首頁" → {t('common:navigation.backToHome')}
// "走" → {t('walk:title')}
// "Walk" → {t('common:categories.walk')}
// "與主同行的屬靈旅程" → {t('walk:subtitle')}
// "聖經意義" → {t('walk:biblicalSignificance')}
// "路線點位" → {t('walk:waypoints')}
// "簡易" → {t('walk:easy')}
// "中等" → {t('walk:moderate')}
// "挑戰" → {t('walk:challenging')}

// 4. Add LanguageSwitcher to header
```

#### **Listen Component** (components/Listen.tsx)
```typescript
// Similar pattern:
const { t } = useTranslation(['listen', 'common']);

// Replace:
// "聽" → {t('listen:title')}
// "聆聽天籟：聖樂、聖詩、禱告詞與默想音頻" → {t('listen:subtitle')}
// "播放" → {t('listen:play')}
// "暫停" → {t('listen:pause')}
// "背景與意義" → {t('listen:backgroundAndMeaning')}
// "歌詞/文本" → {t('listen:lyricsText')}
```

#### **See Component** (components/See.tsx)
```typescript
const { t } = useTranslation(['see', 'common']);

// Replace:
// "看" → {t('see:title')}
// "看見神的榮耀：教堂建築、聖像畫與基督教視覺藝術" → {t('see:subtitle')}
// "時期" → {t('see:period')}
// "聖經出處" → {t('see:biblicalReference')}
// "藝術詮釋與神學意義" → {t('see:interpretation')}
```

#### **ReadContent Component** (components/ReadContent.tsx)
```typescript
const { t } = useTranslation(['read', 'common']);

// Replace:
// "讀" → {t('read:title')}
// "閱讀與默想：聖經抄本、手稿歷史與經文研究" → {t('read:subtitle')}
// "經文/節錄" → {t('read:excerpt')}
// "背景" → {t('read:context')}
// "反思" → {t('read:reflection')}
// "作者" → {t('read:author')}
```

#### **Meditate Component** (components/Meditate.tsx)
```typescript
const { t } = useTranslation(['meditate', 'common']);

// Replace:
// "想" → {t('meditate:title')}
// "進入安靜：靈魂探索、默觀祈禱與靈性操練" → {t('meditate:subtitle')}
// "指引" → {t('meditate:guidance')}
// "下一步" → {t('meditate:nextStep')}
// "已完成" → {t('meditate:completed')}
// "重新開始" → {t('meditate:restart')}
```

#### **LandingPage Component** (components/LandingPage.tsx)
Main titles and descriptions need translation - create landing.json files

## Translation Files Already Created

All JSON files exist in both `locales/en/` and `locales/zh-TW/`:
- common.json ✅
- eat.json ✅
- walk.json ✅
- listen.json ✅
- see.json ✅
- read.json ✅
- meditate.json ✅

## Testing Checklist

After completing all components:
- [ ] Test language switcher on landing page
- [ ] Test language switcher on all 6 category pages
- [ ] Verify all Chinese text translates to English when EN is selected
- [ ] Verify all English text translates to Chinese when 中文 is selected
- [ ] Test localStorage persistence (language choice survives page reload)
- [ ] Test on mobile view
- [ ] Build and deploy to production

## Quick Reference - Common Patterns

### Header with Language Switcher
```typescript
<div className="flex justify-between items-center mb-6">
  <button onClick={onBack} className="...">
    <ArrowLeft className="w-5 h-5" />
    {t('common:navigation.backToHome')}
  </button>
  <LanguageSwitcher />
</div>
```

### Title Section
```typescript
<h1 className="...">{t('categoryName:title')}</h1>
<h2 className="...">{t('common:categories.categoryName')}</h2>
<p className="...">{t('categoryName:subtitle')}</p>
```

### Using Namespace Syntax
- `t('common:navigation.backToHome')` - Uses common namespace
- `t('eat:title')` - Uses eat namespace
- Must list namespaces in useTranslation: `useTranslation(['eat', 'common'])`

## Next Steps

1. Apply the pattern from Eat.tsx to the remaining 5 components
2. Test each component after updating
3. Commit and deploy
4. Verify in production

## Notes

- Default language is set to Traditional Chinese (zh-TW)
- Language detection order: localStorage → browser setting
- All translations are stored in JSON files for easy updates
- Pattern is consistent across all components for maintainability
