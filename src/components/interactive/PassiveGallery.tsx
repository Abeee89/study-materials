"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, HelpCircle } from "lucide-react";

const BANDS_DIGIT = [
  { color: "Black", value: 0, hex: "#09090b", border: "border-slate-800", text: "text-white" },
  { color: "Brown", value: 1, hex: "#78350f", border: "border-amber-900", text: "text-white" },
  { color: "Red", value: 2, hex: "#dc2626", border: "border-red-800", text: "text-white" },
  { color: "Orange", value: 3, hex: "#ea580c", border: "border-orange-850", text: "text-white" },
  { color: "Yellow", value: 4, hex: "#eab308", border: "border-yellow-700", text: "text-black" },
  { color: "Green", value: 5, hex: "#16a34a", border: "border-green-800", text: "text-white" },
  { color: "Blue", value: 6, hex: "#2563eb", border: "border-blue-800", text: "text-white" },
  { color: "Violet", value: 7, hex: "#d946ef", border: "border-pink-800", text: "text-white" },
  { color: "Gray", value: 8, hex: "#4b5563", border: "border-gray-700", text: "text-white" },
  { color: "White", value: 9, hex: "#fafafa", border: "border-gray-300", text: "text-black" },
];

const MULTIPLIERS = [
  { color: "Black", mult: 1, hex: "#09090b", label: "1 Ω" },
  { color: "Brown", mult: 10, hex: "#78350f", label: "10 Ω" },
  { color: "Red", mult: 100, hex: "#dc2626", label: "100 Ω" },
  { color: "Orange", mult: 1000, hex: "#ea580c", label: "1 kΩ" },
  { color: "Yellow", mult: 10000, hex: "#eab308", label: "10 kΩ" },
  { color: "Green", mult: 100000, hex: "#16a34a", label: "100 kΩ" },
  { color: "Blue", mult: 1000000, hex: "#2563eb", label: "1 MΩ" },
  { color: "Violet", mult: 10000000, hex: "#d946ef", label: "10 MΩ" },
  { color: "Gold", mult: 0.1, hex: "#fbbf24", label: "0.1 Ω" },
  { color: "Silver", mult: 0.01, hex: "#9ca3af", label: "0.01 Ω" },
];

const TOLERANCES = [
  { color: "Brown", tol: "±1%", hex: "#78350f" },
  { color: "Red", tol: "±2%", hex: "#dc2626" },
  { color: "Green", tol: "±0.5%", hex: "#16a34a" },
  { color: "Blue", tol: "±0.25%", hex: "#2563eb" },
  { color: "Violet", tol: "±0.1%", hex: "#d946ef" },
  { color: "Gray", tol: "±0.05%", hex: "#4b5563" },
  { color: "Gold", tol: "±5%", hex: "#fbbf24" },
  { color: "Silver", tol: "±10%", hex: "#9ca3af" },
];

