import type { BibleLocation, Quest, Level } from '../types';

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
    explanation: '亞伯拉罕之約（創世記 12, 15, 17章）是上帝一個基礎性的應許。這個約的記號是割禮，一個象徵分別為聖的身體標記。這個「分別為聖」的主題是洗禮概念的前身。',
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
    question: '在西奈山，我為以色列領受了律法，其中包含許多涉及水的潔淨禮儀。這些禮儀的主要目的是什麼？',
    options: [
      '在沙漠的炎熱中降溫。',
      '為年度游泳比賽做準備。',
      '潔淨禮儀上的不潔，以恢復親近上帝的機會。',
      '在節期前洗衣服。',
    ],
    correctAnswerIndex: 2,
    explanation: '利未記的律法（利未記 11-15章）規定用水洗滌，以潔淨個人的禮儀不潔（例如，接觸屍體或患有皮膚病後）。這不是關於身體的骯髒，而是關於處於聖潔的狀態，以便親近聖潔的上帝。水成為了屬靈潔淨的有力象徵。',
     journalPrompt: {
      title: '以水潔淨',
      content: '賜給摩西的律法教導說，上帝是聖潔的，人們需要被潔淨才能親近祂。水是這種禮儀潔淨的主要方式，象徵著從不潔狀態到潔淨狀態的轉變。'
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
  {
    id: 'q7',
    character: '約書亞',
    characterImage: 'https://picsum.photos/seed/joshua/100',
    question: '當以色列人過約旦河進入應許之地時，我設立了十二塊石頭作為紀念。這個紀念碑的目的是什麼？',
    options: [
      '為了建造一個游泳池。',
      '作為後代詢問時的見證，紀念上帝使河水乾涸的神蹟。',
      '為了練習舉重運動。',
      '用來建造約書亞的新房子。',
    ],
    correctAnswerIndex: 1,
    explanation: '約書亞記4:6-7記載，這十二塊石頭是為了讓後代子孫詢問其意義時，父母可以向他們講述上帝如何停住約旦河水，使以色列人得以過河。這顯示了紀念上帝作為和傳承信仰故事的重要性。',
    journalPrompt: {
      title: '紀念石的意義',
      content: '約書亞設立的紀念石提醒我們，信仰需要被記念和傳承。每一個見證上帝作為的標記，都成為向下一代述說神恩的機會。'
    },
    deepDive: {
      title: '記憶與信仰傳承',
      content: '舊約中充滿了設立紀念碑的例子，從雅各在伯特利立石，到撒母耳的以便以謝石。這些不僅是歷史記錄，更是信仰教育的工具。它們提醒我們上帝的信實，並為下一代提供詢問和學習的機會。基督教的聖餐也是這種紀念傳統的延續。',
      sources: [
        { text: '約書亞記 4:1-9 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Joshua+4:1-9&version=NIV' },
        { text: '申命記 6:20-25 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Deuteronomy+6:20-25&version=ESV' },
      ]
    }
  },
  {
    id: 'q8',
    character: '大衛王',
    characterImage: 'https://picsum.photos/seed/david/100',
    question: '我在詩篇中寫道：「你當將你的重擔卸給耶和華」。這句話在面對人生困難時給我們什麼啟示？',
    options: [
      '我們應該把所有的行李都扔掉。',
      '我們可以將憂慮和困難交託給上帝，相信祂會扶持我們。',
      '我們應該搬到別的城市。',
      '我們需要聘請更多的助手。',
    ],
    correctAnswerIndex: 1,
    explanation: '詩篇55:22教導我們，當面對重壓和困難時，我們可以將這些負擔交託給上帝。大衛作為君王經歷了許多挑戰，他學會了依靠上帝的力量而非自己的能力。這是信靠與交託的功課。',
    journalPrompt: {
      title: '交託的智慧',
      content: '大衛的詩篇教導我們，真正的力量來自於學會交託。當我們將重擔卸給上帝時，我們不是在逃避責任，而是在承認上帝的主權和愛護。'
    },
    deepDive: {
      title: '詩篇中的信靠神學',
      content: '大衛的詩篇不僅是個人情感的表達，更是深刻的神學反思。從詩篇23篇的牧人形象，到詩篇51篇的悔改，再到詩篇139篇對上帝全知的讚嘆，這些詩篇教導我們如何在各種人生境遇中與上帝建立關係。交託不是被動的放棄，而是主動的信靠。',
      sources: [
        { text: '詩篇 55:22 (KJV)', url: 'https://www.biblegateway.com/passage/?search=Psalm+55:22&version=KJV' },
        { text: '彼得前書 5:7 (NIV)', url: 'https://www.biblegateway.com/passage/?search=1+Peter+5:7&version=NIV' },
      ]
    }
  },
  {
    id: 'q9',
    character: '所羅門王',
    characterImage: 'https://picsum.photos/seed/solomon/100',
    question: '當上帝問我想要什麼時，我沒有求財富或長壽，而是求什麼？',
    options: [
      '一座更大的宮殿。',
      '智慧來治理神的百姓。',
      '打敗所有敵人的能力。',
      '成為世界上最富有的人。',
    ],
    correctAnswerIndex: 1,
    explanation: '列王紀上3:9記載，所羅門求上帝賜給他智慧，使他能夠分辨善惡，好治理神的百姓。這個無私的請求讓上帝喜悅，不僅賜給他智慧，也賜給他財富和尊榮。這教導我們優先次序的重要性。',
    journalPrompt: {
      title: '智慧的價值',
      content: '所羅門的選擇提醒我們，真正的智慧比任何物質財富都更寶貴。當我們尋求上帝的智慧時，我們是在尋求按照神的心意生活的能力。'
    },
    deepDive: {
      title: '智慧文學的貢獻',
      content: '所羅門不僅以智慧統治以色列，他也為我們留下了豐富的智慧文學，包括箴言、傳道書和部分詩篇。這些書卷教導實用的生活智慧，從人際關係到工作倫理，從言語的力量到財富的適當使用。然而，傳道書也提醒我們，即使是最智慧的人也會發現，離開上帝的人生終究是虛空的。',
      sources: [
        { text: '列王紀上 3:5-14 (NIV)', url: 'https://www.biblegateway.com/passage/?search=1+Kings+3:5-14&version=NIV' },
        { text: '箴言 9:10 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Proverbs+9:10&version=ESV' },
      ]
    }
  },
  {
    id: 'q10',
    character: '先知以賽亞',
    characterImage: 'https://picsum.photos/seed/isaiah/100',
    question: '我預言了一位「受苦的僕人」，他將「為我們的過犯受害，為我們的罪孽壓傷」。這個預言指向誰？',
    options: [
      '巴比倫王尼布甲尼撒。',
      '波斯王居魯士。',
      '彌賽亞耶穌基督。',
      '亞述王撒珥根。',
    ],
    correctAnswerIndex: 2,
    explanation: '以賽亞書53章是舊約中最明確的彌賽亞預言之一。這位「受苦的僕人」的描述完美地預言了耶穌基督的生平、受死和復活。新約多次引用這段經文來說明耶穌就是應許的彌賽亞。',
    journalPrompt: {
      title: '受苦僕人的預言',
      content: '以賽亞的預言向我們顯示，上帝的救贖計劃從古時就已經確定。彌賽亞不是以征服者的身份來臨，而是以受苦僕人的身份，透過犧牲來拯救世人。'
    },
    deepDive: {
      title: '彌賽亞預言的應驗',
      content: '以賽亞書53章被稱為「舊約的福音」，因為它如此詳細地預言了彌賽亞的受苦、死亡和勝利。從「他誠然擔當我們的憂患」到「因他受的刑罰我們得平安」，每一個細節都在耶穌身上得到應驗。這種跨越數百年的預言應驗，是聖經神聖啟示的有力證據，也讓我們看見上帝救贖計劃的深度和廣度。',
      sources: [
        { text: '以賽亞書 53:3-12 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Isaiah+53:3-12&version=NIV' },
        { text: '使徒行傳 8:32-35 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Acts+8:32-35&version=ESV' },
      ]
    }
  },
  {
    id: 'q11',
    character: '但以理',
    characterImage: 'https://picsum.photos/seed/daniel/100',
    question: '在巴比倫的宮廷中，我和我的朋友決定不吃王的膳和王所飲的酒。我們這樣做的主要原因是什麼？',
    options: [
      '因為我們正在節食減肥。',
      '因為食物味道不好。',
      '為了持守我們對上帝的信仰和律法的要求。',
      '因為我們想要與眾不同。',
    ],
    correctAnswerIndex: 2,
    explanation: '但以理書1:8記載，但以理立志不以王的膳和王所飲的酒玷污自己。這可能涉及食物是否潔淨、是否獻給偶像等律法問題。但以理在異邦環境中持守信仰，展現了在壓力下保持屬靈忠誠的勇氣。',
    journalPrompt: {
      title: '在異地持守信仰',
      content: '但以理的故事提醒我們，無論在什麼環境中，我們都可以選擇忠於上帝。即使在不友善的環境中，堅持正確的原則往往會得到意想不到的祝福。'
    },
    deepDive: {
      title: '流亡中的見證',
      content: '但以理和他朋友們的故事展示了如何在世俗環境中活出信仰。他們沒有逃避世界，而是在世界中成為光鹽。從拒食王膳到火窯中的拯救，從夢的解釋到獅子坑的神蹟，這些故事都說明了一個原則：當我們忠於上帝時，上帝必定忠於我們。他們的見證影響了外邦君王，展現了信仰的轉化力量。',
      sources: [
        { text: '但以理書 1:8-16 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Daniel+1:8-16&version=NIV' },
        { text: '但以理書 3:16-18 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Daniel+3:16-18&version=ESV' },
      ]
    }
  },
  {
    id: 'q12',
    character: '耶穌基督',
    characterImage: 'https://picsum.photos/seed/jesus/100',
    question: '我在登山寶訓中說：「虛心的人有福了」。這裡的「虛心」指的是什麼？',
    options: [
      '心情不好的人。',
      '沒有自信的人。',
      '認識自己靈性貧乏，需要上帝的人。',
      '很少說話的人。',
    ],
    correctAnswerIndex: 2,
    explanation: '馬太福音5:3中的「虛心」在原文中是「靈裡貧窮」的意思。這不是指物質的貧窮，而是指認識到自己在屬靈上的需要，承認離開上帝就一無所有。這種謙卑的態度是天國子民的第一個特質。',
    journalPrompt: {
      title: '靈裡的貧窮',
      content: '耶穌的八福始於靈裡的貧窮，這提醒我們，進入天國的第一步是認識自己的需要。當我們承認自己的有限和罪性時，我們就為接受上帝的恩典預備了心。'
    },
    deepDive: {
      title: '天國的價值觀',
      content: '登山寶訓中的八福完全顛覆了世界的價值觀。世界說強者有福，耶穌說虛心的人有福；世界說富足的人有福，耶穌說哀慟的人有福。這些教導不是消極的人生哲學，而是天國的積極價值觀。它們描述了一種新的生活方式，這種生活方式建立在對上帝的信靠和對他人的愛上。',
      sources: [
        { text: '馬太福音 5:3-12 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Matthew+5:3-12&version=NIV' },
        { text: '路加福音 6:20-26 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Luke+6:20-26&version=ESV' },
      ]
    }
  },
  {
    id: 'q13',
    character: '稅吏撒該',
    characterImage: 'https://picsum.photos/seed/zacchaeus/100',
    question: '當耶穌來到我家後，我做了什麼來表示真正的悔改？',
    options: [
      '我辭去了稅吏的工作。',
      '我把財產的一半給窮人，並四倍償還我所虧欠的。',
      '我搬到了另一個城市。',
      '我建造了一座新的會堂。',
    ],
    correctAnswerIndex: 1,
    explanation: '路加福音19:8記載，撒該對主說：「主啊，我把所有的一半給窮人；我若訛詐了誰，就還他四倍。」這不僅是口頭的悔改，更是實際的行動，顯示了真正悔改會帶來生活方式的改變。',
    journalPrompt: {
      title: '悔改的果子',
      content: '撒該的故事告訴我們，真正的悔改不只是內心的改變，還會表現在外在的行動上。當我們真正遇見耶穌時，我們的價值觀和行為都會被轉化。'
    },
    deepDive: {
      title: '救恩與社會公義',
      content: '撒該的故事美妙地結合了個人救恩與社會公義。他沒有只是獲得心靈的平安就滿足了，而是主動去修復他過去的錯誤行為對他人造成的傷害。這顯示真正的福音是整全的，它不僅拯救靈魂，也轉化我們對財富、權力和關係的態度。撒該的行動回應了舊約中關於公義和憐憫的教導。',
      sources: [
        { text: '路加福音 19:1-10 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Luke+19:1-10&version=NIV' },
        { text: '以西結書 33:14-16 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Ezekiel+33:14-16&version=ESV' },
      ]
    }
  },
  {
    id: 'q14',
    character: '使徒約翰',
    characterImage: 'https://picsum.photos/seed/johnapostle/100',
    question: '我在約翰福音中記錄了耶穌說的「我就是道路、真理、生命」。這句話的核心信息是什麼？',
    options: [
      '耶穌是一位偉大的哲學老師。',
      '耶穌是通往父神的唯一道路。',
      '耶穌是最好的旅行嚮導。',
      '耶穌知道很多道理。',
    ],
    correctAnswerIndex: 1,
    explanation: '約翰福音14:6完整地記錄了耶穌的話：「我就是道路、真理、生命；若不藉著我，沒有人能到父那裡去。」這是基督教信仰的核心宣告，說明耶穌不只是眾多宗教領袖中的一位，而是神與人之間唯一的中保。',
    journalPrompt: {
      title: '基督的獨特性',
      content: '約翰記錄的這句話挑戰我們思考耶穌的身份。祂不是說祂知道道路，而是說祂就是道路。這種排他性的宣告要求我們做出回應：接受或拒絕。'
    },
    deepDive: {
      title: '約翰福音中的「我是」宣告',
      content: '約翰福音記錄了耶穌的七個「我是」宣告：生命的糧、世界的光、羊的門、好牧人、復活和生命、道路真理生命、真葡萄樹。這些宣告都使用了舊約中上帝自我啟示的「我是」格式（如出埃及記3:14），暗示耶穌的神性。每個宣告都不只是比喻，而是關於耶穌本質的深刻神學陳述。',
      sources: [
        { text: '約翰福音 14:6 (NIV)', url: 'https://www.biblegateway.com/passage/?search=John+14:6&version=NIV' },
        { text: '使徒行傳 4:12 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Acts+4:12&version=ESV' },
      ]
    }
  },
  {
    id: 'q15',
    character: '馬大',
    characterImage: 'https://picsum.photos/seed/martha/100',
    question: '當我忙於服事而抱怨妹妹馬利亞時，耶穌對我說了什麼？',
    options: [
      '妳應該雇用更多的僕人。',
      '馬利亞選擇了那上好的福分，是不能奪去的。',
      '妳們兩個都應該去廚房幫忙。',
      '不用準備這麼豐盛的餐點。',
    ],
    correctAnswerIndex: 1,
    explanation: '路加福音10:42記錄了耶穌的回答：「但是不可少的只有一件；馬利亞已經選擇那上好的福分，是不能奪去的。」耶穌不是批評服事，而是強調靈性追求的優先性和聆聽神話語的重要性。',
    journalPrompt: {
      title: '服事與敬拜的平衡',
      content: '馬大的故事提醒我們，即使是為主做工，也不能取代與主親近的時間。服事很重要，但如果失去了敬拜和聆聽的心，服事也會成為空虛的忙碌。'
    },
    deepDive: {
      title: '行動與默想的整合',
      content: '馬大和馬利亞的故事常被解讀為行動與默想、服事與敬拜之間的對比。然而，更深層的信息是關於動機和優先次序。馬大的服事本身是好的，但當她讓焦慮和怨恨進入心中時，服事就失去了愛的本質。真正的基督徒生活需要整合馬利亞的聆聽心和馬大的服事手，但都必須源於對基督的愛。',
      sources: [
        { text: '路加福音 10:38-42 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Luke+10:38-42&version=NIV' },
        { text: '詩篇 46:10 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Psalm+46:10&version=ESV' },
      ]
    }
  },
  {
    id: 'q16',
    character: '夏娃',
    characterImage: 'https://picsum.photos/seed/eve/100',
    question: '在伊甸園中，蛇引誘我吃分別善惡樹的果子時，用了什麼論點？',
    options: [
      '果子看起來很美味。',
      '吃了就能像神一樣知道善惡。',
      '所有動物都在吃這個果子。',
      '上帝只是在開玩笑。',
    ],
    correctAnswerIndex: 1,
    explanation: '創世記3:5記載，蛇對夏娃說：「因為神知道，你們吃的日子眼睛就明亮了，你們便如神能知道善惡。」這個試探的核心是要人類追求獨立於上帝的知識和判斷力，想要「像神一樣」。',
    journalPrompt: {
      title: '第一次試探',
      content: '夏娃面對的試探揭示了罪的本質：不相信上帝的良善，渴望自主權，想要成為自己的神。這個模式在人類歷史中不斷重複。'
    },
    deepDive: {
      title: '罪的起源與本質',
      content: '蛇的試探包含三個元素：懷疑神的話（「神豈是真說...？」）、否認後果（「你們不一定死」）、和應許錯誤的好處（「像神一樣」）。這種試探模式在整本聖經中反覆出現，甚至耶穌在曠野受試探時也面對類似的模式。理解罪的本質幫助我們識別和抵擋現代的試探。',
      sources: [
        { text: '創世記 3:1-6 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Genesis+3:1-6&version=NIV' },
        { text: '約翰一書 2:16 (ESV)', url: 'https://www.biblegateway.com/passage/?search=1+John+2:16&version=ESV' },
      ]
    }
  },
  {
    id: 'q17',
    character: '挪亞',
    characterImage: 'https://picsum.photos/seed/noah/100',
    question: '當上帝吩咐我建造方舟時，洪水還要多久才來臨？',
    options: [
      '立即就來。',
      '大約120年後。',
      '一個月後。',
      '明天。',
    ],
    correctAnswerIndex: 1,
    explanation: '根據創世記6:3和後續經文的推算，從上帝宣告審判到洪水來臨，大約經過了120年。在這段漫長的時間裡，挪亞一邊建造方舟，一邊向世人傳講悔改的信息。',
    journalPrompt: {
      title: '忍耐的信心',
      content: '挪亞花了超過一個世紀建造方舟，在這期間必定經歷許多嘲笑和質疑。他的故事教導我們，真實的信心需要長期的堅持和順服。'
    },
    deepDive: {
      title: '上帝的忍耐與人的回應',
      content: '120年的準備期顯示了上帝極大的忍耐和給人悔改機會的心意。彼得後書2:5稱挪亞為「傳義道的人」，表明他不只是默默建造方舟，更積極呼籲人悔改。然而，只有他的家人回應了。這提醒我們，即使面對長期的拒絕，我們仍要忠心傳講真理。',
      sources: [
        { text: '創世記 6:3-22 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Genesis+6:3-22&version=NIV' },
        { text: '彼得後書 2:5 (ESV)', url: 'https://www.biblegateway.com/passage/?search=2+Peter+2:5&version=ESV' },
      ]
    }
  },
  {
    id: 'q18',
    character: '約瑟',
    characterImage: 'https://picsum.photos/seed/joseph/100',
    question: '當我在埃及成為宰相後，我對賣我為奴的哥哥們說了什麼？',
    options: [
      '你們要為此付出代價！',
      '從前你們的意思是要害我，但神的意思原是好的。',
      '我再也不想見到你們。',
      '這都是你們應得的。',
    ],
    correctAnswerIndex: 1,
    explanation: '創世記50:20記載，約瑟對哥哥們說：「從前你們的意思是要害我，但神的意思原是好的，要保全許多人的性命，成就今日的光景。」這顯示了約瑟對神主權的信心和寬恕的心。',
    journalPrompt: {
      title: '神的主權與人的選擇',
      content: '約瑟的故事展現了一個深刻的真理：人的惡意無法阻擋神的美意。神能使用甚至是不公義的事件來成就祂更大的計劃。'
    },
    deepDive: {
      title: '苦難中的信心',
      content: '約瑟經歷了被兄弟出賣、被誣告下監、被遺忘等一連串的不公。但他從未放棄對神的信心。他的故事預表了基督：被自己人拒絕，經歷苦難，最終成為拯救者。約瑟的寬恕也教導我們，真正的饒恕來自於認識到神的主權和計劃。',
      sources: [
        { text: '創世記 50:15-21 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Genesis+50:15-21&version=NIV' },
        { text: '羅馬書 8:28 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Romans+8:28&version=ESV' },
      ]
    }
  },
  {
    id: 'q19',
    character: '米利暗',
    characterImage: 'https://picsum.photos/seed/miriam/100',
    question: '當以色列人過紅海後，我做了什麼來慶祝？',
    options: [
      '準備了一場盛宴。',
      '拿著鼓跳舞唱歌讚美神。',
      '立刻倒頭就睡。',
      '開始抱怨食物不足。',
    ],
    correctAnswerIndex: 1,
    explanation: '出埃及記15:20-21記載，女先知米利暗拿著鼓，眾婦女也跟著出去拿鼓跳舞。她唱道：「你們要歌頌耶和華，因他大大戰勝，將馬和騎馬的投在海中。」這是聖經中最早記載的敬拜讚美場景之一。',
    journalPrompt: {
      title: '喜樂的敬拜',
      content: '米利暗帶領婦女們用音樂、舞蹈和歌聲讚美神，展現了敬拜可以是充滿喜樂和表達力的。當神行奇事時，我們的回應應該是真誠的讚美。'
    },
    deepDive: {
      title: '女性在聖經中的領導角色',
      content: '米利暗被稱為「女先知」，與摩西和亞倫一起被列為以色列的領袖（彌迦書6:4）。她在敬拜中的領導顯示了女性在神國度工作中的重要角色。然而，她後來因為驕傲而受到管教（民數記12章），提醒我們領導權柄來自神，必須謙卑使用。',
      sources: [
        { text: '出埃及記 15:20-21 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Exodus+15:20-21&version=NIV' },
        { text: '彌迦書 6:4 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Micah+6:4&version=ESV' },
      ]
    }
  },
  {
    id: 'q20',
    character: '迦勒',
    characterImage: 'https://picsum.photos/seed/caleb/100',
    question: '當十二個探子窺探迦南地回來後，我和約書亞說了什麼？',
    options: [
      '那地的人太強大了，我們無法征服。',
      '我們立刻上去得那地吧！我們足能得勝。',
      '我們應該回埃及。',
      '讓我們先訓練軍隊十年。',
    ],
    correctAnswerIndex: 1,
    explanation: '民數記13:30記載，迦勒在摩西面前安撫百姓說：「我們立刻上去得那地吧！我們足能得勝。」雖然其他十個探子報惡信，只有迦勒和約書亞相信神的應許。',
    journalPrompt: {
      title: '信心勝過恐懼',
      content: '迦勒看到了與其他探子相同的巨人和堅固城牆，但他的信心使他看見更大的真理：神與他們同在。真實的信心不是否認困難，而是相信神比困難更大。'
    },
    deepDive: {
      title: '專心跟從神',
      content: '聖經多次描述迦勒「專心跟從耶和華」（民數記32:12）。即使在85歲高齡，他仍然充滿活力和信心，要求得那有巨人居住的希伯崙山地（約書亞記14:10-12）。迦勒的一生教導我們，忠心跟從神會帶來長久的祝福，而信心不因年齡而減退。',
      sources: [
        { text: '民數記 13:26-33; 14:6-9 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Numbers+13:26-33;14:6-9&version=NIV' },
        { text: '約書亞記 14:6-15 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Joshua+14:6-15&version=ESV' },
      ]
    }
  },
  {
    id: 'q21',
    character: '路得',
    characterImage: 'https://picsum.photos/seed/ruth/100',
    question: '當我的婆婆拿俄米要我回摩押老家時，我對她說了什麼？',
    options: [
      '好的，我現在就走。',
      '妳往哪裡去，我也往那裡去；妳的神就是我的神。',
      '讓我考慮一下。',
      '我需要先回去看看我的家人。',
    ],
    correctAnswerIndex: 1,
    explanation: '路得記1:16-17記錄了路得美麗的承諾：「妳往哪裡去，我也往那裡去；妳在哪裡住宿，我也在那裡住宿；妳的國就是我的國，妳的神就是我的神。妳在哪裡死，我也在那裡死，也葬在那裡。」',
    journalPrompt: {
      title: '忠誠的愛',
      content: '路得對拿俄米的忠誠，以及她對以色列神的委身，展現了真實的愛與信心。她選擇離開自己的家鄉和神明，跟隨看似沒有前途的婆婆和未知的神。'
    },
    deepDive: {
      title: '外邦人與救贖',
      content: '路得是摩押人，按照律法本不應該進入以色列會眾。但她的信心和忠誠使她不僅被接納，更成為大衛王的曾祖母，進入了彌賽亞的家譜。她的故事預示了福音將臨到萬國，以及外邦人因信得救的真理。路得記也展現了「救贖者」（goel）的概念，預表基督的救贖工作。',
      sources: [
        { text: '路得記 1:16-18 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Ruth+1:16-18&version=NIV' },
        { text: '馬太福音 1:5 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Matthew+1:5&version=ESV' },
      ]
    }
  },
  {
    id: 'q22',
    character: '撒母耳',
    characterImage: 'https://picsum.photos/seed/samuel/100',
    question: '當我還是小孩子在會幕服事時，夜裡聽見有聲音叫我的名字。那是誰？',
    options: [
      '祭司以利。',
      '我的母親哈拿。',
      '耶和華神。',
      '我在做夢。',
    ],
    correctAnswerIndex: 2,
    explanation: '撒母耳記上3章記載，神三次呼喚小撒母耳的名字。起初他以為是以利叫他，但以利指示他說：「你去睡吧，若再呼喚你，你就說：『耶和華啊，請說，僕人敬聽！』」這是撒母耳第一次聽見神的聲音。',
    journalPrompt: {
      title: '聆聽神的聲音',
      content: '撒母耳學會了如何辨認和回應神的聲音。他的態度「請說，僕人敬聽」成為我們與神關係的典範：願意聆聽，準備順服。'
    },
    deepDive: {
      title: '先知的呼召',
      content: '撒母耳的呼召發生在「耶和華的言語稀少，不常有默示」的時代（撒上3:1）。這提醒我們，即使在屬靈荒涼的時期，神仍在尋找願意聆聽和順服的人。撒母耳後來成為以色列歷史上最偉大的先知之一，膏立了掃羅和大衛兩位王。他的一生展現了忠心聆聽神話語的重要性。',
      sources: [
        { text: '撒母耳記上 3:1-21 (NIV)', url: 'https://www.biblegateway.com/passage/?search=1+Samuel+3:1-21&version=NIV' },
        { text: '希伯來書 3:7-8 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Hebrews+3:7-8&version=ESV' },
      ]
    }
  },
  {
    id: 'q23',
    character: '拔示巴',
    characterImage: 'https://picsum.photos/seed/bathsheba/100',
    question: '我的兒子所羅門能繼承大衛的王位，主要是因為什麼？',
    options: [
      '他是長子。',
      '他在武術比賽中獲勝。',
      '上帝應許他要作王，大衛也確認了這應許。',
      '他賄賂了所有的大臣。',
    ],
    correctAnswerIndex: 2,
    explanation: '列王紀上1章記載，當大衛年老時，拔示巴提醒大衛曾指著神起誓說所羅門必接續他作王。先知拿單也證實了這事。這是神的揀選，而非人為的安排。',
    journalPrompt: {
      title: '從罪到救贖',
      content: '拔示巴的故事以大衛的罪開始，但神的恩典使她成為所羅門的母親，甚至進入彌賽亞的家譜。這顯示神能使用破碎的生命成就祂的計劃。'
    },
    deepDive: {
      title: '恩典與主權',
      content: '拔示巴在馬太福音家譜中被特別提及，這是不尋常的。她的包含提醒我們，神的恩典超越人的過犯。雖然大衛與拔示巴的關係始於罪，但神仍然揀選他們的兒子所羅門繼承王位。這不是縱容罪，而是展現神能在人的軟弱中彰顯祂的憐憫和主權。',
      sources: [
        { text: '列王紀上 1:11-31 (NIV)', url: 'https://www.biblegateway.com/passage/?search=1+Kings+1:11-31&version=NIV' },
        { text: '馬太福音 1:6 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Matthew+1:6&version=ESV' },
      ]
    }
  },
  {
    id: 'q24',
    character: '以利亞',
    characterImage: 'https://picsum.photos/seed/elijah/100',
    question: '在迦密山上，我與巴力的先知對決。我向神禱告後發生了什麼？',
    options: [
      '下了三天三夜的雨。',
      '火從天降，燒盡了祭物、木柴、石頭和水。',
      '巴力的先知自願認輸。',
      '什麼都沒發生。',
    ],
    correctAnswerIndex: 1,
    explanation: '列王紀上18:38記載：「於是耶和華降下火來，燒盡燔祭、木柴、石頭、塵土，又燒乾溝裡的水。」這個神蹟證明了耶和華是真神，導致百姓俯伏敬拜說：「耶和華是神！耶和華是神！」',
    journalPrompt: {
      title: '單獨面對眾人',
      content: '以利亞一人對抗450個巴力先知和400個亞舍拉先知，展現了對真神的堅定信心。有時候，忠於神的道路是孤獨的，但神必定顯明真理。'
    },
    deepDive: {
      title: '屬靈爭戰的真實性',
      content: '迦密山的對決不只是先知之間的比賽，而是真假神明之間的較量。以利亞甚至在祭壇周圍挖溝，三次倒水，使神蹟更加明顯。這個事件後，以利亞卻因耶洗別的威脅而逃跑，顯示即使是屬靈偉人也會經歷軟弱。神在何烈山以微小的聲音對他說話，教導我們神的同在不總是在戲劇性的事件中。',
      sources: [
        { text: '列王紀上 18:20-40 (NIV)', url: 'https://www.biblegateway.com/passage/?search=1+Kings+18:20-40&version=NIV' },
        { text: '列王紀上 19:11-13 (ESV)', url: 'https://www.biblegateway.com/passage/?search=1+Kings+19:11-13&version=ESV' },
      ]
    }
  },
  {
    id: 'q25',
    character: '以利沙',
    characterImage: 'https://picsum.photos/seed/elisha/100',
    question: '當敘利亞元帥乃縵來找我治療大痲瘋時，我叫他做什麼？',
    options: [
      '支付大筆金錢。',
      '在約旦河沐浴七次。',
      '獻上一百隻羊。',
      '回家等三天。',
    ],
    correctAnswerIndex: 1,
    explanation: '列王紀下5:10記載，以利沙打發一個使者對乃縵說：「你去在約旦河中沐浴七回，你的肉就必復原，而得潔淨。」起初乃縵因為這個簡單的命令而生氣，但當他順服時，就得了醫治。',
    journalPrompt: {
      title: '謙卑的順服',
      content: '乃縵必須放下身為大元帥的驕傲，接受看似簡單甚至侮辱的醫治方法。神的道路有時與我們的期待不同，但順服就帶來祝福。'
    },
    deepDive: {
      title: '得救在乎歸回安息',
      content: '乃縵期待先知會出來行大事，但以利沙連面都不露，只給了一個簡單的指示。這挑戰了乃縵的驕傲和對神蹟的期待。同樣，許多人期待複雜的宗教儀式或偉大的善行才能得救，但福音的呼召是簡單的：相信和悔改。乃縵的醫治也預表外邦人將藉信心得救（路加福音4:27）。',
      sources: [
        { text: '列王紀下 5:1-19 (NIV)', url: 'https://www.biblegateway.com/passage/?search=2+Kings+5:1-19&version=NIV' },
        { text: '路加福音 4:27 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Luke+4:27&version=ESV' },
      ]
    }
  },
  {
    id: 'q26',
    character: '約伯',
    characterImage: 'https://picsum.photos/seed/job/100',
    question: '在失去一切之後，我對神的回應是什麼？',
    options: [
      '我詛咒神並離棄祂。',
      '賞賜的是耶和華，收取的也是耶和華，耶和華的名是應當稱頌的。',
      '我要找律師控告神。',
      '從此再也不相信神。',
    ],
    correctAnswerIndex: 1,
    explanation: '約伯記1:21-22記載，約伯失去所有財產和兒女後，說：「我赤身出於母胎，也必赤身歸回。賞賜的是耶和華，收取的也是耶和華，耶和華的名是應當稱頌的。」在這一切的事上，約伯並不犯罪，也不以神為愚妄。',
    journalPrompt: {
      title: '苦難中的信心',
      content: '約伯的故事挑戰我們：當生命崩潰時，我們如何回應？約伯展現了即使在極度痛苦中，仍能持守對神的信心和敬拜。'
    },
    deepDive: {
      title: '苦難的奧秘',
      content: '約伯記探討了一個深刻的問題：為什麼義人受苦？約伯的朋友們試圖用「報應神學」解釋，認為苦難必定是罪的結果。但神最後顯明，祂的道路高過人的道路。苦難不總能被簡單解釋，但神仍是主權者。約伯最終看見神自己，這比得到答案更重要（約伯記42:5）。',
      sources: [
        { text: '約伯記 1:13-22 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Job+1:13-22&version=NIV' },
        { text: '約伯記 42:1-6 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Job+42:1-6&version=ESV' },
      ]
    }
  },
  {
    id: 'q27',
    character: '耶利米',
    characterImage: 'https://picsum.photos/seed/jeremiah/100',
    question: '神呼召我作先知時，我的回應是什麼？',
    options: [
      '我立刻答應。',
      '主啊，我不知怎樣說，因為我是年幼的。',
      '我去找別人來做這工作。',
      '我要求先考慮三天。',
    ],
    correctAnswerIndex: 1,
    explanation: '耶利米書1:6記載，耶利米對神說：「主耶和華啊，我不知怎樣說，因為我是年幼的。」但神回應說：「你不要說我是年幼的，因為我差遣你到誰那裡去，你都要去；我吩咐你說什麼話，你都要說。」',
    journalPrompt: {
      title: '不足感與神的呼召',
      content: '耶利米感到自己不夠資格，但神的呼召不是基於我們的能力，而是基於祂的揀選和同在。神應許：「我與你同在，要拯救你。」'
    },
    deepDive: {
      title: '流淚的先知',
      content: '耶利米被稱為「流淚的先知」，因為他預言耶路撒冷將被毀，但百姓不聽。他經歷了監禁、嘲笑和孤立，但仍忠心傳講神的話語。耶利米的事工提醒我們，成功的事奉不是以世人的回應來衡量，而是以對神的忠心來衡量。他的痛苦也預表了基督，為耶路撒冷哀哭。',
      sources: [
        { text: '耶利米書 1:4-10 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Jeremiah+1:4-10&version=NIV' },
        { text: '耶利米書 20:7-9 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Jeremiah+20:7-9&version=ESV' },
      ]
    }
  },
  {
    id: 'q28',
    character: '尼希米',
    characterImage: 'https://picsum.photos/seed/nehemiah/100',
    question: '當我聽說耶路撒冷城牆破損、城門被火焚燒時，我做了什麼？',
    options: [
      '我忽視這個消息。',
      '我坐下哭泣、禁食禱告神。',
      '我立刻辭職回耶路撒冷。',
      '我寫信責備那些住在耶路撒冷的人。',
    ],
    correctAnswerIndex: 1,
    explanation: '尼希米記1:4記載：「我聽見這話，就坐下哭泣，悲哀幾日，在天上的神面前禁食祈禱。」尼希米的第一反應不是立即行動，而是帶著破碎的心轉向神。',
    journalPrompt: {
      title: '禱告與行動',
      content: '尼希米的例子展示了禱告與行動的完美結合。他先在神面前傾心吐意，然後在神的引導下採取大膽的行動，最終帶領百姓在52天內重建城牆。'
    },
    deepDive: {
      title: '屬靈復興與物質重建',
      content: '尼希米不僅重建了城牆，更重要的是他與以斯拉一起帶領屬靈復興。城牆的重建是外在的，但真正的目標是恢復百姓與神的關係。尼希米面對內外的反對，但他的禱告、勇氣和組織能力使這不可能的任務成為可能。他展現了敬虔的領導如何影響整個社群。',
      sources: [
        { text: '尼希米記 1:1-11 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Nehemiah+1:1-11&version=NIV' },
        { text: '尼希米記 6:15-16 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Nehemiah+6:15-16&version=ESV' },
      ]
    }
  },
  {
    id: 'q29',
    character: '以斯帖',
    characterImage: 'https://picsum.photos/seed/esther/100',
    question: '當我需要違背律法去見王以拯救猶太人時，我說了什麼？',
    options: [
      '這太危險了，我不能做。',
      '我要等到王主動召見我。',
      '我若死就死吧！',
      '讓末底改自己去處理。',
    ],
    correctAnswerIndex: 2,
    explanation: '以斯帖記4:16記載，以斯帖請求末底改招聚所有猶太人為她禁食三天，然後說：「我若死就死吧！」她願意冒生命危險去拯救她的百姓。',
    journalPrompt: {
      title: '為此時而生',
      content: '末底改對以斯帖說：「焉知你得了王后的位分，不是為現今的機會嗎？」神將我們放在特定的位置，是為了祂的目的。勇氣就是即使害怕，仍然選擇正確的行動。'
    },
    deepDive: {
      title: '隱藏的護理',
      content: '以斯帖記是聖經中唯一沒有直接提到神名字的書卷，但神的作為卻清晰可見。從以斯帖被選為王后，到王失眠讀歷史，到哈曼的計謀被揭露，每個「巧合」都顯示神在背後的護理。這教導我們，即使在神似乎缺席的時候，祂仍在掌權。以斯帖的故事也啟發了猶太人的普珥節。',
      sources: [
        { text: '以斯帖記 4:12-17 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Esther+4:12-17&version=NIV' },
        { text: '以斯帖記 6:1-11 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Esther+6:1-11&version=ESV' },
      ]
    }
  },
  {
    id: 'q30',
    character: '施洗約翰的母親以利沙伯',
    characterImage: 'https://picsum.photos/seed/elizabeth/100',
    question: '當馬利亞來探訪我時，發生了什麼事？',
    options: [
      '我們一起做飯。',
      '我腹中的胎兒跳動，我被聖靈充滿。',
      '我們討論天氣。',
      '什麼特別的事都沒發生。',
    ],
    correctAnswerIndex: 1,
    explanation: '路加福音1:41記載：「以利沙伯一聽馬利亞問安，所懷的胎就在腹裡跳動。以利沙伯且被聖靈充滿。」她大聲喊著說：「你在婦女中是有福的，你所懷的胎也是有福的！」',
    journalPrompt: {
      title: '認出救主',
      content: '甚至在約翰出生前，他就在母腹中因彌賽亞的臨在而跳動。以利沙伯被聖靈充滿，認出馬利亞所懷的是主。真實的屬靈敏銳使我們能認出神的工作。'
    },
    deepDive: {
      title: '兩個奇蹟的誕生',
      content: '以利沙伯和撒迦利亞年老無子，如同亞伯拉罕和撒拉。約翰的出生本身就是神蹟，預備人心迎接更大的神蹟——基督的降生。以利沙伯稱馬利亞為「我主的母親」，這是新約中第一次有人認出耶穌的神性。兩個女人的對話和馬利亞的頌歌（尊主頌）充滿了舊約的引用，顯示神如何成就祂古老的應許。',
      sources: [
        { text: '路加福音 1:39-45 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Luke+1:39-45&version=NIV' },
        { text: '路加福音 1:46-55 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Luke+1:46-55&version=ESV' },
      ]
    }
  },
  {
    id: 'q31',
    character: '智慧人（東方博士）',
    characterImage: 'https://picsum.photos/seed/wisemen/100',
    question: '我們從東方來到耶路撒冷尋找新生王時，獻上了什麼禮物？',
    options: [
      '金、銀、寶石。',
      '黃金、乳香、沒藥。',
      '食物、衣服、玩具。',
      '書籍、地圖、武器。',
    ],
    correctAnswerIndex: 1,
    explanation: '馬太福音2:11記載：「進了房子，看見小孩子和他母親馬利亞，就俯伏拜那小孩子，揭開寶盒，拿黃金、乳香、沒藥為禮物獻給他。」這三樣禮物都有深刻的象徵意義。',
    journalPrompt: {
      title: '尋求並敬拜',
      content: '智慧人不辭辛勞地尋找新生王，並獻上最珍貴的禮物。真正的敬拜需要尋求、付出代價，並獻上我們最好的。'
    },
    deepDive: {
      title: '禮物的象徵意義',
      content: '傳統上，這三樣禮物被賦予象徵意義：黃金代表王權，乳香代表神性（用於敬拜），沒藥代表受苦和死亡（用於安葬）。這些外邦的智慧人認出了猶太人的王，預示福音將傳給萬邦。希律王和耶路撒冷全城的驚慌，對比智慧人的喜樂，顯示人們對彌賽亞的不同反應。',
      sources: [
        { text: '馬太福音 2:1-12 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Matthew+2:1-12&version=NIV' },
        { text: '詩篇 72:10-11 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Psalm+72:10-11&version=ESV' },
      ]
    }
  },
  {
    id: 'q32',
    character: '尼哥底母',
    characterImage: 'https://picsum.photos/seed/nicodemus/100',
    question: '我夜裡來見耶穌時，祂對我說必須怎樣才能見神的國？',
    options: [
      '必須嚴格遵守所有律法。',
      '必須重生。',
      '必須奉獻所有財產。',
      '必須成為法利賽人。',
    ],
    correctAnswerIndex: 1,
    explanation: '約翰福音3:3記載，耶穌回答說：「我實實在在地告訴你，人若不重生，就不能見神的國。」這個宣告震撼了尼哥底母，引發了關於屬靈重生的深刻對話。',
    journalPrompt: {
      title: '重生的必要',
      content: '耶穌告訴這位宗教領袖，他需要的不是更多的宗教知識或更好的行為，而是全新的屬靈生命。重生不是我們能做的，而是聖靈的工作。'
    },
    deepDive: {
      title: '從黑夜到光明',
      content: '尼哥底母「夜裡」來見耶穌，可能是害怕被人看見，但也象徵他屬靈的黑暗。約翰福音三次提到尼哥底母：夜裡的造訪、在公會中為耶穌辯護、以及在耶穌死後與約瑟一起埋葬耶穌。這個進程顯示他從隱密的尋求者變為公開的跟隨者。重生的教導是福音的核心：不是靠行為，而是靠聖靈的更新。',
      sources: [
        { text: '約翰福音 3:1-21 (NIV)', url: 'https://www.biblegateway.com/passage/?search=John+3:1-21&version=NIV' },
        { text: '約翰福音 19:38-42 (ESV)', url: 'https://www.biblegateway.com/passage/?search=John+19:38-42&version=ESV' },
      ]
    }
  },
  {
    id: 'q33',
    character: '撒瑪利亞婦人',
    characterImage: 'https://picsum.photos/seed/samaritan/100',
    question: '當耶穌在井邊向我要水喝時，祂說祂能給我什麼？',
    options: [
      '一口新井。',
      '活水，使人永遠不渴。',
      '一個新水罐。',
      '往耶路撒冷的地圖。',
    ],
    correctAnswerIndex: 1,
    explanation: '約翰福音4:13-14記載，耶穌回答說：「凡喝這水的還要再渴；人若喝我所賜的水就永遠不渴。我所賜的水要在他裡頭成為泉源，直湧到永生。」',
    journalPrompt: {
      title: '永生的泉源',
      content: '我們都在尋找能滿足心靈乾渴的東西。耶穌提供的不是暫時的滿足，而是永恆的生命之水。只有祂能真正滿足人心最深的渴望。'
    },
    deepDive: {
      title: '跨越文化的福音',
      content: '這個對話打破了多重界限：耶穌與撒瑪利亞人對話（猶太人所輕視的）、與女人單獨對話（不符合當時習俗）、與有道德問題的人對話（她有五個丈夫）。耶穌不僅沒有迴避她，反而向她啟示祂是彌賽亞。這個婦人成為第一位撒瑪利亞的宣教士，全城的人因她的見證來信耶穌。這顯示福音超越所有社會和文化障礙。',
      sources: [
        { text: '約翰福音 4:4-42 (NIV)', url: 'https://www.biblegateway.com/passage/?search=John+4:4-42&version=NIV' },
        { text: '以賽亞書 55:1 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Isaiah+55:1&version=ESV' },
      ]
    }
  },
  {
    id: 'q34',
    character: '百夫長',
    characterImage: 'https://picsum.photos/seed/centurion/100',
    question: '當耶穌要到我家醫治我的僕人時，我對祂說了什麼？',
    options: [
      '請立刻到我家來。',
      '我不敢當，只要你說一句話，我的僕人就必好了。',
      '我需要你來按手在他身上。',
      '我要先支付醫療費用。',
    ],
    correctAnswerIndex: 1,
    explanation: '馬太福音8:8記載，百夫長回答說：「主啊，你到我舍下，我不敢當；只要你說一句話，我的僕人就必好了。」耶穌聽見就希奇，說：「我實在告訴你們，這麼大的信心，就是在以色列中，我也沒有遇見過。」',
    journalPrompt: {
      title: '權柄的認識',
      content: '百夫長認識權柄的運作，因此明白耶穌的話語本身就帶有醫治的能力。真實的信心不是看見才信，而是相信神的話語必定成就。'
    },
    deepDive: {
      title: '外邦人的信心',
      content: '這位羅馬軍官展現了超越許多猶太人的信心。他不僅關心他的僕人（在當時文化中不尋常），更認出耶穌超自然的權柄。耶穌用這個例子預言外邦人將進入天國，而許多本國的子民卻要被趕出去。這個事件預示了福音將傳給萬國，以及信心比種族血統更重要。',
      sources: [
        { text: '馬太福音 8:5-13 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Matthew+8:5-13&version=NIV' },
        { text: '路加福音 7:1-10 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Luke+7:1-10&version=ESV' },
      ]
    }
  },
  {
    id: 'q35',
    character: '抹大拉的馬利亞',
    characterImage: 'https://picsum.photos/seed/marymagdalene/100',
    question: '復活的主日早晨，我是第一個看見什麼的人？',
    options: [
      '空的墳墓和復活的耶穌。',
      '守墓的羅馬兵丁。',
      '門徒們聚集。',
      '大祭司。',
    ],
    correctAnswerIndex: 0,
    explanation: '約翰福音20章記載，抹大拉的馬利亞清早到墳墓那裡，看見石頭從墳墓挪開了。她成為第一個看見空墳墓，以及第一個見到復活基督的人。耶穌託付她去告訴門徒這好消息。',
    journalPrompt: {
      title: '第一個見證人',
      content: '神選擇一位女性作為復活的第一個見證人，這在當時的文化中是革命性的。馬利亞的忠心愛慕使她最先經歷復活的喜樂。'
    },
    deepDive: {
      title: '從黑暗到光明',
      content: '抹大拉的馬利亞曾被七個鬼附著，耶穌釋放了她（路加福音8:2）。她從深深的綑綁中得釋放，成為最忠心的跟隨者之一，甚至在十字架下和空墳墓前都有她的身影。她的生命轉變和對基督的委身，使她有資格成為復活的第一個見證人。在當時女性見證不被法庭接受的文化中，這更顯示神對女性的重視和祂國度價值觀的顛覆性。',
      sources: [
        { text: '約翰福音 20:1-18 (NIV)', url: 'https://www.biblegateway.com/passage/?search=John+20:1-18&version=NIV' },
        { text: '路加福音 8:1-3 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Luke+8:1-3&version=ESV' },
      ]
    }
  },
  {
    id: 'q36',
    character: '多馬',
    characterImage: 'https://picsum.photos/seed/thomas/100',
    question: '當其他門徒告訴我他們見到復活的主時，我說了什麼？',
    options: [
      '我完全相信你們。',
      '我非看見他手上的釘痕，不能信。',
      '這太不可思議了！',
      '我們去慶祝吧！',
    ],
    correctAnswerIndex: 1,
    explanation: '約翰福音20:25記載，多馬說：「我非看見他手上的釘痕，用指頭探入那釘痕，又用手探入他的肋旁，我總不信。」八天後，耶穌向他顯現，邀請他觸摸祂的傷痕。',
    journalPrompt: {
      title: '疑惑到相信',
      content: '耶穌沒有責備多馬的疑惑，反而滿足了他的需要。但耶穌也說：「你因看見了我才信；那沒有看見就信的有福了。」信心不需要所有的證據，但神願意在我們的軟弱中遇見我們。'
    },
    deepDive: {
      title: '誠實的懷疑',
      content: '多馬常被稱為「疑惑的多馬」，但他的懷疑是誠實的，而不是頑固的不信。當他看見主時，他做出了福音書中最偉大的認信之一：「我的主！我的神！」（約20:28）。這是第一次有門徒直接稱呼耶穌為神。傳統認為多馬後來成為宣教士，將福音傳到印度，最終為信仰殉道。他從疑惑者變為殉道者的旅程，鼓勵我們帶著誠實的問題來到神面前。',
      sources: [
        { text: '約翰福音 20:24-29 (NIV)', url: 'https://www.biblegateway.com/passage/?search=John+20:24-29&version=NIV' },
        { text: '約翰福音 11:16 (ESV)', url: 'https://www.biblegateway.com/passage/?search=John+11:16&version=ESV' },
      ]
    }
  },
  {
    id: 'q37',
    character: '呂底亞',
    characterImage: 'https://picsum.photos/seed/lydia/100',
    question: '在腓立比，當保羅傳道時，發生了什麼事？',
    options: [
      '沒有人願意聽。',
      '主開導我的心，使我留心聽保羅所講的話。',
      '眾人趕走保羅。',
      '會堂被關閉。',
    ],
    correctAnswerIndex: 1,
    explanation: '使徒行傳16:14記載：「有一個賣紫色布匹的婦人，名叫呂底亞，是推雅推喇城的人，素來敬拜神。她聽見了，主就開導她的心，叫她留心聽保羅所講的話。」她和她一家都受了洗。',
    journalPrompt: {
      title: '心門的開啟',
      content: '呂底亞已經是敬拜神的人，但她需要主開導她的心才能真正明白福音。得救不僅是人的決定，更是神的工作。她的家成為保羅在歐洲的第一個宣教基地。'
    },
    deepDive: {
      title: '歐洲的第一位信徒',
      content: '呂底亞是歐洲第一位基督徒，她的歸信標誌著福音從亞洲傳到歐洲的歷史性時刻。作為成功的女商人（賣紫色布匹是高級生意），她運用自己的資源和影響力支持保羅的事工。她的家成為腓立比教會的聚會地點。腓立比書是保羅寫給這教會的信，充滿了喜樂和感恩，部分原因可能是呂底亞和其他信徒的慷慨支持。',
      sources: [
        { text: '使徒行傳 16:11-15 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Acts+16:11-15&version=NIV' },
        { text: '腓立比書 1:3-7 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Philippians+1:3-7&version=ESV' },
      ]
    }
  },
  {
    id: 'q38',
    character: '亞居拉和百基拉',
    characterImage: 'https://picsum.photos/seed/aquila/100',
    question: '當我們遇見年輕傳道人亞波羅時，我們做了什麼？',
    options: [
      '公開批評他的教導。',
      '私下將神的道給他講解更加詳細。',
      '把他趕出會堂。',
      '忽視他的存在。',
    ],
    correctAnswerIndex: 1,
    explanation: '使徒行傳18:26記載：「他在會堂裡放膽講道，百基拉、亞居拉聽見，就接他來，將神的道給他講解更加詳細。」這對夫婦以智慧和愛心幫助亞波羅成長。',
    journalPrompt: {
      title: '謙卑的服事',
      content: '這對製作帳棚的夫婦展現了如何以恩慈和智慧造就他人。他們沒有公開糾正亞波羅，而是私下幫助他，使他成為更有效的神國工人。'
    },
    deepDive: {
      title: '平信徒的影響力',
      content: '亞居拉和百基拉是保羅同工的平信徒夫婦，他們以製作帳棚為生，同時積極參與宣教工作。保羅在多處書信中提到他們，稱他們為同工，甚至說他們「為我的命將自己的頸項置之度外」（羅馬書16:3-4）。他們的家成為教會聚會的地方。這對夫婦展示了平信徒如何在神的國度中發揮重大影響力，不需要全職事奉才能有效服事神。',
      sources: [
        { text: '使徒行傳 18:24-28 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Acts+18:24-28&version=NIV' },
        { text: '羅馬書 16:3-5 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Romans+16:3-5&version=ESV' },
      ]
    }
  },
  {
    id: 'q39',
    character: '腓利門',
    characterImage: 'https://picsum.photos/seed/philemon/100',
    question: '保羅寫信給我，請求我如何對待逃跑的奴隸阿尼西母？',
    options: [
      '嚴厲懲罰他。',
      '把他送回羅馬。',
      '接納他，不再當奴僕，乃是高過奴僕，當作親愛的兄弟。',
      '賣掉他。',
    ],
    correctAnswerIndex: 2,
    explanation: '腓利門書16節記載，保羅請求腓利門接納阿尼西母，「不再是奴僕，乃是高過奴僕，當作親愛的兄弟」。這封信展現了福音如何轉化社會關係。',
    journalPrompt: {
      title: '福音的轉化力量',
      content: '基督信仰沒有立即廢除奴隸制度，但它從內部轉化了這種關係。在基督裡，主人和奴隸都是弟兄。這種革命性的平等觀最終導致奴隸制的廢除。'
    },
    deepDive: {
      title: '饒恕與和解',
      content: '這封寫給腓利門的私人信件被包含在聖經中，因為它展現了福音如何處理人際衝突和社會不公。阿尼西母可能偷了主人的東西後逃跑，遇見保羅並成為基督徒。保羅沒有命令腓利門釋放阿尼西母，但他暗示這應該是結果。這種溫和但堅定的勸說方式，教導我們如何在權力不平等的情況下促進和解與公義。',
      sources: [
        { text: '腓利門書 1:8-21 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Philemon+1:8-21&version=NIV' },
        { text: '加拉太書 3:28 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Galatians+3:28&version=ESV' },
      ]
    }
  },
  {
    id: 'q40',
    character: '提摩太',
    characterImage: 'https://picsum.photos/seed/timothy/100',
    question: '保羅寫信提醒我，不可因為什麼而叫人小看我？',
    options: [
      '我的財富不多。',
      '我年輕。',
      '我沒有受過高等教育。',
      '我不是猶太人。',
    ],
    correctAnswerIndex: 1,
    explanation: '提摩太前書4:12記載：「不可叫人小看你年輕，總要在言語、行為、愛心、信心、清潔上，都作信徒的榜樣。」保羅鼓勵年輕的提摩太不要因年齡而自卑。',
    journalPrompt: {
      title: '忠心勝過年齡',
      content: '提摩太雖然年輕，卻被委以重任牧養以弗所教會。神不看外貌或年齡，祂看重的是忠心和品格。年輕人可以在信仰上成為榜樣。'
    },
    deepDive: {
      title: '屬靈父子',
      content: '保羅與提摩太的關係展現了屬靈導師的美好典範。保羅稱提摩太為「我親愛的兒子」、「因信主作我真兒子的」。提摩太從小被敬虔的外祖母羅以和母親友尼基教導聖經（提後1:5，3:15）。他後來成為保羅最信任的同工之一。保羅寫給他的兩封書信充滿了實用的牧會建議和深情的關懷，是跨代門徒訓練的經典範例。',
      sources: [
        { text: '提摩太前書 4:12-16 (NIV)', url: 'https://www.biblegateway.com/passage/?search=1+Timothy+4:12-16&version=NIV' },
        { text: '提摩太後書 1:3-7 (ESV)', url: 'https://www.biblegateway.com/passage/?search=2+Timothy+1:3-7&version=ESV' },
      ]
    }
  },
  {
    id: 'q41',
    character: '雅各（主的兄弟）',
    characterImage: 'https://picsum.photos/seed/jamesbrother/100',
    question: '在我的書信中，我如何描述真實的信心？',
    options: [
      '信心只要存在心裡就夠了。',
      '沒有行為的信心是死的。',
      '信心不需要任何證明。',
      '信心是私人的事，不需要表現出來。',
    ],
    correctAnswerIndex: 1,
    explanation: '雅各書2:26寫道：「身體沒有靈魂是死的，信心沒有行為也是死的。」雅各強調真實的信心必然會在生活中結出行為的果子。',
    journalPrompt: {
      title: '活潑的信心',
      content: '雅各的教導不是與保羅的因信稱義矛盾，而是補充。保羅強調我們是因信得救，不是靠行為；雅各強調真實的信心必然產生行為。兩者都是真理。'
    },
    deepDive: {
      title: '從懷疑到領袖',
      content: '雅各是耶穌的親弟弟，但在耶穌傳道期間，他並不相信耶穌（約7:5）。復活後的顯現改變了他（林前15:7），他成為耶路撒冷教會的領袖。優西比烏記載他被稱為「公義的雅各」，因為他的敬虔生活。他最終為信仰殉道。雅各書是最實用的新約書信之一，強調信心與生活的結合，特別關注社會公義、馴服舌頭、和禱告的力量。',
      sources: [
        { text: '雅各書 2:14-26 (NIV)', url: 'https://www.biblegateway.com/passage/?search=James+2:14-26&version=NIV' },
        { text: '加拉太書 2:9 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Galatians+2:9&version=ESV' },
      ]
    }
  },
  {
    id: 'q42',
    character: '西拉',
    characterImage: 'https://picsum.photos/seed/silas/100',
    question: '當我和保羅在腓立比監獄中被毒打並關押時，我們做了什麼？',
    options: [
      '大聲抱怨不公。',
      '約在半夜，我們禱告唱詩讚美神。',
      '計畫逃獄。',
      '放棄了信仰。',
    ],
    correctAnswerIndex: 1,
    explanation: '使徒行傳16:25記載：「約在半夜，保羅和西拉禱告唱詩讚美神，眾囚犯也側耳而聽。」忽然地大震動，監門全開，眾囚犯的鎖鍊也都鬆開了。禁卒和他全家因此信主。',
    journalPrompt: {
      title: '患難中的讚美',
      content: '保羅和西拉在極端痛苦中選擇讚美神。他們的見證不只感動了獄卒，也成為歷代信徒在患難中的榜樣。真實的信心在逆境中更加閃耀。'
    },
    deepDive: {
      title: '同工的力量',
      content: '西拉（又名西拉斯）是耶路撒冷教會的領袖，被選為將使徒會議決定帶給外邦教會的使者。當保羅和巴拿巴分開後，西拉成為保羅第二次宣教旅程的夥伴。他不只是助手，更是同等的同工，被稱為先知。他與保羅一起經歷了腓立比的監獄、帖撒羅尼迦的暴亂、和庇哩亞的歡迎。後來他協助彼得寫信（彼前5:12）。他的事工展示了忠心同工的重要性。',
      sources: [
        { text: '使徒行傳 16:16-34 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Acts+16:16-34&version=NIV' },
        { text: '帖撒羅尼迦前書 1:1 (ESV)', url: 'https://www.biblegateway.com/passage/?search=1+Thessalonians+1:1&version=ESV' },
      ]
    }
  },
  {
    id: 'q43',
    character: '亞波羅',
    characterImage: 'https://picsum.photos/seed/apollos/100',
    question: '當我在以弗所傳道時，我對舊約聖經的知識如何？',
    options: [
      '我完全不懂聖經。',
      '最有學問，最能講解聖經，但只曉得約翰的洗禮。',
      '我只讀過新約。',
      '我從不引用聖經。',
    ],
    correctAnswerIndex: 1,
    explanation: '使徒行傳18:24-25形容亞波羅「是有學問的，最能講解聖經。這人已經在主的道上受了教訓，心裡火熱，將耶穌的事詳細講論教訓人；只是他單曉得約翰的洗禮。」',
    journalPrompt: {
      title: '持續的學習',
      content: '亞波羅雖然有學問、熱心，但仍需要更完全的認識。他謙卑地接受百基拉和亞居拉的指導，成為更有效的工人。我們都需要持續學習和成長。'
    },
    deepDive: {
      title: '恩賜與合一',
      content: '亞波羅後來在哥林多大有能力，公開駁倒猶太人，引聖經證明耶穌是基督（徒18:28）。但哥林多教會有人說「我是屬亞波羅的」，引起分黨（林前1:12）。保羅在林前3:5-9澄清：他栽種，亞波羅澆灌，但使植物生長的是神。他們都是神的同工。這教導我們，不同的恩賜和角色應該互補，而非競爭。保羅甚至勸亞波羅去哥林多（林前16:12），顯示他們之間的合一。',
      sources: [
        { text: '使徒行傳 18:24-28 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Acts+18:24-28&version=NIV' },
        { text: '哥林多前書 3:4-9 (ESV)', url: 'https://www.biblegateway.com/passage/?search=1+Corinthians+3:4-9&version=ESV' },
      ]
    }
  },
  {
    id: 'q44',
    character: '腓利（執事）',
    characterImage: 'https://picsum.photos/seed/philipdeacon/100',
    question: '當聖靈引導我去曠野的路上時，我遇見了誰？',
    options: [
      '一位羅馬將軍。',
      '一位埃提阿伯的太監，正在讀以賽亞書。',
      '一群盜賊。',
      '耶路撒冷的祭司。',
    ],
    correctAnswerIndex: 1,
    explanation: '使徒行傳8:27-35記載，腓利遇見一位埃提阿伯太監，正在讀以賽亞書53章。腓利向他講解這段經文指向耶穌，太監立刻要求受洗，成為非洲第一位基督徒。',
    journalPrompt: {
      title: '聖靈的引導',
      content: '腓利順服聖靈的引導，離開撒馬利亞的復興，去曠野只向一個人傳福音。神看重每一個靈魂。我們需要敏銳於聖靈的帶領，即使看似不合邏輯。'
    },
    deepDive: {
      title: '從管飯食到傳福音',
      content: '腓利原本被選為七位執事之一，管理飯食服事寡婦（徒6:1-6）。但他不滿足於此，成為強有力的佈道家。司提反殉道後，他將福音帶到撒馬利亞，帶領許多人歸主，甚至行神蹟。與太監的相遇後，他又被聖靈提去，在沿海一帶傳道。多年後，保羅訪問他在該撒利亞的家，他有四個女兒都作先知（徒21:8-9）。腓利的一生展示忠心從小事開始，但可以發展成偉大的事工。',
      sources: [
        { text: '使徒行傳 8:26-40 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Acts+8:26-40&version=NIV' },
        { text: '使徒行傳 21:8-9 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Acts+21:8-9&version=ESV' },
      ]
    }
  },
  {
    id: 'q45',
    character: '哥尼流',
    characterImage: 'https://picsum.photos/seed/cornelius/100',
    question: '作為外邦人，神用什麼方式告訴我要邀請彼得來我家？',
    options: [
      '透過夢。',
      '天使在異象中向我顯現。',
      '我在聖殿聽見聲音。',
      '保羅來拜訪我。',
    ],
    correctAnswerIndex: 1,
    explanation: '使徒行傳10:3-6記載：「有一天，約在申初，他在異象中明明看見神的一個使者進去，到他那裡，說：哥尼流。」天使指示他派人到約帕去請彼得來。同時，神也給彼得異象，預備他打破猶太傳統去外邦人家。',
    journalPrompt: {
      title: '福音跨越藩籬',
      content: '哥尼流是敬畏神的外邦人，但直到彼得來傳講耶穌，他才完全明白福音。神同時預備了尋求者和傳道者。福音是為萬民預備的。'
    },
    deepDive: {
      title: '教會歷史的轉捩點',
      content: '哥尼流是羅馬百夫長，卻虔誠敬拜以色列的神。他樂善好施，常常禱告。他的歸信標誌著教會歷史的重大轉變：外邦人可以不經過猶太律法直接成為基督徒。當聖靈降在哥尼流和他家人身上時，彼得驚奇地說：「這些人既受了聖靈，與我們一樣，誰能禁止用水給他們施洗呢？」（徒10:47）。這個事件成為後來耶路撒冷會議的關鍵先例（徒15章）。',
      sources: [
        { text: '使徒行傳 10:1-48 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Acts+10:1-48&version=NIV' },
        { text: '使徒行傳 11:1-18 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Acts+11:1-18&version=ESV' },
      ]
    }
  },
  {
    id: 'q46',
    character: '巴拿巴',
    characterImage: 'https://picsum.photos/seed/barnabas/100',
    question: '我的名字「巴拿巴」是什麼意思？',
    options: [
      '大力士',
      '勸慰子',
      '智慧者',
      '勇士',
    ],
    correctAnswerIndex: 1,
    explanation: '使徒行傳4:36記載：「有一個利未人，生在居比路，名叫約瑟，使徒稱他為巴拿巴（巴拿巴翻出來就是勸慰子）。」他的名字完美描述了他的恩賜和性格。',
    journalPrompt: {
      title: '鼓勵者的恩賜',
      content: '巴拿巴看見別人的潛力，願意給人第二次機會。他引薦保羅給使徒，給馬可第二次服事的機會。教會需要更多像巴拿巴這樣的鼓勵者。'
    },
    deepDive: {
      title: '好人與犧牲',
      content: '聖經形容巴拿巴是「好人，被聖靈充滿，大有信心」（徒11:24）。他賣了田產，將錢財帶來放在使徒腳前。當保羅歸主後沒人敢接納他時，巴拿巴勇敢為他擔保。他邀請保羅一起在安提阿服事，甚至主動讓保羅成為主要的講道者。後來他們因馬可的事分開，巴拿巴選擇給馬可第二次機會。保羅後來承認馬可對他有益處（提後4:11），證明巴拿巴的眼光是對的。',
      sources: [
        { text: '使徒行傳 4:36-37 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Acts+4:36-37&version=NIV' },
        { text: '使徒行傳 15:36-41 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Acts+15:36-41&version=ESV' },
      ]
    }
  },
  {
    id: 'q47',
    character: '以巴弗',
    characterImage: 'https://picsum.photos/seed/epaphras/100',
    question: '保羅如何描述我為歌羅西教會的禱告？',
    options: [
      '偶爾為他們禱告。',
      '常常竭力為你們祈求，願你們在神一切的旨意上得以完全。',
      '從不為他們禱告。',
      '只在主日為他們禱告。',
    ],
    correctAnswerIndex: 1,
    explanation: '歌羅西書4:12記載，保羅說：「有你們那裡的人，作基督耶穌僕人的以巴弗問你們安。他在禱告之間，常為你們竭力的祈求，願你們在神一切的旨意上得以完全，信心充足，能站立得穩。」',
    journalPrompt: {
      title: '代禱的事工',
      content: '以巴弗可能建立了歌羅西教會，但他最大的事工是恆切的代禱。有時神呼召我們的事工不在前線，而是在禱告的密室中。忠心的代禱是有永恆價值的服事。'
    },
    deepDive: {
      title: '無名英雄',
      content: '以巴弗的名字在新約中只出現兩次，但每次都與禱告有關。保羅稱他為「親愛的同工」和「我一同坐監的」（門1:23）。他可能因福音的緣故與保羅同時被監禁。雖然他沒有像保羅那樣寫書信或建立眾多教會，但他忠心的代禱和服事卻被記錄在聖經中。教會需要更多像以巴弗這樣願意在背後竭力禱告的無名英雄。',
      sources: [
        { text: '歌羅西書 4:12-13 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Colossians+4:12-13&version=NIV' },
        { text: '歌羅西書 1:7-8 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Colossians+1:7-8&version=ESV' },
      ]
    }
  },
  {
    id: 'q48',
    character: '非比',
    characterImage: 'https://picsum.photos/seed/phoebe/100',
    question: '保羅如何介紹我給羅馬教會？',
    options: [
      '普通信徒。',
      '堅革哩教會的女執事，素來幫助許多人。',
      '我的學生。',
      '一位訪客。',
    ],
    correctAnswerIndex: 1,
    explanation: '羅馬書16:1-2記載：「我對你們舉薦我們的姊妹非比，她是堅革哩教會中的女執事。請你們為主接待她，合乎聖徒的體統。她在何事上要你們幫助，你們就幫助她，因她素來幫助許多人，也幫助了我。」',
    journalPrompt: {
      title: '服事的榜樣',
      content: '非比很可能是帶著羅馬書信去羅馬的人。她被稱為執事，是教會中有職分的服事者，也是許多人的幫助者。女性在早期教會擔任重要角色。'
    },
    deepDive: {
      title: '女性在教會中的角色',
      content: '非比被稱為「執事」（diakonos），與提摩太前書3:8-13中執事的資格用的是同一個詞。她也被稱為「幫助者」（prostatis），這個詞有領袖、庇護人的意思。她可能是富有的商人，資助保羅和其他工人。羅馬書16章提到多位女性同工：百基拉（保羅稱她為同工）、馬利亞（為你們多受勞苦）、土非拿氏和土富撒氏（在主裡勞碌）。早期教會中，女性積極參與各種服事。',
      sources: [
        { text: '羅馬書 16:1-2 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Romans+16:1-2&version=NIV' },
        { text: '羅馬書 16:3-16 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Romans+16:3-16&version=ESV' },
      ]
    }
  },
  {
    id: 'q49',
    character: '馬可（約翰馬可）',
    characterImage: 'https://picsum.photos/seed/mark/100',
    question: '在第一次宣教旅程中，我做了什麼導致保羅不再信任我？',
    options: [
      '我偷了奉獻。',
      '我在旁非利亞離開他們，回耶路撒冷去了。',
      '我公開批評保羅。',
      '我從未跟他們一起去。',
    ],
    correctAnswerIndex: 1,
    explanation: '使徒行傳13:13記載：「保羅和他的同人從帕弗開船，來到旁非利亞的別加，約翰就離開他們，回耶路撒冷去。」這導致保羅在第二次旅程時拒絕帶馬可同行，引發他與巴拿巴的分歧。',
    journalPrompt: {
      title: '失敗後的恢復',
      content: '馬可的早期失敗沒有定義他的一生。巴拿巴給他第二次機會，最終連保羅都承認他的價值。我們都會失敗，但神能恢復和使用願意成長的人。'
    },
    deepDive: {
      title: '從失敗到福音作者',
      content: '馬可的母親馬利亞家中是早期教會的聚會地點（徒12:12）。他曾服事保羅、巴拿巴和彼得。雖然他在第一次宣教旅程中退出，但後來他成長成熟。保羅在晚年寫信給提摩太時說：「你來的時候，要把馬可帶來，因為他在傳道的事上於我有益處」（提後4:11）。彼得稱他為「我兒子馬可」（彼前5:13）。最重要的是，神使用他寫下馬可福音，成為四福音中最早寫成的。',
      sources: [
        { text: '使徒行傳 15:36-41 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Acts+15:36-41&version=NIV' },
        { text: '提摩太後書 4:11 (ESV)', url: 'https://www.biblegateway.com/passage/?search=2+Timothy+4:11&version=ESV' },
      ]
    }
  },
  {
    id: 'q50',
    character: '老底嘉教會',
    characterImage: 'https://picsum.photos/seed/laodicea/100',
    question: '在啟示錄中，主對我們教會最嚴厲的責備是什麼？',
    options: [
      '你們太窮了。',
      '你們被迫害。',
      '你們也不冷也不熱，我必從我口中把你吐出去。',
      '你們太熱心了。',
    ],
    correctAnswerIndex: 2,
    explanation: '啟示錄3:16記載，主說：「你既如溫水，也不冷也不熱，所以我必從我口中把你吐出去。」老底嘉教會的問題是自滿和屬靈的不冷不熱。',
    journalPrompt: {
      title: '危險的不冷不熱',
      content: '老底嘉教會自以為富足，卻不知道自己在屬靈上是「困苦、可憐、貧窮、瞎眼、赤身的」。自滿是屬靈生命最危險的敵人。主呼籲：「我勸你向我買火煉的金子，叫你富足。」'
    },
    deepDive: {
      title: '七個教會的最後警告',
      content: '老底嘉是啟示錄七個教會中最後一個，也是唯一沒有受到任何稱讚的。這城市以銀行業、羊毛工業和眼藥聞名，導致屬靈的驕傲。它的水源是溫的，既不像希拉波立的熱水有療效，也不像歌羅西的冷水可解渴。主站在門外叩門（啟3:20），顯示祂已被排除在教會活動之外。這封信對今天富裕但屬靈冷淡的教會是嚴厲的警告。',
      sources: [
        { text: '啟示錄 3:14-22 (NIV)', url: 'https://www.biblegateway.com/passage/?search=Revelation+3:14-22&version=NIV' },
        { text: '何西阿書 12:8 (ESV)', url: 'https://www.biblegateway.com/passage/?search=Hosea+12:8&version=ESV' },
      ]
    }
  },
];

