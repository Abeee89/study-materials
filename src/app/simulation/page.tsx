"use client";

import Link from "next/link";
import { Zap, ShieldAlert, Target, Activity, Settings2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const modules = [
  { id: 1, title: "Basic Units & Laws", desc: "Learn Ohm's Law with an interactive visualizer.", icon: Zap, neon: "blue" },
  { id: 2, title: "Circuit Safety Systems", desc: "Explore MCBs, fuses, and overload scenarios.", icon: ShieldAlert, neon: "red" },
  { id: 3, title: "Passive Components", desc: "Resistors, capacitors, and color code calculators.", icon: Target, neon: "green" },
  { id: 4, title: "Active Components", desc: "PN junction diodes, forward and reverse bias.", icon: Activity, neon: "purple" },
  { id: 5, title: "Circuit Sandbox", desc: "Drag and drop components to build real circuits.", icon: Settings2, neon: "amber" },
  { id: 6, title: "Capacitor Dynamics", desc: "Store energy dynamically under AC/DC contexts.", icon: Activity, neon: "pink" },
];

const colors: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  blue: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]" },
  red: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", glow: "group-hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]" },
  green: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]" },
  purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", glow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]" },
  amber: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]" },
  pink: { text: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20", glow: "group-hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]" },
};

export default function SimulationHub() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] p-6 md:p-16 max-w-7xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Simulation <span className="neon-text-blue">Hub</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Immerse yourself in interactive electrical modules. Experiment with components,
          visualize current flow, and build real circuits—all from your browser.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod, i) => {
          const Icon = mod.icon;
          const c = colors[mod.neon];
          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
            >
              <Link href={`/modules/${mod.id}`} replace className="block group">
                <div
                  className={`glass-card glass-card-hover p-6 h-full transition-all duration-300 hover:-translate-y-1 ${c.glow}`}
                >
                  <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${c.bg} ${c.text} border ${c.border}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    Module {mod.id}: {mod.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">{mod.desc}</p>
                  <div className="flex items-center gap-1 text-sm text-slate-500 group-hover:text-cyan-400 transition-colors font-medium">
                    Launch
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
