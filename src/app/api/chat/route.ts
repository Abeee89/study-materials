export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    const provider = process.env.AI_PROVIDER || "openrouter";
    let url = "https://openrouter.ai/api/v1/chat/completions";
    let apiKey = process.env.OPENROUTER_API_KEY || "";
    let modelName = process.env.OPENROUTER_MODEL || "openrouter/free";

    if (provider === "vercel-ai") {
      url = process.env.VERCEL_AI_GATEWAY_URL || "https://api.openai.com/v1/chat/completions";
      apiKey = process.env.OPENAI_API_KEY || "";
      modelName = process.env.VERCEL_AI_MODEL || "gpt-4o-mini";
    }

    const { chapterTitle, subChapterTitle, subChapterObjective, simulationState } = context || {};

    let contextPrompt = "You are a helpful AI Assistant for the Antigravity learning platform, guiding vocational high school students in Basic Electricity.";
    if (chapterTitle || subChapterTitle) {
      contextPrompt += `\nThe student is currently studying Chapter: "${chapterTitle || "Unknown"}", SubChapter: "${subChapterTitle || "Unknown"}".`;
      if (subChapterObjective) {
        contextPrompt += `\nLearning Objective: "${subChapterObjective}".`;
      }
    }
    if (simulationState) {
      contextPrompt += `\nInteractive Simulation state: ${JSON.stringify(simulationState)}. Use this state to help explain concepts or guide the student's experimentation.`;
    }
    contextPrompt += `\n\nBe educational, clear, concise, and encourage hands-on practice. Stick to electrical engineering and basic physics. Do not give direct answers immediately; guide them to think.`;

    const apiResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: contextPrompt },
          ...messages.map((m: any) => ({ role: m.role, content: m.content })),
        ],
        stream: true,
        max_tokens: 1000,
      }),
    });

    if (!apiResponse.ok) {
      const errBody = await apiResponse.text();
      console.error(`Provider error (${apiResponse.status}):`, errBody);
      throw new Error(`AI Provider returned error status ${apiResponse.status}`);
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        if (!apiResponse.body) {
          controller.close();
          return;
        }
        const reader = apiResponse.body.getReader();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const cleaned = line.trim();
              if (!cleaned || cleaned === "data: [DONE]") continue;

              if (cleaned.startsWith("data: ")) {
                try {
                  const data = JSON.parse(cleaned.slice(6));
                  const text = data.choices?.[0]?.delta?.content;
                  if (text) {
                    controller.enqueue(encoder.encode(text));
                  }
                } catch (e) {
                  // Partial or malformed SSE line, ignore and continue
                }
              }
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
