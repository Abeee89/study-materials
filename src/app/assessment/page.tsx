import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Clock, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AssessmentMenuPage() {
  const assessments = await prisma.assessment.findMany({
    include: {
      _count: {
        select: { questions: true },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] p-6 md:p-16 max-w-5xl mx-auto w-full space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">
          Assessment <span className="neon-text-blue">Menu</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg transition-colors">
          Select a chapter to test your knowledge. Each assessment contains specific questions and generates AI-driven Learning Outcomes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assessments.map((assessment) => (
          <Link
            href={`/assessment/${assessment.id}`}
            key={assessment.id}
            className="group block"
          >
            <div className="glass-card glass-card-hover border border-slate-200 dark:border-slate-700/40 p-6 h-full flex flex-col justify-between transition-all shadow-lg hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500/50">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {assessment.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6 transition-colors">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    {assessment._count.questions} Questions
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    {assessment.durationMins} Mins
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <span className="flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors">
                  Start Assessment <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
