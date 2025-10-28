import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, TheologicalPerspective, MindMapData, ClassificationResult, EntryClassification } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getPerspectiveSystemInstruction = (perspective: TheologicalPerspective): string => {
  switch (perspective) {
    case TheologicalPerspective.Orthodox:
      return "You are a theologian from the Eastern Orthodox tradition. Engage with the user's points by drawing upon the Church Fathers, liturgy, and conciliar canons. Emphasize mystery, theosis, and apostolic tradition.";
    case TheologicalPerspective.Reformed:
      return "You are a theologian from the Reformed tradition. Engage with the user's points by focusing on the sovereignty of God, scriptural authority (Sola Scriptura), and covenant theology. Reference key figures like Calvin and documents like the Westminster Confession.";
    case TheologicalPerspective.Catholic:
      return "You are a theologian from the Roman Catholic tradition. Engage with the user's points by integrating Scripture, Sacred Tradition, and the Magisterium. Use scholastic reasoning and cite sources like Aquinas, Augustine, and papal encyclicals.";
    case TheologicalPerspective.Socratic:
    default:
      return "You are a Socratic guide. Your goal is to deepen the user's theological thinking by asking probing questions. Do not provide direct answers. Instead, challenge assumptions, ask for clarifications, and explore the logical consequences of their statements to help them discover their own conclusions.";
  }
};

export const getRefinedText = async (text: string, context: string): Promise<string> => {
  const prompt = `
    As a theological editor, refine the following text. Improve its clarity, academic rigor, and eloquence while preserving the core meaning. The user is currently in the "${context}" phase of their theological journey.

    Original Text:
    ---
    ${text}
    ---

    Refined Text:
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text;
};

export const getCitations = async (text: string): Promise<string> => {
    const prompt = `
    Based on the following theological text, provide a list of relevant citations. Include:
    1.  Key Scripture passages (book, chapter, verse).
    2.  Relevant writings from Church Fathers (e.g., Augustine, Athanasius).
    3.  Major theological works or thinkers that address these themes.

    Format the output clearly.

    Text:
    ---
    ${text}
    ---

    Citations:
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
};


export const getSocraticResponse = async (history: ChatMessage[], perspective: TheologicalPerspective, userMessage: string): Promise<string> => {
    const systemInstruction = getPerspectiveSystemInstruction(perspective);
    const contents = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    }));
    contents.push({ role: 'user', parts: [{ text: userMessage }] });

    // FIX: Pass the constructed conversation history to `contents` and the system instruction to `config`.
    // The original code passed a single, poorly formatted string instead of a proper chat history.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
            systemInstruction: systemInstruction,
        },
    });
    return response.text;
};

export const classifyEntry = async (entryText: string, dialogueContext: ChatMessage[]): Promise<ClassificationResult> => {
    const dialogueSummary = dialogueContext.length > 0 
        ? dialogueContext.map(msg => `${msg.role}: ${msg.content}`).join('\n')
        : 'No dialogue context yet.';
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
            As an AI assistant for a theologian, analyze the following text entry in the context of their recent dialogue. 
            Classify the entry's importance into one of three categories: "Crucial", "Reference", or "Minor".
            - "Crucial": A core argument, a breakthrough insight, or a significant point of struggle that is central to the thesis.
            - "Reference": Supporting material, a citation, a historical note, or a tangential thought that provides context but isn't a core argument.
            - "Minor": A fleeting thought, a minor note, or a point that has been superseded or is not well-developed.

            Provide your classification and a brief justification in a JSON object.

            Dialogue Context:
            ---
            ${dialogueSummary}
            ---

            Text Entry to Classify:
            ---
            ${entryText}
            ---
        `,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    classification: { 
                        type: Type.STRING,
                        enum: Object.values(EntryClassification)
                    },
                    justification: { 
                        type: Type.STRING,
                        description: 'A brief explanation for the classification.'
                    }
                }
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText) as ClassificationResult;
        if (data && data.classification && data.justification) {
            return data;
        }
        throw new Error("Invalid classification format received from API.");
    } catch (error) {
        console.error("Error parsing classification response:", error);
        throw new Error("Failed to classify entry due to a response parsing error.");
    }
};

export const generateMindMapData = async (text: string): Promise<MindMapData> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following theological text and generate a JSON object representing a mind map of the key concepts. The JSON should have two keys: "nodes" and "links".
            - "nodes" should be an array of objects, each with "id" (a string), "label" (a string for the concept name), and "group" (a number representing the concept cluster).
            - "links" should be an array of objects, each with "source" (an id from nodes), "target" (an id from nodes), and "value" (a number from 1-10 for link strength).
            - Identify a central theme as group 1. Branch out to related theological concepts, scriptural references, and historical figures.
            
            Text to analyze:
            ---
            ${text}
            ---
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        nodes: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    label: { type: Type.STRING },
                                    group: { type: Type.INTEGER }
                                }
                            }
                        },
                        links: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    source: { type: Type.STRING },
                                    target: { type: Type.STRING },
                                    value: { type: Type.INTEGER }
                                }
                            }
                        }
                    }
                }
            }
        });
        
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        
        // Basic validation
        if (data && Array.isArray(data.nodes) && Array.isArray(data.links)) {
            return data;
        } else {
             console.error("Parsed JSON does not match expected MindMapData structure:", data);
             return { nodes: [], links: [] };
        }
    } catch (error) {
        console.error("Error generating or parsing mind map data:", error);
        return { nodes: [], links: [] };
    }
};