"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Power, ShieldAlert, ZapOff, CheckCircle } from "lucide-react";

const APPLIANCES = [
  { name: "LED Bulb", power: 15 },
  { name: "Fan", power: 75 },
  { name: "PC", power: 450 },
  { name: "AC Unit", power: 1500 },
  { name: "Heater", power: 3000 },
];

const MCBS = [2, 6, 10, 16, 20]; // Amperes

export function CircuitSafetySim() {
  const [selectedAppliances, setSelectedAppliances] = useState<number[]>([]);
  const [mcbRating, setMcbRating] = useState<number>(6);
  const [isPoweredOn, setIsPoweredOn] = useState(false);

  const VOLTAGE = 220; // 220V standard
  const totalPower = selectedAppliances.reduce((sum, idx) => sum + APPLIANCES[idx].power, 0);
  const totalCurrent = totalPower / VOLTAGE;
  
  const isTripped = isPoweredOn && totalCurrent > mcbRating;

  const toggleAppliance = (idx: number) => {
    setIsPoweredOn(false); // Reset power on changes
    if (selectedAppliances.includes(idx)) {
      setSelectedAppliances(selectedAppliances.filter((i) => i !== idx));
    } else {
      setSelectedAppliances([...selectedAppliances, idx]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl text-white">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">Overload & Safety Simulator</h3>
        <p className="text-slate-400">Assume 220V system. I = P / V</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <h4 className="font-semibold text-slate-300 mb-3 flex items-center gap-2"><Power className="w-4 h-4"/> 1. Select Appliances to Connect </h4>
            <div className="flex flex-wrap gap-2">
              {APPLIANCES.map((app, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleAppliance(idx)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all border ${selectedAppliances.includes(idx) ? "bg-orange-500/20 border-orange-500 text-orange-300" : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"}`}
                >
                  {app.name} <span className="opacity-60">({app.power}W)</span>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between">
              <span className="text-slate-400">Total Load:</span>
              <span className="font-mono text-xl text-orange-400 font-bold">{totalPower} W</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Expected Current:</span>
              <span className="font-mono text-xl text-yellow-400 font-bold">{totalCurrent.toFixed(2)} A</span>
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <h4 className="font-semibold text-slate-300 mb-3 flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> 2. Select MCB Rating</h4>
            <div className="flex gap-2">
              {MCBS.map((m) => (
                <button
                  key={m}
                  onClick={() => { setMcbRating(m); setIsPoweredOn(false); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${mcbRating === m ? "bg-blue-500/20 border-blue-500 text-blue-300" : "bg-slate-800 border-slate-700 text-slate-500"}`}
                >
                  {m}A
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsPoweredOn(!isPoweredOn)}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg border ${isPoweredOn ? "bg-slate-700 border-slate-600 text-slate-300" : "bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white"}`}
          >
            {isPoweredOn ? "Turn SYSTEM OFF" : "Turn SYSTEM ON"}
          </button>
        </div>

        {/* Visualizer output */}
        <div className="relative bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-8 overflow-hidden min-h-[300px]">
          
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 w-[80%] max-w-[200px]">
             {/* MCB Visual Box */}
             <div className="bg-slate-800 border-2 border-slate-600 p-2 text-center rounded relative z-10">
               <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">MCB</div>
               <div className="text-2xl font-mono text-blue-400 font-bold mb-2">{mcbRating}A</div>
               
               {/* MCB Switch */}
               <motion.div 
                 className={`w-8 h-12 mx-auto rounded border-2 shadow-inner transition-colors duration-200 flex ${isPoweredOn && !isTripped ? 'bg-emerald-500/20 border-emerald-500 items-start' : isTripped ? 'bg-red-500/20 border-red-500 items-end' : 'bg-slate-700 border-slate-600 items-end'}`}
                 animate={isTripped ? { y: [0, 5, -2, 0], scale: [1, 1.1, 1] } : {}}
                 transition={{ duration: 0.3 }}
               >
                 <div className={`w-full h-1/2 rounded-sm ${isPoweredOn && !isTripped ? 'bg-emerald-400' : isTripped ? 'bg-red-500' : 'bg-slate-500'}`}></div>
               </motion.div>
             </div>
          </div>

          {/* Connection wires */}
          {!isTripped && isPoweredOn && (
            <motion.div 
              className="absolute inset-x-0 h-4 bg-yellow-400/50 blur-sm shadow-[0_0_20px_#facc15]"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* Load indicator */}
          <div className="ml-24 z-10 flex flex-col items-center gap-4">
            <AnimatePresence>
              {isPoweredOn && !isTripped && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="w-32 h-32 rounded-full border-4 border-emerald-500 bg-emerald-500/20 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.5)]"
                >
                  <CheckCircle className="w-12 h-12 text-emerald-400 mb-2"/>
                  <span className="text-emerald-300 font-bold text-sm">RUNNING</span>
                </motion.div>
              )}
              {isTripped && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, rotate: [-5, 5, -5, 5, 0] }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="w-32 h-32 rounded-full border-4 border-red-500 bg-red-500/20 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.5)]"
                >
                  <ZapOff className="w-12 h-12 text-red-400 mb-2"/>
                  <span className="text-red-300 font-bold text-sm text-center">TRIPPED!<br/>Overload</span>
                </motion.div>
              )}
              {!isPoweredOn && (
                <motion.div className="w-32 h-32 rounded-full border-4 border-slate-700 bg-slate-800/50 flex flex-col items-center justify-center">
                  <span className="text-slate-500 font-bold text-sm">OFF</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