export const locations: BibleLocation[] = [
  { id: 'l1', name: '迦勒底的吾珥', era: '先祖時期', position: { top: '75%', left: '70%' }, questId: 'q1' },
  { id: 'l2', name: '西奈山', era: '出埃及時期', position: { top: '55%', left: '45%' }, questId: 'q2', dependency: 'l1' },
  { id: 'l7', name: '約旦河東岸', era: '征服時期', position: { top: '45%', left: '52%' }, questId: 'q7', dependency: 'l2' },
  { id: 'l8', name: '耶路撒冷宮殿', era: '王國時期', position: { top: '42%', left: '48%' }, questId: 'q8', dependency: 'l7' },
  { id: 'l9', name: '基遍', era: '王國鼎盛期', position: { top: '40%', left: '47%' }, questId: 'q9', dependency: 'l8' },
  { id: 'l10', name: '耶路撒冷聖殿', era: '先知時期', position: { top: '43%', left: '49%' }, questId: 'q10', dependency: 'l9' },
  { id: 'l5', name: '巴比倫', era: '流亡時期', position: { top: '60%', left: '65%' }, questId: 'q5', dependency: 'l10' },
  { id: 'l11', name: '巴比倫宮殿', era: '流亡時期', position: { top: '62%', left: '67%' }, questId: 'q11', dependency: 'l5' },
  { id: 'l3', name: '約旦河', era: '新約先驅', position: { top: '40%', left: '50%' }, questId: 'q3', dependency: 'l11' },
  { id: 'l12', name: '加利利山上', era: '耶穌時期', position: { top: '35%', left: '49%' }, questId: 'q12', dependency: 'l3' },
  { id: 'l13', name: '耶利哥', era: '耶穌時期', position: { top: '44%', left: '50%' }, questId: 'q13', dependency: 'l12' },
  { id: 'l4', name: '耶路撒冷', era: '使徒時期', position: { top: '42%', left: '48%' }, questId: 'q4', dependency: 'l13' },
  { id: 'l14', name: '以弗所', era: '使徒時期', position: { top: '32%', left: '38%' }, questId: 'q14', dependency: 'l4' },
  { id: 'l15', name: '伯大尼', era: '耶穌時期', position: { top: '43%', left: '51%' }, questId: 'q15', dependency: 'l14' },
  { id: 'l6', name: '哥林多', era: '教會時期', position: { top: '30%', left: '35%' }, questId: 'q6', dependency: 'l15' },
  { id: 'l16', name: '伊甸園', era: '創世時期', position: { top: '80%', left: '68%' }, questId: 'q16', dependency: 'l6' },
  { id: 'l17', name: '亞拉臘山', era: '洪水時期', position: { top: '70%', left: '55%' }, questId: 'q17', dependency: 'l16' },
  { id: 'l18', name: '埃及', era: '先祖時期', position: { top: '65%', left: '42%' }, questId: 'q18', dependency: 'l17' },
  { id: 'l19', name: '紅海邊', era: '出埃及時期', position: { top: '58%', left: '46%' }, questId: 'q19', dependency: 'l18' },
  { id: 'l20', name: '加低斯巴尼亞', era: '曠野時期', position: { top: '52%', left: '47%' }, questId: 'q20', dependency: 'l19' },
  { id: 'l21', name: '伯利恆', era: '士師時期', position: { top: '43%', left: '49%' }, questId: 'q21', dependency: 'l20' },
  { id: 'l22', name: '示羅', era: '士師時期', position: { top: '41%', left: '48%' }, questId: 'q22', dependency: 'l21' },
  { id: 'l23', name: '大衛城', era: '王國時期', position: { top: '42%', left: '49%' }, questId: 'q23', dependency: 'l22' },
  { id: 'l24', name: '迦密山', era: '王國分裂期', position: { top: '38%', left: '47%' }, questId: 'q24', dependency: 'l23' },
  { id: 'l25', name: '撒瑪利亞', era: '王國分裂期', position: { top: '40%', left: '48%' }, questId: 'q25', dependency: 'l24' },
  { id: 'l26', name: '烏斯地', era: '先祖傳說期', position: { top: '72%', left: '58%' }, questId: 'q26', dependency: 'l25' },
  { id: 'l27', name: '耶利米之井', era: '王國末期', position: { top: '43%', left: '48%' }, questId: 'q27', dependency: 'l26' },
  { id: 'l28', name: '波斯書珊城', era: '回歸時期', position: { top: '55%', left: '73%' }, questId: 'q28', dependency: 'l27' },
  { id: 'l29', name: '波斯帝國', era: '回歸時期', position: { top: '58%', left: '70%' }, questId: 'q29', dependency: 'l28' },
  { id: 'l30', name: '猶大山地', era: '耶穌降生前', position: { top: '44%', left: '50%' }, questId: 'q30', dependency: 'l29' },
  { id: 'l31', name: '伯利恆野地', era: '耶穌降生', position: { top: '43%', left: '49%' }, questId: 'q31', dependency: 'l30' },
  { id: 'l32', name: '耶路撒冷城內', era: '耶穌時期', position: { top: '42%', left: '48%' }, questId: 'q32', dependency: 'l31' },
  { id: 'l33', name: '敘加城', era: '耶穌時期', position: { top: '39%', left: '48%' }, questId: 'q33', dependency: 'l32' },
  { id: 'l34', name: '迦百農', era: '耶穌時期', position: { top: '36%', left: '49%' }, questId: 'q34', dependency: 'l33' },
  { id: 'l35', name: '墓園', era: '復活時期', position: { top: '42%', left: '48%' }, questId: 'q35', dependency: 'l34' },
  { id: 'l36', name: '馬可樓', era: '復活後', position: { top: '42%', left: '49%' }, questId: 'q36', dependency: 'l35' },
  { id: 'l37', name: '推雅推喇', era: '使徒時期', position: { top: '33%', left: '40%' }, questId: 'q37', dependency: 'l36' },
  { id: 'l38', name: '哥林多', era: '使徒時期', position: { top: '30%', left: '35%' }, questId: 'q38', dependency: 'l37' },
  { id: 'l39', name: '歌羅西', era: '使徒時期', position: { top: '32%', left: '41%' }, questId: 'q39', dependency: 'l38' },
  { id: 'l40', name: '小亞細亞', era: '使徒時期', position: { top: '34%', left: '39%' }, questId: 'q40', dependency: 'l39' },
  { id: 'l41', name: '耶路撒冷議會', era: '使徒時期', position: { top: '42%', left: '48%' }, questId: 'q41', dependency: 'l40' },
  { id: 'l42', name: '該撒利亞', era: '使徒時期', position: { top: '37%', left: '47%' }, questId: 'q42', dependency: 'l41' },
  { id: 'l43', name: '安提阿', era: '使徒時期', position: { top: '28%', left: '52%' }, questId: 'q43', dependency: 'l42' },
  { id: 'l44', name: '腓立比', era: '使徒時期', position: { top: '25%', left: '36%' }, questId: 'q44', dependency: 'l43' },
  { id: 'l45', name: '以弗所教會', era: '使徒時期', position: { top: '32%', left: '38%' }, questId: 'q45', dependency: 'l44' },
  { id: 'l46', name: '堅革哩', era: '使徒時期', position: { top: '31%', left: '35%' }, questId: 'q46', dependency: 'l45' },
  { id: 'l47', name: '亞歷山大', era: '使徒時期', position: { top: '50%', left: '40%' }, questId: 'q47', dependency: 'l46' },
  { id: 'l48', name: '凱撒利亞', era: '使徒時期', position: { top: '37%', left: '47%' }, questId: 'q48', dependency: 'l47' },
  { id: 'l49', name: '羅馬', era: '使徒時期', position: { top: '22%', left: '20%' }, questId: 'q49', dependency: 'l48' },
  { id: 'l50', name: '老底嘉', era: '啟示錄時期', position: { top: '33%', left: '41%' }, questId: 'q50', dependency: 'l49' },
];

