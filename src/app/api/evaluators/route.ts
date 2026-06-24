import { NextResponse } from "next/server";
import { generateLearningOutcomesFeedback } from "@/lib/outcomes/evaluator";

type EvaluatorRequestBody = {
  attemptData: unknown;
  quizContext?: unknown;
};

export async function POST(req: Request) {
  try {
    const rawBody: unknown = await req.json();
    if (!rawBody || typeof rawBody !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { attemptData, quizContext } = rawBody as Partial<EvaluatorRequestBody>;
    if (!attemptData) {
      return NextResponse.json({ error: "attemptData is required" }, { status: 400 });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 });
    }

    const allSubChapters = await prisma.subChapter.findMany({
      select: {
        id: true,
        title: true,
        objective: true,
      },
    });

    const { feedback } = await generateLearningOutcomesFeedback({
      attemptData,
      quizContext,
      allSubChapters,
    });
    return NextResponse.json({ analysis: feedback });
  } catch (error) {
    console.error("Evaluator API Error:", error);
    return NextResponse.json({ error: "Failed to evaluate performance" }, { status: 500 });
  }
}
