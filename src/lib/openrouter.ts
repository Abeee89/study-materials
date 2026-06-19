import "server-only";

export type OpenRouterChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type OpenRouterChatOptions = {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
};

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
export const OPENROUTER_MODEL = "openai/gpt-oss-120b:free";

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function getOpenRouterApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new Error("OPENROUTER_API_KEY not configured");
  }
  return key;
}

function getReferer(): string {
  return (
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.URL ||
    "http://localhost:3000"
  );
}

export async function openRouterChatCompletion(
  params: {
    messages: OpenRouterChatMessage[];
  } & OpenRouterChatOptions
): Promise<string> {
  const { messages, temperature = 0.3, maxTokens = 512, topP } = params;

  const res = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getOpenRouterApiKey()}`,
      "Content-Type": "application/json",
      "HTTP-Referer": getReferer(),
      "X-Title": "Basic Electricity EdTech",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      temperature,
      top_p: topP,
      max_tokens: maxTokens,
    }),
  });

  const rawText = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(rawText);
  } catch {
    if (!res.ok) {
      throw new Error(`OpenRouter error (${res.status}): ${rawText}`);
    }
    throw new Error("OpenRouter returned invalid JSON");
  }

  const obj = isRecord(json) ? json : null;

  if (!res.ok) {
    const errorValue = obj?.error;
    const messageValue = obj?.message;
    const message =
      (isRecord(errorValue) && typeof errorValue.message === "string" && errorValue.message) ||
      (typeof messageValue === "string" && messageValue) ||
      (typeof errorValue === "string" && errorValue) ||
      `Request failed with status ${res.status}`;
    throw new Error(`OpenRouter error (${res.status}): ${message}`);
  }

  const choices = obj?.choices;
  const firstChoice = Array.isArray(choices) ? choices[0] : null;
  const message = isRecord(firstChoice) ? firstChoice.message : null;
  const content = isRecord(message) ? message.content : null;

  if (typeof content !== "string") {
    throw new Error("OpenRouter returned no message content");
  }

  return content;
}
