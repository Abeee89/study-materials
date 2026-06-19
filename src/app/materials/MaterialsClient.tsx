"use client";

import { BookOpen, Download, FileText, X, Battery, Zap, ZapOff, ShieldAlert, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";

type SubChapter = {
  id: string;
  title: string;
  objective: string;
  content: string;
  source: string | null;
  sortOrder: number;
};

type Chapter = {
  id: string;
  title: string;
  sortOrder: number;
  color: string;
  level: string;
  subChapters: SubChapter[];
};

const iconMap: Record<number, LucideIcon> = {
  1: Battery,
  2: ShieldAlert,
  3: Zap,
  4: FileText,
  5: ZapOff,
  6: Cpu,
  7: BookOpen,
};

const colorMap: Record<string, { bg: string; button: string; iconColor: string }> = {
  cyan: { bg: "bg-cyan-100 dark:bg-cyan-900/30 border-b border-cyan-200 dark:border-cyan-800", button: "bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-500/20", iconColor: "text-cyan-600 dark:text-cyan-400" },
  blue: { bg: "bg-blue-100 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800", button: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20", iconColor: "text-blue-600 dark:text-blue-400" },
  purple: { bg: "bg-purple-100 dark:bg-purple-900/30 border-b border-purple-200 dark:border-purple-800", button: "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20", iconColor: "text-purple-600 dark:text-purple-400" },
  pink: { bg: "bg-pink-100 dark:bg-pink-900/30 border-b border-pink-200 dark:border-pink-800", button: "bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-500/20", iconColor: "text-pink-600 dark:text-pink-400" },
  green: { bg: "bg-emerald-100 dark:bg-emerald-900/30 border-b border-emerald-200 dark:border-emerald-800", button: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20", iconColor: "text-emerald-600 dark:text-emerald-400" },
};

const levelLabels: Record<string, string> = {
  dasar: "Beginner",
  intermediate: "Intermediate",
  mastery: "Advanced",
};

export default function MaterialsClient({ chapters }: { chapters: Chapter[] }) {
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
          Select a chapter to start learning.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {chapters.map((chapter, index) => {
          const c = colorMap[chapter.color] || colorMap.blue;
          const Icon = iconMap[chapter.sortOrder] || BookOpen;
          
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
                  {chapter.subChapters.length} Materials
                </div>

                {/* Best Seller badge for mastery */}
                {chapter.level === 'mastery' && (
                   <div className="absolute top-4 right-4 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm z-10 transition-colors duration-300">
                     <span>✨</span> Advanced
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

                {/* Center Icon Cube */}
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
                    {levelLabels[chapter.level] || chapter.level}
                  </span>
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-slate-400 dark:text-slate-500 font-medium line-through text-sm transition-colors duration-300">Rp 150.000</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black text-lg tracking-tight transition-colors duration-300">FREE</span>
                  </div>
                  
                  <button className={`w-full ${c.button} font-bold py-3 rounded-xl transition-all active:scale-[0.98]`}>
                    Study Now
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
              const Icon = iconMap[chapter.sortOrder] || BookOpen;

              return (
                <motion.div
                  key="expanded-card"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="bg-white dark:bg-slate-950 w-full max-w-4xl rounded-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh] shadow-2xl dark:border dark:border-slate-800 transition-colors"
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
                     aria-label="Close chapter details"
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
                       {chapter.subChapters.map((mat, idx) => (
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
                                <p className="text-slate-700 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
                                  {mat.content}
                                </p>
                                {mat.source && (
                                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 italic transition-colors">
                                    Source: {mat.source}
                                  </p>
                                )}
                              </div>
                              <div className="shrink-0 flex flex-row md:flex-col gap-3 justify-end items-end md:items-center">
                                <button className={`${c.button} px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm w-full md:w-auto text-center`}>
                                  Read More
                                </button>
                                <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-full md:w-auto flex justify-center items-center" aria-label="Download material">
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
