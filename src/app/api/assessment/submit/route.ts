import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateLearningOutcomesFeedback } from "@/lib/outcomes/evaluator";

type SubmitAssessmentBody = {
  assessmentId: string;
  answers: (number | null)[];
  timeSpentSecs: number;
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawBody: unknown = await req.json();
    if (!rawBody || typeof rawBody !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { assessmentId, answers, timeSpentSecs } = rawBody as Partial<SubmitAssessmentBody>;
    if (!assessmentId) {
      return NextResponse.json({ error: "assessmentId is required" }, { status: 400 });
    }
    if (!Array.isArray(answers)) {
      return NextResponse.json({ error: "answers must be an array" }, { status: 400 });
    }

    const parsedAnswers = answers.map((v) => {
      if (v === null) return null;
      if (typeof v === "number" && Number.isInteger(v)) return v;
      return null;
    });

    const spent =
      typeof timeSpentSecs === "number" && Number.isFinite(timeSpentSecs) && timeSpentSecs >= 0
        ? Math.round(timeSpentSecs)
        : 0;

    // @ts-expect-error session.user.id is injected in auth callbacks
    const userId = session.user.id as string;

    let score = 0;
    let total = 0;
    let percent = 0;
    let title = "";
    let durationMins = 20;
    let legacyAssessmentId = "";
    let quizId: string | null = null;
    const incorrectQuestions: Array<{
      questionText: string;
      submittedAnswer: string | null;
      correctAnswer: string;
    }> = [];

    // Check if assessmentId matches a Quiz
    const quiz = await prisma.quiz.findUnique({
      where: { id: assessmentId },
      include: {
        subChapter: {
          include: {
            chapter: true,
          },
        },
      },
    });

    if (quiz) {
      quizId = quiz.id;
      title = quiz.title;
      const chapterOrder = quiz.subChapter.chapter.sortOrder;
      const legacyAssessment = await prisma.assessment.findFirst({
        where: { chapterOrder },
      });
      if (!legacyAssessment) {
        return NextResponse.json({ error: "Associated legacy assessment not found" }, { status: 400 });
      }
      legacyAssessmentId = legacyAssessment.id;
      durationMins = legacyAssessment.durationMins;

      const rawQuestions = Array.isArray(quiz.questions) ? quiz.questions : [];
      if (parsedAnswers.length !== rawQuestions.length) {
        return NextResponse.json({ error: "Answers length does not match questions length" }, { status: 400 });
      }

      rawQuestions.forEach((q: any, index: number) => {
        const qText = q.question || "";
        const options = Array.isArray(q.options) ? q.options : [];
        const correctAnswer = q.correct || q.correctAnswer || "";
        const answerIndex = parsedAnswers[index];
        const submittedAnswer = answerIndex !== null ? options[answerIndex] : null;

        if (submittedAnswer === correctAnswer) {
          score += 1;
        } else {
          incorrectQuestions.push({
            questionText: qText,
            submittedAnswer,
            correctAnswer,
          });
        }
      });

      total = rawQuestions.length;
      percent = Math.round((score / total) * 100);
    } else {
      const assessment = await prisma.assessment.findUnique({
        where: { id: assessmentId },
        include: {
          questions: {
            orderBy: { id: "asc" }
          }
        }
      });

      if (!assessment) {
        return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
      }

      title = assessment.title;
      durationMins = assessment.durationMins;
      legacyAssessmentId = assessment.id;

      if (parsedAnswers.length !== assessment.questions.length) {
        return NextResponse.json({ error: "Answers length does not match questions length" }, { status: 400 });
      }

      assessment.questions.forEach((q, index) => {
        const options = JSON.parse(q.options) as string[];
        const answerIndex = parsedAnswers[index];
        const submittedAnswer = answerIndex !== null ? options[answerIndex] : null;

        if (submittedAnswer === q.correctAnswer) {
          score += 1;
        } else {
          incorrectQuestions.push({
            questionText: q.text,
            submittedAnswer,
            correctAnswer: q.correctAnswer
          });
        }
      });

      total = assessment.questions.length;
      percent = Math.round((score / total) * 100);
    }

    const attempt = await prisma.assessmentAttempt.create({
      data: {
        userId,
        assessmentId: legacyAssessmentId,
        quizId,
        score,
        timeSpentSecs: spent,
      },
    });

    let feedback: string | null = null;
    try {
      const attemptData = {
        score,
        total,
        percent,
        timeSpentSecs: spent,
        incorrectQuestions,
      };

      const quizContext = {
        assessmentTitle: title,
        durationMins,
      };

      const allSubChapters = await prisma.subChapter.findMany({
        select: {
          id: true,
          title: true,
          objective: true,
        },
      });

      const ai = await generateLearningOutcomesFeedback({ attemptData, quizContext, allSubChapters });
      feedback = ai.feedback;

      await prisma.aIAnalysis.create({
        data: {
          userId,
          attemptId: attempt.id,
          feedback,
        },
      });
    } catch (error) {
      console.error("AI evaluation failed:", error);
    }

    return NextResponse.json(
      {
        attempt: {
          id: attempt.id,
          score,
          total,
          percent,
          timeSpentSecs: spent,
          completedAt: attempt.completedAt,
        },
        analysis: feedback,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Assessment submit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
