import type { Location, Quest, Level } from '../types';

export const quests: Quest[] = [
  {
    id: 'q1',
    character: '亞伯拉罕',
    characterImage: 'https://picsum.photos/seed/abraham/100',
    question: '上帝與我立約，並以一個特定的記號為標誌。這個約主要是關於什麼？',
    options: [
      '一個新船的承諾。',
      '土地、後裔和祝福的承諾。',
      '建造金字塔的合約。',
      '只吃蔬菜的法令。',
    ],
    correctAnswerIndex: 1,
    explanation: '亞伯拉罕之約（創世記 12, 15, 17章）是上帝一個基礎性的應許。這個約的記號是割禮，一個象徵分別為聖的身體標記。這個「分別為聖」的主題是歸入基督名下概念的前身。',
    journalPrompt: {
      title: '亞伯拉罕之約',
      content: '約是神聖的承諾。上帝應許亞伯拉罕土地、無數的後裔，並且萬國都將因他得福。這為上帝與人類持續的關係奠定了基礎。'
    },
    deepDive: {
      title: '聖約神學',
      content: '在希伯來文中，約是 "berit"。它不僅僅是一份合約；它是一個將兩方連結在一起的莊嚴誓言。古代的約通常包含一個儀式或記號，就像割禮一樣。這種具有約束力的關係性承諾的概念，對於理解後來的聖經主題，包括耶穌所立的新約，至關重要。',
      sources: [
        { text: '創世記 17:1-14 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Genesis+17&version=NIV' },
        { text: '早期教父論聖約', url: '#' },
      ]
    }
  },
  {
    id: 'q2',
    character: '摩西',
    characterImage: 'https://picsum.photos/seed/moses/100',
    question: '在西奈山，我為以色列領受了律法，其中包含許多涉及血的潔淨禮儀。這些禮儀的主要目的是什麼？',
    options: [
      '在沙漠的炎熱中降溫。',
      '為年度游泳比賽做準備。',
      '潔淨禮儀上的不潔，以恢復親近上帝的機會。',
      '在節期前洗衣服。',
    ],
    correctAnswerIndex: 2,
    explanation: '利未記的律法（利未記 11-15章）規定用血洗滌，贖罪祭的禮儀為潔淨個人不潔或腐敗 （例如，接觸屍體或患有皮膚病後）。這不是關於身體的骯髒，而是關於處於聖潔的狀態，以便親近聖潔的上帝。血屬靈潔淨的有力象徵。',
     journalPrompt: {
      title: '以水潔淨',
      content: '賜給摩西的律法教導說，上帝是聖潔的，人們需要被潔淨才能親近祂。血是這種禮儀潔淨的主要方式，象徵著從不潔狀態到潔淨狀態的轉變。'
    },
    deepDive: {
      title: '禮儀潔淨與道德潔淨',
      content: '區分禮儀上的不潔與罪是很重要的。一個人可能在沒有犯罪的情況下變得禮儀上不潔。這些律法教導以色列一個深刻的功課：親近上帝需要聖潔。後來的先知會強調，內心真正的潔淨比外在的儀式更重要，這是施洗約翰和耶穌將會進一步發展的主題。',
      sources: [
        { text: '利未記 15:31 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Leviticus+15:31&version=ESV' },
        { text: '希伯來書 9:13-14 (KJV)', url: 'https://www.biblegateway.com/passage/?search=Hebrews+9:13-14&version=KJV' },
      ]
    }
  },
  {
    id: 'q5',
    character: '以西結',
    characterImage: 'https://picsum.photos/seed/ezekiel/100',
    question: '在流亡巴比倫期間，我傳達了上帝的一個應許，要賜給祂的子民一顆「新心」和一個「新靈」。這個應許主要意味著什麼？',
    options: [
      '身體上的心臟移植。',
      '對新音樂風格的欣賞。',
      '一種內在的、屬靈的轉變，使人能夠順服上帝。',
      '學習新語言的能力。',
    ],
    correctAnswerIndex: 2,
    explanation: '以西結書 36:25-27 是一個關鍵的舊約段落，預言了上帝將要進行的內在潔淨和更新工作。上帝應許要用清水潔淨祂的子民，除去他們的「石心」（硬心），並賜給他們一顆「肉心」（軟心），將祂的靈放在他們裡面。這直接預示了基督教洗禮中所象徵的重生和聖靈的內住。',
    journalPrompt: {
      title: '新心的應許',
      content: '先知以西結預言了一個超越外在儀式的新約。上帝應許要從內心深處改變祂的子民，潔淨他們，並賜給他們祂的靈，使他們能夠遵行祂的道。',
    },
    deepDive: {
      title: '舊約中的重生',
      content: '雖然「重生」一詞是新約的概念，但其根源深植於舊約的應許中。像以西結書 36 章和耶利米書 31:31-34（關於刻在心版上的新約）這樣的段落，都指向了上帝有一天會對人心進行根本性的工作。這不再僅僅是遵守外在的律法，而是擁有一顆被改變的、渴望順服上帝的心。基督教的洗禮正是這個應許實現的標誌。',
      sources: [
        { text: '以西結書 36:25-27 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Ezekiel+36:25-27&version=NIV' },
        { text: '耶利米書 31:31-34 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Jeremiah+31:31-34&version=ESV' },
      ],
    },
  },
  {
    id: 'q3',
    character: '施洗約翰',
    characterImage: 'https://picsum.photos/seed/john/100',
    question: '我在約旦河為人們施洗。我的洗禮是...',
    options: [
      '悔改的洗，使罪得赦。',
      '加入當地的釣魚俱樂部。',
      '加入羅馬軍隊的入會儀式。',
      '一個沒有意義的文化傳統。',
    ],
    correctAnswerIndex: 0,
    explanation: '約翰的洗禮是一個強有力的公開宣告。人們承認自己的罪，並歸向神，為即將到來的彌賽亞做準備。它將舊約中水的潔淨主題與個人悔改的迫切呼籲聯繫起來。',
     journalPrompt: {
      title: '悔改的洗禮',
      content: '施洗約翰是舊約與新約之間的橋樑。他在約旦河的洗禮象徵著遠離罪惡，並為迎接彌賽亞耶穌的到來預備心靈。'
    },
    deepDive: {
      title: '浸禮池（Mikveh）與約翰的洗禮',
      content: '猶太傳統中已有在「浸禮池」中進行禮儀性浸泡以求潔淨的作法。約翰的洗禮在形式上相似，但其信息卻是激進的，將此儀式應用於全以色列，作為全國悔改的標誌。他宣稱，一位比他更偉大的將要來臨，祂不僅用水施洗，還要用聖靈與火施洗。',
      sources: [
        { text: '馬可福音 1:4-8 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Mark+1:4-8&version=NIV' },
        { text: '馬太福音 3:11 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Matthew+3:11&version=ESV' },
      ]
    }
  },
  {
    id: 'q4',
    character: '使徒彼得',
    characterImage: 'https://picsum.photos/seed/peter/100',
    question: '在五旬節那天，我告訴眾人要「悔改，並受洗」，目的是什麼？',
    options: [
      '為了得到一頓免費的餐點。',
      '為了在耶路撒冷的陽光下降溫。',
      '為了使你們的罪得赦，並領受所賜的聖靈。',
      '為了登記新社區的人口普查。',
    ],
    correctAnswerIndex: 2,
    explanation: '彼得在使徒行傳第二章的講道標誌著基督教會的誕生。洗禮現在明確地與信靠耶穌基督、藉祂的死與復活赦免罪惡，以及聖靈的內住聯繫在一起。這是進入新約群體的入會儀式。',
     journalPrompt: {
      title: '新約的洗禮',
      content: '基督教的洗禮，如彼得所傳講的，是救贖歷史的高潮。它結合了聖約（加入神的子民）、潔淨（罪得赦免）和新生命（領受聖靈）的主題。'
    },
    deepDive: {
      title: '洗禮：與基督聯合的象徵',
      content: '使徒保羅後來解釋說，洗禮是在靈性上與耶穌同死、同埋葬、同復活（羅馬書 6:3-4）。當一個人浸入水中時，象徵著舊我罪性的死亡。從水中出來則象徵著在基督裡復活，得著新生命。這是福音本身一個深刻的畫面。',
      sources: [
        { text: '使徒行傳 2:38-39 (KJV)', url: 'https://www.biblegateway.com/passage/?search=Acts+2:38-39&version=KJV' },
        { text: '羅馬書 6:3-4 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Romans+6:3-4&version=NIV' },
        { text: '十二使徒遺訓論洗禮（早期教會文獻）', url: '#'}
      ]
    }
  },
  {
    id: 'q6',
    character: '使徒保羅',
    characterImage: 'https://picsum.photos/seed/paul/100',
    question: '我在寫給加拉太教會的信中提到，凡受洗歸入基督的，都是「披戴基督」了。這句話的屬靈含義是什麼？',
    options: [
      '穿上印有基督形象的特殊服裝。',
      '在上帝眼中，我們的身份完全被基督的義所覆蓋。',
      '加入一個名為「基督」的時尚俱樂部。',
      '在洗禮時得到一件新斗篷。',
    ],
    correctAnswerIndex: 1,
    explanation: '「披戴基督」（加拉太書 3:27）是一個強有力的比喻。它意味著當我們藉著信靠和洗禮與基督聯合時，上帝看我們就不再是看我們有罪的舊我，而是看到基督的完美和公義。我們的身份從根本上被改變了。我們現在是「在基督裡」，有了一個新的地位和家庭。',
    journalPrompt: {
      title: '披戴基督',
      content: '洗禮不僅是洗去罪惡，也是穿上一個新的身份。使徒保羅教導說，在洗禮中，我們披戴了基督自己。我們的舊身份已經過去，我們現在以上帝兒女的身份活在基督的義中。',
    },
    deepDive: {
      title: '在基督裡的身份',
      content: '保羅神學的核心是「在基督裡」這個概念。這是一種深刻的屬靈聯合。洗禮是這種聯合的外在標誌。正如羅馬書 6 章所解釋的，我們與基督同死、同埋葬、同復活；正如加拉太書所說，我們披戴了祂。這意味著基督的勝利成為我們的勝利，祂的義成為我們的義，祂與父的關係也成為我們的關係。這徹底改變了基督徒看待自己和生活的方式。',
      sources: [
        { text: '加拉太書 3:26-27 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Galatians+3:26-27&version=NIV' },
        { text: '歌羅西書 2:12 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Colossians+2:12&version=ESV' },
      ],
    },
  },
];

