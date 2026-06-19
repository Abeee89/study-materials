import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-expect-error session.user.id is injected
    const userId = session.user.id as string;

    const latestAttempt = await prisma.assessmentAttempt.findFirst({
      where: { userId },
      orderBy: { completedAt: "desc" },
      include: {
        aiAnalysis: true,
        assessment: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!latestAttempt) {
      return NextResponse.json({ attempt: null, analysis: null }, { status: 200 });
    }

    const total = latestAttempt.assessment.questions.length || 1;
    const percent = Math.round((latestAttempt.score / total) * 100);

    return NextResponse.json(
      {
        attempt: {
          id: latestAttempt.id,
          assessmentTitle: latestAttempt.assessment.title,
          score: latestAttempt.score,
          total,
          percent,
          timeSpentSecs: latestAttempt.timeSpentSecs,
          completedAt: latestAttempt.completedAt,
        },
        analysis: latestAttempt.aiAnalysis?.feedback ?? null,
        analysisCreatedAt: latestAttempt.aiAnalysis?.createdAt ?? null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Outcomes latest error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
