import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AssessmentClient from "./AssessmentClient";

interface AssessmentPageProps {
  params: Promise<{ id: string }>;
}

export default async function AssessmentPage({ params }: AssessmentPageProps) {
  const { id } = await params;

  const assessment = await prisma.assessment.findUnique({
    where: { id },
    include: {
      questions: true,
    },
  });

  if (!assessment) {
    return notFound();
  }

  // Parse the options JSON string to an array of strings
  const parsedQuestions = assessment.questions.map((q) => ({
    id: q.id,
    text: q.text,
    options: JSON.parse(q.options) as string[],
    correctAnswer: q.correctAnswer,
  }));

  return (
    <AssessmentClient
      assessment={{
        id: assessment.id,
        title: assessment.title,
        durationMins: assessment.durationMins,
      }}
      questions={parsedQuestions}
    />
  );
}
