"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const BANDS_1_2 = [
  { color: "Black", value: 0, hex: "#000000", text: "text-white" },
  { color: "Brown", value: 1, hex: "#8b4513", text: "text-white" },
  { color: "Red", value: 2, hex: "#ff0000", text: "text-white" },
  { color: "Orange", value: 3, hex: "#ffa500", text: "text-black" },
  { color: "Yellow", value: 4, hex: "#ffff00", text: "text-black" },
  { color: "Green", value: 5, hex: "#008000", text: "text-white" },
  { color: "Blue", value: 6, hex: "#0000ff", text: "text-white" },
  { color: "Violet", value: 7, hex: "#ee82ee", text: "text-black" },
  { color: "Gray", value: 8, hex: "#808080", text: "text-white" },
  { color: "White", value: 9, hex: "#ffffff", text: "text-black" },
];

const MULTIPLIERS = [
  ...BANDS_1_2.map(b => ({ ...b, mult: Math.pow(10, b.value) })),
  { color: "Gold", mult: 0.1, hex: "#ffd700", text: "text-black" },
  { color: "Silver", mult: 0.01, hex: "#c0c0c0", text: "text-black" },
];

const TOLERANCES = [
  { color: "Brown", tol: "±1%", hex: "#8b4513" },
  { color: "Red", tol: "±2%", hex: "#ff0000" },
  { color: "Green", tol: "±0.5%", hex: "#008000" },
  { color: "Blue", tol: "±0.25%", hex: "#0000ff" },
  { color: "Violet", tol: "±0.1%", hex: "#ee82ee" },
  { color: "Gray", tol: "±0.05%", hex: "#808080" },
  { color: "Gold", tol: "±5%", hex: "#ffd700" },
  { color: "Silver", tol: "±10%", hex: "#c0c0c0" },
];

export function PassiveGallery() {
  const [b1, setB1] = useState(1); // Brown
  const [b2, setB2] = useState(0); // Black
  const [mult, setMult] = useState(2); // Red (x100)
  const [tol, setTol] = useState(6); // Gold (5%)

  const resistance = (BANDS_1_2[b1].value * 10 + BANDS_1_2[b2].value) * MULTIPLIERS[mult].mult;
  
  const formatResistance = (r: number) => {
    if (r >= 1000000) return `${(r / 1000000).toFixed(1)} MΩ`;
    if (r >= 1000) return `${(r / 1000).toFixed(1)} kΩ`;
    return `${r.toFixed(1)} Ω`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center shadow-lg">
          <div className="w-24 h-24 mb-4 relative flex items-center justify-center">
             <div className="w-full h-8 bg-[#d2b48c] rounded-[4px] border-2 border-[#8b4513] relative overflow-hidden flex shadow-inner">
                <div className="absolute top-0 bottom-0 left-3 w-3 bg-[#8b4513]"></div>
                <div className="absolute top-0 bottom-0 left-7 w-3 bg-red-600"></div>
                <div className="absolute top-0 bottom-0 left-11 w-3 bg-red-600"></div>
                <div className="absolute top-0 bottom-0 right-3 w-4 bg-[#ffd700]"></div>
             </div>
             <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-500 -z-10 translate-y-[-50%] scale-x-125"></div>
          </div>
          <h4 className="text-xl font-bold text-slate-200">Resistors</h4>
          <p className="text-sm text-slate-400 text-center mt-2">Oppose current flow. Measured in Ohms (Ω).</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center shadow-lg">
          <div className="w-24 h-24 mb-4 flex items-center justify-center relative">
             <div className="w-16 h-16 bg-blue-500/20 border-4 border-blue-500 rounded-full flex items-center justify-center">
                <div className="flex gap-1 h-8">
                   <div className="w-2 bg-blue-400"></div>
                   <div className="w-2 bg-blue-400"></div>
                </div>
             </div>
          </div>
          <h4 className="text-xl font-bold text-slate-200">Capacitors</h4>
          <p className="text-sm text-slate-400 text-center mt-2">Store electrical energy in an electric field. Measured in Farads (F).</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center shadow-lg">
          <div className="w-24 h-24 mb-4 flex items-center justify-center relative">
             <div className="flex flex-col items-center">
               <motion.svg width="60" height="40" viewBox="0 0 100 50">
                  <path d="M 0 25 L 20 25 Q 30 0 40 25 Q 50 0 60 25 Q 70 0 80 25 L 100 25" fill="none" stroke="#a855f7" strokeWidth="8" strokeLinecap="round" />
               </motion.svg>
             </div>
          </div>
          <h4 className="text-xl font-bold text-slate-200">Inductors</h4>
          <p className="text-sm text-slate-400 text-center mt-2">Store electrical energy in a magnetic field. Measured in Henrys (H).</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6">4-Band Resistor Color Code Calculator</h3>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 w-full flex justify-center py-10 relative">
             <div className="absolute top-1/2 left-0 right-0 h-4 bg-slate-400 -z-10 -translate-y-1/2 rounded"></div>
             <div className="w-64 h-32 bg-[#eabe95] rounded-[2rem] border-4 border-[#b48c66] relative flex shadow-2xl overflow-hidden shadow-inner">
               <motion.div layout className="absolute top-0 bottom-0 left-[15%] w-6" style={{backgroundColor: BANDS_1_2[b1].hex}}></motion.div>
               <motion.div layout className="absolute top-0 bottom-0 left-[35%] w-5" style={{backgroundColor: BANDS_1_2[b2].hex}}></motion.div>
               <motion.div layout className="absolute top-0 bottom-0 left-[55%] w-5" style={{backgroundColor: MULTIPLIERS[mult].hex}}></motion.div>
               <motion.div layout className="absolute top-0 bottom-0 right-[10%] w-6" style={{backgroundColor: TOLERANCES[tol].hex}}></motion.div>
             </div>
          </div>

          <div className="flex-1 w-full space-y-4">
             <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
               <span className="text-slate-400">Calculated Value:</span>
               <span className="text-3xl font-mono text-emerald-400 font-bold">{formatResistance(resistance)}</span>
             </div>
             <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
               <span className="text-slate-400">Tolerance:</span>
               <span className="text-xl font-mono text-blue-400">{TOLERANCES[tol].tol}</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div>
            <label className="text-xs text-slate-400 uppercase font-bold mb-2 block">1st Band (Digit 1)</label>
            <select value={b1} onChange={e => setB1(Number(e.target.value))} className="w-full bg-slate-800 text-white rounded-lg p-2 border border-slate-700">
               {BANDS_1_2.map((b, i) => <option key={i} value={i}>{b.color}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase font-bold mb-2 block">2nd Band (Digit 2)</label>
            <select value={b2} onChange={e => setB2(Number(e.target.value))} className="w-full bg-slate-800 text-white rounded-lg p-2 border border-slate-700">
               {BANDS_1_2.map((b, i) => <option key={i} value={i}>{b.color}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase font-bold mb-2 block">Multiplier</label>
            <select value={mult} onChange={e => setMult(Number(e.target.value))} className="w-full bg-slate-800 text-white rounded-lg p-2 border border-slate-700">
               {MULTIPLIERS.map((b, i) => <option key={i} value={i}>{b.color} (x{b.mult})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase font-bold mb-2 block">Tolerance</label>
            <select value={tol} onChange={e => setTol(Number(e.target.value))} className="w-full bg-slate-800 text-white rounded-lg p-2 border border-slate-700">
               {TOLERANCES.map((t, i) => <option key={i} value={i}>{t.color} ({t.tol})</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
