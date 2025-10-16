import { Stage, JourneyStage, TheologicalPerspective } from './types';

export const STAGES: Stage[] = [
  {
    key: JourneyStage.InitialConcept,
    title: '初始概念',
    description: '闡述開始探究的基本想法或問題。',
    promptHint: '詳細說明這個神學概念的核心原則。'
  },
  {
    key: JourneyStage.CreedContrast,
    title: '信經對比',
    description: '將您的概念與歷史信經和信仰告白進行分析比較。',
    promptHint: '這個概念如何與尼西亞信經一致或分歧？'
  },
  {
    key: JourneyStage.BiblicalInterpretation,
    title: '聖經詮釋',
    description: '探索支持或挑戰您觀點的經文段落。',
    promptHint: '哪些關鍵的聖經經文影響這個概念？解經上有什麼挑戰？'
  },
  {
    key: JourneyStage.DoubtPhase,
    title: '質疑與反駁',
    description: '面對弱點、反對論點和個人疑慮。',
    promptHint: '從懷疑的角度來看，這個觀點最重要的反對意見是什麼？'
  },
  {
    key: JourneyStage.Revelation,
    title: '啟示與綜合',
    description: '將您的發現綜合成精煉且連貫的神學立場。',
    promptHint: '制定一個整合旅程見解的結論性論點。'
  },
];

export const PERSPECTIVES: { key: TheologicalPerspective; name: string }[] = [
    { key: TheologicalPerspective.Socratic, name: '蘇格拉底式引導' },
    { key: TheologicalPerspective.Orthodox, name: '東正教傳統' },
    { key: TheologicalPerspective.Reformed, name: '改革宗傳統' },
    { key: TheologicalPerspective.Catholic, name: '天主教傳統' },
];
