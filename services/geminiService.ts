import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCulturalQuote = async (themeId: string): Promise<{ text: string; author: string }> => {
  const modelId = 'gemini-3-flash-preview';
  
  let prompt = "";
  switch (themeId) {
    case 'japan':
      prompt = "Give me a short, profound Japanese Haiku or quote about time, nature, or patience. Return JSON with 'text' (English translation) and 'author' (or 'Traditional').";
      break;
    case 'india':
      prompt = "Give me a short, inspiring quote from Indian philosophy (Vedas, Upanishads, or modern thinkers) about time or mindfulness. Return JSON with 'text' and 'author'.";
      break;
    case 'china':
      prompt = "Give me a short Chinese proverb about time, diligence, or harmony. Return JSON with 'text' (English translation) and 'author' (or 'Proverb').";
      break;
    case 'apple':
      prompt = "Give me a short, innovative quote about design, simplicity, or the future (Steve Jobs style). Return JSON with 'text' and 'author'.";
      break;
    case 'microsoft':
      prompt = "Give me a short, pragmatic quote about productivity, technology, or empowerment. Return JSON with 'text' and 'author'.";
      break;
    default:
      prompt = "Give me a short, inspiring quote about time management. Return JSON with 'text' and 'author'.";
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            author: { type: Type.STRING },
          },
        },
      },
    });

    const json = JSON.parse(response.text || '{}');
    return {
      text: json.text || "Time is gold.",
      author: json.author || "Unknown"
    };
  } catch (error) {
    console.error("Failed to fetch quote", error);
    return {
      text: "Enjoy every moment.",
      author: "ChronoVerse"
    };
  }
};
