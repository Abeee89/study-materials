"use client";

import Link from "next/link";
import {
  BookOpen,
  LayoutDashboard,
  PenTool,
  Target,
  BrainCircuit,
  Zap,
  ArrowRight,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import gsap from "gsap";

/* ─── marquee formula items ─── */
const formulas = [
  { label: "Ohm's Law", formula: "V = I × R", color: "neon-text-cyan" },
  { label: "Power", formula: "P = V × I", color: "neon-text-purple" },
  { label: "Parallel R", formula: "1/Rt = Σ(1/Rn)", color: "neon-text-pink" },
  { label: "Series R", formula: "Rt = R₁ + R₂ + …", color: "neon-text-green" },
  { label: "Capacitance", formula: "C = Q / V", color: "neon-text-blue" },
  { label: "Energy", formula: "W = P × t", color: "neon-text-cyan" },
  { label: "Kirchhoff V", formula: "ΣV = 0", color: "neon-text-purple" },
  { label: "Kirchhoff I", formula: "ΣI_in = ΣI_out", color: "neon-text-pink" },
];

/* ─── feature cards ─── */
const features = [
  {
    href: "/simulation",
    title: "Simulation Hub",
    desc: "Interactive modules to visualize real electricity concepts with live circuit simulations.",
    icon: LayoutDashboard,
    neon: "blue",
  },
  {
    href: "/materials",
    title: "Learning Materials",
    desc: "5 structured chapters with theory, formulas, and downloadable PDF resources.",
    icon: BookOpen,
    neon: "green",
  },
  {
    href: "/assessment",
    title: "Assessment",
    desc: "20 timed exam questions across all chapters with instant scoring and feedback.",
    icon: PenTool,
    neon: "purple",
  },
  {
    href: "/outcomes",
    title: "Learning Outcomes",
    desc: "AI-powered analysis of your strengths and areas for improvement.",
    icon: Target,
    neon: "cyan",
  },
];

const neonColors: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  blue: {
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    glow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]",
  },
  green: {
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]",
  },
  purple: {
    text: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    glow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]",
  },
  cyan: {
    text: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    glow: "group-hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]",
  },
};

/* ─── quick formula snippets for carousel ─── */
const snippets = [
  { title: "Ohm's Law", formula: "V = I × R", desc: "Voltage equals current multiplied by resistance." },
  { title: "Parallel Resistance", formula: "1/Rt = 1/R₁ + 1/R₂", desc: "Total resistance drops in parallel circuits." },
  { title: "Power Formula", formula: "P = V × I", desc: "Power equals voltage multiplied by current." },
  { title: "Series Voltage", formula: "Vt = V₁ + V₂", desc: "Voltages add up across components in series." },
  { title: "Capacitance", formula: "C = Q / V", desc: "Charge storage capacity per unit of voltage." },
  { title: "Energy", formula: "W = P × t", desc: "Electrical energy equals power multiplied by time." },
  { title: "Kirchhoff's Voltage", formula: "ΣV = 0", desc: "The sum of voltages around a loop is zero." },
];

