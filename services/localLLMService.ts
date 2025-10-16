import type { GeneratedPresentation, SermonBasis, SermonLength } from '../types';

interface LocalLLMGenerateOptions {
  model: string;
  temperature: number;
  topP: number;
}

// Ollama Cloud available models (actual models in your account)
export const OLLAMA_CLOUD_MODELS = [
  'kimi-k2:1t',
  'qwen3-coder:480b',
  'deepseek-v3.1:671b',
  'gpt-oss:120b',
  'gpt-oss:20b'
] as const;

/**
 * Call Ollama Cloud API using Vite proxy (browser-compatible, avoids CORS)
 */
const callOllamaCloud = async (
  model: string,
  prompt: string,
  temperature: number = 0.7
): Promise<string> => {
  try {
    // Use local Vite proxy endpoint to avoid CORS issues
    const response = await fetch('/api/ollama', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature,
        max_tokens: 4000,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama Cloud API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    // Extract content from OpenAI-compatible response
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    }

    throw new Error('Invalid response format from Ollama Cloud API');
  } catch (error: any) {
    console.error('Ollama Cloud API error:', error);
    throw new Error(`Failed to generate with Ollama Cloud: ${error.message}`);
  }
};

export const generatePresentation = async (
  topic: string,
  keyPoints: string[],
  sermonBasis: SermonBasis,
  sermonLength: SermonLength,
  setLoadingMessage: (message: string) => void,
  options: LocalLLMGenerateOptions
): Promise<GeneratedPresentation> => {
  console.log('Generating sermon with Ollama Cloud:', options.model);

  setLoadingMessage('連接到 Ollama Cloud API...');

  // Build the prompt for sermon generation
  const sermonBasisInstructions = {
    'Biblical Study': '進行深入的釋經研究，關注原文、歷史背景和文學結構',
    'Church History': '從教會歷史的角度來理解，連接過去的智慧與當代應用',
    'Systematic Theology': '系統神學的方法，清晰闡述教義並以聖經為根基'
  };

  const prompt = `你是一位經驗豐富的牧師和講道專家。請為以下主題創作一篇${sermonLength}分鐘的基督教講道。

主題：${topic}
神學基礎：${sermonBasis} - ${sermonBasisInstructions[sermonBasis]}
重點要點：${keyPoints.join('、')}

請生成一個結構化的講道，包含：
1. 引言 - 吸引會眾注意並介紹主題
2. 聖經基礎 - 深入經文分析
3. 神學反思 - 深層的教義理解
4. 實際應用 - 具體的生活應用
5. 結論與呼召 - 有力的總結和生命邀請

請以JSON格式回應，包含以下結構：
{
  "summary": "講道摘要（200字以內）",
  "slides": [
    {
      "title": "幻燈片標題",
      "talkingPoints": ["要點1", "要點2", "要點3"],
      "speakerNotes": "講員備註（詳細內容）"
    }
  ],
  "fullScript": "完整的講道稿文本"
}

請確保內容：
- 包含準確的聖經經文引用
- 適合${sermonLength}分鐘的講道長度
- 語言溫暖、鼓勵且充滿信心
- 神學上準確且實用`;

  setLoadingMessage(`使用 ${options.model} 生成講道內容...`);

  try {
    const response = await callOllamaCloud(options.model, prompt, options.temperature);

    setLoadingMessage('解析生成內容...');

    // Try to parse JSON response
    let parsedData;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.warn('Failed to parse JSON, creating structure from text:', parseError);
      // Fallback: create structure from plain text
      parsedData = createPresentationFromText(response, topic, keyPoints, sermonBasis, sermonLength);
    }

    setLoadingMessage('組裝最終演示文稿...');

    // Ensure slides have proper structure with image URLs
    const slides = (parsedData.slides || []).map((slide: any, index: number) => ({
      title: slide.title || `第 ${index + 1} 部分`,
      talkingPoints: Array.isArray(slide.talkingPoints)
        ? slide.talkingPoints
        : ['重點 1', '重點 2', '重點 3'],
      speakerNotes: slide.speakerNotes || slide.content || '',
      imagePrompt: slide.imagePrompt || `講道場景 ${index + 1}`,
      backgroundUrl: `https://picsum.photos/seed/sermon${index}/800/600`
    }));

    const presentation: GeneratedPresentation = {
      slides: slides.length > 0 ? slides : createDefaultSlides(topic, keyPoints, sermonBasis, options.model, sermonLength),
      speakerImageUrl: 'https://picsum.photos/seed/speaker/150/150',
      audienceImageUrl: 'https://picsum.photos/seed/audience/300/200',
      fullScript: parsedData.fullScript || response,
      summary: parsedData.summary || `使用 ${options.model} 生成的關於「${topic}」的講道，基於${sermonBasis}的神學研究方法。`
    };

    setLoadingMessage('完成生成！');
    return presentation;

  } catch (error) {
    console.error('Ollama Cloud generation error:', error);
    setLoadingMessage('生成失敗，使用備用內容...');

    // Fallback to mock data if API fails
    return createFallbackPresentation(topic, keyPoints, sermonBasis, sermonLength, options);
  }
};

