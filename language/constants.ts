
import type { Word } from './types';
import { Language } from './types';

export const HEBREW_WORDS: Word[] = [
  { word: 'בְּרֵאשִׁית', transliteration: 'Bereshit', meaning: 'In the beginning' },
  { word: 'אֱלֹהִים', transliteration: 'Elohim', meaning: 'God' },
  { word: 'יְהוָה', transliteration: 'Yahweh', meaning: 'The LORD' },
  { word: 'שָׁלוֹם', transliteration: 'Shalom', meaning: 'Peace, harmony, wholeness' },
  { word: 'תוֹרָה', transliteration: 'Torah', meaning: 'Law, instruction' },
  { word: 'אָמֵן', transliteration: 'Amen', meaning: 'Truly, so be it'},
];

export const GREEK_WORDS: Word[] = [
  { word: 'Λόγος', transliteration: 'Logos', meaning: 'Word, reason' },
  { word: 'ἀγάπη', transliteration: 'Agape', meaning: 'Love (unconditional)' },
  { word: 'Χριστός', transliteration: 'Christos', meaning: 'Christ, Anointed One' },
  { word: 'πνεῦμα', transliteration: 'Pneuma', meaning: 'Spirit, wind, breath' },
  { word: 'εὐαγγέλιον', transliteration: 'Euangelion', meaning: 'Good news, gospel' },
  { word: 'χάρις', transliteration: 'Charis', meaning: 'Grace, favor'},
];

export const WORD_LISTS: Record<Language, Word[]> = {
  [Language.HEBREW]: HEBREW_WORDS,
  [Language.GREEK]: GREEK_WORDS,
};
