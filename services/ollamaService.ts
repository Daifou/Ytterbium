import { FocusIntensity } from '../types';

interface TaskAnalysisResult {
    taskType: string;
    focusMode: 'Creative Focus' | 'Balanced Focus' | 'Deep Laser Focus';
    explanation: string;
    suggestedIntensity: FocusIntensity;
    rawReasoning?: string;
    latency?: number;
    source?: 'Cloud' | 'Local' | 'Recovery';
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-20b"; // User preferred model
const OLLAMA_ENDPOINT = '/api/ollama/api/generate';
const OLLAMA_MODEL = 'gemma3:4b';

export const ollamaService = {
    analyzeTask: async (taskDescription: string): Promise<TaskAnalysisResult> => {
        const prompt = `Task: "${taskDescription}". Identify focus mode: Creative(3), Balanced(6), or Deep(10). Return JSON: {"thinking_trace":"Analysis...","taskType":"Type","focusMode":"Creative Focus"|"Balanced Focus"|"Deep Laser Focus","explanation":"Why? (1 sentence)","suggestedIntensity":3|6|10}`;

        try {
            console.log(`[AI SERVICE] Connecting to Groq Cloud (${GROQ_MODEL})...`);
            const startTime = performance.now();

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(GROQ_ENDPOINT, {
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
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const endTime = performance.now();

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Groq Error ${response.status}: ${errorText.substring(0, 100)}`);
            }

            const data = await response.json();
            const result = JSON.parse(data.choices[0].message.content);

            return {
                taskType: result.taskType || "Task",
                focusMode: result.focusMode || "Balanced Focus",
                explanation: result.explanation || "Groq-sync complete.",
                suggestedIntensity: (result.suggestedIntensity === 3 ? 3 : result.suggestedIntensity >= 9 ? 10 : 6) as FocusIntensity,
                rawReasoning: result.thinking_trace || "Neural trace synthesized.",
                latency: Math.round(endTime - startTime),
                source: 'Cloud'
            };

        } catch (cloudError: any) {
            console.error(`[AI GROQ ERROR]`, cloudError);
            console.warn(`[AI SERVICE] Groq failed, switching to Local Fallback...`, cloudError.message);

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
                    taskType: result.taskType,
                    focusMode: result.focusMode,
                    explanation: result.explanation,
                    suggestedIntensity: (result.suggestedIntensity >= 9 ? 10 : result.suggestedIntensity) as FocusIntensity,
                    rawReasoning: `[BACKUP] ${result.thinking_trace}`,
                    latency: Math.round(localEnd - localStart),
                    source: 'Local'
                };
            } catch (localError: any) {
                return {
                    taskType: "Neural Recovery",
                    focusMode: "Balanced Focus",
                    explanation: "Stabilizing cognitive resonance manually.",
                    suggestedIntensity: 6,
                    rawReasoning: `Recovery Protocol: Both engines unavailable. Details: ${localError.message}`,
                    source: 'Recovery'
                };
            }
        }
    }
};
