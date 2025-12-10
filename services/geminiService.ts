import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { FatigueMetrics } from "../types";

const SYSTEM_INSTRUCTION = `
You are Ytterbium, an intelligent productivity and well-being assistant.
Your goal is to analyze user biometrics (simulated via keyboard/mouse dynamics) and productivity data.
Provide concise, actionable advice.
Tone: Professional, calm, minimalist, encouraging. Like a high-end productivity coach.
Keep responses under 50 words.
`;

export const getGeminiInsight = async (
  metrics: FatigueMetrics[], 
  currentFocusDuration: number,
  completedTasks: number
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API Key not found");
      return "Configure API Key for AI insights.";
    }

    const ai = new GoogleGenAI({ apiKey });

    // Calculate recent trends
    const avgFatigue = metrics.length > 0 
      ? metrics.reduce((acc, m) => acc + m.fatigueScore, 0) / metrics.length 
      : 0;
    
    const peakFatigue = metrics.length > 0 
      ? Math.max(...metrics.map(m => m.fatigueScore)) 
      : 0;

    const prompt = `
      User Session Data:
      - Current Focus Duration: ${Math.round(currentFocusDuration / 60)} minutes
      - Average Fatigue Score (0-100): ${Math.round(avgFatigue)}
      - Peak Fatigue Score: ${Math.round(peakFatigue)}
      - Completed Tasks: ${completedTasks}
      
      Based on this, provide a specific insight or suggestion.
      If fatigue is high (>60), suggest a specific type of micro-break.
      If fatigue is low and focus is long, suggest a way to maintain flow.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "Keep up the good work.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate insight at this moment.";
  }
};


export const generateRelaxationGuide = async (fatigueLevel: number): Promise<string> => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) return "Breathe in deeply for 4 seconds, hold for 4, exhale for 4.";

        const ai = new GoogleGenAI({ apiKey });
        
        const prompt = `Generate a short (3 sentences max) guided relaxation script for a user with fatigue level ${fatigueLevel}/100.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are a calming meditation guide."
            }
        });

        return response.text || "Take a deep breath and relax your shoulders.";
    } catch (e) {
        return "Take a deep breath and relax your shoulders.";
    }
}