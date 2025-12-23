import { FatigueMetrics, FocusIntensity } from "../types";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const getGeminiInsight = async (
  metrics: FatigueMetrics[],
  currentFocusDuration: number,
  completedTasks: number
): Promise<string> => {
  if (!GEMINI_API_KEY) return "Neural focus optimal. Proceed.";

  try {
    const avgFatigue = metrics.length > 0
      ? metrics.reduce((acc, m) => acc + m.fatigueScore, 0) / metrics.length
      : 0;

    const prompt = `
      System Instruction: You are Ytterbium, an intelligent productivity and well-being assistant. 
      Tone: Professional, calm, minimalist. Maximum 40 words.
      
      Session Data:
      - Focus Duration: ${Math.round(currentFocusDuration / 60)}m
      - Fatigue Score: ${Math.round(avgFatigue)}
      - Completed Tasks: ${completedTasks}
      
      Suggest one specific improvement for the user's focus or health based on this data.
    `;

    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) return "Stay focused, you're doing well.";

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim() || "Stay focused, you're doing well.";

  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Neural focus optimal. Proceed.";
  }
};

export const generateRelaxationGuide = async (fatigueLevel: number): Promise<string> => {
  if (!GEMINI_API_KEY) return "Inhale deeply, exhale slowly.";

  try {
    const prompt = `Generate a 2-sentence calming relaxation guide for fatigue level ${fatigueLevel}/100. Be minimalist.`;

    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) return "Take a deep breath.";

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim() || "Take a deep breath.";

  } catch (e) {
    return "Inhale deeply, exhale slowly.";
  }
};

export const analyzeTaskGemini = async (taskDescription: string) => {
  if (!GEMINI_API_KEY) throw new Error("Gemini API Key missing");

  try {
    const prompt = `
            Analyze this task: "${taskDescription}"
            
            Identify the most appropriate focus mode:
            1. "Creative Focus" (Intensity 3): For ideation, writing, or design.
            2. "Balanced Focus" (Intensity 6): For regular work, admin, or coding.
            3. "Deep Laser Focus" (Intensity 10): For intense problem solving or deep learning.
            
            Return a JSON object exactly like this (no markdown, just raw JSON):
            {
                "taskType": "Short category name",
                "focusMode": "Creative Focus" | "Balanced Focus" | "Deep Laser Focus",
                "explanation": "One short sentence explaining why",
                "suggestedIntensity": 3 | 6 | 10,
                "thinking_trace": "Brief internal neural analysis"
            }
        `;

    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        }
      })
    });

    if (!response.ok) throw new Error("Gemini API call failed");

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(text);

    return {
      taskType: parsed.taskType || "Task",
      focusMode: parsed.focusMode || "Balanced Focus",
      explanation: parsed.explanation || "Cognitive calibration complete.",
      suggestedIntensity: (parsed.suggestedIntensity || 6) as FocusIntensity,
      rawReasoning: parsed.thinking_trace,
      source: 'Cloud (Gemini)' as const
    };
  } catch (error) {
    console.error("Gemini Task Analysis Error:", error);
    throw error;
  }
};