"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function ActiveComponents() {
  const [forwardBias, setForwardBias] = useState(true);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Diode Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">PN Junction Diode</h3>
          <button 
            onClick={() => setForwardBias(!forwardBias)}
            className={`px-6 py-2 rounded-lg font-bold transition-all border ${forwardBias ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-red-500/20 border-red-500 text-red-400'}`}
          >
            Switch to {forwardBias ? "Reverse Bias" : "Forward Bias"}
          </button>
        </div>

        <div className="relative h-64 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden p-8">
           {/* Battery Symbol Below */}
           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center text-sm font-mono text-slate-400">
              <span className={`text-xl mx-2 ${forwardBias ? 'text-red-400' : 'text-blue-400'}`}>{forwardBias ? '+' : '-'}</span>
              [ BATTERY ]
              <span className={`text-xl mx-2 ${forwardBias ? 'text-blue-400' : 'text-red-400'}`}>{forwardBias ? '-' : '+'}</span>
           </div>

           {/* The Silicon Block */}
           <div className="w-96 flex h-32 border-4 border-slate-700 relative shadow-2xl">
              {/* P-Type */}
              <div className="flex-1 bg-gradient-to-r from-red-900/40 to-red-600/30 border-r border-red-500/50 flex items-center justify-center relative overflow-hidden">
                <span className="absolute top-2 left-2 font-bold text-red-400">P-Type</span>
                {/* Holes */}
                {Array.from({length: 12}).map((_, i) => (
                  <motion.div key={`hole-${i}`} className="w-4 h-4 rounded-full border-2 border-red-400 absolute" style={{top: `${15 + ((i*17)%60)}%`, left: `${10 + ((i*23)%60)}%`}} animate={forwardBias ? {x: 30} : {x: -20}} transition={{duration: 1}}/>
                ))}
              </div>
              
              {/* Depletion Region */}
              <motion.div 
                className="h-full bg-slate-800 z-10 flex flex-col justify-center items-center overflow-hidden"
                animate={{ width: forwardBias ? "10%" : "40%" }}
                transition={{ type: "spring", stiffness: 50 }}
              >
                  <span className="text-[10px] text-slate-500 rotate-90 whitespace-nowrap">DEPLETION REGION</span>
              </motion.div>

              {/* N-Type */}
              <div className="flex-1 bg-gradient-to-l from-blue-900/40 to-blue-600/30 border-l border-blue-500/50 flex items-center justify-center relative overflow-hidden">
                <span className="absolute top-2 right-2 font-bold text-blue-400">N-Type</span>
                 {/* Electrons */}
                 {Array.from({length: 12}).map((_, i) => (
                  <motion.div key={`electron-${i}`} className="w-4 h-4 rounded-full bg-blue-400 absolute" style={{top: `${15 + ((i*13)%60)}%`, right: `${10 + ((i*19)%60)}%`}} animate={forwardBias ? {x: -30} : {x: 20}} transition={{duration: 1}}/>
                ))}
              </div>

              {/* Current Particle overlay if forward */}
              {forwardBias && Array.from({length: 5}).map((_, i) => (
                 <motion.div
                   key={`curr-${i}`}
                   className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full blur-[2px] shadow-[0_0_10px_#facc15] z-20"
                   initial={{ left: "-10%", opacity: 0 }}
                   animate={{ left: "110%", opacity: 1 }}
                   transition={{ repeat: Infinity, duration: 1, delay: i * 0.2, ease: "linear" }}
                 />
              ))}
           </div>
        </div>

        <p className="mt-6 text-slate-300">
           {forwardBias 
             ? "In Forward Bias, the positive voltage pushes holes from the P-type and electrons from the N-type towards the center. The depletion region shrinks, allowing current to flow."
             : "In Reverse Bias, the voltage pulls holes and electrons away from the junction. The depletion region dangerously widens, acting as an insulator and preventing current flow."}
        </p>

      </div>
    </div>
  );
}
