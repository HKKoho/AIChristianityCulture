import { GoogleGenAI, Type } from "@google/genai";
import type { Quest } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the schema for question generation
const questionResponseSchema = {
    type: Type.OBJECT,
    properties: {
        character: {
            type: Type.STRING,
            description: "The name of the Biblical character in Traditional Chinese (繁體中文)"
        },
        question: {
            type: Type.STRING,
            description: "A thought-provoking question about the character in Traditional Chinese, written in first person from the character's perspective"
        },
        options: {
            type: Type.ARRAY,
            description: "Four multiple choice options in Traditional Chinese",
            items: { type: Type.STRING },
            minItems: 4,
            maxItems: 4
        },
        correctAnswerIndex: {
            type: Type.INTEGER,
            description: "The index (0-3) of the correct answer in the options array"
        },
        explanation: {
            type: Type.STRING,
            description: "A detailed explanation of the answer in Traditional Chinese, including specific Bible verse references (e.g., 創世記 3:5, 約翰福音 3:16)"
        },
        journalPromptTitle: {
            type: Type.STRING,
            description: "A short title for the journal prompt in Traditional Chinese"
        },
        journalPromptContent: {
            type: Type.STRING,
            description: "Reflective content for personal meditation in Traditional Chinese, connecting the Biblical story to modern Christian life"
        },
        deepDiveTitle: {
            type: Type.STRING,
            description: "A title for the deep dive theological exploration in Traditional Chinese"
        },
        deepDiveContent: {
            type: Type.STRING,
            description: "In-depth theological analysis in Traditional Chinese, exploring themes, historical context, and theological implications"
        },
        bibleSources: {
            type: Type.ARRAY,
            description: "Array of relevant Bible passages (at least 2-3 sources)",
            items: {
                type: Type.OBJECT,
                properties: {
                    reference: {
                        type: Type.STRING,
                        description: "Bible reference in Traditional Chinese with version (e.g., '創世記 3:1-6 (NIV)')"
                    },
                    englishReference: {
                        type: Type.STRING,
                        description: "Bible reference in English for URL generation (e.g., 'Genesis 3:1-6')"
                    }
                }
            }
        }
    },
    required: [
        "character",
        "question",
        "options",
        "correctAnswerIndex",
        "explanation",
        "journalPromptTitle",
        "journalPromptContent",
        "deepDiveTitle",
        "deepDiveContent",
        "bibleSources"
    ]
};

export const generateBiblicalQuestion = async (
    userPrompt: string
): Promise<Omit<Quest, 'id' | 'characterImage'>> => {
    const result = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: userPrompt,
        config: {
            systemInstruction: `你是一位專業的聖經教師和神學教育者，專門創作高質量的聖經學習問題。

你的任務是生成一個關於聖經人物或事件的教育性問題，包含：

1. **角色選擇**：選擇一個有意義的聖經人物（舊約或新約）
2. **問題設計**：以第一人稱（角色視角）撰寫問題，讓學習者能夠代入角色思考
3. **選項設計**：提供4個選項，其中3個是合理但錯誤的干擾項
4. **解釋**：提供詳細的答案解釋，必須包含具體的聖經經文引用
5. **靈修引導**：提供日誌提示，幫助學習者將聖經故事應用到現代生活
6. **深度探索**：提供神學深度分析，探討主題、歷史背景和神學意義
7. **經文來源**：提供2-3個相關的聖經章節引用

要求：
- 所有內容使用繁體中文
- 問題要有教育意義和思考深度
- 答案解釋要準確引用聖經經文
- 神學內容要符合正統基督教教義
- 語氣要尊重、教育性強
- 適合各年齡層的基督徒學習者`,
            temperature: 0.9,
            topP: 0.95,
            responseMimeType: "application/json",
            responseSchema: questionResponseSchema
        }
    });

    const parsedResponse = JSON.parse(result.text);

    // Transform the response into Quest format
    const quest: Omit<Quest, 'id' | 'characterImage'> = {
        character: parsedResponse.character,
        question: parsedResponse.question,
        options: parsedResponse.options,
        correctAnswerIndex: parsedResponse.correctAnswerIndex,
        explanation: parsedResponse.explanation,
        journalPrompt: {
            title: parsedResponse.journalPromptTitle,
            content: parsedResponse.journalPromptContent
        },
        deepDive: {
            title: parsedResponse.deepDiveTitle,
            content: parsedResponse.deepDiveContent,
            sources: parsedResponse.bibleSources.map((source: any) => ({
                text: source.reference,
                url: `https://www.biblegateway.com/passage/?search=${encodeURIComponent(source.englishReference)}&version=NIV`
            }))
        }
    };

    return quest;
};

export const generateBiblicalQuestionWithTopic = async (
    characterName?: string,
    topic?: string,
    testament?: 'old' | 'new' | 'both'
): Promise<Omit<Quest, 'id' | 'characterImage'>> => {
    let prompt = "請生成一個聖經問題";

    if (characterName) {
        prompt += `，關於聖經人物「${characterName}」`;
    }

    if (topic) {
        prompt += `，主題是「${topic}」`;
    }

    if (testament === 'old') {
        prompt += "，來自舊約聖經";
    } else if (testament === 'new') {
        prompt += "，來自新約聖經";
    }

    prompt += "。";

    return generateBiblicalQuestion(prompt);
};
