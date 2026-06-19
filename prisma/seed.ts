import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const assessments = [
  {
    id: "ch1-assessment",
    title: "Chapter 1: Basic Concepts of Matter and Atoms",
    durationMins: 20,
    questions: [
      {
        id: "ch1-q1",
        text: "What is an element?",
        options: JSON.stringify([
          "A pure substance consisting of only one type of atom",
          "A mixture of different materials",
          "A molecule with multiple atoms bonded",
          "Anything that occupies space",
        ]),
        correctAnswer: "A pure substance consisting of only one type of atom",
      },
      {
        id: "ch1-q2",
        text: "Which of the following describes a free electron?",
        options: JSON.stringify([
          "An electron in the innermost shell",
          "An electron tightly bound to the nucleus",
          "An electron in the outermost shell that can easily break free",
          "An electron that has zero charge",
        ]),
        correctAnswer: "An electron in the outermost shell that can easily break free",
      },
      {
        id: "ch1-q3",
        text: "In a neutral atom, the number of protons is equal to:",
        options: JSON.stringify([
          "The number of neutrons",
          "The number of electrons",
          "The atomic mass",
          "The number of free electrons",
        ]),
        correctAnswer: "The number of electrons",
      },
      {
        id: "ch1-q4",
        text: "What is the standard unit of electric charge?",
        options: JSON.stringify(["Volt", "Ampere", "Coulomb", "Ohm"]),
        correctAnswer: "Coulomb",
      },
    ],
  },
  {
    id: "ch2-assessment",
    title: "Chapter 2: Types of Electrical Materials",
    durationMins: 20,
    questions: [
      {
        id: "ch2-q1",
        text: "Which of these materials is an excellent conductor?",
        options: JSON.stringify(["Rubber", "Glass", "Copper", "Silicon"]),
        correctAnswer: "Copper",
      },
      {
        id: "ch2-q2",
        text: "How many valence electrons do typical insulators have?",
        options: JSON.stringify(["1 to 3", "4", "5 to 8", "0"]),
        correctAnswer: "5 to 8",
      },
      {
        id: "ch2-q3",
        text: "Under what conditions can semiconductors conduct electricity?",
        options: JSON.stringify([
          "They are always perfect conductors",
          "Only when placed in a vacuum",
          "They can conduct when temperature changes or impurities are added",
          "They can never conduct electricity",
        ]),
        correctAnswer: "They can conduct when temperature changes or impurities are added",
      },
      {
        id: "ch2-q4",
        text: "Which two elements are the most common semiconductors?",
        options: JSON.stringify([
          "Copper and Aluminum",
          "Silicon and Germanium",
          "Gold and Silver",
          "Carbon and Oxygen",
        ]),
        correctAnswer: "Silicon and Germanium",
      },
    ],
  },
  {
    id: "ch3-assessment",
    title: "Chapter 3: Basic Electrical Quantities and Characteristics",
    durationMins: 20,
    questions: [
      {
        id: "ch3-q1",
        text: "What is Electric Voltage (V)?",
        options: JSON.stringify([
          "The rate of flow of electric charge",
          "The electrical pressure or force that drives electrons",
          "The opposition to the flow of current",
          "The rate at which energy is consumed",
        ]),
        correctAnswer: "The electrical pressure or force that drives electrons",
      },
      {
        id: "ch3-q2",
        text: "What is the unit of Electrical Resistance (R)?",
        options: JSON.stringify(["Volt", "Ampere", "Ohm", "Watt"]),
        correctAnswer: "Ohm",
      },
      {
        id: "ch3-q3",
        text: "Which statement accurately describes Direct Current (DC)?",
        options: JSON.stringify([
          "It periodically reverses its direction",
          "It is the standard electricity delivered by power grids",
          "It flows continuously in one constant direction",
          "It cannot be produced by batteries",
        ]),
        correctAnswer: "It flows continuously in one constant direction",
      },
      {
        id: "ch3-q4",
        text: "What does Electric Power (P) measure?",
        options: JSON.stringify([
          "The potential difference in a circuit",
          "The speed of electrons",
          "The opposition to current flow",
          "The rate at which electrical energy is consumed or generated",
        ]),
        correctAnswer: "The rate at which electrical energy is consumed or generated",
      },
    ],
  },
  {
    id: "ch4-assessment",
    title: "Chapter 4: Basic Laws of Electricity",
    durationMins: 20,
    questions: [
      {
        id: "ch4-q1",
        text: "According to Ohm's Law, what is the formula relating Voltage (V), Current (I), and Resistance (R)?",
        options: JSON.stringify(["V = I + R", "V = I × R", "I = V × R", "R = V × I"]),
        correctAnswer: "V = I × R",
      },
      {
        id: "ch4-q2",
        text: "The Power Law (Joule's Law) states that Power (P) equals:",
        options: JSON.stringify(["V / I", "I / V", "V × I", "V × R"]),
        correctAnswer: "V × I",
      },
      {
        id: "ch4-q3",
        text: "Kirchhoff's Current Law (KCL) states that at any node:",
        options: JSON.stringify([
          "Total resistance equals zero",
          "Voltage drops equal voltage rises",
          "Total current entering equals total current leaving",
          "Current is constant throughout the entire circuit",
        ]),
        correctAnswer: "Total current entering equals total current leaving",
      },
      {
        id: "ch4-q4",
        text: "Kirchhoff's Voltage Law (KVL) implies that the algebraic sum of voltages in a closed loop is:",
        options: JSON.stringify(["Equal to the current", "Zero", "Infinite", "Equal to the total resistance"]),
        correctAnswer: "Zero",
      },
    ],
  },
  {
    id: "ch5-assessment",
    title: "Chapter 5: Series, Parallel, and Mixed Circuits",
    durationMins: 20,
    questions: [
      {
        id: "ch5-q1",
        text: "In a pure series circuit, which electrical quantity remains the same across all components?",
        options: JSON.stringify(["Voltage", "Resistance", "Current", "Power"]),
        correctAnswer: "Current",
      },
      {
        id: "ch5-q2",
        text: "In a parallel circuit, what remains constant across all branches?",
        options: JSON.stringify(["Current", "Voltage", "Resistance", "Energy"]),
        correctAnswer: "Voltage",
      },
      {
        id: "ch5-q3",
        text: "How do you calculate the total resistance of resistors connected in series?",
        options: JSON.stringify([
          "By taking the reciprocal of their sum",
          "By multiplying them together",
          "By adding their individual resistance values",
          "By subtracting the smallest from the largest",
        ]),
        correctAnswer: "By adding their individual resistance values",
      },
      {
        id: "ch5-q4",
        text: "When analyzing a mixed (series-parallel) circuit, what is the best strategy?",
        options: JSON.stringify([
          "Add all resistances directly",
          "Assume it is entirely a series circuit",
          "Assume it is entirely a parallel circuit",
          "Break it down into simpler series and parallel parts and solve step-by-step",
        ]),
        correctAnswer: "Break it down into simpler series and parallel parts and solve step-by-step",
      },
    ],
  },
  {
    id: "ch6-assessment",
    title: "Chapter 6: Basic Electrical Installation",
    durationMins: 20,
    questions: [
      {
        id: "ch6-q1",
        text: "What is the primary function of an MCB (Miniature Circuit Breaker) in a distribution board (PHB)?",
        options: JSON.stringify([
          "To amplify voltage",
          "To provide overcurrent protection",
          "To reduce power consumption",
          "To act as a light switch",
        ]),
        correctAnswer: "To provide overcurrent protection",
      },
      {
        id: "ch6-q2",
        text: "What is the difference between a Single Line Diagram (SLD) and a Wiring Diagram?",
        options: JSON.stringify([
          "An SLD shows physical connections; a Wiring Diagram is simplified",
          "An SLD simplifies power paths into one line; a Wiring Diagram shows actual physical wire routing",
          "They are exactly the same thing",
          "SLDs are only used for DC circuits",
        ]),
        correctAnswer: "An SLD simplifies power paths into one line; a Wiring Diagram shows actual physical wire routing",
      },
      {
        id: "ch6-q3",
        text: "In Indonesia, what standard governs electrical installations?",
        options: JSON.stringify(["IEEE", "ISO 9001", "PUIL", "K3"]),
        correctAnswer: "PUIL",
      },
      {
        id: "ch6-q4",
        text: "What does a series switch allow you to do?",
        options: JSON.stringify([
          "Control multiple lights with a single flip",
          "Control multiple lights independently from one location",
          "Adjust the brightness of a light",
          "Increase the voltage to the load",
        ]),
        correctAnswer: "Control multiple lights independently from one location",
      },
    ],
  },
  {
    id: "ch7-assessment",
    title: "Chapter 7: Basic Electronics and Optical Applications",
    durationMins: 20,
    questions: [
      {
        id: "ch7-q1",
        text: "Which of the following is a passive electronic component?",
        options: JSON.stringify(["Transistor", "Diode", "Resistor", "Optocoupler"]),
        correctAnswer: "Resistor",
      },
      {
        id: "ch7-q2",
        text: "What is a primary function of a diode?",
        options: JSON.stringify([
          "To amplify a weak signal",
          "To allow current to flow in only one direction (rectification)",
          "To store electrical energy in a magnetic field",
          "To increase resistance based on light levels",
        ]),
        correctAnswer: "To allow current to flow in only one direction (rectification)",
      },
      {
        id: "ch7-q3",
        text: "How does a Light-Dependent Resistor (LDR) work?",
        options: JSON.stringify([
          "It emits light when current passes through it",
          "Its resistance changes based on the ambient light level",
          "It converts AC to DC",
          "It transfers signals using internal light pulses",
        ]),
        correctAnswer: "Its resistance changes based on the ambient light level",
      },
      {
        id: "ch7-q4",
        text: "What role does a transistor typically play in a circuit?",
        options: JSON.stringify([
          "A voltage source",
          "A fast electronic switch or signal amplifier",
          "A component that stores energy for long periods",
          "A purely passive voltage divider",
        ]),
        correctAnswer: "A fast electronic switch or signal amplifier",
      },
    ],
  },
];

async function main() {
  console.log("🔌 Seeding database with chapter assessments...\n");

  for (const assessment of assessments) {
    // Upsert the assessment
    const upsertedAssessment = await prisma.assessment.upsert({
      where: { id: assessment.id },
      update: {
        title: assessment.title,
        durationMins: assessment.durationMins,
      },
      create: {
        id: assessment.id,
        title: assessment.title,
        durationMins: assessment.durationMins,
      },
    });

    // Upsert each question
    for (const question of assessment.questions) {
      await prisma.question.upsert({
        where: { id: question.id },
        update: {
          text: question.text,
          options: question.options,
          correctAnswer: question.correctAnswer,
        },
        create: {
          id: question.id,
          assessmentId: upsertedAssessment.id,
          text: question.text,
          options: question.options,
          correctAnswer: question.correctAnswer,
        },
      });
    }

    console.log(`  ✅ ${upsertedAssessment.title} (${assessment.questions.length} questions)`);
  }

  console.log("\n🎉 Database seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
