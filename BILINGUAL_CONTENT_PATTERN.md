# Bilingual Content Implementation Pattern

## Overview
This document describes the pattern for making component content (not just UI labels) display in English when English mode is selected.

## Completed
✅ **Eat Component** - All recipe content (descriptions, ingredients, instructions, biblical context) now displays in English

## Pattern to Follow

### Step 1: Add English Fields to Data

For each content item in your data arrays, add English versions of text fields:

```typescript
// Example from Eat component
const recipes: Recipe[] = [
  {
    id: '1',
    name: '無酵餅',                    // Keep Chinese name
    nameEn: 'Unleavened Bread',       // Already exists
    description: '傳統逾越節...',       // Keep Chinese description
    descriptionEn: 'Traditional unleavened bread...', // ADD THIS
    ingredients: ['2 杯中筋麵粉', ...],  // Keep Chinese
    ingredientsEn: ['2 cups all-purpose flour', ...], // ADD THIS
    instructions: ['將麵粉和鹽混合...', ...], // Keep Chinese
    instructionsEn: ['Mix flour and salt...', ...], // ADD THIS
    biblicalContext: '出埃及記 12:15-20...',
    biblicalContextEn: 'Exodus 12:15-20 records...', // ADD THIS
  },
];
```

### Step 2: Add Language Detection

In the component, add language detection:

```typescript
export const ComponentName: React.FC<Props> = ({ onBack }) => {
  const { t, i18n } = useTranslation(['componentName', 'common']);
  const isEnglish = i18n.language === 'en';  // ADD THIS
  // ...
}
```

### Step 3: Update Display Logic

Use conditional rendering to show English or Chinese content:

```typescript
// For single values:
<p>{isEnglish && item.descriptionEn ? item.descriptionEn : item.description}</p>

// For arrays:
{(isEnglish && item.ingredientsEn ? item.ingredientsEn : item.ingredients).map((ingredient, index) => (
  <li key={index}>{ingredient}</li>
))}
```

## Remaining Components

### Walk Component (`components/Walk.tsx`)
**Fields to add English versions:**
- `description` → `descriptionEn`
- `location` → `locationEn`
- `biblicalSignificance` → `biblicalSignificanceEn`
- `waypoints[].name` → `waypoints[].nameEn`
- `waypoints[].description` → `waypoints[].descriptionEn`

**Lines to update:** ~32-132 (data), ~217-218 (display description), ~237 (waypoint display)

### Listen Component (`components/Listen.tsx`)
**Fields to add English versions:**
- `description` → `descriptionEn`
- `background` → `backgroundEn`
- `transcript` → `transcriptEn` (if exists)

**Lines to update:** ~25-89 (data), ~138 (display description), ~170 (background), ~178 (transcript)

### See Component (`components/See.tsx`)
**Fields to add English versions:**
- `description` → `descriptionEn`
- `artist` → keep as is (name)
- `period` → `periodEn`
- `biblicalReference` → keep as is (scripture ref)
- `interpretation` → `interpretationEn`

**Lines to update:** ~27-98 (data), ~154 (description), ~168 (period), ~179 (interpretation)

### ReadContent Component (`components/ReadContent.tsx`)
**Fields to add English versions:**
- `author` → keep as is (name)
- `excerpt` → `excerptEn`
- `type` → keep as is (enum)
- `period` → `periodEn`
- `context` → `contextEn`
- `reflection` → `reflectionEn`

**Lines to update:** ~23-90 (data), ~148 (excerpt), ~156 (context), ~162 (reflection)

### Meditate Component (`components/Meditate.tsx`)
**Fields to add English versions:**
- `description` → `descriptionEn`
- `steps[].title` → `steps[].titleEn`
- `steps[].instruction` → `steps[].instructionEn`
- `scriptureBase` → `scriptureBaseEn`
- `guidance` → `guidanceEn`

**Lines to update:** ~24-173 (data), ~226 (description), ~230 (scriptureBase), ~255 (step title), ~261 (step instruction), ~290 (guidance)

## Type Definitions

You may also want to update `/types.ts` to add optional English fields to the type definitions:

```typescript
export interface Recipe {
  // ... existing fields ...
  descriptionEn?: string;
  ingredientsEn?: string[];
  instructionsEn?: string[];
  biblicalContextEn?: string;
}
```

Do this for: `Recipe`, `WalkRoute`, `AudioContent`, `VisualContent`, `ReadingContent`, `MeditationGuide`

## Testing

After updating each component:
1. Run `npm run build` to verify no errors
2. Test in browser by switching language toggle
3. Verify all content switches to English
4. Check both list view and detail view

## Translation Tips

- Use clear, natural English
- Maintain the spiritual/theological tone
- Scripture references can stay in format like "Exodus 12:15-20"
- Measurements: Convert Chinese measurements to standard US/metric
  - 杯 (cup) → cups
  - 茶匙 (teaspoon) → teaspoon
  - 公斤 (kg) → kg
  - 公克 (g) → g or grams

## Quick Reference - Files Modified

1. ✅ `components/Eat.tsx` - COMPLETED
2. ⏳ `components/Walk.tsx` - TODO
3. ⏳ `components/Listen.tsx` - TODO
4. ⏳ `components/See.tsx` - TODO
5. ⏳ `components/ReadContent.tsx` - TODO
6. ⏳ `components/Meditate.tsx` - TODO
7. ⏳ `types.ts` - Optional but recommended

## Notes

- This is in addition to the i18n implementation for UI labels/buttons (already completed)
- UI labels use the translation keys (e.g., `t('eat:title')`)
- Content data uses conditional rendering (e.g., `isEnglish ? dataEn : data`)
- Both approaches work together to create a fully bilingual experience
