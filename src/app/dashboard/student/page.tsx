import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Trophy, Clock, Brain, Compass, ArrowRight, Target, AlertTriangle, Sparkles, Users } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import JoinClassForm from "./JoinClassForm";

export const dynamic = "force-dynamic";

type ParsedFeedback = {
  strengths?: string[];
  needsImprovement?: string[];
  summary?: string;
  recommendedNextAction?: string;
  recommendedSubChapters?: string[];
};

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as { role?: string }).role !== "STUDENT") {
    redirect("/login");
  }

  // @ts-expect-error session.user.id is injected in auth callbacks
  const userId = session.user.id as string;

  // 1. Fetch user attempts
  const attempts = await prisma.assessmentAttempt.findMany({
    where: { userId },
    orderBy: { completedAt: "desc" },
    include: {
      assessment: true,
      quiz: true,
      aiAnalysis: true,
    },
  });

  // 2. Fetch class enrollments
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: userId },
    include: {
      class: {
        include: {
          teacher: {
            select: { name: true },
          },
        },
      },
    },
  });

  // 3. Fetch all chapters and subchapters for progress mapping
  const chapters = await prisma.chapter.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      subChapters: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  const allSubChapters = chapters.flatMap((c) => c.subChapters);
  const totalSubChapters = allSubChapters.length;

  // Determine completed subchapters (for which the student has attempted the chapter assessment)
  // Since assessments are linked to chapters, we consider a chapter completed if there's an attempt for it
  const completedChaptersCount = chapters.filter((ch) =>
    attempts.some((att) => att.assessment.chapterOrder === ch.sortOrder)
  ).length;

  const progressPercent = Math.round((completedChaptersCount / chapters.length) * 100);

  // 4. Extract recommendations from the latest AI feedback
  const latestAttempt = attempts[0];
  let aiFeedback: ParsedFeedback | null = null;

  if (latestAttempt?.aiAnalysis?.feedback) {
    try {
      aiFeedback = JSON.parse(latestAttempt.aiAnalysis.feedback) as ParsedFeedback;
    } catch {
      // Fallback if not valid JSON
      aiFeedback = { summary: latestAttempt.aiAnalysis.feedback };
    }
  }

  // Find recommended subchapters in the DB
  const recommendedIds = aiFeedback?.recommendedSubChapters || [];
  const recommendedSubChapters = allSubChapters.filter((sub) =>
    recommendedIds.includes(sub.id)
  );

  // Default recommendation if none exist
  const defaultRecommendation = allSubChapters[0];

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] p-6 md:p-12 max-w-7xl mx-auto w-full space-y-8 text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome Back, <span className="neon-text-blue">{session.user.name || "Student"}</span>!
          </h1>
          <p className="text-slate-400">
            Track your progress, review AI outcomes, and jump straight into recommended lessons.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/materials"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/40 hover:bg-slate-800/60 transition-colors text-sm font-semibold"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Browse Curriculum
          </Link>
        </div>
      </div>

      {/* Top row stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="glass-card border border-slate-700/40 p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Course Progress</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-bold text-white">{completedChaptersCount}</span>
              <span className="text-slate-500">/ {chapters.length} Chapters</span>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full progress-neon transition-all duration-500"
                style={{ width: `${progressPercent || 5}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>{progressPercent}% Complete</span>
              <span>Keep it up!</span>
            </div>
          </div>
        </div>

        {/* Score Card */}
        <div className="glass-card border border-slate-700/40 p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Average Quiz Score</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-bold text-emerald-400">
                {attempts.length > 0
                  ? `${Math.round(
                      (attempts.reduce((sum, a) => sum + a.score, 0) /
                        attempts.reduce((sum, a) => sum + (a.score > 0 ? (a.score / (a.score / 4)) : 4), 0)) * // fallback assuming 4 questions
                        100
                    )}%`
                  : "--"}
              </span>
              <span className="text-slate-500">Across {attempts.length} attempts</span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Mastery target is 75% or higher</span>
          </div>
        </div>

        {/* Active Time Card */}
        <div className="glass-card border border-slate-700/40 p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Time Spent on Quizzes</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-bold text-purple-400">
                {Math.round(attempts.reduce((sum, a) => sum + a.timeSpentSecs, 0) / 60)}
              </span>
              <span className="text-slate-500">Minutes</span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>Excludes simulation sandbox time</span>
          </div>
        </div>
      </div>

      {/* Main dashboard splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left columns - Lessons & Attempts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Dynamic Recommendations */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              Recommended for You
            </h3>

            {recommendedSubChapters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedSubChapters.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/materials/${sub.chapterId}/${sub.id}`}
                    className="group glass-card border border-slate-700/40 p-5 hover:border-cyan-500/50 hover:bg-slate-800/40 transition-all duration-300 hover:-translate-y-0.5 block"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
                        Recommended Lesson
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h4 className="font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {sub.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{sub.objective}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="glass-card border border-slate-700/40 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-lg mb-1">Ready to start your journey?</h4>
                  <p className="text-sm text-slate-400 max-w-md">
                    {defaultRecommendation
                      ? `Jump straight into our first topic: "${defaultRecommendation.title}"`
                      : "Begin exploring the available chapters and materials."}
                  </p>
                </div>
                {defaultRecommendation && (
                  <Link
                    href={`/materials/${defaultRecommendation.chapterId}/${defaultRecommendation.id}`}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/15"
                  >
                    Start First Chapter
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Class Rooms */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              My Class Rooms
            </h3>
            {enrollments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enrollments.map((enr) => (
                  <div
                    key={enr.id}
                    className="glass-card border border-slate-700/40 p-5 flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-white text-base mb-1">{enr.class.name}</h4>
                      <p className="text-xs text-slate-400">
                        Teacher: {enr.class.teacher.name || "Unknown Teacher"}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-xs text-slate-400">
                      <span className="bg-slate-900 border border-slate-750 px-2 py-0.5 rounded uppercase font-bold text-cyan-400">
                        {enr.class.classCode}
                      </span>
                      <span>Joined {new Date(enr.enrolledAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card border border-slate-700/40 p-6 text-center text-slate-500">
                You are not enrolled in any classes yet. Join a class using the form in the sidebar!
              </div>
            )}
          </div>

          {/* Quiz History */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Quiz History
            </h3>

            {attempts.length > 0 ? (
              <div className="glass-card border border-slate-700/40 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/50 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <th className="p-4">Quiz Title</th>
                        <th className="p-4">Completed</th>
                        <th className="p-4">Time Spent</th>
                        <th className="p-4 text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-sm">
                      {attempts.map((att) => {
                        const totalQs = att.quiz
                          ? (Array.isArray(att.quiz.questions) ? att.quiz.questions.length : 4)
                          : 4;
                        return (
                          <tr key={att.id} className="hover:bg-slate-900/30 transition-colors">
                            <td className="p-4 font-semibold text-white">
                              {att.quiz?.title ?? att.assessment.title}
                            </td>
                            <td className="p-4 text-slate-400">
                              {new Date(att.completedAt).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-slate-400">
                              {Math.floor(att.timeSpentSecs / 60)}m {att.timeSpentSecs % 60}s
                            </td>
                            <td className="p-4 text-right font-bold">
                              <span
                                className={
                                  (att.score / totalQs) >= 0.75
                                    ? "text-emerald-400 neon-text-green"
                                    : "text-amber-400"
                                }
                              >
                                {att.score} / {totalQs} Correct
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="glass-card border border-slate-700/40 p-8 text-center">
                <p className="text-slate-500">You haven't completed any assessments yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column - AI Evaluation Panel */}
        <div className="space-y-6">
          <JoinClassForm />

          <div className="glass-card border border-slate-700/40 p-6 flex flex-col justify-between h-full min-h-[400px]">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Brain className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-bold text-white text-lg">AI Tutor Insights</h3>
              </div>

              {aiFeedback ? (
                <div className="space-y-6 text-sm">
                  {/* Summary */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Overview
                    </h4>
                    <p className="text-slate-300 leading-relaxed">{aiFeedback.summary}</p>
                  </div>

                  {/* Strengths */}
                  {aiFeedback.strengths && aiFeedback.strengths.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" /> Strengths
                      </h4>
                      <ul className="space-y-1.5 text-slate-400">
                        {aiFeedback.strengths.map((str, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-emerald-400 mt-2" />
                            {str}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Improvements */}
                  {aiFeedback.needsImprovement && aiFeedback.needsImprovement.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Needs Improvement
                      </h4>
                      <ul className="space-y-1.5 text-slate-400">
                        {aiFeedback.needsImprovement.map((imp, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-amber-400 mt-2" />
                            {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-12 text-slate-500 space-y-4">
                  <Sparkles className="w-12 h-12 text-slate-600 animate-pulse" />
                  <p className="text-sm">
                    Complete your first assessment to unlock personalized AI tutor insights!
                  </p>
                </div>
              )}
            </div>

            {aiFeedback && (
              <div className="mt-8 pt-4 border-t border-slate-800/60">
                <Link
                  href="/outcomes"
                  className="flex items-center justify-center gap-1.5 w-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 font-semibold py-2.5 rounded-xl border border-blue-500/20 transition-all text-sm"
                >
                  View Learning Outcomes
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
