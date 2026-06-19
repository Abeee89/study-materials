import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/* ═══════════ CHAPTER CONTENT (from materials) ═══════════ */

const chaptersData = [
  {
    sortOrder: 1,
    title: "Chapter 1: Basic Concepts of Matter and Atoms",
    color: "cyan",
    level: "dasar",
    subChapters: [
      {
        sortOrder: 1,
        title: "Matter, Elements, and Molecules",
        objective: "Understand the fundamental definitions of matter, elements, and molecules.",
        content: "Matter is anything that has mass and occupies space. An element is a pure substance consisting of only one type of atom, such as copper or gold. Molecules are formed when two or more atoms bond together chemically. Understanding these building blocks is essential before diving into how electrical phenomena occur at the atomic level.",
        source: "Basic Physics for Electronics",
      },
      {
        sortOrder: 2,
        title: "Atomic Structure",
        objective: "Identify the components of an atom: Protons, Neutrons, and Electrons.",
        content: "Atoms consist of a central nucleus containing positively charged protons and neutral neutrons, surrounded by negatively charged electrons orbiting in various shells. In neutral atoms, the number of protons equals the number of electrons. The outermost shell, known as the valence shell, dictates the electrical and chemical properties of the atom.",
        source: "Basic Physics for Electronics",
      },
      {
        sortOrder: 3,
        title: "Free Electron Theory & Electric Charge",
        objective: "Explain how free electrons produce electric current and define Electric Charge (Q).",
        content: "Electrons in the outermost shell that are loosely bound to the nucleus can easily break free; these are called free electrons. The movement of these free electrons from atom to atom creates an electric current. Electric charge (Q) is a fundamental property of matter, measured in Coulombs (C). One Coulomb is equivalent to the charge of approximately 6.242 × 10¹⁸ electrons.",
        source: "Thomas L. Floyd, 'Principles of Electric Circuits'",
      },
    ],
  },
  {
    sortOrder: 2,
    title: "Chapter 2: Types of Electrical Materials",
    color: "blue",
    level: "dasar",
    subChapters: [
      {
        sortOrder: 1,
        title: "Conductors",
        objective: "Identify materials that conduct electricity well.",
        content: "Conductors are materials that allow electric current to flow easily. This is because they have many free electrons in their valence shells (typically 1 to 3 electrons). Common examples include copper, aluminum, silver, and gold. Copper is the most widely used conductor in electrical wiring due to its excellent conductivity and affordability.",
        source: "Materials Science in Electrical Engineering",
      },
      {
        sortOrder: 2,
        title: "Insulators",
        objective: "Identify materials that inhibit the flow of electricity.",
        content: "Insulators are materials that resist the flow of electric current. Their valence electrons (typically 5 to 8) are tightly bound to the atomic nucleus, leaving very few free electrons available for conduction. Common examples include rubber, plastic, glass, ceramics, and PVC (Polyvinyl Chloride), which is widely used to coat electrical wires for safety.",
        source: "Materials Science in Electrical Engineering",
      },
      {
        sortOrder: 3,
        title: "Semiconductors",
        objective: "Understand materials that can act as both conductors and insulators.",
        content: "Semiconductors have electrical properties between those of conductors and insulators (typically 4 valence electrons). Under certain conditions, such as changes in temperature or the addition of impurities (doping), they can conduct electricity. Silicon and germanium are the most common semiconductors and are the foundational raw materials for creating modern electronic components like diodes, transistors, and integrated circuits.",
        source: "Boylestad & Nashelsky, 'Electronic Devices and Circuit Theory'",
      },
    ],
  },
  {
    sortOrder: 3,
    title: "Chapter 3: Basic Electrical Quantities and Characteristics",
    color: "purple",
    level: "intermediate",
    subChapters: [
      {
        sortOrder: 1,
        title: "Voltage (V) & Current (I)",
        objective: "Define electric voltage and current.",
        content: "Electric Voltage (V), or potential difference, is the electrical pressure or force that drives free electrons to move through a conductor, measured in Volts. Electric Current (I) is the rate at which this electric charge flows past a point in a circuit over time, measured in Amperes (A). Without voltage, current cannot flow.",
        source: "Thomas L. Floyd, 'Principles of Electric Circuits'",
      },
      {
        sortOrder: 2,
        title: "Resistance (R) & Power (P)",
        objective: "Define electrical resistance and power.",
        content: "Resistance (R) is the property of a material that opposes or inhibits the flow of electric current, measured in Ohms (Ω). All materials have some resistance, except superconductors. Electric Power (P) is the rate at which electrical energy is consumed or generated by a circuit component, measured in Watts (W).",
        source: "Thomas L. Floyd, 'Principles of Electric Circuits'",
      },
      {
        sortOrder: 3,
        title: "Direct Current (DC) vs Alternating Current (AC)",
        objective: "Differentiate between DC and AC currents.",
        content: "Direct Current (DC) flows continuously in one constant direction; it is typically supplied by batteries, solar panels, and DC power supplies. Alternating Current (AC) periodically reverses its direction of flow and changes its magnitude over time, typically in a sine wave pattern. AC is the standard type of electricity delivered to homes and businesses by power grids.",
        source: "Fundamental Electrical Engineering",
      },
    ],
  },
  {
    sortOrder: 4,
    title: "Chapter 4: Basic Laws of Electricity",
    color: "pink",
    level: "intermediate",
    subChapters: [
      {
        sortOrder: 1,
        title: "Ohm's Law & Power Law",
        objective: "Explain the linear relationship between V, I, R, and Power.",
        content: "Ohm's Law states that Voltage (V) equals Current (I) multiplied by Resistance (R): V = I × R. This defines the fundamental linear relationship in DC circuits. The Power Law (or Joule's Law) calculates electrical power (P) as the product of Voltage and Current: P = V × I. These two laws can be combined to find P = I²R or P = V²/R.",
        source: "Thomas L. Floyd, 'Principles of Electric Circuits'",
      },
      {
        sortOrder: 2,
        title: "Kirchhoff's Current Law (KCL)",
        objective: "Understand KCL regarding the branching of current.",
        content: "Kirchhoff's Current Law (KCL) states that the total current entering a junction or node in a circuit must exactly equal the total current leaving that node (Σ I_in = Σ I_out). This is based on the principle of conservation of electric charge, meaning charge cannot be created or destroyed at a junction.",
        source: "Robert L. Boylestad, 'Introductory Circuit Analysis'",
      },
      {
        sortOrder: 3,
        title: "Kirchhoff's Voltage Law (KVL)",
        objective: "Understand KVL regarding total voltage in a closed loop.",
        content: "Kirchhoff's Voltage Law (KVL) states that the algebraic sum of all voltages around any closed loop in a circuit must equal zero (Σ V = 0). This means that the total voltage supplied by the source must equal the sum of the voltage drops across all components in that loop, reflecting the conservation of energy.",
        source: "Robert L. Boylestad, 'Introductory Circuit Analysis'",
      },
    ],
  },
  {
    sortOrder: 5,
    title: "Chapter 5: Series, Parallel, and Mixed Circuits",
    color: "green",
    level: "mastery",
    subChapters: [
      {
        sortOrder: 1,
        title: "Series Circuits",
        objective: "Analyze voltage and current in series configurations.",
        content: "In a series circuit, there is only one path for current. Therefore, the current (I) is exactly the same at every point. However, the total voltage divides across each component (voltage divider characteristic). The total resistance is simply the sum of all individual resistances: R_total = R₁ + R₂ + R₃ + ...",
        source: "Robert L. Boylestad, 'Introductory Circuit Analysis'",
      },
      {
        sortOrder: 2,
        title: "Parallel Circuits",
        objective: "Analyze voltage and current in parallel configurations.",
        content: "In a parallel circuit, there are multiple branches for current to flow. Therefore, the total current divides among the branches (current divider characteristic). However, the voltage (V) is identical across every parallel branch. The total equivalent resistance is calculated as: 1/R_total = 1/R₁ + 1/R₂ + 1/R₃ + ...",
        source: "Robert L. Boylestad, 'Introductory Circuit Analysis'",
      },
      {
        sortOrder: 3,
        title: "Mixed Circuits (Combination)",
        objective: "Simplify and analyze series-parallel combination circuits.",
        content: "Mixed circuits contain both series and parallel sections. Analyzing them involves breaking the circuit down into simpler parts. You first identify pure series or pure parallel branches, calculate their equivalent resistances, and redraw the simplified circuit. You repeat this process until you have a single equivalent total resistance.",
        source: "Robert L. Boylestad, 'Introductory Circuit Analysis'",
      },
    ],
  },
  {
    sortOrder: 6,
    title: "Chapter 6: Basic Electrical Installation",
    color: "cyan",
    level: "mastery",
    subChapters: [
      {
        sortOrder: 1,
        title: "Installation Components",
        objective: "Familiarize with common electrical installation components.",
        content: "Common components in household installations include switches (single switches to control one light, series switches to control multiple lights independently), sockets (receptacles for appliances), light fittings (housings for bulbs), and PHB (Perlengkapan Hubung Bagi) or distribution boards containing protection devices like MCBs (Miniature Circuit Breakers).",
        source: "SNI 0225:2011 (PUIL 2011)",
      },
      {
        sortOrder: 2,
        title: "Symbols and Diagrams",
        objective: "Read and create basic installation diagrams.",
        content: "Electrical planning uses standard symbols. A Single Line Diagram (SLD) simplifies a complex system by showing power paths using a single line, rather than showing all individual wires. A Wiring Diagram shows the actual physical connections, routing, and wire counts (Live, Neutral, Ground) between all components.",
        source: "SNI 0225:2011 (PUIL 2011)",
      },
      {
        sortOrder: 3,
        title: "K3 & PUIL Standards",
        objective: "Understand occupational safety and general installation requirements.",
        content: "K3 (Kesehatan dan Keselamatan Kerja) in electricity focuses on preventing electric shocks, burns, and electrical fires. PUIL (Persyaratan Umum Instalasi Listrik) is the Indonesian standard governing how installations must be designed, implemented, and maintained to ensure safety, reliability, and proper functionality.",
        source: "SNI 0225:2011 (PUIL 2011)",
      },
    ],
  },
  {
    sortOrder: 7,
    title: "Chapter 7: Basic Electronics and Optical Applications",
    color: "blue",
    level: "mastery",
    subChapters: [
      {
        sortOrder: 1,
        title: "Passive Electronic Components",
        objective: "Identify Resistors, Capacitors, and Inductors and their applications.",
        content: "Passive components do not generate power or amplify signals. Resistors limit current and act as voltage dividers. Capacitors store energy in an electric field and block DC while passing AC, making them useful in filters. Inductors store energy in a magnetic field and are used in chokes, transformers, and frequency filters.",
        source: "Boylestad & Nashelsky, 'Electronic Devices and Circuit Theory'",
      },
      {
        sortOrder: 2,
        title: "Active Electronic Components",
        objective: "Understand Diodes and Transistors.",
        content: "Active components can control current flow. Diodes allow current to flow in only one direction and are heavily used as rectifiers to convert AC to DC. Transistors (like BJTs and MOSFETs) use a small input current or voltage to control a large output current, allowing them to act as fast electronic switches or signal amplifiers.",
        source: "Boylestad & Nashelsky, 'Electronic Devices and Circuit Theory'",
      },
      {
        sortOrder: 3,
        title: "Optical Electronics (Optoelectronics)",
        objective: "Learn about light-interacting electronic components.",
        content: "Optoelectronic devices interact with light. LEDs (Light-Emitting Diodes) emit light when forward-biased. LDRs (Light-Dependent Resistors) change their resistance based on ambient light levels, acting as light sensors. Photodiodes convert light into current. Optocouplers transfer electrical signals between isolated circuits using light, preventing high-voltage damage.",
        source: "Boylestad & Nashelsky, 'Electronic Devices and Circuit Theory'",
      },
      {
        sortOrder: 4,
        title: "Simple Circuit Practice",
        objective: "Apply component knowledge to create small practical projects.",
        content: "Combining these components allows for practical projects. For example, connecting an LDR to a transistor's base can create an automatic night-light circuit that turns on an LED when it gets dark. Using a transformer, diodes (bridge rectifier), and a capacitor can create a simple AC-to-DC power supply adapter.",
        source: "Practical Electronics for Inventors",
      },
    ],
  },
];

