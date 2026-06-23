"use client";

import React, { useState } from "react";
import { Plus, Users, Trophy, Award, Copy, Check, Calendar, ArrowRight, BookOpen, Clock, Activity, Search, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Attempt {
  id: string;
  score: number;
  timeSpentSecs: number;
  completedAt: string;
  assessment: {
    title: string;
    questions: Array<{ id: string }>;
  };
}

interface Student {
  id: string;
  name: string | null;
  email: string | null;
  attempts: Attempt[];
}

interface Enrollment {
  id: string;
  enrolledAt: string;
  student: Student;
}

interface ClassData {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  enrollments: Enrollment[];
}

interface Props {
  initialClasses: ClassData[];
}

export default function TeacherDashboardClient({ initialClasses }: Props) {
  const [classes, setClasses] = useState<ClassData[]>(initialClasses);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(
    initialClasses.length > 0 ? initialClasses[0].id : null
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const selectedClass = classes.find((c) => c.id === selectedClassId) || null;

  // Handle copying code
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Handle creating a new class
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    setCreating(true);
    setCreateError("");

    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newClassName }),
      });

      if (res.ok) {
        const data = await res.json();
        const createdClass: ClassData = {
          ...data,
          enrollments: [],
        };
        setClasses([createdClass, ...classes]);
        setSelectedClassId(createdClass.id);
        setNewClassName("");
        setIsCreateOpen(false);
      } else {
        const data = await res.json();
        setCreateError(data.error || "Failed to create class.");
      }
    } catch (err) {
      setCreateError("An unexpected error occurred.");
    } finally {
      setCreating(false);
    }
  };

  // Global calculations
  const totalStudents = React.useMemo(() => {
    const ids = new Set<string>();
    classes.forEach((c) => {
      c.enrollments.forEach((e) => ids.add(e.student.id));
    });
    return ids.size;
  }, [classes]);

  const globalAverageScore = React.useMemo(() => {
    let sum = 0;
    let count = 0;

    classes.forEach((c) => {
      c.enrollments.forEach((e) => {
        e.student.attempts.forEach((a) => {
          const totalQuestions = a.assessment.questions.length || 4;
          const scorePercent = (a.score / totalQuestions) * 100;
          sum += scorePercent;
          count++;
        });
      });
    });

    return count > 0 ? Math.round(sum / count) : null;
  }, [classes]);

  // Selected class calculations
  const selectedClassStats = React.useMemo(() => {
    if (!selectedClass) return null;

    let totalScorePercent = 0;
    let attemptCount = 0;
    const allAttempts: Array<{
      attemptId: string;
      studentName: string;
      assessmentTitle: string;
      score: number;
      total: number;
      percent: number;
      completedAt: string;
      timeSpentSecs: number;
    }> = [];

    selectedClass.enrollments.forEach((e) => {
      const studentName = e.student.name || "Unknown Student";
      e.student.attempts.forEach((a) => {
        const total = a.assessment.questions.length || 4;
        const percent = Math.round((a.score / total) * 100);

        totalScorePercent += percent;
        attemptCount++;

        allAttempts.push({
          attemptId: a.id,
          studentName,
          assessmentTitle: a.assessment.title,
          score: a.score,
          total,
          percent,
          completedAt: a.completedAt,
          timeSpentSecs: a.timeSpentSecs,
        });
      });
    });

    // Sort attempts by completedAt desc
    allAttempts.sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );

    return {
      averageScore: attemptCount > 0 ? Math.round(totalScorePercent / attemptCount) : null,
      totalQuizzesTaken: attemptCount,
      recentActivity: allAttempts.slice(0, 10),
    };
  }, [selectedClass]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] p-6 md:p-12 max-w-7xl mx-auto w-full space-y-8 text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Teacher <span className="neon-text-blue">Dashboard</span>
          </h1>
          <p className="text-slate-400">
            Create classes, view student results, and monitor curriculum performance metrics.
          </p>
        </div>
        <div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Create Class Room
          </button>
        </div>
      </div>

      {/* Global Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card border border-slate-700/40 p-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Classes</span>
            <h3 className="text-3xl font-bold text-white mt-1">{classes.length}</h3>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card border border-slate-700/40 p-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Students</span>
            <h3 className="text-3xl font-bold text-white mt-1">{totalStudents}</h3>
          </div>
          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card border border-slate-700/40 p-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Global Average Score</span>
            <h3 className="text-3xl font-bold text-emerald-400 mt-1">
              {globalAverageScore !== null ? `${globalAverageScore}%` : "--"}
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <Trophy className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main split view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Classes List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">Class Rooms</h3>
          {classes.length > 0 ? (
            <div className="space-y-3">
              {classes.map((cls) => {
                const isActive = cls.id === selectedClassId;
                return (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 ${
                      isActive
                        ? "border-cyan-500 bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.1)] text-white"
                        : "border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/55 text-slate-350"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-base group-hover:text-cyan-400 leading-tight">
                        {cls.name}
                      </h4>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase font-bold border border-slate-700">
                        {cls.code}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-4">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        {cls.enrollments.length} Students
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(cls.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="glass-card border border-slate-700/40 p-8 text-center text-slate-500">
              No classes created yet.
            </div>
          )}
        </div>

        {/* Right Side: Class Details panel */}
        <div className="lg:col-span-2 space-y-6">
          {selectedClass ? (
            <div className="glass-card border border-slate-700/40 p-6 md:p-8 space-y-8">
              {/* Class Header info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedClass.name}</h2>
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Created on{" "}
                    {new Date(selectedClass.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-850 px-4 py-2.5 rounded-xl">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Class Code:
                  </span>
                  <span className="text-base font-extrabold text-cyan-400 tracking-wider">
                    {selectedClass.code}
                  </span>
                  <button
                    onClick={() => handleCopyCode(selectedClass.code)}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedCode === selectedClass.code ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Class Score Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                    Class Average Score
                  </span>
                  <h4 className="text-2xl font-extrabold text-emerald-400 mt-1">
                    {selectedClassStats?.averageScore !== null
                      ? `${selectedClassStats?.averageScore}%`
                      : "--"}
                  </h4>
                </div>
                <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl">
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                    Total Quizzes Completed
                  </span>
                  <h4 className="text-2xl font-extrabold text-white mt-1">
                    {selectedClassStats?.totalQuizzesTaken}
                  </h4>
                </div>
              </div>

              {/* Students Table */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Enrolled Students ({selectedClass.enrollments.length})
                </h3>

                {selectedClass.enrollments.length > 0 ? (
                  <div className="border border-slate-850 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-900/50 border-b border-slate-850 text-xs font-bold uppercase tracking-wider text-slate-400">
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4 text-right">Quizzes Taken</th>
                            <th className="p-4 text-right">Average Score</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850/60 text-sm">
                          {selectedClass.enrollments.map((enr) => {
                            const name = enr.student.name || "Unknown Student";
                            const email = enr.student.email || "--";
                            const totalQuizzes = enr.student.attempts.length;

                            let avgScore = 0;
                            if (totalQuizzes > 0) {
                              const totalSum = enr.student.attempts.reduce((sum, a) => {
                                const qCount = a.assessment.questions.length || 4;
                                return sum + (a.score / qCount) * 100;
                              }, 0);
                              avgScore = Math.round(totalSum / totalQuizzes);
                            }

                            return (
                              <tr key={enr.id} className="hover:bg-slate-900/20 transition-colors">
                                <td className="p-4 font-semibold text-white">{name}</td>
                                <td className="p-4 text-slate-400">{email}</td>
                                <td className="p-4 text-slate-400">
                                  {new Date(enr.enrolledAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right text-slate-400">{totalQuizzes}</td>
                                <td className="p-4 text-right font-bold">
                                  {totalQuizzes > 0 ? (
                                    <span
                                      className={
                                        avgScore >= 75
                                          ? "text-emerald-400 neon-text-green"
                                          : "text-amber-400"
                                      }
                                    >
                                      {avgScore}%
                                    </span>
                                  ) : (
                                    <span className="text-slate-500">--</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-800 rounded-2xl p-8 text-center text-slate-500">
                    Share the class code above with your students to enroll them.
                  </div>
                )}
              </div>

              {/* Class Activity Timeline */}
              {selectedClassStats?.recentActivity &&
                selectedClassStats.recentActivity.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-400" />
                      Recent Activity
                    </h3>
                    <div className="border border-slate-855 rounded-2xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-855 text-xs font-bold uppercase tracking-wider text-slate-400">
                              <th className="p-4">Student</th>
                              <th className="p-4">Quiz</th>
                              <th className="p-4">Completed</th>
                              <th className="p-4 text-right">Score</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-855/60 text-sm">
                            {selectedClassStats.recentActivity.map((act) => (
                              <tr
                                key={act.attemptId}
                                className="hover:bg-slate-900/20 transition-colors"
                              >
                                <td className="p-4 font-semibold text-white">
                                  {act.studentName}
                                </td>
                                <td className="p-4 text-slate-350">{act.assessmentTitle}</td>
                                <td className="p-4 text-slate-400">
                                  {new Date(act.completedAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right font-bold">
                                  <span
                                    className={
                                      act.percent >= 75
                                        ? "text-emerald-400"
                                        : "text-amber-400"
                                    }
                                  >
                                    {act.score} / {act.total} ({act.percent}%)
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <div className="glass-card border border-slate-700/40 p-12 text-center text-slate-500">
              Select or create a class to view metrics.
            </div>
          )}
        </div>
      </div>

      {/* CREATE CLASS DIALOG MODAL */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
              onClick={() => setIsCreateOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="glass-card border border-slate-700/50 p-6 md:p-8 max-w-md w-full relative z-10 space-y-6 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex justify-between items-center pb-2">
                <h3 className="text-xl font-bold text-white">Create a Class Room</h3>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {createError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm text-center">
                  {createError}
                </div>
              )}

              <form onSubmit={handleCreateClass} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Class Name</label>
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    required
                    placeholder="e.g. XI Listrik A"
                    maxLength={50}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-white transition-all placeholder-slate-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-750 text-slate-350 hover:text-white font-semibold text-sm hover:bg-slate-850 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating || !newClassName.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
                  >
                    {creating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Class
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
