"use client";

import Link from "next/link";
import { CapacitorDynamics } from "@/components/interactive/CapacitorDynamics";

export default function CapacitorModule() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] p-6 md:p-12 max-w-5xl mx-auto w-full space-y-8">
      <div>
        <Link 
          href="/simulation" 
          className="text-slate-400 hover:text-white transition-colors text-sm font-medium mb-4 inline-block"
        >
          &larr; Back to Simulation Hub
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Module 6: <span className="text-pink-500">Capacitor Dynamics</span>
        </h1>
        <p className="text-slate-400 text-base max-w-2xl">
          Understand the mathematical and physics behavior of electric potential storage. Charge a capacitor from a DC source, analyze its time constant (&tau; = RC), and watch the energy discharge through a lightbulb load in real-time.
        </p>
      </div>

      <section>
        <CapacitorDynamics />
      </section>
    </div>
  );
}
