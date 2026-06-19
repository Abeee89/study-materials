"use client";

import { Disc3 } from "lucide-react";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CapacitorModule() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] p-8 md:p-16 max-w-5xl mx-auto w-full space-y-8">
      <div>
        <Link href="/simulation" className="text-slate-400 hover:text-white transition-colors text-sm font-medium mb-4 inline-block">
           &larr; Back to Simulation Hub
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Module 6: Capacitor Dynamics</h1>
        <p className="text-slate-400 text-lg">
          Understand how electrical energy is stored dynamically in an electric field between two plates.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
         <div className="flex flex-col items-center justify-center p-12 text-center h-[400px]">
             
            <motion.div 
               animate={{ scale: [1, 1.2, 1] }} 
               transition={{ duration: 2, repeat: Infinity }}
               className="relative mb-8"
            >
               <div className="w-24 h-2 rounded-full bg-blue-500 shadow-[0_0_20px_#3b82f6] absolute top-0 left-1/2 -translate-x-1/2" />
               <div className="w-24 h-2 rounded-full bg-red-500 shadow-[0_0_20px_#ef4444] absolute top-8 left-1/2 -translate-x-1/2" />
               <Disc3 className="w-16 h-16 text-slate-600 mt-12" />
            </motion.div>

            <h3 className="text-2xl font-bold text-white mb-4">Under Construction</h3>
            <p className="text-slate-400 max-w-md">
               The interactive node-based Capacitor flow logic is currently being mapped by our engineering team. 
               Check back soon to drag and drop dielectric materials!
            </p>
         </div>
      </div>
    </div>
  );
}