/**
 * Create presentation structure from plain text response
 */
function createPresentationFromText(
  text: string,
  topic: string,
  keyPoints: string[],
  sermonBasis: SermonBasis,
  sermonLength: SermonLength
) {
  // Split text into paragraphs
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);

  // Create slides from paragraphs (max 5)
  const slides = paragraphs.slice(0, 5).map((paragraph, index) => {
    const lines = paragraph.split('\n').filter(l => l.trim());
    return {
      title: lines[0]?.substring(0, 50) || `第 ${index + 1} 部分`,
      talkingPoints: lines.slice(1, 4).length > 0 ? lines.slice(1, 4) : ['要點 1', '要點 2', '要點 3'],
      speakerNotes: paragraph,
      imagePrompt: `講道插圖 ${index + 1}`,
      backgroundUrl: `https://picsum.photos/seed/sermon${index}/800/600`
    };
  });

  return {
    summary: text.substring(0, 200) + '...',
    slides,
    fullScript: text
  };
}

/**
 * Create default slides structure
 */
function createDefaultSlides(
  topic: string,
  keyPoints: string[],
  sermonBasis: SermonBasis,
  model: string,
  sermonLength: SermonLength
) {
  return [
    {
      title: `${topic} - 引言`,
      talkingPoints: ['歡迎與開場祈禱', `介紹今日主題：${topic}`, '建立會眾期待'],
      speakerNotes: `使用 ${model} 生成的引言部分。根據${sermonBasis}的角度來介紹${topic}。`,
      imagePrompt: '教會聚會開始的溫馨場景',
      backgroundUrl: 'https://picsum.photos/seed/sermon1/800/600'
    },
    {
      title: '聖經基礎',
      talkingPoints: keyPoints.length > 0 ? keyPoints : ['主要經文分析', '歷史背景', '原文含義'],
      speakerNotes: `深入探討聖經根據，運用${sermonBasis}的研究方法。`,
      imagePrompt: '聖經攤開在講台上的神聖場景',
      backgroundUrl: 'https://picsum.photos/seed/sermon2/800/600'
    },
    {
      title: '神學反思',
      talkingPoints: ['教義的深層含義', '與傳統教導的關聯', '現代詮釋的平衡'],
      speakerNotes: `神學分析部分，展現對${sermonBasis}相關神學觀點的理解。`,
      imagePrompt: '思考和默想的安靜空間',
      backgroundUrl: 'https://picsum.photos/seed/sermon3/800/600'
    },
    {
      title: '實際應用',
      talkingPoints: ['日常生活的實踐', '具體的行動步驟', '社群中的見證'],
      speakerNotes: '應用部分要求實用性和可操作性，貼近會眾需求。',
      imagePrompt: '基督徒在日常生活中實踐信仰',
      backgroundUrl: 'https://picsum.photos/seed/sermon4/800/600'
    },
    {
      title: '結論與呼召',
      talkingPoints: ['總結核心信息', '發出生命的邀請', '祝禱與差遣'],
      speakerNotes: `結尾部分需要有力且溫暖。講道時間控制在${sermonLength}分鐘。`,
      imagePrompt: '會眾響應呼召的感動場面',
      backgroundUrl: 'https://picsum.photos/seed/sermon5/800/600'
    }
  ];
}

/**
 * Create fallback presentation if API fails
 */
function createFallbackPresentation(
  topic: string,
  keyPoints: string[],
  sermonBasis: SermonBasis,
  sermonLength: SermonLength,
  options: LocalLLMGenerateOptions
): GeneratedPresentation {
  return {
    slides: createDefaultSlides(topic, keyPoints, sermonBasis, options.model, sermonLength),
    speakerImageUrl: 'https://picsum.photos/seed/speaker/150/150',
    audienceImageUrl: 'https://picsum.photos/seed/audience/300/200',
    fullScript: `【${options.model} 備用講道稿】

親愛的弟兄姊妹們，平安！

今天我們要一起探討「${topic}」這個重要的主題。

${keyPoints.length > 0 ? keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n') : ''}

願上帝的話語成為我們腳前的燈，路上的光。

阿們。`,
    summary: `關於「${topic}」的講道，基於${sermonBasis}的研究方法。預計時長${sermonLength}分鐘。`
  };
}