/* ═══════════ ASSESSMENT DATA ═══════════ */

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
      { id: "ch2-q1", text: "Which of these materials is an excellent conductor?", options: JSON.stringify(["Rubber", "Glass", "Copper", "Silicon"]), correctAnswer: "Copper" },
      { id: "ch2-q2", text: "How many valence electrons do typical insulators have?", options: JSON.stringify(["1 to 3", "4", "5 to 8", "0"]), correctAnswer: "5 to 8" },
      { id: "ch2-q3", text: "Under what conditions can semiconductors conduct electricity?", options: JSON.stringify(["They are always perfect conductors", "Only when placed in a vacuum", "They can conduct when temperature changes or impurities are added", "They can never conduct electricity"]), correctAnswer: "They can conduct when temperature changes or impurities are added" },
      { id: "ch2-q4", text: "Which two elements are the most common semiconductors?", options: JSON.stringify(["Copper and Aluminum", "Silicon and Germanium", "Gold and Silver", "Carbon and Oxygen"]), correctAnswer: "Silicon and Germanium" },
    ],
  },
  {
    id: "ch3-assessment",
    title: "Chapter 3: Basic Electrical Quantities and Characteristics",
    durationMins: 20,
    questions: [
      { id: "ch3-q1", text: "What is Electric Voltage (V)?", options: JSON.stringify(["The rate of flow of electric charge", "The electrical pressure or force that drives electrons", "The opposition to the flow of current", "The rate at which energy is consumed"]), correctAnswer: "The electrical pressure or force that drives electrons" },
      { id: "ch3-q2", text: "What is the unit of Electrical Resistance (R)?", options: JSON.stringify(["Volt", "Ampere", "Ohm", "Watt"]), correctAnswer: "Ohm" },
      { id: "ch3-q3", text: "Which statement accurately describes Direct Current (DC)?", options: JSON.stringify(["It periodically reverses its direction", "It is the standard electricity delivered by power grids", "It flows continuously in one constant direction", "It cannot be produced by batteries"]), correctAnswer: "It flows continuously in one constant direction" },
      { id: "ch3-q4", text: "What does Electric Power (P) measure?", options: JSON.stringify(["The potential difference in a circuit", "The speed of electrons", "The opposition to current flow", "The rate at which electrical energy is consumed or generated"]), correctAnswer: "The rate at which electrical energy is consumed or generated" },
    ],
  },
  {
    id: "ch4-assessment",
    title: "Chapter 4: Basic Laws of Electricity",
    durationMins: 20,
    questions: [
      { id: "ch4-q1", text: "According to Ohm's Law, what is the formula relating Voltage (V), Current (I), and Resistance (R)?", options: JSON.stringify(["V = I + R", "V = I × R", "I = V × R", "R = V × I"]), correctAnswer: "V = I × R" },
      { id: "ch4-q2", text: "The Power Law (Joule's Law) states that Power (P) equals:", options: JSON.stringify(["V / I", "I / V", "V × I", "V × R"]), correctAnswer: "V × I" },
      { id: "ch4-q3", text: "Kirchhoff's Current Law (KCL) states that at any node:", options: JSON.stringify(["Total resistance equals zero", "Voltage drops equal voltage rises", "Total current entering equals total current leaving", "Current is constant throughout the entire circuit"]), correctAnswer: "Total current entering equals total current leaving" },
      { id: "ch4-q4", text: "Kirchhoff's Voltage Law (KVL) implies that the algebraic sum of voltages in a closed loop is:", options: JSON.stringify(["Equal to the current", "Zero", "Infinite", "Equal to the total resistance"]), correctAnswer: "Zero" },
    ],
  },
  {
    id: "ch5-assessment",
    title: "Chapter 5: Series, Parallel, and Mixed Circuits",
    durationMins: 20,
    questions: [
      { id: "ch5-q1", text: "In a pure series circuit, which electrical quantity remains the same across all components?", options: JSON.stringify(["Voltage", "Resistance", "Current", "Power"]), correctAnswer: "Current" },
      { id: "ch5-q2", text: "In a parallel circuit, what remains constant across all branches?", options: JSON.stringify(["Current", "Voltage", "Resistance", "Energy"]), correctAnswer: "Voltage" },
      { id: "ch5-q3", text: "How do you calculate the total resistance of resistors connected in series?", options: JSON.stringify(["By taking the reciprocal of their sum", "By multiplying them together", "By adding their individual resistance values", "By subtracting the smallest from the largest"]), correctAnswer: "By adding their individual resistance values" },
      { id: "ch5-q4", text: "When analyzing a mixed (series-parallel) circuit, what is the best strategy?", options: JSON.stringify(["Add all resistances directly", "Assume it is entirely a series circuit", "Assume it is entirely a parallel circuit", "Break it down into simpler series and parallel parts and solve step-by-step"]), correctAnswer: "Break it down into simpler series and parallel parts and solve step-by-step" },
    ],
  },
  {
    id: "ch6-assessment",
    title: "Chapter 6: Basic Electrical Installation",
    durationMins: 20,
    questions: [
      { id: "ch6-q1", text: "What is the primary function of an MCB (Miniature Circuit Breaker) in a distribution board (PHB)?", options: JSON.stringify(["To amplify voltage", "To provide overcurrent protection", "To reduce power consumption", "To act as a light switch"]), correctAnswer: "To provide overcurrent protection" },
      { id: "ch6-q2", text: "What is the difference between a Single Line Diagram (SLD) and a Wiring Diagram?", options: JSON.stringify(["An SLD shows physical connections; a Wiring Diagram is simplified", "An SLD simplifies power paths into one line; a Wiring Diagram shows actual physical wire routing", "They are exactly the same thing", "SLDs are only used for DC circuits"]), correctAnswer: "An SLD simplifies power paths into one line; a Wiring Diagram shows actual physical wire routing" },
      { id: "ch6-q3", text: "In Indonesia, what standard governs electrical installations?", options: JSON.stringify(["IEEE", "ISO 9001", "PUIL", "K3"]), correctAnswer: "PUIL" },
      { id: "ch6-q4", text: "What does a series switch allow you to do?", options: JSON.stringify(["Control multiple lights with a single flip", "Control multiple lights independently from one location", "Adjust the brightness of a light", "Increase the voltage to the load"]), correctAnswer: "Control multiple lights independently from one location" },
    ],
  },
  {
    id: "ch7-assessment",
    title: "Chapter 7: Basic Electronics and Optical Applications",
    durationMins: 20,
    questions: [
      { id: "ch7-q1", text: "Which of the following is a passive electronic component?", options: JSON.stringify(["Transistor", "Diode", "Resistor", "Optocoupler"]), correctAnswer: "Resistor" },
      { id: "ch7-q2", text: "What is a primary function of a diode?", options: JSON.stringify(["To amplify a weak signal", "To allow current to flow in only one direction (rectification)", "To store electrical energy in a magnetic field", "To increase resistance based on light levels"]), correctAnswer: "To allow current to flow in only one direction (rectification)" },
      { id: "ch7-q3", text: "How does a Light-Dependent Resistor (LDR) work?", options: JSON.stringify(["It emits light when current passes through it", "Its resistance changes based on the ambient light level", "It converts AC to DC", "It transfers signals using internal light pulses"]), correctAnswer: "Its resistance changes based on the ambient light level" },
      { id: "ch7-q4", text: "What role does a transistor typically play in a circuit?", options: JSON.stringify(["A voltage source", "A fast electronic switch or signal amplifier", "A component that stores energy for long periods", "A purely passive voltage divider"]), correctAnswer: "A fast electronic switch or signal amplifier" },
    ],
  },
];

