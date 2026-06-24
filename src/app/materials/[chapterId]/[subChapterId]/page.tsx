import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Compass, ChevronRight, ChevronLeft, Award } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SubChapterContextUpdater } from "@/components/interactive/SubChapterContextUpdater";

export const dynamic = "force-dynamic";

interface SubChapterPageProps {
  params: Promise<{
    chapterId: string;
    subChapterId: string;
  }>;
}

export default async function SubChapterReaderPage({ params }: SubChapterPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const { chapterId, subChapterId } = await params;

  // Fetch the current subchapter and its parent chapter with all siblings
  const subChapter = await prisma.subChapter.findUnique({
    where: { id: subChapterId },
    include: {
      quiz: {
        select: { id: true },
      },
      chapter: {
        include: {
          subChapters: {
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  });

  if (!subChapter || subChapter.chapterId !== chapterId) {
    redirect("/materials");
  }

  const siblings = subChapter.chapter.subChapters;
  const currentIndex = siblings.findIndex((s) => s.id === subChapterId);
  const prevSub = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const nextSub = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-950 text-slate-200">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:block w-80 shrink-0 border-r border-slate-800 bg-slate-900/20 backdrop-blur-xl p-6 overflow-y-auto">
        <Link
          href="/materials"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-semibold group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Materials
        </Link>

        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
              Active Module
            </span>
            <h3 className="font-extrabold text-white text-lg leading-tight">
              {subChapter.chapter.title}
            </h3>
          </div>

          <div className="border-t border-slate-800/80 pt-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              Module Outline
            </h4>
            <nav className="space-y-2">
              {siblings.map((sib, index) => {
                const isActive = sib.id === subChapterId;
                return (
                  <Link
                    key={sib.id}
                    href={`/materials/${chapterId}/${sib.id}`}
                    className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-cyan-500/10 border border-cyan-500/35 text-white"
                        : "border border-transparent hover:border-slate-850 hover:bg-slate-900/40 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${
                        isActive
                          ? "bg-cyan-500 text-slate-950"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium leading-tight">{sib.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-12 lg:p-16 max-w-4xl mx-auto overflow-y-auto w-full">
        {/* Mobile Header Link */}
        <Link
          href="/materials"
          className="flex lg:hidden items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Materials
        </Link>

        {/* Lesson Body */}
        <article className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Lesson {currentIndex + 1} of {siblings.length}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              {subChapter.title}
            </h1>
          </div>

          {/* Learning Objectives Box */}
          <div className="glass-card border border-slate-700/30 p-5 bg-slate-900/10">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Learning Objective
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{subChapter.objective}</p>
          </div>

          {/* Content Body */}
          <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-base md:text-lg space-y-6">
            <p>{subChapter.contentBody}</p>
          </div>

          {/* Source Citation */}
          {subChapter.source && (
            <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-500 italic">
              Source: {subChapter.source}
            </div>
          )}

          {/* Navigation Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-12 border-t border-slate-800/80 mt-12">
            {prevSub ? (
              <Link
                href={`/materials/${chapterId}/${prevSub.id}`}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-800/40 text-slate-300 hover:text-white transition-colors w-full sm:w-auto justify-center text-sm font-semibold"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous: {prevSub.title}
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            {nextSub ? (
              <Link
                href={`/materials/${chapterId}/${nextSub.id}`}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 w-full sm:w-auto justify-center text-sm font-semibold group"
              >
                Next Lesson: {nextSub.title}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <Link
                href={
                  subChapter.quiz
                    ? `/assessment/${subChapter.quiz.id}`
                    : `/assessment/${chapterId}-assessment`
                }
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-xl transition-all shadow-md shadow-emerald-500/10 w-full sm:w-auto justify-center text-sm font-semibold group"
              >
                Take Chapter Assessment
                <Award className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </Link>
            )}
          </div>
        </article>
      </main>
      <SubChapterContextUpdater
        chapterTitle={subChapter.chapter.title}
        subChapterTitle={subChapter.title}
        subChapterObjective={subChapter.objective || ""}
      />
    </div>
  );
}