export function PassiveGallery() {
  const [numBands, setNumBands] = useState<4 | 5>(4);
  const [b1, setB1] = useState(1); // Brown (1)
  const [b2, setB2] = useState(0); // Black (0)
  const [b3, setB3] = useState(0); // Black (0) - 5-band only
  const [mult, setMult] = useState(2); // Red (x100)
  const [tol, setTol] = useState(6); // Gold (5%)
  const [showGuide, setShowGuide] = useState(false);

  // Compute Resistance
  const digitValue = numBands === 4 
    ? (BANDS_DIGIT[b1].value * 10 + BANDS_DIGIT[b2].value)
    : (BANDS_DIGIT[b1].value * 100 + BANDS_DIGIT[b2].value * 10 + BANDS_DIGIT[b3].value);

  const resistance = digitValue * MULTIPLIERS[mult].mult;

  const formatResistance = (r: number) => {
    if (r >= 1000000) return `${(r / 1000000).toFixed(r % 1000000 === 0 ? 0 : 2)} MΩ`;
    if (r >= 1000) return `${(r / 1000).toFixed(r % 1000 === 0 ? 0 : 2)} kΩ`;
    return `${r.toFixed(r % 1 === 0 ? 0 : 2)} Ω`;
  };

  // Publish to Antigravity Copilot Context
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__antigravityContext = {
        chapterTitle: "Classifications of Engineering Materials",
        subChapterTitle: "Passive Components",
        simulationState: {
          moduleName: "Resistor Color-Code Calculator",
          bandsCount: numBands,
          calculatedResistance: formatResistance(resistance),
          tolerance: TOLERANCES[tol].tol,
        },
      };
    }
    return () => {
      if (typeof window !== "undefined") {
        (window as any).__antigravityContext = undefined;
      }
    };
  }, [numBands, b1, b2, b3, mult, tol]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Component Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col items-center shadow-lg backdrop-blur-sm">
          <div className="w-20 h-20 mb-4 relative flex items-center justify-center">
            <div className="w-full h-6 bg-[#d2b48c] rounded border border-[#8b4513] relative overflow-hidden flex shadow-inner">
              <div className="absolute top-0 bottom-0 left-3 w-2.5 bg-red-650" />
              <div className="absolute top-0 bottom-0 left-7 w-2.5 bg-amber-800" />
              <div className="absolute top-0 bottom-0 left-11 w-2.5 bg-[#ea580c]" />
              <div className="absolute top-0 bottom-0 right-3 w-3 bg-[#fbbf24]" />
            </div>
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-500 -z-10 -translate-y-1/2 scale-x-125" />
          </div>
          <h4 className="text-lg font-bold text-slate-200">Resistors</h4>
          <p className="text-xs text-slate-400 text-center mt-2">Opposes the flow of electrical current. Measured in Ohms (Ω).</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col items-center shadow-lg backdrop-blur-sm">
          <div className="w-20 h-20 mb-4 flex items-center justify-center relative">
            <div className="w-14 h-14 bg-blue-500/10 border-2 border-blue-500/30 rounded-full flex items-center justify-center">
              <div className="flex gap-1.5 h-6">
                <div className="w-1.5 bg-blue-400 rounded-sm" />
                <div className="w-1.5 bg-blue-400 rounded-sm" />
              </div>
            </div>
          </div>
          <h4 className="text-lg font-bold text-slate-200">Capacitors</h4>
          <p className="text-xs text-slate-400 text-center mt-2">Stores electric potential energy in an electric field. Measured in Farads (F).</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col items-center shadow-lg backdrop-blur-sm">
          <div className="w-20 h-20 mb-4 flex items-center justify-center relative">
            <svg width="50" height="30" viewBox="0 0 100 50">
              <path d="M 0 25 L 20 25 Q 30 -5 40 25 Q 50 -5 60 25 Q 70 -5 80 25 L 100 25" fill="none" stroke="#d946ef" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-slate-200">Inductors</h4>
          <p className="text-xs text-slate-400 text-center mt-2">Stores energy in a magnetic field when current passes. Measured in Henrys (H).</p>
        </div>
      </div>

      {/* Main Resistor Calculator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            Resistor Color-Code Calculator
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="p-2 text-slate-400 hover:text-white transition-colors bg-slate-800 rounded-xl"
              title="Show Color Code Chart"
            >
              <Info className="w-4 h-4" />
            </button>
            <div className="bg-slate-850 p-1 rounded-xl border border-slate-800 flex gap-1">
              <button
                onClick={() => setNumBands(4)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  numBands === 4 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                4-Band
              </button>
              <button
                onClick={() => setNumBands(5)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  numBands === 5 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                5-Band
              </button>
            </div>
          </div>
        </div>

        {/* Visual Resistor Body */}
        <div className="bg-slate-950/80 rounded-xl p-8 border border-slate-850 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="flex-1 w-full flex justify-center py-8 relative overflow-visible">
            {/* Resistor Lead Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-500/70 -translate-y-1/2 rounded" />

            {/* Resistor Base Body */}
            <div className="w-72 h-20 bg-[#e3b88d] rounded-full border border-[#8b6b4c] relative flex items-center justify-between px-6 shadow-2xl z-10">
              
              {/* Dynamic Band Markers */}
              <div
                className="w-4 h-full transition-all duration-300 shadow-lg rounded-sm"
                style={{ backgroundColor: BANDS_DIGIT[b1].hex }}
              />
              <div
                className="w-4 h-full transition-all duration-300 shadow-lg rounded-sm"
                style={{ backgroundColor: BANDS_DIGIT[b2].hex }}
              />
              {numBands === 5 && (
                <div
                  className="w-4 h-full transition-all duration-300 shadow-lg rounded-sm"
                  style={{ backgroundColor: BANDS_DIGIT[b3].hex }}
                />
              )}
              <div
                className="w-4 h-full transition-all duration-300 shadow-lg rounded-sm"
                style={{ backgroundColor: MULTIPLIERS[mult].hex }}
              />
              <div
                className="w-4 h-full transition-all duration-300 shadow-lg rounded-sm"
                style={{ backgroundColor: TOLERANCES[tol].hex }}
              />
            </div>
          </div>

          <div className="w-full md:w-80 space-y-4">
            <div className="bg-slate-900/90 border border-slate-850 p-4 rounded-xl flex justify-between items-center shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Calculated Resistance</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">{formatResistance(resistance)}</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-850 p-4 rounded-xl flex justify-between items-center shadow-lg">
              <span className="text-xs text-slate-400 font-medium">Tolerance Range</span>
              <span className="text-lg font-bold font-mono text-blue-400">{TOLERANCES[tol].tol}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Selector Selectors Grid */}
        <div className={`grid grid-cols-2 ${numBands === 4 ? "md:grid-cols-4" : "md:grid-cols-5"} gap-4 mt-8`}>
          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">1st Band (Digit 1)</label>
            <select
              value={b1}
              onChange={(e) => setB1(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2 text-sm focus:outline-none focus:border-blue-500"
            >
              {BANDS_DIGIT.map((b, i) => (
                <option key={i} value={i}>
                  {b.color} ({b.value})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">2nd Band (Digit 2)</label>
            <select
              value={b2}
              onChange={(e) => setB2(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2 text-sm focus:outline-none focus:border-blue-500"
            >
              {BANDS_DIGIT.map((b, i) => (
                <option key={i} value={i}>
                  {b.color} ({b.value})
                </option>
              ))}
            </select>
          </div>

          {numBands === 5 && (
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">3rd Band (Digit 3)</label>
              <select
                value={b3}
                onChange={(e) => setB3(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2 text-sm focus:outline-none focus:border-blue-500"
              >
                {BANDS_DIGIT.map((b, i) => (
                  <option key={i} value={i}>
                    {b.color} ({b.value})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Multiplier</label>
            <select
              value={mult}
              onChange={(e) => setMult(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2 text-sm focus:outline-none focus:border-blue-500"
            >
              {MULTIPLIERS.map((b, i) => (
                <option key={i} value={i}>
                  {b.color} ({b.label})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Tolerance</label>
            <select
              value={tol}
              onChange={(e) => setTol(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2 text-sm focus:outline-none focus:border-blue-500"
            >
              {TOLERANCES.map((t, i) => (
                <option key={i} value={i}>
                  {t.color} ({t.tol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resistor Color Code Guide Drawer */}
        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-8 border-t border-slate-800 pt-6"
            >
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                Quick Resistor Color Guide Reference
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-slate-350 text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-400">
                      <th className="py-2 px-3">Color</th>
                      <th className="py-2 px-3 text-center">Digit</th>
                      <th className="py-2 px-3 text-center">Multiplier</th>
                      <th className="py-2 px-3 text-center">Tolerance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-850/50">
                      <td className="py-2 px-3 font-semibold text-zinc-950 bg-zinc-50 border-r border-slate-800">Black</td>
                      <td className="py-2 px-3 text-center">0</td>
                      <td className="py-2 px-3 text-center">x1</td>
                      <td className="py-2 px-3 text-center">-</td>
                    </tr>
                    <tr className="border-b border-slate-850/50">
                      <td className="py-2 px-3 font-semibold text-[#a16207]">Brown</td>
                      <td className="py-2 px-3 text-center">1</td>
                      <td className="py-2 px-3 text-center">x10</td>
                      <td className="py-2 px-3 text-center">±1%</td>
                    </tr>
                    <tr className="border-b border-slate-850/50">
                      <td className="py-2 px-3 font-semibold text-red-500">Red</td>
                      <td className="py-2 px-3 text-center">2</td>
                      <td className="py-2 px-3 text-center">x100</td>
                      <td className="py-2 px-3 text-center">±2%</td>
                    </tr>
                    <tr className="border-b border-slate-850/50">
                      <td className="py-2 px-3 font-semibold text-orange-500">Orange</td>
                      <td className="py-2 px-3 text-center">3</td>
                      <td className="py-2 px-3 text-center">x1k</td>
                      <td className="py-2 px-3 text-center">-</td>
                    </tr>
                    <tr className="border-b border-slate-850/50">
                      <td className="py-2 px-3 font-semibold text-yellow-450">Yellow</td>
                      <td className="py-2 px-3 text-center">4</td>
                      <td className="py-2 px-3 text-center">x10k</td>
                      <td className="py-2 px-3 text-center">-</td>
                    </tr>
                    <tr className="border-b border-slate-850/50">
                      <td className="py-2 px-3 font-semibold text-green-500">Green</td>
                      <td className="py-2 px-3 text-center">5</td>
                      <td className="py-2 px-3 text-center">x100k</td>
                      <td className="py-2 px-3 text-center">±0.5%</td>
                    </tr>
                    <tr className="border-b border-slate-850/50">
                      <td className="py-2 px-3 font-semibold text-blue-500">Blue</td>
                      <td className="py-2 px-3 text-center">6</td>
                      <td className="py-2 px-3 text-center">x1M</td>
                      <td className="py-2 px-3 text-center">±0.25%</td>
                    </tr>
                    <tr className="border-b border-slate-850/50">
                      <td className="py-2 px-3 font-semibold text-pink-500">Violet</td>
                      <td className="py-2 px-3 text-center">7</td>
                      <td className="py-2 px-3 text-center">x10M</td>
                      <td className="py-2 px-3 text-center">±0.1%</td>
                    </tr>
                    <tr className="border-b border-slate-850/50">
                      <td className="py-2 px-3 font-semibold text-amber-500">Gold</td>
                      <td className="py-2 px-3 text-center">-</td>
                      <td className="py-2 px-3 text-center">x0.1</td>
                      <td className="py-2 px-3 text-center">±5%</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-gray-400">Silver</td>
                      <td className="py-2 px-3 text-center">-</td>
                      <td className="py-2 px-3 text-center">x0.01</td>
                      <td className="py-2 px-3 text-center">±10%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
