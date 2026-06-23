import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import TeacherDashboardClient from "./TeacherDashboardClient";

export const dynamic = "force-dynamic";

export default async function TeacherDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as { role?: string }).role !== "TEACHER") {
    redirect("/login");
  }

  // @ts-expect-error session.user.id is injected in auth callbacks
  const userId = session.user.id as string;

  // Fetch all classes created by the teacher
  const classes = await prisma.classes.findMany({
    where: { teacherId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      enrollments: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              attempts: {
                orderBy: { completedAt: "desc" },
                select: {
                  id: true,
                  score: true,
                  timeSpentSecs: true,
                  completedAt: true,
                  assessment: {
                    select: {
                      title: true,
                      questions: {
                        select: { id: true },
                      },
                    },
                  },
                  quiz: {
                    select: {
                      title: true,
                      questions: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // Map Date objects to ISO strings for client compatibility
  // and map DB classCode to the Client's expected code property
  const serializedClasses = classes.map((c) => ({
    id: c.id,
    name: c.name,
    code: c.classCode,
    createdAt: c.createdAt.toISOString(),
    enrollments: c.enrollments.map((e) => ({
      id: e.id,
      enrolledAt: e.enrolledAt.toISOString(),
      student: {
        id: e.student.id,
        name: e.student.name,
        email: e.student.email,
        attempts: e.student.attempts.map((a) => {
          let questionsCount = a.assessment.questions.length;
          let title = a.assessment.title;

          if (a.quiz) {
            title = a.quiz.title;
            const quizQuestions = Array.isArray(a.quiz.questions) ? a.quiz.questions : [];
            questionsCount = quizQuestions.length;
          }

          return {
            id: a.id,
            score: a.score,
            timeSpentSecs: a.timeSpentSecs,
            completedAt: a.completedAt.toISOString(),
            assessment: {
              title,
              questions: Array.from({ length: questionsCount }, (_, i) => ({ id: i.toString() })),
            },
          };
        }),
      },
    })),
  }));

  return <TeacherDashboardClient initialClasses={serializedClasses} />;
}
