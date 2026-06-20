"use client";

import { BookOpen, Download, FileText, X, Battery, Zap, ZapOff, ShieldAlert, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const chapters = [
  {
    id: "ch1",
    title: "Chapter 1: Basic Concepts of Matter and Atoms",
    color: "cyan",
    level: "dasar",
    reviews: "6661",
    icon: Battery,
    materials: [
      {
        id: 1,
        title: "Matter, Elements, and Molecules",
        objective: "Understand the fundamental definitions of matter, elements, and molecules.",
        content: "Matter is anything that has mass and occupies space. An element is a pure substance consisting of only one type of atom, such as copper or gold. Molecules are formed when two or more atoms bond together chemically. Understanding these building blocks is essential before diving into how electrical phenomena occur at the atomic level.",
        source: "Basic Physics for Electronics",
      },
      {
        id: 2,
        title: "Atomic Structure",
        objective: "Identify the components of an atom: Protons, Neutrons, and Electrons.",
        content: "Atoms consist of a central nucleus containing positively charged protons and neutral neutrons, surrounded by negatively charged electrons orbiting in various shells. In neutral atoms, the number of protons equals the number of electrons. The outermost shell, known as the valence shell, dictates the electrical and chemical properties of the atom.",
        source: "Basic Physics for Electronics",
      },
      {
        id: 3,
        title: "Free Electron Theory & Electric Charge",
        objective: "Explain how free electrons produce electric current and define Electric Charge (Q).",
        content: "Electrons in the outermost shell that are loosely bound to the nucleus can easily break free; these are called free electrons. The movement of these free electrons from atom to atom creates an electric current. Electric charge (Q) is a fundamental property of matter, measured in Coulombs (C). One Coulomb is equivalent to the charge of approximately 6.242 × 10¹⁸ electrons.",
        source: "Thomas L. Floyd, 'Principles of Electric Circuits'",
      },
    ],
  },
  {
    id: "ch2",
    title: "Chapter 2: Types of Electrical Materials",
    color: "blue",
    level: "dasar",
    reviews: "5307",
    icon: ShieldAlert,
    materials: [
      {
        id: 4,
        title: "Conductors",
        objective: "Identify materials that conduct electricity well.",
        content: "Conductors are materials that allow electric current to flow easily. This is because they have many free electrons in their valence shells (typically 1 to 3 electrons). Common examples include copper, aluminum, silver, and gold. Copper is the most widely used conductor in electrical wiring due to its excellent conductivity and affordability.",
        source: "Materials Science in Electrical Engineering",
      },
      {
        id: 5,
        title: "Insulators",
        objective: "Identify materials that inhibit the flow of electricity.",
        content: "Insulators are materials that resist the flow of electric current. Their valence electrons (typically 5 to 8) are tightly bound to the atomic nucleus, leaving very few free electrons available for conduction. Common examples include rubber, plastic, glass, ceramics, and PVC (Polyvinyl Chloride), which is widely used to coat electrical wires for safety.",
        source: "Materials Science in Electrical Engineering",
      },
      {
        id: 6,
        title: "Semiconductors",
        objective: "Understand materials that can act as both conductors and insulators.",
        content: "Semiconductors have electrical properties between those of conductors and insulators (typically 4 valence electrons). Under certain conditions, such as changes in temperature or the addition of impurities (doping), they can conduct electricity. Silicon and germanium are the most common semiconductors and are the foundational raw materials for creating modern electronic components like diodes, transistors, and integrated circuits.",
        source: "Boylestad & Nashelsky, 'Electronic Devices and Circuit Theory'",
      },
    ],
  },
  {
    id: "ch3",
    title: "Chapter 3: Basic Electrical Quantities and Characteristics",
    color: "purple",
    level: "intermediate",
    reviews: "4969",
    icon: Zap,
    materials: [
      {
        id: 7,
        title: "Voltage (V) & Current (I)",
        objective: "Define electric voltage and current.",
        content: "Electric Voltage (V), or potential difference, is the electrical pressure or force that drives free electrons to move through a conductor, measured in Volts. Electric Current (I) is the rate at which this electric charge flows past a point in a circuit over time, measured in Amperes (A). Without voltage, current cannot flow.",
        source: "Thomas L. Floyd, 'Principles of Electric Circuits'",
      },
      {
        id: 8,
        title: "Resistance (R) & Power (P)",
        objective: "Define electrical resistance and power.",
        content: "Resistance (R) is the property of a material that opposes or inhibits the flow of electric current, measured in Ohms (Ω). All materials have some resistance, except superconductors. Electric Power (P) is the rate at which electrical energy is consumed or generated by a circuit component, measured in Watts (W).",
        source: "Thomas L. Floyd, 'Principles of Electric Circuits'",
      },
      {
        id: 9,
        title: "Direct Current (DC) vs Alternating Current (AC)",
        objective: "Differentiate between DC and AC currents.",
        content: "Direct Current (DC) flows continuously in one constant direction; it is typically supplied by batteries, solar panels, and DC power supplies. Alternating Current (AC) periodically reverses its direction of flow and changes its magnitude over time, typically in a sine wave pattern. AC is the standard type of electricity delivered to homes and businesses by power grids.",
        source: "Fundamental Electrical Engineering",
      },
    ],
  },
  {
    id: "ch4",
    title: "Chapter 4: Basic Laws of Electricity",
    color: "pink",
    level: "intermediate",
    reviews: "4685",
    icon: FileText,
    materials: [
      {
        id: 10,
        title: "Ohm's Law & Power Law",
        objective: "Explain the linear relationship between V, I, R, and Power.",
        content: "Ohm's Law states that Voltage (V) equals Current (I) multiplied by Resistance (R): V = I × R. This defines the fundamental linear relationship in DC circuits. The Power Law (or Joule's Law) calculates electrical power (P) as the product of Voltage and Current: P = V × I. These two laws can be combined to find P = I²R or P = V²/R.",
        source: "Thomas L. Floyd, 'Principles of Electric Circuits'",
      },
      {
        id: 11,
        title: "Kirchhoff's Current Law (KCL)",
        objective: "Understand KCL regarding the branching of current.",
        content: "Kirchhoff's Current Law (KCL) states that the total current entering a junction or node in a circuit must exactly equal the total current leaving that node (Σ I_in = Σ I_out). This is based on the principle of conservation of electric charge, meaning charge cannot be created or destroyed at a junction.",
        source: "Robert L. Boylestad, 'Introductory Circuit Analysis'",
      },
      {
        id: 12,
        title: "Kirchhoff's Voltage Law (KVL)",
        objective: "Understand KVL regarding total voltage in a closed loop.",
        content: "Kirchhoff's Voltage Law (KVL) states that the algebraic sum of all voltages around any closed loop in a circuit must equal zero (Σ V = 0). This means that the total voltage supplied by the source must equal the sum of the voltage drops across all components in that loop, reflecting the conservation of energy.",
        source: "Robert L. Boylestad, 'Introductory Circuit Analysis'",
      },
    ],
  },
  {
    id: "ch5",
    title: "Chapter 5: Series, Parallel, and Mixed Circuits",
    color: "green",
    level: "mastery",
    reviews: "3211",
    icon: ZapOff,
    materials: [
      {
        id: 13,
        title: "Series Circuits",
        objective: "Analyze voltage and current in series configurations.",
        content: "In a series circuit, there is only one path for current. Therefore, the current (I) is exactly the same at every point. However, the total voltage divides across each component (voltage divider characteristic). The total resistance is simply the sum of all individual resistances: R_total = R₁ + R₂ + R₃ + ...",
        source: "Robert L. Boylestad, 'Introductory Circuit Analysis'",
      },
      {
        id: 14,
        title: "Parallel Circuits",
        objective: "Analyze voltage and current in parallel configurations.",
        content: "In a parallel circuit, there are multiple branches for current to flow. Therefore, the total current divides among the branches (current divider characteristic). However, the voltage (V) is identical across every parallel branch. The total equivalent resistance is calculated as: 1/R_total = 1/R₁ + 1/R₂ + 1/R₃ + ...",
        source: "Robert L. Boylestad, 'Introductory Circuit Analysis'",
      },
      {
        id: 15,
        title: "Mixed Circuits (Combination)",
        objective: "Simplify and analyze series-parallel combination circuits.",
        content: "Mixed circuits contain both series and parallel sections. Analyzing them involves breaking the circuit down into simpler parts. You first identify pure series or pure parallel branches, calculate their equivalent resistances, and redraw the simplified circuit. You repeat this process until you have a single equivalent total resistance.",
        source: "Robert L. Boylestad, 'Introductory Circuit Analysis'",
      },
    ],
  },
  {
    id: "ch6",
    title: "Chapter 6: Basic Electrical Installation",
    color: "cyan",
    level: "mastery",
    reviews: "2189",
    icon: Cpu,
    materials: [
      {
        id: 16,
        title: "Installation Components",
        objective: "Familiarize with common electrical installation components.",
        content: "Common components in household installations include switches (single switches to control one light, series switches to control multiple lights independently), sockets (receptacles for appliances), light fittings (housings for bulbs), and PHB (Perlengkapan Hubung Bagi) or distribution boards containing protection devices like MCBs (Miniature Circuit Breakers).",
        source: "SNI 0225:2011 (PUIL 2011)",
      },
      {
        id: 17,
        title: "Symbols and Diagrams",
        objective: "Read and create basic installation diagrams.",
        content: "Electrical planning uses standard symbols. A Single Line Diagram (SLD) simplifies a complex system by showing power paths using a single line, rather than showing all individual wires. A Wiring Diagram shows the actual physical connections, routing, and wire counts (Live, Neutral, Ground) between all components.",
        source: "SNI 0225:2011 (PUIL 2011)",
      },
      {
        id: 18,
        title: "K3 & PUIL Standards",
        objective: "Understand occupational safety and general installation requirements.",
        content: "K3 (Kesehatan dan Keselamatan Kerja) in electricity focuses on preventing electric shocks, burns, and electrical fires. PUIL (Persyaratan Umum Instalasi Listrik) is the Indonesian standard governing how installations must be designed, implemented, and maintained to ensure safety, reliability, and proper functionality.",
        source: "SNI 0225:2011 (PUIL 2011)",
      },
    ],
  },
  {
    id: "ch7",
    title: "Chapter 7: Basic Electronics and Optical Applications",
    color: "blue",
    level: "mastery",
    reviews: "4192",
    icon: BookOpen,
    materials: [
      {
        id: 19,
        title: "Passive Electronic Components",
        objective: "Identify Resistors, Capacitors, and Inductors and their applications.",
        content: "Passive components do not generate power or amplify signals. Resistors limit current and act as voltage dividers. Capacitors store energy in an electric field and block DC while passing AC, making them useful in filters. Inductors store energy in a magnetic field and are used in chokes, transformers, and frequency filters.",
        source: "Boylestad & Nashelsky, 'Electronic Devices and Circuit Theory'",
      },
      {
        id: 20,
        title: "Active Electronic Components",
        objective: "Understand Diodes and Transistors.",
        content: "Active components can control current flow. Diodes allow current to flow in only one direction and are heavily used as rectifiers to convert AC to DC. Transistors (like BJTs and MOSFETs) use a small input current or voltage to control a large output current, allowing them to act as fast electronic switches or signal amplifiers.",
        source: "Boylestad & Nashelsky, 'Electronic Devices and Circuit Theory'",
      },
      {
        id: 21,
        title: "Optical Electronics (Optoelectronics)",
        objective: "Learn about light-interacting electronic components.",
        content: "Optoelectronic devices interact with light. LEDs (Light-Emitting Diodes) emit light when forward-biased. LDRs (Light-Dependent Resistors) change their resistance based on ambient light levels, acting as light sensors. Photodiodes convert light into current. Optocouplers transfer electrical signals between isolated circuits using light, preventing high-voltage damage.",
        source: "Boylestad & Nashelsky, 'Electronic Devices and Circuit Theory'",
      },
      {
        id: 22,
        title: "Simple Circuit Practice",
        objective: "Apply component knowledge to create small practical projects.",
        content: "Combining these components allows for practical projects. For example, connecting an LDR to a transistor's base can create an automatic night-light circuit that turns on an LED when it gets dark. Using a transformer, diodes (bridge rectifier), and a capacitor can create a simple AC-to-DC power supply adapter.",
        source: "Practical Electronics for Inventors",
      },
    ],
  },
];

const colorMap: Record<string, { bg: string; button: string; iconColor: string }> = {
  cyan: { bg: "bg-cyan-100 dark:bg-cyan-900/30 border-b border-cyan-200 dark:border-cyan-800", button: "bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-500/20", iconColor: "text-cyan-600 dark:text-cyan-400" },
  blue: { bg: "bg-blue-100 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800", button: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20", iconColor: "text-blue-600 dark:text-blue-400" },
  purple: { bg: "bg-purple-100 dark:bg-purple-900/30 border-b border-purple-200 dark:border-purple-800", button: "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20", iconColor: "text-purple-600 dark:text-purple-400" },
  pink: { bg: "bg-pink-100 dark:bg-pink-900/30 border-b border-pink-200 dark:border-pink-800", button: "bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-500/20", iconColor: "text-pink-600 dark:text-pink-400" },
  green: { bg: "bg-emerald-100 dark:bg-emerald-900/30 border-b border-emerald-200 dark:border-emerald-800", button: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20", iconColor: "text-emerald-600 dark:text-emerald-400" },
};

export default function MaterialsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedId]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] p-6 md:p-12 lg:p-16 w-full space-y-12 max-w-7xl mx-auto transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center md:text-left"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-300">
          Learning <span className="neon-text-blue">Materials</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl transition-colors duration-300">
          Comprehensive curriculum covering Basic Electricity fundamentals.
          Select a module to start learning.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {chapters.map((chapter, index) => {
          const c = colorMap[chapter.color] || colorMap.blue;
          const Icon = chapter.icon;
          
          return (
            <motion.div
              key={chapter.id}
              onClick={() => setSelectedId(chapter.id)}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30, delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl dark:shadow-none dark:border dark:border-slate-800 dark:hover:border-slate-700 flex flex-col h-full group transition-all duration-300"
            >
              {/* Top Half */}
              <div 
                className={`relative h-48 sm:h-56 ${c.bg} flex items-center justify-center overflow-hidden transition-colors duration-500`}
              >
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 text-slate-700 dark:text-slate-200 shadow-sm z-10 transition-colors duration-300">
                  <FileText className={`w-3.5 h-3.5 ${c.iconColor}`} />
                  {chapter.materials.length} Materi
                </div>

                {/* Best Seller badge for mastery */}
                {chapter.level === 'mastery' && (
                   <div className="absolute top-4 right-4 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm z-10 transition-colors duration-300">
                     <span>✨</span> Best Seller
                   </div>
                )}
                
                {/* Left vertical text */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-slate-900/5 dark:text-white/5 font-black text-2xl tracking-[0.3em] uppercase whitespace-nowrap z-0 transition-colors duration-300">
                  {chapter.level}
                </div>
                
                {/* Right vertical text */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-slate-900/5 dark:text-white/5 font-black text-2xl tracking-[0.3em] uppercase whitespace-nowrap z-0 transition-colors duration-300">
                  {chapter.level}
                </div>

                {/* Center Icon Cube equivalent */}
                <div 
                  className="w-24 h-24 bg-white/50 dark:bg-black/20 rounded-2xl flex items-center justify-center transform rotate-12 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 z-10 backdrop-blur-sm border border-black/5 dark:border-white/10"
                >
                   <Icon className={`w-12 h-12 ${c.iconColor} -rotate-12 group-hover:-rotate-6 transition-transform duration-300`} />
                </div>
              </div>

              {/* Bottom Half */}
              <div className="p-6 flex flex-col flex-grow bg-white dark:bg-slate-900 transition-colors duration-300">
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-xl mb-4 line-clamp-2 transition-colors duration-300">
                  {chapter.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-end gap-1 h-4">
                    <div className={`w-1.5 rounded-sm ${chapter.level === 'dasar' ? 'bg-green-500 h-2' : chapter.level === 'intermediate' ? 'bg-green-500 h-3' : 'bg-green-500 h-4'}`}></div>
                    <div className={`w-1.5 rounded-sm ${chapter.level === 'dasar' ? 'bg-slate-200 dark:bg-slate-800 h-3' : 'bg-green-500 h-3'}`}></div>
                    <div className={`w-1.5 rounded-sm ${chapter.level === 'mastery' ? 'bg-green-500 h-4' : 'bg-slate-200 dark:bg-slate-800 h-4'}`}></div>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-bold capitalize transition-colors duration-300">
                    {chapter.level === 'dasar' ? 'Pemula' : chapter.level === 'intermediate' ? 'Menengah' : 'Mahir'}
                  </span>
                  <span className="text-sm text-slate-400 dark:text-slate-500 ml-1 transition-colors duration-300">({chapter.reviews} ulasan)</span>
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-slate-400 dark:text-slate-500 font-medium line-through text-sm transition-colors duration-300">Rp 150.000</span>
                    <span className="text-red-600 dark:text-rose-500 font-black text-lg tracking-tight transition-colors duration-300">GRATIS</span>
                  </div>
                  
                  <button className={`w-full ${c.button} font-bold py-3 rounded-xl transition-all active:scale-[0.98]`}>
                    Pelajari
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* EXPANDED VIEW MODAL */}
      <AnimatePresence>
        {selectedId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-md"
              onClick={() => setSelectedId(null)}
            />
            
            {chapters.filter(c => c.id === selectedId).map(chapter => {
              const c = colorMap[chapter.color] || colorMap.blue;
              const Icon = chapter.icon;

              return (
                <motion.div
                  key="expanded-card"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="bg-white dark:bg-slate-950 w-full max-w-4xl rounded-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh] shadow-2xl dark:border dark:border-slate-800"
                >
                  {/* Top Header */}
                  <div 
                    className={`h-40 sm:h-48 md:h-56 ${c.bg} relative flex items-center justify-center shrink-0 transition-colors duration-300`}
                  >
                    <div 
                      className="w-20 h-20 sm:w-24 sm:h-24 bg-white/50 dark:bg-black/20 rounded-2xl flex items-center justify-center transform rotate-12 shadow-inner border border-black/5 dark:border-white/10"
                    >
                       <Icon className={`w-10 h-10 sm:w-12 sm:h-12 ${c.iconColor} -rotate-12`} />
                    </div>
                  </div>

                  <button 
                     className="absolute top-4 right-4 bg-white/50 hover:bg-white/80 dark:bg-black/20 dark:hover:bg-black/40 text-slate-800 dark:text-white rounded-full p-2 transition-colors z-20 backdrop-blur-sm"
                     onClick={() => setSelectedId(null)}
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  {/* Content Scrollable */}
                  <div 
                    className="p-6 md:p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950 flex-grow transition-colors duration-300"
                  >
                     <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-3 transition-colors duration-300">
                       {chapter.title}
                     </h2>
                     <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-sm sm:text-base max-w-3xl transition-colors duration-300">
                       Explore the materials below to master this topic. This module covers essential theoretical concepts and practical applications required for a complete understanding of {chapter.title.split(':')[1] || chapter.title}.
                     </p>

                     <div className="space-y-4 sm:space-y-6">
                       {chapter.materials.map((mat, idx) => (
                         <motion.div 
                           initial={{ opacity: 0, x: -20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 + (idx * 0.05) }}
                           key={mat.id} 
                           className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 hover:border-blue-400 dark:hover:border-blue-500/50 hover:shadow-md transition-all group"
                         >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2 transition-colors">
                                  {mat.title}
                                </h4>
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-slate-100 dark:border-slate-700/50 mb-4 transition-colors duration-300">
                                  <div className="flex items-center gap-2 mb-2">
                                    <BookOpen className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                      Learning Objective
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed transition-colors duration-300">
                                    {mat.objective}
                                  </p>
                                </div>
                                <p className="text-slate-700 dark:text-slate-400 text-sm leading-relaxed hidden sm:block transition-colors duration-300">
                                  {mat.content.length > 150 ? `${mat.content.substring(0, 150)}...` : mat.content}
                                </p>
                              </div>
                              <div className="shrink-0 flex flex-row md:flex-col gap-3 justify-end items-end md:items-center">
                                <button className={`${c.button} px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm w-full md:w-auto text-center`}>
                                  Buka Materi
                                </button>
                                <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-full md:w-auto flex justify-center items-center">
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                         </motion.div>
                       ))}
                     </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
