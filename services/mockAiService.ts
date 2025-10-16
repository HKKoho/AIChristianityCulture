import type { GeneratedPresentation, SermonBasis, SermonLength } from '../types';

const mockSermon = [
    {
      title: "Introduction: A Road and a Question",
      talkingPoints: ["The setting: Jericho to Jerusalem", "A test from an expert in the law (Luke 10:25)", "What must I do to inherit eternal life?"],
      speakerNotes: "Welcome. We find ourselves today on a dangerous road, the path from Jerusalem to Jericho. It's on this road that a lawyer, an expert in religious law, tests Jesus with a question that echoes in every human heart, as recorded in Luke 10:25: 'Teacher, what shall I do to inherit eternal life?'",
      imagePrompt: "An ancient, dusty road winding through a desert landscape at sunset, digital painting.",
    },
    {
      title: "The Broken and the Passing By",
      talkingPoints: ["A man is beaten, robbed, and left for dead.", "The priest and the Levite see and pass by (Luke 10:31-32).", "Religious duty vs. genuine compassion."],
      speakerNotes: "Jesus responds with a story. A man, beaten and left for dead. A priest and a Levite, men of God, see him. They are the ones who should help, but as Luke 10:31-32 tells us, they cross to the other side. They chose religious purity over human compassion. Their piety was hollow.",
      imagePrompt: "A lone figure lying on the side of a road, with two other figures walking away in the distance, dramatic shadows.",
    },
    {
      title: "The Unexpected Neighbor",
      talkingPoints: ["A Samaritan appears - a despised outsider.", "He is moved with pity (Luke 10:33).", "He bandages the man's wounds, showing radical love."],
      speakerNotes: "But then, someone unexpected arrives. A Samaritan. In that culture, Samaritans and Jews were bitter enemies. Yet, this Samaritan doesn't see an enemy; he sees a person in need. The scripture says he was 'moved with pity' (Luke 10:33), and he acts. He cleans the wounds, provides for the man, and ensures his care. This is what true neighborly love looks like.",
      imagePrompt: "One person kneeling to help another on a roadside, with warm light emanating from them, stained glass style.",
    },
    {
      title: "The Cost of Compassion",
      talkingPoints: ["The Samaritan used his own oil and wine.", "He put the man on his own donkey.", "He paid the innkeeper from his own pocket (Luke 10:35)."],
      speakerNotes: "Notice the cost. This wasn't easy compassion. The Samaritan used his own resources—his time, his energy, his money. As Luke 10:35 describes, he even paid an innkeeper to continue the man's care. True love, the love God calls us to in passages like 1 John 3:17, is sacrificial. It costs us something.",
      imagePrompt: "Close-up of two hands, one bandaging the other, conveying care and gentleness.",
    },
    {
      title: "Conclusion: 'Go and Do Likewise'",
      talkingPoints: ["Jesus asks: 'Who was a neighbor?' (Luke 10:36)", "The answer: 'The one who had mercy.'", "A call to action for all of us."],
      speakerNotes: "Jesus then turns the lawyer's question back on him. 'Which of these three, do you think, proved to be a neighbor to the man who fell among the robbers?' (Luke 10:36). The answer is clear: the one who showed mercy. Jesus' final command to the lawyer, and to us, is simple yet profound: 'You go, and do likewise.' Our call is not to define who is worthy of our love, but to be a neighbor to anyone and everyone we meet. Thank you.",
      imagePrompt: "A diverse group of people helping each other in a modern city street, symbolizing universal neighborly love.",
    },
];

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generatePresentation = async (
  topic: string,
  keyPoints: string[],
  sermonBasis: SermonBasis,
  sermonLength: SermonLength,
  setLoadingMessage: (message: string) => void
): Promise<GeneratedPresentation> => {
  setLoadingMessage('正在啟動模擬引擎...');
  await wait(1000);

  setLoadingMessage('正在查閱神學檔案...');
  await wait(1000);
  
  setLoadingMessage('正在描繪神聖概念...');
  await wait(1000);

  setLoadingMessage('正在彙整模擬講道...');
  await wait(500);
  
  const fullScript = mockSermon.map(s => s.speakerNotes).join('\n\n');
  const summary = `This mock ${sermonLength}-minute sermon on "${topic}" explores the Parable of the Good Samaritan, emphasizing that true neighborly love transcends social boundaries and requires sacrificial compassion. It challenges believers to move beyond mere religious observance to actively show mercy to those in need, following Jesus' command to 'go and do likewise.'`;

  return {
    slides: mockSermon.map(slide => ({
      ...slide,
      title: `${slide.title} (關於 "${topic}" 的講道)`,
      backgroundUrl: `https://placehold.co/1280x720/1A202C/7F9CF5/png?text=${encodeURIComponent(slide.title)}`,
    })),
    speakerImageUrl: "https://placehold.co/128x128/4A5568/E2E8F0/png?text=AI",
    audienceImageUrl: "https://placehold.co/1280x240/111827/4B5563/png?text=",
    fullScript: `這是一篇 ${sermonLength} 分鐘關於 "${topic}" 的模擬講道，基於 ${sermonBasis}，並涵蓋以下要點：${keyPoints.join('、')}。\n\n---\n\n${fullScript}`,
    summary,
  };
};