export const levels: Level[] = [
  {
    id: 'level1',
    name: '信仰的根基',
    locationIds: ['l1', 'l2', 'l7'],
    discussionPrompts: [
        '「聖約」的概念如何改變您對與上帝關係的看法？',
        '為什麼身體上的潔淨在舊約中如此重要，它如何指向更深層次的屬靈現實？',
        '約書亞設立紀念石的做法對今天的信仰傳承有何啟示？'
    ]
  },
  {
    id: 'level2',
    name: '王國的智慧',
    locationIds: ['l8', 'l9', 'l10'],
    discussionPrompts: [
        '大衛在詩篇中表達的信靠與交託，如何幫助我們面對現代生活的壓力？',
        '所羅門選擇智慧而非財富的故事，對我們的人生優先次序有何挑戰？',
        '以賽亞的「受苦僕人」預言如何幫助我們理解救贖的本質？'
    ]
  },
  {
    id: 'level3',
    name: '流亡與盼望',
    locationIds: ['l5', 'l11'],
    discussionPrompts: [
        '以西結關於「新心」的應許如何為耶穌的教導和基督教洗禮鋪路？',
        '但以理在異邦環境中持守信仰的經歷，對現代基督徒有何實用意義？'
    ]
  },
  {
    id: 'level4',
    name: '彌賽亞的來臨',
    locationIds: ['l3', 'l12', 'l13', 'l15'],
    discussionPrompts: [
        '悔改在施洗約翰的事工中扮演什麼角色？它與我們今天對洗禮的理解有何關聯？',
        '耶穌的「八福」如何挑戰世俗的價值觀？',
        '撒該的悔改行動如何示範真正的生命改變？',
        '馬大和馬利亞的故事如何幫助我們平衡服事與靈修？'
    ]
  },
  {
    id: 'level5',
    name: '教會的建立',
    locationIds: ['l4', 'l14', 'l6'],
    discussionPrompts: [
        '根據彼得在五旬節的講道，洗禮與領受聖靈之間有什麼關係？',
        '約翰記錄的「我是道路、真理、生命」如何確立基督信仰的獨特性？',
        '「披戴基督」對基督徒的日常生活有何實際意義？'
    ]
  },
  {
    id: 'level6',
    name: '創造與洪水',
    locationIds: ['l16', 'l17', 'l18'],
    discussionPrompts: [
        '夏娃面對試探的經歷如何幫助我們理解罪的本質和抵擋試探的方法？',
        '挪亞的順服和忍耐對我們在不信的世代中持守信仰有何啟示？',
        '約瑟從被賣到成為宰相的經歷如何展現神的主權和護理？'
    ]
  },
  {
    id: 'level7',
    name: '出埃及與曠野',
    locationIds: ['l19', 'l20', 'l21'],
    discussionPrompts: [
        '米利暗的讚美和領導力對今天的教會女性事奉有何啟發？',
        '迦勒的信心和堅持如何激勵我們面對人生的挑戰？',
        '路得對拿俄米的忠誠如何展現盟約關係的美好？'
    ]
  },
  {
    id: 'level8',
    name: '士師與王國初期',
    locationIds: ['l22', 'l23', 'l24'],
    discussionPrompts: [
        '撒母耳如何成為士師與君王制度之間的橋樑？',
        '拔示巴的故事如何提醒我們罪的後果和神的憐憫？',
        '以利亞對抗巴力的經歷對今天面對屬靈爭戰有何教導？'
    ]
  },
  {
    id: 'level9',
    name: '先知與苦難',
    locationIds: ['l25', 'l26', 'l27'],
    discussionPrompts: [
        '以利沙的神蹟事工如何延續以利亞的使命？',
        '約伯的苦難和信心對我們理解苦難神學有何貢獻？',
        '耶利米在艱難時期的忠心如何鼓勵我們在逆境中堅持？'
    ]
  },
  {
    id: 'level10',
    name: '回歸與重建',
    locationIds: ['l28', 'l29', 'l30'],
    discussionPrompts: [
        '尼希米的領導和組織能力對今天的教會建造有何啟示？',
        '以斯帖的勇氣如何教導我們「為這樣的時刻而生」的使命感？',
        '以利沙伯與馬利亞的相遇如何展現舊新約之間的連結？'
    ]
  },
  {
    id: 'level11',
    name: '耶穌的事工',
    locationIds: ['l31', 'l32', 'l33', 'l34'],
    discussionPrompts: [
        '東方智慧人尋找耶穌的旅程對我們尋求神有何啟發？',
        '尼哥底母「重生」的對話如何幫助我們理解救恩的本質？',
        '撒瑪利亞婦人與耶穌的對話如何打破文化和宗教的障礙？',
        '百夫長的信心如何超越猶太人的理解？'
    ]
  },
  {
    id: 'level12',
    name: '復活與見證',
    locationIds: ['l35', 'l36', 'l37', 'l38'],
    discussionPrompts: [
        '抹大拉的馬利亞作為第一位復活見證人有何重要性？',
        '多馬的懷疑和相信如何幫助我們處理信仰中的疑惑？',
        '呂底亞成為第一位歐洲信徒的故事有何宣教意義？',
        '亞居拉和百基拉夫婦的配搭事奉如何示範家庭宣教？'
    ]
  },
  {
    id: 'level13',
    name: '早期教會',
    locationIds: ['l39', 'l40', 'l41', 'l42'],
    discussionPrompts: [
        '腓利門書如何處理基督教倫理與當時社會制度的張力？',
        '保羅對提摩太的栽培如何展現屬靈導師的重要性？',
        '雅各書如何平衡信心與行為的教導？',
        '西拉與保羅的宣教夥伴關係有何啟發？'
    ]
  },
  {
    id: 'level14',
    name: '使徒擴展',
    locationIds: ['l43', 'l44', 'l45', 'l46'],
    discussionPrompts: [
        '亞波羅被百基拉和亞居拉指教的故事對謙卑學習有何啟示？',
        '腓利向埃提阿伯太監傳福音的經歷如何示範聖靈引導的宣教？',
        '哥尼流的故事如何標誌福音向外邦人開放的轉折點？',
        '巴拿巴的鼓勵恩賜如何建造早期教會？'
    ]
  },
  {
    id: 'level15',
    name: '教會的完全',
    locationIds: ['l47', 'l48', 'l49', 'l50'],
    discussionPrompts: [
        '以巴弗為歌羅西教會的竭力禱告對我們的代禱事工有何教導？',
        '非比被保羅稱為「執事」和「幫助者」對女性事奉有何意義？',
        '馬可從失敗到恢復的經歷如何鼓勵我們在事奉中重新得力？',
        '老底嘉教會的不冷不熱對今天的教會有何警醒？'
    ]
  }
];