/* ═══════════ MAIN SEED FUNCTION ═══════════ */

async function main() {
  console.log("⚡ Seeding Antigravity database...\n");

  // 1. Seed demo users
  console.log("👤 Creating demo users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "student@antigravity.edu" },
    update: { name: "Demo Student", password: hashedPassword, role: "STUDENT" },
    create: { name: "Demo Student", email: "student@antigravity.edu", password: hashedPassword, role: "STUDENT" },
  });

  await prisma.user.upsert({
    where: { email: "teacher@antigravity.edu" },
    update: { name: "Demo Teacher", password: hashedPassword, role: "TEACHER" },
    create: { name: "Demo Teacher", email: "teacher@antigravity.edu", password: hashedPassword, role: "TEACHER" },
  });
  console.log("  ✅ Demo users ready");

  // 2. Seed chapters and sub-chapters
  console.log("\n📚 Seeding chapters and sub-chapters...");
  for (const ch of chaptersData) {
    const chapter = await prisma.chapter.upsert({
      where: { sortOrder: ch.sortOrder },
      update: { title: ch.title, color: ch.color, level: ch.level },
      create: { title: ch.title, sortOrder: ch.sortOrder, color: ch.color, level: ch.level },
    });

    for (const sub of ch.subChapters) {
      // Delete existing sub-chapters for this chapter to avoid duplicates
      await prisma.subChapter.deleteMany({
        where: { chapterId: chapter.id, sortOrder: sub.sortOrder },
      });

      await prisma.subChapter.create({
        data: {
          chapterId: chapter.id,
          title: sub.title,
          objective: sub.objective,
          content: sub.content,
          source: sub.source || null,
          sortOrder: sub.sortOrder,
        },
      });
    }

    console.log(`  ✅ ${ch.title} (${ch.subChapters.length} sub-chapters)`);
  }

  // 3. Seed assessments
  console.log("\n📝 Seeding assessments...");
  for (const assessment of assessments) {
    const upsertedAssessment = await prisma.assessment.upsert({
      where: { id: assessment.id },
      update: { title: assessment.title, durationMins: assessment.durationMins },
      create: { id: assessment.id, title: assessment.title, durationMins: assessment.durationMins },
    });

    for (const question of assessment.questions) {
      await prisma.question.upsert({
        where: { id: question.id },
        update: { text: question.text, options: question.options, correctAnswer: question.correctAnswer },
        create: { id: question.id, assessmentId: upsertedAssessment.id, text: question.text, options: question.options, correctAnswer: question.correctAnswer },
      });
    }

    console.log(`  ✅ ${upsertedAssessment.title} (${assessment.questions.length} questions)`);
  }

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📋 Demo accounts:");
  console.log("   Student: student@antigravity.edu / password123");
  console.log("   Teacher: teacher@antigravity.edu / password123");
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
