import { prisma } from "../src/lib/prisma";
import { aiChatCompletion } from "../src/lib/ai";
import { generateLearningOutcomesFeedback } from "../src/lib/outcomes/evaluator";

async function main() {
  console.log("=========================================");
  console.log("🧪 ANTIGRAVITY PLATFORM VALIDATION SUITE");
  console.log("=========================================");

  // 1. Database Connection & Content Check
  console.log("\n1. Checking Database Connectivity...");
  try {
    const chaptersCount = await prisma.chapter.count();
    const subChaptersCount = await prisma.subChapter.count();
    const quizzesCount = await prisma.quiz.count();
    const usersCount = await prisma.user.count();

    console.log(`✅ Database connection successful!`);
    console.log(`   - Chapters: ${chaptersCount}`);
    console.log(`   - SubChapters: ${subChaptersCount}`);
    console.log(`   - Quizzes: ${quizzesCount}`);
    console.log(`   - Users: ${usersCount}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }

  // 2. AI Router Integration Test
  console.log("\n2. Testing AI Completion Router...");
  try {
    const start = Date.now();
    const response = await aiChatCompletion({
      messages: [
        { role: "system", content: "You are a helpful test assistant." },
        { role: "user", content: "Say the word 'ANTIGRAVITY' and nothing else." },
      ],
      temperature: 0.1,
      maxTokens: 10,
    });
    const duration = Date.now() - start;
    console.log(`✅ AI Router responded successfully in ${duration}ms!`);
    console.log(`   Response: "${response.trim()}"`);
  } catch (error) {
    console.error("❌ AI Router test failed:", error);
  }

  // 3. AI Outcome Evaluator Test
  console.log("\n3. Testing AI Outcome Evaluator...");
  try {
    const attemptData = {
      score: 1,
      total: 5,
      percent: 20,
      timeSpentSecs: 120,
      incorrectQuestions: [
        {
          questionText: "What is the unit of electric current?",
          submittedAnswer: "Volt",
          correctAnswer: "Ampere",
        },
      ],
    };

    const quizContext = {
      assessmentTitle: "Basic Units & Ohm's Law Quiz",
      durationMins: 10,
      chapterTitle: "Core Electrodynamic Quantities",
      subChapterTitle: "Electric Current",
      subChapterObjective: "Understand electric current and its measurement.",
    };

    const allSubChapters = [
      { id: "sub_1", title: "Electric Current", objective: "Understand electric current and its measurement." },
      { id: "sub_2", title: "Voltage", objective: "Define potential difference and its source." },
      { id: "sub_3", title: "Resistance", objective: "Explain resistance and resistors." },
      { id: "sub_4", title: "Ohm's Law", objective: "State and apply Ohm's law." },
    ];

    console.log("   Running outcome evaluation model...");
    const start = Date.now();
    const result = await generateLearningOutcomesFeedback({
      attemptData,
      quizContext,
      allSubChapters,
    });
    const duration = Date.now() - start;

    console.log(`✅ Outcome Evaluator completed in ${duration}ms!`);
    console.log(`   - Feedback preview: "${result.feedback.substring(0, 120).replace(/\n/g, " ")}..."`);
    console.log(`   - Recommended SubChapters:`, result.recommendedSubChapters);
  } catch (error) {
    console.error("❌ Outcome Evaluator test failed:", error);
  }

  console.log("\n=========================================");
  console.log("🎉 Validation Suite Completed!");
  console.log("=========================================");
}

main()
  .catch((e) => {
    console.error("Validation error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
