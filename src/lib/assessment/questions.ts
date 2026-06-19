export interface AssessmentQuestion {
  id: number;
  chapter: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export type AnswerIndex = number | null;

export type ChapterBreakdown = {
  chapter: string;
  correct: number;
  total: number;
  percent: number;
};

export type IncorrectQuestion = {
  id: number;
  chapter: string;
  question: string;
  correctIndex: number;
  chosenIndex: number | null;
  correctOption: string;
  chosenOption: string | null;
};

export const BASIC_ELECTRICITY_ASSESSMENT_ID = "basic-electricity-comprehensive-v1";
export const BASIC_ELECTRICITY_ASSESSMENT_TITLE = "Comprehensive Basic Electricity Assessment";
export const BASIC_ELECTRICITY_ASSESSMENT_DURATION_MINS = 20;

export const BASIC_ELECTRICITY_QUESTIONS: AssessmentQuestion[] = [
  // Chapter 1: Basic Units & Ohm's Law
  {
    id: 1,
    chapter: "Ch.1 — Units & Ohm's Law",
    question: "What is the SI unit of electrical resistance?",
    options: ["Ampere", "Volt", "Ohm", "Watt"],
    correctIndex: 2,
  },
  {
    id: 2,
    chapter: "Ch.1 — Units & Ohm's Law",
    question: "According to Ohm's Law, if V = 12V and R = 4Ω, what is the current (I)?",
    options: ["48 A", "3 A", "8 A", "0.33 A"],
    correctIndex: 1,
  },
  {
    id: 3,
    chapter: "Ch.1 — Units & Ohm's Law",
    question: "1 Coulomb is approximately equal to how many electrons?",
    options: ["6.242 × 10¹⁸", "1.602 × 10⁻¹⁹", "3.14 × 10¹⁶", "9.81 × 10²⁰"],
    correctIndex: 0,
  },
  {
    id: 4,
    chapter: "Ch.1 — Units & Ohm's Law",
    question: "Which formula correctly represents Ohm's Law?",
    options: ["P = V × I", "V = I × R", "W = P × t", "C = Q / V"],
    correctIndex: 1,
  },

  // Chapter 2: Series & Parallel
  {
    id: 5,
    chapter: "Ch.2 — Series & Parallel",
    question: "Three 100Ω resistors connected in parallel have a total resistance of:",
    options: ["300 Ω", "100 Ω", "33.3 Ω", "150 Ω"],
    correctIndex: 2,
  },
  {
    id: 6,
    chapter: "Ch.2 — Series & Parallel",
    question: "In a series circuit, what is constant across all components?",
    options: ["Voltage", "Resistance", "Current", "Power"],
    correctIndex: 2,
  },
  {
    id: 7,
    chapter: "Ch.2 — Series & Parallel",
    question: "Two resistors of 10Ω and 15Ω in series have total resistance of:",
    options: ["6 Ω", "25 Ω", "12.5 Ω", "5 Ω"],
    correctIndex: 1,
  },
  {
    id: 8,
    chapter: "Ch.2 — Series & Parallel",
    question: "In a parallel circuit, what is the same across all branches?",
    options: ["Current", "Resistance", "Voltage", "Inductance"],
    correctIndex: 2,
  },

  // Chapter 3: Power & Energy
  {
    id: 9,
    chapter: "Ch.3 — Power & Energy",
    question: "If V = 240V and I = 10A, what is the power?",
    options: ["24 W", "2400 W", "250 W", "2.4 W"],
    correctIndex: 1,
  },
  {
    id: 10,
    chapter: "Ch.3 — Power & Energy",
    question: "Which formula is NOT a valid power equation?",
    options: ["P = V × I", "P = I² × R", "P = V² / R", "P = R² × I"],
    correctIndex: 3,
  },
  {
    id: 11,
    chapter: "Ch.3 — Power & Energy",
    question: "A 100W lamp running for 10 hours consumes how many kWh?",
    options: ["1000 kWh", "1 kWh", "10 kWh", "0.1 kWh"],
    correctIndex: 1,
  },
  {
    id: 12,
    chapter: "Ch.3 — Power & Energy",
    question: "A motor with 750W input producing 600W output has efficiency of:",
    options: ["60%", "75%", "80%", "125%"],
    correctIndex: 2,
  },

  // Chapter 4: Safety
  {
    id: 13,
    chapter: "Ch.4 — Circuit Safety",
    question: "What device automatically trips during overload and can be reset?",
    options: ["Fuse", "MCB", "Transformer", "Capacitor"],
    correctIndex: 1,
  },
  {
    id: 14,
    chapter: "Ch.4 — Circuit Safety",
    question: "An ELCB/RCD trips when earth leakage exceeds:",
    options: ["300 mA", "30 mA", "3 A", "0.3 A"],
    correctIndex: 1,
  },
  {
    id: 15,
    chapter: "Ch.4 — Circuit Safety",
    question: "What is the primary purpose of earthing/grounding?",
    options: ["Increase voltage", "Prevent electric shock", "Reduce power consumption", "Amplify signals"],
    correctIndex: 1,
  },
  {
    id: 16,
    chapter: "Ch.4 — Circuit Safety",
    question: "MCB Type B is primarily designed for:",
    options: ["Motor loads", "Transformer loads", "Residential/lighting loads", "Industrial heavy equipment"],
    correctIndex: 2,
  },

  // Chapter 5: Components
  {
    id: 17,
    chapter: "Ch.5 — Components",
    question: "A 4-band resistor with Brown-Black-Red-Gold reads:",
    options: ["10 Ω ±5%", "100 Ω ±5%", "1 kΩ ±5%", "10 kΩ ±5%"],
    correctIndex: 2,
  },
  {
    id: 18,
    chapter: "Ch.5 — Components",
    question: "The forward voltage drop of a standard silicon diode is approximately:",
    options: ["0.3 V", "0.7 V", "1.2 V", "5.0 V"],
    correctIndex: 1,
  },
  {
    id: 19,
    chapter: "Ch.5 — Components",
    question: "Which component stores energy in an electric field?",
    options: ["Resistor", "Inductor", "Capacitor", "Diode"],
    correctIndex: 2,
  },
  {
    id: 20,
    chapter: "Ch.5 — Components",
    question: "A transistor (BJT) has which three terminals?",
    options: ["Anode, Cathode, Gate", "Source, Drain, Gate", "Base, Collector, Emitter", "Input, Output, Ground"],
    correctIndex: 2,
  },
];

export function evaluateAttempt(answers: AnswerIndex[]) {
  const total = BASIC_ELECTRICITY_QUESTIONS.length;
  const normalized: AnswerIndex[] = Array.from({ length: total }, (_, i) =>
    i < answers.length ? answers[i] ?? null : null
  );

  const score = normalized.reduce<number>((acc, ans, i) => {
    const q = BASIC_ELECTRICITY_QUESTIONS[i];
    return acc + (ans === q.correctIndex ? 1 : 0);
  }, 0);

  const percent = Math.round((score / total) * 100);

  const incorrectQuestions: IncorrectQuestion[] = BASIC_ELECTRICITY_QUESTIONS.flatMap((q, i) => {
    const chosenIndex = normalized[i];
    const isCorrect = chosenIndex === q.correctIndex;
    if (isCorrect) return [];

    return [
      {
        id: q.id,
        chapter: q.chapter,
        question: q.question,
        correctIndex: q.correctIndex,
        chosenIndex,
        correctOption: q.options[q.correctIndex] ?? "",
        chosenOption:
          typeof chosenIndex === "number" && chosenIndex >= 0 && chosenIndex < q.options.length
            ? q.options[chosenIndex] ?? null
            : null,
      },
    ];
  });

  const chapterMap = new Map<string, { correct: number; total: number }>();
  BASIC_ELECTRICITY_QUESTIONS.forEach((q, i) => {
    const current = chapterMap.get(q.chapter) ?? { correct: 0, total: 0 };
    const chosen = normalized[i];
    const isCorrect = chosen === q.correctIndex;
    chapterMap.set(q.chapter, {
      correct: current.correct + (isCorrect ? 1 : 0),
      total: current.total + 1,
    });
  });

  const chapterBreakdown: ChapterBreakdown[] = Array.from(chapterMap.entries()).map(
    ([chapter, v]) => ({
      chapter,
      correct: v.correct,
      total: v.total,
      percent: Math.round((v.correct / v.total) * 100),
    })
  );

  return {
    score,
    total,
    percent,
    incorrectQuestions,
    chapterBreakdown,
  };
}
