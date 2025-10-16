import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedPresentation, SlideContent, SystemPromptConfig, SermonBasis, SermonLength } from '../types';
import { DEFAULT_SYSTEM_PROMPT_CONFIG, SermonBasis as SermonBasisEnum } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateImage = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });
    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
};

const scriptResponseSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A concise, one-paragraph summary of the sermon's key message and main points."
        },
        slides: {
            type: Type.ARRAY,
            description: "An array of 5 slide objects for the presentation.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: {
                        type: Type.STRING,
                        description: "A short, engaging title for the sermon section."
                    },
                    talkingPoints: {
                        type: Type.ARRAY,
                        description: "An array of 2-3 brief talking points for this section. Where appropriate, these should include supporting scripture references (e.g., 'The command to love your neighbor (Leviticus 19:18)').",
                        items: { type: Type.STRING }
                    },
                    speakerNotes: {
                        type: Type.STRING,
                        description: "Detailed speaker notes for this section, forming part of a cohesive sermon of the requested length. This text MUST include scripture references (e.g., 'As it is written in John 3:16...') to support its points."
                    },
                    imagePrompt: {
                        type: Type.STRING,
                        description: "A descriptive prompt for an image generation model to create a background image for this slide. e.g., 'An abstract representation of the Holy Trinity'."
                    }
                },
                 required: ["title", "talkingPoints", "speakerNotes", "imagePrompt"],
            }
        },
        fullScript: {
            type: Type.STRING,
            description: "The complete, concatenated sermon script from all speaker notes, formatted for readability. This text MUST be well-supported with scripture references."
        }
    },
    required: ["summary", "slides", "fullScript"],
};

const buildSystemInstruction = (config: SystemPromptConfig): string => {
    return `You are an AI assistant designed to generate Christian sermons. Your persona should be that of a knowledgeable, thoughtful, and humble theologian or pastor. Adhere to the following persona settings:
- Ethical Framework: Your approach to sensitive topics should be ${config.ethics}.
- Political Stance: Maintain a strictly ${config.politicalStand} position.
- Powerfulness of Tone: Your language should be ${config.powerfulness} and convincing, yet pastoral.
- Sentiment: The overall sentiment of the speech should be ${config.sentiment}.
- Empathy Level: Exhibit a ${config.empathy} level of empathy in your writing.
- Personality: Your core personality is: "${config.personality}".
Your primary goal is to create a sermon script that is theologically sound, engaging, and flows logically. Your points MUST be supported with accurate and contextually appropriate scripture references. Do not break character.`;
};

export const generatePresentation = async (
  topic: string,
  keyPoints: string[],
  sermonBasis: SermonBasis,
  sermonLength: SermonLength,
  setLoadingMessage: (message: string) => void
): Promise<GeneratedPresentation> => {
    
    let config: SystemPromptConfig;
    try {
      const storedConfig = localStorage.getItem('ai-insights-prompt-config');
      config = storedConfig ? JSON.parse(storedConfig) : DEFAULT_SYSTEM_PROMPT_CONFIG;
    } catch {
      config = DEFAULT_SYSTEM_PROMPT_CONFIG;
    }
    
    const basisInstruction = {
        [SermonBasisEnum.BIBLICAL_STUDY]: "Focus on Biblical Study. Provide a careful exegesis of the text, considering its historical and literary context. Explain its meaning and provide practical applications for a modern Christian audience.",
        [SermonBasisEnum.CHURCH_HISTORY]: "Focus on Church History. Discuss the specified historical event, figure, or movement. Extract key lessons and explain its relevance to the Church today.",
        [SermonBasisEnum.SYSTEMATIC_THEOLOGY]: "Focus on Systematic Theology. Explain the theological doctrine clearly and concisely. Ground the explanation in Scripture and discuss its importance for Christian faith and life."
    };

    const keyPointsString = keyPoints.filter(p => p.trim() !== '').map(p => `- ${p}`).join('\n');
    const scriptPrompt = `
      Generate a compelling ${sermonLength}-minute sermon, a concise summary, and a 5-part presentation structure on the following topic.
      The tone should be reverent, insightful, and suitable for a church congregation.

      **Crucial Requirement:** Throughout the sermon manuscript and talking points, you MUST include relevant scripture references (e.g., John 3:16, Romans 8:28) to support your points. These references must be accurate and contextually appropriate.

      Topic: "${topic}"
      Sermon Basis: "${sermonBasis}"

      Key Verses or Points to include:
      ${keyPointsString}
      
      Instructions based on Sermon Basis:
      ${basisInstruction[sermonBasis]}

      Structure the output as a JSON object that strictly follows the provided schema.
      The summary should be a brief, single-paragraph overview of the sermon's core message.
      The entire sermon should flow logically across the 5 parts. Each part's speaker notes should be a section of this continuous sermon.
      The final 'fullScript' field should be the concatenation of all speaker notes into one cohesive text.
    `;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelConfig: any = {
        responseMimeType: "application/json",
        responseSchema: scriptResponseSchema,
    };

    if (config.personaEnabled) {
        setLoadingMessage('正在讀取 AI 神學家角色設定...');
        modelConfig.systemInstruction = buildSystemInstruction(config);
    } else {
        setLoadingMessage('正在使用預設 AI 角色...');
        modelConfig.temperature = 0.5;
    }

    setLoadingMessage('正在撰寫講道手稿...');

    const scriptResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: scriptPrompt,
        config: modelConfig,
    });
    
    const scriptData = JSON.parse(scriptResponse.text);
    const slidesContent: SlideContent[] = scriptData.slides;
    const fullScript: string = scriptData.fullScript;
    const summary: string = scriptData.summary;

    setLoadingMessage('正在生成視覺素材...');

    const speakerImagePromise = generateImage('A pastor or theologian, depicted as a thoughtful and kind person, professional headshot, looking at the camera, photorealistic, warm lighting.');
    const audienceImagePromise = generateImage('Silhouette of a congregation in a church, looking towards a softly lit pulpit area, shallow depth of field.');

    const slideImagePromises = slidesContent.map(slide => {
      const slideImagePrompt = `${slide.imagePrompt}, digital painting, stained glass art style, reverent, detailed, cinematic lighting.`;
      return generateImage(slideImagePrompt);
    });

    const [speakerImageUrl, audienceImageUrl, ...backgroundUrls] = await Promise.all([
      speakerImagePromise,
      audienceImagePromise,
      ...slideImagePromises,
    ]);
    
    const slides = slidesContent.map((slide, index) => ({
        ...slide,
        backgroundUrl: backgroundUrls[index],
    }));

    setLoadingMessage('正在彙整講道...');

    return {
        slides,
        speakerImageUrl,
        audienceImageUrl,
        fullScript,
        summary,
    };
};