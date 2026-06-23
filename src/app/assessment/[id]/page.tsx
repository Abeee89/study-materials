import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AssessmentClient from "./AssessmentClient";

interface AssessmentPageProps {
  params: Promise<{ id: string }>;
}

export default async function AssessmentPage({ params }: AssessmentPageProps) {
  const { id } = await params;

  let title = "";
  let durationMins = 20;
  let parsedQuestions: Array<{
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
  }> = [];

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      subChapter: {
        include: {
          chapter: true,
        },
      },
    },
  });

  if (quiz) {
    title = quiz.title;
    const chapterOrder = quiz.subChapter.chapter.sortOrder;
    const legacyAssessment = await prisma.assessment.findFirst({
      where: { chapterOrder },
    });
    durationMins = legacyAssessment?.durationMins ?? 20;

    const rawQuestions = Array.isArray(quiz.questions) ? quiz.questions : [];
    parsedQuestions = rawQuestions.map((q: any, index: number) => ({
      id: q.id || `q-${index}`,
      text: q.question || "",
      options: Array.isArray(q.options) ? q.options : [],
      correctAnswer: q.correct || q.correctAnswer || "",
    }));
  } else {
    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });

    if (!assessment) {
      return notFound();
    }

    title = assessment.title;
    durationMins = assessment.durationMins;
    parsedQuestions = assessment.questions.map((q) => ({
      id: q.id,
      text: q.text,
      options: JSON.parse(q.options) as string[],
      correctAnswer: q.correctAnswer,
    }));
  }

  return (
    <AssessmentClient
      assessment={{
        id,
        title,
        durationMins,
      }}
      questions={parsedQuestions}
    />
  );
}
