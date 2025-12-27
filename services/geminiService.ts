
import { GoogleGenAI, Type } from "@google/genai";
import { Task, Category, Priority } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSmartTaskSuggestions = async (existingTasks: Task[]) => {
  const prompt = `Based on these existing tasks for a business professional:
  ${JSON.stringify(existingTasks.map(t => ({ title: t.title, category: t.category, due: t.dueDate })))}
  
  Suggest 3 highly relevant and proactive next tasks or reminders. 
  Focus on business compliance (taxes, BIR), recurring bills (utilities), or common business management tasks.
  Provide title, category, priority, and reason for suggestion.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              priority: { type: Type.STRING },
              reason: { type: Type.STRING },
            },
            required: ["title", "category", "priority", "reason"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error getting AI suggestions:", error);
    return [];
  }
};
