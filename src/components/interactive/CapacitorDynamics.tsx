"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Lightbulb, Zap, LineChart } from "lucide-react";

export function CapacitorDynamics() {
  const [capacitance, setCapacitance] = useState(100); // in microFarads (uF)
  const [resistance, setResistance] = useState(10); // in kOhms
  const [batteryVoltage, setBatteryVoltage] = useState(9); // in Volts
  const [switchState, setSwitchState] = useState<"charge" | "neutral" | "discharge">("neutral");
  const [capVoltage, setCapVoltage] = useState(0); // Current capacitor voltage
  const [timeHistory, setTimeHistory] = useState<{ time: number; voltage: number; current: number }[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);

  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const simTimeRef = useRef<number>(0);
  const initialVoltageRef = useRef<number>(0);

  // Time constant tau = R * C
  // R in kOhms, C in uF -> R * 1000 * C * 10^-6 = R * C * 10^-3 seconds
  const rOhms = resistance * 1000;
  const cFarads = capacitance * 1e-6;
  const tau = rOhms * cFarads; // in seconds

  // Handle switch state transitions
  useEffect(() => {
    initialVoltageRef.current = capVoltage;
    simTimeRef.current = 0;
  }, [switchState]);

  // Animation and physics integration loop
  useEffect(() => {
    const loop = (time: number) => {
      if (previousTimeRef.current !== null && isPlaying) {
        // Delta time in seconds
        const dt = Math.min((time - previousTimeRef.current) / 1000, 0.1);
        simTimeRef.current += dt;

        let nextVoltage = capVoltage;
        let current = 0;

        if (switchState === "charge") {
          // Vc(t) = Vb - (Vb - V0) * e^(-t/tau)
          const V0 = initialVoltageRef.current;
          nextVoltage = batteryVoltage - (batteryVoltage - V0) * Math.exp(-simTimeRef.current / tau);
          current = ((batteryVoltage - nextVoltage) / rOhms) * 1000; // in mA
        } else if (switchState === "discharge") {
          // Vc(t) = V0 * e^(-t/tau)
          const V0 = initialVoltageRef.current;
          nextVoltage = V0 * Math.exp(-simTimeRef.current / tau);
          current = -(nextVoltage / rOhms) * 1000; // in mA (negative because reverse current direction)
        } else {
          // Neutral: Open circuit, voltage holds (slight leakage for realism)
          nextVoltage = Math.max(0, capVoltage - 0.01 * dt);
          current = 0;
        }

        setCapVoltage(nextVoltage);

        // Update plot history (keep last 100 entries)
        setTimeHistory((prev) => {
          const lastEntry = prev[prev.length - 1];
          const newTime = lastEntry ? lastEntry.time + dt : 0;
          const nextHistory = [...prev, { time: newTime, voltage: nextVoltage, current }];
          if (nextHistory.length > 120) {
            nextHistory.shift();
          }
          return nextHistory;
        });
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [switchState, capVoltage, batteryVoltage, tau, rOhms, isPlaying]);

  // Publish telemetry to global AI Copilot context
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__antigravityContext = {
        chapterTitle: "Active Electronics & Optoelectronics",
        subChapterTitle: "Capacitor Dynamics",
        simulationState: {
          moduleName: "Capacitor Charge/Discharge Simulation",
          capacitance: `${capacitance} µF`,
          resistance: `${resistance} kΩ`,
          timeConstantTau: `${tau.toFixed(3)} seconds`,
          activeSwitch: switchState,
          currentVoltage: `${capVoltage.toFixed(2)} V`,
        },
      };
    }
    return () => {
      if (typeof window !== "undefined") {
        (window as any).__antigravityContext = undefined;
      }
    };
  }, [capacitance, resistance, batteryVoltage, switchState, capVoltage, tau]);

  const handleReset = () => {
    setCapVoltage(0);
    setTimeHistory([]);
    setSwitchState("neutral");
    simTimeRef.current = 0;
  };

  // SVG dimensions for chart
  const chartWidth = 500;
  const chartHeight = 150;
  const maxVoltageForPlot = batteryVoltage || 12;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Simulator Controls</h3>
              <p className="text-xs text-slate-400">Configure parameters and toggle the SPDT switch.</p>
            </div>

            {/* Slider 1: Battery Voltage */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-350">
                <span>Battery Voltage</span>
                <span className="font-mono text-cyan-400">{batteryVoltage} V</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="1"
                value={batteryVoltage}
                onChange={(e) => setBatteryVoltage(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Slider 2: Capacitance */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-350">
                <span>Capacitance (C)</span>
                <span className="font-mono text-blue-400">{capacitance} µF</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="50"
                value={capacitance}
                onChange={(e) => setCapacitance(Number(e.target.value))}
                className="w-full accent-blue-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Slider 3: Resistance */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-350">
                <span>Resistance (R)</span>
                <span className="font-mono text-purple-400">{resistance} kΩ</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={resistance}
                onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full accent-purple-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Switch Selector */}
            <div className="space-y-3">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">SPDT Switch Mode</label>
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setSwitchState("charge")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    switchState === "charge"
                      ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Charge
                </button>
                <button
                  onClick={() => setSwitchState("neutral")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    switchState === "neutral"
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Neutral
                </button>
                <button
                  onClick={() => setSwitchState("discharge")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    switchState === "discharge"
                      ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Discharge
                </button>
              </div>
            </div>

            {/* Play/Pause controls */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded-xl text-xs font-bold transition-all"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? "Pause" : "Resume"}
              </button>
              <button
                onClick={handleReset}
                className="p-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-xl transition-all"
                title="Reset simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Lab Schematic & Graph */}
          <div className="lg:col-span-8 space-y-6 flex flex-col justify-between">
            {/* Visual Circuit Schematic */}
            <div className="bg-slate-950/80 border border-slate-850 rounded-2xl p-6 relative flex flex-col items-center justify-center min-h-[220px]">
              
              {/* Battery Indicator */}
              <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                  switchState === "charge" ? "bg-cyan-500/10 border-cyan-500 text-cyan-400" : "bg-slate-900 border-slate-800 text-slate-500"
                }`}>
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Battery</span>
              </div>

              {/* SPDT Switch Core */}
              <div className="absolute left-1/3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                <div className="h-10 w-1 bg-slate-800 relative">
                  {/* Switch Lever */}
                  <motion.div
                    className="absolute top-1/2 left-0 w-8 h-1 bg-cyan-400 origin-left"
                    animate={{
                      rotate: switchState === "charge" ? -35 : switchState === "discharge" ? 35 : 0
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  />
                </div>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-2">Switch</span>
              </div>

              {/* Capacitor Component */}
              <div className="flex flex-col items-center gap-2 relative">
                <div className="flex flex-col items-center justify-center relative w-16 h-16 border-2 border-slate-800 rounded-full bg-slate-900/50 backdrop-blur">
                  
                  {/* Charge Plates */}
                  <div className="flex flex-col gap-3">
                    {/* Top Positive Plate */}
                    <div className="relative">
                      <div className="w-10 h-1 bg-slate-300 rounded" />
                      {/* Positive Signs */}
                      <AnimatePresence>
                        {capVoltage > 0.5 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex gap-1 text-[8px] text-cyan-400 font-bold"
                          >
                            <span>+</span>
                            {capVoltage > 4 && <span>+</span>}
                            {capVoltage > 8 && <span>+</span>}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Bottom Negative Plate */}
                    <div className="relative">
                      <div className="w-10 h-1 bg-slate-300 rounded" />
                      {/* Negative Signs */}
                      <AnimatePresence>
                        {capVoltage > 0.5 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 flex gap-1 text-[8px] text-red-400 font-bold"
                          >
                            <span>-</span>
                            {capVoltage > 4 && <span>-</span>}
                            {capVoltage > 8 && <span>-</span>}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Capacitor</span>
                  <span className="text-xs font-mono text-cyan-400 font-bold">{capVoltage.toFixed(2)} V</span>
                </div>
              </div>

              {/* Lightbulb (Discharge Load) */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-800 bg-slate-900 text-slate-500 relative overflow-hidden">
                    <Lightbulb className="w-5 h-5 relative z-10" />
                    {/* Glowing Aura */}
                    <div
                      className="absolute inset-0 bg-yellow-400/35 transition-opacity duration-75 blur-sm"
                      style={{ opacity: Math.max(0, Math.min(1, capVoltage / batteryVoltage)) }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lightbulb</span>
              </div>
            </div>

            {/* Real-time plotting Area */}
            <div className="bg-slate-950/80 border border-slate-850 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
                  <LineChart className="w-4 h-4 text-cyan-400" />
                  Live Oscilloscope
                </span>
                <div className="flex gap-3 text-[10px] font-bold uppercase">
                  <span className="text-cyan-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-cyan-400 inline-block" /> Voltage
                  </span>
                  <span className="text-red-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded bg-red-400 inline-block" /> Current
                  </span>
                </div>
              </div>

              <div className="relative w-full h-[150px] border border-slate-900 rounded-xl overflow-hidden bg-slate-950">
                <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[0.25, 0.5, 0.75].map((val, idx) => (
                    <line
                      key={idx}
                      x1="0"
                      y1={chartHeight * val}
                      x2={chartWidth}
                      y2={chartHeight * val}
                      stroke="#1e293b"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Voltage Line Plot */}
                  {timeHistory.length > 1 && (
                    <path
                      d={timeHistory
                        .map((entry, idx) => {
                          const x = (idx / (timeHistory.length - 1)) * chartWidth;
                          const y = chartHeight - (entry.voltage / maxVoltageForPlot) * (chartHeight - 20) - 10;
                          return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                        })
                        .join(" ")}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.5"
                    />
                  )}

                  {/* Current Line Plot */}
                  {timeHistory.length > 1 && (
                    <path
                      d={timeHistory
                        .map((entry, idx) => {
                          const x = (idx / (timeHistory.length - 1)) * chartWidth;
                          // map current to middle height
                          const currentNorm = entry.current / (12 / rOhms * 1000 || 1); // Normalize by max theoretical current
                          const y = chartHeight / 2 - currentNorm * (chartHeight / 3);
                          return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                        })
                        .join(" ")}
                      fill="none"
                      stroke="#f87171"
                      strokeWidth="1.5"
                    />
                  )}
                </svg>

                {timeHistory.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500 font-semibold italic">
                    Flick the switch to start graphing...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
