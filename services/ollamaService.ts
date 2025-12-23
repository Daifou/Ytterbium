import { FocusIntensity } from '../types';
import { analyzeTaskGemini } from './geminiService';

interface TaskAnalysisResult {
    taskType: string;
    focusMode: 'Creative Focus' | 'Balanced Focus' | 'Deep Laser Focus';
    explanation: string;
    suggestedIntensity: FocusIntensity;
    rawReasoning?: string;
    latency?: number;
    source?: 'Cloud (Groq)' | 'Cloud (Gemini)' | 'Local' | 'Recovery';
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const PROXY_ENDPOINT = "/api/analyze";
const GROQ_MODEL = "openai/gpt-oss-20b";
const OLLAMA_ENDPOINT = '/api/ollama/api/generate';
const OLLAMA_MODEL = 'gemma3:4b';

export const ollamaService = {
    analyzeTask: async (taskDescription: string): Promise<TaskAnalysisResult> => {
        const prompt = `Task: "${taskDescription}". Identify focus mode: Creative(3), Balanced(6), or Deep(10). Return JSON: {"thinking_trace":"Analysis...","taskType":"Type","focusMode":"Creative Focus"|"Balanced Focus"|"Deep Laser Focus","explanation":"Why? (1 sentence)","suggestedIntensity":3|6|10}`;

        const isProd = import.meta.env.PROD;

        // 1. Try Groq (Via Proxy in Production, Direct in Development)
        try {
            const startTime = performance.now();
            let response;

            if (isProd) {
                console.log(`[AI SERVICE] Connecting to Groq via Proxy...`);
                response = await fetch(PROXY_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ taskDescription })
                });
            } else {
                if (!GROQ_API_KEY) throw new Error("Local Groq API Key missing");
                console.log(`[AI SERVICE] Connecting to Groq Direct...`);
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

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Groq Service Error: ${errorText.substring(0, 100)}`);
            }

            const data = await response.json();
            // If via proxy, the structure might be different depending on how Vercel returns it
            // Our proxy returns the raw Groq response
            const result = JSON.parse(data.choices[0].message.content);
            const endTime = performance.now();

            return {
                taskType: result.taskType || "Task",
                focusMode: result.focusMode || "Balanced Focus",
                explanation: result.explanation || "Cognitive calibration complete.",
                suggestedIntensity: (result.suggestedIntensity === 3 ? 3 : result.suggestedIntensity >= 9 ? 10 : 6) as FocusIntensity,
                rawReasoning: result.thinking_trace || "Neural trace synthesized.",
                latency: Math.round(endTime - startTime),
                source: 'Cloud (Groq)'
            };

        } catch (cloudError: any) {
            console.warn(`[AI SERVICE] Groq failed, switching to Gemini Fallback...`, cloudError.message);

            // 2. Try Gemini (Cloud secondary)
            try {
                const geminiStart = performance.now();
                const geminiResult = await analyzeTaskGemini(taskDescription);
                const geminiEnd = performance.now();

                return {
                    ...geminiResult,
                    latency: Math.round(geminiEnd - geminiStart),
                    source: 'Cloud (Gemini)'
                };
            } catch (geminiError: any) {
                console.error(`[AI SERVICE] Gemini fallback failed, trying Local...`, geminiError.message);

                // 3. Try Ollama (Local tertiary)
                try {
                    const localStart = performance.now();
                    const ollamaResponse = await fetch(OLLAMA_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            model: OLLAMA_MODEL,
                            prompt: prompt,
                            stream: false,
                            format: 'json'
                        }),
                    });

                    if (!ollamaResponse.ok) throw new Error("Local Engine unavailable.");

                    const data = await ollamaResponse.json();
                    const result = JSON.parse(data.response);
                    const localEnd = performance.now();

                    return {
                        taskType: result.taskType || "Task",
                        focusMode: result.focusMode || "Balanced Focus",
                        explanation: result.explanation || "Local analysis complete.",
                        suggestedIntensity: (result.suggestedIntensity >= 9 ? 10 : result.suggestedIntensity) as FocusIntensity,
                        rawReasoning: `[LOCAL] ${result.thinking_trace}`,
                        latency: Math.round(localEnd - localStart),
                        source: 'Local'
                    };
                } catch (localError: any) {
                    // 4. Recovery Protocol (No AI engines available)
                    return {
                        taskType: "Neural Recovery",
                        focusMode: "Balanced Focus",
                        explanation: "Stabilizing cognitive resonance manually.",
                        suggestedIntensity: 6,
                        rawReasoning: `Recovery Protocol: All engines unavailable. Details: ${localError.message}`,
                        source: 'Recovery'
                    };
                }
            }
        }
    }
};
