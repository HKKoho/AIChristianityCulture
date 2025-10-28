/**
 * Vocabulary Data for Biblical Hebrew and Greek
 * Essential vocabulary for Year 1 Biblical Language study
 */

export interface VocabularyCard {
  id: string;
  language: 'Hebrew' | 'Greek';
  word: string;
  transliteration: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'pronoun' | 'preposition' | 'conjunction' | 'particle' | 'adverb';
  meanings: string[];
  frequency: number; // Occurrences in Bible
  chapter: number; // Textbook chapter (1-20)
  examples: {
    reference: string;
    text: string;
    translation: string;
  }[];
  grammaticalNotes?: string;
}

export interface UserVocabularyProgress {
  cardId: string;
  lastReviewed: Date;
  nextReview: Date;
  correctCount: number;
  incorrectCount: number;
  easinessFactor: number; // SM-2 algorithm parameter (1.3 - 2.5)
  interval: number; // Days until next review
  repetitions: number; // Number of consecutive correct answers
}

/**
 * Biblical Hebrew Vocabulary - Most Frequent 250 Words
 * Based on standard Year 1 textbooks (Pratico & Van Pelt, Seow, etc.)
 */
export const hebrewVocabulary: VocabularyCard[] = [
  // Chapter 1-2: Foundation (50 words)
  {
    id: 'heb_001',
    language: 'Hebrew',
    word: 'אֱלֹהִים',
    transliteration: 'Elohim',
    partOfSpeech: 'noun',
    meanings: ['God', 'gods'],
    frequency: 2602,
    chapter: 1,
    examples: [
      {
        reference: 'Genesis 1:1',
        text: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים',
        translation: 'In the beginning God created'
      }
    ],
    grammaticalNotes: 'Masculine plural form, but treated as singular when referring to the one true God'
  },
  {
    id: 'heb_002',
    language: 'Hebrew',
    word: 'יהוה',
    transliteration: 'YHWH / Yahweh',
    partOfSpeech: 'noun',
    meanings: ['LORD', 'Yahweh'],
    frequency: 6828,
    chapter: 1,
    examples: [
      {
        reference: 'Genesis 2:4',
        text: 'יְהוָה אֱלֹהִים',
        translation: 'the LORD God'
      }
    ],
    grammaticalNotes: 'The covenant name of God, tetragrammaton (YHWH)'
  },
  {
    id: 'heb_003',
    language: 'Hebrew',
    word: 'אָדָם',
    transliteration: 'Adam',
    partOfSpeech: 'noun',
    meanings: ['man', 'mankind', 'Adam'],
    frequency: 562,
    chapter: 1,
    examples: [
      {
        reference: 'Genesis 1:27',
        text: 'וַיִּבְרָא אֱלֹהִים אֶת־הָאָדָם',
        translation: 'And God created the man'
      }
    ],
    grammaticalNotes: 'Can mean individual person or humanity collectively'
  },
  {
    id: 'heb_004',
    language: 'Hebrew',
    word: 'אֶרֶץ',
    transliteration: 'Eretz',
    partOfSpeech: 'noun',
    meanings: ['land', 'earth', 'ground'],
    frequency: 2505,
    chapter: 1,
    examples: [
      {
        reference: 'Genesis 1:1',
        text: 'אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ',
        translation: 'the heavens and the earth'
      }
    ],
    grammaticalNotes: 'Feminine singular noun'
  },
  {
    id: 'heb_005',
    language: 'Hebrew',
    word: 'שָׁמַיִם',
    transliteration: 'Shamayim',
    partOfSpeech: 'noun',
    meanings: ['heavens', 'sky'],
    frequency: 421,
    chapter: 1,
    examples: [
      {
        reference: 'Genesis 1:1',
        text: 'בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם',
        translation: 'God created the heavens'
      }
    ],
    grammaticalNotes: 'Masculine plural (dual) form, always plural'
  },
  {
    id: 'heb_006',
    language: 'Hebrew',
    word: 'בַּיִת',
    transliteration: 'Bayit',
    partOfSpeech: 'noun',
    meanings: ['house', 'household', 'temple'],
    frequency: 2047,
    chapter: 2,
    examples: [
      {
        reference: 'Genesis 12:1',
        text: 'מִבֵּיתְךָ',
        translation: 'from your house'
      }
    ],
    grammaticalNotes: 'Masculine singular noun'
  },
  {
    id: 'heb_007',
    language: 'Hebrew',
    word: 'בֵּן',
    transliteration: 'Ben',
    partOfSpeech: 'noun',
    meanings: ['son', 'child'],
    frequency: 4941,
    chapter: 2,
    examples: [
      {
        reference: 'Genesis 4:17',
        text: 'וַתֵּלֶד אֶת־בֶּן',
        translation: 'and she bore a son'
      }
    ],
    grammaticalNotes: 'Masculine singular noun, plural: בָּנִים (banim)'
  },
  {
    id: 'heb_008',
    language: 'Hebrew',
    word: 'בַּת',
    transliteration: 'Bat',
    partOfSpeech: 'noun',
    meanings: ['daughter'],
    frequency: 587,
    chapter: 2,
    examples: [
      {
        reference: 'Genesis 6:2',
        text: 'בְּנוֹת הָאָדָם',
        translation: 'daughters of man'
      }
    ],
    grammaticalNotes: 'Feminine singular noun, plural: בָּנוֹת (banot)'
  },
  {
    id: 'heb_009',
    language: 'Hebrew',
    word: 'יוֹם',
    transliteration: 'Yom',
    partOfSpeech: 'noun',
    meanings: ['day', 'time'],
    frequency: 2304,
    chapter: 2,
    examples: [
      {
        reference: 'Genesis 1:5',
        text: 'וַיִּקְרָא אֱלֹהִים לָאוֹר יוֹם',
        translation: 'And God called the light day'
      }
    ],
    grammaticalNotes: 'Masculine singular noun'
  },
  {
    id: 'heb_010',
    language: 'Hebrew',
    word: 'לַיְלָה',
    transliteration: 'Laylah',
    partOfSpeech: 'noun',
    meanings: ['night'],
    frequency: 234,
    chapter: 2,
    examples: [
      {
        reference: 'Genesis 1:5',
        text: 'וְלַחֹשֶׁךְ קָרָא לָיְלָה',
        translation: 'and the darkness He called night'
      }
    ],
    grammaticalNotes: 'Masculine singular noun'
  },

  // Chapter 3-4: Common Verbs (40 words)
  {
    id: 'heb_011',
    language: 'Hebrew',
    word: 'אָמַר',
    transliteration: 'Amar',
    partOfSpeech: 'verb',
    meanings: ['to say', 'to speak'],
    frequency: 5316,
    chapter: 3,
    examples: [
      {
        reference: 'Genesis 1:3',
        text: 'וַיֹּאמֶר אֱלֹהִים',
        translation: 'And God said'
      }
    ],
    grammaticalNotes: 'Qal perfect 3ms: אָמַר, Qal imperfect 3ms: יֹאמַר'
  },
  {
    id: 'heb_012',
    language: 'Hebrew',
    word: 'עָשָׂה',
    transliteration: 'Asah',
    partOfSpeech: 'verb',
    meanings: ['to do', 'to make'],
    frequency: 2632,
    chapter: 3,
    examples: [
      {
        reference: 'Genesis 1:7',
        text: 'וַיַּעַשׂ אֱלֹהִים',
        translation: 'And God made'
      }
    ],
    grammaticalNotes: 'Qal perfect 3ms: עָשָׂה, Qal imperfect 3ms: יַעֲשֶׂה'
  },
  {
    id: 'heb_013',
    language: 'Hebrew',
    word: 'בָּרָא',
    transliteration: 'Bara',
    partOfSpeech: 'verb',
    meanings: ['to create'],
    frequency: 54,
    chapter: 3,
    examples: [
      {
        reference: 'Genesis 1:1',
        text: 'בָּרָא אֱלֹהִים',
        translation: 'God created'
      }
    ],
    grammaticalNotes: 'Used exclusively with God as subject in Qal stem'
  },
  {
    id: 'heb_014',
    language: 'Hebrew',
    word: 'הָלַךְ',
    transliteration: 'Halakh',
    partOfSpeech: 'verb',
    meanings: ['to walk', 'to go'],
    frequency: 1554,
    chapter: 3,
    examples: [
      {
        reference: 'Genesis 3:8',
        text: 'מִתְהַלֵּךְ בַּגָּן',
        translation: 'walking in the garden'
      }
    ],
    grammaticalNotes: 'Qal perfect 3ms: הָלַךְ, Qal imperfect 3ms: יֵלֵךְ'
  },
  {
    id: 'heb_015',
    language: 'Hebrew',
    word: 'בּוֹא',
    transliteration: 'Bo',
    partOfSpeech: 'verb',
    meanings: ['to come', 'to enter'],
    frequency: 2592,
    chapter: 4,
    examples: [
      {
        reference: 'Genesis 6:18',
        text: 'וּבָאתָ אֶל־הַתֵּבָה',
        translation: 'and you shall come into the ark'
      }
    ],
    grammaticalNotes: 'Qal perfect 3ms: בָּא, Qal imperfect 3ms: יָבוֹא'
  },
  {
    id: 'heb_016',
    language: 'Hebrew',
    word: 'יָצָא',
    transliteration: 'Yatsa',
    partOfSpeech: 'verb',
    meanings: ['to go out', 'to come out'],
    frequency: 1076,
    chapter: 4,
    examples: [
      {
        reference: 'Genesis 2:10',
        text: 'וְנָהָר יֹצֵא מֵעֵדֶן',
        translation: 'and a river went out from Eden'
      }
    ],
    grammaticalNotes: 'Qal perfect 3ms: יָצָא, Qal imperfect 3ms: יֵצֵא'
  },
  {
    id: 'heb_017',
    language: 'Hebrew',
    word: 'נָתַן',
    transliteration: 'Natan',
    partOfSpeech: 'verb',
    meanings: ['to give', 'to put', 'to set'],
    frequency: 2014,
    chapter: 4,
    examples: [
      {
        reference: 'Genesis 1:17',
        text: 'וַיִּתֵּן אֹתָם אֱלֹהִים',
        translation: 'And God set them'
      }
    ],
    grammaticalNotes: 'Qal perfect 3ms: נָתַן, Qal imperfect 3ms: יִתֵּן'
  },
  {
    id: 'heb_018',
    language: 'Hebrew',
    word: 'רָאָה',
    transliteration: 'Raah',
    partOfSpeech: 'verb',
    meanings: ['to see', 'to look'],
    frequency: 1311,
    chapter: 4,
    examples: [
      {
        reference: 'Genesis 1:4',
        text: 'וַיַּרְא אֱלֹהִים אֶת־הָאוֹר',
        translation: 'And God saw the light'
      }
    ],
    grammaticalNotes: 'Qal perfect 3ms: רָאָה, Qal imperfect 3ms: יִרְאֶה'
  },
  {
    id: 'heb_019',
    language: 'Hebrew',
    word: 'שָׁמַע',
    transliteration: 'Shama',
    partOfSpeech: 'verb',
    meanings: ['to hear', 'to listen', 'to obey'],
    frequency: 1165,
    chapter: 4,
    examples: [
      {
        reference: 'Genesis 3:8',
        text: 'וַיִּשְׁמְעוּ אֶת־קוֹל',
        translation: 'And they heard the sound'
      }
    ],
    grammaticalNotes: 'Qal perfect 3ms: שָׁמַע, Qal imperfect 3ms: יִשְׁמַע'
  },
  {
    id: 'heb_020',
    language: 'Hebrew',
    word: 'קָרָא',
    transliteration: 'Qara',
    partOfSpeech: 'verb',
    meanings: ['to call', 'to proclaim', 'to read'],
    frequency: 739,
    chapter: 4,
    examples: [
      {
        reference: 'Genesis 1:5',
        text: 'וַיִּקְרָא אֱלֹהִים לָאוֹר יוֹם',
        translation: 'And God called the light day'
      }
    ],
    grammaticalNotes: 'Qal perfect 3ms: קָרָא, Qal imperfect 3ms: יִקְרָא'
  },

  // Chapter 5-6: Prepositions and Particles (30 words)
  {
    id: 'heb_021',
    language: 'Hebrew',
    word: 'אֵת',
    transliteration: 'Et',
    partOfSpeech: 'particle',
    meanings: ['(direct object marker)'],
    frequency: 10978,
    chapter: 5,
    examples: [
      {
        reference: 'Genesis 1:1',
        text: 'בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם',
        translation: 'God created the heavens'
      }
    ],
    grammaticalNotes: 'Marks the definite direct object, not translated in English'
  },
  {
    id: 'heb_022',
    language: 'Hebrew',
    word: 'אֶל',
    transliteration: 'El',
    partOfSpeech: 'preposition',
    meanings: ['to', 'toward', 'into'],
    frequency: 5518,
    chapter: 5,
    examples: [
      {
        reference: 'Genesis 2:19',
        text: 'וַיָּבֵא אֶל־הָאָדָם',
        translation: 'and He brought to the man'
      }
    ],
    grammaticalNotes: 'Indicates motion toward or direction'
  },
  {
    id: 'heb_023',
    language: 'Hebrew',
    word: 'בְּ',
    transliteration: 'Be',
    partOfSpeech: 'preposition',
    meanings: ['in', 'at', 'with', 'by'],
    frequency: 15559,
    chapter: 5,
    examples: [
      {
        reference: 'Genesis 1:1',
        text: 'בְּרֵאשִׁית',
        translation: 'In the beginning'
      }
    ],
    grammaticalNotes: 'Inseparable preposition, prefixed to nouns'
  },
  {
    id: 'heb_024',
    language: 'Hebrew',
    word: 'לְ',
    transliteration: 'Le',
    partOfSpeech: 'preposition',
    meanings: ['to', 'for', 'belonging to'],
    frequency: 20321,
    chapter: 5,
    examples: [
      {
        reference: 'Genesis 1:5',
        text: 'וַיִּקְרָא אֱלֹהִים לָאוֹר',
        translation: 'And God called to the light'
      }
    ],
    grammaticalNotes: 'Inseparable preposition, most frequent in Hebrew'
  },
  {
    id: 'heb_025',
    language: 'Hebrew',
    word: 'מִן',
    transliteration: 'Min',
    partOfSpeech: 'preposition',
    meanings: ['from', 'out of', 'than'],
    frequency: 7592,
    chapter: 5,
    examples: [
      {
        reference: 'Genesis 2:10',
        text: 'יֹצֵא מֵעֵדֶן',
        translation: 'going out from Eden'
      }
    ],
    grammaticalNotes: 'Can be separate word or inseparable prefix מִ/מֵ'
  },
  {
    id: 'heb_026',
    language: 'Hebrew',
    word: 'עַל',
    transliteration: 'Al',
    partOfSpeech: 'preposition',
    meanings: ['on', 'upon', 'over', 'concerning'],
    frequency: 5777,
    chapter: 5,
    examples: [
      {
        reference: 'Genesis 1:2',
        text: 'עַל־פְּנֵי הַמָּיִם',
        translation: 'over the face of the waters'
      }
    ],
    grammaticalNotes: 'Indicates position above or concerning something'
  },
  {
    id: 'heb_027',
    language: 'Hebrew',
    word: 'כְּ',
    transliteration: 'Ke',
    partOfSpeech: 'preposition',
    meanings: ['as', 'like', 'according to'],
    frequency: 3053,
    chapter: 6,
    examples: [
      {
        reference: 'Genesis 1:26',
        text: 'נַעֲשֶׂה אָדָם בְּצַלְמֵנוּ כִּדְמוּתֵנוּ',
        translation: 'Let us make man in our image, according to our likeness'
      }
    ],
    grammaticalNotes: 'Inseparable preposition for comparison'
  },
  {
    id: 'heb_028',
    language: 'Hebrew',
    word: 'אִם',
    transliteration: 'Im',
    partOfSpeech: 'conjunction',
    meanings: ['if', 'whether'],
    frequency: 1070,
    chapter: 6,
    examples: [
      {
        reference: 'Genesis 4:7',
        text: 'הֲלוֹא אִם־תֵּיטִיב',
        translation: 'If you do well'
      }
    ],
    grammaticalNotes: 'Introduces conditional clauses'
  },
  {
    id: 'heb_029',
    language: 'Hebrew',
    word: 'כִּי',
    transliteration: 'Ki',
    partOfSpeech: 'conjunction',
    meanings: ['that', 'because', 'for', 'when'],
    frequency: 4487,
    chapter: 6,
    examples: [
      {
        reference: 'Genesis 1:4',
        text: 'וַיַּרְא אֱלֹהִים אֶת־הָאוֹר כִּי־טוֹב',
        translation: 'And God saw the light, that it was good'
      }
    ],
    grammaticalNotes: 'Very common conjunction with multiple meanings depending on context'
  },
  {
    id: 'heb_030',
    language: 'Hebrew',
    word: 'וְ',
    transliteration: 'Ve',
    partOfSpeech: 'conjunction',
    meanings: ['and', 'but', 'also'],
    frequency: 50524,
    chapter: 6,
    examples: [
      {
        reference: 'Genesis 1:1',
        text: 'אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ',
        translation: 'the heavens and the earth'
      }
    ],
    grammaticalNotes: 'Most frequent word in Hebrew Bible, inseparable conjunction'
  },

  // Additional essential nouns (20 more)
  {
    id: 'heb_031',
    language: 'Hebrew',
    word: 'מֶלֶךְ',
    transliteration: 'Melekh',
    partOfSpeech: 'noun',
    meanings: ['king'],
    frequency: 2530,
    chapter: 7,
    examples: [
      {
        reference: '1 Samuel 8:5',
        text: 'שִׂימָה לָּנוּ מֶלֶךְ',
        translation: 'appoint for us a king'
      }
    ],
    grammaticalNotes: 'Masculine singular noun'
  },
  {
    id: 'heb_032',
    language: 'Hebrew',
    word: 'עִיר',
    transliteration: 'Ir',
    partOfSpeech: 'noun',
    meanings: ['city', 'town'],
    frequency: 1092,
    chapter: 7,
    examples: [
      {
        reference: 'Genesis 4:17',
        text: 'וַיִּבֶן עִיר',
        translation: 'and he built a city'
      }
    ],
    grammaticalNotes: 'Feminine singular noun'
  },
  {
    id: 'heb_033',
    language: 'Hebrew',
    word: 'עַם',
    transliteration: 'Am',
    partOfSpeech: 'noun',
    meanings: ['people', 'nation'],
    frequency: 1869,
    chapter: 7,
    examples: [
      {
        reference: 'Exodus 1:9',
        text: 'עַם בְּנֵי יִשְׂרָאֵל',
        translation: 'the people of Israel'
      }
    ],
    grammaticalNotes: 'Masculine singular noun, collective'
  },
  {
    id: 'heb_034',
    language: 'Hebrew',
    word: 'דָּבָר',
    transliteration: 'Davar',
    partOfSpeech: 'noun',
    meanings: ['word', 'thing', 'matter'],
    frequency: 1454,
    chapter: 7,
    examples: [
      {
        reference: 'Genesis 15:1',
        text: 'הָיָה דְבַר־יְהוָה',
        translation: 'the word of the LORD came'
      }
    ],
    grammaticalNotes: 'Masculine singular noun'
  },
  {
    id: 'heb_035',
    language: 'Hebrew',
    word: 'יָד',
    transliteration: 'Yad',
    partOfSpeech: 'noun',
    meanings: ['hand', 'power'],
    frequency: 1627,
    chapter: 8,
    examples: [
      {
        reference: 'Exodus 14:31',
        text: 'אֶת־הַיָּד הַגְּדֹלָה',
        translation: 'the great hand/power'
      }
    ],
    grammaticalNotes: 'Feminine singular noun'
  },
  {
    id: 'heb_036',
    language: 'Hebrew',
    word: 'לֵב',
    transliteration: 'Lev',
    partOfSpeech: 'noun',
    meanings: ['heart', 'mind', 'will'],
    frequency: 858,
    chapter: 8,
    examples: [
      {
        reference: 'Deuteronomy 6:5',
        text: 'בְּכָל־לְבָבְךָ',
        translation: 'with all your heart'
      }
    ],
    grammaticalNotes: 'Masculine singular noun'
  },
  {
    id: 'heb_037',
    language: 'Hebrew',
    word: 'נֶפֶשׁ',
    transliteration: 'Nefesh',
    partOfSpeech: 'noun',
    meanings: ['soul', 'life', 'person'],
    frequency: 757,
    chapter: 8,
    examples: [
      {
        reference: 'Genesis 2:7',
        text: 'לְנֶפֶשׁ חַיָּה',
        translation: 'a living soul'
      }
    ],
    grammaticalNotes: 'Feminine singular noun'
  },
  {
    id: 'heb_038',
    language: 'Hebrew',
    word: 'רוּחַ',
    transliteration: 'Ruach',
    partOfSpeech: 'noun',
    meanings: ['spirit', 'wind', 'breath'],
    frequency: 378,
    chapter: 8,
    examples: [
      {
        reference: 'Genesis 1:2',
        text: 'וְרוּחַ אֱלֹהִים',
        translation: 'and the Spirit of God'
      }
    ],
    grammaticalNotes: 'Feminine singular noun'
  },
  {
    id: 'heb_039',
    language: 'Hebrew',
    word: 'מַיִם',
    transliteration: 'Mayim',
    partOfSpeech: 'noun',
    meanings: ['water', 'waters'],
    frequency: 585,
    chapter: 8,
    examples: [
      {
        reference: 'Genesis 1:2',
        text: 'עַל־פְּנֵי הַמָּיִם',
        translation: 'over the face of the waters'
      }
    ],
    grammaticalNotes: 'Masculine plural (dual), always plural'
  },
  {
    id: 'heb_040',
    language: 'Hebrew',
    word: 'אִשָּׁה',
    transliteration: 'Ishah',
    partOfSpeech: 'noun',
    meanings: ['woman', 'wife'],
    frequency: 781,
    chapter: 9,
    examples: [
      {
        reference: 'Genesis 2:22',
        text: 'וַיִּבֶן אֶת־הַצֵּלָע לְאִשָּׁה',
        translation: 'and fashioned the rib into a woman'
      }
    ],
    grammaticalNotes: 'Feminine singular noun'
  },
  {
    id: 'heb_041',
    language: 'Hebrew',
    word: 'אִישׁ',
    transliteration: 'Ish',
    partOfSpeech: 'noun',
    meanings: ['man', 'husband'],
    frequency: 2188,
    chapter: 9,
    examples: [
      {
        reference: 'Genesis 2:23',
        text: 'זֹאת תִּקָּרֵא אִשָּׁה כִּי מֵאִישׁ',
        translation: 'this shall be called woman because from man'
      }
    ],
    grammaticalNotes: 'Masculine singular noun'
  },
  {
    id: 'heb_042',
    language: 'Hebrew',
    word: 'אָב',
    transliteration: 'Av',
    partOfSpeech: 'noun',
    meanings: ['father', 'ancestor'],
    frequency: 1210,
    chapter: 9,
    examples: [
      {
        reference: 'Genesis 2:24',
        text: 'יַעֲזָב־אִישׁ אֶת־אָבִיו',
        translation: 'a man shall leave his father'
      }
    ],
    grammaticalNotes: 'Masculine singular noun'
  },
  {
    id: 'heb_043',
    language: 'Hebrew',
    word: 'אֵם',
    transliteration: 'Em',
    partOfSpeech: 'noun',
    meanings: ['mother'],
    frequency: 220,
    chapter: 9,
    examples: [
      {
        reference: 'Genesis 2:24',
        text: 'וְאֶת־אִמּוֹ',
        translation: 'and his mother'
      }
    ],
    grammaticalNotes: 'Feminine singular noun'
  },
  {
    id: 'heb_044',
    language: 'Hebrew',
    word: 'אָח',
    transliteration: 'Ach',
    partOfSpeech: 'noun',
    meanings: ['brother'],
    frequency: 629,
    chapter: 9,
    examples: [
      {
        reference: 'Genesis 4:2',
        text: 'וַתֹּסֶף לָלֶדֶת אֶת־אָחִיו',
        translation: 'and she bore his brother'
      }
    ],
    grammaticalNotes: 'Masculine singular noun'
  },
  {
    id: 'heb_045',
    language: 'Hebrew',
    word: 'אָחוֹת',
    transliteration: 'Achot',
    partOfSpeech: 'noun',
    meanings: ['sister'],
    frequency: 114,
    chapter: 9,
    examples: [
      {
        reference: 'Genesis 4:22',
        text: 'וַאֲחוֹת תּוּבַל־קַיִן',
        translation: 'and the sister of Tubal-cain'
      }
    ],
    grammaticalNotes: 'Feminine singular noun'
  },
  {
    id: 'heb_046',
    language: 'Hebrew',
    word: 'קוֹל',
    transliteration: 'Qol',
    partOfSpeech: 'noun',
    meanings: ['voice', 'sound'],
    frequency: 505,
    chapter: 10,
    examples: [
      {
        reference: 'Genesis 3:8',
        text: 'אֶת־קוֹל יְהוָה אֱלֹהִים',
        translation: 'the sound of the LORD God'
      }
    ],
    grammaticalNotes: 'Masculine singular noun'
  },
  {
    id: 'heb_047',
    language: 'Hebrew',
    word: 'שֵׁם',
    transliteration: 'Shem',
    partOfSpeech: 'noun',
    meanings: ['name'],
    frequency: 864,
    chapter: 10,
    examples: [
      {
        reference: 'Genesis 2:19',
        text: 'לִרְאוֹת מַה־יִּקְרָא־לוֹ וְכֹל אֲשֶׁר יִקְרָא־לוֹ הָאָדָם נֶפֶשׁ חַיָּה הוּא שְׁמוֹ',
        translation: 'to see what he would call it, and whatever the man called a living creature, that was its name'
      }
    ],
    grammaticalNotes: 'Masculine singular noun'
  },
  {
    id: 'heb_048',
    language: 'Hebrew',
    word: 'מָקוֹם',
    transliteration: 'Maqom',
    partOfSpeech: 'noun',
    meanings: ['place', 'location'],
    frequency: 401,
    chapter: 10,
    examples: [
      {
        reference: 'Genesis 1:9',
        text: 'אֶל־מָקוֹם אֶחָד',
        translation: 'to one place'
      }
    ],
    grammaticalNotes: 'Masculine singular noun'
  },
  {
    id: 'heb_049',
    language: 'Hebrew',
    word: 'עֵץ',
    transliteration: 'Etz',
    partOfSpeech: 'noun',
    meanings: ['tree', 'wood'],
    frequency: 330,
    chapter: 10,
    examples: [
      {
        reference: 'Genesis 2:9',
        text: 'כָּל־עֵץ נֶחְמָד',
        translation: 'every tree pleasant'
      }
    ],
    grammaticalNotes: 'Masculine singular noun'
  },
  {
    id: 'heb_050',
    language: 'Hebrew',
    word: 'כֹּהֵן',
    transliteration: 'Kohen',
    partOfSpeech: 'noun',
    meanings: ['priest'],
    frequency: 750,
    chapter: 10,
    examples: [
      {
        reference: 'Genesis 14:18',
        text: 'וְהוּא כֹהֵן לְאֵל עֶלְיוֹן',
        translation: 'and he was priest of God Most High'
      }
    ],
    grammaticalNotes: 'Masculine singular noun'
  }
];