/* ─── component ─── */
export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef(null);
  const scoreInView = useInView(scoreRef, { once: true });
  
  const circuitPaths = useRef<SVGPathElement[]>([]);
  const nodes = useRef<SVGCircleElement[]>([]);

  /* ─── GSAP hero animations ─── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Badge entrance
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
      );

      // Heading text reveal with stagger per word
      if (headingRef.current) {
        const words = headingRef.current.querySelectorAll(".gsap-word");
        gsap.fromTo(
          words,
          { opacity: 0, y: 40, rotateX: -30 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.3,
          }
        );
      }

      // Subtext fade in
      gsap.fromTo(
        subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 1.2 }
      );

      // Neon glow pulse on heading (repeating)
      if (headingRef.current) {
        gsap.to(headingRef.current, {
          textShadow:
            "0 0 20px rgba(59,130,246,0.3), 0 0 60px rgba(6,182,212,0.2), 0 0 100px rgba(168,85,247,0.1)",
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Electrical Circuit Animation
      circuitPaths.current.forEach((path, i) => {
        if (!path) return;
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 2 + i * 0.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.3
        });
      });

      if (nodes.current.length > 0) {
        gsap.to(nodes.current, {
          scale: 1.5,
          opacity: 0.4,
          duration: 1.5,
          stagger: 0.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          transformOrigin: "center"
        });
      }

    }, heroRef);

    return () => ctx.revert();
  }, []);

  /* ─── heading words wrapped for GSAP stagger ─── */
  const headingText = "Master the Fundamentals of Electricity";
  const headingWords = headingText.split(" ");

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] overflow-x-hidden transition-colors duration-300">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-radial-hero pointer-events-none -z-10 opacity-50 dark:opacity-100 transition-opacity duration-300" />
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none -z-10 opacity-50 dark:opacity-100 transition-opacity duration-300" />

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center px-6 py-20 md:py-32 text-center max-w-5xl mx-auto"
      >
        {/* Electrical Background Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 flex items-center justify-center opacity-40 dark:opacity-50">
          <svg className="w-full h-full max-w-5xl" viewBox="0 0 1000 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path ref={el => { if (el && !circuitPaths.current.includes(el)) circuitPaths.current.push(el); }} d="M 50,200 L 250,200 L 300,100 L 450,100 L 500,200 L 650,200 L 700,300 L 850,300 L 900,200 L 950,200" stroke="url(#paint0_linear)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path ref={el => { if (el && !circuitPaths.current.includes(el)) circuitPaths.current.push(el); }} d="M 0,150 L 150,150 L 200,50 L 350,50 L 400,150 L 550,150 L 600,250 L 750,250 L 800,150 L 1000,150" stroke="url(#paint1_linear)" strokeWidth="2" strokeDasharray="6 6" />
            <path ref={el => { if (el && !circuitPaths.current.includes(el)) circuitPaths.current.push(el); }} d="M 100,250 L 300,250 L 350,350 L 500,350 L 550,250 L 750,250 L 800,100 L 950,100 L 1000,250" stroke="url(#paint2_linear)" strokeWidth="4" />
            
            <circle ref={el => { if (el && !nodes.current.includes(el)) nodes.current.push(el); }} cx="250" cy="200" r="6" fill="#3b82f6" />
            <circle ref={el => { if (el && !nodes.current.includes(el)) nodes.current.push(el); }} cx="450" cy="100" r="6" fill="#06b6d4" />
            <circle ref={el => { if (el && !nodes.current.includes(el)) nodes.current.push(el); }} cx="700" cy="300" r="6" fill="#a855f7" />
            <circle ref={el => { if (el && !nodes.current.includes(el)) nodes.current.push(el); }} cx="800" cy="100" r="6" fill="#ec4899" />
            
            <defs>
              <linearGradient id="paint0_linear" x1="50" y1="200" x2="950" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="0.5" stopColor="#06b6d4" />
                <stop offset="1" stopColor="#a855f7" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="paint1_linear" x1="0" y1="150" x2="1000" y2="150" gradientUnits="userSpaceOnUse">
                <stop stopColor="#10b981" stopOpacity="0" />
                <stop offset="0.5" stopColor="#3b82f6" />
                <stop offset="1" stopColor="#06b6d4" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="paint2_linear" x1="100" y1="250" x2="1000" y2="250" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ec4899" stopOpacity="0" />
                <stop offset="0.5" stopColor="#a855f7" />
                <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 text-sm font-medium mb-8 opacity-0 transition-colors duration-300"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          Vocational High School Platform
        </div>

        {/* Main Heading — GSAP stagger + neon glow */}
        <h1
          ref={headingRef}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight pb-2 leading-tight"
          style={{ perspective: "800px" }}
        >
          {headingWords.map((word, i) => (
            <span
              key={i}
              className="gsap-word inline-block opacity-0 mr-[0.3em] bg-gradient-to-br from-slate-900 via-blue-800 to-cyan-600 dark:from-white dark:via-blue-100 dark:to-cyan-200 bg-clip-text text-transparent"
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p
          ref={subRef}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto mt-6 opacity-0 transition-colors duration-300"
        >
          An AI-powered, highly interactive educational platform designed to make
          learning circuits and components visual and intuitive.
        </p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="flex flex-wrap gap-4 mt-10 justify-center relative z-10"
        >
          <Link
            href="/simulation"
            className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            <Zap className="w-5 h-5" />
            Start Simulating
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/materials"
            className="flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 font-semibold py-3 px-8 rounded-full transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 backdrop-blur-sm"
          >
            <BookOpen className="w-5 h-5" />
            Browse Materials
          </Link>
        </motion.div>
      </section>

      {/* ═══════════ NEON MARQUEE TICKER ═══════════ */}
      <section className="py-6 border-y border-slate-200 dark:border-slate-800/40 bg-slate-50/80 dark:bg-slate-950/80 overflow-hidden transition-colors duration-300">
        <div className="flex whitespace-nowrap">
          <div className="animate-marquee flex items-center gap-12">
            {[...formulas, ...formulas].map((f, i) => (
              <span key={i} className="flex items-center gap-3 text-sm md:text-base">
                <span className="text-slate-600 dark:text-slate-500 font-medium">{f.label}</span>
                <span className={`font-mono font-bold ${f.color}`}>{f.formula}</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURE CARDS ═══════════ */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 transition-colors duration-300">
            Explore the{" "}
            <span className="animate-neon-pulse bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Platform
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto transition-colors duration-300">
            Everything you need to master Basic Electricity, from theory to
            practice.
          </p>
        </motion.div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((item, i) => {
            const Icon = item.icon;
            const c = neonColors[item.neon];
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: "easeOut" }}
              >
                <Link href={item.href} className="block group">
                  <div
                    className={`glass-card glass-card-hover p-7 h-full transition-all duration-300 hover:-translate-y-1 ${c.glow}`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl mb-5 flex items-center justify-center ${c.bg} ${c.text} border ${c.border}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
                      {item.desc}
                    </p>
                    <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                      Explore
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═══════════ FORMULA CAROUSEL ═══════════ */}
      <section className="py-16 bg-slate-100/50 dark:bg-slate-900/50 border-t border-b border-slate-200 dark:border-slate-800/40 overflow-hidden transition-colors duration-300">
        <div className="px-6 max-w-7xl mx-auto mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3 transition-colors duration-300">
              <BookOpen className="w-6 h-6 neon-text-green" />
              Quick Formulas
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1 transition-colors duration-300">
              Swipe or scroll to review essential material snippets.
            </p>
          </motion.div>
        </div>

        <div
          className="flex overflow-x-auto snap-x snap-mandatory px-6 pb-8 gap-5 no-scrollbar"
        >
          {snippets.map((snip, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="shrink-0 w-72 glass-card p-6 snap-center shadow-xl border border-slate-200 dark:border-slate-700/50 hover:border-cyan-300 dark:hover:border-cyan-500/30 transition-colors"
            >
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-300 mb-2 transition-colors duration-300">
                {snip.title}
              </h3>
              <div className="font-mono text-xl font-bold neon-text-cyan my-4 bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg text-center border border-cyan-200 dark:border-cyan-500/20 transition-colors duration-300">
                {snip.formula}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">{snip.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════ PERFORMANCE SECTION ═══════════ */}
      <section ref={scoreRef} className="py-20 mb-16 px-6 max-w-5xl mx-auto w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-8 transition-colors duration-300"
        >
          <Target className="w-6 h-6 neon-text-purple" />
          Your Performance
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-8 md:p-12 shadow-2xl relative overflow-hidden border border-slate-200 dark:border-slate-700/30"
        >
          {/* Background Graphic */}
          <BrainCircuit className="absolute -bottom-10 -right-10 w-64 h-64 text-slate-200 dark:text-slate-800/30 pointer-events-none transition-colors duration-300" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Latest Exam
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
                Module 1: Ohm&apos;s Law
              </h3>
              <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
                You achieved an excellent score but still need practice with
                parallel circuits. Keep interacting with the Sandbox!
              </p>

              <Link
                href="/outcomes"
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium py-2.5 px-6 rounded-full transition-all duration-300 mt-4 shadow-lg shadow-blue-500/20"
              >
                Review AI Insights
              </Link>
            </div>

            {/* Animated Score Ring */}
            <div className="shrink-0 relative w-40 h-40 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="72"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-slate-200 dark:text-slate-800 transition-colors duration-300"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="72"
                  fill="transparent"
                  stroke="url(#scoreGradient)"
                  strokeWidth="10"
                  strokeDasharray="452"
                  initial={{ strokeDashoffset: 452 }}
                  animate={scoreInView ? { strokeDashoffset: 113 } : {}}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  strokeLinecap="round"
                  style={{
                    filter:
                      "drop-shadow(0 0 6px rgba(59,130,246,0.5)) drop-shadow(0 0 12px rgba(6,182,212,0.3))",
                  }}
                />
                <defs>
                  <linearGradient
                    id="scoreGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold neon-text-blue">75%</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1 transition-colors duration-300">
                  Score
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
