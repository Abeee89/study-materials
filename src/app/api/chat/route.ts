import { NextResponse } from "next/server";
import { openRouterChatCompletion, type OpenRouterChatMessage } from "@/lib/openrouter";

type ChatMessage = {
  role: "user" | "ai";
  content: string;
};

type ChatRequestBody = {
  messages: ChatMessage[];
  context?: string;
};

export async function POST(req: Request) {
  try {
    const rawBody: unknown = await req.json();
    if (!rawBody || typeof rawBody !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { messages, context } = rawBody as Partial<ChatRequestBody>;
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 });
    }

    const systemInstruction = `You are a helpful, expert AI tutor for a vocational high school platform teaching "Basic Electricity".
Current Page Context: ${context || "None provided."}

Rules:
- Stay strictly within Basic Electricity topics covered on this site: Ohm's Law, basic units, series & parallel circuits, power & energy, circuit safety (MCB/RCD/earthing), and basic passive/active components (resistor/diode/transistor basics).
- You may also guide the student on how to use this site (Materials, Simulation Hub, Circuit Sandbox, Assessment, Outcomes).
- If the student asks about unrelated topics, briefly refuse and redirect to an allowed Basic Electricity topic.
- Address the student as "student".
- Keep answers concise, educational, and actionable.`;

    const sanitized = messages.flatMap((m): ChatMessage[] => {
      if (!m || typeof m !== "object") return [];
      const { role, content } = m as Partial<ChatMessage>;
      if ((role !== "user" && role !== "ai") || typeof content !== "string") return [];
      const trimmed = content.trim();
      if (!trimmed) return [];
      return [{ role, content: trimmed }];
    });

    if (sanitized.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const openRouterMessages: OpenRouterChatMessage[] = [
      { role: "system", content: systemInstruction },
      ...sanitized.slice(-20).map<OpenRouterChatMessage>((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.content,
      })),
    ];

    const reply = await openRouterChatCompletion({
      messages: openRouterMessages,
      temperature: 0.2,
      maxTokens: 450,
    });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Failed to generate reply" }, { status: 500 });
  }
}
