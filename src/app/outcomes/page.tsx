"use client";

import { Target, BrainCircuit, TrendingUp, AlertTriangle } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type LatestOutcomesResponse = {
  attempt: null | {
    id: string;
    assessmentTitle?: string;
    score: number;
    total: number;
    percent: number;
    timeSpentSecs: number;
    completedAt: string;
  };
  analysis: string | null;
  analysisCreatedAt: string | null;
};

type ParsedEvaluation = {
  strengths: string[];
  needsImprovement: string[];
  summary: string;
  recommendedNextAction: string;
};

function toStringArray(value: unknown, max = 6): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max);
}

function parseEvaluation(analysis: string | null): ParsedEvaluation | null {
  if (!analysis) return null;

  try {
    const parsed = JSON.parse(analysis);
    if (!parsed || typeof parsed !== "object") return null;
    const obj = parsed as Record<string, unknown>;

    const strengths = toStringArray(obj.strengths);
    const needsImprovement = toStringArray(obj.needsImprovement);
    const summary = typeof obj.summary === "string" ? obj.summary.trim() : "";
    const recommendedNextAction =
      typeof obj.recommendedNextAction === "string" ? obj.recommendedNextAction.trim() : "";

    return { strengths, needsImprovement, summary, recommendedNextAction };
  } catch {
    // Not JSON — treat as plain summary text
    return {
      strengths: [],
      needsImprovement: [],
      summary: analysis.trim(),
      recommendedNextAction: "",
    };
  }
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function OutcomesPage() {
  const ringRef = useRef(null);
  const ringInView = useInView(ringRef, { once: true });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<LatestOutcomesResponse["attempt"]>(null);
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const [analysisCreatedAt, setAnalysisCreatedAt] = useState<string | null>(null);

  const evaluation = useMemo(() => parseEvaluation(analysisText), [analysisText]);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/outcomes/latest");
        const data = (await res.json()) as unknown;

        if (!alive) return;

        if (!res.ok) {
          setAttempt(null);
          setAnalysisText(null);
          setAnalysisCreatedAt(null);
          const maybeError = (data as { error?: unknown } | null)?.error;
          setError(typeof maybeError === "string" ? maybeError : "Failed to load outcomes.");
          return;
        }

        const ok = data as LatestOutcomesResponse;

        setAttempt(ok.attempt);
        setAnalysisText(ok.analysis);
        setAnalysisCreatedAt(ok.analysisCreatedAt);
      } catch (e) {
        if (!alive) return;
        setError("Network error while loading outcomes.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  const percent = attempt?.percent ?? 0;
  const circumference = 351.858;
  const dashOffset = circumference - (circumference * percent) / 100;
  const percentLabel = attempt ? `${percent}%` : "--";

  const generatedAtLabel = (() => {
    const stamp = analysisCreatedAt ?? attempt?.completedAt ?? null;
    if (!stamp) return "";
    const d = new Date(stamp);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString();
  })();

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] p-6 md:p-16 max-w-6xl mx-auto w-full space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">
          Learning <span className="neon-text-cyan">Outcomes</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg transition-colors">
          Personalized strengths and weaknesses analysis powered by AI based on your latest assessment.
        </p>

        {error && (
          <p className="text-amber-600 dark:text-amber-400 text-sm mt-3 transition-colors">{error}</p>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="md:col-span-1 space-y-6">
          {/* Score ring */}
          <motion.div
            ref={ringRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card border border-slate-200 dark:border-slate-700/40 p-6 shadow-xl flex flex-col items-center text-center"
          >
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-200 dark:text-slate-800 transition-colors" />
                <motion.circle
                  cx="64" cy="64" r="56"
                  fill="transparent"
                  stroke="url(#outcomeGrad)"
                  strokeWidth="8"
                  strokeDasharray="351.858"
                  initial={{ strokeDashoffset: 351.858 }}
                  animate={ringInView ? { strokeDashoffset: dashOffset } : {}}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 6px rgba(59,130,246,0.4))" }}
                />
                <defs>
                  <linearGradient id="outcomeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-4xl font-bold neon-text-blue">{loading ? "…" : percentLabel}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">
              {attempt?.assessmentTitle || "Latest Assessment"} Score
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">
              {loading
                ? "Loading your latest attempt…"
                : attempt
                ? "Based on your most recent assessment attempt."
                : "No assessment attempt yet."}
            </p>
          </motion.div>

          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glass-card border border-slate-200 dark:border-slate-700/40 p-6 shadow-xl"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 transition-colors">
              <Target className="w-5 h-5 neon-text-green" />
              Strengths
            </h3>
            <ul className="space-y-3">
              {(evaluation?.strengths?.length ? evaluation.strengths : [
                loading
                  ? "Loading…"
                  : attempt
                  ? "No strengths analysis available yet."
                  : "Complete the assessment to generate outcomes.",
              ]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Weaknesses */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="glass-card border border-slate-200 dark:border-slate-700/40 p-6 shadow-xl"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 transition-colors">
              <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              Needs Improvement
            </h3>
            <ul className="space-y-3">
              {(evaluation?.needsImprovement?.length ? evaluation.needsImprovement : [
                loading
                  ? "Loading…"
                  : attempt
                  ? "No improvement areas available yet."
                  : "Complete the assessment to generate outcomes.",
              ]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Right column — AI Evaluation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2"
        >
          <div className="glass-card border border-slate-200 dark:border-slate-700/40 p-8 shadow-xl h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800 transition-colors">
              <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                <BrainCircuit className="w-8 h-8 neon-text-blue" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">AI Evaluation</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">
                  {loading
                    ? "Loading…"
                    : generatedAtLabel
                    ? `Generated ${generatedAtLabel}`
                    : ""}
                </p>
              </div>
            </div>

            <div className="flex-1 text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 transition-colors">
              {(() => {
                const summary = evaluation?.summary || "";
                const paragraphs = summary ? splitParagraphs(summary) : [];

                if (loading) {
                  return <p>Loading your evaluation…</p>;
                }

                if (!attempt) {
                  return <p>Complete the Assessment to generate your Learning Outcomes.</p>;
                }

                if (!analysisText) {
                  return <p>Your attempt was saved, but no AI evaluation is available yet.</p>;
                }

                if (paragraphs.length === 0) {
                  return <p>{analysisText}</p>;
                }

                return (
                  <>
                    {paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </>
                );
              })()}

              {!!evaluation?.recommendedNextAction && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-6"
                >
                  <h4 className="neon-text-blue font-bold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Recommended Next Action
                  </h4>
                  <p className="text-sm">{evaluation.recommendedNextAction}</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
