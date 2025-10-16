# Bible API Setup Guide

## Real-Time Bible Verse Search - Implementation Guide

This guide explains how to enable real-time Bible verse searching with Hebrew, Greek, English, and Traditional Chinese translations.

## Current Implementation

### ✅ What's Already Built

1. **Gemini AI Integration** (`bibleGeminiService.ts`)
   - Fetches verses with all translations in real-time
   - Provides Hebrew/Greek word analysis
   - Supports keyword search across Testament

2. **Bible Versions** (See `BIBLE_VERSIONS.md`)
   - Hebrew: Westminster Leningrad Codex
   - Greek: Nestle-Aland 28 / Textus Receptus
   - English: ESV/NIV style
   - Chinese: 和合本 (CUV) Traditional Chinese

3. **Mock Data** (`bibleVerses.ts`)
   - 8 sample verses for immediate use
   - Full structure for word highlighting

## Option 1: Use Gemini AI (Recommended - Already Set Up!)

### Advantages
✅ No additional API keys needed
✅ Multiple translations in one request
✅ Intelligent word analysis
✅ Works with your existing GEMINI_API_KEY

### How to Enable

The service is already created! Just update the `VerseSelector` to use it:

```typescript
import { searchBibleByKeyword, fetchBibleVerse } from '../services/bibleGeminiService';

// In your component:
const results = await searchBibleByKeyword(query, language, 20);
```

### Limitations
- Requires internet connection
- Uses Gemini API quota
- May have occasional variations in translation

## Option 2: Use Free Bible APIs

### Scripture API (Bible.org)

**Free Tier**: 500 requests/day

**Setup**:
1. Sign up at: https://scripture.api.bible/signup
2. Get API key
3. Add to `.env.local`:
   ```
   BIBLE_API_KEY=your_api_key_here
   ```

**Supported Versions**:
- English: ESV, NIV, KJV, NASB
- Original: WLC (Hebrew), NA28 (Greek)
- Chinese: CUV (和合本)

### ESV API (Crossway)

**Free Tier**: For non-commercial use

**Setup**:
1. Register at: https://api.esv.org/
2. Get API key
3. Add to `.env.local`:
   ```
   ESV_API_KEY=your_esv_key_here
   ```

**Features**:
- High-quality English translation
- Audio Bible support
- Passage formatting

## Option 3: Self-Hosted Bible Database

### For Unlimited Access

**Download**:
- Open Scriptures Hebrew Bible: https://github.com/openscriptures/morphhb
- SBLGNT (Greek NT): https://github.com/eliranwong/OpenGNT

**Implementation**:
1. Download XML/JSON Bible files
2. Import into local database (SQLite/PostgreSQL)
3. Create local API endpoints
4. No external dependencies!

## Recommended Setup for Your App

### Phase 1: Start with Gemini (Current)
```bash
# Already configured!
# Just ensure GEMINI_API_KEY is set in .env.local
echo "GEMINI_API_KEY=your_key" >> .env.local
```

### Phase 2: Add Scripture API for More Verses
```bash
# Sign up and add key
BIBLE_API_KEY=your_scripture_api_key
```

### Phase 3: Add Local Database (Optional)
```bash
# Download Bible databases
npm install better-sqlite3
# Import Bible data locally
```

## Implementation Steps

### 1. Enable Gemini Bible Search (5 minutes)

Edit `/language/components/VerseSelector.tsx`:

```typescript
// Add at top
import { searchBibleByKeyword } from '../services/bibleGeminiService';

// Add state for API results
const [apiResults, setApiResults] = useState<BibleVerseResult[]>([]);
const [isSearching, setIsSearching] = useState(false);

// Add search handler
const handleApiSearch = async () => {
  if (searchQuery.length < 3) return;

  setIsSearching(true);
  const results = await searchBibleByKeyword(searchQuery, language, 20);
  setApiResults(results);
  setIsSearching(false);
};

// Add to search input
<input
  type="text"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyPress={(e) => e.key === 'Enter' && handleApiSearch()}
  placeholder="搜尋經文、詞彙或翻譯..."
/>

// Add search button
<button onClick={handleApiSearch} disabled={isSearching}>
  {isSearching ? '搜尋中...' : '搜尋'}
</button>
```

### 2. Display API Results

```typescript
// Combine mock and API results
const allVerses = [...verses, ...apiResults];
const filteredVerses = allVerses.filter(/* your filter logic */);
```

### 3. Add Version Info Display

```typescript
<div className="text-xs text-stone-400 mt-4 text-center">
  <p>Bible Versions:</p>
  <p>Hebrew: WLC | Greek: NA28 | English: ESV | 中文: 和合本</p>
</div>
```

## API Usage Limits

### Gemini AI
- Free tier: ~60 requests/minute
- Sufficient for typical use

### Scripture API
- Free: 500 requests/day
- Paid: Unlimited

### ESV API
- Non-commercial: Free
- Commercial: License required

## Testing

### Test Gemini Search
```bash
# In browser console
const result = await fetchBibleVerse('John 3:16', Language.GREEK);
console.log(result);
```

### Test Keyword Search
```bash
const results = await searchBibleByKeyword('love', Language.GREEK, 5);
console.log(results);
```

## Troubleshooting

### Error: "No API key"
- Check `.env.local` has `GEMINI_API_KEY`
- Restart dev server: `npm run dev`

### Error: "Rate limit"
- Wait 1 minute
- Consider caching results
- Use local database for unlimited access

### Translation Quality Issues
- Cross-reference with published Bibles
- Report issues in BIBLE_VERSIONS.md
- Consider multiple API sources

## Next Steps

1. ✅ Documentation created
2. ⏳ Update VerseSelector to use Gemini API
3. ⏳ Add version info footer
4. ⏳ Implement caching for frequent searches
5. ⏳ Add offline mode with local verses

## Questions?

See `/language/BIBLE_VERSIONS.md` for version details.

**Ready to implement? Let me know and I'll update the components!**
