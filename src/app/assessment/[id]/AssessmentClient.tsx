"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Play, Clock, CheckCircle, XCircle, Trophy, RotateCcw, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
};

type AssessmentClientProps = {
  assessment: {
    id: string;
    title: string;
    durationMins: number;
  };
  questions: Question[];
};

export default function AssessmentClient({ assessment, questions }: AssessmentClientProps) {
  const { status: sessionStatus } = useSession();
  const router = useRouter();
  const DURATION_SECS = assessment.durationMins * 60;

  const [examStarted, setExamStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION_SECS);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [resultData, setResultData] = useState<{ score: number; percent: number } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSubmit = useCallback(async () => {
    if (submitted) return;
    setSubmitted(true);
    if (audioRef.current) audioRef.current.play().catch(() => {});

    const timeSpentSecs = Math.max(0, DURATION_SECS - timeLeft);

    if (sessionStatus !== "authenticated") {
      setSaveState("error");
      setSaveMessage("Sign in to save your attempt and generate Learning Outcomes.");
      return;
    }

    setSaveState("saving");
    setSaveMessage(null);

    try {
      const res = await fetch(`/api/assessment/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId: assessment.id, answers, timeSpentSecs }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSaveState("saved");
        setSaveMessage("Saved. Open Learning Outcomes to view your AI review.");
        setResultData({
          score: data.attempt.score,
          percent: data.attempt.percent,
        });
      } else if (res.status === 401) {
        setSaveState("error");
        setSaveMessage("Sign in to save your attempt and generate Learning Outcomes.");
      } else {
        setSaveState("error");
        setSaveMessage(data?.error || "Failed to save attempt.");
      }
    } catch (error) {
      console.error("Assessment submit error:", error);
      setSaveState("error");
      setSaveMessage("Network error while saving your attempt.");
    }
  }, [answers, sessionStatus, submitted, timeLeft, assessment.id, DURATION_SECS]);

  useEffect(() => {
    audioRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
  }, []);

  useEffect(() => {
    if (!examStarted || submitted || timeLeft <= 0) return;

    const timeout = setTimeout(() => {
      setTimeLeft((p) => Math.max(0, p - 1));
      if (timeLeft === 1) handleSubmit();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [examStarted, submitted, timeLeft, handleSubmit]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const selectAnswer = (optIndex: number) => {
    if (submitted) return;
    const updated = [...answers];
    updated[currentQ] = optIndex;
    setAnswers(updated);
  };

  const resetExam = () => {
    setExamStarted(false);
    setCurrentQ(0);
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
    setTimeLeft(DURATION_SECS);
    setSaveState("idle");
    setSaveMessage(null);
    setResultData(null);
  };

  const answeredCount = answers.filter((a) => a !== null).length;

  // Compute local score for immediate display if API fails or user is not logged in
  const localScore = answers.reduce<number>((acc, ans, i) => {
    if (ans === null) return acc;
    const q = questions[i];
    return acc + (q.options[ans] === q.correctAnswer ? 1 : 0);
  }, 0);
  const localPercent = Math.round((localScore / questions.length) * 100);

  const displayScore = resultData?.score ?? localScore;
  const displayPercent = resultData?.percent ?? localPercent;

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] p-6 md:p-16 max-w-5xl mx-auto w-full space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 border border-slate-200 dark:border-slate-700/40 flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">
            {assessment.title} <span className="neon-text-purple">Assessment</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 transition-colors">
            {questions.length} questions. You have {assessment.durationMins} minutes.
          </p>
        </div>
        <button 
          onClick={() => router.push("/assessment")}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          Back to Menu
        </button>
      </motion.div>

      {/* Pre-exam screen */}
      {!examStarted && !submitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16 glass-card border border-slate-200 dark:border-slate-700/40 text-center"
        >
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
            <Clock className="w-16 h-16 text-slate-500 mb-6" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">Ready to begin?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md transition-colors">
            {questions.length} multiple-choice questions for this chapter. The timer starts immediately and cannot be paused.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setExamStarted(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-blue-500/25"
          >
            <Play className="w-5 h-5" />
            Start Exam
          </motion.button>
        </motion.div>
      )}

      {/* Active exam */}
      {examStarted && !submitted && (
        <div className="space-y-5">
          {/* Timer & progress bar */}
          <div className="sticky top-[68px] z-40 glass-card border border-slate-200 dark:border-slate-700/40 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-900 dark:text-white text-sm transition-colors">
                Question {currentQ + 1} of {questions.length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
                {answeredCount}/{questions.length} answered
              </span>
              <div
                className={`flex items-center gap-2 font-mono text-lg font-bold px-4 py-1 rounded-lg border ${
                  timeLeft < 60
                    ? "bg-red-500/10 border-red-500/40 text-red-400 animate-pulse"
                    : "bg-slate-800/60 border-slate-700 text-slate-300"
                }`}
              >
                <Clock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full progress-neon"
                animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="glass-card border border-slate-200 dark:border-slate-700/40 p-6 md:p-8"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3 block">
                Question {currentQ + 1}
              </span>
              <h3 className="text-xl text-slate-900 dark:text-white font-medium mb-6 leading-relaxed transition-colors">
                {questions[currentQ].text}
              </h3>

              <div className="space-y-3">
                {questions[currentQ].options.map((opt, oi) => (
                  <motion.label
                    key={oi}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      answers[currentQ] === oi
                        ? "border-blue-500/50 bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.15)]"
                        : "border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/60 hover:border-slate-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${currentQ}`}
                      checked={answers[currentQ] === oi}
                      onChange={() => selectAnswer(oi)}
                      className="w-4 h-4 text-blue-500"
                    />
                    <span className="text-slate-700 dark:text-slate-200 transition-colors">{opt}</span>
                  </motion.label>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
              disabled={currentQ === 0}
              className="flex items-center gap-1 text-slate-400 hover:text-white disabled:opacity-30 transition-colors text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {currentQ < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQ((p) => p + 1)}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm font-medium"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg"
              >
                <CheckCircle className="w-5 h-5" />
                Submit Assessment
              </motion.button>
            )}
          </div>

          {/* Question dots */}
          <div className="flex flex-wrap gap-2 justify-center pt-4">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  i === currentQ
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : answers[i] !== null
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-500 border border-slate-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card border border-slate-200 dark:border-slate-700/40 p-8 md:p-12 text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <Trophy className={`w-20 h-20 mx-auto ${displayPercent >= 70 ? "neon-text-green" : "neon-text-pink"}`} />
          </motion.div>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">Assessment Complete!</h2>
          <div className="text-6xl font-bold neon-text-blue">{displayPercent}%</div>
          <p className="text-slate-600 dark:text-slate-400 transition-colors">
            You answered <strong className="text-slate-900 dark:text-white">{displayScore}</strong> out of{" "}
            <strong className="text-slate-900 dark:text-white">{questions.length}</strong> correctly.
          </p>

          {saveState === "saving" && (
            <p className="text-slate-400 text-sm">Saving your attempt for Learning Outcomes…</p>
          )}
          {saveState === "saved" && saveMessage && (
            <p className="text-emerald-400 text-sm">{saveMessage}</p>
          )}
          {saveState === "error" && saveMessage && (
            <p className="text-amber-400 text-sm">{saveMessage}</p>
          )}

          {/* Per-question review */}
          <div className="text-left space-y-3 max-h-96 overflow-y-auto mt-6">
            {questions.map((q, i) => {
              const ansIndex = answers[i];
              const chosenOption = ansIndex !== null ? q.options[ansIndex] : null;
              const correct = chosenOption === q.correctAnswer;
              
              return (
                <div
                  key={i}
                  className={`p-4 rounded-xl border text-sm ${
                    correct
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-red-500/5 border-red-500/20"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {correct ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-slate-700 dark:text-slate-300 font-medium transition-colors">{q.text}</p>
                      {!correct && (
                        <p className="text-xs text-slate-500 mt-1">
                          Correct: <span className="text-emerald-400">{q.correctAnswer}</span>
                          {chosenOption !== null && (
                            <> — Your answer: <span className="text-red-400">{chosenOption}</span></>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 justify-center mt-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={resetExam}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Retake
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/outcomes")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-colors"
            >
              View Outcomes
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
