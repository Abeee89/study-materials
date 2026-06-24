import "server-only";

import { aiChatCompletion, type AIChatMessage } from "@/lib/ai";

export type LearningOutcomesEvaluation = {
  strengths: string[];
  needsImprovement: string[];
  summary: string;
  recommendedNextAction: string;
  recommendedSubChapters: string[];
};

function extractFirstJsonObject(text: string): string | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = (fenced?.[1] ?? text).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return candidate.slice(start, end + 1);
}

function toStringArray(value: unknown, max = 6): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max);
}

function normalizeEvaluation(value: unknown): LearningOutcomesEvaluation | null {
  if (!value || typeof value !== "object") return null;
  const obj = value as Record<string, unknown>;

  const strengths = toStringArray(obj.strengths);
  const needsImprovement = toStringArray(obj.needsImprovement);
  const summary = typeof obj.summary === "string" ? obj.summary.trim() : "";
  const recommendedNextAction =
    typeof obj.recommendedNextAction === "string" ? obj.recommendedNextAction.trim() : "";
  const recommendedSubChapters = toStringArray(obj.recommendedSubChapters);

  if (!summary && strengths.length === 0 && needsImprovement.length === 0 && !recommendedNextAction) {
    return null;
  }

  return {
    strengths,
    needsImprovement,
    summary,
    recommendedNextAction,
    recommendedSubChapters,
  };
}

export async function generateLearningOutcomesFeedback(params: {
  attemptData: unknown;
  quizContext?: unknown;
  allSubChapters?: Array<{ id: string; title: string; objective: string }>;
}): Promise<{ feedback: string; parsed: LearningOutcomesEvaluation | null; raw: string }> {
  const systemInstruction = `You are an expert AI evaluator for a vocational high school platform teaching "Basic Electricity".

Your task: generate a concise learning-outcomes review based ONLY on the provided attempt data and suggest 1-2 lessons from the available lesson list that the student should study next.

Strict rules:
+- Stay within Basic Electricity topics (Ohm's Law, series/parallel, power/energy, safety, components).
+- Do NOT invent question numbers, scores, or facts not present.
+- Output MUST be a single valid JSON object and NOTHING else (no markdown, no code fences).
+- JSON schema:
+  {
+    "strengths": string[],
+    "needsImprovement": string[],
+    "summary": string,
+    "recommendedNextAction": string,
+    "recommendedSubChapters": string[]
+  }
+- In "recommendedSubChapters", only return an array of 1 to 2 exact subchapter IDs from the "Available Lessons to Recommend" list matching the areas of difficulty.
+- Write in English. No greetings or pleasantries.

Allowed site feature references for recommendedNextAction:
+- Ohm's Law Visualizer
+- Circuit Safety Simulator
+- Passive Components / resistor color codes
+- Circuit Sandbox (series/parallel practice)
`;

  const userContent = `Available Lessons to Recommend (JSON): ${JSON.stringify(params.allSubChapters ?? [])}\n\nQuiz Context (JSON): ${JSON.stringify(params.quizContext ?? null)}\n\nStudent Attempt Data (JSON): ${JSON.stringify(params.attemptData)}`;

  const messages: AIChatMessage[] = [
    { role: "system", content: systemInstruction },
    { role: "user", content: userContent },
  ];

  const raw = (await aiChatCompletion({
    messages,
    temperature: 0.2,
    maxTokens: 700,
  })).trim();

  const jsonText = extractFirstJsonObject(raw) ?? raw;
  try {
    const parsedJson = JSON.parse(jsonText);
    const normalized = normalizeEvaluation(parsedJson);
    if (normalized) {
      return { feedback: JSON.stringify(normalized), parsed: normalized, raw };
    }
    return { feedback: raw, parsed: null, raw };
  } catch {
    return { feedback: raw, parsed: null, raw };
  }
}