/**
 * Biblical Greek Vocabulary - Most Frequent 250 Words
 * Based on standard Year 1 textbooks (Mounce, Black, Duff)
 */
export const greekVocabulary: VocabularyCard[] = [
  // Chapter 1-2: Articles and Basic Nouns (40 words)
  {
    id: 'grk_001',
    language: 'Greek',
    word: 'ὁ',
    transliteration: 'ho',
    partOfSpeech: 'article',
    meanings: ['the'],
    frequency: 19870,
    chapter: 1,
    examples: [
      {
        reference: 'John 1:1',
        text: 'Ἐν ἀρχῇ ἦν ὁ λόγος',
        translation: 'In the beginning was the Word'
      }
    ],
    grammaticalNotes: 'Definite article, nominative masculine singular. Full paradigm: ὁ, ἡ, τό (m, f, n)'
  },
  {
    id: 'grk_002',
    language: 'Greek',
    word: 'θεός',
    transliteration: 'theos',
    partOfSpeech: 'noun',
    meanings: ['God', 'god'],
    frequency: 1317,
    chapter: 1,
    examples: [
      {
        reference: 'John 1:1',
        text: 'καὶ θεὸς ἦν ὁ λόγος',
        translation: 'and the Word was God'
      }
    ],
    grammaticalNotes: 'Masculine 2nd declension noun'
  },
  {
    id: 'grk_003',
    language: 'Greek',
    word: 'λόγος',
    transliteration: 'logos',
    partOfSpeech: 'noun',
    meanings: ['word', 'message', 'reason'],
    frequency: 330,
    chapter: 1,
    examples: [
      {
        reference: 'John 1:1',
        text: 'Ἐν ἀρχῇ ἦν ὁ λόγος',
        translation: 'In the beginning was the Word'
      }
    ],
    grammaticalNotes: 'Masculine 2nd declension noun'
  },
  {
    id: 'grk_004',
    language: 'Greek',
    word: 'ἄνθρωπος',
    transliteration: 'anthrōpos',
    partOfSpeech: 'noun',
    meanings: ['man', 'person', 'humanity'],
    frequency: 550,
    chapter: 1,
    examples: [
      {
        reference: 'Matthew 4:4',
        text: 'οὐκ ἐπ\' ἄρτῳ μόνῳ ζήσεται ὁ ἄνθρωπος',
        translation: 'man shall not live by bread alone'
      }
    ],
    grammaticalNotes: 'Masculine 2nd declension noun'
  },
  {
    id: 'grk_005',
    language: 'Greek',
    word: 'υἱός',
    transliteration: 'huios',
    partOfSpeech: 'noun',
    meanings: ['son'],
    frequency: 377,
    chapter: 2,
    examples: [
      {
        reference: 'Matthew 3:17',
        text: 'Οὗτός ἐστιν ὁ υἱός μου',
        translation: 'This is my Son'
      }
    ],
    grammaticalNotes: 'Masculine 2nd declension noun'
  },
  {
    id: 'grk_006',
    language: 'Greek',
    word: 'κύριος',
    transliteration: 'kyrios',
    partOfSpeech: 'noun',
    meanings: ['lord', 'master', 'Lord'],
    frequency: 717,
    chapter: 2,
    examples: [
      {
        reference: 'Matthew 7:21',
        text: 'Κύριε, κύριε',
        translation: 'Lord, Lord'
      }
    ],
    grammaticalNotes: 'Masculine 2nd declension noun, often refers to Jesus or God'
  },
  {
    id: 'grk_007',
    language: 'Greek',
    word: 'ἀδελφός',
    transliteration: 'adelphos',
    partOfSpeech: 'noun',
    meanings: ['brother'],
    frequency: 343,
    chapter: 2,
    examples: [
      {
        reference: 'Matthew 4:18',
        text: 'δύο ἀδελφούς',
        translation: 'two brothers'
      }
    ],
    grammaticalNotes: 'Masculine 2nd declension noun'
  },
  {
    id: 'grk_008',
    language: 'Greek',
    word: 'οὐρανός',
    transliteration: 'ouranos',
    partOfSpeech: 'noun',
    meanings: ['heaven', 'sky'],
    frequency: 273,
    chapter: 2,
    examples: [
      {
        reference: 'Matthew 3:2',
        text: 'ἡ βασιλεία τῶν οὐρανῶν',
        translation: 'the kingdom of heaven'
      }
    ],
    grammaticalNotes: 'Masculine 2nd declension noun'
  },
  {
    id: 'grk_009',
    language: 'Greek',
    word: 'καρδία',
    transliteration: 'kardia',
    partOfSpeech: 'noun',
    meanings: ['heart'],
    frequency: 156,
    chapter: 2,
    examples: [
      {
        reference: 'Matthew 5:8',
        text: 'οἱ καθαροὶ τῇ καρδίᾳ',
        translation: 'the pure in heart'
      }
    ],
    grammaticalNotes: 'Feminine 1st declension noun'
  },
  {
    id: 'grk_010',
    language: 'Greek',
    word: 'ἡμέρα',
    transliteration: 'hēmera',
    partOfSpeech: 'noun',
    meanings: ['day'],
    frequency: 389,
    chapter: 2,
    examples: [
      {
        reference: 'Matthew 6:34',
        text: 'ἀρκετὸν τῇ ἡμέρᾳ ἡ κακία αὐτῆς',
        translation: 'sufficient for the day is its own trouble'
      }
    ],
    grammaticalNotes: 'Feminine 1st declension noun'
  },

  // Chapter 3-4: Common Verbs (50 words)
  {
    id: 'grk_011',
    language: 'Greek',
    word: 'εἰμί',
    transliteration: 'eimi',
    partOfSpeech: 'verb',
    meanings: ['to be', 'I am'],
    frequency: 2462,
    chapter: 3,
    examples: [
      {
        reference: 'John 8:58',
        text: 'πρὶν Ἀβραὰμ γενέσθαι ἐγὼ εἰμί',
        translation: 'Before Abraham was, I am'
      }
    ],
    grammaticalNotes: 'Irregular verb. Present: εἰμί, εἶ, ἐστί, ἐσμέν, ἐστέ, εἰσί'
  },
  {
    id: 'grk_012',
    language: 'Greek',
    word: 'λέγω',
    transliteration: 'legō',
    partOfSpeech: 'verb',
    meanings: ['to say', 'to speak', 'to tell'],
    frequency: 2354,
    chapter: 3,
    examples: [
      {
        reference: 'Matthew 3:9',
        text: 'μὴ δόξητε λέγειν ἐν ἑαυτοῖς',
        translation: 'do not presume to say to yourselves'
      }
    ],
    grammaticalNotes: 'Present active indicative 1s. Future: ἐρῶ, Aorist: εἶπον'
  },
  {
    id: 'grk_013',
    language: 'Greek',
    word: 'ἔχω',
    transliteration: 'echō',
    partOfSpeech: 'verb',
    meanings: ['to have', 'to hold'],
    frequency: 708,
    chapter: 3,
    examples: [
      {
        reference: 'Matthew 3:9',
        text: 'πατέρα ἔχομεν τὸν Ἀβραάμ',
        translation: 'we have Abraham as our father'
      }
    ],
    grammaticalNotes: 'Present active indicative 1s. Future: ἕξω, Aorist: ἔσχον'
  },
  {
    id: 'grk_014',
    language: 'Greek',
    word: 'γίνομαι',
    transliteration: 'ginomai',
    partOfSpeech: 'verb',
    meanings: ['to become', 'to be', 'to happen'],
    frequency: 669,
    chapter: 3,
    examples: [
      {
        reference: 'John 1:3',
        text: 'πάντα δι\' αὐτοῦ ἐγένετο',
        translation: 'all things came into being through him'
      }
    ],
    grammaticalNotes: 'Deponent verb (middle/passive forms with active meaning). Aorist: ἐγενόμην'
  },
  {
    id: 'grk_015',
    language: 'Greek',
    word: 'ἀκούω',
    transliteration: 'akouō',
    partOfSpeech: 'verb',
    meanings: ['to hear', 'to listen'],
    frequency: 428,
    chapter: 4,
    examples: [
      {
        reference: 'Matthew 2:3',
        text: 'ἀκούσας δὲ ὁ βασιλεὺς Ἡρῴδης',
        translation: 'And when Herod the king heard'
      }
    ],
    grammaticalNotes: 'Regular ω-verb. Aorist: ἤκουσα. Takes genitive of person heard'
  },
  {
    id: 'grk_016',
    language: 'Greek',
    word: 'βλέπω',
    transliteration: 'blepō',
    partOfSpeech: 'verb',
    meanings: ['to see', 'to look'],
    frequency: 133,
    chapter: 4,
    examples: [
      {
        reference: 'Matthew 5:28',
        text: 'πᾶς ὁ βλέπων γυναῖκα',
        translation: 'everyone who looks at a woman'
      }
    ],
    grammaticalNotes: 'Regular ω-verb. Aorist: ἔβλεψα'
  },
  {
    id: 'grk_017',
    language: 'Greek',
    word: 'ποιέω',
    transliteration: 'poieō',
    partOfSpeech: 'verb',
    meanings: ['to do', 'to make'],
    frequency: 568,
    chapter: 4,
    examples: [
      {
        reference: 'Matthew 3:8',
        text: 'ποιήσατε οὖν καρπὸν',
        translation: 'therefore bear fruit'
      }
    ],
    grammaticalNotes: 'Contract verb (-εω). Aorist: ἐποίησα'
  },
  {
    id: 'grk_018',
    language: 'Greek',
    word: 'ἔρχομαι',
    transliteration: 'erchomai',
    partOfSpeech: 'verb',
    meanings: ['to come', 'to go'],
    frequency: 634,
    chapter: 4,
    examples: [
      {
        reference: 'Matthew 3:11',
        text: 'ὁ δὲ ὀπίσω μου ἐρχόμενος',
        translation: 'but he who is coming after me'
      }
    ],
    grammaticalNotes: 'Deponent verb. Aorist: ἦλθον (from ἐλεύσομαι)'
  },
  {
    id: 'grk_019',
    language: 'Greek',
    word: 'λαλέω',
    transliteration: 'laleō',
    partOfSpeech: 'verb',
    meanings: ['to speak', 'to talk'],
    frequency: 296,
    chapter: 4,
    examples: [
      {
        reference: 'Matthew 9:18',
        text: 'ταῦτα αὐτοῦ λαλοῦντος αὐτοῖς',
        translation: 'while he was saying these things to them'
      }
    ],
    grammaticalNotes: 'Contract verb (-εω). Aorist: ἐλάλησα'
  },
  {
    id: 'grk_020',
    language: 'Greek',
    word: 'δίδωμι',
    transliteration: 'didōmi',
    partOfSpeech: 'verb',
    meanings: ['to give'],
    frequency: 415,
    chapter: 4,
    examples: [
      {
        reference: 'Matthew 4:9',
        text: 'ταῦτά σοι πάντα δώσω',
        translation: 'all these I will give you'
      }
    ],
    grammaticalNotes: 'μι-verb. Present: δίδωμι, δίδως, δίδωσι. Aorist: ἔδωκα'
  },

  // Chapter 5-6: Prepositions and Conjunctions (40 words)
  {
    id: 'grk_021',
    language: 'Greek',
    word: 'ἐν',
    transliteration: 'en',
    partOfSpeech: 'preposition',
    meanings: ['in', 'by', 'with'],
    frequency: 2752,
    chapter: 5,
    examples: [
      {
        reference: 'John 1:1',
        text: 'Ἐν ἀρχῇ ἦν ὁ λόγος',
        translation: 'In the beginning was the Word'
      }
    ],
    grammaticalNotes: 'Takes dative case only'
  },
  {
    id: 'grk_022',
    language: 'Greek',
    word: 'εἰς',
    transliteration: 'eis',
    partOfSpeech: 'preposition',
    meanings: ['into', 'to', 'for'],
    frequency: 1768,
    chapter: 5,
    examples: [
      {
        reference: 'Matthew 2:1',
        text: 'Ἰησοῦ γεννηθέντος ἐν Βηθλέεμ... εἰς Ἱεροσόλυμα',
        translation: 'Jesus was born in Bethlehem... to Jerusalem'
      }
    ],
    grammaticalNotes: 'Takes accusative case only. Indicates motion toward'
  },
  {
    id: 'grk_023',
    language: 'Greek',
    word: 'ἐκ',
    transliteration: 'ek',
    partOfSpeech: 'preposition',
    meanings: ['from', 'out of'],
    frequency: 914,
    chapter: 5,
    examples: [
      {
        reference: 'Matthew 1:3',
        text: 'Φαρὲς ἐγέννησεν... ἐκ τῆς Θαμάρ',
        translation: 'Perez... from Tamar'
      }
    ],
    grammaticalNotes: 'Takes genitive case only. ἐξ before vowels'
  },
  {
    id: 'grk_024',
    language: 'Greek',
    word: 'ἀπό',
    transliteration: 'apo',
    partOfSpeech: 'preposition',
    meanings: ['from', 'away from'],
    frequency: 646,
    chapter: 5,
    examples: [
      {
        reference: 'Matthew 1:17',
        text: 'ἀπὸ Ἀβραὰμ ἕως Δαυίδ',
        translation: 'from Abraham to David'
      }
    ],
    grammaticalNotes: 'Takes genitive case only. ἀπ\' before vowels'
  },
  {
    id: 'grk_025',
    language: 'Greek',
    word: 'πρός',
    transliteration: 'pros',
    partOfSpeech: 'preposition',
    meanings: ['to', 'toward', 'with'],
    frequency: 700,
    chapter: 5,
    examples: [
      {
        reference: 'John 1:1',
        text: 'καὶ ὁ λόγος ἦν πρὸς τὸν θεόν',
        translation: 'and the Word was with God'
      }
    ],
    grammaticalNotes: 'Takes accusative (most common), genitive, or dative'
  },
  {
    id: 'grk_026',
    language: 'Greek',
    word: 'διά',
    transliteration: 'dia',
    partOfSpeech: 'preposition',
    meanings: ['through', 'because of'],
    frequency: 667,
    chapter: 6,
    examples: [
      {
        reference: 'John 1:3',
        text: 'πάντα δι\' αὐτοῦ ἐγένετο',
        translation: 'all things came into being through him'
      }
    ],
    grammaticalNotes: 'Takes genitive (through) or accusative (because of). δι\' before vowels'
  },
  {
    id: 'grk_027',
    language: 'Greek',
    word: 'μετά',
    transliteration: 'meta',
    partOfSpeech: 'preposition',
    meanings: ['with', 'after'],
    frequency: 469,
    chapter: 6,
    examples: [
      {
        reference: 'Matthew 1:23',
        text: 'ὁ θεὸς μεθ\' ἡμῶν',
        translation: 'God with us'
      }
    ],
    grammaticalNotes: 'Takes genitive (with) or accusative (after). μετ\' or μεθ\' before vowels'
  },
  {
    id: 'grk_028',
    language: 'Greek',
    word: 'ἐπί',
    transliteration: 'epi',
    partOfSpeech: 'preposition',
    meanings: ['on', 'upon', 'over'],
    frequency: 890,
    chapter: 6,
    examples: [
      {
        reference: 'Matthew 3:16',
        text: 'καταβαῖνον ἐπ\' αὐτόν',
        translation: 'descending upon him'
      }
    ],
    grammaticalNotes: 'Takes genitive, dative, or accusative. ἐπ\' before vowels'
  },
  {
    id: 'grk_029',
    language: 'Greek',
    word: 'κατά',
    transliteration: 'kata',
    partOfSpeech: 'preposition',
    meanings: ['according to', 'against', 'down'],
    frequency: 473,
    chapter: 6,
    examples: [
      {
        reference: 'Matthew 1:20',
        text: 'ἄγγελος κατ\' ὄναρ ἐφάνη',
        translation: 'an angel appeared in a dream'
      }
    ],
    grammaticalNotes: 'Takes genitive (against, down) or accusative (according to). κατ\' before vowels'
  },
  {
    id: 'grk_030',
    language: 'Greek',
    word: 'ὑπό',
    transliteration: 'hypo',
    partOfSpeech: 'preposition',
    meanings: ['by', 'under'],
    frequency: 220,
    chapter: 6,
    examples: [
      {
        reference: 'Matthew 3:6',
        text: 'ἐβαπτίζοντο... ὑπ\' αὐτοῦ',
        translation: 'they were baptized by him'
      }
    ],
    grammaticalNotes: 'Takes genitive (by - agent) or accusative (under). ὑπ\' before vowels'
  },

  // Conjunctions and particles
  {
    id: 'grk_031',
    language: 'Greek',
    word: 'καί',
    transliteration: 'kai',
    partOfSpeech: 'conjunction',
    meanings: ['and', 'also', 'even'],
    frequency: 9161,
    chapter: 5,
    examples: [
      {
        reference: 'John 1:1',
        text: 'καὶ ὁ λόγος ἦν πρὸς τὸν θεόν',
        translation: 'and the Word was with God'
      }
    ],
    grammaticalNotes: 'Most frequent word in NT. Can mean "and", "also", "even", or "but"'
  },
  {
    id: 'grk_032',
    language: 'Greek',
    word: 'δέ',
    transliteration: 'de',
    partOfSpeech: 'conjunction',
    meanings: ['but', 'and', 'now'],
    frequency: 2792,
    chapter: 5,
    examples: [
      {
        reference: 'Matthew 1:2',
        text: 'Ἀβραὰμ ἐγέννησεν τὸν Ἰσαάκ, Ἰσαὰκ δὲ ἐγέννησεν',
        translation: 'Abraham was the father of Isaac, and Isaac the father of'
      }
    ],
    grammaticalNotes: 'Postpositive (second position in clause). Usually weaker than ἀλλά'
  },
  {
    id: 'grk_033',
    language: 'Greek',
    word: 'ἀλλά',
    transliteration: 'alla',
    partOfSpeech: 'conjunction',
    meanings: ['but', 'rather', 'except'],
    frequency: 638,
    chapter: 6,
    examples: [
      {
        reference: 'Matthew 4:4',
        text: 'οὐκ ἐπ\' ἄρτῳ μόνῳ... ἀλλ\' ἐπὶ παντὶ ῥήματι',
        translation: 'not on bread alone... but on every word'
      }
    ],
    grammaticalNotes: 'Strong adversative. ἀλλ\' before vowels'
  },
  {
    id: 'grk_034',
    language: 'Greek',
    word: 'γάρ',
    transliteration: 'gar',
    partOfSpeech: 'conjunction',
    meanings: ['for', 'because'],
    frequency: 1041,
    chapter: 6,
    examples: [
      {
        reference: 'Matthew 1:21',
        text: 'αὐτὸς γὰρ σώσει τὸν λαὸν αὐτοῦ',
        translation: 'for he will save his people'
      }
    ],
    grammaticalNotes: 'Postpositive. Gives explanation or reason'
  },
  {
    id: 'grk_035',
    language: 'Greek',
    word: 'οὖν',
    transliteration: 'oun',
    partOfSpeech: 'conjunction',
    meanings: ['therefore', 'then'],
    frequency: 499,
    chapter: 6,
    examples: [
      {
        reference: 'Matthew 3:8',
        text: 'ποιήσατε οὖν καρπὸν',
        translation: 'therefore bear fruit'
      }
    ],
    grammaticalNotes: 'Postpositive. Draws inference or conclusion'
  },
  {
    id: 'grk_036',
    language: 'Greek',
    word: 'ὅτι',
    transliteration: 'hoti',
    partOfSpeech: 'conjunction',
    meanings: ['that', 'because'],
    frequency: 1296,
    chapter: 6,
    examples: [
      {
        reference: 'Matthew 2:2',
        text: 'εἴδομεν γὰρ αὐτοῦ τὸν ἀστέρα... καὶ ἤλθομεν προσκυνῆσαι αὐτῷ',
        translation: 'for we saw his star... and have come to worship him'
      }
    ],
    grammaticalNotes: 'Introduces indirect discourse or causal clause'
  },
  {
    id: 'grk_037',
    language: 'Greek',
    word: 'εἰ',
    transliteration: 'ei',
    partOfSpeech: 'conjunction',
    meanings: ['if', 'whether'],
    frequency: 502,
    chapter: 6,
    examples: [
      {
        reference: 'Matthew 4:3',
        text: 'Εἰ υἱὸς εἶ τοῦ θεοῦ',
        translation: 'If you are the Son of God'
      }
    ],
    grammaticalNotes: 'Introduces conditional clauses'
  },
  {
    id: 'grk_038',
    language: 'Greek',
    word: 'ἵνα',
    transliteration: 'hina',
    partOfSpeech: 'conjunction',
    meanings: ['in order that', 'that', 'so that'],
    frequency: 663,
    chapter: 6,
    examples: [
      {
        reference: 'John 3:16',
        text: 'ἵνα πᾶς ὁ πιστεύων... ἔχῃ ζωὴν αἰώνιον',
        translation: 'so that whoever believes... may have eternal life'
      }
    ],
    grammaticalNotes: 'Purpose or result clause, takes subjunctive'
  },
  {
    id: 'grk_039',
    language: 'Greek',
    word: 'ὡς',
    transliteration: 'hōs',
    partOfSpeech: 'conjunction',
    meanings: ['as', 'like', 'when'],
    frequency: 504,
    chapter: 7,
    examples: [
      {
        reference: 'Matthew 1:24',
        text: 'ἐποίησεν ὡς προσέταξεν αὐτῷ',
        translation: 'he did as the angel commanded him'
      }
    ],
    grammaticalNotes: 'Comparison, manner, or temporal'
  },
  {
    id: 'grk_040',
    language: 'Greek',
    word: 'οὐ',
    transliteration: 'ou',
    partOfSpeech: 'particle',
    meanings: ['not'],
    frequency: 1606,
    chapter: 5,
    examples: [
      {
        reference: 'Matthew 4:4',
        text: 'οὐκ ἐπ\' ἄρτῳ μόνῳ',
        translation: 'not on bread alone'
      }
    ],
    grammaticalNotes: 'Negates indicative mood. οὐκ before smooth breathing, οὐχ before rough breathing'
  },

  // Additional essential vocabulary (10 more entries for balance)
  {
    id: 'grk_041',
    language: 'Greek',
    word: 'πιστεύω',
    transliteration: 'pisteuō',
    partOfSpeech: 'verb',
    meanings: ['to believe', 'to trust', 'to have faith'],
    frequency: 241,
    chapter: 7,
    examples: [
      {
        reference: 'John 3:16',
        text: 'πᾶς ὁ πιστεύων εἰς αὐτὸν',
        translation: 'everyone who believes in him'
      }
    ],
    grammaticalNotes: 'Takes dative (believe someone) or εἰς + accusative (believe in)'
  },
  {
    id: 'grk_042',
    language: 'Greek',
    word: 'ἀγαπάω',
    transliteration: 'agapaō',
    partOfSpeech: 'verb',
    meanings: ['to love'],
    frequency: 143,
    chapter: 7,
    examples: [
      {
        reference: 'John 3:16',
        text: 'οὕτως γὰρ ἠγάπησεν ὁ θεὸς τὸν κόσμον',
        translation: 'For God so loved the world'
      }
    ],
    grammaticalNotes: 'Contract verb (-αω). Aorist: ἠγάπησα'
  },
  {
    id: 'grk_043',
    language: 'Greek',
    word: 'ζωή',
    transliteration: 'zōē',
    partOfSpeech: 'noun',
    meanings: ['life'],
    frequency: 135,
    chapter: 7,
    examples: [
      {
        reference: 'John 1:4',
        text: 'ἐν αὐτῷ ζωὴ ἦν',
        translation: 'In him was life'
      }
    ],
    grammaticalNotes: 'Feminine 1st declension noun'
  },
  {
    id: 'grk_044',
    language: 'Greek',
    word: 'κόσμος',
    transliteration: 'kosmos',
    partOfSpeech: 'noun',
    meanings: ['world', 'universe'],
    frequency: 186,
    chapter: 8,
    examples: [
      {
        reference: 'John 3:16',
        text: 'ἠγάπησεν ὁ θεὸς τὸν κόσμον',
        translation: 'God loved the world'
      }
    ],
    grammaticalNotes: 'Masculine 2nd declension noun'
  },
  {
    id: 'grk_045',
    language: 'Greek',
    word: 'πνεῦμα',
    transliteration: 'pneuma',
    partOfSpeech: 'noun',
    meanings: ['spirit', 'Spirit', 'wind', 'breath'],
    frequency: 379,
    chapter: 8,
    examples: [
      {
        reference: 'Matthew 3:16',
        text: 'τὸ πνεῦμα τοῦ θεοῦ',
        translation: 'the Spirit of God'
      }
    ],
    grammaticalNotes: 'Neuter 3rd declension noun'
  },
  {
    id: 'grk_046',
    language: 'Greek',
    word: 'δόξα',
    transliteration: 'doxa',
    partOfSpeech: 'noun',
    meanings: ['glory', 'honor'],
    frequency: 166,
    chapter: 8,
    examples: [
      {
        reference: 'John 1:14',
        text: 'ἐθεασάμεθα τὴν δόξαν αὐτοῦ',
        translation: 'we have seen his glory'
      }
    ],
    grammaticalNotes: 'Feminine 1st declension noun'
  },
  {
    id: 'grk_047',
    language: 'Greek',
    word: 'ἁμαρτία',
    transliteration: 'hamartia',
    partOfSpeech: 'noun',
    meanings: ['sin'],
    frequency: 173,
    chapter: 9,
    examples: [
      {
        reference: 'John 1:29',
        text: 'ὁ αἴρων τὴν ἁμαρτίαν τοῦ κόσμου',
        translation: 'who takes away the sin of the world'
      }
    ],
    grammaticalNotes: 'Feminine 1st declension noun'
  },
  {
    id: 'grk_048',
    language: 'Greek',
    word: 'ἐκκλησία',
    transliteration: 'ekklēsia',
    partOfSpeech: 'noun',
    meanings: ['church', 'assembly'],
    frequency: 114,
    chapter: 9,
    examples: [
      {
        reference: 'Matthew 16:18',
        text: 'οἰκοδομήσω μου τὴν ἐκκλησίαν',
        translation: 'I will build my church'
      }
    ],
    grammaticalNotes: 'Feminine 1st declension noun'
  },
  {
    id: 'grk_049',
    language: 'Greek',
    word: 'βασιλεία',
    transliteration: 'basileia',
    partOfSpeech: 'noun',
    meanings: ['kingdom', 'reign'],
    frequency: 162,
    chapter: 9,
    examples: [
      {
        reference: 'Matthew 3:2',
        text: 'ἤγγικεν ἡ βασιλεία τῶν οὐρανῶν',
        translation: 'the kingdom of heaven is at hand'
      }
    ],
    grammaticalNotes: 'Feminine 1st declension noun'
  },
  {
    id: 'grk_050',
    language: 'Greek',
    word: 'χάρις',
    transliteration: 'charis',
    partOfSpeech: 'noun',
    meanings: ['grace', 'favor'],
    frequency: 155,
    chapter: 10,
    examples: [
      {
        reference: 'John 1:14',
        text: 'πλήρης χάριτος καὶ ἀληθείας',
        translation: 'full of grace and truth'
      }
    ],
    grammaticalNotes: 'Feminine 3rd declension noun'
  }
];

/**
 * Get all vocabulary cards
 */
export const getAllVocabulary = (): VocabularyCard[] => {
  return [...hebrewVocabulary, ...greekVocabulary];
};

/**
 * Get vocabulary by language
 */
export const getVocabularyByLanguage = (language: 'Hebrew' | 'Greek'): VocabularyCard[] => {
  return language === 'Hebrew' ? hebrewVocabulary : greekVocabulary;
};

/**
 * Get vocabulary by chapter range
 */
export const getVocabularyByChapter = (
  language: 'Hebrew' | 'Greek',
  startChapter: number,
  endChapter: number
): VocabularyCard[] => {
  const vocab = getVocabularyByLanguage(language);
  return vocab.filter(card => card.chapter >= startChapter && card.chapter <= endChapter);
};

/**
 * Get vocabulary by part of speech
 */
export const getVocabularyByPartOfSpeech = (
  language: 'Hebrew' | 'Greek',
  partOfSpeech: VocabularyCard['partOfSpeech']
): VocabularyCard[] => {
  const vocab = getVocabularyByLanguage(language);
  return vocab.filter(card => card.partOfSpeech === partOfSpeech);
};
