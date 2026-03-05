import { GoogleGenAI, Type } from "@google/genai";
import { GAMES_DATABASE } from "../constants";
import { RecommendationResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getGameRecommendation(userRequest: string): Promise<RecommendationResponse> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    Вы — эксперт по трансформационным играм. Ваша задача — проанализировать запрос пользователя и подобрать наиболее подходящие игры из предложенного списка или предложить другие известные игры, если список не подходит.
    
    Список доступных игр для справки:
    ${JSON.stringify(GAMES_DATABASE, null, 2)}
    
    Отвечайте в формате JSON.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: `Запрос пользователя: ${userRequest}` }] }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendedGames: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                gameId: { type: Type.STRING, description: "ID игры из списка, если есть" },
                title: { type: Type.STRING, description: "Название игры" },
                reasoning: { type: Type.STRING, description: "Почему эта игра подходит под запрос" },
                matchScore: { type: Type.NUMBER, description: "Процент соответствия от 0 до 100" }
              },
              required: ["title", "reasoning", "matchScore"]
            }
          },
          advice: { type: Type.STRING, description: "Общий совет по проведению или участию" }
        },
        required: ["recommendedGames", "advice"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as RecommendationResponse;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return {
      recommendedGames: [],
      advice: "Извините, произошла ошибка при обработке запроса."
    };
  }
}
