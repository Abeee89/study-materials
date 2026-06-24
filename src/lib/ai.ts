import "server-only";
import { openRouterChatCompletion } from "./openrouter";

export type AIChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AIChatOptions = {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
};

async function openAIChatCompletion(params: {
  messages: AIChatMessage[];
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY || "";
  const baseURL = process.env.VERCEL_AI_GATEWAY_URL || "https://api.openai.com/v1";
  const modelName = process.env.VERCEL_AI_MODEL || "gpt-4o-mini";

  const res = await fetch(`${baseURL.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelName,
      messages: params.messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: params.temperature ?? 0.3,
      max_tokens: params.maxTokens ?? 512,
      top_p: params.topP,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenAI error (${res.status}): ${errorText}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("OpenAI returned no content");
  }
  return content;
}

export async function aiChatCompletion(params: {
  messages: AIChatMessage[];
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}): Promise<string> {
  const provider = process.env.AI_PROVIDER || "openrouter";

  if (provider === "vercel-ai") {
    try {
      return await openAIChatCompletion(params);
    } catch (error) {
      console.error("OpenAI direct completion failed, falling back to OpenRouter:", error);
      // Fallback to OpenRouter
      return openRouterChatCompletion({
        messages: params.messages,
        temperature: params.temperature,
        maxTokens: params.maxTokens,
        topP: params.topP,
      });
    }
  }

  // Default: OpenRouter
  return openRouterChatCompletion({
    messages: params.messages,
    temperature: params.temperature,
    maxTokens: params.maxTokens,
    topP: params.topP,
  });
}
