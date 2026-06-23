import { PrismaClient, MediaType, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── Chapter & SubChapter Content ──────────────────────────────────────────

const chapters = [
  {
    id: "ch1",
    title: "Chapter 1: Foundations of Matter & Charge",
    description: "Explore the atomic foundations of electrical phenomena — matter, elements, and free electron theory.",
    sortOrder: 1,
    colorKey: "cyan",
    level: "dasar",
    iconKey: "battery",
    subChapters: [
      {
        id: "ch1-s1",
        title: "Matter, Elements, and Molecules",
        objective: "Understand the fundamental definitions of matter, elements, and molecules.",
        contentType: MediaType.TEXT,
        contentBody: "Matter is anything that has mass and occupies space. An element is a pure substance consisting of only one type of atom, such as copper or gold. Molecules are formed when two or more atoms bond together chemically. Understanding these building blocks is essential before diving into how electrical phenomena occur at the atomic level.",
        source: "Basic Physics for Electronics",
        sortOrder: 1,
      },
      {
        id: "ch1-s2",
        title: "Atomic Structure",
        objective: "Identify the components of an atom: Protons, Neutrons, and Electrons.",
        contentType: MediaType.TEXT,
        contentBody: "Atoms consist of a central nucleus containing positively charged protons and neutral neutrons, surrounded by negatively charged electrons orbiting in various shells. In neutral atoms, the number of protons equals the number of electrons. The outermost shell, known as the valence shell, dictates the electrical and chemical properties of the atom.",
        source: "Basic Physics for Electronics",
        sortOrder: 2,
      },
      {
        id: "ch1-s3",
        title: "Free Electron Theory & Electric Charge",
        objective: "Explain how free electrons produce electric current and define Electric Charge (Q).",
        contentType: MediaType.TEXT,
        contentBody: "Electrons in the outermost shell that are loosely bound to the nucleus can easily break free; these are called free electrons. The movement of these free electrons from atom to atom creates an electric current. Electric charge (Q) is a fundamental property of matter, measured in Coulombs (C). One Coulomb is equivalent to the charge of approximately 6.242 × 10¹⁸ electrons.",
        source: "Thomas L. Floyd, 'Principles of Electric Circuits'",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "ch2",
    title: "Chapter 2: Classifications of Engineering Materials",
    description: "Understand the three categories of electrical materials: conductors, insulators, and semiconductors.",
    sortOrder: 2,
    colorKey: "blue",
    level: "dasar",
    iconKey: "shield-alert",
    subChapters: [
      {
        id: "ch2-s1",
        title: "Conductors",
        objective: "Identify materials that conduct electricity well.",
        contentType: MediaType.TEXT,
        contentBody: "Conductors are materials that allow electric current to flow easily. This is because they have many free electrons in their valence shells (typically 1 to 3 electrons). Common examples include copper, aluminum, silver, and gold. Copper is the most widely used conductor in electrical wiring due to its excellent conductivity and affordability.",
        source: "Materials Science in Electrical Engineering",
        sortOrder: 1,
      },
      {
        id: "ch2-s2",
        title: "Insulators",
        objective: "Identify materials that inhibit the flow of electricity.",
        contentType: MediaType.TEXT,
        contentBody: "Insulators are materials that resist the flow of electric current. Their valence electrons (typically 5 to 8) are tightly bound to the atomic nucleus, leaving very few free electrons available for conduction. Common examples include rubber, plastic, glass, ceramics, and PVC (Polyvinyl Chloride), which is widely used to coat electrical wires for safety.",
        source: "Materials Science in Electrical Engineering",
        sortOrder: 2,
      },
      {
        id: "ch2-s3",
        title: "Semiconductors",
        objective: "Understand materials that can act as both conductors and insulators.",
        contentType: MediaType.TEXT,
        contentBody: "Semiconductors have electrical properties between those of conductors and insulators (typically 4 valence electrons). Under certain conditions, such as changes in temperature or the addition of impurities (doping), they can conduct electricity. Silicon and germanium are the most common semiconductors and are the foundational raw materials for creating modern electronic components like diodes, transistors, and integrated circuits.",
        source: "Boylestad & Nashelsky, 'Electronic Devices and Circuit Theory'",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "ch3",
    title: "Chapter 3: Core Electrodynamic Quantities",
    description: "Master the fundamental electrical quantities: voltage, current, resistance, and power.",
    sortOrder: 3,
    colorKey: "purple",
    level: "intermediate",
    iconKey: "zap",
    subChapters: [
      {
        id: "ch3-s1",
        title: "Voltage and Potential Difference Mechanics",
        objective: "Define electric voltage and potential difference.",
        contentType: MediaType.TEXT,
        contentBody: "Electric Voltage (V), or potential difference, is the electrical pressure or force that drives free electrons to move through a conductor, measured in Volts. It represents the energy per unit charge needed to move a charge between two points. Without a potential difference, no net movement of electric charge (current) can occur.",
        source: "Thomas L. Floyd, 'Principles of Electric Circuits'",
        sortOrder: 1,
      },
      {
        id: "ch3-s2",
        title: "Current Flow Dynamics and Ampere Scales",
        objective: "Define electric current and understand Ampere scales.",
        contentType: MediaType.VIDEO,
        contentBody: "Electric Current (I) is the rate at which electric charge flows past a point in a circuit, measured in Amperes (A). One Ampere corresponds to one Coulomb of charge flowing through a cross-section of a conductor in one second. Conventional current is defined as the flow of positive charges, which is opposite to the actual physical direction of electron flow.",
        mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        source: "Thomas L. Floyd, 'Principles of Electric Circuits'",
        sortOrder: 2,
      },
      {
        id: "ch3-s3",
        title: "Impedance, Resistance, and Thermal Dissipation",
        objective: "Understand electrical resistance and thermal dissipation.",
        contentType: MediaType.TEXT,
        contentBody: "Resistance (R) is the property of a material that opposes or inhibits the flow of electric current, measured in Ohms (Ω). As electrons flow through a conductor, they collide with the atoms of the material, causing electrical energy to be dissipated as heat. This heat generation is known as thermal dissipation and is a key factor in electrical safety and efficiency.",
        source: "Fundamental Electrical Engineering",
        sortOrder: 3,
      },
      {
        id: "ch3-s4",
        title: "Electrical Joule Power and Work Equations",
        objective: "Define electrical power and work equations.",
        contentType: MediaType.TEXT,
        contentBody: "Electric Power (P) is the rate at which electrical energy is consumed or generated by a circuit component, measured in Watts (W). Joule's Law states that the power dissipated in a resistor is proportional to the square of the current passing through it: P = I²R. It can also be calculated as the product of Voltage and Current: P = V × I.",
        source: "Thomas L. Floyd, 'Principles of Electric Circuits'",
        sortOrder: 4,
      },
    ],
  },
  {
    id: "ch4",
    title: "Chapter 4: Fundamental System Laws",
    description: "Learn Ohm's Law and Joule's Power Law for multi-variable power intersections.",
    sortOrder: 4,
    colorKey: "pink",
    level: "intermediate",
    iconKey: "file-text",
    subChapters: [
      {
        id: "ch4-s1",
        title: "Mathematical Proofs of Ohm's Law (V=IR)",
        objective: "Explain the linear relationship between V, I, and R.",
        contentType: MediaType.TEXT,
        contentBody: "Ohm's Law states that Voltage (V) equals Current (I) multiplied by Resistance (R): V = I × R. This defines the fundamental linear relationship in DC circuits, showing that current is directly proportional to voltage and inversely proportional to resistance. This law forms the basis of all circuit analysis.",
        source: "Thomas L. Floyd, 'Principles of Electric Circuits'",
        sortOrder: 1,
      },
      {
        id: "ch4-s2",
        title: "Watt's Law for Multi-Variable Power Intersections",
        objective: "Use Watt's Law to calculate power in terms of voltage, current, and resistance.",
        contentType: MediaType.VIDEO,
        contentBody: "Watt's Law calculates electrical power (P) as the product of Voltage and Current: P = V × I. By integrating Ohm's Law, we can express power in multiple ways: P = I²R or P = V²/R. This helps engineers calculate power dissipation and trace load conditions across multi-variable component junctions.",
        mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        source: "Robert L. Boylestad, 'Introductory Circuit Analysis'",
        sortOrder: 2,
      },
    ],
  },
  {
    id: "ch5",
    title: "Chapter 5: Network Topology Concepts",
    description: "Analyze series, parallel, and complex compound mesh networks.",
    sortOrder: 5,
    colorKey: "green",
    level: "mastery",
    iconKey: "zap-off",
    subChapters: [
      {
        id: "ch5-s1",
        title: "Series Topologies and Loop Resistances",
        objective: "Analyze voltage and current in series configurations.",
        contentType: MediaType.TEXT,
        contentBody: "In a series circuit, there is only one path for current. Therefore, the current (I) is exactly the same at every point. However, the total voltage divides across each component (voltage divider characteristic). The total resistance is simply the sum of all individual resistances: R_total = R₁ + R₂ + R₃ + ...",
        source: "Robert L. Boylestad, 'Introductory Circuit Analysis'",
        sortOrder: 1,
      },
      {
        id: "ch5-s2",
        title: "Parallel Topologies and Kirchhoff's Current Laws",
        objective: "Analyze voltage, current, and KCL in parallel configurations.",
        contentType: MediaType.VIDEO,
        contentBody: "In a parallel circuit, there are multiple branches for current to flow. Therefore, the total current divides among the branches (current divider characteristic). However, the voltage (V) is identical across every parallel branch. Kirchhoff's Current Law (KCL) states that the total current entering a junction or node in a circuit must exactly equal the total current leaving that node: Σ I_in = Σ I_out.",
        mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        source: "Robert L. Boylestad, 'Introductory Circuit Analysis'",
        sortOrder: 2,
      },
      {
        id: "ch5-s3",
        title: "Complex Compound Mesh Networks",
        objective: "Simplify and analyze series-parallel combination circuits.",
        contentType: MediaType.TEXT,
        contentBody: "Mixed circuits contain both series and parallel sections. Analyzing them involves breaking the circuit down into simpler parts. You first identify pure series or pure parallel branches, calculate their equivalent resistances, and redraw the simplified circuit. Kirchhoff's Voltage Law (KVL) is also used to verify that the algebraic sum of voltages in any closed loop is zero.",
        source: "Robert L. Boylestad, 'Introductory Circuit Analysis'",
        sortOrder: 3,
      },
    ],
  },
  {
    id: "ch6",
    title: "Chapter 6: Practical Residential & Industrial Installations",
    description: "Study residential installation components, grounding, single-phase distribution, and PUIL standards.",
    sortOrder: 6,
    colorKey: "cyan",
    level: "mastery",
    iconKey: "cpu",
    subChapters: [
      {
        id: "ch6-s1",
        title: "Protective Elements, Circuit Breakers, and Grounding",
        objective: "Understand safety devices and grounding in electrical installations.",
        contentType: MediaType.PDF,
        contentBody: "Common protective components in household and industrial installations include switches, sockets, distribution boards, MCBs (Miniature Circuit Breakers) for overcurrent protection, grounding rods, and Earth Leakage Circuit Breakers (ELCBs) to prevent electrical fires and protect human life.",
        mediaUrl: "/documents/protective_elements_guide.pdf",
        source: "SNI 0225:2011 (PUIL 2011)",
        sortOrder: 1,
      },
      {
        id: "ch6-s2",
        title: "Single-Phase Distribution and Wire Sizing",
        objective: "Explain single-phase distribution and how to choose appropriate wire sizes based on PUIL standards.",
        contentType: MediaType.TEXT,
        contentBody: "Single-phase distribution delivers electricity via two wires (live and neutral) or three wires (live, neutral, and ground) to residential consumers. Selecting the correct wire gauge (sizing) is crucial to prevent overheating and power losses, following safety standards like PUIL. Standard symbols and Single Line Diagrams (SLD) are used to design and outline wire routing layouts.",
        source: "SNI 0225:2011 (PUIL 2011)",
        sortOrder: 2,
      },
    ],
  },
  {
    id: "ch7",
    title: "Chapter 7: Active Electronics & Optoelectronics",
    description: "Explore passive and active electronic components, diodes, transistors, and optoelectronic applications.",
    sortOrder: 7,
    colorKey: "blue",
    level: "mastery",
    iconKey: "book-open",
    subChapters: [
      {
        id: "ch7-s1",
        title: "Passive Electronic Components",
        objective: "Identify Resistors, Capacitors, and Inductors and their applications.",
        contentType: MediaType.TEXT,
        contentBody: "Passive components do not generate power or amplify signals. Resistors limit current and act as voltage dividers. Capacitors store energy in an electric field and block DC while passing AC. Inductors store energy in a magnetic field.",
        source: "Boylestad & Nashelsky, 'Electronic Devices and Circuit Theory'",
        sortOrder: 1,
      },
      {
        id: "ch7-s2",
        title: "PN-Junction Diodes and Signal Rectifiers",
        objective: "Explain how diodes function and their application in rectification.",
        contentType: MediaType.TEXT,
        contentBody: "Diodes allow current to flow in only one direction. They are heavily used as rectifiers to convert alternating current (AC) to direct current (DC), turning a fluctuating signal into a steady, constant power source.",
        source: "Boylestad & Nashelsky, 'Electronic Devices and Circuit Theory'",
        sortOrder: 2,
      },
      {
        id: "ch7-s3",
        title: "Optoelectronic Transducers, LEDs, and Photodetectors",
        objective: "Learn about light-interacting electronic components.",
        contentType: MediaType.VIDEO,
        contentBody: "Optoelectronic devices interact with light. LEDs (Light-Emitting Diodes) emit light when forward-biased. LDRs (Light-Dependent Resistors) change their resistance based on ambient light levels, acting as light sensors. Photodiodes convert light into current.",
        mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        source: "Boylestad & Nashelsky, 'Electronic Devices and Circuit Theory'",
        sortOrder: 3,
      },
      {
        id: "ch7-s4",
        title: "Simple Circuit Practice",
        objective: "Apply component knowledge to create small practical projects.",
        contentType: MediaType.TEXT,
        contentBody: "Combining these components allows for practical projects. For example, connecting an LDR to a transistor's base can create an automatic night-light circuit that turns on an LED when it gets dark. Using a transformer, diodes (bridge rectifier), and a capacitor can create a simple AC-to-DC power supply adapter.",
        source: "Practical Electronics for Inventors",
        sortOrder: 4,
      },
    ],
  },
];

// ─── Assessment Data ────────────────────────────────────────────────────────

const assessments = [
  {
    id: "ch1-assessment",
    title: "Chapter 1: Basic Concepts of Matter and Atoms",
    durationMins: 20,
    chapterOrder: 1,
    questions: [
      { id: "ch1-q1", text: "What is an element?", options: ["A pure substance consisting of only one type of atom","A mixture of different materials","A molecule with multiple atoms bonded","Anything that occupies space"], correctAnswer: "A pure substance consisting of only one type of atom" },
      { id: "ch1-q2", text: "Which of the following describes a free electron?", options: ["An electron in the innermost shell","An electron tightly bound to the nucleus","An electron in the outermost shell that can easily break free","An electron that has zero charge"], correctAnswer: "An electron in the outermost shell that can easily break free" },
      { id: "ch1-q3", text: "In a neutral atom, the number of protons is equal to:", options: ["The number of neutrons","The number of electrons","The atomic mass","The number of free electrons"], correctAnswer: "The number of electrons" },
      { id: "ch1-q4", text: "What is the standard unit of electric charge?", options: ["Volt","Ampere","Coulomb","Ohm"], correctAnswer: "Coulomb" },
    ],
  },
  {
    id: "ch2-assessment",
    title: "Chapter 2: Types of Electrical Materials",
    durationMins: 20,
    chapterOrder: 2,
    questions: [
      { id: "ch2-q1", text: "Which of these materials is an excellent conductor?", options: ["Rubber","Glass","Copper","Silicon"], correctAnswer: "Copper" },
      { id: "ch2-q2", text: "How many valence electrons do typical insulators have?", options: ["1 to 3","4","5 to 8","0"], correctAnswer: "5 to 8" },
      { id: "ch2-q3", text: "Under what conditions can semiconductors conduct electricity?", options: ["They are always perfect conductors","Only when placed in a vacuum","They can conduct when temperature changes or impurities are added","They can never conduct electricity"], correctAnswer: "They can conduct when temperature changes or impurities are added" },
      { id: "ch2-q4", text: "Which two elements are the most common semiconductors?", options: ["Copper and Aluminum","Silicon and Germanium","Gold and Silver","Carbon and Oxygen"], correctAnswer: "Silicon and Germanium" },
    ],
  },
  {
    id: "ch3-assessment",
    title: "Chapter 3: Basic Electrical Quantities and Characteristics",
    durationMins: 20,
    chapterOrder: 3,
    questions: [
      { id: "ch3-q1", text: "What is Electric Voltage (V)?", options: ["The rate of flow of electric charge","The electrical pressure or force that drives electrons","The opposition to the flow of current","The rate at which energy is consumed"], correctAnswer: "The electrical pressure or force that drives electrons" },
      { id: "ch3-q2", text: "What is the unit of Electrical Resistance (R)?", options: ["Volt","Ampere","Ohm","Watt"], correctAnswer: "Ohm" },
      { id: "ch3-q3", text: "Which statement accurately describes Direct Current (DC)?", options: ["It periodically reverses its direction","It is the standard electricity delivered by power grids","It flows continuously in one constant direction","It cannot be produced by batteries"], correctAnswer: "It flows continuously in one constant direction" },
      { id: "ch3-q4", text: "What does Electric Power (P) measure?", options: ["The potential difference in a circuit","The speed of electrons","The opposition to current flow","The rate at which electrical energy is consumed or generated"], correctAnswer: "The rate at which electrical energy is consumed or generated" },
    ],
  },
  {
    id: "ch4-assessment",
    title: "Chapter 4: Basic Laws of Electricity",
    durationMins: 20,
    chapterOrder: 4,
    questions: [
      { id: "ch4-q1", text: "According to Ohm's Law, what is the formula relating Voltage (V), Current (I), and Resistance (R)?", options: ["V = I + R","V = I × R","I = V × R","R = V × I"], correctAnswer: "V = I × R" },
      { id: "ch4-q2", text: "The Power Law (Joule's Law) states that Power (P) equals:", options: ["V / I","I / V","V × I","V × R"], correctAnswer: "V × I" },
      { id: "ch4-q3", text: "Kirchhoff's Current Law (KCL) states that at any node:", options: ["Total resistance equals zero","Voltage drops equal voltage rises","Total current entering equals total current leaving","Current is constant throughout the entire circuit"], correctAnswer: "Total current entering equals total current leaving" },
      { id: "ch4-q4", text: "Kirchhoff's Voltage Law (KVL) implies that the algebraic sum of voltages in a closed loop is:", options: ["Equal to the current","Zero","Infinite","Equal to the total resistance"], correctAnswer: "Zero" },
    ],
  },
  {
    id: "ch5-assessment",
    title: "Chapter 5: Series, Parallel, and Mixed Circuits",
    durationMins: 20,
    chapterOrder: 5,
    questions: [
      { id: "ch5-q1", text: "In a pure series circuit, which electrical quantity remains the same across all components?", options: ["Voltage","Resistance","Current","Power"], correctAnswer: "Current" },
      { id: "ch5-q2", text: "In a parallel circuit, what remains constant across all branches?", options: ["Current","Voltage","Resistance","Energy"], correctAnswer: "Voltage" },
      { id: "ch5-q3", text: "How do you calculate the total resistance of resistors connected in series?", options: ["By taking the reciprocal of their sum","By multiplying them together","By adding their individual resistance values","By subtracting the smallest from the largest"], correctAnswer: "By adding their individual resistance values" },
      { id: "ch5-q4", text: "When analyzing a mixed (series-parallel) circuit, what is the best strategy?", options: ["Add all resistances directly","Assume it is entirely a series circuit","Assume it is entirely a parallel circuit","Break it down into simpler series and parallel parts and solve step-by-step"], correctAnswer: "Break it down into simpler series and parallel parts and solve step-by-step" },
    ],
  },
  {
    id: "ch6-assessment",
    title: "Chapter 6: Basic Electrical Installation",
    durationMins: 20,
    chapterOrder: 6,
    questions: [
      { id: "ch6-q1", text: "What is the primary function of an MCB (Miniature Circuit Breaker) in a distribution board (PHB)?", options: ["To amplify voltage","To provide overcurrent protection","To reduce power consumption","To act as a light switch"], correctAnswer: "To provide overcurrent protection" },
      { id: "ch6-q2", text: "What is the difference between a Single Line Diagram (SLD) and a Wiring Diagram?", options: ["An SLD shows physical connections; a Wiring Diagram is simplified","An SLD simplifies power paths into one line; a Wiring Diagram shows actual physical wire routing","They are exactly the same thing","SLDs are only used for DC circuits"], correctAnswer: "An SLD simplifies power paths into one line; a Wiring Diagram shows actual physical wire routing" },
      { id: "ch6-q3", text: "In Indonesia, what standard governs electrical installations?", options: ["IEEE","ISO 9001","PUIL","K3"], correctAnswer: "PUIL" },
      { id: "ch6-q4", text: "What does a series switch allow you to do?", options: ["Control multiple lights with a single flip","Control multiple lights independently from one location","Adjust the brightness of a light","Increase the voltage to the load"], correctAnswer: "Control multiple lights independently from one location" },
    ],
  },
  {
    id: "ch7-assessment",
    title: "Chapter 7: Basic Electronics and Optical Applications",
    durationMins: 20,
    chapterOrder: 7,
    questions: [
      { id: "ch7-q1", text: "Which of the following is a passive electronic component?", options: ["Transistor","Diode","Resistor","Optocoupler"], correctAnswer: "Resistor" },
      { id: "ch7-q2", text: "What is a primary function of a diode?", options: ["To amplify a weak signal","To allow current to flow in only one direction (rectification)","To store electrical energy in a magnetic field","To increase resistance based on light levels"], correctAnswer: "To allow current to flow in only one direction (rectification)" },
      { id: "ch7-q3", text: "How does a Light-Dependent Resistor (LDR) work?", options: ["It emits light when current passes through it","Its resistance changes based on the ambient light level","It converts AC to DC","It transfers signals using internal light pulses"], correctAnswer: "Its resistance changes based on the ambient light level" },
      { id: "ch7-q4", text: "What role does a transistor typically play in a circuit?", options: ["A voltage source","A fast electronic switch or signal amplifier","A component that stores energy for long periods","A purely passive voltage divider"], correctAnswer: "A fast electronic switch or signal amplifier" },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting database seed...\n");

  // 1. Demo users
  const studentPw = await bcrypt.hash("student123", 10);
  const teacherPw = await bcrypt.hash("teacher123", 10);

  const student = await prisma.user.upsert({
    where: { email: "student@antigravity.edu" },
    update: {},
    create: {
      email: "student@antigravity.edu",
      name: "Demo Student",
      password: studentPw,
      role: UserRole.STUDENT,
    },
  });
  console.log(`  ✅ Student user: ${student.email}`);

  const teacher = await prisma.user.upsert({
    where: { email: "teacher@antigravity.edu" },
    update: {},
    create: {
      email: "teacher@antigravity.edu",
      name: "Demo Teacher",
      password: teacherPw,
      role: UserRole.TEACHER,
    },
  });
  console.log(`  ✅ Teacher user: ${teacher.email}`);

  // 2. Chapters & SubChapters
  console.log("\n📚 Seeding chapters...");
  for (const ch of chapters) {
    const { subChapters, ...chapterData } = ch;

    const chapter = await prisma.chapter.upsert({
      where: { sortOrder: chapterData.sortOrder },
      update: { title: chapterData.title, description: chapterData.description, colorKey: chapterData.colorKey, level: chapterData.level, iconKey: chapterData.iconKey },
      create: { id: chapterData.id, title: chapterData.title, description: chapterData.description, sortOrder: chapterData.sortOrder, colorKey: chapterData.colorKey, level: chapterData.level, iconKey: chapterData.iconKey },
    });

    // Delete subchapters not present in the new set to handle reorganizations
    const currentSubIds = subChapters.map(s => s.id);
    await prisma.subChapter.deleteMany({
      where: {
        chapterId: chapter.id,
        id: { notIn: currentSubIds }
      }
    });

    for (const sub of subChapters) {
      await prisma.subChapter.upsert({
        where: { id: sub.id },
        update: { title: sub.title, objective: sub.objective, contentBody: sub.contentBody, contentType: sub.contentType, mediaUrl: sub.mediaUrl, source: sub.source, sortOrder: sub.sortOrder },
        create: { id: sub.id, chapterId: chapter.id, title: sub.title, objective: sub.objective, contentType: sub.contentType, contentBody: sub.contentBody, mediaUrl: sub.mediaUrl, source: sub.source, sortOrder: sub.sortOrder },
      });
    }

    console.log(`  ✅ ${chapter.title} (${subChapters.length} sub-chapters)`);
  }

  // 3. Assessments
  console.log("\n📝 Seeding assessments...");
  for (const assessment of assessments) {
    const { questions, ...assessmentData } = assessment;

    const upserted = await prisma.assessment.upsert({
      where: { id: assessmentData.id },
      update: { title: assessmentData.title, durationMins: assessmentData.durationMins, chapterOrder: assessmentData.chapterOrder },
      create: { id: assessmentData.id, title: assessmentData.title, durationMins: assessmentData.durationMins, chapterOrder: assessmentData.chapterOrder },
    });

    for (const q of questions) {
      await prisma.question.upsert({
        where: { id: q.id },
        update: { text: q.text, options: JSON.stringify(q.options), correctAnswer: q.correctAnswer },
        create: { id: q.id, assessmentId: upserted.id, text: q.text, options: JSON.stringify(q.options), correctAnswer: q.correctAnswer },
      });
    }

    console.log(`  ✅ ${upserted.title} (${questions.length} questions)`);
  }

  // 4. SubChapter Quizzes
  console.log("\n⚡ Seeding subchapter quizzes...");
  const lastSubChapterIdMap: Record<number, string> = {
    1: "ch1-s3",
    2: "ch2-s3",
    3: "ch3-s4",
    4: "ch4-s2",
    5: "ch5-s3",
    6: "ch6-s2",
    7: "ch7-s4",
  };

  for (const assessment of assessments) {
    const lastSubId = lastSubChapterIdMap[assessment.chapterOrder];
    if (!lastSubId) continue;

    const quizQuestions = assessment.questions.map((q) => ({
      id: q.id,
      question: q.text,
      options: q.options,
      correct: q.correctAnswer,
    }));

    const quiz = await prisma.quiz.upsert({
      where: { subChapterId: lastSubId },
      update: {
        title: assessment.title,
        questions: quizQuestions,
      },
      create: {
        id: assessment.id.replace("-assessment", "-quiz"), // e.g. ch1-quiz
        subChapterId: lastSubId,
        title: assessment.title,
        questions: quizQuestions,
      },
    });
    console.log(`  ✅ Quiz: ${quiz.title} linked to SubChapter ${lastSubId}`);
  }

  console.log("\n🎉 Seeding complete!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
