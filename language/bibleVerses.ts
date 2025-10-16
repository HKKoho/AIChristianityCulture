import { Language } from './types';

export interface HighlightedWord {
  original: string;        // Hebrew/Greek text
  transliteration: string;
  meaning: string;
  position: number;        // Position in the verse text
}

export interface BibleVerse {
  reference: string;       // e.g., "John 3:16"
  language: Language;
  translation: string;     // English translation
  originalText?: string;   // Full Hebrew/Greek text (optional)
  highlightedWords: HighlightedWord[];
}

export const BIBLE_VERSES: BibleVerse[] = [
  // Old Testament - Hebrew
  {
    reference: '創世記 1:1',
    language: Language.HEBREW,
    translation: 'In the beginning God created the heavens and the earth.',
    originalText: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ',
    highlightedWords: [
      { original: 'בְּרֵאשִׁית', transliteration: 'Bereshit', meaning: 'In the beginning', position: 0 },
      { original: 'בָּרָא', transliteration: 'Bara', meaning: 'created', position: 1 },
      { original: 'אֱלֹהִים', transliteration: 'Elohim', meaning: 'God', position: 2 },
    ],
  },
  {
    reference: '詩篇 23:1',
    language: Language.HEBREW,
    translation: 'The LORD is my shepherd; I shall not want.',
    originalText: 'יְהוָה רֹעִי לֹא אֶחְסָר',
    highlightedWords: [
      { original: 'יְהוָה', transliteration: 'Yahweh', meaning: 'The LORD', position: 0 },
      { original: 'רֹעִי', transliteration: 'Ro\'i', meaning: 'my shepherd', position: 1 },
    ],
  },
  {
    reference: '以賽亞書 9:6',
    language: Language.HEBREW,
    translation: 'For to us a child is born, to us a son is given.',
    originalText: 'כִּי־יֶלֶד יֻלַּד־לָנוּ בֵּן נִתַּן־לָנוּ',
    highlightedWords: [
      { original: 'יֶלֶד', transliteration: 'Yeled', meaning: 'child', position: 0 },
      { original: 'בֵּן', transliteration: 'Ben', meaning: 'son', position: 1 },
    ],
  },
  {
    reference: '申命記 6:4',
    language: Language.HEBREW,
    translation: 'Hear, O Israel: The LORD our God, the LORD is one.',
    originalText: 'שְׁמַע יִשְׂרָאֵל יְהוָה אֱלֹהֵינוּ יְהוָה אֶחָד',
    highlightedWords: [
      { original: 'שְׁמַע', transliteration: 'Shema', meaning: 'Hear', position: 0 },
      { original: 'יִשְׂרָאֵל', transliteration: 'Yisrael', meaning: 'Israel', position: 1 },
      { original: 'אֶחָד', transliteration: 'Echad', meaning: 'one', position: 2 },
    ],
  },

  // New Testament - Greek
  {
    reference: '約翰福音 1:1',
    language: Language.GREEK,
    translation: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
    originalText: 'Ἐν ἀρχῇ ἦν ὁ λόγος καὶ ὁ λόγος ἦν πρὸς τὸν θεόν καὶ θεὸς ἦν ὁ λόγος',
    highlightedWords: [
      { original: 'ἀρχῇ', transliteration: 'Arche', meaning: 'beginning', position: 0 },
      { original: 'λόγος', transliteration: 'Logos', meaning: 'Word', position: 1 },
      { original: 'θεόν', transliteration: 'Theos', meaning: 'God', position: 2 },
    ],
  },
  {
    reference: '約翰福音 3:16',
    language: Language.GREEK,
    translation: 'For God so loved the world that he gave his one and only Son.',
    originalText: 'οὕτως γὰρ ἠγάπησεν ὁ θεὸς τὸν κόσμον ὥστε τὸν υἱὸν τὸν μονογενῆ ἔδωκεν',
    highlightedWords: [
      { original: 'ἠγάπησεν', transliteration: 'Egapesen', meaning: 'loved', position: 0 },
      { original: 'θεὸς', transliteration: 'Theos', meaning: 'God', position: 1 },
      { original: 'κόσμον', transliteration: 'Kosmon', meaning: 'world', position: 2 },
      { original: 'υἱὸν', transliteration: 'Huion', meaning: 'Son', position: 3 },
    ],
  },
  {
    reference: '哥林多前書 13:13',
    language: Language.GREEK,
    translation: 'And now these three remain: faith, hope and love. But the greatest of these is love.',
    originalText: 'νυνὶ δὲ μένει πίστις ἐλπίς ἀγάπη τὰ τρία ταῦτα μείζων δὲ τούτων ἡ ἀγάπη',
    highlightedWords: [
      { original: 'πίστις', transliteration: 'Pistis', meaning: 'faith', position: 0 },
      { original: 'ἐλπίς', transliteration: 'Elpis', meaning: 'hope', position: 1 },
      { original: 'ἀγάπη', transliteration: 'Agape', meaning: 'love', position: 2 },
    ],
  },
  {
    reference: '腓立比書 4:13',
    language: Language.GREEK,
    translation: 'I can do all things through Christ who strengthens me.',
    originalText: 'πάντα ἰσχύω ἐν τῷ ἐνδυναμοῦντί με',
    highlightedWords: [
      { original: 'πάντα', transliteration: 'Panta', meaning: 'all things', position: 0 },
      { original: 'ἰσχύω', transliteration: 'Ischuo', meaning: 'I am able/can do', position: 1 },
      { original: 'ἐνδυναμοῦντί', transliteration: 'Endunamounti', meaning: 'strengthening', position: 2 },
    ],
  },

  // Additional Hebrew Verses (Essential Old Testament)
  {
    reference: '創世記 1:3',
    language: Language.HEBREW,
    translation: 'And God said, "Let there be light," and there was light.',
    originalText: 'וַיֹּאמֶר אֱלֹהִים יְהִי אוֹר וַיְהִי־אוֹר',
    highlightedWords: [
      { original: 'וַיֹּאמֶר', transliteration: 'Vayomer', meaning: 'and He said', position: 0 },
      { original: 'יְהִי', transliteration: 'Yehi', meaning: 'let there be', position: 1 },
      { original: 'אוֹר', transliteration: 'Or', meaning: 'light', position: 2 },
    ],
  },
  {
    reference: '出埃及記 3:14',
    language: Language.HEBREW,
    translation: 'God said to Moses, "I AM WHO I AM."',
    originalText: 'וַיֹּאמֶר אֱלֹהִים אֶל־מֹשֶׁה אֶהְיֶה אֲשֶׁר אֶהְיֶה',
    highlightedWords: [
      { original: 'אֶהְיֶה', transliteration: 'Ehyeh', meaning: 'I am/I will be', position: 0 },
      { original: 'מֹשֶׁה', transliteration: 'Moshe', meaning: 'Moses', position: 1 },
    ],
  },
  {
    reference: '詩篇 1:1',
    language: Language.HEBREW,
    translation: 'Blessed is the man who does not walk in the counsel of the wicked.',
    originalText: 'אַשְׁרֵי־הָאִישׁ אֲשֶׁר לֹא הָלַךְ בַּעֲצַת רְשָׁעִים',
    highlightedWords: [
      { original: 'אַשְׁרֵי', transliteration: 'Ashrei', meaning: 'Blessed', position: 0 },
      { original: 'הָאִישׁ', transliteration: 'Ha\'ish', meaning: 'the man', position: 1 },
      { original: 'רְשָׁעִים', transliteration: 'Resha\'im', meaning: 'wicked', position: 2 },
    ],
  },
  {
    reference: '箴言 3:5',
    language: Language.HEBREW,
    translation: 'Trust in the LORD with all your heart.',
    originalText: 'בְּטַח אֶל־יְהוָה בְּכָל־לִבֶּךָ',
    highlightedWords: [
      { original: 'בְּטַח', transliteration: 'Betach', meaning: 'Trust', position: 0 },
      { original: 'לִבֶּךָ', transliteration: 'Libekha', meaning: 'your heart', position: 1 },
    ],
  },
  {
    reference: '傳道書 3:1',
    language: Language.HEBREW,
    translation: 'There is a time for everything, and a season for every activity under the heavens.',
    originalText: 'לַכֹּל זְמָן וְעֵת לְכָל־חֵפֶץ תַּחַת הַשָּׁמָיִם',
    highlightedWords: [
      { original: 'זְמָן', transliteration: 'Zeman', meaning: 'time', position: 0 },
      { original: 'עֵת', transliteration: 'Et', meaning: 'season', position: 1 },
      { original: 'חֵפֶץ', transliteration: 'Chefetz', meaning: 'activity/purpose', position: 2 },
    ],
  },
  {
    reference: '以賽亞書 6:3',
    language: Language.HEBREW,
    translation: 'Holy, holy, holy is the LORD Almighty.',
    originalText: 'קָדוֹשׁ קָדוֹשׁ קָדוֹשׁ יְהוָה צְבָאוֹת',
    highlightedWords: [
      { original: 'קָדוֹשׁ', transliteration: 'Qadosh', meaning: 'Holy', position: 0 },
      { original: 'צְבָאוֹת', transliteration: 'Tzeva\'ot', meaning: 'of Hosts/Almighty', position: 1 },
    ],
  },
  {
    reference: '耶利米書 29:11',
    language: Language.HEBREW,
    translation: 'For I know the plans I have for you, declares the LORD.',
    originalText: 'כִּי אָנֹכִי יָדַעְתִּי אֶת־הַמַּחֲשָׁבֹת אֲשֶׁר אָנֹכִי חֹשֵׁב עֲלֵיכֶם נְאֻם־יְהוָה',
    highlightedWords: [
      { original: 'יָדַעְתִּי', transliteration: 'Yada\'ti', meaning: 'I know', position: 0 },
      { original: 'מַּחֲשָׁבֹת', transliteration: 'Machashavot', meaning: 'plans/thoughts', position: 1 },
      { original: 'נְאֻם', transliteration: 'Ne\'um', meaning: 'declares', position: 2 },
    ],
  },
  {
    reference: '彌迦書 6:8',
    language: Language.HEBREW,
    translation: 'He has shown you, O mortal, what is good.',
    originalText: 'הִגִּיד לְךָ אָדָם מַה־טּוֹב',
    highlightedWords: [
      { original: 'הִגִּיד', transliteration: 'Higid', meaning: 'He has shown', position: 0 },
      { original: 'אָדָם', transliteration: 'Adam', meaning: 'man/mortal', position: 1 },
      { original: 'טּוֹב', transliteration: 'Tov', meaning: 'good', position: 2 },
    ],
  },
  {
    reference: '耶利米哀歌 3:22-23',
    language: Language.HEBREW,
    translation: 'Because of the LORD\'s great love we are not consumed, for his compassions never fail.',
    originalText: 'חַסְדֵי יְהוָה כִּי לֹא־תָמְנוּ כִּי לֹא־כָלוּ רַחֲמָיו',
    highlightedWords: [
      { original: 'חַסְדֵי', transliteration: 'Chasdei', meaning: 'steadfast love', position: 0 },
      { original: 'רַחֲמָיו', transliteration: 'Rachamav', meaning: 'His compassions', position: 1 },
    ],
  },
  {
    reference: '瑪拉基書 3:10',
    language: Language.HEBREW,
    translation: 'Bring the whole tithe into the storehouse.',
    originalText: 'הָבִיאוּ אֶת־כָּל־הַמַּעֲשֵׂר אֶל־בֵּית הָאוֹצָר',
    highlightedWords: [
      { original: 'הָבִיאוּ', transliteration: 'Havi\'u', meaning: 'Bring', position: 0 },
      { original: 'מַּעֲשֵׂר', transliteration: 'Ma\'aser', meaning: 'tithe', position: 1 },
      { original: 'אוֹצָר', transliteration: 'Otzar', meaning: 'storehouse', position: 2 },
    ],
  },
  {
    reference: '民數記 6:24-26',
    language: Language.HEBREW,
    translation: 'The LORD bless you and keep you.',
    originalText: 'יְבָרֶכְךָ יְהוָה וְיִשְׁמְרֶךָ',
    highlightedWords: [
      { original: 'יְבָרֶכְךָ', transliteration: 'Yevarechecha', meaning: 'bless you', position: 0 },
      { original: 'וְיִשְׁמְרֶךָ', transliteration: 'Veyishmerecha', meaning: 'and keep you', position: 1 },
    ],
  },
  {
    reference: '歷代志上 29:11',
    language: Language.HEBREW,
    translation: 'Yours, O LORD, is the greatness and the power.',
    originalText: 'לְךָ יְהוָה הַגְּדֻלָּה וְהַגְּבוּרָה',
    highlightedWords: [
      { original: 'הַגְּדֻלָּה', transliteration: 'Hagedulah', meaning: 'the greatness', position: 0 },
      { original: 'הַגְּבוּרָה', transliteration: 'Hagevurah', meaning: 'the power/might', position: 1 },
    ],
  },
  {
    reference: '詩篇 46:1',
    language: Language.HEBREW,
    translation: 'God is our refuge and strength.',
    originalText: 'אֱלֹהִים לָנוּ מַחֲסֶה וָעֹז',
    highlightedWords: [
      { original: 'מַחֲסֶה', transliteration: 'Machaseh', meaning: 'refuge', position: 0 },
      { original: 'עֹז', transliteration: 'Oz', meaning: 'strength', position: 1 },
    ],
  },
  {
    reference: '詩篇 119:105',
    language: Language.HEBREW,
    translation: 'Your word is a lamp for my feet, a light on my path.',
    originalText: 'נֵר־לְרַגְלִי דְבָרֶךָ וְאוֹר לִנְתִיבָתִי',
    highlightedWords: [
      { original: 'נֵר', transliteration: 'Ner', meaning: 'lamp', position: 0 },
      { original: 'דְבָרֶךָ', transliteration: 'Devarecha', meaning: 'Your word', position: 1 },
      { original: 'אוֹר', transliteration: 'Or', meaning: 'light', position: 2 },
    ],
  },
  {
    reference: '約書亞記 1:9',
    language: Language.HEBREW,
    translation: 'Be strong and courageous. Do not be afraid.',
    originalText: 'חֲזַק וֶאֱמָץ אַל־תַּעֲרֹץ וְאַל־תֵּחָת',
    highlightedWords: [
      { original: 'חֲזַק', transliteration: 'Chazaq', meaning: 'Be strong', position: 0 },
      { original: 'אֱמָץ', transliteration: 'Ematz', meaning: 'courageous', position: 1 },
      { original: 'תַּעֲרֹץ', transliteration: 'Ta\'arotz', meaning: 'be afraid', position: 2 },
    ],
  },
  {
    reference: '但以理書 12:3',
    language: Language.HEBREW,
    translation: 'Those who are wise will shine like the brightness of the heavens.',
    originalText: 'וְהַמַּשְׂכִּלִים יַזְהִרוּ כְּזֹהַר הָרָקִיעַ',
    highlightedWords: [
      { original: 'מַּשְׂכִּלִים', transliteration: 'Maskilim', meaning: 'wise ones', position: 0 },
      { original: 'יַזְהִרוּ', transliteration: 'Yazhiru', meaning: 'will shine', position: 1 },
      { original: 'רָקִיעַ', transliteration: 'Raqi\'a', meaning: 'heavens/expanse', position: 2 },
    ],
  },

  // Additional Greek Verses (Essential New Testament)
  {
    reference: '馬太福音 5:3',
    language: Language.GREEK,
    translation: 'Blessed are the poor in spirit, for theirs is the kingdom of heaven.',
    originalText: 'Μακάριοι οἱ πτωχοὶ τῷ πνεύματι ὅτι αὐτῶν ἐστιν ἡ βασιλεία τῶν οὐρανῶν',
    highlightedWords: [
      { original: 'Μακάριοι', transliteration: 'Makarioi', meaning: 'Blessed', position: 0 },
      { original: 'πτωχοὶ', transliteration: 'Ptochoi', meaning: 'poor', position: 1 },
      { original: 'πνεύματι', transliteration: 'Pneumati', meaning: 'in spirit', position: 2 },
      { original: 'βασιλεία', transliteration: 'Basileia', meaning: 'kingdom', position: 3 },
    ],
  },
  {
    reference: '馬太福音 6:9',
    language: Language.GREEK,
    translation: 'Our Father in heaven, hallowed be your name.',
    originalText: 'Πάτερ ἡμῶν ὁ ἐν τοῖς οὐρανοῖς ἁγιασθήτω τὸ ὄνομά σου',
    highlightedWords: [
      { original: 'Πάτερ', transliteration: 'Pater', meaning: 'Father', position: 0 },
      { original: 'ἁγιασθήτω', transliteration: 'Hagiastheto', meaning: 'hallowed be', position: 1 },
      { original: 'ὄνομά', transliteration: 'Onoma', meaning: 'name', position: 2 },
    ],
  },
  {
    reference: '馬太福音 28:19',
    language: Language.GREEK,
    translation: 'Go and make disciples of all nations.',
    originalText: 'πορευθέντες μαθητεύσατε πάντα τὰ ἔθνη',
    highlightedWords: [
      { original: 'πορευθέντες', transliteration: 'Poreuthentes', meaning: 'Go', position: 0 },
      { original: 'μαθητεύσατε', transliteration: 'Matheteusate', meaning: 'make disciples', position: 1 },
      { original: 'ἔθνη', transliteration: 'Ethne', meaning: 'nations', position: 2 },
    ],
  },
  {
    reference: '馬可福音 1:15',
    language: Language.GREEK,
    translation: 'Repent and believe the good news.',
    originalText: 'μετανοεῖτε καὶ πιστεύετε ἐν τῷ εὐαγγελίῳ',
    highlightedWords: [
      { original: 'μετανοεῖτε', transliteration: 'Metanoeite', meaning: 'Repent', position: 0 },
      { original: 'πιστεύετε', transliteration: 'Pisteuete', meaning: 'believe', position: 1 },
      { original: 'εὐαγγελίῳ', transliteration: 'Euangelio', meaning: 'gospel/good news', position: 2 },
    ],
  },
  {
    reference: '路加福音 2:11',
    language: Language.GREEK,
    translation: 'Today in the town of David a Savior has been born to you; he is the Messiah, the Lord.',
    originalText: 'ὅτι ἐτέχθη ὑμῖν σήμερον σωτὴρ ὅς ἐστιν χριστὸς κύριος',
    highlightedWords: [
      { original: 'σωτὴρ', transliteration: 'Soter', meaning: 'Savior', position: 0 },
      { original: 'χριστὸς', transliteration: 'Christos', meaning: 'Christ/Messiah', position: 1 },
      { original: 'κύριος', transliteration: 'Kyrios', meaning: 'Lord', position: 2 },
    ],
  },
  {
    reference: '約翰福音 14:6',
    language: Language.GREEK,
    translation: 'I am the way and the truth and the life.',
    originalText: 'ἐγώ εἰμι ἡ ὁδὸς καὶ ἡ ἀλήθεια καὶ ἡ ζωή',
    highlightedWords: [
      { original: 'ὁδὸς', transliteration: 'Hodos', meaning: 'way', position: 0 },
      { original: 'ἀλήθεια', transliteration: 'Aletheia', meaning: 'truth', position: 1 },
      { original: 'ζωή', transliteration: 'Zoe', meaning: 'life', position: 2 },
    ],
  },
  {
    reference: '使徒行傳 2:38',
    language: Language.GREEK,
    translation: 'Repent and be baptized, every one of you, in the name of Jesus Christ.',
    originalText: 'μετανοήσατε καὶ βαπτισθήτω ἕκαστος ὑμῶν ἐπὶ τῷ ὀνόματι Ἰησοῦ Χριστοῦ',
    highlightedWords: [
      { original: 'μετανοήσατε', transliteration: 'Metanoesate', meaning: 'Repent', position: 0 },
      { original: 'βαπτισθήτω', transliteration: 'Baptistheto', meaning: 'be baptized', position: 1 },
      { original: 'ὀνόματι', transliteration: 'Onomati', meaning: 'name', position: 2 },
    ],
  },
  {
    reference: '羅馬書 3:23',
    language: Language.GREEK,
    translation: 'For all have sinned and fall short of the glory of God.',
    originalText: 'πάντες γὰρ ἥμαρτον καὶ ὑστεροῦνται τῆς δόξης τοῦ θεοῦ',
    highlightedWords: [
      { original: 'ἥμαρτον', transliteration: 'Hemarton', meaning: 'have sinned', position: 0 },
      { original: 'δόξης', transliteration: 'Doxes', meaning: 'glory', position: 1 },
    ],
  },
  {
    reference: '羅馬書 6:23',
    language: Language.GREEK,
    translation: 'For the wages of sin is death, but the gift of God is eternal life.',
    originalText: 'τὰ γὰρ ὀψώνια τῆς ἁμαρτίας θάνατος τὸ δὲ χάρισμα τοῦ θεοῦ ζωὴ αἰώνιος',
    highlightedWords: [
      { original: 'ἁμαρτίας', transliteration: 'Hamartias', meaning: 'sin', position: 0 },
      { original: 'θάνατος', transliteration: 'Thanatos', meaning: 'death', position: 1 },
      { original: 'χάρισμα', transliteration: 'Charisma', meaning: 'gift', position: 2 },
      { original: 'αἰώνιος', transliteration: 'Aionios', meaning: 'eternal', position: 3 },
    ],
  },
  {
    reference: '羅馬書 8:28',
    language: Language.GREEK,
    translation: 'And we know that in all things God works for the good of those who love him.',
    originalText: 'οἴδαμεν δὲ ὅτι τοῖς ἀγαπῶσιν τὸν θεὸν πάντα συνεργεῖ εἰς ἀγαθόν',
    highlightedWords: [
      { original: 'ἀγαπῶσιν', transliteration: 'Agaposin', meaning: 'love', position: 0 },
      { original: 'συνεργεῖ', transliteration: 'Synergei', meaning: 'works together', position: 1 },
      { original: 'ἀγαθόν', transliteration: 'Agathon', meaning: 'good', position: 2 },
    ],
  },
  {
    reference: '哥林多前書 10:13',
    language: Language.GREEK,
    translation: 'God is faithful; he will not let you be tempted beyond what you can bear.',
    originalText: 'πιστὸς δὲ ὁ θεός ὃς οὐκ ἐάσει ὑμᾶς πειρασθῆναι ὑπὲρ ὃ δύνασθε',
    highlightedWords: [
      { original: 'πιστὸς', transliteration: 'Pistos', meaning: 'faithful', position: 0 },
      { original: 'πειρασθῆναι', transliteration: 'Peirasthenai', meaning: 'to be tempted', position: 1 },
      { original: 'δύνασθε', transliteration: 'Dynasthe', meaning: 'you are able', position: 2 },
    ],
  },
  {
    reference: '加拉太書 5:22-23',
    language: Language.GREEK,
    translation: 'But the fruit of the Spirit is love, joy, peace.',
    originalText: 'ὁ δὲ καρπὸς τοῦ πνεύματός ἐστιν ἀγάπη χαρὰ εἰρήνη',
    highlightedWords: [
      { original: 'καρπὸς', transliteration: 'Karpos', meaning: 'fruit', position: 0 },
      { original: 'χαρὰ', transliteration: 'Chara', meaning: 'joy', position: 1 },
      { original: 'εἰρήνη', transliteration: 'Eirene', meaning: 'peace', position: 2 },
    ],
  },
  {
    reference: '以弗所書 2:8-9',
    language: Language.GREEK,
    translation: 'For it is by grace you have been saved, through faith.',
    originalText: 'τῇ γὰρ χάριτί ἐστε σεσῳσμένοι διὰ πίστεως',
    highlightedWords: [
      { original: 'χάριτί', transliteration: 'Chariti', meaning: 'grace', position: 0 },
      { original: 'σεσῳσμένοι', transliteration: 'Sesosmenoi', meaning: 'saved', position: 1 },
      { original: 'πίστεως', transliteration: 'Pisteos', meaning: 'faith', position: 2 },
    ],
  },
  {
    reference: '腓立比書 4:4',
    language: Language.GREEK,
    translation: 'Rejoice in the Lord always. I will say it again: Rejoice!',
    originalText: 'χαίρετε ἐν κυρίῳ πάντοτε πάλιν ἐρῶ χαίρετε',
    highlightedWords: [
      { original: 'χαίρετε', transliteration: 'Chairete', meaning: 'Rejoice', position: 0 },
      { original: 'κυρίῳ', transliteration: 'Kyrio', meaning: 'Lord', position: 1 },
      { original: 'πάντοτε', transliteration: 'Pantote', meaning: 'always', position: 2 },
    ],
  },
  {
    reference: '歌羅西書 3:23',
    language: Language.GREEK,
    translation: 'Whatever you do, work at it with all your heart, as working for the Lord.',
    originalText: 'ὃ ἐὰν ποιῆτε ἐκ ψυχῆς ἐργάζεσθε ὡς τῷ κυρίῳ',
    highlightedWords: [
      { original: 'ψυχῆς', transliteration: 'Psyches', meaning: 'soul/heart', position: 0 },
      { original: 'ἐργάζεσθε', transliteration: 'Ergazesthe', meaning: 'work', position: 1 },
    ],
  },
  {
    reference: '帖撒羅尼迦前書 5:16-18',
    language: Language.GREEK,
    translation: 'Rejoice always, pray continually, give thanks in all circumstances.',
    originalText: 'πάντοτε χαίρετε ἀδιαλείπτως προσεύχεσθε ἐν παντὶ εὐχαριστεῖτε',
    highlightedWords: [
      { original: 'ἀδιαλείπτως', transliteration: 'Adialeiptos', meaning: 'continually/unceasingly', position: 0 },
      { original: 'προσεύχεσθε', transliteration: 'Proseuchesthe', meaning: 'pray', position: 1 },
      { original: 'εὐχαριστεῖτε', transliteration: 'Eucharistei', meaning: 'give thanks', position: 2 },
    ],
  },
  {
    reference: '提摩太後書 3:16',
    language: Language.GREEK,
    translation: 'All Scripture is God-breathed and is useful for teaching.',
    originalText: 'πᾶσα γραφὴ θεόπνευστος καὶ ὠφέλιμος πρὸς διδασκαλίαν',
    highlightedWords: [
      { original: 'γραφὴ', transliteration: 'Graphe', meaning: 'Scripture', position: 0 },
      { original: 'θεόπνευστος', transliteration: 'Theopneustos', meaning: 'God-breathed', position: 1 },
      { original: 'διδασκαλίαν', transliteration: 'Didaskalian', meaning: 'teaching', position: 2 },
    ],
  },
  {
    reference: '希伯來書 11:1',
    language: Language.GREEK,
    translation: 'Now faith is confidence in what we hope for.',
    originalText: 'ἔστιν δὲ πίστις ἐλπιζομένων ὑπόστασις',
    highlightedWords: [
      { original: 'πίστις', transliteration: 'Pistis', meaning: 'faith', position: 0 },
      { original: 'ἐλπιζομένων', transliteration: 'Elpizomenon', meaning: 'things hoped for', position: 1 },
      { original: 'ὑπόστασις', transliteration: 'Hypostasis', meaning: 'confidence/assurance', position: 2 },
    ],
  },
  {
    reference: '雅各書 1:22',
    language: Language.GREEK,
    translation: 'Do not merely listen to the word, and so deceive yourselves. Do what it says.',
    originalText: 'γίνεσθε δὲ ποιηταὶ λόγου καὶ μὴ μόνον ἀκροαταί',
    highlightedWords: [
      { original: 'ποιηταὶ', transliteration: 'Poietai', meaning: 'doers', position: 0 },
      { original: 'λόγου', transliteration: 'Logou', meaning: 'word', position: 1 },
      { original: 'ἀκροαταί', transliteration: 'Akroatai', meaning: 'hearers', position: 2 },
    ],
  },
  {
    reference: '彼得前書 5:7',
    language: Language.GREEK,
    translation: 'Cast all your anxiety on him because he cares for you.',
    originalText: 'πᾶσαν τὴν μέριμναν ὑμῶν ἐπιρίψαντες ἐπ αὐτόν ὅτι αὐτῷ μέλει περὶ ὑμῶν',
    highlightedWords: [
      { original: 'μέριμναν', transliteration: 'Merimnan', meaning: 'anxiety/care', position: 0 },
      { original: 'ἐπιρίψαντες', transliteration: 'Epiripsantes', meaning: 'casting', position: 1 },
      { original: 'μέλει', transliteration: 'Melei', meaning: 'cares', position: 2 },
    ],
  },
  {
    reference: '約翰一書 4:8',
    language: Language.GREEK,
    translation: 'Whoever does not love does not know God, because God is love.',
    originalText: 'ὁ μὴ ἀγαπῶν οὐκ ἔγνω τὸν θεόν ὅτι ὁ θεὸς ἀγάπη ἐστίν',
    highlightedWords: [
      { original: 'ἀγαπῶν', transliteration: 'Agapon', meaning: 'loving', position: 0 },
      { original: 'ἔγνω', transliteration: 'Egno', meaning: 'knows', position: 1 },
      { original: 'ἀγάπη', transliteration: 'Agape', meaning: 'love', position: 2 },
    ],
  },
  {
    reference: '啟示錄 3:20',
    language: Language.GREEK,
    translation: 'Here I am! I stand at the door and knock.',
    originalText: 'ἰδοὺ ἕστηκα ἐπὶ τὴν θύραν καὶ κρούω',
    highlightedWords: [
      { original: 'ἕστηκα', transliteration: 'Hesteka', meaning: 'I stand', position: 0 },
      { original: 'θύραν', transliteration: 'Thyran', meaning: 'door', position: 1 },
      { original: 'κρούω', transliteration: 'Krouo', meaning: 'I knock', position: 2 },
    ],
  },
  {
    reference: '啟示錄 21:4',
    language: Language.GREEK,
    translation: 'He will wipe every tear from their eyes.',
    originalText: 'καὶ ἐξαλείψει πᾶν δάκρυον ἐκ τῶν ὀφθαλμῶν αὐτῶν',
    highlightedWords: [
      { original: 'ἐξαλείψει', transliteration: 'Exaleipsei', meaning: 'will wipe away', position: 0 },
      { original: 'δάκρυον', transliteration: 'Dakryon', meaning: 'tear', position: 1 },
      { original: 'ὀφθαλμῶν', transliteration: 'Ophthalmon', meaning: 'eyes', position: 2 },
    ],
  },
];

export const getVersesByLanguage = (language: Language): BibleVerse[] => {
  return BIBLE_VERSES.filter(verse => verse.language === language);
};

export const getVerseByReference = (reference: string): BibleVerse | undefined => {
  return BIBLE_VERSES.find(verse => verse.reference === reference);
};
