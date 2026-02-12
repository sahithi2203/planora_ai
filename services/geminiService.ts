import { GoogleGenAI, Type } from "@google/genai";
import { Itinerary } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateItinerary = async (prompt: string): Promise<Itinerary> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are Planora, an expert travel and lifestyle planner. Create detailed, structured itineraries.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A catchy title for the trip/plan" },
            summary: { type: Type.STRING, description: "A brief summary of the vibe and goals" },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING, description: "Day 1, or Date" },
                  theme: { type: Type.STRING, description: "Theme for the day" },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING },
                        activity: { type: Type.STRING },
                        location: { type: Type.STRING },
                        description: { type: Type.STRING },
                        category: { type: Type.STRING, enum: ['food', 'sightseeing', 'travel', 'leisure', 'other'] }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response generated");
    return JSON.parse(text) as Itinerary;
  } catch (error) {
    console.error("Plan generation failed:", error);
    throw error;
  }
};

export const findPlaces = async (prompt: string, userLocation?: { lat: number; lng: number }) => {
  try {
    const toolConfig = userLocation ? {
      retrievalConfig: {
        latLng: {
          latitude: userLocation.lat,
          longitude: userLocation.lng
        }
      }
    } : undefined;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: toolConfig
      }
    });

    return {
      text: response.text || "Here are some places I found.",
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Map search failed:", error);
    throw error;
  }
};

export const researchTopic = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    return {
      text: response.text || "I found this information for you.",
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Research failed:", error);
    throw error;
  }
};
