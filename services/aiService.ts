import { FocusIntensity } from '../types';

export interface TaskAnalysisResult {
    taskType: string;
    focusMode: 'Creative Focus' | 'Balanced Focus' | 'Deep Laser Focus';
    explanation: string;
    suggestedIntensity: FocusIntensity;
    suggestedSessions: number;
    rawReasoning?: string;
    latency?: number;
    source: 'Groq Cloud' | 'Recovery';
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const PROXY_ENDPOINT = "/api/analyze";
const GROQ_MODEL = "openai/gpt-oss-20b";

const PROJECT_CONTEXT = "Ytterbium is a productivity tool where Focus Intensity ranges from 1 (Calm) to 10 (Peak). Focus Modes are 'Creative Focus', 'Balanced Focus', and 'Deep Laser Focus'.";

export const aiService = {
    analyzeTask: async (taskDescription: string): Promise<TaskAnalysisResult> => {
        const prompt = `${PROJECT_CONTEXT}\n\nTask: "${taskDescription}". Identify the best focus mode, intensity (3, 6, 10), and number of sessions (1-8). Return ONLY a raw JSON object: {"thinking_trace":"...","taskType":"...","focusMode":"...","explanation":"...","suggestedIntensity":3|6|10,"suggestedSessions":1-8}`;

        const isProd = import.meta.env.PROD;

        try {
            const startTime = performance.now();
            let response;

            if (isProd) {
                response = await fetch(PROXY_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ taskDescription })
                });
            } else {
                if (!GROQ_API_KEY) throw new Error("Groq API Key missing");
                response = await fetch(GROQ_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${GROQ_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: GROQ_MODEL,
                        messages: [
                            { role: "system", content: "You are a task analysis engine. Return raw JSON only." },
                            { role: "user", content: prompt }
                        ],
                        response_format: { type: "json_object" },
                        temperature: 0.1
                    })
                });
            }

            if (!response.ok) throw new Error(`Groq Error: ${response.status}`);

            const data = await response.json();
            const content = data.choices[0].message.content;
            const result = JSON.parse(content);
            const endTime = performance.now();

            return {
                taskType: result.taskType || "Task",
                focusMode: result.focusMode || "Balanced Focus",
                explanation: result.explanation || "Cognitive calibration complete.",
                suggestedIntensity: (result.suggestedIntensity === 3 ? 3 : result.suggestedIntensity >= 9 ? 10 : 6) as FocusIntensity,
                suggestedSessions: result.suggestedSessions || 2,
                rawReasoning: result.thinking_trace,
                latency: Math.round(endTime - startTime),
                source: 'Groq Cloud'
            };

        } catch (error: any) {
            console.error('[AI SERVICE] Groq analysis failed:', error);
            // Recovery Protocol
            return {
                taskType: "Task",
                focusMode: "Balanced Focus",
                explanation: "Standardizing focus parameters.",
                suggestedIntensity: 6,
                suggestedSessions: 2,
                source: 'Recovery'
            };
        }
    }
};
