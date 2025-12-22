import { FatigueMetrics } from "../types";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-20b"; // User preferred model

const SYSTEM_INSTRUCTION = `
You are Ytterbium, an intelligent productivity and well-being assistant.
Provide concise, actionable advice based on biometrics.
Tone: Professional, calm, minimalist. Keep responses under 40 words.
`;

export const getGeminiInsight = async (
  metrics: FatigueMetrics[],
  currentFocusDuration: number,
  completedTasks: number
): Promise<string> => {
  try {
    const avgFatigue = metrics.length > 0
      ? metrics.reduce((acc, m) => acc + m.fatigueScore, 0) / metrics.length
      : 0;

    const prompt = `
      Session Data:
      - Focus Duration: ${Math.round(currentFocusDuration / 60)}m
      - Fatigue Score: ${Math.round(avgFatigue)}
      - Completed Tasks: ${completedTasks}
      
      Suggest one specific improvement.
    `;

    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 100
      })
    });

    if (!response.ok) return "Stability confirmed. Maintain protocol.";

    const data = await response.json();
    return data.choices[0].message.content.trim() || "Stay focused, you're doing well.";

  } catch (error) {
    console.error("Groq Insight Error:", error);
    return "Neural focus optimal. Proceed.";
  }
};

export const generateRelaxationGuide = async (fatigueLevel: number): Promise<string> => {
  try {
    const prompt = `Generate a 2-sentence calming relaxation guide for fatigue level ${fatigueLevel}/100.`;

    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: "You are a minimalist meditation guide." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 80
      })
    });

    if (!response.ok) return "Take a deep breath and relax your shoulders.";

    const data = await response.json();
    return data.choices[0].message.content.trim() || "Take a deep breath.";

  } catch (e) {
    return "Inhale deeply, exhale slowly.";
  }
}