export const locations: Location[] = [
  { id: 'l1', name: '迦勒底的吾珥', era: '先祖時期', position: { top: '75%', left: '70%' }, questId: 'q1' },
  { id: 'l2', name: '西奈山', era: '出埃及時期', position: { top: '55%', left: '45%' }, questId: 'q2', dependency: 'l1' },
  { id: 'l5', name: '巴比倫', era: '流亡時期', position: { top: '60%', left: '65%' }, questId: 'q5', dependency: 'l2' },
  { id: 'l3', name: '約旦河', era: '先知時期', position: { top: '40%', left: '50%' }, questId: 'q3', dependency: 'l5' },
  { id: 'l4', name: '耶路撒冷', era: '使徒時期', position: { top: '42%', left: '48%' }, questId: 'q4', dependency: 'l3' },
  { id: 'l6', name: '哥林多', era: '教會時期', position: { top: '30%', left: '35%' }, questId: 'q6', dependency: 'l4' },
];

export const levels: Level[] = [
  {
    id: 'level1',
    name: '信仰的根基',
    locationIds: ['l1', 'l2'],
    discussionPrompts: [
        '「聖約」的概念如何改變您對與上帝關係的看法？',
        '為什麼身體上的潔淨在舊約中如此重要，它如何指向更深層次的屬靈現實？'
    ]
  },
  {
    id: 'level2',
    name: '新約的應許',
    locationIds: ['l5', 'l3'],
    discussionPrompts: [
        '以西結關於「新心」的應許如何為耶穌的教導和基督教洗禮鋪路？',
        '悔改在施洗約翰的事工中扮演什麼角色？它與我們今天對洗禮的理解有何關聯？'
    ]
  },
  {
    id: 'level3',
    name: '教會的建立',
    locationIds: ['l4', 'l6'],
    discussionPrompts: [
        '根據彼得在五旬節的講道，洗禮與領受聖靈之間有什麼關係？',
        '「披戴基督」對基督徒的日常生活有何實際意義？'
    ]
  }
];
